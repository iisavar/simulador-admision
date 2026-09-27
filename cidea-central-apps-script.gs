/**
 * CIDEA Jóvenes — SCRIPT CENTRAL (cuentas, avance en la nube y «En vivo»)
 * ======================================================================
 * Este script es UNO SOLO para todo CIDEA Jóvenes. No reemplaza a los scripts
 * de cada clase (esos siguen guardando resultados y enviando correos):
 * este guarda las CUENTAS de los estudiantes, su AVANCE en la nube
 * y su actividad EN VIVO para el panel del tutor.
 *
 * CÓMO INSTALARLO (una sola vez):
 * 1) Crea una hoja de cálculo nueva en Google Sheets: «CIDEA Jóvenes — Central».
 * 2) Extensiones → Apps Script. Borra lo que haya y pega TODO este archivo.
 * 3) Ejecuta la función `inicializar` (botón ▶). Acepta los permisos.
 * 4) Ejecuta `verClavePanel` y copia la clave que sale en el registro:
 *    esa es TU contraseña de tutor para la vista «En vivo» del panel.
 * 5) Implementar → Nueva implementación → Aplicación web:
 *      · Ejecutar como: Tú
 *      · Acceso: Cualquier persona
 *    Copia la URL /exec y pásasela a Claude para conectarla en el sitio.
 *
 * SI UN ESTUDIANTE OLVIDA SU CONTRASEÑA:
 * En la hoja «Usuarios», borra el contenido de las celdas `hash` y `sal` de su
 * fila (deja las celdas vacías). El estudiante vuelve a «Crear cuenta» con el
 * mismo correo, elige una contraseña nueva y conserva todo su avance.
 */

var HOJA_USUARIOS = 'Usuarios';
var HOJA_AVANCE = 'Avance';
var HOJA_VIVO = 'EnVivo';

var CAB_USUARIOS = ['correo', 'nombre', 'hash', 'sal', 'tokens', 'creado', 'ultimaVez'];
var CAB_AVANCE = ['correo', 'clave', 'fecha', 'datos'];
var CAB_VIVO = ['correo', 'nombre', 'app', 'donde', 'fecha'];

// Claves de avance que se aceptan (lo demás se ignora por seguridad)
var CLAVES_PERMITIDAS = {
  lds_v1: 1, qm_v1: 1, practica_v1: 1, campus_v1: 1,
  ultimo_diagnostico_matematicas: 1, ultimo_diagnostico_quimica: 1, ultimo_simulador_unemi: 1
};
var MAX_DATOS = 90000;   // tamaño máximo de un avance (caracteres)
var MAX_TOKENS = 5;      // sesiones abiertas a la vez por estudiante (celular + compu…)

// ============================= Instalación =============================

function inicializar() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  hoja_(ss, HOJA_USUARIOS, CAB_USUARIOS);
  hoja_(ss, HOJA_AVANCE, CAB_AVANCE);
  hoja_(ss, HOJA_VIVO, CAB_VIVO);
  verClavePanel();
  Logger.log('Listo. Ahora ejecuta verClavePanel para ver tu clave de tutor.');
}

function hoja_(ss, nombre, cab) {
  var h = ss.getSheetByName(nombre) || ss.insertSheet(nombre);
  if (h.getLastRow() === 0) {
    h.getRange(1, 1, 1, cab.length).setValues([cab]).setFontWeight('bold');
    h.setFrozenRows(1);
  }
  return h;
}

function verClavePanel() {
  var p = PropertiesService.getScriptProperties();
  var clave = p.getProperty('CLAVE_PANEL');
  if (!clave) {
    clave = Utilities.getUuid().replace(/-/g, '').slice(0, 12);
    p.setProperty('CLAVE_PANEL', clave);
  }
  Logger.log('Tu clave de tutor para «En vivo»: ' + clave);
  return clave;
}

// ============================= Utilidades =============================

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
function ok_(extra) { var o = { status: 'ok' }; for (var k in (extra || {})) o[k] = extra[k]; return json_(o); }
function error_(msg) { return json_({ status: 'error', message: msg }); }

function normCorreo_(c) { return String(c || '').trim().toLowerCase(); }
function correoValido_(c) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c); }

function hash_(contrasena, sal) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, sal + '\u0000' + contrasena, Utilities.Charset.UTF_8);
  return bytes.map(function (b) { return ('0' + ((b + 256) % 256).toString(16)).slice(-2); }).join('');
}

function hojaDatos_(nombre, cab) {
  var h = hoja_(SpreadsheetApp.getActiveSpreadsheet(), nombre, cab);
  var n = h.getLastRow();
  var filas = n > 1 ? h.getRange(2, 1, n - 1, cab.length).getValues() : [];
  return { h: h, filas: filas };
}

function buscarFila_(filas, col, valor) {
  for (var i = 0; i < filas.length; i++) if (String(filas[i][col]) === valor) return i;
  return -1;
}

function usuarioPorToken_(token) {
  if (!token) return null;
  var U = hojaDatos_(HOJA_USUARIOS, CAB_USUARIOS);
  for (var i = 0; i < U.filas.length; i++) {
    var tokens = String(U.filas[i][4] || '').split('|');
    if (tokens.indexOf(token) >= 0) return { U: U, i: i, correo: String(U.filas[i][0]), nombre: String(U.filas[i][1]) };
  }
  return null;
}

function nuevoToken_(U, i) {
  var t = Utilities.getUuid();
  var tokens = String(U.filas[i][4] || '').split('|').filter(String);
  tokens.push(t);
  if (tokens.length > MAX_TOKENS) tokens = tokens.slice(-MAX_TOKENS);
  U.h.getRange(i + 2, 5).setValue(tokens.join('|'));
  U.h.getRange(i + 2, 7).setValue(new Date().toISOString());
  return t;
}

function avancesDe_(correo) {
  var A = hojaDatos_(HOJA_AVANCE, CAB_AVANCE);
  var r = {};
  A.filas.forEach(function (f) {
    if (String(f[0]) === correo && CLAVES_PERMITIDAS[String(f[1])]) {
      r[String(f[1])] = { fecha: String(f[2] || ''), datos: String(f[3] || '') };
    }
  });
  return r;
}

// ============================= Acciones =============================

function accionCrear_(d) {
  var correo = normCorreo_(d.correo);
  var nombre = String(d.nombre || '').trim().replace(/\s+/g, ' ');
  var contrasena = String(d.contrasena || '');
  if (!correoValido_(correo)) return error_('correo');
  if (nombre.length < 3) return error_('nombre');
  if (contrasena.length < 4) return error_('contrasena');

  var U = hojaDatos_(HOJA_USUARIOS, CAB_USUARIOS);
  var i = buscarFila_(U.filas, 0, correo);
  var sal = Utilities.getUuid();
  if (i >= 0) {
    // Si el tutor borró hash y sal (contraseña olvidada), se puede volver a crear conservando el avance.
    if (String(U.filas[i][2] || '')) return error_('existe');
    U.h.getRange(i + 2, 2, 1, 3).setValues([[nombre || U.filas[i][1], hash_(contrasena, sal), sal]]);
  } else {
    U.h.appendRow([correo, nombre, hash_(contrasena, sal), sal, '', new Date().toISOString(), new Date().toISOString()]);
    U = hojaDatos_(HOJA_USUARIOS, CAB_USUARIOS);
    i = buscarFila_(U.filas, 0, correo);
  }
  var token = nuevoToken_(U, i);
  return ok_({ token: token, nombre: nombre, correo: correo, avances: avancesDe_(correo) });
}

function accionEntrar_(d) {
  var correo = normCorreo_(d.correo);
  var contrasena = String(d.contrasena || '');
  var U = hojaDatos_(HOJA_USUARIOS, CAB_USUARIOS);
  var i = buscarFila_(U.filas, 0, correo);
  if (i < 0) return error_('nocuenta');
  var hash = String(U.filas[i][2] || ''), sal = String(U.filas[i][3] || '');
  if (!hash) return error_('nocuenta');           // cuenta reiniciada por el tutor
  Utilities.sleep(400);                            // frena intentos de adivinar
  if (hash_(contrasena, sal) !== hash) return error_('contrasena');
  var token = nuevoToken_(U, i);
  return ok_({ token: token, nombre: String(U.filas[i][1] || ''), correo: correo, avances: avancesDe_(correo) });
}

function accionGuardar_(d) {
  var u = usuarioPorToken_(String(d.token || ''));
  if (!u) return error_('token');
  var avances = d.avances && typeof d.avances === 'object' ? d.avances : {};
  var A = hojaDatos_(HOJA_AVANCE, CAB_AVANCE);
  var ahora = new Date().toISOString();
  var guardadas = [];
  for (var clave in avances) {
    if (!CLAVES_PERMITIDAS[clave]) continue;
    var datos = String(avances[clave] == null ? '' : avances[clave]);
    if (datos.length > MAX_DATOS) continue;
    var fila = -1;
    for (var i = 0; i < A.filas.length; i++) {
      if (String(A.filas[i][0]) === u.correo && String(A.filas[i][1]) === clave) { fila = i; break; }
    }
    if (fila >= 0) A.h.getRange(fila + 2, 3, 1, 2).setValues([[ahora, datos]]);
    else { A.h.appendRow([u.correo, clave, ahora, datos]); A = hojaDatos_(HOJA_AVANCE, CAB_AVANCE); }
    guardadas.push(clave);
  }
  u.U.h.getRange(u.i + 2, 7).setValue(ahora);
  return ok_({ guardadas: guardadas });
}

function accionLatido_(d) {
  var u = usuarioPorToken_(String(d.token || ''));
  if (!u) return error_('token');
  var app = String(d.app || '').slice(0, 60);
  var donde = String(d.donde || '').slice(0, 160);
  var ahora = new Date().toISOString();
  var V = hojaDatos_(HOJA_VIVO, CAB_VIVO);
  var i = buscarFila_(V.filas, 0, u.correo);
  if (i >= 0) V.h.getRange(i + 2, 2, 1, 4).setValues([[u.nombre, app, donde, ahora]]);
  else V.h.appendRow([u.correo, u.nombre, app, donde, ahora]);
  u.U.h.getRange(u.i + 2, 7).setValue(ahora);
  return ok_({});
}

// ============================= Entradas HTTP =============================

function doPost(e) {
  var lock = LockService.getScriptLock();
  try { lock.waitLock(20000); } catch (err) { return error_('ocupado'); }
  try {
    var d;
    try { d = JSON.parse(e.postData.contents); } catch (err) { return error_('formato'); }
    var a = String(d.accion || '');
    if (a === 'crear') return accionCrear_(d);
    if (a === 'entrar') return accionEntrar_(d);
    if (a === 'guardar') return accionGuardar_(d);
    if (a === 'latido') return accionLatido_(d);
    return error_('accion');
  } catch (err) {
    return error_('interno');
  } finally {
    try { lock.releaseLock(); } catch (err2) { }
  }
}

function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.accion === 'vivo') {
    var clave = PropertiesService.getScriptProperties().getProperty('CLAVE_PANEL') || '';
    if (!clave || String(p.clave || '') !== clave) return error_('clave');
    var V = hojaDatos_(HOJA_VIVO, CAB_VIVO);
    var U = hojaDatos_(HOJA_USUARIOS, CAB_USUARIOS);
    var estudiantes = V.filas.map(function (f) {
      return { correo: String(f[0]), nombre: String(f[1]), app: String(f[2]), donde: String(f[3]), fecha: String(f[4]) };
    });
    return ok_({ generado: new Date().toISOString(), cuentas: U.filas.length, estudiantes: estudiantes });
  }
  return json_({ status: 'ok', servicio: 'CIDEA Jóvenes — Central' });
}
