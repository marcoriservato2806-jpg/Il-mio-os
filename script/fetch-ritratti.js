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
// Scarica anche l'immagine di ogni mappa del pool: serve al palco, e serve a
// vedere a colpo d'occhio di aver scelto la mappa giusta (i nomi si
// somigliano, l'immagine no).
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

  // ---- Immagini delle mappe del pool ------------------------------------
  const rm = await fetch("https://api.brawlapi.com/v1/maps");
  if (!rm.ok) throw new Error(`API mappe: HTTP ${rm.status}`);
  const mappeApi = rm.json ? (await rm.json()).list : [];
  const g2 = {};
  new Function("g", "with(g){" + fs.readFileSync(path.join(root, "brawl-draft", "data.js"), "utf8") + "; g.MAPS=MAPS;}")(g2);

  fs.mkdirSync(path.join(tmp, "mappe"), { recursive: true });
  let mp = 0;
  const mancantiMappe = [];
  for (const m of g2.MAPS) {
    // Piu' voci hanno lo stesso nome: vale quella attiva della modalita'
    // giusta. Il confronto e' normalizzato perche' l'API scrive "Ring Of
    // Fire", "Belles Rock", "Out In The Open" — maiuscole e apostrofi
    // diversi dai nostri, e su tre mappe il confronto esatto falliva.
    const norm = (x) => x.toLowerCase().replace(/[^a-z0-9]/g, "");
    const cand = mappeApi.filter((x) => norm(x.name) === norm(m.name) && (x.gameMode || {}).name === m.mode);
    const scelta = cand.find((x) => !x.disabled) || cand[0];
    if (!scelta || !scelta.imageUrl) { mancantiMappe.push(m.name); continue; }
    try {
      const img = await fetch(scelta.imageUrl);
      if (!img.ok) throw new Error(`HTTP ${img.status}`);
      fs.writeFileSync(path.join(tmp, "mappe", `${scelta.id}.png`), Buffer.from(await img.arrayBuffer()));
      fs.appendFileSync(path.join(tmp, "mappe", "nomi.tsv"), `${scelta.id}\t${m.mode}|${m.name}\n`);
      mp++;
    } catch (e) { mancantiMappe.push(`${m.name} (${e.message})`); }
  }
  process.stderr.write(`scaricate ${mp} immagini mappa su ${g2.MAPS.length}\n`);
  if (mancantiMappe.length) process.stderr.write(`mappe senza immagine: ${mancantiMappe.join(", ")}\n`);

  execFileSync("python3", [path.join(__dirname, "ritratti-comprimi.py"), tmp, path.join(root, "brawl-draft", "ritratti.js")], { stdio: "inherit" });
  fs.rmSync(tmp, { recursive: true, force: true });
})();
