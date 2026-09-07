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
  gridOrder: "score", // "score" | "played" | "az" | "class" — vedi renderGrid
  mode: null, // una di MODES, o null = nessuna modalità selezionata
  mapTraits: new Set(), // sottoinsieme di MAP_TRAITS attivo
  map: null, // riferimento a un oggetto di MAPS, o null
  customScores: {}, // { nomeBrawler: winRatePercentuale }, incollati a mano dall'utente
  metaSource: "ALL_RANKS", // "ALL_RANKS" | "MASTERS", quale tabella di base usare (vedi data.js)
  firstTeam: "A", // chi muove per primo: in Classificata cambia a ogni partita, quindi si sceglie
  myTeam: "A", // in quale squadra gioco io: serve a filtrare i MIEI pick sui brawler che posso schierare
  minPower: 9, // 9 = fino a Diamante, 11 = da Mythic in su. Sotto questa soglia il brawler non è schierabile
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
  setCustomScores({ ...baseMetaScores(), ...scores });
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

// Chi inizia non è fisso: in Classificata cambia da partita a partita, e
// sbagliare il lato fa slittare tutti i turni di una posizione, cioè rende
// sbagliato ogni suggerimento successivo. Se tocca prima alla Rossa, si
// specchia l'intera sequenza invece di ricostruirla a mano.
function buildSequence() {
  const flip = (t) => (state.firstTeam === "B" ? (t === "A" ? "B" : "A") : t);
  const seq = [];
  for (let i = 0; i < state.bansPerTeam; i++) {
    seq.push({ phase: "ban", team: flip("A") });
    seq.push({ phase: "ban", team: flip("B") });
  }
  for (const team of state.pickPattern) {
    seq.push({ phase: "pick", team: flip(team) });
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

// Quanto fidarsi dei dati di una mappa: due cose diverse la rovinano.
// Dati vecchi (la mappa non è in rotazione da settimane, quindi le sue
// win rate sono di prima degli ultimi riequilibri) e campione piccolo.
// Restituisce 0..1, usato per pesare il bonus mappa invece di trattare
// allo stesso modo 1,5 milioni di partite di ieri e 10mila di un mese fa.
// La curva della freschezza è stata resa più ripida il 6/9: prima un dato
// di 44 giorni pesava ancora 0,5, cioè metà. Ma fra un riequilibrio e
// l'altro passano poche settimane, e una win rate di prima di un
// riequilibrio non è "mezza vera", è di un altro gioco. Ora un dato di più
// di due mesi conta un ottavo, e il ripiego (modalità) prende il resto.
function mapConfidence(map) {
  if (!map || !map.winRates || !map.updated) return 0;
  const days = (Date.now() - new Date(map.updated + "T00:00:00Z").getTime()) / 86400000;
  const freshness = days <= 2 ? 1 : days <= 7 ? 0.9 : days <= 21 ? 0.7 : days <= 35 ? 0.45 : days <= 60 ? 0.25 : 0.12;
  const size = map.sample >= 500000 ? 1 : map.sample >= 100000 ? 0.9 : map.sample >= 30000 ? 0.75 : 0.6;
  return freshness * size;
}

// Quanto spesso questo brawler viene davvero scelto QUI. La fonte delle
// mappe dà la pick rate per mappa: somma 600% sui 106 brawler (6 pick per
// partita), mentre USE_RATES globale somma 100% (una quota per slot).
// Diviso 6 le due scale coincidono — verificato: media 0,944% entrambe.
function useRateOf(name) {
  const pr = state.map && state.map.pickRates ? state.map.pickRates[name] : undefined;
  // Arrotondato qui e non a schermo: la divisione per 6 produce code infinite
  // (6,783333...%) e il numero finiva così com'era nell'etichetta.
  if (pr !== undefined) return { use: Math.round((pr / 6) * 100) / 100, source: "mappa" };
  if (USE_RATES[name] !== undefined) return { use: USE_RATES[name], source: "meta" };
  return { use: 0.3, source: "nessun dato" };
}

function confidenceLabel(conf) {
  if (conf >= 0.85) return "alta";
  if (conf >= 0.6) return "media";
  if (conf > 0) return "bassa";
  return "nessun dato";
}

// Minaccia = quanto forte è un brawler sul contesto più specifico che
// conosciamo (mappa > modalità > meta generale). Usata per suggerire i ban.
function threatOf(name) {
  if (state.map && state.map.winRates && state.map.winRates[name] !== undefined) {
    return { value: state.map.winRates[name], source: "mappa" };
  }
  if (state.mode && MODE_WIN_RATES[state.mode] && MODE_WIN_RATES[state.mode][name] !== undefined) {
    return { value: MODE_WIN_RATES[state.mode][name], source: "modalità" };
  }
  if (state.customScores[name] !== undefined) {
    return { value: state.customScores[name], source: "meta" };
  }
  return null;
}

// Etichetta un brawler confrontando la sua POSIZIONE per win rate con la
// sua POSIZIONE per quante volte viene scelto. Il confronto per posizione
// invece che per soglie fisse evita il problema opposto: con soglie secche
// Wendy (58,3% di vittorie ma solo 1,40% di scelte) non veniva segnalata,
// pur essendo il sottovalutato da manuale — prima per forza, ventitreesima
// per popolarità, quindi quasi mai bannata.
//  - "sottovalutato": molto più in alto per vittorie che per scelte, ED è
//    davvero forte (>=52%). Senza quest'ultima condizione finirebbero in
//    lista brawler solo impopolari, non buoni.
//  - "trappola": molto più scelto di quanto meriti, e sotto il 50%.
// Entrambi usano la win rate generale in Classificata, la stessa
// popolazione da cui viene la use rate: confrontare numeri omogenei.
let _rankCache = null;

// Unico punto in cui si riscrive customScores, così la cache dei ranking
// non può restare indietro rispetto ai dati (succedeva incollando valori
// propri: la fascia non cambiava e la cache non veniva invalidata).
function setCustomScores(scores) {
  state.customScores = scores;
  _rankCache = null;
}

function pickRanks() {
  if (_rankCache) return _rankCache;
  const rows = Object.keys(state.customScores)
    .filter((n) => USE_RATES[n] !== undefined)
    .map((n) => ({ n, wr: state.customScores[n], use: USE_RATES[n] }));
  [...rows].sort((a, b) => b.wr - a.wr).forEach((r, i) => (r.wrRank = i + 1));
  [...rows].sort((a, b) => b.use - a.use).forEach((r, i) => (r.useRank = i + 1));
  _rankCache = new Map(rows.map((r) => [r.n, r]));
  return _rankCache;
}

function pickFlag(name) {
  const r = pickRanks().get(name);
  if (!r) return null;
  const gap = r.useRank - r.wrRank;
  if (gap >= 18 && r.wr >= 52) return { kind: "sleeper", use: r.use, wr: r.wr, gap };
  if (gap <= -30 && r.wr < 50) {
    // "Trappola" parla del meta generale. Se su QUESTA mappa il dato misurato
    // dice che è forte, l'etichetta contraddirebbe il consiglio a fianco
    // (Trunk è debole in generale a Masters ma vince il 68,4% qui). Fra un
    // dato specifico e uno generale vince il primo, quindi si tace.
    if (contextualWinRate(name).base >= 55) return null;
    return { kind: "trap", use: r.use, wr: r.wr, gap };
  }
  return null;
}

// Un ban serve a togliere dal tavolo qualcosa che l'avversario userebbe
// davvero: bannare il brawler più forte in assoluto che però prende lo
// 0,05% dei giocatori è un ban buttato. Quindi la priorità mescola forza
// (nel contesto più specifico che abbiamo) e probabilità di essere scelto.
// Punteggio dell'ultimo giro, per nome. Lo riempiono computeSuggestions e
// computeBanSuggestions; lo legge la griglia.
let _classifica = new Map();

function computeBanSuggestions() {
  const used = usedNames();
  const candidates = [];
  for (const b of BRAWLERS) {
    if (used.has(b.name)) continue;
    const t = threatOf(b.name);
    if (!t) continue;
    const u = useRateOf(b.name);
    const use = u.use;
    // Forza e popolarità vanno moltiplicate solo se parlano della stessa
    // popolazione. Prima la pick rate era solo globale, quindi su una mappa
    // specifica il suo peso andava quasi azzerato: era un ripiego, e si
    // vedeva (un brawler fortissimo su una mappa ma raro in generale
    // finiva dietro a brawler molto più deboli lì). Ora la pick rate è
    // della mappa, misurata sulle stesse partite della win rate, e quando
    // le due combaciano il peso torna pieno.
    const popWeight = u.source === "mappa" && t.source === "mappa" ? 1 : t.source === "mappa" ? 0.25 : t.source === "modalità" ? 0.6 : 1;
    const popularity = 1 + (Math.min(use, 4.5) / 3) * popWeight;
    const priority = (t.value - 50) * popularity;
    candidates.push({
      name: b.name, class: b.class, wr: t.value, source: t.source,
      use, priority: Math.round(priority * 10) / 10,
    });
  }
  candidates.sort((a, b) => b.priority - a.priority);
  _classifica = new Map(candidates.map((c) => [c.name, c.wr]));
  return candidates.slice(0, 6);
}

// Percentuale di vittorie di A contro B, se misurata. Le coppie valgono in
// entrambi i versi: se B contro A fa 30%, allora A contro B fa 70%.
function rawMatchup(a, b) {
  if (MATCHUPS[a] && MATCHUPS[a][b] !== undefined) return MATCHUPS[a][b];
  if (MATCHUPS[b] && MATCHUPS[b][a] !== undefined) return 100 - MATCHUPS[b][a];
  return null;
}

// Il matchup VERO, tolta la parte spiegata dalla sola differenza di forza
// (vedi il commento sopra MATCHUPS in data.js). Positivo = A se la cava
// contro B meglio di quanto la differenza di forza farebbe prevedere.
// Restituisce null quando la coppia non è stata misurata: in quel caso chi
// chiama ricade sull'euristica di classe, invece di fingere di sapere.
function matchupEdge(a, b) {
  const actual = rawMatchup(a, b);
  if (actual === null) return null;
  const oa = BRAWLER_OVERALL[a];
  const ob = BRAWLER_OVERALL[b];
  if (oa === undefined || ob === undefined) return null;
  return actual - (50 + (oa - ob));
}

// Stima per le coppie mai misurate — cioè il 95% delle combinazioni, visto
// che nessuna fonte pubblica la matrice completa. Usa la media dei residui
// veri osservati fra quelle due classi (vedi CLASS_EDGE in data.js).
// Il fattore 0,5 è una correzione deliberata: le coppie misurate sono gli
// ESTREMI di ogni brawler, quindi le medie per classe sono più marcate di
// quanto sarebbero su un campione casuale. Dimezzarle è il modo prudente di
// usarle — meglio sottostimare un vantaggio che inventarne uno.
const CLASS_EDGE_SHRINK = 0.5;
function classEdge(ca, cb) {
  const row = CLASS_EDGE[ca];
  const v = row ? row[cb] : undefined;
  if (v !== null && v !== undefined) return v * CLASS_EDGE_SHRINK;
  // Cella senza abbastanza osservazioni: invece di arrendersi a zero si usa
  // il modello additivo sui margini (vedi data.js), che copre ogni coppia.
  const atk = CLASS_MARGIN_ATTACK[ca];
  const def = CLASS_MARGIN_DEFEND[cb];
  if (atk === undefined || def === undefined) return 0;
  return (atk + def) * CLASS_EDGE_SHRINK;
}

// Percentuale di vittorie prevista di A contro B, sempre disponibile.
// Quando la coppia è stata misurata è il numero vero; altrimenti è la
// previsione: differenza di forza generale più il vantaggio di classe
// calibrato. Torna anche `measured` perché la differenza fra un dato e una
// previsione deve restare visibile, non sparire dentro una percentuale.
function predictedWinRate(a, b) {
  const measured = rawMatchup(a, b);
  if (measured !== null) return { wr: measured, measured: true };
  const oa = BRAWLER_OVERALL[a];
  const ob = BRAWLER_OVERALL[b];
  const gap = oa !== undefined && ob !== undefined ? oa - ob : 0;
  const wr = 50 + gap + classEdge(classOf(a), classOf(b));
  return { wr: Math.max(5, Math.min(95, wr)), measured: false };
}

// Il punteggio è espresso in PERCENTUALE DI VITTORIE STIMATA, non in punti
// astratti. Tutti i pezzi che lo compongono erano già in punti percentuali
// di win rate: sommarli direttamente, invece di dividerli per dieci e
// pesarli a mano, dà un numero che si legge senza spiegazioni — "questo
// pick, qui, contro di loro, vince circa il 64% delle volte".
//
// La base è il contesto più specifico che conosciamo. Quando la mappa ha
// dati ma poco affidabili (campione piccolo o vecchi), non si scarta né si
// prende per buona: si MISCELA con il dato più generale in proporzione
// all'affidabilità, che è il modo corretto di usare una misura incerta.
// Quanto vale un brawler QUI, prima di guardare gli avversari: la win rate
// del contesto più specifico disponibile. Estratta a parte perché serve sia
// al punteggio sia all'analisi del rischio, e le due devono usare la stessa
// base — altrimenti un brawler senza dati sembrerebbe solido in un posto e
// mediocre nell'altro.
function contextualWinRate(name) {
  const metaWr = state.customScores[name];
  const modeWr = state.mode && MODE_WIN_RATES[state.mode] ? MODE_WIN_RATES[state.mode][name] : undefined;
  const mapWr = state.map && state.map.winRates ? state.map.winRates[name] : undefined;

  const fallback = modeWr !== undefined ? modeWr : metaWr !== undefined ? metaWr : 50;
  let base = fallback;
  let source = modeWr !== undefined ? "modalità" : metaWr !== undefined ? "meta" : "nessun dato";
  if (mapWr !== undefined) {
    const conf = mapConfidence(state.map);
    base = mapWr * conf + fallback * (1 - conf);
    source = "mappa";
  } else if (state.map && state.map.bestPicks && state.map.bestPicks.includes(name)) {
    base += 2; // citato dalle fonti come forte qui, ma senza numero: spinta piccola
  }
  return { base, source };
}

function scoreCandidate(candidateName, candidateClass, ownClasses, enemyClasses, enemyNames) {
  const ctx = contextualWinRate(candidateName);
  const base = ctx.base;
  const baseSource = ctx.source;

  // Contro chi è già schierato: media dei matchup, in punti di win rate.
  const names = enemyNames || [];
  const perEnemy = names.map((en) => {
    const p = predictedWinRate(candidateName, en);
    const oa = BRAWLER_OVERALL[candidateName];
    const ob = BRAWLER_OVERALL[en];
    const expected = oa !== undefined && ob !== undefined ? 50 + (oa - ob) : 50;
    return { enemy: en, wr: Math.round(p.wr * 10) / 10, edge: p.wr - expected, measured: p.measured };
  });
  const matchupAvg = perEnemy.length
    ? perEnemy.reduce((s, p) => s + p.edge, 0) / perEnemy.length
    : 0;

  // Composizione: tre volte la stessa classe è fragile, e una squadra senza
  // frontline o senza cure lo paga. Valori piccoli, in punti di win rate.
  // I bonus di composizione hanno senso solo se una squadra c'è già. Al primo
  // pick "manca la frontline" è vero per definizione, e dare +2 a ogni Tank e
  // Controller falsava la classifica: mostrava Damian e Trunk sopra la loro
  // win rate reale sulla mappa, cioè sopra il dato misurato.
  let synergy = 0;
  if (ownClasses.length > 0) {
    const sameClassCount = ownClasses.filter((c) => c === candidateClass).length;
    synergy = -2 * sameClassCount;
    const hasFrontline = ownClasses.some((c) => c === "Tank" || c === "Controller");
    if (!hasFrontline && (candidateClass === "Tank" || candidateClass === "Controller")) synergy += 2;
    const hasSupport = ownClasses.some((c) => c === "Support");
    if (!hasSupport && candidateClass === "Support") synergy += 1;
  }

  let traits = 0;
  for (const trait of state.mapTraits) {
    traits += ((MAP_TRAIT_CLASS_BONUS[trait] || {})[candidateClass] || 0) * 2;
  }

  const r1 = (n) => Math.round(n * 10) / 10;
  const estimated = Math.max(5, Math.min(95, base + matchupAvg + synergy + traits));
  return {
    total: r1(estimated),
    base: r1(base),
    baseSource,
    matchupAvg: r1(matchupAvg),
    synergy: r1(synergy),
    traits: r1(traits),
    perEnemy,
  };
}

// Posso davvero schierare questo brawler?
//
// In Classificata un brawler sotto POTENZA 9 non si puo' mettere in campo, e
// da Mythic in su ne serve uno a POTENZA 11 — non e' una preferenza, e' una
// regola del gioco. Consigliare un brawler non schierabile e' peggio che
// inutile: fa perdere i secondi che non hai.
//
// Vale solo per la MIA squadra. Per l'avversario il roster resta intero: lui
// li avra' maxati, e comunque devo poter registrare quello che sceglie.
function schierabile(name) {
  if (typeof PROFILO_POTENZA === "undefined") return true; // nessun profilo collegato: nessun filtro
  const p = PROFILO_POTENZA[name];
  if (p === undefined) return true; // brawler troppo nuovo per stare nella fotografia: non lo escludo
  return p >= state.minPower;
}

// I tre brawler maxati che Classificata regala a stagione non compaiono nel
// profilo con la potenza vera, quindi un brawler escluso puo' essere in
// realta' giocabile. Per questo l'esclusione si puo' spegnere.
function filtroAttivo() {
  return state.minPower > 0 && typeof PROFILO_POTENZA !== "undefined";
}

function computeSuggestions() {
  const turn = currentTurn();
  if (!turn || turn.phase !== "pick") return [];

  const used = usedNames();
  const own = turn.team;
  const enemy = own === "A" ? "B" : "A";
  const ownClasses = state.picks[own].map(classOf);
  const enemyNames = state.picks[enemy];
  const enemyClasses = enemyNames.map(classOf);

  const enemyLeft = state.sequence.filter((sq, i) => i >= state.turnIndex && sq.phase === "pick" && sq.team === enemy).length;
  const threats = enemyLeft > 0 ? likelyEnemyPicks(8) : [];

  const mieiPick = filtroAttivo() && own === state.myTeam;
  const candidates = BRAWLERS
    .filter((b) => !used.has(b.name))
    .filter((b) => !mieiPick || schierabile(b.name))
    .map((b) => {
    const s = scoreCandidate(b.name, b.class, ownClasses, enemyClasses, enemyNames);
    // Il caso peggiore sta nella STESSA riga della media. Tenerli in due
    // classifiche separate obbligava a confrontarle a mano e non diceva
    // quale seguire — che è esattamente il dubbio che ha fatto sbagliare.
    const risk = threats.length ? residualRisk(b.name, threats) : null;
    const worstEdge = Math.min(
      s.perEnemy.length ? Math.min(...s.perEnemy.map((p) => p.edge)) : 0,
      risk ? risk.edge : 0
    );
    const floor = Math.max(5, Math.min(95, s.base + worstEdge));
    return { name: b.name, class: b.class, ...s, risk, floor: Math.round(floor) };
  });

  // L'ordine segue il numero mostrato, sempre. Ordinare per una miscela di
  // due numeri rendeva la lista non monotona in nessuna delle due colonne:
  // sembrava casuale, e soprattutto non si poteva più verificare contro la
  // fonte ("su questa mappa il migliore è Gus" — e l'app mostrava altro).
  // Il rischio resta visibile nel riquadrino "peggio", che diventa vistoso
  // quando è molto più basso: informa senza dirottare la classifica.
  candidates.sort((x, y) => y.total - x.total);
  // La classifica intera resta a disposizione della griglia, che mostra il
  // punteggio su ogni carta e si ordina di conseguenza. Calcolarla due volte
  // sarebbe sprecato: è lo stesso conto.
  _classifica = new Map(candidates.map((c) => [c.name, c.total]));
  return candidates.slice(0, 6);
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
  // La ricerca si svuota PRIMA di ridisegnare: svuotandola dopo, l'indizio
  // sotto la casella restava fermo sul testo vecchio ("Nessun brawler con
  // questo nome") anche se la casella era già vuota.
  clearSearch();
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

// In partita la fase ban dura una ventina di secondi e spesso non fai in
// tempo a inserirli tutti. Questo salta ai pick MANTENENDO i ban che hai già
// messo: la sequenza viene accorciata a quelli effettivamente inseriti,
// invece di limitarsi a spostare l'indice. Serve perché altrimenti "annulla"
// tornerebbe su caselle di ban mai riempite e finirebbe per cancellare il
// ban sbagliato — i due indici non corrisponderebbero più.
function skipBans() {
  const turn = currentTurn();
  if (!turn || turn.phase !== "ban") return;
  const banTurnsDone = state.sequence.slice(0, state.turnIndex).filter((t) => t.phase === "ban");
  const pickTurns = state.sequence.filter((t) => t.phase === "pick");
  state.sequence = [...banTurnsDone, ...pickTurns];
  state.turnIndex = banTurnsDone.length;
  render();
}

function resetDraft() {
  state.bans = { A: [], B: [] };
  state.picks = { A: [], B: [] };
  buildSequence();
  render();
}

function applyConfig() {
  const firstSelect = document.getElementById("first-team");
  if (firstSelect) state.firstTeam = firstSelect.value === "B" ? "B" : "A";
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

// Il ritratto del brawler. Riconoscere una faccia è più veloce che leggere
// un nome, ed è tutto quello che serve quando hai 22 secondi. Vince e Cosmo
// non hanno ancora un'immagine sul CDN: per loro restano le iniziali, invece
// di un riquadro vuoto che sembra un errore.
function ritratto(name, extra) {
  const src = typeof BRAWLER_IMGS !== "undefined" ? BRAWLER_IMGS[name] : null;
  const cls = "ritratto" + (extra ? " " + extra : "");
  if (src) return `<img class="${cls}" src="${src}" alt="" loading="lazy" decoding="async" width="48" height="48" />`;
  const iniziali = name.replace(/[^A-Za-z0-9 -]/g, "").split(/[ -]/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return `<span class="${cls} ritratto-vuoto">${iniziali}</span>`;
}

// Le due fiancate del palco sono "i miei" e "i loro", non "Blu" e "Rossa":
// la squadra in cui gioco cambia a ogni partita, ma alleati a sinistra e
// avversari a destra devono restare fermi, altrimenti si legge il palco al
// contrario proprio mentre si va di fretta.
function renderSlots(ruolo) {
  const team = ruolo === "mine" ? state.myTeam : state.myTeam === "A" ? "B" : "A";
  const bansEl = document.getElementById(`bans-${ruolo}`);
  const picksEl = document.getElementById(`picks-${ruolo}`);
  bansEl.innerHTML = "";
  picksEl.innerHTML = "";

  const totalBans = state.sequence.filter((s) => s.phase === "ban" && s.team === team).length;
  const totalPicks = state.sequence.filter((s) => s.phase === "pick" && s.team === team).length;

  for (let i = 0; i < totalBans; i++) bansEl.appendChild(makeSlot(state.bans[team][i], "ban"));
  for (let i = 0; i < totalPicks; i++) picksEl.appendChild(makeSlot(state.picks[team][i], "pick"));

  const side = document.getElementById(`side-${ruolo}`);
  if (side) {
    side.classList.toggle("team-a", team === "A");
    side.classList.toggle("team-b", team === "B");
  }
}

function makeSlot(name, phase) {
  const div = document.createElement("div");
  div.className = "slot " + (name ? "filled" : "empty") + " " + phase;
  if (name) {
    const cls = classOf(name);
    div.style.borderColor = CLASS_COLORS[cls] || "#666";
    div.innerHTML = `${ritratto(name, "mini")}<span class="slot-name">${name}</span><span class="slot-class">${cls || ""}</span>`;
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

// Ordina il roster per QUANTO VIENE GIOCATO su questa mappa, non per classe.
//
// Era il problema più grosso dell'interfaccia. Con l'ordine per classe i 16
// Tank stanno davanti e Wendy (Support) è la 95esima carta: per registrare
// un pick avversario bisognava scorrere quasi tutto il roster, con 22
// secondi di timer. Ordinando per pick rate della mappa — un dato che
// abbiamo già, misurato sulle stesse partite delle win rate — il brawler
// che serve sta quasi sempre nelle prime file, perché è proprio la
// probabilità che qualcuno lo scelga qui.
function gridOrderedBrawlers() {
  const list = BRAWLERS.slice();
  if (state.gridOrder === "az") return list.sort((a, b) => a.name.localeCompare(b.name, "it"));
  if (state.gridOrder === "class") return list; // ordine del roster, che è per classe
  if (state.gridOrder === "score" && _classifica.size) {
    // Meglio del solo "più giocati": ordina per quanto vale QUI e ADESSO,
    // contro chi è già in campo. Chi non ha punteggio (non schierabile,
    // oppure senza dati) finisce in fondo invece di sparire.
    return list.sort((a, b) => (_classifica.get(b.name) ?? -1) - (_classifica.get(a.name) ?? -1));
  }
  return list.sort((a, b) => useRateOf(b.name).use - useRateOf(a.name).use);
}

// Ricerca: prima chi INIZIA con quello che hai scritto, poi chi lo contiene.
// Con "bo" vuoi Bo davanti a Bibi, e "sh" deve dare Shelly e Shade prima di
// Ash. Restituisce la lista già ordinata per pertinenza.
function searchRank(list, q) {
  const s2 = q.trim().toLowerCase();
  if (!s2) return list;
  const score = (n) => {
    const l = n.toLowerCase();
    if (l === s2) return 0;
    if (l.startsWith(s2)) return 1;
    if (l.includes(" " + s2) || l.includes("-" + s2)) return 2;
    return l.includes(s2) ? 3 : 99;
  };
  return list.map((b) => ({ b, r: score(b.name) })).filter((x) => x.r < 99)
    .sort((x, y) => x.r - y.r).map((x) => x.b);
}

// I brawler che la ricerca e i filtri lasciano passare, nell'ordine mostrato.
// Serve anche a Invio, che prende il primo della lista.
function visibleBrawlers() {
  const used = usedNames();
  let list = gridOrderedBrawlers().filter((b) => {
    if (state.filterClass !== "ALL" && b.class !== state.filterClass) return false;
    return true;
  });
  list = searchRank(list, state.search);
  return list.filter((b) => !used.has(b.name)).concat(list.filter((b) => used.has(b.name)));
}

// Le carte del roster si creano UNA VOLTA e poi si riordinano.
//
// Ricostruirle a ogni render costava 58ms invece di 6: con i ritratti dentro
// il file, ogni <img> ricreata fa ridecodificare l'immagine al browser, e il
// render gira a ogni lettera che scrivi nella ricerca. Riappendere nodi che
// esistono già non ridecodifica niente.
const _carte = new Map();

function cartaDi(b) {
  let card = _carte.get(b.name);
  if (card) return card;
  card = document.createElement("div");
  card.className = "brawler-card";
  card.style.borderColor = CLASS_COLORS[b.class] || "#666";
  card.innerHTML =
    `${ritratto(b.name)}<div class="brawler-name">${b.name}</div>` +
    `<div class="card-score"></div><div class="card-bar"><i></i></div>`;
  card.addEventListener("click", () => pickOrBan(b.name));
  _carte.set(b.name, card);
  return card;
}

function renderGrid() {
  const grid = document.getElementById("brawler-grid");
  const used = usedNames();
  const turn = currentTurn();
  const list = visibleBrawlers();

  const hint = document.getElementById("picker-hint");
  if (hint) {
    if (!turn) hint.textContent = "Draft completato.";
    else if (state.search) {
      const first = list.find((b) => !used.has(b.name));
      hint.innerHTML = first
        ? `Invio → <strong>${first.name}</strong>`
        : "Nessun brawler con questo nome.";
    } else {
      hint.textContent = turn.phase === "ban"
        ? "Tocca chi è stato bannato. I tasti 1-8 prendono dai suggerimenti."
        : "Tocca chi è stato scelto. I tasti 1-8 prendono dai suggerimenti.";
    }
  }

  // Il roster sta sotto i suggerimenti, quindi tenerlo aperto non sposta
  // niente di quello che serve in alto: è aperto di default. Scrivendo nella
  // ricerca si riapre comunque, se lo avevi chiuso.
  const box = document.getElementById("roster-box");
  if (box && state.search) box.open = true;

  const frag = document.createDocumentFragment();
  for (const b of list) {
    const card = cartaDi(b);
    const isUsed = used.has(b.name);
    card.classList.toggle("used", isUsed);
    card.classList.toggle("clickable", !isUsed && !!turn);
    card.title = !turn ? "" : turn.phase === "ban" ? "Clicca per bannare" : "Clicca per scegliere";

    // Non schierabile = non è una preferenza, è una regola: sotto potenza 9
    // in Classificata non entra in campo. Resta visibile e cliccabile perché
    // l'AVVERSARIO può averlo, e devo poter registrare il suo pick.
    const mio = turn && turn.team === state.myTeam;
    const fuori = filtroAttivo() && !schierabile(b.name);
    card.classList.toggle("non-schierabile", !!(fuori && mio));
    const pot = typeof PROFILO_POTENZA !== "undefined" ? PROFILO_POTENZA[b.name] : undefined;
    if (fuori && mio && pot !== undefined) card.title = `Potenza ${pot}: non puoi schierarlo in Classificata (ne serve ${state.minPower}). Cliccabile lo stesso, per registrarlo se lo prende l'avversario.`;

    const punteggio = _classifica.get(b.name);
    const sc = card.querySelector(".card-score");
    const bar = card.querySelector(".card-bar i");
    if (punteggio === undefined) {
      sc.textContent = "";
      card.querySelector(".card-bar").style.visibility = "hidden";
    } else {
      sc.textContent = Math.round(punteggio) + "%";
      card.querySelector(".card-bar").style.visibility = "visible";
      // La barra copre 40-70%: sotto il 40 si perde comunque, sopra il 70 non
      // si arriva quasi mai. Allargarla a 0-100 appiattirebbe le differenze
      // che contano proprio nella fascia dove si decide.
      const q = Math.max(0, Math.min(1, (punteggio - 40) / 30));
      bar.style.width = (q * 100).toFixed(0) + "%";
      bar.className = punteggio >= 58 ? "alto" : punteggio >= 50 ? "medio" : "basso";
    }
    frag.appendChild(card);
  }
  grid.replaceChildren(frag);
}


// ---- ANALISI DEL MOMENTO DEL DRAFT --------------------------------------
// L'ordine dei pick in Classificata è 1-2-2-1. Chi sceglie per primo vede
// 0, poi 2, poi 2 pick avversari; chi sceglie per secondo ne vede 1, 1 e
// infine 3. Conseguenza pratica: SOLO l'ultimo pick della seconda squadra
// vede la squadra avversaria al completo. Un'analisi che presuppone tre
// avversari sullo schermo sarebbe quindi inutile in cinque casi su sei.
// Per questo qui si guarda a quello che è davvero visibile adesso, e si
// aggiunge la cosa che conta quando l'avversario deve ancora scegliere:
// quanto sei ESPOSTO a ciò che può ancora prendere.

// I brawler che l'avversario ha più probabilità di prendere adesso: forti
// nel contesto (mappa/modalità) e realmente scelti dalla gente.
function likelyEnemyPicks(limit) {
  const used = usedNames();
  const rows = [];
  for (const b of BRAWLERS) {
    if (used.has(b.name)) continue;
    const t = threatOf(b.name);
    if (!t) continue;
    const use = useRateOf(b.name).use;
    rows.push({ name: b.name, score: (t.value - 50) * (1 + Math.min(use, 4.5) / 3) });
  }
  rows.sort((a, b) => b.score - a.score);
  return rows.slice(0, limit).map((r) => r.name);
}

// Il rischio residuo di un pick: la peggiore percentuale di vittorie che
// avrebbe contro le minacce che l'avversario può ancora schierare. Un pick
// che sta bene contro chi è già in campo ma crolla contro la risposta
// ovvia non è un buon pick: è un pick che stai regalando.
function residualRisk(candidateName, threats) {
  let worst = null;
  for (const t of threats) {
    // In Classificata un brawler non può stare in entrambe le squadre:
    // valutarlo contro sé stesso produceva righe assurde come
    // "Wendy — peggio: Wendy 48%" e falsava il caso peggiore.
    if (t === candidateName) continue;
    const p = predictedWinRate(candidateName, t);
    const oa = BRAWLER_OVERALL[candidateName];
    const ob = BRAWLER_OVERALL[t];
    const expected = oa !== undefined && ob !== undefined ? 50 + (oa - ob) : 50;
    if (worst === null || p.wr < worst.wr) {
      worst = { enemy: t, wr: p.wr, edge: p.wr - expected, measured: p.measured };
    }
  }
  return worst;
}

function renderTeamCounter() {
  const el = document.getElementById("team-counter");
  const turn = currentTurn();
  if (!turn || turn.phase !== "pick") { el.hidden = true; return; }

  const own = turn.team;
  const enemy = own === "A" ? "B" : "A";
  const enemyNames = state.picks[enemy];
  const enemyLeft = state.sequence.filter((sq, i) => i >= state.turnIndex && sq.phase === "pick" && sq.team === enemy).length;

  const fmt = (n) => Math.round(n) + "%";
  let html = "";

  // Quanti avversari vedi ADESSO, e quanti ne possono ancora arrivare.
  html += `<p class="panel-title">Situazione</p>`;
  html += `<p class="hint situation">${
    enemyNames.length === 0
      ? "Scegli per primo: nessun avversario da counterare. Conviene un pick forte sulla mappa e difficile da punire, non una risposta a qualcosa che non c'è ancora."
      : `Vedi <strong>${enemyNames.length}</strong> ${enemyNames.length > 1 ? "avversari" : "avversario"} (${enemyNames.join(", ")})` +
        (enemyLeft > 0
          ? `, e ne ${enemyLeft > 1 ? "mancano" : "manca"} ancora <strong>${enemyLeft}</strong> da schierare: guarda anche il rischio.`
          : ". È il loro ultimo schieramento: quello che vedi è tutto.")
    }</p>`;

  if (enemyNames.length === 0 && enemyLeft === 0) { el.innerHTML = html; el.hidden = false; return; }

  el.innerHTML = html;
  el.hidden = false;
}

// Scorrendo per arrivare ai suggerimenti, le impostazioni finiscono fuori
// schermo e non si capisce più su quali dati stia rispondendo l'app. Questa
// riga se le porta dietro: se dice "meta generale" vuol dire che mappa e
// modalità non sono selezionate, ed è il motivo più comune per cui i numeri
// sembrano strani.
function renderContextLine() {
  const el = document.getElementById("context-line");
  if (!el) return;
  const parts = [];
  parts.push(state.mode || "nessuna modalità");
  if (state.map) {
    parts.push(state.map.winRates ? state.map.name : state.map.name + " (senza dati)");
  } else {
    parts.push(state.mode ? "nessuna mappa" : "—");
  }
  parts.push(state.metaSource === "MASTERS" ? "Masters" : "tutti i ranghi");
  const weak = !state.mode && !state.map;
  el.className = "context-line" + (weak ? " weak" : "");
  el.innerHTML =
    parts.map((p) => `<span>${p}</span>`).join("") +
    (weak ? `<em>i numeri sono il meta generale: scegli modalità e mappa per averli su misura</em>` : "");
}

function renderSuggestions() {
  const el = document.getElementById("suggestions");
  const titleEl = document.getElementById("suggestions-title");
  const turn = currentTurn();

  if (!turn) {
    titleEl.textContent = "Suggerimenti";
    el.innerHTML = `<p class="hint">Draft completato.</p>`;
    return;
  }

  const sign = (n) => (n > 0 ? "+" + n : String(n));

  if (turn.phase === "ban") {
    titleEl.textContent = "Chi conviene bannare";
    const bans = computeBanSuggestions();
    if (bans.length === 0) {
      el.innerHTML =
        `<button type="button" id="skip-bans" class="skip-bans">Salta i ban → vai ai pick</button>` +
        `<p class="hint">Nessun dato per suggerire un ban: seleziona modalità o mappa.</p>`;
      const b = document.getElementById("skip-bans");
      if (b) b.addEventListener("click", skipBans);
      return;
    }
    el.innerHTML =
      `<button type="button" id="skip-bans" class="skip-bans">Salta i ban → vai ai pick</button>` +
      `<p class="hint">Forza (su ${bans[0].source}) × quanto viene scelto davvero.</p>`;
    bans.forEach((s, i) => {
      const row = document.createElement("div");
      row.className = "suggestion-row" + (i === 0 ? " top" : "");
      row.style.borderColor = CLASS_COLORS[s.class] || "#666";
      // Il numero grande è SEMPRE una percentuale di vittorie, in tutte le
      // fasi. Prima qui c'era un punteggio astratto (12.8) sotto una legenda
      // che parlava di percentuali: due unità diverse nella stessa schermata.
      // L'ordine resta forza × quanto viene scelto davvero, ed è scritto
      // sopra; il numero mostrato è la cosa che si capisce senza spiegazioni.
      row.innerHTML = `
        ${ritratto(s.name, "mini")}
        <span class="sugg-name">${s.name}<span class="chip-row"><span class="echip meas ${s.use >= 2 ? "neg" : "est"}" title="quanto spesso viene scelto davvero: più è alto, più è probabile che te lo prendano">${s.use}% lo prende</span></span></span>
        <span class="sugg-class">${s.class}</span>
        <span class="sugg-score" title="win rate su ${s.source}; l'ordine tiene conto anche di quanto viene scelto">${Math.round(s.wr)}%</span>
      `;
      row.addEventListener("click", () => pickOrBan(s.name));
      el.appendChild(row);
    });
    const skipBtn = document.getElementById("skip-bans");
    if (skipBtn) skipBtn.addEventListener("click", skipBans);
    return;
  }

  titleEl.textContent = "Chi conviene scegliere";
  const suggestions = computeSuggestions();
  if (suggestions.length === 0) {
    el.innerHTML = `<p class="hint">Nessun candidato disponibile.</p>`;
    return;
  }
  el.innerHTML = "";
  suggestions.forEach((s, i) => {
    const row = document.createElement("div");
    row.className = "suggestion-row" + (i === 0 ? " top" : "");
    row.style.borderColor = CLASS_COLORS[s.class] || "#666";
    const flag = pickFlag(s.name);
    const badge = flag
      ? `<span class="badge ${flag.kind}" title="${
          flag.kind === "trap"
            ? `Scelto dal ${flag.use}% dei giocatori ma vince solo il ${flag.wr}% delle volte: lo prendono più di quanto valga.`
            : `Vince il ${flag.wr}% delle volte ma lo sceglie solo il ${flag.use}%: quasi nessuno lo banna, quindi resta libero. Il rovescio: quel ${flag.wr}% è misurato su chi lo gioca abitualmente, che è poca gente e allenata. Se non lo sai già usare, aspettati meno.`
        }">${flag.kind === "trap" ? "trappola" : "sottovalutato"}</span>`
      : "";
    // Contro ciascun avversario si mostra la percentuale, non il residuo:
    // "vs Rosa 72%" si capisce, "+13.5" no.
    const chips = (s.perEnemy || [])
      .map((p) => `<span class="echip ${p.measured ? "meas" : "est"} ${p.wr >= 50 ? "pos" : "neg"}" title="${p.measured ? "matchup misurato su partite reali" : "previsione: differenza di forza + classe"}">vs ${p.enemy} ${Math.round(p.wr)}%</span>`)
      .join("");
    // Il riquadrino diventa un avviso quando il caso peggiore è molto più
    // basso della media: è lì che un pick apparentemente ottimo è fragile.
    const drop = s.total - s.floor;
    const floorClass = s.floor < 50 || drop >= 12 ? "warn" : drop >= 7 ? "mid" : "ok";
    const floorChip =
      s.risk || (s.perEnemy && s.perEnemy.length)
        ? `<span class="floor-chip ${floorClass}" title="${s.risk ? "il peggio che ti può capitare, contro " + s.risk.enemy : "contro l'avversario in campo che ti va peggio"}">peggio ${s.floor}%</span>`
        : "";
    const parts = [`base ${s.base}% (${s.baseSource})`];
    if (s.perEnemy && s.perEnemy.length) parts.push(`matchup ${s.matchupAvg > 0 ? "+" : ""}${s.matchupAvg}`);
    if (s.synergy) parts.push(`composizione ${s.synergy > 0 ? "+" : ""}${s.synergy}`);
    if (s.traits) parts.push(`tratti mappa ${s.traits > 0 ? "+" : ""}${s.traits}`);
    row.innerHTML = `
      ${ritratto(s.name, "mini")}
      <span class="sugg-name">${s.name}${badge}${chips || floorChip ? `<span class="chip-row">${chips}${floorChip}</span>` : ""}</span>
      <span class="sugg-class">${s.class}</span>
      <span class="sugg-score" title="${parts.join(" · ")}">${Math.round(s.total)}%</span>
    `;
    row.addEventListener("click", () => pickOrBan(s.name));
    el.appendChild(row);
  });
}

function render() {
  renderContextLine();
  renderTurnBanner();
  renderTeamCounter();
  renderSlots("mine");
  renderSlots("theirs");
  // I suggerimenti PRIMA della griglia: è renderSuggestions a calcolare la
  // classifica del turno, e la griglia la legge per il punteggio su ogni
  // carta. Nell'ordine opposto la griglia mostrava i punteggi del turno
  // precedente — in fase pick comparivano ancora quelli dei ban.
  renderSuggestions();
  renderGrid();
  updateSetupUI();
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

  const orderSelect = document.getElementById("grid-order");
  if (orderSelect) {
    orderSelect.value = state.gridOrder;
    orderSelect.addEventListener("change", (e) => {
      state.gridOrder = e.target.value;
      renderGrid();
    });
  }

  const box = document.getElementById("search-box");
  box.addEventListener("input", (e) => {
    state.search = e.target.value;
    renderGrid();
  });

  // Invio prende il primo della lista. Due lettere e Invio bastano per
  // registrare un pick: è la strada più corta che esista senza staccare le
  // mani dalla tastiera, e sul telefono la tastiera ha già il tasto invio.
  box.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const used = usedNames();
      const first = visibleBrawlers().find((b) => !used.has(b.name));
      if (first && currentTurn()) { e.preventDefault(); pickOrBan(first.name); }
    } else if (e.key === "Escape") {
      clearSearch();
    }
  });
}

// Dopo ogni mossa la ricerca si svuota da sola: altrimenti al turno dopo
// trovi ancora filtrato il nome precedente e devi cancellarlo a mano,
// che sotto timer è esattamente il tipo di attrito da togliere.
function clearSearch() {
  state.search = "";
  const box = document.getElementById("search-box");
  if (box) box.value = "";
}

// Scorciatoie da tastiera. Nel draft vero il tempo è 22 secondi a pick:
// "1" per prendere il consiglio in cima è la mossa più veloce possibile.
function initKeyboard() {
  document.addEventListener("keydown", (e) => {
    const t = e.target;
    const inField = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT");
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    if (e.key === "/" && !inField) {
      e.preventDefault();
      const box = document.getElementById("search-box");
      if (box) { box.focus(); box.select(); }
      return;
    }
    if (inField) return;

    if (e.key >= "1" && e.key <= "8") {
      const rows = document.querySelectorAll("#suggestions .suggestion-row");
      const row = rows[Number(e.key) - 1];
      if (row) { e.preventDefault(); row.click(); }
      return;
    }
    if (e.key === "Backspace") { e.preventDefault(); undoLast(); }
  });
}

// Il setup (chi inizia, ban, modalità, mappa) serve una volta a inizio
// partita, ma occupava 600px fissi in cima: i suggerimenti finivano sotto la
// piega e il roster due schermate più giù. Scelta la mappa si richiude da
// solo, e il riassunto resta nella linguetta. Riaprirlo è un tocco.
function updateSetupUI() {
  const box = document.getElementById("setup");
  const traits = document.getElementById("traits-wrap");
  if (traits) traits.hidden = !!state.map;
  if (!box) return;
  const sum = box.querySelector("#setup-summary");
  if (sum) {
    const dove = state.map ? `${state.mode} · ${state.map.name}` : state.mode || "nessuna modalità";
    const chi = state.firstTeam === "A" ? "inizia Blu" : "inizia Rossa";
    const io = `gioco in ${state.myTeam === "A" ? "Blu" : "Rossa"}`;
    // Il filtro potenza cambia parecchio i consigli: se è attivo va detto
    // qui, altrimenti uno non capisce perché certi brawler non compaiono.
    const pw = filtroAttivo()
      // Conta solo quelli di cui SO la potenza. schierabile() lascia passare
      // anche i brawler assenti dalla fotografia (troppo nuovi), ma contarli
      // qui gonfierebbe il numero: direbbe 51 quando ne posso schierare 49.
      ? ` · solo i miei da potenza ${state.minPower} in su (${BRAWLERS.filter((b) => PROFILO_POTENZA[b.name] >= state.minPower).length})`
      : "";
    sum.textContent = box.open
      ? "Impostazioni partita — tocca per chiudere"
      : `${dove} · ${chi} · ${io}${pw} · tocca per cambiare`;
  }
}

function populateMapSelect() {
  const mapSelect = document.getElementById("map-select");
  const mapsForMode = state.mode ? MAPS.filter((m) => m.mode === state.mode) : [];
  mapSelect.innerHTML = `<option value="">Nessuna / non elencata (usa i tratti)</option>`;
  for (const m of mapsForMode) {
    const opt = document.createElement("option");
    opt.value = m.name;
    opt.textContent = m.winRates
      ? `${m.name} (${Math.round(m.sample / 1000)}k partite)`
      : `${m.name} — dati non verificati`;
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
  const m = state.map;
  // Prima erano due righe fisse in cima, ~120px sempre occupati. La
  // provenienza serve a controllare l'app, non a giocare: una riga sola,
  // il resto si apre se lo cerchi.
  const conf = m.winRates ? confidenceLabel(mapConfidence(m)) : "nessun dato";
  const breve = m.winRates
    ? `${Math.round(m.sample / 1000)}k partite · affidabilità ${conf}`
    : "nessuna win rate verificata per questa mappa";
  const esteso = m.winRates
    ? `Dati mappa: ${m.sample.toLocaleString("it-IT")} partite di Classificata · aggiornati ${m.updated} · affidabilità ${conf}.`
    : "Nessuna win rate verificata: i suggerimenti qui si appoggiano alla modalità.";
  el.innerHTML =
    `<details><summary>${breve}</summary><span>${esteso}${m.notes ? " " + m.notes : ""}</span></details>`;
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
    render(); // non solo i suggerimenti: cambia anche il contesto mostrato
  });

  const mapSelect = document.getElementById("map-select");
  mapSelect.addEventListener("change", (e) => {
    const found = MAPS.find((m) => m.mode === state.mode && m.name === e.target.value);
    state.map = found || null;
    renderMapNotes();
    if (state.map) document.getElementById("setup").open = false;
    render();
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
    setCustomScores({ ...baseMetaScores(), ...scores });
    renderMetaStatus(null);
    render();
  });

  document.getElementById("meta-save").addEventListener("click", () => {
    const text = textarea.value;
    const { scores, unrecognized } = parseMetaText(text);
    setCustomScores({ ...baseMetaScores(), ...scores });
    saveMetaRaw(text);
    renderMetaStatus(unrecognized);
    renderSuggestions();
  });

  document.getElementById("meta-clear").addEventListener("click", () => {
    textarea.value = "";
    setCustomScores({ ...baseMetaScores() });
    saveMetaRaw("");
    renderMetaStatus(null);
    renderSuggestions();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initFilters();
  initKeyboard();
  initModeAndMap();
  initMetaPanel();
  buildSequence();
  render();

  document.getElementById("apply-config").addEventListener("click", applyConfig);
  document.getElementById("first-team").addEventListener("change", (e) => {
    state.firstTeam = e.target.value === "B" ? "B" : "A";
    resetDraft();
  });
  document.getElementById("undo-btn").addEventListener("click", undoLast);
  document.getElementById("reset-btn").addEventListener("click", resetDraft);
  const mine = document.getElementById("my-team");
  mine.value = state.myTeam;
  mine.addEventListener("change", (e) => {
    state.myTeam = e.target.value === "B" ? "B" : "A";
    render();
  });

  const pw = document.getElementById("min-power");
  pw.value = String(state.minPower);
  pw.addEventListener("change", (e) => {
    state.minPower = Number(e.target.value) || 0;
    render();
  });

  document.getElementById("setup").addEventListener("toggle", updateSetupUI);
});
