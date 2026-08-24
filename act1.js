/* =========================================
   CODE REALM ACADEMY
   ACTO I
========================================= */


// =========================================
// DATOS
// =========================================

let player =
    JSON.parse(
        localStorage.getItem("codeRealmPlayer")
    ) || {

        name: "Aventurero",

        exp: 0,

        level: 1,

        rank: "NOVATO"

    };


let completedMissions =
    JSON.parse(
        localStorage.getItem(
            "codeRealmAct1"
        )
    ) || [];


const rewards = {

    1: 50,

    2: 75,

    3: 100,

    4: 150,

    5: 175,

    6: 300

};


// =========================================
// ELEMENTOS
// =========================================

const modal =
    document.getElementById(
        "missionModal"
    );

const modalTitle =
    document.getElementById(
        "modalTitle"
    );

const modalContent =
    document.getElementById(
        "modalContent"
    );

const modalActions =
    document.getElementById(
        "modalActions"
    );


// =========================================
// CARGAR
// =========================================

function updateInterface() {

    document.getElementById(
        "exp"
    ).textContent = player.exp;


    const completed =
        completedMissions.length;


    document.getElementById(
        "progressText"
    ).textContent =
        `${completed} / 6`;


    document.getElementById(
        "progressBar"
    ).style.width =
        `${(completed / 6) * 100}%`;


    for (let i = 1; i <= 6; i++) {

        const mission =
            document.getElementById(
                `mission${i}`
            );


        if (!mission) continue;


        if (
            i === 1 ||
            completedMissions.includes(i - 1)
        ) {

            mission.classList.remove(
                "locked"
            );

        }

    }

}


updateInterface();


// =========================================
// COMENZAR MISIÓN
// =========================================

function startMission(id) {

    if (
        id !== 1 &&
        !completedMissions.includes(id - 1)
    ) {

        return;

    }


    modal.classList.add("active");


    if (id === 1) {

        missionOne();

    }

    if (id === 2) {

        missionTwo();

    }

    if (id === 3) {

        missionThree();

    }

    if (id === 4) {

        missionFour();

    }

    if (id === 5) {

        missionFive();

    }

    if (id === 6) {

        missionBoss();

    }

}


// =========================================
// MISIÓN 1
// =========================================

function missionOne() {

    modalTitle.textContent =
        "¿Qué es programar?";


    modalContent.innerHTML = `

        <p>
            Antes de escribir código,
            necesitas entender algo fundamental.
        </p>

        <br>

        <p>
            <strong>Programar</strong> significa
            crear instrucciones que una computadora
            puede entender y ejecutar.
        </p>

        <br>

        <p>
            Imagina que quieres explicarle a alguien
            cómo preparar un sándwich.
        </p>

        <br>

        <p>
            No puedes simplemente decir:
        </p>

        <br>

        <strong>
            "Hazme un sándwich."
        </strong>

        <br><br>

        <p>
            Tienes que darle instrucciones.
        </p>

        <br>

        <p>
            1. Toma el pan.
            <br>
            2. Coloca el jamón.
            <br>
            3. Coloca el queso.
            <br>
            4. Cierra el sándwich.
        </p>

        <br>

        <p>
            Programar funciona de una manera
            parecida.
        </p>

    `;


    modalActions.innerHTML = `

        <button
            class="modal-action"
            onclick="missionOneQuiz()"
        >
            CONTINUAR
        </button>

    `;

}


// =========================================
// QUIZ MISIÓN 1
// =========================================

function missionOneQuiz() {

    modalTitle.textContent =
        "Primera prueba";


    modalContent.innerHTML = `

        <p>
            Lyra quiere comprobar si
            comprendiste la idea.
        </p>

        <br>

        <strong>
            ¿Qué es programar?
        </strong>

        <div class="quiz-options">

            <button
                class="quiz-option"
                onclick="answerMission1(this, false)"
            >
                Jugar videojuegos todo el día.
            </button>

            <button
                class="quiz-option"
                onclick="answerMission1(this, true)"
            >
                Crear instrucciones para que
                una computadora realice tareas.
            </button>

            <button
                class="quiz-option"
                onclick="answerMission1(this, false)"
            >
                Escribir únicamente números.
            </button>

        </div>

    `;

    modalActions.innerHTML = "";

}


function answerMission1(
    button,
    correct
) {

    if (!correct) {

        button.classList.add("wrong");

        return;

    }


    button.classList.add("correct");


    modalActions.innerHTML = `

        <p style="margin-top:20px;color:#4ade80;">
            ✓ ¡Correcto!
        </p>

        <button
            class="modal-action"
            onclick="completeMission(1)"
        >
            RECLAMAR 50 EXP
        </button>

    `;

}


// =========================================
// MISIÓN 2
// =========================================

function missionTwo() {

    modalTitle.textContent =
        "Conoce tus herramientas";


    modalContent.innerHTML = `

        <p>
            Todo desarrollador necesita
            herramientas.
        </p>

        <br>

        <p>
            Nosotros utilizaremos:
        </p>

        <br>

        <strong>
            💻 Visual Studio Code
        </strong>

        <br><br>

        <p>
            VS Code será nuestro taller.
            Aquí escribiremos, organizaremos
            y modificaremos nuestro código.
        </p>

        <br>

        <strong>
            🌐 Navegador
        </strong>

        <br><br>

        <p>
            Utilizaremos Firefox, Chrome,
            Edge u otro navegador para
            ver nuestras páginas.
        </p>

        <br>

        <p>
            ⚠️ Importante:
        </p>

        <p>
            CODE REALM te enseñará qué hacer,
            pero tú realizarás el trabajo
            realmente en VS Code.
        </p>

    `;


    modalActions.innerHTML = `

        <button
            class="modal-action"
            onclick="missionTwoQuiz()"
        >
            YA ESTOY LISTO
        </button>

    `;

}


function missionTwoQuiz() {

    modalTitle.textContent =
        "Comprueba tu conocimiento";


    modalContent.innerHTML = `

        <strong>
            ¿Qué herramienta utilizaremos
            para escribir nuestro código?
        </strong>

        <div class="quiz-options">

            <button
                class="quiz-option"
                onclick="answerMission2(this, false)"
            >
                Calculadora
            </button>

            <button
                class="quiz-option"
                onclick="answerMission2(this, true)"
            >
                Visual Studio Code
            </button>

            <button
                class="quiz-option"
                onclick="answerMission2(this, false)"
            >
                Reproductor de música
            </button>

        </div>

    `;

}


function answerMission2(
    button,
    correct
) {

    if (!correct) {

        button.classList.add("wrong");

        return;

    }


    button.classList.add("correct");


    modalActions.innerHTML = `

        <button
            class="modal-action"
            onclick="completeMission(2)"
        >
            RECLAMAR 75 EXP
        </button>

    `;

}


// =========================================
// MISIÓN 3
// =========================================

function missionThree() {

    modalTitle.textContent =
        "Tu primer proyecto";


    modalContent.innerHTML = `

        <p>
            Ahora vamos a salir de CODE REALM
            durante un momento.
        </p>

        <br>

        <p>
            Abre <strong>Visual Studio Code</strong>
            en tu computadora.
        </p>

        <br>

        <p>
            Crea una carpeta llamada:
        </p>

        <code>
CODE-REALM-PROYECTO
        </code>

        <p>
            Después abre esa carpeta
            desde VS Code.
        </p>

        <br>

        <p>
            Cuando la tengas abierta,
            vuelve a CODE REALM.
        </p>

    `;


    modalActions.innerHTML = `

        <button
            class="modal-action"
            onclick="missionThreeCheck()"
        >
            YA LO HICE
        </button>

    `;

}


function missionThreeCheck() {

    modalTitle.textContent =
        "¿Ya tienes tu proyecto?";


    modalContent.innerHTML = `

        <p>
            No podemos comprobar directamente
            tu VS Code todavía.
        </p>

        <br>

        <p>
            Esta primera versión confía en
            que completes el ejercicio.
        </p>

        <br>

        <strong>
            ¿Creaste la carpeta
            CODE-REALM-PROYECTO?
        </strong>

    `;


    modalActions.innerHTML = `

        <button
            class="modal-action"
            onclick="completeMission(3)"
        >
            SÍ, CONTINUAR
        </button>

    `;

}


// =========================================
// MISIÓN 4
// =========================================

function missionFour() {

    modalTitle.textContent =
        "El nacimiento de una página";


    modalContent.innerHTML = `

        <p>
            Dentro de tu proyecto,
            crea un archivo llamado:
        </p>

        <code>
index.html
        </code>

        <p>
            Ahora escribe:
        </p>

        <code>
&lt;!DOCTYPE html&gt;

&lt;html&gt;

&lt;head&gt;

    &lt;title&gt;
        Mi primera página
    &lt;/title&gt;

&lt;/head&gt;

&lt;body&gt;

    &lt;h1&gt;
        Hola CODE REALM
    &lt;/h1&gt;

&lt;/body&gt;

&lt;/html&gt;
        </code>

        <p>
            Guarda el archivo.
        </p>

        <br>

        <p>
            Después abre
            <strong>index.html</strong>
            en tu navegador.
        </p>

    `;


    modalActions.innerHTML = `

        <button
            class="modal-action"
            onclick="completeMission(4)"
        >
            ¡MI PÁGINA FUNCIONA!
        </button>

    `;

}


// =========================================
// MISIÓN 5
// =========================================

function missionFive() {

    modalTitle.textContent =
        "Dale vida a tu página";


    modalContent.innerHTML = `

        <p>
            Ahora vamos a modificar
            nuestra página.
        </p>

        <br>

        <p>
            Cambia el contenido de tu
            <strong>body</strong> por:
        </p>

        <code>
&lt;h1&gt;
    Mi primera página
&lt;/h1&gt;

&lt;p&gt;
    Estoy aprendiendo a programar
    con CODE REALM.
&lt;/p&gt;

&lt;button&gt;
    Mi primer botón
&lt;/button&gt;
        </code>

        <p>
            Guarda y actualiza tu navegador.
        </p>

        <br>

        <p>
            Si puedes ver el título,
            el texto y el botón...
        </p>

        <br>

        <strong>
            acabas de modificar tu primera
            página web.
        </strong>

    `;


    modalActions.innerHTML = `

        <button
            class="modal-action"
            onclick="completeMission(5)"
        >
            COMPLETAR MISIÓN
        </button>

    `;

}


// =========================================
// MINI JEFE
// =========================================

function missionBoss() {

    modalTitle.textContent =
        "👹 LA PRIMERA PRUEBA";


    modalContent.innerHTML = `

        <p>
            Has llegado al primer
            Mini Jefe.
        </p>

        <br>

        <p>
            Ahora Lyra no te va a decir
            exactamente qué escribir.
        </p>

        <br>

        <strong>
            Debes construir por tu cuenta
            una pequeña página.
        </strong>

        <br><br>

        <p>
            Tu página debe tener:
        </p>

        <br>

        <p>
            ✓ Un título principal
            <br>
            ✓ Un párrafo
            <br>
            ✓ Un botón
            <br>
            ✓ Tu nombre
        </p>

        <br>

        <p>
            Puedes utilizar los elementos
            HTML que acabamos de aprender.
        </p>

    `;


    modalActions.innerHTML = `

        <button
            class="modal-action"
            onclick="bossQuiz()"
        >
            TERMINÉ MI PÁGINA
        </button>

    `;

}


// =========================================
// JEFE - PRUEBA
// =========================================

function bossQuiz() {

    modalTitle.textContent =
        "⚔️ PRUEBA FINAL";


    modalContent.innerHTML = `

        <strong>
            ¿Cuál de estos elementos
            crea un título principal?
        </strong>

        <div class="quiz-options">

            <button
                class="quiz-option"
                onclick="bossAnswer(this,false)"
            >
                &lt;p&gt;
            </button>

            <button
                class="quiz-option"
                onclick="bossAnswer(this,true)"
            >
                &lt;h1&gt;
            </button>

            <button
                class="quiz-option"
                onclick="bossAnswer(this,false)"
            >
                &lt;button&gt;
            </button>

        </div>

    `;

}


function bossAnswer(
    button,
    correct
) {

    if (!correct) {

        button.classList.add("wrong");

        return;

    }


    button.classList.add("correct");


    modalActions.innerHTML = `

        <p style="margin-top:20px;color:#4ade80;">
            ⚔️ ¡HAS DERROTADO AL MINI JEFE!
        </p>

        <button
            class="modal-action"
            onclick="completeMission(6)"
        >
            RECLAMAR 300 EXP
        </button>

    `;

}


// =========================================
// COMPLETAR MISIÓN
// =========================================

function completeMission(id) {

    if (
        completedMissions.includes(id)
    ) {

        closeMission();

        return;

    }


    completedMissions.push(id);


    player.exp += rewards[id];


    localStorage.setItem(
        "codeRealmPlayer",
        JSON.stringify(player)
    );


    localStorage.setItem(
        "codeRealmAct1",
        JSON.stringify(
            completedMissions
        )
    );


    updateInterface();


    if (id === 6) {

        showActComplete();

        return;

    }


    modalTitle.textContent =
        "¡Misión completada!";


    modalContent.innerHTML = `

        <div class="act-complete">

            <div class="trophy">
                ⭐
            </div>

            <h2>
                +${rewards[id]} EXP
            </h2>

            <p>
                Has completado la misión.
            </p>

        </div>

    `;


    modalActions.innerHTML = `

        <button
            class="modal-action"
            onclick="closeMission()"
        >
            CONTINUAR
        </button>

    `;

}


// =========================================
// ACTO COMPLETADO
// =========================================

function showActComplete() {

    modalTitle.textContent =
        "🏆 ACTO I COMPLETADO";


    modalContent.innerHTML = `

        <div class="act-complete">

            <div class="trophy">
                🏆
            </div>

            <h2>
                ¡Lo lograste, ${player.name}!
            </h2>

            <br>

            <p>
                Has completado tu primera
                aventura en CODE REALM.
            </p>

            <br>

            <strong>
                ⭐ ${player.exp} EXP
            </strong>

            <br><br>

            <p>
                🔓 Habilidad desbloqueada:
            </p>

            <br>

            <strong>
                🌐 HTML — NIVEL 1
            </strong>

        </div>

    `;


    modalActions.innerHTML = `

        <button
            class="modal-action"
            onclick="closeMission()"
        >
            CONTINUAR
        </button>

    `;

}


// =========================================
// CERRAR
// =========================================

function closeMission() {

    modal.classList.remove(
        "active"
    );

}


// =========================================
// VOLVER
// =========================================

function goBack() {

    window.location.href =
        "index.html";

}
