// La scorciatoia algebrica in edgeCasellaVuota deve dare lo STESSO numero del
// ciclo ovvio su tutti gli avversari possibili. Se divergono, e' rotta.
const { carica } = require("./carica-app.js");
const a = carica();
a.state.minPower = 11;

// la versione ovvia, scritta qui e non nell'app: e' il riferimento
function ovvia(candidato) {
  const dist = a.distribuzioneAvversario();
  let media = 0;
  for (const r of dist) {
    if (r.name === candidato) continue;
    media += r.p * a.edgeCentrato(candidato, r.name);
  }
  return media;
}

let peggio = 0, chiPeggio = null, n = 0;
for (const map of a.MAPS) {
  a.state.mode = map.mode; a.state.map = map;
  a.state.bans = { A: [], B: [] }; a.state.picks = { A: [], B: [] };
  a.buildSequence();
  const prob = a.likelyEnemyPicks(20);
  a.state.bans.A = prob.slice(0, 3); a.state.bans.B = prob.slice(3, 6);
  const d = a.likelyEnemyPicks(20).filter((x) => !a.usedNames().has(x));
  a.state.picks.B = d.slice(0, 2); a.state.picks.A = d.slice(2, 3);
  a.computeSuggestions(); // ricostruisce distribuzione e aggregati
  const minacce = a.likelyEnemyPicks(8);
  for (const b of a.BRAWLERS) {
    if (a.usedNames().has(b.name)) continue;
    const veloce = a.edgeCasellaVuota(b.name, minacce).media;
    const lenta = ovvia(b.name);
    const diff = Math.abs(veloce - lenta);
    n++;
    if (diff > peggio) { peggio = diff; chiPeggio = `${b.name} su ${map.name} (${veloce.toFixed(4)} vs ${lenta.toFixed(4)})`; }
  }
}
console.log(`coppie candidato x mappa confrontate: ${n}`);
console.log(`differenza massima: ${peggio.toExponential(2)}`);
console.log(peggio < 1e-9 ? "scorciatoia identica alla versione ovvia" : `DIVERGENZA: ${chiPeggio}`);
process.exit(peggio < 1e-9 ? 0 : 1);
