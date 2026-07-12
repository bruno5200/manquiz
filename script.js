document.addEventListener('DOMContentLoaded', () => {
    const questionContainer = document.getElementById('question-container');
    const questionText = document.getElementById('question-text');
    const answerButtons = document.getElementById('answer-buttons');
    const resultContainer = document.getElementById('result-container');
    const quizTitle = document.getElementById('quiz-title');

    let currentQuestionIndex = 0;
    let score = 0;
    let quizData;

    async function startQuiz() {
        try {
            const response = await fetch('quiz.json');
            quizData = await response.json();
            quizTitle.innerText = quizData.title;
            setNextQuestion();
        } catch (error) {
            console.error("No se pudo cargar el cuestionario:", error);
            questionText.innerText = "Error al cargar el cuestionario. Por favor, inténtalo de nuevo más tarde.";
        }
    }

    function setNextQuestion() {
        resetState();
        if (currentQuestionIndex < quizData.questions.length) {
            showQuestion(quizData.questions[currentQuestionIndex]);
        } else {
            showResult();
        }
    }

    function showQuestion(question) {
        questionText.innerText = question.question;
        question.answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerText = answer.text;
            button.classList.add('btn');
            button.addEventListener('click', () => selectAnswer(answer.score));
            answerButtons.appendChild(button);
        });
    }

    function resetState() {
        while (answerButtons.firstChild) {
            answerButtons.removeChild(answerButtons.firstChild);
        }
    }

    function selectAnswer(answerScore) {
        score += answerScore;
        currentQuestionIndex++;
        setNextQuestion();
    }

    function showResult() {
        questionContainer.classList.add('hide');
        quizTitle.classList.add('hide');
        resultContainer.classList.remove('hide');

        const result = quizData.results.find(r => score >= r.minScore && score <= r.maxScore);

        if (result) {
            resultContainer.innerHTML = `
                <h2>Resultado</h2>
                <p>Tu puntaje es: ${score}</p>
                <p>${result.text}</p>
            `;
        } else {
            resultContainer.innerText = "No se pudo calcular tu resultado.";
        }
    }

    startQuiz();
});