// Controlla quello che l'app CONSIGLIA DAVVERO (computeSuggestions), non una
// riproduzione del calcolo: su tutte le mappe e in quattro momenti del draft.
// Serve come rete: se un cambiamento futuro fa ricomparire un difetto vecchio
// (un brawler raro sempre primo, il primo consigliato fragile), si vede qui.
const { carica } = require("./carica-app.js");
const a = carica();

function posizione(map, nEnemy, nOwn) {
  a.state.mode = map.mode; a.state.map = map;
  a.state.bans = { A: [], B: [] }; a.state.picks = { A: [], B: [] };
  a.buildSequence();
  // I sei ban vanno riempiti, altrimenti il turno corrente e' un ban e
  // computeSuggestions (che risponde solo in fase pick) torna vuoto.
  const prob = a.likelyEnemyPicks(20);
  let i = 0;
  a.state.bans.A = prob.slice(i, i + 3); i += 3;
  a.state.bans.B = prob.slice(i, i + 3); i += 3;
  const prob2 = a.likelyEnemyPicks(20).filter((x) => !a.usedNames().has(x));
  let j = 0;
  const en = prob2.slice(j, j + nEnemy); j += nEnemy;
  const own = prob2.slice(j, j + nOwn);
  a.state.picks.A = own; a.state.picks.B = en;
}

const rango = Number(process.argv[2] || 11);
a.state.minPower = rango;

const primi = {}, righe = [];
let t0 = Date.now(), giri = 0;
for (const map of a.MAPS) for (const [nE, nO] of [[0,0],[1,0],[2,1],[3,2]]) {
  posizione(map, nE, nO);
  const sug = a.computeSuggestions();
  giri++;
  if (!sug.length) continue;
  const s = sug[0];
  primi[s.name] = (primi[s.name] || 0) + 1;
  righe.push({ mappa: map.name, nE, nome: s.name, mostrato: s.total, media: s.media === undefined ? s.total : s.media,
               pavimento: s.floor, raro: s.pick < 1.5, q: s.q });
}
const ms = (Date.now() - t0) / giri;
const n = righe.length;
const med = (k) => righe.reduce((s,r)=>s+r[k],0)/n;

console.log(`rango impostato: potenza ${rango} (${rango === 11 ? "Mythic in su" : "fino a Diamante"})`);
console.log(`posizioni di draft: ${n} · ${ms.toFixed(1)}ms per giro di suggerimenti\n`);
console.log(`numero mostrato al primo consigliato : ${med("mostrato").toFixed(2)}%`);
console.log(`sua resa media                       : ${med("media").toFixed(2)}%`);
console.log(`suo pavimento (risposta migliore)    : ${med("pavimento").toFixed(2)}%`);
console.log(`crolla sotto il 50% nel caso peggiore: ${righe.filter(r=>r.pavimento<50).length}/${n}`);
console.log(`primo consigliato e' un pick raro    : ${righe.filter(r=>r.raro).length}/${n}\n`);
const top = Object.entries(primi).sort((x,y)=>y[1]-x[1]);
console.log(`nomi diversi che compaiono primi: ${top.length}`);
console.log("i piu' frequenti:", top.slice(0,8).map(([k,v])=>`${k} ${v}`).join(", "));
const dom = top[0][1] / n;
console.log(`il piu' frequente prende il ${(100*dom).toFixed(1)}% delle posizioni ${dom > 0.2 ? "  <-- troppo concentrato" : ""}`);
