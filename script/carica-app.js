// Carica data.js e app.js in node per poterli MISURARE fuori dal browser.
// Serve a rispondere a domande tipo "quanto pesa davvero il matchup nel
// punteggio", che a occhio non si sanno e nel browser si misurano male.
const fs = require("fs");
const path = require("path");

function carica(dir) {
  const d = dir || path.join(__dirname, "..", "brawl-draft");
  const finto = {
    document: {
      getElementById: () => null,
      querySelector: () => null,
      querySelectorAll: () => [],
      createElement: () => ({ style: {}, classList: { add(){}, remove(){}, toggle(){} }, appendChild(){}, addEventListener(){}, querySelector: () => null }),
      createDocumentFragment: () => ({ appendChild(){} }),
      addEventListener(){},
    },
    window: { scrollTo(){}, matchMedia: () => ({ matches: false }) },
    localStorage: { getItem: () => null, setItem(){}, removeItem(){} },
    setTimeout: () => 0, clearTimeout(){},
    requestAnimationFrame: (f) => f(),
    console,
    Date, Math, JSON, Map, Set, Object, Array, Number, String, isNaN, parseFloat, parseInt,
  };
  const sorgenti = ["data.js", "ritratti.js", "profilo.js", "app.js"];
  let codice = "";
  for (const f of sorgenti) {
    const p = path.join(d, f);
    if (fs.existsSync(p)) codice += fs.readFileSync(p, "utf8") + "\n";
  }
  // Espone quello che serve per misurare. Ogni nome e' facoltativo: cosi' lo
  // stesso caricatore funziona anche su una versione VECCHIA del file (serve a
  // confrontare prima e dopo), invece di fallire su una funzione che non c'era.
  const espone = ["state", "BRAWLERS", "MAPS", "MODES", "MATCHUPS", "BRAWLER_OVERALL",
    "CLASS_EDGE", "USE_RATES", "MODE_WIN_RATES", "DEFAULT_META_SCORES", "baseMetaScores",
    "setCustomScores", "buildSequence", "classOf", "mapConfidence", "useRateOf", "threatOf",
    "computeBanSuggestions", "rawMatchup", "matchupEdge", "classEdge", "predictedWinRate",
    "comparizioneSu600", "correzioneRarita", "contextualWinRate", "scoreCandidate",
    "computeSuggestions", "distribuzioneAvversario", "edgeCasellaVuota", "quotaRisposta",
    "edgeCentrato", "viciniMisurati", "likelyEnemyPicks", "residualRisk", "favoreMatchup", "schierabile",
    "filtroAttivo", "usedNames", "currentTurn", "PROFILO"];
  codice += "return {" + espone.map((k) => `${k}: typeof ${k} === "undefined" ? undefined : ${k}`).join(", ") + "};";
  const chiavi = Object.keys(finto);
  const fn = new Function(...chiavi, codice);
  const api = fn(...chiavi.map((k) => finto[k]));
  api.setCustomScores({ ...api.baseMetaScores() });
  api.buildSequence();
  return api;
}

module.exports = { carica };
