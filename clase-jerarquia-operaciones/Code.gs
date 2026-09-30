/* ============================================================
   Code.gs — Apps Script para los quizzes.
   1) Guarda el avance en vivo en la hoja "Avance".
   2) Al TERMINAR, envía al estudiante un correo bonito.

   👉 Actualizar sin cambiar la URL:
   - Pega este archivo (reemplaza lo anterior) y Guarda 💾.
   - Implementar ▸ Administrar implementaciones ▸ ✏️ ▸
     Versión: "Nueva versión" ▸ Implementar.
   ============================================================ */

var HOJA = 'Avance';
var CABECERAS = ['Clave','Primer registro','Quiz','Nombre','Correo',
                 'Estado','Pregunta','Aciertos','Total','%','Actualizado'];

var NOMBRE_QUIZ = {
  'ley-de-signos': 'Ley de Signos',
  'jerarquia': 'Jerarquía de Operaciones',
  'jerarquia-2': 'Jerarquía · Nivel 2',
  'jerarquia-3': 'Jerarquía · Nivel 3'
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

    var primer = ahora, estadoAnterior = '';
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

function doGet() { return _json({ status: 'ok', mensaje: 'Endpoint de quizzes activo.' }); }

function _enviarCorreo(d, quiz, pct) {
  try {
    var correo = String(d.correo || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return;

    var primerNom = String(d.nombre || 'estudiante').split(' ')[0];
    var tituloQuiz = NOMBRE_QUIZ[quiz] || 'Quiz';
    var aciertos = d.aciertos || 0, total = d.total || 0;

    var msg, emoji, color, banda;
    if (pct >= 90)      { emoji='🏆'; color='#3F9A00'; banda='¡NIVEL CRACK!';    msg='Dominaste el tema por completo. ¡Sigue así!'; }
    else if (pct >= 70) { emoji='🎉'; color='#3F9A00'; banda='¡MUY BIEN!';       msg='Vas por excelente camino. Un empujón más y es perfecto.'; }
    else if (pct >= 50) { emoji='💪'; color='#E8A400'; banda='¡BUEN ESFUERZO!';  msg='Ya casi. Con un repasito lo dejas redondo.'; }
    else                { emoji='🔁'; color='#E8503A'; banda='¡A REFORZAR!';     msg='No te desanimes: repasa y verás cómo subes rápido.'; }

    var fill = Math.max(pct, 4); // que siempre se vea algo de barra

    var html =
'<div style="margin:0;padding:0;background:#EEF2EF;font-family:\'Segoe UI\',Arial,Helvetica,sans-serif">' +
'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EEF2EF;padding:28px 12px"><tr><td align="center">' +
  '<table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background:#FFFFFF;border-radius:22px;overflow:hidden;box-shadow:0 6px 24px rgba(19,31,36,.12)">' +
    // header
    '<tr><td style="background:#131F24;padding:30px 28px 26px;text-align:center">' +
      '<div style="color:#58CC02;font-size:12px;font-weight:bold;letter-spacing:3px">MATEMÁTICA DE INGRESO</div>' +
      '<div style="color:#FFFFFF;font-size:23px;font-weight:bold;margin-top:8px;line-height:1.2">' + tituloQuiz + '</div>' +
    '</td></tr>' +
    // cuerpo
    '<tr><td style="padding:32px 30px 8px;text-align:center">' +
      '<div style="font-size:52px;line-height:1">' + emoji + '</div>' +
      '<div style="display:inline-block;margin-top:14px;background:' + color + '1A;color:' + color + ';font-size:12px;font-weight:bold;letter-spacing:2px;padding:6px 14px;border-radius:999px">' + banda + '</div>' +
      '<div style="color:#131F24;font-size:22px;font-weight:bold;margin-top:14px">¡Terminaste, ' + primerNom + '! 👋</div>' +
      // score
      '<div style="margin:22px auto 6px;color:' + color + ';font-size:52px;font-weight:bold;line-height:1">' + aciertos + '<span style="color:#9BB0A5;font-size:30px"> / ' + total + '</span></div>' +
      '<div style="color:#5B6A70;font-size:15px;font-weight:bold;margin-bottom:18px">' + pct + '% de aciertos</div>' +
      // barra de progreso
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 auto;max-width:360px"><tr><td style="background:#E3EAE5;border-radius:999px;padding:0">' +
        '<table role="presentation" width="' + fill + '%" cellpadding="0" cellspacing="0" style="min-width:16px"><tr><td style="background:' + color + ';height:12px;border-radius:999px;font-size:0;line-height:0">&nbsp;</td></tr></table>' +
      '</td></tr></table>' +
      '<div style="color:#131F24;font-size:16px;line-height:1.55;margin:22px 6px 4px">' + msg + '</div>' +
    '</td></tr>' +
    // footer
    '<tr><td style="padding:22px 30px 26px;text-align:center">' +
      '<div style="border-top:1px solid #E3EAE5;padding-top:18px;color:#9AA7AE;font-size:12px;line-height:1.6">' +
        'Resultado automático de tu quiz.<br>¡Nos vemos en la próxima clase! 🚀' +
      '</div>' +
    '</td></tr>' +
  '</table>' +
'</td></tr></table></div>';

    MailApp.sendEmail({
      to: correo,
      subject: emoji + ' ' + primerNom + ', tu resultado: ' + aciertos + '/' + total + ' en ' + tituloQuiz,
      htmlBody: html,
      name: 'Matemática de Ingreso'
    });
  } catch (err) { }
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
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
