#!/usr/bin/env node
// Scarica da brawlplanet.com le win rate di CLASSIFICATA (non trofei) mappa per
// mappa, più l'elenco delle mappe effettivamente nel pool Ranked di adesso.
//
// Perché esiste: brawlplanet ha due schede sulla stessa pagina, "Trophy ladder"
// e "Ranked", e quella aperta di default è TROFEI. Leggere la pagina a occhio
// significa prendere i numeri sbagliati (è già successo, vedi
// memoria/wiki/errori-trovati.md). Qui la scheda giusta è scelta dal codice,
// ancorandosi alla didascalia "Ranked matches on this map".
//
// Uso:  node script/fetch-brawlplanet-ranked.js > /tmp/bp.json
//       node script/fetch-brawlplanet-ranked.js --map kaboomcanyon_heist

const BASE = "https://www.brawlplanet.com";

async function get(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { "user-agent": "brawl-draft-updater" } });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.text();
    } catch (e) {
      if (i === tries - 1) throw e;
      await new Promise((s) => setTimeout(s, 1000 * 2 ** i));
    }
  }
}

// Il pool Ranked attuale: la pagina /powerleague elenca tutte le mappe, ma
// quelle uscite dal pool stanno dentro un <details> "Archived maps". Le mappe
// archiviate hanno ancora statistiche, e sono proprio quelle che non vanno
// mostrate: sono ferme a quando la mappa era in rotazione.
async function fetchPool() {
  const html = await get(`${BASE}/powerleague`);
  const cut = html.indexOf("Archived maps");
  if (cut < 0) throw new Error("sezione 'Archived maps' non trovata: la pagina è cambiata, non tirare a indovinare");
  const end = html.indexOf("</details>", cut);
  const slugs = (s) => {
    const out = [];
    for (const m of s.matchAll(/\/maps\/([a-z0-9]+_[a-z0-9]+)/g)) if (!out.includes(m[1])) out.push(m[1]);
    return out;
  };
  const all = slugs(html.slice(0, cut));
  const archived = slugs(html.slice(cut, end));
  return { active: all.filter((s) => !archived.includes(s)), archived };
}

const CAPTION = "Ranked matches on this map, across all leagues";

async function fetchMap(slug) {
  const html = await get(`${BASE}/maps/${slug}`);
  const i = html.indexOf(CAPTION);
  if (i < 0) return { slug, error: "nessuna scheda Ranked su questa pagina" };

  // Il campione sta nella didascalia stessa: "Win rates from 1,921,752 Ranked
  // matches on this map, across all leagues."
  const before = html.slice(Math.max(0, i - 200), i);
  const sm = before.match(/from ([\d,]+) $/) || before.match(/from ([\d,]+) /);
  const sample = sm ? Number(sm[1].replace(/,/g, "")) : null;

  const b0 = html.indexOf("<tbody", i);
  const b1 = html.indexOf("</tbody>", b0);
  if (b0 < 0 || b1 < 0) return { slug, error: "tabella Ranked non trovata" };

  const rows = [];
  for (const tr of html.slice(b0, b1).split("<tr").slice(1)) {
    const name = tr.match(/max-w-none">([^<]+)<\/p>/);
    const nums = [...tr.matchAll(/tabular-nums[^>]*>([\d.]+)</g)].map((m) => Number(m[1]));
    // nums = [rank, win, pick, star]; il rank è la prima cella, nascosta su mobile
    if (!name || nums.length < 4) continue;
    rows.push({ name: decode(name[1]), win: nums[1], pick: nums[2], star: nums[3] });
  }
  const title = html.match(/<title>([^<]*)<\/title>/);
  return { slug, sample, rows, title: title ? decode(title[1]) : null };
}

function decode(s) {
  return s
    .replace(/&amp;/g, "&").replace(/&#x27;|&apos;/g, "'").replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#(\d+);/g, (_, d) => String.fromCharCode(d));
}

(async () => {
  const arg = process.argv.indexOf("--map");
  if (arg > -1) {
    console.log(JSON.stringify(await fetchMap(process.argv[arg + 1]), null, 1));
    return;
  }
  const pool = await fetchPool();
  process.stderr.write(`pool ranked: ${pool.active.length} attive, ${pool.archived.length} archiviate\n`);
  const maps = [];
  for (const slug of pool.active) {
    const m = await fetchMap(slug);
    process.stderr.write(`  ${slug}: ${m.error ? m.error : `${m.rows.length} brawler, ${m.sample} partite`}\n`);
    maps.push(m);
  }
  console.log(JSON.stringify({ fetched: new Date().toISOString().slice(0, 10), pool, maps }, null, 1));
})();
