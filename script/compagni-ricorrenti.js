#!/usr/bin/env node
// Con chi ho gia' giocato, e come e' andata.
//
//   BS_TAG='#XXXXXXX' node script/compagni-ricorrenti.js <file-grezzo.json>
//
// Il battlelog contiene i compagni di squadra di ogni partita. Chi torna piu'
// volte e con cui si vince e' gente che gioca alle tue ore e al tuo livello:
// e' la lista di persone da aggiungere agli amici, e non costa niente perche'
// ci hai gia' giocato insieme.
//
// Stampa e basta: non scrive niente su disco e non stampa i tag, che in gioco
// non servono (i giocatori recenti si aggiungono dalla schermata amici).

const fs = require("fs");

const tag = (process.env.BS_TAG || process.argv[3] || "").trim().toUpperCase();
const grezzo = process.argv[2];
if (!grezzo || !tag) {
  console.error("uso: BS_TAG='#XXXXXXX' node script/compagni-ricorrenti.js <file-grezzo.json>");
  process.exit(1);
}

const dati = JSON.parse(fs.readFileSync(grezzo, "utf8"));
const per = new Map();

for (const it of (dati.items || [])) {
  const b = it.battle || {};
  if (!/ranked/i.test(b.type || "")) continue;
  const sq = b.teams;
  if (!sq || sq.length !== 2) continue;

  let mia = -1;
  sq.forEach((s, i) => { if (s.some((p) => String(p.tag || "").toUpperCase() === tag)) mia = i; });
  if (mia < 0) continue;

  // Una partita, non un round: i round della stessa partita hanno gli stessi
  // sei giocatori e la stessa mappa, quindi la firma li unisce da sola.
  const firma = [
    (it.event && it.event.map) || "",
    sq[0].map((p) => p.tag).sort().join(","),
    sq[1].map((p) => p.tag).sort().join(","),
  ].join("|");

  for (const p of sq[mia]) {
    if (String(p.tag || "").toUpperCase() === tag) continue;
    const k = String(p.tag);
    if (!per.has(k)) per.set(k, { nome: p.name, partite: new Map() });
    const v = per.get(k);
    // Per ogni partita si contano i round vinti e quelli giocati. Chi vince la
    // partita si decide alla fine: contare "almeno un round vinto" darebbe per
    // vinta anche una partita persa 1-2. Ci sono cascato scrivendo questo
    // script, e il conto sbagliato sembrava del tutto plausibile.
    if (!v.partite.has(firma)) v.partite.set(firma, { round: 0, vinti: 0 });
    const r = v.partite.get(firma);
    r.round++;
    if (b.result === "victory") r.vinti++;
  }
}

const righe = [...per.values()]
  .map((v) => {
    const p = [...v.partite.values()];
    return { nome: v.nome, n: p.length, v: p.filter((r) => r.vinti * 2 > r.round).length };
  })
  .sort((a, b) => b.n - a.n || b.v - a.v);

if (!righe.length) { console.log("Nessun compagno trovato in questo battlelog."); process.exit(0); }

console.log("compagni di squadra, dalla partita piu' condivisa alla meno:\n");
for (const r of righe) {
  const spia = r.n >= 2 ? (r.v * 2 > r.n ? "  <- ricorrente, e si vince" : "  <- ricorrente") : "";
  console.log(`  ${String(r.n).padStart(2)} partite, ${r.v} vinte   ${r.nome}${spia}`);
}
console.log(`\n${righe.length} persone diverse. Ricorrenti (2+ partite): ${righe.filter((r) => r.n >= 2).length}.`);
