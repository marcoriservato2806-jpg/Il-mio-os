// I TRATTI MECCANICI DI OGNI BRAWLER, dalla fonte pubblica.
//
// Il problema che questo script serve a risolvere: la matrice dei counter e'
// misurata solo per il 5,4% delle coppie (624 voci su 11.556 — le fonti
// pubblicano i 3 migliori e i 3 peggiori per brawler, nessuna la matrice
// intera). Per il restante 94,6% l'app stima, e la stima e' quasi piatta:
// deviazione standard 1,67 punti contro 4,54 delle coppie misurate. Cioe' il
// vantaggio tecnico contro un avversario preciso esiste nei dati veri ma la
// stima non riesce a nominarlo, perche' l'unica cosa che sa di un brawler e'
// la sua classe (sette gruppi, quindici brawler per gruppo).
//
// Qui si estrae PIU' informazione per brawler, senza inventarne nessuna:
// api.brawlapi.com pubblica per ogni brawler la sua etichetta di stile di
// gioco ufficiale (il campo `class.name`, che nell'API e' un'etichetta unica
// per brawler, non la classe a sette: per Piper "Poke From Range And Escape
// With A Super"). Da quel testo si ricavano tratti binari con regole di parola
// chiave scritte qui sotto, quindi verificabili e ricontrollabili.
//
// Non e' conoscenza mia messa a mano: se una parola chiave non c'e' nel testo,
// il tratto e' zero. Sbaglierebbe se l'etichetta fosse incompleta — e a volte
// lo e' — ma sbaglia in modo controllabile e uguale per tutti.
const fs = require("fs");
const path = require("path");

// Le regole. Ogni tratto e' un elenco di frasi: se una compare nell'etichetta
// (senza distinzione di maiuscole), il tratto vale 1.
const REGOLE = {
  // combatte da lontano
  lontano: ["long range", "snipe", "snipi", "poke from range", "massive range", "huge range",
            "from a distance", "extra range", "from safety", "safely", "bombard", "poke enemies",
            "long range pulls", "added poison", "mid-range", "outside shots", "charged attacks"],
  // vuole arrivare addosso
  addosso: ["jump in", "jump to", "jump around", "assassinate", "charge in", "get close", "dive in",
            "chase down", "sneak in", "ambush", "aggressive", "aggression", "close range",
            "then engage", "then strike", "strike as ninja", "roll in", "then jump in", "leap over",
            "knock em back", "reclaim"],
  // colpisce oltre i muri o li usa
  muri: ["through walls", "behind walls", "bounce", "over walls", "break walls", "make walls",
         "use walls", "avoid walls", "new angles", "use terrain"],
  // occupa e nega spazio
  spazio: ["control space", "control the map", "control multiple lanes", "zone", "deny space",
           "take space", "control objectives", "dominate the map", "take over the map",
           "control space and heal", "lay down tracks", "remove them from play"],
  // cura o potenzia la squadra
  squadra: ["heal teammates", "instant heals", "buff teammates", "buff your team", "boost your team",
            "shield teammates", "get your team", "overwhelm with teamwork", "keep your team"],
  // regge i colpi e sta in prima linea
  regge: ["high health", "soak up damage", "hold ground", "hold your ground", "self-revival",
          "big close range damage"],
  // dipende dai cespugli
  cespugli: ["bush", "bushes"],
  // scarica tutto in un colpo solo
  scoppio: ["burst", "big damage", "large area damage", "for more damage", "extra damage",
            "punish", "finish them", "last shot"],
  // mette fuori gioco: stordisce, congela, isola
  blocca: ["stun", "freeze", "hypnotize", "cocoon", "silence", "slow enemy", "fear enemies",
           "isolate", "shadow realm", "push enemies away", "single out"],
};

async function main() {
  // esce in script/, NON in brawl-draft/: i tratti sono un tentativo MISURATO E
  // FALLITO (vedi calibra-tratti.js), l'app non li usa e la cartella dell'app
  // non deve portare dati che nessuno legge.
  const dest = process.argv[2] || path.join(__dirname, "tratti-generati.js");
  const cache = process.env.BRAWLAPI_CACHE;
  let payload;
  if (cache && fs.existsSync(cache)) {
    payload = JSON.parse(fs.readFileSync(cache, "utf8"));
  } else {
    const r = await fetch("https://api.brawlapi.com/v1/brawlers");
    if (!r.ok) throw new Error("brawlapi ha risposto " + r.status + ": tengo il file vecchio");
    payload = await r.json();
  }
  const lista = (payload.list || payload).filter((b) => b.released);

  const tratti = {};
  const etichette = {};
  const senza = [];
  for (const b of lista) {
    const testo = ((b.class && b.class.name) || "").toLowerCase();
    etichette[b.name] = (b.class && b.class.name) || "";
    const v = {};
    for (const [t, parole] of Object.entries(REGOLE)) {
      if (parole.some((p) => testo.includes(p))) v[t] = 1;
    }
    tratti[b.name] = v;
    if (Object.keys(v).length === 0) senza.push(b.name + " — «" + etichette[b.name] + "»");
  }

  const nomiTratti = Object.keys(REGOLE);
  const conta = {};
  for (const t of nomiTratti) conta[t] = Object.values(tratti).filter((v) => v[t]).length;

  const righe = Object.keys(tratti).sort().map((n) => {
    const v = tratti[n];
    const attivi = nomiTratti.filter((t) => v[t]);
    return `  ${JSON.stringify(n)}: [${attivi.map((t) => JSON.stringify(t)).join(", ")}], // ${etichette[n]}`;
  });

  const out = `// GENERATO da script/estrai-tratti.js — non modificare a mano.
// Fonte: api.brawlapi.com/v1/brawlers, campo class.name (l'etichetta ufficiale
// di stile di gioco, una per brawler). Estratto il ${new Date().toISOString().slice(0, 10)}.
// Le regole di parola chiave stanno nello script, cosi' un tratto sbagliato si
// corregge la' e si rigenera, invece di essere ritoccato qui.
//
// Quanti brawler per tratto (su ${lista.length}):
${nomiTratti.map((t) => `//   ${t.padEnd(9)} ${String(conta[t]).padStart(3)}`).join("\n")}
//
// Brawler senza nessun tratto riconosciuto (${senza.length}): l'etichetta non
// contiene nessuna delle parole chiave. Per loro la stima resta quella di
// classe, come prima.
${senza.map((s) => "//   " + s).join("\n")}
const TRATTI_NOMI = ${JSON.stringify(nomiTratti)};
const TRATTI = {
${righe.join("\n")}
};
`;
  fs.writeFileSync(dest, out);
  console.log(`scritto ${dest} · ${lista.length} brawler`);
  for (const t of nomiTratti) console.log(`  ${t.padEnd(9)} ${conta[t]}`);
  console.log(`  senza tratti: ${senza.length}`);
  for (const s of senza) console.log("    " + s);
}
main().catch((e) => { console.error(String(e.message || e)); process.exit(1); });
