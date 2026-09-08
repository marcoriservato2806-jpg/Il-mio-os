// Unisce i quattro file di brawl-draft/ in un unico HTML autonomo.
//
// Serve perché l'app va pubblicata come pagina singola (un link che apri dal
// telefono durante il draft), mentre in repo conviene tenere i file separati:
// data.js da solo è quello che l'aggiornamento settimanale riscrive.
// Rifarlo a mano a ogni aggiornamento dei dati sarebbe lavoro meccanico da
// sbagliare prima o poi, quindi sta qui.
//
// Uso: node script/build-brawl-draft.js
// Produce: brawl-draft/dist/app-completa.html

const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "..", "brawl-draft");
const OUT_DIR = path.join(SRC, "dist");
const OUT = path.join(OUT_DIR, "app-completa.html");

const read = (f) => fs.readFileSync(path.join(SRC, f), "utf8");

const html = read("index.html");
const css = read("style.css");
const data = read("data.js");
const app = read("app.js");
const ritratti = read("ritratti.js");
const profilo = read("profilo.js");

// Prende solo il contenuto del body: la pagina pubblicata viene già avvolta
// in doctype/html/head/body dall'host, quindi ripeterli romperebbe tutto.
const bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/);
if (!bodyMatch) throw new Error("Non trovo <body> in index.html");
const body = bodyMatch[1]
  .replace(/<script src="[^"]*"><\/script>\s*/g, "")
  .trim();

const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/);
const title = titleMatch ? titleMatch[1].trim() : "Assistente Draft Classificata";

const out = `<title>${title}</title>
<style>
${css}
</style>

${body}

<script>
${profilo}

${ritratti}

${data}

${app}
</script>
`;

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT, out, "utf8");

const kb = (Buffer.byteLength(out, "utf8") / 1024).toFixed(0);
console.log(`Scritto ${path.relative(path.join(__dirname, ".."), OUT)} (${kb} KB)`);

// Controlli minimi: se uno di questi salta, il file prodotto è rotto e
// meglio accorgersene qui che dopo averlo pubblicato.
const checks = [
  ["nessun doctype/html/head/body residuo", !/<!doctype|<html|<\/body>|<head>/i.test(out)],
  ["contiene il roster", out.includes("const BRAWLERS")],
  ["contiene le mappe", out.includes("const MAPS")],
  ["contiene la logica", out.includes("function computeSuggestions")],
  ["contiene il markup", out.includes('id="brawler-grid"')],
  ["contiene i ritratti", out.includes("const BRAWLER_IMGS")],
  ["contiene il profilo", out.includes("const PROFILO ")],
  // Nessun tag giocatore nel file pubblicato. Il controllo cerca la FORMA di
  // un tag, non un tag preciso: scriverne uno qui dentro lo metterebbe in
  // chiaro in un repository pubblico — che e' esattamente quello che questa
  // riga deve impedire, ed e' l'errore che ha fatto la prima versione.
  // I tag Brawl Stars usano solo queste 14 lettere e cifre, in maiuscolo, e
  // arrivano a 10 caratteri: la prima versione si fermava a 9 e lasciava
  // passare proprio il tag da proteggere. Verificato che non scatti sui
  // colori esadecimali del CSS, che sono minuscoli.
  ["nessun tag giocatore nel file", !/#[0289PYLQGRJCUV]{4,12}(?![0-9A-Za-z])/.test(out)],
];
let ok = true;
for (const [label, pass] of checks) {
  if (!pass) { console.error("FALLITO:", label); ok = false; }
}
if (!ok) process.exit(1);
console.log("Controlli passati.");
