#!/usr/bin/env node
// Le partite vere di chi usa l'app, dal registro pubblico del tracker, usate
// per due cose che prima erano impossibili:
//
//  1. dirgli dove perde davvero (per modalita', mappa, brawler);
//  2. VERIFICARE IL MODELLO. Fino a oggi ogni assunzione dell'app era
//     giustificata con "non ho gli esiti delle partite". Ci sono.
//
// Attenzione al punto piu' delicato: la sua win rate per brawler e' calcolata
// DA QUESTE STESSE partite. Verificarla su di esse sarebbe barare. Quindi ogni
// partita viene predetta con il record costruito SENZA quella partita
// (leave-one-out), come per la calibrazione delle classi.
//
// Limite da dire sempre: il registro sa quale brawler ha giocato LUI, non la
// squadra avversaria ne' i ban. Quindi si valuta il pick sul contesto
// mappa+modalita', non sul draft completo.
//
// Uso: node script/analizza-partite.js <tag>
const { carica } = require("./carica-app.js");
const a = carica();

const TAG = (process.argv[2] || process.env.BS_TAG || "").replace(/^#/, "").trim().toUpperCase();
if (!TAG) { console.error("Serve il tag: node script/analizza-partite.js <tag>"); process.exit(2); }

function estraiArray(html, chiave) {
  let i = html.indexOf('\\"' + chiave + '\\":['); let sc = true;
  if (i < 0) { i = html.indexOf('"' + chiave + '":['); sc = false; }
  if (i < 0) return null;
  const start = html.indexOf("[", i);
  let d = 0, end = -1;
  for (let k = start; k < html.length; k++) { const c = html[k]; if (c === "[") d++; else if (c === "]") { d--; if (!d) { end = k + 1; break; } } }
  const g = html.slice(start, end);
  return JSON.parse(sc ? g.replace(/\\"/g, '"').replace(/\\\\/g, "\\") : g);
}

(async () => {
  let html;
  for (let i = 0; i < 4; i++) {
    try {
      const r = await fetch(`https://www.brawlplanet.com/players/${encodeURIComponent(TAG)}`, { headers: { "user-agent": "brawl-draft-updater" } });
      if (!r.ok) throw new Error("HTTP " + r.status);
      html = await r.text(); break;
    } catch (e) { if (i === 3) { console.error("tracker irraggiungibile:", e.message); process.exit(1); } await new Promise((s) => setTimeout(s, 1000 * 2 ** i)); }
  }
  const battles = estraiArray(html, "battles");
  if (!battles) { console.error("registro partite non trovato: il tracker e' cambiato."); process.exit(1); }

  // solo Classificata, solo partite con esito e con un brawler riconosciuto
  const nomi = new Map(a.BRAWLERS.map((b) => [b.name.toUpperCase(), b.name]));
  const P = battles
    .filter((b) => /ranked/i.test(b.type || "") && (b.result === "victory" || b.result === "defeat"))
    .map((b) => ({
      mappa: b.mapName, modo: b.modeName, esito: b.result === "victory" ? 1 : 0,
      brawler: nomi.get(((b.brawlers || [])[0] || "").toUpperCase()) || null,
      solo: b.type === "soloRanked", quando: b.id,
    }))
    .filter((b) => b.brawler);

  console.log(`partite di Classificata con esito e brawler noto: ${P.length}`);
  const vinte = P.reduce((s, b) => s + b.esito, 0);
  console.log(`vinte ${vinte}, perse ${P.length - vinte} = ${(100 * vinte / P.length).toFixed(1)}%`);
  console.log(`periodo: ${P[P.length - 1].quando.slice(0, 8)} → ${P[0].quando.slice(0, 8)}\n`);

  const gruppo = (chiave, titolo, minimo) => {
    const g = {};
    for (const b of P) { const k = b[chiave]; (g[k] = g[k] || { n: 0, v: 0 }).n++; g[k].v += b.esito; }
    const righe = Object.entries(g).map(([k, v]) => ({ k, ...v, wr: 100 * v.v / v.n })).filter((r) => r.n >= minimo);
    righe.sort((x, y) => x.wr - y.wr);
    console.log(titolo);
    for (const r of righe) {
      const barra = "█".repeat(Math.round(r.wr / 5)).padEnd(20, "·");
      console.log(`  ${r.k.padEnd(20)} ${String(r.n).padStart(3)}p  ${r.wr.toFixed(0).padStart(3)}%  ${barra}`);
    }
    console.log("");
  };
  gruppo("modo", "PER MODALITÀ (dalla peggiore):", 5);
  gruppo("brawler", "PER BRAWLER (almeno 4 partite, dal peggiore):", 4);
  gruppo("mappa", "PER MAPPA (almeno 5 partite, dalla peggiore):", 5);

  // ---- LA VERIFICA DEL MODELLO -----------------------------------------
  // Per ogni partita: che punteggio avrebbe dato l'app a quel brawler su
  // quella mappa? E il suo record personale, calcolato senza quella partita?
  const mappaDi = new Map(a.MAPS.map((m) => [m.name, m]));
  const dati = [];
  for (const b of P) {
    const m = mappaDi.get(b.mappa);
    if (!m) continue;
    a.state.mode = m.mode; a.state.map = m;
    a.state.bansPerTeam = 0; a.state.bans = { A: [], B: [] }; a.state.picks = { A: [], B: [] };
    a.buildSequence(); a.computeSuggestions();
    const ctx = a.contextualWinRate(b.brawler);
    dati.push({ ...b, generale: ctx.generale === undefined ? ctx.base : ctx.generale });
  }
  console.log(`partite su mappe che conosco: ${dati.length} su ${P.length}\n`);

  // record personale leave-one-out
  const per = {};
  for (const d of dati) { (per[d.brawler] = per[d.brawler] || { n: 0, v: 0 }).n++; per[d.brawler].v += d.esito; }
  const nTot = dati.length, vTot = dati.reduce((s, d) => s + d.esito, 0);
  const media = vTot / nTot;
  const N0 = 11;
  for (const d of dati) {
    const p = per[d.brawler];
    const n = p.n - 1, v = p.v - d.esito;
    d.persLoo = n > 0 ? 100 * (media + (n / (n + N0)) * (v / n - media)) : 100 * media;
    d.genPers = d.generale + (d.persLoo - 100 * media); // il generale spostato dallo scarto personale
  }

  // quanto predice ciascun modello? Log-loss (piu' basso = meglio) e accuratezza
  const logloss = (f) => -dati.reduce((s, d) => {
    const p = Math.max(0.02, Math.min(0.98, f(d) / 100));
    return s + (d.esito ? Math.log(p) : Math.log(1 - p));
  }, 0) / dati.length;
  const auc = (f) => {
    const v = dati.filter((d) => d.esito), s = dati.filter((d) => !d.esito);
    let c = 0, t = 0;
    for (const x of v) for (const y of s) { t++; c += f(x) > f(y) ? 1 : f(x) === f(y) ? 0.5 : 0; }
    return t ? c / t : 0.5;
  };
  console.log("QUANTO PREDICE OGNI MODELLO le sue partite vere");
  console.log("(log-loss piu' basso = meglio · AUC 0,5 = tira a caso, 1 = perfetto)\n");
  const modelli = [
    ["costante (la sua media)", () => 100 * media],
    ["solo dato generale di mappa", (d) => d.generale],
    ["solo record personale (LOO)", (d) => d.persLoo],
    ["generale + scarto personale", (d) => d.genPers],
  ];
  for (const [nome, f] of modelli)
    console.log(`  ${nome.padEnd(30)} log-loss ${logloss(f).toFixed(4)}   AUC ${auc(f).toFixed(3)}`);

  // e con quale peso del termine personale si predice meglio?
  console.log("\nIL PESO GIUSTO DEL TERMINE PERSONALE, misurato sulle sue partite:");
  let best = null;
  for (const k of [0, 0.15, 0.25, 0.4, 0.5, 0.6, 0.75, 1, 1.25]) {
    const f = (d) => d.generale + k * (d.persLoo - 100 * media);
    const ll = logloss(f), ac = auc(f);
    if (!best || ll < best.ll) best = { k, ll, ac };
    console.log(`  peso ${String(k).padEnd(5)} log-loss ${ll.toFixed(4)}   AUC ${ac.toFixed(3)}`);
  }
  console.log(`\n  => il migliore e' peso ${best.k}`);

  // ---- IL CONFONDIMENTO CHE PUO' FALSARE TUTTO -------------------------
  // La sua win rate cambia moltissimo per MODALITA' (Heist 34%, Knockout 73%),
  // e ogni brawler lo gioca soprattutto in una modalita': Nori in Heist, Wendy
  // in Brawl Ball. Quindi "record per brawler" potrebbe non misurare il
  // brawler, ma la modalita' in cui capita di usarlo. Si verifica dando al
  // modello la modalita' come base e guardando se il record per brawler
  // aggiunge ancora qualcosa.
  const perModo = {};
  for (const d of dati) { (perModo[d.modo] = perModo[d.modo] || { n: 0, v: 0 }).n++; perModo[d.modo].v += d.esito; }
  for (const d of dati) {
    const pm = perModo[d.modo];
    const n = pm.n - 1, v = pm.v - d.esito;
    d.modoLoo = 100 * (n > 0 ? media + (n / (n + 11)) * (v / n - media) : media);
  }
  console.log("\nIL RECORD PER BRAWLER MISURA IL BRAWLER O LA MODALITÀ?");
  const conModo = [
    ["solo modalità (LOO)", (d) => d.modoLoo],
    ["solo brawler (LOO)", (d) => d.persLoo],
    ["modalità + scarto brawler", (d) => d.modoLoo + (d.persLoo - 100 * media)],
    ["modalità + mappa generale", (d) => d.modoLoo + (d.generale - 53.4)],
  ];
  for (const [nome, f] of conModo)
    console.log(`  ${nome.padEnd(30)} log-loss ${logloss(f).toFixed(4)}   AUC ${auc(f).toFixed(3)}`);
  console.log(`  ${"costante".padEnd(30)} log-loss ${logloss(() => 100 * media).toFixed(4)}   AUC 0.500`);

  // ---- IL TETTO AL TERMINE PERSONALE -----------------------------------
  // L'utente ha chiesto che il suo record sia UNO degli ingredienti, non un
  // veto: con 11 partite Damian si spostava di 25 punti, piu' di tutto il
  // resto messo insieme. Il tetto si misura, non si sceglie.
  console.log("\nCON QUALE TETTO al termine personale si predice meglio?");
  const cap = (c) => (d) => d.generale + Math.max(-c, Math.min(c, d.persLoo - 100 * media));
  for (const c of [3, 5, 8, 10, 15, 25, 99]) {
    const f = cap(c);
    console.log(`  tetto ±${String(c).padEnd(3)} log-loss ${logloss(f).toFixed(4)}   AUC ${auc(f).toFixed(3)}`);
  }
  // e lo stesso, sopra la base "modalita'" invece che "mappa"
  console.log("\n  (con la modalità come base, che predice meglio della mappa)");
  const cap2 = (c) => (d) => d.modoLoo + Math.max(-c, Math.min(c, d.persLoo - 100 * media));
  for (const c of [3, 5, 8, 10, 15, 25, 99]) {
    const f = cap2(c);
    console.log(`  tetto ±${String(c).padEnd(3)} log-loss ${logloss(f).toFixed(4)}   AUC ${auc(f).toFixed(3)}`);
  }
})();
