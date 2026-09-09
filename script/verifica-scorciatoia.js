// `edgeCasellaVuota` deve dare lo STESSO numero del ciclo ovvio su tutti gli
// avversari possibili. Se divergono, e' rotta.
//
// Dal 9/9 quello che verifica e' cambiato. Prima l'app usava una scorciatoia
// algebrica (somma su sette classi invece che su cento avversari) e questo
// script ne era il controllo. Ora, con la matrice vera dei matchup, il ciclo su
// cento avversari e' quello che l'app fa davvero — legge interi da un array
// tipizzato, quindi costa poco — e la scorciatoia resta solo per il caso in cui
// non c'e' una modalita' scelta. Lo script continua a servire: e' il controllo
// che il ciclo, la rinormalizzazione e il ripiego per classe siano coerenti fra
// l'app e un riferimento scritto fuori dall'app.
//
// Nota sul riferimento: la media e' CONDIZIONATA a chi ha un valore. Le
// probabilita' della distribuzione avversaria sono normalizzate su tutti i
// disponibili, ma il candidato stesso va escluso (non puo' stare in entrambe le
// squadre) e qualche coppia non ha dato ne' per se' ne' per classe. Quindi si
// somma anche il peso usato e si divide.
const { carica } = require("./carica-app.js");
const a = carica();
a.state.minPower = 11;

// la versione ovvia, scritta qui e non nell'app: e' il riferimento
function ovvia(candidato) {
  const dist = a.distribuzioneAvversario();
  const usaMatrice = a.mxModo() !== null;
  let media = 0, peso = 0;
  for (const r of dist) {
    if (r.name === candidato) continue;
    if (usaMatrice) {
      let e = a.advReale(candidato, r.name);
      if (e === null) e = a.mxClasseAdv(a.classOf(candidato), a.classOf(r.name));
      if (e === null) continue;
      media += r.p * e; peso += r.p;
    } else {
      media += r.p * a.edgeCentrato(candidato, r.name);
      peso = 1;
    }
  }
  return peso > 0 ? media / peso : 0;
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
