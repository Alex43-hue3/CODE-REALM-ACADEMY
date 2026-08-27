
const KEY="codeRealmPlayer";
const player={name:"Aventurero",rank:"NOVATO",level:1,exp:0,crystals:0,gold:0,xpNext:100,act1Completed:0,act1Total:13,mission1Completed:false,...(JSON.parse(localStorage.getItem(KEY)||"{}")||{})};
const $=s=>document.querySelector(s);
let step=0, choiceDone=false;
const steps=[
 {title:"Antes de escribir código...", text:`Hola, ${player.name||"aventurero"}. Soy Lyra. Hoy comienza tu primera misión en CODE REALM. Y quiero que sepas algo desde el principio: <b>no necesitas saber programar para estar aquí.</b>`},
 {title:"¿Qué significa programar?", text:"Programar es darle instrucciones a una computadora para que haga algo. Los lenguajes de programación y de marcado nos permiten construir cosas paso a paso. En esta academia aprenderás haciendo, no memorizando sin entender."},
 {title:"Tu primer mapa: HTML", text:"HTML es el lenguaje que utilizaremos para construir la estructura de una página web. No es magia: son piezas con funciones concretas. Más adelante aprenderás CSS para el diseño y JavaScript para la interacción."},
 {title:"Primera decisión", text:"Quiero comprobar que la idea quedó clara. Selecciona la opción que mejor responde a la pregunta. Si te equivocas, no pierdes nada en esta misión: Lyra te explicará el concepto y podrás intentarlo otra vez."},
 {title:"¡Misión completada!", text:"Has terminado tu primera misión. Todavía no hemos construido una página, porque primero aprendiste qué estamos haciendo y por qué. En la siguiente misión prepararemos tus herramientas de trabajo."}
];
function save(){localStorage.setItem(KEY,JSON.stringify(player))}
function hud(){
 const n=player.name||"Aventurero", xpct=Math.min(100,player.exp/player.xpNext*100);
 $("#playerName").textContent=n.toUpperCase();$("#playerRank").textContent=player.rank;$("#playerLevel").textContent=player.level;
 $("#playerXp").textContent=player.exp;$("#playerXpNext").textContent=player.xpNext;$("#expResource").textContent=player.exp;
 $("#crystalsResource").textContent=player.crystals;$("#goldResource").textContent=player.gold;$("#avatarMini").textContent=n[0].toUpperCase();$("#playerXpBar").style.width=xpct+"%";
}
function render(){
 const s=steps[step];$("#dialogueTitle").textContent=s.title;$("#dialogueText").innerHTML=s.text;
 $("#stepCounter").textContent=`${step+1} / ${steps.length}`;$("#missionBar").style.width=((step+1)/steps.length*100)+"%";
 document.querySelectorAll(".step").forEach((b,i)=>b.classList.toggle("active",i===step));
 const area=$("#lessonArea");
 if(step===0) area.innerHTML=`<div class="lesson-title">🎮 Tu primera regla de CODE REALM</div><p class="lesson-text">Aquí no buscamos que memorices comandos. Primero entenderás qué estás haciendo; después lo practicarás en Visual Studio Code y finalmente demostrarás lo aprendido en un reto.</p><div class="info-grid"><div class="info-box"><div class="icon">🧠</div><b>Entender</b><span>Lyra explica el concepto con ejemplos sencillos.</span></div><div class="info-box"><div class="icon">🛠️</div><b>Practicar</b><span>Harás la tarea real en tu computadora.</span></div><div class="info-box"><div class="icon">⚔️</div><b>Demostrar</b><span>Los retos comprobarán si realmente lo aprendiste.</span></div></div>`;
 if(step===1) area.innerHTML=`<div class="lesson-title">Programar es construir con instrucciones</div><p class="lesson-text">Piensa en una receta. Una computadora también necesita instrucciones claras. Si quieres que aparezca un título, una imagen o un botón, tendrás que indicarle qué elemento quieres y cómo debe comportarse.</p><div class="code-example"><span class="comment">// Más adelante escribirás instrucciones como estas</span><br><span class="tag">&lt;h1&gt;</span>Mi primera página<span class="tag">&lt;/h1&gt;</span></div>`;
 if(step===2) area.innerHTML=`<div class="lesson-title">Conoce las piezas que aprenderás</div><div class="info-grid"><div class="info-box"><div class="icon">🏷️</div><b>HTML</b><span>Construye la estructura y el contenido de la página.</span></div><div class="info-box"><div class="icon">🎨</div><b>CSS</b><span>Da estilo, colores, tamaños y diseño.</span></div><div class="info-box"><div class="icon">⚡</div><b>JavaScript</b><span>Agrega lógica e interacción.</span></div></div><div class="code-example"><span class="tag">&lt;h1&gt;</span>Hola, mundo<span class="tag">&lt;/h1&gt;</span><br><span class="tag">&lt;p&gt;</span>Estoy aprendiendo.<span class="tag">&lt;/p&gt;</span></div>`;
 if(step===3) area.innerHTML=`<div class="lesson-title">⚔️ Prueba de comprensión</div><p class="lesson-text">¿Cuál de estas afirmaciones describe mejor lo que harás en CODE REALM?</p><div class="choice-grid"><button class="choice" data-correct="true">Aprenderé paso a paso, practicaré en Visual Studio Code y resolveré retos.</button><button class="choice">Solo copiaré código sin saber qué significa.</button><button class="choice">El juego hará todos los proyectos por mí.</button><button class="choice">Necesito saber programación antes de empezar.</button></div><div class="feedback" id="feedback"></div>`;
 if(step===4) area.innerHTML=`<div class="reward-box"><div class="star">✦</div><h2>PRIMER PASO COMPLETADO</h2><strong>+25 EXP</strong><p>Has comprendido la filosofía de aprendizaje de CODE REALM. La próxima misión será preparar Visual Studio Code y crear tu primera zona de trabajo.</p></div>`;
 $("#prevBtn").disabled=step===0;$("#nextBtn").textContent=step===3&&!choiceDone?"RESPONDER ✦":step===4?"VOLVER AL MAPA ✦":"CONTINUAR ✦";
}
function next(){
 if(step===3&&!choiceDone){const selected=$(".choice.selected"), fb=$("#feedback");if(!selected){fb.textContent="Selecciona una respuesta primero.";fb.className="feedback show bad";return}if(selected.dataset.correct==="true"){selected.classList.add("correct");fb.textContent="¡Correcto! Esa será la filosofía de CODE REALM: entender, practicar y demostrar.";fb.className="feedback show good";choiceDone=true;document.querySelectorAll(".choice:not(.correct)").forEach(x=>x.disabled=true);$("#nextBtn").textContent="CONTINUAR ✦"}else{selected.classList.add("wrong");fb.textContent="Todavía no. Recuerda: el objetivo es que tú aprendas y puedas programar por tu cuenta. Inténtalo otra vez.";fb.className="feedback show bad";return}}
 else if(step<steps.length-1){step++;render()}
 else complete();
}
function complete(){

    if(!player.mission1Completed){

        player.mission1Completed = true;

        // Misión 1 de 2 completada
        player.act1Completed = Math.max(
            Number(player.act1Completed || 0),
            1
        );

        // Recompensa de la Misión 1
        player.exp = Number(player.exp || 0) + 50;

        save();
        hud();

        toast("+50 EXP · Misión 1 completada");

        // Después de mostrar la recompensa,
        // pasar directamente a la Misión 2
        setTimeout(() => {
            location.href = "act2.html";
        }, 1200);

    } else {

        // Si ya estaba completada,
        // no vuelve a entregar EXP
        location.href = "act2.html";
    }
}
}
function toast(t){const el=$("#toast");el.textContent=t;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2200)}
$("#nextBtn").onclick=next;$("#prevBtn").onclick=()=>{if(step>0){step--;if(step<3)choiceDone=false;render()}};
$("#backHome").onclick=()=>location.href="home.html";
document.querySelectorAll(".step").forEach(b=>b.onclick=()=>{const target=Number(b.dataset.step);if(target<=step){step=target;render()}});
document.addEventListener("click",e=>{if(e.target.matches(".choice")){document.querySelectorAll(".choice").forEach(x=>x.classList.remove("selected","wrong"));e.target.classList.add("selected")}});
hud();render();
