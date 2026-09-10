#!/usr/bin/env node
// LE TUE PARTITE CON I PICK AVVERSARI, dall'API ufficiale di Supercell.
//
// PERCHE' ESISTE. Per giorni la risposta a «l'app funziona davvero?» e' stata
// «non lo so misurare»: il tracker da cui leggo il profilo pubblica mappa,
// brawler ed esito delle tue partite, ma NON chi c'era dall'altra parte. Senza
// i pick avversari non si puo' validare niente di quello che l'app fa di
// interessante — i counter, il peso del caso peggiore, la correzione per
// rarita'.
//
// L'API ufficiale invece li da': `/players/{tag}/battlelog` restituisce
// entrambe le squadre con il brawler di ognuno. Con abbastanza partite raccolte
// si puo' finalmente chiedere: quando l'app diceva 57%, hai vinto piu' spesso
// di quando diceva 48%?
//
// IL LIMITE, ed e' il motivo per cui questo script va lanciato spesso: il
// battlelog tiene solo le ULTIME PARTITE (una venticinquina). Non e' uno
// scarico storico. Si accumula interrogandolo con regolarita' e unendo il
// nuovo al vecchio.
//
// COSA SALVA, E COSA NO. Il repository e' pubblico, e nel battlelog ci sono i
// tag e i nomi di persone che non hanno chiesto niente a nessuno. Qui si
// tengono SOLO: quando, modalita', mappa, esito, e i sei brawler divisi fra le
// due squadre. Nessun tag, nessun nome, ne' tuo ne' di altri. Il tuo tag serve
// solo a capire quale delle due squadre e' la tua, e viene buttato subito.
//
// Uso:
//   BS_TAG=#XXXXXXX BS_API_KEY=... node script/raccogli-partite.js
//
// La chiave si ottiene gratis su developer.brawlstars.com e va legata a un
// indirizzo IP fisso: e' il motivo per cui questo script va lanciato dalla
// macchina che ha quell'IP.
const fs = require("fs");
const path = require("path");

const TAG = (process.env.BS_TAG || "").trim();
const KEY = (process.env.BS_API_KEY || "").trim();
const DEST = path.join(__dirname, "..", "dati", "partite-ranked.json");

if (!TAG || !KEY) {
  console.error("Servono BS_TAG e BS_API_KEY nell'ambiente.");
  console.error("  BS_TAG      il tuo tag giocatore, col cancelletto");
  console.error("  BS_API_KEY  una chiave da developer.brawlstars.com (gratis, legata a un IP)");
  console.error("\nNessuno dei due va scritto in un file del repository: e' pubblico.");
  process.exit(1);
}

// I tipi di partita che ci interessano. Le partite trofei non c'entrano: il
// draft esiste solo in Classificata.
const RANKED = /ranked/i;

async function main() {
  const tag = TAG.startsWith("#") ? TAG : "#" + TAG;
  const url = `https://api.brawlstars.com/v1/players/${encodeURIComponent(tag)}/battlelog`;
  const r = await fetch(url, { headers: { Authorization: "Bearer " + KEY, Accept: "application/json" } });
  if (r.status === 403) {
    console.error("403: la chiave non vale per questo indirizzo IP.");
    console.error("Su developer.brawlstars.com la chiave e' legata agli IP che elenchi tu.");
    console.error("L'IP da cui stai chiamando ora: prova `curl -s https://api.ipify.org`.");
    process.exit(1);
  }
  if (r.status === 404) { console.error("404: nessun giocatore con questo tag."); process.exit(1); }
  if (!r.ok) { console.error(`L'API ha risposto ${r.status}.`); process.exit(1); }
  const dati = await r.json();
  const items = dati.items || [];

  const nuove = [];
  let scartate = 0;
  for (const b of items) {
    const bt = b.battle || {};
    if (!RANKED.test(bt.type || "")) { scartate++; continue; }
    if (bt.result !== "victory" && bt.result !== "defeat") { scartate++; continue; }
    const squadre = bt.teams;
    if (!Array.isArray(squadre) || squadre.length !== 2) { scartate++; continue; }
    // qual e' la mia squadra? Si guarda il tag, e poi il tag si butta.
    const mia = squadre.findIndex((s) => s.some((p) => (p.tag || "").toUpperCase() === tag.toUpperCase()));
    if (mia < 0) { scartate++; continue; }
    const nome = (s) => s.map((p) => (p.brawler && p.brawler.name ? p.brawler.name : null)).filter(Boolean);
    const miei = nome(squadre[mia]);
    const loro = nome(squadre[1 - mia]);
    if (miei.length !== 3 || loro.length !== 3) { scartate++; continue; }
    const io = squadre[mia].find((p) => (p.tag || "").toUpperCase() === tag.toUpperCase());
    nuove.push({
      quando: b.battleTime,                 // unico e ordinabile: fa da chiave
      modalita: bt.mode || (b.event && b.event.mode) || null,
      mappa: (b.event && b.event.map) || null,
      esito: bt.result === "victory" ? 1 : 0,
      mio: io && io.brawler ? io.brawler.name : null,
      miei, loro,
      // niente tag, niente nomi: ne' miei ne' di altri
    });
  }

  const vecchie = fs.existsSync(DEST) ? JSON.parse(fs.readFileSync(DEST, "utf8")) : { partite: [] };
  const viste = new Set(vecchie.partite.map((p) => p.quando));
  const aggiunte = nuove.filter((p) => !viste.has(p.quando));
  const tutte = [...vecchie.partite, ...aggiunte].sort((a, b) => (a.quando < b.quando ? 1 : -1));

  fs.mkdirSync(path.dirname(DEST), { recursive: true });
  fs.writeFileSync(DEST, JSON.stringify({
    aggiornato: new Date().toISOString().slice(0, 16).replace("T", " "),
    nota: "Partite di Classificata con entrambe le squadre. Nessun tag e nessun nome, di nessuno. Raccolte da script/raccogli-partite.js.",
    partite: tutte,
  }, null, 1));

  console.log(`battlelog: ${items.length} partite, ${nuove.length} di Classificata utilizzabili (${scartate} scartate)`);
  console.log(`nuove rispetto a quelle gia' raccolte: ${aggiunte.length}`);
  console.log(`totale accumulato: ${tutte.length} partite`);
  if (tutte.length) {
    const v = tutte.filter((p) => p.esito).length;
    console.log(`  vittorie ${v}/${tutte.length} (${(100 * v / tutte.length).toFixed(1)}%)`);
    console.log(`  dalla piu' vecchia: ${tutte[tutte.length - 1].quando}`);
  }
  // Quanto ci vuole per poter dire qualcosa. Con 300 partite l'errore standard
  // su una differenza di win rate fra due gruppi e' circa 6 punti: serve per
  // sapere quando ha senso cominciare a misurare, invece di misurare presto e
  // convincersi di qualcosa che non c'e'.
  const mancano = Math.max(0, 300 - tutte.length);
  console.log(mancano ? `\nPer una misura che regga ne servono almeno 300: ne mancano ${mancano}.`
    : `\nCe ne sono abbastanza per misurare: lancia script/valida-consigli.js`);
}
main().catch((e) => { console.error(String(e.message || e)); process.exit(1); });
