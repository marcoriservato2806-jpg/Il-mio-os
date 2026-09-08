// Il fattore con cui si accorciano le stime di classe (CLASS_EDGE_SHRINK,
// oggi 0,5) era una cautela ragionata, non una misura: le coppie misurate
// sono gli estremi di ogni brawler, quindi le medie per classe esagerano.
// Qui si misura di quanto, FUORI CAMPIONE: si ricostruisce la matrice di
// classe escludendo un brawler alla volta e si guarda quanto bene predice
// i residui di quello escluso. La pendenza della retta e' il fattore giusto.
// In campione darebbe 1 per costruzione — e' esattamente l'errore da evitare.
const { carica } = require("./carica-app.js");
const a = carica();

const cls = {}; for (const b of a.BRAWLERS) cls[b.name] = b.class;
const CLASSI = [...new Set(a.BRAWLERS.map(b => b.class))];

// tutte le coppie misurate, come residuo al netto della differenza di forza
const coppie = [];
for (const x of Object.keys(a.MATCHUPS)) {
  for (const y of Object.keys(a.MATCHUPS[x])) {
    const ox = a.BRAWLER_OVERALL[x], oy = a.BRAWLER_OVERALL[y];
    if (ox === undefined || oy === undefined || !cls[x] || !cls[y]) continue;
    coppie.push({ a: x, b: y, res: a.MATCHUPS[x][y] - (50 + (ox - oy)), ca: cls[x], cb: cls[y] });
  }
}
console.log(`coppie misurate utilizzabili: ${coppie.length}`);
const mres = coppie.reduce((s,c)=>s+c.res,0)/coppie.length;
console.log(`residuo medio: ${mres.toFixed(3)} (deve stare su zero: e' la verifica del modello)`);
console.log(`deviazione standard: ${Math.sqrt(coppie.reduce((s,c)=>s+(c.res-mres)**2,0)/coppie.length).toFixed(2)}\n`);

// matrice di classe (media dei residui per coppia di classi) su un sottoinsieme
function matrice(sub) {
  const acc = {}, atk = {}, def = {};
  for (const c of sub) {
    const k = c.ca + "|" + c.cb;
    (acc[k] = acc[k] || []).push(c.res);
    (atk[c.ca] = atk[c.ca] || []).push(c.res);
    (def[c.cb] = def[c.cb] || []).push(c.res);
  }
  const med = (o) => { const r = {}; for (const k of Object.keys(o)) r[k] = { m: o[k].reduce((s,v)=>s+v,0)/o[k].length, n: o[k].length }; return r; };
  return { acc: med(acc), atk: med(atk), def: med(def) };
}
// la previsione grezza, senza accorciarla: cella se ha abbastanza casi,
// altrimenti modello additivo sui margini — la stessa logica dell'app
function previsione(M, ca, cb, minN) {
  const cell = M.acc[ca + "|" + cb];
  if (cell && cell.n >= minN) return cell.m;
  const at = M.atk[ca], df = M.def[cb];
  if (!at || !df) return 0;
  return at.m + df.m;
}

for (const minN of [3, 5, 8]) {
  // fuori campione: si esclude un brawler alla volta (tutte le sue coppie)
  const brawlerConDati = [...new Set(coppie.flatMap(c => [c.a, c.b]))];
  const px = [], py = [];
  for (const escluso of brawlerConDati) {
    const dentro = coppie.filter(c => c.a !== escluso && c.b !== escluso);
    const fuori  = coppie.filter(c => c.a === escluso || c.b === escluso);
    if (!fuori.length) continue;
    const M = matrice(dentro);
    for (const c of fuori) { px.push(previsione(M, c.ca, c.cb, minN)); py.push(c.res); }
  }
  const n = px.length;
  const mx = px.reduce((s,v)=>s+v,0)/n, my = py.reduce((s,v)=>s+v,0)/n;
  let sxy=0, sxx=0, syy=0;
  for (let i=0;i<n;i++){ sxy+=(px[i]-mx)*(py[i]-my); sxx+=(px[i]-mx)**2; syy+=(py[i]-my)**2; }
  const pend = sxy/sxx, corr = sxy/Math.sqrt(sxx*syy);
  // R2 usando la previsione accorciata di quel fattore
  const r2 = (k) => { let ss=0, tt=0; for (let i=0;i<n;i++){ ss+=(py[i]-k*px[i])**2; tt+=(py[i]-my)**2; } return 1-ss/tt; };
  console.log(`soglia cella >= ${minN} osservazioni  (${n} previsioni fuori campione)`);
  console.log(`  pendenza fuori campione : ${pend.toFixed(3)}   <-- il fattore giusto`);
  console.log(`  correlazione            : ${corr.toFixed(3)}`);
  console.log(`  varianza spiegata con 0,5 (oggi): ${(100*r2(0.5)).toFixed(1)}%   con ${pend.toFixed(2)}: ${(100*r2(pend)).toFixed(1)}%   con 1,0: ${(100*r2(1)).toFixed(1)}%`);
}
