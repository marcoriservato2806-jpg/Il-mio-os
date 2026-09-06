#!/usr/bin/env node
// Controlli di coerenza su brawl-draft/data.js. Da far girare SEMPRE prima
// di pubblicare: quasi tutti gli errori trovati finora sono usciti da qui o
// da una prova in browser vera, nessuno rileggendo il codice.
//
// Uso: node script/check-brawl-data.js   (esce con codice 1 se trova qualcosa)

const fs=require("fs");
const g={}; new Function("g","with(g){"+fs.readFileSync("brawl-draft/data.js","utf8")+
 "; g.BRAWLERS=BRAWLERS; g.MAPS=MAPS; g.MODES=MODES; g.MODE_WIN_RATES=MODE_WIN_RATES; g.DEFAULT_META_SCORES=DEFAULT_META_SCORES; g.DEFAULT_META_SCORES_MASTERS=DEFAULT_META_SCORES_MASTERS; g.USE_RATES=USE_RATES; g.MATCHUPS=MATCHUPS; g.BRAWLER_OVERALL=BRAWLER_OVERALL;}")(g);
const roster=g.BRAWLERS.map(b=>b.name), R=new Set(roster);
let err=0; const bad=(m)=>{console.log("  ✗ "+m); err++;};
console.log("roster: "+roster.length+" brawler, "+g.MAPS.length+" mappe");

const dup=roster.filter((n,i)=>roster.indexOf(n)!==i); if(dup.length) bad("duplicati nel roster: "+dup);

const check=(obj,label)=>{ for(const k of Object.keys(obj)) if(!R.has(k)) bad(label+": nome fuori roster \""+k+"\""); };
check(g.DEFAULT_META_SCORES,"DEFAULT_META_SCORES"); check(g.DEFAULT_META_SCORES_MASTERS,"DEFAULT_META_SCORES_MASTERS");
check(g.USE_RATES,"USE_RATES"); check(g.BRAWLER_OVERALL,"BRAWLER_OVERALL"); check(g.MATCHUPS,"MATCHUPS");
for(const m of g.MODES){ if(!g.MODE_WIN_RATES[m]) bad("MODE_WIN_RATES manca la modalità "+m); else check(g.MODE_WIN_RATES[m],"MODE_WIN_RATES["+m+"]"); }
for(const k of Object.keys(g.MODE_WIN_RATES)) if(!g.MODES.includes(k)) bad("MODE_WIN_RATES ha una modalità sconosciuta: "+k);

const names=new Set();
for(const m of g.MAPS){
  if(!g.MODES.includes(m.mode)) bad(m.name+": modalità sconosciuta "+m.mode);
  const key=m.mode+"/"+m.name; if(names.has(key)) bad("mappa duplicata: "+key); names.add(key);
  if(m.winRates){
    if(!m.sample||!m.updated) bad(m.name+": ha winRates ma manca sample o updated");
    check(m.winRates,"winRates di "+m.name);
    for(const [k,v] of Object.entries(m.winRates)) if(!(v>=10&&v<=95)) bad(m.name+": win rate fuori 10-95 → "+k+" "+v);
    if(m.pickRates){ check(m.pickRates,"pickRates di "+m.name);
      const s=Object.values(m.pickRates).reduce((a,b)=>a+b,0);
      if(s<400||s>800) bad(m.name+": somma pick rate "+s.toFixed(0)+"%, attesa ~600% (6 pick su 6)"); }
  } else if(m.bestPicks){ for(const n2 of m.bestPicks) if(!R.has(n2)) bad(m.name+": bestPicks fuori roster \""+n2+"\""); }
}
for(const m of g.MODES) if(!g.MAPS.some(x=>x.mode===m)) bad("nessuna mappa per la modalità "+m);
const noData=roster.filter(n=>g.DEFAULT_META_SCORES[n]===undefined);
console.log("senza dato meta (atteso Vince/Cosmo): "+(noData.join(", ")||"nessuno"));
console.log(err?"\n"+err+" PROBLEMI":"\nnessun problema");
process.exit(err?1:0);
