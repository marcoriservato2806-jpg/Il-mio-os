// Le fonti pubblicano, per ogni brawler, solo i 3 migliori e i 3 peggiori
// matchup. Non e' un campione casuale: e' un campione scelto SUL RISULTATO.
// Se la selezione fosse simmetrica (3 sopra, 3 sotto) il residuo medio di
// ogni brawler resterebbe intorno a zero. Se non lo e', il modello attribuisce
// a un brawler un vantaggio che viene dal modo in cui il dato e' stato
// raccolto, non dal gioco — ed e' esattamente il difetto che fa consigliare
// troppo un brawler.
const { carica } = require("./carica-app.js");
const a = carica();
const cls = {}; for (const b of a.BRAWLERS) cls[b.name] = b.class;

// ogni coppia misurata, letta nei DUE versi (come fa l'app)
const perBrawler = {};
for (const x of Object.keys(a.MATCHUPS)) {
  for (const y of Object.keys(a.MATCHUPS[x])) {
    const ox = a.BRAWLER_OVERALL[x], oy = a.BRAWLER_OVERALL[y];
    if (ox === undefined || oy === undefined) continue;
    const res = a.MATCHUPS[x][y] - (50 + (ox - oy));
    (perBrawler[x] = perBrawler[x] || []).push(res);
    (perBrawler[y] = perBrawler[y] || []).push(-res);
  }
}
const righe = Object.entries(perBrawler).map(([n, v]) => ({
  n, k: v.length, m: v.reduce((s, x) => s + x, 0) / v.length,
  overall: a.BRAWLER_OVERALL[n], use: a.USE_RATES[n],
})).filter(r => r.k >= 6);

const tutti = righe.flatMap(r => perBrawler[r.n]);
console.log(`brawler con almeno 6 coppie: ${righe.length}`);
console.log(`residuo medio complessivo: ${(tutti.reduce((s,x)=>s+x,0)/tutti.length).toFixed(3)} (zero: il modello nel suo insieme e' centrato)\n`);

const ms = righe.map(r => r.m);
const mm = ms.reduce((s,x)=>s+x,0)/ms.length;
const sd = Math.sqrt(ms.reduce((s,x)=>s+(x-mm)**2,0)/ms.length);
console.log(`residuo medio PER BRAWLER: media ${mm.toFixed(2)}, deviazione standard ${sd.toFixed(2)}`);
console.log(`  se il campionamento fosse simmetrico questa dispersione sarebbe piccola.`);
console.log(`  quanti brawler hanno un residuo medio oltre +/-3 punti: ${righe.filter(r=>Math.abs(r.m)>3).length}/${righe.length}\n`);

const corr = (f, g) => {
  const xs = righe.map(f), ys = righe.map(g);
  const mx = xs.reduce((s,x)=>s+x,0)/xs.length, my = ys.reduce((s,x)=>s+x,0)/ys.length;
  let sxy=0,sxx=0,syy=0;
  for (let i=0;i<xs.length;i++){ sxy+=(xs[i]-mx)*(ys[i]-my); sxx+=(xs[i]-mx)**2; syy+=(ys[i]-my)**2; }
  return sxy/Math.sqrt(sxx*syy);
};
console.log("il residuo medio di un brawler e' legato a...");
console.log(`  quante sue coppie sono state registrate : ${corr(r=>r.m, r=>r.k).toFixed(3)}`);
console.log(`  la sua forza generale                   : ${corr(r=>r.m, r=>r.overall).toFixed(3)}`);
console.log(`  quanto viene giocato                    : ${corr(r=>r.m, r=>r.use === undefined ? 0 : r.use).toFixed(3)}`);
console.log("");
righe.sort((x,y)=>y.m-x.m);
const f = (r) => `${r.n} ${r.m>0?"+":""}${r.m.toFixed(1)} (${r.k} coppie, forza ${r.overall})`;
console.log("piu' favoriti dal campione:", righe.slice(0,6).map(f).join(" · "));
console.log("piu' penalizzati          :", righe.slice(-6).map(f).join(" · "));
