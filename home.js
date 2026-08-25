
const KEY="codeRealmPlayer";
const p={name:"Aventurero",rank:"NOVATO",level:1,exp:0,crystals:0,gold:0,xpNext:100,act1Completed:0,act1Total:13,...(JSON.parse(localStorage.getItem(KEY)||"{}")||{})};
const $=s=>document.querySelector(s), n=p.name||"Aventurero", total=Number(p.act1Total||13), done=Math.min(total,Number(p.act1Completed||0));
const pct=Math.round(done/total*100), xpct=Math.min(100,Number(p.exp||0)/Number(p.xpNext||100)*100);
["name","hero","name2"].forEach(id=>document.getElementById(id).textContent=n.toUpperCase());
document.getElementById("avatar").textContent=n[0].toUpperCase();document.getElementById("avatar2").textContent=n[0].toUpperCase();
document.getElementById("rank").textContent=p.rank;document.getElementById("rank2").textContent=p.rank;document.getElementById("level").textContent=p.level;document.getElementById("level2").textContent=p.level;
document.getElementById("xp").textContent=p.exp;document.getElementById("next").textContent=p.xpNext;document.getElementById("expR").textContent=p.exp;document.getElementById("exp2").textContent=p.exp;
document.getElementById("crystals").textContent=p.crystals;document.getElementById("cr2").textContent=p.crystals;document.getElementById("gold").textContent=p.gold;document.getElementById("go2").textContent=p.gold;
document.getElementById("xpbar").style.width=xpct+"%";document.getElementById("profilebar").style.setProperty("--px",xpct+"%");
document.getElementById("xptext").textContent=`${p.exp} / ${p.xpNext}`;document.getElementById("progress").textContent=`${done} / ${total}`;document.getElementById("percent").textContent=pct+"%";document.getElementById("actbar").style.width=pct+"%";
const m={never:"No importa si empiezas desde cero. Yo te acompañaré paso a paso.",seen:"Perfecto. Vamos a convertir lo que has visto en habilidades reales.",some:"Excelente. Aprovecharemos lo que ya sabes y construiremos sobre ello."};document.getElementById("lyra").textContent=m[p.diagnostic?.experience]||m.never;
document.getElementById("start").onclick=()=>location.href="act1.html";
document.getElementById("profile").onclick=()=>document.getElementById("tip").innerHTML="<span>🧙‍♀️</span><p><b>Lyra dice:</b> El perfil completo será el siguiente módulo.</p>";
document.querySelectorAll(".menu-card").forEach(c=>c.onclick=()=>document.getElementById("tip").innerHTML=`<span>🧙‍♀️</span><p><b>Lyra dice:</b> ${c.dataset.msg}</p>`);
document.querySelectorAll("[data-nav]").forEach(a=>a.onclick=e=>{e.preventDefault();document.getElementById("tip").innerHTML=`<span>🧙‍♀️</span><p><b>Lyra dice:</b> ${a.dataset.nav} estará disponible cuando construyamos ese módulo.</p>`});
