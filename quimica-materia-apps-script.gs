/**
 * APPS SCRIPT — QUÍMICA DESDE CERO (materia, átomo y tabla periódica)
 * Guarda los eventos y resultados del sitio quimica-materia/ en Google Sheets
 * y envía al estudiante un correo con su PDF (solo el intento OFICIAL).
 *
 * INSTRUCCIONES (una sola vez):
 * 1. Crea un Google Sheet NUEVO (no uses el de Ley de signos, ni el del simulador, ni el del diagnóstico).
 * 2. En ese Sheet ve a Extensiones > Apps Script.
 * 3. Borra todo lo que aparece y pega ESTE código completo. Guarda (ícono del disquete).
 * 4. Arriba, en el selector de funciones, elige "inicializar" y toca ▶ Ejecutar.
 *    Acepta los permisos (Google avisa que la app no está verificada: "Configuración avanzada" > "Ir a ...").
 *    Se crean las hojas Resultados, Eventos y Pendientes con sus encabezados.
 * 5. Elige "instalarDisparador" y toca ▶ Ejecutar. Así, los correos que no salieron por el
 *    límite diario de Gmail se envían solos cada hora (función procesarPendientes).
 * 6. Implementar > Nueva implementación > tipo "Aplicación web":
 *    - Descripción: Química desde cero
 *    - Ejecutar como: "Yo"
 *    - Quién tiene acceso: "Cualquier persona"
 *    Toca Implementar y copia la URL que termina en /exec.
 * 7. Abre quimica-materia/js/ls-envio.js y pega la URL en la constante URL_SCRIPT:
 *       const URL_SCRIPT = 'https://script.google.com/macros/s/XXXX/exec';
 *    Sube el cambio a GitHub.
 * 8. Prueba: abre la URL /exec en el navegador; debe decir {"status":"ok",...}.
 *    (Opcional) Elige "probarPdf" y ejecútalo: te llega a ti un correo de prueba con el PDF.
 *
 * Si cambias este código después: Implementar > Administrar implementaciones > ✏️ >
 * Versión: "Nueva versión" > Implementar (así la URL no cambia).
 */

var URL_SITIO = 'https://iisavar.github.io/simulador-admision/quimica-materia/';
var HOJA_RES = 'Resultados';
var HOJA_EV = 'Eventos';
var HOJA_PEND = 'Pendientes';
var FIRMA = 'Ignacio Isa';
var TITULO = 'Química desde cero';

var TEMAS = {
  A: { nombre: 'La materia y sus cambios', chip: 'LA MATERIA', max: 8, lamina: 17, otras: '14 y 20' },
  B: { nombre: 'El átomo', chip: 'EL ÁTOMO', max: 9, lamina: 39, otras: '34 y 38' },
  C: { nombre: 'La tabla periódica', chip: 'LA TABLA', max: 8, lamina: 54, otras: '52, 55 y 56' }
};
// Código de error → tema y lámina de repaso (mismo catálogo que js/qm-test.js)
var ERR_INFO = {
  M1: ['A', 17], M2: ['A', 17], M3: ['A', 17], M4: ['A', 17], M5: ['A', 14], M6: ['A', 14], M7: ['A', 20], M8: ['A', 20],
  M9: ['A', 20], M10: ['A', null], M11: ['A', 14],
  T0: ['B', 39], T1: ['B', 35], T2: ['B', 35], T3: ['B', 38], T4: ['B', 38], T5: ['B', 37], T6: ['B', 35], T7: ['B', null],
  T8: ['B', null], T9: ['B', null], T10: ['B', 38], T11: ['B', 39], T12: ['B', 39],
  P0: ['C', 54], P1: ['C', 54], P2: ['C', 54], P2b: ['C', 54], P3: ['C', 52], P4: ['C', 55], P5: ['C', 56], P6: ['C', 56], P7: ['C', null]
};
var GANCHO = { 'nada': 'Casi nada', 'mitad': 'La mitad', 'casi-todo': 'Casi todo', 'nose': 'No sé' };

var ENC_RES = ['ID', 'Fecha', 'Nombre', 'Correo', 'Versión', 'Semilla', 'Intento', 'Nota /25', 'Nota /10',
  'A Materia /8', 'B Átomo /9', 'C Tabla /8', 'Lámina 3 (gancho)', 'P1 hoy'];
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
  sh.getRange(1, 1, 1, enc.length).setFontWeight('bold').setBackground('#3F7D00').setFontColor('#FFFFFF');
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
  return json_({ status: 'ok', servicio: 'quimica-materia', cuotaCorreos: MailApp.getRemainingDailyQuota() });
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
  var q1 = resp[0] ? (resp[0].ok ? '✓ ' : (resp[0].dada ? '✗ ' : '— ')) + corto_(resp[0].dada, 40) : '';
  var fila = [
    d.id, fechaTxt_(d.fecha), d.nombre || '', d.correo || '', d.version || '', d.semilla != null ? String(d.semilla) : '',
    (d.tipoIntento === 'OFICIAL' ? 'OFICIAL' : 'PRÁCTICA') + (d.reenvio ? ' (reenvío)' : ''),
    num_(d.nota), num_(d.nota10),
    num_(pt.A), num_(pt.B), num_(pt.C),
    ganchoTxt_(d.gancho), q1
  ];
  for (var i = 0; i < 25; i++) {
    var r = resp[i];
    fila.push(r ? ((r.dada === '' || r.dada == null ? '—' : corto_(r.dada, 28)) + ' | ' + (r.ok ? '✓' : (r.codigo || '?'))) : '');
  }
  var j = d.juego || null;
  fila.push(minSeg_(d.tiempoTotalSeg));
  fila.push(resp.map(function (r) { return r.segundos != null ? r.segundos : ''; }).join(' '));
  fila.push(j ? (j.nivelAlcanzado || j.nivelMax || j.nivel || j.niveles || '') : '');
  fila.push(j ? erroresTxt_(j.erroresTop) : '');
  fila.push(erroresTxt_(d.erroresTop));
  fila.push(d.tipoIntento === 'OFICIAL' ? 'pendiente' : '— (práctica)');
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
      .setName('Química desde cero - ' + String(d.nombre || 'resultado').replace(/[\\\/:*?"<>|]/g, '') + '.pdf');
    MailApp.sendEmail({
      to: String(d.correo),
      subject: 'Tu resultado: ' + TITULO + ' — ' + num_(d.nota) + '/25',
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
function corto_(s, n) { s = String(s == null ? '' : s); return s.length > n ? s.slice(0, n - 1) + '…' : s; }
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
  return GANCHO[g] || String(g);
}
function erroresTxt_(lst) {
  lst = lista_(lst);
  return lst.map(function (e) { return typeof e === 'string' ? e : (e.codigo || '') + (e.veces ? ' ×' + e.veces : ''); }).join(', ');
}
function nota10Txt_(d) {
  var n = d.nota10 != null ? Number(d.nota10) : Number(d.nota) * 0.4;
  return (Math.round(n * 10) / 10).toFixed(1).replace('.', ',');
}
function razon_(pt, k) { return (Number(pt[k]) || 0) / TEMAS[k].max; }
function estadoTema_(pt, k) { var r = razon_(pt, k); return r >= 0.75 ? 'Parece que lo dominas' : r >= 0.55 ? 'Casi' : 'Conviene repasar'; }
function temasOrdenados_(pt) {
  return Object.keys(TEMAS).sort(function (a, b) { return razon_(pt, a) - razon_(pt, b); });
}
function recomendacion_(d) {
  var nota = Number(d.nota) || 0, pt = d.porTema || {}, ord = temasOrdenados_(pt);
  var nom = function (k) { return '«' + TEMAS[k].nombre + '»'; };
  if (nota >= 22) return '¡Excelente! Ya tienes la base de química para el examen de admisión. La próxima clase: configuración electrónica.';
  if (nota >= 18) {
    var casi = ord.filter(function (k) { return razon_(pt, k) < 0.75; });
    return 'Muy bien. Refuerza ' + (casi.length ? 'el tema ' + casi.map(nom).join(' y ') : 'tu tema más bajo, ' + nom(ord[0])) + ' con sus láminas y el juego, y haz el modo práctica.';
  }
  if (nota >= 13) return 'Vas por buen camino. Repasa los 2 temas más bajos, ' + nom(ord[0]) + ' y ' + nom(ord[1]) + ' (láminas y juego), y vuelve mañana al modo práctica.';
  return 'Lo importante es que lo intentaste solo. Empieza por el tema más bajo, ' + nom(ord[0]) + ', lámina por lámina, y vuelve al test en 2 días.';
}

// Colores del PDF (tokens de ls.css): positivo (protón, catión) azul; negativo (electrón, anión) naranja; neutrón gris.
var C_POS = '#0A76B3', C_NEG = '#B35C00', C_NEU = '#7F877A', C_INK = '#3C3C3C', C_PRI = '#3F7D00', C_SUAVE = '#F1FAE8', C_LINEA = '#DCE8D2';
var SUP_ = '⁰¹²³⁴⁵⁶⁷⁸⁹', SUB_ = '₀₁₂₃₄₅₆₇₈₉';
function dig_(s, tabla) { return String(s).split('').map(function (c) { var i = tabla.indexOf(c); return i >= 0 ? String(i) : ''; }).join(''); }
function carga_(q) {
  if (!q) return '';
  var pos = /[+⁺]/.test(q), n = dig_(q, SUP_) || String(q).replace(/[^0-9]/g, '');
  return '<sup style="color:' + (pos ? C_POS : C_NEG) + ';font-weight:bold">' + n + (pos ? '+' : '−') + '</sup>';
}
// Notación apilada: A arriba, Z abajo, símbolo y carga (²⁷₁₃Al, ⁵⁶₂₆Fe³⁺)
function notHtml_(A, Z, S, q) {
  return '<span style="display:inline-block;vertical-align:middle;text-align:right;line-height:1;font-size:70%;margin-right:1px">' + A + '<br>' + Z + '</span>' +
    '<b>' + esc_(S) + '</b>' + carga_(q);
}
// Texto con química en Unicode → HTML seguro para el PDF (sin depender de las fuentes de super/subíndices)
function quim_(s) {
  var h = esc_(s);
  h = h.replace(/([⁰¹²³⁴⁵⁶⁷⁸⁹]+)([₀₁₂₃₄₅₆₇₈₉]+)([A-Z][a-z]?)([⁰¹²³⁴⁵⁶⁷⁸⁹]*[⁺⁻])?/g, function (m, a, z, S, q) {
    return notHtml_(dig_(a, SUP_), dig_(z, SUB_), S, q || '');
  });
  h = h.replace(/([⁰¹²³⁴⁵⁶⁷⁸⁹]*[⁺⁻])/g, function (m) { return carga_(m); });
  h = h.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, function (m) { return '<sup>' + dig_(m, SUP_) + '</sup>'; });
  h = h.replace(/[₀₁₂₃₄₅₆₇₈₉]+/g, function (m) { return '<sub>' + dig_(m, SUB_) + '</sub>'; });
  return h;
}
function respTxt_(r, n) {
  if (r === '' || r == null) return '<span style="color:#7F877A">sin responder</span>';
  return quim_(corto_(r, n || 60));
}
function lamDe_(r) {
  var info = r && r.codigo && ERR_INFO[r.codigo];
  if (info && info[1]) return info[1];
  return (TEMAS[r && r.tema] || TEMAS.A).lamina;
}

// ---------- Cuerpo del correo (tema claro, sin rojo) ----------
function htmlCorreo_(d) {
  var pt = d.porTema || {}, ord = temasOrdenados_(pt);
  var mejores = ord.slice().reverse().filter(function (k) { return razon_(pt, k) >= 0.75; });
  if (!mejores.length) mejores = [ord[ord.length - 1]];
  var repasar = ord.filter(function (k) { return razon_(pt, k) < 0.75; });
  var nom = function (k) { return esc_(TEMAS[k].nombre) + ' (' + (Number(pt[k]) || 0) + '/' + TEMAS[k].max + ')'; };
  var nombre = esc_(String(d.nombre || '').split(/\s+/)[0] || 'estudiante');
  return '<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:' + C_INK + ';background:#FFFFFF;">' +
    '<div style="background:' + C_SUAVE + ';border:1px solid ' + C_LINEA + ';border-radius:14px 14px 0 0;padding:22px 24px;">' +
    '<div style="font-size:13px;color:#626A5C;font-weight:bold;letter-spacing:.04em;">QUÍMICA DESDE CERO · MATERIA, ÁTOMO Y TABLA PERIÓDICA</div>' +
    '<div style="font-size:22px;font-weight:bold;margin-top:6px;">Hola, ' + nombre + '</div></div>' +
    '<div style="border:1px solid ' + C_LINEA + ';border-top:0;border-radius:0 0 14px 14px;padding:22px 24px;">' +
    '<p style="margin:0 0 14px;font-size:15px;">Terminaste el test final. Esta es tu nota:</p>' +
    '<div style="text-align:center;background:' + C_SUAVE + ';border-radius:12px;padding:18px;margin-bottom:16px;">' +
    '<div style="font-size:42px;font-weight:bold;color:' + C_PRI + ';">' + num_(d.nota) + '/25</div>' +
    '<div style="font-size:15px;color:#626A5C;">' + nota10Txt_(d) + ' sobre 10</div></div>' +
    '<p style="margin:0 0 8px;font-size:15px;"><b>Lo que mejor te salió:</b> ' + mejores.map(nom).join(', ') + '.</p>' +
    (repasar.length ? '<p style="margin:0 0 8px;font-size:15px;"><b>Lo que conviene repasar:</b> ' + repasar.map(nom).join(', ') + '.</p>' : '') +
    '<p style="margin:14px 0;font-size:15px;background:' + C_SUAVE + ';border-left:4px solid ' + C_PRI + ';padding:10px 12px;"><b>Tu siguiente paso:</b> ' + esc_(recomendacion_(d)) + '</p>' +
    '<p style="font-size:15px;">En el <b>PDF adjunto</b> está tu resultado por tema, un resumen de la clase en una foto, la tabla de las 25 preguntas y 5 ejercicios para repasar dentro de 2 días.</p>' +
    '<p style="text-align:center;margin:20px 0;"><a href="' + URL_SITIO + '" style="background:' + C_PRI + ';color:#FFFFFF;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:10px;display:inline-block;">Volver a practicar</a></p>' +
    '<hr style="border:0;border-top:1px solid ' + C_LINEA + ';margin:18px 0;">' +
    '<p style="font-size:15px;margin:0;">Lo hiciste solo y eso vale mucho.</p>' +
    '<p style="font-size:14px;color:#626A5C;margin:6px 0 0;">— <b>' + FIRMA + '</b></p>' +
    '</div></div>';
}

// ---------- PDF de 4 páginas ----------
function htmlPdf_(d) {
  var pt = d.porTema || {}, resp = lista_(d.respuestas), top = lista_(d.erroresTop);
  var css = '<style>' +
    'body{font-family:Arial,Helvetica,sans-serif;color:' + C_INK + ';font-size:12px;margin:26px;}' +
    'h1{font-size:22px;margin:0 0 4px;} h2{font-size:17px;margin:0 0 10px;border-bottom:3px solid ' + C_PRI + ';padding-bottom:4px;}' +
    '.pag{page-break-after:always;} .ult{page-break-after:auto;}' +
    '.caja{border:1px solid ' + C_LINEA + ';border-radius:8px;padding:10px 12px;margin:0 0 10px;background:#FFFFFF;}' +
    '.suave{background:' + C_SUAVE + ';}' +
    '.gris{color:#626A5C;} .peq{font-size:10px;color:#7F877A;}' +
    'table{border-collapse:collapse;width:100%;} th{background:' + C_PRI + ';color:#FFFFFF;font-size:10px;padding:5px 6px;text-align:left;}' +
    'td{border:1px solid ' + C_LINEA + ';padding:4px 6px;font-size:10.5px;vertical-align:middle;}' +
    '.t25 td{font-size:8.6px;padding:2px 4px;line-height:1.25;} .t25 th{font-size:9px;padding:3px 4px;}' +
    '.barra{height:10px;background:' + C_LINEA + ';border-radius:5px;} .barra div{height:10px;background:' + C_PRI + ';border-radius:5px;}' +
    '.chip{display:inline-block;background:' + C_SUAVE + ';border:1px solid ' + C_LINEA + ';border-radius:10px;padding:1px 7px;font-size:9.5px;font-weight:bold;}' +
    '.regla{border-left:4px solid ' + C_PRI + ';padding:5px 10px;margin:0 0 6px;background:#FFFFFF;font-size:11px;line-height:1.4;}' +
    '.p{color:' + C_POS + ';font-weight:bold;} .e{color:' + C_NEG + ';font-weight:bold;} .n{color:' + C_NEU + ';font-weight:bold;}' +
    '</style>';
  var h = '<!DOCTYPE html><html><head><meta charset="utf-8">' + css + '</head><body>';

  // ---- Página 1: resumen por tema ----
  var q1 = resp[0] || null;
  h += '<div class="pag">' +
    '<div class="caja suave"><div class="peq">' + esc_(TITULO.toUpperCase()) + ' · MATERIA, ÁTOMO Y TABLA PERIÓDICA · TEST FINAL</div>' +
    '<h1>' + esc_(d.nombre || '') + '</h1><div class="gris">' + esc_(fechaLarga_(d.fecha)) + ' · versión ' + esc_(d.version || '') + '</div></div>' +
    '<div class="caja suave" style="text-align:center"><div style="font-size:36px;font-weight:bold;color:' + C_PRI + '">' + num_(d.nota) + '/25</div>' +
    '<div class="gris" style="font-size:14px">' + nota10Txt_(d) + ' sobre 10 · tiempo: ' + esc_(minSeg_(d.tiempoTotalSeg)) + '</div></div>' +
    '<h2>Por tema</h2><table style="margin-bottom:12px"><tr><th>Tema</th><th style="width:38%">Aciertos</th><th>Estado</th><th>Repasa</th></tr>';
  Object.keys(TEMAS).forEach(function (k) {
    var n = Number(pt[k]) || 0, T = TEMAS[k];
    h += '<tr><td><b>' + esc_(T.nombre) + '</b></td><td><table style="width:100%"><tr><td style="border:0;padding:0;width:78%"><div class="barra"><div style="width:' + Math.round(n / T.max * 100) + '%"></div></div></td>' +
      '<td style="border:0;padding:0 0 0 6px"><b>' + n + '/' + T.max + '</b></td></tr></table></td><td>' + estadoTema_(pt, k) + '</td>' +
      '<td class="peq">lámina ' + T.lamina + ' (y ' + T.otras + ')</td></tr>';
  });
  h += '</table>' +
    '<div class="caja"><b>La pregunta del inicio: ¿cuánto de un átomo es espacio vacío?</b><br>Al inicio respondiste: <b>' + esc_(ganchoTxt_(d.gancho)) + '</b>' +
    ' · hoy, en la pregunta 1: ' + (q1 ? (q1.ok ? '<b style="color:' + C_PRI + '">✓ bien</b>' : (q1.dada ? '<b>✗ casi</b>' : 'sin responder')) : '—') +
    ' · respuesta: <b>casi todo</b>. El núcleo es diminuto y los electrones se mueven lejos de él.</div>' +
    '<h2>Tus 2 errores más frecuentes</h2>';
  if (top.length) top.forEach(function (e) {
    var info = ERR_INFO[String(e.codigo)] || ['A', null], tm = TEMAS[info[0]] || TEMAS.A;
    h += '<div class="regla"><span class="chip">' + esc_(tm.chip) + '</span> ' + esc_(e.txt || '') + ' <span class="gris">(' + esc_(e.veces) + (Number(e.veces) === 1 ? ' vez' : ' veces') + ')</span>' +
      '<div class="peq">Repasa: lámina ' + (info[1] || tm.lamina) + '</div></div>';
  });
  else h += '<div class="caja">No hubo un error que se repita. ¡Muy bien!</div>';
  h += '<div class="caja suave"><b>Tu siguiente paso:</b> ' + esc_(recomendacion_(d)) + '</div>' +
    '<p class="peq">Carga positiva (protón, catión) en azul; negativa (electrón, anión) en naranja; el neutrón en gris. El signo siempre va escrito, así que también se lee en blanco y negro.</p></div>';

  // ---- Página 2: Tu resumen en una foto (resumen de la clase) ----
  var R = function (chip, html) { return '<div class="regla"><span class="chip">' + chip + '</span> ' + html + '</div>'; };
  h += '<div class="pag"><h2>Tu resumen en una foto</h2>' +
    R('MATERIA', 'Es todo lo que tiene masa y ocupa un lugar en el espacio. El aire sí es materia; la luz y el sonido, no.') +
    R('3 ESTADOS', '<b>Sólido:</b> forma y volumen fijos. <b>Líquido:</b> volumen fijo, toma la forma del recipiente. <b>Gaseoso:</b> sin forma ni volumen fijos, llena todo. (El plasma del Sol y los rayos es un cuarto estado.)') +
    R('CAMBIOS DE ESTADO', '<b>Fusión:</b> de sólido a líquido · <b>Solidificación:</b> de líquido a sólido · <b>Vaporización</b> (evaporación o ebullición): de líquido a gas · <b>Condensación</b> (o licuación): de gas a líquido, como el rocío · <b>Sublimación:</b> de sólido a gas, como el hielo seco y la naftalina · <b>Sublimación regresiva</b> (deposición): de gas a sólido, como la escarcha.') +
    R('CLASIFICACIÓN', '<b>Sustancias puras:</b> elementos (una sola clase de átomo: O₂, Fe) y compuestos (elementos unidos: H₂O, NaCl). <b>Mezclas:</b> homogéneas (no se ven partes: suero, aire) y heterogéneas (se ven partes: agua con aceite). Una mezcla <b>no</b> es un compuesto.'.replace(/₂/g, '<sub>2</sub>')) +
    R('FÍSICO O QUÍMICO', 'Si se forma una <b>sustancia nueva</b>, es químico. Señales: cambio de color, gas o burbujas, olor, luz o calor, un sólido que aparece. Cambiar de estado, disolver o moler es físico.') +
    R('MODELOS', '<b>Dalton:</b> esfera maciza · <b>Thomson:</b> descubre el electrón, «budín de pasas» · <b>Rutherford:</b> lámina de oro, núcleo pequeño y átomo casi vacío · <b>Chadwick:</b> neutrón (1932) · <b>Bohr:</b> niveles de energía · <b>Hoy:</b> orbitales, zonas donde es probable hallar al electrón.') +
    R('PARTÍCULAS', '<span class="p">Protón p⁺</span>: carga +1, en el núcleo, masa ≈ 1 u · <span class="n">Neutrón n⁰</span>: sin carga, en el núcleo, ≈ 1 u · <span class="e">Electrón e⁻</span>: carga −1, alrededor del núcleo, unas 1836 veces más liviano que el protón.'.replace('p⁺', 'p<sup>+</sup>').replace('n⁰', 'n<sup>0</sup>').replace('e⁻', 'e<sup>−</sup>')) +
    R('CUENTAS', '<b>Z</b> = protones (define el elemento) · <b>A</b> = protones + neutrones (entero) · <b>n = A − Z</b> · <b>e = Z − carga</b>. Ejemplo: ' + notHtml_(23, 11, 'Na', '+') + ' tiene <span class="p">11 p</span>, <span class="n">12 n</span> y <span class="e">10 e</span>.') +
    R('ISÓTOPOS', 'Mismo Z (mismo elemento) y distinto A, porque cambian los neutrones: ' + notHtml_(12, 6, 'C', '') + ' y ' + notHtml_(14, 6, 'C', '') + '. El yodo-131 se usa en medicina.') +
    R('IONES', '<span class="p">Catión (+)</span>: perdió electrones, como ' + quim_('Ca²⁺') + ' · <span class="e">Anión (−)</span>: ganó electrones, como ' + quim_('Cl⁻') + '. Los protones nunca cambian en un ion.') +
    R('LA CASILLA', 'Arriba, el número atómico <b>Z</b> (entero). Abajo, la <b>masa atómica</b>: un promedio con decimales (Cl 35,45). La masa atómica no es A.') +
    R('LA TABLA', '118 elementos ordenados por Z. <b>7 periodos</b> (filas) y <b>18 grupos</b> (columnas). Del 13 al 18, resta 10 para las letras: 17 = VIIA. Grupo 1: alcalinos (el H no lo es) · 2: alcalinotérreos · 3 al 12: transición · 17: halógenos · 18: gases nobles. Metaloides: B, Si, Ge, As, Sb, Te.') +
    R('TU CUERPO', 'O, C, H y N forman casi todo tu cuerpo. Ca y P en los huesos; Fe en la hemoglobina; Na y K en los nervios y músculos.') +
    '<div class="caja suave"><b>La tabla no se memoriza: se usa.</b> Próxima clase: configuración electrónica y propiedades periódicas.</div>' +
    '</div>';

  // ---- Página 3: tabla de las 25 ----
  h += '<div class="pag"><h2>Tus 25 preguntas</h2><table class="t25"><tr><th>#</th><th style="width:44%">Pregunta</th><th>Tu respuesta</th><th>Correcta</th><th></th><th>Tema</th><th>Repasa</th></tr>';
  resp.forEach(function (r) {
    var tm = TEMAS[r.tema] || TEMAS.A;
    h += '<tr><td><b>' + esc_(r.q) + '</b></td><td>' + quim_(corto_(r.enunciado, 150)) + '</td><td>' + respTxt_(r.dada, 48) + '</td><td>' + respTxt_(r.correcta, 48) + '</td>' +
      '<td style="text-align:center">' + (r.ok ? '<b style="color:' + C_PRI + '">✓</b>' : (r.dada === '' || r.dada == null ? '—' : '<b>✗</b> <span class="peq">' + esc_(r.codigo || '') + '</span>')) + '</td>' +
      '<td><span class="chip">' + esc_(r.tema || '') + '</span></td><td class="peq">lám. ' + lamDe_(r) + '</td></tr>';
  });
  h += '</table><p class="peq">✓ bien · ✗ casi (con el código del error) · — sin responder. Temas: A la materia · B el átomo · C la tabla periódica.</p></div>';

  // ---- Página 4: repaso para dentro de 2 días ----
  var ej = ejerciciosRepaso_(d);
  h += '<div class="ult"><h2>Repaso para dentro de 2 días</h2>' +
    '<p class="gris">Resuélvelos sin mirar tus apuntes. Después revisa las respuestas del pie (están de cabeza para que no las veas sin querer).</p>';
  ej.forEach(function (e, i) {
    h += '<div class="caja" style="font-size:15px"><b>' + (i + 1) + ')</b> ' + e.html + '<div style="margin-top:10px">Respuesta: ____________________ <span class="chip" style="font-size:9px">' + esc_(TEMAS[e.tema].chip) + '</span></div></div>';
  });
  h += '<div style="margin-top:36px;border-top:1px dashed #7F877A;padding-top:8px;text-align:center">' +
    '<div style="transform:rotate(180deg);-webkit-transform:rotate(180deg);display:inline-block;font-size:12px">Respuestas: ' +
    ej.map(function (e, i) { return (i + 1) + ') ' + esc_(e.r); }).reverse().join(' · ') +
    '</div></div>' +
    '<p class="peq" style="text-align:center;margin-top:28px">Lo hiciste solo y eso vale mucho. — ' + FIRMA + ' · ' + esc_(URL_SITIO) + '</p></div>';

  return h + '</body></html>';
}

// 5 ejercicios mezclados (dos del átomo, uno de la materia, uno de cambios y uno de la tabla), propios de cada estudiante.
function ejerciciosRepaso_(d) {
  var sem = 0, s = String(d.id || '') + String(d.correo || '');
  for (var i = 0; i < s.length; i++) sem = (sem * 31 + s.charCodeAt(i)) >>> 0;
  var r = function () { sem = (sem * 1664525 + 1013904223) >>> 0; return sem / 4294967296; };
  var pick = function (a) { return a[Math.floor(r() * a.length)]; };
  var NEUTROS = [['O', 8, 16], ['N', 7, 14], ['Mg', 12, 24], ['P', 15, 31], ['Ca', 20, 40], ['Na', 11, 23], ['F', 9, 19], ['Si', 14, 28], ['S', 16, 32], ['Ar', 18, 40]];
  var IONES = [['Mg', 12, 24, 2], ['Na', 11, 23, 1], ['O', 8, 16, -2], ['Cl', 17, 35, -1], ['Al', 13, 27, 3], ['K', 19, 39, 1], ['F', 9, 19, -1], ['Ca', 20, 40, 2], ['S', 16, 32, -2]];
  var CAMBIOS = [['El vidrio del bus se empaña por dentro cuando afuera hace frío.', 'condensación'], ['La cera de una vela se derrite.', 'fusión'],
    ['El agua de la cubeta se vuelve hielo en el congelador.', 'solidificación'], ['La ropa mojada se seca al sol.', 'vaporización (evaporación)'],
    ['El agua de la olla hierve.', 'vaporización (ebullición)'], ['El hielo seco echa «humo» y no deja charcos.', 'sublimación'],
    ['Se forma escarcha sobre el pasto en una madrugada helada.', 'sublimación regresiva'], ['El chocolate derretido se endurece en la refrigeradora.', 'solidificación']];
  var CLASIF = [['El oxígeno (O<sub>2</sub>) de un tanque medicinal', 'elemento'], ['El azúcar pura (sacarosa)', 'compuesto'], ['El agua de mar filtrada', 'mezcla homogénea'],
    ['Una ensalada de frutas', 'mezcla heterogénea'], ['El agua potable de la llave', 'mezcla homogénea'], ['El helio de un globo', 'elemento'],
    ['Agua con arena', 'mezcla heterogénea'], ['El dióxido de carbono (CO<sub>2</sub>)', 'compuesto'], ['Arroz con menestra', 'mezcla heterogénea']];
  var TABLA = [['¿Cómo se escribe el grupo 2 con letras?', 'IIA'], ['¿Cómo se escribe el grupo 13 con letras?', 'IIIA'], ['¿Qué número (del 1 al 18) es el grupo VIA?', '16'],
    ['¿Cómo se llama la familia del grupo 18?', 'gases nobles'], ['¿Cómo se llama la familia del grupo 1 (sin el H)?', 'metales alcalinos'],
    ['El boro (B), ¿es metal, no metal o metaloide?', 'metaloide'], ['¿Cuántos periodos (filas) tiene la tabla?', '7'], ['¿Cuántos grupos (columnas) tiene la tabla?', '18'],
    ['¿Cuál es el símbolo del sodio?', 'Na']];
  var lst = [], a = pick(NEUTROS), b = pick(IONES), c = pick(CAMBIOS), m = pick(CLASIF), t = pick(TABLA);
  lst.push({ tema: 'B', html: '¿Cuántos protones, neutrones y electrones tiene ' + notHtml_(a[2], a[1], a[0], '') + '?', r: a[1] + ' p, ' + (a[2] - a[1]) + ' n, ' + a[1] + ' e' });
  lst.push({ tema: 'B', html: '¿Cuántos electrones tiene el ion ' + notHtml_(b[2], b[1], b[0], (Math.abs(b[3]) > 1 ? Math.abs(b[3]) : '') + (b[3] > 0 ? '+' : '−')) + '?', r: String(b[1] - b[3]) });
  lst.push({ tema: 'A', html: esc_(c[0]) + ' ¿Cómo se llama ese cambio de estado?', r: c[1] });
  lst.push({ tema: 'A', html: m[0] + ': ¿elemento, compuesto, mezcla homogénea o mezcla heterogénea?', r: m[1] });
  lst.push({ tema: 'C', html: esc_(t[0]), r: t[1] });
  for (var k = lst.length - 1; k > 0; k--) { var j = Math.floor(r() * (k + 1)); var x = lst[k]; lst[k] = lst[j]; lst[j] = x; }
  return lst;
}

// Prueba manual desde el editor: genera el PDF con datos de ejemplo y te lo envía a ti.
function probarPdf() {
  var d = {
    id: 'prueba-1', fecha: new Date().toISOString(), nombre: 'María <Prueba>', correo: Session.getActiveUser().getEmail(),
    version: 'A', semilla: 0, nota: 20, nota10: 8, porTema: { A: 7, B: 7, C: 6 }, gancho: 'mitad',
    tipoIntento: 'OFICIAL', tiempoTotalSeg: 1325,
    erroresTop: [{ codigo: 'T4', veces: 2, txt: 'Catión y anión al revés. El catión (+) PIERDE electrones; el anión (−) GANA electrones.' },
      { codigo: 'P2b', veces: 1, txt: 'En los grupos del 13 al 18 la diferencia es 10: el grupo 17 es VIIA y el VA es el 15.' }],
    respuestas: [{ q: 1, tema: 'B', enunciado: 'Rutherford lanzó partículas alfa contra una lámina de oro muy delgada. ¿Qué concluyó sobre el átomo?', dada: '(b) Es casi todo espacio vacío, con un núcleo muy pequeño', correcta: '(b) Es casi todo espacio vacío, con un núcleo muy pequeño', ok: true, codigo: '', segundos: 20 },
      { q: 13, tema: 'B', enunciado: 'Este es un ion de hierro: ⁵⁶₂₆Fe³⁺. ¿Cuántos electrones tiene?', dada: '29', correcta: '23', ok: false, codigo: 'T4', segundos: 40 },
      { q: 24, tema: 'C', enunciado: 'El sodio (Na) está en la fila 3 y en la columna 1 de la tabla. ¿En qué periodo está?', dada: '', correcta: '3', ok: false, codigo: 'SR', segundos: 3 }]
  };
  Logger.log(htmlPdf_(d).length + ' caracteres de HTML');
  if (d.correo) Logger.log('Envío de prueba: ' + enviarCorreo_(d));
}
