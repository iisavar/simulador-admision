/**
 * APPS SCRIPT — DIAGNÓSTICO DE MATEMÁTICAS
 *
 * INSTRUCCIONES:
 * 1. Crea un Google Sheet NUEVO (diferente al del simulador)
 * 2. Ve a Extensiones > Apps Script
 * 3. Borra todo y pega ESTE código
 * 4. Ejecuta "inicializar" (▶) para crear los encabezados
 * 5. Implementar > Nueva implementación > Aplicación web
 *    - Ejecutar como: "Yo"
 *    - Quién tiene acceso: "Cualquier persona"
 * 6. Autoriza permisos y copia la URL
 * 7. Pásame esa URL para configurarla en el diagnóstico
 */

function inicializar() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.setName('Diagnóstico Matemáticas');

  var enc = ['Fecha', 'Nombre', 'Email', 'Puntaje', 'Correctas', 'Total', 'Tiempo', 'Email Enviado'];
  sheet.appendRow(enc);

  var h = sheet.getRange(1, 1, 1, enc.length);
  h.setFontWeight('bold').setBackground('#1B2A4A').setFontColor('#FFFFFF').setHorizontalAlignment('center');
  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 160);
  sheet.setColumnWidth(2, 250);
  sheet.setColumnWidth(3, 250);
  sheet.setColumnWidth(4, 90);
  sheet.setColumnWidth(5, 90);
  sheet.setColumnWidth(6, 70);
  sheet.setColumnWidth(7, 90);
  sheet.setColumnWidth(8, 120);

  SpreadsheetApp.getUi().alert(
    '✅ ¡Hoja lista!\n\n' +
    'Ahora ve a Implementar > Nueva implementación para obtener la URL.'
  );
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // Guardar en la hoja
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      data.fecha, data.nombre, data.email,
      data.puntaje, data.correctas, data.total,
      data.tiempo, 'Pendiente'
    ]);
    var fila = sheet.getLastRow();

    // Enviar correo con PDF
    var emailOk = enviarCorreo_(data);

    // Marcar si se envió
    sheet.getRange(fila, 8).setValue(emailOk ? 'Sí ✓' : 'Error');

    return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─── Correo + PDF ───

function enviarCorreo_(data) {
  try {
    // Generar PDF
    var htmlReporte = generarPDF_(data);
    var pdf = HtmlService.createHtmlOutput(htmlReporte)
      .getBlob()
      .getAs('application/pdf')
      .setName('Diagnostico Matematicas - ' + data.nombre + '.pdf');

    var cuerpo = '<div style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a;">' +
      '<div style="padding:32px 0 24px;text-align:center;border-bottom:1px solid #eee;">' +
        '<div style="display:inline-block;width:40px;height:40px;background:#1B2A4A;border-radius:8px;line-height:40px;color:#D4A843;font-size:22px;font-weight:bold;">π</div>' +
      '</div>' +
      '<div style="padding:32px 24px;">' +
        '<p style="font-size:22px;font-weight:600;margin:0 0 6px;color:#1a1a1a;">Tus resultados están listos</p>' +
        '<p style="font-size:14px;color:#6b7280;margin:0 0 28px;">Diagnóstico de Matemáticas — ' + data.fecha + '</p>' +
        '<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">' +
          '<tr>' +
            '<td style="background:#f9fafb;border:1px solid #f0f0f0;border-radius:12px;padding:24px;text-align:center;">' +
              '<div style="font-size:44px;font-weight:700;color:#1B2A4A;letter-spacing:-1px;">' + data.puntaje + '</div>' +
              '<p style="margin:4px 0 0;font-size:14px;color:#6b7280;">' + data.correctas + ' de ' + data.total + ' correctas</p>' +
            '</td>' +
          '</tr>' +
        '</table>' +
        '<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">' +
          '<tr>' +
            '<td width="33%" style="text-align:center;padding:12px 0;">' +
              '<div style="font-size:20px;font-weight:600;color:#22c55e;">' + data.correctas + '</div>' +
              '<div style="font-size:12px;color:#9ca3af;margin-top:2px;">Correctas</div>' +
            '</td>' +
            '<td width="33%" style="text-align:center;padding:12px 0;border-left:1px solid #f0f0f0;border-right:1px solid #f0f0f0;">' +
              '<div style="font-size:20px;font-weight:600;color:#ef4444;">' + (data.total - data.correctas) + '</div>' +
              '<div style="font-size:12px;color:#9ca3af;margin-top:2px;">Incorrectas</div>' +
            '</td>' +
            '<td width="33%" style="text-align:center;padding:12px 0;">' +
              '<div style="font-size:20px;font-weight:600;color:#1a1a1a;">' + data.tiempo + '</div>' +
              '<div style="font-size:12px;color:#9ca3af;margin-top:2px;">Tiempo</div>' +
            '</td>' +
          '</tr>' +
        '</table>' +
        '<div style="background:#f9fafb;border-radius:8px;padding:16px 20px;margin:0 0 28px;">' +
          '<p style="margin:0;font-size:14px;color:#374151;line-height:1.6;">Adjuntamos un informe detallado con cada pregunta, tu respuesta, la respuesta correcta y su explicación.</p>' +
        '</div>' +
      '</div>' +
      '<div style="padding:20px 24px;border-top:1px solid #eee;text-align:center;">' +
        '<p style="margin:0;font-size:12px;color:#9ca3af;">Este correo fue enviado automáticamente al completar el diagnóstico.</p>' +
        '<p style="margin:4px 0 0;font-size:12px;color:#9ca3af;">Ignacio Isa · Matemáticas</p>' +
      '</div>' +
    '</div>';

    MailApp.sendEmail({
      to: data.email,
      subject: 'Diagnóstico de Matemáticas — ' + data.puntaje + ' — ' + data.nombre,
      htmlBody: cuerpo,
      attachments: [pdf],
      name: 'Ignacio Isa'
    });

    return true;
  } catch (err) {
    Logger.log('Error enviando correo: ' + err.message);
    return false;
  }
}

// ─── Generador de PDF ───

function generarPDF_(data) {
  var html = '<!DOCTYPE html><html><head><style>' +
    'body{font-family:Arial,Helvetica,sans-serif;margin:30px;color:#333;font-size:12px;}' +
    'h1{color:#1B2A4A;font-size:22px;margin:0 0 4px;}' +
    'h2{color:#1B2A4A;font-size:15px;margin-top:24px;border-bottom:2px solid #D4A843;padding-bottom:4px;}' +
    '.hdr{background:#1B2A4A;color:white;padding:20px;border-radius:8px;margin-bottom:20px;}' +
    '.hdr h1{color:white;}' +
    '.hdr p{margin:3px 0;font-size:13px;}' +
    '.sc{font-size:36px;font-weight:bold;color:#D4A843;margin:8px 0;}' +
    'table{border-collapse:collapse;width:100%;margin:8px 0 16px;}' +
    'th{background:#1B2A4A;color:white;padding:7px 10px;text-align:left;font-size:11px;}' +
    'td{border:1px solid #ddd;padding:5px 8px;font-size:11px;}' +
    'tr:nth-child(even){background:#f9f9f9;}' +
    '.q{margin-bottom:8px;padding:10px;border-radius:6px;border:1px solid #ddd;page-break-inside:avoid;}' +
    '.qc{border-left:4px solid #22c55e;}' +
    '.qi{border-left:4px solid #ef4444;}' +
    '.qu{border-left:4px solid #94a3b8;}' +
    '.qt{font-size:13px;font-weight:600;margin-bottom:6px;}' +
    '.qa{font-size:11px;margin:2px 0;}' +
    '.qe{background:#f5f5f5;padding:7px;border-radius:4px;font-size:11px;color:#555;margin-top:5px;}' +
    '.tc{color:#22c55e;font-weight:bold;}' +
    '.ti{color:#ef4444;font-weight:bold;}' +
    '.tu{color:#94a3b8;font-weight:bold;}' +
  '</style></head><body>';

  // Encabezado
  html += '<div class="hdr">' +
    '<h1>Prueba de Diagnóstico — Matemáticas</h1>' +
    '<p><strong>' + data.nombre + '</strong> — ' + data.email + '</p>' +
    '<p>Fecha: ' + data.fecha + ' | Tiempo: ' + data.tiempo + '</p>' +
    '<p class="sc">' + data.puntaje + '</p>' +
    '<p>' + data.correctas + ' de ' + data.total + ' preguntas correctas</p>' +
  '</div>';

  // Tabla de desglose por tema
  if (data.desglose) {
    var desglose = typeof data.desglose === 'string' ? JSON.parse(data.desglose) : data.desglose;
    html += '<h2>Desglose por tema</h2><table><tr><th>Tema</th><th>Resultado</th></tr>';
    for (var tema in desglose) {
      if (desglose.hasOwnProperty(tema)) {
        html += '<tr><td>' + tema + '</td><td>' + desglose[tema] + '</td></tr>';
      }
    }
    html += '</table>';
  }

  // Detalle pregunta por pregunta
  html += '<h2>Detalle de preguntas</h2>';
  if (data.detalle && Array.isArray(data.detalle)) {
    for (var i = 0; i < data.detalle.length; i++) {
      var q = data.detalle[i];
      var cls = q.estado === 'correct' ? 'qc' : q.estado === 'incorrect' ? 'qi' : 'qu';
      var tag = q.estado === 'correct' ? '<span class="tc">✓ Correcta</span>'
              : q.estado === 'incorrect' ? '<span class="ti">✗ Incorrecta</span>'
              : '<span class="tu">— Sin responder</span>';

      html += '<div class="q ' + cls + '">' +
        '<div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:11px;color:#555;">' +
          '<strong>Pregunta ' + (i + 1) + ' — ' + q.subtema + '</strong>' + tag +
        '</div>' +
        '<div class="qt">' + q.pregunta + '</div>' +
        '<p class="qa"><strong>Tu respuesta:</strong> ' + q.tu_respuesta + '</p>' +
        '<p class="qa"><strong>Correcta:</strong> ' + q.respuesta_correcta + '</p>' +
        '<div class="qe"><strong>Explicación:</strong> ' + q.explicacion + '</div>' +
      '</div>';
    }
  }

  html += '<p style="text-align:center;color:#aaa;margin-top:30px;font-size:10px;">Ignacio Isa · Diagnóstico de Matemáticas</p>';
  html += '</body></html>';
  return html;
}
