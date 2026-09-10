#!/usr/bin/env node
// Genera la pagina pubblicabile del BRIEF a partire da brawl-draft/BRIEF.md.
//
// Perche' generata e non scritta a mano: il testo deve esistere UNA volta sola.
// Un documento che vive in due copie diverge, e la copia che l'utente incolla
// da qualche parte sarebbe quella vecchia. Qui il markdown e' incorporato tale
// e quale nella pagina: il tasto "copia" restituisce esattamente il file.
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const md = fs.readFileSync(path.join(root, "brawl-draft", "BRIEF.md"), "utf8");
// L'unica sequenza che romperebbe l'incorporamento in un tag <script>.
const sicuro = md.replace(/<\/script/gi, "<\\/script");

const html = `<title>Capitolato di un draft engine</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,900&family=Archivo:wght@400;500;600;800&family=JetBrains+Mono:wght@400;700&display=swap">
<script src="https://cdnjs.cloudflare.com/ajax/libs/marked/12.0.2/marked.min.js"></script>
<style>
  :root {
    --ground:#f7f5fa; --paper:#ffffff; --sunk:#efecf4;
    --line:#ded8e8; --line-soft:#ebe6f2;
    --ink:#1a1622; --ink-mid:#4d4460; --ink-dim:#776c8c;
    --gold:#9a6b00; --gold-soft:rgba(212,160,23,.13);
    --good:#1d7a4f; --bad:#b32d34; --cold:#2f5fa8;
    --sans:"Archivo",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;
    --serif:"Fraunces",Georgia,"Times New Roman",serif;
    --mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --ground:#14111b; --paper:#1c1826; --sunk:#241f30;
      --line:#3a3348; --line-soft:#2c2639;
      --ink:#ece8f3; --ink-mid:#b8b0c8; --ink-dim:#8c839e;
      --gold:#ffc23d; --gold-soft:rgba(255,194,61,.12);
      --good:#57d99a; --bad:#ff8080; --cold:#7aa8f0;
    }
  }
  :root[data-theme="dark"] {
    --ground:#14111b; --paper:#1c1826; --sunk:#241f30;
    --line:#3a3348; --line-soft:#2c2639;
    --ink:#ece8f3; --ink-mid:#b8b0c8; --ink-dim:#8c839e;
    --gold:#ffc23d; --gold-soft:rgba(255,194,61,.12);
    --good:#57d99a; --bad:#ff8080; --cold:#7aa8f0;
  }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--ground); color:var(--ink); font-family:var(--sans); font-size:16px; line-height:1.62; -webkit-font-smoothing:antialiased; }
  .wrap { max-width:820px; margin:0 auto; padding-block:44px 72px; padding-left:20px; padding-right:20px; }

  header.testa { border-bottom:1px solid var(--line); padding-bottom:22px; margin-bottom:8px; }
  .firma { font-family:var(--mono); font-size:.7rem; color:var(--ink-dim); letter-spacing:.05em; text-transform:uppercase; margin:0 0 10px; }
  header.testa h1 { font-family:var(--serif); font-weight:900; font-size:clamp(1.9rem,5.5vw,2.8rem); line-height:1.04; letter-spacing:-.025em; margin:0 0 12px; text-wrap:balance; }
  .occhiello { font-size:1.02rem; color:var(--ink-mid); max-width:58ch; margin:0 0 20px; }

  .azioni { display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
  button#copia {
    font-family:var(--sans); font-size:.9rem; font-weight:600;
    background:var(--ink); color:var(--ground);
    border:none; border-radius:8px; padding:11px 18px; cursor:pointer;
    transition:opacity .15s ease;
  }
  button#copia:hover { opacity:.85; }
  button#copia:focus-visible { outline:2px solid var(--gold); outline-offset:2px; }
  button#copia.fatto { background:var(--good); }
  .peso { font-family:var(--mono); font-size:.72rem; color:var(--ink-dim); }

  /* Il documento reso. Tutto quello che segue e' il markdown del file. */
  .doc { margin-top:36px; }
  .doc h2 { font-family:var(--serif); font-weight:600; font-size:clamp(1.3rem,3.2vw,1.6rem); line-height:1.18; letter-spacing:-.015em; margin:44px 0 12px; padding-top:22px; border-top:1px solid var(--line); text-wrap:balance; }
  .doc h2:first-of-type { border-top:none; padding-top:0; margin-top:8px; }
  .doc h1 { display:none; }
  .doc h3 { font-size:1.02rem; font-weight:600; margin:26px 0 8px; letter-spacing:-.005em; }
  .doc p { margin:0 0 14px; max-width:68ch; }
  .doc ul, .doc ol { max-width:68ch; padding-left:1.3em; margin:0 0 16px; }
  .doc li { margin-bottom:7px; }
  .doc li::marker { color:var(--ink-dim); }
  .doc strong { font-weight:600; }
  .doc a { color:var(--cold); }
  .doc hr { border:none; border-top:1px solid var(--line-soft); margin:34px 0; }
  .doc code { font-family:var(--mono); font-size:.85em; background:var(--sunk); padding:1px 5px; border-radius:4px; }
  .doc pre { background:var(--sunk); border:1px solid var(--line-soft); border-radius:8px; padding:14px 16px; overflow-x:auto; margin:0 0 16px; }
  .doc pre code { background:none; padding:0; font-size:.84rem; line-height:1.55; }
  .doc blockquote { border-left:3px solid var(--gold); margin:0 0 16px; padding:2px 0 2px 14px; color:var(--ink-mid); }

  .doc table { border-collapse:collapse; width:100%; font-size:.88rem; }
  .doc .tabella { overflow-x:auto; margin:0 0 18px; }
  .doc th, .doc td { text-align:left; padding:8px 14px 8px 0; border-bottom:1px solid var(--line-soft); vertical-align:top; }
  .doc th { font-family:var(--mono); font-size:.66rem; text-transform:uppercase; letter-spacing:.07em; color:var(--ink-dim); font-weight:400; white-space:nowrap; }
  .doc tbody tr:last-child td { border-bottom:none; }
  .doc td:not(:first-child) { font-variant-numeric:tabular-nums; }

  /* La lista dei criteri di accettazione e' una lista di cose da spuntare:
     si vede che lo e'. */
  .doc li:has(> input[type="checkbox"]) { list-style:none; margin-left:-1.3em; padding-left:1.7em; position:relative; }
  .doc input[type="checkbox"] { position:absolute; left:0; top:.42em; width:14px; height:14px; accent-color:var(--gold); }

  .doc pre.grezzo { white-space:pre-wrap; word-wrap:break-word; font-size:.8rem; line-height:1.6; }

  @media (max-width:560px) { .doc th, .doc td { padding-right:10px; } }
</style>

<div class="wrap">
  <header class="testa">
    <p class="firma">Capitolato tecnico · 10 settembre 2026</p>
    <h1>Capitolato di un draft engine</h1>
    <p class="occhiello">Tutto quello che serve per costruire il miglior assistente di draft per la Classificata di Brawl Stars: dove stanno i dati, come si compone il punteggio, le trappole che costano un giorno ciascuna, e le idee ovvie che ho provato e scartato con una misura. Scritto per essere consegnato a chi lo costruisce.</p>
    <div class="azioni">
      <button id="copia" type="button">Copia il capitolato</button>
      <span class="peso">Markdown · ${(Buffer.byteLength(md, "utf8") / 1024).toFixed(0)} KB</span>
    </div>
  </header>

  <article class="doc" id="doc"></article>
</div>

<script id="sorgente" type="text/plain">${sicuro}</script>
<script>
  (function () {
    var testo = document.getElementById("sorgente").textContent;
    var doc = document.getElementById("doc");
    // Se la libreria che rende il markdown non arriva, il documento si legge
    // lo stesso: testo grezzo invece di una pagina bianca. Il capitolato e'
    // la cosa che conta, l'impaginazione no.
    if (typeof marked === "undefined") {
      var pre = document.createElement("pre");
      pre.className = "grezzo";
      pre.textContent = testo;
      doc.appendChild(pre);
    } else {
      marked.setOptions({ gfm: true, breaks: false });
      doc.innerHTML = marked.parse(testo);
    }
    // Le tabelle larghe scorrono dentro il loro contenitore, non trascinano
    // la pagina di lato.
    doc.querySelectorAll("table").forEach(function (t) {
      var box = document.createElement("div");
      box.className = "tabella";
      t.parentNode.insertBefore(box, t);
      box.appendChild(t);
    });
    var b = document.getElementById("copia");
    b.addEventListener("click", function () {
      function fatto() {
        b.textContent = "Copiato";
        b.classList.add("fatto");
        setTimeout(function () { b.textContent = "Copia il capitolato"; b.classList.remove("fatto"); }, 1600);
      }
      // navigator.clipboard non c'e' ovunque: il ripiego serve davvero.
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(testo).then(fatto, ripiego);
      } else { ripiego(); }
      function ripiego() {
        var ta = document.createElement("textarea");
        ta.value = testo;
        ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); fatto(); }
        catch (e) { b.textContent = "Selezionalo e copialo a mano"; }
        document.body.removeChild(ta);
      }
    });
  })();
</script>
`;
const out = path.join(root, "brawl-draft", "dist", "brief.html");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
const controlli = [
  ["il markdown e' dentro la pagina", html.includes("## 0. Cosa deve fare")],
  ["c'e' il tasto copia", html.includes('id="copia"')],
  ["nessun tag giocatore", !/#[0289PYLQGRJCUV]{4,12}(?![0-9A-Za-z])/.test(html)],
  ["nessuna chiave API", !/[A-Za-z0-9_-]{30,}\./.test(html.replace(/https?:\/\/[^\s"']+/g, ""))],
];
for (const [nome, ok] of controlli) console.log(`  ${ok ? "ok" : "FALLITO"}  ${nome}`);
if (controlli.some(([, ok]) => !ok)) process.exit(1);
console.log(`Scritto ${path.relative(root, out)} (${(Buffer.byteLength(html, "utf8") / 1024).toFixed(0)} KB)`);
