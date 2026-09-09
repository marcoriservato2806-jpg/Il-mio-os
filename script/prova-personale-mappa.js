#!/usr/bin/env node
// Il record personale dell'app e' PER BRAWLER e basta. L'utente ha segnalato
// il caso limite: Bolt gli fa 100% su Deathcap Trap e 20% su Undermine, e
// l'app mostrava la media. La domanda: un record piu' fine (brawler x mappa,
// brawler x modalita', o solo mappa) predice meglio le sue partite, o e' solo
// sovradattamento su celle da cinque partite?
//
// Si verifica come sempre FUORI CAMPIONE: ogni partita e' predetta con i
// record costruiti SENZA quella partita.
const TAG = (process.argv[2] || process.env.BS_TAG || "").replace(/^#/, "").trim().toUpperCase();
function estrai(html, chiave) {
  let i = html.indexOf('\\"' + chiave + '\\":['); let sc = true;
  if (i < 0) { i = html.indexOf('"' + chiave + '":['); sc = false; }
  if (i < 0) return null;
  const s = html.indexOf("[", i);
  let d = 0, e = -1;
  for (let k = s; k < html.length; k++) { const c = html[k]; if (c === "[") d++; else if (c === "]") { d--; if (!d) { e = k + 1; break; } } }
  const g = html.slice(s, e);
  return JSON.parse(sc ? g.replace(/\\"/g, '"').replace(/\\\\/g, "\\") : g);
}
(async () => {
  const r = await fetch(`https://www.brawlplanet.com/players/${encodeURIComponent(TAG)}`, { headers: { "user-agent": "brawl-draft-updater" } });
  const html = await r.text();
  const P = estrai(html, "battles")
    .filter((b) => /ranked/i.test(b.type || "") && (b.result === "victory" || b.result === "defeat"))
    .map((b) => ({ v: b.result === "victory" ? 1 : 0, br: (b.brawlers || [])[0] || "?", mo: b.modeName, ma: b.mapName || "?" }));
  const n = P.length, tot = P.reduce((s, x) => s + x.v, 0), media = tot / n;
  console.log(`partite di Classificata: ${n}, vinte ${tot} = ${(100 * media).toFixed(1)}%\n`);

  // conteggi per ogni tipo di raggruppamento
  const conta = (chiave) => {
    const g = {};
    for (const x of P) { const k = chiave(x); (g[k] = g[k] || { n: 0, v: 0 }).n++; g[k].v += x.v; }
    return g;
  };
  const gruppi = {
    brawler: [conta((x) => x.br), (x) => x.br],
    mappa: [conta((x) => x.ma), (x) => x.ma],
    modalita: [conta((x) => x.mo), (x) => x.mo],
    "brawler x modalita": [conta((x) => x.br + "|" + x.mo), (x) => x.br + "|" + x.mo],
    "brawler x mappa": [conta((x) => x.br + "|" + x.ma), (x) => x.br + "|" + x.ma],
  };
  const N0 = 11;
  // stima leave-one-out di un gruppo
  const loo = (nome) => (x) => {
    const [g, k] = gruppi[nome];
    const c = g[k(x)];
    const nn = c.n - 1, vv = c.v - x.v;
    return nn > 0 ? media + (nn / (nn + N0)) * (vv / nn - media) : media;
  };
  const logloss = (f) => -P.reduce((s, x) => {
    const p = Math.max(0.02, Math.min(0.98, f(x)));
    return s + (x.v ? Math.log(p) : Math.log(1 - p));
  }, 0) / n;
  const auc = (f) => {
    const V = P.filter((x) => x.v), S = P.filter((x) => !x.v);
    let c = 0, t = 0;
    for (const a of V) for (const b of S) { t++; c += f(a) > f(b) ? 1 : f(a) === f(b) ? 0.5 : 0; }
    return c / t;
  };
  console.log("QUALE RAGGRUPPAMENTO PREDICE MEGLIO (fuori campione, log-loss basso = meglio)");
  console.log(`  ${"costante".padEnd(22)} log-loss ${logloss(() => media).toFixed(4)}   AUC 0.500`);
  for (const nome of Object.keys(gruppi)) {
    const g = gruppi[nome][0];
    const celle = Object.values(g);
    const grandi = celle.filter((c) => c.n >= 4).length;
    console.log(`  ${nome.padEnd(22)} log-loss ${logloss(loo(nome)).toFixed(4)}   AUC ${auc(loo(nome)).toFixed(3)}   (${celle.length} celle, ${grandi} con 4+ partite, media ${(n / celle.length).toFixed(1)})`);
  }
  // e la combinazione brawler + scarto della mappa
  const f2 = (x) => {
    const b = loo("brawler")(x), m = loo("mappa")(x);
    return Math.max(0.02, Math.min(0.98, b + (m - media)));
  };
  console.log(`  ${"brawler + scarto mappa".padEnd(22)} log-loss ${logloss(f2).toFixed(4)}   AUC ${auc(f2).toFixed(3)}`);
  // modello a tre livelli: media + scarto del brawler + scarto della mappa +
  // quel che resta della coppia brawler-mappa, ognuno ristretto sul PROPRIO
  // numero di partite. E' il modo standard di usare celle piccole senza
  // farsi ingannare da esse.
  const gB = gruppi["brawler"][0], gM = gruppi["mappa"][0], gBM = gruppi["brawler x mappa"][0];
  const treLivelli = (x) => {
    const cb = gB[x.br], cm = gM[x.ma], cbm = gBM[x.br + "|" + x.ma];
    const sc = (c, v) => { const nn = c.n - 1, vv = c.v - v; return nn > 0 ? (nn / (nn + N0)) * (vv / nn - media) : 0; };
    const sb = sc(cb, x.v), sm = sc(cm, x.v);
    // la coppia porta solo cio' che brawler e mappa non spiegano gia'
    const nn = cbm.n - 1, vv = cbm.v - x.v;
    const resto = nn > 0 ? (nn / (nn + N0)) * ((vv / nn - media) - sb - sm) : 0;
    return Math.max(0.02, Math.min(0.98, media + sb + sm + resto));
  };
  console.log(`  ${"tre livelli (b + m + bxm)".padEnd(22)} log-loss ${logloss(treLivelli).toFixed(4)}   AUC ${auc(treLivelli).toFixed(3)}`);
  // e senza il termine di coppia, per vedere se serve
  const dueLivelli = (x) => {
    const cb = gB[x.br], cm = gM[x.ma];
    const sc = (c, v) => { const nn = c.n - 1, vv = c.v - v; return nn > 0 ? (nn / (nn + N0)) * (vv / nn - media) : 0; };
    return Math.max(0.02, Math.min(0.98, media + sc(cb, x.v) + sc(cm, x.v)));
  };
  console.log(`  ${"due livelli (b + m)".padEnd(22)} log-loss ${logloss(dueLivelli).toFixed(4)}   AUC ${auc(dueLivelli).toFixed(3)}`);
  // solo mappa, che finora e' il migliore singolo
  console.log(`  ${"solo mappa, ricontrollo".padEnd(22)} log-loss ${logloss(loo("mappa")).toFixed(4)}   AUC ${auc(loo("mappa")).toFixed(3)}`);

  console.log("\nCON QUALE TETTO allo scarto complessivo (tre livelli)?");
  for (const cap of [0.04, 0.06, 0.08, 0.10, 0.15, 0.25, 0.99]) {
    const f = (x) => {
      const cb = gB[x.br], cm = gM[x.ma], cbm = gBM[x.br + "|" + x.ma];
      const sc = (c, v) => { const nn = c.n - 1, vv = c.v - v; return nn > 0 ? (nn / (nn + N0)) * (vv / nn - media) : 0; };
      const sb = sc(cb, x.v), sm = sc(cm, x.v);
      const nn = cbm.n - 1, vv = cbm.v - x.v;
      const resto = nn > 0 ? (nn / (nn + N0)) * ((vv / nn - media) - sb - sm) : 0;
      const tot = Math.max(-cap, Math.min(cap, sb + sm + resto));
      return Math.max(0.02, Math.min(0.98, media + tot));
    };
    console.log(`  tetto ±${String(Math.round(cap*100)).padEnd(3)} punti  log-loss ${logloss(f).toFixed(4)}   AUC ${auc(f).toFixed(3)}`);
  }

  const f3 = (x) => {
    const b = loo("brawler")(x), m = loo("brawler x mappa")(x);
    return Math.max(0.02, Math.min(0.98, (b + m) / 2));
  };
  console.log(`  ${"meta brawler, meta bxm".padEnd(22)} log-loss ${logloss(f3).toFixed(4)}   AUC ${auc(f3).toFixed(3)}`);
})();
