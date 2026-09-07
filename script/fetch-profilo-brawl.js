#!/usr/bin/env node
// Legge quali brawler possiede un profilo Brawl Stars, dal tracker pubblico
// di brawlplanet.com. Niente chiave, niente login: è la stessa pagina che
// vedrebbe chiunque incollando il tag.
//
// Perché non l'API ufficiale di Supercell: richiede una chiave legata a un
// indirizzo IP fisso. In una pagina pubblicata la chiave sarebbe in chiaro e
// l'IP non combacerebbe mai con quello del telefono. Non è una via.
//
// LIMITE DA DIRE SEMPRE: è una fotografia, non un collegamento dal vivo. Se
// sblocchi un brawler nuovo va rilanciato.
//
// Uso: node script/fetch-profilo-brawl.js <tag>     (con o senza #)

const TAG = (process.argv[2] || "").replace(/^#/, "").trim().toUpperCase();
if (!TAG) {
  console.error("Serve il tag del giocatore, es: node script/fetch-profilo-brawl.js #2R0V8LJC");
  process.exit(2);
}

(async () => {
  const url = `https://www.brawlplanet.com/players/${encodeURIComponent(TAG)}`;
  let html;
  for (let i = 0; i < 4; i++) {
    try {
      const r = await fetch(url, { headers: { "user-agent": "brawl-draft-updater" } });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      html = await r.text();
      break;
    } catch (e) {
      if (i === 3) { console.error(`Non raggiungo il tracker: ${e.message}`); process.exit(1); }
      await new Promise((s) => setTimeout(s, 1000 * 2 ** i));
    }
  }

  const head = html.match(/Brawlers \((\d+)\/(\d+)\)/);
  // La collezione sta nel payload della pagina come "cards":[{...}]. Si legge
  // da lì e non dal DOM: il DOM lo costruisce JavaScript, e a noi serve solo
  // il dato.
  // Nel sorgente le virgolette del payload arrivano scappate (\"cards\"),
  // ma non sempre: si provano entrambe le forme invece di indovinare.
  let i = html.indexOf('\\"cards\\":[{\\"id\\":16');
  let scappato = i >= 0;
  if (i < 0) { i = html.indexOf('"cards":[{"id":16'); scappato = false; }
  if (i < 0) {
    console.error(head
      ? `Profilo trovato (${head[0]}) ma la lista non è nella pagina: il tracker è cambiato.`
      : "Nessun profilo con questo tag, o il tracker non risponde come prima.");
    process.exit(1);
  }
  const start = html.indexOf("[", i);
  let depth = 0, end = -1;
  for (let k = start; k < html.length; k++) {
    const c = html[k];
    if (c === "[") depth++;
    else if (c === "]") { depth--; if (depth === 0) { end = k + 1; break; } }
  }
  const grezzo = html.slice(start, end);
  const cards = JSON.parse(scappato ? grezzo.replace(/\\"/g, '"').replace(/\\\\/g, "\\") : grezzo);

  const posseduti = cards.map((c) => ({
    nome: c.displayName, potenza: c.power, rank: c.rank, trofei: c.trophies,
  })).sort((a, b) => b.trofei - a.trofei);

  console.error(`#${TAG}: ${posseduti.length} brawler${head ? ` (la pagina dice ${head[0]})` : ""}`);
  console.log(JSON.stringify({ tag: TAG, letto: new Date().toISOString().slice(0, 10), posseduti }, null, 1));
})();
