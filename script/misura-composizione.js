// Il bonus di composizione (-2 stessa classe, +2 se manca frontline e sei
// Tank/Controller, +1 se manca il support e sei Support) e' l'ultima euristica
// SCRITTA A MANO rimasta nel punteggio: non e' mai stata calibrata, perche'
// nessuna fonte pubblica dati sulle composizioni di squadra.
//
// Non posso validarla direttamente. Posso pero' misurare una cosa decisiva:
// quando quel bonus CAMBIA il primo consigliato, il brawler che promuove ha
// una win rate misurata sulla mappa piu' alta o piu' bassa di quello che
// scavalca? Se e' piu' bassa, l'euristica sta spingendo contro il dato.
const { carica } = require("./carica-app.js");
const a = carica();
a.state.minPower = 11;
const pot = (n) => (a.PROFILO[n] || {}).potenza;

// modo: "piena" (com'e' ora), "solo-penalita" (solo il -2 stessa classe),
// "niente" (nessun bonus di composizione)
function classifica(en, ownClasses, minacce, vuote, modo) {
  const used = a.usedNames();
  const righe = [];
  for (const b of a.BRAWLERS) {
    if (used.has(b.name) || pot(b.name) < 11) continue;
    const s = a.scoreCandidate(b.name, b.class, modo === "niente" ? [] : ownClasses, en.map(a.classOf), en, minacce, vuote);
    let corr = 0;
    if (modo === "solo-penalita") {
      // si toglie la parte "manca la frontline / manca il support", si tiene il -2
      const mancaFront = ownClasses.length > 0 && !ownClasses.some((c) => c === "Tank" || c === "Controller");
      const mancaSup = ownClasses.length > 0 && !ownClasses.some((c) => c === "Support");
      if (mancaFront && (b.class === "Tank" || b.class === "Controller")) corr -= 2;
      if (mancaSup && b.class === "Support") corr -= 1;
    }
    const risk = s.futuro ? s.futuro.minacciaPeggiore : null;
    const worst = Math.min(s.perEnemy.length ? Math.min(...s.perEnemy.map((p) => p.edge)) : 0, risk ? risk.edge : 0);
    const q = vuote > 0 ? 1 - Math.pow(0.6, vuote / 3) : 0;
    righe.push({ n: b.name, v: (s.total + corr) * (1 - q) + Math.max(5, Math.min(95, s.base + worst)) * q, syn: s.synergy });
  }
  righe.sort((x, y) => y.v - x.v);
  return righe;
}

const modi = ["piena", "solo-penalita", "niente"];
const res = {}; for (const m of modi) res[m] = { wr: 0, n: 0 };
let cambi = 0, tot = 0, sommaDiffWr = 0, esempi = [];
for (const map of a.MAPS) {
  for (const [nE, nO] of [[1, 2], [2, 2], [3, 2]]) { // posizioni con alleati gia' in campo
    a.state.mode = map.mode; a.state.map = map;
    a.state.bansPerTeam = 0;
    a.state.bans = { A: [], B: [] }; a.state.picks = { A: [], B: [] };
    a.buildSequence();
    const prob = a.likelyEnemyPicks(20).filter((x) => !a.usedNames().has(x));
    a.state.picks.B = prob.slice(0, nE);
    a.state.picks.A = prob.slice(nE, nE + nO).filter((x) => pot(x) >= 11);
    if (a.state.picks.A.length < 2) continue;
    a.computeSuggestions();
    const en = a.state.picks.B, oc = a.state.picks.A.map(a.classOf);
    const minacce = a.likelyEnemyPicks(8), vuote = 3 - en.length;
    for (const m of modi) {
      const c = classifica(en, oc, minacce, vuote, m);
      if (c.length && map.winRates[c[0].n] !== undefined) { res[m].wr += map.winRates[c[0].n]; res[m].n++; }
    }
    const con = classifica(en, oc, minacce, vuote, "piena");
    const senza = classifica(en, oc, minacce, vuote, "niente");
    if (!con.length || !senza.length) continue;
    tot++;
    if (con[0].n !== senza[0].n) {
      cambi++;
      const wrCon = map.winRates[con[0].n], wrSenza = map.winRates[senza[0].n];
      if (wrCon !== undefined && wrSenza !== undefined) {
        sommaDiffWr += wrCon - wrSenza;
        if (esempi.length < 8) esempi.push(`${map.mode}/${map.name}: promuove ${con[0].n} (wr ${wrCon}%) al posto di ${senza[0].n} (wr ${wrSenza}%)`);
      }
    }
  }
}
console.log(`posizioni con alleati gia' in campo: ${tot}`);
console.log(`il bonus di composizione cambia il primo consigliato: ${cambi}/${tot} volte (${(100*cambi/tot).toFixed(0)}%)`);
console.log(`\nquando cambia, il brawler promosso ha una win rate misurata sulla mappa`);
console.log(`  ${(sommaDiffWr/cambi >= 0 ? "PIU' ALTA" : "PIU' BASSA")} di ${Math.abs(sommaDiffWr/cambi).toFixed(2)} punti in media`);
console.log(`\nesempi:`);
for (const e of esempi) console.log("  " + e);
console.log("\nWIN RATE MISURATA SULLA MAPPA del primo consigliato, per variante:");
for (const m of modi) console.log(`  ${m.padEnd(15)} ${(res[m].wr / res[m].n).toFixed(2)}%  (${res[m].n} posizioni)`);
