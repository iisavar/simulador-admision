(function () {
    'use strict';

    const TOTAL = DIAGNOSTICO_PREGUNTAS.length;
    const TIME_LIMIT = 60 * 60;
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzsvZXaPsLkPpl4njnMmWOue6qo98jktNqv4z_4MtJDcEB28OpJ1Xdz7ugBp_RBp9T3/exec';

    let student = { name: '', email: '' };
    let questions = [];
    let answers = [];
    let current = 0;
    let timerInterval = null;
    let secondsLeft = TIME_LIMIT;
    let startTime = null;

    const $ = (s) => document.querySelector(s);
    const $$ = (s) => document.querySelectorAll(s);

    function shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function prepareQuestions() {
        return shuffle([...DIAGNOSTICO_PREGUNTAS]).map(q => {
            if (q.tipo === 'emparejamiento') {
                const indices = q.columna_b.map((_, i) => i);
                const shuffled = shuffle(indices);
                const newB = shuffled.map(i => q.columna_b[i]);
                const reverseMap = {};
                shuffled.forEach((oldIdx, newIdx) => { reverseMap[oldIdx] = newIdx; });
                const newPares = q.pares.map(p => reverseMap[p]);
                return { ...q, columna_b: newB, pares: newPares };
            }
            return q;
        });
    }

    function showScreen(id) {
        $$('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        window.scrollTo(0, 0);
    }

    function formatTime(sec) {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    }

    function startTimer() {
        secondsLeft = TIME_LIMIT;
        startTime = Date.now();
        updateTimerDisplay();
        timerInterval = setInterval(() => {
            secondsLeft--;
            updateTimerDisplay();
            if (secondsLeft <= 0) {
                clearInterval(timerInterval);
                finishQuiz();
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const display = $('#timer-display');
        const timer = $('#timer');
        display.textContent = formatTime(secondsLeft);
        timer.classList.remove('warning', 'danger');
        if (secondsLeft <= 300) timer.classList.add('warning');
        if (secondsLeft <= 60) timer.classList.add('danger');
    }

    function buildDots() {
        const container = $('#quiz-dots');
        container.innerHTML = '';
        for (let i = 0; i < TOTAL; i++) {
            const dot = document.createElement('button');
            dot.className = 'quiz-dot';
            dot.title = `Pregunta ${i + 1}`;
            dot.addEventListener('click', () => goToQuestion(i));
            container.appendChild(dot);
        }
        updateDots();
    }

    function updateDots() {
        $$('.quiz-dot').forEach((d, i) => {
            d.classList.remove('current', 'answered');
            if (i === current) d.classList.add('current');
            else if (isAnswered(i)) d.classList.add('answered');
        });
    }

    function isAnswered(idx) {
        const a = answers[idx];
        const q = questions[idx];
        if (a === null || a === undefined) return false;
        if (q.tipo === 'seleccion_multiple') return Array.isArray(a) && a.length > 0;
        if (q.tipo === 'emparejamiento') return typeof a === 'object' && !Array.isArray(a) && q.columna_a.every((_, i) => a[i] !== null && a[i] !== undefined);
        if (q.tipo === 'completar_numero') return a !== '' && a !== null;
        return true;
    }

    function isCorrect(idx) {
        if (!isAnswered(idx)) return false;
        const a = answers[idx];
        const q = questions[idx];
        switch (q.tipo) {
            case 'opcion_multiple':
                return a === q.respuesta;
            case 'seleccion_multiple': {
                const s1 = [...a].sort();
                const s2 = [...q.respuestas].sort();
                return s1.length === s2.length && s1.every((v, i) => v === s2[i]);
            }
            case 'emparejamiento':
                return q.pares.every((p, i) => a[i] === p);
            case 'completar_numero':
                return parseFloat(a) === q.respuesta;
            default:
                return false;
        }
    }

    function getTypeLabel(tipo) {
        switch (tipo) {
            case 'opcion_multiple': return 'Opción múltiple';
            case 'seleccion_multiple': return 'Selección múltiple';
            case 'emparejamiento': return 'Emparejamiento';
            case 'completar_numero': return 'Completar';
            default: return '';
        }
    }

    function renderQuestion() {
        const q = questions[current];
        $('#current-q').textContent = current + 1;
        $('#progress-fill').style.width = ((current + 1) / TOTAL * 100) + '%';
        $('#subtema-label').textContent = q.subtema;

        const typeLabel = $('#type-label');
        typeLabel.textContent = getTypeLabel(q.tipo);
        typeLabel.className = 'type-badge type-' + q.tipo;

        $('#question-text').textContent = q.pregunta;

        const container = $('#options-area');
        container.innerHTML = '';

        switch (q.tipo) {
            case 'opcion_multiple': renderMultipleChoice(container, q); break;
            case 'seleccion_multiple': renderCheckboxes(container, q); break;
            case 'emparejamiento': renderMatching(container, q); break;
            case 'completar_numero': renderFillNumber(container, q); break;
        }

        $('#btn-prev').disabled = current === 0;
        if (current === TOTAL - 1) {
            $('#btn-next').style.display = 'none';
            $('#btn-finish').style.display = 'inline-flex';
        } else {
            $('#btn-next').style.display = 'inline-flex';
            $('#btn-finish').style.display = 'none';
        }

        updateDots();
        const card = $('#question-card');
        card.style.animation = 'none';
        void card.offsetHeight;
        card.style.animation = 'fadeIn .3s ease';
    }

    function renderMultipleChoice(container, q) {
        const letters = ['A', 'B', 'C', 'D'];
        container.innerHTML = q.opciones.map((opt, i) => `
            <button class="option-btn ${answers[current] === i ? 'selected' : ''}" data-index="${i}">
                <span class="option-letter">${letters[i]}</span>
                <span>${opt}</span>
            </button>
        `).join('');

        container.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.index);
                answers[current] = idx;
                container.querySelectorAll('.option-btn').forEach((b, j) => {
                    b.classList.toggle('selected', j === idx);
                });
                updateDots();
            });
        });
    }

    function renderCheckboxes(container, q) {
        const letters = ['A', 'B', 'C', 'D'];
        const selected = Array.isArray(answers[current]) ? answers[current] : [];

        container.innerHTML = q.opciones.map((opt, i) => `
            <button class="option-btn checkbox-btn ${selected.includes(i) ? 'selected' : ''}" data-index="${i}">
                <span class="option-check">${selected.includes(i) ? '☑' : '☐'}</span>
                <span>${letters[i]}) ${opt}</span>
            </button>
        `).join('');

        container.querySelectorAll('.checkbox-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.index);
                if (!Array.isArray(answers[current])) answers[current] = [];
                const pos = answers[current].indexOf(idx);
                if (pos === -1) answers[current].push(idx);
                else answers[current].splice(pos, 1);

                container.querySelectorAll('.checkbox-btn').forEach((b, j) => {
                    const sel = answers[current].includes(j);
                    b.classList.toggle('selected', sel);
                    b.querySelector('.option-check').textContent = sel ? '☑' : '☐';
                });
                updateDots();
            });
        });
    }

    function renderMatching(container, q) {
        const ans = answers[current] || {};
        let html = '<div class="matching-container">';
        q.columna_a.forEach((item, i) => {
            html += `
                <div class="matching-row">
                    <div class="matching-item">${item}</div>
                    <div class="matching-arrow">→</div>
                    <select class="matching-select" data-index="${i}">
                        <option value="">Seleccionar...</option>
                        ${q.columna_b.map((opt, j) => `<option value="${j}" ${ans[i] === j ? 'selected' : ''}>${opt}</option>`).join('')}
                    </select>
                </div>`;
        });
        html += '</div>';
        container.innerHTML = html;

        container.querySelectorAll('.matching-select').forEach(sel => {
            sel.addEventListener('change', () => {
                const i = parseInt(sel.dataset.index);
                if (!answers[current] || typeof answers[current] !== 'object' || Array.isArray(answers[current])) {
                    answers[current] = {};
                }
                const val = sel.value;
                answers[current][i] = val === '' ? null : parseInt(val);
                updateDots();
            });
        });
    }

    function renderFillNumber(container, q) {
        const val = answers[current] !== null && answers[current] !== undefined ? answers[current] : '';
        container.innerHTML = `
            <div class="fill-container">
                <label class="fill-label">Escribe tu respuesta (número):</label>
                <input type="number" class="fill-input" id="fill-answer" value="${val}" placeholder="Ej: 42" step="any">
            </div>`;

        const input = container.querySelector('#fill-answer');
        input.addEventListener('input', () => {
            answers[current] = input.value;
            updateDots();
        });
        input.focus();
    }

    function goToQuestion(idx) {
        if (idx < 0 || idx >= TOTAL) return;
        current = idx;
        renderQuestion();
    }

    function confirmFinish() {
        const unanswered = questions.filter((_, i) => !isAnswered(i)).length;
        const msg = unanswered > 0
            ? `Tienes ${unanswered} pregunta${unanswered > 1 ? 's' : ''} sin responder. ¿Deseas finalizar?`
            : '¿Estás seguro de que deseas finalizar la prueba?';
        $('#modal-message').textContent = msg;
        $('#modal-overlay').classList.add('visible');
    }

    function finishQuiz() {
        clearInterval(timerInterval);
        const elapsed = TIME_LIMIT - secondsLeft;
        showScreen('screen-results');
        renderResults(elapsed);
        sendResults(elapsed);
    }

    function renderResults(elapsed) {
        let correct = 0, incorrect = 0, unanswered = 0;
        const subtemaStats = {};

        questions.forEach((q, i) => {
            if (!subtemaStats[q.subtema]) subtemaStats[q.subtema] = { total: 0, correct: 0 };
            subtemaStats[q.subtema].total++;
            if (!isAnswered(i)) unanswered++;
            else if (isCorrect(i)) { correct++; subtemaStats[q.subtema].correct++; }
            else incorrect++;
        });

        const percent = Math.round(correct / TOTAL * 100);
        $('#score-percent').textContent = percent;
        const ring = $('#score-ring');
        const circ = 2 * Math.PI * 54;
        ring.style.strokeDashoffset = circ - (percent / 100) * circ;
        if (percent >= 70) ring.style.stroke = '#22c55e';
        else if (percent >= 50) ring.style.stroke = '#f59e0b';
        else ring.style.stroke = '#ef4444';

        $('#student-result-name').textContent = student.name + ' — ' + student.email;
        $('#stat-correct').textContent = correct;
        $('#stat-incorrect').textContent = incorrect;
        $('#stat-unanswered').textContent = unanswered;
        $('#stat-time').textContent = formatTime(elapsed);

        const grid = $('#breakdown-grid');
        grid.innerHTML = '';
        const colors = ['#3b82f6','#8b5cf6','#f59e0b','#22c55e','#ec4899','#06b6d4','#f97316','#6366f1','#14b8a6','#e11d48'];
        let ci = 0;
        Object.entries(subtemaStats).forEach(([name, stats]) => {
            const pct = stats.total ? Math.round(stats.correct / stats.total * 100) : 0;
            const color = colors[ci++ % colors.length];
            grid.innerHTML += `
                <div class="breakdown-card">
                    <div class="breakdown-card-header">
                        <span class="breakdown-dot" style="background:${color}"></span>
                        <span>${name}</span>
                    </div>
                    <div class="breakdown-bar">
                        <div class="breakdown-bar-fill" style="width:${pct}%;background:${color}"></div>
                    </div>
                    <span class="breakdown-score">${pct}%</span>
                    <span class="breakdown-detail">${stats.correct}/${stats.total} correctas</span>
                </div>`;
        });

        renderFeedback('all');
    }

    function renderFeedback(filter) {
        const container = $('#feedback-list');
        const letters = ['A', 'B', 'C', 'D'];
        let html = '';

        questions.forEach((q, i) => {
            let status, statusLabel;
            if (!isAnswered(i)) { status = 'unanswered'; statusLabel = 'Sin responder'; }
            else if (isCorrect(i)) { status = 'correct'; statusLabel = 'Correcta'; }
            else { status = 'incorrect'; statusLabel = 'Incorrecta'; }

            if (filter !== 'all' && filter !== status) return;

            let userAns = '—', correctAns = '';
            switch (q.tipo) {
                case 'opcion_multiple':
                    if (answers[i] !== null && answers[i] !== undefined)
                        userAns = `${letters[answers[i]]}) ${q.opciones[answers[i]]}`;
                    correctAns = `${letters[q.respuesta]}) ${q.opciones[q.respuesta]}`;
                    break;
                case 'seleccion_multiple':
                    if (Array.isArray(answers[i]) && answers[i].length > 0)
                        userAns = answers[i].map(j => `${letters[j]}) ${q.opciones[j]}`).join(', ');
                    correctAns = q.respuestas.map(j => `${letters[j]}) ${q.opciones[j]}`).join(', ');
                    break;
                case 'emparejamiento':
                    if (answers[i] && typeof answers[i] === 'object') {
                        userAns = q.columna_a.map((item, j) => {
                            const s = answers[i][j];
                            return `${item} → ${s !== null && s !== undefined ? q.columna_b[s] : '?'}`;
                        }).join(' | ');
                    }
                    correctAns = q.columna_a.map((item, j) => `${item} → ${q.columna_b[q.pares[j]]}`).join(' | ');
                    break;
                case 'completar_numero':
                    if (answers[i] !== null && answers[i] !== undefined && answers[i] !== '')
                        userAns = String(answers[i]);
                    correctAns = String(q.respuesta);
                    break;
            }

            html += `
                <div class="feedback-item ${status}" onclick="this.classList.toggle('open')">
                    <div class="feedback-header">
                        <span class="feedback-number">P${i + 1} · ${q.subtema}</span>
                        <span class="feedback-badge type-${q.tipo}">${getTypeLabel(q.tipo)}</span>
                        <span class="feedback-status">${statusLabel}</span>
                    </div>
                    <p class="feedback-question">${q.pregunta}</p>
                    <div class="feedback-detail">
                        <p class="feedback-answer"><strong>Tu respuesta:</strong> ${userAns}</p>
                        <p class="feedback-answer"><strong>Respuesta correcta:</strong> ${correctAns}</p>
                        <div class="feedback-explanation">${q.explicacion}</div>
                    </div>
                </div>`;
        });

        container.innerHTML = html || '<p style="color:#8899bb;text-align:center;padding:20px;">No hay preguntas en esta categoría.</p>';
    }

    function buildAnswerText(q, i) {
        const letters = ['A', 'B', 'C', 'D'];
        let userAns = '—', correctAns = '';
        switch (q.tipo) {
            case 'opcion_multiple':
                if (answers[i] !== null && answers[i] !== undefined)
                    userAns = letters[answers[i]] + ') ' + q.opciones[answers[i]];
                correctAns = letters[q.respuesta] + ') ' + q.opciones[q.respuesta];
                break;
            case 'seleccion_multiple':
                if (Array.isArray(answers[i]) && answers[i].length > 0)
                    userAns = answers[i].map(j => letters[j] + ') ' + q.opciones[j]).join(', ');
                correctAns = q.respuestas.map(j => letters[j] + ') ' + q.opciones[j]).join(', ');
                break;
            case 'emparejamiento':
                if (answers[i] && typeof answers[i] === 'object')
                    userAns = q.columna_a.map((item, j) => {
                        const s = answers[i][j];
                        return item + ' → ' + (s !== null && s !== undefined ? q.columna_b[s] : '?');
                    }).join(' | ');
                correctAns = q.columna_a.map((item, j) => item + ' → ' + q.columna_b[q.pares[j]]).join(' | ');
                break;
            case 'completar_numero':
                if (answers[i] !== null && answers[i] !== undefined && answers[i] !== '')
                    userAns = String(answers[i]);
                correctAns = String(q.respuesta);
                break;
        }
        return { userAns, correctAns };
    }

    function sendResults(elapsed) {
        if (!GOOGLE_SCRIPT_URL) return;
        const correct = questions.filter((_, i) => isCorrect(i)).length;
        const percent = Math.round(correct / TOTAL * 100);

        const subtemaBreakdown = {};
        [...new Set(questions.map(q => q.subtema))].forEach(sub => {
            const qs = questions.filter(q => q.subtema === sub);
            const c = qs.filter(q => isCorrect(questions.indexOf(q))).length;
            subtemaBreakdown[sub] = c + '/' + qs.length;
        });

        const detalle = questions.map((q, i) => {
            const { userAns, correctAns } = buildAnswerText(q, i);
            return {
                pregunta: q.pregunta,
                subtema: q.subtema,
                tu_respuesta: userAns,
                respuesta_correcta: correctAns,
                estado: !isAnswered(i) ? 'unanswered' : isCorrect(i) ? 'correct' : 'incorrect',
                explicacion: q.explicacion
            };
        });

        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tipo: 'diagnostico_matematicas',
                nombre: student.name,
                email: student.email,
                puntaje: percent + '%',
                correctas: correct,
                total: TOTAL,
                tiempo: formatTime(elapsed),
                fecha: new Date().toLocaleString('es-EC'),
                desglose: JSON.stringify(subtemaBreakdown),
                detalle: detalle
            })
        }).catch(() => {});
    }

    function init() {
        $('#registration-form').addEventListener('submit', (e) => {
            e.preventDefault();
            student.name = $('#student-name').value.trim();
            student.email = $('#student-email').value.trim();
            questions = prepareQuestions();
            answers = new Array(TOTAL).fill(null);
            current = 0;
            showScreen('screen-quiz');
            buildDots();
            renderQuestion();
            startTimer();
        });

        $('#btn-prev').addEventListener('click', () => goToQuestion(current - 1));
        $('#btn-next').addEventListener('click', () => goToQuestion(current + 1));
        $('#btn-finish').addEventListener('click', confirmFinish);

        $('#modal-cancel').addEventListener('click', () => {
            $('#modal-overlay').classList.remove('visible');
        });
        $('#modal-confirm').addEventListener('click', () => {
            $('#modal-overlay').classList.remove('visible');
            finishQuiz();
        });

        $$('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                $$('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderFeedback(btn.dataset.filter);
            });
        });

        $('#btn-retry').addEventListener('click', () => {
            questions = prepareQuestions();
            answers = new Array(TOTAL).fill(null);
            current = 0;
            secondsLeft = TIME_LIMIT;
            showScreen('screen-quiz');
            buildDots();
            renderQuestion();
            startTimer();
        });
    }

    document.addEventListener('DOMContentLoaded', init);
})();
