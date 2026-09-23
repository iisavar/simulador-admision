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

    // Email bonito
    var cuerpo = '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">' +
      '<div style="background:#1B2A4A;color:white;padding:24px;border-radius:12px 12px 0 0;text-align:center;">' +
        '<h2 style="margin:0;font-size:20px;">Resultados del Diagnóstico</h2>' +
        '<p style="margin:6px 0 0;opacity:.7;font-size:14px;">Prueba de Matemáticas</p>' +
      '</div>' +
      '<div style="padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">' +
        '<p>Hola <strong>' + data.nombre + '</strong>,</p>' +
        '<p>Aquí tienes los resultados de tu prueba de diagnóstico:</p>' +
        '<div style="text-align:center;padding:20px;background:#f8fafc;border-radius:8px;margin:16px 0;">' +
          '<div style="font-size:48px;font-weight:bold;color:#D4A843;">' + data.puntaje + '</div>' +
          '<p style="margin:8px 0 0;color:#64748b;">' + data.correctas + ' de ' + data.total + ' preguntas correctas</p>' +
          '<p style="margin:4px 0 0;color:#64748b;">Tiempo: ' + data.tiempo + '</p>' +
        '</div>' +
        '<p>Revisa el <strong>PDF adjunto</strong> para ver el detalle completo de cada pregunta con las respuestas correctas y explicaciones.</p>' +
        '<hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;">' +
        '<p style="color:#94a3b8;font-size:13px;">Saludos,<br><strong>Ignacio Isa</strong><br>Profesor de Matemáticas</p>' +
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

  html += '<p style="text-align:center;color:#aaa;margin-top:30px;font-size:10px;">Generado automáticamente — Ignacio Isa</p>';
  html += '</body></html>';
  return html;
}
