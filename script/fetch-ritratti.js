#!/usr/bin/env node
// Scarica i ritratti dei brawler e li scrive in brawl-draft/ritratti.js come
// data URI, uno per nome.
//
// Perché incorporati e non collegati: la pagina pubblicata blocca il
// caricamento di immagini da altri siti (nessun errore visibile, semplicemente
// non compaiono). L'unico modo perché si vedano è che stiano dentro il file.
//
// Le immagini sono di Supercell, servite dal CDN pubblico di Brawlify.
// Ridimensionate da 170px a 96px e convertite in WebP dallo script gemello
// script/ritratti-comprimi.py: a 170px pesavano ~1,1 MB in totale, che in una
// pagina che apri col telefono mentre parte il timer sono di troppo.
//
// Uso: node script/fetch-ritratti.js

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.join(__dirname, "..");
const tmp = path.join(root, ".ritratti-tmp");

(async () => {
  const r = await fetch("https://api.brawlapi.com/v1/brawlers");
  if (!r.ok) throw new Error(`API brawler: HTTP ${r.status}`);
  const lista = (await r.json()).list;

  // Il roster dell'app decide quali servono: i brawler che non usiamo non
  // devono pesare nel file.
  const g = {};
  new Function("g", "with(g){" + fs.readFileSync(path.join(root, "brawl-draft", "data.js"), "utf8") + "; g.BRAWLERS=BRAWLERS;}")(g);
  const nostri = new Set(g.BRAWLERS.map((b) => b.name));

  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp, { recursive: true });

  let presi = 0;
  const mancanti = [];
  for (const b of lista) {
    if (!nostri.has(b.name)) continue;
    const url = b.imageUrl2 || b.imageUrl;
    if (!url) { mancanti.push(b.name); continue; }
    try {
      const img = await fetch(url);
      if (!img.ok) throw new Error(`HTTP ${img.status}`);
      fs.writeFileSync(path.join(tmp, `${b.id}.png`), Buffer.from(await img.arrayBuffer()));
      fs.appendFileSync(path.join(tmp, "nomi.tsv"), `${b.id}\t${b.name}\n`);
      presi++;
    } catch (e) {
      mancanti.push(`${b.name} (${e.message})`);
    }
  }
  process.stderr.write(`scaricati ${presi} ritratti su ${nostri.size} del roster\n`);
  if (mancanti.length) process.stderr.write(`senza immagine: ${mancanti.join(", ")}\n`);

  execFileSync("python3", [path.join(__dirname, "ritratti-comprimi.py"), tmp, path.join(root, "brawl-draft", "ritratti.js")], { stdio: "inherit" });
  fs.rmSync(tmp, { recursive: true, force: true });
})();
