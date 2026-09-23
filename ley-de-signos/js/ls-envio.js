/* Envíos a Google Apps Script: cola en localStorage, id único, reintento al volver internet. */
(function () {
  'use strict';
  const LS = window.LS = window.LS || {};

  // Pega aquí la URL de la implementación web de ley-de-signos-apps-script.gs
  const URL_SCRIPT = 'https://script.google.com/macros/s/AKfycby5ZWTS6aoA85LeRhHzAaTvD8j4hCRrO9HZ99tnr1Jebfj1fNfSgdoOvSESh5jbSoh8/exec';

  const oyentes = [];
  function id() { return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10); }

  function encolar(tipo, datos) {
    const item = { id: id(), tipo, fecha: new Date().toISOString(), datos };
    LS.st.colaEnvios.push(item);
    LS.guardar();
    vaciar();
    return item.id;
  }

  let enCurso = false;
  async function vaciar() {
    if (enCurso || !URL_SCRIPT || !LS.st.colaEnvios.length) { avisar(); return; }
    if (navigator.onLine === false) { avisar(); return; }
    enCurso = true;
    try {
      while (LS.st.colaEnvios.length) {
        const item = LS.st.colaEnvios[0];
        const cuerpo = JSON.stringify(Object.assign({ id: item.id, tipo: item.tipo, fecha: item.fecha, nombre: LS.st.usuario.nombre, correo: LS.st.usuario.correo }, item.datos));
        const r = await fetch(URL_SCRIPT, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: cuerpo, redirect: 'follow' });
        if (!r.ok) throw new Error('http ' + r.status);
        LS.st.colaEnvios.shift();
        LS.st.enviados.push(item.id);
        if (LS.st.enviados.length > 200) LS.st.enviados = LS.st.enviados.slice(-200);
        LS.guardar();
        avisar(item.id);
      }
    } catch (e) {
      // queda en la cola; se reintenta con 'online' o al recargar
    } finally {
      enCurso = false;
      avisar();
    }
  }

  function estado(idItem) {
    if (!URL_SCRIPT) return 'sin-configurar';
    if (idItem && LS.st.enviados.indexOf(idItem) >= 0) return 'enviado';
    if (enCurso) return 'enviando';
    if (idItem && LS.st.colaEnvios.some(x => x.id === idItem)) return 'pendiente';
    return idItem ? 'enviado' : 'ok';
  }
  function avisar(idItem) { oyentes.forEach(fn => { try { fn(idItem); } catch (e) { } }); }
  function alCambiar(fn) { oyentes.push(fn); return () => { const i = oyentes.indexOf(fn); if (i >= 0) oyentes.splice(i, 1); }; }

  // Eventos ligeros: fin de capítulo, fin de nivel (para ver dónde abandonan)
  function evento(que, datos) { return encolar('evento', Object.assign({ evento: que }, datos || {})); }
  // Resultado final del test (dispara correo + PDF)
  function resultado(datos) { return encolar('resultado', datos); }

  window.addEventListener('online', vaciar);
  document.addEventListener('DOMContentLoaded', () => setTimeout(vaciar, 1500));

  LS.envio = { evento, resultado, vaciar, estado, alCambiar, configurado: () => !!URL_SCRIPT };
})();
