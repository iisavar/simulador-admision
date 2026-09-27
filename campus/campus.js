/* CIDEA Jóvenes · por Ignacio Isa  (vive en la carpeta campus/)
   Página única: sigue el CRONOGRAMA de clases del tutor y lee el avance que cada clase guarda en
   localStorage (mismo origen). Todo acceso a localStorage va con try/catch y tolera claves ausentes. */
(function () {
  'use strict';

  // =====================================================================
  // 1. CRONOGRAMA — edita aquí
  // =====================================================================
  // Para agregar una clase: suma un objeto (corto = nombre breve opcional) con el siguiente `n` (o cambia un «proximamente» por la clase real); `abre:'AAAA-MM-DD'` la deja con candado hasta esa fecha.
  const CRONOGRAMA = [
    {
      n: 1, materia: 'matematica', titulo: 'Ley de signos y operaciones combinadas', corto: 'Ley de signos',
      url: '../ley-de-signos/', clave: 'lds_v1', totalLaminas: 48, capitulos: 4,
      img: 'img/aula-matematicas.webp', alt: 'Ignacio en el aula de matemáticas con un ábaco',
      resumen: '../ley-de-signos/?lamina=40', juego: '../ley-de-signos/?ir=juego', nombreJuego: 'Juego de signos'
    },
    {
      n: 2, materia: 'quimica', titulo: 'Química desde cero: materia, átomo y tabla periódica', corto: 'Química desde cero',
      url: '../quimica-materia/', clave: 'qm_v1', totalLaminas: 47, capitulos: 3,
      img: 'img/aula-ciencias.webp', alt: 'Ignacio en el laboratorio de ciencias con un matraz',
      resumen: '../quimica-materia/?lamina=71', juego: '../quimica-materia/?ir=juego', nombreJuego: 'Juego «Laboratorio»'
    },
    { n: 3, proximamente: true, titulo: 'Próxima clase', materia: null, img: 'img/aula-cosmos.webp', alt: 'Ignacio en un aula sobre el cosmos' },
    { n: 4, proximamente: true, titulo: 'Próxima clase', materia: null, img: 'img/aula-geografia.webp', alt: 'Ignacio con un globo terráqueo en el aula de geografía' }
  ];

  // Evalúate: diagnósticos y simulador (leen { puntaje 0–100, fecha }). `materia` enlaza con la clase que lo refuerza.
  const EVALUACIONES = [
    { id: 'diag-mat', materia: 'matematica', titulo: 'Diagnóstico de Matemáticas', detalle: '60 preguntas · unos 60 min', url: '../diagnostico.html', clave: 'ultimo_diagnostico_matematicas' },
    { id: 'diag-qui', materia: 'quimica', titulo: 'Diagnóstico de Química', detalle: '60 preguntas · temario UNEMI', url: '../diagnostico-quimica.html', clave: 'ultimo_diagnostico_quimica' },
    { id: 'unemi', materia: null, titulo: 'Simulador de admisión UNEMI', detalle: '4 áreas, como el examen real', url: '../index.html', clave: 'ultimo_simulador_unemi' }
  ];

  // Herramientas de la Zona de práctica (los juegos salen solos del campo `juego` del cronograma).
  const HERRAMIENTAS = [
    { id: 'tabla', clase: 2, titulo: 'Tabla periódica interactiva', desc: 'Toca un elemento y mira su número, masa y familia.', url: '../quimica-materia/?herramienta=tabla', icono: 'tabla' },
    { id: 'constructor', clase: 2, titulo: 'Constructor de átomos', desc: 'Suma protones, neutrones y electrones y mira qué átomo armas.', url: '../quimica-materia/?herramienta=constructor', icono: 'atomo' },
    { id: 'estados', clase: 2, titulo: 'Estados de la materia', desc: 'Calienta o enfría y mira cómo se mueven las partículas.', url: '../quimica-materia/?herramienta=estados', icono: 'gota' }
  ];

  // Práctica libre (opcional): app aparte ../practica/ con bancos de preguntas por materia y tema.
  const PRACTICA_LIBRE = {
    url: '../practica/', clave: 'practica_v1',
    materias: [
      { materia: 'matematica', desc: 'Operaciones, álgebra, geometría y más, tema por tema.' },
      { materia: 'quimica', desc: 'Materia, átomo, tabla periódica y más, tema por tema.' }
    ]
  };

  // Materias: colores e íconos de CIDEA Jóvenes (seed.js). `barra` = tono validado para barras sobre fondo claro.
  const MATERIAS = {
    matematica: { nombre: 'Matemática', color: '#F4A124', barra: '#e3940c', icono: 'calculadora' },
    fisica: { nombre: 'Física', color: '#2D8CF0', icono: 'atomo' },
    quimica: { nombre: 'Química', color: '#2BAE66', barra: '#1a9a6c', icono: 'matraz' },
    biologia: { nombre: 'Biología', color: '#15B8A6', icono: 'adn' },
    anatomia: { nombre: 'Anatomía', color: '#E84B5A', icono: 'corazon' },
    verbal: { nombre: 'Razonamiento verbal', color: '#8854D0', icono: 'globo' },
    numerico: { nombre: 'Razonamiento numérico', color: '#5B6CF0', icono: 'numeral' },
    logico: { nombre: 'Razonamiento lógico', color: '#E8794B', icono: 'foco' },
    abstracto: { nombre: 'Razonamiento abstracto', color: '#B25FD3', icono: 'formas' },
    lenguaje: { nombre: 'Lenguaje', color: '#4577E0', icono: 'libro' }
  };
  const GENERAL = { nombre: 'General', color: '#8854D0', icono: 'diana' };

  // XP y niveles (idea de CIDEA Jóvenes)
  const XP = { porPctLaminas: 3, porEstrella: 20, porPuntoExamen: 8, porPuntoEval: 2 };
  const NIVELES = [
    { nombre: 'Aspirante', desde: 0 },
    { nombre: 'Explorador', desde: 150 },
    { nombre: 'Estudiante', desde: 400 },
    { nombre: 'Destacado', desde: 800 },
    { nombre: 'Pre-universitario', desde: 1300 },
    { nombre: 'Universitario', desde: 1900 }
  ];
  const META_EXAMEN = 18, TOTAL_EXAMEN = 25, META_EVAL = 60, PARADAS = 6;
  const CLAVE = 'campus_v1';   // nombre técnico: las clases lo leen para no repetir el registro

  // =====================================================================
  // 2. Utilidades
  // =====================================================================
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const num = (v) => { const n = Number(v); return isFinite(n) ? n : 0; };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fmt = (n) => Math.round(n).toLocaleString('es-EC');

  function leer(k) { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : null; } catch (e) { return null; } }
  function escribir(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  function obj(x) { return x && typeof x === 'object' && !Array.isArray(x) ? x : {}; }
  function tiempo(x) { const t = Date.parse(x); return isFinite(t) ? t : 0; }

  function campus() { return obj(leer(CLAVE)); }
  function guardarCampus(c) { escribir(CLAVE, c); }

  function usuarioValido(u) { return !!(u && typeof u === 'object' && typeof u.nombre === 'string' && u.nombre.trim() && typeof u.correo === 'string' && u.correo.trim()); }

  // Registro único: campus_v1 manda; si no existe, se adopta el de una clase del cronograma.
  function usuario() {
    const c = campus();
    if (usuarioValido(c.usuario)) return c.usuario;
    for (const cl of CRONOGRAMA) {
      if (!cl.clave) continue;
      const s = obj(leer(cl.clave));
      if (usuarioValido(s.usuario)) {
        const u = { nombre: s.usuario.nombre.trim(), correo: s.usuario.correo.trim() };
        c.usuario = u; if (!c.creado) c.creado = new Date().toISOString();
        guardarCampus(c);
        return u;
      }
    }
    return null;
  }
  function primerNombre(u) {
    const n = ((u && u.nombre) || '').trim().split(/\s+/)[0] || '';
    return n ? n.charAt(0).toUpperCase() + n.slice(1).toLowerCase() : '';
  }
  function iniciales(u) {
    const p = ((u && u.nombre) || '').trim().split(/\s+/).filter(Boolean);
    return ((p[0] || '?').charAt(0) + (p.length > 2 ? p[2] : p[1] || '').charAt(0)).toUpperCase();
  }
  function fechaCorta(iso) {
    const t = tiempo(iso); if (!t) return '';
    try { return new Date(t).toLocaleDateString('es-EC', { day: 'numeric', month: 'short' }).replace('.', ''); } catch (e) { return ''; }
  }
  function fechaLarga(ymd) {
    const p = String(ymd || '').split('-').map(Number);
    if (p.length !== 3 || !p[0]) return ymd;
    try { return new Date(p[0], p[1] - 1, p[2]).toLocaleDateString('es-EC', { day: 'numeric', month: 'long' }); } catch (e) { return ymd; }
  }
  function hoyYMD() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function duracion(ms) {
    const m = Math.round(num(ms) / 60000);
    if (m < 1) return '0 min';
    if (m < 60) return m + ' min';
    const h = Math.floor(m / 60), r = m % 60;
    return h + ' h' + (r ? ' ' + r + ' min' : '');
  }
  function corto(cl) { return cl.corto || String(cl.titulo || '').split(':')[0]; }
  function materia(k) { return MATERIAS[k] || GENERAL; }
  function estiloMateria(k) { const m = materia(k); return '--c:' + m.color + ';--c-barra:' + (m.barra || m.color); }

  // =====================================================================
  // 3. Íconos propios (SVG en línea, trazo = currentColor)
  // =====================================================================
  const P = {
    flecha: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    play: '<path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none"/>',
    candado: '<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    estrella: '<path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z" fill="currentColor" stroke-linejoin="round"/>',
    tabla: '<rect x="3" y="4" width="4" height="4" rx="1"/><rect x="17" y="4" width="4" height="4" rx="1"/><rect x="3" y="10" width="4" height="4" rx="1"/><rect x="8.5" y="12" width="3" height="3" rx=".8"/><rect x="12.5" y="12" width="3" height="3" rx=".8"/><rect x="17" y="10" width="4" height="4" rx="1"/><rect x="3" y="16" width="4" height="4" rx="1"/><rect x="8.5" y="16.5" width="3" height="3" rx=".8"/><rect x="12.5" y="16.5" width="3" height="3" rx=".8"/><rect x="17" y="16" width="4" height="4" rx="1"/>',
    atomo: '<circle cx="12" cy="12" r="1.8" fill="currentColor"/><ellipse cx="12" cy="12" rx="9.5" ry="3.8"/><ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(-60 12 12)"/>',
    gota: '<path d="M12 3.5s-6 6.6-6 11a6 6 0 0 0 12 0c0-4.4-6-11-6-11z"/><path d="M9.5 15.5a2.6 2.6 0 0 0 2.5 2"/>',
    juego: '<rect x="2.5" y="7" width="19" height="11" rx="5.5"/><path d="M7.5 10.5v4M5.5 12.5h4"/><circle cx="15.5" cy="11.5" r="1" fill="currentColor"/><circle cx="17.5" cy="13.8" r="1" fill="currentColor"/>',
    matraz: '<path d="M9.5 3.5h5M10.5 3.5v5.2L5 18.3A1.8 1.8 0 0 0 6.6 21h10.8a1.8 1.8 0 0 0 1.6-2.7L13.5 8.7V3.5"/><path d="M7.4 15h9.2"/>',
    calculadora: '<rect x="5" y="2.5" width="14" height="19" rx="2.5"/><rect x="8" y="5.5" width="8" height="4" rx="1"/><path d="M8.5 13.5h.01M12 13.5h.01M15.5 13.5h.01M8.5 17.5h.01M12 17.5h.01M15.5 17.5h.01" stroke-width="2.6"/>',
    adn: '<path d="M7 3c0 6 10 6 10 12s-10 6-10 6M17 3c0 6-10 6-10 12M17 21c0-2-.8-3.3-2-4.3"/><path d="M8.5 7h7M8.5 17h7"/>',
    corazon: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.6 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/><path d="M7 12h3l1.3-2.3L13 14l1-2h3"/>',
    globo: '<path d="M20 11.5a7.5 7 0 0 1-10.6 6.4L4 19.5l1.6-4.2A7.5 7 0 1 1 20 11.5z"/>',
    numeral: '<path d="M9.5 4 8 20M16 4l-1.5 16M4.5 9h15M4 15h15"/>',
    foco: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>',
    formas: '<circle cx="7.5" cy="7.5" r="4"/><rect x="13" y="13" width="8" height="8" rx="1.5"/><path d="M17 3.5l4 6.5h-8z"/>',
    libro: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
    foto: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5-5-8 8"/>',
    diana: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/>',
    sol: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    luna: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    trofeo: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8.5 20h7M10 17h4"/>',
    chispa: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
    rayo: '<path d="M13 2.5 4.5 13.5H11l-1 8 8.5-11H12z" fill="currentColor" stroke-linejoin="round"/>',
    laminas: '<rect x="3" y="6" width="14" height="12" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v10"/>',
    examen: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3.5V5h6V3.5M8.5 11l1.5 1.5 3-3M8.5 16.5h7"/>',
    cohete: '<path d="M13.5 4.5c3-1.5 6-1.5 6-1.5s0 3-1.5 6l-6 6-4.5-4.5z"/><path d="M8.5 11.5 5 11l-2 3 4 .5M12.5 15.5 13 19l-3 2-.5-4"/><circle cx="15" cy="9" r="1.3" fill="currentColor"/>'
  };
  function ico(n, cls) { return '<svg class="ico' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (P[n] || '') + '</svg>'; }

  // =====================================================================
  // 4. Lectura del avance
  // =====================================================================
  function avanceClase(cl, abiertos) {
    const id = 'clase-' + cl.n;
    const hoy = hoyYMD();
    const bloqueada = !!cl.proximamente || !cl.url || (cl.abre && cl.abre > hoy);
    const base = { cl, id, bloqueada, proximamente: !!cl.proximamente, abreFecha: !cl.proximamente && cl.abre && cl.abre > hoy ? cl.abre : null };
    if (cl.proximamente || !cl.clave) return Object.assign(base, { empezo: false, terminado: false, xpTotal: 0, estrellas: 0, tiempoMs: 0, actividad: 0, reforzar: [], fase: 'bloqueada', pctL: 0 });

    const raw = leer(cl.clave);
    const s = obj(raw), lam = obj(s.laminas), jg = obj(s.juego), niv = obj(jg.niveles), ts = obj(s.test), t = obj(s.tiempos);
    const total = cl.totalLaminas || 1;
    const maxA = num(lam.maxAlcanzada);
    const empezo = !!raw && (!!lam.completadas || maxA > 0 || num(lam.actual) > 0);
    const pctL = lam.completadas ? 100 : empezo ? clamp(Math.round((maxA + 1) / total * 100), 0, 99) : 0;
    let superadas = 0, estrellas = 0;
    const reforzar = [];
    for (let k = 1; k <= PARADAS; k++) {
      const nv = obj(niv[k]);
      if (nv.estado === 'superado' || nv.estado === 'reforzar') superadas++;
      if (nv.estado === 'reforzar') reforzar.push(k);
      estrellas += clamp(num(nv.estrellas), 0, 3);
    }
    const of = ts.oficialTerminado ? obj(ts.oficial) : null;
    const nota = of && of.nota != null && isFinite(Number(of.nota)) ? clamp(Number(of.nota), 0, TOTAL_EXAMEN) : null;
    const examenHecho = nota != null;
    const cap = clamp((Array.isArray(lam.capsCerrados) ? lam.capsCerrados.length : 0) + 1, 1, cl.capitulos || 1);
    const paradaMax = clamp(num(jg.paradaMax) || 1, 1, PARADAS);
    const juegoEmpezado = superadas > 0 || num(jg.tiempoActivoMs) > 0 || !!jg.ultimaSesion;
    const examenEnCurso = !examenHecho && ts.modo !== 'PRACTICA' && (ts.fase === 'preg' || ts.fase === 'revision');

    // Actividad más reciente que se pueda saber (clics desde el Campus, juego, envíos, registro)
    let act = Math.max(tiempo(jg.ultimaSesion), tiempo(s.registroFecha), empezo ? tiempo(s.creado) : 0, tiempo(obj(abiertos)[id]));
    (Array.isArray(s.colaEnvios) ? s.colaEnvios : []).forEach(e => { act = Math.max(act, tiempo(e && e.fecha)); });

    let fase, estado, cta, url = cl.url;
    if (bloqueada) { fase = 'bloqueada'; estado = 'Se abre el ' + fechaLarga(cl.abre); cta = ''; }
    else if (!empezo) { fase = 'nueva'; estado = 'Nueva'; cta = 'Empezar'; }
    else if (!lam.completadas) { fase = 'laminas'; estado = 'En curso · cap. ' + cap; cta = 'Continuar'; url = cl.url + '?ir=laminas'; }
    else if (!examenHecho && superadas < PARADAS && !jg.testDesbloqueado) { fase = 'juego'; estado = 'Juego · parada ' + paradaMax + ' de ' + PARADAS; cta = juegoEmpezado ? 'Continuar' : 'Ir al juego'; url = cl.url + '?ir=juego'; }
    else if (!examenHecho) { fase = 'examen'; estado = examenEnCurso ? 'Examen en curso' : 'Examen pendiente'; cta = 'Ir al examen'; url = cl.url + '?ir=test'; }
    else { fase = 'hecha'; estado = 'Examen ' + fmt(nota) + '/' + TOTAL_EXAMEN + (nota >= META_EXAMEN ? ' ✓' : ' · a reforzar'); cta = 'Repasar'; url = cl.url; }

    // Tres mini-indicadores del formato de toda clase
    const ind = [
      { n: 'Láminas', icono: 'laminas', v: pctL, est: lam.completadas ? 'hecho' : empezo ? 'curso' : 'pend', txt: lam.completadas ? 'Hecho' : empezo ? pctL + ' %' : 'Pendiente' },
      { n: 'Juego', icono: 'juego', v: Math.round(superadas / PARADAS * 100), est: superadas >= PARADAS ? 'hecho' : (superadas > 0 || (lam.completadas && juegoEmpezado)) ? 'curso' : 'pend', txt: superadas >= PARADAS ? 'Hecho' : superadas > 0 ? superadas + '/' + PARADAS : 'Pendiente' },
      { n: 'Examen', icono: 'examen', v: examenHecho ? Math.round(nota / TOTAL_EXAMEN * 100) : 0, est: examenHecho ? (nota >= META_EXAMEN ? 'hecho' : 'bajo') : examenEnCurso ? 'curso' : 'pend', txt: examenHecho ? fmt(nota) + '/' + TOTAL_EXAMEN : examenEnCurso ? 'En curso' : 'Pendiente' }
    ];
    const xp = { laminas: pctL * XP.porPctLaminas, estrellas: estrellas * XP.porEstrella, examen: examenHecho ? nota * XP.porPuntoExamen : 0 };
    return Object.assign(base, {
      empezo, pctL, superadas, estrellas, reforzar, nota, examenHecho, fase, estado, cta, url, ind,
      terminado: fase === 'hecha', lamHechas: !!lam.completadas, actividad: act,
      tiempoMs: num(t.laminas) + num(t.juego) + num(t.test),
      xpTotal: xp.laminas + xp.estrellas + xp.examen
    });
  }

  function avanceEval(ev, abiertos) {
    const d = obj(leer(ev.clave));
    const tiene = d.puntaje != null && d.puntaje !== '' && isFinite(Number(d.puntaje));
    const p = tiene ? clamp(Math.round(Number(d.puntaje)), 0, 100) : null;
    return {
      ev, id: ev.id, empezo: tiene, puntaje: p, fecha: d.fecha || null,
      actividad: Math.max(tiempo(d.fecha), tiempo(obj(abiertos)[ev.id])),
      xpTotal: tiene ? p * XP.porPuntoEval : 0
    };
  }

  function datos() {
    const c = campus(), abiertos = obj(c.abiertos);
    const clases = CRONOGRAMA.slice().sort((a, b) => a.n - b.n).map(cl => avanceClase(cl, abiertos));
    const evals = EVALUACIONES.map(ev => avanceEval(ev, abiertos));
    const reales = clases.filter(a => !a.proximamente);
    const xp = clases.reduce((s, a) => s + a.xpTotal, 0) + evals.reduce((s, a) => s + a.xpTotal, 0);
    let i = 0; while (i + 1 < NIVELES.length && xp >= NIVELES[i + 1].desde) i++;
    return {
      clases, evals, xp, nivel: i,
      estrellas: reales.reduce((s, a) => s + a.estrellas, 0), estrellasMax: reales.filter(a => !a.bloqueada).length * PARADAS * 3,
      clasesHechas: reales.filter(a => a.terminado).length, clasesTotal: reales.length,
      tiempoMs: reales.reduce((s, a) => s + a.tiempoMs, 0),
      nuevo: !clases.some(a => a.empezo) && !evals.some(a => a.empezo)
    };
  }

  // «Continuar donde ibas»: la clase a medias con actividad más reciente; si no, la primera del cronograma sin terminar.
  function siguiente(D) {
    const pend = D.clases.filter(a => !a.bloqueada && !a.terminado);
    const aMedias = pend.filter(a => a.empezo).sort((a, b) => b.actividad - a.actividad);
    return aMedias[0] || pend[0] || null;
  }

  // Entrenar mis debilidades: solo recomienda clases del cronograma.
  function debilidades(D) {
    const out = [];
    D.clases.forEach(a => {
      if (a.bloqueada || !a.empezo) return;
      const cl = a.cl, nombre = corto(cl);
      if (a.examenHecho && a.nota < META_EXAMEN) out.push({ prio: a.nota / TOTAL_EXAMEN * 100, a, titulo: nombre, motivo: 'Sacaste ' + fmt(a.nota) + '/' + TOTAL_EXAMEN + ' en el examen de la clase ' + cl.n + ' (la meta es ' + META_EXAMEN + '). Repasa las láminas y vuelve al juego antes de intentarlo otra vez.', url: cl.url + '?ir=laminas', cta: 'Repasar la clase ' + cl.n });
      else if (a.reforzar.length) out.push({ prio: 55, a, titulo: nombre, motivo: (a.reforzar.length === 1 ? 'La parada ' + a.reforzar[0] + ' del juego quedó' : 'Las paradas ' + a.reforzar.join(', ') + ' del juego quedaron') + ' «por reforzar».', url: cl.juego || cl.url, cta: 'Reforzar en el juego' });
      else if (!a.terminado) out.push({ prio: 80 + a.pctL / 10, a, titulo: nombre, motivo: 'La clase ' + cl.n + ' quedó a medias (' + a.estado.toLowerCase() + '). Terminarla es lo que más XP te da ahora.', url: a.url, cta: 'Terminar la clase ' + cl.n });
    });
    // Un diagnóstico bajo apunta a la clase del cronograma de esa materia
    D.evals.forEach(e => {
      if (!e.empezo || e.puntaje >= META_EVAL || !e.ev.materia) return;
      const a = D.clases.find(x => !x.bloqueada && x.cl.materia === e.ev.materia);
      if (!a || out.some(o => o.a === a)) return;
      out.push({ prio: e.puntaje, a, titulo: corto(a.cl), motivo: 'En el ' + e.ev.titulo + ' sacaste ' + e.puntaje + ' %. La clase ' + a.cl.n + ' cubre esa base.', url: a.url, cta: (a.empezo ? 'Continuar' : 'Empezar') + ' la clase ' + a.cl.n });
    });
    return out.sort((x, y) => x.prio - y.prio);
  }

  // Resultados medidos (gráfico «Tus resultados»)
  function resultados(D) {
    const r = [];
    D.clases.forEach(a => { if (a.examenHecho) r.push({ id: a.id, nombre: 'Examen · clase ' + a.cl.n, valor: Math.round(a.nota / TOTAL_EXAMEN * 100), detalle: fmt(a.nota) + '/' + TOTAL_EXAMEN, meta: Math.round(META_EXAMEN / TOTAL_EXAMEN * 100) }); });
    D.evals.forEach(e => { if (e.empezo) r.push({ id: e.id, nombre: e.ev.titulo.replace('Simulador de admisión', 'Simulador'), valor: e.puntaje, detalle: e.puntaje + ' %' + (e.fecha ? ' · ' + fechaCorta(e.fecha) : ''), meta: META_EVAL }); });
    return r;
  }

  // =====================================================================
  // 5. Pintado
  // =====================================================================
  function meterSimple(pct, etiqueta, cls) {
    return '<div class="meter' + (cls ? ' ' + cls : '') + '" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '" aria-label="' + esc(etiqueta) + '"><span style="width:' + pct + '%"></span></div>';
  }
  function pildoraMateria(k) {
    const m = materia(k);
    return '<span class="pildora pildora-materia" style="' + estiloMateria(k) + '"><span class="punto" aria-hidden="true"></span>' + esc(k ? m.nombre : 'Próximamente') + '</span>';
  }

  function frase(D, sig) {
    if (D.nuevo) return 'Soy Ignacio, tu tutor. Sigue la ruta clase por clase: cada una se guarda sola y puedes seguir mañana.';
    if (!sig) return '¡Terminaste todas las clases abiertas! Repasa tus resúmenes y ponte a prueba en «Evalúate». Pronto llega la siguiente.';
    if (D.clasesHechas > 0) return 'Ya terminaste ' + D.clasesHechas + (D.clasesHechas === 1 ? ' clase' : ' clases') + '. Sigue así: 20 minutos hoy marcan la diferencia.';
    return 'Vas bien. Sigue donde lo dejaste: 20 minutos hoy marcan la diferencia.';
  }

  function anilloNivel(D) {
    const nv = NIVELES[D.nivel], prox = NIVELES[D.nivel + 1];
    const pct = prox ? clamp((D.xp - nv.desde) / (prox.desde - nv.desde), 0, 1) : 1;
    const r = 30, circ = 2 * Math.PI * r;
    const etiqueta = 'Nivel ' + (D.nivel + 1) + ' de ' + NIVELES.length + ': ' + nv.nombre + (prox ? ', ' + Math.round(pct * 100) + ' % hacia ' + prox.nombre : ', nivel máximo');
    return '<div class="anillo-nivel">' +
      '<svg class="anillo" viewBox="0 0 80 80" width="70" height="70" role="img" aria-label="' + esc(etiqueta) + '">' +
        '<circle class="anillo-pista" cx="40" cy="40" r="' + r + '" fill="none" stroke-width="7"/>' +
        (pct > 0 ? '<circle class="anillo-valor" cx="40" cy="40" r="' + r + '" fill="none" stroke-width="7" stroke-linecap="round" stroke-dasharray="' + (circ * pct).toFixed(1) + ' ' + circ.toFixed(1) + '" transform="rotate(-90 40 40)"/>' : '') +
        '<text class="anillo-num" x="40" y="37" text-anchor="middle" dominant-baseline="central">' + (D.nivel + 1) + '</text>' +
        '<text class="anillo-eti" x="40" y="54" text-anchor="middle">nivel</text>' +
      '</svg>' +
      '<div class="anillo-txt"><p class="nivel-titulo">' + nv.nombre + '</p>' +
        '<div class="meter meter-nivel" aria-hidden="true"><span style="width:' + Math.round(pct * 100) + '%"></span></div>' +
        '<p class="nivel-xp-txt">' + (prox ? fmt(D.xp - nv.desde) + ' / ' + fmt(prox.desde - nv.desde) + ' XP · sigue ' + prox.nombre : '¡Nivel máximo alcanzado!') + '</p></div>' +
    '</div>';
  }

  function pintarHero(D, u) {
    const sig = siguiente(D);
    const nv = NIVELES[D.nivel], prox = NIVELES[D.nivel + 1];
    const deb = debilidades(D);
    let cta;
    if (sig) {
      const etiqueta = D.nuevo ? 'Empezar la clase ' + sig.cl.n : 'Continuar donde ibas';
      cta = '<a class="btn btn-hero" href="' + esc(sig.url) + '" data-abre="' + sig.id + '">' +
        '<span class="btn-hero-ico">' + ico('play') + '</span>' +
        '<span class="btn-hero-txt"><b>' + etiqueta + '</b><span>Clase ' + sig.cl.n + ' · ' + esc(corto(sig.cl)) + (sig.empezo ? ' · ' + esc(sig.estado) : '') + '</span></span>' +
        ico('flecha', 'ico-fin') + '</a>';
    } else {
      cta = '<a class="btn btn-hero" href="#evaluate"><span class="btn-hero-ico">' + ico('trofeo') + '</span><span class="btn-hero-txt"><b>Ponte a prueba</b><span>Todas las clases abiertas están listas</span></span>' + ico('flecha', 'ico-fin') + '</a>';
    }
    const botonDebil = deb.length
      ? '<a class="btn-debil" href="' + esc(deb[0].url) + '" data-abre="' + deb[0].a.id + '">' + ico('rayo') + '<span>Entrenar mis debilidades — empieza por <b>' + esc(deb[0].titulo) + '</b></span></a>'
      : '';

    const filasNivel = NIVELES.map((n, i) => '<tr' + (i === D.nivel ? ' class="actual"' : '') + '><td>' + (i + 1) + '</td><td>' + n.nombre + (i === D.nivel ? ' <span class="tu">· tú</span>' : '') + '</td><td>' + fmt(n.desde) + ' XP</td></tr>').join('');
    const filasXp = D.clases.filter(a => a.xpTotal > 0).map(a => '<li><span>Clase ' + a.cl.n + ' · ' + esc(corto(a.cl)) + '</span><b>' + fmt(a.xpTotal) + ' XP</b></li>').join('') +
      D.evals.filter(a => a.xpTotal > 0).map(a => '<li><span>' + esc(a.ev.titulo) + '</span><b>' + fmt(a.xpTotal) + ' XP</b></li>').join('');

    $('#hero').innerHTML =
      '<div class="hero-cab">' +
        '<div><h1 id="saludo">Hola, ' + esc(primerNombre(u)) + '</h1><p class="hero-sub">' + (D.nuevo ? 'Bienvenido a CIDEA Jóvenes. Tu ruta empieza aquí' : 'Sigue tu ruta de clases') + '</p></div>' +
        anilloNivel(D) +
      '</div>' +
      botonDebil +
      '<div class="hero-grid">' +
        '<div class="guia">' +
          '<div class="guia-top">' +
            '<img class="avatar" src="img/ignacio-busto.webp" width="520" height="520" alt="Ignacio, tu tutor, con buzo morado y la bandera de Ecuador">' +
            '<div><p class="guia-eti">Tu guía · Ignacio</p><p class="guia-frase">' + frase(D, sig) + '</p></div>' +
          '</div>' +
          cta +
        '</div>' +
        '<div class="progreso" aria-labelledby="t-progreso">' +
          '<div class="progreso-cab"><h2 id="t-progreso" class="eti">Tu progreso</h2><span class="pildora pildora-morado">Nivel ' + (D.nivel + 1) + ' · ' + nv.nombre + '</span></div>' +
          '<p class="xp-hero"><b>' + fmt(D.xp) + '</b> XP</p>' +
          '<p class="xp-falta">' + (prox ? 'Te faltan <b>' + fmt(prox.desde - D.xp) + ' XP</b> para ser <b>' + prox.nombre + '</b>' : '¡Llegaste al nivel más alto!') + '</p>' +
          '<ul class="tiles">' +
            '<li class="tile">' + ico('trofeo') + '<span class="tile-eti">Clases terminadas</span><span class="tile-val">' + D.clasesHechas + '<small> de ' + D.clasesTotal + '</small></span></li>' +
            '<li class="tile">' + ico('estrella', 'ico-oro') + '<span class="tile-eti">Estrellas</span><span class="tile-val">' + D.estrellas + '<small> de ' + D.estrellasMax + '</small></span></li>' +
            '<li class="tile">' + ico('reloj') + '<span class="tile-eti">Tiempo de estudio</span><span class="tile-val">' + duracion(D.tiempoMs) + '</span></li>' +
          '</ul>' +
          '<details class="como-xp"><summary>¿Cómo gano XP?</summary>' +
            '<ul class="reglas">' +
              '<li><b>+' + XP.porPctLaminas + ' XP</b> por cada 1 % de láminas que avances en una clase</li>' +
              '<li><b>+' + XP.porEstrella + ' XP</b> por cada estrella del juego (hasta 18 por clase)</li>' +
              '<li><b>+' + XP.porPuntoExamen + ' XP</b> por cada acierto en el examen de la clase (de ' + TOTAL_EXAMEN + ')</li>' +
              '<li><b>+' + XP.porPuntoEval + ' XP</b> por cada punto de tu puntaje en diagnósticos y simulador (último intento)</li>' +
            '</ul>' +
            (filasXp ? '<p class="mini-t">De dónde viene tu XP</p><ul class="xp-desglose">' + filasXp + '</ul>' : '') +
            '<table class="tabla-niveles"><caption>Los 6 niveles</caption><thead><tr><th scope="col">#</th><th scope="col">Nivel</th><th scope="col">Desde</th></tr></thead><tbody>' + filasNivel + '</tbody></table>' +
          '</details>' +
        '</div>' +
      '</div>';
  }

  function nodoRuta(a, sig) {
    const cl = a.cl, actual = sig && sig.id === a.id;
    const tituloCorto = cl.titulo;
    const img = '<div class="paso-img"><img src="' + esc(cl.img) + '" alt="' + esc(cl.alt || '') + '" width="640" height="640" loading="lazy" decoding="async"></div>';
    let estadoNodo = a.proximamente || a.bloqueada ? 'bloq' : a.terminado ? 'hecha' : actual ? 'actual' : a.empezo ? 'curso' : 'pend';
    const marcaNodo = estadoNodo === 'hecha' ? ico('check') : estadoNodo === 'bloq' ? ico('candado') : String(cl.n);
    const nodo = '<span class="nodo nodo-' + estadoNodo + '" aria-hidden="true">' + marcaNodo + '</span>';

    if (a.proximamente) {
      return '<li class="paso paso-bloq paso-prox">' + nodo +
        '<article class="paso-card" aria-label="Clase ' + cl.n + ': próximamente">' + img +
        '<div class="paso-cuerpo"><div class="paso-meta"><span class="paso-num">Clase ' + cl.n + '</span>' + pildoraMateria(null) + '</div>' +
        '<h3>' + esc(cl.titulo) + '</h3><p class="paso-nota">' + ico('cohete') + ' Ignacio la está preparando. Aparecerá aquí.</p></div></article></li>';
    }
    if (a.bloqueada) {
      return '<li class="paso paso-bloq">' + nodo +
        '<article class="paso-card" aria-labelledby="c-' + cl.n + '">' + img +
        '<div class="paso-cuerpo"><div class="paso-meta"><span class="paso-num">Clase ' + cl.n + '</span>' + pildoraMateria(cl.materia) + '</div>' +
        '<h3 id="c-' + cl.n + '">' + esc(tituloCorto) + '</h3><p class="paso-nota">' + ico('candado') + ' Se abre el ' + esc(fechaLarga(cl.abre)) + '</p></div></article></li>';
    }
    const inds = '<ul class="inds" aria-label="Partes de la clase">' + a.ind.map(x =>
      '<li class="ind ind-' + x.est + '"><span class="ind-cab">' + ico(x.icono) + x.n + '</span>' +
      '<span class="meter meter-ind" aria-hidden="true"><span style="width:' + x.v + '%"></span></span>' +
      '<span class="ind-txt">' + (x.est === 'hecho' ? ico('check') : '') + '<span>' + esc(x.txt) + '</span></span>' +
      '<span class="sr">: ' + (x.est === 'hecho' ? 'hecho' : x.est === 'bajo' ? 'hecho, bajo la meta de ' + META_EXAMEN : x.est === 'curso' ? 'en curso' : 'pendiente') + '</span></li>').join('') + '</ul>';
    const principal = !a.terminado;
    return '<li class="paso paso-' + estadoNodo + '" style="' + estiloMateria(cl.materia) + '">' + nodo +
      '<article class="paso-card" aria-labelledby="c-' + cl.n + '">' + img +
      '<div class="paso-cuerpo">' +
        '<div class="paso-meta"><span class="paso-num">Clase ' + cl.n + '</span>' + pildoraMateria(cl.materia) + (actual ? '<span class="pildora pildora-aqui">Vas aquí</span>' : '') + '</div>' +
        '<h3 id="c-' + cl.n + '">' + esc(tituloCorto) + '</h3>' +
        '<p class="paso-estado">' + esc(a.estado) + '</p>' +
        inds +
        '<a class="btn ' + (principal ? 'btn-pri' : 'btn-sec') + '" href="' + esc(a.url) + '" data-abre="' + a.id + '">' + esc(a.cta) + '<span class="sr"> la clase ' + cl.n + '</span>' + ico('flecha') + '</a>' +
      '</div></article></li>';
  }

  function pintarRuta(D) {
    const sig = siguiente(D);
    $('#ruta').innerHTML = D.clases.map(a => nodoRuta(a, sig)).join('');
  }

  function pintarEvaluate(D) {
    $('#lista-evaluate').innerHTML = D.evals.map(e => {
      const m = e.ev.materia ? materia(e.ev.materia) : GENERAL;
      return '<article class="eval" style="' + estiloMateria(e.ev.materia) + '">' +
        '<span class="eval-ico">' + ico(m.icono) + '</span>' +
        '<div class="eval-cuerpo"><h3>' + esc(e.ev.titulo) + '</h3><p class="eval-det">' + esc(e.ev.detalle) + '</p>' +
        (e.empezo
          ? '<div class="eval-res">' + meterSimple(e.puntaje, 'Último intento ' + e.puntaje + ' %') + '<span>Último: <b>' + e.puntaje + ' %</b>' + (e.fecha ? ' · ' + fechaCorta(e.fecha) : '') + '</span></div>'
          : '<p class="eval-vacio">Aún no lo haces</p>') +
        '<a class="btn btn-sec btn-peq" href="' + esc(e.ev.url) + '" data-abre="' + e.id + '">' + (e.empezo ? 'Intentar de nuevo' : 'Empezar') + '<span class="sr"> · ' + esc(e.ev.titulo) + '</span>' + ico('flecha') + '</a>' +
        '</div></article>';
    }).join('');
  }

  function pintarPractica(D) {
    const porN = {}; D.clases.forEach(a => { porN[a.cl.n] = a; });
    const items = [];
    HERRAMIENTAS.forEach(h => items.push({ tipo: 'herr', h, a: porN[h.clase] }));
    D.clases.forEach(a => { if (a.cl.juego && !a.proximamente) items.push({ tipo: 'juego', a }); });
    $('#lista-practica').innerHTML = items.map(it => {
      const a = it.a; if (!a) return '';
      const cl = a.cl, origen = 'De la clase ' + cl.n + ' · ' + esc(corto(cl));
      const titulo = it.tipo === 'juego' ? (cl.nombreJuego || 'Juego de la clase ' + cl.n) : it.h.titulo;
      const desc = it.tipo === 'juego' ? '6 paradas para practicar lo de la clase, con estrellas.' : it.h.desc;
      const url = it.tipo === 'juego' ? cl.juego : it.h.url;
      const icono = it.tipo === 'juego' ? 'juego' : it.h.icono;
      const bloqueo = a.bloqueada ? 'Se abre con la clase ' + cl.n : (it.tipo === 'juego' && !a.lamHechas) ? 'Se abre al terminar las láminas' : '';
      if (bloqueo) {
        return '<div class="herr herr-bloq" style="' + estiloMateria(cl.materia) + '">' +
          '<span class="herr-ico">' + ico('candado') + '</span>' +
          '<span class="herr-txt"><span class="herr-origen">' + origen + '</span><b>' + esc(titulo) + '</b><span>' + bloqueo + '</span>' +
          (a.bloqueada ? '' : '<a class="enlace" href="' + esc(cl.url + (a.empezo ? '?ir=laminas' : '')) + '" data-abre="' + a.id + '">Ir a las láminas (' + a.pctL + ' %)</a>') + '</span></div>';
      }
      return '<a class="herr" href="' + esc(url) + '" data-abre="' + a.id + '" style="' + estiloMateria(cl.materia) + '">' +
        '<span class="herr-ico">' + ico(icono) + '</span>' +
        '<span class="herr-txt"><span class="herr-origen">' + origen + '</span><b>' + esc(titulo) + '</b><span>' + esc(desc) + '</span></span>' + ico('flecha', 'ico-fin') + '</a>';
    }).join('');
  }

  // Lee practica_v1 sin conocer su forma: solo muestra datos si los encuentra claros.
  function datosPracticaLibre() {
    const p = obj(leer(PRACTICA_LIBRE.clave));
    const n = (v) => (typeof v === 'number' && isFinite(v) && v >= 0) ? v : null;
    const cuenta = (v) => Array.isArray(v) ? v.length : (v && typeof v === 'object') ? Object.keys(v).length : null;
    const xp = [p.xp, p.xpTotal, obj(p.stats).xp, obj(p.perfil).xp, obj(p.progreso).xp].map(n).find(v => v != null);
    const porMateria = {};
    PRACTICA_LIBRE.materias.forEach(m => {
      const k = m.materia;
      const cands = [obj(obj(p.materias)[k]).temas, obj(p.temas)[k], obj(obj(p.progreso)[k]).temas, obj(p[k]).temas];
      const c = cands.map(cuenta).find(v => v != null && v > 0);
      if (c) porMateria[k] = c;
    });
    let temas = null;
    if (!Object.keys(porMateria).length) {
      const t = cuenta(p.temas);
      if (t && !PRACTICA_LIBRE.materias.some(m => m.materia in obj(p.temas))) temas = t;
    }
    return { xp: xp != null ? xp : null, porMateria, temas };
  }

  function pintarLibre() {
    const P = datosPracticaLibre();
    const resumen = P.xp != null ? '<p class="libre-dato">' + ico('rayo') + ' Llevas <b>' + fmt(P.xp) + ' XP</b> de práctica libre</p>'
      : P.temas ? '<p class="libre-dato">' + ico('check') + ' Has practicado <b>' + P.temas + (P.temas === 1 ? ' tema' : ' temas') + '</b></p>' : '';
    $('#lista-libre').innerHTML = PRACTICA_LIBRE.materias.map(m => {
      const mt = materia(m.materia), c = P.porMateria[m.materia];
      return '<a class="libre" href="' + esc(PRACTICA_LIBRE.url + '?materia=' + encodeURIComponent(m.materia)) + '" data-abre="libre-' + m.materia + '" style="' + estiloMateria(m.materia) + '">' +
        '<span class="libre-ico">' + ico(mt.icono) + '</span>' +
        '<span class="herr-txt"><b>' + esc(mt.nombre) + '</b><span>' + esc(m.desc) + '</span>' +
        (c ? '<small>' + c + (c === 1 ? ' tema practicado' : ' temas practicados') + '</small>' : '') + '</span>' + ico('flecha', 'ico-fin') + '</a>';
    }).join('') + resumen;
  }

  function pintarRepasar(D) {
    const conResumen = D.clases.filter(a => a.cl.resumen && !a.proximamente && !a.bloqueada);
    // El resumen se abre al terminar las láminas: entrar antes por ?lamina= adelantaría el avance de la clase.
    $('#lista-resumenes').innerHTML = conResumen.length ? conResumen.map(a => {
      if (!a.lamHechas) {
        return '<div class="herr herr-bloq" style="' + estiloMateria(a.cl.materia) + '">' +
          '<span class="herr-ico">' + ico('candado') + '</span>' +
          '<span class="herr-txt"><span class="herr-origen">Clase ' + a.cl.n + ' · ' + esc(materia(a.cl.materia).nombre) + '</span><b>Resumen en una foto</b><span>Se abre al terminar las láminas</span>' +
          '<a class="enlace" href="' + esc(a.cl.url + (a.empezo ? '?ir=laminas' : '')) + '" data-abre="' + a.id + '">Ir a las láminas (' + a.pctL + ' %)</a></span></div>';
      }
      const nota = 'Ya viste esta clase';
      return '<a class="herr resumen" href="' + esc(a.cl.resumen) + '" data-abre="' + a.id + '" style="' + estiloMateria(a.cl.materia) + '">' +
        '<span class="herr-ico">' + ico('foto') + '</span>' +
        '<span class="herr-txt"><span class="herr-origen">Clase ' + a.cl.n + ' · ' + esc(materia(a.cl.materia).nombre) + '</span><b>Resumen en una foto</b><span>' + esc(a.cl.titulo) + '</span><small>' + nota + '</small></span>' + ico('flecha', 'ico-fin') + '</a>';
    }).join('') : '<p class="vacio">Los resúmenes aparecen cuando se abre cada clase.</p>';

    const deb = debilidades(D), res = resultados(D);
    let cab;
    if (deb.length) {
      const w = deb[0];
      cab = '<p class="debil-eti">' + ico('diana') + ' Entrenar mis debilidades</p><h3>Te conviene reforzar: ' + esc(w.titulo) + '</h3><p class="debil-motivo">' + esc(w.motivo) + '</p>' +
        '<a class="btn btn-pri btn-ancho" href="' + esc(w.url) + '" data-abre="' + w.a.id + '">' + ico('rayo') + esc(w.cta) + '</a>';
    } else if (res.length || D.clasesHechas) {
      cab = '<p class="debil-eti">' + ico('diana') + ' Entrenar mis debilidades</p><h3>¡Vas muy bien!</h3><p class="debil-motivo">Ninguna clase está por debajo de la meta. Repasa los resúmenes o ponte a prueba en «Evalúate».</p>';
    } else {
      cab = '<p class="debil-eti">' + ico('diana') + ' Entrenar mis debilidades</p><h3>Aún no hay nada que reforzar</h3><p class="debil-motivo">Cuando avances en una clase o hagas su examen, aquí te diré qué conviene repasar primero.</p>';
    }
    let cuerpo = '';
    if (res.length) {
      const peor = deb.length ? res.slice().sort((x, y) => (x.valor - x.meta) - (y.valor - y.meta))[0] : null;
      cuerpo = '<div class="barras"><p class="mini-t" id="t-res">Tus resultados (0–100 %)</p>' +
        '<ul class="barras-lista" aria-labelledby="t-res">' + res.map(r => {
          const bajo = r.valor < r.meta;
          return '<li class="barra-fila' + (peor === r && bajo ? ' foco' : '') + '" tabindex="0" data-tip="' + esc(r.nombre + ' · ' + r.detalle + ' · meta ' + r.meta + ' %') + '">' +
            '<span class="barra-n">' + esc(r.nombre) + '</span>' +
            '<span class="barra-pista"><span class="barra-v" style="width:' + Math.max(r.valor, 1) + '%"></span><span class="barra-meta" style="left:' + r.meta + '%" aria-hidden="true"></span></span>' +
            '<span class="barra-num">' + r.valor + ' %' + (bajo ? '<span class="sr"> (bajo la meta de ' + r.meta + ' %)</span>' : '') + '</span></li>';
        }).join('') + '</ul><p class="barras-ley"><span class="ley-meta" aria-hidden="true"></span> Meta: 72 % en exámenes (18/25) y 60 % en diagnósticos</p></div>';
    }
    $('#debilidades').innerHTML = '<div class="debil-cab">' + cab + '</div>' + cuerpo;
  }

  function pintarPerfil(u) {
    $('#perfil-ini').textContent = iniciales(u);
    $('#aj-ini').textContent = iniciales(u);
    $('#aj-nombre').textContent = u.nombre;
    $('#aj-correo').textContent = u.correo;
  }

  function pintarCampus() {
    const u = usuario();
    if (!u) { mostrarRegistro(false); return; }
    const D = datos();
    pintarHero(D, u); pintarRuta(D); pintarEvaluate(D); pintarLibre(); pintarPractica(D); pintarRepasar(D); pintarPerfil(u);
    $('#registro').hidden = true; $('#campus').hidden = false; $('#nav').hidden = false; $('#btn-ajustes').hidden = false;
  }

  // =====================================================================
  // 6. Registro único
  // =====================================================================
  const DOMINIOS = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com', 'live.com', 'yahoo.es', 'hotmail.es', 'outlook.es'];
  function distancia(a, b) {
    const m = a.length, n = b.length, d = Array.from({ length: m + 1 }, (_, i) => [i].concat(Array(n).fill(0)));
    for (let j = 1; j <= n; j++) d[0][j] = j;
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[m][n];
  }
  function sugerirCorreo(c) {
    const at = c.lastIndexOf('@'); if (at < 1) return null;
    const dom = c.slice(at + 1).toLowerCase(); if (!dom || DOMINIOS.indexOf(dom) >= 0) return null;
    let mejor = null, dist = 3;
    DOMINIOS.forEach(d => { const x = distancia(dom, d); if (x < dist) { dist = x; mejor = d; } });
    return mejor ? c.slice(0, at + 1) + mejor : null;
  }
  const correoValido = (c) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c);

  function mostrarRegistro(cambiando) {
    const r = $('#registro');
    r.innerHTML =
      '<div class="reg-arte">' +
        '<img class="reg-cuerpo" src="img/ignacio-cuerpo.webp" width="640" height="640" alt="Ignacio, tu tutor, de cuerpo entero con buzo morado">' +
        '<img class="reg-busto" src="img/ignacio-busto.webp" width="520" height="520" alt="">' +
        '<p class="burbuja">' + (cambiando ? '¿Quién va a estudiar ahora? Escribe tus datos.' : '¡Hola! Soy <b>Ignacio</b>. Aquí tienes tu ruta de clases, tu avance y los simuladores en un solo lugar.') + '</p>' +
      '</div>' +
      '<div class="reg-form">' +
        '<h1 id="reg-titulo">' + (cambiando ? 'Cambiar de estudiante' : 'Bienvenido a CIDEA Jóvenes') + '</h1>' +
        '<p class="reg-intro">Solo te lo pedimos una vez. Con estos datos Ignacio puede ver tu avance y ayudarte.</p>' +
        '<form id="f-reg" novalidate>' +
          '<div class="campo"><label for="r-nombre">Tus nombres y apellidos</label><input id="r-nombre" name="nombre" autocomplete="name" required minlength="3" placeholder="María Fernanda López"></div>' +
          '<div class="campo"><label for="r-correo">Tu correo</label><input id="r-correo" name="correo" type="email" autocomplete="email" inputmode="email" required placeholder="maria.lopez@gmail.com" aria-describedby="r-sug r-err"></div>' +
          '<p class="sugerencia" id="r-sug" hidden aria-live="polite"></p>' +
          '<p class="error" id="r-err" role="alert" hidden></p>' +
          '<button type="submit" class="btn btn-pri btn-ancho btn-grande">Entrar' + ico('flecha') + '</button>' +
          (cambiando ? '<button type="button" class="btn btn-txt btn-ancho" id="r-cancelar">Cancelar</button>' : '') +
        '</form>' +
        '<p class="reg-nota">' + ico('check') + ' Tu avance se guarda en este dispositivo.</p>' +
      '</div>';
    r.hidden = false; $('#campus').hidden = true; $('#nav').hidden = true; $('#btn-ajustes').hidden = true;

    const f = $('#f-reg'), inN = $('#r-nombre'), inC = $('#r-correo'), sug = $('#r-sug'), err = $('#r-err');
    function revisar() {
      const s = sugerirCorreo(inC.value.trim());
      if (s) {
        sug.hidden = false;
        sug.innerHTML = '¿Quisiste decir <b>' + esc(s) + '</b>? <button type="button" class="btn-txt">Sí, corregir</button>';
        sug.querySelector('button').onclick = () => { inC.value = s; sug.hidden = true; inC.focus(); };
      } else sug.hidden = true;
      err.hidden = true;
    }
    inC.addEventListener('blur', revisar);
    inC.addEventListener('input', () => { err.hidden = true; });
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = inN.value.trim().replace(/\s+/g, ' '), correo = inC.value.trim().toLowerCase();
      if (nombre.length < 3) { err.hidden = false; err.textContent = 'Escribe tu nombre para continuar.'; inN.focus(); return; }
      if (!correoValido(correo)) { err.hidden = false; err.textContent = 'Revisa tu correo: debe verse como nombre@gmail.com'; inC.focus(); return; }
      const c = campus();
      c.usuario = { nombre, correo };
      if (!c.creado) c.creado = new Date().toISOString();
      guardarCampus(c);
      pintarCampus();
      try { window.scrollTo(0, 0); } catch (e2) { }
      const h = $('#saludo'); if (h) { h.setAttribute('tabindex', '-1'); try { h.focus({ preventScroll: true }); } catch (e3) { } }
    });
    const cancel = $('#r-cancelar');
    if (cancel) cancel.addEventListener('click', pintarCampus);
    setTimeout(() => { try { inN.focus({ preventScroll: true }); } catch (e) { } }, 50);
  }

  // =====================================================================
  // 7. Tema, ajustes, eventos
  // =====================================================================
  function temaActual() {
    const t = document.documentElement.getAttribute('data-theme');
    if (t === 'light' || t === 'dark') return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function fijarTema(t) {
    const h = document.documentElement;
    if (t === 'light' || t === 'dark') h.setAttribute('data-theme', t); else h.removeAttribute('data-theme');
    const c = campus(); c.ajustes = Object.assign({}, obj(c.ajustes), { tema: t === 'light' || t === 'dark' ? t : null }); guardarCampus(c);
    pintarBotonTema();
  }
  function pintarBotonTema() {
    const osc = temaActual() === 'dark', b = $('#btn-tema');
    b.innerHTML = ico(osc ? 'sol' : 'luna');
    b.setAttribute('aria-label', osc ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
    b.title = osc ? 'Tema claro' : 'Tema oscuro';
  }

  function abrirAjustes() {
    const dlg = $('#ajustes');
    const t = document.documentElement.getAttribute('data-theme') || 'auto';
    dlg.querySelectorAll('input[name="tema"]').forEach(i => { i.checked = i.value === t; });
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }
  function cerrarAjustes() { const dlg = $('#ajustes'); if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); }

  function registrarApertura(id) {
    if (!id) return;
    const c = campus(); c.abiertos = obj(c.abiertos); c.abiertos[id] = new Date().toISOString(); guardarCampus(c);
  }

  // Tooltip de las barras de resultados (hover y foco)
  function tooltip() {
    const tip = $('#tip');
    function mostrar(el) {
      const txt = el.getAttribute('data-tip'); if (!txt) return;
      tip.textContent = txt; tip.hidden = false;
      const r = el.querySelector('.barra-pista').getBoundingClientRect(), w = tip.offsetWidth;
      const x = clamp(r.left + r.width / 2 - w / 2, 8, document.documentElement.clientWidth - w - 8);
      tip.style.left = x + 'px'; tip.style.top = (r.top + window.scrollY - tip.offsetHeight - 8) + 'px';
    }
    const ocultar = () => { tip.hidden = true; };
    document.addEventListener('pointerover', e => { const f = e.target.closest && e.target.closest('.barra-fila'); if (f) mostrar(f); });
    document.addEventListener('pointerout', e => { const f = e.target.closest && e.target.closest('.barra-fila'); if (f && !f.contains(e.relatedTarget)) ocultar(); });
    document.addEventListener('focusin', e => { const f = e.target.closest && e.target.closest('.barra-fila'); if (f) mostrar(f); else ocultar(); });
    window.addEventListener('scroll', ocultar, { passive: true });
  }

  function iniciar() {
    pintarBotonTema();
    $('#btn-tema').addEventListener('click', () => fijarTema(temaActual() === 'dark' ? 'light' : 'dark'));
    $('#btn-ajustes').addEventListener('click', abrirAjustes);
    $('#aj-cambiar').addEventListener('click', () => { cerrarAjustes(); mostrarRegistro(true); try { window.scrollTo(0, 0); } catch (e) { } });
    $('#ajustes').addEventListener('change', e => { if (e.target.name === 'tema') fijarTema(e.target.value); });
    $('#ajustes').addEventListener('click', e => { if (e.target === e.currentTarget) cerrarAjustes(); });
    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const f = () => pintarBotonTema();
      if (mq.addEventListener) mq.addEventListener('change', f); else if (mq.addListener) mq.addListener(f);
    }
    document.addEventListener('click', e => { const a = e.target.closest && e.target.closest('[data-abre]'); if (a) registrarApertura(a.getAttribute('data-abre')); });
    // Al volver desde una clase (atrás o cambio de pestaña) se repinta con el avance nuevo
    const repintar = () => { if ($('#registro').hidden) pintarCampus(); };
    window.addEventListener('pageshow', e => { if (e.persisted) repintar(); });
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') repintar(); });
    window.addEventListener('storage', repintar);
    tooltip();
    pintarCampus();
  }

  document.addEventListener('DOMContentLoaded', iniciar);
})();
