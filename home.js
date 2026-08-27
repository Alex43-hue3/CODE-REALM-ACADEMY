const player = CodeRealm.load();
const $ = s => document.querySelector(s);

function render(){
  CodeRealm.normalize(player);
  const info = CodeRealm.getLevelInfo(player.exp);
  const n = player.name || "Aventurero";
  const xp = Number(player.exp || 0);
  const next = Number(info.nextExp || xp);
  const pct = info.progress;
  const done = Number(!!player.mission1Completed)+Number(!!player.mission2Completed);

  $("#name").textContent=n.toUpperCase();
  $("#hero").textContent=n.toUpperCase();
  $("#rank").textContent=info.rank;
  $("#level").textContent=info.level;
  $("#xp").textContent=xp;
  $("#next").textContent=next;
  $("#xpbar").style.width=pct+"%";
  $("#expR").textContent=xp;
  $("#crystals").textContent=player.crystals||0;
  $("#gold").textContent=player.gold||0;
  $("#avatar").textContent=n.charAt(0).toUpperCase();
  $("#name2").textContent=n.toUpperCase();
  $("#rank2").textContent=info.rank;
  $("#level2").textContent=info.level;
  const nextRank = CodeRealm.RANKS.find(r=>r.minLevel>info.level);
  $("#nextRank2").textContent=nextRank ? nextRank.name : "RANGO MÁXIMO";
  $("#rankDesc2").textContent=CodeRealm.getRankInfo(info.rank).description;
  $("#exp2").textContent=xp;
  $("#xptext").textContent=`${xp} / ${next}`;
  $("#profilebar").style.width=pct+"%";
  $("#cr2").textContent=player.crystals||0;
  $("#go2").textContent=player.gold||0;
  $("#progress").textContent=`${done} / 2`;
  $("#percent").textContent=`${Math.round(done/2*100)}%`;
  $("#actbar").style.width=(done/2*100)+"%";

  const mission = !player.mission1Completed
    ? {number:1,title:"La llamada del código"}
    : !player.mission2Completed
      ? {number:2,title:"Consigue tu herramienta"}
      : null;

  if(mission){
    $("#start").textContent=done===0?"✦ COMENZAR AVENTURA":"▶ CONTINUAR AVENTURA";
    $(".mission-preview b").textContent=`Misión ${mission.number} · ${mission.title}`;
    $(".mission-preview span").textContent=done===0?"Tu primera misión te espera.":"Tu progreso está guardado. Continúa donde lo dejaste.";
  }else{
    $("#start").textContent="✓ ACTO I COMPLETADO · VER MAPA";
    $(".mission-preview b").textContent="Acto I completado";
    $(".mission-preview span").textContent="Revisa tus misiones o espera al siguiente acto.";
  }
}

$("#start").onclick=()=>window.location.href="act1-map.html";
$("#profile").onclick=()=>alert("El perfil completo lo construiremos en el siguiente módulo de CODE REALM.");
document.querySelectorAll(".menu-card").forEach(b=>b.onclick=()=>{
  const t=$("#tip");
  t.querySelector("p").innerHTML=`<b>Lyra dice:</b> ${b.dataset.msg}`;
});
document.querySelectorAll("[data-nav]").forEach(b=>b.onclick=e=>{
  e.preventDefault();
  if(b.dataset.nav==="Mapa") window.location.href="act1-map.html";
  else alert(`${b.dataset.nav}: próximamente.`);
});

CodeRealm.save(player);
render();
