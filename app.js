const STORAGE_KEY = "codeRealmPlayer";

const defaults = {
  name: "",
  rank: "NOVATO",
  level: 1,
  exp: 0,
  crystals: 0,
  gold: 0,
  xpNext: 100,
  introSeen: false
};

let player = {...defaults, ...(JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || {})};

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
}

function render() {
  const name = player.name || "AVENTURERO";
  document.querySelector("#playerNameTop").textContent = name.toUpperCase();
  document.querySelector("#welcomeName").textContent = name.toUpperCase();
  document.querySelector("#rankTop").textContent = player.rank;
  document.querySelector("#levelTop").textContent = player.level;
  document.querySelector("#xpTop").textContent = player.exp;
  document.querySelector("#xpNextTop").textContent = player.xpNext;
  document.querySelector("#expResource").textContent = player.exp;
  document.querySelector("#crystalsResource").textContent = player.crystals;
  document.querySelector("#goldResource").textContent = player.gold;
  document.querySelector("#xpBarTop").style.width = `${Math.min(100, (player.exp / player.xpNext) * 100)}%`;
}

document.querySelector("#startAdventure").addEventListener("click", () => {
  if (!player.name) {
    const name = prompt("¿Con quién tengo el gusto de aprender hoy?");
    if (!name || !name.trim()) return;
    player.name = name.trim();
    player.introSeen = true;
    save();
    render();
  }

  window.location.href = "act1.html";
});

render();
