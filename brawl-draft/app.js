// Logica del draft: stato, sequenza turni, punteggio suggerimenti, rendering.

const state = {
  bansPerTeam: 3, // Diamante+: ogni giocatore banna 1 brawler, 3 a squadra in 3v3
  pickPattern: ["A", "B", "B", "A", "A", "B"], // 3v3 standard "1-2-2-1"
  sequence: [], // array di {phase:'ban'|'pick', team:'A'|'B'}
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
  // Io sono SEMPRE la squadra A, cioè gli Alleati a sinistra. Prima c'erano
  // due menu ("chi inizia" e "io gioco in") ed era facile impostarne uno al
  // contrario, il che rendeva sbagliato ogni suggerimento successivo senza
  // che si vedesse. Con un solo interruttore — scelgo per primo sì/no —
  // l'errore non è più possibile.
  myTeam: "A",
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
// IL MODELLO DEI TURNI È A CASELLE, non a sequenza rigida.
//
// Prima ogni pick veniva accodato e si poteva solo annullare l'ultimo. Ma
// l'errore vero è toccare il brawler sbagliato al terzo turno su sei, e
// accorgersene al quinto: con l'accodamento l'unico rimedio era disfare
// tutto. Ora ogni turno ha la SUA casella, quindi togliere un brawler
// significa svuotare quella casella e basta — il resto del draft resta dov'è.
function buildSequence() {
  const flip = (t) => (state.firstTeam === "B" ? (t === "A" ? "B" : "A") : t);
  const seq = [];
  const conta = {};
  const aggiungi = (phase, team) => {
    const chiave = phase + team;
    conta[chiave] = conta[chiave] || 0;
    seq.push({ phase, team, k: conta[chiave]++ }); // k = quale casella di quella squadra
  };
  for (let i = 0; i < state.bansPerTeam; i++) {
    aggiungi("ban", flip("A"));
    aggiungi("ban", flip("B"));
  }
  for (const team of state.pickPattern) aggiungi("pick", flip(team));
  state.sequence = seq;
}

// Dove sta scritto il brawler di un dato turno.
function contenitore(turn) {
  return turn.phase === "ban" ? state.bans[turn.team] : state.picks[turn.team];
}

function nomeDelTurno(turn) {
  return contenitore(turn)[turn.k] || null;
}

function usedNames() {
  const out = new Set();
  for (const arr of [state.bans.A, state.bans.B, state.picks.A, state.picks.B]) {
    for (const n of arr) if (n) out.add(n);
  }
  return out;
}

// Il turno corrente è la PRIMA casella vuota. Con le caselle questo viene
// gratis: togli un brawler dal secondo turno e l'app torna lì da sola,
// senza toccare quello che c'era dopo.
function currentTurn() {
  for (const t of state.sequence) if (!nomeDelTurno(t)) return t;
  return null;
}

function turniFatti() {
  return state.sequence.filter((t) => nomeDelTurno(t)).length;
}

// Era un BRAWLERS.find, cioe' una scansione di 108 elementi, e viene chiamata
// due volte per ogni coppia valutata: con il valore atteso sulle caselle
// avversarie vuote sono circa diecimila coppie per turno, quindi due milioni
// di passi buttati. Con una mappa e' un accesso diretto.
let _classi = null;
function classOf(name) {
  if (!_classi) {
    _classi = new Map();
    for (const b of BRAWLERS) _classi.set(b.name, b.class);
  }
  const c = _classi.get(name);
  return c === undefined ? null : c;
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
// Memorizzata per mappa: veniva chiamata una volta per ciascuno dei 106
// candidati a ogni ridisegno, e ogni chiamata faceva un new Date() con
// parsing di stringa — cento parsing di data per tocco, per un numero che
// cambia solo quando cambia la mappa.
const _confidenza = new WeakMap();
function mapConfidence(map) {
  if (!map || !map.winRates || !map.updated) return 0;
  const memo = _confidenza.get(map);
  if (memo !== undefined) return memo;
  const days = (Date.now() - new Date(map.updated + "T00:00:00Z").getTime()) / 86400000;
  const freshness = days <= 2 ? 1 : days <= 7 ? 0.9 : days <= 21 ? 0.7 : days <= 35 ? 0.45 : days <= 60 ? 0.25 : 0.12;
  const size = map.sample >= 500000 ? 1 : map.sample >= 100000 ? 0.9 : map.sample >= 30000 ? 0.75 : 0.6;
  const conf = freshness * size;
  _confidenza.set(map, conf);
  return conf;
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
// Nota sull'asimmetria, che è voluta e non una svista: qui la win rate NON
// viene corretta per rarità, mentre in contextualWinRate sì. Il motivo è che
// le due domande sono diverse. "Quanto renderebbe a me" → corretta, perché il
// dato descrive chi quel brawler lo gioca apposta. "Quanto fa paura se lo
// prende l'avversario" → grezza, perché se lo prende è probabilmente proprio
// uno di quelli. Per i ban conta comunque poco: la priorità è già moltiplicata
// per quanto viene scelto, quindi un raro finisce in fondo da solo.
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

// La mia risposta migliore a una minaccia: fra i brawler che posso davvero
// schierare e che sono ancora liberi, il migliore per resa nel contesto
// contro di lei. Serve nella fase ban, dove l'app finora non guardava
// affatto le interazioni: un ban speso su qualcosa che sai gia' gestire e'
// un ban buttato.
//
// NON entra nell'ordinamento dei ban, e la scelta e' deliberata. Misurato
// (`script/misura-ban.js`): rispondo alle tre minacce consigliate col 57,3%
// e alla minaccia plausibile che gestisco peggio col 53,3% — un divario di
// quattro punti, reale ma piccolo, e le minacce che promuoverebbe sono quasi
// tutte rare, cioe' esattamente quelle che il termine di popolarita' demolisce
// di proposito (bannare un mostro che nessuno prende e' un ban buttato).
// Pesare quel divario vorrebbe dire scegliere un coefficiente che non ho modo
// di calibrare. Quindi il numero si mostra e la decisione resta a chi gioca.
function rispostaMigliore(minaccia) {
  const used = usedNames();
  let best = null, chi = null;
  for (const b of BRAWLERS) {
    if (b.name === minaccia || used.has(b.name)) continue;
    if (!schierabile(b.name)) continue;
    const v = contextualWinRate(b.name).base + edgeCentrato(b.name, minaccia);
    if (best === null || v > best) { best = v; chi = b.name; }
  }
  return best === null ? null : { valore: Math.round(best), chi };
}

function computeBanSuggestions() {
  _distAvversario = null; _aggr = null;
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
    // LA CODA TRASCURABILE. Il fattore di popolarita' qui sopra non scende mai
    // sotto 1, quindi non puo' demolire un win rate altissimo: su Out in the
    // Open l'app metteva Wendy terza fra i ban con lo 0,05% di pick rate su
    // quella mappa, cioe' un ban sprecato nel 99,95% delle partite.
    //
    // Non ho un modo per dire se un ORDINE di ban e' migliore di un altro: ogni
    // giudice che potrei costruire usa lo stesso modello dell'ordinamento, e gli
    // esiti delle partite non li ho. Quindi la formula resta quella che c'era.
    // Questo pezzo non e' un modello, e' aritmetica: sotto lo 0,35% per casella
    // (circa l'1% di probabilita' su tre caselle avversarie) la priorita' viene
    // ridotta in proporzione alla probabilita' stessa. Sopra quella soglia non
    // cambia niente per nessuno.
    const SOGLIA_TRASCURABILE = 0.35;
    const plausibile = Math.min(1, use / SOGLIA_TRASCURABILE);
    const priority = (t.value - 50) * popularity * plausibile;
    candidates.push({
      name: b.name, class: b.class, wr: t.value, source: t.source,
      use, priority: Math.round(priority * 10) / 10,
    });
  }
  candidates.sort((a, b) => b.priority - a.priority);
  _classifica = new Map(candidates.map((c) => [c.name, c.wr]));
  // La risposta migliore si calcola solo per le sei righe mostrate: su tutti
  // e 106 sarebbero 106 x 49 confronti a ogni ridisegno, per un numero che
  // nessuno legge sulle righe che non compaiono.
  const mostrate = candidates.slice(0, 6);
  for (const c of mostrate) c.risposta = rispostaMigliore(c.name);
  return mostrate;
}

// Percentuale di vittorie di A contro B, se misurata. Le coppie valgono in
// entrambi i versi: se B contro A fa 30%, allora A contro B fa 70%.
function rawMatchup(a, b) {
  if (MATCHUPS[a] && MATCHUPS[a][b] !== undefined) return MATCHUPS[a][b];
  if (MATCHUPS[b] && MATCHUPS[b][a] !== undefined) return 100 - MATCHUPS[b][a];
  return null;
}

// ---- IL DOPPIO CONTEGGIO, E COME SI TOGLIE ------------------------------
//
// Un brawler con favore alto vince di piu' contro chiunque. Ma "vince di piu'
// contro chiunque" e' GIA' dentro la sua win rate di mappa, che e' la base del
// punteggio. Sommarci anche il vantaggio grezzo significa contare due volte
// lo stesso fatto — ed e' il difetto che faceva uscire sempre gli stessi nomi:
// aggiunto il favore al modello, un solo brawler prendeva il 21% delle
// posizioni e i primi sei erano esattamente i sei col favore piu' alto.
//
// Il vantaggio che conta nel punteggio e' quindi quello CENTRATO sul brawler
// stesso: quanto se la cava contro QUESTO avversario meglio di quanto se la
// cavi in media. Il favore dell'AVVERSARIO invece resta, e non e' un doppio
// conteggio: la win rate di mappa e' misurata contro l'avversario medio, e un
// avversario scomodo non e' l'avversario medio.
//
//   vantaggio_centrato(a,b) = residuo(a,b) - favore(a)
//
// Sulla coppia stimata si semplifica: 0,2*classe - favore(b).
//
// La conseguenza si vede a schermo: il numero grande resta una percentuale di
// vittorie, ma un brawler forte in generale non guadagna piu' due volte per
// essere forte in generale. Le percentuali per avversario ("vs Rosa 72%")
// restano NON centrate, perche' quelle sono win rate verificabili sulle fonti.
function edgeCentrato(a, b) {
  const p = predictedWinRate(a, b);
  const oa = BRAWLER_OVERALL[a];
  const ob = BRAWLER_OVERALL[b];
  const atteso = oa !== undefined && ob !== undefined ? 50 + (oa - ob) : 50;
  return p.wr - atteso - favoreMatchup(a);
}

// ---- QUANTO E' FORTE L'AVVERSARIO CHE HAI DAVANTI ----------------------
//
// L'errore piu' grosso trovato in questa app, e l'utente lo diceva da giorni
// («non fa i counter, mi consiglia male»).
//
// Il punteggio parte dalla win rate di mappa, che e' misurata contro
// l'avversario TIPICO di quella mappa. Se davanti hai Wendy, che e' molto piu'
// forte del tipico, quella base non vale piu': va corretta verso il basso. Il
// modello invece usava solo il residuo `misurato - atteso`, che toglie
// esattamente la differenza di forza — cioe' buttava via proprio
// l'informazione che serviva.
//
// Il caso concreto: Ash contro Wendy vince il 43,7%. Il residuo e' +6,5,
// perche' contro un mostro come Wendy ci si aspetterebbe di fare anche peggio.
// L'app sommava quel +6,5 e concludeva che affrontare Wendy MIGLIORA Ash.
// L'avversario tipico su Pinball Dreams vale 50,3 di forza, Wendy 67,6:
// affrontare lei costa -17,3. Il totale giusto e' -10,8.
//
// Il termine mancante e' quindi `forzaTipica(mappa) - forza(avversario)`, e non
// e' doppio conteggio: il residuo e' l'effetto della COPPIA, questo e' quanto
// l'avversario si scosta dalla media contro cui la base e' stata misurata.
// Sulle caselle ancora vuote vale zero per costruzione (la media dello scarto
// sulla distribuzione e' nulla), quindi si applica solo a chi e' in campo.
const _forzaTipica = new WeakMap();
function forzaTipicaMappa() {
  if (!state.map || !state.map.pickRates) {
    // senza dati di mappa, la media semplice del roster
    let s = 0, n = 0;
    for (const b of BRAWLERS) { const o = BRAWLER_OVERALL[b.name]; if (o !== undefined) { s += o; n++; } }
    return n ? s / n : 50;
  }
  const memo = _forzaTipica.get(state.map);
  if (memo !== undefined) return memo;
  let sp = 0, sf = 0;
  for (const b of BRAWLERS) {
    const o = BRAWLER_OVERALL[b.name];
    const p = state.map.pickRates[b.name];
    if (o === undefined || p === undefined) continue;
    sp += p; sf += p * o;
  }
  const v = sp ? sf / sp : 50;
  _forzaTipica.set(state.map, v);
  return v;
}

// Quanto ti costa (o ti rende) affrontare proprio LUI invece di un avversario
// qualunque di questa mappa.
function scartoForzaAvversario(nemico) {
  const o = BRAWLER_OVERALL[nemico];
  if (o === undefined) return 0;
  return forzaTipicaMappa() - o;
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

// ---- QUANTO E' SCOMODO DA AFFRONTARE, INDIPENDENTEMENTE DALLA CLASSE ----
//
// Il modello assumeva che, tolta la differenza di forza generale, il residuo
// medio di ogni brawler fosse zero: nessuno sarebbe "genericamente scomodo".
// Falso, e misurabile. `script/misura-distorsione-matchup.js`: la dispersione
// dei residui medi per brawler ha varianza 7,14, di cui 4,21 spiegabile dal
// solo rumore di campionamento — quindi il 41% e' segnale vero.
//
// Non e' un artefatto di come le fonti scelgono le coppie da pubblicare
// (i 3 migliori e i 3 peggiori per brawler): dividendo le coppie di ogni
// brawler in due meta' alternate, la media di una meta' predice quella
// dell'altra con correlazione 0,91 e pendenza 1,04. Ed e' scollegato da
// quante coppie sono state registrate (0,03), che e' la cosa che ci si
// aspetterebbe se il campione favorisse i brawler piu' analizzati.
//
// Aggiunto al modello, FUORI CAMPIONE (una misurazione alla volta esclusa,
// su 605 misurazioni uniche) la varianza spiegata dei residui passa dal
// 19,8% al 53,9%. Effetto collaterale importante: il coefficiente della
// matrice di classe crolla da 0,75 a 0,2, cioe' CLASS_EDGE stava in gran
// parte facendo da approssimazione a questo — le classi raggruppano
// brawler, quindi le medie per classe assorbivano un effetto per brawler.
//
// Cautela che resta: tutte le 605 misurazioni sono coppie ESTREME per
// costruzione. Il modello e' validato su estremi, quindi la grandezza
// potrebbe non trasferirsi identica a una coppia qualunque. Per questo il
// valore di ogni brawler e' ristretto secondo quante coppie ha davvero:
// n/(n+6), scelto misurando (k0=6 dava 54,1%, k0=3 il 53,5%, k0=25 il 51,4%).
const FAVORE_K0 = 6;
let _favore = null;
// Per ogni brawler, con chi ha una coppia MISURATA. Serve alla scorciatoia in
// edgeCasellaVuota: senza questo indice bisognava scorrere tutti e cento gli
// avversari possibili per trovarne la decina misurata, e la scorciatoia
// algebrica non serviva a niente (misurato: 14,9ms dei 40 del ridisegno).
let _vicini = null;
function viciniMisurati(name) {
  if (!_vicini) {
    _vicini = new Map();
    const agg = (x, y) => {
      let l = _vicini.get(x);
      if (!l) { l = []; _vicini.set(x, l); }
      if (!l.includes(y)) l.push(y);
    };
    for (const x of Object.keys(MATCHUPS)) {
      for (const y of Object.keys(MATCHUPS[x])) { agg(x, y); agg(y, x); }
    }
  }
  return _vicini.get(name) || [];
}
function favoreMatchup(name) {
  if (!_favore) {
    const somma = {}, conta = {};
    const agg = (chi, v) => { somma[chi] = (somma[chi] || 0) + v; conta[chi] = (conta[chi] || 0) + 1; };
    for (const x of Object.keys(MATCHUPS)) {
      for (const y of Object.keys(MATCHUPS[x])) {
        const ox = BRAWLER_OVERALL[x], oy = BRAWLER_OVERALL[y];
        if (ox === undefined || oy === undefined) continue;
        // una volta per coppia: la stessa misura scritta nei due versi
        // conterebbe due volte e falserebbe il numero di osservazioni
        if (MATCHUPS[y] && MATCHUPS[y][x] !== undefined && y < x) continue;
        const res = MATCHUPS[x][y] - (50 + (ox - oy));
        agg(x, res); agg(y, -res);
      }
    }
    _favore = {};
    for (const k of Object.keys(somma)) {
      const n = conta[k];
      _favore[k] = (somma[k] / n) * (n / (n + FAVORE_K0));
    }
  }
  return _favore[name] || 0;
}

// Stima per le coppie mai misurate — cioè il 95% delle combinazioni, visto
// che nessuna fonte pubblica la matrice completa. Usa la media dei residui
// veri osservati fra quelle due classi (vedi CLASS_EDGE in data.js).
// Il fattore 0,5 è una correzione deliberata: le coppie misurate sono gli
// ESTREMI di ogni brawler, quindi le medie per classe sono più marcate di
// quanto sarebbero su un campione casuale. Dimezzarle è il modo prudente di
// usarle — meglio sottostimare un vantaggio che inventarne uno.
// MISURATO fuori campione, non scelto a occhio. Da solo, il termine di classe
// vuole 0,75 (`script/calibra-classi.js`: lo 0,5 di prima buttava via un
// terzo dell'informazione). Ma stimato ASSIEME al favore per brawler
// (`script/calibra-favore-matchup.js`) scende a 0,19: gran parte di quello che
// la matrice di classe sembrava sapere era in realta' un effetto per brawler,
// che le classi assorbivano perche' raggruppano brawler. Tenere 0,75 con il
// favore accanto vorrebbe dire contare due volte lo stesso segnale.
const CLASS_EDGE_SHRINK = 0.2;
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
  const wr = 50 + gap + classEdge(classOf(a), classOf(b)) + (favoreMatchup(a) - favoreMatchup(b));
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
// Quanto spesso questo brawler COMPARE in una partita, sulla scala in cui i
// 106 sommano 600% (sei pick per partita). Serve alla correzione qui sotto,
// e le due fonti vanno riportate alla stessa scala: le pick rate di mappa
// sono già su 600, USE_RATES globale somma 100 e va moltiplicata per sei.
function comparizioneSu600(name) {
  const pr = state.map && state.map.pickRates ? state.map.pickRates[name] : undefined;
  if (pr !== undefined) return pr;
  if (USE_RATES[name] !== undefined) return USE_RATES[name] * 6;
  return 0.5;
}

// CORREZIONE PER RARITÀ — la modifica più importante fatta a questa app.
//
// Il problema, segnalato dall'utente e poi misurato: Wendy usciva prima su 13
// mappe su 33 e nei primi tre su 29, e lui perdeva trofei seguendola. La sua
// pick rate media è 0,53%: viene scelta dieci volte meno della media.
//
// Quelle partite non sono un campione a caso, sono le partite di chi la
// gioca apposta. Tre misure, tutte sui dati che abbiamo:
//  - chi ha la sua stessa rarità (0,3-1%) vince in media il 45,8%; lei il
//    61,8%, cioè SEDICI punti sopra i suoi pari;
//  - nel complesso i dati non premiano affatto i rari, anzi: dal 42,3% della
//    fascia più rara si sale al 51,8% della più giocata. Wendy è l'eccezione,
//    non la regola;
//  - un brawler davvero forte SU CERTE MAPPE varia fra modalità (Bolt 5,15 di
//    scarto). Wendy vince ~62% ovunque, con scarto 2,88, sotto la media di
//    3,61: il suo numero non segue la mappa, segue chi la usa.
//
// Quindi la win rate si tira verso il 50% — cioè verso "una partita normale"
// — tanto più quanto meno quel brawler viene scelto. Non è sfiducia nel dato:
// il dato è giusto, ma descrive un'altra popolazione di giocatori.
//
// p0 = 2 scelto misurando, non a occhio: la correlazione fra punteggio e
// popolarità SCENDE da 0,40 a 0,14 (quindi non si finisce a consigliare
// semplicemente i più giocati — anzi, il legame con la popolarità si riduce)
// e resta 0,81 di correlazione col dato grezzo, cioè il segnale non si perde.
const RARITA_P0 = 2;

function correzioneRarita(name) {
  const p = comparizioneSu600(name);
  return p / (p + RARITA_P0); // 0,5% → 0,20   ·   5,7% (media) → 0,74   ·   20% → 0,91
}

// ---- I TUOI RISULTATI, NON QUELLI DELLA POPOLAZIONE ---------------------
//
// L'utente ha segnalato tre volte che un pick consigliato gli faceva perdere.
// La terza volta ho guardato nel posto giusto: il tracker pubblica, per ogni
// brawler, LE SUE partite e le sue vittorie. Era nello stesso payload da cui
// leggevo potenza e trofei, e non lo leggevo.
//
// Damian: 11 partite di Classificata, 1 vinta. Se il 56,4% che l'app gli dava
// in Gem Grab fosse vero per lui, fare 1 o meno vittorie su 11 avrebbe
// probabilita' dello 0,165%. Non e' sfortuna: quel numero descrive un'altra
// persona.
//
// COME ENTRA NEL PUNTEGGIO. Non come valore assoluto — sommare la sua win
// rate grezza alzerebbe ogni brawler che ha giocato, contando due volte la
// sua bravura generale (lo stesso errore del favore per brawler). Entra come
// SCARTO dalla sua media complessiva: "con questo sei tot punti sopra o sotto
// il tuo solito".
//
// QUANTO PESA: calibrato sui suoi dati, non scelto. La varianza dei suoi
// risultati fra brawler e' 0,0440; quella attesa dal solo caso, dato il numero
// di partite di ciascuno, e' 0,0217. Resta 0,0222 di varianza VERA, cioe' una
// deviazione standard di 14,9 punti: e' davvero molto piu' bravo con alcuni.
// Da li' il peso di Bayes empirico n/(n+n0) con n0 = p(1-p)/tau2 = 11 partite.
// Con 11 partite il dato personale pesa la meta', con 3 il 22%, con 72 l'87%.
//
// Il conteggio usa le partite di CLASSIFICATA (totali meno quelle trofei):
// la win rate disponibile e' pero' su tutte, e questo va detto — non c'e' modo
// di separarla. Sotto le 3 partite di Classificata non si applica niente.
const PERSONALE_N0 = 11;
const PERSONALE_MIN = 3;
// IL TETTO, misurato sul modello a tre livelli: ±10 punti da' log-loss 0,6359
// e AUC 0,666 sulle sue 310 partite, contro 0,6391/0,665 con ±8 e 0,6533/0,686
// con ±4. Resta un tetto perche' l'utente ha chiesto — a ragione — che il suo
// record sia UNA voce di una media ponderata, non un veto.
const PERSONALE_TETTO = 10;

// ---- IL RECORD PERSONALE, A TRE LIVELLI --------------------------------
//
// Prima era solo per BRAWLER, e l'utente ha trovato il caso che lo smonta:
// con Bolt fa 5 vittorie su 5 su Deathcap Trap e 1 su 5 su Undermine, e l'app
// gli mostrava la media («tuo 80%») mentre lo mandava a giocare Undermine.
//
// Misurato fuori campione sulle sue 310 partite di Classificata, predicendo
// ognuna col record costruito senza quella partita:
//   solo brawler          log-loss 0,6636   AUC 0,474   <- sotto il caso
//   solo mappa            log-loss 0,6495   AUC 0,629
//   brawler x mappa       log-loss 0,6473   AUC 0,651
//   TRE LIVELLI           log-loss 0,6361   AUC 0,674   <- il migliore
//
// Per lui la MAPPA conta piu' del brawler, e l'app usava il raggruppamento
// peggiore dei quattro. Tre livelli vuol dire: quanto vali con quel brawler,
// quanto vali su quella mappa, e quel che resta della coppia — ognuno
// ristretto sul PROPRIO numero di partite, cosi' una cella da cinque partite
// pesa poco senza essere buttata via.
//
// Il termine di mappa sposta tutti i candidati allo stesso modo, quindi non
// cambia l'ordine: cambia il livello, ed e' giusto che lo faccia. Su Undermine
// lui ha 2 vittorie su 10 con qualunque brawler, e il numero a schermo deve
// dirlo invece di mostrargli un 69% che non ha mai visto.
function _rec(tab, chiave) {
  const r = tab && chiave ? tab[chiave] : undefined;
  return r && r[0] > 0 ? { n: r[0], v: r[1] } : null;
}
function _scarto(rec, media) {
  if (!rec) return 0;
  return (rec.n / (rec.n + PERSONALE_N0)) * ((100 * rec.v) / rec.n - media);
}
const _mio = new Map();
function scartoPersonale(name) {
  const chiave = name + "|" + (state.map ? state.map.name : "");
  if (_mio.has(chiave)) return _mio.get(chiave);
  const r = calcolaScartoPersonale(name);
  _mio.set(chiave, r);
  return r;
}
function calcolaScartoPersonale(name) {
  if (typeof PARTITE_RANKED_MEDIA === "undefined" || typeof PARTITE_BRAWLER === "undefined") return null;
  const media = PARTITE_RANKED_MEDIA;
  const su = name.toUpperCase();
  const mappa = state.map ? state.map.name : null;
  const recB = _rec(PARTITE_BRAWLER, su);
  const recM = mappa ? _rec(PARTITE_MAPPA, mappa) : null;
  const recC = mappa ? _rec(PARTITE_BRAWLER_MAPPA, su + "|" + mappa) : null;
  if (!recB && !recM && !recC) return null;
  const sb = _scarto(recB, media);
  const sm = _scarto(recM, media);
  // la coppia porta SOLO quello che brawler e mappa non spiegano gia'
  let resto = 0;
  if (recC) resto = (recC.n / (recC.n + PERSONALE_N0)) * ((100 * recC.v) / recC.n - media - sb - sm);
  // IL TETTO VA SOLO SULLA PARTE CHE DIFFERENZIA. Il termine di mappa e'
  // identico per tutti i candidati: non decide QUALE pick, decide il livello.
  // Capparlo insieme al resto lo faceva mangiare tutto il budget su una mappa
  // andata male — su Undermine (2 vittorie su 10) ogni candidato finiva a -10
  // e l'app smetteva di distinguere. Ora la mappa passa intera e il tetto
  // limita solo brawler + coppia, che sono la parte su cui il record potrebbe
  // diventare un veto.
  const proprio = Math.max(-PERSONALE_TETTO, Math.min(PERSONALE_TETTO, sb + resto));
  const grezzo = sb + sm + resto;
  const scarto = proprio + sm;
  // per il riquadrino si mostra il dato piu' SPECIFICO che esiste
  const mostra = recC && recC.n >= PERSONALE_MIN ? { rec: recC, dove: "qui" } : recB ? { rec: recB, dove: "" } : { rec: recM, dove: "su questa mappa" };
  return {
    scarto, grezzo, scartoMappa: sm, tagliato: Math.abs(sb + resto) > PERSONALE_TETTO,
    mio: (100 * mostra.rec.v) / mostra.rec.n, partite: mostra.rec.n, dove: mostra.dove,
    brawler: recB, mappaRec: recM, coppia: recC,
    peso: recC ? recC.n / (recC.n + PERSONALE_N0) : recB ? recB.n / (recB.n + PERSONALE_N0) : 0,
    nClass: mostra.rec.n,
  };
}

function contextualWinRate(name) {
  const metaWr = state.customScores[name];
  const modeWr = state.mode && MODE_WIN_RATES[state.mode] ? MODE_WIN_RATES[state.mode][name] : undefined;
  const mapWr = state.map && state.map.winRates ? state.map.winRates[name] : undefined;

  const fallback = modeWr !== undefined ? modeWr : metaWr !== undefined ? metaWr : 50;
  let grezza = fallback;
  let source = modeWr !== undefined ? "modalità" : metaWr !== undefined ? "meta" : "nessun dato";
  if (mapWr !== undefined) {
    const conf = mapConfidence(state.map);
    grezza = mapWr * conf + fallback * (1 - conf);
    source = "mappa";
  } else if (state.map && state.map.bestPicks && state.map.bestPicks.includes(name)) {
    grezza += 2; // citato dalle fonti come forte qui, ma senza numero: spinta piccola
  }

  const aff = correzioneRarita(name);
  const generale = 50 + (grezza - 50) * aff;
  // Il dato di mappa dice quanto vale QUESTO BRAWLER QUI; il tuo record dice
  // quanto vali TU CON LUI. Sono due cose diverse e si sommano.
  const mio = scartoPersonale(name);
  const base = mio ? generale + mio.scarto : generale;
  return { base, source, grezza, aff, pick: comparizioneSu600(name), generale, mio };
}

// ---- LE CASELLE AVVERSARIE ANCORA VUOTE ---------------------------------
//
// La squadra avversaria ha SEMPRE tre caselle. Il punteggio contava solo
// quelle gia' riempite, quindi al primo pick l'interazione valeva zero — e in
// Classificata (1-2-2-1) SOLO l'ultimo pick della seconda squadra vede la
// squadra avversaria al completo: cinque turni su sei si decidevano senza
// che l'avversario pesasse per intero.
//
// Il caso peggiore era calcolato e mostrato nel riquadrino "peggio", ma non
// entrava nell'ordinamento. Misurato su 99 posizioni di draft: il primo
// consigliato scendeva sotto il 50% contro la risposta ovvia 28 volte su 99,
// ed era in media solo il quarto-quinto piu' robusto della lista. A Leggenda
// l'avversario quella risposta la trova.
//
// Ora ogni casella vuota vale per quello che ci puo' finire dentro:
//   - con probabilita' misurata, cioe' la pick rate di mappa (i 106 brawler
//     sommano 600% = sei caselle, quindi pickRate/600 e' la probabilita' che
//     quel brawler occupi UNA casella), rinormalizzata su chi e' disponibile;
//   - piu' una quota di caso peggiore, che rappresenta l'avversario che la
//     risposta la cerca. Quella quota e' un'ASSUNZIONE dichiarata, non una
//     misura: non ho gli esiti delle partite, quindi non c'e' niente su cui
//     calibrarla. E' legata al rango scelto nelle impostazioni, perche' e'
//     l'unica cosa che dice contro chi stai giocando.
// 0,4 da Mythic in su (dove l'avversario drafta guardando la tua squadra),
// 0,3 fino a Diamante. Entrambi dentro la parte buona della curva misurata.
const QUOTA_RISPOSTA = { 11: 0.4, 9: 0.3, 0: 0.35 };
function quotaRisposta() {
  const q = QUOTA_RISPOSTA[state.minPower];
  return q === undefined ? 0.3 : q;
}

// Probabilita' che una casella avversaria vuota sia occupata da ciascun
// brawler ancora disponibile. Calcolata una volta per turno, non per
// candidato: sono 106 candidati per 106 possibili avversari.
let _distAvversario = null;
function distribuzioneAvversario() {
  if (_distAvversario) return _distAvversario;
  const used = usedNames();
  const righe = [];
  let tot = 0;
  for (const b of BRAWLERS) {
    if (used.has(b.name)) continue;
    const p = comparizioneSu600(b.name);
    if (p <= 0) continue;
    righe.push({ name: b.name, p });
    tot += p;
  }
  for (const r of righe) r.p /= tot || 1;
  _distAvversario = righe;
  return righe;
}

// Il vantaggio di A contro B, centrato su A (vedi edgeCentrato).
function edgeDi(a, b) {
  return edgeCentrato(a, b);
}

// Aggregati per classe, calcolati una volta per turno. Servono alla
// scorciatoia qui sotto.
let _aggr = null;
function aggregatiAvversario() {
  if (_aggr) return _aggr;
  const dist = distribuzioneAvversario();
  const pClasse = new Map();
  const pDi = new Map();
  let sommaFav = 0;
  for (const r of dist) {
    const k = classOf(r.name);
    pClasse.set(k, (pClasse.get(k) || 0) + r.p);
    sommaFav += r.p * favoreMatchup(r.name);
    pDi.set(r.name, r.p);
  }
  _aggr = { pClasse, pDi, sommaFav };
  return _aggr;
}

// Quanto vale, per un candidato, una casella avversaria ANCORA VUOTA.
//
// La versione ovvia e' un ciclo su tutti i circa cento avversari possibili,
// per ognuno dei 106 candidati: diecimila valutazioni di coppia per turno, che
// col telefono quattro volte piu' lento portavano il ridisegno da 10 a 40ms —
// e la lentezza e' la cosa di cui l'utente si era gia' lamentato.
//
// La scorciatoia viene dall'algebra, non da un'approssimazione. Su una coppia
// STIMATA il vantaggio centrato si semplifica:
//   wr        = 50 + (forza_c - forza_t) + classe(c,t) + favore(c) - favore(t)
//   atteso    = 50 + (forza_c - forza_t)
//   centrato  = wr - atteso - favore(c) = classe(c,t) - favore(t)
// cioe' dipende solo dalle CLASSI dei due e dal favore dell'avversario. Quindi
//   somma_t P(t) * centrato(c,t) = somma_classi P(classe) * classe(c,classe) - somma_t P(t)*favore(t)
// che e' una somma su sette classi invece che su cento avversari. Restano da
// correggere solo le coppie di c davvero MISURATE (in media una decina) e il
// caso t == c. Da diecimila valutazioni a circa duemila.
//
// `script/verifica-scorciatoia.js` confronta questa versione con quella ovvia
// su tutte le mappe: se un giorno divergono, la scorciatoia e' rotta.
function edgeCasellaVuota(candidato, minacce) {
  const { pClasse, pDi, sommaFav } = aggregatiAvversario();
  const cc = classOf(candidato);
  let media = -sommaFav;
  for (const [k, p] of pClasse) media += p * classEdge(cc, k);
  // il candidato non puo' stare in entrambe le squadre
  const pSe = pDi.get(candidato);
  if (pSe !== undefined) media -= pSe * (classEdge(cc, cc) - favoreMatchup(candidato));
  // le coppie misurate: si toglie il termine stimato e si mette quello vero.
  // Si scorrono i VICINI del candidato (una decina), non tutti gli avversari
  // possibili: e' quello che rende utile la scorciatoia.
  for (const t of viciniMisurati(candidato)) {
    if (t === candidato) continue;
    const p = pDi.get(t);
    if (p === undefined) continue; // non e' fra gli avversari ancora disponibili
    media -= p * (classEdge(cc, classOf(t)) - favoreMatchup(t));
    media += p * edgeCentrato(candidato, t);
  }
  // Il caso peggiore si cerca fra le minacce PLAUSIBILI, non fra tutti e 106:
  // il peggior matchup in assoluto e' spesso un brawler che nessuno prende.
  //
  // La minaccia peggiore si porta dietro anche il nome e la win rate, perche'
  // servono al riquadrino "peggio" a schermo: prima le stesse otto minacce
  // venivano scorse due volte, qui e in residualRisk, per gli stessi numeri.
  let peggio = media;
  let quale = null;
  for (const t of minacce) {
    if (t === candidato) continue;
    const p = predictedWinRate(candidato, t);
    const e = p.wr - (BRAWLER_OVERALL[candidato] !== undefined && BRAWLER_OVERALL[t] !== undefined
      ? 50 + (BRAWLER_OVERALL[candidato] - BRAWLER_OVERALL[t]) : 50) - favoreMatchup(candidato);
    if (quale === null || e < quale.edge) quale = { enemy: t, wr: p.wr, edge: e, measured: p.measured };
    if (e < peggio) peggio = e;
  }
  // Il valore di una casella vuota e' l'ASPETTATIVA PURA, senza pessimismo.
  // Il pessimismo si applica una volta sola, a livello di squadra, in
  // computeSuggestions: applicarlo anche qui lo contava due volte, ed e'
  // esattamente il difetto che l'utente ha visto — Damian primo per base,
  // primo per matchup e primo per media (55,6 contro 53,7), terzo nella lista.
  return { valore: media, media, peggio, minacciaPeggiore: quale };
}

// Quella classe, su QUESTA mappa, rende almeno quanto la media della mappa?
// Serve a impedire che un'euristica scritta a mano scavalchi il dato misurato.
// Senza dati di mappa risponde di si': l'euristica resta l'unica cosa che c'e'.
const _resaClasse = new WeakMap();
function classeRendeQui(cls) {
  if (!state.map || !state.map.winRates) return true;
  let tab = _resaClasse.get(state.map);
  if (!tab) {
    const per = {}; let somma = 0, n = 0;
    for (const b of BRAWLERS) {
      const w = state.map.winRates[b.name];
      if (w === undefined) continue;
      (per[b.class] = per[b.class] || []).push(w);
      somma += w; n++;
    }
    const media = n ? somma / n : 50;
    tab = {};
    for (const k of Object.keys(per)) tab[k] = per[k].reduce((s, x) => s + x, 0) / per[k].length >= media;
    _resaClasse.set(state.map, tab);
  }
  return tab[cls] !== false;
}

function scoreCandidate(candidateName, candidateClass, ownClasses, enemyClasses, enemyNames, minacce, caselleVuote) {
  const ctx = contextualWinRate(candidateName);
  const base = ctx.base;
  const baseSource = ctx.source;
  const grezza = ctx.grezza;
  const pick = ctx.pick;

  // Contro chi è già schierato: media dei matchup, in punti di win rate.
  const names = enemyNames || [];
  const perEnemy = names.map((en) => {
    const p = predictedWinRate(candidateName, en);
    // `wr` e' la win rate da mostrare (verificabile sulle fonti); `edge` e' il
    // vantaggio CENTRATO, l'unico che puo' entrare nel punteggio senza
    // contare due volte la forza generale del candidato.
    // due pezzi: quanto ti scosta la COPPIA, e quanto e' forte lui rispetto
    // all'avversario tipico di questa mappa
    const coppia = edgeCentrato(candidateName, en);
    const forza = scartoForzaAvversario(en);
    return { enemy: en, wr: Math.round(p.wr * 10) / 10, edge: coppia + forza, coppia, forza, measured: p.measured };
  });
  // La media si fa su TUTTE E TRE le caselle avversarie, non solo su quelle
  // piene: una sola casella conosciuta e' un terzo della storia, non tutta.
  // Le vuote portano il valore atteso di chi ci puo' finire.
  const vuote = caselleVuote === undefined ? Math.max(0, 3 - perEnemy.length) : caselleVuote;
  const slotTotali = perEnemy.length + vuote;
  let sommaEdge = perEnemy.reduce((s, p) => s + p.edge, 0);
  let futuro = null;
  if (vuote > 0) {
    futuro = edgeCasellaVuota(candidateName, minacce || []);
    sommaEdge += futuro.valore * vuote;
  }
  const matchupAvg = slotTotali > 0 ? sommaEdge / slotTotali : 0;

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
    // "Manca la frontline, prendi un Tank o un Controller" e' un'euristica
    // generica, e su questa mappa puo' essere semplicemente falsa. Su Bridge
    // Too Far (Heist) Tank e Controller sono le DUE CLASSI PEGGIORI della
    // mappa (-2,5 e -1,9 sotto la media) e la regola dava lo stesso +2: e' cosi'
    // che Otis e' passato da sesto a primo, ed e' la segnalazione dell'utente.
    // Succede su 9 mappe su 33.
    //
    // Regola della casa: specifico batte generico. Il bonus si applica solo se
    // il dato MISURATO di questa mappa non lo smentisce.
    const hasFrontline = ownClasses.some((c) => c === "Tank" || c === "Controller");
    if (!hasFrontline && (candidateClass === "Tank" || candidateClass === "Controller") && classeRendeQui(candidateClass)) synergy += 2;
    const hasSupport = ownClasses.some((c) => c === "Support");
    if (!hasSupport && candidateClass === "Support" && classeRendeQui(candidateClass)) synergy += 1;
  }

  // Le "caratteristiche mappa" spuntate a mano servono SOLO quando non c'e' una
  // mappa con dati: sono un ripiego, non un'aggiunta. Il pannello si nasconde
  // quando scegli una mappa, ma le spunte restavano nello stato e continuavano
  // a sommarsi — doppio conteggio latente.
  //
  // E che sia doppio conteggio e' misurato, non supposto. Misurando l'ingombro
  // delle mappe dalle loro immagini (`script/apertura-mappe.py`) e togliendo
  // l'effetto della modalita', che da solo spiega l'84% della varianza, la win
  // rate di mappa dei singoli brawler segue gia' la geometria e con i segni
  // giusti: Piper -0,46 e Wendy -0,49 (i lungo raggio soffrono le mappe
  // ingombre), Nita +0,44 e Ash +0,31 (i corto raggio ci guadagnano), per
  // effetti da 2 a 8 punti sull'arco delle mappe. La geometria e' gia' dentro
  // il dato: aggiungerla a mano la conterebbe due volte.
  let traits = 0;
  if (!state.map || !state.map.winRates) {
    for (const trait of state.mapTraits) {
      traits += ((MAP_TRAIT_CLASS_BONUS[trait] || {})[candidateClass] || 0) * 2;
    }
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
    grezza: grezza === undefined ? undefined : r1(grezza),
    pick,
    mio: ctx.mio,
    generale: r1(ctx.generale),
    perEnemy,
    vuote,
    futuro: futuro ? { valore: r1(futuro.valore), media: r1(futuro.media), peggio: r1(futuro.peggio), minacciaPeggiore: futuro.minacciaPeggiore } : null,
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
  if (typeof PROFILO === "undefined") return true; // nessun profilo collegato: nessun filtro
  const p = (PROFILO[name] || {}).potenza;
  if (p === undefined) return true; // brawler troppo nuovo per stare nella fotografia: non lo escludo
  return p >= state.minPower;
}

// I tre brawler maxati che Classificata regala a stagione non compaiono nel
// profilo con la potenza vera, quindi un brawler escluso puo' essere in
// realta' giocabile. Per questo l'esclusione si puo' spegnere.
function filtroAttivo() {
  return state.minPower > 0 && typeof PROFILO !== "undefined";
}

function computeSuggestions() {
  const turn = currentTurn();
  if (!turn || turn.phase !== "pick") return [];

  const used = usedNames();
  const own = turn.team;
  const enemy = own === "A" ? "B" : "A";
  // I BUCHI VANNO TOLTI. Le caselle sono un array con posizioni fisse, e
  // togliere un pick lascia un `null` in mezzo: `usedNames()` lo scartava,
  // questi due no. Risultato visto nella schermata dell'utente: un
  // riquadrino "vs null 51% +0", cioe' un avversario fantasma che entrava
  // nella media dei matchup e la diluiva verso lo zero — proprio nella parte
  // che lui accusava di non fare i counter.
  const ownClasses = state.picks[own].filter(Boolean).map(classOf);
  const enemyNames = state.picks[enemy].filter(Boolean);
  const enemyClasses = enemyNames.map(classOf);

  const enemyLeft = state.sequence.filter((sq) => sq.phase === "pick" && sq.team === enemy && !nomeDelTurno(sq)).length;
  const threats = enemyLeft > 0 ? likelyEnemyPicks(8) : [];

  // La distribuzione di chi puo' ancora finire in una casella avversaria
  // dipende da chi e' gia' fuori dal tavolo: va ricalcolata a ogni turno.
  _distAvversario = null; _aggr = null;

  // Quanto pesa il caso peggiore. Zero se l'avversario non ha piu' pick: a
  // squadra avversaria completa non esiste nessuna risposta che possa ancora
  // arrivare, e tenerne conto sarebbe pessimismo inventato.
  //
  // E scala con QUANTE caselle gli restano. La quota di base descrive
  // l'avversario con tutte e tre le scelte ancora da fare: con una sola
  // casella libera ha una sola occasione di trovare la risposta, non tre.
  // Se ogni scelta ha probabilita' p di essere la risposta e la quota su tre
  // scelte e' Q, allora Q = 1-(1-p)^3, quindi su k scelte vale 1-(1-Q)^(k/3).
  // Con Q=0,4: 0,40 con tre caselle, 0,29 con due, 0,16 con una.
  const q = enemyLeft > 0 ? 1 - Math.pow(1 - quotaRisposta(), enemyLeft / 3) : 0;

  const mieiPick = filtroAttivo() && own === state.myTeam;
  const candidates = BRAWLERS
    .filter((b) => !used.has(b.name))
    .filter((b) => !mieiPick || schierabile(b.name))
    .map((b) => {
    const s = scoreCandidate(b.name, b.class, ownClasses, enemyClasses, enemyNames, threats, enemyLeft);
    // Il caso peggiore sta nella STESSA riga della media. Tenerli in due
    // classifiche separate obbligava a confrontarle a mano e non diceva
    // quale seguire — che è esattamente il dubbio che ha fatto sbagliare.
    // gia' calcolata dentro scoreCandidate: scorrere le stesse otto minacce
    // una seconda volta costava 3,5ms per ridisegno
    const risk = s.futuro ? s.futuro.minacciaPeggiore : threats.length ? residualRisk(b.name, threats) : null;
    const worstEdge = Math.min(
      s.perEnemy.length ? Math.min(...s.perEnemy.map((p) => p.edge)) : 0,
      risk ? risk.edge : 0
    );
    // ora il caso peggiore e' anche DENTRO il punteggio, per la sua quota:
    // il riquadrino "peggio" resta perche' dice quanto e' ripido lo scivolo,
    // non perche' sia l'unica cosa che ne tiene conto
    const floor = Math.max(5, Math.min(95, s.base + worstEdge));

    // IL CASO PEGGIORE ENTRA NEL PUNTEGGIO.
    //
    // Prima era calcolato, mostrato nel riquadrino "peggio" e ignorato
    // dall'ordinamento. Misurato su 132 posizioni di draft: il primo
    // consigliato crollava sotto il 50% contro la risposta migliore
    // 38 volte su 132. A Leggenda quella risposta l'avversario la trova, e
    // consigliare per la media e' consigliare per l'avversario distratto.
    //
    // Il punteggio e' quindi una miscela dei due numeri che l'app mostra
    // entrambi: media (avversario qualunque) e pavimento (avversario che la
    // risposta la cerca). La quota e' un'assunzione dichiarata — non ho gli
    // esiti delle partite su cui calibrarla — ma il COMPROMESSO e' misurato
    // (`script/calibra-quota-risposta.js`): a q=0,4 si lasciano 0,6 punti di
    // resa media e i crolli sotto il 50% passano da 38 a 11 su 132, cioe' si
    // guadagnano oltre quattro punti di pavimento per ogni punto di media
    // perso. Oltre q=0,5 il cambio scende sotto tre e la media inizia a
    // pesare: 0,4 e' il ginocchio della curva, non un numero tondo scelto.
    //
    // Zero quando l'avversario ha finito di scegliere: non c'e' piu' nessuna
    // risposta che possa arrivare, e il rischio sarebbe inventato.
    const media = s.total;
    const total = q > 0 ? Math.round((media * (1 - q) + floor * q) * 10) / 10 : media;
    return { name: b.name, class: b.class, ...s, risk, floor: Math.round(floor), media, total, q };
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
  if (usedNames().has(name)) return;
  contenitore(turn)[turn.k] = name;
  // La ricerca si svuota PRIMA di ridisegnare: svuotandola dopo, l'indizio
  // sotto la casella restava fermo sul testo vecchio.
  clearSearch();
  render();
}

// Toccare di nuovo un brawler già in campo lo toglie. È il rimedio
// all'errore più comune — toccare la faccia sbagliata mentre corre il
// timer — e non richiede di ricordarsi dove sta un pulsante "annulla".
// Toglie SOLO quello: il resto del draft non si muove.
function removeName(name) {
  for (const t of state.sequence) {
    if (nomeDelTurno(t) === name) {
      contenitore(t)[t.k] = null;
      clearSearch();
      render();
      return true;
    }
  }
  return false;
}

// Un tocco solo per entrambe le cose: se c'è già, lo toglie; se no, lo mette.
function toggleBrawler(name) {
  if (!removeName(name)) pickOrBan(name);
}

function undoLast() {
  for (let i = state.sequence.length - 1; i >= 0; i--) {
    const t = state.sequence[i];
    if (nomeDelTurno(t)) { contenitore(t)[t.k] = null; render(); return; }
  }
}

function skipBans() {
  const turn = currentTurn();
  if (!turn || turn.phase !== "ban") return;
  // I ban già inseriti restano validi: si tolgono solo le caselle di ban
  // ancora vuote, così il turno passa ai pick.
  state.sequence = state.sequence.filter((t) => t.phase !== "ban" || nomeDelTurno(t));
  render();
}

// Ricominciare da capo. Azzera anche la ricerca (restava scritta dentro la
// casella, e i suoi risultati sotto, come se il draft precedente non fosse
// finito) e riporta la pagina in cima: le caselle che si svuotano stanno in
// alto, e se le guardi da 400px piu' giu' il reset sembra non aver fatto
// niente.
function resetDraft(opts) {
  state.bans = { A: [], B: [] };
  state.picks = { A: [], B: [] };
  clearSearch();
  buildSequence();
  render();
  if (opts && opts.conferma) confermaReset();
}

// La conferma non e' un vezzo: se premi Reset a draft gia' vuoto — o se il
// tocco finisce a un pixel dal tasto — lo schermo resta identico nei due
// casi, e non c'e' modo di sapere se il tasto ha risposto. Per un secondo
// il tasto dice di si'.
let _timerConferma = null;
function confermaReset() {
  const btn = document.getElementById("reset-btn");
  if (!btn) return;
  window.scrollTo({ top: 0, behavior: "auto" });
  btn.classList.add("fatto");
  btn.textContent = "Azzerato";
  clearTimeout(_timerConferma);
  _timerConferma = setTimeout(() => {
    btn.classList.remove("fatto");
    btn.textContent = "Reset";
  }, 1100);
}

// L'ordine dei pick in Classificata è sempre 1-2-2-1: era un campo di testo
// modificabile ("A,B,B,A,A,B"), cioè un modo per rompere tutti i turni
// scrivendoci dentro una virgola di troppo. Ora è fisso.
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

// I ritratti mini delle righe dei consigli, in cache. Sono immagini
// incorporate come data URI: ricrearne sei a ogni ridisegno le fa
// ridecodificare al browser. E' la TERZA volta che questa trappola compare in
// questo file — prima le carte del roster (11ms -> 66ms), poi le caselle del
// palco (6,4ms), ora le righe dei consigli. La chiave porta il contesto perche'
// lo stesso nodo non puo' stare in due posti: se comparisse sia nei consigli
// sia nella ricerca, il secondo se lo porterebbe via.
const _mini = new Map();
function ritrattoMini(name, contesto) {
  const k = contesto + "|" + name;
  let el = _mini.get(k);
  if (!el) {
    const d = document.createElement("div");
    d.innerHTML = ritratto(name, "mini");
    el = d.firstChild;
    _mini.set(k, el);
  }
  return el;
}

function renderSlots(ruolo) {
  const team = ruolo === "mine" ? state.myTeam : state.myTeam === "A" ? "B" : "A";
  const bansEl = document.getElementById(`bans-${ruolo}`);
  const picksEl = document.getElementById(`picks-${ruolo}`);
  bansEl.innerHTML = "";
  picksEl.innerHTML = "";

  const totalBans = state.sequence.filter((s) => s.phase === "ban" && s.team === team).length;
  const totalPicks = state.sequence.filter((s) => s.phase === "pick" && s.team === team).length;

  for (let i = 0; i < totalBans; i++) bansEl.appendChild(makeSlot(state.bans[team][i], "ban", ruolo + i));
  for (let i = 0; i < totalPicks; i++) picksEl.appendChild(makeSlot(state.picks[team][i], "pick", ruolo + i));

  const side = document.getElementById(`side-${ruolo}`);
  if (side) {
    side.classList.toggle("team-a", team === "A");
    side.classList.toggle("team-b", team === "B");
  }
}

// Le caselle del palco, in cache. Contengono un <img> con l'immagine
// incorporata come data URI: ricrearle a ogni ridisegno significa far
// ridecodificare al browser dodici immagini per tocco. E' la stessa trappola
// che sulle carte del roster aveva portato il ridisegno da 11 a 66ms, e qui
// era rimasta: 6,4ms dei 27 del ridisegno se ne andavano in questo.
const _caselle = new Map();
function makeSlot(name, phase, indice) {
  const chiave = name ? phase + "|" + name : phase + "|vuota|" + indice;
  const memo = _caselle.get(chiave);
  if (memo) return memo;
  const div = costruisciSlot(name, phase);
  _caselle.set(chiave, div);
  return div;
}

function costruisciSlot(name, phase) {
  const div = document.createElement("div");
  div.className = "slot " + (name ? "filled" : "empty") + " " + phase;
  if (name) {
    div.title = `${name} — tocca per toglierlo`;
    div.addEventListener("click", () => removeName(name));
  }
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
  card.addEventListener("click", () => toggleBrawler(b.name));
  _carte.set(b.name, card);
  return card;
}

// I risultati della ricerca, subito sotto la casella.
//
// Prima l'unica risposta a quello che si scriveva era una riga di testo
// ("Invio → Wendy") e la griglia filtrata, che pero' sul telefono sta a 850px,
// cioe' fuori schermo: bisognava scrivere il nome intero e sperare. Adesso i
// candidati compaiono dove stai gia' guardando, e si toccano.
function renderSearchResults() {
  const box = document.getElementById("search-results");
  if (!box) return;
  const q = state.search.trim();
  if (!q) { box.hidden = true; box.replaceChildren(); return; }

  const used = usedNames();
  const turn = currentTurn();
  const trovati = visibleBrawlers().filter((b) => !used.has(b.name)).slice(0, 6);
  box.hidden = false;

  if (!trovati.length) {
    box.replaceChildren();
    box.innerHTML = `<p class="sr-vuoto">Nessun brawler con questo nome.</p>`;
    return;
  }

  const frag = document.createDocumentFragment();
  trovati.forEach((b, i) => {
    const riga = document.createElement("button");
    riga.type = "button";
    // Il primo e' quello che prende Invio: si vede, cosi' non serve leggere
    // un'etichetta a parte per sapere cosa succede premendo.
    riga.className = "sr-riga" + (i === 0 ? " primo" : "");
    riga.style.borderLeftColor = CLASS_COLORS[b.class] || "#666";
    const punteggio = _classifica.get(b.name);
    const fuori = filtroAttivo() && !schierabile(b.name) && turn && turn.team === state.myTeam;
    riga.innerHTML =
      `${ritratto(b.name, "mini")}` +
      `<span class="sr-nome">${b.name}` +
        (i === 0 ? ` <span class="sr-invio">Invio</span>` : "") +
        (fuori ? ' <span class="sr-fuori">non schierabile</span>' : "") +
      `</span>` +
      `<span class="sr-classe">${b.class}</span>` +
      `<span class="sr-punti">${punteggio === undefined ? "" : Math.round(punteggio) + "%"}</span>`;
    riga.addEventListener("click", () => toggleBrawler(b.name));
    frag.appendChild(riga);
  });
  box.replaceChildren(frag);
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
      // L'elenco qui sopra dice gia' chi ha trovato e cosa prende Invio.
      hint.textContent = "";
    } else {
      hint.textContent = turn.phase === "ban" ? "Tocca chi è stato bannato." : "Tocca chi è stato scelto.";
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
    const pot = typeof PROFILO !== "undefined" && PROFILO[b.name] ? PROFILO[b.name].potenza : undefined;
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
    const expected = p.wr - edgeCentrato(candidateName, t);
    // Si sceglie la minaccia col VANTAGGIO peggiore, non col win rate
    // assoluto piu' basso. Il pavimento e' `base + vantaggio`, quindi e' il
    // vantaggio a determinarlo: scegliendo per win rate assoluto, un brawler
    // forte in generale sembrava solido anche dove non lo e'. Su Wendy contro
    // Bull+Rosa il pavimento veniva 59% (minaccia R-T, vantaggio +8,3) invece
    // di 48% (minaccia Emz, vantaggio -2,7): undici punti di ottimismo, ed
    // esattamente sul pick che l'utente ha segnalato come consigliato troppo.
    const edge = p.wr - expected;
    if (worst === null || edge < worst.edge) {
      worst = { enemy: t, wr: p.wr, edge, measured: p.measured };
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
  const enemyNames = state.picks[enemy].filter(Boolean);
  const enemyLeft = state.sequence.filter((sq) => sq.phase === "pick" && sq.team === enemy && !nomeDelTurno(sq)).length;

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
// La riga di contesto (chip "Knockout / Flaring Phoenix / tutti i ranghi") è
// stata tolta: diceva la terza volta quello che già dicono il riassunto delle
// impostazioni e l'immagine della mappa al centro del palco.
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
"";
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
        <span class="sugg-name">${s.name}<span class="chip-row"><span class="echip meas ${s.use >= 2 ? "neg" : "est"}" title="quanto spesso viene scelto davvero: più è alto, più è probabile che te lo prendano">${s.use}% lo prende</span>${
          s.risposta
            ? `<span class="floor-chip ${s.risposta.valore < 52 ? "warn" : s.risposta.valore < 56 ? "mid" : "ok"}" title="Se glielo lasci, il tuo pick migliore contro di lui è ${s.risposta.chi} e vale circa ${s.risposta.valore}%. Sotto il 52% vuol dire che una risposta comoda non ce l'hai: è il ban che ti conviene di più. Sopra il 56% sai già gestirlo, e il ban rende meno.">rispondi ${s.risposta.valore}%</span>`
            : ""
        }</span></span>
        <span class="sugg-class">${s.class}</span>
        <span class="sugg-score" title="win rate su ${s.source}; l'ordine tiene conto anche di quanto viene scelto">${Math.round(s.wr)}%</span>
      `;
      row.insertBefore(ritrattoMini(s.name, "ban"), row.firstChild);
      row.addEventListener("click", () => toggleBrawler(s.name));
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

  // QUANTO VALE il migliore, rispetto al normale.
  //
  // Ricalibrato il 9/9 dopo due cambiamenti che hanno spostato la scala (il
  // record personale e la forza dell'avversario): su 396 posizioni con
  // avversari ESTRATTI DALLA PICK RATE VERA — non i piu' forti, che era
  // l'errore del test precedente e faceva sembrare che il punteggio scivolasse
  // di 13 punti — il primo consigliato sta fra 49,4% e 78,1%, mediana 62,3%.
  // Sotto il 59% ci si finisce nel 7% delle posizioni, sotto il 53% nell'1%.
  // Il numero grande a schermo si legge come un'approvazione anche quando
  // vale poco: qui gli si mette accanto il riferimento.
  //
  // La riga compare solo sotto la mediana: un avviso sempre presente diventa
  // sfondo e non lo legge piu' nessuno.
  const meglio = suggestions[0].total;
  if (meglio < 59) {
    const p = document.createElement("p");
    p.className = "hint scarso";
    p.innerHTML = meglio < 53
      ? `<strong>Non c'è niente di buono qui.</strong> Il migliore vale ${Math.round(meglio)}%: succede in una posizione su cento. Hanno preso bene loro. Prendi il meno peggio e giocatela.`
      : `<strong>Situazione sotto la media.</strong> Il migliore vale ${Math.round(meglio)}%, contro una mediana di 62%. Nessun pick ti fa vincere: la decide come giocate.`;
    el.appendChild(p);
  }
  suggestions.forEach((s, i) => {
    const row = document.createElement("div");
    row.className = "suggestion-row" + (i === 0 ? " top" : "");
    row.style.borderColor = CLASS_COLORS[s.class] || "#666";
    // Le etichette "trappola" e "raro" sono deduzioni sulla POPOLAZIONE: dicono
    // che il numero generale e' gonfiato o ingannevole. Quando ci sono
    // abbastanza partite TUE, quella deduzione non serve piu' — il tuo dato e'
    // la misura diretta di cio' che le etichette stimavano. Lasciarle produceva
    // righe che si contraddicono: "Surge trappola · tuo 60% su 5" e
    // "Wendy raro 0,3% · tuo 69% su 112".
    const datoMio = s.mio && s.mio.peso >= 0.4;
    const flagGrezzo = pickFlag(s.name);
    const flag = datoMio && flagGrezzo && flagGrezzo.kind === "trap" && s.mio.mio >= PROFILO_MEDIA ? null : flagGrezzo;
    const badge = flag
      ? `<span class="badge ${flag.kind}" title="${
          flag.kind === "trap"
            ? `Scelto dal ${flag.use}% dei giocatori ma vince solo il ${flag.wr}% delle volte: lo prendono più di quanto valga.`
            : `Vince il ${flag.wr}% delle volte ma lo sceglie solo il ${flag.use}%: quasi nessuno lo banna, quindi resta libero. Il rovescio: quel ${flag.wr}% è misurato su chi lo gioca abitualmente, che è poca gente e allenata. Se non lo sai già usare, aspettati meno.`
        }">${flag.kind === "trap" ? "trappola" : "sottovalutato"}</span>`
      : "";
    // Contro ciascun avversario si mostra la percentuale, non il residuo:
    // "vs Rosa 72%" si capisce, "+13.5" no.
    // Il riquadrino porta DUE numeri, e il secondo e' quello che conta.
    //
    // "vs Nita 78%" e' la percentuale di vittorie vera, verificabile sulle
    // fonti — ma comprende anche il fatto che tu sia in generale piu' forte di
    // Nita, che e' GIA' dentro la base del punteggio. Quello che sposta il
    // punteggio e' di quanto sei sopra il normale per quella coppia.
    //
    // Senza il secondo numero la lista sembrava sbagliata, e la segnalazione
    // e' arrivata: un pick con "vs Bolt 53% · vs Nita 78%" sotto uno con
    // "vs Bolt 29% · vs Nita 59%". Il colore ora segue lo scarto, non la
    // percentuale assoluta, per la stessa ragione.
    const chips = (s.perEnemy || [])
      .map((p) => {
        const sc = Math.round(p.edge);
        // il colore segue il numero MOSTRATO, non quello prima
        // dell'arrotondamento: un "+0" rosso e' un numero che non torna
        return `<span class="echip ${p.measured ? "meas" : "est"} ${sc > 0 ? "pos" : sc < 0 ? "neg" : "pari"}" title="${
          p.measured ? "Matchup misurato su partite reali" : "Previsione: differenza di forza + classe + quanto e' scomodo da affrontare"
        }: vinci il ${Math.round(p.wr * 10) / 10}% contro ${p.enemy}. Il ${sc >= 0 ? "+" : ""}${sc} è quanto questo è sopra o sotto il normale per questa coppia, ed è la parte che sposta il punteggio — il resto è forza generale, già contata nella base.">vs ${p.enemy} ${Math.round(p.wr)}% <b>${sc >= 0 ? "+" : ""}${sc}</b></span>`;
      })
      .join("");
    // Il riquadrino diventa un avviso quando il caso peggiore è molto più
    // basso della media: è lì che un pick apparentemente ottimo è fragile.
    const drop = (s.media === undefined ? s.total : s.media) - s.floor;
    const floorClass = s.floor < 50 || drop >= 12 ? "warn" : drop >= 7 ? "mid" : "ok";
    const floorChip =
      s.risk || (s.perEnemy && s.perEnemy.length)
        ? `<span class="floor-chip ${floorClass}" title="${s.risk ? "il peggio che ti può capitare, contro " + s.risk.enemy : "contro l'avversario in campo che ti va peggio"}">peggio ${s.floor}%</span>`
        : "";
    // Quando il pick è raro, la correzione ha spostato parecchio il numero:
    // va detto, altrimenti sembra che l'app "non veda" un brawler forte.
    // Il tuo record con quel brawler: e' la cosa che sposta di piu' il numero,
    // quindi deve essere la piu' visibile. Senza, l'app sembrerebbe cambiare
    // idea senza motivo su un brawler che ieri consigliava.
    const mio = s.mio;
    const chipMio = mio
      ? `<span class="mio-chip ${mio.scarto <= -4 ? "giu" : mio.scarto >= 4 ? "su" : "pari"}" title="Le TUE partite: ${Math.round(mio.mio)}% di vittorie su ${mio.partite}, contro la tua media in Classificata del ${PARTITE_RANKED_MEDIA}%. Conta insieme il tuo record col brawler${mio.brawler ? " (" + Math.round(100*mio.brawler.v/mio.brawler.n) + "% su " + mio.brawler.n + ")" : ""}, quello su questa mappa${mio.mappaRec ? " (" + Math.round(100*mio.mappaRec.v/mio.mappaRec.n) + "% su " + mio.mappaRec.n + ")" : ""} e la loro combinazione, e sposta il punteggio di ${mio.scarto > 0 ? "+" : ""}${Math.round(mio.scarto * 10) / 10} punti${mio.tagliato ? " (fermato al tetto di 8: il tuo record pesa, ma non decide da solo)" : ""}. Senza il tuo record questo pick varrebbe ${s.generale}%.">tuo ${Math.round(mio.mio)}% su ${mio.partite}${mio.dove ? " " + mio.dove : ""}</span>`
      : "";
    const raro = s.pick !== undefined && s.pick < 1.5 && !datoMio;
    const rarita = raro
      ? `<span class="risk-chip warn" title="Lo sceglie solo lo ${s.pick.toFixed(1)}% delle squadre. Il dato grezzo dice ${Math.round(s.grezza)}%, ma è misurato su chi lo gioca apposta: per te vale circa ${Math.round(s.base)}%.">raro ${s.pick.toFixed(1)}%</span>`
      : "";
    const parts = [`base ${s.base}% (${s.baseSource})`];
    if (mio) parts.push(`il generale direbbe ${s.generale}%, il tuo record lo sposta di ${mio.scarto > 0 ? "+" : ""}${Math.round(mio.scarto * 10) / 10}`);
    if (s.grezza !== undefined && Math.abs(s.grezza - s.base) >= 1.5) {
      parts.push(`grezzo ${Math.round(s.grezza)}% corretto per rarità`);
    }
    if (typeof PROFILO !== "undefined" && PROFILO[s.name]) parts.push(`tuoi trofei: ${PROFILO[s.name].trofei}`);
    if (s.matchupAvg) parts.push(`matchup ${s.matchupAvg > 0 ? "+" : ""}${s.matchupAvg}${s.vuote ? " (su 3 caselle, " + s.vuote + " ancora vuot" + (s.vuote > 1 ? "e" : "a") + ")" : ""}`);
    if (s.synergy) parts.push(`composizione ${s.synergy > 0 ? "+" : ""}${s.synergy}`);
    if (s.traits) parts.push(`tratti mappa ${s.traits > 0 ? "+" : ""}${s.traits}`);
    // Il numero mostrato e' la miscela, quindi il dettaglio DEVE arrivare
    // fino a lui: un totale che non torna con le sue righe non e' verificabile.
    if (s.q > 0 && s.media !== undefined) {
      parts.push(`= media ${Math.round(s.media * 10) / 10}%`);
      parts.push(`mostrato: ${Math.round((1 - s.q) * 100)}% della media + ${Math.round(s.q * 100)}% del caso peggiore (${s.floor}%), perché all'avversario resta${s.vuote > 1 ? "no " + s.vuote + " scelte" : " una scelta"} per trovare la risposta`);
    }
    row.innerHTML = `
      <span class="sugg-name">${s.name}${badge}${chips || floorChip || rarita || chipMio ? `<span class="chip-row">${chips}${floorChip}${chipMio}${rarita}</span>` : ""}</span>
      <span class="sugg-class">${s.class}</span>
      <span class="sugg-score" title="${parts.join(" · ")}">${Math.round(s.total)}%</span>
    `;
    row.insertBefore(ritrattoMini(s.name, "sugg"), row.firstChild);
    row.addEventListener("click", () => toggleBrawler(s.name));
    el.appendChild(row);
  });
}

function render() {
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
  renderSearchResults();
  renderMapArt();
  renderFirstPick();
  updateSetupUI();
}

function initFilters() {
  const box = document.getElementById("search-box");
  box.addEventListener("input", (e) => {
    state.search = e.target.value;
    renderGrid();
    renderSearchResults();
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
function renderFirstPick() {
  const b = document.getElementById("first-pick");
  if (!b) return;
  const primo = state.firstTeam === state.myTeam;
  b.textContent = primo ? "Scelgo per primo" : "Sceglie per primo l'avversario";
  b.setAttribute("aria-pressed", String(primo));
  b.classList.toggle("on", primo);
}

function updateSetupUI() {
  const box = document.getElementById("setup");
  const traits = document.getElementById("traits-wrap");
  if (traits) traits.hidden = !!state.map;
  if (!box) return;
  const sum = box.querySelector("#setup-summary");
  if (sum) {
    const dove = state.map ? `${state.mode} · ${state.map.name}` : state.mode || "nessuna modalità";
    const chi = state.firstTeam === state.myTeam ? "scelgo per primo" : "sceglie prima l'avversario";
    // Il filtro potenza cambia parecchio i consigli: se è attivo va detto
    // qui, altrimenti uno non capisce perché certi brawler non compaiono.
    const pw = filtroAttivo()
      // Conta solo quelli di cui SO la potenza. schierabile() lascia passare
      // anche i brawler assenti dalla fotografia (troppo nuovi), ma contarli
      // qui gonfierebbe il numero: direbbe 51 quando ne posso schierare 49.
      ? ` · solo i miei da potenza ${state.minPower} in su (${BRAWLERS.filter((b) => (PROFILO[b.name] || {}).potenza >= state.minPower).length})`
      : "";
    sum.textContent = box.open
      ? "Impostazioni partita — tocca per chiudere"
      : `${dove} · ${chi}${pw} · tocca per cambiare`;
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

// L'immagine della mappa al centro del palco. Non è decorazione: la mappa si
// sceglie da una tendina di nomi che si somigliano, e vederla è il modo più
// rapido per accorgersi di aver selezionato quella sbagliata.
function renderMapArt() {
  const el = document.getElementById("map-art");
  if (!el) return;
  const key = state.map ? `${state.map.mode}|${state.map.name}` : null;
  const src = key && typeof MAP_IMGS !== "undefined" ? MAP_IMGS[key] : null;
  el.innerHTML = src
    ? `<img src="${src}" alt="Mappa ${state.map.name}" loading="lazy" decoding="async" /><span>${state.map.name}</span>`
    : "";
  el.hidden = !src;
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

  document.getElementById("first-pick").addEventListener("click", () => {
    state.firstTeam = state.firstTeam === "A" ? "B" : "A";
    resetDraft();
  });
  // Delegato sul documento invece che sul singolo nodo: il tasto sta in una
  // barra appiccicata in cima, e un ascoltatore legato al nodo si perde se
  // quel nodo viene ricreato. Cosi' il Reset funziona comunque.
  document.addEventListener("click", (e) => {
    const t = e.target && e.target.closest ? e.target.closest("#reset-btn") : null;
    if (t) resetDraft({ conferma: true });
  });
  const ban = document.getElementById("use-bans");
  ban.value = String(state.bansPerTeam);
  ban.addEventListener("change", (e) => {
    state.bansPerTeam = Number(e.target.value) || 0;
    resetDraft();
  });

  const pw = document.getElementById("min-power");
  pw.value = String(state.minPower);
  pw.addEventListener("change", (e) => {
    state.minPower = Number(e.target.value) || 0;
    render();
  });

  document.getElementById("setup").addEventListener("toggle", updateSetupUI);
});
