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
  { name: "Vince", class: "Assassin" }, // aggiunto il 6/9: l'API pubblica di Brawlify lo dà released:true e BrawlMetrics lo elenca, mentre articoli di agosto lo davano per ottobre. Vince il dato di gioco sulla previsione. Classe da Brawlvision, ancora a fonte singola. Nessuna statistica: troppo recente.

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
  { name: "Sirius", class: "Controller" },
  { name: "Cosmo", class: "Controller" }, // aggiunto il 6/9: released:true sull'API di Brawlify. Classe Controller confermata dalla descrizione ufficiale ("magnetic field that makes projectiles home in"). Nessuna statistica: troppo recente. // aggiunto il 6/9; classe CORRETTA lo stesso giorno: era Damage Dealer (fonte Brawlvision), ma BrawlMetrics (pagina brawler + pagine mappa) e una ricerca indipendente lo danno Controller. Vince la maggioranza.
  { name: "Penny", class: "Artillery" }, // CORRETTO il 6/9: era segnata Controller. Tre fonti indipendenti (BrawlMetrics, Pocket Tactics, Brawlvision) la danno Artillery.

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

// MAPPE — riscritte il 6/9/2026 con win rate REALI per singola mappa,
// lette una per una dalle pagine mappa di brawlmetrics.gg (che pubblica
// anche la dimensione del campione e la data dell'ultimo aggiornamento
// per ogni mappa: entrambe conservate qui sotto, perché servono a capire
// QUANTO fidarsi di ogni riga).
//
// Perché è un salto rispetto a prima: la versione precedente aveva solo
// elenchi di nomi "forti su questa mappa" raccolti da estratti di ricerca,
// senza numeri e senza sapere quanto fossero aggiornati. Ora ogni mappa
// verificata ha la win rate reale dei 20 brawler migliori.
//
// COSE TROVATE FACENDO IL CONTROLLO INCROCIATO (non erano note prima):
//  - "Ring of Fire" è stata RIMOSSA dal gioco il 27/01/2021: era ancora
//    in elenco qui come mappa attuale di Hot Zone. Eliminata.
//  - 7 mappe della vecchia lista non hanno pagina su brawlmetrics (404
//    anche al secondo tentativo): Layer Cake, Center Stage, Bridge Too
//    Far, Pit Stop, Safe Zone, Safe(r) Zone, Out in the Open. Non sono
//    state cancellate (una ricerca indica che almeno Safe Zone e Center
//    Stage esistono ancora), ma sono marcate `winRates: null` e nell'app
//    compaiono come "dati non verificati": restano selezionabili con i
//    vecchi bestPicks qualitativi, senza spacciarli per dati misurati.
//  - Sono state aggiunte 6 mappe che la lista precedente non aveva e che
//    risultano nella rotazione attuale: On A Roll, Tasty Berry, Backyard
//    Bowl, Jedna, Hot Tubs, Photic Doom, Konnakol.
//  - Attenzione alle date: alcune mappe con campioni enormi (Flaring
//    Phoenix 3,7M, New Horizons 1,5M, Belle's Rock 3,0M) hanno dati di
//    LUGLIO/AGOSTO, cioè di prima degli ultimi riequilibri. Tanti dati ma
//    vecchi: l'app li pesa meno (vedi mapConfidence in app.js), invece di
//    trattarli come se fossero di oggi solo perché il campione è grosso.
const MAPS = [
  // ---------- Gem Grab ----------
  {
    mode: "Gem Grab", name: "Undermine", sample: 225132, updated: "2026-09-06",
    winRates: { "Lola": 69.4, "Jae-Yong": 69.2, "Wendy": 68.9, "Trunk": 67.6, "Starr Nova": 66.5, "Amber": 65.7, "Shade": 65.3, "R-T": 64.5, "Finx": 64.0, "Janet": 63.9, "Gus": 63.8, "Mico": 63.1, "Bolt": 63.0, "Hank": 62.9, "Ruffs": 62.6, "Lumi": 62.2, "Gigi": 62.2, "Angelo": 61.7, "Nori": 61.5, "Nani": 61.1 },
    notes: "Favorisce chi tira da lunga distanza e chi controlla le corsie laterali.",
  },
  {
    mode: "Gem Grab", name: "Hard Rock Mine", sample: 43152, updated: "2026-09-06",
    winRates: { "Wendy": 70.7, "Jae-Yong": 68.6, "Bo": 68.2, "Lumi": 66.7, "Sprout": 65.9, "Draco": 64.5, "Starr Nova": 64.5, "Sirius": 64.1, "Shade": 63.4, "Damian": 63.1, "Doug": 61.5, "Nori": 60.7, "Meeple": 60.2, "Moe": 59.9, "Gus": 59.8, "Mina": 59.8, "Lola": 59.6, "Finx": 59.5, "Rico": 58.6, "Pierce": 58.6 },
    notes: "Centro aperto con due strisce di boscaglia a \"H\" ai lati. I Controller tengono gli avversari inchiodati vicino allo spawn; tank e mischia si infiltrano dai lati. Il più usato è Edgar (5,1%) ma vince solo il 53,1%: non seguirlo per moda.",
  },
  {
    mode: "Gem Grab", name: "Double Swoosh", sample: 254616, updated: "2026-08-31",
    winRates: { "Gus": 78.4, "Wendy": 73.7, "Jae-Yong": 72.1, "Damian": 69.6, "Bolt": 68.1, "Trunk": 67.9, "Shade": 67.2, "Gigi": 67.0, "Starr Nova": 66.6, "Sam": 66.5, "Finx": 65.9, "R-T": 65.6, "Lola": 65.2, "Doug": 65.1, "Nori": 65.1, "Lumi": 65.0, "Meeple": 64.1, "Sprout": 63.5, "Mandy": 63.0, "Glowy": 62.7 },
    notes: "Molti cespugli su entrambi i lati, vortice al centro, simmetria perfetta. Gus qui è fuori scala (78,4%).",
  },
  {
    mode: "Gem Grab", name: "Gem Fort", sample: 21678, updated: "2026-09-06",
    winRates: { "Damian": 73.4, "Amber": 73.2, "Bolt": 71.7, "Shade": 68.3, "Bo": 66.5, "Wendy": 66.1, "Doug": 62.3, "Starr Nova": 61.9, "Gigi": 61.5, "Nori": 61.2, "Pierce": 59.8, "Sirius": 59.5, "Mortis": 58.3, "Gus": 57.4, "Tara": 57.2, "Chester": 57.1, "El Primo": 57.0, "Stu": 56.3, "Frank": 55.2, "Griff": 54.1 },
    notes: "Centro chiuso da muri ad angolo retto con 4 ingressi, due vicini a corsie cespugliose. Amber brucia i cespugli con la Super.",
  },
  {
    mode: "Gem Grab", name: "On A Roll", sample: 21876, updated: "2026-09-06",
    winRates: { "Starr Nova": 70.7, "Janet": 68.6, "Shade": 68.1, "Wendy": 66.5, "Bolt": 64.9, "Trunk": 63.4, "Amber": 63.3, "Lumi": 63.2, "Nori": 59.7, "Chuck": 58.3, "Chester": 57.8, "Gus": 57.5, "Pierce": 56.5, "Mina": 55.8, "Kit": 55.5, "8-Bit": 54.8, "El Primo": 54.5, "Otis": 54.3, "Mandy": 54.0, "Griff": 53.4 },
    notes: "Mappa aggiunta il 6/9 (era assente dall'elenco precedente).",
  },
  {
    mode: "Gem Grab", name: "Rustic Arcade", sample: 14562, updated: "2026-08-30",
    winRates: { "Bo": 71.3, "Squeak": 66.4, "8-Bit": 65.4, "Starr Nova": 63.0, "Edgar": 62.0, "Spike": 59.0, "Bolt": 58.5, "Dynamike": 58.4, "Rico": 58.1, "Fang": 58.1, "Tick": 57.4, "Emz": 56.1, "Pearl": 55.5, "Crow": 54.9, "Darryl": 54.3, "Pierce": 54.2, "Max": 52.8, "Leon": 52.2, "El Primo": 51.7, "Shelly": 51.5 },
    notes: "Centro esagonale con muri verso il centro e cespugli sul lato opposto. Campione piccolo (14,5k): prendi i numeri con più cautela.",
  },

  {
    mode: "Gem Grab", name: "Open Space", sample: 190704, updated: "2026-09-05",
    winRates: { "Wendy": 71.9, "Trunk": 71.7, "Lumi": 68.8, "Damian": 68.8, "Lola": 68.7, "Hank": 68.7, "Gigi": 68.4, "Jae-Yong": 67.8, "Shade": 67.3, "Ziggy": 66.9, "Amber": 66.3, "Starr Nova": 65.5, "Gus": 65.0, "Sam": 64.6, "Juju": 64.6, "Ruffs": 64.0, "Bolt": 64.0, "Glowy": 63.9, "Chester": 63.8, "Finx": 63.7 },
    notes: "Aggiunta il 6/9.",
  },
  {
    mode: "Gem Grab", name: "Crystal Arcade", sample: 28134, updated: "2026-09-05",
    winRates: { "Bolt": 67.8, "Wendy": 67.8, "Trunk": 67.2, "Pierce": 66.7, "Stu": 65.9, "Mandy": 64.5, "Starr Nova": 64.5, "Lola": 64.4, "Shade": 64.3, "Bo": 64.2, "Chester": 64.1, "Doug": 62.9, "Amber": 62.4, "Sirius": 61.9, "Nori": 61.7, "Gigi": 61.0, "Gus": 60.8, "Mina": 59.1, "Damian": 57.0, "Tara": 55.5 },
    notes: "Aggiunta il 6/9. Una versione precedente dell'app l'aveva tolta perché ritenuta fuori pool: risulta invece tracciata e con dati recenti.",
  },
  // ---------- Bounty ----------
  {
    mode: "Bounty", name: "Shooting Star", sample: 236922, updated: "2026-09-06",
    winRates: { "Wendy": 68.4, "Amber": 65.9, "Lola": 65.1, "Shade": 64.5, "Jae-Yong": 63.5, "Sam": 62.1, "Glowy": 62.1, "Bolt": 62.1, "Gigi": 61.8, "Starr Nova": 61.6, "Juju": 61.4, "Bo": 61.0, "Sprout": 60.7, "Gus": 60.3, "Draco": 59.9, "Trunk": 59.8, "R-T": 59.7, "Najia": 59.5, "Damian": 59.2, "Alli": 59.0 },
    notes: "Mappa aperta con lunghe linee di tiro.",
  },
  {
    mode: "Bounty", name: "Hideout", sample: 168984, updated: "2026-08-31",
    winRates: { "Wendy": 71.1, "Bolt": 68.3, "Draco": 66.5, "Bo": 64.2, "Lola": 64.0, "Glowy": 63.9, "Jae-Yong": 63.5, "Damian": 63.2, "Starr Nova": 61.6, "Nori": 61.2, "Trunk": 59.9, "Pierce": 59.0, "Kaze": 58.1, "Sprout": 58.0, "Gus": 58.0, "Doug": 57.9, "Mina": 57.8, "Angelo": 57.4, "Lumi": 57.2, "Alli": 57.1 },
    notes: "Simmetria diagonale, due gruppi di staccionate con erba. La stella blu centrale è decisiva come spareggio.",
  },
  {
    mode: "Bounty", name: "Tasty Berry", sample: 125400, updated: "2026-09-06",
    winRates: { "Wendy": 71.8, "Damian": 68.2, "Sam": 67.2, "Trunk": 65.7, "Amber": 65.5, "Hank": 65.4, "Sprout": 64.8, "Jae-Yong": 64.7, "Doug": 63.4, "Bolt": 63.3, "Najia": 63.0, "Pierce": 62.6, "Juju": 62.4, "Finx": 62.1, "Moe": 61.6, "Bo": 61.5, "Stu": 61.5, "Willow": 60.8, "Janet": 60.5, "Gus": 60.5 },
    notes: "Mappa aggiunta il 6/9: risultava nella rotazione attuale ma non era in elenco.",
  },
  {
    mode: "Bounty", name: "Dry Season", sample: 9882, updated: "2026-08-30",
    winRates: { "Wendy": 59.3, "8-Bit": 57.1, "Brock": 56.0, "Mortis": 55.3, "Nori": 55.0, "Edgar": 53.0, "Bea": 52.7, "Tick": 52.5, "Spike": 51.9, "Piper": 51.9, "Squeak": 51.1, "Bo": 50.8, "Pierce": 50.3, "Fang": 48.1, "Leon": 47.4, "Byron": 46.9, "Colt": 46.4, "Mandy": 44.6, "Rico": 43.7, "Emz": 43.4 },
    notes: "Zone aperte con muri indistruttibili al centro. Campione molto piccolo (9,8k): è la mappa con i dati meno solidi di tutte.",
  },
  {
    mode: "Bounty", name: "Layer Cake", sample: 0, updated: null, winRates: null,
    bestPicks: ["El Primo", "Bull", "Leon", "Shelly"],
    notes: "DATI NON VERIFICATI: la pagina mappa non esiste su brawlmetrics (404 a due tentativi). Mappa a strati di muri, cespugli e chokepoint.",
  },

  // ---------- Brawl Ball ----------
  {
    mode: "Brawl Ball", name: "Super Beach", sample: 1726110, updated: "2026-09-05",
    winRates: { "Rosa": 80.7, "Trunk": 70.8, "Bolt": 70.4, "Amber": 68.9, "Gus": 68.8, "Ash": 68.5, "Jae-Yong": 67.8, "Wendy": 67.5, "Sam": 67.2, "Shade": 67.2, "Larry & Lawrie": 66.9, "Lola": 66.6, "Pearl": 66.2, "Doug": 66.1, "Damian": 66.0, "Lumi": 65.7, "Pam": 65.5, "R-T": 65.1, "Charlie": 65.0, "Hank": 64.9 },
    notes: "Aggiunta il 6/9. Rosa qui è il pick più forte di tutta l'app (80,7%).",
  },
  {
    mode: "Brawl Ball", name: "Sunny Soccer", sample: 1571760, updated: "2026-09-06",
    winRates: { "Rosa": 70.7, "Bull": 70.4, "Amber": 68.1, "Bolt": 67.9, "Trunk": 67.4, "Gus": 67.1, "Wendy": 66.8, "Damian": 66.7, "Pearl": 66.5, "Lola": 66.4, "Pam": 66.1, "Ash": 66.0, "Shade": 65.4, "Starr Nova": 65.4, "Gigi": 64.9, "Tara": 64.4, "Sam": 63.9, "Maisie": 63.4, "Charlie": 63.4, "Finx": 63.4 },
    notes: "Aggiunta il 6/9. Mappa da tank: Rosa e Bull sopra il 70%.",
  },
  {
    mode: "Brawl Ball", name: "Grass Knot", sample: 409938, updated: "2026-09-06",
    winRates: { "Gus": 72.5, "Wendy": 70.1, "Ash": 66.8, "Trunk": 66.5, "Bolt": 65.7, "Lumi": 64.3, "Jae-Yong": 64.0, "Nori": 63.8, "Damian": 63.4, "Starr Nova": 63.4, "Penny": 63.2, "Lou": 62.7, "Tara": 62.1, "Sprout": 62.0, "Glowy": 62.0, "Pearl": 61.6, "Finx": 61.4, "Amber": 61.0, "R-T": 61.0, "Sirius": 60.4 },
    notes: "Aggiunta il 6/9.",
  },
  {
    mode: "Brawl Ball", name: "Sneaky Fields", sample: 1507788, updated: "2026-09-06",
    winRates: { "Rosa": 69.6, "Bolt": 69.6, "Wendy": 68.3, "Trunk": 67.6, "Jae-Yong": 67.3, "Amber": 67.1, "Gus": 66.4, "Pearl": 65.9, "Pam": 65.2, "Gigi": 65.1, "Ash": 64.9, "Shade": 64.9, "Mico": 64.8, "Damian": 64.6, "Sam": 64.3, "Starr Nova": 64.2, "Lola": 64.1, "Lumi": 64.1, "Janet": 64.0, "Finx": 63.8 },
    notes: "Caos pieno di cespugli. Campione enorme (1,5M) e aggiornato: sono i dati più solidi di tutta l'app.",
  },
  {
    mode: "Brawl Ball", name: "Triple Dribble", sample: 1481016, updated: "2026-09-06",
    winRates: { "Rosa": 73.4, "Amber": 69.0, "Wendy": 68.1, "Bolt": 67.5, "Trunk": 66.7, "Ash": 66.6, "Pearl": 66.3, "Damian": 66.2, "Shade": 65.7, "Gus": 65.6, "Gigi": 65.4, "Larry & Lawrie": 65.1, "R-T": 64.7, "Starr Nova": 64.3, "Lumi": 64.2, "Lou": 63.8, "Lola": 63.8, "Maisie": 63.6, "Charlie": 63.3, "Doug": 63.0 },
    notes: "Barriere centrali, gruppi di casse, apertura del goal stretta. Rosa qui è il pick numero uno (73,4%).",
  },
  {
    mode: "Brawl Ball", name: "Pinhole Punt", sample: 362256, updated: "2026-09-03",
    winRates: { "Gus": 74.0, "Wendy": 71.4, "Bolt": 71.1, "Darryl": 67.5, "Ash": 67.3, "Finx": 66.6, "Starr Nova": 66.5, "Lumi": 65.9, "Jae-Yong": 65.6, "Damian": 65.6, "R-T": 64.8, "Nori": 64.7, "Doug": 64.4, "Shade": 63.9, "Gigi": 63.7, "Trunk": 63.3, "Gale": 62.6, "Penny": 62.4, "Draco": 62.4, "Buster": 62.3 },
    notes: "Mix di corridoi stretti, corsie aperte e chokepoint chiave.",
  },
  {
    mode: "Brawl Ball", name: "Pinball Dreams", sample: 333666, updated: "2026-09-02",
    winRates: { "Gus": 76.0, "Wendy": 72.3, "Bolt": 69.3, "Ash": 68.3, "Trunk": 68.2, "Pearl": 67.6, "Damian": 65.5, "Lola": 65.0, "Nori": 64.7, "Rosa": 64.6, "Shade": 64.1, "Starr Nova": 64.0, "Jae-Yong": 63.9, "Penny": 63.6, "Sam": 63.6, "Doug": 63.5, "Larry & Lawrie": 63.5, "Amber": 63.3, "R-T": 62.4, "Ruffs": 62.0 },
    notes: "Vinci prima il centrocampo, poi rompi i muri per aprire linee di tiro.",
  },
  {
    mode: "Brawl Ball", name: "Spiraling Out", sample: 269544, updated: "2026-08-31",
    winRates: { "Gus": 74.8, "Wendy": 73.1, "Damian": 68.6, "Sam": 68.2, "Trunk": 67.8, "Juju": 67.2, "Bolt": 66.8, "Nori": 66.2, "Ash": 65.8, "Meeple": 65.8, "Starr Nova": 65.7, "Shade": 65.6, "Mico": 65.3, "Jae-Yong": 65.1, "Larry & Lawrie": 64.8, "Draco": 64.4, "Gigi": 64.4, "Alli": 64.2, "Lola": 64.1, "Pearl": 63.8 },
    notes: "",
  },
  {
    mode: "Brawl Ball", name: "Backyard Bowl", sample: 125100, updated: "2026-09-06",
    winRates: { "Bolt": 76.8, "Wendy": 73.5, "Sam": 69.0, "Trunk": 68.1, "Starr Nova": 67.1, "Doug": 66.7, "Draco": 65.8, "Damian": 65.7, "Amber": 65.5, "Gus": 65.1, "Shade": 65.0, "Otis": 64.6, "Moe": 63.9, "Ash": 63.8, "Chester": 63.7, "Jae-Yong": 63.3, "Nori": 62.8, "Sandy": 62.7, "Sirius": 62.7, "Pearl": 62.6 },
    notes: "Mappa aggiunta il 6/9: risultava nella rotazione attuale ma non era in elenco.",
  },
  {
    mode: "Brawl Ball", name: "Beach Ball", sample: 30480, updated: "2026-09-06",
    winRates: { "Bolt": 78.7, "Wendy": 70.6, "Damian": 69.3, "Mina": 67.7, "Nori": 66.9, "Frank": 66.5, "Kenji": 65.5, "Cordelius": 65.0, "Kit": 64.8, "Pierce": 64.1, "Bibi": 63.0, "Sirius": 62.8, "Crow": 61.0, "Amber": 61.0, "Edgar": 60.8, "Lumi": 60.6, "Shade": 59.8, "Tara": 59.5, "Doug": 59.2, "Buzz": 58.6 },
    notes: "Muri stretti e lunghi più grandi gruppi di cespugli, simmetria diagonale.",
  },
  {
    mode: "Brawl Ball", name: "Center Stage", sample: 0, updated: null, winRates: null,
    bestPicks: ["Charlie", "Max", "Cordelius", "Sandy", "Melodie", "Colt", "Brock", "El Primo", "Rosa", "Dynamike", "Piper", "Frank", "Nita", "Shelly"],
    notes: "DATI NON VERIFICATI: nessuna pagina mappa su brawlmetrics (404). Simmetrica, copertura moderata: la mappa \"di skill\" per eccellenza.",
  },

  // ---------- Heist ----------
  {
    mode: "Heist", name: "Photic Doom", sample: 230922, updated: "2026-09-05",
    winRates: { "Trunk": 69.0, "Gus": 66.8, "Nori": 66.7, "Stu": 66.1, "Bolt": 65.9, "Lola": 65.8, "Sprout": 65.4, "Hank": 65.2, "Gigi": 64.9, "R-T": 64.8, "Sam": 64.7, "Bo": 64.1, "Glowy": 64.0, "Damian": 63.9, "Doug": 63.7, "Shade": 63.6, "Starr Nova": 63.5, "Angelo": 62.6, "Meeple": 62.4, "Finx": 62.1 },
    notes: "Mappa aggiunta il 6/9 (non era in elenco).",
  },
  {
    mode: "Heist", name: "Hot Tubs", sample: 208050, updated: "2026-09-06",
    winRates: { "Trunk": 69.5, "Wendy": 66.9, "Shade": 66.2, "Nori": 66.0, "Doug": 65.1, "Janet": 64.8, "Gigi": 63.7, "Sam": 63.4, "Starr Nova": 62.8, "Juju": 62.4, "Lola": 62.3, "Stu": 62.2, "Lumi": 62.2, "Ruffs": 61.1, "Gray": 60.9, "Sirius": 60.9, "Pierce": 60.8, "Amber": 60.4, "R-T": 60.1, "Glowy": 60.0 },
    notes: "Mappa aggiunta il 6/9 (non era in elenco).",
  },
  {
    mode: "Heist", name: "Hot Potato", sample: 191448, updated: "2026-09-02",
    winRates: { "Gus": 68.1, "Nori": 66.8, "Trunk": 66.0, "Bo": 65.7, "Lola": 63.9, "Sprout": 63.4, "Lumi": 63.4, "Gigi": 62.7, "Starr Nova": 62.2, "Shade": 62.1, "Finx": 62.1, "Draco": 61.0, "Kaze": 61.0, "Willow": 60.4, "Pierce": 60.1, "Jae-Yong": 59.9, "Amber": 59.5, "R-T": 59.5, "Bolt": 59.3, "Nani": 59.2 },
    notes: "Striscia diagonale di cespugli al centro; le torrette piazzate lì valgono molto.",
  },
  {
    mode: "Heist", name: "Jedna", sample: 107970, updated: "2026-09-06",
    winRates: { "Doug": 67.5, "Juju": 66.7, "Trunk": 66.6, "Sam": 66.0, "Starr Nova": 65.8, "Nori": 65.8, "Finx": 64.5, "Shade": 64.0, "Lumi": 63.5, "Najia": 62.5, "Stu": 61.9, "Lola": 61.8, "Amber": 61.6, "Wendy": 61.3, "Bolt": 61.2, "Kaze": 60.9, "Gigi": 60.1, "Damian": 60.1, "Mina": 59.9, "Hank": 59.7 },
    notes: "Mappa aggiunta il 6/9: è quella live nella rotazione Heist al momento del controllo.",
  },
  {
    mode: "Heist", name: "Kaboom Canyon", sample: 1283870, updated: "2026-07-24",
    winRates: { "Nori": 71, "Gigi": 71, "Gray": 70, "Pam": 69, "Trunk": 69, "Bolt": 68, "Jacky": 68, "Larry & Lawrie": 66, "Hank": 66, "Ash": 66, "Nita": 65, "Chuck": 64, "Jessie": 64, "Bull": 63, "Bibi": 63, "Mico": 62, "8-Bit": 62, "Edgar": 61, "Griff": 58, "Colette": 57 },
    notes: "Mappa molto aperta, simmetria diagonale. ATTENZIONE: dati di fine luglio (campione grosso ma vecchio, prima degli ultimi riequilibri) — l'app li pesa meno.",
  },
  {
    mode: "Heist", name: "Safe Zone", sample: 0, updated: null, winRates: null,
    bestPicks: ["Colt", "Pierce", "Colette", "Penny", "Crow", "Mortis", "Squeak", "Nori", "Sam", "Gus", "El Primo", "Shelly", "Rosa", "Darryl", "Frank", "Fang", "Bull", "Doug", "Bibi", "Buzz"],
    notes: "DATI NON VERIFICATI: nessuna pagina su brawlmetrics (404), anche se una ricerca indica che la mappa esiste ancora. Tre corsie ben definite; casseforti poco protette dai tiri lunghi.",
  },
  {
    mode: "Heist", name: "Safe(r) Zone", sample: 0, updated: null, winRates: null,
    bestPicks: [],
    notes: "DATI NON VERIFICATI: nessuna pagina su brawlmetrics. Variante di Safe Zone, stessi principi.",
  },
  {
    mode: "Heist", name: "Bridge Too Far", sample: 0, updated: null, winRates: null,
    bestPicks: ["Colt", "Piper", "Nani", "Mandy", "8-Bit", "Moe", "Ziggy", "Doug", "Gene", "Lumi", "Brock", "Belle", "Maisie", "Bea", "Rico", "Bull", "Darryl", "Edgar", "Carl"],
    notes: "DATI NON VERIFICATI: nessuna pagina su brawlmetrics (404). Terreno limitato, poca mobilità: i marksman sparano lungo le corsie senza spostarsi.",
  },
  {
    mode: "Heist", name: "Pit Stop", sample: 0, updated: null, winRates: null,
    bestPicks: ["Nori", "Dynamike", "Rico", "Melodie", "Griff", "Grom", "Barley", "Colt", "8-Bit"],
    notes: "DATI NON VERIFICATI: nessuna pagina su brawlmetrics (404). Piena di cespugli, casseforti protette da un lungo muro orizzontale.",
  },

  // ---------- Hot Zone ----------
  {
    mode: "Hot Zone", name: "Parallel Plays", sample: 232308, updated: "2026-09-06",
    winRates: { "Gus": 69.4, "Trunk": 68.4, "Wendy": 67.6, "Damian": 67.5, "R-T": 65.5, "Bolt": 65.4, "Jae-Yong": 64.8, "Bo": 64.5, "Nori": 63.6, "Amber": 63.5, "Gigi": 63.5, "Doug": 62.9, "Shade": 62.6, "Sprout": 62.5, "Starr Nova": 62.3, "Lola": 62.0, "Meeple": 62.0, "Willow": 61.9, "Hank": 61.7, "Mortis": 61.4 },
    notes: "Due zone e centro aperto, poche mura: conviene allargarsi per il controllo.",
  },
  {
    mode: "Hot Zone", name: "Dueling Beetles", sample: 13986, updated: "2026-09-06",
    winRates: { "Larry & Lawrie": 70.8, "Wendy": 68.0, "Frank": 67.9, "Nori": 64.4, "Mortis": 62.6, "Surge": 62.5, "Edgar": 61.8, "Griff": 61.1, "Tick": 59.7, "Shade": 58.1, "Rico": 57.4, "Bibi": 56.9, "Colt": 56.6, "Bull": 56.5, "8-Bit": 51.8, "Dynamike": 50.8, "Rosa": 50.0, "Carl": 47.8, "Nita": 47.7, "El Primo": 47.5 },
    notes: "Poco spazio per le gittate lunghissime: dominano AoE e medio raggio. Campione piccolo (14k).",
  },
  {
    mode: "Hot Zone", name: "Open Business", sample: 12432, updated: "2026-09-06",
    winRates: { "Starr Nova": 70.9, "Wendy": 64.6, "Nori": 64.0, "Griff": 63.5, "Frank": 61.8, "8-Bit": 59.2, "Tick": 58.5, "Bibi": 56.7, "Edgar": 55.5, "Squeak": 53.8, "Mortis": 53.7, "Penny": 53.4, "Rico": 52.8, "Nita": 52.5, "Shade": 51.7, "Colt": 51.2, "Bull": 50.9, "Rosa": 50.3, "Emz": 49.5, "Spike": 47.5 },
    notes: "I throwers fanno negazione d'area da dietro i muri. Campione piccolo (12k).",
  },

  // ---------- Knockout ----------
  {
    mode: "Knockout", name: "Konnakol", sample: 157728, updated: "2026-09-06",
    winRates: { "Wendy": 69.3, "Trunk": 66.9, "Ash": 66.7, "Gigi": 65.5, "Pam": 65.1, "Bolt": 64.4, "Pearl": 63.8, "Draco": 63.5, "Lumi": 63.1, "Berry": 63.0, "Larry & Lawrie": 62.9, "Sprout": 62.6, "Otis": 62.6, "Charlie": 62.5, "Eve": 62.0, "Alli": 62.0, "Ollie": 61.9, "Lola": 61.5, "Meeple": 61.5, "Amber": 61.4 },
    notes: "Mappa aggiunta il 6/9: è quella live nella rotazione Knockout al momento del controllo.",
  },
  {
    mode: "Knockout", name: "Belle's Rock", sample: 3037079, updated: "2026-08-11",
    winRates: { "Bolt": 71, "Ash": 69, "Clancy": 67, "Eve": 67, "R-T": 67, "Moe": 67, "Sam": 67, "Nori": 66, "Hank": 66, "Jae-Yong": 66, "Ziggy": 66, "Sirius": 64, "Sprout": 64, "Grom": 64, "Tick": 63, "Gray": 62, "Brock": 60, "Mandy": 58, "Rico": 58, "Dynamike": 58 },
    notes: "Corsie laterali speculari con muri a L. Campione enorme (3,0M) ma dati dell'11 agosto: pesati meno perché precedenti agli ultimi riequilibri.",
  },
  {
    mode: "Knockout", name: "Flaring Phoenix", sample: 3712220, updated: "2026-07-29",
    winRates: { "Bolt": 81, "Hank": 80, "Ash": 79, "Clancy": 79, "Sam": 76, "Starr Nova": 75, "Glowy": 75, "Eve": 75, "Ollie": 75, "Pearl": 74, "Damian": 73, "Darryl": 67, "R-T": 67, "Cordelius": 66, "Mandy": 65, "Stu": 65, "Surge": 65, "Max": 65, "Bull": 65, "Edgar": 64 },
    notes: "Acqua a scacchiera, cespugli e muri a strati. Campione enorme (3,7M) ma dati di fine luglio: pesati meno.",
  },
  {
    mode: "Knockout", name: "New Horizons", sample: 1549065, updated: "2026-07-24",
    winRates: { "Bolt": 68, "Ollie": 66, "Sirius": 64, "Hank": 64, "Sam": 64, "Pearl": 64, "Mr. P": 64, "Tick": 63, "Nori": 63, "Pam": 63, "Edgar": 62, "Brock": 61, "Kenji": 61, "Starr Nova": 61, "Griff": 60, "Piper": 59, "Mandy": 58, "Byron": 57, "Kit": 57, "Leon": 57 },
    notes: "Niente respawn: la densità di cespugli conta più che altrove. Dati del 24 luglio: pesati meno.",
  },
  {
    mode: "Knockout", name: "Out in the Open", sample: 0, updated: null, winRates: null,
    bestPicks: ["Wendy", "Piper", "Brock", "Mandy", "Gene", "Byron", "Emz", "Lou"],
    notes: "DATI NON VERIFICATI: nessuna pagina su brawlmetrics (404). Linee di tiro lunghe: gioca paziente e commercia da lontano.",
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

// COUNTER REALI — letti dalle pagine per brawler di BrawlMetrics il 6/9/2026.
//
// PERCHÉ SERVE UNA NORMALIZZAZIONE (e perché la versione precedente di questa
// app aveva scartato questi dati). Presi grezzi, i "forte contro / debole
// contro" di BrawlMetrics sono quasi inutili: praticamente ogni brawler
// risulta "debole contro Wendy" e "forte contro Shelly", perché Wendy è la
// più forte del gioco e Shelly la più debole. Non è un matchup, è la
// classifica generale riscritta.
//
// Il rimedio è togliere dal numero la parte spiegata dalla sola differenza di
// forza. Il valore atteso di A contro B è circa
//     atteso(A,B) = 50 + (forzaGenerale(A) − forzaGenerale(B))
// e quello che resta — actual − atteso — è il matchup vero. Il modello è
// stato verificato sui dati: Edgar contro Wendy fa 22,6% con un atteso di
// 23,0 (residuo −0,4: NON è un counter, è solo Wendy forte), mentre Jae-Yong
// contro Wendy fa 29,5% con un atteso di 43,0 (residuo −13,5: counter vero).
// Nita, che ha il 40,5% generale, contro Edgar fa 55,4% con atteso 49,9:
// residuo +5,5, cioè Nita lo batte davvero nonostante sia più debole.
//
// COPERTURA E LIMITE ONESTO. Ogni pagina pubblica solo i 3 matchup migliori e
// i 3 peggiori, cioè gli estremi. Qui ci sono i 46 brawler più scelti (quelli
// che l'avversario ha davvero probabilità di prendere), per ~276 coppie
// misurate. Le coppie si leggono anche al contrario — se A contro B fa 30%,
// allora B contro A fa 70% — il che raddoppia la copertura. Restano comunque
// buchi: per gli abbinamenti non misurati l'app ricade sull'euristica di
// classe, e lo dice.
const BRAWLER_OVERALL = {
  "Wendy": 67.6, "Amber": 64.9, "Bolt": 64.5, "Shade": 64.4, "Gus": 63.9,
  "Trunk": 63.8, "Starr Nova": 63.0, "Damian": 62.5, "Nori": 61.5, "Doug": 61.1,
  "Lumi": 61.0, "Jae-Yong": 60.6, "Meeple": 60.2, "Draco": 60.0, "Pierce": 59.8,
  "Bo": 58.6, "Hank": 58.2, "Stu": 58.2, "Mina": 57.8, "Sirius": 57.6,
  "Kaze": 56.3, "Willow": 56.1, "Mortis": 54.4, "Ash": 54.3, "Pearl": 52.8,
  "Griff": 51.7, "Colette": 50.7, "Max": 50.5, "El Primo": 49.7, "Carl": 49.6,
  "Bibi": 48.2, "Meg": 47.7, "Buster": 46.4, "Byron": 45.7, "Surge": 45.7,
  "Ollie": 44.8, "Emz": 44.7, "Piper": 44.7, "8-Bit": 44.4, "Colt": 44.2,
  "Crow": 43.5, "Brock": 41.9, "Edgar": 40.6, "Nita": 40.5, "Shelly": 40.5,
  "Rico": 40.1,
};

// MATCHUPS[A][B] = percentuale di vittorie di A quando affronta B.
const MATCHUPS = {
  "Wendy": { "Shelly": 83.6, "Nita": 81.4, "Barley": 80.3, "Shade": 52.3, "Amber": 54.4, "Ash": 56.3 },
  "Nita": { "Edgar": 55.4, "Meg": 54.9, "Rico": 54.7, "Gus": 17.2, "Bolt": 17.9, "Wendy": 18.7 },
  "Gus": { "Shelly": 82.8, "Nita": 82.8, "Rico": 75.9, "Wendy": 40.6, "Nori": 46.1, "Amber": 46.7 },
  "Bolt": { "Nita": 82.1, "Shelly": 80.3, "Eve": 75.2, "Wendy": 43.2, "Shade": 46.8, "Damian": 46.9 },
  "Nori": { "Barley": 76.4, "Shelly": 75.2, "Eve": 75.1, "Wendy": 40.8, "Bolt": 50.2, "Starr Nova": 50.2 },
  "Edgar": { "Eve": 54.0, "Mr. P": 53.7, "Brock": 53.3, "Wendy": 22.6, "Gus": 24.5, "Bolt": 26.5 },
  "Shade": { "Shelly": 77.7, "Nita": 75.7, "Colt": 72.5, "Amber": 45.8, "Nori": 45.8, "Wendy": 47.7 },
  "Amber": { "Shelly": 76.1, "Nita": 72.5, "Colt": 71.8, "Wendy": 45.6, "Nori": 46.2, "Starr Nova": 49.3 },
  "Trunk": { "Nita": 78.2, "Shelly": 77.9, "Mr. P": 74.1, "Wendy": 38.1, "Starr Nova": 42.0, "Nori": 42.8 },
  "Damian": { "Shelly": 78.5, "Nita": 78.0, "Eve": 72.0, "Wendy": 39.3, "Amber": 45.2, "Shade": 46.0 },
  "Starr Nova": { "Shelly": 77.3, "Nita": 75.1, "Barley": 72.5, "Wendy": 40.5, "Nori": 49.8, "Amber": 50.7 },
  "Jae-Yong": { "Nita": 80.5, "Shelly": 79.7, "Pam": 74.3, "Wendy": 29.5, "Nori": 37.3, "Starr Nova": 38.3 },
  "Doug": { "Shelly": 77.0, "Nita": 74.8, "Jacky": 70.9, "Wendy": 39.4, "Sirius": 46.2, "Amber": 46.3 },
  "Lumi": { "Shelly": 77.4, "Nita": 74.4, "Colt": 70.7, "Wendy": 40.3, "Nori": 45.4, "Amber": 45.7 },
  "Ash": { "Shelly": 67.9, "Mr. P": 64.9, "Nita": 64.0, "Jae-Yong": 38.0, "Nori": 38.6, "Amber": 40.4 },
  "Bibi": { "Eve": 61.6, "Mr. P": 61.4, "Grom": 59.7, "Wendy": 33.4, "Amber": 34.0, "Shade": 34.9 },
  "Draco": { "Shelly": 77.4, "Nita": 75.7, "Eve": 72.5, "Wendy": 35.7, "Nori": 41.3, "Starr Nova": 41.4 },
  "Hank": { "Nita": 74.3, "Shelly": 74.1, "Rico": 67.2, "Wendy": 32.1, "Nori": 34.4, "Jae-Yong": 37.8 },
  "Meg": { "Piper": 55.7, "Brock": 55.7, "Mr. P": 55.6, "Wendy": 29.4, "Bolt": 32.3, "Gus": 32.9 },
  "Buster": { "Shelly": 60.9, "Piper": 55.6, "Nita": 55.6, "Trunk": 31.1, "Nori": 31.4, "Wendy": 31.8 },
  "Ollie": { "Shelly": 60.6, "Nita": 56.1, "Eve": 55.5, "Wendy": 27.0, "Bolt": 27.4, "Trunk": 27.4 },
  "Sirius": { "Shelly": 74.9, "Nita": 70.2, "Pam": 68.1, "Wendy": 36.6, "Bolt": 43.6, "Shade": 44.3 },
  "Griff": { "Shelly": 62.0, "Eve": 59.9, "Nita": 59.9, "Wendy": 35.4, "Gus": 38.4, "Amber": 38.6 },
  "Brock": { "Piper": 49.1, "Eve": 49.0, "Grom": 48.9, "Wendy": 27.0, "Bolt": 28.0, "Nori": 28.2 },
  "Rico": { "Eve": 52.9, "Brock": 51.3, "Mr. P": 51.0, "Gus": 24.1, "Wendy": 24.2, "Bolt": 25.9 },
  "Surge": { "Brock": 54.2, "Colt": 53.6, "Barley": 53.3, "Wendy": 26.4, "Shade": 31.9, "Amber": 32.2 },
  "Max": { "Shelly": 63.7, "Nita": 62.3, "Eve": 60.3, "Wendy": 31.3, "Nori": 33.7, "Shade": 35.4 },
  "Stu": { "Shelly": 74.0, "Nita": 72.2, "Edgar": 65.6, "Wendy": 29.6, "Gus": 36.6, "Amber": 37.8 },
  "Emz": { "Eve": 59.8, "Mr. P": 58.7, "Pam": 57.8, "Wendy": 29.8, "Bolt": 31.7, "Gus": 31.8 },
  "Kaze": { "Shelly": 72.3, "Barley": 67.4, "Nita": 66.5, "Wendy": 33.6, "Nori": 43.3, "Starr Nova": 43.4 },
  "Colt": { "Shelly": 52.1, "Eve": 52.0, "Brock": 51.7, "Wendy": 20.6, "Gus": 24.7, "Bolt": 26.2 },
  "Pierce": { "Shelly": 76.1, "Nita": 72.7, "Jacky": 70.8, "Wendy": 36.4, "Starr Nova": 46.5, "Bolt": 47.7 },
  "Piper": { "Shelly": 52.7, "Colt": 52.6, "Nita": 51.8, "Wendy": 26.4, "Nori": 32.0, "Bolt": 32.6 },
  "El Primo": { "Eve": 56.7, "Brock": 56.2, "Edgar": 54.9, "Bolt": 25.6, "Jae-Yong": 26.3, "Wendy": 29.0 },
  "Meeple": { "Shelly": 76.9, "Nita": 76.4, "Rico": 70.1, "Wendy": 29.1, "Bolt": 40.8, "Damian": 41.1 },
  "8-Bit": { "Eve": 59.5, "Clancy": 57.5, "Mr. P": 57.4, "Wendy": 27.5, "Gus": 27.8, "Jae-Yong": 28.9 },
  "Mortis": { "Nita": 75.5, "Shelly": 74.8, "Barley": 69.8, "Wendy": 26.2, "Shade": 33.3, "Amber": 34.0 },
  "Bo": { "Gene": 73.2, "Ollie": 72.2, "Pam": 72.1, "Wendy": 31.5, "Bolt": 39.7, "Nori": 40.5 },
  "Colette": { "Shelly": 62.9, "Mr. P": 58.9, "Nita": 58.9, "Wendy": 27.0, "Shade": 36.3, "Nori": 36.5 },
  "Byron": { "Shelly": 58.3, "Nita": 55.1, "Colt": 54.5, "Wendy": 26.4, "Trunk": 31.5, "Nori": 32.5 },
  "Willow": { "Shelly": 73.3, "Nita": 71.1, "Rico": 65.4, "Wendy": 28.8, "Nori": 36.2, "Bolt": 37.6 },
  "Crow": { "Shelly": 56.0, "Nita": 54.8, "Mr. P": 54.7, "Wendy": 21.5, "Shade": 30.6, "Gus": 31.3 },
  "Carl": { "Shelly": 62.5, "Edgar": 61.3, "Eve": 61.3, "Wendy": 29.1, "Gus": 32.1, "Bolt": 32.3 },
  "Mina": { "Shelly": 75.5, "Nita": 72.4, "Edgar": 68.9, "Wendy": 33.6, "Shade": 41.2, "Amber": 41.7 },
  "Pearl": { "Shelly": 66.3, "Nita": 61.4, "Brock": 61.3, "Wendy": 33.8, "Jae-Yong": 38.1, "Nori": 38.3 },
  "Shelly": { "Rico": 52.3, "Brock": 52.3, "Edgar": 52.1, "Wendy": 16.4, "Gus": 17.3, "Bolt": 19.6 },
};

// USE RATE (quanto spesso un brawler viene REALMENTE scelto in
// Classificata, tutti i ranghi) — stessa tabella di DEFAULT_META_SCORES,
// stesso giorno, colonna che prima veniva buttata via. Serve a due cose
// che la sola win rate non sa fare:
//
//  1. TRAPPOLE: chi viene scelto tantissimo e perde lo stesso. Sono gli
//     errori più costosi in ladder, perché "lo prendono tutti" sembra una
//     garanzia e non lo è. Es. Griff (4,29% di scelte, 49,4% di vittorie),
//     Max (2,50% / 47,4%), Pierce (2,14% / 45,9%), Colt (2,18% / 47,6%).
//  2. SOTTOVALUTATI: chi vince tanto ma quasi nessuno prende — quindi
//     quasi nessuno lo banna, e resta disponibile. È il vantaggio più
//     concreto che un drafter possa darti. Il caso limite è Wendy: prima
//     in assoluto per win rate (58,3%) ma scelta solo dall'1,40%.
//
// Serve anche a rendere sensati i BAN: bannare il brawler più forte che
// però non prende nessuno è un ban sprecato. Il punteggio di ban pesa la
// forza per la probabilità che l'avversario lo scelga davvero.
const USE_RATES = {
  "Amber": 2.07, "Shade": 2.05, "Wendy": 1.40, "Gus": 3.10, "Nori": 4.41,
  "Edgar": 3.51, "Brock": 4.28, "El Primo": 1.85, "Griff": 4.29, "Rico": 3.58,
  "Emz": 2.40, "Kaze": 2.22, "Bo": 1.46, "Bibi": 1.08, "Surge": 2.76,
  "Trunk": 1.05, "8-Bit": 1.77, "Stu": 2.41, "Ash": 0.76, "Jessie": 0.60,
  "Pearl": 1.13, "Piper": 1.89, "Bull": 0.97, "Max": 2.50, "Mortis": 1.66,
  "Doug": 0.31, "Colt": 2.18, "Nita": 0.56, "Colette": 1.39, "Carl": 1.16,
  "Gray": 0.94, "Willow": 1.21, "Bolt": 0.49, "Sprout": 0.38, "Tick": 0.82,
  "Meeple": 1.80, "Frank": 0.59, "Starr Nova": 1.04, "Pierce": 2.14, "Mina": 1.14,
  "Mico": 0.59, "Leon": 0.81, "Chester": 0.86, "Otis": 1.14, "Sirius": 0.43,
  "Melodie": 0.43, "Angelo": 0.44, "Spike": 0.99, "Mandy": 0.83, "Najia": 0.47,
  "Meg": 1.33, "Damian": 0.41, "Penny": 0.72, "R-T": 0.16, "Gene": 1.02,
  "Fang": 0.69, "Maisie": 0.31, "Buster": 0.14, "Shelly": 0.51, "Byron": 1.33,
  "Kenji": 0.48, "Buzz": 0.63, "Jacky": 0.14, "Nani": 0.59, "Mr. P": 0.13,
  "Juju": 0.13, "Crow": 1.17, "Eve": 0.18, "Cordelius": 0.56, "Poco": 0.66,
  "Dynamike": 0.69, "Grom": 0.30, "Janet": 0.12, "Ruffs": 0.74, "Finx": 0.12,
  "Lily": 0.34, "Lou": 0.52, "Lumi": 0.88, "Hank": 0.10, "Gigi": 0.32,
  "Moe": 0.21, "Gale": 0.34, "Clancy": 0.28, "Larry & Lawrie": 0.12, "Alli": 0.25,
  "Glowy": 0.10, "Draco": 0.06, "Belle": 0.43, "Barley": 0.28, "Chuck": 0.64,
  "Rosa": 0.14, "Tara": 0.60, "Ollie": 0.05, "Sam": 0.04, "Lola": 0.14,
  "Bea": 0.33, "Squeak": 0.50, "Kit": 0.43, "Charlie": 0.27, "Jae-Yong": 0.08,
  "Darryl": 0.30, "Sandy": 0.17, "Ziggy": 0.08, "Bonnie": 0.09, "Pam": 0.06,
  "Berry": 0.29,
};

const META_SOURCE_LABELS = {
  ALL_RANKS: "Ranked, tutti i ranghi (Bronze→Pro) — brawlmetrics.gg, 6/9/2026",
  MASTERS: "Ranked, solo Masters — brawlmetrics.gg, 6/9/2026",
};
