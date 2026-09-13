#!/usr/bin/env node
// QUALI NUMERI SI STANNO ANCORA MUOVENDO?
//
// Dopo un bilanciamento la fonte non cambia di colpo: la sua finestra continua
// a smaltire partite giocate con le regole vecchie, e per qualche giorno i
// numeri dei brawler toccati sono una media fra due giochi diversi. Il punto e'
// che dal dato non si vede: una win rate sbagliata ha lo stesso aspetto di una
// giusta.
//
// Si vede invece confrontando due scaricamenti a distanza di giorni. Chi si
// muove piu' del rumore di fondo e' un numero che non si e' ancora fermato.
//
// Uso:  node script/deriva-dati.js            (confronta i dati dell'app con la fonte di oggi)
//       node script/deriva-dati.js --soglia 1 (quanto e' "muoversi", in punti)
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const RADICE = path.join(__dirname, "..");
const soglia = Number((process.argv.find((a) => a.startsWith("--soglia=")) || "").split("=")[1]
  || process.argv[process.argv.indexOf("--soglia") + 1] || 1);

new Function(fs.readFileSync(path.join(RADICE, "brawl-draft", "data.js"), "utf8") + ";global.__M=MAPS;")();
const chiave = (nome, modo) => (nome + "_" + modo).toLowerCase().replace(/[^a-z0-9]/g, "");
const prima = new Map(global.__M.map((m) => [chiave(m.name, m.mode), m.winRates]));
const quando = global.__M[0] && global.__M[0].updated;

process.stderr.write("scarico la fonte di oggi...\n");
const grezzo = execFileSync("node", [path.join(__dirname, "fetch-mappe-ranked.js")],
  { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] });
const dopo = JSON.parse(grezzo);

const per = new Map();
let coppie = 0, mappeIgnote = 0;
for (const m of dopo.maps) {
  const vecchie = prima.get(m.slug.replace(/[^a-z0-9]/g, ""));
  if (!vecchie) { mappeIgnote++; continue; }
  for (const r of m.rows) {
    const v = vecchie[r.name];
    if (typeof v !== "number") continue;
    if (!per.has(r.name)) per.set(r.name, []);
    per.get(r.name).push(r.win - v);
    coppie++;
  }
}
if (!coppie) { console.error("Nessun confronto possibile: le mappe non combaciano."); process.exit(1); }

const media = (a) => a.reduce((s, x) => s + x, 0) / a.length;
const righe = [...per].map(([nome, d]) => ({ nome, d: media(d), n: d.length })).sort((a, b) => a.d - b.d);

// Il rumore di fondo: quanto deriva un brawler qualunque nello stesso periodo.
// Serve da metro — senza, "si e' mosso di un punto" non vuol dire niente.
const tutte = righe.map((r) => r.d);
const m = media(tutte);
const sd = Math.sqrt(media(tutte.map((x) => (x - m) ** 2)));

console.log(`dati dell'app: ${quando}   fonte: ${dopo.fetched}`);
console.log(`confronti mappa-brawler: ${coppie}  |  brawler: ${righe.length}${mappeIgnote ? `  |  mappe nuove non confrontabili: ${mappeIgnote}` : ""}`);
console.log(`deriva tipica nel periodo: ${m >= 0 ? "+" : ""}${m.toFixed(3)} punti, scarto ${sd.toFixed(3)}\n`);

const mossi = righe.filter((r) => Math.abs(r.d - m) >= soglia);
if (!mossi.length) {
  console.log(`Nessun brawler si e' mosso di ${soglia} punti o piu'. I numeri sono fermi.`);
} else {
  console.log(`SI STANNO ANCORA MUOVENDO (almeno ${soglia} punti rispetto alla deriva tipica):\n`);
  for (const r of mossi) {
    console.log(`  ${(r.d >= 0 ? "+" : "") + r.d.toFixed(2).padStart(5)}  ${r.nome.padEnd(13)} su ${r.n} mappe`);
  }
  console.log(`\n${mossi.length} brawler su ${righe.length}. Per questi il numero mostrato dall'app e' una media`);
  console.log(`fra prima e dopo: va riaggiornato, non interpretato.`);
}
