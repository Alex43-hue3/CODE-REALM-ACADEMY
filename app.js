/* =========================================
   CODE REALM ACADEMY
   VERSION 0.1
========================================= */


// =========================================
// DATOS DEL JUGADOR
// =========================================

let player = {

    name: "",

    exp: 0,

    level: 1,

    rank: "NOVATO",

    quizScore: 0

};


// =========================================
// ELEMENTOS
// =========================================

const welcomeScreen =
    document.getElementById("welcomeScreen");

const nameScreen =
    document.getElementById("nameScreen");

const quizScreen =
    document.getElementById("quizScreen");

const introScreen =
    document.getElementById("introScreen");

const mainMenu =
    document.getElementById("mainMenu");


// =========================================
// CAMBIAR PANTALLA
// =========================================

function showScreen(screen) {

    document
        .querySelectorAll(".screen")
        .forEach(item => {

            item.classList.remove("active");

        });

    screen.classList.add("active");

}


// =========================================
// COMENZAR
// =========================================

document
    .getElementById("startButton")
    .addEventListener("click", () => {

        showScreen(nameScreen);

        setTimeout(() => {

            document
                .getElementById("playerName")
                .focus();

        }, 300);

    });


// =========================================
// NOMBRE
// =========================================

document
    .getElementById("nameButton")
    .addEventListener("click", saveName);


document
    .getElementById("playerName")
    .addEventListener("keydown", event => {

        if (event.key === "Enter") {

            saveName();

        }

    });


function saveName() {

    const input =
        document
            .getElementById("playerName");

    const name =
        input.value.trim();

    const error =
        document
            .getElementById("nameError");


    if (name.length < 2) {

        error.textContent =
            "Escribe un nombre de al menos 2 caracteres.";

        return;

    }


    player.name = name;


    localStorage.setItem(
        "codeRealmPlayer",
        JSON.stringify(player)
    );


    startQuiz();

}


// =========================================
// PREGUNTAS INICIALES
// =========================================

const questions = [

    {

        question:
            "¿Has programado anteriormente?",

        answers: [

            "Nunca he programado",

            "He visto algunos tutoriales",

            "Sí, ya sé programar"

        ],

        correct: null

    },

    {

        question:
            "¿Qué crees que hace HTML?",

        answers: [

            "Construye la estructura de una página",

            "Es un videojuego",

            "Sirve únicamente para hacer cálculos"

        ],

        correct: 0

    },

    {

        question:
            "¿Qué te gustaría aprender primero?",

        answers: [

            "Crear páginas web",

            "Crear videojuegos",

            "Todavía no estoy seguro"

        ],

        correct: null

    }

];


let currentQuestion = 0;


// =========================================
// INICIAR QUIZ
// =========================================

function startQuiz() {

    currentQuestion = 0;

    player.quizScore = 0;

    showScreen(quizScreen);

    loadQuestion();

}


// =========================================
// CARGAR PREGUNTA
// =========================================

function loadQuestion() {

    const question =
        questions[currentQuestion];


    document
        .getElementById("questionCounter")
        .textContent =
        `PREGUNTA ${currentQuestion + 1} / ${questions.length}`;


    document
        .getElementById("quizProgress")
        .style.width =
        `${((currentQuestion + 1) / questions.length) * 100}%`;


    document
        .getElementById("questionText")
        .textContent =
        question.question;


    const answersContainer =
        document
            .getElementById("answersContainer");


    answersContainer.innerHTML = "";


    document
        .getElementById("quizFeedback")
        .textContent = "";


    question.answers.forEach(
        (answer, index) => {

            const button =
                document.createElement("button");

            button.className =
                "answer-button";

            button.textContent =
                answer;

            button.addEventListener(
                "click",
                () => selectAnswer(index)
            );

            answersContainer.appendChild(button);

        }
    );

}


// =========================================
// RESPUESTA
// =========================================

function selectAnswer(index) {

    const question =
        questions[currentQuestion];


    const buttons =
        document.querySelectorAll(
            ".answer-button"
        );


    buttons.forEach(button => {

        button.disabled = true;

    });


    // Preguntas sin respuesta correcta

    if (question.correct === null) {

        buttons[index]
            .classList.add("correct");

        setTimeout(nextQuestion, 700);

        return;

    }


    // RESPUESTA CORRECTA

    if (index === question.correct) {

        buttons[index]
            .classList.add("correct");

        player.quizScore += 1;

        document
            .getElementById("quizFeedback")
            .textContent =
            "✓ ¡Correcto!";

    }

    // RESPUESTA INCORRECTA

    else {

        buttons[index]
            .classList.add("wrong");

        buttons[question.correct]
            .classList.add("correct");

        document
            .getElementById("quizFeedback")
            .textContent =
            "No pasa nada. Aquí venimos a aprender.";

    }


    setTimeout(nextQuestion, 900);

}


// =========================================
// SIGUIENTE PREGUNTA
// =========================================

function nextQuestion() {

    currentQuestion++;

    if (currentQuestion >= questions.length) {

        finishQuiz();

        return;

    }


    loadQuestion();

}


// =========================================
// TERMINAR DIAGNÓSTICO
// =========================================

function finishQuiz() {

    const name =
        player.name;


    document
        .getElementById("introTitle")
        .textContent =
        `Mucho gusto, ${name}.`;


    document
        .getElementById("introText")
        .textContent =
        `¿Estás listo para aprender a programar? 
        No importa cuánto sepas ahora. 
        En CODE REALM iremos construyendo tus habilidades 
        paso a paso.`;


    showScreen(introScreen);

}


// =========================================
// ENTRAR AL REALM
// =========================================

document
    .getElementById("enterRealmButton")
    .addEventListener("click", enterRealm);


function enterRealm() {

    player.exp = 0;

    player.level = 1;

    player.rank = "NOVATO";


    localStorage.setItem(
        "codeRealmPlayer",
        JSON.stringify(player)
    );


    loadMainMenu();

    showScreen(mainMenu);

}


// =========================================
// CARGAR MENÚ
// =========================================

function loadMainMenu() {

    document
        .getElementById("menuPlayerName")
        .textContent =
        player.name.toUpperCase();


    document
        .getElementById("welcomeName")
        .textContent =
        player.name;


    document
        .getElementById("playerExp")
        .textContent =
        player.exp;

}


// =========================================
// RECUPERAR JUGADOR
// =========================================

function loadSavedPlayer() {

    const saved =
        localStorage.getItem(
            "codeRealmPlayer"
        );


    if (!saved) {

        return;

    }


    try {

        player =
            JSON.parse(saved);

    }

    catch (error) {

        console.error(
            "No se pudo cargar el jugador.",
            error
        );

    }

}


// =========================================
// INICIO
// =========================================

loadSavedPlayer();


console.log(
    "🌌 CODE REALM ACADEMY iniciado."
);

console.log(
    "Jugador:",
    player.name || "Nuevo jugador"
);
