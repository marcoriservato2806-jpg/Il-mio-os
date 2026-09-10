#!/usr/bin/env node
// Le win rate di Classificata di tutte le mappe, DA UN SOLO FILE JSON.
//
// PERCHE' SOSTITUISCE `fetch-brawlplanet-ranked.js`. Quello grattava l'HTML di
// una pagina per mappa, e la pagina ha due schede — «Trophy ladder» e «Ranked»
// — di cui quella aperta di default e' quella sbagliata. E' una trappola che e'
// gia' costata un giro intero di dati sbagliati, e ogni volta che il sito
// cambia una classe CSS lo script si rompe in silenzio.
//
// La stessa fonte pubblica tutto in un file solo:
//   storage.googleapis.com/brawlanalyzer-public/pl-results.json.gz
// che e' il bucket da cui il loro sito legge. Un file, 300 KB, nessuna scheda
// da scegliere, nessun HTML da interpretare. Trovato leggendo il codice del
// loro Draft Helper (vedi memoria/wiki/fonti-brawl-stars.md).
//
// Produce la STESSA forma dello script vecchio, cosi' `build-map-data.js` non
// cambia: { fetched, pool, maps: [{ slug, sample, rows, title }] }.
//
// Uso:  node script/fetch-mappe-ranked.js > bp.json
//       BRAWL_PL_CACHE=<file> node script/fetch-mappe-ranked.js > bp.json
const fs = require("fs");

const URL = "https://storage.googleapis.com/brawlanalyzer-public/pl-results.json.gz";
const MODI = { gemGrab: "gemgrab", brawlBall: "brawlball", bounty: "bounty", heist: "heist", hotZone: "hotzone", knockout: "knockout" };

async function scarica() {
  const cache = process.env.BRAWL_PL_CACHE;
  if (cache && fs.existsSync(cache)) return JSON.parse(fs.readFileSync(cache, "utf8"));
  const r = await fetch(URL);
  if (!r.ok) throw new Error(`la fonte ha risposto ${r.status}`);
  return await r.json();
}

async function main() {
  const d = await scarica();
  const maps = [];
  const attive = [], archiviate = [];
  for (const [chiave, v] of Object.entries(d)) {
    if (!MODI[v.mode]) continue; // Showdown, Duels e le 5v5 non sono in Classificata
    (v.active ? attive : archiviate).push(chiave);
    if (!v.active) continue;
    const righe = (v.individual || [])
      .filter((r) => r.brawler && typeof r.wr === "number")
      .map((r) => ({ name: nomeProprio(r.brawler), win: r.wr, pick: r.ur, star: r.sr }));
    // Controllo di integrita' che la fonte stessa rende possibile: le pick rate
    // di una mappa devono sommare a 600, cioe' sei pick per partita. Se non lo
    // fanno, la tabella e' troncata e i numeri non sono confrontabili.
    const somma = righe.reduce((s, r) => s + (r.pick || 0), 0);
    const errore = righe.length < 90 ? `solo ${righe.length} brawler` :
      Math.abs(somma - 600) > 30 ? `le pick rate sommano ${somma.toFixed(0)} invece di 600` : null;
    maps.push({
      slug: chiave, sample: v.match_count, rows: righe,
      title: `Best Brawlers for ${v.map} - ${v.modeFormatted}`,
      ...(errore ? { error: errore } : {}),
    });
  }
  process.stderr.write(`mappe di Classificata attive: ${maps.length} (archiviate: ${archiviate.length})\n`);
  for (const m of maps) process.stderr.write(`  ${m.slug}: ${m.error ? "PROBLEMA — " + m.error : `${m.rows.length} brawler, ${m.sample.toLocaleString("it-IT")} partite`}\n`);
  console.log(JSON.stringify({ fetched: new Date().toISOString().slice(0, 10), pool: { active: attive, archived: archiviate }, maps }, null, 1));
}

// La fonte scrive i nomi in maiuscolo; il roster li vuole com'e' scritto nel
// gioco. Si legge la corrispondenza dal roster invece di indovinarla, cosi' un
// brawler nuovo non entra con la grafia sbagliata.
let _nomi = null;
function nomeProprio(su) {
  if (!_nomi) {
    const src = fs.readFileSync(require("path").join(__dirname, "..", "brawl-draft", "data.js"), "utf8");
    const i = src.indexOf("const BRAWLERS");
    _nomi = {};
    for (const m of src.slice(i, src.indexOf("];", i)).matchAll(/name:\s*"([^"]+)"/g)) _nomi[m[1].toUpperCase()] = m[1];
  }
  return _nomi[su] || su;
}
main().catch((e) => { console.error(String(e.message || e)); process.exit(1); });
