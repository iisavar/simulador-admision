/* CIDEA Jóvenes — cuentas y sincronización con el script central (Apps Script + Google Sheets).
   Lo usan el campus, las clases, la práctica, los diagnósticos, el simulador y el panel.
   Si URL está vacía, todo queda apagado y cada app funciona como siempre (solo en este dispositivo). */
(function () {
  'use strict';

  // ===== URL /exec del SCRIPT CENTRAL (cidea-central-apps-script.gs). Vacía = apagado. =====
  var URL = '';

  var CLAVE_CAMPUS = 'campus_v1';
  var SYNC_CADA = 90000;    // subir avance como mucho cada 90 s
  var LATIDO_CADA = 45000;  // «estoy aquí» cada 45 s
  var INACTIVO = 120000;    // sin tocar nada en 2 min → sin latidos

  function leer(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function escribir(k, v) { try { window.localStorage.setItem(k, v); return true; } catch (e) { return false; } }
  function campus() { try { var c = JSON.parse(leer(CLAVE_CAMPUS) || 'null'); return c && typeof c === 'object' ? c : {}; } catch (e) { return {}; } }
  function guardarCampus(c) { escribir(CLAVE_CAMPUS, JSON.stringify(c)); }

  // Huella corta para saber si un avance cambió desde la última subida (djb2).
  function huella(s) {
    var h = 5381;
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36) + ':' + s.length;
  }

  function sesion() {
    var s = campus().sesion;
    return s && s.token && s.correo ? s : null;
  }
  function guardarSesion(s) {
    var c = campus();
    if (s) c.sesion = s; else delete c.sesion;
    guardarCampus(c);
  }
  function activo() { return !!URL; }
  function conectado() { return !!(URL && sesion()); }

  function api(accion, datos) {
    if (!URL) return Promise.reject({ tipo: 'apagado' });
    var cuerpo = {};
    for (var k in (datos || {})) cuerpo[k] = datos[k];
    cuerpo.accion = accion;
    return fetch(URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(cuerpo) })
      .then(function (r) { if (!r.ok) throw { tipo: 'http', status: r.status }; return r.json(); })
      .then(function (j) {
        if (!j || j.status !== 'ok') throw { tipo: 'servidor', message: j && j.message };
        return j;
      });
  }

  // ---------- aplicar el avance de la nube en este dispositivo (al iniciar sesión) ----------
  function aplicarAvances(avances) {
    var ajustes = campus().ajustes || null;   // el tema elegido en ESTE dispositivo se respeta
    for (var clave in (avances || {})) {
      var v = avances[clave] && avances[clave].datos;
      if (!v) continue;
      try { JSON.parse(v); } catch (e) { continue; }   // solo JSON válido
      escribir(clave, v);
    }
    if (ajustes) { var c = campus(); c.ajustes = ajustes; guardarCampus(c); }
  }

  function fijarSesion(j, sync) {
    var c = campus();
    c.sesion = { token: j.token, correo: j.correo, nombre: j.nombre, sync: sync || {} };
    c.usuario = { nombre: j.nombre || (c.usuario && c.usuario.nombre) || '', correo: j.correo };
    if (!c.creado) c.creado = new Date().toISOString();
    guardarCampus(c);
  }

  // Crear cuenta: el avance que ya haya en este dispositivo SE SUBE (no se pierde nada).
  function crearCuenta(datos, claves) {
    return api('crear', datos).then(function (j) {
      fijarSesion(j, {});
      return subir(claves || CIDEA.CLAVES, true).then(function () { return j; }, function () { return j; });
    });
  }

  // Entrar: el avance guardado en la nube BAJA a este dispositivo.
  function entrar(datos) {
    return api('entrar', datos).then(function (j) {
      aplicarAvances(j.avances);
      var sync = {};
      for (var clave in (j.avances || {})) { var v = j.avances[clave] && j.avances[clave].datos; if (v) sync[clave] = huella(v); }
      fijarSesion(j, sync);
      return j;
    });
  }

  function salir() { guardarSesion(null); }

  // ---------- subir avance ----------
  function cambios(claves) {
    var s = sesion();
    if (!s) return null;
    var av = {}, hay = false;
    (claves || []).forEach(function (clave) {
      var v = leer(clave);
      if (v == null) return;
      if (clave === CLAVE_CAMPUS) {
        // El campus se sube SIN la sesión (el token no debe quedar en la hoja)
        try { var c = JSON.parse(v); delete c.sesion; v = JSON.stringify(c); } catch (e) { return; }
      }
      if ((s.sync || {})[clave] === huella(v)) return;
      av[clave] = v; hay = true;
    });
    return hay ? av : null;
  }

  function subir(claves, forzar) {
    var s = sesion();
    if (!URL || !s) return Promise.resolve(false);
    var av;
    if (forzar) {
      av = {};
      (claves || []).forEach(function (clave) {
        var v = leer(clave);
        if (v == null) return;
        if (clave === CLAVE_CAMPUS) { try { var c = JSON.parse(v); delete c.sesion; v = JSON.stringify(c); } catch (e) { return; } }
        av[clave] = v;
      });
      if (!Object.keys(av).length) return Promise.resolve(false);
    } else {
      av = cambios(claves);
      if (!av) return Promise.resolve(false);
    }
    return api('guardar', { token: s.token, avances: av }).then(function () {
      var c = campus();
      if (c.sesion) {
        c.sesion.sync = c.sesion.sync || {};
        for (var clave in av) c.sesion.sync[clave] = huella(av[clave]);
        guardarCampus(c);
      }
      return true;
    }).catch(function (err) {
      if (err && err.tipo === 'servidor' && err.message === 'token') salir();
      return false;
    });
  }

  // Al cerrar la página: sendBeacon con lo que quedó sin subir.
  function subirAlCerrar(claves) {
    var s = sesion();
    if (!URL || !s || !navigator.sendBeacon) return;
    var av = cambios(claves);
    if (!av) return;
    try {
      navigator.sendBeacon(URL, new Blob([JSON.stringify({ accion: 'guardar', token: s.token, avances: av })], { type: 'text/plain;charset=utf-8' }));
    } catch (e) { }
  }

  // ---------- latidos («En vivo» del panel) ----------
  var ultimaInteraccion = Date.now();
  ['pointerdown', 'keydown', 'touchstart', 'scroll', 'wheel'].forEach(function (ev) {
    document.addEventListener(ev, function () { ultimaInteraccion = Date.now(); }, { capture: true, passive: true });
  });

  function latir(app, dondeFn) {
    var s = sesion();
    if (!URL || !s) return;
    if (document.visibilityState && document.visibilityState !== 'visible') return;
    if (Date.now() - ultimaInteraccion > INACTIVO) return;
    var donde = '';
    try { donde = String(dondeFn ? dondeFn() : '') || ''; } catch (e) { }
    api('latido', { token: s.token, app: app, donde: donde }).catch(function (err) {
      if (err && err.tipo === 'servidor' && err.message === 'token') salir();
    });
  }

  // ---------- arranque por app ----------
  // claves: qué avance sube esta app. app/dondeFn: qué mostrar «en vivo» (opcional).
  function iniciar(opts) {
    opts = opts || {};
    var claves = opts.claves || [];
    if (!URL) return;
    if (claves.length) {
      setInterval(function () { subir(claves); }, SYNC_CADA);
      window.addEventListener('pagehide', function () { subirAlCerrar(claves); });
      document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') subirAlCerrar(claves); });
    }
    if (opts.app) {
      latir(opts.app, opts.donde);
      setInterval(function () { latir(opts.app, opts.donde); }, LATIDO_CADA);
    }
  }

  var CIDEA = {
    URL: URL,
    CLAVES: ['lds_v1', 'qm_v1', 'practica_v1', 'campus_v1', 'ultimo_diagnostico_matematicas', 'ultimo_diagnostico_quimica', 'ultimo_simulador_unemi'],
    activo: activo, conectado: conectado, sesion: sesion,
    api: api, crearCuenta: crearCuenta, entrar: entrar, salir: salir,
    subir: subir, iniciar: iniciar
  };
  window.CIDEA = CIDEA;
})();
