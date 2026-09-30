/* ============================================================
   quiz-sync.js — envía en vivo el avance de los quizzes a
   Google Sheets (vía Apps Script). Lo usan quiz-entrada.html
   (ley de signos) y quiz-jerarquia.html. Un solo Apps Script.

   CÓMO ACTIVARLO:
   1. Crea el Apps Script con el archivo Code.gs (ver README).
   2. Publícalo como "Aplicación web" (acceso: Cualquier persona).
   3. Copia la URL que termina en /exec y pégala abajo en URL.
   Si URL queda vacía, los quizzes funcionan igual, solo que
   no se registra nada (modo sin conexión).
   ============================================================ */
(function () {
  'use strict';

  // ↓↓↓ PEGA AQUÍ tu URL del Apps Script (termina en /exec) ↓↓↓
  // (vacía = modo 100% sin conexión: los quizzes funcionan pero no envían nada)
  var URL = '';
  // ↑↑↑ ------------------------------------------------------ ↑↑↑

  function enviar(payload) {
    if (!URL) return;                      // sin URL = modo sin conexión
    try {
      payload.ts = new Date().toISOString();
      fetch(URL, {
        method: 'POST',
        mode: 'no-cors',                   // no necesitamos leer la respuesta
        keepalive: true,                   // sigue aunque se cierre la página
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
    } catch (e) { /* si falla, no rompe el quiz */ }
  }

  window.QuizSync = {
    activo: function () { return !!URL; },
    // resumen (fila por estudiante): 'registrado' | 'en-progreso' | 'terminado' | 'tiempo'
    enviar: function (o) { enviar(o); },
    // detalle por ítem (una fila cada lámina / ronda / pregunta, con su tiempo)
    detalle: function (o) { o.tipo = 'detalle'; enviar(o); }
  };
})();
