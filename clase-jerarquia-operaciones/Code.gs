/* ============================================================
   Code.gs — Apps Script para registrar en vivo el avance de
   los quizzes (ley de signos y jerarquía) en una Google Sheet.

   Recibe los envíos de quiz-sync.js y mantiene UNA fila por
   estudiante y quiz, que se va actualizando conforme avanza.

   👉 Cómo publicarlo (una sola vez):
   1. Ve a https://sheets.google.com y crea una hoja nueva
      (por ejemplo "Avance quizzes"). Déjala abierta.
   2. Menú Extensiones ▸ Apps Script.
   3. Borra lo que haya y pega TODO este archivo. Guarda.
   4. Implementar ▸ Nueva implementación ▸ tipo "Aplicación web".
        - Ejecutar como:   Yo
        - Quién tiene acceso:   Cualquier persona
   5. Copia la URL que termina en /exec.
   6. Pégala en quiz-sync.js (variable URL) y vuelve a subir.
   Listo: abre la hoja y verás las filas actualizarse solas.
   ============================================================ */

var HOJA = 'Avance';   // nombre de la pestaña donde se guarda todo
var CABECERAS = ['Clave','Primer registro','Quiz','Nombre','Correo',
                 'Estado','Pregunta','Aciertos','Total','%','Actualizado'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try { lock.waitLock(20000); } catch (err) { return _json({ status: 'busy' }); }
  try {
    var d = JSON.parse(e.postData.contents);
    var sh = _hoja();
    var quiz   = String(d.quiz || '').trim();
    var correo = String(d.correo || '').trim().toLowerCase();
    var clave  = quiz + '|' + correo;
    var pct    = d.total ? Math.round((d.aciertos / d.total) * 100) : 0;
    var ahora  = new Date();

    var claves = sh.getRange(1, 1, Math.max(sh.getLastRow(), 1), 1).getValues();
    var fila = -1;
    for (var r = 1; r < claves.length; r++) { if (claves[r][0] === clave) { fila = r + 1; break; } }

    var primer = ahora;
    if (fila > 0) {
      primer = sh.getRange(fila, 2).getValue() || ahora;  // conservar el primer registro
    } else {
      fila = sh.getLastRow() + 1;
    }
    sh.getRange(fila, 1, 1, CABECERAS.length).setValues([[
      clave, primer, quiz, d.nombre || '', d.correo || '',
      d.estado || '', d.pregunta || 0, d.aciertos || 0, d.total || 0, pct, ahora
    ]]);
    return _json({ status: 'ok' });
  } catch (err) {
    return _json({ status: 'error', message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return _json({ status: 'ok', mensaje: 'Endpoint de quizzes activo.' });
}

function _hoja() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(HOJA);
  if (!sh) sh = ss.insertSheet(HOJA);
  if (sh.getLastRow() === 0) {
    sh.appendRow(CABECERAS);
    sh.setFrozenRows(1);
    sh.getRange('A1:K1').setFontWeight('bold');
  }
  return sh;
}

function _json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
