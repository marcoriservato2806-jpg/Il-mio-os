#!/usr/bin/env node
// Riscrive in brawl-draft/data.js i blocchi MAPS e MODE_WIN_RATES partendo
// dallo scarico di script/fetch-brawlplanet-ranked.js.
//
// Due cose che questo script fa e che a mano venivano sbagliate:
//  1. tiene SOLO le mappe del pool Classificata di adesso. La lista vecchia
//     era la rotazione TROFEI: conteneva mappe che in Classificata non
//     escono (Super Beach, Sunny Soccer, Konnakol...) e non conteneva mappe
//     che invece ci sono (Ring of Fire, Lilygear Lake, Flooded Mine).
//  2. calcola MODE_WIN_RATES come media delle mappe della modalità pesata
//     sul campione, invece di prenderla da un'altra fonte. Serve a stare
//     sulla stessa scala: app.js MISCELA il dato mappa con quello modalità,
//     e miscelare due scale diverse produce un numero che non vuol dire
//     niente.
//
// Uso: node script/fetch-brawlplanet-ranked.js > bp.json
//      node script/build-map-data.js bp.json

const fs = require("fs");
const path = require("path");

const MODE_BY_SLUG = {
  gemgrab: "Gem Grab", brawlball: "Brawl Ball", bounty: "Bounty",
  heist: "Heist", hotzone: "Hot Zone", knockout: "Knockout",
};

const root = path.join(__dirname, "..");
const bp = JSON.parse(fs.readFileSync(process.argv[2] || path.join(root, "bp.json"), "utf8"));
const dataPath = path.join(root, "brawl-draft", "data.js");
let data = fs.readFileSync(dataPath, "utf8");

// Le note di layout delle mappe già presenti sono ancora valide (descrivono
// il terreno, non le statistiche): si recuperano invece di riscriverle.
const oldNotes = {};
for (const m of data.matchAll(/name: "([^"]+)",[^\n]*\n(?:[^\n]*\n){0,3}?\s*notes: "((?:[^"\\]|\\.)*)"/g)) {
  if (!oldNotes[m[1]]) oldNotes[m[1]] = m[2];
}

const maps = [];
for (const m of bp.maps) {
  if (m.error) { console.error(`salto ${m.slug}: ${m.error}`); continue; }
  const modeSlug = m.slug.split("_")[1];
  const mode = MODE_BY_SLUG[modeSlug];
  if (!mode) { console.error(`salto ${m.slug}: modalità "${modeSlug}" non è una delle 6 di Classificata`); continue; }
  const name = m.title.replace(/^Best Brawlers for /, "").split(" - ")[0].trim();
  maps.push({ mode, name, sample: m.sample, rows: m.rows });
}

const order = ["Gem Grab", "Brawl Ball", "Bounty", "Heist", "Hot Zone", "Knockout"];
maps.sort((a, b) => order.indexOf(a.mode) - order.indexOf(b.mode) || b.sample - a.sample);


// Delle note vecchie si tiene solo la descrizione del TERRENO. Il commento
// statistico ("campione enorme (3,7M) ma dati di fine luglio") va buttato:
// l'app stampa già da sé campione, data e affidabilità leggendoli dai dati,
// e la versione in prosa è quella che resta indietro e mente. È già
// successo — dopo aver aggiornato i numeri, una mappa continuava a dire
// "dati di fine luglio" con dati di oggi.
const NOTE_DI_RISERVA = {
  "Deathcap Trap": "Funghi e cespugli attorno al centro, corsie laterali lunghe.",
  "Flooded Mine": "Acqua e binari: passaggi obbligati, poche vie di fuga.",
  "Lilygear Lake": "Lago centrale con ninfee: il centro si attraversa solo dai lati.",
  "Spiraling Out": "Muri a spirale attorno al centro: le linee di tiro si aprono e si chiudono di continuo.",
  "Layer Cake": "Mappa a strati di muri, cespugli e chokepoint.",
  "Bridge Too Far": "Terreno limitato, poca mobilità: i marksman sparano lungo le corsie senza spostarsi.",
  "Safe Zone": "Tre corsie ben definite; casseforti poco protette dai tiri lunghi.",
  "Pit Stop": "Piena di cespugli, casseforti protette da un lungo muro orizzontale.",
  "Ring of Fire": "Anello di muri attorno alla zona centrale. Tornata nel pool dopo essere stata fuori a lungo.",
  "Out in the Open": "Linee di tiro lunghe: gioca paziente e commercia da lontano.",
};

const STAT_WORDS = /campione|partite|dati (del|dell|di |non)|aggiorn|pesat|riequilibr|404|verificat|brawlmetrics|solidi|cautela|\d+[.,]?\d*\s*[kKM]\b|\d+[.,]\d+\s*%/i;
function cleanNote(note, nomeMappa) {
  if (!note) return NOTE_DI_RISERVA[nomeMappa] || null;
  const kept = note
    .split(/(?<=\.)\s+/)
    .filter((frase) => frase.trim() && !STAT_WORDS.test(frase))
    .join(" ")
    .trim();
  return kept || NOTE_DI_RISERVA[nomeMappa] || null;
}

const n = (v) => (Math.round(v * 10) / 10).toString();

let out = "const MAPS = [\n";
let lastMode = null;
for (const m of maps) {
  if (m.mode !== lastMode) { out += `  // ---------- ${m.mode} ----------\n`; lastMode = m.mode; }
  const wr = m.rows.map((r) => `"${r.name}": ${n(r.win)}`).join(", ");
  const pk = m.rows.map((r) => `"${r.name}": ${n(r.pick)}`).join(", ");
  out += "  {\n";
  out += `    mode: ${JSON.stringify(m.mode)}, name: ${JSON.stringify(m.name)}, sample: ${m.sample}, updated: ${JSON.stringify(bp.fetched)},\n`;
  out += `    winRates: { ${wr} },\n`;
  out += `    pickRates: { ${pk} },\n`;
  const note = cleanNote(oldNotes[m.name], m.name);
  if (note) out += `    notes: "${note}",\n`;
  out += "  },\n";
}
out += "];\n";

// MODE_WIN_RATES: media pesata sul campione delle mappe di quella modalità.
const modeAgg = {};
for (const m of maps) {
  const acc = (modeAgg[m.mode] ||= {});
  for (const r of m.rows) {
    const a = (acc[r.name] ||= { num: 0, den: 0 });
    a.num += r.win * m.sample;
    a.den += m.sample;
  }
}
let modeOut = "const MODE_WIN_RATES = {\n";
for (const mode of order) {
  const acc = modeAgg[mode];
  if (!acc) { console.error(`ATTENZIONE: nessuna mappa per ${mode}`); continue; }
  const entries = Object.entries(acc)
    .map(([k, a]) => [k, a.num / a.den])
    .sort((x, y) => y[1] - x[1]);
  modeOut += `  ${JSON.stringify(mode)}: {\n`;
  for (let i = 0; i < entries.length; i += 6) {
    modeOut += "    " + entries.slice(i, i + 6).map(([k, v]) => `"${k}": ${n(v)}`).join(", ") + ",\n";
  }
  modeOut += "  },\n";
}
modeOut += "};\n";

function splice(src, startRe, block, label) {
  const i = src.search(startRe);
  if (i < 0) throw new Error(`blocco ${label} non trovato in data.js`);
  const j = src.indexOf("\n};\n", i) >= 0 && src.indexOf("\n};\n", i) < src.indexOf("\n];\n", i)
    ? src.indexOf("\n};\n", i) + 4 : src.indexOf("\n];\n", i) + 4;
  if (j < 4) throw new Error(`fine del blocco ${label} non trovata`);
  return src.slice(0, i) + block + src.slice(j);
}

data = splice(data, /^const MAPS = \[/m, out, "MAPS");
data = splice(data, /^const MODE_WIN_RATES = \{/m, modeOut, "MODE_WIN_RATES");
fs.writeFileSync(dataPath, data);

console.error(`scritte ${maps.length} mappe (${new Set(maps.map((m) => m.mode)).size} modalità), MODE_WIN_RATES ricalcolate.`);
