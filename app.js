const STORAGE_KEY = "codeRealmPlayer";

const defaults = {
  name: "",
  rank: "NOVATO",
  level: 1,
  exp: 0,
  crystals: 0,
  gold: 0,
  xpNext: 100,
  introSeen: false,
  diagnostic: {
    experience: null,
    goal: null,
    time: null
  }
};

let player = {...defaults, ...(JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || {})};
player.diagnostic = {...defaults.diagnostic, ...(player.diagnostic || {})};

const $ = (s) => document.querySelector(s);

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
}

function render() {
  const name = player.name || "AVENTURERO";
  $("#playerNameTop").textContent = name.toUpperCase();
  $("#welcomeName").textContent = name.toUpperCase();
  $("#rankTop").textContent = player.rank;
  $("#levelTop").textContent = player.level;
  $("#xpTop").textContent = player.exp;
  $("#xpNextTop").textContent = player.xpNext;
  $("#expResource").textContent = player.exp;
  $("#crystalsResource").textContent = player.crystals;
  $("#goldResource").textContent = player.gold;
  $("#xpBarTop").style.width = `${Math.min(100, (player.exp / player.xpNext) * 100)}%`;
  $("#avatarMini").textContent = name.charAt(0).toUpperCase() || "?";

  if (player.introSeen && player.name) {
    $("#welcomeQuestion").textContent = "¿LISTO PARA CONTINUAR TU AVENTURA?";
    $("#startAdventure").innerHTML = "<span>✦</span> CONTINUAR AVENTURA";
  }
}

const overlay = $("#introOverlay");
const title = $("#introTitle");
const text = $("#introText");
const step = $("#introStep");
const next = $("#introNext");

let introStep = 0;

function openIntro() {
  introStep = player.name ? 3 : 0;
  overlay.classList.add("active");
  renderIntro();
}

function closeIntro() {
  if (!player.introSeen) return;
  overlay.classList.remove("active");
}

function renderIntro() {
  if (introStep === 0) {
    title.textContent = "Hola, aventurero.";
    text.textContent = "Mi nombre es Lyra. ¿Con quién tengo el gusto de aprender hoy?";
    step.innerHTML = `
      <label class="field-label" for="playerName">TU NOMBRE</label>
      <input id="playerName" class="text-input" type="text" maxlength="20"
             placeholder="Escribe tu nombre..." autocomplete="name">
    `;
    next.textContent = "CONOCER A LYRA";
    return;
  }

  if (introStep === 1) {
    title.textContent = `Mucho gusto, ${player.name}.`;
    text.textContent = "Antes de comenzar, quiero conocerte un poco. No hay respuestas correctas o incorrectas.";
    step.innerHTML = `
      <div class="question-label">¿HAS PROGRAMADO ANTES?</div>
      <div class="choice-grid">
        <button class="choice" data-value="never">Nunca</button>
        <button class="choice" data-value="seen">He visto algo</button>
        <button class="choice" data-value="some">Sé un poco</button>
      </div>
    `;
    next.textContent = "CONTINUAR";
    bindChoices("experience");
    return;
  }

  if (introStep === 2) {
    title.textContent = "Perfecto.";
    text.textContent = "Quiero ayudarte a llegar a un proyecto real. ¿Qué te gustaría conseguir aprendiendo programación?";
    step.innerHTML = `
      <div class="question-label">¿QUÉ TE MOTIVA MÁS?</div>
      <div class="choice-grid">
        <button class="choice" data-value="web">Crear páginas web</button>
        <button class="choice" data-value="apps">Crear aplicaciones</button>
        <button class="choice" data-value="games">Crear videojuegos</button>
      </div>
    `;
    next.textContent = "CONTINUAR";
    bindChoices("goal");
    return;
  }

  if (introStep === 3) {
    title.textContent = `Entonces, ${player.name}...`;
    text.textContent = "Última pregunta. Tu ruta se adaptará a tu ritmo.";
    step.innerHTML = `
      <div class="question-label">¿CUÁNTO TIEMPO QUIERES PRACTICAR?</div>
      <div class="choice-grid">
        <button class="choice" data-value="short">15–20 min</button>
        <button class="choice" data-value="medium">30–45 min</button>
        <button class="choice" data-value="long">1 hora o más</button>
      </div>
    `;
    next.textContent = "ENTRAR AL REINO";
    bindChoices("time");
  }
}

function bindChoices(key) {
  document.querySelectorAll(".choice").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".choice").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      player.diagnostic[key] = btn.dataset.value;
      save();
    });
  });
}

next.addEventListener("click", () => {
  if (introStep === 0) {
    const input = $("#playerName");
    if (!input || !input.value.trim()) {
      input?.focus();
      return;
    }
    player.name = input.value.trim();
    introStep = 1;
    save();
    render();
    renderIntro();
    return;
  }

  if (introStep === 1 && !player.diagnostic.experience) return;
  if (introStep === 2 && !player.diagnostic.goal) return;

  if (introStep === 3) {
    if (!player.diagnostic.time) return;
    player.introSeen = true;
    save();
    render();
    overlay.classList.remove("active");
    return;
  }

  introStep++;
  renderIntro();
});

$("#startAdventure").addEventListener("click", () => {
  if (!player.introSeen || !player.name) {
    openIntro();
    return;
  }
  window.location.href = "act1.html";
});

$("#introClose").addEventListener("click", closeIntro);

render();

if (!player.introSeen || !player.name) {
  openIntro();
}
