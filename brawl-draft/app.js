// Logica del draft: stato, sequenza turni, punteggio suggerimenti, rendering.

const state = {
  bansPerTeam: 1,
  pickPattern: ["A", "B", "B", "A", "A", "B"], // 3v3 standard "1-2-2-1"
  sequence: [], // array di {phase:'ban'|'pick', team:'A'|'B'}
  turnIndex: 0,
  bans: { A: [], B: [] },
  picks: { A: [], B: [] },
  filterClass: "ALL",
  search: "",
};

function buildSequence() {
  const seq = [];
  for (let i = 0; i < state.bansPerTeam; i++) {
    seq.push({ phase: "ban", team: "A" });
    seq.push({ phase: "ban", team: "B" });
  }
  for (const team of state.pickPattern) {
    seq.push({ phase: "pick", team });
  }
  state.sequence = seq;
  state.turnIndex = 0;
}

function usedNames() {
  return new Set([
    ...state.bans.A,
    ...state.bans.B,
    ...state.picks.A,
    ...state.picks.B,
  ]);
}

function currentTurn() {
  return state.sequence[state.turnIndex] || null;
}

function classOf(name) {
  const b = BRAWLERS.find((x) => x.name === name);
  return b ? b.class : null;
}

function scoreCandidate(candidateClass, ownClasses, enemyClasses) {
  let matchup = 0;
  for (const ec of enemyClasses) {
    matchup += CLASS_MATCHUPS[candidateClass][ec] || 0;
  }

  const sameClassCount = ownClasses.filter((c) => c === candidateClass).length;
  let synergy = -sameClassCount; // scoraggia 3x la stessa classe

  const hasFrontline = ownClasses.some((c) => c === "Tank" || c === "Controller");
  if (!hasFrontline && (candidateClass === "Tank" || candidateClass === "Controller")) {
    synergy += 1;
  }
  const hasSupport = ownClasses.some((c) => c === "Support");
  if (!hasSupport && candidateClass === "Support" && ownClasses.length >= 1) {
    synergy += 0.5;
  }

  return { total: matchup * 2 + synergy, matchup, synergy };
}

function computeSuggestions() {
  const turn = currentTurn();
  if (!turn || turn.phase !== "pick") return [];

  const used = usedNames();
  const own = turn.team;
  const enemy = own === "A" ? "B" : "A";
  const ownClasses = state.picks[own].map(classOf);
  const enemyClasses = state.picks[enemy].map(classOf);

  const candidates = BRAWLERS.filter((b) => !used.has(b.name)).map((b) => {
    const s = scoreCandidate(b.class, ownClasses, enemyClasses);
    return { name: b.name, class: b.class, ...s };
  });

  candidates.sort((a, b) => b.total - a.total);
  return candidates.slice(0, 8);
}

function pickOrBan(name) {
  const turn = currentTurn();
  if (!turn) return;
  const used = usedNames();
  if (used.has(name)) return;

  if (turn.phase === "ban") {
    state.bans[turn.team].push(name);
  } else {
    state.picks[turn.team].push(name);
  }
  state.turnIndex++;
  render();
}

function undoLast() {
  if (state.turnIndex === 0) return;
  state.turnIndex--;
  const turn = state.sequence[state.turnIndex];
  if (turn.phase === "ban") {
    state.bans[turn.team].pop();
  } else {
    state.picks[turn.team].pop();
  }
  render();
}

function resetDraft() {
  state.bans = { A: [], B: [] };
  state.picks = { A: [], B: [] };
  buildSequence();
  render();
}

function applyConfig() {
  const bansInput = document.getElementById("bans-per-team");
  const patternInput = document.getElementById("pick-pattern");
  state.bansPerTeam = Math.max(0, Math.min(3, parseInt(bansInput.value, 10) || 0));
  const pattern = patternInput.value
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter((s) => s === "A" || s === "B");
  if (pattern.length > 0) state.pickPattern = pattern;
  resetDraft();
}

function slotLabel(team, phase, idx) {
  return `${team === "A" ? "Blu" : "Rossa"} · ${phase === "ban" ? "Ban" : "Pick"} ${idx + 1}`;
}

function renderSlots(team) {
  const bansEl = document.getElementById(`bans-${team}`);
  const picksEl = document.getElementById(`picks-${team}`);
  bansEl.innerHTML = "";
  picksEl.innerHTML = "";

  const totalBans = state.sequence.filter((s) => s.phase === "ban" && s.team === team).length;
  const totalPicks = state.sequence.filter((s) => s.phase === "pick" && s.team === team).length;

  for (let i = 0; i < totalBans; i++) {
    const name = state.bans[team][i];
    bansEl.appendChild(makeSlot(name, "ban"));
  }
  for (let i = 0; i < totalPicks; i++) {
    const name = state.picks[team][i];
    picksEl.appendChild(makeSlot(name, "pick"));
  }
}

function makeSlot(name, phase) {
  const div = document.createElement("div");
  div.className = "slot " + (name ? "filled" : "empty") + " " + phase;
  if (name) {
    const cls = classOf(name);
    div.style.borderColor = CLASS_COLORS[cls] || "#666";
    div.innerHTML = `<span class="slot-name">${name}</span><span class="slot-class">${cls || ""}</span>`;
  } else {
    div.innerHTML = `<span class="slot-placeholder">${phase === "ban" ? "ban" : "pick"}</span>`;
  }
  return div;
}

function renderTurnBanner() {
  const el = document.getElementById("turn-banner");
  const turn = currentTurn();
  if (!turn) {
    el.textContent = "Draft completato.";
    el.className = "turn-banner done";
    return;
  }
  const teamName = turn.team === "A" ? "Squadra Blu" : "Squadra Rossa";
  const phaseName = turn.phase === "ban" ? "banna" : "sceglie";
  el.textContent = `Turno: ${teamName} ${phaseName} un brawler`;
  el.className = "turn-banner active " + (turn.team === "A" ? "team-a" : "team-b");
}

function renderGrid() {
  const grid = document.getElementById("brawler-grid");
  grid.innerHTML = "";
  const used = usedNames();
  const turn = currentTurn();

  const list = BRAWLERS.filter((b) => {
    if (state.filterClass !== "ALL" && b.class !== state.filterClass) return false;
    if (state.search && !b.name.toLowerCase().includes(state.search.toLowerCase())) return false;
    return true;
  });

  for (const b of list) {
    const card = document.createElement("div");
    const isUsed = used.has(b.name);
    card.className = "brawler-card" + (isUsed ? " used" : "");
    card.style.borderColor = CLASS_COLORS[b.class] || "#666";
    card.innerHTML = `<div class="brawler-name">${b.name}</div><div class="brawler-class">${b.class}</div>`;
    if (!isUsed && turn) {
      card.classList.add("clickable");
      card.title = turn.phase === "ban" ? "Clicca per bannare" : "Clicca per scegliere";
      card.addEventListener("click", () => pickOrBan(b.name));
    }
    grid.appendChild(card);
  }
}

function renderSuggestions() {
  const el = document.getElementById("suggestions");
  const turn = currentTurn();
  if (!turn || turn.phase !== "pick") {
    el.innerHTML = `<p class="hint">I suggerimenti compaiono durante la fase di pick.</p>`;
    return;
  }
  const suggestions = computeSuggestions();
  if (suggestions.length === 0) {
    el.innerHTML = `<p class="hint">Nessun candidato disponibile.</p>`;
    return;
  }
  el.innerHTML = "";
  for (const s of suggestions) {
    const row = document.createElement("div");
    row.className = "suggestion-row";
    row.style.borderColor = CLASS_COLORS[s.class] || "#666";
    const sign = (n) => (n > 0 ? "+" + n : String(n));
    row.innerHTML = `
      <span class="sugg-name">${s.name}</span>
      <span class="sugg-class">${s.class}</span>
      <span class="sugg-score" title="matchup ${sign(s.matchup)} · sinergia ${sign(s.synergy)}">${sign(s.total)}</span>
    `;
    row.addEventListener("click", () => pickOrBan(s.name));
    el.appendChild(row);
  }
}

function render() {
  renderTurnBanner();
  renderSlots("A");
  renderSlots("B");
  renderGrid();
  renderSuggestions();
  document.getElementById("undo-btn").disabled = state.turnIndex === 0;
}

function initFilters() {
  const classSelect = document.getElementById("class-filter");
  classSelect.innerHTML = `<option value="ALL">Tutte le classi</option>`;
  for (const c of CLASSES) {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    classSelect.appendChild(opt);
  }
  classSelect.addEventListener("change", (e) => {
    state.filterClass = e.target.value;
    renderGrid();
  });

  document.getElementById("search-box").addEventListener("input", (e) => {
    state.search = e.target.value;
    renderGrid();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initFilters();
  buildSequence();
  render();

  document.getElementById("apply-config").addEventListener("click", applyConfig);
  document.getElementById("undo-btn").addEventListener("click", undoLast);
  document.getElementById("reset-btn").addEventListener("click", resetDraft);
});
