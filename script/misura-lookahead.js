// GUARDARE UNA MOSSA AVANTI CONVIENE? Misurato, non assunto.
//
// Da dove viene la domanda. La ricerca sui draft dei MOBA dice una cosa sola e
// la dice sempre: scegliere il pick migliore ADESSO (greedy) e' suboptimale,
// perche' non tiene conto di come la tua scelta apre o chiude le risposte
// dell'avversario. "The Art of Drafting" (arXiv 1806.10130) misura un
// vantaggio del 5-8% per la ricerca ad albero (MCTS) contro il greedy. Le guide
// dei giocatori dicono la stessa cosa a parole: al primo pick prendi un
// generalista senza counter secchi, all'ultimo pick puoi permetterti lo
// specialista «perche' nessuno puo' counterare il tuo counter».
//
// Il mio punteggio e' greedy con un correttivo: mescola la media con il caso
// peggiore secondo un peso q assunto. Questo script chiede se un vero giro di
// lookahead — «scelgo c, loro rispondono al meglio, com'e' il tabellone poi» —
// batte il greedy, e di quanto.
//
// LA FUNZIONE DI VALUTAZIONE e' quella della fonte (probabilitaTabellone),
// perche' e' l'unica calibrata su esiti veri: Brier fra 0,225 e 0,237 secondo la
// modalita', su 8.000-12.800 partite, contro 0,25 di chi indovina.
//
// LIMITE DA DICHIARARE: la stessa funzione fa da giudice E da modello
// dell'avversario. Quindi la misura dice «il lookahead migliora il tabellone
// secondo questo giudice», non «vinci piu' partite». Per la seconda servirebbero
// gli esiti con i pick avversari, che non ho (il registro del tracker da' mappa,
// brawler ed esito, non i pick dei nemici). E' lo stesso limite che hanno i
// lavori accademici quando valutano in simulazione.
const { carica } = require("./carica-app.js");
const a = carica();
a.state.minPower = Number(process.argv[2] || 11);
const K = Number(process.argv[3] || 18); // quanti candidati per parte

function prep(map, ban) {
  a.state.mode = map.mode; a.state.map = map;
  a.state.bans = { A: [], B: [] }; a.state.picks = { A: [], B: [] };
  a.buildSequence();
  a.state.bans.A = ban.slice(0, 3); a.state.bans.B = ban.slice(3, 6);
}
// I candidati plausibili per una parte: i piu' giocati su questa mappa fra i
// disponibili. Per me vale anche il filtro di potenza; per loro no.
function pool(mio, esclusi) {
  const fuori = new Set([...a.usedNames(), ...esclusi]);
  return a.BRAWLERS
    .filter((b) => !fuori.has(b.name) && (!mio || a.schierabile(b.name)))
    .map((b) => ({ n: b.name, p: a.comparizioneSu600(b.name) }))
    .sort((x, y) => y.p - x.p)
    .slice(0, K)
    .map((x) => x.n);
}
const val = (miei, loro) => {
  const p = a.probabilitaTabellone(miei, loro);
  return p === null ? 0.5 : p;
};

// La sequenza di chi sceglie, dal turno corrente in poi.
function turniRimasti() {
  const out = [];
  for (const t of a.state.sequence) {
    if (t.phase !== "pick") continue;
    if (a.nomeDelTurno(t)) continue;
    out.push(t.team);
  }
  return out;
}

// Completa il draft e torna la probabilita' finale dal punto di vista di `io`.
//
// `avversario` dice come gioca l'altro, e serve a controllare se il vantaggio
// del lookahead e' vero o se sta solo sfruttando l'ipotesi:
//   "risposta"  sceglie la risposta migliore secondo il giudice (l'ipotesi del
//               lookahead: se lo valuto con lo stesso modello che gli ho dato,
//               il vantaggio e' garantito per costruzione, quindi non prova nulla)
//   "popolare"  sceglie il brawler piu' giocato su questa mappa, che e' quello
//               che fa la gente in ladder. Se il vantaggio regge qui, e' vero.
function completa(io, miei, loro, turni, avversario) {
  miei = miei.slice(); loro = loro.slice();
  for (const t of turni) {
    const mio = t === io;
    const cand = pool(mio, [...miei, ...loro]);
    if (!cand.length) break;
    let best = null;
    if (mio) {
      let bv = -Infinity;
      for (const c of cand) { const v = val([...miei, c], loro); if (v > bv) { bv = v; best = c; } }
    } else if (avversario === "popolare") {
      best = cand[0]; // pool e' ordinato per pick rate di mappa
    } else {
      let bv = Infinity;
      for (const c of cand) { const v = val(miei, [...loro, c]); if (v < bv) { bv = v; best = c; } }
    }
    if (best === null) break;
    if (mio) miei.push(best); else loro.push(best);
  }
  return val(miei, loro);
}

const righe = [];
const ban = ["Mortis", "Kenji", "Edgar", "Buzz", "Melodie", "Lily"];
for (const map of a.MAPS) {
  if (!map.winRates) continue;
  for (const [nE, nO] of [[0, 0], [1, 0], [2, 1], [3, 2]]) {
    prep(map, ban);
    const prob = a.likelyEnemyPicks(30).filter((x) => !a.usedNames().has(x));
    a.state.picks.B = prob.slice(0, nE);
    a.state.picks.A = prob.slice(nE, nE + nO);
    const turno = a.currentTurn();
    if (!turno || turno.phase !== "pick") continue;
    const io = turno.team;
    const miei = a.state.picks[io].filter(Boolean);
    const loro = a.state.picks[io === "A" ? "B" : "A"].filter(Boolean);
    const dopo = turniRimasti().slice(1); // i turni dopo il mio
    const cand = pool(true, [...miei, ...loro]);
    if (!cand.length) continue;

    // GREEDY: il tabellone migliore adesso
    let gN = null, gV = -Infinity;
    // LOOKAHEAD: il tabellone migliore DOPO la loro risposta migliore
    let lN = null, lV = -Infinity;
    const loroTocca = dopo.length > 0 && dopo[0] !== io;
    for (const c of cand) {
      const subito = val([...miei, c], loro);
      if (subito > gV) { gV = subito; gN = c; }
      let dopoRisposta = subito;
      if (loroTocca) {
        let peggio = Infinity;
        for (const r of pool(false, [...miei, c, ...loro])) {
          const v = val([...miei, c], [...loro, r]);
          if (v < peggio) peggio = v;
        }
        dopoRisposta = peggio;
      }
      if (dopoRisposta > lV) { lV = dopoRisposta; lN = c; }
    }
    // E cosa sceglie L'APP COM'E' ADESSO: e' la domanda che decide se vale la
    // pena cambiarla. L'app non e' greedy nudo — mescola la media col caso
    // peggiore secondo q, che e' un lookahead povero ma non e' zero.
    const sug = a.computeSuggestions();
    const aN = sug.length ? sug[0].name : gN;
    const fine = (chi, avv) => completa(io, [...miei, chi], loro, dopo, avv);
    righe.push({
      mappa: map.name, nE, gN, lN, aN,
      uguale: gN === lN,
      fineG: fine(gN, "risposta"), fineL: fine(lN, "risposta"), fineA: fine(aN, "risposta"),
      popG: fine(gN, "popolare"), popL: fine(lN, "popolare"), popA: fine(aN, "popolare"),
    });
  }
}

const n = righe.length;
const diversi = righe.filter((r) => !r.uguale);
const med = (k, l) => l.reduce((s, r) => s + r[k], 0) / (l.length || 1);
console.log(`posizioni: ${n} · candidati per parte: ${K} · rango ${a.state.minPower}`);
console.log(`\nil lookahead sceglie un brawler DIVERSO dal greedy: ${diversi.length}/${n}`);
console.log(`\nprobabilita' finale del tabellone (giudice: la calibrazione della fonte)`);
console.log(`  su tutte le posizioni    greedy ${(100 * med("fineG", righe)).toFixed(2)}%   lookahead ${(100 * med("fineL", righe)).toFixed(2)}%   differenza ${(100 * (med("fineL", righe) - med("fineG", righe))).toFixed(2)} punti`);
if (diversi.length) {
  console.log(`  dove sceglie diverso     greedy ${(100 * med("fineG", diversi)).toFixed(2)}%   lookahead ${(100 * med("fineL", diversi)).toFixed(2)}%   differenza ${(100 * (med("fineL", diversi) - med("fineG", diversi))).toFixed(2)} punti`);
  const meglio = diversi.filter((r) => r.fineL > r.fineG).length;
  console.log(`  il lookahead finisce meglio in ${meglio}/${diversi.length} dei casi in cui cambia idea`);
}
console.log(`\nper posizione nel draft:`);
for (const k of [0, 1, 2, 3]) {
  const l = righe.filter((r) => r.nE === k);
  if (!l.length) continue;
  const d = l.filter((r) => !r.uguale).length;
  console.log(`  ${k} avversari in campo: cambia idea ${d}/${l.length}, differenza ${(100 * (med("fineL", l) - med("fineG", l))).toFixed(2)} punti`);
}
console.log(`\nCONTROLLO DI ROBUSTEZZA — e se l'avversario NON gioca la risposta migliore?`);
console.log(`  (sceglie il piu' giocato sulla mappa, che e' cio' che fa la gente in ladder)`);
console.log(`  su tutte le posizioni    greedy ${(100 * med("popG", righe)).toFixed(2)}%   lookahead ${(100 * med("popL", righe)).toFixed(2)}%   differenza ${(100 * (med("popL", righe) - med("popG", righe))).toFixed(2)} punti`);
if (diversi.length) {
  console.log(`  dove sceglie diverso     greedy ${(100 * med("popG", diversi)).toFixed(2)}%   lookahead ${(100 * med("popL", diversi)).toFixed(2)}%   differenza ${(100 * (med("popL", diversi) - med("popG", diversi))).toFixed(2)} punti`);
}

console.log(`\nE L'APP COM'E' ADESSO? (il suo punteggio, col caso peggiore pesato q)`);
console.log(`  avversario che risponde al meglio: app ${(100 * med("fineA", righe)).toFixed(2)}%   greedy ${(100 * med("fineG", righe)).toFixed(2)}%   lookahead ${(100 * med("fineL", righe)).toFixed(2)}%`);
console.log(`  avversario che gioca il popolare  : app ${(100 * med("popA", righe)).toFixed(2)}%   greedy ${(100 * med("popG", righe)).toFixed(2)}%   lookahead ${(100 * med("popL", righe)).toFixed(2)}%`);
console.log(`  l'app sceglie come il lookahead in ${righe.filter((r) => r.aN === r.lN).length}/${n}, come il greedy in ${righe.filter((r) => r.aN === r.gN).length}/${n}`);

console.log(`\nprimi casi in cui cambia idea:`);
for (const r of diversi.slice(0, 8)) {
  console.log(`  ${r.mappa.padEnd(20)} ${r.nE} nemici · greedy ${r.gN} (${(100 * r.fineG).toFixed(1)}%) -> lookahead ${r.lN} (${(100 * r.fineL).toFixed(1)}%)`);
}
