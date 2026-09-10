// DUE FONTI INDIPENDENTI SUI COUNTER CONCORDANO? La risposta e' no, e conta.
//
// Deep Draft (deepdraft.fr) pubblica i suoi dati grezzi per mappa, fra cui
// `matchup_performance_delta`: quanto un brawler rende contro un altro. E' la
// stessa cosa che misura la nostra matrice. Confrontati sulle stesse 26 mappe e
// sulle stesse coppie, 24.558 confronti:
//
//   correlazione                       r = 0,007
//   stesso segno sui counter netti     50%  (cioe' testa o croce)
//
// PRIMA DI DARE LA COLPA A LORO, due controlli:
//   - il loro dato e' coerente con se' stesso? SI: delta[A][B] contro
//     delta[B][A] da' r = -0,895, vicino al -1 di una misura vera.
//   - e' rumore da campione piccolo? NO: la loro dispersione e' 11,1 punti
//     contro gli 1,3 attesi dal solo campionamento.
//
// Quindi misurano qualcosa di reale, ma non la stessa cosa. Un pezzo di
// spiegazione: il loro numero e' ancora mescolato alla forza generale (correla
// 0,28 con la differenza di win rate fra i due) mentre il nostro e' al netto.
// E le loro win rate di mappa vanno dal 4% al 96%, cioe' pochissime partite su
// molti brawler: 154k partite per mappa contro i nostri 1,9 milioni.
//
// COSA FARNE: niente, ed e' il punto. La regola di casa dice che due fonti non
// si mescolano dentro lo stesso numero, e questa e' la situazione per cui la
// regola esiste. Serve a sapere che il dato sui counter e' meno solido di come
// appare — il nostro compreso.
//
// Uso: scarica i due file e lancia. I percorsi sono argomenti perche' i file
// stanno fuori dal repository (sono di altri).
//   node script/confronta-fonti-counter.js <per_map_draft_analytics.json> <pl-results.json>
const fs=require("fs");
const {carica}=require("./carica-app.js");const a=carica();
const [fileDeepDraft, filePlResults] = process.argv.slice(2);
if (!fileDeepDraft || !filePlResults) { console.error("uso: node script/confronta-fonti-counter.js <per_map_draft_analytics.json> <pl-results.json>"); process.exit(1); }
const dd=JSON.parse(fs.readFileSync(fileDeepDraft,"utf8"));
const bp=JSON.parse(fs.readFileSync(filePlResults,"utf8"));
// mappa -> modalita' (dalla mia fonte)
const modoDi={}; for (const k of Object.keys(bp)) if (bp[k].active) modoDi[bp[k].map]=bp[k].modeFormatted;
const nomi={}; for (const b of a.BRAWLERS) nomi[b.name.toUpperCase()]=b.name;
const x=[], y=[];
let coppie=0, senzaMio=0;
for (const [mappa,v] of Object.entries(dd)) {
  const modo=modoDi[mappa];
  if (!modo) continue;
  a.state.mode=modo; a.state.map=a.MAPS.find(m=>m.name===mappa)||null;
  const d=v.matchup_performance_delta||{};
  for (const [A,riga] of Object.entries(d)) {
    const na=nomi[A]; if (!na) continue;
    for (const [B,val] of Object.entries(riga)) {
      const nb=nomi[B]; if (!nb||na===nb) continue;
      const mio=a.advReale(na,nb);
      if (mio===null) { senzaMio++; continue; }
      coppie++; x.push(val); y.push(mio);
    }
  }
}
const n=x.length;
const mx=x.reduce((s,v)=>s+v,0)/n, my=y.reduce((s,v)=>s+v,0)/n;
let sxy=0,sxx=0,syy=0; for(let i=0;i<n;i++){sxy+=(x[i]-mx)*(y[i]-my);sxx+=(x[i]-mx)**2;syy+=(y[i]-my)**2;}
const r=sxy/Math.sqrt(sxx*syy);
console.log("coppie confrontabili: "+n+"  (senza dato mio: "+senzaMio+")");
console.log("correlazione fra le due fonti: r = "+r.toFixed(3));
console.log("pendenza (mio per unita' loro): "+(sxy/sxx).toFixed(2)+"   [se il loro e' in frazione e il mio in punti, ci si aspetta ~100]");
console.log("dispersione loro: "+Math.sqrt(sxx/n).toFixed(4)+"   mia: "+Math.sqrt(syy/n).toFixed(2)+" punti");
// concordanza di SEGNO sulle coppie dove almeno uno e' netto
let acc=0, tot=0;
for(let i=0;i<n;i++){ if(Math.abs(y[i])>=2){ tot++; if(Math.sign(x[i])===Math.sign(y[i])) acc++; } }
console.log("sui counter netti (|mio| >= 2 punti): stesso segno "+acc+"/"+tot+" = "+(100*acc/tot).toFixed(0)+"%");
