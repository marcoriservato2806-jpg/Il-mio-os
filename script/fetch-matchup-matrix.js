// LA MATRICE COMPLETA DEI MATCHUP E DELLE SINERGIE, per modalita' di Classificata.
//
// PERCHE' ESISTE. Fino al 9/9 la memoria diceva: «nessuna fonte pubblica la
// matrice completa dei matchup, tutte si fermano ai 3 migliori e 3 peggiori per
// brawler; il tetto e' del dato, non della ricerca». Era sbagliato, e l'utente
// ha insistito che da qualche parte quel dato dovesse stare. Aveva ragione.
//
// Le PAGINE di brawlplanet mostrano 5 migliori e 5 peggiori. Ma il loro Draft
// Helper (`/powerleague/draft`, che non e' nella sitemap) e' interattivo: deve
// rispondere a ogni pick senza chiamare il server, quindi la matrice la scarica
// nel browser. Nel suo pezzo di codice c'e' scritto da dove:
//
//     fetch(`https://storage.googleapis.com/brawlanalyzer-public/draft/pairs-${mode}.json.gz`)
//
// dove `mode` e' la modalita' (`gemGrab`, `brawlBall`, `bounty`, `heist`,
// `hotZone`, `knockout`). E' il bucket pubblico da cui il loro sito stesso
// legge, senza chiave e con CORS aperto: leggerlo e' quello che fa un browser
// qualunque aprendo la loro pagina.
//
// La lezione, che vale oltre questo caso: una pagina che mostra dieci righe non
// prova che il dato sia dieci righe. Se la pagina e' interattiva, il dato pieno
// e' passato dal browser, e si trova guardando cosa scarica.
//
// COSA CONTIENE OGNI FILE (verificato, non supposto):
//   brawlers        108 nomi in maiuscolo, identici al nostro roster
//   matchup.adv     108x108, quanto A fa meglio o peggio contro B di quanto la
//                   forza generale dei due preveda. Scala x10: 37 = +3,7 punti.
//                   Antisimmetrica ESATTA: adv[a][b] + adv[b][a] = 0.
//   matchup.wr      108x108, percentuale di vittorie vera x10 (565 = 56,5%).
//                   wr[a][b] + wr[b][a] = 1000 esatto.
//   synergy.adv/wr  108x108 con A e B COMPAGNI. Simmetriche esatte.
//   calibration     come loro convertono la somma dei vantaggi in probabilita'
//
// Copertura misurata su Gem Grab: matchup.adv 95,8% delle 11.556 caselle,
// matchup.wr 83,4%. Le nostre erano 624 caselle, il 5,4%.
//
// Uso:  node script/fetch-matchup-matrix.js
//       BRAWL_MX_CACHE=/percorso node script/fetch-matchup-matrix.js   (usa i file gia' scaricati)
const fs = require("fs");
const path = require("path");

const BUCKET = "https://storage.googleapis.com/brawlanalyzer-public";
const MODI = ["gemGrab", "brawlBall", "bounty", "heist", "hotZone", "knockout"];
const VUOTO = -32768; // sentinella "nessun dato": non e' un valore possibile

async function scarica(nome) {
  const cache = process.env.BRAWL_MX_CACHE;
  if (cache) {
    const p = path.join(cache, "mx-" + nome + ".json");
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, "utf8"));
  }
  const r = await fetch(`${BUCKET}/draft/pairs-${nome}.json.gz`);
  if (!r.ok) throw new Error(`${nome}: il bucket ha risposto ${r.status}`);
  return await r.json(); // il file e' servito con content-encoding gzip: fetch lo scompatta
}

// ---- controlli. Se uno fallisce non si scrive niente: meglio il dato vecchio.
function verifica(nome, d, roster) {
  const B = d.brawlers;
  const err = [];
  if (!Array.isArray(B) || B.length < 100) err.push(`elenco brawler assente o corto (${B && B.length})`);
  const suo = new Set(B);
  for (const n of roster) if (!suo.has(n.toUpperCase())) err.push(`manca dal loro elenco: ${n}`);
  const n = B.length;
  for (const [chiave, atteso] of [["matchup", "anti"], ["synergy", "sim"]]) {
    const o = d[chiave];
    if (!o || !Array.isArray(o.adv) || !Array.isArray(o.wr)) { err.push(`${chiave}: adv o wr assenti`); continue; }
    let vAdv = 0, vWr = 0, celle = 0, pieneAdv = 0, pieneWr = 0;
    for (let i = 0; i < n; i++) {
      if (o.adv[i][i] !== null || o.wr[i][i] !== null) err.push(`${chiave}: diagonale non vuota in ${B[i]}`);
      for (let j = i + 1; j < n; j++) {
        celle++;
        const a = o.adv[i][j], b = o.adv[j][i], w = o.wr[i][j], x = o.wr[j][i];
        if (a !== null) pieneAdv++;
        if (w !== null) pieneWr++;
        if (a !== null && b !== null && (atteso === "anti" ? a + b !== 0 : a - b !== 0)) vAdv++;
        if (w !== null && x !== null && (atteso === "anti" ? w + x !== 1000 : w - x !== 0)) vWr++;
        if (w !== null && (w < 100 || w > 900)) err.push(`${chiave}: win rate fuori scala ${w / 10}% fra ${B[i]} e ${B[j]}`);
        if (a !== null && Math.abs(a) > 400) err.push(`${chiave}: vantaggio assurdo ${a / 10} fra ${B[i]} e ${B[j]}`);
      }
    }
    if (vAdv) err.push(`${chiave}: ${vAdv} coppie violano la simmetria di adv`);
    if (vWr) err.push(`${chiave}: ${vWr} coppie violano la simmetria di wr`);
    console.log(`  ${nome} ${chiave.padEnd(8)} coppie ${celle}  adv piene ${(100 * pieneAdv / celle).toFixed(1)}%  wr piene ${(100 * pieneWr / celle).toFixed(1)}%`);
  }
  return err;
}

// ---- LA FORZA GENERALE, RICAVATA DALLA MATRICE STESSA --------------------
//
// Serve a rispondere a "quanto e' forte l'avversario che hai davanti rispetto a
// uno qualunque". Prima l'app usava BRAWLER_OVERALL, che viene da brawlmetrics
// ed e' la win rate di CHI GIOCA quel brawler: per un brawler raro e' gonfiata
// dalla selezione. Diceva che Amber vale 64,9 quando la sua win rate vera su
// Pinball Dreams e' 48,8, e ne usciva "affrontare Amber costa 14,6 punti" —
// piu' del triplo di qualunque counter vero, e con il segno legato alla rarita'
// invece che alla forza.
//
// La forza sulla scala GIUSTA si ricava dalla matrice stessa. Il dato soddisfa
//   wr(a,b) = 500 + (forza_a - forza_b) + adv(a,b)
// e questo si verifica: sulle 8.124 coppie di Brawl Ball che hanno sia adv sia
// wr, il residuo di quel modello additivo ha deviazione standard 0,47 punti.
// Quindi le differenze di forza si leggono dai dati e si risolvono con qualche
// iterazione (media di riga, ricentrata a zero). Stessa fonte, stessa scala,
// nessuna mescolanza. La scala che esce e' ±1,7 punti, non ±14.
function forze(d) {
  const B = d.brawlers, n = B.length;
  const A = d.matchup.adv, W = d.matchup.wr;
  const righe = [];
  for (let i = 0; i < n; i++) {
    const l = [];
    for (let j = 0; j < n; j++) {
      if (i === j || A[i][j] === null || W[i][j] === null) continue;
      l.push([j, W[i][j] - 500 - A[i][j]]); // = forza_i - forza_j
    }
    righe.push(l);
  }
  let o = new Array(n).fill(0);
  for (let giro = 0; giro < 200; giro++) {
    const nuovo = new Array(n);
    for (let i = 0; i < n; i++) {
      const l = righe[i];
      if (!l.length) { nuovo[i] = o[i]; continue; }
      let s = 0;
      for (const [j, dv] of l) s += dv + o[j];
      nuovo[i] = s / l.length;
    }
    const m = nuovo.reduce((s, x) => s + x, 0) / n;
    o = nuovo.map((x) => x - m);
  }
  // quanto e' buono il modello additivo: si stampa, non si assume
  let s2 = 0, cnt = 0, peggio = 0;
  for (let i = 0; i < n; i++) for (const [j, dv] of righe[i]) {
    const r = dv - (o[i] - o[j]); s2 += r * r; cnt++; if (Math.abs(r) > peggio) peggio = Math.abs(r);
  }
  const sd = cnt ? Math.sqrt(s2 / cnt) : 0;
  return { forza: o, sd, peggio, cnt };
}

// ---- codifica. Tutte e quattro le matrici sono simmetriche o antisimmetriche,
// quindi basta il triangolo superiore: 5.778 numeri invece di 11.664. In interi
// a 16 bit, in base64, cosi' il file resta testo e l'app lo legge in un colpo.
function codifica(o, n, roster, indiceLoro, tipo) {
  const m = (n * (n - 1)) / 2;
  const buf = new Int16Array(m);
  let k = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++, k++) {
      const a = indiceLoro[roster[i].toUpperCase()], b = indiceLoro[roster[j].toUpperCase()];
      const v = a === undefined || b === undefined ? null : o[tipo][a][b];
      buf[k] = v === null || v === undefined ? VUOTO : v;
    }
  }
  return Buffer.from(buf.buffer).toString("base64");
}

async function main() {
  const dir = path.join(__dirname, "..", "brawl-draft");
  const dataSrc = fs.readFileSync(path.join(dir, "data.js"), "utf8");
  const i = dataSrc.indexOf("const BRAWLERS");
  const roster = [...dataSrc.slice(i, dataSrc.indexOf("];", i)).matchAll(/name:\s*"([^"]+)"/g)].map((m) => m[1]);
  if (roster.length < 100) throw new Error("roster non letto da data.js: " + roster.length);
  console.log(`roster: ${roster.length} brawler`);

  const pezzi = {};
  const problemi = [];
  let calib = null;
  for (const modo of MODI) {
    const d = await scarica(modo);
    const err = verifica(modo, d, roster);
    if (err.length) { problemi.push(...err.map((e) => modo + ": " + e)); continue; }
    const n = roster.length;
    const idx = {};
    d.brawlers.forEach((nome, k) => { idx[nome] = k; });
    const f = forze(d);
    console.log(`  ${modo} forza implicita: residuo del modello additivo sd ${(f.sd / 10).toFixed(2)} punti su ${f.cnt} coppie (max ${(f.peggio / 10).toFixed(1)})`);
    // la forza nell'ordine del NOSTRO roster, in decimi di punto arrotondati
    const forzaRoster = new Int16Array(n);
    for (let k = 0; k < n; k++) {
      const a = idx[roster[k].toUpperCase()];
      forzaRoster[k] = a === undefined ? VUOTO : Math.round(f.forza[a]);
    }
    pezzi[modo] = {
      adv: codifica(d.matchup, n, roster, idx, "adv"),
      wr: codifica(d.matchup, n, roster, idx, "wr"),
      sinAdv: codifica(d.synergy, n, roster, idx, "adv"),
      sinWr: codifica(d.synergy, n, roster, idx, "wr"),
      forza: Buffer.from(forzaRoster.buffer).toString("base64"),
    };
    if (!calib) calib = d.calibration;
  }
  if (problemi.length) {
    console.error("\nCONTROLLI FALLITI, non scrivo niente:");
    for (const p of problemi) console.error("  " + p);
    process.exit(1);
  }

  const oggi = new Date().toISOString().slice(0, 10);
  const righe = Object.entries(pezzi).map(([m, p]) =>
    `  ${m}: {\n    adv: "${p.adv}",\n    wr: "${p.wr}",\n    sinAdv: "${p.sinAdv}",\n    sinWr: "${p.sinWr}",\n    forza: "${p.forza}",\n  },`).join("\n");
  const out = `// GENERATO da script/fetch-matchup-matrix.js il ${oggi} — non modificare a mano.
//
// LA MATRICE COMPLETA DEI MATCHUP, per modalita' di Classificata. Fonte:
// storage.googleapis.com/brawlanalyzer-public/draft/pairs-<modalita>.json.gz,
// cioe' il bucket pubblico da cui il Draft Helper di brawlplanet.com legge nel
// browser. Stessa fonte delle win rate di mappa: nessuna mescolanza.
//
// Contiene, per ognuna delle sei modalita' e per tutte le 5.778 coppie:
//   adv     quanto il primo fa meglio o peggio del previsto contro il secondo,
//           al netto della forza generale dei due. Scala x10: 37 = +3,7 punti.
//   wr      percentuale di vittorie vera del primo contro il secondo, x10.
//   sinAdv  lo stesso vantaggio quando i due sono COMPAGNI di squadra.
//   sinWr   percentuale di vittorie vera quando sono compagni, x10.
//   forza   la forza generale di ogni brawler in quella modalita', ricavata
//           dalla matrice stessa risolvendo wr = 500 + (forza_a - forza_b) + adv.
//           Un valore per brawler, nell'ordine del roster, ricentrato a zero.
//           Serve a dire quanto e' forte l'avversario che hai davanti SULLA
//           STESSA SCALA delle win rate di mappa — cosa che BRAWLER_OVERALL non
//           faceva, perche' e' la win rate di chi gioca quel brawler e per un
//           brawler raro e' gonfiata dalla selezione.
//
// Codifica: triangolo superiore del roster (nell'ordine di BRAWLERS in
// data.js), interi a 16 bit, base64. adv e' antisimmetrica (adv[b][a] =
// -adv[a][b]), wr complementare (wr[b][a] = 1000 - wr[a][b]), le due di
// sinergia simmetriche — verificato esatto su tutte le coppie, non assunto.
// ${VUOTO} vuol dire "troppe poche partite per questa coppia".
//
// Calibrazione dichiarata dalla fonte: ${JSON.stringify(calib)}
// (Brier ${calib && calib.brier} su ${calib && calib.matches} partite; 0,25 e' il
// valore di chi tira a indovinare.)
const MX_VUOTO = ${VUOTO};
const MX_SCALA = 10; // i numeri sono decimi di punto percentuale
const MATRICE = {
${righe}
};
`;
  fs.writeFileSync(path.join(dir, "matrice.js"), out);
  const kb = (fs.statSync(path.join(dir, "matrice.js")).size / 1024).toFixed(0);
  console.log(`\nscritto brawl-draft/matrice.js (${kb} KB) · modalita': ${Object.keys(pezzi).join(", ")}`);
}
main().catch((e) => { console.error(String(e.message || e)); process.exit(1); });
