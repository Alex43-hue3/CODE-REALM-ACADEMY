/* CODE REALM — SISTEMA CENTRAL DE PROGRESIÓN
   Un solo sistema para EXP, niveles, rangos y progreso.
*/
(function(){
  const KEY = "codeRealmPlayer";

  const LEVELS = [
    { level: 1, min: 0,    rank: "NOVATO" },
    { level: 2, min: 100,  rank: "NOVATO" },
    { level: 3, min: 250,  rank: "APRENDIZ" },
    { level: 4, min: 450,  rank: "APRENDIZ" },
    { level: 5, min: 700,  rank: "APRENDIZ" },
    { level: 6, min: 1000, rank: "OFICIAL ARTESANO" },
    { level: 7, min: 1400, rank: "OFICIAL ARTESANO" },
    { level: 8, min: 1850, rank: "OFICIAL ARTESANO" },
    { level: 9, min: 2350, rank: "OFICIAL ARTESANO" },
    { level: 10,min: 3000, rank: "MAESTRO ARQUITECTO" }
  ];

  const RANKS = [
    { name: "NOVATO", minLevel: 1, description: "Estás comenzando tu aventura. Aprenderás las bases y perderás el miedo al código." },
    { name: "APRENDIZ", minLevel: 3, description: "Ya dominas las primeras herramientas y comienzas a construir por tu cuenta." },
    { name: "OFICIAL ARTESANO", minLevel: 6, description: "Puedes construir proyectos con mayor independencia y resolver retos más complejos." },
    { name: "MAESTRO ARQUITECTO", minLevel: 10, description: "Dominas las bases y estás preparado para diseñar soluciones completas." }
  ];

  const defaults = {
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
    mission1Step: 0,
    mission2Step: 0
  };

  function load(){
    let stored = {};
    try { stored = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch(e) {}
    return {...defaults, ...stored};
  }

  function getLevelInfo(exp){
    exp = Math.max(0, Number(exp) || 0);
    let current = LEVELS[0];
    let next = LEVELS[1];
    for(let i=0;i<LEVELS.length;i++){
      if(exp >= LEVELS[i].min){
        current = LEVELS[i];
        next = LEVELS[i+1] || null;
      } else break;
    }
    const base = current.min;
    const target = next ? next.min : current.min + 1000;
    const progress = next ? ((exp-base)/(target-base))*100 : 100;
    return { level: current.level, rank: current.rank, nextLevel: next ? next.level : current.level, nextExp: target, progress: Math.max(0,Math.min(100,progress)) };
  }

  function normalize(player){
    const info = getLevelInfo(player.exp);
    player.level = info.level;
    player.rank = info.rank;
    player.xpNext = info.nextExp;
    player.act1Total = 2;
    player.act1Completed = Number(!!player.mission1Completed) + Number(!!player.mission2Completed);
    return player;
  }

  function save(player){
    normalize(player);
    localStorage.setItem(KEY, JSON.stringify(player));
    return player;
  }

  function awardExp(player, amount){
    const before = getLevelInfo(player.exp);
    player.exp = Math.max(0, Number(player.exp)||0) + Math.max(0, Number(amount)||0);
    const after = getLevelInfo(player.exp);
    normalize(player);
    save(player);
    return {
      amount: Math.max(0, Number(amount)||0),
      leveledUp: after.level > before.level,
      oldLevel: before.level,
      newLevel: after.level,
      oldRank: before.rank,
      newRank: after.rank,
      rankUp: after.rank !== before.rank
    };
  }

  function getRankInfo(rank){
    return RANKS.find(r=>r.name===rank) || RANKS[0];
  }

  window.CodeRealm = {KEY, LEVELS, RANKS, load, save, normalize, getLevelInfo, awardExp, getRankInfo};
})();
