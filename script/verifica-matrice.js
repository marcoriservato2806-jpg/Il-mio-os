// La matrice decodificata dall'app combacia col file della fonte, cella per
// cella? E' il controllo che serve davvero: `matrice.js` e' base64 di interi
// nel triangolo superiore, e un errore di un solo indice sposterebbe TUTTI i
// vantaggi su coppie sbagliate senza che niente sembri rotto — i numeri
// resterebbero plausibili e la lista dei consigli sarebbe silenziosamente
// spazzatura. Nessuna rilettura del codice trova un errore del genere.
//
// Confronta tutte e 5.778 le coppie per ognuna delle sei modalita', in
// entrambi i versi, su tutti e quattro i campi: 277.344 confronti.
//
// Uso:  BRAWL_MX_CACHE=<cartella con mx-<modo>.json> node script/verifica-matrice.js
//       (senza cache scarica dal bucket)
const fs = require("fs");
const path = require("path");
const { carica } = require("./carica-app.js");
const a = carica();

const MODI = { gemGrab: "Gem Grab", brawlBall: "Brawl Ball", bounty: "Bounty", heist: "Heist", hotZone: "Hot Zone", knockout: "Knockout" };
const BUCKET = "https://storage.googleapis.com/brawlanalyzer-public";

async function sorgente(modo) {
  const cache = process.env.BRAWL_MX_CACHE;
  if (cache) {
    const p = path.join(cache, "mx-" + modo + ".json");
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, "utf8"));
  }
  const r = await fetch(`${BUCKET}/draft/pairs-${modo}.json.gz`);
  if (!r.ok) throw new Error(`${modo}: bucket ${r.status}`);
  return await r.json();
}

async function main() {
  const nomi = a.BRAWLERS.map((b) => b.name);
  let confronti = 0, sbagliate = 0, vuoteApp = 0, vuoteFonte = 0;
  const esempi = [];
  for (const [modo, etichetta] of Object.entries(MODI)) {
    const d = await sorgente(modo);
    a.state.mode = etichetta;
    const idx = {};
    d.brawlers.forEach((n, k) => { idx[n] = k; });
    const casi = [
      ["adv", a.advReale, d.matchup.adv, -1],
      ["wr", a.wrReale, d.matchup.wr, 0],
      ["sinAdv", a.sinergiaReale, d.synergy.adv, 1],
      ["sinWr", a.sinergiaWrReale, d.synergy.wr, 1],
    ];
    let male = 0;
    for (const [campo, fn, tab] of casi) {
      for (let i = 0; i < nomi.length; i++) {
        for (let j = 0; j < nomi.length; j++) {
          if (i === j) continue;
          const ia = idx[nomi[i].toUpperCase()], ib = idx[nomi[j].toUpperCase()];
          const atteso = ia === undefined || ib === undefined ? null : tab[ia][ib];
          const avuto = fn(nomi[i], nomi[j]);
          confronti++;
          if (atteso === null || atteso === undefined) { if (avuto !== null) { male++; vuoteFonte++; if (esempi.length < 8) esempi.push(`${modo} ${campo} ${nomi[i]} vs ${nomi[j]}: la fonte non ha dato, l'app dice ${avuto}`); } continue; }
          if (avuto === null) { male++; vuoteApp++; if (esempi.length < 8) esempi.push(`${modo} ${campo} ${nomi[i]} vs ${nomi[j]}: la fonte dice ${atteso / 10}, l'app niente`); continue; }
          if (Math.abs(avuto - atteso / 10) > 1e-9) { male++; if (esempi.length < 8) esempi.push(`${modo} ${campo} ${nomi[i]} vs ${nomi[j]}: fonte ${atteso / 10}, app ${avuto}`); }
        }
      }
    }
    sbagliate += male;
    console.log(`${etichetta.padEnd(11)} celle sbagliate: ${male}`);
  }
  console.log(`\nconfronti: ${confronti.toLocaleString("it-IT")} · sbagliate: ${sbagliate}`);
  if (esempi.length) { console.log("\nprimi casi:"); for (const e of esempi) console.log("  " + e); }
  if (sbagliate) { console.error("\nLA MATRICE NON COMBACIA CON LA FONTE."); process.exit(1); }
  console.log("la matrice decodificata e' identica alla fonte su tutte le celle");
}
main().catch((e) => { console.error(String(e.message || e)); process.exit(1); });
