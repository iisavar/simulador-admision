/* =========================================================================
   Práctica libre · CIDEA Jóvenes
   Zona OPCIONAL: práctica por materia y tema con los bancos del tutor.
   Sin librerías. Datos: data/indice.json y data/{id}.json.
   Usuario: localStorage.campus_v1.usuario · Avance: localStorage.practica_v1
   ========================================================================= */
(function () {
  'use strict';

  // =====================================================================
  // 1. Configuración
  // =====================================================================
  const CLAVE = 'practica_v1';
  const CAMPUS = 'campus_v1';
  const RUTA_INDICE = 'data/indice.json';
  const RONDA = 10;                         // preguntas por ronda
  const XP_DIF = { 1: 10, 2: 20, 3: 30 };   // XP por acierto según dificultad
  const PESO_DIF = { 1: 1, 2: 1.5, 3: 2 };  // peso en el dominio
  const DIF_TXT = { 1: 'Fácil', 2: 'Media', 3: 'Difícil' };
  const NIVEL_TXT = { basico: 'Básico', intermedio: 'Intermedio', avanzado: 'Avanzado' };
  const HIST_MAX = 15;                      // respuestas recientes que cuentan para el dominio
  const MIN_DOMINIO = 5;                    // respuestas mínimas para mostrar dominio
  const ICO_MATERIA = { matematica: 'calc', quimica: 'matraz' };
  const PRONTO = ['Física', 'Biología', 'Lenguaje', 'Razonamiento'];

  // =====================================================================
  // 2. Utilidades
  // =====================================================================
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const num = (v) => { const n = Number(v); return isFinite(n) ? n : 0; };
  const obj = (x) => (x && typeof x === 'object' && !Array.isArray(x) ? x : {});
  const arr = (x) => (Array.isArray(x) ? x : []);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fmt = (n) => Math.round(n).toLocaleString('es-EC');
  const plural = (n, uno, varios) => fmt(n) + ' ' + (n === 1 ? uno : varios);

  function leer(k) { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : null; } catch (e) { return null; } }
  function escribir(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }

  function hashTxt(s) {
    let h = 5381;
    const t = String(s || '').trim().replace(/\s+/g, ' ');
    for (let i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
  }
  function barajar(a) {
    const b = a.slice();
    for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = b[i]; b[i] = b[j]; b[j] = t; }
    return b;
  }
  function recortar(s, n) { s = String(s || ''); return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s; }
  function idValido(id) { return typeof id === 'string' && /^[A-Za-z0-9_-]{1,80}$/.test(id); }
  function urlSegura(u) { u = String(u || ''); return /^(\.\.?\/|\/(?!\/)|https:\/\/)/.test(u) ? u : null; }

  // Íconos propios (trazo 2, 24×24)
  const P = {
    izq: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    der: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    chev: '<path d="M9 6l6 6-6 6"/>',
    luna: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    sol: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2.5 12h2M19.5 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    rayo: '<path d="M13 2.5 4.5 13.5H11l-1 8 8.5-11H12l1-8z"/>',
    boveda: '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="12" cy="12" r="3.2"/><path d="M12 8.8V7M12 17v-1.8M8.8 12H7M17 12h-1.8M6.5 20v1.5M17.5 20v1.5"/>',
    calc: '<rect x="5" y="2.5" width="14" height="19" rx="3"/><path d="M8.5 6.5h7M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14.5h.01M12 14.5h.01M15.5 14.5h.01M8.5 18h.01M12 18h.01M15.5 18h.01"/>',
    matraz: '<path d="M9 3h6M10 3v6.2L4.6 18.4A1.7 1.7 0 0 0 6.1 21h11.8a1.7 1.7 0 0 0 1.5-2.6L14 9.2V3"/><path d="M7.3 15h9.4"/>',
    bombilla: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>',
    ojo: '<path d="M12 3.5 2.5 20h19L12 3.5z"/><path d="M12 10v4.5M12 17.3h.01"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    llama: '<path d="M12 21c-3.9 0-7-2.8-7-6.6 0-3.2 2.2-5.3 3.6-7 .4 1.8 1.3 3 2.6 3.5C11 7.3 12.6 4.6 15 3c-.3 2.8.8 4.7 2.2 6.3 1.1 1.3 1.8 2.8 1.8 4.9 0 3.9-3.1 6.8-7 6.8z"/>',
    trofeo: '<path d="M8 4h8v5a4 4 0 0 1-8 0V4z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8.5 20.5h7M10 17h4"/>',
    libro: '<path d="M3 5.5C5.5 4.5 8.5 4.5 12 6.5c3.5-2 6.5-2 9-1v13c-2.5-1-5.5-1-9 1-3.5-2-6.5-2-9-1v-13z"/><path d="M12 6.5v13"/>',
    play: '<path d="M8 5.5v13l10.5-6.5L8 5.5z"/>',
    repetir: '<path d="M4 12a8 8 0 0 1 13.7-5.6L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 0 1-13.7 5.6L4 15.5M4 20v-4.5h4.5"/>',
    reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    diana: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
    lapiz: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/>',
    nube: '<path d="M7 18h10.5a4 4 0 0 0 .5-8 6 6 0 0 0-11.5 1.5A3.3 3.3 0 0 0 7 18z"/><path d="M12 11v4M12 17.5h.01"/>',
    usuario: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6"/>',
    capas: '<path d="M12 3 2.5 8 12 13l9.5-5L12 3z"/><path d="M2.5 12.5 12 17.5l9.5-5M2.5 16.5 12 21.5l9.5-5"/>'
  };
  function ico(n, cls) {
    return '<svg class="ico' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (P[n] || '') + '</svg>';
  }
  // Figuras de las opciones (como en CIDEA: triángulo, rombo, círculo, cuadrado)
  const FORMAS = [
    '<path d="M12 4 21 19.5H3z"/>',
    '<path d="M12 2.5 21.5 12 12 21.5 2.5 12z"/>',
    '<circle cx="12" cy="12" r="8.5"/>',
    '<rect x="4" y="4" width="16" height="16" rx="2.5"/>'
  ];
  const forma = (i) => '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">' + FORMAS[i % 4] + '</svg>';

  // =====================================================================
  // 3. Usuario y tema (compartidos con el Campus)
  // =====================================================================
  function campus() { return obj(leer(CAMPUS)); }
  function usuario() {
    const u = obj(campus().usuario);
    return typeof u.nombre === 'string' && u.nombre.trim() ? u : null;
  }
  function primerNombre(u) {
    const n = ((u && u.nombre) || '').trim().split(/\s+/)[0] || '';
    return n ? n.charAt(0).toUpperCase() + n.slice(1).toLowerCase() : '';
  }
  function temaActual() {
    const t = document.documentElement.getAttribute('data-theme');
    if (t === 'light' || t === 'dark') return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function fijarTema(t) {
    document.documentElement.setAttribute('data-theme', t);
    // Se guarda en el mismo sitio que el Campus para que el tema viaje entre ambos
    const c = campus();
    if (Object.keys(c).length) { c.ajustes = Object.assign({}, obj(c.ajustes), { tema: t }); escribir(CAMPUS, c); }
    pintarBotonTema();
  }
  function pintarBotonTema() {
    const osc = temaActual() === 'dark', b = $('#btn-tema');
    b.innerHTML = ico(osc ? 'sol' : 'luna');
    b.setAttribute('aria-label', osc ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
    b.title = osc ? 'Tema claro' : 'Tema oscuro';
  }

  // =====================================================================
  // 4. Avance de práctica (practica_v1)
  // =====================================================================
  let P_ = cargarAvance();
  function cargarAvance() {
    const p = obj(leer(CLAVE));
    return {
      v: 1,
      xp: Math.max(0, num(p.xp)),
      respondidas: num(p.respondidas),
      aciertos: num(p.aciertos),
      mejorRacha: num(p.mejorRacha),
      rondas: num(p.rondas),
      temas: obj(p.temas),    // id → { h:[[acierto,dif]…], q:{hash:[vistas,rachaOk,ts]}, rondas }
      boveda: obj(p.boveda),  // "tema~hash" → { t, h, e, d, ts, f }
      ultimo: obj(p.ultimo)   // { tema, ts }
    };
  }
  function guardarAvance() { escribir(CLAVE, P_); }
  function avTema(id) { return obj(P_.temas[id]); }
  function avTemaMut(id) {
    const t = obj(P_.temas[id]);
    t.h = arr(t.h); t.q = obj(t.q); t.rondas = num(t.rondas);
    P_.temas[id] = t;
    return t;
  }
  function dominio(id) {
    const h = arr(avTema(id).h).slice(-HIST_MAX);
    if (h.length < MIN_DOMINIO) return null;
    let n = 0, d = 0;
    h.forEach((a, i) => {
      const w = (PESO_DIF[arr(a)[1]] || 1) * Math.pow(0.9, h.length - 1 - i);
      d += w; if (arr(a)[0]) n += w;
    });
    return d ? Math.round(n / d * 100) : null;
  }
  function vistas(id) { return Object.keys(obj(avTema(id).q)).length; }
  function bovedaLista() {
    return Object.keys(P_.boveda).map(k => Object.assign({ k }, obj(P_.boveda[k])))
      .filter(e => idValido(e.t) && e.h).sort((a, b) => num(a.ts) - num(b.ts));
  }
  // Niveles: 100 XP para el 2, 300 para el 3, 600 para el 4…
  const xpNivel = (l) => 50 * l * (l - 1);
  function nivel(xp) { let l = 1; while (xp >= xpNivel(l + 1) && l < 99) l++; return l; }
  function infoNivel() {
    const l = nivel(P_.xp), base = xpNivel(l), sig = xpNivel(l + 1);
    return { l, en: P_.xp - base, span: sig - base, pct: clamp((P_.xp - base) / (sig - base), 0, 1) };
  }

  // =====================================================================
  // 5. Datos (índice y temas)
  // =====================================================================
  let INDICE = null, promIndice = null;
  const TEMAS = {};

  function pedirJSON(url) {
    return fetch(url, { cache: 'no-cache' }).then(r => {
      if (!r.ok) { const e = new Error('HTTP ' + r.status); e.status = r.status; throw e; }
      return r.json();
    });
  }
  function cargarIndice() {
    if (INDICE) return Promise.resolve(INDICE);
    if (!promIndice) {
      promIndice = pedirJSON(RUTA_INDICE).then(j => { INDICE = normIndice(j); return INDICE; })
        .catch(e => { promIndice = null; throw e; });
    }
    return promIndice;
  }
  function normClase(c) {
    c = obj(c);
    const url = urlSegura(c.url);
    if (!url) return null;
    return { titulo: String(c.titulo || 'Clase'), url, lamina: c.lamina != null && isFinite(Number(c.lamina)) ? Number(c.lamina) : null };
  }
  function urlClase(c) {
    if (!c) return null;
    return c.lamina != null ? c.url + (c.url.indexOf('?') >= 0 ? '&' : '?') + 'lamina=' + c.lamina : c.url;
  }
  function normIndice(j) {
    const materias = arr(obj(j).materias).filter(m => m && idValido(String(m.id))).map(m => {
      const id = String(m.id);
      return {
        id,
        nombre: String(m.nombre || id),
        color: /^#[0-9a-f]{3,8}$/i.test(m.color || '') ? m.color : '#8854d0',
        temas: arr(m.temas).filter(t => t && idValido(String(t.id))).map(t => ({
          id: String(t.id), materia: id,
          tema: String(t.tema || t.id),
          bloque: String(t.bloque || 'Otros temas'),
          nivel: NIVEL_TXT[t.nivel] ? t.nivel : 'basico',
          n: num(t.n),
          clase: normClase(t.clase)
        }))
      };
    });
    return { materias };
  }
  function buscarMateria(id) { return INDICE.materias.find(m => m.id === id) || null; }
  function buscarTema(id) {
    for (const m of INDICE.materias) { const t = m.temas.find(x => x.id === id); if (t) return { m, t }; }
    return null;
  }
  function todosTemas() { return INDICE.materias.reduce((a, m) => a.concat(m.temas), []); }

  function cargarTema(id) {
    if (!idValido(id)) return Promise.reject(new Error('id'));
    if (!TEMAS[id]) {
      TEMAS[id] = pedirJSON('data/' + encodeURIComponent(id) + '.json').then(j => normTema(j, id))
        .catch(e => { delete TEMAS[id]; throw e; });
    }
    return TEMAS[id];
  }
  function normTema(j, id) {
    j = obj(j);
    const vistos = {};
    const preguntas = arr(j.preguntas).map(q => {
      q = obj(q);
      const ops = arr(q.opciones).filter(o => o && o.texto != null && String(o.texto).trim())
        .map(o => ({ texto: String(o.texto), correcta: o.correcta === true }));
      if (!q.enunciado || ops.length < 2 || ops.filter(o => o.correcta).length !== 1) return null;
      let h = hashTxt(q.enunciado);
      while (vistos[h]) h += 'x';
      vistos[h] = 1;
      const d = [1, 2, 3].indexOf(num(q.dificultad)) >= 0 ? num(q.dificultad) : 2;
      return { enunciado: String(q.enunciado), dificultad: d, opciones: ops, explicacion: q.explicacion ? String(q.explicacion) : '', h, temaId: id };
    }).filter(Boolean);
    const r = obj(j.repaso), ej = obj(r.ejemplo);
    return {
      id,
      tema: String(j.tema || id),
      clase: normClase(j.clase),
      repaso: {
        idea: r.idea ? String(r.idea) : '',
        ejemplo: ej.enunciado || arr(ej.pasos).length ? {
          enunciado: String(ej.enunciado || ''),
          pasos: arr(ej.pasos).map(String).filter(Boolean),
          resultado: ej.resultado != null ? String(ej.resultado) : ''
        } : null,
        ojo: r.ojo ? String(r.ojo) : ''
      },
      preguntas
    };
  }

  // =====================================================================
  // 6. Elección de preguntas
  // =====================================================================
  // Prioridad: en la bóveda (0) → nuevas o sin dominar (1) → ya dominadas (2).
  function prioridad(q) {
    if (P_.boveda[q.temaId + '~' + q.h]) return 0;
    const s = arr(obj(avTema(q.temaId).q)[q.h]);
    return num(s[1]) >= 2 ? 2 : 1;
  }
  function ordenar(pool) {
    return barajar(pool).map(q => ({ q, p: prioridad(q), ts: num(arr(obj(avTema(q.temaId).q)[q.h])[2]) }))
      .sort((a, b) => a.p - b.p || a.ts - b.ts).map(x => x.q);
  }
  function elegir(pool, n, temaId) {
    n = Math.min(n, pool.length);
    const dom = temaId ? dominio(temaId) : null;
    // Mezcla de dificultades según cómo vas en el tema
    let cuota = dom == null ? [0.3, 0.4, 0.3] : dom < 50 ? [0.4, 0.4, 0.2] : dom >= 80 ? [0.2, 0.4, 0.4] : [0.3, 0.4, 0.3];
    const porDif = { 1: [], 2: [], 3: [] };
    pool.forEach(q => porDif[q.dificultad].push(q));
    const elegidas = [];
    [1, 2, 3].forEach((d, i) => {
      const k = Math.round(n * cuota[i]);
      ordenar(porDif[d]).slice(0, k).forEach(q => { if (elegidas.length < n) elegidas.push(q); });
    });
    if (elegidas.length < n) {
      ordenar(pool.filter(q => elegidas.indexOf(q) < 0)).slice(0, n - elegidas.length).forEach(q => elegidas.push(q));
    }
    // De lo más fácil a lo más difícil, al azar dentro de cada dificultad
    return barajar(elegidas).sort((a, b) => a.dificultad - b.dificultad);
  }
  function temasDebiles(n) {
    return todosTemas().map(t => ({ t, d: dominio(t.id) })).filter(x => x.d != null)
      .sort((a, b) => a.d - b.d).slice(0, n);
  }

  // =====================================================================
  // 7. Navegación
  // =====================================================================
  let TOKEN = 0, primera = true, Q = null;
  const vista = () => $('#vista');

  function ruta() { return location.hash.replace(/^#\/?/, '').split('/').map(s => { try { return decodeURIComponent(s); } catch (e) { return ''; } }); }

  function pintar(html, titulo) {
    const v = vista();
    v.innerHTML = '<div class="entra">' + html + '</div>';
    v.setAttribute('aria-busy', 'false');
    document.title = (titulo ? titulo + ' · ' : '') + 'Práctica libre · CIDEA Jóvenes';
    if (!primera) {
      try { window.scrollTo(0, 0); } catch (e) { }
      const h = $('h1', v);
      if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    }
    primera = false;
  }
  function pintarCargando(txt) {
    const v = vista();
    v.setAttribute('aria-busy', 'true');
    v.innerHTML = '<div class="cargando"><span class="giro" aria-hidden="true"></span><p>' + esc(txt || 'Cargando…') + '</p></div>';
  }
  function pintarError(titulo, detalle, volver) {
    pintar('<section class="aviso card">' +
      '<span class="aviso-ico">' + ico('nube') + '</span>' +
      '<h1>' + esc(titulo) + '</h1>' +
      '<p>' + esc(detalle) + '</p>' +
      '<div class="fila-btns"><button type="button" class="btn btn-pri" data-acc="reintentar">' + ico('repetir') + 'Reintentar</button>' +
      '<a class="btn btn-sec" href="' + esc(volver || '#/') + '">Volver</a></div>' +
      '</section>', 'Algo falló');
  }
  const MSJ_RED = 'Revisa tu conexión a internet y vuelve a intentar. Si sigue igual, avísale a tu tutor.';
  const MSJ_FALTA = 'Tu tutor todavía está preparando este contenido. Prueba con otro tema y vuelve pronto.';
  const falta = (e) => !!(e && e.status === 404);

  function render() {
    const tok = ++TOKEN;
    Q = null;
    pintarBarra();
    const u = usuario();
    if (!u) return pintarSinUsuario();
    if (!INDICE) pintarCargando('Cargando la práctica…');
    cargarIndice().then(() => {
      if (tok !== TOKEN) return;
      pintarBarra();
      const r = ruta();
      switch (r[0]) {
        case 'materia': return vistaMateria(r[1]);
        case 'tema': return vistaTema(r[1], tok);
        case 'practicar': return iniciarRonda('tema', r[1], tok);
        case 'debilidades': return iniciarRonda('debilidades', null, tok);
        case 'boveda': return r[1] === 'ronda' ? iniciarRonda('boveda', null, tok) : vistaBoveda();
        default: return vistaInicio(u);
      }
    }).catch((e) => {
      if (tok !== TOKEN) return;
      if (falta(e)) pintarError('La práctica se está preparando', MSJ_FALTA.replace('este contenido. Prueba con otro tema y vuelve pronto.', 'las preguntas. Vuelve pronto; mientras tanto sigue tu ruta en el Campus.'), '../campus/');
      else pintarError('No pudimos cargar la práctica', MSJ_RED, '../campus/');
    });
  }

  function pintarBarra() {
    const b = $('#btn-boveda');
    const n = usuario() ? bovedaLista().length : 0;
    b.hidden = !usuario();
    b.innerHTML = ico('boveda') + (n ? '<span class="badge" aria-hidden="true">' + (n > 99 ? '99+' : n) + '</span>' : '');
    b.setAttribute('aria-label', 'Bóveda de errores' + (n ? ', ' + plural(n, 'pregunta pendiente', 'preguntas pendientes') : ''));
    b.title = 'Bóveda de errores';
  }

  // =====================================================================
  // 8. Pantallas
  // =====================================================================
  function pintarSinUsuario() {
    pintar('<section class="aviso card aviso-usuario">' +
      '<span class="aviso-ico morado">' + ico('usuario') + '</span>' +
      '<p class="eti-opc">Práctica libre · opcional: para reforzar lo que quieras</p>' +
      '<h1>Primero entra al Campus</h1>' +
      '<p>La práctica libre usa tu registro del Campus para guardar tu avance. Entra una vez con tu nombre y vuelve aquí cuando quieras.</p>' +
      '<div class="fila-btns"><a class="btn btn-pri btn-grande" href="../campus/">Ir al Campus' + ico('der') + '</a></div>' +
      '</section>', 'Entra al Campus');
  }

  function claseMateria(m) { return 'm-' + (ICO_MATERIA[m.id] ? m.id : 'otra'); }
  function estiloMateria(m) { return '--m:' + m.color; }
  function icoMateria(m) { return ico(ICO_MATERIA[m.id] || 'capas'); }

  function barraDominio(d, etiqueta) {
    const v = d == null ? 0 : d;
    return '<div class="dom" role="img" aria-label="' + esc(etiqueta || 'Dominio') + ': ' + (d == null ? 'sin practicar' : v + ' %') + '"><span style="width:' + v + '%"></span></div>';
  }
  function resumenMateria(m) {
    const ds = m.temas.map(t => dominio(t.id)).filter(d => d != null);
    return {
      practicados: ds.length,
      dominio: ds.length ? Math.round(ds.reduce((a, b) => a + b, 0) / ds.length) : null,
      preguntas: m.temas.reduce((a, t) => a + t.n, 0)
    };
  }

  // ---------- Inicio ----------
  function vistaInicio(u) {
    const nv = infoNivel();
    const prec = P_.respondidas ? Math.round(P_.aciertos / P_.respondidas * 100) : null;
    const debiles = temasDebiles(3);
    const nBov = bovedaLista().length;
    const R = 26, C = 2 * Math.PI * R;
    const ult = P_.ultimo && P_.ultimo.tema ? buscarTema(P_.ultimo.tema) : null;

    let h = '<section class="hero">' +
      '<div class="hero-txt">' +
      '<p class="eti-opc">' + ico('lapiz') + 'Práctica libre · opcional: para reforzar lo que quieras</p>' +
      '<h1>Hola, ' + esc(primerNombre(u)) + '</h1>' +
      '<p class="hero-sub">Elige una materia y un tema, lee el mini repaso y practica con preguntas revisadas por tu tutor. Lo principal sigue siendo <a href="../campus/">tu ruta de clases en el Campus</a>.</p>' +
      '</div>' +
      '<div class="nivel card">' +
      '<div class="anillo" aria-hidden="true"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="' + R + '" class="an-f"/><circle cx="32" cy="32" r="' + R + '" class="an-v" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + (C * (1 - nv.pct)).toFixed(1) + '"/></svg><b>' + nv.l + '</b></div>' +
      '<div class="nivel-txt"><p class="nivel-tit">Nivel ' + nv.l + ' de práctica</p>' +
      '<p class="nivel-xp"><b>' + fmt(P_.xp) + ' XP</b> · te faltan ' + fmt(nv.span - nv.en) + ' para el nivel ' + (nv.l + 1) + '</p>' +
      '<div class="stats">' +
      '<span><b>' + fmt(P_.respondidas) + '</b> respondidas</span>' +
      '<span><b>' + (prec == null ? '—' : prec + ' %') + '</b> aciertos</span>' +
      '<span><b>' + fmt(P_.mejorRacha) + '</b> mejor racha</span>' +
      '</div></div></div>' +
      '</section>';

    h += '<div class="acciones">';
    if (debiles.length) {
      h += '<a class="accion accion-debil" href="#/debilidades">' +
        '<span class="accion-ico">' + ico('rayo') + '</span>' +
        '<span class="accion-txt"><b>Entrenar mis debilidades</b><span>Una ronda con tus temas más bajos: ' + esc(debiles.map(x => x.t.tema).join(' · ')) + '</span></span>' +
        ico('chev', 'accion-chev') + '</a>';
    } else {
      h += '<div class="accion accion-debil apagada">' +
        '<span class="accion-ico">' + ico('rayo') + '</span>' +
        '<span class="accion-txt"><b>Entrenar mis debilidades</b><span>Practica un par de temas y aquí armaremos una ronda con los que más te cuestan.</span></span></div>';
    }
    h += '<a class="accion accion-boveda" href="#/boveda">' +
      '<span class="accion-ico">' + ico('boveda') + '</span>' +
      '<span class="accion-txt"><b>Bóveda de errores</b><span>' + (nBov ? plural(nBov, 'pregunta por vencer', 'preguntas por vencer') : 'Aquí se guardan las preguntas que falles') + '</span></span>' +
      ico('chev', 'accion-chev') + '</a>';
    if (ult) {
      h += '<a class="accion accion-seguir ' + claseMateria(ult.m) + '" style="' + estiloMateria(ult.m) + '" href="#/tema/' + esc(ult.t.id) + '">' +
        '<span class="accion-ico">' + icoMateria(ult.m) + '</span>' +
        '<span class="accion-txt"><b>Seguir donde quedaste</b><span>' + esc(ult.t.tema) + '</span></span>' +
        ico('chev', 'accion-chev') + '</a>';
    }
    h += '</div>';

    h += '<section class="seccion" aria-labelledby="t-materias"><div class="sec-cab"><h2 id="t-materias">Materias</h2><p>Cada materia tiene sus temas ordenados de lo básico a lo avanzado.</p></div><div class="grid-materias">';
    INDICE.materias.forEach(m => {
      const r = resumenMateria(m);
      h += '<a class="materia card ' + claseMateria(m) + '" style="' + estiloMateria(m) + '" href="#/materia/' + esc(m.id) + '">' +
        '<span class="materia-ico">' + icoMateria(m) + '</span>' +
        '<span class="materia-nom">' + esc(m.nombre) + '</span>' +
        '<span class="materia-meta">' + plural(m.temas.length, 'tema', 'temas') + (r.preguntas ? ' · ' + plural(r.preguntas, 'pregunta', 'preguntas') : '') + '</span>' +
        barraDominio(r.dominio, 'Dominio de ' + m.nombre) +
        '<span class="materia-pie">' + (r.practicados ? '<b>' + r.dominio + ' %</b> de dominio · ' + r.practicados + '/' + m.temas.length + ' temas practicados' : 'Aún sin practicar') + '</span>' +
        '</a>';
    });
    h += '<div class="materia card pronto" aria-label="Más materias pronto: ' + esc(PRONTO.join(', ')) + '">' +
      '<span class="materia-ico">' + ico('reloj') + '</span>' +
      '<span class="materia-nom">Más materias pronto</span>' +
      '<span class="materia-meta">' + esc(PRONTO.join(' · ')) + '</span>' +
      '</div>';
    h += '</div></section>';
    pintar(h);
  }

  // ---------- Materia ----------
  function vistaMateria(id) {
    const m = INDICE && buscarMateria(id);
    if (!m) return pintarError('No encontramos esa materia', 'Puede que el enlace esté incompleto. Vuelve al inicio y elígela de la lista.', '#/');
    const r = resumenMateria(m);
    const bloques = [];
    m.temas.forEach(t => {
      let b = bloques.find(x => x.nombre === t.bloque);
      if (!b) { b = { nombre: t.bloque, temas: [] }; bloques.push(b); }
      b.temas.push(t);
    });
    let h = '<div class="' + claseMateria(m) + '" style="' + estiloMateria(m) + '">' +
      '<a class="volver" href="#/">' + ico('izq') + 'Materias</a>' +
      '<header class="cab-materia">' +
      '<span class="materia-ico grande">' + icoMateria(m) + '</span>' +
      '<div class="cab-txt"><h1>' + esc(m.nombre) + '</h1>' +
      '<p>' + plural(m.temas.length, 'tema', 'temas') + (r.preguntas ? ' · ' + plural(r.preguntas, 'pregunta', 'preguntas') : '') + '</p></div>' +
      '<div class="cab-stats"><span><b>' + (r.dominio == null ? '—' : r.dominio + ' %') + '</b>dominio</span>' +
      '<span><b>' + r.practicados + '<small>/' + m.temas.length + '</small></b>practicados</span></div>' +
      '</header>';
    bloques.forEach((b, bi) => {
      h += '<section class="bloque" aria-labelledby="bl-' + bi + '"><h2 id="bl-' + bi + '">' + esc(b.nombre) + ' <span>' + plural(b.temas.length, 'tema', 'temas') + '</span></h2><div class="grid-temas">';
      b.temas.forEach(t => {
        const d = dominio(t.id), uc = urlClase(t.clase);
        h += '<article class="tema card">' +
          '<div class="tema-top"><span class="pill nivel-' + t.nivel + '">' + NIVEL_TXT[t.nivel] + '</span>' +
          (uc ? '<a class="pill pill-clase" href="' + esc(uc) + '" aria-label="Tiene clase: abrir «' + esc(t.clase.titulo) + '»">' + ico('libro') + 'Tiene clase</a>' : '') +
          '</div>' +
          '<h3><a class="tema-link" href="#/tema/' + esc(t.id) + '">' + esc(t.tema) + '</a></h3>' +
          '<p class="tema-meta">' + (t.n ? plural(t.n, 'pregunta', 'preguntas') + ' · ' : '') + (d == null ? 'sin practicar' : d + ' % de dominio') + '</p>' +
          barraDominio(d, 'Dominio de ' + t.tema) +
          '</article>';
      });
      h += '</div></section>';
    });
    h += '</div>';
    pintar(h, m.nombre);
  }

  // ---------- Tema (mini repaso) ----------
  function vistaTema(id, tok) {
    const ref = INDICE && buscarTema(id);
    if (!ref) return pintarError('No encontramos ese tema', 'Puede que el enlace esté incompleto. Vuelve y elígelo de la lista.', '#/');
    pintarCargando('Cargando el tema…');
    cargarTema(id).then(d => {
      if (tok !== TOKEN) return;
      const { m, t } = ref;
      const dom = dominio(id), nV = vistas(id);
      const nBov = bovedaLista().filter(e => e.t === id).length;
      const clase = d.clase || t.clase, uc = urlClase(clase);
      const nRonda = Math.min(RONDA, d.preguntas.length);
      const rp = d.repaso;
      let h = '<div class="' + claseMateria(m) + '" style="' + estiloMateria(m) + '">' +
        '<a class="volver" href="#/materia/' + esc(m.id) + '">' + ico('izq') + esc(m.nombre) + '</a>' +
        '<header class="cab-tema">' +
        '<p class="eti-materia">' + icoMateria(m) + esc(m.nombre) + ' · ' + esc(t.bloque) + '</p>' +
        '<h1>' + esc(d.tema || t.tema) + '</h1>' +
        '<div class="chips"><span class="pill nivel-' + t.nivel + '">' + NIVEL_TXT[t.nivel] + '</span>' +
        '<span class="pill">' + plural(d.preguntas.length, 'pregunta', 'preguntas') + '</span>' +
        (dom != null ? '<span class="pill">' + dom + ' % de dominio</span>' : '') +
        '</div></header>' +
        '<div class="tema-grid">' +
        '<section class="repaso card" aria-labelledby="t-repaso"><h2 id="t-repaso">Mini repaso</h2>';
      if (rp.idea) {
        h += '<div class="rp rp-idea"><span class="rp-ico">' + ico('bombilla') + '</span><div><h3>Idea clave</h3><p>' + esc(rp.idea) + '</p></div></div>';
      }
      if (rp.ejemplo) {
        h += '<div class="rp rp-ejemplo"><h3>Ejemplo resuelto</h3>' +
          (rp.ejemplo.enunciado ? '<p class="rp-enun">' + esc(rp.ejemplo.enunciado) + '</p>' : '') +
          (rp.ejemplo.pasos.length ? '<ol class="pasos">' + rp.ejemplo.pasos.map(p => '<li>' + esc(p) + '</li>').join('') + '</ol>' : '') +
          (rp.ejemplo.resultado ? '<p class="rp-res"><b>Resultado:</b> ' + esc(rp.ejemplo.resultado) + '</p>' : '') +
          '</div>';
      }
      if (rp.ojo) {
        h += '<div class="rp rp-ojo"><span class="rp-ico">' + ico('ojo') + '</span><div><h3>Ojo</h3><p>' + esc(rp.ojo) + '</p></div></div>';
      }
      if (!rp.idea && !rp.ejemplo && !rp.ojo) h += '<p class="suave">Este tema aún no tiene mini repaso. Puedes practicar directamente.</p>';
      h += '</section>' +
        '<aside class="tema-lado"><div class="card lado-card">' +
        (nRonda ? '<a class="btn btn-pri btn-grande btn-ancho solo-escritorio" href="#/practicar/' + esc(id) + '">' + ico('play') + 'Practicar (' + nRonda + ' preguntas)</a>'
          : '<p class="suave">Este tema aún no tiene preguntas. Vuelve pronto.</p>') +
        (uc ? '<a class="btn btn-sec btn-ancho" href="' + esc(uc) + '">' + ico('libro') + 'Ver la clase completa</a>' +
          '<p class="lado-nota">Clase: «' + esc(clase.titulo) + '»' + (clase.lamina != null ? ', desde la lámina ' + clase.lamina : '') + '</p>' : '') +
        '<ul class="lado-stats">' +
        '<li><b>' + nV + '</b> de ' + d.preguntas.length + ' preguntas vistas</li>' +
        '<li><b>' + (dom == null ? '—' : dom + ' %') + '</b> de dominio' + (dom == null ? ' (se calcula tras 5 respuestas)' : '') + '</li>' +
        (nBov ? '<li><a href="#/boveda"><b>' + nBov + '</b> en tu bóveda de errores</a></li>' : '') +
        '</ul></div></aside>' +
        '</div>' +
        (nRonda ? '<div class="cta-movil"><a class="btn btn-pri btn-grande btn-ancho" href="#/practicar/' + esc(id) + '">' + ico('play') + 'Practicar (' + nRonda + ' preguntas)</a></div>' : '') +
        '</div>';
      pintar(h, d.tema || t.tema);
    }).catch((e) => {
      if (tok !== TOKEN) return;
      if (falta(e)) pintarError('Este tema aún no está listo', MSJ_FALTA, '#/materia/' + ref.m.id);
      else pintarError('No pudimos cargar este tema', MSJ_RED, '#/materia/' + ref.m.id);
    });
  }

  // ---------- Bóveda ----------
  function vistaBoveda() {
    const lista = bovedaLista();
    if (!lista.length) {
      return pintar('<a class="volver" href="#/">' + ico('izq') + 'Inicio</a>' +
        '<section class="aviso card">' +
        '<span class="aviso-ico verde">' + ico('trofeo') + '</span>' +
        '<h1>Tu bóveda está vacía</h1>' +
        '<p>Aquí se guardan las preguntas que falles para que vuelvas a intentarlas. Cuando respondes bien una, sale de la bóveda.</p>' +
        '<div class="fila-btns"><a class="btn btn-pri" href="#/">Elegir un tema</a></div>' +
        '</section>', 'Bóveda de errores');
    }
    const grupos = [];
    lista.forEach(e => {
      let g = grupos.find(x => x.t === e.t);
      if (!g) { g = { t: e.t, items: [] }; grupos.push(g); }
      g.items.push(e);
    });
    const nR = Math.min(RONDA, lista.length);
    let h = '<a class="volver" href="#/">' + ico('izq') + 'Inicio</a>' +
      '<header class="cab-boveda"><span class="aviso-ico rojo">' + ico('boveda') + '</span>' +
      '<div><h1>Bóveda de errores</h1><p>' + plural(lista.length, 'pregunta que fallaste y aún no vences', 'preguntas que fallaste y aún no vences') + '. Respóndelas bien y salen de aquí.</p></div></header>' +
      '<a class="btn btn-rojo btn-grande btn-ancho-movil" href="#/boveda/ronda">' + ico('diana') + 'Vencer mis errores (' + nR + ' ' + (nR === 1 ? 'pregunta' : 'preguntas') + ')</a>' +
      '<div class="grid-boveda">';
    grupos.forEach(g => {
      const ref = buscarTema(g.t);
      const m = ref ? ref.m : { id: 'otra', color: '#8854d0', nombre: '' };
      h += '<section class="card bov-grupo ' + claseMateria(m) + '" style="' + estiloMateria(m) + '">' +
        '<div class="bov-cab"><h2>' + esc(ref ? ref.t.tema : g.t) + '</h2><span class="pill">' + g.items.length + ' pendiente' + (g.items.length > 1 ? 's' : '') + '</span></div>' +
        (ref ? '<p class="bov-mat">' + icoMateria(m) + esc(m.nombre) + '</p>' : '') +
        '<ul class="bov-lista">' + g.items.slice(0, 3).map(e =>
          '<li><span>' + esc(recortar(e.e, 150)) + '</span><span class="dif dif-' + (num(e.d) || 2) + '">' + (DIF_TXT[e.d] || 'Media') + '</span></li>').join('') + '</ul>' +
        (g.items.length > 3 ? '<p class="suave peq">y ' + (g.items.length - 3) + ' más…</p>' : '') +
        (ref ? '<a class="enlace-tema" href="#/tema/' + esc(g.t) + '">Repasar el tema' + ico('der') + '</a>' : '') +
        '</section>';
    });
    h += '</div>';
    pintar(h, 'Bóveda de errores');
  }

  // =====================================================================
  // 9. Ronda de práctica
  // =====================================================================
  function iniciarRonda(modo, temaId, tok) {
    pintarCargando('Preparando tu ronda…');
    let prep;
    if (modo === 'tema') {
      const ref = buscarTema(temaId);
      if (!ref) return pintarError('No encontramos ese tema', 'Vuelve y elígelo de la lista.', '#/');
      prep = cargarTema(temaId).then(d => ({
        preguntas: elegir(d.preguntas, RONDA, temaId),
        titulo: d.tema || ref.t.tema, volver: '#/tema/' + temaId, temas: [temaId]
      }));
    } else if (modo === 'debilidades') {
      const deb = temasDebiles(3);
      if (!deb.length) {
        return pintar('<a class="volver" href="#/">' + ico('izq') + 'Inicio</a><section class="aviso card">' +
          '<span class="aviso-ico morado">' + ico('rayo') + '</span><h1>Aún no hay debilidades que entrenar</h1>' +
          '<p>Practica al menos una ronda en un par de temas. Con eso sabremos cuáles te cuestan más y armaremos una ronda con ellos.</p>' +
          '<div class="fila-btns"><a class="btn btn-pri" href="#/">Elegir un tema</a></div></section>', 'Entrenar mis debilidades');
      }
      const cuotas = deb.length === 1 ? [10] : deb.length === 2 ? [5, 5] : [4, 3, 3];
      prep = Promise.all(deb.map(x => cargarTema(x.t.id).catch(() => null))).then(ds => {
        let preguntas = [];
        const sobrantes = [];
        ds.forEach((d, i) => {
          if (!d) return;
          const el = elegir(d.preguntas, cuotas[i], d.id);
          preguntas = preguntas.concat(el);
          d.preguntas.forEach(q => { if (el.indexOf(q) < 0) sobrantes.push(q); });
        });
        if (!ds.some(Boolean)) throw new Error('carga');
        if (preguntas.length < RONDA) preguntas = preguntas.concat(ordenar(sobrantes).slice(0, RONDA - preguntas.length));
        return {
          preguntas: preguntas.sort((a, b) => a.dificultad - b.dificultad),
          titulo: 'Entrenar mis debilidades', volver: '#/', temas: deb.map(x => x.t.id)
        };
      });
    } else {
      const lista = bovedaLista();
      if (!lista.length) { location.replace('#/boveda'); return; }
      const ids = [];
      lista.forEach(e => { if (ids.indexOf(e.t) < 0 && buscarTema(e.t)) ids.push(e.t); });
      prep = Promise.all(ids.map(id => cargarTema(id).catch(() => null))).then(ds => {
        if (ids.length && !ds.some(Boolean)) throw new Error('carga');
        const mapa = {};
        ds.forEach(d => { if (d) d.preguntas.forEach(q => { mapa[q.temaId + '~' + q.h] = q; }); });
        // Limpia de la bóveda lo que ya no existe en los bancos (preguntas corregidas o quitadas)
        let limpio = false;
        lista.forEach(e => {
          const cargado = ds[ids.indexOf(e.t)];
          if (!buscarTema(e.t) || (cargado && !mapa[e.k])) { delete P_.boveda[e.k]; limpio = true; }
        });
        if (limpio) guardarAvance();
        const preguntas = lista.map(e => mapa[e.k]).filter(Boolean).slice(0, RONDA);
        return { preguntas: preguntas.sort((a, b) => a.dificultad - b.dificultad), titulo: 'Vencer mis errores', volver: '#/boveda', temas: ids };
      });
    }
    prep.then(r => {
      if (tok !== TOKEN) return;
      if (!r.preguntas.length) {
        return pintar('<section class="aviso card"><span class="aviso-ico">' + ico('reloj') + '</span><h1>Aún no hay preguntas aquí</h1>' +
          '<p>Este tema todavía no tiene preguntas listas. Prueba con otro tema.</p>' +
          '<div class="fila-btns"><a class="btn btn-pri" href="' + esc(r.volver) + '">Volver</a></div></section>', r.titulo);
      }
      const domAntes = {};
      r.temas.forEach(id => { domAntes[id] = dominio(id); });
      Q = {
        modo, temaId, tok, titulo: r.titulo, volver: r.volver, temas: r.temas, domAntes,
        preguntas: r.preguntas.map(q => Object.assign({}, q, { opciones: barajar(q.opciones) })),
        i: 0, elegida: null, aciertos: 0, xp: 0, racha: 0, mejor: 0, fallos: [], nivelAntes: nivel(P_.xp)
      };
      pintarPregunta();
    }).catch(() => {
      if (tok !== TOKEN) return;
      pintarError('No pudimos preparar tu ronda', MSJ_RED, modo === 'boveda' ? '#/boveda' : modo === 'tema' ? '#/tema/' + temaId : '#/');
    });
  }

  function refTemaDe(q) { return buscarTema(q.temaId) || { m: { id: 'otra', color: '#8854d0', nombre: '' }, t: { tema: q.temaId } }; }

  function pintarPregunta() {
    const q = Q.preguntas[Q.i], n = Q.preguntas.length;
    const ref = refTemaDe(q);
    const eti = Q.modo === 'tema' ? Q.titulo : ref.t.tema;
    const h = '<div class="quiz ' + claseMateria(ref.m) + '" style="' + estiloMateria(ref.m) + '">' +
      '<div class="quiz-top">' +
      '<a class="btn-ico" href="' + esc(Q.volver) + '" aria-label="Salir de la ronda" title="Salir">' + ico('x') + '</a>' +
      '<div class="prog" role="progressbar" aria-label="Avance de la ronda" aria-valuemin="0" aria-valuemax="' + n + '" aria-valuenow="' + Q.i + '"><span style="width:' + (Q.i / n * 100) + '%"></span></div>' +
      '<span class="prog-num">' + (Q.i + 1) + ' / ' + n + '</span>' +
      '<span class="racha' + (Q.racha >= 2 ? ' viva' : '') + '" id="racha" title="Racha de aciertos">' + ico('llama') + '<b>' + Q.racha + '</b><span class="sr"> seguidas</span></span>' +
      '</div>' +
      '<div class="q-card card">' +
      '<p class="q-eti"><span class="q-tema">' + icoMateria(ref.m) + esc(eti) + '</span><span class="dif dif-' + q.dificultad + '">' + DIF_TXT[q.dificultad] + ' · +' + XP_DIF[q.dificultad] + ' XP</span></p>' +
      '<h1 class="q-enun" id="q-enun">' + esc(q.enunciado) + '</h1>' +
      '</div>' +
      '<div class="ops" role="group" aria-labelledby="q-enun">' +
      q.opciones.map((o, i) => '<button type="button" class="op" data-op="' + i + '">' +
        '<span class="op-forma f' + i + '">' + forma(i) + '<span class="sr">Opción ' + 'ABCD'.charAt(i) + ':</span></span>' +
        '<span class="op-txt">' + esc(o.texto) + '</span><span class="op-marca" aria-hidden="true"></span><span class="sr op-sr"></span></button>').join('') +
      '</div>' +
      '<div class="fb-zona" id="fb"></div>' +
      '<p class="atajo" aria-hidden="true">Atajo: teclas 1–4 para responder, Enter para seguir.</p>' +
      '</div>';
    pintar(h, Q.titulo);
  }

  function responder(i) {
    if (!Q || Q.elegida !== null) return;
    const q = Q.preguntas[Q.i];
    const ok = !!(q.opciones[i] && q.opciones[i].correcta);
    const iOk = q.opciones.findIndex(o => o.correcta);
    Q.elegida = i;

    // Guardar avance
    const t = avTemaMut(q.temaId);
    t.h.push([ok ? 1 : 0, q.dificultad]);
    if (t.h.length > HIST_MAX * 2) t.h = t.h.slice(-HIST_MAX * 2);
    const s = arr(t.q[q.h]);
    t.q[q.h] = [num(s[0]) + 1, ok ? num(s[1]) + 1 : 0, Date.now()];
    const xp = ok ? XP_DIF[q.dificultad] : 0;
    P_.xp += xp; P_.respondidas++; if (ok) P_.aciertos++;
    const k = q.temaId + '~' + q.h;
    if (ok) delete P_.boveda[k];
    else P_.boveda[k] = { t: q.temaId, h: q.h, e: recortar(q.enunciado, 200), d: q.dificultad, ts: Date.now(), f: num(obj(P_.boveda[k]).f) + 1 };
    P_.ultimo = { tema: q.temaId, ts: Date.now() };
    Q.racha = ok ? Q.racha + 1 : 0;
    Q.mejor = Math.max(Q.mejor, Q.racha);
    P_.mejorRacha = Math.max(P_.mejorRacha, Q.racha);
    if (ok) { Q.aciertos++; Q.xp += xp; } else Q.fallos.push({ q, elegida: i, iOk });
    guardarAvance();
    pintarBarra();

    // Pintar respuesta
    $$('.op').forEach((b, j) => {
      b.disabled = true;
      const sr = $('.op-sr', b), marca = $('.op-marca', b);
      if (j === iOk) { b.classList.add('ok'); marca.innerHTML = ico('check'); sr.textContent = ' (respuesta correcta)'; }
      else if (j === i) { b.classList.add('no'); marca.innerHTML = ico('x'); sr.textContent = ' (tu respuesta)'; }
      else b.classList.add('apagada');
    });
    const n = Q.preguntas.length, ultima = Q.i + 1 >= n;
    const prog = $('.prog');
    prog.setAttribute('aria-valuenow', Q.i + 1);
    $('span', prog).style.width = ((Q.i + 1) / n * 100) + '%';
    const r = $('#racha');
    r.classList.toggle('viva', Q.racha >= 2);
    r.classList.remove('salta'); void r.offsetWidth; if (ok && Q.racha >= 2) r.classList.add('salta');
    $('b', r).textContent = Q.racha;

    const rachaTxt = ok && Q.racha >= 3 ? '<span class="fb-racha">' + ico('llama') + Q.racha + ' seguidas</span>' : '';
    $('#fb').innerHTML = '<div class="fb ' + (ok ? 'fb-ok' : 'fb-casi') + '">' +
      '<span class="fb-ico">' + ico(ok ? 'check' : 'bombilla') + '</span>' +
      '<div class="fb-txt">' +
      '<p class="fb-tit">' + (ok ? '¡Correcto! <span class="fb-xp">+' + xp + ' XP</span>' : 'Casi') + rachaTxt + '</p>' +
      (ok ? '' : '<p class="fb-resp">La respuesta es: <b>' + esc(q.opciones[iOk].texto) + '</b></p>') +
      (q.explicacion ? '<p class="fb-exp">' + esc(q.explicacion) + '</p>' : '') +
      '</div>' +
      '<button type="button" class="btn btn-pri" id="sig" data-acc="siguiente">' + (ultima ? 'Ver resultado' : 'Siguiente') + ico('der') + '</button>' +
      '</div>';
    anunciar((ok ? 'Correcto. Más ' + xp + ' XP. ' : 'Casi. La respuesta es: ' + q.opciones[iOk].texto + '. ') + (q.explicacion || ''));
    const sig = $('#sig');
    sig.focus({ preventScroll: true });
    try { $('#fb').scrollIntoView({ block: 'nearest', behavior: movReducido() ? 'auto' : 'smooth' }); } catch (e) { }
  }

  function siguiente() {
    if (!Q || Q.elegida === null) return;
    if (Q.i + 1 >= Q.preguntas.length) return pintarResultado();
    Q.i++; Q.elegida = null;
    pintarPregunta();
    // En la ronda, el foco va al enunciado para leer la nueva pregunta
    const e = $('#q-enun'); if (e) { e.setAttribute('tabindex', '-1'); e.focus({ preventScroll: true }); }
  }

  function pintarResultado() {
    const n = Q.preguntas.length, pct = Math.round(Q.aciertos / n * 100);
    P_.rondas++;
    Q.temas.forEach(id => { if (Q.preguntas.some(q => q.temaId === id)) { const t = avTemaMut(id); t.rondas++; } });
    guardarAvance();
    const nivelAhora = nivel(P_.xp), subio = nivelAhora > Q.nivelAntes;
    const msj = pct === 100 ? '¡Ronda perfecta!' : pct >= 80 ? '¡Excelente trabajo!' : pct >= 50 ? '¡Bien hecho!' : '¡Buen intento!';
    const sub = pct >= 80 ? 'Vas muy bien en esto.' : pct >= 50 ? 'Vas por buen camino; una ronda más y lo afianzas.' : 'Cada error te enseña algo. Repasa la idea clave y vuelve a intentarlo.';
    const tono = pct >= 80 ? 'verde' : pct >= 50 ? 'ambar' : 'morado';

    let doms = '';
    Q.temas.forEach(id => {
      const ref = buscarTema(id); if (!ref) return;
      const d = dominio(id), a = Q.domAntes[id];
      const dif = d != null && a != null ? d - a : null;
      doms += '<li class="' + claseMateria(ref.m) + '" style="' + estiloMateria(ref.m) + '"><div class="res-dom-cab"><span>' + esc(ref.t.tema) + '</span><b>' + (d == null ? 'sigue practicando' : d + ' %') +
        (dif ? ' <small class="' + (dif > 0 ? 'sube' : 'baja') + '">' + (dif > 0 ? '+' : '−') + Math.abs(dif) + '</small>' : '') + '</b></div>' + barraDominio(d, 'Dominio de ' + ref.t.tema) + '</li>';
    });

    let h = '<section class="resultado card">' +
      '<span class="res-ico ' + tono + '">' + ico('trofeo') + '</span>' +
      '<h1>' + msj + '</h1><p class="res-sub">' + esc(Q.titulo) + ' · ' + sub + '</p>' +
      '<div class="res-stats">' +
      '<div><b>' + Q.aciertos + '/' + n + '</b><span>aciertos</span></div>' +
      '<div><b>' + pct + ' %</b><span>precisión</span></div>' +
      '<div class="xp"><b>+' + Q.xp + '</b><span>XP ganada</span></div>' +
      '<div><b>' + Q.mejor + '</b><span>mejor racha</span></div>' +
      '</div>' +
      (subio ? '<p class="res-nivel">' + ico('rayo') + '¡Subiste al nivel ' + nivelAhora + ' de práctica!</p>' : '') +
      (doms ? '<div class="res-dom"><h2>Tu dominio</h2><ul>' + doms + '</ul></div>' : '') +
      (Q.fallos.length ? '<p class="res-bov">' + (Q.fallos.length === 1 ? 'La pregunta que fallaste se guardó' : 'Las ' + Q.fallos.length + ' preguntas que fallaste se guardaron') + ' en tu <a href="#/boveda">bóveda de errores</a>.</p>' : '') +
      '<div class="fila-btns"><button type="button" class="btn btn-pri btn-grande" data-acc="otra">' + ico('repetir') + 'Otra ronda</button>' +
      '<a class="btn btn-sec btn-grande" href="' + esc(Q.volver) + '">Volver</a></div>' +
      '</section>';
    if (Q.fallos.length) {
      h += '<details class="card repaso-fallos"><summary>Repasar lo que fallaste (' + Q.fallos.length + ')</summary><ol>' +
        Q.fallos.map(f => '<li><p class="rf-enun">' + esc(f.q.enunciado) + '</p>' +
          '<p class="rf-tuya">Elegiste: ' + esc(f.q.opciones[f.elegida].texto) + '</p>' +
          '<p class="rf-ok">' + ico('check') + 'Respuesta: <b>' + esc(f.q.opciones[f.iOk].texto) + '</b></p>' +
          (f.q.explicacion ? '<p class="rf-exp">' + esc(f.q.explicacion) + '</p>' : '') + '</li>').join('') +
        '</ol></details>';
    }
    Q.terminado = true;
    pintar(h, 'Resultado');
    pintarBarra();
  }

  function otraRonda() {
    if (!Q) return;
    const modo = Q.modo, temaId = Q.temaId;
    iniciarRonda(modo, temaId, Q.tok);
  }

  function anunciar(t) {
    const a = $('#anuncio');
    a.textContent = '';
    setTimeout(() => { a.textContent = t; }, 60);
  }
  function movReducido() { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }

  // =====================================================================
  // 10. Eventos
  // =====================================================================
  function iniciar() {
    pintarBotonTema();
    $('#btn-tema').addEventListener('click', () => fijarTema(temaActual() === 'dark' ? 'light' : 'dark'));
    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const f = () => pintarBotonTema();
      if (mq.addEventListener) mq.addEventListener('change', f); else if (mq.addListener) mq.addListener(f);
    }
    document.addEventListener('click', e => {
      const op = e.target.closest && e.target.closest('.op');
      if (op && !op.disabled) return responder(Number(op.getAttribute('data-op')));
      const acc = e.target.closest && e.target.closest('[data-acc]');
      if (!acc) return;
      const a = acc.getAttribute('data-acc');
      if (a === 'siguiente') siguiente();
      else if (a === 'otra') otraRonda();
      else if (a === 'reintentar') render();
    });
    document.addEventListener('keydown', e => {
      if (!Q || Q.terminado || e.ctrlKey || e.metaKey || e.altKey) return;
      const tg = e.target && e.target.tagName;
      if (tg === 'INPUT' || tg === 'TEXTAREA' || tg === 'SELECT') return;
      if (Q.elegida === null) {
        const k = e.key.toLowerCase();
        let i = '1234'.indexOf(k); if (i < 0) i = 'abcd'.indexOf(k);
        if (i >= 0 && i < Q.preguntas[Q.i].opciones.length) { e.preventDefault(); responder(i); }
      } else if (e.key === 'Enter' && !(e.target && e.target.closest && e.target.closest('a,button'))) {
        e.preventDefault(); siguiente();
      }
    });
    window.addEventListener('hashchange', render);
    // Si otra pestaña cambia el avance o el usuario, se actualiza (menos en plena ronda)
    window.addEventListener('storage', e => {
      if (e.key !== CLAVE && e.key !== CAMPUS && e.key !== null) return;
      P_ = cargarAvance();
      if (!Q || Q.terminado) render(); else pintarBarra();
    });
    window.addEventListener('pageshow', e => { if (e.persisted) { P_ = cargarAvance(); render(); } });
    render();
  }

  // «En vivo» del panel del tutor y avance en la nube (solo si el central de CIDEA está conectado)
  if (window.CIDEA && window.CIDEA.activo()) {
    window.CIDEA.iniciar({
      claves: [CLAVE],
      app: 'Práctica libre',
      donde: function () {
        try {
          const r = ruta();
          if ((r[0] === 'tema' || r[0] === 'practicar') && r[1] && INDICE) {
            const ref = buscarTema(r[1]);
            const nombre = ref ? ref.t.tema : r[1];
            return (r[0] === 'practicar' ? 'Practicando: ' : 'Repasando: ') + nombre;
          }
          if (r[0] === 'debilidades') return 'Practicando sus debilidades';
          if (r[0] === 'boveda') return 'En la bóveda de errores';
          if (r[0] === 'materia' && r[1]) return 'Viendo los temas de ' + r[1];
          return 'En el inicio de la práctica';
        } catch (e) { return ''; }
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
