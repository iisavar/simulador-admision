(function () {
    'use strict';

    const TOTAL_QUIZ = 50;
    const TIME_LIMIT = 60 * 60;
    const AREA_NAMES = {
        matematicas: 'Matemáticas y Lógica',
        lenguaje: 'Lenguaje y Comunicación',
        sociales: 'Ciencias Sociales e Historia',
        naturales: 'Ciencias Naturales'
    };
    const AREA_COLORS = {
        matematicas: '#3b82f6',
        lenguaje: '#8b5cf6',
        sociales: '#f59e0b',
        naturales: '#22c55e'
    };

    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzsvZXaPsLkPpl4njnMmWOue6qo98jktNqv4z_4MtJDcEB28OpJ1Xdz7ugBp_RBp9T3/exec';

    let student = { name: '', email: '' };
    let quizQuestions = [];
    let answers = [];
    let currentIndex = 0;
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

    function pickQuestions() {
        const areas = ['matematicas', 'lenguaje', 'sociales', 'naturales'];
        const perArea = Math.floor(TOTAL_QUIZ / areas.length);
        const remainder = TOTAL_QUIZ - perArea * areas.length;
        let picked = [];

        areas.forEach((area, idx) => {
            const pool = PREGUNTAS_DB.filter(q => q.area === area);
            const count = perArea + (idx < remainder ? 1 : 0);
            picked.push(...shuffle(pool).slice(0, count));
        });

        return shuffle(picked);
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
        for (let i = 0; i < TOTAL_QUIZ; i++) {
            const dot = document.createElement('button');
            dot.className = 'quiz-dot';
            dot.title = `Pregunta ${i + 1}`;
            dot.addEventListener('click', () => goToQuestion(i));
            container.appendChild(dot);
        }
        updateDots();
    }

    function updateDots() {
        const dots = $$('.quiz-dot');
        dots.forEach((d, i) => {
            d.classList.remove('current', 'answered');
            if (i === currentIndex) d.classList.add('current');
            else if (answers[i] !== null) d.classList.add('answered');
        });
    }

    function renderQuestion() {
        const q = quizQuestions[currentIndex];
        $('#current-q').textContent = currentIndex + 1;
        $('#progress-fill').style.width = ((currentIndex + 1) / TOTAL_QUIZ * 100) + '%';

        const areaLabel = $('#area-label');
        areaLabel.textContent = AREA_NAMES[q.area];
        areaLabel.setAttribute('data-area', q.area);

        const reading = $('#question-reading');
        if (q.lectura) {
            reading.innerHTML = q.lectura;
            reading.classList.add('visible');
        } else {
            reading.innerHTML = '';
            reading.classList.remove('visible');
        }

        $('#question-text').textContent = q.pregunta;

        const optionsContainer = $('#options-list');
        const letters = ['A', 'B', 'C', 'D'];
        optionsContainer.innerHTML = q.opciones.map((opt, i) => `
            <button class="option-btn ${answers[currentIndex] === i ? 'selected' : ''}" data-index="${i}">
                <span class="option-letter">${letters[i]}</span>
                <span>${opt}</span>
            </button>
        `).join('');

        optionsContainer.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => selectOption(parseInt(btn.dataset.index)));
        });

        $('#btn-prev').disabled = currentIndex === 0;
        if (currentIndex === TOTAL_QUIZ - 1) {
            $('#btn-next').style.display = 'none';
            $('#btn-finish').style.display = 'inline-flex';
        } else {
            $('#btn-next').style.display = 'inline-flex';
            $('#btn-finish').style.display = 'none';
        }

        updateDots();
        $('#question-card').style.animation = 'none';
        void $('#question-card').offsetHeight;
        $('#question-card').style.animation = 'fadeIn .3s ease';
    }

    function selectOption(idx) {
        answers[currentIndex] = idx;
        $$('.option-btn').forEach((btn, i) => {
            btn.classList.toggle('selected', i === idx);
        });
        updateDots();
    }

    function goToQuestion(idx) {
        if (idx < 0 || idx >= TOTAL_QUIZ) return;
        currentIndex = idx;
        renderQuestion();
    }

    function confirmFinish() {
        const unanswered = answers.filter(a => a === null).length;
        const msg = unanswered > 0
            ? `Tienes ${unanswered} pregunta${unanswered > 1 ? 's' : ''} sin responder. ¿Estás seguro de que deseas finalizar?`
            : '¿Estás seguro de que deseas finalizar el examen?';
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
        const areaStats = {};

        quizQuestions.forEach((q, i) => {
            if (!areaStats[q.area]) areaStats[q.area] = { total: 0, correct: 0 };
            areaStats[q.area].total++;
            if (answers[i] === null) unanswered++;
            else if (answers[i] === q.respuesta) { correct++; areaStats[q.area].correct++; }
            else incorrect++;
        });

        const percent = Math.round(correct / TOTAL_QUIZ * 100);

        $('#score-percent').textContent = percent;
        const ring = $('#score-ring');
        const circumference = 2 * Math.PI * 54;
        ring.style.strokeDashoffset = circumference - (percent / 100) * circumference;

        if (percent >= 70) ring.style.stroke = 'var(--success)';
        else if (percent >= 50) ring.style.stroke = 'var(--warning)';
        else ring.style.stroke = 'var(--error)';

        $('#student-result-name').textContent = student.name + ' — ' + student.email;
        $('#stat-correct').textContent = correct;
        $('#stat-incorrect').textContent = incorrect;
        $('#stat-unanswered').textContent = unanswered;
        $('#stat-time').textContent = formatTime(elapsed);

        const breakdownGrid = $('#breakdown-grid');
        breakdownGrid.innerHTML = '';
        Object.entries(AREA_NAMES).forEach(([key, name]) => {
            const stats = areaStats[key] || { total: 0, correct: 0 };
            const pct = stats.total ? Math.round(stats.correct / stats.total * 100) : 0;
            breakdownGrid.innerHTML += `
                <div class="breakdown-card">
                    <div class="breakdown-card-header">
                        <span class="breakdown-dot" style="background:${AREA_COLORS[key]}"></span>
                        <span>${name}</span>
                    </div>
                    <div class="breakdown-bar">
                        <div class="breakdown-bar-fill" style="width:${pct}%;background:${AREA_COLORS[key]}"></div>
                    </div>
                    <span class="breakdown-score">${pct}%</span>
                    <span class="breakdown-detail">${stats.correct}/${stats.total} correctas</span>
                </div>
            `;
        });

        renderFeedback('all');
    }

    function renderFeedback(filter) {
        const container = $('#feedback-list');
        const letters = ['A', 'B', 'C', 'D'];
        let html = '';

        quizQuestions.forEach((q, i) => {
            let status, statusLabel;
            if (answers[i] === null) { status = 'unanswered'; statusLabel = 'Sin responder'; }
            else if (answers[i] === q.respuesta) { status = 'correct'; statusLabel = 'Correcta'; }
            else { status = 'incorrect'; statusLabel = 'Incorrecta'; }

            if (filter !== 'all' && filter !== status) return;

            const userAnswer = answers[i] !== null ? `${letters[answers[i]]}) ${q.opciones[answers[i]]}` : '—';
            const correctAnswer = `${letters[q.respuesta]}) ${q.opciones[q.respuesta]}`;

            html += `
                <div class="feedback-item ${status}" onclick="this.classList.toggle('open')">
                    <div class="feedback-header">
                        <span class="feedback-number">Pregunta ${i + 1} · ${AREA_NAMES[q.area]}</span>
                        <span class="feedback-status">${statusLabel}</span>
                    </div>
                    <p class="feedback-question">${q.pregunta}</p>
                    <div class="feedback-detail">
                        <p class="feedback-answer"><strong>Tu respuesta:</strong> ${userAnswer}</p>
                        <p class="feedback-answer"><strong>Respuesta correcta:</strong> ${correctAnswer}</p>
                        <div class="feedback-explanation">${q.explicacion}</div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html || '<p style="color:var(--text-secondary);text-align:center;padding:20px;">No hay preguntas en esta categoría.</p>';
    }

    function sendResults(elapsed) {
        if (!GOOGLE_SCRIPT_URL) return;
        const correct = quizQuestions.filter((q, i) => answers[i] === q.respuesta).length;
        const percent = Math.round(correct / TOTAL_QUIZ * 100);
        const areaBreakdown = {};
        const areas = ['matematicas', 'lenguaje', 'sociales', 'naturales'];
        areas.forEach(area => {
            const qs = quizQuestions.filter(q => q.area === area);
            const c = qs.filter((q, qi) => {
                const idx = quizQuestions.indexOf(q);
                return answers[idx] === q.respuesta;
            }).length;
            areaBreakdown[area] = `${c}/${qs.length}`;
        });

        const payload = {
            nombre: student.name,
            email: student.email,
            puntaje: percent + '%',
            correctas: correct,
            total: TOTAL_QUIZ,
            tiempo: formatTime(elapsed),
            fecha: new Date().toLocaleString('es-EC'),
            matematicas: areaBreakdown.matematicas,
            lenguaje: areaBreakdown.lenguaje,
            sociales: areaBreakdown.sociales,
            naturales: areaBreakdown.naturales
        };

        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).catch(() => {});
    }

    function init() {
        $('#registration-form').addEventListener('submit', (e) => {
            e.preventDefault();
            student.name = $('#student-name').value.trim();
            student.email = $('#student-email').value.trim();
            quizQuestions = pickQuestions();
            answers = new Array(TOTAL_QUIZ).fill(null);
            currentIndex = 0;
            showScreen('screen-quiz');
            buildDots();
            renderQuestion();
            startTimer();
        });

        $('#btn-prev').addEventListener('click', () => goToQuestion(currentIndex - 1));
        $('#btn-next').addEventListener('click', () => goToQuestion(currentIndex + 1));
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
            quizQuestions = pickQuestions();
            answers = new Array(TOTAL_QUIZ).fill(null);
            currentIndex = 0;
            secondsLeft = TIME_LIMIT;
            showScreen('screen-quiz');
            buildDots();
            renderQuestion();
            startTimer();
        });
    }

    document.addEventListener('DOMContentLoaded', init);
})();
