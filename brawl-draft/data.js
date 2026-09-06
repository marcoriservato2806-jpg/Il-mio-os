// Dati del draft: roster brawler e matrice dei vantaggi di classe.
//
// ATTENZIONE SULLA COMPLETEZZA DEL ROSTER:
// Questo elenco è stato compilato a settembre 2026 tramite ricerche web.
// Aggiornamento del 6/9: brawlify.com e il wiki Fandom restano bloccati
// per questa sessione (403/402, probabile anti-bot loro, non un limite di
// rete generale — Wikipedia e altri siti si aprono normalmente), ma due
// altre fonti (pockettactics.com, brawlvision.com) hanno dato una lista
// per classe quasi completa. Le due però si contraddicono su alcuni nomi
// (es. Mina, Jae-Yong) quindi il roster sotto NON è stato riscritto da
// zero sulla loro base: sono serviti solo a trovare "Angelo" (aggiunto,
// era già citato nei bestPicks delle mappe ma mancava da qui) e a
// verificare due brawler non ancora inclusi:
//  - Vince: NON è ancora uscito (rivelato ad agosto 2026, release ottobre
//    2026) — va aggiunto solo dopo l'uscita, non prima.
//  - Cosmo: annunciato per il "Brawler Blast" di settembre 2026, data
//    esatta e disponibilità in Classificata non confermate — non aggiunto
//    finché non è verificato che sia già giocabile.
// Il gioco conta 108 brawler; qui ce ne sono circa 104 con classe
// abbastanza sicura. Prima di fidarti ciecamente della scheda "Meta":
// controlla il roster su brawlify.com/brawlers (da browser vero) e
// correggi qui sotto. Aggiungere un brawler è una riga sola:
// { name: "NomeNuovo", class: "Tank" }.

const CLASSES = [
  "Tank",
  "Damage Dealer",
  "Assassin",
  "Marksman",
  "Controller",
  "Artillery",
  "Support",
];

const BRAWLERS = [
  // Tank
  { name: "El Primo", class: "Tank" },
  { name: "Rosa", class: "Tank" },
  { name: "Darryl", class: "Tank" },
  { name: "Frank", class: "Tank" },
  { name: "Jacky", class: "Tank" },
  { name: "Bull", class: "Tank" },
  { name: "Ash", class: "Tank" },
  { name: "Buster", class: "Tank" },
  { name: "Meg", class: "Tank" },
  { name: "Draco", class: "Tank" },
  { name: "Hank", class: "Tank" },
  { name: "Bibi", class: "Tank" },
  { name: "Bolt", class: "Tank" },
  { name: "Damian", class: "Tank" },
  { name: "Ollie", class: "Tank" },
  { name: "Trunk", class: "Tank" },

  // Damage Dealer
  { name: "Shelly", class: "Damage Dealer" },
  { name: "Nita", class: "Damage Dealer" },
  { name: "Colt", class: "Damage Dealer" },
  { name: "8-Bit", class: "Damage Dealer" },
  { name: "Rico", class: "Damage Dealer" },
  { name: "Carl", class: "Damage Dealer" },
  { name: "Tara", class: "Damage Dealer" },
  { name: "Chuck", class: "Damage Dealer" },
  { name: "Spike", class: "Damage Dealer" },
  { name: "Chester", class: "Damage Dealer" },
  { name: "Surge", class: "Damage Dealer" },
  { name: "Colette", class: "Damage Dealer" },
  { name: "Lola", class: "Damage Dealer" },
  { name: "Eve", class: "Damage Dealer" },
  { name: "R-T", class: "Damage Dealer" },
  { name: "Pearl", class: "Damage Dealer" },
  { name: "Clancy", class: "Damage Dealer" },
  { name: "Moe", class: "Damage Dealer" },
  { name: "Lumi", class: "Damage Dealer" },
  { name: "Mina", class: "Damage Dealer" },
  { name: "Najia", class: "Damage Dealer" },
  { name: "Sirius", class: "Damage Dealer" }, // mancava dal roster (bug: appariva nelle tabelle Ranked di BrawlMetrics ma non qui); aggiunto il 6/9, classe confermata da BrawlMetrics e Brawlvision

  // Assassin
  { name: "Mortis", class: "Assassin" },
  { name: "Crow", class: "Assassin" },
  { name: "Leon", class: "Assassin" },
  { name: "Edgar", class: "Assassin" },
  { name: "Fang", class: "Assassin" },
  { name: "Buzz", class: "Assassin" },
  { name: "Stu", class: "Assassin" },
  { name: "Kenji", class: "Assassin" },
  { name: "Melodie", class: "Assassin" },
  { name: "Cordelius", class: "Assassin" },
  { name: "Sam", class: "Assassin" },
  { name: "Mico", class: "Assassin" },
  { name: "Lily", class: "Assassin" },
  { name: "Shade", class: "Assassin" },
  { name: "Kaze", class: "Assassin" },
  { name: "Gigi", class: "Assassin" },
  { name: "Alli", class: "Assassin" },
  { name: "Nori", class: "Assassin" },
  { name: "Starr Nova", class: "Assassin" },

  // Marksman
  { name: "Piper", class: "Marksman" },
  { name: "Brock", class: "Marksman" },
  { name: "Bea", class: "Marksman" },
  { name: "Belle", class: "Marksman" },
  { name: "Mandy", class: "Marksman" },
  { name: "Bonnie", class: "Marksman" },
  { name: "Nani", class: "Marksman" },
  { name: "Janet", class: "Marksman" },
  { name: "Maisie", class: "Marksman" },
  { name: "Pierce", class: "Marksman" },
  { name: "Angelo", class: "Marksman" }, // era già nei bestPicks di 2 mappe ma mancava dal roster: aggiunto il 6/9, confermato Marksman da due fonti indipendenti

  // Controller
  { name: "Gene", class: "Controller" },
  { name: "Sandy", class: "Controller" },
  { name: "Squeak", class: "Controller" },
  { name: "Emz", class: "Controller" },
  { name: "Willow", class: "Controller" },
  { name: "Jessie", class: "Controller" },
  { name: "Bo", class: "Controller" },
  { name: "Griff", class: "Controller" },
  { name: "Mr. P", class: "Controller" },
  { name: "Amber", class: "Controller" },
  { name: "Gale", class: "Controller" },
  { name: "Lou", class: "Controller" },
  { name: "Otis", class: "Controller" },
  { name: "Charlie", class: "Controller" },
  { name: "Meeple", class: "Controller" },
  { name: "Finx", class: "Controller" },
  { name: "Ziggy", class: "Controller" },
  { name: "Penny", class: "Controller" }, // classe cambiata nel tempo (era Damage Dealer/Artillery), verifica

  // Artillery
  { name: "Barley", class: "Artillery" },
  { name: "Dynamike", class: "Artillery" },
  { name: "Tick", class: "Artillery" },
  { name: "Larry & Lawrie", class: "Artillery" },
  { name: "Grom", class: "Artillery" },
  { name: "Sprout", class: "Artillery" },
  { name: "Juju", class: "Artillery" }, // corretto il 6/9: una ricerca lo classificava per errore come Controller; una fonte più specifica lo conferma Artillery ("il più forte artigliere, S tier #6 assoluto")

  // Support
  { name: "Poco", class: "Support" },
  { name: "Byron", class: "Support" },
  { name: "Pam", class: "Support" },
  { name: "Gus", class: "Support" },
  { name: "Max", class: "Support" },
  { name: "Berry", class: "Support" },
  { name: "Doug", class: "Support" },
  { name: "Kit", class: "Support" },
  { name: "Wendy", class: "Support" },
  { name: "Ruffs", class: "Support" },
  { name: "Gray", class: "Support" },
  { name: "Glowy", class: "Support" },
  { name: "Jae-Yong", class: "Support" },
];

// Matrice dei vantaggi di classe (euristica generale da game design,
// non un tier-list di meta): CLASS_MATCHUPS[A][B] = punteggio di A contro B.
//  +1 = A è favorito contro B, -1 = A è sfavorito, 0 = neutro.
// Coppie usate: Tank>Assassin, DamageDealer>Tank, DamageDealer>Assassin,
// Marksman>DamageDealer, Assassin>Marksman, Assassin>Support,
// Assassin>Artillery, Artillery>Marksman, Controller>Tank,
// Controller>DamageDealer, Artillery>Controller.
const CLASS_MATCHUPS = {
  "Tank": { "Tank": 0, "Damage Dealer": -1, "Assassin": 1, "Marksman": 0, "Controller": -1, "Artillery": 0, "Support": 0 },
  "Damage Dealer": { "Tank": 1, "Damage Dealer": 0, "Assassin": 1, "Marksman": -1, "Controller": -1, "Artillery": 0, "Support": 0 },
  "Assassin": { "Tank": -1, "Damage Dealer": -1, "Assassin": 0, "Marksman": 1, "Controller": 0, "Artillery": 1, "Support": 1 },
  "Marksman": { "Tank": 0, "Damage Dealer": 1, "Assassin": -1, "Marksman": 0, "Controller": 0, "Artillery": -1, "Support": 0 },
  "Controller": { "Tank": 1, "Damage Dealer": 1, "Assassin": 0, "Marksman": 0, "Controller": 0, "Artillery": -1, "Support": 0 },
  "Artillery": { "Tank": 0, "Damage Dealer": 0, "Assassin": -1, "Marksman": 1, "Controller": 1, "Artillery": 0, "Support": 0 },
  "Support": { "Tank": 0, "Damage Dealer": 0, "Assassin": -1, "Marksman": 0, "Controller": 0, "Artillery": 0, "Support": 0 },
};

const CLASS_COLORS = {
  "Tank": "#7c6b4f",
  "Damage Dealer": "#c0453a",
  "Assassin": "#8b3fa8",
  "Marksman": "#3f7fa8",
  "Controller": "#3fa87e",
  "Artillery": "#a87c3f",
  "Support": "#d4a72c",
};

// Modalità di Classificata (6, confermate da fonti web di settembre 2026:
// Gem Grab, Brawl Ball, Bounty, Heist, Hot Zone, Knockout). Le mappe
// ruotano ogni stagione (pool stagionale di 24-30 mappe) e non è stato
// possibile leggerne l'elenco aggiornato dai siti-database (rete bloccata
// in questa sessione). Per questo qui non c'è un elenco di mappe fisse:
// invece di inventare nomi di mappe che potrebbero non essere nella
// rotazione attuale, si usano le CARATTERISTICHE della mappa che hai
// davanti (vedi MAP_TRAITS) — funzionano indipendentemente da come si
// chiama la mappa e da quando cambia la rotazione.
//
const MODES = ["Gem Grab", "Brawl Ball", "Bounty", "Heist", "Hot Zone", "Knockout"];

// MODE_WIN_RATES[modalità][brawler] = win rate % REALE in quella modalità
// specifica, letto il 6 settembre 2026 direttamente dalle 6 tabelle
// per-modalità di brawlmetrics.gg (stessa fonte del meta generale, stesso
// giorno). Sostituisce la vecchia euristica "per classe" (Gem Grab premia
// i tank, ecc.): con un numero vero per ogni brawler non serve più
// indovinare per categoria, e i numeri mostrano perché la scorciatoia
// per classe era imprecisa — es. Rosa (Tank) è S+ 72% in Brawl Ball ma
// D 39% in Bounty; Edgar (Assassin) è S+ 54% in Heist ma D 35% in
// Knockout. Copertura: tutti i 106 brawler del roster, tutte e 6 le
// modalità (tabelle complete, non troncate).
//
// LIMITE onesto: questi numeri NON sono specifici di Classificata come
// DEFAULT_META_SCORES — la pagina di BrawlMetrics per modalità copre
// "tutti i livelli di trofei" in quella modalità, non solo il ranked. Non
// è stato possibile trovare un secondo sito con lo stesso spacchettamento
// per modalità per un riscontro incrociato numerico (brawlify/noff.gg/
// brawltime.ninja bloccano ancora il fetch diretto), quindi qui il
// riscontro è a fonte singola. Trattalo come "come si comporta questo
// brawler nelle meccaniche di questa modalità", non come "quanto vale in
// Classificata in questa modalità" — le due cose sono probabilmente
// vicine ma non è stato verificato quanto.
const MODE_WIN_RATES = {
  "Gem Grab": {
    "Wendy": 69.2, "Gus": 64.2, "Nori": 62.2, "Bolt": 65.3, "Shade": 65.5, "Starr Nova": 65.3,
    "Edgar": 53.3, "Amber": 63.8, "Bo": 59.6, "Trunk": 65.9, "Lola": 64.8, "El Primo": 54.7,
    "Mortis": 56.5, "Gigi": 63.4, "Lumi": 63.3, "Damian": 62.7, "Frank": 55.8, "Shelly": 52.2,
    "Jae-Yong": 63.7, "Colt": 52.0, "Doug": 61.6, "8-Bit": 51.7, "Pierce": 60.3, "Finx": 62.2,
    "Janet": 61.4, "Chester": 59.9, "Mina": 60.2, "Stu": 59.2, "Rico": 51.3, "Hank": 61.7,
    "Draco": 61.7, "Glowy": 60.8, "Poco": 51.4, "Meeple": 60.7, "Mandy": 57.3, "Rosa": 55.0,
    "Sirius": 58.2, "Alli": 58.9, "Moe": 59.7, "Kit": 57.3, "Bull": 52.1, "Chuck": 56.8,
    "Ruffs": 58.8, "Nita": 47.5, "Tara": 53.5, "Sprout": 58.1, "Jessie": 50.5, "Sam": 58.0,
    "Nani": 57.0, "Emz": 45.9, "Gray": 57.0, "Carl": 52.3, "Brock": 46.8, "Griff": 49.0,
    "R-T": 57.9, "Najia": 56.1, "Mico": 56.9, "Angelo": 56.5, "Kaze": 55.2, "Ziggy": 56.5,
    "Juju": 56.7, "Willow": 55.8, "Penny": 48.4, "Darryl": 48.4, "Surge": 47.3, "Spike": 46.1,
    "Barley": 44.2, "Crow": 42.8, "Fang": 44.4, "Bibi": 42.9, "Tick": 40.0, "Leon": 43.3,
    "Colette": 41.5, "Piper": 42.0, "Dynamike": 39.7, "Squeak": 39.6, "Max": 40.0, "Ash": 41.8,
    "Meg": 39.6, "Kenji": 39.8, "Pam": 39.2, "Larry & Lawrie": 39.9, "Jacky": 38.1, "Bea": 38.4,
    "Lou": 40.1, "Charlie": 39.6, "Byron": 36.9, "Buzz": 37.4, "Sandy": 36.1, "Clancy": 37.5,
    "Gale": 36.9, "Gene": 37.8, "Otis": 37.5, "Lily": 35.6, "Berry": 35.6, "Pearl": 34.0,
    "Belle": 33.5, "Maisie": 32.2, "Mr. P": 32.9, "Cordelius": 31.9, "Melodie": 30.7, "Eve": 29.8,
    "Ollie": 31.1, "Buster": 30.4, "Grom": 29.6, "Bonnie": 29.2,
  },
  "Brawl Ball": {
    "Rosa": 72.0, "Shade": 65.6, "Wendy": 68.2, "Gus": 67.4, "Amber": 67.8, "Bolt": 69.0,
    "Nori": 62.8, "Trunk": 67.5, "Starr Nova": 64.8, "Ash": 66.7, "Damian": 65.7, "Pearl": 65.2,
    "Gigi": 64.3, "Lumi": 63.3, "Bull": 58.1, "Doug": 63.1, "Lola": 64.0, "Sam": 63.5,
    "Larry & Lawrie": 63.3, "El Primo": 51.3, "Maisie": 62.1, "Meeple": 62.5, "Jae-Yong": 63.6,
    "Stu": 58.9, "R-T": 62.7, "Hank": 61.7, "Finx": 62.3, "Alli": 61.9, "Draco": 61.7,
    "Pam": 61.5, "Mico": 61.6, "Mortis": 52.4, "Pierce": 59.4, "Chester": 58.4, "Glowy": 60.8,
    "Buster": 60.9, "Lou": 59.9, "Mina": 57.6, "Tara": 58.0, "Gale": 58.9, "Ruffs": 60.2,
    "Sandy": 59.6, "Squeak": 59.3, "Poco": 53.8, "Willow": 59.8, "Moe": 59.4, "Melodie": 58.4,
    "Berry": 59.5, "Sprout": 59.4, "Ollie": 60.0, "Charlie": 59.9, "Kit": 58.3, "Sirius": 58.9,
    "Clancy": 58.0, "Otis": 57.9, "Mandy": 57.4, "Griff": 51.6, "Kaze": 57.4, "Chuck": 58.2,
    "Ziggy": 58.9, "Eve": 59.1, "Buzz": 55.6, "Bo": 55.2, "Gray": 57.6, "Janet": 58.6,
    "Cordelius": 56.4, "Bonnie": 58.2, "Nani": 57.5, "Najia": 58.0, "Max": 54.3, "Lily": 57.2,
    "Belle": 58.0, "Gene": 57.8, "Bea": 56.1, "Colette": 54.2, "Mr. P": 57.7, "Juju": 56.8,
    "Carl": 51.9, "Grom": 55.5, "Fang": 51.5, "Leon": 51.9, "Meg": 51.2, "Bibi": 46.1,
    "Frank": 46.6, "Colt": 43.5, "Angelo": 54.9, "Byron": 53.2, "Kenji": 48.8, "Spike": 48.7,
    "Barley": 48.4, "Shelly": 38.1, "Surge": 43.3, "Edgar": 35.2, "Jacky": 46.8, "Darryl": 45.7,
    "Brock": 41.9, "Penny": 47.3, "Emz": 41.4, "Piper": 47.1, "Rico": 36.5, "Dynamike": 40.8,
    "Tick": 44.2, "Crow": 43.0, "Nita": 36.2, "8-Bit": 40.2, "Jessie": 39.3,
  },
  "Bounty": {
    "Wendy": 68.1, "Gus": 59.6, "Piper": 49.8, "Nori": 58.7, "Bolt": 61.7, "Pierce": 59.0,
    "Amber": 63.3, "Bo": 62.4, "Brock": 50.6, "Mandy": 54.1, "Starr Nova": 59.4, "Najia": 58.7,
    "Sprout": 60.2, "Shade": 58.7, "Edgar": 48.5, "Nani": 54.5, "Colt": 48.6, "Mortis": 52.1,
    "Mina": 56.5, "Jae-Yong": 60.1, "8-Bit": 51.0, "Glowy": 59.2, "Trunk": 59.7, "Lola": 58.4,
    "Gray": 55.4, "Angelo": 55.1, "Meeple": 56.8, "Gigi": 56.9, "Janet": 57.3, "Damian": 58.3,
    "Byron": 47.0, "Emz": 50.0, "Juju": 57.1, "Chester": 54.8, "Stu": 53.6, "Carl": 51.6,
    "R-T": 55.9, "Rico": 46.9, "Alli": 54.6, "Sam": 55.9, "Lumi": 55.2, "Finx": 55.3,
    "El Primo": 49.7, "Doug": 54.9, "Kaze": 52.7, "Sirius": 53.6, "Kit": 51.4, "Moe": 54.3,
    "Ruffs": 53.8, "Frank": 48.6, "Chuck": 51.9, "Bea": 45.3, "Max": 46.7, "Ziggy": 52.7,
    "Mico": 52.1, "Penny": 48.3, "Jessie": 47.3, "Belle": 45.2, "Hank": 51.9, "Leon": 44.9,
    "Tick": 42.8, "Spike": 45.6, "Fang": 45.3, "Willow": 50.7, "Draco": 50.8, "Nita": 45.6,
    "Gene": 45.7, "Bibi": 46.2, "Griff": 43.6, "Colette": 43.5, "Maisie": 46.1, "Poco": 42.9,
    "Crow": 42.4, "Dynamike": 41.8, "Shelly": 42.0, "Squeak": 42.5, "Pearl": 43.6, "Eve": 44.8,
    "Meg": 42.6, "Bull": 41.7, "Grom": 40.8, "Surge": 40.0, "Darryl": 39.5, "Tara": 38.8,
    "Rosa": 39.1, "Kenji": 37.9, "Bonnie": 37.8, "Barley": 36.0, "Mr. P": 37.3, "Lily": 36.4,
    "Buzz": 35.1, "Charlie": 36.1, "Sandy": 35.2, "Larry & Lawrie": 34.1, "Gale": 33.7,
    "Melodie": 33.1, "Pam": 33.7, "Lou": 33.1, "Jacky": 32.7, "Berry": 32.9, "Otis": 31.1,
    "Cordelius": 31.9, "Ash": 31.5, "Buster": 31.5, "Clancy": 30.9, "Ollie": 19.8,
  },
  "Heist": {
    "Nori": 66.1, "Edgar": 54.3, "Shade": 63.8, "Nita": 54.6, "8-Bit": 53.3, "Chuck": 55.9,
    "Bo": 62.9, "Amber": 60.4, "Colt": 50.1, "Trunk": 65.8, "Jessie": 49.6, "El Primo": 54.0,
    "Kaze": 59.4, "Gigi": 62.6, "Mico": 57.5, "Starr Nova": 61.5, "Gus": 61.1, "Mandy": 57.0,
    "Doug": 62.2, "Lola": 61.3, "Emz": 51.5, "Lumi": 60.5, "Bolt": 59.9, "Stu": 60.6,
    "Mortis": 58.7, "Griff": 51.2, "Wendy": 60.3, "Frank": 50.5, "Rico": 47.3, "Sam": 60.2,
    "Sirius": 57.6, "Bibi": 51.7, "Glowy": 58.7, "Nani": 56.7, "Sprout": 58.0, "Bull": 47.5,
    "Brock": 44.4, "R-T": 58.2, "Juju": 58.7, "Penny": 49.0, "Hank": 57.7, "Chester": 56.4,
    "Pierce": 57.0, "Meeple": 58.2, "Barley": 48.2, "Finx": 58.3, "Damian": 57.5, "Draco": 56.9,
    "Kit": 55.6, "Colette": 46.9, "Janet": 57.0, "Dynamike": 44.5, "Melodie": 46.8, "Angelo": 55.2,
    "Carl": 47.6, "Ruffs": 55.5, "Jae-Yong": 56.0, "Ziggy": 54.5, "Shelly": 43.9, "Gray": 54.7,
    "Willow": 53.0, "Rosa": 48.3, "Najia": 53.2, "Alli": 53.3, "Mina": 51.6, "Berry": 43.6,
    "Moe": 51.2, "Darryl": 44.3, "Poco": 43.7, "Tara": 45.6, "Jacky": 44.4, "Larry & Lawrie": 43.5,
    "Squeak": 42.1, "Spike": 40.2, "Crow": 37.6, "Pam": 42.8, "Pearl": 41.4, "Maisie": 41.4,
    "Buzz": 39.4, "Piper": 38.5, "Surge": 38.6, "Kenji": 38.2, "Leon": 36.0, "Tick": 34.4,
    "Lily": 38.4, "Max": 36.6, "Meg": 33.6, "Gale": 33.6, "Ash": 33.6, "Bea": 31.2,
    "Cordelius": 29.9, "Grom": 31.2, "Clancy": 30.0, "Fang": 28.9, "Eve": 30.2, "Byron": 28.5,
    "Charlie": 26.9, "Otis": 25.3, "Bonnie": 25.8, "Lou": 25.9, "Belle": 25.4, "Buster": 25.4,
    "Mr. P": 24.2, "Sandy": 23.8, "Gene": 23.3, "Ollie": 15.5,
  },
  "Hot Zone": {
    "Wendy": 68.5, "Nori": 62.9, "Shade": 62.8, "Gus": 63.8, "Amber": 62.9, "Edgar": 52.7,
    "Bo": 59.9, "Trunk": 66.1, "Starr Nova": 64.2, "El Primo": 53.1, "Doug": 62.9, "Emz": 51.6,
    "Chuck": 58.4, "Damian": 63.1, "Hank": 61.8, "Tick": 45.9, "Poco": 48.7, "Sirius": 60.1,
    "Mortis": 55.8, "Nita": 50.7, "Lola": 61.4, "Gigi": 60.8, "Bolt": 60.1, "Frank": 50.2,
    "Griff": 50.3, "8-Bit": 49.1, "Finx": 60.9, "R-T": 61.0, "Draco": 60.4, "Juju": 59.2,
    "Chester": 58.6, "Jessie": 48.6, "Shelly": 49.2, "Colt": 49.2, "Mandy": 57.7, "Bibi": 49.2,
    "Lumi": 58.3, "Sprout": 59.2, "Jae-Yong": 60.9, "Pierce": 57.1, "Mina": 57.3, "Stu": 56.2,
    "Rico": 48.4, "Meeple": 57.4, "Kaze": 56.8, "Bull": 50.5, "Barley": 46.7, "Sam": 58.2,
    "Glowy": 56.8, "Kit": 55.1, "Nani": 56.3, "Ruffs": 58.0, "Brock": 46.2, "Willow": 55.6,
    "Kenji": 48.1, "Tara": 51.1, "Ziggy": 55.6, "Gray": 55.2, "Dynamike": 43.7, "Janet": 56.2,
    "Najia": 55.7, "Rosa": 49.2, "Alli": 55.3, "Pam": 50.5, "Larry & Lawrie": 49.8, "Meg": 47.3,
    "Moe": 54.5, "Mico": 52.6, "Penny": 43.1, "Colette": 46.0, "Surge": 43.7, "Angelo": 53.1,
    "Spike": 43.3, "Berry": 41.7, "Buzz": 46.8, "Carl": 42.0, "Squeak": 40.5, "Lou": 43.4,
    "Fang": 41.8, "Crow": 37.8, "Gale": 40.4, "Darryl": 37.1, "Jacky": 36.3, "Pearl": 40.5,
    "Leon": 38.3, "Melodie": 39.9, "Ash": 37.4, "Maisie": 38.3, "Sandy": 36.2, "Max": 36.5,
    "Piper": 35.4, "Cordelius": 34.5, "Grom": 34.2, "Clancy": 31.7, "Lily": 32.2, "Bea": 30.5,
    "Belle": 32.6, "Byron": 29.9, "Otis": 31.4, "Bonnie": 30.0, "Buster": 28.1, "Eve": 28.2,
    "Mr. P": 27.2, "Ollie": 27.1, "Charlie": 25.5, "Gene": 20.6,
  },
  "Knockout": {
    "Wendy": 69.6, "Gus": 63.3, "Nori": 61.0, "Pearl": 65.2, "Shade": 63.5, "Bo": 62.9,
    "Pierce": 62.0, "Starr Nova": 62.4, "Amber": 62.5, "Meeple": 62.6, "Mortis": 59.8,
    "Mandy": 58.5, "Bolt": 62.4, "Lola": 62.3, "Trunk": 62.8, "Chester": 61.2, "Maisie": 61.5,
    "Gigi": 61.7, "Griff": 59.3, "Tara": 60.2, "Najia": 60.3, "Jae-Yong": 62.1, "Gray": 59.4,
    "Stu": 59.7, "Sprout": 60.5, "Finx": 61.1, "Mina": 59.8, "Ash": 61.4, "Squeak": 58.4,
    "Doug": 60.9, "Gale": 60.6, "Bull": 59.1, "Glowy": 60.8, "Lumi": 60.8, "Larry & Lawrie": 60.4,
    "Nani": 58.4, "Sandy": 60.3, "Damian": 60.6, "Otis": 60.0, "Janet": 59.9, "Draco": 60.5,
    "Kit": 57.5, "Ruffs": 59.7, "Alli": 59.4, "Buzz": 58.7, "Bonnie": 58.8, "Gene": 58.2,
    "Charlie": 58.7, "Cordelius": 58.5, "Berry": 58.8, "Lou": 58.4, "Moe": 58.5, "R-T": 58.5,
    "Mico": 57.9, "Surge": 55.8, "Angelo": 56.9, "Rosa": 56.8, "Bibi": 55.3, "Hank": 57.9,
    "Fang": 55.7, "Melodie": 57.5, "Belle": 55.8, "Sirius": 57.4, "Sam": 57.6, "Colette": 54.1,
    "Buster": 57.6, "Mr. P": 57.1, "Kenji": 55.3, "Lily": 55.8, "Max": 54.1, "Ziggy": 56.9,
    "Willow": 56.6, "Pam": 56.2, "Eve": 56.7, "Kaze": 55.4, "Spike": 51.8, "Frank": 51.7,
    "Bea": 52.3, "Ollie": 55.5, "Grom": 54.0, "Juju": 54.9, "Tick": 51.3, "Chuck": 54.2,
    "Piper": 43.2, "Meg": 51.1, "Penny": 51.0, "Clancy": 53.7, "Leon": 47.9, "Poco": 49.3,
    "Dynamike": 48.3, "Darryl": 49.2, "Carl": 48.1, "Byron": 46.7, "Barley": 49.1, "Edgar": 36.4,
    "Jessie": 45.6, "Emz": 41.9, "Nita": 43.8, "Colt": 37.1, "Brock": 35.9, "Crow": 41.9,
    "Jacky": 44.5, "8-Bit": 37.9, "Rico": 36.0, "Shelly": 38.1, "El Primo": 37.8,
  },
};

// Caratteristiche della mappa: selezionabili a mano guardando la mappa
// caricata in game. MAP_TRAIT_CLASS_BONUS[caratteristica][classe] = bonus.
const MAP_TRAITS = [
  "Boscaglia fitta",
  "Corridoi stretti",
  "Ampia e aperta",
  "Muri distruttibili ovunque",
  "Zona centrale ristretta",
];

const MAP_TRAIT_CLASS_BONUS = {
  "Boscaglia fitta": { "Tank": 0, "Damage Dealer": 0, "Assassin": 1, "Marksman": -1, "Controller": 0, "Artillery": 0, "Support": 0 },
  "Corridoi stretti": { "Tank": 1, "Damage Dealer": 0, "Assassin": 0, "Marksman": -1, "Controller": 0, "Artillery": 1, "Support": 0 },
  "Ampia e aperta": { "Tank": 0, "Damage Dealer": 0, "Assassin": -1, "Marksman": 1, "Controller": 0, "Artillery": -1, "Support": 0 },
  "Muri distruttibili ovunque": { "Tank": 0, "Damage Dealer": 1, "Assassin": 0, "Marksman": 0, "Controller": 0, "Artillery": 1, "Support": 0 },
  "Zona centrale ristretta": { "Tank": 1, "Damage Dealer": 0, "Assassin": 0, "Marksman": 0, "Controller": 1, "Artillery": 0, "Support": 0 },
};

// Mappe: il 6 settembre 2026 l'utente ha condiviso screenshot del draft
// tool di metapick-ai.com (Rank Threshold Master I+, Last Updated 28 Aug
// 2026) che mostrano il vero pool Classificata stagionale completo: 30
// mappe su 6 modalità (Bounty 4, Brawl Ball 7, Gem Grab 5, Heist 6, Hot
// Zone 4, Knockout 4 — combacia con "Season 48, 30 mappe totali" trovato
// in una ricerca precedente). Quell'elenco è la fonte di verità per QUALI
// mappe esistono ora; ha sostituito la lista parziale/best-effort di
// prima (che includeva Snake Prairie e Crystal Arcade, non presenti nel
// pool attuale — probabilmente mappe di una stagione o di un pool
// competitivo/BSC diverso, quindi rimosse).
//
// bestPicks/notes per ciascuna mappa restano raccolti da ricerche web del
// 6 settembre 2026 (Brawlify, Brawl Time Ninja, TrophyCoach, TopBrawl,
// TheriaGames, Brawlio, BrawlIQ — pagine non apribili direttamente in
// questa sessione, rete bloccata: dati presi dagli estratti di ricerca).
// Sono nomi citati esplicitamente dalle fonti come forti su quella mappa,
// non un tier-list completo con percentuali esatte: quelle richiedono un
// accesso live a un sito come Brawlify che questa sessione non ha. Un
// paio di fonti citavano anche un brawler "Sirius" non presente nel
// roster qui sopra (non risulta un brawler noto): omesso dai bestPicks
// finché non è verificato.
const MAPS = [
  // Bounty (4)
  {
    mode: "Bounty",
    name: "Dry Season",
    bestPicks: ["Piper", "Brock", "Bea", "Mandy", "Byron", "Poco", "Pam", "Doug", "Berry", "Ruffs"],
    notes: "Zone aperte con muri indistruttibili al centro. Tieni la retroguardia con i tiratori a lungo raggio, fai poke sicuro e non buttare via le stelle.",
  },
  {
    mode: "Bounty",
    name: "Hideout",
    bestPicks: ["Piper", "Brock", "Max", "Byron", "Gene", "Darryl", "Bibi", "Chuck", "Amber", "Barley", "Larry & Lawrie", "Dynamike", "Juju", "Berry"],
    notes: "Simmetria diagonale, due gruppi di staccionate con erba. Cecchini bene sui lati aperti, throwers bene nel centro stretto. La stella blu centrale è decisiva come spareggio.",
  },
  {
    mode: "Bounty",
    name: "Layer Cake",
    bestPicks: ["El Primo", "Bull", "Leon", "Shelly"],
    notes: "Mappa a strati di muri, cespugli e chokepoint: gli assassini corrono per la stella blu, i throwers protetti bloccano i passaggi, gli anti-aggro decidono l'ultimo pick.",
  },
  {
    mode: "Bounty",
    name: "Shooting Star",
    bestPicks: ["Piper", "Brock", "8-Bit", "Nani"],
    notes: "Mappa aperta con lunghe linee di tiro: i cecchini dominano.",
  },

  // Brawl Ball (7 — modalità in evidenza questa stagione)
  {
    mode: "Brawl Ball",
    name: "Beach Ball",
    bestPicks: ["Nita", "Frank", "Carl", "El Primo", "Pam", "Emz", "Sprout"],
    notes: "Muri stretti e lunghi più grandi gruppi di cespugli, simmetria diagonale. Pesanti a sinistra, mischia al centro, cecchini/support a destra.",
  },
  {
    mode: "Brawl Ball",
    name: "Center Stage",
    bestPicks: ["Charlie", "Max", "Cordelius", "Sandy", "Melodie", "Colt", "Brock", "El Primo", "Rosa", "Dynamike", "Piper", "Frank", "Nita", "Shelly"],
    notes: "Simmetrica, copertura moderata: la mappa \"di skill\" per eccellenza. Sfonda i muri davanti al goal con Colt/Brock/Shelly; Rosa domina i cespugli laterali.",
  },
  {
    mode: "Brawl Ball",
    name: "Pinball Dreams",
    bestPicks: ["Frank", "El Primo", "Mortis", "Max", "Buzz", "Cordelius", "Rico"],
    notes: "Vinci prima il centrocampo, poi rompi i muri per aprire linee di tiro. Tieni sempre un brawler dietro per il contrattacco.",
  },
  {
    mode: "Brawl Ball",
    name: "Pinhole Punt",
    bestPicks: ["Colette", "Surge", "Edgar", "Mortis", "Lumi", "Eve", "Pam", "Angelo", "Penny", "Hank", "Bea"],
    notes: "Mix di corridoi stretti, corsie aperte e chokepoint chiave. Mortis sfrutta cespugli e spazi stretti (Coiled Snake per entrare/uscire dai combattimenti).",
  },
  {
    mode: "Brawl Ball",
    name: "Sneaky Fields",
    bestPicks: [],
    notes: "Caos pieno di cespugli: qui Assassin e brawler da imboscata dominano (nessun nome specifico confermato dalle fonti).",
  },
  {
    mode: "Brawl Ball",
    name: "Spiraling Out",
    bestPicks: ["Colette", "Colt", "Edgar", "Mortis", "Lumi", "Gray", "Grom", "Ziggy", "Gus", "Moe"],
    notes: "Nessuna nota di layout specifica trovata nelle fonti (solo dati di win rate aggregati).",
  },
  {
    mode: "Brawl Ball",
    name: "Triple Dribble",
    bestPicks: ["Rico", "Bibi", "Mortis", "Emz", "Byron", "Colette", "Grom", "Charlie", "Rosa", "Bull", "Frank", "El Primo", "Barley", "Meg", "Max"],
    notes: "Barriere centrali, gruppi di casse e apertura del goal stretta. Bull/Frank/El Primo sfondano gli ostacoli con la Super puntando ai tre barili davanti al goal; Barley tiene bene le corsie medio/corte.",
  },

  // Gem Grab (5)
  {
    mode: "Gem Grab",
    name: "Double Swoosh",
    bestPicks: ["El Primo", "Bull", "Shelly", "Darryl", "Leon", "Gene", "Bo", "Sandy", "Poco", "Emz", "Max"],
    notes: "Molti cespugli su entrambi i lati, vortice al centro, simmetria perfetta. Bene i tank con DPS alto nei cespugli; gli area-controller (Sandy, Poco) dominano le corsie larghe. Il portatore di gemme ha bisogno di mobilità (Max).",
  },
  {
    mode: "Gem Grab",
    name: "Gem Fort",
    bestPicks: ["Griff", "Crow", "Rico", "Meg", "Max", "Ziggy", "Draco", "Najia", "Larry & Lawrie", "Darryl", "Amber"],
    notes: "Centro chiuso da muri ad angolo retto con 4 ingressi, due vicini a corsie cespugliose. Amber con altri due a lungo raggio brucia tutti i cespugli con la Super.",
  },
  {
    mode: "Gem Grab",
    name: "Hard Rock Mine",
    bestPicks: ["Rico", "Surge", "Stu", "Mortis", "Griff", "Trunk", "Jacky", "Sam", "Dynamike", "Mico"],
    notes: "Centro aperto con due strisce di boscaglia a \"H\" ai lati. I Controller tengono gli avversari inchiodati vicino al loro spawn; tank e mischia si infiltrano dai lati.",
  },
  {
    mode: "Gem Grab",
    name: "Rustic Arcade",
    bestPicks: ["Belle", "Sandy", "Byron", "Max", "Stu", "Pierce", "Crow", "Piper", "Sprout", "Darryl", "Ash", "Barley", "Janet", "Pam", "Emz", "Frank", "Poco"],
    notes: "Centro esagonale con muri verso il centro e cespugli sul lato opposto. L'artiglieria e i tank a corto raggio soffrono lo spazio aperto; gli high-spread a medio raggio (Pam, Emz, Frank, Poco) controllano bene il centro.",
  },
  {
    mode: "Gem Grab",
    name: "Undermine",
    bestPicks: ["Emz", "Barley", "Bo"],
    notes: "Favorisce chi tira da lunga distanza (throwers/artiglieria).",
  },

  // Heist (6)
  {
    mode: "Heist",
    name: "Bridge Too Far",
    bestPicks: ["Colt", "Piper", "Nani", "Mandy", "8-Bit", "Moe", "Ziggy", "Doug", "Gene", "Lumi", "Brock", "Belle", "Maisie", "Bea", "Rico", "Bull", "Darryl", "Edgar", "Carl"],
    notes: "Terreno limitato, poca mobilità: i marksman (Brock, Piper, Belle, Mandy, Nani, Maisie, Bea) sparano lungo le corsie senza dover cambiare posizione.",
  },
  {
    mode: "Heist",
    name: "Hot Potato",
    bestPicks: ["Jessie", "Bull", "El Primo", "Rosa", "Darryl", "Penny", "Chuck"],
    notes: "Striscia diagonale di cespugli al centro. Jessie piazza la torretta nei cespugli centrali; i tank si nascondono appena dietro; Penny piazza il lanciatore nei gruppetti di cespugli intorno al centro.",
  },
  {
    mode: "Heist",
    name: "Kaboom Canyon",
    bestPicks: ["Alli", "Colt", "Bull", "Darryl", "Edgar", "Carl", "Bo", "El Primo"],
    notes: "Mappa molto aperta, simmetria diagonale: ottima per cecchini a medio/lungo raggio. I tank controllano il centro e i chokepoint.",
  },
  {
    mode: "Heist",
    name: "Pit Stop",
    bestPicks: ["Nori", "Dynamike", "Rico", "Melodie", "Griff", "Grom", "Barley", "Colt", "8-Bit"],
    notes: "Piena di cespugli con muri a bordo e recinzioni a L negli angoli; ogni cassaforte è protetta da un lungo muro orizzontale con cespugli. Premia la pressione disciplinata sulle corsie più della semplice aggressività.",
  },
  {
    mode: "Heist",
    name: "Safe Zone",
    bestPicks: ["Colt", "Pierce", "Colette", "Penny", "Crow", "Mortis", "Squeak", "Nori", "Sam", "Gus", "El Primo", "Shelly", "Rosa", "Darryl", "Frank", "Fang", "Bull", "Doug", "Bibi", "Buzz"],
    notes: "Tre corsie ben definite; favorisce i tiratori a lungo raggio perché le casseforti sono poco protette dai proiettili che viaggiano lontano.",
  },
  {
    mode: "Heist",
    name: "Safe(r) Zone",
    bestPicks: [],
    notes: "Variante di Safe Zone: stessi principi (corsie lunghe, casseforti poco protette). Nessun dato specifico separato trovato dalle fonti.",
  },

  // Hot Zone (4)
  {
    mode: "Hot Zone",
    name: "Dueling Beetles",
    bestPicks: ["Bolt", "Tick", "Nita", "Starr Nova", "Bo", "Squeak", "Grom", "Spike", "Griff", "Tara"],
    notes: "Poco spazio per chi tira da lunghissima gittata: dominano i brawler ad area (AoE) e a medio raggio. Cespugli a sinistra, muri a destra.",
  },
  {
    mode: "Hot Zone",
    name: "Open Business",
    bestPicks: ["Hank", "Tick", "Griff", "Stu", "Meeple", "Meg", "Emz", "Charlie", "Angelo", "Jae-Yong", "R-T", "Ollie", "Barley", "Sprout", "Dynamike", "Grom", "Larry & Lawrie", "Edgar", "Mico", "Buzz", "Kenji", "Alli"],
    notes: "I throwers fanno negazione d'area da dietro i muri; gli assassini che bucano i throwers (Edgar, Mico, Buzz, Kenji, Alli) sono un buon contropick a chi difende la zona da lontano.",
  },
  {
    mode: "Hot Zone",
    name: "Parallel Plays",
    bestPicks: ["Pam", "8-Bit", "Max", "Bibi", "Piper", "Brock", "Sprout"],
    notes: "Due zone e centro aperto, poche mura: due giocatori spingono la zona nemica mentre uno tiene quella di casa. Poche mura, quindi conviene allargarsi per il controllo.",
  },
  {
    mode: "Hot Zone",
    name: "Ring of Fire",
    bestPicks: ["Bolt", "Pierce", "Meg", "Max", "Griff", "Crow", "El Primo", "Janet", "Bonnie", "Rosa", "Kaze", "Emz", "Sandy", "Jessie", "Gene", "Pam", "Bo", "Tara"],
    notes: "Corsia destra buona per i lunga gittata ma esposta alle imboscate; i pesanti hanno poca protezione. Tenere la zona con controllo/sustain batte cercare lo scontro diretto.",
  },

  // Knockout (4)
  {
    mode: "Knockout",
    name: "Belle's Rock",
    bestPicks: [],
    notes: "Corsie laterali speculari con muri a L: buona per throwers (usano la copertura), cecchini (linee di tiro) e brawler mobili (superano i lenti). Nessun nome specifico confermato dalle fonti.",
  },
  {
    mode: "Knockout",
    name: "Flaring Phoenix",
    bestPicks: ["Rosa", "Brock", "Colt", "Poco", "Frank"],
    notes: "Acqua a scacchiera su ogni lato, cespugli e muri a strati: corsie strette che favoriscono i cecchini che sanno rompere cover.",
  },
  {
    mode: "Knockout",
    name: "New Horizons",
    bestPicks: ["Brock", "Byron", "Max", "Kit", "Piper", "Rosa", "Poco", "Finx", "Grom", "Bonnie", "Bolt", "Ollie", "Edgar", "Colette", "Damian"],
    notes: "Niente respawn: la densità di cespugli/coperture conta più che in quasi ogni altra modalità. Un primo scontro sbagliato può perdere il round da solo.",
  },
  {
    mode: "Knockout",
    name: "Out in the Open",
    bestPicks: ["Wendy", "Piper", "Brock", "Mandy", "Gene", "Byron", "Emz", "Lou"],
    notes: "Linee di tiro lunghe: tieni il controllo dei cespugli e dei chokepoint, gioca paziente e commercia da lontano.",
  },
];

// Base di partenza automatica per i "Dati meta": win rate REALI su
// Classificata, presi il 6 settembre 2026 direttamente (fetch, non
// estratti di ricerca) da BrawlMetrics, l'unico sito fra quelli provati
// che pubblica una tabella completa specifica per Ranked con win rate e
// use rate per singolo brawler (non una media di tutte le modalità
// trofei, che è un dato diverso: vedi nota sotto). Incrociato con un
// secondo sito indipendente, Dexerto (tier list separata, senza numeri),
// che concorda sulla stessa cinquina S: Wendy, Shade, Gus, Amber, Nori —
// sono quindi i 5 pick più sicuri in assoluto, confermati da due fonti
// che non condividono la stessa pipeline di dati.
// brawlify.com, noff.gg e brawltime.ninja bloccano il fetch diretto
// (403) anche oggi: i loro numeri, quando citati da terzi (es. Wendy
// "69%" o "76.5%" su brawlmetrics/brawltime.ninja secondo timesaver.gg),
// NON tornano con quello letto qui direttamente dalla fonte (58.3%) —
// probabile pagina/versione diversa. Per questo si usa solo il numero
// letto di persona dalla tabella, non le citazioni di terzi.
//
// ATTENZIONE ALLA DIFFERENZA LADDER vs COMPETITIVO (il motivo per cui ci
// sono DUE tabelle sotto): un brawler come El Primo è S tier con 54.1%
// a Masters ma va molto peggio nella fascia bassa (serve coordinazione
// di squadra per brillare); Edgar è il più usato ma vince solo ~49-52%
// delle partite in ladder pur essendo un pick da competitivo. La
// "verità" cambia con lo scaglione di rank, quindi non ce n'è una sola:
//
//  - DEFAULT_META_SCORES: Ranked aggregato Bronze→Pro (bracket ampio,
//    fonte: brawlmetrics.gg/tier-list/ranked). Usalo come default per la
//    maggior parte delle partite.
//  - DEFAULT_META_SCORES_MASTERS: solo bracket Masters (fonte:
//    brawlmetrics.gg/tier-list/ranked/masters). Più realistico se giochi
//    ai ranghi alti / con squadra coordinata. Selezionabile dal menu
//    "Fascia dati meta" nell'app; manca a 5 brawler con troppo pochi dati
//    a quel livello per un numero affidabile (Larry & Lawrie, Grom, Sam,
//    Pam, Mr. P — lasciati neutri quando questa fascia è selezionata).
//
// Copre 106 dei 106 brawler del roster (mancano solo Vince e Cosmo, non
// ancora nel roster — vedi nota in cima al file). Nessun numero stimato o
// inventato: sono i valori esatti letti nella tabella.
const DEFAULT_META_SCORES = {
  "Amber": 57.6, "Shade": 57.4, "Wendy": 58.3, "Gus": 53.9, "Nori": 51.5,
  "Edgar": 52.6, "Brock": 50.5, "El Primo": 54.1, "Griff": 49.4, "Rico": 50.3,
  "Emz": 52.0, "Kaze": 52.1, "Bo": 53.9, "Bibi": 54.4, "Surge": 49.3,
  "Trunk": 53.4, "8-Bit": 51.1, "Stu": 49.5, "Ash": 53.6, "Jessie": 52.9,
  "Pearl": 51.0, "Piper": 48.9, "Bull": 51.3, "Max": 47.4, "Mortis": 49.3,
  "Doug": 54.0, "Colt": 47.6, "Nita": 52.3, "Colette": 48.7, "Carl": 49.2,
  "Gray": 49.7, "Willow": 48.7, "Bolt": 51.3, "Sprout": 51.8, "Tick": 49.9,
  "Meeple": 46.9, "Frank": 50.6, "Starr Nova": 48.9, "Pierce": 45.9, "Mina": 48.3,
  "Mico": 50.1, "Leon": 48.7, "Chester": 48.5, "Otis": 47.4, "Sirius": 49.9,
  "Melodie": 49.9, "Angelo": 49.8, "Spike": 47.6, "Mandy": 47.7, "Najia": 49.2,
  "Meg": 45.9, "Damian": 49.2, "Penny": 47.5, "R-T": 50.4, "Gene": 46.3,
  "Fang": 47.3, "Maisie": 48.9, "Buster": 50.1, "Shelly": 47.6, "Byron": 44.7,
  "Kenji": 47.7, "Buzz": 46.9, "Jacky": 49.6, "Nani": 46.9, "Mr. P": 49.5,
  "Juju": 49.4, "Crow": 44.7, "Eve": 49.0, "Cordelius": 46.7, "Poco": 46.2,
  "Dynamike": 46.0, "Grom": 47.8, "Janet": 49.1, "Ruffs": 45.5, "Finx": 48.8,
  "Lily": 46.7, "Lou": 45.5, "Lumi": 43.8, "Hank": 47.8, "Gigi": 46.1,
  "Moe": 46.7, "Gale": 45.9, "Clancy": 46.2, "Larry & Lawrie": 47.3, "Alli": 46.1,
  "Glowy": 47.3, "Draco": 47.2, "Belle": 44.4, "Barley": 45.1, "Chuck": 43.1,
  "Rosa": 45.8, "Tara": 43.1, "Ollie": 46.7, "Sam": 46.8, "Lola": 45.6,
  "Bea": 44.2, "Squeak": 43.2, "Kit": 43.5, "Charlie": 44.4, "Jae-Yong": 45.6,
  "Darryl": 43.8, "Sandy": 44.2, "Ziggy": 45.0, "Bonnie": 43.1, "Pam": 38.9,
  "Berry": 29.2,
};

// Vedi nota sopra: stessa fonte (BrawlMetrics), solo bracket Masters.
// Assenti = campione troppo piccolo a quel livello secondo la fonte
// stessa (mostrati "Unranked" nella tabella originale), non un dato
// mancante per negligenza.
const DEFAULT_META_SCORES_MASTERS = {
  "Shade": 59.5, "Amber": 57.6, "Wendy": 59.5, "Gus": 53.5, "El Primo": 53.2,
  "Rico": 51.3, "Ash": 54.7, "Emz": 52.7, "Brock": 51.4, "Colette": 51.7,
  "Stu": 50.6, "Nita": 57.1, "Max": 48.2, "8-Bit": 53.3, "Kaze": 51.5,
  "Sirius": 54.1, "Mortis": 51.2, "Sprout": 53.9, "Piper": 50.3, "Griff": 48.0,
  "Meg": 49.8, "Melodie": 52.8, "Tara": 54.5, "Nori": 48.3, "Pierce": 48.3,
  "Pearl": 51.4, "Mina": 49.0, "Surge": 50.1, "Gene": 49.6, "Bull": 52.0,
  "Edgar": 49.1, "Gray": 49.5, "Bibi": 52.3, "Lou": 50.4, "Colt": 48.8,
  "Buster": 52.6, "Angelo": 50.6, "Starr Nova": 50.2, "Maisie": 50.2, "Lumi": 47.3,
  "Najia": 50.6, "Charlie": 50.5, "Penny": 50.1, "Buzz": 48.1, "Barley": 50.0,
  "Carl": 49.1, "Moe": 49.6, "Shelly": 49.8, "Bolt": 48.9, "Eve": 50.5,
  "Meeple": 45.6, "Nani": 48.8, "Kenji": 49.1, "Byron": 46.5, "Janet": 50.0,
  "Cordelius": 48.5, "Spike": 49.6, "Ruffs": 46.9, "Leon": 49.2, "Glowy": 48.8,
  "Otis": 47.0, "Willow": 46.7, "Ziggy": 49.1, "Poco": 45.4, "Bo": 47.7,
  "Doug": 48.1, "Finx": 47.7, "Frank": 47.0, "Damian": 46.9, "Juju": 48.1,
  "Fang": 46.6, "Lily": 47.4, "Mandy": 46.8, "Alli": 46.4, "Chester": 46.6,
  "Gigi": 45.7, "Crow": 45.8, "Rosa": 47.3, "Trunk": 45.1, "Chuck": 43.4,
  "Darryl": 46.5, "Belle": 45.3, "Bea": 45.8, "Gale": 45.6, "R-T": 46.2,
  "Lola": 45.5, "Ollie": 46.1, "Jacky": 45.8, "Jae-Yong": 44.9, "Hank": 45.5,
  "Berry": 45.2, "Bonnie": 45.2, "Mico": 42.1, "Clancy": 42.5, "Kit": 39.8,
  "Sandy": 41.6, "Squeak": 41.0, "Dynamike": 39.3, "Draco": 39.0, "Tick": 36.6,
  "Jessie": 35.5,
};

const META_SOURCE_LABELS = {
  ALL_RANKS: "Ranked, tutti i ranghi (Bronze→Pro) — brawlmetrics.gg, 6/9/2026",
  MASTERS: "Ranked, solo Masters — brawlmetrics.gg, 6/9/2026",
};
