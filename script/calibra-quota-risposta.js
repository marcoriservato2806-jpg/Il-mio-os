// Quanto peso dare al caso peggiore nel punteggio.
//
// Il punteggio finale e' una miscela di due numeri che l'app calcola comunque
// e mostra entrambi: la MEDIA (quanto vinci contro un avversario qualunque) e
// il CASO PEGGIORE (quanto vinci se prende la risposta migliore contro di te).
//   punteggio = media*(1-q) + peggio*q
// q e' la probabilita' che l'avversario quella risposta la trovi. Non ho gli
// esiti delle partite, quindi q non si puo' calibrare su un bersaglio: si puo'
// pero' misurare il COMPROMESSO, cioe' quanta media si perde per quanto
// pavimento si guadagna, e scegliere il punto dove il cambio conviene.
const { carica } = require("./carica-app.js");
const a = carica();

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

const stati = [];
for (const map of a.MAPS) for (const [nE, nO] of [[0,0],[1,0],[2,1],[3,2]]) {
  const pos = posizione(map, nE, nO);
  const used = a.usedNames();
  const minacce = a.likelyEnemyPicks(8);
  const ownClasses = pos.own.map(a.classOf);
  const vuote = 3 - pos.en.length;
  const cand = a.BRAWLERS.filter(b => !used.has(b.name) && a.schierabile(b.name)).map(b => {
    const s = a.scoreCandidate(b.name, b.class, ownClasses, pos.en.map(a.classOf), pos.en, minacce, vuote);
    const risk = s.futuro ? s.futuro.minacciaPeggiore : null;
    const worst = Math.min(s.perEnemy.length ? Math.min(...s.perEnemy.map(p=>p.edge)) : 0, risk ? risk.edge : 0);
    return { name: b.name, media: s.total, peggio: Math.max(5, Math.min(95, s.base + worst)) };
  });
  if (cand.length > 10) stati.push({ mappa: map.name, nE, vuote, cand });
}

console.log(`stati di draft: ${stati.length}\n`);
console.log("q     media del 1o   peggio del 1o   sotto 50 nel peggio   cambia il 1o");
console.log("---   ------------   -------------   -------------------   ------------");
const perQ = {};
for (const q of [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.75, 1]) {
  let sMedia = 0, sPeggio = 0, sotto = 0, cambia = 0;
  for (const st of stati) {
    // la quota scala con le caselle avversarie ancora libere, come nell'app
    const qe = st.vuote > 0 ? 1 - Math.pow(1 - q, st.vuote / 3) : 0;
    const ord = [...st.cand].sort((x,y) => (y.media*(1-qe)+y.peggio*qe) - (x.media*(1-qe)+x.peggio*qe));
    const base = [...st.cand].sort((x,y) => y.media - x.media)[0];
    sMedia += ord[0].media; sPeggio += ord[0].peggio;
    if (ord[0].peggio < 50) sotto++;
    if (ord[0].name !== base.name) cambia++;
  }
  const n = stati.length;
  perQ[q] = { media: sMedia/n, peggio: sPeggio/n, sotto, cambia };
  console.log(`${String(q).padEnd(5)} ${(sMedia/n).toFixed(2).padStart(9)}   ${(sPeggio/n).toFixed(2).padStart(13)}   ${String(sotto+'/'+n).padStart(19)}   ${String(cambia+'/'+n).padStart(12)}`);
}
console.log("\nil cambio: quanti punti di pavimento si guadagnano per ogni punto di media perso");
const r = perQ[0];
for (const q of [0.1, 0.2, 0.3, 0.4, 0.5, 0.6]) {
  const d = perQ[q];
  const persa = r.media - d.media, guad = d.peggio - r.peggio;
  console.log(`  q=${q}: media -${persa.toFixed(2)}, pavimento +${guad.toFixed(2)}  =>  ${(guad/persa).toFixed(2)} punti guadagnati per punto perso`);
}
