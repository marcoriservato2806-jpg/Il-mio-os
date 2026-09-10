#!/usr/bin/env node
// Trasforma il battlelog grezzo di Supercell in partite anonime, pronte per la
// validazione dei consigli dell'app.
//
//   BS_TAG='#XXXXXXX' node script/estrai-partite.js <file-grezzo.json>
//
// Il tag NON si scrive qui dentro e non finisce nel file di uscita: serve solo
// a capire quale delle due squadre e' la nostra, poi viene buttato.
//
// Una partita Classificata si gioca al meglio dei tre: il battlelog elenca i
// round, non le partite. Il draft pero' e' uno solo per partita, quindi
// l'unita' di misura giusta e' la partita, non il round. Qui i round
// consecutivi con stessa mappa e stessi sei giocatori vengono ricuciti in una
// partita sola.

const fs = require("fs");
const path = require("path");

const RADICE = path.join(__dirname, "..");
const USCITA = path.join(RADICE, "brawl-draft", "partite-raccolte.json");
const DISTANZA_MAX_MS = 20 * 60 * 1000; // due round della stessa partita non distano di piu'

const tag = (process.env.BS_TAG || process.argv[3] || "").trim().toUpperCase();
const grezzo = process.argv[2];

if (!grezzo || !tag) {
  console.error("uso: BS_TAG='#XXXXXXX' node script/estrai-partite.js <file-grezzo.json>");
  process.exit(1);
}

// Il roster dell'app, per tradurre i nomi dell'API (tutti maiuscoli) nei nomi
// che l'app usa davvero. Se qualcuno non si traduce, e' un errore da vedere,
// non da nascondere.
new Function(fs.readFileSync(path.join(RADICE, "brawl-draft", "data.js"), "utf8") + ";global.__B=BRAWLERS;")();
const perChiave = new Map();
for (const b of global.__B) {
  const nome = typeof b === "string" ? b : b.name;
  perChiave.set(nome.toUpperCase().replace(/[^A-Z0-9]/g, ""), nome);
}
function nomeRoster(apiName) {
  return perChiave.get(String(apiName).toUpperCase().replace(/[^A-Z0-9]/g, "")) || null;
}

function quandoMs(t) {
  // "20260910T130810.000Z" -> Date
  const m = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/.exec(String(t));
  if (!m) return NaN;
  return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
}

const dati = JSON.parse(fs.readFileSync(grezzo, "utf8"));
const items = (dati && dati.items) || [];

const ignoti = new Set();
const motivi = {};
function scarta(m) { motivi[m] = (motivi[m] || 0) + 1; }

// --- 1. i round utilizzabili, ancora uno per riga -------------------------
const round = [];
for (const it of items) {
  const bt = it.battle || {};
  if (!/ranked/i.test(bt.type || "")) { scarta("non e' Classificata"); continue; }
  if (bt.result !== "victory" && bt.result !== "defeat") { scarta("senza esito"); continue; }
  const sq = bt.teams;
  if (!sq || sq.length !== 2) { scarta("non ha due squadre"); continue; }

  let mia = -1;
  for (let t = 0; t < 2; t++) {
    for (const p of sq[t]) if (String(p.tag || "").toUpperCase() === tag) mia = t;
  }
  if (mia < 0) { scarta("il tag non compare"); continue; }

  const nomi = (s) => s.map((p) => {
    const n = nomeRoster(p.brawler && p.brawler.name);
    if (!n) ignoti.add(String(p.brawler && p.brawler.name));
    return n;
  });
  const miei = nomi(sq[mia]), loro = nomi(sq[1 - mia]);
  if (miei.includes(null) || loro.includes(null)) { scarta("un brawler non e' nel roster"); continue; }
  if (miei.length !== 3 || loro.length !== 3) { scarta("squadre non da tre"); continue; }

  const io = sq[mia].find((p) => String(p.tag || "").toUpperCase() === tag);

  round.push({
    ms: quandoMs(it.battleTime),
    quando: it.battleTime,
    modalita: bt.mode || (it.event && it.event.mode) || "",
    mappa: (it.event && it.event.map) || "",
    vinto: bt.result === "victory" ? 1 : 0,
    mio: nomeRoster(io.brawler && io.brawler.name),
    miei, loro,
    // solo per raggruppare: non esce dal programma
    _firma: [
      (it.event && it.event.map) || "",
      sq[0].map((p) => p.tag).sort().join(","),
      sq[1].map((p) => p.tag).sort().join(","),
    ].join("|"),
  });
}

// --- 2. i round diventano partite ----------------------------------------
round.sort((a, b) => a.ms - b.ms);
const partite = [];
for (const r of round) {
  const ultima = partite[partite.length - 1];
  if (ultima && ultima._firma === r._firma && r.ms - ultima._ultimoMs <= DISTANZA_MAX_MS) {
    ultima.round++;
    ultima.vinti += r.vinto;
    ultima._ultimoMs = r.ms;
    continue;
  }
  partite.push({
    quando: r.quando, modalita: r.modalita, mappa: r.mappa,
    round: 1, vinti: r.vinto,
    mio: r.mio, miei: r.miei, loro: r.loro,
    _firma: r._firma, _ultimoMs: r.ms,
  });
}

for (const p of partite) {
  if (p.vinti * 2 === p.round) {
    // Non deve succedere in una partita finita, ma se succede lo dico invece di
    // inventarmi un vincitore.
    console.error(`ATTENZIONE: partita ${p.quando} finita ${p.vinti}-${p.round - p.vinti}: la butto.`);
    p._pari = true;
  }
  p.esito = p.vinti * 2 > p.round ? 1 : 0;
  delete p._firma; delete p._ultimoMs;
}
const buone = partite.filter((p) => !p._pari);
buone.forEach((p) => delete p._pari);

// --- 3. si uniscono a quelle gia' raccolte -------------------------------
let archivio = [];
if (fs.existsSync(USCITA)) archivio = JSON.parse(fs.readFileSync(USCITA, "utf8"));
const per = new Map(archivio.map((p) => [p.quando, p]));
let nuove = 0;
for (const p of buone) { if (!per.has(p.quando)) nuove++; per.set(p.quando, p); }
const finale = [...per.values()].sort((a, b) => (a.quando < b.quando ? -1 : 1));

// --- 4. il controllo che conta: niente tag, niente nomi ------------------
const testo = JSON.stringify(finale, null, 1);
if (testo.toUpperCase().includes(tag.replace(/^#/, ""))) {
  console.error("FERMO: il tag comparirebbe nel file di uscita. Non scrivo niente.");
  process.exit(2);
}
if (/"tag"|"name"/.test(testo)) {
  console.error("FERMO: nel file di uscita c'e' un campo tag o name. Non scrivo niente.");
  process.exit(2);
}

fs.writeFileSync(USCITA, testo + "\n");

// --- 5. il resoconto ------------------------------------------------------
console.log(`round letti:      ${items.length}`);
console.log(`round buoni:      ${round.length}`);
for (const m of Object.keys(motivi)) console.log(`  scartati ${motivi[m]}: ${m}`);
if (ignoti.size) console.log(`nomi non nel roster: ${[...ignoti].join(", ")}`);
console.log(`partite ricucite: ${partite.length}${buone.length !== partite.length ? ` (${partite.length - buone.length} buttate)` : ""}`);
console.log(`nuove:            ${nuove}`);
console.log(`archivio totale:  ${finale.length}  ->  ${path.relative(RADICE, USCITA)}`);
const vinte = finale.filter((p) => p.esito === 1).length;
console.log(`vinte:            ${vinte} su ${finale.length} (${(100 * vinte / finale.length).toFixed(1)}%)`);
