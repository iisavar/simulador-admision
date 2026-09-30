# Clase: Jerarquía de Operaciones

Material de una clase de ~75 min. Todo es estático (se abre en el navegador).

## Archivos

| Archivo | Para qué | Quién lo usa |
|---|---|---|
| `clase-jerarquia.html` | Presentación interactiva (25 láminas, sorteo de nombres, respuestas reveladas) | **Tú** compartes pantalla y la vas pasando |
| `quiz-entrada.html` | Quiz de 25 preguntas de **ley de signos** (20 min) con registro y avance en vivo | Estudiantes, en su dispositivo |
| `quiz-jerarquia.html` | Quiz de 15 preguntas de **jerarquía** (12 min) con registro y avance en vivo | Estudiantes, en su dispositivo |
| `quiz-sync.js` | Envía el avance de los dos quizzes a tu Google Sheet | (compartido por los dos quizzes) |
| `Code.gs` | Apps Script que recibe el avance y lo escribe en la hoja | Se pega en Apps Script |
| `Clase-Jerarquia-de-Operaciones.pptx` | Respaldo en PowerPoint | Por si falla algo |

## Orden sugerido (75 min)

1. **0–20** · `quiz-entrada.html` (ley de signos) — calentamiento y diagnóstico.
2. **20–55** · `clase-jerarquia.html` — la clase interactiva (tú la pasas).
3. **55–70** · `quiz-jerarquia.html` — quiz del tema nuevo.
4. **70–75** · cierre y tarea.

## Activar el registro en vivo (una sola vez)

1. Crea una Google Sheet nueva.
2. En ella: **Extensiones ▸ Apps Script**, pega el contenido de `Code.gs`, guarda.
3. **Implementar ▸ Nueva implementación ▸ Aplicación web**
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier persona**
4. Copia la URL que termina en `/exec`.
5. Ábrela una vez en el navegador (para autorizar) — debe decir *"Endpoint de quizzes activo."*
6. Pega esa URL en `quiz-sync.js`, en la línea `var URL = '';`, y vuelve a subir el archivo.

Ya está: mientras los estudiantes hacen los quizzes, **abre tu Google Sheet** (pestaña **Avance**)
y verás una fila por estudiante que se actualiza sola: su nombre, correo, en qué pregunta va,
cuántos aciertos lleva y si ya terminó. Así ves quién entró y cómo va cada quien.

> Si dejas `quiz-sync.js` con la URL vacía, los quizzes funcionan igual, solo que no registran nada.
