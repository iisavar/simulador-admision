/* Panel de seguimiento de estudiantes (solo para el tutor).
   Lee GET {URL}?accion=panel&clave=… de cada Apps Script y muestra avance, tiempos y notas.
   Modo demo: ?demo=1 (datos inventados, sin clave) · ?demo=vacio (clase sin estudiantes). */
(function () {
  'use strict';

  // ===== URLs /exec de cada clase (pega aquí la de Química cuando la publiques) =====
  var URL_LEY_DE_SIGNOS = 'https://script.google.com/macros/s/AKfycby5ZWTS6aoA85LeRhHzAaTvD8j4hCRrO9HZ99tnr1Jebfj1fNfSgdoOvSESh5jbSoh8/exec';
  var URL_QUIMICA = 'https://script.google.com/macros/s/AKfycbwe9K11ec9TxTrQiHSAPtOWbIlq_fp_3pnzM1g4aMPVz9l3-JwO2e7xGYN9QaWcYr1k/exec';

  // La URL del script CENTRAL (cuentas y «En vivo») se toma de js/cidea-sync.js: se pega una sola vez allí.
  var URL_CENTRAL = (window.CIDEA && window.CIDEA.URL) || '';

  var CLASES = [
    { id: 'vivo', nombre: 'En vivo', url: URL_CENTRAL, vivo: true },
    { id: 'ley-de-signos', nombre: 'Ley de signos', url: URL_LEY_DE_SIGNOS },
    { id: 'quimica-materia', nombre: 'Química desde cero', url: URL_QUIMICA }
  ];
  var PREF = 'panelSeg.';
  var DIA = 86400000;
  var TIEMPO_ESPERA = 30000;

  // ---------- utilidades ----------
  function $(id) { return document.getElementById(id); }
  function leer(k) { try { return window.localStorage.getItem(PREF + k); } catch (e) { return null; } }
  function guardar(k, v) {
    try {
      if (v == null) window.localStorage.removeItem(PREF + k);
      else window.localStorage.setItem(PREF + k, v);
    } catch (e) { /* almacenamiento bloqueado: seguimos sin recordar */ }
  }
  function el(tag, cls, texto) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (texto != null) n.textContent = texto;
    return n;
  }
  function icono(id) {
    var ns = 'http://www.w3.org/2000/svg';
    var s = document.createElementNS(ns, 'svg');
    s.setAttribute('aria-hidden', 'true');
    var u = document.createElementNS(ns, 'use');
    u.setAttribute('href', '#' + id);
    s.appendChild(u);
    return s;
  }
  function vaciar(n) { while (n.firstChild) n.removeChild(n.firstChild); }
  function num(v) {
    if (v === '' || v == null) return null;
    var n = Number(v);
    return isFinite(n) ? n : null;
  }
  function fecha(v) {
    if (!v) return null;
    var d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }
  var fmt1 = new Intl.NumberFormat('es-EC', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
  var fmt0 = new Intl.NumberFormat('es-EC', { maximumFractionDigits: 0 });
  function pct(a, b) { return b ? Math.round(a / b * 100) : 0; }
  function minutos(m) {
    if (m == null || !isFinite(m)) return '—';
    m = Math.round(m);
    if (m < 60) return m + ' min';
    var h = Math.floor(m / 60), r = m % 60;
    return h + ' h' + (r ? ' ' + (r < 10 ? '0' : '') + r + ' min' : '');
  }
  function mediana(arr) {
    if (!arr.length) return null;
    var a = arr.slice().sort(function (x, y) { return x - y; });
    var m = Math.floor(a.length / 2);
    return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
  }
  function promedio(arr) {
    if (!arr.length) return null;
    return arr.reduce(function (s, x) { return s + x; }, 0) / arr.length;
  }
  function hace(d, ahora) {
    if (!d) return '—';
    var s = ((ahora || Date.now()) - d.getTime()) / 1000;
    if (s < 60) return 'hace un momento';
    var m = Math.floor(s / 60);
    if (m < 60) return 'hace ' + m + ' min';
    var h = Math.floor(m / 60);
    if (h < 24) return 'hace ' + h + ' h';
    var dd = Math.floor(h / 24);
    if (dd === 1) return 'ayer';
    if (dd < 30) return 'hace ' + dd + ' días';
    return fechaCorta(d);
  }
  function fechaCorta(d) {
    return d.toLocaleDateString('es-EC', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function fechaLarga(d) {
    return d.toLocaleString('es-EC', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  }
  function horaCorta(d) {
    return d.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
  }
  function sinTildes(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }

  // ---------- estado ----------
  var params = new URLSearchParams(window.location.search);
  var demoParam = params.get('demo');
  var DEMO = demoParam != null && demoParam !== '0' && demoParam !== 'false';
  var DEMO_VACIO = demoParam === 'vacio';

  var est = {
    claseId: leer('clase') || (URL_CENTRAL ? 'vivo' : 'ley-de-signos'),
    cache: {},              // claseId → { lista, generado, cargado }
    peticion: 0,
    cargando: false,
    buscar: '',
    filtro: 'todos',
    orden: { col: 'ultima', dir: 'desc' }
  };
  if (!CLASES.some(function (c) { return c.id === est.claseId; })) est.claseId = CLASES[0].id;
  function clase() { return CLASES.filter(function (c) { return c.id === est.claseId; })[0]; }

  // ---------- normalizar datos del Apps Script ----------
  function normalizar(e) {
    var s = {
      correo: String(e.correo || '').trim(),
      nombre: String(e.nombre || '').trim(),
      registro: fecha(e.registro),
      ultima: fecha(e.ultima),
      donde: String(e.donde || '').trim(),
      avanceLaminas: Math.max(0, Math.min(100, num(e.avanceLaminas) || 0)),
      paradas: Math.max(0, num(e.paradas) || 0),
      paradasTotal: num(e.paradasTotal) || 6,
      test: e.test === 'terminado' || e.test === 'en curso' ? e.test : 'no',
      nota: num(e.nota),
      nota10: num(e.nota10),
      minLaminas: Math.max(0, num(e.minLaminas) || 0),
      minJuego: Math.max(0, num(e.minJuego) || 0),
      minTest: Math.max(0, num(e.minTest) || 0),
      minTotal: Math.max(0, num(e.minTotal) || 0),
      dispositivo: String(e.dispositivo || '')
    };
    if (!s.minTotal) s.minTotal = s.minLaminas + s.minJuego + s.minTest;
    if (s.nota10 == null && s.nota != null) s.nota10 = Math.round(s.nota * 4) / 10;
    var estados = { 'En curso': 1, 'Terminó': 1, 'Inactivo': 1 };
    if (estados[e.estado]) s.estado = e.estado;
    else if (s.test === 'terminado') s.estado = 'Terminó';
    else s.estado = s.ultima && (Date.now() - s.ultima.getTime()) > 3 * DIA ? 'Inactivo' : 'En curso';
    var juego = s.paradasTotal ? Math.min(1, s.paradas / s.paradasTotal) : 0;
    var test = s.test === 'terminado' ? 1 : s.test === 'en curso' ? 0.5 : 0;
    s.avance = Math.round(s.avanceLaminas * 0.5 + juego * 30 + test * 20);
    s.grupo = grupoDonde(s.donde);
    s.busca = sinTildes(s.nombre + ' ' + s.correo);
    return s;
  }

  // «Dónde va» agrupado por sección + capítulo/parada, con un orden que sigue el recorrido del curso.
  function grupoDonde(d) {
    if (!d || /^registrad/i.test(d)) return { txt: 'Registrado, sin empezar', orden: 10 };
    var partes = d.split('·').map(function (p) { return p.trim(); });
    var sec = sinTildes(partes[0]);
    if (/^laminas/.test(sec)) {
      for (var i = 1; i < partes.length; i++) {
        var m = partes[i].match(/^cap\.?\s*(\d+)/i);
        if (m) return { txt: 'Láminas · Cap. ' + m[1], orden: 100 + Number(m[1]) };
        if (/^inicio/i.test(partes[i])) return { txt: 'Láminas · Inicio', orden: 100 };
        if (/^cierre/i.test(partes[i])) return { txt: 'Láminas · Cierre', orden: 190 };
      }
      return { txt: 'Láminas', orden: 150 };
    }
    if (/^juego/.test(sec)) {
      var p = d.match(/parada\s*(\d+)/i);
      if (p) return { txt: 'Juego · parada ' + p[1], orden: 200 + Number(p[1]) };
      return { txt: 'Juego · sin empezar', orden: 200 };
    }
    if (/termino el juego|falta el test/.test(sinTildes(d))) return { txt: 'Terminó el juego, falta el test', orden: 290 };
    if (/^test/.test(sec)) return { txt: partes[0], orden: 300 };
    if (/termino el test/.test(sinTildes(d))) return { txt: 'Terminó el test', orden: 400 };
    return { txt: partes[0], orden: 50 };
  }

  // ---------- vistas ----------
  var VISTAS = ['v-login', 'v-noconectada', 'v-cargando', 'v-error', 'v-datos', 'v-vivo'];
  function mostrar(id) {
    VISTAS.forEach(function (v) { $(v).hidden = v !== id; });
    $('btn-salir').hidden = DEMO || !leer('clave.' + est.claseId);
    $('btn-actualizar').disabled = id === 'v-login' || id === 'v-noconectada';
  }

  function pintarSelector() {
    var cont = $('selector-clase');
    vaciar(cont);
    CLASES.forEach(function (c) {
      var b = el('button', null, c.nombre);
      b.type = 'button';
      b.setAttribute('aria-pressed', String(c.id === est.claseId));
      b.addEventListener('click', function () {
        if (c.id === est.claseId) return;
        est.claseId = c.id;
        guardar('clase', c.id);
        est.buscar = ''; est.filtro = 'todos';
        $('buscar').value = '';
        pintarSelector();
        abrirClase();
      });
      cont.appendChild(b);
    });
  }

  function pintarActualizado() {
    var c = est.cache[est.claseId];
    var t = $('actualizado');
    if (DEMO) { t.textContent = clase().nombre + ' · datos de demostración'; }
    else if (c && c.cargado) { t.textContent = clase().nombre + ' · actualizado ' + horaCorta(c.cargado) + ' (' + hace(c.cargado) + ')'; }
    else t.textContent = clase().nombre;
  }

  function abrirClase() {
    ocultarAvisoError();
    pintarActualizado();
    var c = clase();
    if (c.vivo) {
      if (DEMO) { cargarVivo(); return; }
      if (!c.url) { $('nc-clase').textContent = 'La vista «En vivo»'; mostrar('v-noconectada'); return; }
      if (!leer('clave.' + c.id)) { pedirClave(''); return; }
      if (est.cache[c.id]) { pintarVivo(); mostrar('v-vivo'); }
      cargarVivo();
      return;
    }
    if (DEMO) { cargar(); return; }
    if (!c.url) { $('nc-clase').textContent = '«' + c.nombre + '»'; mostrar('v-noconectada'); return; }
    if (!leer('clave.' + c.id)) { pedirClave(''); return; }
    if (est.cache[c.id]) { pintarDatos(); mostrar('v-datos'); }
    cargar();
  }

  function pedirClave(msg) {
    $('login-clase').textContent = '«' + clase().nombre + '»';
    $('login-error').textContent = msg || '';
    $('clave').setAttribute('aria-invalid', msg ? 'true' : 'false');
    mostrar('v-login');
    setTimeout(function () { try { $('clave').focus(); } catch (e) {} }, 30);
  }

  // ---------- carga ----------
  function cargar(claveNueva) {
    var c = clase();
    var id = ++est.peticion;
    var previo = est.cache[c.id];
    ponerCargando(true, !previo && !claveNueva);

    if (DEMO) {
      setTimeout(function () {
        if (id !== est.peticion) return;
        est.cache[c.id] = { lista: demoDatos(c.id).map(normalizar), cargado: new Date() };
        ponerCargando(false);
        pintarDatos(); mostrar('v-datos'); pintarActualizado();
      }, 350);
      return;
    }

    var clave = claveNueva || leer('clave.' + c.id) || '';
    var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    var reloj = setTimeout(function () { if (ctrl) ctrl.abort(); }, TIEMPO_ESPERA);
    var url = c.url + '?accion=panel&clave=' + encodeURIComponent(clave) + '&t=' + Date.now();

    fetch(url, ctrl ? { signal: ctrl.signal } : undefined)
      .then(function (r) {
        if (!r.ok) throw { tipo: 'http', status: r.status };
        return r.text();
      })
      .then(function (txt) {
        var j;
        try { j = JSON.parse(txt); } catch (e) { throw { tipo: 'formato' }; }
        if (j && j.status === 'error' && j.message === 'clave') throw { tipo: 'clave' };
        if (!j || j.status !== 'ok') throw { tipo: 'servidor', msg: j && j.message };
        if (!Array.isArray(j.estudiantes)) throw { tipo: 'sinpanel' };
        return j;
      })
      .then(function (j) {
        clearTimeout(reloj);
        if (id !== est.peticion) return;
        if (claveNueva) guardar('clave.' + c.id, claveNueva);
        est.cache[c.id] = { lista: j.estudiantes.map(normalizar), generado: fecha(j.generado), cargado: new Date() };
        ponerCargando(false);
        ocultarAvisoError();
        pintarDatos(); mostrar('v-datos'); pintarActualizado();
      })
      .catch(function (err) {
        clearTimeout(reloj);
        if (id !== est.peticion) return;
        ponerCargando(false);
        manejarError(err, !!claveNueva, previo);
      });
  }

  // ---------- «En vivo» (script central) ----------
  function cargarVivo(claveNueva) {
    var c = clase();
    var id = ++est.peticion;
    var previo = est.cache[c.id];
    ponerCargando(true, !previo && !claveNueva);

    if (DEMO) {
      setTimeout(function () {
        if (id !== est.peticion) return;
        est.cache[c.id] = { lista: demoVivo(), cuentas: 24, cargado: new Date() };
        ponerCargando(false);
        pintarVivo(); mostrar('v-vivo'); pintarActualizado();
      }, 350);
      return;
    }

    var clave = claveNueva || leer('clave.' + c.id) || '';
    var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    var reloj = setTimeout(function () { if (ctrl) ctrl.abort(); }, TIEMPO_ESPERA);
    var url = c.url + '?accion=vivo&clave=' + encodeURIComponent(clave) + '&t=' + Date.now();

    fetch(url, ctrl ? { signal: ctrl.signal } : undefined)
      .then(function (r) { if (!r.ok) throw { tipo: 'http', status: r.status }; return r.text(); })
      .then(function (txt) {
        var j;
        try { j = JSON.parse(txt); } catch (e) { throw { tipo: 'formato' }; }
        if (j && j.status === 'error' && j.message === 'clave') throw { tipo: 'clave' };
        if (!j || j.status !== 'ok' || !Array.isArray(j.estudiantes)) throw { tipo: 'servidor', msg: j && j.message };
        return j;
      })
      .then(function (j) {
        clearTimeout(reloj);
        if (id !== est.peticion) return;
        if (claveNueva) guardar('clave.' + c.id, claveNueva);
        est.cache[c.id] = {
          lista: j.estudiantes.map(function (e) {
            return { correo: String(e.correo || ''), nombre: String(e.nombre || ''), app: String(e.app || ''), donde: String(e.donde || ''), fecha: fecha(e.fecha) };
          }),
          cuentas: num(j.cuentas) || 0,
          cargado: new Date()
        };
        ponerCargando(false);
        $('vivo-aviso').hidden = true;
        pintarVivo(); mostrar('v-vivo'); pintarActualizado();
      })
      .catch(function (err) {
        clearTimeout(reloj);
        if (id !== est.peticion) return;
        ponerCargando(false);
        if (err && err.tipo === 'clave') {
          guardar('clave.vivo', null);
          pedirClave(claveNueva ? 'Clave incorrecta. Es la clave de tutor del script CENTRAL (verClavePanel en su hoja).' : 'La clave guardada ya no es válida. Escríbela de nuevo.');
          return;
        }
        var t = textoError(err);
        if (claveNueva) { $('login-error').textContent = t[0] + '. ' + t[1]; return; }
        if (previo) {
          pintarVivo(); mostrar('v-vivo');
          var a = $('vivo-aviso');
          vaciar(a); a.appendChild(icono('i-aviso')); a.appendChild(el('span', null, t[0] + '. Se muestra la última carga.'));
          a.hidden = false;
          return;
        }
        $('error-titulo').textContent = t[0];
        $('error-texto').textContent = t[1];
        mostrar('v-error');
      });
  }

  function pintarVivo() {
    var c = est.cache.vivo;
    if (!c) return;
    var ahora = Date.now();
    var MIN2 = 2 * 60000, HORA = 60 * 60000;
    var lista = c.lista.slice().sort(function (a, b) { return (b.fecha ? b.fecha.getTime() : 0) - (a.fecha ? a.fecha.getTime() : 0); });
    var enVivo = lista.filter(function (s) { return s.fecha && ahora - s.fecha.getTime() <= MIN2; });
    var enHora = lista.filter(function (s) { return s.fecha && ahora - s.fecha.getTime() > MIN2 && ahora - s.fecha.getTime() <= HORA; });

    var kpis = $('vivo-kpis');
    vaciar(kpis);
    [
      { lab: 'Ahora mismo', ic: 'i-vivo', cls: 'ic-curso', v: enVivo.length, sub: 'activos en los últimos 2 min' },
      { lab: 'Última hora', ic: 'i-play', cls: 'ic-todos', v: enVivo.length + enHora.length, sub: 'entraron en los últimos 60 min' },
      { lab: 'Cuentas creadas', ic: 'i-usuarios', cls: 'ic-fin', v: c.cuentas, sub: 'estudiantes con cuenta' }
    ].forEach(function (x) {
      var t = el('div', 'tarjeta kpi');
      var l = el('div', 'kpi-label');
      var i = icono(x.ic); i.setAttribute('class', x.cls);
      l.appendChild(i); l.appendChild(el('span', null, x.lab));
      t.appendChild(l);
      t.appendChild(el('div', 'kpi-valor', fmt0.format(x.v)));
      t.appendChild(el('div', 'kpi-sub', x.sub));
      kpis.appendChild(t);
    });

    var cont = $('vivo-lista');
    vaciar(cont);
    if (!lista.length) {
      cont.appendChild(el('p', 'grafico-vacio', 'Todavía nadie se ha conectado con su cuenta. Cuando un estudiante entre, aparecerá aquí al instante.'));
      return;
    }
    function bloque(titulo, filas, activo) {
      if (!filas.length) return;
      cont.appendChild(el('h4', 'vivo-titulo', titulo));
      var box = el('div', 'vivo-filas');
      filas.forEach(function (s) {
        var f = el('div', 'vivo-fila' + (activo ? ' activa' : ''));
        var pt = el('span', 'vivo-punto' + (activo ? ' late' : ''));
        pt.setAttribute('aria-hidden', 'true');
        f.appendChild(pt);
        var tx = el('div', 'vivo-txt');
        tx.appendChild(el('b', null, s.nombre || s.correo));
        tx.appendChild(el('span', null, (s.app ? s.app : '') + (s.donde ? ' · ' + s.donde : '')));
        f.appendChild(tx);
        f.appendChild(el('span', 'vivo-hace', hace(s.fecha, ahora)));
        box.appendChild(f);
      });
      cont.appendChild(box);
    }
    bloque('Ahora mismo', enVivo, true);
    bloque('En la última hora', enHora, false);
    bloque('Antes', lista.filter(function (s) { return !s.fecha || ahora - s.fecha.getTime() > HORA; }).slice(0, 30), false);
  }

  function demoVivo() {
    var ahora = Date.now();
    return [
      { nombre: 'Ana Ejemplo', correo: 'ana@ejemplo.com', app: 'Química desde cero', donde: 'Láminas · lámina 34: Número atómico Z', fecha: new Date(ahora - 20000) },
      { nombre: 'Bruno Prueba', correo: 'bruno@ejemplo.com', app: 'Ley de signos', donde: 'Examen · en curso', fecha: new Date(ahora - 50000) },
      { nombre: 'Carla Ficticia', correo: 'carla@ejemplo.com', app: 'Diagnóstico de Química', donde: 'Pregunta 31 de 60', fecha: new Date(ahora - 80000) },
      { nombre: 'Diego Demo', correo: 'diego@ejemplo.com', app: 'Práctica libre', donde: 'Practicando: El átomo y sus partículas', fecha: new Date(ahora - 12 * 60000) },
      { nombre: 'Elena Inventada', correo: 'elena@ejemplo.com', app: 'Campus', donde: 'En el campus', fecha: new Date(ahora - 40 * 60000) },
      { nombre: 'Fabián Muestra', correo: 'fabian@ejemplo.com', app: 'Ley de signos', donde: 'Juego · parada 3 de 6', fecha: new Date(ahora - 5 * 3600000) }
    ];
  }

  // La vista «En vivo» se refresca sola cada 30 s mientras la pestaña esté visible.
  setInterval(function () {
    if (est.claseId !== 'vivo' || est.cargando) return;
    if (document.visibilityState && document.visibilityState !== 'visible') return;
    if ($('v-vivo').hidden || DEMO) return;
    cargarVivo();
  }, 30000);

  function textoError(err) {
    var t = err && err.tipo;
    if (err && err.name === 'AbortError') return ['Google tardó demasiado en responder', 'Pasaron 30 segundos sin respuesta. Puede ser el internet o que la hoja tenga muchos datos. Prueba otra vez con «Actualizar».'];
    if (t === 'http') return ['La hoja respondió con un error (' + err.status + ')', 'Revisa que el Apps Script esté implementado como aplicación web con acceso «Cualquier persona».'];
    if (t === 'formato') return ['Respuesta inesperada del Apps Script', 'Google no devolvió datos del panel. Revisa que la URL /exec sea la correcta y que el Apps Script esté implementado con la última versión.'];
    if (t === 'sinpanel') return ['El Apps Script aún no tiene el panel', 'La hoja responde, pero su código es de antes del panel. Pega la versión nueva del Apps Script y vuelve a implementarlo (Implementar → Gestionar implementaciones → Nueva versión).'];
    if (t === 'servidor') return ['El Apps Script devolvió un error', (err.msg ? '«' + err.msg + '». ' : '') + 'Prueba de nuevo en un momento.'];
    if (navigator.onLine === false) return ['Sin conexión a internet', 'Este dispositivo no tiene internet. Conéctate y pulsa «Actualizar».'];
    return ['No se pudo conectar con Google', 'Revisa tu conexión a internet. Si el internet funciona, revisa que el Apps Script esté implementado con acceso «Cualquier persona».'];
  }

  function manejarError(err, desdeLogin, previo) {
    if (err && err.tipo === 'clave') {
      guardar('clave.' + est.claseId, null);
      pedirClave(desdeLogin ? 'Clave incorrecta. Revísala y vuelve a intentarlo.' : 'La clave guardada ya no es válida. Escríbela de nuevo.');
      if (desdeLogin) { try { $('clave').select(); } catch (e) {} }
      return;
    }
    var t = textoError(err);
    if (desdeLogin) {
      $('login-error').textContent = t[0] + '. ' + t[1];
      return;
    }
    if (previo) {
      // Mantener la última vista y avisar arriba.
      pintarDatos(); mostrar('v-datos');
      mostrarAvisoError(t[0] + '. ' + t[1] + ' Se muestran los datos de la última carga.');
      return;
    }
    $('error-titulo').textContent = t[0];
    $('error-texto').textContent = t[1];
    mostrar('v-error');
  }

  function mostrarAvisoError(msg) {
    var a = $('aviso-error');
    vaciar(a);
    a.appendChild(icono('i-aviso'));
    a.appendChild(el('span', null, msg));
    a.hidden = false;
  }
  function ocultarAvisoError() { $('aviso-error').hidden = true; }

  function ponerCargando(si, primeraVez) {
    est.cargando = si;
    var b = $('btn-actualizar');
    b.classList.toggle('girando', si);
    b.setAttribute('aria-busy', String(si));
    $('v-datos').classList.toggle('recargando', si);
    $('btn-entrar').disabled = si;
    $('btn-entrar').textContent = si && !$('v-login').hidden ? 'Comprobando…' : 'Ver estudiantes';
    if (si && primeraVez) mostrar('v-cargando');
  }

  // ---------- pintar datos ----------
  function pintarDatos() {
    var c = est.cache[est.claseId];
    var lista = c ? c.lista : [];
    var hay = lista.length > 0;
    $('vacio').hidden = hay;
    $('con-datos').hidden = !hay;
    $('vacio-clase').textContent = '«' + clase().nombre + '»';
    if (!hay) return;
    pintarKpis(lista);
    pintarEmbudo(lista);
    pintarTiempos(lista);
    pintarDonde(lista);
    pintarNotas(lista);
    pintarChips(lista);
    pintarTabla();
  }

  function contar(lista) {
    var r = { total: lista.length, curso: 0, fin: 0, inac: 0 };
    lista.forEach(function (s) {
      if (s.estado === 'Terminó') r.fin++;
      else if (s.estado === 'Inactivo') r.inac++;
      else r.curso++;
    });
    return r;
  }

  function pintarKpis(lista) {
    var k = contar(lista);
    var cont = $('kpis');
    vaciar(cont);
    [
      { lab: 'Registrados', ic: 'i-usuarios', cls: 'ic-todos', v: k.total, sub: 'en total' },
      { lab: 'En curso', ic: 'i-play', cls: 'ic-curso', v: k.curso, sub: pct(k.curso, k.total) + ' % · activos en los últimos 3 días' },
      { lab: 'Terminaron', ic: 'i-check', cls: 'ic-fin', v: k.fin, sub: pct(k.fin, k.total) + ' % · hicieron el test' },
      { lab: 'Inactivos', ic: 'i-pausa', cls: 'ic-inac', v: k.inac, sub: pct(k.inac, k.total) + ' % · +3 días sin entrar' }
    ].forEach(function (x) {
      var t = el('div', 'tarjeta kpi');
      var l = el('div', 'kpi-label');
      var i = icono(x.ic); i.setAttribute('class', x.cls);
      l.appendChild(i); l.appendChild(el('span', null, x.lab));
      t.appendChild(l);
      t.appendChild(el('div', 'kpi-valor', fmt0.format(x.v)));
      t.appendChild(el('div', 'kpi-sub', x.sub));
      cont.appendChild(t);
    });
  }

  // Fila de barra horizontal. segs = [{v, color, nombre}] (1 = barra simple, 2+ = apilada con hueco de 2 px).
  function filaBarra(opt) {
    var row = el('div', 'hbar-row');
    row.setAttribute('role', 'listitem');
    var lab = el('div', 'hbar-label', opt.label);
    if (opt.labelSub) lab.appendChild(el('small', null, opt.labelSub));
    row.appendChild(lab);
    var track = el('div', 'hbar-track');
    var total = opt.segs.reduce(function (s, x) { return s + x.v; }, 0);
    var ancho = opt.max ? total / opt.max * 100 : 0;
    var fill = el('div', 'hbar-fill' + (opt.segs.length === 1 ? ' solo' : ''));
    fill.style.width = (total > 0 ? Math.max(ancho, 1.2) : 0) + '%';
    if (opt.segs.length === 1) { fill.style.background = opt.segs[0].color; }
    else {
      opt.segs.forEach(function (sg) {
        if (!sg.v) return;
        var seg = el('span', 'seg');
        seg.style.flex = sg.v + ' 1 0';
        seg.style.background = sg.color;
        fill.appendChild(seg);
      });
    }
    if (total > 0) {
      fill.tabIndex = 0;
      fill.setAttribute('aria-label', opt.aria);
      ligarTip(fill, opt.tip);
    }
    track.appendChild(fill);
    if (opt.tick != null && opt.max) {
      var tk = el('span', 'tick-media');
      tk.style.left = Math.min(100, opt.tick / opt.max * 100) + '%';
      track.appendChild(tk);
    }
    row.appendChild(track);
    var val = el('div', 'hbar-val');
    val.appendChild(el('strong', null, opt.valor));
    if (opt.valorSub) val.appendChild(el('span', null, opt.valorSub));
    if (opt.valorNota) val.appendChild(el('small', null, opt.valorNota));
    row.appendChild(val);
    return row;
  }

  function pintarEmbudo(lista) {
    var n = lista.length;
    var pasos = [
      { lab: 'Registrados', v: n, color: 'var(--f1)' },
      { lab: 'Terminaron láminas', v: lista.filter(function (s) { return s.avanceLaminas >= 100; }).length, color: 'var(--f2)' },
      { lab: 'Terminaron el juego', v: lista.filter(function (s) { return s.paradasTotal > 0 && s.paradas >= s.paradasTotal; }).length, color: 'var(--f3)' },
      { lab: 'Hicieron el test', v: lista.filter(function (s) { return s.test === 'terminado'; }).length, color: 'var(--f4)' }
    ];
    var cont = $('g-embudo');
    vaciar(cont);
    var box = el('div', 'hbar');
    box.setAttribute('role', 'list');
    pasos.forEach(function (p, i) {
      var ant = i > 0 ? pasos[i - 1].v : null;
      var dePrev = i > 0 ? (ant ? pct(p.v, ant) + ' % del paso anterior' : '—') : null;
      box.appendChild(filaBarra({
        label: p.lab,
        segs: [{ v: p.v, color: p.color }],
        max: n,
        valor: fmt0.format(p.v),
        valorSub: pct(p.v, n) + ' %',
        valorNota: dePrev,
        aria: p.lab + ': ' + p.v + ' de ' + n + ' (' + pct(p.v, n) + ' %)',
        tip: [String(p.v) + ' estudiantes', p.lab, pct(p.v, n) + ' % de los registrados' + (dePrev ? ' · ' + dePrev : '')]
      }));
    });
    cont.appendChild(box);
  }

  function pintarTiempos(lista) {
    var secciones = [
      { lab: 'Láminas', k: 'minLaminas' },
      { lab: 'Juego', k: 'minJuego' },
      { lab: 'Test', k: 'minTest' }
    ].map(function (s) {
      var vals = lista.map(function (x) { return x[s.k]; }).filter(function (v) { return v > 0; });
      return { lab: s.lab, n: vals.length, med: mediana(vals), prom: promedio(vals) };
    });
    var totVals = lista.map(function (x) { return x.minTotal; }).filter(function (v) { return v > 0; });
    var tot = { n: totVals.length, med: mediana(totVals), prom: promedio(totVals) };

    var cont = $('g-tiempos');
    vaciar(cont);
    if (!tot.n) { cont.appendChild(el('p', 'grafico-vacio', 'Todavía no hay tiempos registrados.')); return; }

    var ley = el('div', 'leyenda');
    var l1 = el('span'); var sw = el('i', 'sw'); sw.style.background = 'var(--s1)'; l1.appendChild(sw); l1.appendChild(document.createTextNode('Mediana (el estudiante típico)'));
    var l2 = el('span'); l2.appendChild(el('i', 'sw-tick')); l2.appendChild(document.createTextNode('Promedio'));
    ley.appendChild(l1); ley.appendChild(l2);
    cont.appendChild(ley);

    var max = 0;
    secciones.forEach(function (s) { max = Math.max(max, s.med || 0, s.prom || 0); });
    max = max * 1.05 || 1;
    var box = el('div', 'hbar');
    box.setAttribute('role', 'list');
    secciones.forEach(function (s) {
      box.appendChild(filaBarra({
        label: s.lab,
        labelSub: s.n + (s.n === 1 ? ' estudiante' : ' estudiantes'),
        segs: [{ v: s.med || 0, color: 'var(--s1)' }],
        tick: s.n ? s.prom : null,
        max: max,
        valor: s.n ? minutos(s.med) : '—',
        valorNota: s.n ? 'prom. ' + minutos(s.prom) : 'sin datos',
        aria: s.lab + ': mediana ' + minutos(s.med) + ', promedio ' + minutos(s.prom) + ', ' + s.n + ' estudiantes',
        tip: [minutos(s.med) + ' de mediana', s.lab, 'Promedio ' + minutos(s.prom) + ' · ' + s.n + ' estudiantes']
      }));
    });
    cont.appendChild(box);

    var tt = el('div', 'tiempo-total');
    tt.appendChild(el('div', 'tt-label', 'Tiempo total activo (mediana)'));
    tt.appendChild(el('div', 'tt-valor', minutos(tot.med)));
    tt.appendChild(el('div', 'tt-sub', 'Promedio ' + minutos(tot.prom) + ' · ' + tot.n + ' estudiantes con actividad'));
    cont.appendChild(tt);
  }

  function pintarDonde(lista) {
    var pendientes = lista.filter(function (s) { return s.test !== 'terminado'; });
    var cont = $('g-donde');
    vaciar(cont);
    $('donde-sub').textContent = 'Los ' + pendientes.length + ' estudiantes que aún no terminan el test, según dónde van.';
    if (!pendientes.length) {
      $('donde-sub').textContent = 'Estudiantes que aún no terminan el test, según dónde van.';
      cont.appendChild(el('p', 'grafico-vacio', '¡Todos los registrados ya terminaron el test!'));
      return;
    }
    var grupos = {};
    pendientes.forEach(function (s) {
      var g = grupos[s.grupo.txt] || (grupos[s.grupo.txt] = { txt: s.grupo.txt, orden: s.grupo.orden, curso: 0, inac: 0 });
      if (s.estado === 'Inactivo') g.inac++; else g.curso++;
    });
    var arr = Object.keys(grupos).map(function (k) { return grupos[k]; })
      .sort(function (a, b) { return a.orden - b.orden || a.txt.localeCompare(b.txt, 'es'); });
    var max = 0;
    arr.forEach(function (g) { max = Math.max(max, g.curso + g.inac); });

    var ley = el('div', 'leyenda');
    [['var(--s1)', 'En curso'], ['var(--s2)', 'Inactivo (+3 días)']].forEach(function (x) {
      var s = el('span'); var sw = el('i', 'sw'); sw.style.background = x[0];
      s.appendChild(sw); s.appendChild(document.createTextNode(x[1])); ley.appendChild(s);
    });
    cont.appendChild(ley);

    var box = el('div', 'hbar');
    box.setAttribute('role', 'list');
    arr.forEach(function (g) {
      var t = g.curso + g.inac;
      box.appendChild(filaBarra({
        label: g.txt,
        segs: [{ v: g.curso, color: 'var(--s1)' }, { v: g.inac, color: 'var(--s2)' }],
        max: max,
        valor: String(t),
        valorSub: pct(t, pendientes.length) + ' %',
        valorNota: g.inac ? g.inac + ' inactivo' + (g.inac === 1 ? '' : 's') : null,
        aria: g.txt + ': ' + t + ' estudiantes, ' + g.curso + ' en curso y ' + g.inac + ' inactivos',
        tip: [t + (t === 1 ? ' estudiante' : ' estudiantes'), g.txt, { color: 'var(--s1)', txt: g.curso + ' en curso' }, { color: 'var(--s2)', txt: g.inac + ' inactivos' }]
      }));
    });
    cont.appendChild(box);
  }

  function pintarNotas(lista) {
    var hechos = lista.filter(function (s) { return s.test === 'terminado' && s.nota != null; });
    var cont = $('g-notas');
    vaciar(cont);
    if (!hechos.length) { cont.appendChild(el('p', 'grafico-vacio', 'Aún nadie ha terminado el test.')); return; }
    var notas = hechos.map(function (s) { return s.nota; });
    var notas10 = hechos.map(function (s) { return s.nota10 != null ? s.nota10 : s.nota * 0.4; });
    var prom = promedio(notas), med = mediana(notas), prom10 = promedio(notas10);
    var aprob = hechos.filter(function (s) { return s.nota >= 17.5; }).length; // 7/10

    var res = el('div', 'notas-resumen');
    [['Promedio', fmt1.format(prom) + ' /25'], ['Sobre 10', fmt1.format(prom10)], ['Mediana', fmt1.format(med) + ' /25'], ['Rindieron', String(hechos.length)]]
      .forEach(function (x) { var d = el('div', null, x[0]); d.insertBefore(el('strong', null, x[1]), d.firstChild); res.appendChild(d); });
    cont.appendChild(res);

    var bins = [[0, 4], [5, 9], [10, 14], [15, 19], [20, 25]].map(function (b) {
      return { a: b[0], b: b[1], n: notas.filter(function (x) { return x >= b[0] && (b[1] === 25 ? x <= 25 : x < b[1] + 1); }).length };
    });
    var maxN = Math.max.apply(null, bins.map(function (b) { return b.n; })) || 1;
    var cols = el('div', 'cols');
    cols.setAttribute('role', 'list');
    cols.setAttribute('aria-label', 'Distribución de notas');
    bins.forEach(function (b) {
      var col = el('div', 'col');
      col.setAttribute('role', 'listitem');
      var hit = el('div', 'col-hit');
      var rango = b.a + '–' + b.b;
      hit.appendChild(el('span', 'col-val', String(b.n)));
      var bar = el('span', 'col-bar');
      bar.style.height = 'calc(' + (b.n / maxN) + ' * (100% - 22px))';
      hit.appendChild(bar);
      hit.tabIndex = 0;
      hit.setAttribute('aria-label', 'Notas de ' + rango + ': ' + b.n + ' estudiantes');
      ligarTip(hit, [b.n + (b.n === 1 ? ' estudiante' : ' estudiantes'), 'Nota de ' + rango + ' /25', pct(b.n, hechos.length) + ' % de quienes rindieron']);
      col.appendChild(hit);
      cols.appendChild(col);
    });
    cont.appendChild(cols);
    var xs = el('div', 'cols-x');
    xs.setAttribute('aria-hidden', 'true');
    bins.forEach(function (b) { xs.appendChild(el('span', null, b.a + '–' + b.b)); });
    cont.appendChild(xs);
    var pie = el('p', 'grafico-sub', aprob + ' de ' + hechos.length + ' (' + pct(aprob, hechos.length) + ' %) sacaron 7/10 o más.');
    pie.style.marginTop = '10px';
    cont.appendChild(pie);
  }

  // ---------- tabla ----------
  var COLS = [
    { k: 'nombre', t: 'Estudiante', dir: 'asc' },
    { k: 'estado', t: 'Estado', dir: 'asc' },
    { k: 'donde', t: 'Dónde va', dir: 'asc' },
    { k: 'avance', t: 'Avance', dir: 'desc' },
    { k: 'tiempo', t: 'Tiempo activo', dir: 'desc' },
    { k: 'nota', t: 'Nota', dir: 'desc' },
    { k: 'ultima', t: 'Última actividad', dir: 'desc' }
  ];
  var ORDEN_ESTADO = { 'En curso': 0, 'Inactivo': 1, 'Terminó': 2 };

  function comparar(a, b, col) {
    switch (col) {
      case 'nombre': return (a.nombre || a.correo).localeCompare(b.nombre || b.correo, 'es', { sensitivity: 'base' });
      case 'estado': return ORDEN_ESTADO[a.estado] - ORDEN_ESTADO[b.estado];
      case 'donde': return a.grupo.orden - b.grupo.orden || a.donde.localeCompare(b.donde, 'es', { numeric: true });
      case 'avance': return a.avance - b.avance;
      case 'tiempo': return a.minTotal - b.minTotal;
      case 'nota': return (a.nota == null ? -1 : a.nota) - (b.nota == null ? -1 : b.nota);
      case 'ultima': return (a.ultima ? a.ultima.getTime() : 0) - (b.ultima ? b.ultima.getTime() : 0);
    }
    return 0;
  }

  function pintarChips(lista) {
    var k = contar(lista);
    var cont = $('chips');
    vaciar(cont);
    [['todos', 'Todos', k.total, null], ['En curso', 'En curso', k.curso, 'var(--s1)'], ['Terminó', 'Terminó', k.fin, 'var(--good)'], ['Inactivo', 'Inactivo', k.inac, 'var(--s2)']]
      .forEach(function (x) {
        var b = el('button', 'chip');
        b.type = 'button';
        b.setAttribute('aria-pressed', String(est.filtro === x[0]));
        if (x[3]) { var d = el('i', 'dot'); d.style.background = x[3]; b.appendChild(d); }
        b.appendChild(document.createTextNode(x[1] + ' '));
        b.appendChild(el('b', null, String(x[2])));
        b.addEventListener('click', function () { est.filtro = x[0]; pintarChips(lista); pintarTabla(); });
        cont.appendChild(b);
      });
  }

  function pintarCabecera() {
    var tr = $('tabla-th');
    vaciar(tr);
    COLS.forEach(function (c) {
      var th = el('th');
      th.scope = 'col';
      var b = el('button');
      b.type = 'button';
      b.appendChild(document.createTextNode(c.t));
      var fl = el('span', 'flecha');
      fl.setAttribute('aria-hidden', 'true');
      if (est.orden.col === c.k) {
        th.setAttribute('aria-sort', est.orden.dir === 'asc' ? 'ascending' : 'descending');
        fl.textContent = est.orden.dir === 'asc' ? '▲' : '▼';
      }
      b.appendChild(fl);
      b.addEventListener('click', function () {
        if (est.orden.col === c.k) est.orden.dir = est.orden.dir === 'asc' ? 'desc' : 'asc';
        else est.orden = { col: c.k, dir: c.dir };
        pintarTabla();
      });
      th.appendChild(b);
      tr.appendChild(th);
    });
    var sel = $('orden-movil');
    vaciar(sel);
    COLS.forEach(function (c) {
      ['asc', 'desc'].forEach(function (d) {
        var etiqueta = {
          nombre: { asc: 'Nombre (A–Z)', desc: 'Nombre (Z–A)' },
          estado: { asc: 'Estado (en curso primero)', desc: 'Estado (terminó primero)' },
          donde: { asc: 'Dónde va (inicio → final)', desc: 'Dónde va (final → inicio)' },
          avance: { asc: 'Avance (menor primero)', desc: 'Avance (mayor primero)' },
          tiempo: { asc: 'Tiempo (menor primero)', desc: 'Tiempo (mayor primero)' },
          nota: { asc: 'Nota (menor primero)', desc: 'Nota (mayor primero)' },
          ultima: { asc: 'Última actividad (más antigua)', desc: 'Última actividad (más reciente)' }
        }[c.k][d];
        var o = el('option', null, etiqueta);
        o.value = c.k + ':' + d;
        if (est.orden.col === c.k && est.orden.dir === d) o.selected = true;
        sel.appendChild(o);
      });
    });
  }

  function pastilla(estado) {
    var cls = estado === 'Terminó' ? 'fin' : estado === 'Inactivo' ? 'inac' : 'curso';
    var ic = estado === 'Terminó' ? 'i-check' : estado === 'Inactivo' ? 'i-pausa' : 'i-play';
    var p = el('span', 'pill pill--' + cls);
    p.appendChild(icono(ic));
    p.appendChild(document.createTextNode(estado));
    return p;
  }

  function pintarTabla() {
    var c = est.cache[est.claseId];
    if (!c) return;
    pintarCabecera();
    var q = sinTildes(est.buscar.trim());
    var filas = c.lista.filter(function (s) {
      if (est.filtro !== 'todos' && s.estado !== est.filtro) return false;
      return !q || s.busca.indexOf(q) !== -1;
    });
    var signo = est.orden.dir === 'asc' ? 1 : -1;
    filas.sort(function (a, b) {
      return signo * comparar(a, b, est.orden.col) || (a.nombre || '').localeCompare(b.nombre || '', 'es');
    });
    $('tabla-cuenta').textContent = filas.length === c.lista.length
      ? c.lista.length + ' estudiantes'
      : 'Mostrando ' + filas.length + ' de ' + c.lista.length;
    $('tabla-nada').hidden = filas.length > 0;
    $('tabla').hidden = filas.length === 0;

    var ahora = Date.now();
    var body = $('tabla-body');
    vaciar(body);
    filas.forEach(function (s) {
      var tr = el('tr');

      var td = el('td', 't-c-est');
      var cab = el('div');
      cab.appendChild(el('div', 't-nombre', s.nombre || '(sin nombre)'));
      cab.appendChild(el('div', 't-correo', s.correo));
      td.appendChild(cab);
      td.appendChild(pastilla(s.estado));
      tr.appendChild(td);

      td = el('td', 't-c-estado'); td.setAttribute('data-label', 'Estado');
      td.appendChild(pastilla(s.estado)); tr.appendChild(td);

      td = el('td', 't-c-donde'); td.setAttribute('data-label', 'Dónde va');
      td.appendChild(el('div', 't-donde', s.donde || 'Registrado'));
      if (s.dispositivo) td.appendChild(el('div', 't-sub', s.dispositivo));
      tr.appendChild(td);

      td = el('td', 't-c-avance'); td.setAttribute('data-label', 'Avance');
      var av = el('div', 'avance');
      var m = el('div', 'meter' + (s.avance >= 100 ? ' completo' : ''));
      m.setAttribute('role', 'img');
      m.setAttribute('aria-label', 'Avance ' + s.avance + ' %');
      var sp = el('span'); sp.style.width = s.avance + '%'; m.appendChild(sp);
      av.appendChild(m);
      av.appendChild(el('span', 't-num', s.avance + ' %'));
      td.appendChild(av);
      td.appendChild(el('div', 't-sub', 'Láminas ' + Math.round(s.avanceLaminas) + ' % · Juego ' + s.paradas + '/' + s.paradasTotal + ' · Test ' + (s.test === 'no' ? 'no' : s.test)));
      tr.appendChild(td);

      td = el('td'); td.setAttribute('data-label', 'Tiempo activo');
      td.appendChild(el('div', 't-num', minutos(s.minTotal)));
      td.appendChild(el('div', 't-sub', 'L ' + s.minLaminas + ' · J ' + s.minJuego + ' · T ' + s.minTest + ' min'));
      tr.appendChild(td);

      td = el('td'); td.setAttribute('data-label', 'Nota');
      if (s.nota != null) {
        td.appendChild(el('div', 't-num', fmt0.format(s.nota) + '/25'));
        td.appendChild(el('div', 't-sub', fmt1.format(s.nota10) + '/10'));
      } else td.appendChild(el('div', 't-vacio', s.test === 'en curso' ? 'en curso' : '—'));
      tr.appendChild(td);

      td = el('td'); td.setAttribute('data-label', 'Última actividad');
      var tm = el('time', 't-num', hace(s.ultima, ahora));
      if (s.ultima) { tm.dateTime = s.ultima.toISOString(); tm.title = fechaLarga(s.ultima); }
      td.appendChild(tm);
      if (s.registro) td.appendChild(el('div', 't-sub', 'Registro: ' + fechaCorta(s.registro)));
      tr.appendChild(td);

      body.appendChild(tr);
    });
  }

  // ---------- tooltip ----------
  var tip = $('tip');
  function ligarTip(nodo, lineas) {
    function mostrarTip(x, y) {
      vaciar(tip);
      lineas.forEach(function (ln, i) {
        if (typeof ln === 'object' && ln) {
          var f = el('span', 'tip-fila');
          var k = el('i', 'tip-key'); k.style.background = ln.color;
          f.appendChild(k); f.appendChild(document.createTextNode(ln.txt));
          tip.appendChild(f);
        } else tip.appendChild(el(i === 0 ? 'strong' : 'span', null, ln));
      });
      tip.hidden = false;
      var w = tip.offsetWidth, h = tip.offsetHeight;
      var left = Math.min(window.innerWidth - w - 8, Math.max(8, x + 12));
      var top = y - h - 12;
      if (top < 8) top = y + 16;
      tip.style.left = left + 'px';
      tip.style.top = top + 'px';
    }
    nodo.addEventListener('pointermove', function (e) { mostrarTip(e.clientX, e.clientY); });
    nodo.addEventListener('pointerleave', function () { tip.hidden = true; });
    nodo.addEventListener('focus', function () {
      var r = nodo.getBoundingClientRect();
      mostrarTip(r.left + Math.min(r.width, 200) / 2, r.top);
    });
    nodo.addEventListener('blur', function () { tip.hidden = true; });
  }
  window.addEventListener('scroll', function () { tip.hidden = true; }, { passive: true });

  // ---------- tema ----------
  function temaEfectivo() {
    var t = document.documentElement.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function pintarBotonTema() {
    var oscuro = temaEfectivo() === 'dark';
    var b = $('btn-tema');
    vaciar(b);
    b.appendChild(icono(oscuro ? 'i-sol' : 'i-luna'));
    b.setAttribute('aria-label', oscuro ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
    b.title = oscuro ? 'Tema claro' : 'Tema oscuro';
  }
  var temaGuardado = leer('tema');
  if (temaGuardado === 'dark' || temaGuardado === 'light') document.documentElement.setAttribute('data-theme', temaGuardado);
  $('btn-tema').addEventListener('click', function () {
    var nuevo = temaEfectivo() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nuevo);
    guardar('tema', nuevo);
    pintarBotonTema();
  });
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    if (mq.addEventListener) mq.addEventListener('change', pintarBotonTema);
  }

  // ---------- eventos ----------
  $('form-login').addEventListener('submit', function (e) {
    e.preventDefault();
    var v = $('clave').value.trim();
    if (!v) { $('login-error').textContent = 'Escribe la clave.'; $('clave').setAttribute('aria-invalid', 'true'); return; }
    $('login-error').textContent = '';
    $('clave').setAttribute('aria-invalid', 'false');
    if (clase().vivo) cargarVivo(v); else cargar(v);
  });
  $('btn-actualizar').addEventListener('click', function () {
    if (est.cargando) return;
    ocultarAvisoError();
    abrirClase();
  });
  $('btn-reintentar').addEventListener('click', function () { abrirClase(); });
  $('btn-salir').addEventListener('click', function () {
    CLASES.forEach(function (c) { guardar('clave.' + c.id, null); });
    est.cache = {};
    est.peticion++;
    ponerCargando(false);
    $('clave').value = '';
    abrirClase();
  });
  var tBuscar;
  $('buscar').addEventListener('input', function (e) {
    clearTimeout(tBuscar);
    tBuscar = setTimeout(function () { est.buscar = e.target.value; pintarTabla(); }, 120);
  });
  $('orden-movil').addEventListener('change', function (e) {
    var p = e.target.value.split(':');
    est.orden = { col: p[0], dir: p[1] };
    pintarTabla();
  });
  window.addEventListener('online', function () { if (!$('v-error').hidden) abrirClase(); });
  // Refrescar los textos «hace X» cada minuto.
  setInterval(function () {
    pintarActualizado();
    if (!$('v-datos').hidden && est.cache[est.claseId]) pintarTabla();
  }, 60000);

  // ---------- datos de demostración (todos inventados) ----------
  function demoDatos(claseId) {
    if (DEMO_VACIO) return [];
    var semilla = claseId === 'quimica-materia' ? 7 : 3;
    function rnd() { // mulberry32
      semilla |= 0; semilla = semilla + 0x6D2B79F5 | 0;
      var t = Math.imul(semilla ^ semilla >>> 15, 1 | semilla);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
    function entre(a, b) { return a + Math.floor(rnd() * (b - a + 1)); }
    var nombres = ['Ana Ejemplo', 'Bruno Prueba', 'Carla Ficticia', 'Diego Demo', 'Elena Inventada', 'Fabián Muestra',
      'Gabriela Simulada', 'Hugo Ensayo', 'Irene Modelo', 'Julián Borrador', 'Karla Maqueta', 'Luis Plantilla',
      'Martina Boceto', 'Nicolás Ficción', 'Olga Supuesta', 'Pablo Hipotético', 'Quique Ejemplar', 'Rosa Imaginaria',
      'Samuel Prototipo', 'Tania Ensayo', 'Ulises Muestra', 'Valeria Demo', 'Walter Prueba', 'Ximena Ficticia', 'Yago Inventado'];
    var quim = claseId === 'quimica-materia';
    var caps = quim
      ? [['La materia', 'Estados de la materia'], ['El átomo', 'Número atómico Z'], ['Tabla periódica', 'Grupos y períodos'], ['Propiedades', 'Electronegatividad']]
      : [['Signos', 'Suma de signos iguales'], ['Multiplicación', 'Menos por menos'], ['Jerarquía', 'Paréntesis primero'], ['Combinadas', 'Operaciones combinadas']];
    var totalLam = quim ? 48 : 40;
    // Etapas: 8 terminaron, 2 test en curso, 1 falta test, 5 en el juego, 7 en láminas, 2 recién registrados.
    var etapas = [];
    [['fin', 8], ['test', 2], ['faltatest', 1], ['juego', 5], ['laminas', 7], ['reg', 2]].forEach(function (e) {
      for (var i = 0; i < e[1]; i++) etapas.push(e[0]);
    });
    for (var i = etapas.length - 1; i > 0; i--) { var j = entre(0, i); var t = etapas[i]; etapas[i] = etapas[j]; etapas[j] = t; }
    var ahora = Date.now();
    var disp = ['celular · Chrome', 'celular · Chrome', 'celular · Samsung', 'celular · Safari', 'computadora · Chrome', 'computadora · Edge', 'tablet · Chrome'];

    return nombres.map(function (nom, i) {
      var etapa = etapas[i];
      var diasReg = entre(1, 16);
      var registro = ahora - diasReg * DIA - entre(0, 600) * 60000;
      var inactivo = etapa !== 'fin' && diasReg > 4 && rnd() < 0.45;
      var ultima = inactivo
        ? registro + entre(1, Math.max(1, diasReg - 4)) * DIA * 0.5
        : Math.max(registro + 30 * 60000, ahora - entre(2, 60 * 40) * 60000);
      if (etapa === 'fin') ultima = Math.max(registro + 2 * 3600000, ahora - entre(10, 60 * 24 * 6) * 60000);
      var s = {
        correo: sinTildes(nom).replace(' ', '.') + '@ejemplo.com', nombre: nom,
        registro: new Date(registro).toISOString(), ultima: new Date(Math.min(ultima, ahora)).toISOString(),
        avanceLaminas: 100, paradas: 6, paradasTotal: 6, test: 'no', nota: null, nota10: null,
        minLaminas: entre(25, 70), minJuego: entre(15, 35), minTest: 0, dispositivo: disp[entre(0, disp.length - 1)]
      };
      if (etapa === 'fin') {
        s.test = 'terminado'; s.donde = 'Terminó el test';
        s.nota = Math.min(25, Math.max(4, Math.round(12 + rnd() * 11 + (rnd() - 0.5) * 8)));
        s.nota10 = Math.round(s.nota * 4) / 10;
        s.minTest = entre(12, 30);
      } else if (etapa === 'test') {
        s.test = 'en curso'; s.donde = 'Test en curso'; s.minTest = entre(3, 10);
      } else if (etapa === 'faltatest') {
        s.donde = 'Terminó el juego · falta el test';
      } else if (etapa === 'juego') {
        var p = entre(1, 5);
        s.paradas = p - 1; s.donde = 'Juego · parada ' + p + ' de 6'; s.minJuego = entre(3, 6) * p;
      } else if (etapa === 'laminas') {
        var av = entre(8, 92);
        var cap = Math.min(4, Math.floor(av / 25) + 1);
        var lam = Math.max(1, Math.round(av / 100 * totalLam));
        s.avanceLaminas = av; s.paradas = 0; s.minJuego = 0;
        s.minLaminas = Math.round(av * 0.55) + entre(0, 8);
        s.donde = 'Láminas · Cap. ' + cap + ' · lámina ' + lam + ': ' + caps[cap - 1][1];
      } else {
        s.avanceLaminas = 0; s.paradas = 0; s.minLaminas = entre(0, 2); s.minJuego = 0; s.donde = 'Registrado';
      }
      s.minTotal = s.minLaminas + s.minJuego + s.minTest;
      var fin = s.test === 'terminado';
      s.estado = fin ? 'Terminó' : (ahora - new Date(s.ultima).getTime() > 3 * DIA ? 'Inactivo' : 'En curso');
      return s;
    });
  }

  // ---------- inicio ----------
  if (DEMO) $('aviso-demo').hidden = false;
  pintarBotonTema();
  pintarSelector();
  abrirClase();

  // Para revisar cálculos desde la consola.
  window.__panel = { est: est, mediana: mediana, promedio: promedio, grupoDonde: grupoDonde };
})();
