// Quali brawler conviene portare a potenza 11.
//
// La domanda non e' "quali sono forti in assoluto" — quello lo dice qualsiasi
// tier list — ma "quanto migliora il MIO draft se ce l'ho". Un brawler
// fortissimo che pero' e' solo il quarto su ogni mappa non cambia niente,
// perche' il primo ce l'ho gia'; un brawler che e' il migliore su cinque mappe
// dove oggi ho poco vale molto di piu'.
//
// Quindi si misura il GUADAGNO MARGINALE: su ogni mappa, quanto sale il
// punteggio del mio pick migliore se aggiungo quel brawler a quelli che posso
// gia' schierare. Piu' due misure complementari:
//  - quante volte sarebbe il primo consigliato come RISPOSTA, cioe' con
//    avversari gia' in campo (un counter vale anche se non e' mai il migliore
//    "a freddo");
//  - su quante mappe entrerebbe fra i primi tre.
const { carica } = require("./carica-app.js");
const a = carica();

const SOGLIA = Number(process.argv[2] || 11);
a.state.minPower = SOGLIA;

const potenza = (n) => (a.PROFILO[n] || {}).potenza;
const trofei = (n) => (a.PROFILO[n] || {}).trofei;
const bloccati = a.BRAWLERS.filter((b) => potenza(b.name) !== undefined && potenza(b.name) < SOGLIA).map((b) => b.name);
const sbloccati = a.BRAWLERS.filter((b) => potenza(b.name) >= SOGLIA).map((b) => b.name);
console.log(`soglia potenza ${SOGLIA} · gia' schierabili ${sbloccati.length} · bloccati ${bloccati.length}\n`);

// punteggio di un candidato nella posizione corrente (stessa logica dell'app)
function punteggio(nome, en, ownClasses, minacce, vuote) {
  const b = a.BRAWLERS.find((x) => x.name === nome);
  if (!b) return null;
  const s = a.scoreCandidate(nome, b.class, ownClasses, en.map(a.classOf), en, minacce, vuote);
  const risk = s.futuro ? s.futuro.minacciaPeggiore : null;
  const worst = Math.min(s.perEnemy.length ? Math.min(...s.perEnemy.map((p) => p.edge)) : 0, risk ? risk.edge : 0);
  const floor = Math.max(5, Math.min(95, s.base + worst));
  const q = vuote > 0 ? 1 - Math.pow(1 - (SOGLIA === 11 ? 0.4 : 0.3), vuote / 3) : 0;
  return s.total * (1 - q) + floor * q;
}

const acc = {};
for (const n of bloccati) acc[n] = { guadagno: 0, mappeMigliore: 0, top3: 0, primoComeRisposta: 0, posizioni: 0 };

let nStati = 0;
for (const map of a.MAPS) {
  for (const [nE, nO] of [[0, 0], [1, 0], [2, 1]]) {
    a.state.mode = map.mode; a.state.map = map;
    a.state.bans = { A: [], B: [] }; a.state.picks = { A: [], B: [] };
    a.buildSequence();
    // NIENTE ban forzati. Bannare sempre le sei minacce migliori sembrava
    // realistico ed era una trappola: i brawler che varrebbe di piu' avere
    // sono esattamente quelli che quel finto avversario bannava sempre, e
    // il loro valore risultava vicino a zero. In un draft vero i ban sono
    // sei su cento e cambiano ogni partita.
    a.state.bansPerTeam = 0;
    a.buildSequence();
    const liberi = a.likelyEnemyPicks(20).filter((x) => !a.usedNames().has(x));
    a.state.picks.B = liberi.slice(0, nE);
    a.state.picks.A = liberi.slice(nE, nE + nO);
    a.computeSuggestions(); // ricostruisce distribuzione e aggregati del turno
    const en = a.state.picks.B;
    const ownClasses = a.state.picks.A.map(a.classOf);
    const vuote = 3 - en.length;
    const minacce = a.likelyEnemyPicks(8);
    const usati = a.usedNames();

    // il meglio che posso fare OGGI
    let migliore = -Infinity;
    for (const n of sbloccati) {
      if (usati.has(n)) continue;
      const v = punteggio(n, en, ownClasses, minacce, vuote);
      if (v !== null && v > migliore) migliore = v;
    }
    // e con ciascun bloccato aggiunto
    const conBloccato = [];
    for (const n of bloccati) {
      if (usati.has(n)) continue;
      const v = punteggio(n, en, ownClasses, minacce, vuote);
      if (v === null) continue;
      conBloccato.push({ n, v });
      acc[n].posizioni++;
      acc[n].guadagno += Math.max(0, v - migliore);
      if (v > migliore) { acc[n].mappeMigliore++; if (nE > 0) acc[n].primoComeRisposta++; }
    }
    // top 3 fra tutti (sbloccati + bloccati)
    const tutti = [];
    for (const n of sbloccati) { if (!usati.has(n)) { const v = punteggio(n, en, ownClasses, minacce, vuote); if (v !== null) tutti.push({ n, v }); } }
    for (const c of conBloccato) tutti.push(c);
    tutti.sort((x, y) => y.v - x.v);
    for (const c of tutti.slice(0, 3)) if (acc[c.n]) acc[c.n].top3++;
    nStati++;
  }
}

const righe = Object.entries(acc)
  .map(([n, r]) => ({
    n, pot: potenza(n), tro: trofei(n),
    guadagnoMedio: r.posizioni ? r.guadagno / r.posizioni : 0,
    guadagnoTot: r.guadagno, migliore: r.mappeMigliore, top3: r.top3, risposta: r.primoComeRisposta,
    passi: SOGLIA - potenza(n),
  }))
  .filter((r) => r.guadagnoTot > 0 || r.top3 > 0);
righe.sort((x, y) => y.guadagnoTot - x.guadagnoTot);

console.log(`posizioni di draft valutate: ${nStati} (33 mappe x 3 momenti)\n`);
console.log("nome           pot  passi  trofei   sarebbe il migliore   nei primi 3   guadagno medio quando migliora");
console.log("-------------  ---  -----  ------   -------------------   -----------   ------------------------------");
for (const r of righe.slice(0, 22)) {
  const gm = r.migliore ? r.guadagnoTot / r.migliore : 0;
  console.log(
    r.n.padEnd(14),
    ("p" + r.pot).padEnd(4),
    String(r.passi).padStart(4),
    String(r.tro).padStart(7),
    String(r.migliore + "/" + nStati).padStart(20),
    String(r.top3).padStart(13),
    ("  +" + gm.toFixed(2) + " punti").padStart(30)
  );
}
console.log(`\nbloccati che non migliorerebbero MAI il pick migliore: ${bloccati.length - righe.length} su ${bloccati.length}`);

// ---- DOVE SONO I BUCHI -------------------------------------------------
// L'altra faccia della domanda: non "quanto guadagno se aggiungo X" ma "su
// quali mappe quello che posso schierare oggi non basta". Si misura al primo
// pick, senza ban e senza avversari: e' la fotografia piu' pulita di quanto
// il mio roster copre quella mappa.
console.log("\n\n==== DOVE SONO I BUCHI ====\n");
const buchi = [];
for (const map of a.MAPS) {
  a.state.mode = map.mode; a.state.map = map;
  a.state.bansPerTeam = 0;
  a.state.bans = { A: [], B: [] }; a.state.picks = { A: [], B: [] };
  a.buildSequence();
  a.computeSuggestions();
  const minacce = a.likelyEnemyPicks(8);
  let mio = { v: -Infinity, n: null }, chiunque = { v: -Infinity, n: null };
  for (const b of a.BRAWLERS) {
    const v = punteggio(b.name, [], [], minacce, 3);
    if (v === null) continue;
    if (v > chiunque.v) chiunque = { v, n: b.name };
    if (potenza(b.name) >= SOGLIA && v > mio.v) mio = { v, n: b.name };
  }
  buchi.push({ mappa: map.name, modo: map.mode, mio: mio.v, chiMio: mio.n, top: chiunque.v, chiTop: chiunque.n, gap: chiunque.v - mio.v });
}
buchi.sort((x, y) => y.gap - x.gap);
console.log("mappe dove il roster ti costa di piu' (primo pick, niente ban):\n");
console.log("mappa               modalita'      il tuo meglio        il meglio in assoluto     costo");
for (const b of buchi.slice(0, 12)) {
  console.log(
    b.mappa.padEnd(20), b.modo.padEnd(12),
    (b.chiMio + " " + b.mio.toFixed(1) + "%").padEnd(21),
    (b.chiTop + " " + b.top.toFixed(1) + "%").padEnd(25),
    "-" + b.gap.toFixed(1)
  );
}
const medio = buchi.reduce((s, b) => s + b.gap, 0) / buchi.length;
console.log(`\ncosto medio su tutte le 33 mappe: -${medio.toFixed(2)} punti`);
console.log(`mappe dove non perdi niente (hai gia' il migliore): ${buchi.filter(b => b.gap < 0.05).length}/33`);
// chi chiude piu' buchi
const chiude = {};
for (const b of buchi) if (b.gap > 0.05) chiude[b.chiTop] = (chiude[b.chiTop] || 0) + b.gap;
const cl = Object.entries(chiude).sort((x, y) => y[1] - x[1]);
console.log("\nchi chiuderebbe piu' buchi (somma dei punti recuperati):");
for (const [n, v] of cl.slice(0, 10)) {
  console.log(`  ${n.padEnd(14)} +${v.toFixed(1)} punti · potenza ${potenza(n)} (${SOGLIA - potenza(n)} livelli) · ${trofei(n)} trofei`);
}
