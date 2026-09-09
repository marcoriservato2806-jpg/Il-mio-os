// Il consiglio viene dai DATI GENERALI? Due domande, richieste esplicitamente.
//
// 1. Se l'avversario non ha ancora preso niente, il primo consigliato deve
//    essere il migliore SU QUELLA MAPPA. Qui si confronta la lista dell'app
//    con la classifica nuda della win rate di mappa (corretta per rarita',
//    e solo fra i brawler schierabili), e si guarda dove finisce il migliore.
// 2. Quando l'avversario prende, la lista deve MUOVERSI. Se cambia poco, il
//    "vantaggio tecnico" contro i loro pick non sta arrivando al punteggio.
const { carica } = require("./carica-app.js");
const a = carica();
a.state.minPower = Number(process.argv[2] || 11);

function pulisci(map) {
  a.state.mode = map.mode; a.state.map = map;
  a.state.bans = { A: [], B: [] }; a.state.picks = { A: [], B: [] };
  a.buildSequence();
  // i sei ban vanno riempiti: finche' il turno corrente e' un ban,
  // computeSuggestions torna vuoto
  const prob = a.likelyEnemyPicks(20);
  a.state.bans.A = prob.slice(0, 3);
  a.state.bans.B = prob.slice(3, 6);
}

// La classifica "migliore su questa mappa" senza niente attorno: solo la base.
// I bannati vanno esclusi, altrimenti si confronta la lista dell'app con un
// brawler che l'app non puo' consigliare (ci sono cascato: il migliore di
// mappa finiva "in posizione 7" su tutte le mappe, ed era semplicemente il
// primo dei sei ban).
function classificaMappa(map) {
  const fuori = a.usedNames();
  return a.BRAWLERS.filter((b) => a.schierabile(b.name) && !fuori.has(b.name))
    .map((b) => ({ name: b.name, base: Math.round(a.contextualWinRate(b.name).base * 10) / 10 }))
    .sort((x, y) => y.base - x.base);
}

const soloConDati = a.MAPS.filter((m) => m.winRates);
let sommaRango = 0, primoUguale = 0, entroTre = 0, casi = 0;
const peggiori = [];
for (const map of soloConDati) {
  pulisci(map);
  const nuda = classificaMappa(map);
  const sug = a.computeSuggestions();
  if (!sug.length) continue;
  casi++;
  // dove sta, nella lista dell'app, il migliore della mappa?
  const rango = sug.findIndex((s) => s.name === nuda[0].name) + 1;
  if (rango === 0) { console.log(`  ATTENZIONE: ${nuda[0].name} non e' nella lista su ${map.name}`); continue; }
  const r = rango;
  sommaRango += r;
  if (sug[0].name === nuda[0].name) primoUguale++;
  if (r <= 3) entroTre++;
  peggiori.push({ mappa: map.name, migliore: nuda[0].name, base: nuda[0].base, rango: r,
                  primoApp: sug[0].name, baseApp: sug[0].base });
}
peggiori.sort((x, y) => y.rango - x.rango);

console.log(`rango impostato: potenza ${a.state.minPower}`);
console.log(`\n1) AVVERSARIO A ZERO PICK — mappe con dati: ${casi}`);
console.log(`   il primo dell'app E' il migliore della mappa : ${primoUguale}/${casi}`);
console.log(`   il migliore della mappa e' nei primi tre     : ${entroTre}/${casi}`);
console.log(`   sua posizione media nella lista              : ${(sommaRango / casi).toFixed(2)}`);
console.log(`\n   i cinque scostamenti piu' grandi:`);
for (const p of peggiori.slice(0, 5)) {
  console.log(`   ${p.mappa.padEnd(22)} migliore ${p.migliore} (base ${p.base}%) -> posizione ${p.rango};  app mette ${p.primoApp} (base ${p.baseApp}%)`);
}

// 2) la lista si muove quando l'avversario prende?
let spostamenti = 0, cambiPrimo = 0, giri = 0;
const esempi = [];
for (const map of soloConDati) {
  pulisci(map);
  const prima = a.computeSuggestions();
  if (!prima.length) continue;
  const prob = a.likelyEnemyPicks(30).filter((n) => n !== prima[0].name);
  // tre avversari plausibili ma NON i primi tre: serve un caso in cui la
  // risposta giusta non sia anche il pick migliore in assoluto
  const nemici = prob.slice(6, 9);
  pulisci(map);
  a.state.picks.B = nemici;
  const dopo = a.computeSuggestions();
  if (!dopo.length) continue;
  giri++;
  const posPrima = new Map(prima.map((s, i) => [s.name, i]));
  let d = 0, n = 0;
  for (let i = 0; i < dopo.length; i++) {
    const p = posPrima.get(dopo[i].name);
    if (p === undefined) continue;
    d += Math.abs(p - i); n++;
  }
  spostamenti += d / n;
  if (prima[0].name !== dopo[0].name) cambiPrimo++;
  esempi.push({ mappa: map.name, nemici: nemici.join(", "), prima: prima[0].name, dopo: dopo[0].name,
                delta: (dopo[0].total - (prima.find((s) => s.name === dopo[0].name) || dopo[0]).total) });
}
console.log(`\n2) TRE AVVERSARI IN CAMPO — posizioni provate: ${giri}`);
console.log(`   spostamento medio di ogni brawler nella lista: ${(spostamenti / giri).toFixed(2)} posizioni`);
console.log(`   il primo consigliato CAMBIA                  : ${cambiPrimo}/${giri}`);
console.log(`\n   primi cinque casi:`);
for (const e of esempi.slice(0, 5)) {
  console.log(`   ${e.mappa.padEnd(22)} vs ${e.nemici.padEnd(34)} ${e.prima} -> ${e.dopo}`);
}
