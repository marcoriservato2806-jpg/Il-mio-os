// "Tre brawler della stessa classe e' fragile": vero o luogo comune?
//
// Da dove viene la domanda. La ricerca sui draft dice che una somma di COPPIE
// non puo' vedere la composizione: il caso famoso e' un tool per League of
// Legends che dava 64,9% a una squadra tutta dello stesso tipo di danno, che
// un modello vero valuta 40,2% — 24 punti di errore, perche' il difetto sta
// nella squadra INTERA e non in nessuna delle sue coppie. Le guide dei
// giocatori dicono la stessa cosa: «tre di una classe e' monodimensionale».
//
// Il mio punteggio ha avuto una penalita' per classi ripetute scritta a mano,
// poi tolta quando e' arrivata la sinergia misurata. Se la tesi della ricerca e'
// giusta, toglierla e' stato un errore: la sinergia misurata e' anch'essa una
// somma di coppie, quindi soffre dello stesso cieco.
//
// Come si misura senza inventare. La fonte pubblica, per ogni mappa ranked, i
// dieci TRII con la win rate piu' alta. Se "tre della stessa classe" fosse
// neutro, fra quei trii ce ne sarebbero tanti quanti se li pescassi a caso con
// le probabilita' di scelta vere di quella mappa. Si confronta l'osservato con
// l'atteso: e' l'unico modo che ho di dire qualcosa sulla COMPOSIZIONE, perche'
// qualunque giudice a coppie non la vede per costruzione.
//
// Uso:  BRAWL_PL=<file pl-results.json.gz scaricato> node script/misura-composizione-trii.js
const fs = require("fs");
const path = require("path");
const { carica } = require("./carica-app.js");
const a = carica();

const cls = {};
for (const b of a.BRAWLERS) cls[b.name.toUpperCase()] = b.class;

function sorgente() {
  const f = process.env.BRAWL_PL;
  if (f && fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, "utf8"));
  throw new Error("serve BRAWL_PL=<percorso di pl-results.json.gz>");
}

const d = sorgente();
let trii = 0, conTripla = 0, conDoppia = 0, senzaClasse = 0;
let attesaTripla = 0, attesaDoppia = 0, mappe = 0;
const esempi = [];

for (const [chiave, v] of Object.entries(d)) {
  if (!v.active || !Array.isArray(v.teams) || !Array.isArray(v.individual)) continue;
  // probabilita' di scelta di ciascun brawler su questa mappa
  const ur = {};
  let tot = 0;
  for (const r of v.individual) {
    const c = cls[r.brawler];
    if (!c || !(r.ur > 0)) continue;
    ur[r.brawler] = r.ur; tot += r.ur;
  }
  if (!tot) continue;
  // probabilita' per CLASSE
  const pc = {};
  for (const [n, u] of Object.entries(ur)) pc[cls[n]] = (pc[cls[n]] || 0) + u / tot;
  // atteso: probabilita' che tre pescati indipendentemente siano tutti della
  // stessa classe, o che almeno due lo siano. Approssimazione dichiarata:
  // pescate indipendenti invece che senza rimpiazzo — con 106 brawler la
  // differenza e' trascurabile e non cambia l'ordine di grandezza.
  let pTripla = 0, pTutteDiverse = 0;
  const classi = Object.keys(pc);
  for (const c of classi) pTripla += Math.pow(pc[c], 3);
  for (let i = 0; i < classi.length; i++) for (let j = 0; j < classi.length; j++) for (let k = 0; k < classi.length; k++) {
    if (i !== j && j !== k && i !== k) pTutteDiverse += pc[classi[i]] * pc[classi[j]] * pc[classi[k]];
  }
  const pDoppia = 1 - pTutteDiverse - pTripla;
  mappe++;
  attesaTripla += pTripla; attesaDoppia += pDoppia;

  for (const t of v.teams) {
    if (!Array.isArray(t.team) || t.team.length !== 3) continue;
    const c = t.team.map((n) => cls[n]);
    if (c.some((x) => !x)) { senzaClasse++; continue; }
    trii++;
    const uniche = new Set(c).size;
    if (uniche === 1) { conTripla++; if (esempi.length < 6) esempi.push(`${v.map} (${v.modeFormatted}): ${t.team.join(" + ")} — tutti ${c[0]}, ${t.wr}%`); }
    else if (uniche === 2) conDoppia++;
  }
}

const attTripla = attesaTripla / mappe, attDoppia = attesaDoppia / mappe;
console.log(`mappe usate: ${mappe} · trii vincenti esaminati: ${trii}${senzaClasse ? ` (${senzaClasse} scartati: brawler senza classe)` : ""}`);
console.log(`\n                        osservato fra i trii VINCENTI      atteso a caso`);
console.log(`  tutti tre stessa classe   ${String(conTripla).padStart(4)} (${(100 * conTripla / trii).toFixed(2)}%)                 ${(100 * attTripla).toFixed(2)}%`);
console.log(`  esattamente due uguali    ${String(conDoppia).padStart(4)} (${(100 * conDoppia / trii).toFixed(2)}%)                 ${(100 * attDoppia).toFixed(2)}%`);
console.log(`  tutte tre diverse         ${String(trii - conTripla - conDoppia).padStart(4)} (${(100 * (trii - conTripla - conDoppia) / trii).toFixed(2)}%)                 ${(100 * (1 - attTripla - attDoppia)).toFixed(2)}%`);

// significativita': quante triple ci si aspetterebbe, e quanto e' lontano
const attese = trii * attTripla;
const sd = Math.sqrt(trii * attTripla * (1 - attTripla));
const z = sd > 0 ? (conTripla - attese) / sd : 0;
console.log(`\ntriple: osservate ${conTripla}, attese ${attese.toFixed(1)} (deviazione standard ${sd.toFixed(1)}) -> z = ${z.toFixed(2)}`);
console.log(z < -2 ? "  I TRII VINCENTI EVITANO la classe ripetuta piu' del caso: la penalita' ha una base."
  : z > 2 ? "  I trii vincenti hanno la classe ripetuta PIU' del caso: la penalita' sarebbe sbagliata."
  : "  Nessuna differenza dal caso: su questo dato la penalita' non e' giustificata ne' smentita.");
if (esempi.length) { console.log(`\ntrii vincenti con tutti e tre della stessa classe:`); for (const e of esempi) console.log("  " + e); }
console.log(`\nCAUTELA: sono i dieci trii MIGLIORI per mappa, cioe' un campione scelto per la coda.
Dice qualcosa su cosa c'e' in cima, non sulla popolazione. E la classe a sette
gruppi e' grossa: "tre Damage Dealer" puo' voler dire tre brawler che giocano
in modo diverso.`);
