/**
 * APPS SCRIPT — LEY DE SIGNOS Y OPERACIONES COMBINADAS
 * Guarda los eventos y resultados del sitio ley-de-signos/ en Google Sheets
 * y envía al estudiante un correo con su PDF (solo el intento OFICIAL).
 *
 * INSTRUCCIONES (una sola vez):
 * 1. Crea un Google Sheet NUEVO (no uses el del simulador ni el del diagnóstico).
 * 2. En ese Sheet ve a Extensiones > Apps Script.
 * 3. Borra todo lo que aparece y pega ESTE código completo. Guarda (ícono del disquete).
 * 4. Arriba, en el selector de funciones, elige "inicializar" y toca ▶ Ejecutar.
 *    Acepta los permisos (Google avisa que la app no está verificada: "Configuración avanzada" > "Ir a ...").
 *    Se crean las hojas Resultados, Eventos y Pendientes con sus encabezados.
 * 5. Elige "instalarDisparador" y toca ▶ Ejecutar. Así, los correos que no salieron por el
 *    límite diario de Gmail se envían solos cada hora (función procesarPendientes).
 * 6. Implementar > Nueva implementación > tipo "Aplicación web":
 *    - Descripción: Ley de signos
 *    - Ejecutar como: "Yo"
 *    - Quién tiene acceso: "Cualquier persona"
 *    Toca Implementar y copia la URL que termina en /exec.
 * 7. Abre ley-de-signos/js/ls-envio.js y pega la URL en la constante URL_SCRIPT:
 *       const URL_SCRIPT = 'https://script.google.com/macros/s/XXXX/exec';
 *    Sube el cambio a GitHub.
 * 8. Prueba: abre la URL /exec en el navegador; debe decir {"status":"ok",...}.
 *
 * Si cambias este código después: Implementar > Administrar implementaciones > ✏️ >
 * Versión: "Nueva versión" > Implementar (así la URL no cambia).
 */

var URL_SITIO = 'https://iisavar.github.io/simulador-admision/ley-de-signos/';
var HOJA_RES = 'Resultados';
var HOJA_EV = 'Eventos';
var HOJA_PEND = 'Pendientes';
var FIRMA = 'Ignacio Isa';

var TEMAS = {
  A: { nombre: 'Sumar y restar', regla: 'SE JUNTAN / SE CANCELAN', cap: 2, lamina: 12, nivel: 1 },
  B: { nombre: 'Signos pegados', regla: 'SIGNOS PEGADOS', cap: 3, lamina: 21, nivel: 3 },
  C: { nombre: 'Multiplicar y dividir', regla: 'CUENTA LOS NEGATIVOS', cap: 3, lamina: 26, nivel: 4 },
  D: { nombre: 'Potencias', regla: 'POTENCIA', cap: 4, lamina: 31, nivel: 5 },
  E: { nombre: 'Operaciones combinadas', regla: 'ESCALERA', cap: 4, lamina: 34, nivel: 6 }
};
var ERR_TEMA = { E0: 'A', E1: 'A', E2: 'A', E3: 'A', E4: 'A', E5: 'A', E6: 'B', E6b: 'B', E7: 'B', E7b: 'B', E8: 'C', E9: 'C', E10: 'C', E11: 'C', E12: 'C', E13a: 'D', E13b: 'D', E14: 'D', E15: 'D', E16: 'E', E17: 'E', E18: 'A', E19: 'E', E20: 'E', E21: 'E', E30: 'C', E31: 'A', E32: 'E' };

var ENC_RES = ['ID', 'Fecha', 'Nombre', 'Correo', 'Versión', 'Semilla', 'Intento', 'Nota /25', 'Nota /10',
  'A Sumar/restar', 'B Signos pegados', 'C Mult/div', 'D Potencias', 'E Combinadas', 'Lámina 3 (gancho)', 'Q1 hoy'];
for (var _i = 1; _i <= 25; _i++) ENC_RES.push('P' + _i);
ENC_RES = ENC_RES.concat(['Tiempo total', 'Tiempos por pregunta (s)', 'Nivel juego', 'Errores juego', 'Errores test', 'Estado correo', 'Juego (JSON)']);
var COL_ESTADO = ENC_RES.indexOf('Estado correo') + 1;
var ENC_EV = ['ID', 'Fecha', 'Nombre', 'Correo', 'Evento', 'Capítulo / nivel', 'Datos (JSON)'];
var ENC_PEND = ['ID', 'Fecha', 'Nombre', 'Correo', 'Estado', 'Intentos', 'Datos (JSON)'];

// ======================================================================
// Configuración
// ======================================================================
function inicializar() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  prepararHoja_(ss, HOJA_RES, ENC_RES);
  prepararHoja_(ss, HOJA_EV, ENC_EV);
  prepararHoja_(ss, HOJA_PEND, ENC_PEND);
  var sobrante = ss.getSheetByName('Hoja 1') || ss.getSheetByName('Sheet1') || ss.getSheetByName('Hoja1');
  if (sobrante && ss.getSheets().length > 3 && sobrante.getLastRow() === 0) ss.deleteSheet(sobrante);
  try {
    SpreadsheetApp.getUi().alert('✅ ¡Hojas listas!\n\nAhora ejecuta "instalarDisparador" y luego ve a Implementar > Nueva implementación para obtener la URL.');
  } catch (e) { Logger.log('Hojas listas.'); }
}

function prepararHoja_(ss, nombre, enc) {
  var sh = ss.getSheetByName(nombre) || ss.insertSheet(nombre);
  if (sh.getLastRow() === 0) sh.appendRow(enc);
  sh.getRange(1, 1, 1, enc.length).setFontWeight('bold').setBackground('#312E81').setFontColor('#FFFFFF');
  sh.setFrozenRows(1);
  sh.setColumnWidth(1, 150);
  return sh;
}
function hoja_(nombre, enc) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(nombre) || prepararHoja_(ss, nombre, enc);
}

function instalarDisparador() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'procesarPendientes') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('procesarPendientes').timeBased().everyHours(1).create();
  Logger.log('Disparador instalado: procesarPendientes cada hora.');
}

// ======================================================================
// Web app
// ======================================================================
function doGet(e) {
  return json_({ status: 'ok', servicio: 'ley-de-signos', cuotaCorreos: MailApp.getRemainingDailyQuota() });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var d = JSON.parse(e.postData.contents);
    if (!d || !d.id) return json_({ status: 'error', message: 'sin id' });
    if (yaExiste_(d.id)) return json_({ status: 'ok', duplicado: true });

    if (d.tipo === 'evento') guardarEvento_(d);
    else if (d.tipo === 'resultado') guardarResultado_(d);
    else return json_({ status: 'error', message: 'tipo desconocido' });

    CacheService.getScriptCache().put('id_' + d.id, '1', 21600);
    return json_({ status: 'ok' });
  } catch (err) {
    Logger.log('doPost: ' + err);
    return json_({ status: 'error', message: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (e2) { }
  }
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

// Descarta ids repetidos: primero la caché (rápido), luego la columna ID de cada hoja.
function yaExiste_(id) {
  if (CacheService.getScriptCache().get('id_' + id)) return true;
  var hojas = [[HOJA_RES, ENC_RES], [HOJA_EV, ENC_EV]];
  for (var i = 0; i < hojas.length; i++) {
    var sh = hoja_(hojas[i][0], hojas[i][1]);
    if (sh.getLastRow() < 2) continue;
    var f = sh.getRange(2, 1, sh.getLastRow() - 1, 1).createTextFinder(String(id)).matchEntireCell(true).findNext();
    if (f) return true;
  }
  return false;
}

// ======================================================================
// Guardado
// ======================================================================
function guardarEvento_(d) {
  var extra = {};
  Object.keys(d).forEach(function (k) {
    if (['id', 'tipo', 'fecha', 'nombre', 'correo', 'evento'].indexOf(k) < 0) extra[k] = d[k];
  });
  var lugar = d.capitulo != null ? 'Cap. ' + d.capitulo : d.nivel != null ? 'Nivel ' + d.nivel : (d.cap != null ? 'Cap. ' + d.cap : '');
  hoja_(HOJA_EV, ENC_EV).appendRow([d.id, fechaTxt_(d.fecha), d.nombre || '', d.correo || '', d.evento || '', lugar, JSON.stringify(extra)]);
}

function guardarResultado_(d) {
  var resp = lista_(d.respuestas);
  var pt = d.porTema || {};
  var q1 = resp[0] ? resp[0].dada : '';
  var fila = [
    d.id, fechaTxt_(d.fecha), d.nombre || '', d.correo || '', d.version || '', d.semilla != null ? String(d.semilla) : '',
    (d.tipoIntento === 'OFICIAL' ? 'OFICIAL' : 'PRÁCTICA') + (d.reenvio ? ' (reenvío)' : ''),
    num_(d.nota), num_(d.nota10),
    num_(pt.A), num_(pt.B), num_(pt.C), num_(pt.D), num_(pt.E),
    ganchoTxt_(d.gancho), q1
  ];
  for (var i = 0; i < 25; i++) {
    var r = resp[i];
    fila.push(r ? ((r.dada === '' || r.dada == null ? '—' : r.dada) + ' | ' + (r.ok ? '✓' : (r.codigo || '?'))) : '');
  }
  var j = d.juego || null;
  fila.push(minSeg_(d.tiempoTotalSeg));
  fila.push(resp.map(function (r) { return r.segundos != null ? r.segundos : ''; }).join(' '));
  fila.push(j ? (j.nivelAlcanzado || j.nivelMax || j.nivel || j.niveles || '') : '');
  fila.push(j ? erroresTxt_(j.erroresTop) : '');
  fila.push(erroresTxt_(d.erroresTop));
  fila.push(d.tipoIntento === 'OFICIAL' ? 'pendiente' : '— (práctica)' );
  fila.push(j ? JSON.stringify(j).slice(0, 45000) : '');

  var sh = hoja_(HOJA_RES, ENC_RES);
  sh.appendRow(fila);
  var nFila = sh.getLastRow();
  if (d.tipoIntento !== 'OFICIAL') return;   // la práctica solo queda en la hoja: sin correo ni PDF

  if (MailApp.getRemainingDailyQuota() < 1) {
    ponerPendiente_(d);
    sh.getRange(nFila, COL_ESTADO).setValue('pendiente (límite diario de correos)');
    return;
  }
  var ok = enviarCorreo_(d);
  if (ok === true) sh.getRange(nFila, COL_ESTADO).setValue('enviado ' + fechaTxt_(new Date().toISOString()));
  else {
    ponerPendiente_(d);
    sh.getRange(nFila, COL_ESTADO).setValue('pendiente (error: ' + String(ok).slice(0, 80) + ')');
  }
}

function ponerPendiente_(d) {
  hoja_(HOJA_PEND, ENC_PEND).appendRow([d.id, fechaTxt_(d.fecha), d.nombre || '', d.correo || '', 'pendiente', 0, JSON.stringify(d)]);
}

// Se ejecuta con el disparador por tiempo (o a mano): envía lo que quedó pendiente.
function procesarPendientes() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return;
  try {
    var sh = hoja_(HOJA_PEND, ENC_PEND);
    var n = sh.getLastRow();
    if (n < 2) return;
    var datos = sh.getRange(2, 1, n - 1, ENC_PEND.length).getValues();
    for (var i = 0; i < datos.length; i++) {
      if (datos[i][4] !== 'pendiente') continue;
      if (MailApp.getRemainingDailyQuota() < 1) break;
      var fila = i + 2, d;
      try { d = JSON.parse(datos[i][6]); } catch (e) { sh.getRange(fila, 5).setValue('error: JSON'); continue; }
      var ok = enviarCorreo_(d);
      var intentos = (Number(datos[i][5]) || 0) + 1;
      sh.getRange(fila, 6).setValue(intentos);
      if (ok === true) {
        sh.getRange(fila, 5).setValue('enviado');
        marcarEstado_(d.id, 'enviado ' + fechaTxt_(new Date().toISOString()) + ' (desde pendientes)');
      } else if (intentos >= 5) {
        sh.getRange(fila, 5).setValue('error: ' + String(ok).slice(0, 80));
        marcarEstado_(d.id, 'error al enviar');
      }
    }
  } finally { lock.releaseLock(); }
}

function marcarEstado_(id, txt) {
  var sh = hoja_(HOJA_RES, ENC_RES);
  if (sh.getLastRow() < 2) return;
  var f = sh.getRange(2, 1, sh.getLastRow() - 1, 1).createTextFinder(String(id)).matchEntireCell(true).findNext();
  if (f) sh.getRange(f.getRow(), COL_ESTADO).setValue(txt);
}

// ======================================================================
// Correo y PDF
// ======================================================================
function enviarCorreo_(d) {
  try {
    if (!d.correo || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(d.correo))) return 'correo inválido';
    var pdf = HtmlService.createHtmlOutput(htmlPdf_(d)).getBlob().getAs('application/pdf')
      .setName('Ley de signos - ' + String(d.nombre || 'resultado').replace(/[\\\/:*?"<>|]/g, '') + '.pdf');
    MailApp.sendEmail({
      to: String(d.correo),
      subject: 'Tu resultado: Ley de signos y operaciones combinadas — ' + num_(d.nota) + '/25',
      htmlBody: htmlCorreo_(d),
      attachments: [pdf],
      name: FIRMA
    });
    return true;
  } catch (err) {
    Logger.log('enviarCorreo_: ' + err);
    return String(err && err.message || err);
  }
}

// ---------- Utilidades ----------
function esc_(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
function num_(v) { var n = Number(v); return isFinite(n) ? n : ''; }
function lista_(x) {
  if (Array.isArray(x)) return x;
  try { var y = JSON.parse(x); return Array.isArray(y) ? y : []; } catch (e) { return []; }
}
function fechaTxt_(iso) {
  var dt = iso ? new Date(iso) : new Date();
  if (isNaN(dt.getTime())) dt = new Date();
  return Utilities.formatDate(dt, 'America/Guayaquil', 'yyyy-MM-dd HH:mm');
}
function fechaLarga_(iso) {
  var dt = iso ? new Date(iso) : new Date();
  if (isNaN(dt.getTime())) dt = new Date();
  var meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  var d = Number(Utilities.formatDate(dt, 'America/Guayaquil', 'd')), m = Number(Utilities.formatDate(dt, 'America/Guayaquil', 'M'));
  return d + ' de ' + meses[m - 1] + ' de ' + Utilities.formatDate(dt, 'America/Guayaquil', 'yyyy');
}
function minSeg_(s) { s = Math.round(Number(s) || 0); return Math.floor(s / 60) + ' min ' + (s % 60) + ' s'; }
function ganchoTxt_(g) {
  if (g == null || g === '') return '—';
  if (g === 'nose') return 'No tengo idea';
  return String(g).replace(/^-/, '−');
}
function erroresTxt_(lst) {
  lst = lista_(lst);
  return lst.map(function (e) { return typeof e === 'string' ? e : (e.codigo || '') + (e.veces ? ' ×' + e.veces : ''); }).join(', ');
}
function nota10Txt_(d) {
  var n = d.nota10 != null ? Number(d.nota10) : Number(d.nota) * 0.4;
  return (Math.round(n * 10) / 10).toFixed(1).replace('.', ',');
}
function estadoTema_(n) { return n >= 4 ? 'Parece que lo dominas' : n === 3 ? 'Casi' : 'Conviene repasar'; }
function temasOrdenados_(pt) {
  return Object.keys(TEMAS).sort(function (a, b) { return (Number(pt[a]) || 0) - (Number(pt[b]) || 0); });
}
function recomendacion_(d) {
  var nota = Number(d.nota) || 0, pt = d.porTema || {}, ord = temasOrdenados_(pt);
  var nom = function (k) { return '«' + TEMAS[k].nombre + '»'; };
  if (nota >= 22) return '¡Excelente! Estás listo para este tema en el examen de admisión. Si quieres, prueba el Reto relámpago.';
  if (nota >= 18) {
    var casi = ord.filter(function (k) { return (Number(pt[k]) || 0) <= 3; });
    return 'Muy bien. Refuerza ' + (casi.length ? 'el tema ' + casi.map(nom).join(' y ') : 'tu tema más bajo, ' + nom(ord[0])) + ' con un nivel del juego y haz el modo práctica.';
  }
  if (nota >= 13) return 'Vas por buen camino. Repasa los 2 temas más bajos, ' + nom(ord[0]) + ' y ' + nom(ord[1]) + ' (capítulo y nivel del juego), y vuelve mañana al modo práctica.';
  return 'Lo importante es que lo intentaste solo. Empieza por el tema más bajo, ' + nom(ord[0]) + ', capítulo por capítulo, y vuelve al test en 2 días.';
}

// Colores del PDF: negativos naranja, positivos azul, tinta para el resto. El signo siempre va escrito.
var C_NEG = '#C2410C', C_POS = '#1D4ED8', C_INK = '#1E1B4B';
function n_(v) {
  v = Number(v);
  var t = (v < 0 ? '−' : '') + Math.abs(v);
  return '<b style="color:' + (v < 0 ? C_NEG : v > 0 ? C_POS : C_INK) + '">' + t + '</b>';
}
// Colorea una expresión en texto («5 − 4(−3) + (−8) ÷ 2»): cada número con su propio signo.
function expr_(s) {
  s = String(s == null ? '' : s);
  var out = '', i = 0, prev = '';
  var SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  while (i < s.length) {
    var c = s[i];
    var esSigno = (c === '−' || c === '-' || c === '+') && /\d/.test(s[i + 1] || '') && (prev === '' || prev === '(' || prev === '[');
    if (esSigno) {
      var j = i + 1; while (j < s.length && /\d/.test(s[j])) j++;
      // −6²: el menos es «lo contrario de» y queda en tinta (salvo dentro de un paréntesis)
      if (c !== '+' && SUP.indexOf(s[j] || '') >= 0 && prev !== '(') { out += esc_(c === '-' ? '−' : c); prev = 'op'; i++; continue; }
      var v = Number(s.slice(i + 1, j)) * (c === '+' ? 1 : -1);
      out += '<b style="color:' + (v < 0 ? C_NEG : v > 0 ? C_POS : C_INK) + '">' + (c === '+' ? '+' : v < 0 ? '−' : '') + Math.abs(v) + '</b>';
      i = j; prev = 'n'; continue;
    }
    if (/\d/.test(c)) {
      var k = i; while (k < s.length && /\d/.test(s[k])) k++;
      var w = Number(s.slice(i, k));
      out += '<b style="color:' + (w === 0 ? C_INK : C_POS) + '">' + w + '</b>';
      i = k; prev = 'n'; continue;
    }
    if (c !== ' ') prev = c;
    out += esc_(c);
    i++;
  }
  return out;
}
// Enunciado para la tabla: la Q15 trae «¿Cuál da POSITIVO? (a) …  (b) …» y se colorea opción por opción.
function enunPdf_(enun) {
  enun = String(enun == null ? '' : enun);
  var k = enun.indexOf('(a) ');
  if (enun.charAt(0) !== '¿' || k < 0) return expr_(enun);
  return esc_(enun.slice(0, k).trim()) + '<br>' + enun.slice(k).split(/\s{2,}(?=\([a-d]\) )/).map(function (op) {
    return '<b>' + esc_(op.slice(0, 3)) + '</b> ' + expr_(op.slice(4));
  }).join(' &nbsp; ');
}
function respTxt_(r) {
  if (r === '' || r == null) return '<span style="color:#6D6A8F">sin responder</span>';
  if (/^\(.\)$/.test(String(r))) return '<b>' + esc_(r) + '</b>';
  return expr_(r);
}

// ---------- Cuerpo del correo (tema claro, sin rojo) ----------
function htmlCorreo_(d) {
  var pt = d.porTema || {}, ord = temasOrdenados_(pt);
  var mejores = ord.slice().reverse().filter(function (k) { return (Number(pt[k]) || 0) >= 4; }).slice(0, 3);
  if (!mejores.length) mejores = [ord[ord.length - 1]];
  var repasar = ord.filter(function (k) { return (Number(pt[k]) || 0) <= 3; }).slice(0, 3);
  var nom = function (k) { return esc_(TEMAS[k].nombre) + ' (' + (Number(pt[k]) || 0) + '/5)'; };
  var nombre = esc_(String(d.nombre || '').split(/\s+/)[0] || 'estudiante');
  return '<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1E1B4B;background:#FFFFFF;">' +
    '<div style="background:#FFF8EE;border:1px solid #E9DFD0;border-radius:14px 14px 0 0;padding:22px 24px;">' +
    '<div style="font-size:13px;color:#4B4870;font-weight:bold;letter-spacing:.04em;">LEY DE SIGNOS Y OPERACIONES COMBINADAS</div>' +
    '<div style="font-size:22px;font-weight:bold;margin-top:6px;">Hola, ' + nombre + '</div></div>' +
    '<div style="border:1px solid #E9DFD0;border-top:0;border-radius:0 0 14px 14px;padding:22px 24px;">' +
    '<p style="margin:0 0 14px;font-size:15px;">Terminaste el test final. Esta es tu nota:</p>' +
    '<div style="text-align:center;background:#EEF2FF;border-radius:12px;padding:18px;margin-bottom:16px;">' +
    '<div style="font-size:42px;font-weight:bold;color:#312E81;">' + num_(d.nota) + '/25</div>' +
    '<div style="font-size:15px;color:#4B4870;">' + nota10Txt_(d) + ' sobre 10</div></div>' +
    '<p style="margin:0 0 8px;font-size:15px;"><b>Lo que mejor te salió:</b> ' + mejores.map(nom).join(', ') + '.</p>' +
    (repasar.length ? '<p style="margin:0 0 8px;font-size:15px;"><b>Lo que conviene repasar:</b> ' + repasar.map(nom).join(', ') + '.</p>' : '') +
    '<p style="margin:14px 0;font-size:15px;background:#FFF8EE;border-left:4px solid #312E81;padding:10px 12px;"><b>Tu siguiente paso:</b> ' + esc_(recomendacion_(d)) + '</p>' +
    '<p style="font-size:15px;">En el <b>PDF adjunto</b> está tu resumen, la tabla de las 25 preguntas y 5 ejercicios para repasar dentro de 2 días.</p>' +
    '<p style="text-align:center;margin:20px 0;"><a href="' + URL_SITIO + '" style="background:#312E81;color:#FFFFFF;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:10px;display:inline-block;">Volver a practicar</a></p>' +
    '<hr style="border:0;border-top:1px solid #E9DFD0;margin:18px 0;">' +
    '<p style="font-size:15px;margin:0;">Lo hiciste solo y eso vale mucho.</p>' +
    '<p style="font-size:14px;color:#4B4870;margin:6px 0 0;">— <b>' + FIRMA + '</b></p>' +
    '</div></div>';
}

// ---------- PDF de 4 páginas ----------
function htmlPdf_(d) {
  var pt = d.porTema || {}, resp = lista_(d.respuestas), top = lista_(d.erroresTop);
  var css = '<style>' +
    'body{font-family:Arial,Helvetica,sans-serif;color:#1E1B4B;font-size:12px;margin:26px;}' +
    'h1{font-size:22px;margin:0 0 4px;} h2{font-size:17px;margin:0 0 10px;border-bottom:3px solid #312E81;padding-bottom:4px;}' +
    '.pag{page-break-after:always;} .ult{page-break-after:auto;}' +
    '.caja{border:1px solid #E9DFD0;border-radius:8px;padding:10px 12px;margin:0 0 10px;background:#FFFFFF;}' +
    '.suave{background:#FFF8EE;} .ind{background:#EEF2FF;}' +
    '.gris{color:#4B4870;} .peq{font-size:10px;color:#6D6A8F;}' +
    'table{border-collapse:collapse;width:100%;} th{background:#312E81;color:#FFFFFF;font-size:10px;padding:5px 6px;text-align:left;}' +
    'td{border:1px solid #E9DFD0;padding:4px 6px;font-size:10.5px;vertical-align:middle;}' +
    '.barra{height:10px;background:#E9DFD0;border-radius:5px;} .barra div{height:10px;background:#1E1B4B;border-radius:5px;}' +
    '.chip{display:inline-block;background:#EEF2FF;border-radius:10px;padding:1px 8px;font-size:10px;font-weight:bold;}' +
    '.regla{border-left:4px solid #312E81;padding:6px 10px;margin:0 0 8px;background:#FFFFFF;}' +
    '</style>';
  var h = '<!DOCTYPE html><html><head><meta charset="utf-8">' + css + '</head><body>';

  // ---- Página 1: resumen ----
  var q1 = resp[0] ? resp[0].dada : '';
  h += '<div class="pag">' +
    '<div class="caja suave"><div class="peq">LEY DE SIGNOS Y OPERACIONES COMBINADAS · TEST FINAL</div>' +
    '<h1>' + esc_(d.nombre || '') + '</h1><div class="gris">' + esc_(fechaLarga_(d.fecha)) + ' · versión ' + esc_(d.version || '') + '</div></div>' +
    '<div class="caja ind" style="text-align:center"><div style="font-size:36px;font-weight:bold;color:#312E81">' + num_(d.nota) + '/25</div>' +
    '<div class="gris" style="font-size:14px">' + nota10Txt_(d) + ' sobre 10 · tiempo: ' + esc_(minSeg_(d.tiempoTotalSeg)) + '</div></div>' +
    '<h2>Por tema</h2><table style="margin-bottom:12px"><tr><th>Tema</th><th style="width:38%">Aciertos</th><th>Estado</th></tr>';
  Object.keys(TEMAS).forEach(function (k) {
    var n = Number(pt[k]) || 0;
    h += '<tr><td><b>' + esc_(TEMAS[k].nombre) + '</b></td><td><table style="width:100%"><tr><td style="border:0;padding:0;width:80%"><div class="barra"><div style="width:' + (n * 20) + '%"></div></div></td><td style="border:0;padding:0 0 0 6px"><b>' + n + '/5</b></td></tr></table></td><td>' + estadoTema_(n) + '</td></tr>';
  });
  h += '</table>' +
    '<div class="caja"><b>La pregunta del inicio (−5 − 9):</b> al inicio respondiste ' + (d.gancho === 'nose' ? '«No tengo idea»' : d.gancho ? n_(Number(String(d.gancho))) : '—') +
    ' · hoy ' + respTxt_(q1) + ' · la respuesta es ' + n_(-14) + '.</div>' +
    '<h2>Tus 2 errores más frecuentes</h2>';
  if (top.length) top.forEach(function (e) {
    var tm = TEMAS[ERR_TEMA[String(e.codigo).split('+')[0]] || 'A'];
    h += '<div class="regla"><span class="chip">' + esc_(tm.regla) + '</span> ' + esc_(e.txt || '') + ' <span class="gris">(' + esc_(e.veces) + (Number(e.veces) === 1 ? ' vez' : ' veces') + ')</span><div class="peq">Repasa: lámina ' + tm.lamina + ' · nivel ' + tm.nivel + ' del juego</div></div>';
  });
  else h += '<div class="caja">No hubo un error que se repita. ¡Muy bien!</div>';
  h += '<div class="caja suave"><b>Tu siguiente paso:</b> ' + esc_(recomendacion_(d)) + '</div>' +
    '<p class="peq">Negativos en naranja y positivos en azul; el signo siempre va escrito, así que también se lee en blanco y negro.</p></div>';

  // ---- Página 2: Tu resumen en una foto ----
  h += '<div class="pag"><h2>Tu resumen en una foto</h2>' +
    '<div class="regla"><span class="chip">LECTURA</span> Cada número se lleva el signo de su izquierda. Sin signo significa positivo: ' + expr_('8 − 5') + ' son ' + n_(8) + ' y ' + n_(-5) + '.</div>' +
    '<div class="regla"><span class="chip">SE JUNTAN</span> Mismo signo: se suman los tamaños y se deja el signo. ' + expr_('−5 − 9') + ' = ' + n_(-14) + '</div>' +
    '<div class="regla"><span class="chip">SE CANCELAN</span> Signos distintos: grande menos chico y el signo del que tiene más tamaño. ' + expr_('−9 + 5') + ' = ' + n_(-4) + '</div>' +
    '<div class="regla"><span class="chip">SIGNOS PEGADOS</span> Dos signos sin número en medio: iguales dan +, distintos dan −.' +
    '<table style="width:60%;margin-top:6px"><tr><td>+ con + → <b style="color:' + C_POS + '">+</b></td><td>− con − → <b style="color:' + C_POS + '">+</b></td></tr><tr><td>+ con − → <b style="color:' + C_NEG + '">−</b></td><td>− con + → <b style="color:' + C_NEG + '">−</b></td></tr></table>' +
    '<div style="margin-top:4px">' + expr_('5 − (−2)') + ' = ' + expr_('5 + 2') + ' = ' + n_(7) + '</div></div>' +
    '<div class="regla"><span class="chip">CUENTA LOS NEGATIVOS (· ÷)</span> Negativos en número par dan +; en número impar dan −. Luego se multiplican o dividen los tamaños. ' + expr_('(−3) · (−4)') + ' = ' + n_(12) + ' · ' + expr_('(−1)(−2)(−3)') + ' = ' + n_(-6) + '</div>' +
    '<div class="regla"><span class="chip">POTENCIA</span> El exponente solo toca lo que está pegado a él. ' + expr_('(−3)²') + ' = ' + n_(9) + ', pero ' + expr_('−3²') + ' = ' + n_(-9) + '. Base negativa: exponente par da +, impar da −.</div>' +
    '<div class="regla"><span class="chip">ESCALERA</span> 1.º paréntesis ( ) [ ] → 2.º potencias → 3.º · y ÷ → 4.º + y −. En el mismo escalón, de izquierda a derecha.' +
    '<div style="margin-top:4px">' + expr_('2 + 3 · (−4)') + ' = ' + expr_('2 + (−12)') + ' = ' + n_(-10) + '</div></div>' +
    '<div class="caja ind"><b>La trampa:</b> ' + expr_('−5 − 9') + ' = ' + n_(-14) + ' (se juntan deudas), pero ' + expr_('(−5)(−9)') + ' = ' + n_(45) + ' (se multiplica). «Menos por menos da más» solo vale con ·, ÷ o signos pegados.</div>' +
    '</div>';

  // ---- Página 3: tabla de las 25 ----
  h += '<div class="pag"><h2>Tus 25 preguntas</h2><table><tr><th>#</th><th>Ejercicio</th><th>Tu respuesta</th><th>Correcta</th><th></th><th>Regla</th><th>Repasa</th></tr>';
  resp.forEach(function (r) {
    var tm = TEMAS[r.tema] || TEMAS.A;
    var enunH = enunPdf_(r.enunciado);
    h += '<tr><td><b>' + esc_(r.q) + '</b></td><td>' + enunH + '</td><td>' + respTxt_(r.dada) + '</td><td>' + respTxt_(r.correcta) + '</td>' +
      '<td style="text-align:center">' + (r.ok ? '<b style="color:#15803D">✓</b>' : (r.dada === '' || r.dada == null ? '—' : '<b>✗</b> <span class="peq">' + esc_(r.codigo || '') + '</span>')) + '</td>' +
      '<td><span class="chip">' + esc_(tm.regla) + '</span></td><td class="peq">capítulo ' + tm.cap + ' / nivel ' + tm.nivel + '</td></tr>';
  });
  h += '</table><p class="peq">✓ bien · ✗ casi (con el código del error) · — sin responder.</p></div>';

  // ---- Página 4: repaso para dentro de 2 días ----
  var ej = ejerciciosRepaso_(d);
  h += '<div class="ult"><h2>Repaso para dentro de 2 días</h2>' +
    '<p class="gris">Resuélvelos sin mirar tus apuntes. Después revisa las respuestas del pie (están de cabeza para que no las veas sin querer).</p>';
  ej.forEach(function (e, i) {
    h += '<div class="caja" style="font-size:16px"><b>' + (i + 1) + ')</b> ' + expr_(e.texto) + ' = ______ <span class="chip" style="font-size:9px">' + esc_(TEMAS[e.tema].regla) + '</span></div>';
  });
  h += '<div style="margin-top:40px;border-top:1px dashed #6D6A8F;padding-top:8px;text-align:center">' +
    '<div style="transform:rotate(180deg);-webkit-transform:rotate(180deg);display:inline-block;font-size:12px">Respuestas: ' +
    ej.map(function (e, i) { return (i + 1) + ') ' + ((e.v < 0 ? '−' : '') + Math.abs(e.v)); }).reverse().join(' · ') +
    '</div></div>' +
    '<p class="peq" style="text-align:center;margin-top:30px">Lo hiciste solo y eso vale mucho. — ' + FIRMA + ' · ' + esc_(URL_SITIO) + '</p></div>';

  return h + '</body></html>';
}

// 5 ejercicios mezclados (uno por tema), con números propios de cada estudiante.
function ejerciciosRepaso_(d) {
  var sem = 0, s = String(d.id || '') + String(d.correo || '');
  for (var i = 0; i < s.length; i++) sem = (sem * 31 + s.charCodeAt(i)) >>> 0;
  var r = function () { sem = (sem * 1664525 + 1013904223) >>> 0; return sem / 4294967296; };
  var ri = function (lo, hi) { return lo + Math.floor(r() * (hi - lo + 1)); };
  var M = '−';
  var a, b, c, e, lst = [];
  // A: signos distintos
  do { a = ri(3, 14); b = ri(2, 14); } while (a === b);
  lst.push({ tema: 'A', texto: M + a + ' + ' + b, v: b - a });
  // B: signos pegados desde un negativo
  do { a = ri(2, 12); b = ri(2, 12); } while (a === b);
  lst.push({ tema: 'B', texto: M + a + ' ' + M + ' (' + M + b + ')', v: b - a });
  // C: división con dos negativos
  a = ri(2, 9); b = ri(2, 6);
  lst.push({ tema: 'C', texto: '(' + M + (a * b) + ') ÷ (' + M + b + ')', v: a });
  // D: menos afuera de una potencia
  a = ri(2, 6);
  lst.push({ tema: 'D', texto: M + a + '²', v: -a * a });
  // E: escalera con multiplicación pegada
  do { a = ri(2, 9); b = ri(2, 5); c = ri(2, 6); e = ri(2, 9); } while (a + b * c - e === 0);
  lst.push({ tema: 'E', texto: a + ' ' + M + ' ' + b + '(' + M + c + ') ' + M + ' ' + e, v: a + b * c - e });
  for (var k = lst.length - 1; k > 0; k--) { var j = Math.floor(r() * (k + 1)); var t = lst[k]; lst[k] = lst[j]; lst[j] = t; }
  return lst;
}

// Prueba manual desde el editor: genera el HTML del PDF con datos de ejemplo y lo registra.
function probarPdf() {
  var d = {
    id: 'prueba-1', fecha: new Date().toISOString(), nombre: 'María <Prueba>', correo: Session.getActiveUser().getEmail(),
    version: 'VTEST', semilla: 123, nota: 20, nota10: 8, porTema: { A: 5, B: 4, C: 3, D: 4, E: 4 }, gancho: '14',
    tipoIntento: 'OFICIAL', tiempoTotalSeg: 1325,
    erroresTop: [{ codigo: 'E1', veces: 2, txt: 'Usaste «negativo por negativo da positivo» en una suma o resta.' }, { codigo: 'E4', veces: 1, txt: 'El tamaño está bien, pero el signo quedó al revés.' }],
    respuestas: [{ q: 1, tema: 'A', enunciado: '−5 − 9', dada: '−14', correcta: '−14', ok: true, codigo: '', segundos: 20 },
      { q: 15, tema: 'C', enunciado: '¿Cuál da POSITIVO? (a) −6 − 4  (b) −6 + (−4)  (c) (−6)(−4)  (d) −(6 + 4)', dada: '(a)', correcta: '(c)', ok: false, codigo: 'E1', segundos: 40 },
      { q: 25, tema: 'E', enunciado: '5 − 4(−3) + (−8) ÷ 2', dada: '', correcta: '13', ok: false, codigo: 'SR', segundos: 3 }]
  };
  Logger.log(htmlPdf_(d).length + ' caracteres de HTML');
  if (d.correo) Logger.log('Envío de prueba: ' + enviarCorreo_(d));
}
