// I TRATTI SERVONO DAVVERO A PREVEDERE UN COUNTER? Misurato, non supposto.
//
// La domanda arriva da una richiesta precisa: "in base ai pick dell'avversario
// ci sara' una sorta di vantaggio tecnico di brawler da utilizzare, non e'
// possibile che non riesci a individuarlo". Il vantaggio esiste nei dati veri
// (le coppie misurate hanno deviazione standard 4,5 punti) ma per il 94,6%
// delle coppie non c'e' misura e la stima e' piatta (deviazione 1,7), perche'
// l'unica cosa che il modello sa di un brawler e' la sua classe: sette gruppi.
//
// Qui si prova ad aggiungere i tratti meccanici estratti dalle etichette
// ufficiali (script/estrai-tratti.js) e si guarda FUORI CAMPIONE se la
// previsione delle coppie misurate migliora. Validazione a 10 pieghe: in ogni
// piega il favore per brawler, le celle di classe E i coefficienti dei tratti
// vengono ricalcolati SOLO sulle 9 pieghe di allenamento, quindi il numero
// finale non e' contaminato dalle coppie che deve prevedere.
//
// Se non migliora, non si tocca niente e lo si dice.
//
// ESITO, 9 settembre 2026: NON MIGLIORA. Su 605 coppie misurate, con 10 pieghe
// e la penalizzazione migliore (lambda 120), i tratti portano dal 53,2% al
// 53,4% di varianza spiegata: due decimi, cioe' niente. L'errore medio resta
// 2,95 punti. I coefficienti che escono sono tutti sotto mezzo punto — il piu'
// grande e' +0,33 ("io controllo spazio contro chi blocca").
//
// Perche' non funziona, ed e' la risposta alla domanda "perche' non riesci a
// fare una vera mappa di counter": il termine per brawler (il favore) assorbe
// gia' quasi tutto quello che una descrizione a grana grossa puo' dire. Quello
// che resta e' specifico DELLA COPPIA — Shelly contro Frank, non "corto raggio
// contro chi regge" — e quello si sa solo se qualcuno l'ha misurato. Le fonti
// pubblicano i 3 migliori e i 3 peggiori per brawler: 605 coppie su 5.778.
// Sulle coppie misurate il 46,8% della varianza NON e' spiegato da classe e
// favore, cioe' circa 3,1 punti di deviazione standard di vantaggio vero che
// per il 90% delle coppie nessuno ha pubblicato.
//
// Quindi il limite e' del dato, non del modello. Non rifare questo tentativo
// con altre parole chiave: il problema non e' l'estrazione, e' che nove tratti
// binari non possono contenere l'informazione di 5.778 coppie.
const fs = require("fs");
const path = require("path");
const { carica } = require("./carica-app.js");
const a = carica();
const cls = {}; for (const b of a.BRAWLERS) cls[b.name] = b.class;

// i tratti (file generato)
// va lanciato dopo estrai-tratti.js, che genera questo file
const sorgTratti = fs.readFileSync(path.join(__dirname, "tratti-generati.js"), "utf8");
const { TRATTI, TRATTI_NOMI } = new Function(sorgTratti + ";return {TRATTI, TRATTI_NOMI};")();

// le coppie misurate, una sola volta per coppia
const mis = [];
for (const x of Object.keys(a.MATCHUPS)) for (const y of Object.keys(a.MATCHUPS[x])) {
  const ox = a.BRAWLER_OVERALL[x], oy = a.BRAWLER_OVERALL[y];
  if (ox === undefined || oy === undefined || !cls[x] || !cls[y]) continue;
  if (a.MATCHUPS[y] && a.MATCHUPS[y][x] !== undefined && y < x) continue;
  mis.push({ a: x, b: y, res: a.MATCHUPS[x][y] - (50 + (ox - oy)), ca: cls[x], cb: cls[y] });
}

// le 36 combinazioni di tratti, antisimmetriche per costruzione:
//   f(s,t) = ha_s(io)*ha_t(lui) - ha_s(lui)*ha_t(io)
// f(t,s) = -f(s,t), quindi solo s<t e' indipendente: 9*8/2 = 36 coefficienti.
const COPPIE = [];
for (let i = 0; i < TRATTI_NOMI.length; i++) for (let j = i + 1; j < TRATTI_NOMI.length; j++) COPPIE.push([TRATTI_NOMI[i], TRATTI_NOMI[j]]);
// in tratti.js ogni brawler ha un ELENCO di tratti, non un oggetto
const ha = (n, t) => ((TRATTI[n] || []).includes(t) ? 1 : 0);
function tratti(x, y) {
  return COPPIE.map(([s, t]) => ha(x, s) * ha(y, t) - ha(y, s) * ha(x, t));
}
for (const m of mis) m.tr = tratti(m.a, m.b);
console.log(`coppie misurate: ${mis.length} · coefficienti di tratto: ${COPPIE.length}`);
const conTratti = mis.filter((m) => m.tr.some((v) => v !== 0)).length;
console.log(`coppie in cui almeno un tratto distingue i due: ${conTratti} (${(100*conTratti/mis.length).toFixed(0)}%)`);

// ---- pezzi che dipendono dalle SOLE coppie di allenamento -----------------
const FAVORE_K0 = 6;
function allena(train) {
  const S = {}, N = {}, cA = {}, cN = {}, aA = {}, aN = {}, dA = {}, dN = {};
  const add = (o, n, k, v) => { o[k] = (o[k] || 0) + v; n[k] = (n[k] || 0) + 1; };
  for (const m of train) {
    add(S, N, m.a, m.res); add(S, N, m.b, -m.res);
    add(cA, cN, m.ca + "|" + m.cb, m.res); add(cA, cN, m.cb + "|" + m.ca, -m.res);
    add(aA, aN, m.ca, m.res); add(aA, aN, m.cb, -m.res);
    add(dA, dN, m.cb, m.res); add(dA, dN, m.ca, -m.res);
  }
  const fav = (chi) => { const n = N[chi] || 0; return n > 0 ? (S[chi] / n) * (n / (n + FAVORE_K0)) : 0; };
  const media = (acc, n, k) => (n[k] > 0 ? acc[k] / n[k] : 0);
  const classe = (ca, cb) => {
    const k = ca + "|" + cb;
    if ((cN[k] || 0) >= 5) return media(cA, cN, k);
    return media(aA, aN, ca) + media(dA, dN, cb);
  };
  return { fav, classe };
}

// ---- minimi quadrati con penalizzazione (ridge) ---------------------------
function ridge(X, y, lam, nonPenalizzati) {
  const p = X[0].length;
  const A = Array.from({ length: p }, () => new Float64Array(p + 1));
  for (let i = 0; i < X.length; i++) {
    const xi = X[i];
    for (let r = 0; r < p; r++) { const v = xi[r]; if (!v) continue;
      for (let c = 0; c < p; c++) A[r][c] += v * xi[c];
      A[r][p] += v * y[i];
    }
  }
  for (let r = 0; r < p; r++) if (r >= nonPenalizzati) A[r][r] += lam;
  // eliminazione di Gauss con pivot
  for (let c = 0; c < p; c++) {
    let piv = c;
    for (let r = c + 1; r < p; r++) if (Math.abs(A[r][c]) > Math.abs(A[piv][c])) piv = r;
    if (Math.abs(A[piv][c]) < 1e-12) continue;
    const t = A[c]; A[c] = A[piv]; A[piv] = t;
    for (let r = 0; r < p; r++) {
      if (r === c) continue;
      const f = A[r][c] / A[c][c];
      if (!f) continue;
      for (let k = c; k <= p; k++) A[r][k] -= f * A[c][k];
    }
  }
  const beta = new Array(p).fill(0);
  for (let r = 0; r < p; r++) if (Math.abs(A[r][r]) > 1e-12) beta[r] = A[r][p] / A[r][r];
  return beta;
}

// ---- validazione a 10 pieghe --------------------------------------------
const PIEGHE = 10;
// mescolata deterministica: lo stesso risultato a ogni esecuzione
let seme = 12345;
const rnd = () => ((seme = (seme * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
const ordine = mis.map((m, i) => ({ i, k: rnd() })).sort((x, y) => x.k - y.k).map((o) => o.i);

function valuta(usaTratti, lam) {
  const pred = new Array(mis.length).fill(0);
  for (let f = 0; f < PIEGHE; f++) {
    const testIdx = ordine.filter((_, k) => k % PIEGHE === f);
    const test = new Set(testIdx);
    const train = mis.filter((_, i) => !test.has(i));
    const mo = allena(train);
    const riga = (m) => {
      const b = [mo.classe(m.ca, m.cb), mo.fav(m.a) - mo.fav(m.b)];
      return usaTratti ? b.concat(m.tr) : b;
    };
    const X = train.map(riga), y = train.map((m) => m.res);
    const beta = ridge(X, y, lam, 2);
    for (const i of testIdx) pred[i] = riga(mis[i]).reduce((s, v, k) => s + v * beta[k], 0);
  }
  const y = mis.map((m) => m.res);
  const my = y.reduce((s, v) => s + v, 0) / y.length;
  const tt = y.reduce((s, v) => s + (v - my) ** 2, 0);
  const rss = y.reduce((s, v, i) => s + (v - pred[i]) ** 2, 0);
  const mae = y.reduce((s, v, i) => s + Math.abs(v - pred[i]), 0) / y.length;
  return { r2: 1 - rss / tt, mae, sd: Math.sqrt(pred.reduce((s, v) => s + v * v, 0) / pred.length) };
}

const senza = valuta(false, 0);
console.log(`\nSENZA tratti (modello attuale: classe + favore)`);
console.log(`  varianza spiegata fuori campione : ${(100 * senza.r2).toFixed(1)}%`);
console.log(`  errore medio assoluto            : ${senza.mae.toFixed(2)} punti`);
console.log(`  dispersione della previsione      : ${senza.sd.toFixed(2)} punti`);

console.log(`\nCON i tratti, al variare della penalizzazione:`);
let best = { r2: -Infinity };
for (const lam of [0, 5, 20, 50, 120, 300, 800, 2000, 5000]) {
  const r = valuta(true, lam);
  console.log(`  lambda ${String(lam).padStart(5)}  varianza ${(100 * r.r2).toFixed(1)}%  errore ${r.mae.toFixed(2)}  dispersione ${r.sd.toFixed(2)}`);
  if (r.r2 > best.r2) best = { ...r, lam };
}
console.log(`\n=> migliore con i tratti: lambda ${best.lam}, varianza ${(100 * best.r2).toFixed(1)}% contro ${(100 * senza.r2).toFixed(1)}% senza.`);
const guadagno = 100 * (best.r2 - senza.r2);
console.log(`   guadagno: ${guadagno >= 0 ? "+" : ""}${guadagno.toFixed(1)} punti di varianza spiegata.`);

// Si scrivono i pesi solo se il guadagno e' REALE: sotto un punto di varianza
// spiegata e' rumore della validazione, e un file di pesi in giro sembrerebbe
// una cosa che l'app usa.
if (guadagno >= 1) {
  // i coefficienti finali, allenati su TUTTO, da scrivere nell'app
  const mo = allena(mis);
  const riga = (m) => [mo.classe(m.ca, m.cb), mo.fav(m.a) - mo.fav(m.b)].concat(m.tr);
  const beta = ridge(mis.map(riga), mis.map((m) => m.res), best.lam, 2);
  console.log(`\n   coefficienti: classe ${beta[0].toFixed(3)}  favore ${beta[1].toFixed(3)}`);
  const co = COPPIE.map(([s, t], k) => ({ s, t, v: beta[k + 2] })).filter((c) => Math.abs(c.v) >= 0.15);
  co.sort((x, y) => Math.abs(y.v) - Math.abs(x.v));
  console.log(`   tratti con effetto almeno 0,15 punti (${co.length} su ${COPPIE.length}):`);
  for (const c of co) console.log(`     ${c.v > 0 ? "+" : ""}${c.v.toFixed(2)}  io ${c.s.padEnd(9)} contro lui ${c.t}`);
  fs.writeFileSync(path.join(__dirname, "tratti-pesi.json"),
    JSON.stringify({ lambda: best.lam, classe: beta[0], favore: beta[1],
      coppie: COPPIE.map(([s, t], k) => [s, t, Math.round(beta[k + 2] * 1000) / 1000]),
      varianzaSpiegata: Math.round(best.r2 * 1000) / 1000, senzaTratti: Math.round(senza.r2 * 1000) / 1000 }, null, 1));
  console.log(`\n   scritto script/tratti-pesi.json`);
}
