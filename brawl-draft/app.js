// Logica del draft: stato, sequenza turni, punteggio suggerimenti, rendering.

const state = {
  bansPerTeam: 3, // Diamante+: ogni giocatore banna 1 brawler, 3 a squadra in 3v3
  pickPattern: ["A", "B", "B", "A", "A", "B"], // 3v3 standard "1-2-2-1"
  sequence: [], // array di {phase:'ban'|'pick', team:'A'|'B'}
  turnIndex: 0,
  bans: { A: [], B: [] },
  picks: { A: [], B: [] },
  filterClass: "ALL",
  search: "",
  mode: null, // una di MODES, o null = nessuna modalità selezionata
  mapTraits: new Set(), // sottoinsieme di MAP_TRAITS attivo
  map: null, // riferimento a un oggetto di MAPS, o null
  customScores: {}, // { nomeBrawler: winRatePercentuale }, incollati a mano dall'utente
  metaSource: "ALL_RANKS", // "ALL_RANKS" | "MASTERS", quale tabella di base usare (vedi data.js)
};

const META_STORAGE_KEY = "bsdraft_meta_raw_v1";
const META_SOURCE_STORAGE_KEY = "bsdraft_meta_source_v1";

function baseMetaScores() {
  return state.metaSource === "MASTERS" ? DEFAULT_META_SCORES_MASTERS : DEFAULT_META_SCORES;
}

// I valori della tabella di base scelta (vedi baseMetaScores) si applicano
// sempre, senza che l'utente debba incollare nulla. Quello che l'utente
// eventualmente incolla e salva (persistito in localStorage) si somma
// sopra, sovrascrivendo il default nome per nome dove i due coincidono.
function loadCustomScores() {
  let raw = "";
  try {
    raw = localStorage.getItem(META_STORAGE_KEY) || "";
    state.metaSource = localStorage.getItem(META_SOURCE_STORAGE_KEY) || "ALL_RANKS";
  } catch (e) {
    raw = "";
  }
  const { scores } = parseMetaText(raw);
  state.customScores = { ...baseMetaScores(), ...scores };
  return raw;
}

function saveMetaRaw(raw) {
  try {
    localStorage.setItem(META_STORAGE_KEY, raw);
  } catch (e) {
    // localStorage non disponibile (es. modalità privata): i dati restano solo per questa sessione
  }
}

function saveMetaSource(source) {
  state.metaSource = source;
  try {
    localStorage.setItem(META_SOURCE_STORAGE_KEY, source);
  } catch (e) {
    // localStorage non disponibile: la scelta vale solo per questa sessione
  }
}

// Parser tollerante: cerca in ogni riga un nome di brawler noto (parola intera,
// case-insensitive, i nomi più lunghi prima per evitare match parziali tipo
// "Bo" dentro "Bonnie") e il primo numero della riga (con o senza "%").
// Righe senza nome riconosciuto o senza numero vengono segnalate, non ignorate in silenzio.
function parseMetaText(text) {
  const scores = {};
  const unrecognized = [];
  const namesByLengthDesc = BRAWLERS.map((b) => b.name).sort((a, b) => b.length - a.length);

  const lines = text.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
  for (const line of lines) {
    let matchedName = null;
    for (const name of namesByLengthDesc) {
      const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(`(^|[^a-zA-Z0-9])${escaped}([^a-zA-Z0-9]|$)`, "i");
      if (re.test(line)) {
        matchedName = name;
        break;
      }
    }
    const numMatch = line.match(/(\d+(?:[.,]\d+)?)\s*%?/);
    if (matchedName && numMatch) {
      scores[matchedName] = parseFloat(numMatch[1].replace(",", "."));
    } else {
      unrecognized.push(line);
    }
  }
  return { scores, unrecognized };
}

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

function scoreCandidate(candidateName, candidateClass, ownClasses, enemyClasses) {
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

  let modeBonus = 0;
  if (state.mode && MODE_CLASS_BONUS[state.mode]) {
    modeBonus = MODE_CLASS_BONUS[state.mode][candidateClass] || 0;
  }

  let mapBonus = 0;
  for (const trait of state.mapTraits) {
    mapBonus += (MAP_TRAIT_CLASS_BONUS[trait] || {})[candidateClass] || 0;
  }
  if (state.map && state.map.bestPicks.includes(candidateName)) {
    mapBonus += 3; // pick esplicitamente segnalato come forte su questa mappa dalle fonti
  }

  let metaBonus = 0;
  if (state.customScores[candidateName] !== undefined) {
    metaBonus = (state.customScores[candidateName] - 50) / 10; // 60% -> +1, 70% -> +2, 40% -> -1...
  }

  const round2 = (n) => Math.round(n * 100) / 100;
  const total = round2(matchup * 2 + synergy + modeBonus * 2 + mapBonus + metaBonus);
  return { total, matchup, synergy, modeBonus, mapBonus, metaBonus: round2(metaBonus) };
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
    const s = scoreCandidate(b.name, b.class, ownClasses, enemyClasses);
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
    const tooltip = `matchup ${sign(s.matchup)} · sinergia ${sign(s.synergy)} · modalità ${sign(s.modeBonus)} · mappa ${sign(s.mapBonus)} · dati incollati ${sign(s.metaBonus)}`;
    row.innerHTML = `
      <span class="sugg-name">${s.name}</span>
      <span class="sugg-class">${s.class}</span>
      <span class="sugg-score" title="${tooltip}">${sign(s.total)}</span>
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

function populateMapSelect() {
  const mapSelect = document.getElementById("map-select");
  const mapsForMode = state.mode ? MAPS.filter((m) => m.mode === state.mode) : [];
  mapSelect.innerHTML = `<option value="">Nessuna / non elencata (usa i tratti)</option>`;
  for (const m of mapsForMode) {
    const opt = document.createElement("option");
    opt.value = m.name;
    opt.textContent = m.name;
    mapSelect.appendChild(opt);
  }
  mapSelect.disabled = mapsForMode.length === 0;
  state.map = null;
  renderMapNotes();
}

function renderMapNotes() {
  const el = document.getElementById("map-notes");
  if (!state.map) {
    el.textContent = "";
    el.hidden = true;
    return;
  }
  el.hidden = false;
  el.textContent = state.map.notes;
}

function initModeAndMap() {
  const modeSelect = document.getElementById("mode-select");
  modeSelect.innerHTML = `<option value="">Nessuna / generica</option>`;
  for (const m of MODES) {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = m;
    modeSelect.appendChild(opt);
  }
  modeSelect.addEventListener("change", (e) => {
    state.mode = e.target.value || null;
    populateMapSelect();
    renderSuggestions();
  });

  const mapSelect = document.getElementById("map-select");
  mapSelect.addEventListener("change", (e) => {
    const found = MAPS.find((m) => m.mode === state.mode && m.name === e.target.value);
    state.map = found || null;
    renderMapNotes();
    renderSuggestions();
  });
  populateMapSelect();

  const traitsEl = document.getElementById("map-traits");
  traitsEl.innerHTML = "";
  for (const t of MAP_TRAITS) {
    const chip = document.createElement("label");
    chip.className = "trait-chip";
    chip.innerHTML = `<input type="checkbox" value="${t}" /> ${t}`;
    chip.querySelector("input").addEventListener("change", (e) => {
      if (e.target.checked) state.mapTraits.add(t);
      else state.mapTraits.delete(t);
      renderSuggestions();
    });
    traitsEl.appendChild(chip);
  }
}

function renderMetaStatus(unrecognized) {
  const el = document.getElementById("meta-status");
  const defaultCount = Object.keys(baseMetaScores()).length;
  const totalCount = Object.keys(state.customScores).length;
  const pastedText = (document.getElementById("meta-input").value || "").trim();
  const sourceLabel = META_SOURCE_LABELS[state.metaSource] || META_SOURCE_LABELS.ALL_RANKS;
  let msg = `${defaultCount} brawler già inclusi di base — fonte: ${sourceLabel}.`;
  if (pastedText.length > 0) {
    msg += ` ${totalCount} in totale contando quelli che hai incollato/corretto tu.`;
  }
  if (unrecognized && unrecognized.length > 0) {
    msg += ` ${unrecognized.length} riga/e non capite: ${unrecognized.slice(0, 3).join(" | ")}${unrecognized.length > 3 ? "…" : ""}`;
  }
  el.textContent = msg;
}

function initMetaPanel() {
  const textarea = document.getElementById("meta-input");
  const sourceSelect = document.getElementById("meta-source-select");
  const raw = loadCustomScores();
  textarea.value = raw;
  sourceSelect.value = state.metaSource;
  renderMetaStatus(null);

  sourceSelect.addEventListener("change", (e) => {
    saveMetaSource(e.target.value);
    const { scores } = parseMetaText(textarea.value);
    state.customScores = { ...baseMetaScores(), ...scores };
    renderMetaStatus(null);
    renderSuggestions();
  });

  document.getElementById("meta-save").addEventListener("click", () => {
    const text = textarea.value;
    const { scores, unrecognized } = parseMetaText(text);
    state.customScores = { ...baseMetaScores(), ...scores };
    saveMetaRaw(text);
    renderMetaStatus(unrecognized);
    renderSuggestions();
  });

  document.getElementById("meta-clear").addEventListener("click", () => {
    textarea.value = "";
    state.customScores = { ...baseMetaScores() };
    saveMetaRaw("");
    renderMetaStatus(null);
    renderSuggestions();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initFilters();
  initModeAndMap();
  initMetaPanel();
  buildSequence();
  render();

  document.getElementById("apply-config").addEventListener("click", applyConfig);
  document.getElementById("undo-btn").addEventListener("click", undoLast);
  document.getElementById("reset-btn").addEventListener("click", resetDraft);
});
