#!/usr/bin/env node
// Analisi delle sole partite di CLASSIFICATA: dove si perde e perche'.
// Non guarda il modello dell'app, guarda il giocatore — sequenze, sessioni,
// durata, star player, combinazioni brawler+modalita'.
// Uso: node script/dove-perdo.js <tag>
const TAG = (process.argv[2] || process.env.BS_TAG || "").replace(/^#/, "").trim().toUpperCase();
if (!TAG) { console.error("Serve il tag."); process.exit(2); }

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
const pct = (v, n) => n ? (100 * v / n).toFixed(0) + "%" : "-";
const barra = (w) => "█".repeat(Math.round(w / 5)).padEnd(20, "·");

(async () => {
  const r = await fetch(`https://www.brawlplanet.com/players/${encodeURIComponent(TAG)}`, { headers: { "user-agent": "brawl-draft-updater" } });
  const html = await r.text();
  const tutte = estrai(html, "battles");
  // SOLO Classificata, con esito
  const P = tutte
    .filter((b) => /ranked/i.test(b.type || "") && (b.result === "victory" || b.result === "defeat"))
    .map((b) => ({ ...b, v: b.result === "victory" ? 1 : 0, t: Date.parse(b.id.replace(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/, "$1-$2-$3T$4:$5:$6")) }))
    .sort((a, b) => a.t - b.t); // dalla piu' vecchia
  const n = P.length, v = P.reduce((s, b) => s + b.v, 0);
  console.log(`CLASSIFICATA: ${n} partite, ${v} vinte = ${pct(v, n)}\n`);

  // 1. DOPO UNA SCONFITTA: si perde di piu'? (tilt)
  let dopoV = { n: 0, v: 0 }, dopoS = { n: 0, v: 0 };
  for (let i = 1; i < P.length; i++) {
    const d = P[i - 1].v ? dopoV : dopoS;
    d.n++; d.v += P[i].v;
  }
  console.log("DOPO UNA VITTORIA / DOPO UNA SCONFITTA");
  console.log(`  dopo una vittoria : ${pct(dopoV.v, dopoV.n)}  (${dopoV.n} partite)  ${barra(100 * dopoV.v / dopoV.n)}`);
  console.log(`  dopo una sconfitta: ${pct(dopoS.v, dopoS.n)}  (${dopoS.n} partite)  ${barra(100 * dopoS.v / dopoS.n)}`);
  // e dopo DUE sconfitte di fila?
  let dopo2 = { n: 0, v: 0 };
  for (let i = 2; i < P.length; i++) if (!P[i-1].v && !P[i-2].v) { dopo2.n++; dopo2.v += P[i].v; }
  console.log(`  dopo DUE sconfitte: ${pct(dopo2.v, dopo2.n)}  (${dopo2.n} partite)  ${barra(100 * dopo2.v / dopo2.n)}`);
  // Il confondimento: le sconfitte si raggruppano nelle modalita' brutte, quindi
  // "dopo una sconfitta" potrebbe misurare solo "sto giocando Heist". Si
  // controlla confrontando solo coppie CONSECUTIVE NELLA STESSA modalita'.
  let sV = { n: 0, v: 0 }, sS = { n: 0, v: 0 };
  for (let i = 1; i < P.length; i++) {
    if (P[i].modeName !== P[i - 1].modeName) continue;
    const d = P[i - 1].v ? sV : sS;
    d.n++; d.v += P[i].v;
  }
  console.log(`  --- solo coppie nella STESSA modalita' (toglie il confondimento) ---`);
  console.log(`  dopo una vittoria : ${pct(sV.v, sV.n)}  (${sV.n} partite)`);
  console.log(`  dopo una sconfitta: ${pct(sS.v, sS.n)}  (${sS.n} partite)`);

  // 2. SESSIONI: pausa > 45 minuti = sessione nuova
  const S = []; let cur = [P[0]];
  for (let i = 1; i < P.length; i++) {
    if (P[i].t - P[i - 1].t > 45 * 60000) { S.push(cur); cur = []; }
    cur.push(P[i]);
  }
  S.push(cur);
  console.log(`\nSESSIONI (pausa oltre 45 minuti = nuova sessione): ${S.length}`);
  const fasce = [[1, 3], [4, 6], [7, 10], [11, 99]];
  console.log("  quanto vinci in base a QUANTE partite hai gia' fatto nella sessione:");
  for (const [lo, hi] of fasce) {
    let a = { n: 0, v: 0 };
    for (const s of S) for (let i = lo - 1; i < Math.min(hi, s.length); i++) { a.n++; a.v += s[i].v; }
    if (a.n >= 8) console.log(`    partite ${String(lo).padStart(2)}-${String(hi === 99 ? "+" : hi).padEnd(2)}: ${pct(a.v, a.n).padStart(4)}  (${String(a.n).padStart(3)} partite)  ${barra(100 * a.v / a.n)}`);
  }
  const lunghe = S.filter((s) => s.length >= 8);
  if (lunghe.length) {
    const tot = lunghe.reduce((s, x) => s + x.length, 0), vv = lunghe.reduce((s, x) => s + x.reduce((q, b) => q + b.v, 0), 0);
    const corte = S.filter((s) => s.length < 8);
    const totC = corte.reduce((s, x) => s + x.length, 0), vvC = corte.reduce((s, x) => s + x.reduce((q, b) => q + b.v, 0), 0);
    console.log(`  sessioni lunghe (8+ partite): ${pct(vv, tot)} su ${tot} partite`);
    console.log(`  sessioni corte (<8 partite) : ${pct(vvC, totC)} su ${totC} partite`);
  }

  // 3. ORA DEL GIORNO
  console.log("\nPER ORA DEL GIORNO (UTC):");
  const ore = {};
  for (const b of P) { const h = new Date(b.t).getUTCHours(); const k = `${String(Math.floor(h / 3) * 3).padStart(2, "0")}-${String(Math.floor(h / 3) * 3 + 2).padStart(2, "0")}`; (ore[k] = ore[k] || { n: 0, v: 0 }).n++; ore[k].v += b.v; }
  for (const k of Object.keys(ore).sort()) if (ore[k].n >= 8) console.log(`  ${k}: ${pct(ore[k].v, ore[k].n).padStart(4)}  (${String(ore[k].n).padStart(3)} partite)  ${barra(100 * ore[k].v / ore[k].n)}`);

  // 4. STAR PLAYER: quanto spesso e' il migliore in campo
  const sp = P.filter((b) => b.isStarPlayer).length;
  const spV = P.filter((b) => b.isStarPlayer && b.v).length;
  console.log(`\nSTAR PLAYER: ${sp} volte su ${n} = ${pct(sp, n)}   (in una squadra da 3, il caso darebbe ~33% delle vittorie)`);
  console.log(`  sulle sole vittorie: ${pct(spV, v)} — se e' molto sotto il 33%, vinci soprattutto trascinato`);

  // 5. DURATA
  const dV = P.filter((b) => b.v && b.duration), dS = P.filter((b) => !b.v && b.duration);
  const med = (a) => a.reduce((s, b) => s + b.duration, 0) / a.length;
  console.log(`\nDURATA: vittorie ${med(dV).toFixed(0)}s · sconfitte ${med(dS).toFixed(0)}s`);

  // 6. LE COMBINAZIONI CHE SANGUINANO
  console.log("\nBRAWLER + MODALITÀ che ti costano (almeno 4 partite):");
  const combo = {};
  for (const b of P) {
    const k = ((b.brawlers || [])[0] || "?") + " in " + b.modeName;
    (combo[k] = combo[k] || { n: 0, v: 0 }).n++; combo[k].v += b.v;
  }
  const righe = Object.entries(combo).map(([k, x]) => ({ k, ...x, wr: 100 * x.v / x.n })).filter((x) => x.n >= 4);
  righe.sort((a, b) => a.wr - b.wr);
  for (const x of righe.slice(0, 8)) console.log(`  ${x.k.padEnd(26)} ${String(x.n).padStart(3)}p  ${x.wr.toFixed(0).padStart(3)}%  ${barra(x.wr)}`);
  console.log("  ...e le migliori:");
  for (const x of righe.slice(-5).reverse()) console.log(`  ${x.k.padEnd(26)} ${String(x.n).padStart(3)}p  ${x.wr.toFixed(0).padStart(3)}%  ${barra(x.wr)}`);

  // 7. QUANTO GUADAGNERESTI smettendo di giocare le combinazioni peggiori
  console.log("\nSE SMETTESSI di giocare le combinazioni sotto il 45% (almeno 4 partite):");
  const cattive = new Set(righe.filter((x) => x.wr < 45).map((x) => x.k));
  const restanti = P.filter((b) => !cattive.has(((b.brawlers || [])[0] || "?") + " in " + b.modeName));
  const rv = restanti.reduce((s, b) => s + b.v, 0);
  console.log(`  toglieresti ${n - restanti.length} partite su ${n} (${pct(n - restanti.length, n)})`);
  console.log(`  la tua win rate passerebbe da ${pct(v, n)} a ${pct(rv, restanti.length)}`);
  console.log(`  combinazioni da evitare: ${[...cattive].join(" · ")}`);
  console.log("  ATTENZIONE: questo numero e' IN CAMPIONE — le combinazioni peggiori sono");
  console.log("  scelte dagli stessi dati su cui poi si misura il guadagno. E' circolare.");

  // La versione onesta: si scelgono le combinazioni cattive dalla PRIMA meta'
  // delle partite e si misura il guadagno sulla SECONDA. Se il guadagno sparisce,
  // erano rumore.
  const meta = Math.floor(P.length / 2);
  const primo = P.slice(0, meta), secondo = P.slice(meta);
  const c1 = {};
  for (const b of primo) { const k = ((b.brawlers || [])[0] || "?") + " in " + b.modeName; (c1[k] = c1[k] || { n: 0, v: 0 }).n++; c1[k].v += b.v; }
  const cattive1 = new Set(Object.entries(c1).filter(([, x]) => x.n >= 3 && x.v / x.n < 0.45).map(([k]) => k));
  const rest2 = secondo.filter((b) => !cattive1.has(((b.brawlers || [])[0] || "?") + " in " + b.modeName));
  const v2tot = secondo.reduce((s, b) => s + b.v, 0), v2rest = rest2.reduce((s, b) => s + b.v, 0);
  console.log("\nLA VERIFICA ONESTA (combinazioni scelte sulla prima meta', misurate sulla seconda):");
  console.log(`  seconda meta' cosi' com'e'      : ${pct(v2tot, secondo.length)} su ${secondo.length} partite`);
  console.log(`  togliendo le combinazioni cattive: ${pct(v2rest, rest2.length)} su ${rest2.length} partite`);
  console.log(`  cioe' ${(100 * v2rest / rest2.length - 100 * v2tot / secondo.length).toFixed(1)} punti di guadagno VERO`);

  // andamento nei giorni
  console.log("\nGIORNO PER GIORNO:");
  const gg = {};
  for (const b of P) { const k = new Date(b.t).toISOString().slice(0, 10); (gg[k] = gg[k] || { n: 0, v: 0 }).n++; gg[k].v += b.v; }
  for (const k of Object.keys(gg).sort()) {
    const x = gg[k];
    console.log(`  ${k}: ${pct(x.v, x.n).padStart(4)}  ${String(x.n).padStart(3)} partite  saldo ${x.v - (x.n - x.v) > 0 ? "+" : ""}${x.v - (x.n - x.v)}  ${barra(100 * x.v / x.n)}`);
  }
  // Lo stesso controllo fuori campione applicato all'effetto "dopo una
  // sconfitta": se sparisce nella seconda meta', era rumore anche quello.
  console.log("\nL'EFFETTO TILT REGGE FUORI CAMPIONE?");
  for (const [eti, Q] of [["prima metà", primo], ["seconda metà", secondo]]) {
    let a = { n: 0, v: 0 }, b2 = { n: 0, v: 0 };
    for (let i = 1; i < Q.length; i++) {
      if (Q[i].modeName !== Q[i - 1].modeName) continue;
      const d = Q[i - 1].v ? a : b2;
      d.n++; d.v += Q[i].v;
    }
    console.log(`  ${eti.padEnd(14)} dopo vittoria ${pct(a.v, a.n).padStart(4)} (${a.n}p)   dopo sconfitta ${pct(b2.v, b2.n).padStart(4)} (${b2.n}p)   scarto ${(100*a.v/a.n - 100*b2.v/b2.n).toFixed(0)} punti`);
  }
  // e la posizione nella sessione
  console.log("\nL'EFFETTO SESSIONE REGGE FUORI CAMPIONE? (partite 1-10 contro 11+)");
  for (const [eti, Q] of [["prima metà", primo], ["seconda metà", secondo]]) {
    const set = new Set(Q);
    let pres = { n: 0, v: 0 }, dopo = { n: 0, v: 0 };
    for (const ses of S) for (let i = 0; i < ses.length; i++) {
      if (!set.has(ses[i])) continue;
      const d = i < 10 ? pres : dopo;
      d.n++; d.v += ses[i].v;
    }
    console.log(`  ${eti.padEnd(14)} partite 1-10 ${pct(pres.v, pres.n).padStart(4)} (${pres.n}p)   dalla 11ª ${pct(dopo.v, dopo.n).padStart(4)} (${dopo.n}p)`);
  }

  const saldo = v - (n - v);
  console.log(`  saldo complessivo: ${saldo > 0 ? "+" : ""}${saldo} partite in quattro giorni`);
})();
