#!/usr/bin/env node
// Controlla la salute della memoria di lavoro, come check-brawl-data.js
// controlla i dati dell'app.
//
// Esiste per un motivo preciso: CLAUDE.md diceva di aprire `context/azienda.md`
// e compagnia, quella cartella non esisteva, e i file stavano nella radice.
// Risultato: ogni volta che serviva sapere qualcosa sull'azienda o sulle
// persone, la ricerca non trovava niente e io rispondevo "non lo so" con dei
// dati che erano lì a due passi. Un errore silenzioso, che nessuna rilettura
// avrebbe preso e che nessuno vede finché non lo si cerca apposta.
//
// Uso: node script/check-memoria.js    (esce con 1 se trova qualcosa)

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const R = (p) => path.join(root, p);
let problemi = 0;
let avvisi = 0;
const male = (m) => { console.log("  ✗ " + m); problemi++; };
const forse = (m) => { console.log("  ! " + m); avvisi++; };

// 1. Tutto quello che CLAUDE.md dice di aprire deve esistere davvero.
//    È il controllo che sarebbe servito: un indice che punta nel vuoto è
//    peggio di un indice assente, perché sembra che il dato non ci sia.
const claude = fs.readFileSync(R("CLAUDE.md"), "utf8");
const citati = [...claude.matchAll(/`([\w/.-]+\.md)`/g)].map((m) => m[1]);
const esclusi = new Set(["rossi-srl.md"]); // esempio dentro una spiegazione, non un file vero
for (const f of new Set(citati)) {
  if (esclusi.has(f)) continue;
  if (!fs.existsSync(R(f))) male(`CLAUDE.md rimanda a "${f}" che non esiste`);
}

// 2. Ogni pagina della wiki deve stare nell'indice, o non la ritrova nessuno.
const wikiDir = R("memoria/wiki");
const pagine = fs.readdirSync(wikiDir).filter((f) => f.endsWith(".md"));
const index = fs.readFileSync(path.join(wikiDir, "index.md"), "utf8");
for (const f of pagine) {
  const nome = f.replace(/\.md$/, "");
  if (nome === "index" || nome === "log") continue;
  if (!index.includes(`[[${nome}]]`)) male(`la pagina "${nome}" non è nell'indice`);
}

// 3. Nessun collegamento [[...]] deve puntare a una pagina che non c'è:
//    seguire un link vuol dire aprire quel file, e un link morto è un vicolo.
const esistenti = new Set(pagine.map((f) => f.replace(/\.md$/, "")));
// I collegamenti dentro il codice (fra apici, o in un blocco) sono ESEMPI,
// non rimandi: spiegare la sintassi dei link non deve far fallire il
// controllo. Succedeva scrivendo nel registro che i link si fanno cosi'.
const senzaCodice = (t) => t.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
for (const f of pagine) {
  const testo = senzaCodice(fs.readFileSync(path.join(wikiDir, f), "utf8"));
  for (const m of testo.matchAll(/\[\[([^\]]+)\]\]/g)) {
    if (!esistenti.has(m[1])) male(`${f} rimanda a [[${m[1]}]], che non esiste`);
  }
}

// 4. Il registro: formato e ordine. Il formato serve a leggerlo con un grep,
//    l'ordine (nuovo in cima) a trovare l'ultima cosa fatta senza scorrere.
const log = fs.readFileSync(path.join(wikiDir, "log.md"), "utf8");
const voci = [...log.matchAll(/^## \[(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2})\] (\S+) \| (.+)$/gm)];
const intestazioni = (log.match(/^## /gm) || []).length;
if (voci.length !== intestazioni) male(`nel registro ${intestazioni - voci.length} voci non rispettano il formato "## [AAAA-MM-GG HH:MM] tipo | cosa"`);
if (!voci.length) male("il registro non ha nessuna voce");
for (let i = 1; i < voci.length; i++) {
  const prima = voci[i - 1][1] + " " + voci[i - 1][2];
  const dopo = voci[i][1] + " " + voci[i][2];
  if (dopo > prima) { male(`nel registro la voce del ${dopo} sta sotto quella del ${prima}: l'ordine è nuovo in cima`); break; }
}

// 5. Le skill: senza nome e descrizione nel preambolo non si attivano mai,
//    e una skill che non si attiva è lavoro buttato.
const skillDir = R(".claude/skills");
if (fs.existsSync(skillDir)) {
  for (const d of fs.readdirSync(skillDir)) {
    const p = path.join(skillDir, d, "SKILL.md");
    if (!fs.existsSync(p)) { male(`la skill "${d}" non ha SKILL.md`); continue; }
    const t = fs.readFileSync(p, "utf8");
    const fm = t.match(/^---\n([\s\S]*?)\n---/);
    if (!fm) { male(`la skill "${d}" non ha il preambolo ---`); continue; }
    if (!/^name:\s*\S/m.test(fm[1])) male(`la skill "${d}" non ha "name"`);
    if (!/^description:\s*\S/m.test(fm[1])) male(`la skill "${d}" non ha "description"`);
    const nome = (fm[1].match(/^name:\s*(\S+)/m) || [])[1];
    if (nome && nome !== d) male(`la skill in "${d}/" si chiama "${nome}": cartella e nome devono coincidere`);
  }
}

// 6. Avvisi, non errori: i file di contesto ancora al loro stato di modello.
//    Non è un difetto, è una cosa da sapere — se sono vuoti, io su quegli
//    argomenti non so niente e devo dirlo invece di dedurlo.
for (const f of ["azienda", "persone", "tool", "obiettivi", "regime-fiscale"]) {
  const p = R(`context/${f}.md`);
  if (!fs.existsSync(p)) continue;
  const t = fs.readFileSync(p, "utf8");
  const righeVere = t.split("\n").filter((r) => r.trim() && !r.trim().startsWith(">"));
  if (righeVere.length < 3) forse(`context/${f}.md è ancora il modello: su questo argomento non c'è contesto`);
}

console.log(`\nwiki: ${pagine.length} pagine · registro: ${voci.length} voci · skill: ${fs.existsSync(skillDir) ? fs.readdirSync(skillDir).length : 0}`);
console.log(problemi ? `${problemi} problemi${avvisi ? `, ${avvisi} avvisi` : ""}` : `nessun problema${avvisi ? `, ${avvisi} avvisi` : ""}`);
process.exit(problemi ? 1 : 0);
