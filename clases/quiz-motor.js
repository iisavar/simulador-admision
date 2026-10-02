/* ============================================================
   quiz-motor.js — motor de quizzes interactivos de clase.
   Tipos de pregunta: mc (elegir), vf (verdadero/falso), unir,
   ordenar, completar y clasificar.

   Cada quiz define ANTES de cargar este archivo:
     window.QUIZ_CFG  = { id, nombre, badge, h1, min, emoji, bullets:[], m1, m4 }
     window.QUIZ_DATA = [ preguntas ]  (formato abajo)

   Formato de preguntas (en mc la PRIMERA opción es la correcta; todo se baraja):
     {tipo:'mc', t, b?, o:[correcta, ...], w}
     {tipo:'vf', t, a:true|false, w}
     {tipo:'unir', t, pares:[[izq, der], ...], w}
     {tipo:'ordenar', t, items:[en orden correcto], w}
     {tipo:'completar', t:'texto con ___ huecos', r:[respuestas en orden], extra:[distractores], w}
     {tipo:'clasificar', t, cats:['A','B'], items:[[texto, índiceCat], ...], w}

   Resultados: si el link trae ?api=ID_DEL_APPS_SCRIPT (o la URL /exec completa),
   se envían al Apps Script (correo al estudiante + panel en vivo).
   Sin ?api= el quiz funciona igual, sin enviar nada. El ID se recuerda
   en este dispositivo, así no hace falta repetirlo en cada quiz.
   ============================================================ */
(function () {
  'use strict';
  var CFG = window.QUIZ_CFG, DATA = window.QUIZ_DATA;
  var N = DATA.length;
  var $ = function (id) { return document.getElementById(id); };

  // ---------- utilidades ----------
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function plano(h) { var d = document.createElement('div'); d.innerHTML = h; return (d.textContent || '').replace(/\s+/g, ' ').trim(); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function rango(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); return a; }
  function mezclaDistinta(n) { // permutación que no sea el orden original
    var p = shuffle(rango(n)), k = 0;
    while (n > 1 && k++ < 20 && p.every(function (v, i) { return v === i; })) p = shuffle(rango(n));
    return p;
  }
  function fmt(x) { return String(Math.round(x * 10) / 10).replace('.', ','); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  // ---------- conexión con el Apps Script ----------
  var API = (function () {
    var p = null;
    try { p = new URLSearchParams(location.search).get('api') || new URLSearchParams(location.hash.slice(1)).get('api'); } catch (e) {}
    try { if (p) localStorage.setItem('quizApi', p); else p = localStorage.getItem('quizApi'); } catch (e) {}
    if (!p) return '';
    return /^https?:/.test(p) ? p : 'https://script.google.com/macros/s/' + p + '/exec';
  })();
  function enviar(o, keep) {
    if (!API) return;
    try {
      o.ts = new Date().toISOString();
      fetch(API, { method: 'POST', mode: 'no-cors', keepalive: !!keep,
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(o) });
    } catch (e) { /* si falla, el quiz sigue */ }
  }

  var TIPO = { mc: '🎯 Elige', vf: '✅ Verdadero o falso', unir: '🔗 Une', ordenar: '🔢 Ordena', completar: '✍️ Completa', clasificar: '🗂️ Clasifica' };
  var PISTA = { unir: 'Toca uno de la izquierda y luego su pareja de la derecha', ordenar: 'Toca en orden, del primero al último',
    completar: 'Toca las palabras para llenar los espacios', clasificar: 'Elige la categoría de cada uno' };
  var COLORES = ['#1CB0F6', '#FFC800', '#C58CF0', '#FF8A3D', '#2BAE66', '#FF6FA8'];

  // ---------- pantalla ----------
  document.body.innerHTML =
    '<div class="wrap">' +
    '<header><span class="badge">' + CFG.badge + '</span><h1>' + CFG.h1 + '</h1>' +
    '<div class="sub">' + N + ' preguntas · ' + CFG.min + ' minutos</div></header>' +
    '<div id="intro" class="card start"><div class="emoji">' + CFG.emoji + '</div><div class="msg">Antes de empezar…</div>' +
    '<div class="reg"><input id="rNombre" type="text" placeholder="Tu nombre y apellido" autocomplete="name">' +
    '<input id="rCorreo" type="email" placeholder="Tu correo" autocomplete="email" inputmode="email"><div class="regErr" id="regErr"></div></div>' +
    '<ul>' + CFG.bullets.map(function (b) { return '<li>' + b + '</li>'; }).join('') +
    '<li>🧩 Hay preguntas para elegir, verdadero o falso, unir, ordenar, completar y clasificar.</li>' +
    '<li>👀 No salgas de esta pestaña: cada salida queda registrada.</li>' +
    (API ? '<li>📧 Al terminar te llega tu nota con la corrección al correo.</li>' : '') +
    '</ul><button class="go" id="go">Empezar quiz →</button></div>' +
    '<div id="game" class="hidden"><div class="top"><span class="timer" id="timer"></span></div>' +
    '<div class="bar"><i id="prog"></i></div>' +
    '<div class="meta"><span>Pregunta <b id="qn">1</b>/' + N + '</span><span class="tipo" id="tipo"></span><span>Puntos: <b id="sc">0</b></span></div>' +
    '<div class="card"><div class="q" id="q"></div><div id="area"></div>' +
    '<button class="check hidden" id="check" disabled>Comprobar ✓</button>' +
    '<div class="why" id="why"></div><button class="next hidden" id="next">Siguiente →</button></div></div>' +
    '<div id="final" class="card end hidden"></div>' +
    '</div><div class="toast" id="toast"></div>';

  // ---------- preparar preguntas (se barajan preguntas y opciones) ----------
  var Q = shuffle(DATA).map(function (it) {
    var p = Object.assign({}, it);
    if (it.tipo === 'mc') { p.orden = shuffle(rango(it.o.length)); }
    if (it.tipo === 'unir') { p.izq = shuffle(rango(it.pares.length)); p.der = mezclaDistinta(it.pares.length); }
    if (it.tipo === 'ordenar') { p.pool = mezclaDistinta(it.items.length); }
    if (it.tipo === 'completar') { p.banco = shuffle(it.r.concat(it.extra || [])); }
    if (it.tipo === 'clasificar') { p.orden = shuffle(rango(it.items.length)); }
    return p;
  });

  // Texto de la respuesta correcta (para el correo y la corrección)
  function correctaTxt(it) {
    switch (it.tipo) {
      case 'mc': return plano(it.o[0]);
      case 'vf': return it.a ? 'Verdadero' : 'Falso';
      case 'unir': return it.pares.map(function (p) { return plano(p[0]) + ' → ' + plano(p[1]); }).join(' · ');
      case 'ordenar': return it.items.map(function (x, k) { return (k + 1) + '. ' + plano(x); }).join('  ');
      case 'completar': return llenar(it.t, it.r);
      case 'clasificar': return it.items.map(function (x) { return plano(x[0]) + ': ' + it.cats[x[1]]; }).join(' · ');
    }
    return '';
  }
  function llenar(t, vals) { var k = 0; return plano(t.replace(/___/g, function () { var v = vals[k++]; return v == null ? '___' : '[' + v + ']'; })); }

  // ---------- estado ----------
  var ALUM = { nombre: '', correo: '' }, ID = '';
  var i = 0, score = 0, perfectas = 0, salidas = 0, timeLeft = CFG.min * 60, tick = null, t0 = 0, enJuego = false;
  var RES = [];   // una entrada por pregunta, para el correo y el panel
  var st = {};    // estado de la pregunta actual
  var base = function () { return { id: ID, quiz: CFG.id, quizNombre: CFG.nombre, nombre: ALUM.nombre, correo: ALUM.correo, total: N }; };

  function render() {
    var it = Q[i];
    st = { listo: false };
    $('q').innerHTML = (it.b ? '<span class="big">' + it.b + '</span>' : '') + it.t.replace(/___/g, '____') +
      (PISTA[it.tipo] ? '<span class="hint">' + PISTA[it.tipo] + '</span>' : '');
    if (it.tipo === 'completar') $('q').innerHTML = (it.b ? '<span class="big">' + it.b + '</span>' : '') + (it.enunciado || 'Completa la frase') + '<span class="hint">' + PISTA.completar + '</span>';
    $('qn').textContent = i + 1;
    $('tipo').textContent = TIPO[it.tipo];
    $('prog').style.width = (i / N * 100) + '%';
    $('why').innerHTML = '';
    $('next').classList.add('hidden');
    $('next').textContent = i === N - 1 ? 'Ver resultado →' : 'Siguiente →';
    var area = $('area'); area.innerHTML = '';
    var chk = $('check'); chk.disabled = true;
    chk.classList.toggle('hidden', it.tipo === 'mc' || it.tipo === 'vf');
    ({ mc: rMc, vf: rVf, unir: rUnir, ordenar: rOrdenar, completar: rCompletar, clasificar: rClasificar })[it.tipo](it, area);
  }

  // --- opción múltiple ---
  function rMc(it, area) {
    var largo = Math.max.apply(null, it.o.map(function (v) { return plano(v).length; }));
    var box = el('div', 'opts' + (largo > 22 ? ' one' : ''));
    it.orden.forEach(function (k) {
      var b = el('button', 'opt', it.o[k]);
      b.onclick = function () {
        if (st.listo) return;
        [].forEach.call(box.children, function (x, j) { x.disabled = true; if (it.orden[j] === 0) x.classList.add('ok'); });
        if (k !== 0) b.classList.add('no');
        cerrar(it, k === 0 ? 1 : 0, plano(it.o[k]));
      };
      box.appendChild(b);
    });
    area.appendChild(box);
  }
  // --- verdadero / falso ---
  function rVf(it, area) {
    var box = el('div', 'opts');
    [true, false].forEach(function (v) {
      var b = el('button', 'opt vf', v ? '✅ Verdadero' : '❌ Falso');
      b.onclick = function () {
        if (st.listo) return;
        [].forEach.call(box.children, function (x, j) { x.disabled = true; if ((j === 0) === it.a) x.classList.add('ok'); });
        if (v !== it.a) b.classList.add('no');
        cerrar(it, v === it.a ? 1 : 0, v ? 'Verdadero' : 'Falso');
      };
      box.appendChild(b);
    });
    area.appendChild(box);
  }
  // --- unir ---
  function rUnir(it, area) {
    st.par = {}; st.sel = null;
    var w = el('div', 'unir'), L = el('div', 'col'), R = el('div', 'col');
    L.appendChild(el('div', 'colhead', 'CONCEPTO')); R.appendChild(el('div', 'colhead', 'PAREJA'));
    var bl = {}, br = {};
    it.izq.forEach(function (k) { var b = el('button', 'it', it.pares[k][0]); b.onclick = function () { tocaIzq(k); }; bl[k] = b; L.appendChild(b); });
    it.der.forEach(function (k) { var b = el('button', 'it', it.pares[k][1]); b.onclick = function () { tocaDer(k); }; br[k] = b; R.appendChild(b); });
    w.appendChild(L); w.appendChild(R); area.appendChild(w);
    st.bl = bl; st.br = br;
    function tocaIzq(k) { if (st.listo) return; if (st.par[k] != null) delete st.par[k]; st.sel = (st.sel === k ? null : k); pintar(); }
    function tocaDer(r) {
      if (st.listo) return;
      var dueno = null; Object.keys(st.par).forEach(function (l) { if (st.par[l] === r) dueno = l; });
      if (st.sel == null) { if (dueno != null) delete st.par[dueno]; pintar(); return; }
      if (dueno != null) delete st.par[dueno];
      st.par[st.sel] = r; st.sel = null; pintar();
    }
    function pintar() {
      it.izq.forEach(function (k, pos) {
        var b = bl[k], col = COLORES[pos % COLORES.length];
        b.classList.toggle('sel', st.sel === k);
        quitarTag(b);
        if (st.par[k] != null) { b.style.borderColor = col; ponerTag(b, pos + 1, col); ponerTag(br[st.par[k]], pos + 1, col); br[st.par[k]].style.borderColor = col; }
        else b.style.borderColor = '';
      });
      it.der.forEach(function (r) { var usado = Object.keys(st.par).some(function (l) { return st.par[l] === r; }); if (!usado) { quitarTag(br[r]); br[r].style.borderColor = ''; } });
      $('check').disabled = Object.keys(st.par).length !== it.pares.length;
    }
    st.comprobar = function () {
      var ok = 0;
      it.izq.forEach(function (k) {
        var bien = st.par[k] === k; if (bien) ok++;
        bl[k].classList.add(bien ? 'ok' : 'no'); br[st.par[k]].classList.add(bien ? 'ok' : 'no');
      });
      Object.keys(bl).forEach(function (k) { bl[k].disabled = true; }); Object.keys(br).forEach(function (k) { br[k].disabled = true; });
      var tu = it.pares.map(function (p, k) { return plano(p[0]) + ' → ' + plano(it.pares[st.par[k]][1]); }).join(' · ');
      cerrar(it, ok / it.pares.length, tu);
    };
  }
  function ponerTag(b, n, col) { quitarTag(b); var t = el('span', 'tag', n); t.style.background = col; b.appendChild(t); }
  function quitarTag(b) { var t = b.querySelector('.tag'); if (t) t.remove(); }
  // --- ordenar ---
  function rOrdenar(it, area) {
    st.elegidos = [];
    var seq = el('div', 'seq'), pool = el('div', 'pool');
    area.appendChild(seq); area.appendChild(pool);
    function pintar() {
      seq.innerHTML = ''; pool.innerHTML = '';
      st.elegidos.forEach(function (k, pos) {
        var b = el('button', 'it', '<span class="num">' + (pos + 1) + '</span><span>' + it.items[k] + '</span>');
        b.onclick = function () { if (st.listo) return; st.elegidos.splice(pos, 1); pintar(); };
        b.dataset.k = k; seq.appendChild(b);
      });
      it.pool.forEach(function (k) {
        if (st.elegidos.indexOf(k) >= 0) return;
        var b = el('button', 'it', it.items[k]);
        b.onclick = function () { if (st.listo) return; st.elegidos.push(k); pintar(); };
        pool.appendChild(b);
      });
      $('check').disabled = st.elegidos.length !== it.items.length;
    }
    pintar();
    st.comprobar = function () {
      var ok = 0;
      [].forEach.call(seq.children, function (b, pos) { var bien = st.elegidos[pos] === pos; if (bien) ok++; b.classList.add(bien ? 'ok' : 'no'); b.disabled = true; });
      cerrar(it, ok / it.items.length, st.elegidos.map(function (k, pos) { return (pos + 1) + '. ' + plano(it.items[k]); }).join('  '));
    };
  }
  // --- completar ---
  function rCompletar(it, area) {
    var n = it.r.length; st.fill = []; for (var k = 0; k < n; k++) st.fill.push(null);
    var frase = el('div', 'frase'), banco = el('div', 'banco');
    var partes = it.t.split('___'), slots = [];
    partes.forEach(function (p, k) {
      frase.appendChild(document.createTextNode(plano(p)));
      if (k < n) {
        var s = el('button', 'slot', '&nbsp;'); s.onclick = function () { if (st.listo) return; st.fill[k] = null; pintar(); };
        slots.push(s); frase.appendChild(s);
      }
    });
    var chips = it.banco.map(function (w, j) {
      var c = el('button', 'chipb', esc(w));
      c.onclick = function () { if (st.listo) return; var h = st.fill.indexOf(null); if (h < 0) return; st.fill[h] = j; pintar(); };
      banco.appendChild(c); return c;
    });
    area.appendChild(frase); area.appendChild(banco);
    function pintar() {
      slots.forEach(function (s, k) { var j = st.fill[k]; s.innerHTML = j == null ? '&nbsp;' : esc(it.banco[j]); s.classList.toggle('lleno', j != null); });
      chips.forEach(function (c, j) { c.classList.toggle('usado', st.fill.indexOf(j) >= 0); });
      $('check').disabled = st.fill.indexOf(null) >= 0;
    }
    st.comprobar = function () {
      var ok = 0;
      slots.forEach(function (s, k) { var bien = it.banco[st.fill[k]] === it.r[k]; if (bien) ok++; s.classList.add(bien ? 'ok' : 'no'); s.disabled = true; });
      chips.forEach(function (c) { c.disabled = true; });
      cerrar(it, ok / n, llenar(it.t, st.fill.map(function (j) { return it.banco[j]; })));
    };
  }
  // --- clasificar ---
  function rClasificar(it, area) {
    st.sel = {};
    var box = el('div', 'clas'), filas = {};
    it.orden.forEach(function (k) {
      var row = el('div', 'crow'); row.appendChild(el('div', 'ctext', it.items[k][0]));
      var bs = el('div', 'cbtns');
      it.cats.forEach(function (c, ci) {
        var b = el('button', 'cb', esc(c));
        b.onclick = function () {
          if (st.listo) return; st.sel[k] = ci;
          [].forEach.call(bs.children, function (x, xi) { x.classList.toggle('on', xi === ci); });
          $('check').disabled = Object.keys(st.sel).length !== it.items.length;
        };
        bs.appendChild(b);
      });
      row.appendChild(bs); box.appendChild(row); filas[k] = row;
    });
    area.appendChild(box);
    st.comprobar = function () {
      var ok = 0;
      it.items.forEach(function (x, k) {
        var bien = st.sel[k] === x[1]; if (bien) ok++;
        filas[k].classList.add(bien ? 'ok' : 'no');
        if (!bien) filas[k].querySelector('.ctext').innerHTML += ' <span style="opacity:.9">→ ' + esc(it.cats[x[1]]) + '</span>';
        [].forEach.call(filas[k].querySelectorAll('button'), function (b) { b.disabled = true; });
      });
      cerrar(it, ok / it.items.length, it.items.map(function (x, k) { return plano(x[0]) + ': ' + it.cats[st.sel[k]]; }).join(' · '));
    };
  }

  // ---------- calificar ----------
  $('check').onclick = function () { if (st.comprobar && !st.listo) st.comprobar(); };
  function cerrar(it, pts, tu) {
    if (st.listo) return; st.listo = true;
    score += pts; if (pts === 1) perfectas++;
    $('sc').textContent = fmt(score);
    $('check').classList.add('hidden');
    var cab = pts === 1 ? '<b>¡Correcto! 🎉</b> ' : pts > 0 ? '<b style="color:var(--gold)">Casi: ' + Math.round(pts * 100) + '% bien.</b> ' : '<b style="color:var(--coral)">Mira:</b> ';
    var sol = (pts < 1 && it.tipo !== 'mc' && it.tipo !== 'vf') ? '<div class="sol">✔ ' + esc(correctaTxt(it)) + '</div>' : '';
    $('why').innerHTML = cab + it.w + sol;
    $('next').classList.remove('hidden');
    RES.push({ n: RES.length + 1, tipo: it.tipo, pregunta: preguntaTxt(it), tu: tu, correcta: correctaTxt(it), puntos: Math.round(pts * 100) / 100, explicacion: plano(it.w) });
    var o = base(); o.evento = 'progreso'; o.respondidas = RES.length; o.puntos = Math.round(score * 100) / 100; o.salidas = salidas;
    enviar(o, true);
  }
  function preguntaTxt(it) {
    var b = it.b ? plano(it.b) + ' · ' : '';
    return it.tipo === 'completar' ? b + (it.enunciado ? plano(it.enunciado) + ': ' : '') + plano(it.t) : b + plano(it.t);
  }
  $('next').onclick = function () { i++; if (i >= N) return fin(false); render(); window.scrollTo(0, 0); };

  // ---------- tiempo ----------
  function startTimer() {
    pintarTiempo();
    tick = setInterval(function () { timeLeft--; pintarTiempo(); if (timeLeft <= 0) { clearInterval(tick); fin(true); } }, 1000);
  }
  function pintarTiempo() {
    var m = Math.floor(timeLeft / 60), s = timeLeft % 60, t = $('timer');
    t.textContent = '⏱ ' + m + ':' + String(s).padStart(2, '0');
    t.classList.toggle('warn', timeLeft <= 90);
  }

  // ---------- salidas de la pestaña (anti-copia) ----------
  document.addEventListener('visibilitychange', function () {
    if (!enJuego) return;
    if (document.hidden) {
      salidas++;
      var o = base(); o.evento = 'progreso'; o.respondidas = RES.length; o.puntos = Math.round(score * 100) / 100; o.salidas = salidas;
      enviar(o, true);
    } else {
      var t = $('toast'); t.textContent = '👀 Saliste del quiz (' + salidas + (salidas === 1 ? ' vez' : ' veces') + '). Queda registrado.';
      t.classList.add('on'); setTimeout(function () { t.classList.remove('on'); }, 3500);
    }
  });

  // ---------- registro ----------
  function correoValido(c) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c); }
  try { var g = JSON.parse(localStorage.getItem('alumno') || 'null'); if (g && g.correo) { $('rNombre').value = g.nombre || ''; $('rCorreo').value = g.correo || ''; } } catch (e) {}
  $('go').onclick = function () {
    var nombre = $('rNombre').value.trim(), correo = $('rCorreo').value.trim().toLowerCase();
    if (nombre.length < 3) { $('regErr').textContent = 'Escribe tu nombre completo.'; return; }
    if (!correoValido(correo)) { $('regErr').textContent = 'Escribe un correo válido.'; return; }
    ALUM = { nombre: nombre, correo: correo };
    try { localStorage.setItem('alumno', JSON.stringify(ALUM)); } catch (e) {}
    ID = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    var o = base(); o.evento = 'registro'; o.dispositivo = /Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'Celular' : 'Computadora';
    enviar(o, true);
    $('intro').classList.add('hidden'); $('game').classList.remove('hidden');
    enJuego = true; t0 = Date.now(); render(); startTimer();
  };

  // ---------- final ----------
  function fin(porTiempo) {
    if (!enJuego) return; enJuego = false;
    if (tick) clearInterval(tick);
    var respondidas = RES.length;
    // lo que no alcanzó a responder también va en la corrección
    for (var k = RES.length; k < N; k++) {
      var it = Q[k];
      RES.push({ n: k + 1, tipo: it.tipo, pregunta: preguntaTxt(it), tu: '(sin responder)', correcta: correctaTxt(it), puntos: 0, explicacion: plano(it.w) });
    }
    var nota = Math.round(score / N * 100) / 10, seg = Math.round((Date.now() - t0) / 1000);
    var o = base(); o.evento = 'fin'; o.respondidas = respondidas; o.puntos = Math.round(score * 100) / 100;
    o.nota = nota; o.perfectas = perfectas; o.salidas = salidas; o.segundos = seg; o.porTiempo = !!porTiempo; o.respuestas = RES;
    enviar(o, false);

    $('game').classList.add('hidden');
    var e, m;
    if (nota >= 9) { e = '🏆'; m = CFG.m1; } else if (nota >= 7) { e = '🎉'; m = '¡Muy bien! Ya casi al 100%.'; }
    else if (nota >= 5) { e = '👍'; m = 'Vas bien: repasa lo que fallaste y repite.'; } else { e = '🔁'; m = CFG.m4; }
    var f = $('final'); f.classList.remove('hidden');
    f.innerHTML = '<div class="emoji">' + e + '</div><div class="score">' + fmt(nota) + '<small>/10</small></div>' +
      '<div class="pct">' + fmt(score) + ' de ' + N + ' puntos' + (porTiempo ? ' · ⏰ se acabó el tiempo' : '') + '</div>' +
      '<div class="msg">' + m + '</div>' +
      '<div class="stats"><span class="stat">✅ ' + perfectas + ' perfectas</span><span class="stat">⏱ ' + Math.floor(seg / 60) + ' min ' + (seg % 60) + ' s</span>' +
      (salidas ? '<span class="stat" style="color:var(--coral)">👀 ' + salidas + ' salida' + (salidas > 1 ? 's' : '') + '</span>' : '') + '</div>' +
      (API ? '<div class="mail">📧 Te enviamos la corrección completa a <b>' + esc(ALUM.correo) + '</b></div>' : '') +
      '<div class="tip">Escribe tu nota en el chat 👇</div>' +
      '<button class="again" onclick="location.reload()">↻ Repetir</button>';
    window.scrollTo(0, 0);
  }
})();
