/* ============================================================
   Code.gs — Apps Script para los quizzes.
   1) Guarda el avance en vivo en la hoja "Avance".
   2) Al TERMINAR, envía al estudiante un correo bonito con su
      resultado.

   👉 Cómo actualizarlo sin cambiar la URL:
   - Pega este archivo en tu Apps Script (reemplaza lo anterior).
   - Guarda 💾.
   - Implementar ▸ Administrar implementaciones ▸ (lápiz ✏️) ▸
     Versión: "Nueva versión" ▸ Implementar.
     (Así se mantiene la MISMA URL /exec.)
   - La primera vez te pedirá permiso para enviar correo: acéptalo.
   ============================================================ */

var HOJA = 'Avance';
var CABECERAS = ['Clave','Primer registro','Quiz','Nombre','Correo',
                 'Estado','Pregunta','Aciertos','Total','%','Actualizado'];

// Nombre bonito de cada quiz (para el correo).
var NOMBRE_QUIZ = {
  'jerarquia': 'Jerarquía de Operaciones',
  'ley-de-signos': 'Ley de Signos'
};

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
    var estadoAnterior = '';
    if (fila > 0) {
      primer = sh.getRange(fila, 2).getValue() || ahora;
      estadoAnterior = String(sh.getRange(fila, 6).getValue() || '');
    } else {
      fila = sh.getLastRow() + 1;
    }
    sh.getRange(fila, 1, 1, CABECERAS.length).setValues([[
      clave, primer, quiz, d.nombre || '', d.correo || '',
      d.estado || '', d.pregunta || 0, d.aciertos || 0, d.total || 0, pct, ahora
    ]]);

    // ---- correo de finalización (solo una vez, al terminar) ----
    var estado = String(d.estado || '');
    var yaTerminado = (estadoAnterior === 'terminado' || estadoAnterior === 'tiempo');
    if ((estado === 'terminado' || estado === 'tiempo') && !yaTerminado) {
      _enviarCorreo(d, quiz, pct);
    }

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

function _enviarCorreo(d, quiz, pct) {
  try {
    var correo = String(d.correo || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return;   // correo inválido → no envía

    var nombre    = String(d.nombre || 'estudiante');
    var primerNom = nombre.split(' ')[0];
    var tituloQuiz = NOMBRE_QUIZ[quiz] || 'Quiz';
    var aciertos = d.aciertos || 0, total = d.total || 0;

    var msg, emoji, color;
    if (pct >= 90)      { emoji = '🏆'; color = '#3F9A00'; msg = '¡Excelente! Dominaste el tema, sigue así.'; }
    else if (pct >= 70) { emoji = '🎉'; color = '#3F9A00'; msg = '¡Muy bien! Vas por buen camino.'; }
    else if (pct >= 50) { emoji = '💪'; color = '#C99E00'; msg = 'Buen esfuerzo. Con un repasito lo dejas perfecto.'; }
    else                { emoji = '🔁'; color = '#E8503A'; msg = 'No te desanimes: repasa y verás cómo mejoras rápido.'; }

    var html =
    '<div style="margin:0;padding:24px;background:#F4F7F5;font-family:Arial,Helvetica,sans-serif">' +
      '<div style="max-width:520px;margin:0 auto;background:#FFFFFF;border-radius:20px;overflow:hidden;border:1px solid #E3EAE5">' +
        '<div style="background:#131F24;padding:28px 24px;text-align:center">' +
          '<div style="color:#58CC02;font-weight:bold;font-size:13px;letter-spacing:2px">MATEMÁTICA DE INGRESO</div>' +
          '<div style="color:#FFFFFF;font-weight:bold;font-size:24px;margin-top:6px">' + tituloQuiz + '</div>' +
        '</div>' +
        '<div style="padding:30px 24px;text-align:center">' +
          '<div style="font-size:46px;line-height:1">' + emoji + '</div>' +
          '<div style="color:#131F24;font-size:20px;font-weight:bold;margin-top:10px">¡Terminaste, ' + primerNom + '!</div>' +
          '<div style="display:inline-block;margin:22px auto 6px;background:' + color + ';color:#FFFFFF;' +
               'font-size:34px;font-weight:bold;padding:16px 40px;border-radius:16px">' + aciertos + ' / ' + total + '</div>' +
          '<div style="color:#5B6A70;font-weight:bold;font-size:16px;margin-top:8px">' + pct + '% de aciertos</div>' +
          '<div style="color:#131F24;font-size:16px;margin-top:18px;line-height:1.5">' + msg + '</div>' +
        '</div>' +
        '<div style="background:#F4F7F5;padding:16px 24px;text-align:center;color:#8A97A0;font-size:12px">' +
          'Este es tu resultado automático del quiz. ¡Nos vemos en la próxima clase! 🚀' +
        '</div>' +
      '</div>' +
    '</div>';

    MailApp.sendEmail({
      to: correo,
      subject: emoji + ' Tu resultado: ' + tituloQuiz + ' (' + aciertos + '/' + total + ')',
      htmlBody: html,
      name: 'Matemática de Ingreso'
    });
  } catch (err) { /* si el correo falla, no rompe el guardado */ }
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
