const KEY = "codeRealmPlayer";

const saved = JSON.parse(localStorage.getItem(KEY) || "{}");

const player = {
    name: "Aventurero",
    rank: "NOVATO",
    level: 1,
    exp: 0,
    crystals: 0,
    gold: 0,
    xpNext: 100,
    act1Completed: 0,
    act1Total: 2,
    mission1Completed: false,
    mission2Completed: false,
    ...saved
};

let step = 0;
let choiceDone = false;

const steps = [

    {
        title: "Antes de escribir código...",
        text: `Hola, ${player.name}. Soy Lyra. Hoy comienza tu primera misión en CODE REALM. 
        Y quiero que sepas algo desde el principio: <b>no necesitas saber programar para estar aquí.</b>`
    },

    {
        title: "¿Qué significa programar?",
        text: `Programar significa darle instrucciones a una computadora para que realice acciones.
        En CODE REALM no queremos que solamente copies código: queremos que entiendas qué estás escribiendo y por qué.`
    },

    {
        title: "Tu primer mapa: HTML",
        text: `HTML será una de las primeras herramientas que aprenderás.
        Con HTML construiremos la estructura de nuestras páginas web.
        Más adelante conocerás CSS y JavaScript.`
    },

    {
        title: "Primera decisión",
        text: `Antes de continuar quiero comprobar que entendiste cómo vamos a aprender.
        No te preocupes: esta prueba no te quitará EXP.`
    },

    {
        title: "¡Misión completada!",
        text: `Has terminado tu primera misión.
        Ahora estás listo para preparar tu entorno de programación.`
    }

];

function save() {
    localStorage.setItem(KEY, JSON.stringify(player));
}


function hud() {

    const name = player.name || "Aventurero";

    const xpNext = Number(player.xpNext || 100);

    const xp = Number(player.exp || 0);

    const percent = Math.min(100, (xp / xpNext) * 100);

    document.querySelector("#playerName").textContent =
        name.toUpperCase();

    document.querySelector("#playerRank").textContent =
        player.rank || "NOVATO";

    document.querySelector("#playerLevel").textContent =
        player.level || 1;

    document.querySelector("#playerXp").textContent =
        xp;

    document.querySelector("#playerXpNext").textContent =
        xpNext;

    document.querySelector("#expResource").textContent =
        xp;

    document.querySelector("#crystalsResource").textContent =
        player.crystals || 0;

    document.querySelector("#goldResource").textContent =
        player.gold || 0;

    document.querySelector("#avatarMini").textContent =
        name.charAt(0).toUpperCase();

    document.querySelector("#playerXpBar").style.width =
        percent + "%";
}


function render() {

    const current = steps[step];

    document.querySelector("#dialogueTitle").textContent =
        current.title;

    document.querySelector("#dialogueText").innerHTML =
        current.text;

    document.querySelector("#stepCounter").textContent =
        `${step + 1} / ${steps.length}`;

    document.querySelector("#missionBar").style.width =
        ((step + 1) / steps.length * 100) + "%";


    document.querySelectorAll(".step").forEach((button, index) => {

        button.classList.toggle(
            "active",
            index === step
        );

        button.classList.toggle(
            "done",
            index < step
        );

    });


    const area =
        document.querySelector("#lessonArea");


    /* PASO 1 */

    if (step === 0) {

        area.innerHTML = `

            <div class="lesson-title">
                🎮 Tu primera regla de CODE REALM
            </div>

            <p class="lesson-text">
                Aquí no queremos que memorices comandos sin entenderlos.
                Primero aprenderás qué significa cada cosa,
                después la practicarás en tu computadora
                y finalmente demostrarás lo aprendido.
            </p>

            <div class="info-grid">

                <div class="info-box">
                    <div class="icon">🧠</div>
                    <b>Entender</b>
                    <span>
                        Lyra te explicará cada concepto.
                    </span>
                </div>

                <div class="info-box">
                    <div class="icon">🛠️</div>
                    <b>Practicar</b>
                    <span>
                        Harás ejercicios reales.
                    </span>
                </div>

                <div class="info-box">
                    <div class="icon">⚔️</div>
                    <b>Demostrar</b>
                    <span>
                        Resolverás retos para comprobar
                        lo aprendido.
                    </span>
                </div>

            </div>

        `;

    }


    /* PASO 2 */

    if (step === 1) {

        area.innerHTML = `

            <div class="lesson-title">
                💻 Programar es construir con instrucciones
            </div>

            <p class="lesson-text">

                Imagina que quieres decirle a una computadora:

                <br><br>

                <b>"Quiero mostrar un título".</b>

                <br><br>

                La computadora necesita que le indiquemos
                exactamente qué queremos hacer.

            </p>

            <div class="code-example">

                &lt;h1&gt;

                Mi primera página

                &lt;/h1&gt;

            </div>

            <p class="lesson-text">

                Más adelante aprenderás qué significa
                cada parte de este código.

            </p>

        `;

    }


    /* PASO 3 */

    if (step === 2) {

        area.innerHTML = `

            <div class="lesson-title">
                🌐 Tus primeras tecnologías
            </div>

            <div class="info-grid">

                <div class="info-box">

                    <div class="icon">🏷️</div>

                    <b>HTML</b>

                    <span>
                        Construye la estructura
                        y contenido de una página.
                    </span>

                </div>


                <div class="info-box">

                    <div class="icon">🎨</div>

                    <b>CSS</b>

                    <span>
                        Controla colores,
                        tamaños y diseño.
                    </span>

                </div>


                <div class="info-box">

                    <div class="icon">⚡</div>

                    <b>JavaScript</b>

                    <span>
                        Agrega interacción
                        y comportamiento.
                    </span>

                </div>

            </div>


            <div class="code-example">

                &lt;h1&gt;Hola, mundo&lt;/h1&gt;

                <br>

                &lt;p&gt;Estoy aprendiendo.&lt;/p&gt;

            </div>

        `;

    }


    /* PASO 4 */

    if (step === 3) {

        area.innerHTML = `

            <div class="lesson-title">
                ⚔️ Prueba de comprensión
            </div>

            <p class="lesson-text">

                ¿Cuál de estas afirmaciones describe
                mejor cómo aprenderás en CODE REALM?

            </p>


            <div class="choice-grid">

                <button class="choice" data-correct="true">

                    Aprenderé paso a paso,
                    practicaré en Visual Studio Code
                    y resolveré retos.

                </button>


                <button class="choice">

                    Solo copiaré código
                    sin saber qué significa.

                </button>


                <button class="choice">

                    El juego hará todos
                    los proyectos por mí.

                </button>


                <button class="choice">

                    Necesito saber programación
                    antes de comenzar.

                </button>

            </div>


            <div class="feedback" id="feedback"></div>

        `;

    }


    /* PASO 5 */

    if (step === 4) {

        area.innerHTML = `

            <div class="reward-box">

                <div class="star">
                    ✦
                </div>

                <h2>
                    PRIMER PASO COMPLETADO
                </h2>

                <strong>
                    +50 EXP
                </strong>

                <p>

                    Has completado tu primera misión.

                    <br><br>

                    Ahora aprenderás a preparar
                    tu propio entorno de programación
                    utilizando Visual Studio Code.

                </p>

            </div>

        `;

    }


    document.querySelector("#prevBtn").disabled =
        step === 0;


    const nextButton =
        document.querySelector("#nextBtn");


    if (step === 3 && !choiceDone) {

        nextButton.textContent =
            "RESPONDER ✦";

    }

    else if (step === 4) {

        nextButton.textContent =
            "IR A MISIÓN 2 ✦";

    }

    else {

        nextButton.textContent =
            "CONTINUAR ✦";

    }

}


/* SIGUIENTE */

function next() {

    /* Pregunta */

    if (step === 3 && !choiceDone) {

        const selected =
            document.querySelector(".choice.selected");

        const feedback =
            document.querySelector("#feedback");


        if (!selected) {

            feedback.textContent =
                "Selecciona una respuesta primero.";

            feedback.className =
                "feedback show bad";

            return;

        }


        if (selected.dataset.correct === "true") {

            selected.classList.add("correct");

            feedback.textContent =
                "¡Correcto! Has entendido cómo funciona CODE REALM.";

            feedback.className =
                "feedback show good";

            choiceDone = true;


            document
                .querySelectorAll(".choice:not(.correct)")
                .forEach(button => {

                    button.disabled = true;

                });


            document.querySelector("#nextBtn").textContent =
                "CONTINUAR ✦";

        }

        else {

            selected.classList.add("wrong");

            feedback.textContent =
                "Todavía no. Lee nuevamente la explicación e inténtalo.";

            feedback.className =
                "feedback show bad";

        }

        return;
    }


    /* Avanzar */

    if (step < steps.length - 1) {

        step++;

        render();

        return;

    }


    /* Final */

    complete();

}


/* COMPLETAR MISIÓN */

function complete() {

    if (!player.mission1Completed) {

        player.mission1Completed = true;

        player.act1Completed = Math.max(
            Number(player.act1Completed || 0),
            1
        );


        /* +50 EXP */

        player.exp =
            Number(player.exp || 0) + 50;


        save();

        hud();


        toast(
            "+50 EXP · MISIÓN 1 COMPLETADA"
        );


        /*
        Esperamos un momento para que
        el jugador vea la recompensa.
        */

        setTimeout(() => {

            window.location.href =
                "act2.html";

        }, 1200);

    }

    else {

        /*
        Si ya estaba completada,
        no vuelve a dar EXP.
        */

        window.location.href =
            "act2.html";

    }

}


/* MENSAJE */

function toast(message) {

    const element =
        document.querySelector("#toast");

    element.textContent =
        message;

    element.classList.add("show");


    setTimeout(() => {

        element.classList.remove("show");

    }, 2200);

}


/* BOTÓN SIGUIENTE */

document
    .querySelector("#nextBtn")
    .addEventListener("click", next);


/* BOTÓN ANTERIOR */

document
    .querySelector("#prevBtn")
    .addEventListener("click", () => {

        if (step > 0) {

            step--;

            if (step < 3) {

                choiceDone = false;

            }

            render();

        }

    });


/* REGRESAR AL INICIO */

document
    .querySelector("#backHome")
    .addEventListener("click", () => {

        window.location.href =
            "home.html";

    });


/* BOTONES LATERALES */

document
    .querySelectorAll(".step")
    .forEach(button => {

        button.addEventListener("click", () => {

            const target =
                Number(button.dataset.step);


            if (target <= step) {

                step = target;

                render();

            }

        });

    });


/* RESPUESTAS */

document.addEventListener("click", event => {

    if (!event.target.matches(".choice")) {

        return;

    }


    document
        .querySelectorAll(".choice")
        .forEach(button => {

            button.classList.remove(
                "selected",
                "wrong"
            );

        });


    event.target.classList.add(
        "selected"
    );

});


/* INICIAR */

hud();

render();
