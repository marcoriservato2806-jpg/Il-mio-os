// I ban oggi si ordinano per forza-sulla-mappa x quanto viene scelto, e non
// guardano se io a quel brawler ho una risposta. Un ban speso su una minaccia
// che sai gia' gestire e' un ban buttato. Qui si misura se succede davvero.
const { carica } = require("./carica-app.js");
const a = carica();
a.state.minPower = 11;

// la mia risposta migliore a una minaccia: fra i brawler che posso schierare
// e che sono ancora liberi, il migliore per resa nel contesto contro di lei
function rispostaMigliore(t) {
  let best = null, chi = null;
  const used = a.usedNames();
  for (const b of a.BRAWLERS) {
    if (b.name === t || used.has(b.name)) continue;
    if (!a.schierabile(b.name)) continue;
    const v = a.contextualWinRate(b.name).base + a.edgeCentrato(b.name, t);
    if (best === null || v > best) { best = v; chi = b.name; }
  }
  return { valore: best, chi };
}

const righe = [];
for (const map of a.MAPS) {
  a.state.mode = map.mode; a.state.map = map;
  a.state.bans = { A: [], B: [] }; a.state.picks = { A: [], B: [] };
  a.buildSequence();
  const ban = a.computeBanSuggestions();
  if (ban.length < 6) continue;
  // i 20 candidati piu' prioritari, con la mia risposta migliore a ciascuno
  const tutti = [];
  for (const b of a.BRAWLERS) {
    const t = a.threatOf(b.name); if (!t) continue;
    const u = a.useRateOf(b.name);
    const r = rispostaMigliore(b.name);
    tutti.push({ nome: b.name, forza: t.value, use: u.use, risposta: r.valore, chi: r.chi });
  }
  const consigliati = ban.slice(0, 3).map(x => x.nome || x.name);
  const cons = consigliati.map(n => tutti.find(t => t.nome === n)).filter(Boolean);
  // fra le minacce plausibili (scelte almeno l'1% e forti almeno 52%),
  // quale e' quella a cui rispondo peggio?
  const plausibili = tutti.filter(t => t.use >= 1 && t.forza >= 52);
  plausibili.sort((x, y) => x.risposta - y.risposta);
  const peggiore = plausibili[0];
  if (!peggiore) continue;
  righe.push({
    mappa: map.name,
    rispostaMediaAiConsigliati: cons.reduce((s, c) => s + c.risposta, 0) / cons.length,
    peggiore: peggiore.nome, rispostaAlPeggiore: peggiore.risposta,
    peggioreEraConsigliato: consigliati.includes(peggiore.nome),
    forzaPeggiore: peggiore.forza, usePeggiore: peggiore.use,
  });
}
const n = righe.length;
console.log(`mappe: ${n}\n`);
console.log(`risposta media alle 3 minacce che l'app dice di bannare : ${(righe.reduce((s,r)=>s+r.rispostaMediaAiConsigliati,0)/n).toFixed(2)}%`);
console.log(`risposta alla minaccia plausibile che gestisco PEGGIO   : ${(righe.reduce((s,r)=>s+r.rispostaAlPeggiore,0)/n).toFixed(2)}%`);
console.log(`quella minaccia era fra i 3 ban consigliati             : ${righe.filter(r=>r.peggioreEraConsigliato).length}/${n}`);
console.log(`\nesempi (mappa · minaccia peggio gestita · la mia risposta · era fra i ban?)`);
for (const r of righe.slice(0, 8)) {
  console.log(`  ${r.mappa.padEnd(18)} ${r.peggiore.padEnd(12)} risposta ${r.rispostaAlPeggiore.toFixed(1)}%  (forza ${r.forzaPeggiore}, scelto ${r.usePeggiore}%)  ${r.peggioreEraConsigliato ? "SI" : "no"}`);
}
