#!/usr/bin/env node
// L'APP FUNZIONA DAVVERO? Misurato sulle partite vere, con i pick avversari.
//
// E' la domanda a cui non ho mai potuto rispondere. Tutte le misure fatte
// finora confrontano l'app con un GIUDICE (la probabilita' calibrata della
// fonte) o con un'altra politica: dicono «l'app sceglie meglio del greedy
// secondo questo modello». Nessuna dice «quando l'app diceva 57% hai vinto piu'
// spesso che quando diceva 48%».
//
// Per dirlo servono le partite CON I PICK AVVERSARI, che l'API ufficiale da' e
// il tracker no. Le raccoglie `script/raccogli-partite.js`.
//
// Cosa misura, in ordine di importanza:
//   1. il punteggio dell'app separa le vittorie dalle sconfitte? (AUC)
//   2. i numeri che mostra sono TARATI? Un 57% dovrebbe voler dire che vinci
//      il 57% delle volte. Si guarda per fasce.
//   3. il peso del caso peggiore (q), che finora e' un'assunzione dichiarata,
//      quale valore avrebbe dovuto avere?
//   4. la correzione per rarita' aiuta o fa danni?
//
// Uso: node script/valida-consigli.js
const fs = require("fs");
const path = require("path");
const { carica } = require("./carica-app.js");

const F = path.join(__dirname, "..", "dati", "partite-ranked.json");
if (!fs.existsSync(F)) {
  console.error("Non ho ancora nessuna partita. Lancia prima script/raccogli-partite.js.");
  process.exit(1);
}
const store = JSON.parse(fs.readFileSync(F, "utf8"));
const partite = store.partite || [];
console.log(`partite raccolte: ${partite.length} (aggiornate al ${store.aggiornato})`);
if (partite.length < 60) {
  console.error(`\nTroppo poche per misurare. Sotto le 60 qualunque numero che esce e' rumore;`);
  console.error(`per una misura che regga ne servono 300. Lancia il comando rapido dopo ogni sessione e passa il grezzo a script/estrai-partite.js.`);
  process.exit(1);
}

const a = carica();
const roster = new Set(a.BRAWLERS.map((b) => b.name));

// Per ogni partita: rimetto l'app nella posizione in cui ero, con la loro
// squadra al completo, e le chiedo quanto valeva il brawler che ho preso.
function punteggioDi(p) {
  const map = a.MAPS.find((m) => m.name === p.mappa);
  if (!map) return null;
  if (!p.mio || !roster.has(p.mio)) return null;
  const loro = p.loro.filter((n) => roster.has(n));
  const miei = p.miei.filter((n) => roster.has(n) && n !== p.mio);
  if (loro.length !== 3) return null;
  a.state.mode = map.mode; a.state.map = map;
  a.state.bans = { A: [], B: [] };
  a.state.picks = { A: [p.mio, ...miei], B: loro };
  a.buildSequence();
  const s = a.scoreCandidate(p.mio, a.classOf(p.mio), miei.map(a.classOf), loro.map(a.classOf), loro, [], 0, miei);
  return s;
}

const righe = [];
let saltate = 0;
for (const p of partite) {
  const s = punteggioDi(p);
  if (!s) { saltate++; continue; }
  righe.push({ y: p.esito, tot: s.total, base: s.base, generale: s.generale, match: s.matchupAvg, mappa: p.mappa });
}
console.log(`usabili: ${righe.length} (${saltate} saltate: mappa fuori dal pool o brawler sconosciuto)`);
if (righe.length < 60) { console.error("Troppo poche dopo i filtri."); process.exit(1); }

const media = (v) => v.reduce((s, x) => s + x, 0) / v.length;
function auc(punti) {
  const v = punti.filter((r) => r.y === 1).map((r) => r.p);
  const s = punti.filter((r) => r.y === 0).map((r) => r.p);
  if (!v.length || !s.length) return null;
  let c = 0;
  for (const x of v) for (const y of s) c += x > y ? 1 : x === y ? 0.5 : 0;
  return c / (v.length * s.length);
}
const vinte = righe.filter((r) => r.y).length;
console.log(`vittorie: ${vinte}/${righe.length} = ${(100 * vinte / righe.length).toFixed(1)}%\n`);

console.log("1) IL PUNTEGGIO SEPARA LE VITTORIE DALLE SCONFITTE?");
for (const [etichetta, k] of [["punteggio mostrato", "tot"], ["solo la mappa (base)", "base"], ["solo i matchup", "match"]]) {
  const A = auc(righe.map((r) => ({ y: r.y, p: r[k] })));
  // errore standard approssimato dell'AUC (Hanley-McNeil semplificato)
  const n1 = vinte, n0 = righe.length - vinte;
  const se = Math.sqrt((A * (1 - A) + (n1 - 1) * (A / (2 - A) - A * A) + (n0 - 1) * (2 * A * A / (1 + A) - A * A)) / (n1 * n0));
  const z = (A - 0.5) / se;
  console.log(`  ${etichetta.padEnd(22)} AUC ${A.toFixed(3)} ± ${se.toFixed(3)}   ${Math.abs(z) < 2 ? "non distinguibile dal caso" : z > 0 ? "MEGLIO del caso" : "PEGGIO del caso"}`);
}

console.log("\n2) I NUMERI SONO TARATI? Un 57% dovrebbe voler dire 57% di vittorie.");
const ord = [...righe].sort((x, y) => x.tot - y.tot);
const nf = Math.min(5, Math.floor(ord.length / 25) || 1);
const dim = Math.ceil(ord.length / nf);
let errCal = 0;
for (let i = 0; i < nf; i++) {
  const f = ord.slice(i * dim, (i + 1) * dim);
  if (!f.length) continue;
  const detto = media(f.map((r) => r.tot));
  const vero = 100 * media(f.map((r) => r.y));
  errCal += Math.abs(detto - vero) * f.length;
  const se = 100 * Math.sqrt(0.25 / f.length);
  console.log(`  l'app diceva ${detto.toFixed(1).padStart(5)}%  ->  hai vinto ${vero.toFixed(1).padStart(5)}% (${f.length} partite, ± ${se.toFixed(0)})`);
}
console.log(`  scarto medio fra detto e fatto: ${(errCal / righe.length).toFixed(1)} punti`);

console.log("\n3) IL PESO DEL CASO PEGGIORE — finora un'assunzione, qui un numero.");
console.log("   (con la loro squadra al completo q vale 0 per costruzione: questa");
console.log("    misura ha senso solo su partite registrate a meta' draft, che");
console.log("    l'API non da'. Resta un'assunzione, e va detto.)");

console.log("\n4) LA CORREZIONE PER RARITA' AIUTA?");
const conCorr = auc(righe.map((r) => ({ y: r.y, p: r.base })));
const senzaCorr = auc(righe.map((r) => ({ y: r.y, p: r.generale })));
console.log(`  base con la correzione : AUC ${conCorr.toFixed(3)}`);
console.log(`  senza (win rate grezza): AUC ${senzaCorr.toFixed(3)}`);
console.log(`  ${Math.abs(conCorr - senzaCorr) < 0.02 ? "differenza dentro il rumore: su queste partite non si decide" : conCorr > senzaCorr ? "la correzione AIUTA" : "la correzione PEGGIORA le cose"}`);

console.log("\nNOTA. Questo misura il punteggio del brawler CHE HAI PRESO, non se il");
console.log("consiglio era buono: per quello servirebbe sapere cosa avresti fatto");
console.log("prendendo un altro, che nessun dato puo' dire. E' comunque la prima");
console.log("misura di questa app contro la realta' invece che contro un modello.");
