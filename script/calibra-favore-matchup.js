// Il modello assume che, tolta la differenza di forza generale, il residuo
// medio di ogni brawler sia zero: nessuno sarebbe "genericamente scomodo da
// affrontare". I dati dicono il contrario, e la dispersione fra brawler e' per
// il 41% segnale reale (vedi misura-distorsione-matchup.js).
//
// Qui si verifica FUORI CAMPIONE se aggiungere quel termine migliora la
// previsione delle coppie mai misurate — il 64% di quelle che contano in un
// draft. Ogni misurazione e' UNICA (623, non 1246 versi): tenere i due versi
// significherebbe validare su righe che sono la stessa osservazione.
const { carica } = require("./carica-app.js");
const a = carica();
const cls = {}; for (const b of a.BRAWLERS) cls[b.name] = b.class;

const mis = [];
for (const x of Object.keys(a.MATCHUPS)) for (const y of Object.keys(a.MATCHUPS[x])) {
  const ox = a.BRAWLER_OVERALL[x], oy = a.BRAWLER_OVERALL[y];
  if (ox === undefined || oy === undefined || !cls[x] || !cls[y]) continue;
  // una sola volta per coppia, orientata in modo stabile
  if (a.MATCHUPS[y] && a.MATCHUPS[y][x] !== undefined && y < x) continue;
  mis.push({ a: x, b: y, res: a.MATCHUPS[x][y] - (50 + (ox - oy)), ca: cls[x], cb: cls[y] });
}
console.log(`misurazioni uniche: ${mis.length}`);

// somme complete; ogni misurazione contribuisce +res ad a e -res a b
const S = {}, N = {};
const cAcc = {}, cN = {}, aAcc = {}, aN = {}, dAcc = {}, dN = {};
const add = (o, n, k, v) => { o[k] = (o[k] || 0) + v; n[k] = (n[k] || 0) + 1; };
for (const m of mis) {
  add(S, N, m.a, m.res); add(S, N, m.b, -m.res);
  add(cAcc, cN, m.ca + "|" + m.cb, m.res); add(cAcc, cN, m.cb + "|" + m.ca, -m.res);
  add(aAcc, aN, m.ca, m.res); add(aAcc, aN, m.cb, -m.res);
  add(dAcc, dN, m.cb, m.res); add(dAcc, dN, m.ca, -m.res);
}

// previsione della coppia m, con m completamente esclusa
function prev(m, k0) {
  const fav = (chi, segno) => {
    const n = N[chi] - 1;
    if (n <= 0) return 0;
    const media = (S[chi] - segno * m.res) / n;
    return k0 === null ? media : media * (n / (n + k0)); // restringimento per affidabilita'
  };
  const senza = (acc, n, k, segno) => { const nn = n[k] - 1; return nn > 0 ? (acc[k] - segno * m.res) / nn : 0; };
  const kc = m.ca + "|" + m.cb;
  const cella = (cN[kc] - 1) >= 5 ? senza(cAcc, cN, kc, 1) : senza(aAcc, aN, m.ca, 1) + senza(dAcc, dN, m.cb, 1);
  return { classe: cella, favore: fav(m.a, 1) - fav(m.b, -1) };
}

function valuta(etichetta, k0) {
  const d = mis.map((m) => ({ y: m.res, ...prev(m, k0) }));
  const my = d.reduce((s, r) => s + r.y, 0) / d.length;
  const tt = d.reduce((s, r) => s + (r.y - my) ** 2, 0);
  const r2 = (f) => 1 - d.reduce((s, r) => s + (r.y - f(r)) ** 2, 0) / tt;
  // minimi quadrati sui due predittori, fuori campione
  let a11=0,a12=0,a22=0,b1=0,b2=0;
  for (const r of d) { a11+=r.classe**2; a12+=r.classe*r.favore; a22+=r.favore**2; b1+=r.classe*r.y; b2+=r.favore*r.y; }
  const det=a11*a22-a12*a12, k1=(b1*a22-b2*a12)/det, k2=(b2*a11-b1*a12)/det;
  console.log(`\n${etichetta}`);
  console.log(`  solo classe x0,75 (modello attuale)     : ${(100*r2(r => 0.75*r.classe)).toFixed(1)}%`);
  console.log(`  solo favore                             : ${(100*r2(r => r.favore)).toFixed(1)}%`);
  console.log(`  coefficienti fuori campione             : classe ${k1.toFixed(3)}  favore ${k2.toFixed(3)}`);
  console.log(`  varianza spiegata con quei coefficienti : ${(100*r2(r => k1*r.classe + k2*r.favore)).toFixed(1)}%`);
  console.log(`  con i coefficienti tondi 0,2 e 1,0      : ${(100*r2(r => 0.2*r.classe + 1.0*r.favore)).toFixed(1)}%`);
  return { k1, k2, r2: r2(r => k1*r.classe + k2*r.favore), tondi: r2(r => 0.2*r.classe + 1.0*r.favore) };
}

const senzaRestr = valuta("SENZA restringimento per affidabilita'", null);
const risultati = [{ k0: null, ...senzaRestr }];
for (const k0 of [3, 6, 10, 16, 25]) risultati.push({ k0, ...valuta(`CON restringimento k0=${k0} (n/(n+k0))`, k0) });
risultati.sort((x, y) => y.r2 - x.r2);
const best = risultati[0];
console.log(`\n=> migliore: k0=${best.k0}  classe ${best.k1.toFixed(2)}  favore ${best.k2.toFixed(2)}  varianza spiegata ${(100*best.r2).toFixed(1)}%`);
console.log(`   (il modello attuale, solo classe x0,75, spiega il ${(100*(1 - mis.map(m=>({y:m.res,...prev(m,best.k0)})).reduce((s,r)=>s+(r.y-0.75*r.classe)**2,0)/mis.map(m=>m.res).reduce((s,v,i,arr)=>s+(v-arr.reduce((t,x)=>t+x,0)/arr.length)**2,0))).toFixed(1)}%)`);
