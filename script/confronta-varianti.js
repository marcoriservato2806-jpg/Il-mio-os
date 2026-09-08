// Due varianti a confronto, giudicate sullo STESSO metro (il metro non puo'
// essere il punteggio di una delle due, o vince per definizione):
//   A) media dei matchup solo sulle caselle avversarie PIENE (come prima)
//   B) media su tutte e tre le caselle, le vuote col valore atteso
// Metro comune: per il pick che ciascuna variante mette primo,
//   - resa contro chi e' IN CAMPO (base + media degli edge noti)
//   - pavimento (base + peggior edge fra noti e minacce plausibili)
const { carica } = require("./carica-app.js");
const a = carica();

function posizione(map, nEnemy, nOwn) {
  a.state.mode = map.mode; a.state.map = map;
  a.state.bans = { A: [], B: [] }; a.state.picks = { A: [], B: [] };
  a.buildSequence();
  const prob = a.likelyEnemyPicks(12);
  const own = [], en = []; let i = 0;
  while (en.length < nEnemy && i < prob.length) en.push(prob[i++]);
  while (own.length < nOwn && i < prob.length) own.push(prob[i++]);
  a.state.picks.A = own; a.state.picks.B = en;
  return { own, en };
}

const stati = [];
for (const map of a.MAPS) for (const [nE, nO] of [[0,0],[1,0],[2,1],[3,2]]) {
  const pos = posizione(map, nE, nO);
  const used = a.usedNames();
  const minacce = a.likelyEnemyPicks(8);
  const oc = pos.own.map(a.classOf), ec = pos.en.map(a.classOf);
  const cand = a.BRAWLERS.filter(b => !used.has(b.name) && a.schierabile(b.name)).map(b => {
    const sB = a.scoreCandidate(b.name, b.class, oc, ec, pos.en, minacce, 3 - pos.en.length);
    const sA = a.scoreCandidate(b.name, b.class, oc, ec, pos.en, minacce, 0); // 0 caselle vuote = vecchia media
    const risk = minacce.length ? a.residualRisk(b.name, minacce) : null;
    const worst = Math.min(sB.perEnemy.length ? Math.min(...sB.perEnemy.map(p=>p.edge)) : 0, risk ? risk.edge : 0);
    return {
      name: b.name,
      mediaA: sA.total, mediaB: sB.total,
      // metro comune, uguale per tutti: resa contro chi e' in campo
      resa: sA.total,
      pavimento: Math.max(5, Math.min(95, sB.base + worst)),
    };
  });
  if (cand.length > 10) stati.push(cand);
}

function valuta(nome, chiave, q) {
  let resa = 0, pav = 0, sotto = 0;
  for (const cand of stati) {
    const ord = [...cand].sort((x,y) => (y[chiave]*(1-q)+y.pavimento*q) - (x[chiave]*(1-q)+x.pavimento*q));
    resa += ord[0].resa; pav += ord[0].pavimento; if (ord[0].pavimento < 50) sotto++;
  }
  const n = stati.length;
  console.log(`${nome.padEnd(34)} q=${String(q).padEnd(4)} resa ${(resa/n).toFixed(2)}  pavimento ${(pav/n).toFixed(2)}  sotto50 ${sotto}/${n}`);
}
console.log(`stati: ${stati.length}\n`);
for (const q of [0, 0.3, 0.4, 0.5]) {
  valuta("A) solo caselle piene", "mediaA", q);
  valuta("B) tutte e tre le caselle", "mediaB", q);
  console.log("");
}
