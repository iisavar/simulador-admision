/**
 * INSTRUCCIONES (3 pasos):
 *
 * 1. Ve a https://sheets.google.com y crea una nueva hoja de cálculo vacía
 * 2. Ve a Extensiones > Apps Script
 * 3. Borra todo el código que aparece y pega TODO este código
 * 4. En el menú de arriba, selecciona la función "inicializar" y dale clic al botón ▶ Ejecutar
 *    (Esto crea automáticamente los encabezados y formatea la hoja)
 * 5. Haz clic en "Implementar" > "Nueva implementación"
 *    - Tipo: "Aplicación web"
 *    - Ejecutar como: "Yo"
 *    - Quién tiene acceso: "Cualquier persona"
 * 6. Haz clic en "Implementar", autoriza los permisos y copia la URL que te da
 * 7. Pásame esa URL y yo la configuro en el simulador
 */

function inicializar() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.setName("Resultados Simulador");

  var encabezados = [
    "Fecha", "Nombre", "Email", "Puntaje", "Correctas",
    "Total", "Tiempo", "Matemáticas", "Lenguaje", "Sociales", "Naturales"
  ];

  var headerRange = sheet.getRange(1, 1, 1, encabezados.length);
  headerRange.setValues([encabezados]);
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#1B2A4A");
  headerRange.setFontColor("#FFFFFF");
  headerRange.setHorizontalAlignment("center");

  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 160);
  sheet.setColumnWidth(2, 250);
  sheet.setColumnWidth(3, 250);
  sheet.setColumnWidth(4, 90);
  sheet.setColumnWidth(5, 90);
  sheet.setColumnWidth(6, 70);
  sheet.setColumnWidth(7, 90);
  sheet.setColumnWidth(8, 110);
  sheet.setColumnWidth(9, 110);
  sheet.setColumnWidth(10, 110);
  sheet.setColumnWidth(11, 110);

  SpreadsheetApp.getUi().alert(
    "✅ ¡Hoja configurada!\n\n" +
    "Ahora ve a Implementar > Nueva implementación para obtener la URL."
  );
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.fecha || new Date().toLocaleString('es-EC'),
      data.nombre || '',
      data.email || '',
      data.puntaje || '',
      data.correctas || 0,
      data.total || 50,
      data.tiempo || '',
      data.matematicas || '',
      data.lenguaje || '',
      data.sociales || '',
      data.naturales || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'El endpoint está funcionando.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
