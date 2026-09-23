/* Láminas 20–41: Capítulo 3 (signos pegados, · y ÷), Capítulo 4 (potencias y combinadas) y Cierre.
   Además: LS.resumen, el generador de la imagen «Tu resumen en una foto» (PNG 1080×1350). */
(function () {
  'use strict';
  const LS = window.LS = window.LS || {};
  const M = LS.M;
  // Nota: LS.ui.fx trata un negativo al FINAL del texto como «−3²» (SUPS.indexOf('') === 0).
  // Un espacio de ancho cero al final lo evita sin cambiar lo que se ve.
  const fx = (s, o) => LS.ui.fx(/\d$/.test(s) ? s + '​' : s, o);
  const t = (s) => fx(s, { clase: 'sin-color' });              // cuentas de tamaños (sin signo)
  const mal = (s) => '<span class="tachado">' + fx(s, { clase: 'sin-color lsb-mal' }) + '</span>';
  const N = (v) => LS.ui.num(v);
  const chip = (x) => LS.ui.chip(x);
  const svg = () => LS.svg;

  // ---------- Ayudantes de datos ----------
  const opc = (v, fb) => ({ t: fx(M.fmt(v)), v, fb });
  const okc = (v, fb) => ({ t: fx(M.fmt(v)), v, ok: true, fb });
  function E(pares) { const o = {}; pares.forEach(p => p[0].forEach(k => { o[k] = p[1]; })); return o; }
  function pOpc(fuente, opciones, extra) {
    return Object.assign({ tipo: 'opciones', fuente, enunciado: fx(fuente + ' = ?'), opciones, columnas: 2 }, extra || {});
  }
  function pTec(fuente, correcta, errores, extra) {
    return Object.assign({ tipo: 'teclado', fuente, correcta, errores, enunciado: fx(fuente + ' = ?') }, extra || {});
  }
  // Expresión con partes enmarcadas: [['3 − ', false], ['2(−4)', true], [' + (−6) ÷ 2', false]]
  function mk(partes) {
    return '<span class="lsb-expr">' + partes.map(p => p[1] ? '<span class="lsb-marco">' + fx(p[0]) + '</span>' : fx(p[0])).join('') + '</span>';
  }
  const flecha = (s) => '<div class="lsb-queda">→ ' + fx(s) + '</div>';
  function yaHecho(c, id, num) {
    const r = c.st.laminas.respuestas[id];
    if (r && r.hecho) return true;
    const i = LS.laminas && LS.laminas.indicePorNum ? LS.laminas.indicePorNum(num) : -1;
    return i >= 0 && i < c.st.laminas.maxAlcanzada;
  }

  // Revela por toques los elementos .lsb-oc[data-toque="k"] de la lámina (en la hoja de repaso se ven todos).
  function porToques(id, num, etiquetas) {
    return {
      tipo: 'custom',
      render(el, api) {
        const body = el.closest('.lam-body') || document;
        const mostrar = (i) => body.querySelectorAll('.lsb-oc[data-toque="' + i + '"]').forEach(x => x.classList.remove('lsb-oc'));
        if (yaHecho(api.ctx, id, num)) { for (let i = 1; i <= etiquetas.length; i++) mostrar(i); api.completar(true); return; }
        let k = 0;
        el.innerHTML = '<button class="btn btn-sec btn-ancho" data-noswipe>' + etiquetas[0] + '</button>';
        const bt = el.querySelector('button');
        bt.addEventListener('click', () => {
          k++; mostrar(k);
          if (k >= etiquetas.length) { bt.remove(); api.completar(true); }
          else bt.innerHTML = etiquetas[k];
        });
      }
    };
  }

  // Teclado dentro de un bloque 'custom' (misma lógica que el bloque 'teclado' del carrusel).
  function tecladoLocal(zona, cfg, api, alFin) {
    const ui = LS.ui;
    zona.innerHTML = '<div class="bloque-preg"><div class="enunciado">' + cfg.enunciado + '</div><div class="zona-fb" aria-live="polite"></div><div class="zona-tec"></div></div>';
    const zfb = zona.querySelector('.zona-fb');
    let intentos = 0;
    const tec = ui.teclado(zona.querySelector('.zona-tec'), {
      onOk: (v) => {
        const tu = 'Tu respuesta: ' + ui.num(v) + '. ';
        if (v === cfg.correcta) {
          tec.bloquear(true);
          zfb.innerHTML = api.fb('ok', tu + cfg.okFb);
          ui.sonido('ok');
          alFin(intentos === 0);
          return;
        }
        intentos++;
        api.fallo();
        const conocido = (cfg.errores || {})[String(v)];
        const msg = conocido || 'Casi. Mira cómo se hace:';
        if (intentos >= 2) {
          tec.bloquear(true);
          zfb.innerHTML = api.fb('miss', tu + msg) + api.fb('info', '<b>Respuesta: ' + ui.num(cfg.correcta) + '.</b> ' + cfg.solucion);
          alFin(false);
        } else {
          zfb.innerHTML = api.fb('miss', tu + msg + (!conocido ? '<br>' + cfg.solucion : '') + '<br><span class="peq tinta-2">Intenta otra vez.</span>');
          tec.limpiar();
        }
      }
    });
  }

  // ---------- Dibujos propios ----------
  const T = (x, y, txt, o) => {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.anchor || 'middle') + '" font-size="' + (o.size || 14) + '" font-weight="' + (o.peso || 800) + '" style="fill:' + (o.col || 'var(--ink)') + '">' + txt + '</text>';
  };
  const colTxt = (v) => v === 0 ? 'var(--ink)' : v < 0 ? 'var(--neg-text)' : 'var(--pos-text)';
  const colRel = (v) => v === 0 ? 'var(--ink)' : v < 0 ? 'var(--neg)' : 'var(--pos)';
  const cab = (vb, aria) => '<svg viewBox="' + vb + '" role="img" aria-label="' + aria + '"><title>' + aria + '</title>';

  function svgLupa23() {
    return cab('0 0 320 140', 'Lupa sobre 2(−4): número pegado al paréntesis quiere decir multiplicar') +
      '<circle cx="118" cy="62" r="50" style="fill:var(--surface);stroke:var(--ink)" stroke-width="2.5"/>' +
      '<path d="M154 98 L184 128" style="stroke:var(--ink)" stroke-width="7" stroke-linecap="round"/>' +
      '<text x="118" y="75" text-anchor="middle" font-size="36" font-weight="900"><tspan style="fill:var(--pos-text)">2</tspan><tspan style="fill:var(--ink)">(</tspan><tspan style="fill:var(--neg-text)">−4</tspan><tspan style="fill:var(--ink)">)</tspan></text>' +
      T(252, 56, 'pegados', { size: 16 }) + T(252, 78, '=', { size: 18, peso: 900 }) + T(252, 100, 'multiplicar', { size: 16 }) +
      '</svg>';
  }

  function svgGrupos24() {
    const f = svg().ficha;
    let s = cab('0 0 320 150', '3 grupos de 2 fichas de deber se juntan en 6 fichas: menos 6');
    for (let g = 0; g < 3; g++) {
      const x = 16 + g * 100;
      s += '<rect x="' + x + '" y="8" width="84" height="44" rx="12" fill="none" style="stroke:var(--ink-3)" stroke-width="2" stroke-dasharray="5 4"/>';
      s += f(x + 26, 30, 'neg') + f(x + 58, 30, 'neg');
      s += T(x + 42, 72, '−2', { size: 15, peso: 900, col: 'var(--neg-text)' });
    }
    s += '<path d="M160 80 v18 m-7 -7 l7 7 7 -7" fill="none" style="stroke:var(--ink)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>';
    for (let i = 0; i < 6; i++) s += f(40 + i * 30, 122, 'neg');
    s += '<text x="226" y="131" font-size="26" font-weight="900"><tspan style="fill:var(--ink)">= </tspan><tspan style="fill:var(--neg-text)">−6</tspan></text>';
    return s + '</svg>';
  }

  // Patrón de la lámina 25: resultados en una recta vertical con insignias «+2»
  function svgPatron25() {
    const Y = (v) => 20 + (4 - v) * 14;
    let s = cab('0 0 120 180', 'Los resultados suben de 2 en 2');
    s += '<line x1="34" y1="' + (Y(5) - 2) + '" x2="34" y2="' + (Y(-7)) + '" style="stroke:var(--ink)" stroke-width="2.5" stroke-linecap="round"/>';
    s += '<path d="M28 ' + (Y(5) + 4) + ' l6 -7 6 7" fill="none" style="stroke:var(--ink)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>';
    for (let v = -6; v <= 4; v += 2) s += '<line x1="29" y1="' + Y(v) + '" x2="39" y2="' + Y(v) + '" style="stroke:var(--ink-3)" stroke-width="2"/>';
    const pts = [[-6, '0'], [-4, '1'], [-2, '2'], [0, '3'], [2, 'final'], [4, 'final']];
    pts.forEach((p, i) => {
      const v = p[0], y = Y(v);
      const attr = p[1] === '0' ? '' : p[1] === 'final' ? ' class="lsb-oc" data-final' : ' class="lsb-oc" data-toque="' + p[1] + '"';
      s += '<g' + attr + '><circle cx="34" cy="' + y + '" r="6.5" style="fill:' + colRel(v) + ';stroke:var(--surface)" stroke-width="2"/>' +
        T(22, y + 5, (v < 0 ? '−' : '') + Math.abs(v), { anchor: 'end', size: 14, peso: 900, col: colTxt(v) }) + '</g>';
      if (i > 0) {
        const ym = (Y(v) + Y(pts[i - 1][0])) / 2;
        s += '<g' + attr + '><rect x="52" y="' + (ym - 9) + '" width="34" height="18" rx="9" style="fill:var(--zero-soft);stroke:var(--ink)" stroke-width="1.5"/>' +
          T(69, ym + 5, '+2', { size: 12, peso: 900 }) + '</g>';
      }
    });
    // «?» mientras se pregunta (solo en la lámina, desaparece al responder)
    s += '<g class="lsb-oc lsb-solo-lam" data-toque="4" data-preg>' +
      '<rect x="52" y="' + ((Y(2) + Y(0)) / 2 - 9) + '" width="34" height="18" rx="9" style="fill:var(--zero-soft);stroke:var(--ink)" stroke-width="1.5"/>' +
      T(69, (Y(2) + Y(0)) / 2 + 5, '+2', { size: 12, peso: 900 }) + T(22, Y(2) + 5, '?', { anchor: 'end', size: 16, peso: 900 }) + '</g>';
    return s + '</svg>';
  }

  function lupa28(contenido, aria) {
    return cab('0 0 100 88', aria) +
      '<circle cx="44" cy="40" r="34" style="fill:var(--surface);stroke:var(--ink)" stroke-width="2.5"/>' +
      '<path d="M69 65 L88 84" style="stroke:var(--ink)" stroke-width="6" stroke-linecap="round"/>' + contenido + '</svg>';
  }

  function svgPotencia30() {
    return cab('0 0 320 140', 'Dos al cubo: el 2 es la base y el 3 es el exponente, que dice cuántas veces se multiplica la base') +
      T(70, 104, '2', { size: 84, peso: 900, col: 'var(--pos-text)' }) +
      T(112, 50, '3', { size: 40, peso: 900 }) +
      '<path d="M128 32 Q 172 0 214 28" fill="none" style="stroke:var(--ink)" stroke-width="2.5" stroke-linecap="round"/>' +
      '<path d="M203 22 l11 6 -9 8" fill="none" style="stroke:var(--ink)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      T(256, 54, '¿cuántas veces?', { size: 16 }) +
      T(70, 132, 'base', { size: 15, col: 'var(--ink-2)' }) +
      T(112, 76, 'exponente', { size: 15, col: 'var(--ink-2)', anchor: 'start' }) +
      '</svg>';
  }

  function svgParejas31() {
    const f = svg().ficha;
    const flecha = (x, y) => '<path d="M' + x + ' ' + y + ' h28 m-7 -6 l7 6 -7 6" fill="none" style="stroke:var(--ink)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>';
    const arco = (x1, x2, y) => '<path d="M' + x1 + ' ' + y + ' Q ' + ((x1 + x2) / 2) + ' ' + (y - 14) + ' ' + x2 + ' ' + y + '" fill="none" style="stroke:var(--ink)" stroke-width="2.5" stroke-linecap="round"/>';
    return cab('0 0 330 124', 'Cada pareja de fichas negativas se vuelve una positiva. Si sobra una sin pareja, el resultado es negativo') +
      arco(24, 56, 14) + f(24, 34, 'neg') + f(56, 34, 'neg') + flecha(80, 34) + f(128, 34, 'pos') +
      T(154, 39, 'una pareja → +', { anchor: 'start', size: 14 }) +
      arco(24, 56, 74) + f(24, 94, 'neg') + f(56, 94, 'neg') + f(88, 94, 'neg') + flecha(112, 94) + f(160, 94, 'pos') + f(192, 94, 'neg') +
      T(216, 99, 'sobra uno → −', { anchor: 'start', size: 14 }) +
      '</svg>';
  }

  function svgAlcance32() {
    return cab('0 0 300 138', 'En (−3)² el exponente toca todo el paréntesis. En −3² el exponente toca solo al 3 y el menos espera afuera') +
      T(24, 92, '(', { size: 46, peso: 800 }) + T(62, 92, '−3', { size: 46, peso: 900, col: 'var(--neg-text)' }) + T(100, 92, ')', { size: 46, peso: 800 }) +
      T(117, 58, '2', { size: 26, peso: 900 }) +
      '<path d="M116 36 Q 66 -12 14 50" fill="none" style="stroke:var(--ink)" stroke-width="2.5" stroke-linecap="round"/>' +
      '<circle cx="14" cy="50" r="3.5" style="fill:var(--ink)"/>' +
      T(62, 124, 'toca todo', { size: 14, col: 'var(--ink-2)' }) +
      '<line x1="152" y1="16" x2="152" y2="124" style="stroke:var(--line)" stroke-width="2.5" stroke-dasharray="5 5"/>' +
      T(196, 92, '−', { size: 46, peso: 900 }) + T(228, 92, '3', { size: 46, peso: 900, col: 'var(--pos-text)' }) +
      T(250, 58, '2', { size: 26, peso: 900 }) +
      '<path d="M249 36 Q 236 10 214 52" fill="none" style="stroke:var(--ink)" stroke-width="2.5" stroke-linecap="round"/>' +
      '<circle cx="214" cy="52" r="3.5" style="fill:var(--ink)"/>' +
      '<path d="M196 112 v-8" fill="none" style="stroke:var(--ink)" stroke-width="2.5" stroke-linecap="round"/>' +
      T(196, 128, 'espero afuera', { size: 14, col: 'var(--ink-2)' }) +
      '</svg>';
  }

  function svgParadas41() {
    const xs = [30, 86, 142, 198, 254, 310], ys = [70, 40, 70, 40, 70, 40];
    let s = cab('0 0 340 112', 'Camino del juego: 6 paradas hasta el jefe final');
    s += '<path d="M' + xs.map((x, i) => x + ' ' + ys[i]).join(' L') + '" fill="none" style="stroke:var(--ink-3)" stroke-width="3" stroke-dasharray="6 6" stroke-linecap="round"/>';
    xs.forEach((x, i) => {
      s += '<circle cx="' + x + '" cy="' + ys[i] + '" r="20" style="fill:' + (i === 5 ? 'var(--prize)' : 'var(--surface)') + ';stroke:var(--ink)" stroke-width="2.5"/>' +
        T(x, ys[i] + 6, String(i + 1), { size: 17, peso: 900, col: i === 5 ? 'var(--on-prize)' : 'var(--ink)' });
    });
    s += T(30, 106, 'empiezas', { size: 13, col: 'var(--ink-2)' }) + T(310, 76, 'jefe final', { size: 13, col: 'var(--ink-2)' });
    return s + '</svg>';
  }

  function cierreCap(n, resumen, viene) {
    return (c) => '<div class="lsb-cierre"><div class="sello">' + svg().sello('Capítulo ' + n + ' listo') + '</div>' +
      '<p>' + resumen + '</p>' +
      '<p><b>Lo que viene:</b> ' + viene + '</p>' +
      '<p class="caja-nota">Puedes parar aquí: tu avance quedó guardado.</p></div>';
  }

  // =====================================================================
  const LAMINAS = [];

  // ---------------- CAPÍTULO 3 ----------------
  LAMINAS.push({
    id: 'L20', num: 20, cap: 3,
    entrada: 'Capítulo 3 de 4 · Signos pegados, multiplicar y dividir · unos 8 minutos',
    titulo: 'El menos de afuera: «lo contrario de»',
    html: () =>
      '<p>A veces verás un menos pegado a un paréntesis: ' + fx('−(−2)') + '.</p>' +
      '<p>Ese menos de afuera significa <b>«lo contrario de»</b>.</p>' +
      '<div class="lsb-lineas">' +
      '<p>' + fx('−(4)') + ' = lo contrario de ' + fx('4') + ' = <b>' + fx('−4') + '</b></p>' +
      '<p>' + fx('−(−2)') + ' = lo contrario de ' + fx('−2') + ' = <b>' + fx('2') + '</b></p>' +
      '</div>' +
      '<p>Lo contrario de deber 2 es tener 2.</p>' +
      '<div class="dibujo">' + svg().recta({ min: -4, max: 4, espejo: true, puntos: [{ v: -2 }, { v: 2 }], saltos: [{ de: -2, a: 2, etiqueta: 'lo contrario' }], titulo: 'En la recta, el −2 salta al otro lado del 0, como en un espejo, y queda en 2' }) + '</div>',
    mas: () =>
      '<p>El signo menos tiene 3 trabajos:</p>' +
      '<p>(1) decir que un número es negativo, como en ' + fx('−5') + ';<br>(2) restar, como en ' + fx('8 − 5') + ';<br>(3) decir «lo contrario de», como en ' + fx('−(−2)') + '.</p>' +
      '<p>En este tercer trabajo, el menos de afuera toma lo que está dentro del paréntesis y lo pasa al otro lado del 0, como un espejo.</p>' +
      '<p>Por eso ' + fx('−(−2) = 2') + '.</p>',
    bloques: [
      pOpc('−(−7)', [
        opc(-7, 'Casi. El menos de afuera le da la vuelta: lo contrario de ' + N(-7) + ' es ' + N(7) + '.'),
        opc(0, 'Casi. ' + N(0) + ' sale si <b>juntas</b> ' + N(-7) + ' con ' + N(7) + '. Aquí solo le das la vuelta al ' + N(-7) + ': queda ' + N(7) + '.'),
        okc(7, '¡Eso! Lo contrario de ' + N(-7) + ' es ' + N(7) + '.')
      ], { columnas: 1, solucion: 'Lo contrario de ' + N(-7) + ' es ' + N(7) + ': ' + fx('−(−7) = 7') + '.' })
    ]
  });

  function celda21(expr, sig, dice, cuenta) {
    return '<div class="lsb-celda"><div class="lsb-celda-expr">' + fx(expr) + '</div>' +
      '<div class="lsb-celda-sig">' + sig + '</div><div class="peq tinta-2">' + dice + '</div>' +
      '<div class="lsb-celda-res">' + fx(cuenta) + '</div></div>';
  }
  LAMINAS.push({
    id: 'L21', num: 21, cap: 3, chip: 'SIGNOS PEGADOS', masAlFallar: true,
    titulo: 'Dos signos pegados se vuelven uno',
    html: () =>
      '<p>Cuando dos signos quedan <b>pegados</b> (separados solo por un paréntesis), se vuelven uno solo:</p>' +
      '<div class="regla-caja lsb-regla"><b>Iguales → +</b><b>Distintos → −</b></div>' +
      '<div class="dibujo"><div class="lsb-grid2" role="group" aria-label="Los 4 casos de signos pegados">' +
      celda21('5 + (+2)', '+ con + → +', 'te dan $2', '5 + 2 = 7') +
      celda21('5 + (−2)', '+ con − → −', 'te dan una deuda de $2', '5 − 2 = 3') +
      celda21('5 − (+2)', '− con + → −', 'te quitan $2', '5 − 2 = 3') +
      celda21('5 − (−2)', '− con − → +', 'te quitan una deuda de $2', '5 + 2 = 7') +
      '</div></div>',
    mas: () =>
      '<p>El signo de afuera es la <b>acción</b>: + es «te dan» y − es «te quitan». Lo de adentro es la plata o la deuda. Si te quitan una deuda, ganas.</p>' +
      '<p>Compruébalo con este patrón:</p>' +
      '<p class="lsb-lista-fx">' + ['5 − 2 = 3', '5 − 1 = 4', '5 − 0 = 5', '5 − (−1) = 6', '5 − (−2) = 7'].map(s => fx(s)).join('<br>') + '</p>' +
      '<p>Cada vez que lo que restas baja 1, el resultado sube 1.</p>' +
      '<p><b>Ojo:</b> en ' + fx('−5 − 9') + ' los dos menos <b>no</b> están pegados, porque hay un 5 en medio.</p>',
    bloques: [
      pOpc('8 − (−3)', [
        opc(-11, 'Casi. Primero vuelve los dos signos uno solo: − con − da +. Queda ' + fx('8 + 3 = 11') + '.'),
        opc(-5, 'Casi. Primero vuelve los dos signos uno solo: − con − da +. Queda ' + fx('8 + 3 = 11') + '.'),
        opc(5, 'Casi. Los dos menos están pegados: − con − da +. Te quitan una deuda de 3, así que ganas: ' + fx('8 + 3 = 11') + '.'),
        okc(11, '¡Bien! Te quitan una deuda de 3, así que ganas: ' + fx('8 + 3 = 11') + '.')
      ], { solucion: '− con − pegados da +: ' + fx('8 − (−3) = 8 + 3 = 11') + '.' })
    ]
  });

  LAMINAS.push({
    id: 'L22', num: 22, cap: 3, chip: 'SIGNOS PEGADOS',
    titulo: 'Practica: signos pegados',
    html: '<p><b>Paso 1:</b> vuelve uno los signos pegados.</p><p><b>Paso 2:</b> usa la plata.</p>',
    mas: () =>
      '<p>En ' + fx('6 + (−9)') + ' el + y el − están pegados. Son distintos, así que quedan en un solo −: ' + fx('6 − 9') + '.</p>' +
      '<p>Ahora usa la plata: tienes 6 y debes 9. Pagas 6 y todavía debes 3 → ' + N(-3) + '.</p>',
    bloques: [
      pTec('6 + (−9)', -3, E([
        [['15'], 'Casi. + pegado con − da −. Queda ' + fx('6 − 9') + ': tienes 6 y debes 9 → ' + N(-3) + '.'],
        [['3'], 'Casi. Revisa el signo: debes más de lo que tienes → ' + N(-3) + '.'],
        [['-15'], 'Casi. ' + fx('6 − 9') + ': signos distintos, se cancelan: ' + t('9 − 6 = 3') + ', y gana la deuda → ' + N(-3) + '.']
      ]), { enunciado: 'A. ' + fx('6 + (−9) = ?'), solucion: 'Queda ' + fx('6 − 9') + ': tienes 6 y debes 9 → ' + N(-3) + '.' }),
      pTec('−4 − (−10)', 6, E([
        [['-14'], 'Casi. Los dos menos del medio están pegados: − con − da +. Queda ' + fx('−4 + 10') + '.'],
        [['-6'], 'Casi. Revisa el signo: tienes 10 y debes 4 → ' + N(6) + '.'],
        [['14'], 'Casi. ' + fx('−4 + 10') + ': se cancelan: ' + t('10 − 4 = 6') + '.']
      ]), { enunciado: 'B. ' + fx('−4 − (−10) = ?'), solucion: 'Queda ' + fx('−4 + 10') + ': tienes 10 y debes 4 → ' + N(6) + '.' })
    ]
  });

  LAMINAS.push({
    id: 'L23', num: 23, cap: 3,
    titulo: 'Cómo se escribe multiplicar y dividir',
    html: () =>
      '<p>Multiplicar se escribe así:</p>' +
      '<p class="lsb-linea">' + fx('3 × 4 = 3 · 4 = 3(4) = (3)(4) = 12') + '</p>' +
      '<p>Un número pegado a un paréntesis, o dos paréntesis pegados, <b>se multiplican</b>.</p>' +
      '<p>Dividir: ' + fx('12 ÷ 3 = 12/3 = 4') + '</p>' +
      '<p>Nunca van dos signos seguidos sin paréntesis: se escribe ' + fx('5 · (−3)') + ', no <span class="tachado">5 · −3</span>.</p>' +
      '<div class="dibujo">' + svgLupa23() + '</div>',
    mas: () =>
      '<p>El «×» se confunde con la letra x, por eso en álgebra casi siempre se usa el punto «·» o los paréntesis pegados.</p>' +
      '<p>' + fx('2(−4)') + ' se lee «2 por menos 4». Como no hay nada entre el 2 y el paréntesis, se multiplican: ' + fx('2 · (−4)') + '.</p>' +
      '<p>' + fx('(−3)(5)') + ' también es multiplicar: dos paréntesis pegados.</p>',
    bloques: [{
      tipo: 'opciones',
      enunciado: '¿Qué significa ' + fx('2(−4)') + '?',
      columnas: 2,
      opciones: [
        { t: fx('2 − 4'), fb: 'Casi. El 2 está pegado al paréntesis, y eso es multiplicar: ' + fx('2 · (−4)') + '.' },
        { t: fx('2 + 4'), fb: 'Casi. Número pegado a un paréntesis = multiplicar: ' + fx('2 · (−4)') + '.' },
        { t: fx('24'), fb: 'Casi. Las cifras no se juntan. Número pegado a un paréntesis = multiplicar.' },
        { t: fx('2 · (−4)'), ok: true, fb: '¡Eso! Número pegado a un paréntesis = multiplicar.' }
      ],
      solucion: 'Número pegado a un paréntesis = multiplicar: ' + fx('2(−4) = 2 · (−4)') + '.'
    }]
  });

  LAMINAS.push({
    id: 'L24', num: 24, cap: 3,
    titulo: 'Positivo por negativo',
    html: () =>
      '<p>' + fx('3 · (−2)') + ' = tres deudas de $2.</p>' +
      '<p>Debes ' + t('2 + 2 + 2 = 6') + ' → <b>' + N(-6) + '</b>.</p>' +
      '<p>Positivo por negativo da <b>negativo</b>.</p>' +
      '<p>El orden no importa: ' + fx('(−2) · 3 = −6') + '.</p>' +
      '<div class="dibujo">' + svgGrupos24() + '</div>',
    mas: () =>
      '<p>Multiplicar es sumar varias veces lo mismo: ' + fx('3 · 2 = 2 + 2 + 2 = 6') + '.</p>' +
      '<p>Si en vez de 2 dólares son deudas de 2, entonces ' + fx('3 · (−2) = (−2) + (−2) + (−2)') + ': debes 6, o sea ' + N(-6) + '.</p>' +
      '<p>Pero la plata ya no sirve para negativo por negativo (¿qué sería «deuda por deuda»?). Para eso, la siguiente lámina usa un patrón.</p>',
    bloques: [
      pTec('4 · (−5)', -20, E([
        [['20'], 'Casi. El número está bien. Pero son 4 deudas de 5: debes 20 → ' + N(-20) + '.'],
        [['-1', '1', '-9', '9'], 'Casi. ' + fx('4 · (−5)') + ' es multiplicar, no sumar ni restar: 4 deudas de 5 → ' + N(-20) + '.']
      ]), { solucion: '4 deudas de 5: debes ' + t('4 · 5 = 20') + ' → ' + N(-20) + '.' })
    ]
  });

  const E25 = E([
    [['-2'], 'Casi. Mira: ' + N(-6) + ', ' + N(-4) + ', ' + N(-2) + ', ' + N(0) + '… sube de 2 en 2. Después del 0 viene ' + N(2) + '.'],
    [['0'], 'Casi. El 0 ya salió en la fila de arriba. Súmale 2: da ' + N(2) + '.']
  ]);
  LAMINAS.push({
    id: 'L25', num: 25, cap: 3, masAlFallar: true,
    titulo: 'Negativo por negativo: mira el patrón',
    html: () =>
      '<p>Aquí la plata ya no sirve. Mira:</p>' +
      '<div class="lsb-patron"><div class="lsb-filas">' +
      '<div class="lsb-fila">' + fx('3 · (−2) = −6') + '</div>' +
      '<div class="lsb-fila lsb-oc" data-toque="1">' + fx('2 · (−2) = −4') + '</div>' +
      '<div class="lsb-fila lsb-oc" data-toque="2">' + fx('1 · (−2) = −2') + '</div>' +
      '<div class="lsb-fila lsb-oc" data-toque="3">' + fx('0 · (−2) = 0') + '</div>' +
      '<div class="lsb-fila lsb-oc" data-toque="4">' + fx('(−1) · (−2) =') + ' <span class="lsb-solo-lam lsb-preg" data-preg>?</span><span class="lsb-oc" data-final>' + N(2) + '</span></div>' +
      '<div class="lsb-fila lsb-oc" data-final>' + fx('(−2) · (−2) = 4') + '</div>' +
      '</div><div class="dibujo lsb-patron-svg">' + svgPatron25() + '</div></div>' +
      '<p class="lsb-oc" data-toque="4"><b>Cada vez el resultado sube 2.</b></p>' +
      '<p class="lsb-frase lsb-oc" data-final>Negativo por negativo da POSITIVO.</p>',
    mas: () =>
      '<p>El primer número baja de 1 en 1: 3, 2, 1, 0, −1.</p>' +
      '<p>El resultado sube de 2 en 2: ' + N(-6) + ', ' + N(-4) + ', ' + N(-2) + ', ' + N(0) + '… Si el patrón sigue, lo que viene es ' + N(2) + '.</p>' +
      '<p>Las matemáticas no se «rompen» de golpe: el patrón tiene que seguir. Así se comprueba que negativo por negativo da positivo.</p>',
    bloques: [{
      tipo: 'custom',
      verif: [{ fuente: '(−1) · (−2)', correcta: 2, errores: E25 }],
      render(el, api) {
        const body = el.closest('.lam-body') || document;
        const mostrar = (sel) => body.querySelectorAll(sel).forEach(x => x.classList.remove('lsb-oc'));
        const final = () => { mostrar('[data-final]'); body.querySelectorAll('[data-preg]').forEach(x => x.remove()); };
        if (yaHecho(api.ctx, 'L25', 25)) {
          for (let i = 1; i <= 4; i++) mostrar('[data-toque="' + i + '"]');
          final(); api.completar(true); return;
        }
        let k = 0;
        el.innerHTML = '<button class="btn btn-sec btn-ancho" data-noswipe>Ver la siguiente fila</button><div class="lsb-zona"></div>';
        const bt = el.querySelector('button');
        bt.addEventListener('click', () => {
          k++; mostrar('[data-toque="' + k + '"]');
          if (k >= 4) {
            bt.remove();
            tecladoLocal(el.querySelector('.lsb-zona'), {
              enunciado: fx('(−1) · (−2) = ?'), correcta: 2, errores: E25,
              okFb: '¡Eso! Después del 0 viene ' + N(2) + '. Mira la última fila.',
              solucion: 'El resultado sube de 2 en 2: ' + N(-2) + ', ' + N(0) + ', ' + N(2) + '.'
            }, api, (ok1) => { final(); api.completar(ok1); });
          }
        });
      }
    }]
  });

  LAMINAS.push({
    id: 'L26', num: 26, cap: 3, chip: 'CUENTA LOS NEGATIVOS', masAlFallar: true,
    titulo: 'Multiplicar y dividir: CUENTA LOS NEGATIVOS',
    html: () =>
      '<p>Para <b>multiplicar y dividir</b>:</p>' +
      '<ol class="lista-num"><li>Decide el signo: <b>iguales → +</b>, <b>distintos → −</b>.</li>' +
      '<li class="lsb-oc" data-toque="1">Multiplica o divide los tamaños como siempre.</li></ol>' +
      '<div class="lsb-ejemplos lsb-oc" data-toque="2">' + fx('(−3) · (−4) = 12') + fx('(−20) ÷ 4 = −5') + fx('(−18) ÷ (−6) = 3') + '</div>' +
      '<div class="lsb-oc" data-toque="3"><p>Es <b>la misma tabla</b> de los signos pegados.</p>' +
      '<div class="dibujo lsb-tabla"><span class="lsb-tabla-ico" aria-hidden="true">· ÷</span>' + svg().tablaSignos(null, 'Tabla de signos para multiplicar y dividir') + '</div></div>' +
      '<div class="caja-nota lsb-oc" data-toque="4"><b>Con varios factores, cuenta los negativos:</b> si son par → +, si son impar → −. ' +
      'El 0 no tiene signo: ' + fx('0 · (−3) = 0') + '. Dividir <b>entre 0</b> no se puede.</div>',
    mas: () =>
      '<p>Dividir usa la misma regla porque es multiplicar al revés: ' + fx('(−18) ÷ (−6) = 3') + ', porque ' + fx('3 · (−6) = −18') + '.</p>' +
      '<p>Con tres factores, por ejemplo ' + fx('(−1)(−2)(−3)') + ': hay 3 negativos y 3 es impar → negativo; los tamaños dan ' + t('1 · 2 · 3 = 6') + '; resultado ' + N(-6) + '.</p>' +
      '<p>Esta regla sirve <b>solo</b> cuando hay ·, ÷ o signos pegados. En ' + fx('−5 − 9') + ' no sirve.</p>' +
      '<p>En los libros a esto le dicen <b>ley de signos</b>.</p>',
    bloques: [
      porToques('L26', 26, ['Ver el paso 2', 'Ver ejemplos', 'Ver la tabla', 'Abrir el recuadro: varios factores']),
      pOpc('(−6) ÷ (−2)', [
        opc(-12, 'Casi. Aquí se <b>divide</b>: ' + t('6 ÷ 2 = 3') + ', y con signos iguales → ' + fx('+3') + '.'),
        opc(-3, 'Casi. Los signos son iguales (− y −) → +. ' + t('6 ÷ 2 = 3') + '.'),
        okc(3, '¡Bien! Signos iguales → +, y ' + t('6 ÷ 2 = 3') + '.'),
        opc(12, 'Casi. Aquí se <b>divide</b>: ' + t('6 ÷ 2 = 3') + ', y con signos iguales → ' + fx('+3') + '.')
      ], { solucion: 'Signos iguales → +. ' + t('6 ÷ 2 = 3') + ', así que ' + fx('(−6) ÷ (−2) = 3') + '.' })
    ]
  });

  LAMINAS.push({
    id: 'L27', num: 27, cap: 3, chip: 'CUENTA LOS NEGATIVOS',
    titulo: 'Practica: multiplicar y dividir',
    html: '<p>Primero decide el signo contando los negativos. Después multiplica o divide los tamaños.</p><p>Escribe cada respuesta con el teclado.</p>',
    mas: () =>
      '<p>Paso 1: cuenta los negativos. Si son 2 (par), el resultado es positivo. Si son 1 o 3 (impar), es negativo.</p>' +
      '<p>Paso 2: olvida los signos y opera los tamaños. En ' + fx('(−7)(−6)') + ': ' + t('7 · 6 = 42') + '.</p>' +
      '<p>Paso 3: junta el signo y el tamaño: ' + N(42) + '.</p>',
    bloques: [
      pTec('(−7)(−6)', 42, E([
        [['-42'], 'Casi. Revisa el signo: negativo por negativo → positivo.'],
        [['-13', '13', '-1', '1'], 'Casi. Paréntesis pegados = multiplicar: ' + t('7 · 6 = 42') + '.']
      ]), { enunciado: 'A. ' + fx('(−7)(−6) = ?'), solucion: 'Dos negativos (par) → +. ' + t('7 · 6 = 42') + ' → ' + N(42) + '.' }),
      pTec('(−24) ÷ 6', -4, E([
        [['4'], 'Casi. Revisa el signo: un negativo entre un positivo, signos distintos → ' + N(-4) + '.'],
        [['-144', '-30', '-18'], 'Casi. Es dividir: ' + t('24 ÷ 6 = 4') + '. Con signos distintos → ' + N(-4) + '.']
      ]), { enunciado: 'B. ' + fx('(−24) ÷ 6 = ?'), solucion: 'Un negativo (impar) → −. ' + t('24 ÷ 6 = 4') + ' → ' + N(-4) + '.' }),
      pTec('(−2)(−3)(−1)', -6, E([
        [['6'], 'Casi. Cuenta los negativos: hay 3, y 3 es impar → ' + N(-6) + '.']
      ]), { enunciado: 'C. ' + fx('(−2)(−3)(−1) = ?'), solucion: 'Multiplica los tamaños: ' + t('2 · 3 · 1 = 6') + '. Luego pon el signo contando los negativos: hay 3, impar → ' + N(-6) + '.' })
    ]
  });

  function col28(lupa, etq, expr, res, por) {
    return '<div class="lsb-col"><div class="lsb-lupa">' + lupa + '</div><div class="lsb-etq">' + etq + '</div>' +
      '<div class="lsb-col-expr">' + fx(expr) + '</div><div class="lsb-col-res">= ' + N(res) + '</div>' +
      '<div class="lsb-col-por">' + por + '</div></div>';
  }
  LAMINAS.push({
    id: 'L28', num: 28, cap: 3,
    titulo: 'LA TRAMPA',
    html: () =>
      '<p>Se parecen, pero <b>no</b> son iguales:</p>' +
      '<div class="dibujo"><div class="lsb-trampa">' +
      col28(lupa28('<text x="44" y="50" text-anchor="middle" font-size="26" font-weight="900"><tspan style="fill:var(--neg-text)">−5</tspan><tspan style="fill:var(--ink)"> −</tspan></text>', 'Entre los dos menos está el 5'),
        'NO se tocan', '−5 − 9', -14, 'hay un número entre los signos → <b>PLATA</b> (se juntan)') +
      col28(lupa28('<text x="44" y="50" text-anchor="middle" font-size="26" font-weight="900"><tspan style="fill:var(--ink)">−(</tspan><tspan style="fill:var(--neg-text)">−</tspan></text>', 'El menos toca al paréntesis'),
        'se tocan', '−5 − (−9)', 4, 'signos pegados → ' + fx('−5 + 9')) +
      col28(lupa28('<text x="44" y="52" text-anchor="middle" font-size="32" font-weight="900" style="fill:var(--ink)">)(</text>', 'Dos paréntesis pegados'),
        'multiplicar', '(−5)(−9)', 45, 'multiplicación → negativo por negativo, positivo') +
      '</div></div>' +
      '<p class="caja-ojo">Quizá has oído <b>«menos por menos da más»</b>: esa frase solo vale con <b>·, ÷ o signos pegados</b>.</p>',
    mas: () =>
      '<p>Mira el espacio entre los dos signos.</p>' +
      '<p>Si hay un número en medio, como en ' + fx('−5 − 9') + ', no se tocan: son dos deudas y se juntan → ' + N(-14) + '.</p>' +
      '<p>Si el menos toca un paréntesis que empieza con menos, como en ' + fx('−5 − (−9)') + ', son signos pegados: queda ' + fx('−5 + 9 = 4') + '.</p>' +
      '<p>Si hay dos paréntesis pegados, como en ' + fx('(−5)(−9)') + ', se multiplica: dos negativos → positivo, y ' + t('5 · 9 = 45') + '.</p>',
    bloques: [
      pOpc('−4 − 6', [
        opc(-24, 'Casi. No hay · ni paréntesis pegados. Se juntan deudas: ' + N(-10) + '.'),
        okc(-10, '¡Bien! Hay un 4 entre los signos: debes 4 y debes 6 → ' + N(-10) + '.'),
        opc(10, 'Casi. Aquí no se multiplica: hay un 4 entre los signos. Debes 4 y debes 6 → ' + N(-10) + '.'),
        opc(24, 'Casi. No hay · ni paréntesis pegados. Se juntan deudas: ' + N(-10) + '.')
      ], { enunciado: '1. ' + fx('−4 − 6 = ?'), solucion: 'Debes 4 y debes 6: se juntan → ' + fx('−4 − 6 = −10') + '.' }),
      pOpc('(−4)(−6)', [
        opc(-24, 'Casi. Es multiplicar: negativo por negativo → ' + fx('+24') + '.'),
        opc(-10, 'Casi. Paréntesis pegados = multiplicar, no sumar: ' + t('4 · 6 = 24') + ', con signos iguales → +.'),
        opc(10, 'Casi. Paréntesis pegados = multiplicar, no sumar: ' + t('4 · 6 = 24') + ', con signos iguales → +.'),
        okc(24, '¡Esa es la diferencia que te hace ganar puntos en el examen!')
      ], { enunciado: '2. ' + fx('(−4)(−6) = ?'), solucion: 'Paréntesis pegados = multiplicar: dos negativos → +, y ' + t('4 · 6 = 24') + '.' })
    ]
  });

  LAMINAS.push({
    id: 'L29', num: 29, cap: 3,
    titulo: '¿Qué regla uso?',
    html: () =>
      '<p>Antes de calcular, pregúntate:</p>' +
      '<ol class="lsb-arbol">' +
      '<li><span>¿Hay <b>·, ÷ o paréntesis pegados</b>?</span><span class="lsb-arbol-r">→ ' + chip('CUENTA LOS NEGATIVOS') + '</span></li>' +
      '<li><span>¿Hay <b>dos signos pegados</b>, como ' + fx('−(−3)') + '?</span><span class="lsb-arbol-r">→ ' + chip('SIGNOS PEGADOS') + ' vuélvelos uno.</span></li>' +
      '<li><span>¿Quedan números separados solo por + o −?</span><span class="lsb-arbol-r">→ ' + chip('PLATA') + '</span></li>' +
      '</ol>',
    mas: () =>
      '<p>Mira qué hay <b>entre</b> los números.</p>' +
      '<p>Si hay · o ÷, o un número pegado a un paréntesis, cuenta los negativos: ' + fx('(−8)(−2) = 16') + '.</p>' +
      '<p>Si un signo toca un paréntesis que empieza con signo, vuélvelos uno: ' + fx('−8 − (−2) = −8 + 2') + '.</p>' +
      '<p>Si solo quedan + y − entre números sueltos, usa la plata: ' + fx('−8 − 2 = −10') + '.</p>',
    bloques: [
      {
        tipo: 'clasificar',
        enunciado: '<b>Parte A:</b> ¿qué regla toca? Elige un botón en cada tarjeta.',
        botones: ['PLATA', 'SIGNOS PEGADOS', 'CUENTA LOS NEGATIVOS'],
        tarjetas: [
          { html: fx('−8 − 2'), correcta: 'PLATA', fuente: '−8 − 2', valor: -10,
            fb: 'Casi. Entre los dos menos está el 8: no se tocan y no hay ·. Es PLATA: ' + fx('−8 − 2 = −10') + '.',
            okFb: '¡Eso! PLATA: dos deudas se juntan → ' + fx('−8 − 2 = −10') + '.' },
          { html: fx('(−8)(−2)'), correcta: 'CUENTA LOS NEGATIVOS', fuente: '(−8)(−2)', valor: 16,
            fb: 'Casi. Paréntesis pegados = multiplicar → CUENTA LOS NEGATIVOS: ' + fx('(−8)(−2) = 16') + '.',
            okFb: '¡Eso! Dos negativos → +: ' + fx('(−8)(−2) = 16') + '.' },
          { html: fx('−8 − (−2)'), correcta: 'SIGNOS PEGADOS', fuente: '−8 − (−2)', valor: -6,
            fb: 'Casi. El − toca al paréntesis que empieza con −: son signos pegados. − con − da +: ' + fx('−8 − (−2) = −8 + 2 = −6') + '.',
            okFb: '¡Eso! − con − pegados da +: ' + fx('−8 + 2 = −6') + '.' },
          { html: fx('−8 ÷ (−2)'), correcta: 'CUENTA LOS NEGATIVOS', fuente: '−8 ÷ (−2)', valor: 4,
            fb: 'Casi. Hay ÷ → CUENTA LOS NEGATIVOS: ' + fx('−8 ÷ (−2) = 4') + '.',
            okFb: '¡Eso! Dos negativos → +: ' + fx('−8 ÷ (−2) = 4') + '.' },
          { html: fx('−8 + 2'), correcta: 'PLATA', fuente: '−8 + 2', valor: -6,
            fb: 'Casi. No hay ·, ni ÷, ni signos pegados. PLATA: debes 8 y tienes 2 → ' + N(-6) + '.',
            okFb: '¡Eso! PLATA: debes 8 y tienes 2 → ' + fx('−8 + 2 = −6') + '.' }
        ]
      },
      {
        tipo: 'chequeo',
        titulo: 'Parte B: minichequeo 3',
        repaso: [28, 26],
        salida: '¡Minichequeo 3 superado! Ya sabes elegir la regla antes de calcular.',
        preguntas: [
          pOpc('9 − (−4)', [
            opc(-13, 'Casi. Primero junta los signos pegados: − con − da +. Queda ' + fx('9 + 4 = 13') + '.'),
            opc(-5, 'Casi. Primero junta los signos pegados: − con − da +. Queda ' + fx('9 + 4 = 13') + '.'),
            opc(5, 'Casi. − y − pegados dan +: ' + fx('9 + 4 = 13') + '.'),
            okc(13)
          ], { enunciado: '1. ' + fx('9 − (−4) = ?'), solucion: '− con − pegados da +: ' + fx('9 + 4 = 13') + '.' }),
          pOpc('(−36) ÷ (−4)', [
            opc(-40, 'Casi. Aquí se <b>divide</b>: ' + t('36 ÷ 4 = 9') + ', y con signos iguales → ' + fx('+9') + '.'),
            opc(-32, 'Casi. Aquí se <b>divide</b>: ' + t('36 ÷ 4 = 9') + ', y con signos iguales → ' + fx('+9') + '.'),
            opc(-9, 'Casi. Signos iguales → positivo: ' + t('36 ÷ 4 = 9') + '.'),
            okc(9)
          ], { enunciado: '2. ' + fx('(−36) ÷ (−4) = ?'), solucion: 'Signos iguales → +, y ' + t('36 ÷ 4 = 9') + '.' }),
          pTec('−7 − 3', -10, E([
            [['10'], 'Casi. ¡Es la trampa! Hay un 7 entre los signos, así que no se multiplica. Debes 7 y debes 3 → ' + N(-10) + '.'],
            [['21', '-21'], 'Casi. No hay · ni paréntesis pegados. Se juntan deudas: ' + N(-10) + '.'],
            [['4', '-4'], 'Casi. Las dos son deudas: mismo signo → se juntan: ' + t('7 + 3 = 10') + ' → ' + N(-10) + '.']
          ]), { enunciado: '3. ' + fx('−7 − 3 = ?'), solucion: 'Debes 7 y debes 3: se juntan → ' + N(-10) + '.' })
        ],
        segundo: [
          pOpc('7 − (−5)', [
            opc(-12, 'Casi. Primero junta los signos pegados: − con − da +. Queda ' + fx('7 + 5 = 12') + '.'),
            opc(-2, 'Casi. Primero junta los signos pegados: − con − da +. Queda ' + fx('7 + 5 = 12') + '.'),
            opc(2, 'Casi. − y − pegados dan +: ' + fx('7 + 5 = 12') + '.'),
            okc(12)
          ], { enunciado: '1. ' + fx('7 − (−5) = ?'), solucion: '− con − pegados da +: ' + fx('7 + 5 = 12') + '.' }),
          pOpc('(−28) ÷ (−4)', [
            opc(-32, 'Casi. Aquí se <b>divide</b>: ' + t('28 ÷ 4 = 7') + ', y con signos iguales → ' + fx('+7') + '.'),
            opc(-24, 'Casi. Aquí se <b>divide</b>: ' + t('28 ÷ 4 = 7') + ', y con signos iguales → ' + fx('+7') + '.'),
            opc(-7, 'Casi. Signos iguales → positivo: ' + t('28 ÷ 4 = 7') + '.'),
            okc(7)
          ], { enunciado: '2. ' + fx('(−28) ÷ (−4) = ?'), solucion: 'Signos iguales → +, y ' + t('28 ÷ 4 = 7') + '.' }),
          pTec('−6 − 5', -11, E([
            [['11'], 'Casi. ¡Es la trampa! Hay un 6 entre los signos, así que no se multiplica. Debes 6 y debes 5 → ' + N(-11) + '.'],
            [['30', '-30'], 'Casi. No hay · ni paréntesis pegados. Se juntan deudas: ' + N(-11) + '.'],
            [['1', '-1'], 'Casi. Las dos son deudas: mismo signo → se juntan: ' + t('6 + 5 = 11') + ' → ' + N(-11) + '.']
          ]), { enunciado: '3. ' + fx('−6 − 5 = ?'), solucion: 'Debes 6 y debes 5: se juntan → ' + N(-11) + '.' })
        ]
      }
    ]
  });

  LAMINAS.push({
    id: 'L29b', num: 29.5, cap: 3,
    titulo: (c) => '¡Capítulo 3 listo, ' + c.nombre + '!',
    html: cierreCap(3,
      'Ya sabes qué hacer con los signos pegados, cómo multiplicar y dividir con negativos, y cómo no caer en la trampa.',
      'el último capítulo: potencias y operaciones combinadas.')
  });

  // ---------------- CAPÍTULO 4 ----------------
  LAMINAS.push({
    id: 'L30', num: 30, cap: 4,
    entrada: 'Capítulo 4 de 4 · Potencias y operaciones combinadas · unos 8 minutos',
    titulo: '¿Qué es una potencia?',
    html: () =>
      '<p>' + fx('2³') + ' significa multiplicar el 2 tres veces:</p>' +
      '<p class="lsb-linea">' + fx('2³ = 2 · 2 · 2 = 8') + '</p>' +
      '<div class="dibujo">' + svgPotencia30() + '</div>' +
      '<p>El 2 es la <b>base</b>. El numerito 3 es el <b>exponente</b>: dice cuántas veces se multiplica la base.</p>' +
      '<p>¡Ojo! ' + fx('2³') + ' <b>no</b> es ' + fx('2 · 3') + ': ' + mal('2³ = 6') + '</p>' +
      '<p>' + fx('5²') + ' se lee «cinco al cuadrado» y ' + fx('2³') + ' se lee «dos al cubo».</p>',
    mas: () =>
      '<p>' + fx('2³ = 2 · 2 · 2') + ': primero ' + fx('2 · 2 = 4') + ', luego ' + fx('4 · 2 = 8') + '.</p>' +
      '<p>' + fx('5² = 5 · 5 = 25') + '. El exponente cuenta cuántas veces escribes la base; no se multiplica por ella.</p>',
    bloques: [
      pOpc('3²', [
        opc(5, 'Casi. No se suma: ' + fx('3² = 3 · 3 = 9') + '.'),
        opc(6, 'Casi. ' + fx('3²') + ' no es ' + fx('3 · 2') + '. Es ' + fx('3 · 3 = 9') + '.'),
        okc(9, '¡Bien! ' + fx('3² = 3 · 3 = 9') + '.'),
        opc(32, 'Casi. El numerito no se pega al 3: dice cuántas veces multiplicas. ' + fx('3 · 3 = 9') + '.')
      ], { solucion: fx('3² = 3 · 3 = 9') + '.' })
    ]
  });

  LAMINAS.push({
    id: 'L31', num: 31, cap: 4, chip: 'POTENCIA', masAlFallar: true,
    titulo: 'Potencias de números negativos',
    html: () =>
      '<p>Si la base negativa va <b>entre paréntesis</b>, se multiplica con su signo:</p>' +
      '<p class="lsb-linea">' + fx('(−2)² = (−2)(−2) = 4') + '</p>' +
      '<p class="lsb-linea">' + fx('(−2)³ = (−2)(−2)(−2) = −8') + '</p>' +
      '<p>Cuenta los negativos:<br>exponente <b>par</b> → positivo<br>exponente <b>impar</b> → negativo</p>' +
      '<div class="dibujo lsb-dos"><table class="lsb-tabla-pot" aria-label="Potencias de menos 2">' +
      ['(−2)^1 = −2', '(−2)^2 = 4', '(−2)^3 = −8', '(−2)^4 = 16'].map(s => '<tr><td>' + fx(s) + '</td></tr>').join('') +
      '</table>' + svgParejas31() + '</div>',
    mas: () =>
      '<p>' + fx('(−2)³ = (−2)(−2)(−2)') + '.</p>' +
      '<p>Primero, ' + fx('(−2)(−2) = 4') + ' (negativo por negativo).</p>' +
      '<p>Luego, ' + fx('4 · (−2) = −8') + ' (positivo por negativo).</p>' +
      '<p>Cada pareja de negativos se vuelve positiva. Si sobra uno sin pareja, como pasa con un exponente impar, el resultado queda negativo.</p>',
    bloques: [
      pOpc('(−1)⁵', [
        opc(-5, 'Casi. No es ' + fx('(−1) · 5') + '. Es ' + fx('(−1)') + ' multiplicado 5 veces por sí mismo: ' + fx('(−1)(−1)(−1)(−1)(−1) = −1') + '.'),
        okc(-1, '¡Bien! El exponente 5 es impar: el negativo se queda.'),
        opc(1, 'Casi. El exponente 5 es impar: el negativo se queda. ' + fx('(−1)⁵ = −1') + '.'),
        opc(5, 'Casi. No es ' + fx('(−1) · 5') + '. Es ' + fx('(−1)') + ' multiplicado 5 veces por sí mismo: ' + fx('(−1)(−1)(−1)(−1)(−1) = −1') + '.')
      ], { solucion: '5 negativos: impar → −. ' + fx('(−1)⁵ = −1') + '.' })
    ]
  });

  LAMINAS.push({
    id: 'L32', num: 32, cap: 4, chip: 'POTENCIA', masAlFallar: true,
    titulo: '¿Con paréntesis o sin paréntesis?',
    html: () =>
      '<p>El exponente solo toca <b>lo que está pegado a él</b>.</p>' +
      '<div class="dibujo">' + svgAlcance32() + '</div>' +
      '<p><b>' + fx('(−3)²') + '</b>: el paréntesis mete al menos adentro → ' + fx('(−3)(−3) = 9') + '</p>' +
      '<p><b>' + fx('−3²') + '</b>: el menos está afuera y no se eleva → ' + fx('−(3 · 3) = −9') + '</p>' +
      '<p>Sin paréntesis, el menos espera afuera.</p>',
    mas: () =>
      '<p>Aquí el menos hace su trabajo 3: «lo contrario de».</p>' +
      '<p>' + fx('−3²') + ' es «lo contrario de ' + fx('3²') + '», o sea lo contrario de ' + N(9) + ': ' + N(-9) + '.</p>' +
      '<p>En cambio, ' + fx('(−3)²') + ' es «' + N(-3) + ' multiplicado por sí mismo»: ' + fx('(−3)(−3) = 9') + '.</p>' +
      '<p>Esta diferencia confunde hasta a estudiantes de universidad, así que fíjate siempre si hay paréntesis.</p>',
    bloques: [
      pOpc('−4²', [
        okc(-16, '¡Bien! El ² solo toca al 4: ' + t('4 · 4 = 16') + ', y el menos de afuera → ' + N(-16) + '.'),
        opc(-8, 'Casi. ' + fx('4²') + ' no es ' + fx('4 · 2') + '. Es ' + fx('4 · 4 = 16') + '. Con el menos afuera: ' + N(-16) + '.'),
        opc(8, 'Casi. ' + fx('4²') + ' no es ' + fx('4 · 2') + '. Es ' + fx('4 · 4 = 16') + '. Con el menos afuera: ' + N(-16) + '.'),
        opc(16, 'Casi. Sin paréntesis, el ² solo toca al 4: ' + t('4 · 4 = 16') + ', y el menos de afuera lo vuelve ' + N(-16) + '.')
      ], { solucion: 'Sin paréntesis: ' + fx('−4² = −(4 · 4) = −16') + '.' })
    ]
  });

  LAMINAS.push({
    id: 'L33', num: 33, cap: 4, chip: 'POTENCIA',
    titulo: 'Practica potencias',
    html: '<p>Fíjate primero si el menos está <b>dentro</b> del paréntesis o <b>afuera</b>. Luego multiplica la base las veces que diga el exponente.</p>',
    mas: () =>
      '<p>' + fx('(−5)²') + ': el menos está adentro, se eleva con el 5 → ' + fx('(−5)(−5) = 25') + '.</p>' +
      '<p>' + fx('−2⁴') + ': el menos espera afuera → ' + fx('−(2 · 2 · 2 · 2) = −16') + '.</p>' +
      '<p>' + fx('−(−3)²') + ': primero la potencia, ' + fx('(−3)² = 9') + '; después el menos de afuera le da la vuelta → ' + N(-9) + '.</p>',
    bloques: [
      pTec('(−5)²', 25, E([
        [['-25'], 'Casi. Con paréntesis, el menos también se eleva: ' + fx('(−5)(−5) = 25') + '.'],
        [['10', '-10'], 'Casi. ² no es «por 2»: ' + fx('(−5)(−5) = 25') + '.']
      ]), { enunciado: 'A. ' + fx('(−5)² = ?'), solucion: fx('(−5)² = (−5)(−5) = 25') + '.' }),
      pTec('−2⁴', -16, E([
        [['16'], 'Casi. Sin paréntesis, el ⁴ solo toca al 2: ' + t('2 · 2 · 2 · 2 = 16') + ', y el menos queda afuera → ' + N(-16) + '.'],
        [['-8', '8'], 'Casi. ⁴ significa 4 veces: ' + t('2 · 2 · 2 · 2 = 16') + '. Luego el menos → ' + N(-16) + '.']
      ]), { enunciado: 'B. ' + fx('−2⁴ = ?'), solucion: fx('−2⁴ = −(2 · 2 · 2 · 2) = −16') + '.' }),
      pTec('(−3)³', -27, E([
        [['27'], 'Casi. El exponente 3 es impar: queda negativo → ' + N(-27) + '.'],
        [['-9', '9'], 'Casi. No es ' + fx('(−3) · 3') + '. Es ' + fx('(−3)(−3)(−3) = −27') + '.']
      ]), { enunciado: 'C. ' + fx('(−3)³ = ?'), solucion: fx('(−3)³ = (−3)(−3)(−3) = −27') + '.' }),
      pTec('−(−3)²', -9, E([
        [['9'], 'Casi. Primero la potencia: ' + fx('(−3)² = 9') + '. Después el menos de afuera da la vuelta: ' + N(-9) + '.'],
        [['6', '-6'], 'Casi. ² no es «por 2»: ' + fx('(−3)(−3) = 9') + ', y el menos de afuera → ' + N(-9) + '.']
      ]), { enunciado: 'D. ' + fx('−(−3)² = ?'), solucion: 'Primero ' + fx('(−3)² = 9') + '. Luego lo contrario de ' + N(9) + ' es ' + N(-9) + '.' })
    ]
  });

  LAMINAS.push({
    id: 'L34', num: 34, cap: 4, chip: 'ESCALERA', masAlFallar: true,
    titulo: 'La escalera: ¿qué va primero?',
    html: () =>
      '<p><b>Operación combinada</b> = un ejercicio con varias operaciones mezcladas. Se resuelve subiendo la escalera:</p>' +
      '<ol class="lista-num"><li>( ) lo de adentro de los paréntesis</li><li>Potencias</li><li><b>· y ÷</b> (mismo escalón)</li><li><b>+ y −</b> (mismo escalón)</li></ol>' +
      '<div class="dibujo lsb-esc">' + svg().escalera(0) + '</div>' +
      '<p>En el mismo escalón: <b>de izquierda a derecha</b>, como lees.</p>' +
      '<p class="lsb-linea">' + fx('12 ÷ 3 · 2 = 4 · 2 = 8') + ' <span class="tinta-2 peq">(no 2)</span></p>',
    mas: () =>
      '<p>En ' + fx('12 ÷ 3 · 2') + ', la división y la multiplicación están en el mismo escalón. Va primero la que aparece primero: ' + fx('12 ÷ 3 = 4') + ', y luego ' + fx('4 · 2 = 8') + '.</p>' +
      '<p>Si haces primero ' + fx('3 · 2 = 6') + ', te sale ' + fx('12 ÷ 6 = 2') + ', que está mal.</p>' +
      '<p>Lo mismo con + y −: ' + fx('10 − 4 + 2 = 6 + 2 = 8') + '.</p>' +
      '<p>Si hay corchetes [ ] o llaves { }, se resuelven igual que los paréntesis, de adentro hacia afuera.</p>',
    bloques: [
      {
        tipo: 'opciones',
        enunciado: '1. ¿Qué se hace <b>primero</b> en ' + fx('2 + 3 · (−4)') + '?',
        columnas: 2,
        opciones: [
          { t: fx('2 + 3'), fb: 'Casi. El · está en un escalón más alto que el +. Primero ' + fx('3 · (−4) = −12') + ', y después ' + fx('2 + (−12) = −10') + '.' },
          { t: fx('3 · (−4)'), ok: true, fb: '¡Eso! ' + fx('3 · (−4) = −12') + ', y luego ' + fx('2 + (−12) = 2 − 12 = −10') + '.' }
        ],
        solucion: 'El · va antes que el +: ' + fx('3 · (−4) = −12') + ', y luego ' + fx('2 + (−12) = −10') + '.'
      },
      pOpc('10 − 4 + 2', [
        opc(4, 'Casi. − y + están en el mismo escalón: de izquierda a derecha. ' + fx('10 − 4 = 6') + ' y ' + fx('6 + 2 = 8') + '.'),
        okc(8, '¡Bien! De izquierda a derecha: ' + fx('10 − 4 = 6') + ' y ' + fx('6 + 2 = 8') + '.')
      ], { enunciado: '2. ' + fx('10 − 4 + 2 = ?'), solucion: 'De izquierda a derecha: ' + fx('10 − 4 + 2 = 6 + 2 = 8') + '.' })
    ]
  });

  const mini = (n) => '<div class="lsb-esc-mini" aria-hidden="true">' + svg().escalera(n) + '</div>';
  function paso(cuerpo, n) { return '<div class="lsb-paso"><div class="lsb-paso-txt">' + cuerpo + '</div>' + (n ? mini(n) : '') + '</div>'; }
  LAMINAS.push({
    id: 'L35', num: 35, cap: 4, chip: 'ESCALERA',
    titulo: 'Ejemplo resuelto paso a paso',
    html: () =>
      '<p>Toca <b>Ver siguiente paso</b>. Lo que se resuelve está en el recuadro.</p>' +
      '<p class="lsb-linea">' + fx('3 − 2(−4) + (−6) ÷ 2') + '</p>',
    mas: () =>
      '<p>Antes de calcular, busca en qué escalón está cada operación. Aquí hay · (el 2 pegado al paréntesis) y ÷: son del escalón 3, así que van primero, de izquierda a derecha.</p>' +
      '<p>Después quedan solo + y −. Vuelve uno los signos pegados y termina con la plata: tienes 3 y 8, debes 3.</p>',
    bloques: [{
      tipo: 'pasos',
      titulo: 'Ejercicio: ' + fx('3 − 2(−4) + (−6) ÷ 2'),
      filas: [
        { n: 'Antes', fuente: '3 − 2(−4) + (−6) ÷ 2',
          html: '<p>Hay · y ÷, así que primero va el escalón 3.</p><p><b>Cuidado:</b> el ' + fx('3 − 2') + ' no se hace primero, porque el 2 está pegado al paréntesis y está multiplicando.</p><p>' + mal('3 − 2 = 1') + ' ✗</p>' },
        { n: 'Paso 1', regla: 'CUENTA LOS NEGATIVOS', fuente: '3 − (−8) + (−6) ÷ 2',
          html: paso(mk([['3 − ', false], ['2(−4)', true], [' + (−6) ÷ 2', false]]) +
            '<div class="lsb-sub">' + fx('2(−4) = −8') + ' <span class="peq tinta-2">positivo por negativo → negativo</span></div>' + flecha('3 − (−8) + (−6) ÷ 2'), 3) },
        { n: 'Paso 2', regla: 'CUENTA LOS NEGATIVOS', fuente: '3 − (−8) + (−3)',
          html: paso(mk([['3 − (−8) + ', false], ['(−6) ÷ 2', true]]) +
            '<div class="lsb-sub">' + fx('(−6) ÷ 2 = −3') + ' <span class="peq tinta-2">signos distintos → negativo</span></div>' + flecha('3 − (−8) + (−3)'), 3) },
        { n: 'Paso 3', regla: 'SIGNOS PEGADOS', fuente: '3 + 8 − 3',
          html: paso(mk([['3 ', false], ['− (−8)', true], [' ', false], ['+ (−3)', true]]) +
            '<div class="lsb-sub">' + fx('−(−8)') + ' → ' + fx('+8') + ' y ' + fx('+(−3)') + ' → ' + fx('−3') + '</div>' + flecha('3 + 8 − 3'), 4) },
        { n: 'Paso 4', regla: 'PLATA', fuente: '11 − 3',
          html: paso(mk([['3 + 8 − 3', true]]) +
            '<div class="lsb-sub">Tienes ' + t('3 + 8 = 11') + ' y debes 3 → ' + fx('11 − 3 = 8') + '</div>', 4) },
        { n: 'Final', fuente: '3 − 2(−4) + (−6) ÷ 2',
          html: '<p class="lsb-linea">' + fx('3 − 2(−4) + (−6) ÷ 2 = 8') + '</p>' }
      ],
      pregunta: {
        despuesDe: 2, tipoPreg: 'opciones',
        enunciado: '¿Por qué ' + fx('(−6) ÷ 2') + ' da ' + N(-3) + '?',
        opciones: [
          { t: 'Porque 6 es mayor que 2', fb: 'Casi. En ÷ el signo lo decide la regla: − y + son distintos → negativo.' },
          { t: 'Porque se juntan deudas', fb: 'Casi. «Se juntan» es para sumar y restar. Aquí se divide: CUENTA LOS NEGATIVOS.' },
          { t: 'Signos distintos al dividir → negativo', ok: true, fb: '¡Eso! Hay un solo negativo (impar) → negativo, y ' + t('6 ÷ 2 = 3') + '.' }
        ],
        solucion: 'Al dividir, signos distintos → negativo: ' + fx('(−6) ÷ 2 = −3') + '.'
      }
    }]
  });

  LAMINAS.push({
    id: 'L36', num: 36, cap: 4,
    titulo: 'Dos trampas más',
    html: () =>
      '<div class="lsb-tarjetas">' +
      '<div class="tarjeta lsb-tj"><p><b>Trampa 1:</b> un menos delante de un paréntesis con una cuenta adentro.</p>' +
      '<p class="lsb-malrow">' + mal('7 − (3 − 5) = 7 − 3 − 5') + ' ✗</p>' +
      '<p>' + fx('7 − (3 − 5)') + ': primero el paréntesis: ' + fx('3 − 5 = −2') + '.</p>' +
      '<p>Queda ' + fx('7 − (−2) = 7 + 2 = 9') + '.</p>' +
      '<p class="peq">Con corchetes es igual: ' + fx('8 − [1 − 4] = 8 − (−3) = 11') + '.</p></div>' +
      '<div class="tarjeta lsb-tj"><p><b>Trampa 2:</b> la potencia va antes que la multiplicación.</p>' +
      '<p class="lsb-malrow">' + mal('2 · (−3)² = (−6)² = 36') + ' ✗</p>' +
      '<p>' + fx('2 · (−3)²') + ': primero ' + fx('(−3)² = 9') + ', y luego ' + fx('2 · 9 = 18') + '.</p></div>' +
      '</div>',
    mas: () =>
      '<p><b>Error típico 1:</b> escribir ' + mal('7 − 3 − 5 = −1') + ', cambiando solo el primer número. El menos de afuera afecta a <b>todo</b> lo que hay en el paréntesis, por eso lo más seguro es resolver primero adentro.</p>' +
      '<p><b>Error típico 2:</b> hacer ' + fx('2 · (−3) = −6') + ' y luego elevar ' + fx('(−6)² = 36') + '. Pero la potencia está en un escalón más alto: primero se eleva y después se multiplica.</p>',
    bloques: [
      pOpc('5 − (2 − 6)', [
        opc(-3, 'Casi. El menos de afuera afecta a todo el paréntesis. Primero adentro: ' + fx('2 − 6 = −4') + '. Luego ' + fx('5 − (−4) = 9') + '.'),
        opc(1, 'Casi. ' + fx('2 − 6 = −4') + ', y queda ' + fx('5 − (−4)') + ': − con − pegados → +. ' + fx('5 + 4 = 9') + '.'),
        okc(9, '¡Bien! Primero adentro: ' + fx('2 − 6 = −4') + '. Luego ' + fx('5 − (−4) = 5 + 4 = 9') + '.')
      ], { columnas: 1, solucion: 'Primero adentro: ' + fx('2 − 6 = −4') + '. Luego ' + fx('5 − (−4) = 5 + 4 = 9') + '.' })
    ]
  });

  LAMINAS.push({
    id: 'L37', num: 37, cap: 4,
    titulo: 'Te toca terminar',
    html: '<p>Los primeros pasos ya están hechos. Tú haces los que faltan.</p>',
    mas: () =>
      '<p>Sigue la escalera: primero potencias, después · y ÷, al final + y −.</p>' +
      '<p>En ' + fx('10 − 3(−2)²') + ' la potencia va primero: ' + fx('(−2)² = 4') + '. Recién después se multiplica por 3.</p>',
    bloques: [
      {
        tipo: 'pasos',
        titulo: 'Ejercicio A: ' + fx('10 − 3(−2)²'),
        filas: [
          { n: 'Paso 1', regla: 'POTENCIA', fuente: '10 − 3 · 4',
            html: mk([['10 − 3', false], ['(−2)²', true]]) + '<div class="lsb-sub">' + fx('(−2)² = 4') + '</div>' + flecha('10 − 3 · 4') + ' <span class="lsb-visto">✓</span>' },
          { n: 'Paso 2', regla: 'CUENTA LOS NEGATIVOS', fuente: '10 − 12',
            html: mk([['10 − ', false], ['3 · 4', true]]) + '<div class="lsb-sub">' + fx('3 · 4 = 12') + '</div>' + flecha('10 − 12') + ' <span class="lsb-visto">✓</span>' },
          { n: 'Paso 3', regla: 'PLATA', html: '<b>Tú:</b> ' + mk([['10 − 12', true]]) }
        ],
        pregunta: Object.assign(pTec('10 − 12', -2, E([
          [['2'], 'Casi. Revisa el signo: tienes 10 y debes 12 → ' + N(-2) + '.'],
          [['22', '-22'], 'Casi. Los signos son distintos: se cancelan. ' + t('12 − 10 = 2') + ', y gana la deuda → ' + N(-2) + '.']
        ]), { solucion: 'Tienes 10 y debes 12: te faltan 2 → ' + N(-2) + '.' }), { despuesDe: 2, tipoPreg: 'teclado' })
      },
      {
        tipo: 'pasos',
        titulo: 'Ejercicio B: ' + fx('(−12) ÷ 4 − 2(−5)'),
        filas: [
          { n: 'Paso 1', regla: 'CUENTA LOS NEGATIVOS', fuente: '−3 − 2(−5)',
            html: mk([['(−12) ÷ 4', true], [' − 2(−5)', false]]) + '<div class="lsb-sub">' + fx('(−12) ÷ 4 = −3') + '</div>' + flecha('−3 − 2(−5)') + ' <span class="lsb-visto">✓</span>' },
          { n: 'Paso 2', regla: 'CUENTA LOS NEGATIVOS', html: '<b>Tú:</b> ' + mk([['−3 − ', false], ['2(−5)', true]]) }
        ],
        pregunta: Object.assign(pTec('2(−5)', -10, E([
          [['10'], 'Casi. Revisa el signo: positivo por negativo → ' + N(-10) + '.'],
          [['-3', '3', '-7'], 'Casi. ' + fx('2(−5)') + ' es multiplicar: ' + t('2 · 5 = 10') + ', con signos distintos → ' + N(-10) + '.']
        ]), { solucion: fx('2(−5) = −10') + ': positivo por negativo → negativo.' }), { despuesDe: 1, tipoPreg: 'teclado' })
      },
      {
        tipo: 'pasos',
        filas: [
          { n: 'Paso 3', regla: 'SIGNOS PEGADOS', fuente: '−3 − (−10)',
            html: 'Queda ' + fx('−3 − (−10)') + '. <b>Tú:</b> ' + mk([['−3 − (−10)', true]]) }
        ],
        pregunta: Object.assign(pTec('−3 − (−10)', 7, E([
          [['-13'], 'Casi. Los dos menos del medio están pegados: − con − da +. Queda ' + fx('−3 + 10 = 7') + '.'],
          [['-7'], 'Casi. Revisa el signo: tienes 10 y debes 3 → ' + fx('+7') + '.'],
          [['13'], 'Casi. ' + fx('−3 + 10') + ': se cancelan: ' + t('10 − 3 = 7') + '.']
        ]), { solucion: '− con − pegados da +: ' + fx('−3 + 10 = 7') + '.' }), { despuesDe: 0, tipoPreg: 'teclado' })
      }
    ]
  });

  LAMINAS.push({
    id: 'L38', num: 38, cap: 4,
    titulo: 'Minichequeo 4',
    html: '<p>Tres preguntas para cerrar el capítulo. Usa la escalera y fíjate en los paréntesis.</p>',
    bloques: [{
      tipo: 'chequeo',
      repaso: [34, 35],
      salida: '¡Minichequeo 4 superado! Ya subes la escalera sin tropezar.',
      preguntas: [
        pOpc('(−4)²', [
          opc(-16, 'Casi. Con paréntesis, el menos también se eleva: ' + fx('(−4)(−4) = 16') + '.'),
          opc(-8, 'Casi. ² no es «por 2»: ' + t('4 · 4 = 16') + '.'),
          opc(8, 'Casi. ² no es «por 2»: ' + t('4 · 4 = 16') + '.'),
          okc(16)
        ], { enunciado: '1. ' + fx('(−4)² = ?'), solucion: fx('(−4)² = (−4)(−4) = 16') + '.' }),
        pOpc('−1 + 18 ÷ (−3) · 2', [
          okc(-13),
          opc(-4, 'Casi. · y ÷ están en el mismo escalón: de izquierda a derecha. ' + fx('18 ÷ (−3) = −6') + ', luego ' + fx('−6 · 2 = −12') + ', y al final ' + fx('−1 − 12 = −13') + '.'),
          opc(11, 'Casi. ' + fx('18 ÷ (−3)') + ' es negativo (signos distintos) → ' + N(-6) + ', y ' + fx('−6 · 2 = −12') + '. Luego ' + fx('−1 − 12 = −13') + '.'),
          opc(13, 'Casi. Revisa el signo: ' + fx('−1 + (−12)') + ' son dos deudas → ' + N(-13) + '.')
        ], { enunciado: '2. ' + fx('−1 + 18 ÷ (−3) · 2 = ?'), solucion: fx('18 ÷ (−3) = −6') + ', ' + fx('−6 · 2 = −12') + ', ' + fx('−1 + (−12) = −13') + '.' }),
        pTec('4 − 5 · (−2)', 14, E([
          [['2'], 'Casi. El · va antes que el −: primero ' + fx('5 · (−2) = −10') + '. Luego ' + fx('4 − (−10) = 4 + 10 = 14') + '.'],
          [['-6'], 'Casi. Quedó ' + fx('4 − (−10)') + ': − con − pegados → +. ' + fx('4 + 10 = 14') + '.'],
          [['-14'], 'Casi. Revisa el signo: ' + fx('4 + 10 = 14') + '.']
        ]), { enunciado: '3. ' + fx('4 − 5 · (−2) = ?'), solucion: 'Primero ' + fx('5 · (−2) = −10') + '. Luego ' + fx('4 − (−10) = 4 + 10 = 14') + '.' })
      ],
      segundo: [
        pOpc('(−7)²', [
          opc(-49, 'Casi. Con paréntesis, el menos también se eleva: ' + fx('(−7)(−7) = 49') + '.'),
          opc(-14, 'Casi. ² no es «por 2»: ' + t('7 · 7 = 49') + '.'),
          opc(14, 'Casi. ² no es «por 2»: ' + t('7 · 7 = 49') + '.'),
          okc(49)
        ], { enunciado: '1. ' + fx('(−7)² = ?'), solucion: fx('(−7)² = (−7)(−7) = 49') + '.' }),
        pOpc('2 − 12 ÷ (−2) · 3', [
          opc(-16, 'Casi. ' + fx('12 ÷ (−2)') + ' es negativo (signos distintos) → ' + N(-6) + ', y ' + fx('−6 · 3 = −18') + '. Luego ' + fx('2 − (−18) = 20') + '.'),
          opc(4, 'Casi. · y ÷ están en el mismo escalón: de izquierda a derecha. ' + fx('12 ÷ (−2) = −6') + ', luego ' + fx('−6 · 3 = −18') + ', y al final ' + fx('2 − (−18) = 20') + '.'),
          opc(15, 'Casi. El − va al final: · y ÷ están en un escalón más alto. ' + fx('12 ÷ (−2) · 3 = −18') + ', y ' + fx('2 − (−18) = 20') + '.'),
          okc(20)
        ], { enunciado: '2. ' + fx('2 − 12 ÷ (−2) · 3 = ?'), solucion: fx('12 ÷ (−2) = −6') + ', ' + fx('−6 · 3 = −18') + ', ' + fx('2 − (−18) = 2 + 18 = 20') + '.' }),
        pTec('6 − 4 · (−3)', 18, E([
          [['-6'], 'Casi. El · va antes que el −: ' + fx('4 · (−3) = −12') + '. Luego ' + fx('6 − (−12)') + ': − con − pegados → +. ' + fx('6 + 12 = 18') + '.'],
          [['-18'], 'Casi. Revisa el signo: ' + fx('6 + 12 = 18') + '.']
        ]), { enunciado: '3. ' + fx('6 − 4 · (−3) = ?'), solucion: 'Primero ' + fx('4 · (−3) = −12') + '. Luego ' + fx('6 − (−12) = 6 + 12 = 18') + '.' })
      ]
    }]
  });

  LAMINAS.push({
    id: 'L38b', num: 38.5, cap: 4,
    titulo: (c) => '¡Capítulo 4 listo, ' + c.nombre + '!',
    html: cierreCap(4,
      'Ya sabes qué es una potencia, cuándo el menos se eleva y cuándo espera afuera, y cómo subir la escalera en una operación combinada.',
      'volvemos al ejercicio del inicio, te llevas tu resumen en una foto y empieza el juego.')
  });

  // ---------------- CIERRE ----------------
  function ganchoNorm(g) {
    if (g == null || g === '') return null;
    const s = String(g).trim().replace(/[−–]/g, '-');
    if (['-14', '-4', '4', '14'].indexOf(s) >= 0) return s;
    return 'nose';
  }
  LAMINAS.push({
    id: 'L39', num: 39, cap: 5,
    entrada: 'Cierre · Volvamos al inicio, tu resumen y ¡a jugar!',
    titulo: 'Volvamos al inicio',
    html: () => '<p>Al inicio te preguntamos cuánto es <b>' + fx('−5 − 9') + '</b>.</p><p>Ahora escríbelo tú, sin opciones.</p>',
    bloques: [
      pTec('−5 − 9', -14, E([
        [['14'], 'Casi. Mira la lámina 12: hay un 5 entre los signos, así que se juntan deudas → ' + N(-14) + '. ' +
          '<button type="button" class="btn-txt" onclick="window.LS&&LS.laminas&&LS.laminas.verLamina(12)">Ver la lámina 12</button>'],
        [['-4', '4'], 'Casi. Las dos son deudas: mismo signo → se juntan: ' + t('5 + 9 = 14') + ' → ' + N(-14) + '.']
      ]), {
        okFb: (c) => '¡Eso, ' + c.nombre + '! ' + fx('−5 − 9 = −14') + '.',
        solucion: 'Debes 5 y debes 9 más: las deudas se juntan → ' + fx('−5 − 9 = −14') + '.'
      }),
      {
        tipo: 'revelar',
        html: (c) => {
          const g = ganchoNorm(c.gancho);
          let antes = '', msg;
          if (g === 'nose') antes = '<span class="lsb-antes-txt">No tenías idea</span>';
          else if (g) antes = '<span class="lsb-antes">' + N(parseInt(g, 10)) + '</span>';
          const x = g && g !== 'nose' ? N(parseInt(g, 10)) : '';
          if (g === '14') msg = 'Al inicio pusiste ' + x + ': es el error más común de todos. Ahora ya sabes que es ' + N(-14) + ', y que «negativo por negativo» es solo para multiplicar y dividir.';
          else if (g === '-4' || g === '4') msg = 'Al inicio pusiste ' + x + ': restaste en vez de juntar. Ahora ya lo sabes: dos deudas se juntan → ' + N(-14) + '.';
          else if (g === '-14') msg = 'Le atinaste desde el inicio. Ahora además sabes <b>por qué</b>.';
          else if (g === 'nose') msg = 'Al inicio no tenías idea. Mira todo lo que aprendiste, ' + c.nombre + '.';
          else msg = 'Ahora ya sabes resolverlo tú solo: ' + fx('−5 − 9 = −14') + '.';
          return '<div class="lsb-antes-ahora">' +
            (antes ? '<div class="lsb-aa lsb-aa-antes"><span class="peq">Antes</span>' + antes + '</div>' : '') +
            '<div class="sello lsb-aa-sello">' + svg().sello('Logro') + '</div>' +
            '<div class="lsb-aa"><span class="peq">Ahora</span><span class="lsb-ahora">' + N(-14) + '</span></div></div>' +
            '<p class="caja-nota">' + msg + '</p>';
        }
      }
    ]
  });

  function resumenHtml() {
    const it = (c, txt) => '<li>' + (c ? chip(c) + ' ' : '') + txt + '</li>';
    return '<ol class="lsb-resumen">' +
      it('LECTURA', 'Cada número se lleva el signo de su izquierda. Sin signo = +.') +
      it('PLATA', '(+ y −) Mismo signo → <b>SE JUNTAN</b>: suma los tamaños y deja el signo. Signos distintos → <b>SE CANCELAN</b>: resta los tamaños y pon el signo del de más tamaño.') +
      it('SIGNOS PEGADOS', 'Dos signos sin número en medio: iguales → +, distintos → −.') +
      it('CUENTA LOS NEGATIVOS', '(· y ÷) Negativos en número par → +; impar → −. Luego multiplica o divide los tamaños.') +
      it('POTENCIA', 'El exponente solo toca lo pegado: ' + fx('(−3)² = 9') + ' y ' + fx('−3² = −9') + '. Base negativa: exponente par +, impar −.') +
      it('ESCALERA', '( ) → potencias → · ÷ → + −. En el mismo escalón, de izquierda a derecha.') +
      it('', 'El ' + N(0) + ' no tiene signo. No se divide entre ' + N(0) + '.') +
      it('', '<b>La trampa:</b> ' + fx('−5 − 9 = −14') + ', pero ' + fx('(−5)(−9) = 45') + '.') +
      '</ol>' +
      '<div class="tarjeta lsb-arbol-caja"><p><b>¿Qué regla uso?</b></p><ol class="lsb-arbol">' +
      '<li><span>¿Hay ·, ÷ o paréntesis pegados?</span><span class="lsb-arbol-r">→ ' + chip('CUENTA LOS NEGATIVOS') + '</span></li>' +
      '<li><span>¿Dos signos pegados?</span><span class="lsb-arbol-r">→ ' + chip('SIGNOS PEGADOS') + '</span></li>' +
      '<li><span>¿Solo + y − entre números?</span><span class="lsb-arbol-r">→ ' + chip('PLATA') + '</span></li></ol></div>' +
      '<div class="lsb-dos lsb-fin40"><div class="dibujo lsb-esc">' + svg().escalera(0) + '</div>' +
      '<div class="tarjeta lsb-distinto"><p class="lsb-linea">' + fx('(−2)²') + ' ≠ ' + fx('−2²') + '</p><p>' + fx('(−2)² = 4') + '</p><p>' + fx('−2² = −4') + '</p></div></div>';
  }
  LAMINAS.push({
    id: 'L40', num: 40, cap: 5,
    titulo: 'Tu resumen en una foto',
    html: () => resumenHtml(),
    bloques: [{
      tipo: 'custom',
      render(el, api) {
        el.innerHTML = '<button class="btn btn-pri btn-ancho" data-noswipe>Guardar en mi galería</button>' +
          '<p class="peq tinta-2 lsb-nota">En iPhone: mantén presionada la imagen y elige <b>Guardar en Fotos</b>.</p>' +
          '<p class="peq tinta-2">Esta misma hoja te llega en el PDF de tus resultados.</p>' +
          '<div class="lsb-foto-zona"></div>';
        const bt = el.querySelector('button'), zona = el.querySelector('.lsb-foto-zona');
        bt.addEventListener('click', () => {
          bt.disabled = true;
          Promise.resolve(LS.resumen.descargar(zona)).catch(() => {
            zona.innerHTML = api.fb('miss', 'Casi. No se pudo crear la imagen en este navegador. Toma una captura de pantalla del resumen.');
          }).then(() => { bt.disabled = false; });
        });
        api.completar(true);
      }
    }]
  });

  LAMINAS.push({
    id: 'L41', num: 41, cap: 5,
    titulo: '¡A jugar!',
    html: (c) =>
      '<p>¡Listo, ' + c.nombre + '! Ya tienes todas las reglas.</p>' +
      '<p>Ahora a practicarlas en el juego: <b>6 paradas</b>, desde sumar y restar hasta el jefe final.</p>' +
      '<div class="dibujo">' + svgParadas41() + '</div>' +
      '<p>Si te trabas, el botón <b>«¿Qué regla era?»</b> te trae de vuelta a la lámina que necesitas.</p>' +
      '<p>Tu avance ya está guardado.</p>',
    bloques: [{ tipo: 'boton', texto: 'Ir al juego', avanzar: true }]
  });

  LS.LAMINAS = (LS.LAMINAS || []).concat(LAMINAS);

  // =====================================================================
  // «Tu resumen en una foto»: PNG 1080×1350, tema claro, signo − siempre escrito.
  // =====================================================================
  LS.resumen = (function () {
    const W = 1080, H = 1350, MX = 60;
    const C = {
      bg: '#FFFFFF', ink: '#3C3C3C', ink2: '#6F6F6F', ink3: '#8A8A8A', neg: '#B35C00', pos: '#0A76B3',
      negFill: '#FF9600', posFill: '#1CB0F6', negSoft: '#FFF0D6', posSoft: '#DDF4FF', chip: '#F6EAFF',
      line: '#E5E5E5', prize: '#FFC800', surface: '#FFFFFF'
    };
    function familia() {
      try { if (document.fonts && document.fonts.check('800 30px Nunito')) return 'Nunito, Arial, sans-serif'; } catch (e) { }
      return 'Arial, sans-serif';
    }
    let FAM = 'Arial, sans-serif';
    const fnt = (peso, px) => peso + ' ' + px + 'px ' + FAM;

    // Texto enriquecido: {−14} número con color según signo · *negrita* · [[CHIP]]
    function piezas(str) {
      const out = [], re = /\{([^}]+)\}|\*([^*]+)\*|\[\[([^\]]+)\]\]/g;
      let last = 0, m;
      const txt = (s, b) => out.push({ s, c: C.ink, b: !!b });
      while ((m = re.exec(str))) {
        if (m.index > last) txt(str.slice(last, m.index));
        if (m[1] != null) { const v = m[1]; out.push({ s: v, c: /^−/.test(v) ? C.neg : (v === '0' ? C.ink : C.pos), b: true }); }
        else if (m[2] != null) txt(m[2], true);
        else out.push({ s: m[3], chip: true });
        last = re.lastIndex;
      }
      if (last < str.length) txt(str.slice(last));
      return out;
    }
    function palabras(ps) {
      const words = []; let cur = [];
      ps.forEach(p => {
        if (p.chip) { cur.push(p); return; }
        p.s.split(/( +)/).forEach(q => {
          if (!q) return;
          if (/^ +$/.test(q)) { if (cur.length) { words.push(cur); cur = []; } }
          else cur.push({ s: q, c: p.c, b: p.b });
        });
      });
      if (cur.length) words.push(cur);
      return words;
    }
    function rr(x, px, py, w, h, r) {
      x.beginPath();
      x.moveTo(px + r, py); x.arcTo(px + w, py, px + w, py + h, r); x.arcTo(px + w, py + h, px, py + h, r);
      x.arcTo(px, py + h, px, py, r); x.arcTo(px, py, px + w, py, r); x.closePath();
    }
    function anchoPieza(x, p, size) {
      if (p.chip) { x.font = fnt(900, Math.round(size * 0.72)); return x.measureText(p.s).width + size * 0.9; }
      x.font = fnt(p.b ? 900 : 700, size); return x.measureText(p.s).width;
    }
    function dibujarPieza(x, p, px, base, size) {
      if (p.chip) {
        const cs = Math.round(size * 0.72), w = anchoPieza(x, p, size), h = size * 1.12;
        rr(x, px, base - size * 0.86, w, h, h / 2); x.fillStyle = C.chip; x.fill();
        x.font = fnt(900, cs); x.fillStyle = C.ink; x.fillText(p.s, px + size * 0.45, base - size * 0.08);
        return w;
      }
      x.font = fnt(p.b ? 900 : 700, size); x.fillStyle = p.c; x.fillText(p.s, px, base);
      return x.measureText(p.s).width;
    }
    // Devuelve la y final (debajo de la última línea).
    function parrafo(x, str, px, py, maxW, size, lh, dib) {
      const ws = palabras(piezas(str));
      x.font = fnt(700, size);
      const esp = x.measureText(' ').width;
      let lineas = [[]], anchoL = 0;
      ws.forEach(w => {
        const aw = w.reduce((a, p) => a + anchoPieza(x, p, size), 0);
        const falta = lineas[lineas.length - 1].length ? esp : 0;
        if (anchoL + falta + aw > maxW && lineas[lineas.length - 1].length) { lineas.push([]); anchoL = 0; }
        const l = lineas[lineas.length - 1];
        anchoL += (l.length ? esp : 0) + aw;
        l.push(w);
      });
      if (dib) {
        lineas.forEach((l, i) => {
          let cx = px; const base = py + i * lh + size;
          l.forEach((w, j) => { if (j) cx += esp; w.forEach(p => { cx += dibujarPieza(x, p, cx, base, size); }); });
        });
      }
      return py + lineas.length * lh;
    }

    const PUNTOS = [
      '[[LECTURA]] Cada número se lleva el signo de su izquierda. Sin signo = +.',
      '[[PLATA]] (+ y −) Mismo signo → [[SE JUNTAN]] suma los tamaños y deja el signo. Signos distintos → [[SE CANCELAN]] resta los tamaños y pon el signo del de más tamaño.',
      '[[SIGNOS PEGADOS]] Dos signos sin número en medio: iguales → +, distintos → −.',
      '[[CUENTA LOS NEGATIVOS]] (· y ÷) Negativos en número par → +; impar → −. Luego multiplica o divide los tamaños.',
      '[[POTENCIA]] El exponente solo toca lo pegado: ({−3})² = {9} y −{3}² = {−9}. Base negativa: exponente par +, impar −.',
      '[[ESCALERA]] ( ) → potencias → · ÷ → + −. En el mismo escalón, de izquierda a derecha.',
      'El {0} no tiene signo. No se divide entre {0}.',
      '*La trampa:* {−5} − {9} = {−14}, pero ({−5})({−9}) = {45}.'
    ];
    const ARBOL = [
      '¿Hay ·, ÷ o paréntesis pegados? → [[CUENTA LOS NEGATIVOS]]',
      '¿Dos signos pegados, como −({−3})? → [[SIGNOS PEGADOS]]',
      '¿Solo + y − entre números? → [[PLATA]]'
    ];

    function fichaC(x, cx, cy, r, neg) {
      x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2);
      if (neg) {
        x.fillStyle = C.negSoft; x.fill(); x.setLineDash([7, 5]); x.lineWidth = 3; x.strokeStyle = C.negFill; x.stroke(); x.setLineDash([]);
        x.beginPath(); x.moveTo(cx - r * 0.45, cy); x.lineTo(cx + r * 0.45, cy); x.strokeStyle = C.neg; x.lineWidth = 4; x.lineCap = 'round'; x.stroke();
      } else {
        x.fillStyle = C.posFill; x.fill();
        x.beginPath(); x.moveTo(cx - r * 0.45, cy); x.lineTo(cx + r * 0.45, cy); x.moveTo(cx, cy - r * 0.45); x.lineTo(cx, cy + r * 0.45);
        x.strokeStyle = '#FFFFFF'; x.lineWidth = 4; x.lineCap = 'round'; x.stroke();
      }
    }

    function escaleraC(x, px, py, w, dib) {
      const pasos = [['1.º', '( ) [ ]'], ['2.º', 'potencias'], ['3.º', '·  ÷'], ['4.º', '+  −']];
      const sw = w / 4, sh = 58;
      if (dib) {
        pasos.forEach((p, i) => {
          const hx = px + i * sw, h = (i + 1) * sh, top = py + 4 * sh - h;
          rr(x, hx + 3, top, sw - 6, h, 12); x.fillStyle = C.surface; x.fill(); x.lineWidth = 3; x.strokeStyle = C.ink; x.stroke();
          x.textAlign = 'center';
          x.font = fnt(900, 17); x.fillStyle = C.ink2; x.fillText(p[0], hx + sw / 2, top + 20);
          x.font = fnt(900, i === 1 ? 21 : 26); x.fillStyle = C.ink; x.fillText(p[1], hx + sw / 2, top + 47);
          x.textAlign = 'left';
        });
        x.font = fnt(800, 22); x.fillStyle = C.ink2; x.textAlign = 'center';
        x.fillText('mismo escalón → de izquierda a derecha', px + w / 2, py + 4 * sh + 32); x.textAlign = 'left';
      }
      return py + 4 * sh + 42;
    }

    function componer(x, s, dib, nombre) {
      const w = W - 2 * MX;
      let y = 48;
      if (dib) {
        x.fillStyle = C.bg; x.fillRect(0, 0, W, H);
        x.font = fnt(900, 54); x.fillStyle = C.ink; x.fillText('Ley de signos: tu resumen', MX, y + 50);
        x.font = fnt(700, 28); x.fillStyle = C.ink2;
        x.fillText((nombre ? nombre + ', guarda' : 'Guarda') + ' esta foto y mírala antes del examen.', MX, y + 92);
      }
      y += 112;
      // Leyenda de colores
      if (dib) {
        fichaC(x, MX + 18, y + 20, 17, false);
        parrafo(x, '{+3} = tienes (positivo)', MX + 46, y + 2, 300, 26, 34, true);
        fichaC(x, MX + 368, y + 20, 17, true);
        parrafo(x, '{−3} = debes (negativo)', MX + 396, y + 2, 300, 26, 34, true);
        parrafo(x, '{0}: ni tienes ni debes', MX + 720, y + 2, 260, 26, 34, true);
      }
      y += 52;
      if (dib) { x.fillStyle = C.line; x.fillRect(MX, y, w, 3); }
      y += 22;
      // 8 puntos
      const lh = Math.round(s * 1.32);
      PUNTOS.forEach((p, i) => {
        const r = s * 0.66;
        if (dib) {
          x.beginPath(); x.arc(MX + r, y + s * 0.62, r, 0, Math.PI * 2);
          x.fillStyle = i === 7 ? C.prize : C.ink; x.fill();
          if (i === 7) { x.lineWidth = 3; x.strokeStyle = C.ink; x.stroke(); }
          x.font = fnt(900, Math.round(s * 0.78)); x.fillStyle = i === 7 ? C.ink : '#FFFFFF'; x.textAlign = 'center';
          x.fillText(i === 7 ? '!' : String(i + 1), MX + r, y + s * 0.62 + s * 0.27); x.textAlign = 'left';
        }
        y = parrafo(x, p, MX + r * 2 + 16, y, w - r * 2 - 16, s, lh, dib) + Math.round(s * 0.42);
      });
      y += 6;
      // Árbol «¿qué regla uso?»
      const ay = y, ah = 20 + s * 1.3 + ARBOL.length * lh + 18;
      if (dib) {
        rr(x, MX, ay, w, ah, 24); x.fillStyle = C.surface; x.fill(); x.lineWidth = 3; x.strokeStyle = C.line; x.stroke();
        x.font = fnt(900, Math.round(s * 1.05)); x.fillStyle = C.ink; x.fillText('¿Qué regla uso?', MX + 24, ay + 18 + s);
      }
      let yy = ay + 20 + s * 1.3;
      ARBOL.forEach(a => { yy = parrafo(x, a, MX + 24, yy, w - 48, s, lh, dib); });
      y = ay + ah + 20;
      // Escalera + (−2)² ≠ −2²
      const ew = 560;
      const yEsc = escaleraC(x, MX, y, ew, dib);
      const bx = MX + ew + 30, bw = w - ew - 30, bh = yEsc - y;
      if (dib) {
        rr(x, bx, y, bw, bh, 24); x.fillStyle = C.surface; x.fill(); x.lineWidth = 3; x.strokeStyle = C.line; x.stroke();
        let by = parrafo(x, '({−2})² ≠ −{2}²', bx + 22, y + 18, bw - 40, 40, 52, true) + 10;
        by = parrafo(x, '({−2})² = ({−2})({−2}) = {4}', bx + 22, by, bw - 40, 26, 36, true) + 4;
        parrafo(x, '−{2}² = −({2} · {2}) = {−4}', bx + 22, by, bw - 40, 26, 36, true);
      }
      y = yEsc + 10;
      if (dib) {
        x.font = fnt(700, 22); x.fillStyle = C.ink3; x.textAlign = 'center';
        x.fillText('Ley de signos y operaciones combinadas · láminas, juego y test', W / 2, H - 28); x.textAlign = 'left';
      }
      return y;
    }

    function canvas() {
      FAM = familia();
      const cv = document.createElement('canvas');
      cv.width = W; cv.height = H;
      const x = cv.getContext('2d');
      x.textBaseline = 'alphabetic';
      let nombre = '';
      try { nombre = ((LS.st && LS.st.usuario && LS.st.usuario.nombre) || '').trim().split(/\s+/)[0] || ''; } catch (e) { }
      if (nombre) nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1);
      let s = 32;
      while (s > 20 && componer(x, s, false, nombre) > H - 60) s--;
      componer(x, s, true, nombre);
      return cv;
    }

    function esIOS() {
      const ua = navigator.userAgent || '';
      return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }
    function mostrarImagen(url, dest, ios) {
      const html = '<figure class="lsb-foto"><img src="' + url + '" alt="Tu resumen de ley de signos en una imagen" width="1080" height="1350">' +
        '<figcaption class="peq tinta-2">' + (ios ? 'Mantén presionada la imagen y elige <b>Guardar en Fotos</b>.' : '¿No se descargó? Mantén presionada la imagen (o clic derecho) y elige <b>Guardar imagen</b>.') + '</figcaption></figure>';
      if (dest) { dest.innerHTML = html; return; }
      if (LS.ui && LS.ui.hoja) LS.ui.hoja({ tipo: 'info', icono: 'foco', titulo: 'Tu resumen en una foto', html, botones: [{ t: 'Listo', cls: 'btn-pri' }] });
    }
    function esperarFuente() {
      try {
        if (!document.fonts || !document.fonts.load) return Promise.resolve();
        return Promise.race([
          Promise.all([document.fonts.load('900 40px Nunito'), document.fonts.load('700 30px Nunito')]),
          new Promise(r => setTimeout(r, 1500))
        ]).catch(() => { });
      } catch (e) { return Promise.resolve(); }
    }
    function descargar(dest) {
      return esperarFuente().then(() => {
        const cv = canvas();
        const url = cv.toDataURL('image/png');
        const ios = esIOS();
        mostrarImagen(url, dest, ios);
        if (ios) return 'imagen';
        return new Promise(res => {
          const bajar = (href, revocar) => {
            const a = document.createElement('a');
            a.href = href; a.download = 'resumen-ley-de-signos.png'; a.rel = 'noopener';
            document.body.appendChild(a); a.click(); a.remove();
            if (revocar) setTimeout(() => URL.revokeObjectURL(href), 5000);
            res('descarga');
          };
          if (cv.toBlob && window.URL && URL.createObjectURL) cv.toBlob(b => { if (b) bajar(URL.createObjectURL(b), true); else bajar(url, false); }, 'image/png');
          else bajar(url, false);
        });
      });
    }
    return { canvas, descargar };
  })();
})();
