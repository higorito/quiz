const apiUrl = 'http://localhost:5000/api';
let currentQuestionIndex = 0;
let answers = [];
let userName = '';
let questions = [];

async function startQuiz() {
    userName = document.getElementById('username').value;
    if (!userName) {
        alert('Informe seu nome para começar o quiz');
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: userName })
        });

        if (!response.ok) {
            throw new Error('Failed to start quiz');
        }

        document.getElementById('start').style.display = 'none';
        document.getElementById('quiz').style.display = 'block';
        showQuestion();
    } catch (error) {
        console.error('Error starting quiz:', error);
        alert('Não foi possível iniciar o quiz.');
    }
}

async function showQuestion() {
    try {
        const response = await fetch(`${apiUrl}/quiz`);
        if (!response.ok) {
            throw new Error('Falha ao buscar perguntas');
        }

        questions = await response.json();
        const question = questions[currentQuestionIndex];
        const questionContainer = document.getElementById('question-container');

        questionContainer.innerHTML = `
            <h2>${question.question}</h2>
            ${question.options.map(option => `
                <div class="custom-radio">
                    <label>
                        <input type="radio" name="answer" value="${option}" />
                        ${option}
                    </label>
                </div>
            `).join('')}
        `;
    } catch (error) {
        console.error('Error fetching questions:', error);
        alert('Não foi possível carregar as perguntas. ');
    }
}

async function nextQuestion() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (!selectedOption) {
        alert('Selecione uma opção para continuar');
        return;
    }

    answers.push({
        question: questions[currentQuestionIndex].question, // Atualiza para usar questions
        answer: selectedOption.value
    });

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) { // Atualiza para usar questions
        showQuestion();
    } else {
        submitQuiz();
    }
}

async function submitQuiz() {
    try {
        const response = await fetch(`${apiUrl}/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: userName, answers: answers })
        });

        if (!response.ok) {
            throw new Error('Failed to submit quiz');
        }

        const result = await response.json();
        document.getElementById('quiz').style.display = 'none';
        document.getElementById('result').style.display = 'block';
        document.getElementById('score').innerText = `Seu placar é: ${result.score}`;
    } catch (error) {
        console.error('Error submitting quiz:', error);
        alert('Não foi possível enviar o quiz. ');
    }
}

async function viewRankings() {
    try {
        const response = await fetch(`${apiUrl}/rankings`);
        if (!response.ok) {
            throw new Error('Failed to fetch rankings');
        }

        const rankings = await response.json();
        const rankingsList = document.getElementById('rankings-list');
        rankingsList.innerHTML = rankings.map(player => `<li>${player.name}: ${player.score}</li>`).join('');
        document.getElementById('result').style.display = 'none';
        document.getElementById('rankings').style.display = 'block';
    } catch (error) {
        console.error('Error fetching rankings:', error);
        alert('Não foi possível carregar o ranking. ');
    }
}

function restartQuiz() {
    document.getElementById('rankings').style.display = 'none';
    document.getElementById('start').style.display = 'block';
    currentQuestionIndex = 0;
    answers = [];
}
