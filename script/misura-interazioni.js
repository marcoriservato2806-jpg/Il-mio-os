// Quanto pesano DAVVERO le interazioni (matchup, sinergia, rischio residuo)
// nel punteggio finale, misurato su tutte le mappe e su posizioni di draft
// realistiche. Serve a sapere se l'informazione sull'avversario cambia la
// risposta o se viene annegata dal dato di mappa.
const { carica } = require("./carica-app.js");
const a = carica();

const ds = (v) => { if (v.length < 2) return 0; const m = v.reduce((s,x)=>s+x,0)/v.length; return Math.sqrt(v.reduce((s,x)=>s+(x-m)**2,0)/v.length); };
const spearman = (x, y) => {
  const rank = (arr) => { const idx = arr.map((v,i)=>[v,i]).sort((p,q)=>q[0]-p[0]); const r = new Array(arr.length); idx.forEach(([,i],k)=>r[i]=k+1); return r; };
  const rx = rank(x), ry = rank(y), n = x.length;
  const mx = (n+1)/2, my = mx;
  let num=0, dx=0, dy=0;
  for (let i=0;i<n;i++){ num+=(rx[i]-mx)*(ry[i]-my); dx+=(rx[i]-mx)**2; dy+=(ry[i]-my)**2; }
  return num/Math.sqrt(dx*dy);
};

// Una posizione di draft realistica: gli avversari prendono quello che
// prenderebbe davvero un avversario (likelyEnemyPicks), non nomi a caso.
function posizione(map, nEnemy, nOwn) {
  a.state.mode = map.mode; a.state.map = map;
  a.state.bans = { A: [], B: [] }; a.state.picks = { A: [], B: [] };
  a.buildSequence();
  const prob = a.likelyEnemyPicks(12);
  const own = [], en = [];
  let i = 0;
  while (en.length < nEnemy && i < prob.length) en.push(prob[i++]);
  while (own.length < nOwn && i < prob.length) own.push(prob[i++]);
  a.state.picks.A = own; a.state.picks.B = en;
  return { own, en };
}

const righe = [];
const asim = { mis: [], stim: [] };
for (const map of a.MAPS) {
  for (const [nE, nO] of [[1,0],[2,1],[3,2]]) {
    const pos = posizione(map, nE, nO);
    const used = a.usedNames();
    const minacce = a.likelyEnemyPicks(8);
    const ownClasses = pos.own.map(a.classOf);
    const enemyClasses = pos.en.map(a.classOf);
    const cand = a.BRAWLERS.filter(b => !used.has(b.name) && a.schierabile(b.name))
      .map(b => {
        const s = a.scoreCandidate(b.name, b.class, ownClasses, enemyClasses, pos.en, minacce, 3 - pos.en.length);
        const risk = a.residualRisk(b.name, minacce);
        const worst = Math.min(s.perEnemy.length ? Math.min(...s.perEnemy.map(p=>p.edge)) : 0, risk ? risk.edge : 0);
        for (const p of s.perEnemy) (p.measured ? asim.mis : asim.stim).push(Math.abs(p.edge));
        return { name: b.name, total: s.total, base: s.base, mu: s.matchupAvg, syn: s.synergy, floor: s.base + worst,
                 misurati: s.perEnemy.filter(p=>p.measured).length, nEnemy: s.perEnemy.length };
      });
    if (cand.length < 10) continue;
    const perTotal = [...cand].sort((x,y)=>y.total-x.total);
    const perBase  = [...cand].sort((x,y)=>y.base-x.base);
    const perFloor = [...cand].sort((x,y)=>y.floor-x.floor);
    righe.push({
      mappa: map.name, nE,
      sdBase: ds(cand.map(c=>c.base)),
      sdMu: ds(cand.map(c=>c.mu)),
      sdSyn: ds(cand.map(c=>c.syn)),
      sdFloorGap: ds(cand.map(c=>c.base - c.floor)),
      top: perTotal[0].name, topBase: perBase[0].name,
      cambia: perTotal[0].name !== perBase[0].name,
      rho: spearman(cand.map(c=>c.total), cand.map(c=>c.base)),
      topFloor: perTotal[0].floor, miglioreFloor: perFloor[0].floor,
      topFloorRank: perFloor.findIndex(c=>c.name===perTotal[0].name)+1,
      topMisurati: perTotal[0].misurati, topNEnemy: perTotal[0].nEnemy,
    });
  }
}

const med = (k) => righe.reduce((s,r)=>s+r[k],0)/righe.length;
console.log(`posizioni di draft misurate: ${righe.length} (33 mappe x 3 momenti)\n`);
console.log("QUANTO SPAZIA OGNI PEZZO fra i candidati (deviazione standard, punti di win rate)");
console.log(`  base (mappa/modalita/meta, corretta per rarita) : ${med("sdBase").toFixed(2)}`);
console.log(`  matchup medio contro chi e' in campo            : ${med("sdMu").toFixed(2)}`);
console.log(`  sinergia di composizione                        : ${med("sdSyn").toFixed(2)}`);
console.log(`  distanza fra media e caso peggiore              : ${med("sdFloorGap").toFixed(2)}`);
console.log(`\nL'INTERAZIONE CAMBIA LA RISPOSTA?`);
console.log(`  il primo consigliato e' diverso dal primo per sola base: ${righe.filter(r=>r.cambia).length}/${righe.length} volte`);
console.log(`  correlazione di rango fra punteggio finale e sola base : ${med("rho").toFixed(3)}`);
console.log(`\nIL CASO PEGGIORE (che NON entra nell'ordinamento)`);
console.log(`  caso peggiore del primo consigliato        : ${med("topFloor").toFixed(1)}%`);
console.log(`  miglior caso peggiore disponibile          : ${med("miglioreFloor").toFixed(1)}%`);
console.log(`  posizione del primo consigliato per robustezza: ${med("topFloorRank").toFixed(1)}esimo`);
const sotto50 = righe.filter(r=>r.topFloor < 50).length;
console.log(`  volte in cui il primo consigliato scende sotto il 50% nel caso peggiore: ${sotto50}/${righe.length}`);
console.log(`\nMISURATO CONTRO STIMATO (l'asimmetria di scala)`);
const mm = asim.mis.reduce((s,x)=>s+x,0)/asim.mis.length, mst = asim.stim.reduce((s,x)=>s+x,0)/asim.stim.length;
console.log(`  |vantaggio| medio su coppia MISURATA : ${mm.toFixed(2)} punti  (${asim.mis.length} casi, ${(100*asim.mis.length/(asim.mis.length+asim.stim.length)).toFixed(1)}%)`);
console.log(`  |vantaggio| medio su coppia STIMATA  : ${mst.toFixed(2)} punti  (${asim.stim.length} casi)`);
console.log(`  rapporto: una coppia misurata sposta ${(mm/mst).toFixed(1)} volte piu' di una stimata`);
const conMis = righe.filter(r=>r.topMisurati>0).length;
console.log(`  primi consigliati con almeno una coppia misurata: ${conMis}/${righe.length}`);
