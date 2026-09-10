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

// MODE_WIN_RATES[modalità][brawler] = quanto vale quel brawler in quella
// modalità in CLASSIFICATA. Non è letto da una pagina: è calcolato da
// script/build-map-data.js come media delle mappe di quella modalità
// presenti nel pool ranked, pesata sul campione di ciascuna.
//
// Perché calcolato e non scaricato. app.js MISCELA il dato mappa con
// quello di modalità quando la mappa è poco affidabile (campione piccolo
// o dato vecchio). Se i due arrivano da fonti diverse arrivano anche su
// scale diverse — e la media fra due scale diverse è un numero che non
// vuol dire niente. Derivandolo dalle stesse tabelle, la scala è la
// stessa per costruzione.
//
// Risolve anche il limite dichiarato nella versione precedente, dove
// questi numeri venivano dalle pagine per-modalità di brawlmetrics, che
// coprono TUTTI i livelli di trofei e non il ranked: erano "come si
// comporta in questa modalità", non "quanto vale in Classificata in
// questa modalità". Ora sono la seconda cosa.
//
// Restano il ripiego, non il dato buono: se la mappa è nota (e ora lo
// sono tutte e 33 quelle del pool, per tutti e 106 i brawler) vince
// sempre il dato di mappa. Specifico batte generico e non si somma.
const MODE_WIN_RATES = {
  "Gem Grab": {
    "Bolt": 64.2, "Wendy": 62, "Clancy": 57.9, "Ash": 57.6, "Bo": 56.1, "Mr. P": 55.8,
    "Damian": 55.8, "Jessie": 54.7, "Rosa": 54.4, "Surge": 53.8, "Eve": 53.6, "Starr Nova": 53.6,
    "8-Bit": 53.3, "Pearl": 53, "Griff": 53, "Carl": 52.9, "Nita": 52.8, "Tara": 52.8,
    "Ollie": 52.1, "Buster": 52, "Doug": 51.8, "Charlie": 51.7, "Janet": 51.6, "Sandy": 51.2,
    "Stu": 51.1, "R-T": 51, "Crow": 51, "Penny": 50.9, "Pam": 50.8, "Bibi": 50.8,
    "Bull": 50.7, "Emz": 50.6, "Fang": 50.4, "Edgar": 50.4, "Jacky": 50.3, "Poco": 50.2,
    "Otis": 50.1, "Moe": 50, "Mina": 49.8, "Gale": 49.7, "Rico": 49.3, "Mortis": 49.2,
    "Ruffs": 49.2, "Tick": 49.1, "Chester": 49.1, "Sam": 49.1, "Max": 49, "Meg": 48.9,
    "Darryl": 48.9, "Kenji": 48.8, "Lou": 48.8, "Maisie": 48.5, "Lily": 48.1, "Mico": 48.1,
    "Bonnie": 48, "Nori": 48, "Gus": 48, "Spike": 47.8, "Trunk": 47.8, "Finx": 47.6,
    "Draco": 47, "Amber": 46.9, "Gigi": 46.9, "Cordelius": 46.7, "Leon": 46.7, "Buzz": 46.6,
    "Larry & Lawrie": 46.4, "Sirius": 46.2, "Lola": 46.1, "Brock": 46, "Alli": 46, "Shade": 45.8,
    "Bea": 45.6, "Belle": 45.4, "Frank": 45.4, "Juju": 45.3, "Gray": 45.2, "Meeple": 45.1,
    "Lumi": 44.6, "Glowy": 44.4, "El Primo": 44.4, "Melodie": 44.3, "Grom": 44.3, "Shelly": 44.3,
    "Gene": 44.3, "Chuck": 44.2, "Pierce": 43.9, "Kit": 43.9, "Hank": 43.7, "Dynamike": 43.7,
    "Colt": 43.5, "Byron": 43.4, "Colette": 43.4, "Squeak": 43.1, "Najia": 42.9, "Kaze": 42,
    "Piper": 41.9, "Jae-Yong": 41.5, "Barley": 41, "Mandy": 40.7, "Ziggy": 40.6, "Berry": 40.3,
    "Willow": 39.5, "Sprout": 39.5, "Angelo": 37.8, "Nani": 37.7,
  },
  "Brawl Ball": {
    "Wendy": 58.8, "Jacky": 58.8, "Ash": 57.7, "R-T": 55.3, "Damian": 55.2, "Doug": 55.2,
    "Bibi": 55.1, "Clancy": 54.7, "Griff": 54.6, "Nita": 54.1, "Rosa": 53.9, "Frank": 53.1,
    "Buster": 52.7, "Sam": 52.4, "Bull": 52.2, "Carl": 52.2, "Rico": 52.2, "Maisie": 52.1,
    "Tick": 52.1, "Surge": 51.8, "Larry & Lawrie": 51.6, "Gus": 51.6, "Ollie": 51.6, "Emz": 51.5,
    "Tara": 51.3, "Shade": 51.3, "Sandy": 51.2, "Lou": 50.9, "Gale": 50.7, "Jessie": 50.7,
    "Edgar": 50.6, "El Primo": 50.6, "Otis": 50.5, "Amber": 49.8, "Starr Nova": 49.6, "Charlie": 49.6,
    "Buzz": 49.4, "Bolt": 49.3, "Poco": 49.3, "Cordelius": 49.1, "Chester": 49, "Dynamike": 49,
    "Kenji": 49, "Sirius": 48.9, "Bo": 48.8, "Willow": 48.7, "Hank": 48.6, "Darryl": 48.5,
    "Fang": 48.4, "Moe": 48.2, "Stu": 48.1, "Meg": 48.1, "Pearl": 48.1, "8-Bit": 48.1,
    "Grom": 48, "Trunk": 47.9, "Spike": 47.7, "Barley": 47.5, "Juju": 47.3, "Meeple": 46.9,
    "Max": 46.7, "Gigi": 46.6, "Lumi": 46.5, "Nori": 46.4, "Bea": 46.4, "Mr. P": 46.1,
    "Crow": 46, "Draco": 45.8, "Shelly": 45.2, "Pam": 45.2, "Eve": 45.1, "Brock": 44.8,
    "Janet": 44.6, "Mina": 44.6, "Penny": 44.5, "Ziggy": 44.4, "Finx": 44.2, "Ruffs": 44.1,
    "Colt": 43.6, "Bonnie": 43.5, "Lily": 43.2, "Mortis": 43.2, "Pierce": 43.1, "Colette": 43.1,
    "Melodie": 42.4, "Najia": 42, "Alli": 42, "Leon": 41.5, "Berry": 40.8, "Gray": 40.6,
    "Kit": 40.5, "Squeak": 40.5, "Lola": 40.3, "Byron": 40.2, "Sprout": 40.1, "Mico": 40.1,
    "Glowy": 39.7, "Belle": 39.5, "Kaze": 39.3, "Jae-Yong": 38.9, "Mandy": 36.9, "Piper": 35.2,
    "Gene": 33.7, "Chuck": 33.1, "Nani": 32.4, "Angelo": 29,
  },
  "Bounty": {
    "Bolt": 65.1, "Wendy": 63.7, "Mr. P": 59.3, "Grom": 57.1, "Pearl": 56.2, "Tick": 56,
    "Brock": 55.5, "Carl": 55.1, "Sprout": 54.2, "Penny": 53.6, "Eve": 53.3, "Bo": 53.2,
    "Bonnie": 52.7, "8-Bit": 52.6, "Mico": 52.5, "Ollie": 52, "Ash": 51.6, "Najia": 51.6,
    "Gigi": 51.2, "Mina": 51.1, "Leon": 51, "Gray": 50.9, "Buster": 50.9, "Mortis": 50.8,
    "Piper": 50.8, "Max": 50.8, "Edgar": 50.7, "Rosa": 50.7, "Janet": 50.7, "Squeak": 50.5,
    "Damian": 50.5, "Surge": 50.4, "R-T": 50.4, "Belle": 50.4, "Doug": 49.9, "Starr Nova": 49.8,
    "Mandy": 49.8, "Gus": 49.7, "Otis": 49.5, "Spike": 49.4, "Ruffs": 49.4, "Poco": 49.1,
    "Angelo": 49, "Nani": 48.9, "Meeple": 48.8, "Larry & Lawrie": 48.7, "Jessie": 48.6, "Byron": 48.6,
    "Lily": 48.6, "Gene": 48.5, "Juju": 48.4, "Maisie": 48.3, "Amber": 48.1, "Fang": 48.1,
    "Stu": 48, "Darryl": 47.8, "Pierce": 47.7, "Dynamike": 47.5, "Jae-Yong": 47.4, "Griff": 47.3,
    "Charlie": 47, "Glowy": 46.8, "Gale": 46.7, "Bea": 46.5, "Lola": 46.4, "Meg": 46.4,
    "Ziggy": 46.2, "Rico": 46.2, "Emz": 46.2, "Nori": 46.1, "Clancy": 45.9, "Crow": 45.9,
    "Kenji": 45.8, "Kaze": 45.8, "Moe": 45.8, "Lou": 45.6, "Shade": 45.5, "Pam": 45.3,
    "Bibi": 45.2, "Barley": 45.2, "Chester": 45.1, "Finx": 45, "Willow": 45, "Colt": 45,
    "Sam": 44.7, "Kit": 44.7, "Cordelius": 44.3, "Alli": 44.2, "Hank": 44.2, "Sirius": 44.1,
    "Jacky": 44.1, "Chuck": 44, "Bull": 43.9, "Buzz": 43.9, "Sandy": 43.8, "Tara": 43.6,
    "Melodie": 42.2, "Lumi": 42.1, "Trunk": 41.9, "Nita": 41.7, "Colette": 41.5, "El Primo": 40,
    "Shelly": 39.7, "Draco": 39.7, "Frank": 39.3, "Berry": 38.6,
  },
  "Heist": {
    "Nori": 63.3, "Mico": 59.2, "Wendy": 56.9, "Bibi": 56.2, "Bolt": 56.2, "Carl": 56,
    "Chuck": 55.8, "Sam": 55.4, "Jessie": 55.4, "Nita": 55.2, "Edgar": 54.9, "Melodie": 54.9,
    "Bull": 54.8, "8-Bit": 54.2, "Shade": 54, "Eve": 53.3, "Starr Nova": 53, "Clancy": 52.4,
    "Gigi": 52.3, "Griff": 51.5, "Ash": 51, "Lily": 50.8, "Kaze": 50.8, "Darryl": 50.6,
    "Penny": 49.8, "Otis": 49.8, "Doug": 49.1, "Bonnie": 49, "Colt": 48.9, "Cordelius": 48.9,
    "Juju": 48.8, "Bo": 48.6, "Mr. P": 48.3, "Emz": 47.9, "Pearl": 47.5, "Buzz": 47.4,
    "Colette": 47.3, "Surge": 47.1, "Rico": 47.1, "Brock": 47.1, "Lola": 47, "Trunk": 46.9,
    "Alli": 46.8, "Rosa": 46.7, "El Primo": 46.4, "Lumi": 46.4, "Amber": 46.4, "Crow": 46,
    "Charlie": 45.7, "Kenji": 45.5, "Gale": 45.5, "R-T": 45.4, "Finx": 45.3, "Maisie": 45.3,
    "Max": 45.1, "Ruffs": 45, "Berry": 44.5, "Fang": 44.5, "Sirius": 44.5, "Bea": 44.1,
    "Glowy": 44, "Belle": 43.9, "Meg": 43.7, "Pierce": 43.7, "Gus": 43.6, "Larry & Lawrie": 43.5,
    "Frank": 43.2, "Spike": 43.2, "Kit": 42.9, "Buster": 42.9, "Draco": 42.9, "Angelo": 42.9,
    "Lou": 42.9, "Tara": 42.8, "Grom": 42.8, "Chester": 42.6, "Dynamike": 42.5, "Jacky": 42.3,
    "Mina": 42.2, "Moe": 42.2, "Mandy": 42.1, "Pam": 41.9, "Barley": 41.9, "Janet": 41.7,
    "Nani": 41.6, "Najia": 41, "Piper": 40.7, "Byron": 40.4, "Damian": 40.3, "Stu": 40.3,
    "Gray": 40, "Squeak": 40, "Leon": 39.6, "Poco": 39.5, "Hank": 39, "Mortis": 38.6,
    "Sprout": 38.3, "Sandy": 38.2, "Meeple": 37.9, "Shelly": 37.1, "Ziggy": 36.9, "Willow": 35.6,
    "Tick": 34.3, "Ollie": 32.3, "Jae-Yong": 31.7, "Gene": 26.5,
  },
  "Hot Zone": {
    "Wendy": 65, "Ash": 58.8, "Bolt": 58.8, "Kenji": 56.4, "Doug": 56.3, "Bibi": 56.1,
    "Damian": 55.5, "Tick": 55.3, "Sam": 54.8, "Rosa": 54.8, "Nita": 54.3, "Surge": 54,
    "Griff": 53.9, "Jessie": 53.6, "Bo": 53.5, "Starr Nova": 53.3, "Jacky": 53.1, "Clancy": 53.1,
    "Gus": 53, "Buster": 52.9, "Sandy": 52.7, "Hank": 52.4, "Poco": 52.1, "Stu": 51.9,
    "Edgar": 51.4, "Nori": 51.3, "Draco": 51.3, "Trunk": 51.2, "Carl": 51, "Mina": 50.7,
    "Juju": 50.6, "Eve": 50.6, "Bull": 50.5, "Emz": 50.4, "Lou": 50.2, "Mortis": 50.1,
    "Chuck": 50, "Gale": 50, "Gray": 49.8, "Meg": 49.5, "Larry & Lawrie": 49.3, "Ollie": 49.2,
    "Frank": 49.1, "Penny": 48.9, "R-T": 48.7, "Mico": 48.7, "Fang": 48.4, "Amber": 48.4,
    "8-Bit": 48.3, "Pam": 48.3, "Chester": 48.2, "Finx": 48, "Pearl": 47.9, "El Primo": 47.9,
    "Cordelius": 47.8, "Barley": 47.7, "Mr. P": 47.6, "Maisie": 47.4, "Shade": 47.3, "Tara": 47,
    "Otis": 46.9, "Darryl": 46.7, "Spike": 46.7, "Moe": 46.5, "Lily": 46.4, "Charlie": 46.2,
    "Sirius": 46.1, "Buzz": 45.9, "Meeple": 45.8, "Crow": 45.8, "Bonnie": 45.5, "Gigi": 44.8,
    "Glowy": 44.7, "Bea": 43.8, "Ruffs": 43.7, "Max": 43.5, "Dynamike": 43.3, "Grom": 43.3,
    "Kaze": 43.3, "Melodie": 43.1, "Berry": 43, "Leon": 42.7, "Ziggy": 42.1, "Colette": 42,
    "Lumi": 42, "Alli": 42, "Pierce": 41.9, "Janet": 41.5, "Shelly": 41.2, "Brock": 41,
    "Rico": 41, "Kit": 40.7, "Najia": 40.7, "Lola": 40.1, "Willow": 39.7, "Squeak": 39.7,
    "Belle": 38.2, "Byron": 38.1, "Jae-Yong": 37.8, "Sprout": 37.7, "Colt": 37, "Piper": 32.7,
    "Mandy": 32.6, "Angelo": 31.8, "Nani": 31.8, "Gene": 31.2,
  },
  "Knockout": {
    "Wendy": 65.1, "Pearl": 60.4, "Bolt": 59.4, "Grom": 58.1, "Mr. P": 57.9, "Brock": 57,
    "Buster": 56, "Sprout": 55.3, "Tick": 55.2, "Carl": 55, "Bonnie": 54.4, "Mico": 54.3,
    "Doug": 54.3, "Darryl": 54.2, "Edgar": 54.1, "Ollie": 53.8, "R-T": 53.8, "Gray": 53.6,
    "Eve": 53.1, "Ash": 52.9, "Rosa": 52.5, "Gigi": 51.7, "Najia": 51.1, "8-Bit": 51,
    "Meeple": 51, "Penny": 50.9, "Juju": 50.6, "Leon": 50.4, "Larry & Lawrie": 50.3, "Otis": 50.2,
    "Lily": 50.2, "Piper": 50.1, "Gene": 50.1, "Janet": 50, "Maisie": 50, "Starr Nova": 49.9,
    "Gus": 49.8, "Squeak": 49.7, "Mina": 49.6, "Damian": 49.6, "Spike": 49.5, "Mandy": 49.4,
    "Angelo": 49.3, "Fang": 49.2, "Bo": 49, "Surge": 48.9, "Jacky": 48.8, "Sam": 48.6,
    "Charlie": 48.4, "Belle": 48.4, "Ruffs": 48.2, "Mortis": 48.2, "Dynamike": 48.2, "Poco": 48.2,
    "Stu": 48.1, "Rico": 48, "Kit": 47.9, "Meg": 47.9, "Gale": 47.7, "Griff": 47.6,
    "Cordelius": 47.5, "Moe": 47.4, "Byron": 47.4, "Emz": 47.3, "Jae-Yong": 47.3, "Max": 47.3,
    "Willow": 47.2, "Ziggy": 47, "Hank": 46.9, "Sirius": 46.9, "Buzz": 46.9, "Nori": 46.8,
    "Glowy": 46.7, "Bibi": 46.7, "Bull": 46.5, "Chester": 46.5, "Pierce": 46.4, "Nani": 46.4,
    "Barley": 46.4, "Finx": 46.3, "Shade": 46.2, "Bea": 46.1, "Lou": 45.9, "Amber": 45.5,
    "Jessie": 45.5, "Pam": 45, "Lola": 44.7, "Clancy": 44.7, "Colt": 44.6, "Kenji": 44.4,
    "Alli": 44.3, "Frank": 43.9, "Crow": 43.9, "Trunk": 43.5, "Tara": 43, "Shelly": 42.9,
    "Sandy": 42.9, "El Primo": 42.7, "Lumi": 42.3, "Chuck": 42.3, "Colette": 41.7, "Nita": 41.6,
    "Melodie": 40.8, "Berry": 40.6, "Kaze": 40.6, "Draco": 40.4,
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

// MAPPE — rifatte da zero il 6/9/2026 (secondo passaggio della giornata)
// con le win rate di CLASSIFICATA lette da brawlplanet.com, una riga per
// ognuno dei 106 brawler su ognuna delle 33 mappe del pool ranked.
// Generate da script/build-map-data.js: non modificarle a mano, si rifà
// girare lo script.
//
// PERCHÉ È CAMBIATA LA FONTE. La versione di stamattina prendeva le mappe
// da brawlmetrics.gg e aveva tre problemi che il controllo incrociato ha
// fatto emergere:
//
//  1. LISTA MAPPE SBAGLIATA. Era la rotazione TROFEI, non il pool
//     Classificata. Conteneva mappe che in Classificata non escono mai
//     (Super Beach, Sunny Soccer, Konnakol, Photic Doom, Hot Tubs, Jedna,
//     Open Space, On A Roll, Tasty Berry, Backyard Bowl, Grass Knot) e
//     non conteneva mappe che invece ci sono (Ring of Fire, Lilygear
//     Lake, Flooded Mine, Deathcap Trap in Gem Grab). È anche il motivo
//     per cui 7 mappe risultavano "404, dati non verificati": erano mappe
//     SOLO ranked, e la pagina che veniva cercata era quella trofei.
//
//  2. DATI VECCHI. Alcune mappe erano ferme a luglio e non si
//     aggiornavano mai, perché brawlmetrics segue la rotazione trofei:
//     una mappa che esce solo in Classificata lì non si rinfresca più.
//     Qui l'aggiornamento è orario e dichiarato dalla fonte.
//
//  3. NUMERI GONFI E POCO SPECIFICI. La media dei 5 migliori per mappa
//     stava fra 68% e 79%, valori che in un gioco bilanciato non sono
//     plausibili, e in cima comparivano quasi sempre gli stessi brawler
//     rari (Trunk, Gus, Lola, Gigi, Finx) in TUTTE le modalità. Misurato:
//     la sovrapposizione fra i top 10 di due mappe della stessa modalità
//     meno quella fra modalità diverse — cioè quanta informazione sulla
//     mappa c'è davvero nel dato — vale 1,51/10 su brawlmetrics e 3,27/10
//     su brawlplanet. La seconda porta più del doppio di segnale.
//
// CONTROLLO DI INTEGRITÀ, superato: su ogni mappa la somma delle pick
// rate dei 106 brawler fa 600% (± 2), cioè esattamente 6 pick per
// partita. Le tabelle sono quindi complete e coerenti, non troncate.
//
// COSA NON È STATO POSSIBILE VERIFICARE: il campione dichiarato per mappa
// (~1,93 milioni di partite) è quasi identico su tutte le mappe mature,
// il che è compatibile con una rotazione che dà a ogni mappa lo stesso
// tempo di gioco, ma non è stato possibile confermarlo con una seconda
// fonte. È il numero che dichiara brawlplanet, riportato com'è. Le mappe
// entrate da poco nel pool hanno campioni molto più piccoli e veri
// (Lilygear Lake e Flooded Mine ~26k, Beach Ball ~98k): l'app li pesa di
// meno da sé (vedi mapConfidence in app.js).
//
// ALTRO ERRORE CORRETTO: "Ring of Fire" era stata cancellata stamattina
// perché un articolo del 2021 la dava rimossa dal gioco. È tornata: la
// dà attiva sia l'API pubblica di Brawlify (disabled: false) sia il pool
// ranked di brawlplanet. Rimessa. Non cancellare una mappa sulla base di
// un articolo quando c'è un'API che risponde.
const MAPS = [
  // ---------- Gem Grab ----------
  {
    mode: "Gem Grab", name: "Undermine", sample: 1950582, updated: "2026-09-10",
    winRates: { "Wendy": 64.7, "Bolt": 62.5, "Ash": 57.7, "Clancy": 57.3, "Bo": 55.9, "Damian": 55.2, "Jessie": 54.6, "Mr. P": 54.5, "Eve": 54.4, "Surge": 53.9, "8-Bit": 53.8, "Starr Nova": 53.7, "Carl": 53.3, "Pearl": 53.3, "Rosa": 53.3, "Nita": 53.2, "Tara": 53.2, "Griff": 52.8, "Buster": 52.5, "Janet": 52.3, "Charlie": 52, "Stu": 51.7, "Ollie": 51.4, "Bull": 51.3, "Doug": 51.2, "Pam": 51.1, "Sandy": 51.1, "Crow": 51, "Otis": 50.9, "Moe": 50.8, "Penny": 50.8, "Bibi": 50.6, "Emz": 50.3, "Rico": 50.3, "Edgar": 50.2, "Gale": 50.2, "Poco": 50.2, "Fang": 50.1, "Mina": 50, "Chester": 49.7, "Gus": 49.7, "Sam": 49.7, "Jacky": 49.6, "R-T": 49.6, "Max": 49.5, "Meg": 49.5, "Ruffs": 49.3, "Tick": 49.3, "Amber": 49.2, "Lou": 49.1, "Maisie": 48.9, "Mico": 48.8, "Kenji": 48.7, "Mortis": 48.7, "Darryl": 48.5, "Spike": 48.1, "Finx": 47.9, "Nori": 47.9, "Draco": 47.8, "Bonnie": 47.6, "Trunk": 47.6, "Shade": 47.4, "Lola": 47.2, "Lily": 47.1, "Bea": 46.8, "Frank": 46.7, "Gigi": 46.7, "Cordelius": 46.6, "Alli": 46.4, "Larry & Lawrie": 46.2, "Sirius": 46.2, "Buzz": 46.1, "Leon": 46.1, "Meeple": 46.1, "Juju": 46, "Brock": 45.7, "El Primo": 45.7, "Gray": 45.6, "Belle": 45.5, "Lumi": 45.2, "Gene": 45, "Pierce": 45, "Colt": 44.4, "Shelly": 44.4, "Glowy": 44.1, "Melodie": 44.1, "Chuck": 43.8, "Byron": 43.7, "Squeak": 43.6, "Colette": 43.4, "Dynamike": 43.4, "Grom": 43.3, "Najia": 43.3, "Piper": 43, "Kit": 42.9, "Hank": 42.2, "Jae-Yong": 41.7, "Kaze": 41.5, "Barley": 41.1, "Sprout": 41.1, "Mandy": 40.8, "Berry": 40.5, "Ziggy": 40.4, "Willow": 39.4, "Angelo": 37.1, "Nani": 37.1 },
    pickRates: { "Wendy": 0.5, "Bolt": 6.8, "Ash": 3.1, "Clancy": 3.3, "Bo": 23.6, "Damian": 6, "Jessie": 5.8, "Mr. P": 0.7, "Eve": 0.3, "Surge": 25.3, "8-Bit": 9.8, "Starr Nova": 13.3, "Carl": 5.7, "Pearl": 4, "Rosa": 1.3, "Nita": 3.5, "Tara": 21.8, "Griff": 32.7, "Buster": 0.8, "Janet": 1.8, "Charlie": 2.1, "Stu": 11.7, "Ollie": 0.2, "Bull": 8.1, "Doug": 2.2, "Pam": 0.6, "Sandy": 3, "Crow": 27.1, "Otis": 9.2, "Moe": 1.5, "Penny": 3.2, "Bibi": 11.2, "Emz": 23.9, "Rico": 22.3, "Edgar": 22.8, "Gale": 3.2, "Poco": 3.5, "Fang": 10.9, "Mina": 4.4, "Chester": 14.7, "Gus": 2.6, "Sam": 0.3, "Jacky": 0.6, "R-T": 0.4, "Max": 7.6, "Meg": 21.3, "Ruffs": 3.1, "Tick": 6, "Amber": 2.5, "Lou": 2, "Maisie": 1.1, "Mico": 2, "Kenji": 5.7, "Mortis": 20.6, "Darryl": 2.7, "Spike": 11.5, "Finx": 1, "Nori": 11.4, "Draco": 0.6, "Bonnie": 0.3, "Trunk": 2.1, "Shade": 2.2, "Lola": 0.6, "Lily": 6.3, "Bea": 1.6, "Frank": 4.3, "Gigi": 1.2, "Cordelius": 5.7, "Alli": 3.8, "Larry & Lawrie": 0.4, "Sirius": 3.3, "Buzz": 4.3, "Leon": 11.8, "Meeple": 6.4, "Juju": 0.1, "Brock": 15.1, "El Primo": 2.2, "Gray": 1.1, "Belle": 0.6, "Lumi": 3.3, "Gene": 1.4, "Pierce": 4.8, "Colt": 10.6, "Shelly": 4.9, "Glowy": 0.5, "Melodie": 0.6, "Chuck": 0.7, "Byron": 3.1, "Squeak": 4.1, "Colette": 6.5, "Dynamike": 5, "Grom": 0.8, "Najia": 1.3, "Piper": 2.3, "Kit": 4.1, "Hank": 0.2, "Jae-Yong": 0.2, "Kaze": 3.4, "Barley": 0.5, "Sprout": 0.5, "Mandy": 2.2, "Berry": 4.6, "Ziggy": 0.2, "Willow": 1.1, "Angelo": 0.1, "Nani": 0.8 },
    notes: "Favorisce chi tira da lunga distanza e chi controlla le corsie laterali.",
  },
  {
    mode: "Gem Grab", name: "Gem Fort", sample: 1949673, updated: "2026-09-10",
    winRates: { "Bolt": 65, "Wendy": 62.1, "Ash": 58.1, "Clancy": 58.1, "Rosa": 55.9, "Bo": 55.4, "Jessie": 55.3, "Damian": 54.9, "Doug": 54.4, "Mr. P": 54.3, "Surge": 53.7, "Nita": 53.6, "Tara": 53.6, "R-T": 53.3, "Griff": 53.2, "Pearl": 53, "Starr Nova": 52.7, "Jacky": 52.6, "Carl": 52.4, "Janet": 52.4, "8-Bit": 52, "Buster": 51.9, "Eve": 51.7, "Bibi": 51.6, "Bull": 51.6, "Charlie": 51.5, "Emz": 51, "Edgar": 50.8, "Otis": 50.6, "Crow": 50.5, "Rico": 50.5, "Stu": 50.5, "Ollie": 50.4, "Pam": 50, "Penny": 49.9, "Poco": 49.9, "Sandy": 49.9, "Fang": 49.8, "Lou": 49.7, "Sam": 49.7, "Chester": 49.5, "Darryl": 49.5, "Gale": 49.5, "Trunk": 49.3, "Gus": 49.2, "Draco": 49, "Alli": 48.9, "Mina": 48.9, "Maisie": 48.8, "Mortis": 48.7, "Kenji": 48.6, "Moe": 48.5, "Ruffs": 48.5, "Lily": 48.3, "Meg": 48.3, "Mico": 48.2, "Amber": 48.1, "Shade": 47.9, "Cordelius": 47.8, "Tick": 47.8, "Buzz": 47.7, "Max": 47.6, "Nori": 47.4, "Spike": 47.3, "Finx": 47, "Sirius": 47, "Larry & Lawrie": 46.4, "Bonnie": 46.3, "El Primo": 46.3, "Gigi": 46.3, "Shelly": 46, "Frank": 45.9, "Leon": 45.6, "Brock": 45.3, "Chuck": 45.1, "Grom": 45, "Gray": 44.9, "Bea": 44.5, "Lumi": 44.4, "Lola": 44.3, "Dynamike": 44.2, "Meeple": 44.2, "Belle": 44.1, "Hank": 44.1, "Glowy": 44, "Juju": 43.9, "Kit": 43.9, "Colette": 43.5, "Melodie": 43.2, "Squeak": 43.2, "Pierce": 43.1, "Byron": 42.5, "Colt": 42.3, "Barley": 41.8, "Berry": 41.7, "Gene": 41.7, "Najia": 41.7, "Kaze": 41, "Jae-Yong": 40.8, "Ziggy": 40.8, "Willow": 39.8, "Piper": 39.7, "Mandy": 39.5, "Sprout": 39.5, "Nani": 36.5, "Angelo": 35.7 },
    pickRates: { "Bolt": 7.2, "Wendy": 0.5, "Ash": 3.6, "Clancy": 3.5, "Rosa": 2.1, "Bo": 22.8, "Jessie": 6.9, "Damian": 7.6, "Doug": 4.3, "Mr. P": 0.7, "Surge": 26.1, "Nita": 4.2, "Tara": 22.1, "R-T": 0.7, "Griff": 31.9, "Pearl": 3.4, "Starr Nova": 12.9, "Jacky": 1.2, "Carl": 4.5, "Janet": 1.6, "8-Bit": 8.7, "Buster": 1, "Eve": 0.2, "Bibi": 14.4, "Bull": 12, "Charlie": 2, "Emz": 25, "Edgar": 24.3, "Otis": 8.8, "Crow": 22.8, "Rico": 22.6, "Stu": 9.7, "Ollie": 0.2, "Pam": 0.6, "Penny": 2.4, "Poco": 3.8, "Sandy": 3.2, "Fang": 9.8, "Lou": 2.1, "Sam": 0.4, "Chester": 15.3, "Darryl": 2.9, "Gale": 3.1, "Trunk": 2.9, "Gus": 2.1, "Draco": 0.7, "Alli": 4.6, "Mina": 3.9, "Maisie": 1.1, "Mortis": 19.3, "Kenji": 6.1, "Moe": 0.9, "Ruffs": 2.9, "Lily": 7.9, "Meg": 20.9, "Mico": 1.9, "Amber": 2.3, "Shade": 3.5, "Cordelius": 8.5, "Tick": 5.4, "Buzz": 5, "Max": 6.6, "Nori": 11.2, "Spike": 10.7, "Finx": 0.8, "Sirius": 3.7, "Larry & Lawrie": 0.5, "Bonnie": 0.2, "El Primo": 2.4, "Gigi": 1.2, "Shelly": 6.4, "Frank": 4.6, "Leon": 11, "Brock": 11.7, "Chuck": 0.9, "Grom": 0.8, "Gray": 0.9, "Bea": 1.2, "Lumi": 2.8, "Lola": 0.5, "Dynamike": 4.9, "Meeple": 6, "Belle": 0.4, "Hank": 0.4, "Glowy": 0.5, "Juju": 0.1, "Kit": 4.5, "Colette": 6.2, "Melodie": 0.5, "Squeak": 3.8, "Pierce": 3.4, "Byron": 2.2, "Colt": 8.2, "Barley": 0.6, "Berry": 5.2, "Gene": 0.9, "Najia": 1.1, "Kaze": 3.5, "Jae-Yong": 0.2, "Ziggy": 0.2, "Willow": 1.2, "Piper": 1.6, "Mandy": 1.9, "Sprout": 0.5, "Nani": 0.7, "Angelo": 0.1 },
    notes: "Centro chiuso da muri ad angolo retto con 4 ingressi, due vicini a corsie cespugliose. Amber brucia i cespugli con la Super.",
  },
  {
    mode: "Gem Grab", name: "Double Swoosh", sample: 1945746, updated: "2026-09-10",
    winRates: { "Bolt": 64.4, "Wendy": 59.9, "Clancy": 58.8, "Ash": 57.7, "Rosa": 57.5, "Damian": 55.9, "Bo": 55.6, "Doug": 55, "Nita": 54.9, "Tara": 54.7, "Griff": 54.6, "Mr. P": 54, "Jacky": 53.8, "Emz": 53, "Jessie": 52.9, "Sandy": 52.9, "Surge": 52.9, "Buster": 52.7, "Pearl": 52.6, "R-T": 52.5, "Starr Nova": 52.3, "Bull": 52, "Janet": 51.5, "Ollie": 51.5, "Bibi": 51.3, "Carl": 51, "Crow": 51, "Eve": 50.8, "Charlie": 50.7, "Pam": 50.3, "8-Bit": 50.1, "Chester": 50.1, "Otis": 49.8, "Edgar": 49.5, "Moe": 49.5, "Stu": 49.4, "Poco": 49.2, "Gus": 49.1, "Fang": 48.9, "Gale": 48.8, "Amber": 48.6, "Penny": 48.5, "Trunk": 48.5, "Meg": 48.4, "Kenji": 48.3, "Draco": 48, "Darryl": 47.9, "Sam": 47.9, "Mortis": 47.8, "Lily": 47.7, "Maisie": 47.7, "Lou": 47.6, "Spike": 47.5, "Frank": 47.3, "Alli": 47.2, "Mina": 47.2, "Tick": 47.1, "Cordelius": 47, "Shelly": 47, "Buzz": 46.9, "Max": 46.8, "Ruffs": 46.6, "El Primo": 46.4, "Nori": 46.4, "Finx": 45.5, "Gigi": 45.4, "Mico": 45.2, "Sirius": 45.1, "Rico": 44.9, "Larry & Lawrie": 44.6, "Brock": 44.3, "Gene": 44.2, "Leon": 44.2, "Lumi": 44.2, "Lola": 43.8, "Shade": 43.7, "Bonnie": 43.6, "Colette": 43.3, "Meeple": 42.9, "Dynamike": 42.6, "Gray": 42.6, "Colt": 42.5, "Kit": 42.5, "Melodie": 42.5, "Bea": 42.1, "Juju": 42.1, "Glowy": 41.7, "Hank": 41.2, "Belle": 41.1, "Squeak": 40.9, "Byron": 40.8, "Chuck": 40.7, "Grom": 40.6, "Kaze": 40.1, "Berry": 39.8, "Pierce": 39.8, "Mandy": 38.7, "Jae-Yong": 38.4, "Najia": 38.1, "Barley": 38, "Piper": 37.6, "Willow": 37.3, "Ziggy": 36.2, "Nani": 36.1, "Angelo": 33.9, "Sprout": 33.5 },
    pickRates: { "Bolt": 8.2, "Wendy": 0.5, "Clancy": 4.5, "Ash": 3.6, "Rosa": 4.3, "Damian": 7.8, "Bo": 23.1, "Doug": 5.5, "Nita": 5.7, "Tara": 27.5, "Griff": 34.7, "Mr. P": 0.5, "Jacky": 1.5, "Emz": 29.7, "Jessie": 4.7, "Sandy": 4.7, "Surge": 26.3, "Buster": 1.3, "Pearl": 4.5, "R-T": 0.6, "Starr Nova": 12.7, "Bull": 14.3, "Janet": 1.9, "Ollie": 0.2, "Bibi": 17, "Carl": 4, "Crow": 27.4, "Eve": 0.2, "Charlie": 1.7, "Pam": 0.5, "8-Bit": 6.9, "Chester": 17.4, "Otis": 8.6, "Edgar": 23.2, "Moe": 1.5, "Stu": 8.6, "Poco": 4, "Gus": 1.7, "Fang": 9.3, "Gale": 3, "Amber": 3.5, "Penny": 2.3, "Trunk": 2.9, "Meg": 22, "Kenji": 6.4, "Draco": 0.8, "Darryl": 2.9, "Sam": 0.3, "Mortis": 18.7, "Lily": 7.3, "Maisie": 1, "Lou": 1.5, "Spike": 11, "Frank": 5.4, "Alli": 3.4, "Mina": 3.4, "Tick": 5.2, "Cordelius": 7.2, "Shelly": 8.9, "Buzz": 5.5, "Max": 5.6, "Ruffs": 1.7, "El Primo": 2.7, "Nori": 10.3, "Finx": 0.8, "Gigi": 1.1, "Mico": 1.5, "Sirius": 3.3, "Rico": 10.5, "Larry & Lawrie": 0.4, "Brock": 9.8, "Gene": 1.6, "Leon": 9.7, "Lumi": 3.2, "Lola": 0.5, "Shade": 1.9, "Bonnie": 0.2, "Colette": 6, "Meeple": 5, "Dynamike": 4.6, "Gray": 0.7, "Colt": 7.1, "Kit": 4, "Melodie": 0.5, "Bea": 0.9, "Juju": 0.1, "Glowy": 0.5, "Hank": 0.2, "Belle": 0.3, "Squeak": 3.1, "Byron": 1.8, "Chuck": 0.6, "Grom": 0.6, "Kaze": 3.2, "Berry": 4.5, "Pierce": 2, "Mandy": 1.6, "Jae-Yong": 0.2, "Najia": 0.8, "Barley": 0.5, "Piper": 1.2, "Willow": 1, "Ziggy": 0.1, "Nani": 0.7, "Angelo": 0.1, "Sprout": 0.3 },
    notes: "Molti cespugli su entrambi i lati, vortice al centro, simmetria perfetta.",
  },
  {
    mode: "Gem Grab", name: "Hard Rock Mine", sample: 1943926, updated: "2026-09-10",
    winRates: { "Wendy": 61.4, "Bolt": 60.6, "Ash": 59.2, "Mr. P": 56.9, "Damian": 56.6, "Clancy": 56.3, "Rosa": 56.2, "Bo": 56, "Jessie": 54.4, "Rico": 54, "Surge": 53.7, "Doug": 53.5, "Carl": 53.4, "Bibi": 53.2, "Nita": 53.2, "8-Bit": 53.1, "Jacky": 53, "Shade": 52.8, "Starr Nova": 52.8, "Ollie": 52.7, "Bull": 52.3, "R-T": 52.3, "Eve": 52.1, "Tara": 52.1, "Buster": 51.9, "Pearl": 51.9, "Penny": 51.7, "Griff": 51.6, "Edgar": 51.3, "Sandy": 51.3, "Janet": 51.1, "Charlie": 50.7, "Sam": 50.4, "Pam": 50.3, "Fang": 50.2, "Crow": 50.1, "Emz": 50.1, "Tick": 50, "Stu": 49.9, "Ruffs": 49.7, "Kenji": 49.6, "Lily": 49.5, "Trunk": 49.4, "Lou": 49.3, "Maisie": 49.3, "Otis": 49.3, "Mortis": 49.1, "Gale": 49, "Moe": 49, "Poco": 49, "Buzz": 48.8, "Chester": 48.8, "Darryl": 48.8, "Mina": 48.7, "Nori": 48.7, "Larry & Lawrie": 48.6, "Mico": 48.6, "Alli": 48.5, "Gus": 48.5, "Max": 47.9, "Bonnie": 47.6, "Cordelius": 47.6, "Meg": 47.5, "Spike": 47.5, "Amber": 47.4, "El Primo": 47.4, "Gigi": 47.3, "Finx": 47.1, "Juju": 47.1, "Leon": 47.1, "Sirius": 47.1, "Hank": 46.9, "Draco": 46.4, "Dynamike": 46, "Brock": 45.9, "Grom": 45.7, "Frank": 45.2, "Belle": 45.1, "Meeple": 44.9, "Shelly": 44.9, "Kit": 44.7, "Gray": 44.6, "Lola": 44.4, "Lumi": 44.4, "Bea": 44.2, "Chuck": 43.8, "Gene": 43.6, "Pierce": 43.4, "Barley": 43.3, "Squeak": 43.3, "Melodie": 43.1, "Najia": 42.8, "Byron": 42.6, "Colette": 42.3, "Glowy": 42.1, "Ziggy": 41.9, "Kaze": 41.6, "Sprout": 41.6, "Jae-Yong": 41.5, "Colt": 41.4, "Berry": 41.3, "Mandy": 40.5, "Willow": 40.5, "Piper": 40.4, "Angelo": 37.6, "Nani": 36.3 },
    pickRates: { "Wendy": 0.5, "Bolt": 5.8, "Ash": 3.3, "Mr. P": 0.8, "Damian": 6.6, "Clancy": 2.9, "Rosa": 1.3, "Bo": 24, "Jessie": 6.1, "Rico": 30.2, "Surge": 25.1, "Doug": 2.5, "Carl": 5.3, "Bibi": 12.5, "Nita": 3.6, "8-Bit": 11.2, "Jacky": 0.7, "Shade": 5.2, "Starr Nova": 13.2, "Ollie": 0.2, "Bull": 8.1, "R-T": 0.5, "Eve": 0.3, "Tara": 17.9, "Buster": 0.7, "Pearl": 3.1, "Penny": 4.1, "Griff": 30.8, "Edgar": 23.5, "Sandy": 3.1, "Janet": 1.5, "Charlie": 1.9, "Sam": 0.4, "Pam": 0.6, "Fang": 10.6, "Crow": 24.4, "Emz": 24, "Tick": 7.3, "Stu": 10.7, "Ruffs": 4.5, "Kenji": 6, "Lily": 8.6, "Trunk": 2.5, "Lou": 2, "Maisie": 1, "Otis": 7.3, "Mortis": 20, "Gale": 3, "Moe": 1, "Poco": 3.9, "Buzz": 4.4, "Chester": 11.8, "Darryl": 2.7, "Mina": 3.8, "Nori": 11.4, "Larry & Lawrie": 0.5, "Mico": 1.8, "Alli": 2.5, "Gus": 2.7, "Max": 7.3, "Bonnie": 0.3, "Cordelius": 5.3, "Meg": 19.6, "Spike": 11.1, "Amber": 2.2, "El Primo": 2.3, "Gigi": 1.2, "Finx": 0.9, "Juju": 0.2, "Leon": 12, "Sirius": 3.6, "Hank": 0.3, "Draco": 0.5, "Dynamike": 5.7, "Brock": 14.4, "Grom": 0.9, "Frank": 4, "Belle": 0.6, "Meeple": 6.1, "Shelly": 4.4, "Kit": 5.1, "Gray": 1.1, "Lola": 0.5, "Lumi": 3.1, "Bea": 1.7, "Chuck": 0.7, "Gene": 1.3, "Pierce": 5, "Barley": 0.6, "Squeak": 4.3, "Melodie": 0.5, "Najia": 1.5, "Byron": 3.1, "Colette": 6.4, "Glowy": 0.5, "Ziggy": 0.3, "Kaze": 3.4, "Sprout": 0.5, "Jae-Yong": 0.2, "Colt": 8.7, "Berry": 5, "Mandy": 2.4, "Willow": 1.3, "Piper": 2.6, "Angelo": 0.1, "Nani": 0.8 },
    notes: "Centro aperto con due strisce di boscaglia a \"H\" ai lati. I Controller tengono gli avversari inchiodati vicino allo spawn; tank e mischia si infiltrano dai lati.",
  },
  {
    mode: "Gem Grab", name: "Rustic Arcade", sample: 1838339, updated: "2026-09-10",
    winRates: { "Bolt": 67.7, "Clancy": 58.2, "Mr. P": 57.7, "Bo": 57, "Eve": 56.8, "8-Bit": 56.1, "Damian": 55.1, "Ash": 54.8, "Jessie": 54.8, "Starr Nova": 54.7, "Pearl": 54.6, "Charlie": 53.9, "Stu": 53.8, "Mina": 53.5, "Max": 53.3, "Bonnie": 53.2, "Surge": 53.1, "Carl": 53, "Fang": 52.8, "Griff": 52.4, "Poco": 51.9, "Crow": 51.8, "Pam": 51.7, "Penny": 51.4, "Tara": 51.2, "Ollie": 51.1, "Mortis": 51, "Moe": 50.9, "Meg": 50.8, "Rosa": 50.8, "Buster": 50.6, "Janet": 50.5, "Ruffs": 50.5, "Gale": 50.3, "Lola": 50.3, "Glowy": 50.1, "Otis": 50.1, "Belle": 50, "Sandy": 49.8, "Edgar": 49.7, "Finx": 49.6, "Leon": 49.5, "Nita": 49.5, "Darryl": 49.3, "Bea": 49.1, "Tick": 49, "Brock": 48.8, "Mico": 48.6, "Melodie": 48.5, "Nori": 48.5, "Spike": 48.5, "Emz": 48.4, "Gus": 48.3, "Kenji": 48.2, "R-T": 48.1, "Rico": 48.1, "Chester": 48, "Sam": 48, "Piper": 47.7, "Gray": 47.6, "Lou": 47.6, "Lily": 47.5, "Bibi": 47.4, "Maisie": 47.1, "Pierce": 47.1, "Chuck": 47, "Gigi": 47, "Doug": 46.8, "Byron": 46.4, "Bull": 46.3, "Najia": 46.2, "Gene": 46.1, "Colt": 46, "Meeple": 45.9, "Amber": 45.3, "Angelo": 45, "Jacky": 44.9, "Kit": 44.8, "Grom": 44.7, "Colette": 44.6, "Sirius": 44.6, "Juju": 44.5, "Lumi": 44.2, "Cordelius": 44.1, "Draco": 43.9, "Buzz": 43.8, "Jae-Yong": 43.6, "Trunk": 43.6, "Kaze": 43.4, "Squeak": 43.4, "Larry & Lawrie": 43.3, "Nani": 43.1, "Mandy": 43, "Frank": 42.3, "Alli": 41.4, "Shelly": 40.9, "Dynamike": 40.7, "El Primo": 40.4, "Hank": 40.1, "Ziggy": 39.8, "Sprout": 39.5, "Shade": 38.2, "Berry": 38, "Barley": 37.3, "Willow": 36.6 },
    pickRates: { "Bolt": 10.2, "Clancy": 1.7, "Mr. P": 1, "Bo": 23.3, "Eve": 0.6, "8-Bit": 14.9, "Damian": 3.4, "Ash": 0.5, "Jessie": 5.9, "Starr Nova": 10.2, "Pearl": 3.5, "Charlie": 2.4, "Stu": 13.2, "Mina": 4.7, "Max": 12.1, "Bonnie": 0.9, "Surge": 16.2, "Carl": 6, "Fang": 16.5, "Griff": 23.4, "Poco": 3.2, "Crow": 27.6, "Pam": 0.6, "Penny": 4.4, "Tara": 12.7, "Ollie": 0.1, "Mortis": 18.7, "Moe": 0.7, "Meg": 18.1, "Rosa": 0.3, "Buster": 0.3, "Janet": 1.5, "Ruffs": 2.4, "Gale": 2.7, "Lola": 0.9, "Glowy": 1, "Otis": 7.1, "Belle": 3.7, "Sandy": 1.6, "Edgar": 20.4, "Finx": 1.2, "Leon": 13.6, "Nita": 1.7, "Darryl": 2.1, "Bea": 6.5, "Tick": 8.5, "Brock": 27.6, "Mico": 1.5, "Melodie": 1, "Nori": 10.6, "Spike": 12.9, "Emz": 18, "Gus": 4.5, "Kenji": 3.1, "R-T": 0.5, "Rico": 12.9, "Chester": 6.5, "Sam": 0.2, "Piper": 20.3, "Gray": 2.6, "Lou": 2.4, "Lily": 3.3, "Bibi": 5, "Maisie": 1.2, "Pierce": 16.7, "Chuck": 1.1, "Gigi": 1, "Doug": 1, "Byron": 15.6, "Bull": 2.6, "Najia": 4.2, "Gene": 2.9, "Colt": 18.8, "Meeple": 4.4, "Amber": 1.9, "Angelo": 1, "Jacky": 0.2, "Kit": 3.7, "Grom": 1.3, "Colette": 8.5, "Sirius": 2.6, "Juju": 0.1, "Lumi": 2.1, "Cordelius": 1.6, "Draco": 0.3, "Buzz": 2.3, "Jae-Yong": 0.4, "Trunk": 0.7, "Kaze": 2.9, "Squeak": 5.9, "Larry & Lawrie": 0.3, "Nani": 4.6, "Mandy": 6.8, "Frank": 2.9, "Alli": 0.4, "Shelly": 2.4, "Dynamike": 3.9, "El Primo": 1.1, "Hank": 0.1, "Ziggy": 0.3, "Sprout": 0.5, "Shade": 0.8, "Berry": 4.3, "Barley": 0.4, "Willow": 0.8 },
    notes: "Centro esagonale con muri verso il centro e cespugli sul lato opposto.",
  },
  {
    mode: "Gem Grab", name: "Crystal Arcade", sample: 1564640, updated: "2026-09-10",
    winRates: { "Bolt": 65.8, "Clancy": 59.5, "Ash": 58.4, "Mr. P": 57.3, "Bo": 56.4, "Damian": 56.4, "Jessie": 55.2, "Surge": 54.6, "Starr Nova": 54.5, "Eve": 54.2, "Griff": 53.8, "Carl": 53.6, "Nita": 53.6, "Rosa": 53.6, "Ollie": 53.4, "8-Bit": 53.2, "Tara": 52.8, "Buster": 52.7, "Pearl": 52.6, "Sandy": 52.4, "Charlie": 51.8, "Janet": 51.5, "Doug": 51.3, "Fang": 51.3, "Crow": 51.2, "Pam": 50.9, "Penny": 50.9, "Emz": 50.8, "Stu": 50.8, "Bibi": 50.7, "Poco": 50.7, "R-T": 50.7, "Bull": 50.5, "Edgar": 50.4, "Mina": 50.3, "Moe": 50.3, "Gale": 50, "Otis": 50, "Jacky": 49.8, "Ruffs": 49.8, "Mortis": 49.7, "Darryl": 49.6, "Tick": 49.6, "Kenji": 49.5, "Chester": 49.2, "Meg": 49.2, "Bonnie": 49, "Trunk": 49, "Max": 48.9, "Lou": 48.7, "Maisie": 48.7, "Lily": 48.6, "Nori": 48.5, "Rico": 48.5, "Mico": 48.4, "Finx": 48.3, "Sam": 48.2, "Spike": 47.8, "Larry & Lawrie": 47.7, "Gigi": 47.2, "Cordelius": 47, "Leon": 46.8, "Buzz": 46.7, "Draco": 46.7, "Sirius": 46.7, "Bea": 46.6, "Brock": 46.4, "Lola": 46.3, "Belle": 46.1, "Juju": 46.1, "Hank": 45.5, "Grom": 45.3, "Frank": 45.2, "Glowy": 45.2, "Lumi": 45.2, "Meeple": 45, "Melodie": 44.9, "Alli": 44.8, "Gus": 44.7, "Gray": 44.5, "Dynamike": 44.3, "Gene": 44.3, "Byron": 44.2, "Chuck": 44.2, "Colt": 44.2, "Pierce": 44.2, "Shade": 44.1, "Kit": 44, "Najia": 43.9, "Amber": 43.8, "Kaze": 43.7, "Shelly": 43.7, "Colette": 43.6, "Squeak": 43, "Piper": 42.3, "Jae-Yong": 42.1, "El Primo": 41.8, "Willow": 41.6, "Barley": 41.1, "Ziggy": 40.5, "Mandy": 40.4, "Berry": 40.2, "Sprout": 40.1, "Nani": 37.9, "Angelo": 37.2 },
    pickRates: { "Bolt": 7.4, "Clancy": 3.1, "Ash": 1.8, "Mr. P": 0.9, "Bo": 22.3, "Damian": 6.5, "Jessie": 6.6, "Surge": 25, "Starr Nova": 13.5, "Eve": 0.3, "Griff": 31.2, "Carl": 5.3, "Nita": 4.1, "Rosa": 1.2, "Ollie": 0.2, "8-Bit": 10.2, "Tara": 21.7, "Buster": 0.7, "Pearl": 2.7, "Sandy": 3.4, "Charlie": 1.9, "Janet": 1.4, "Doug": 2.3, "Fang": 12.2, "Crow": 26.1, "Pam": 0.6, "Penny": 4.1, "Emz": 25.9, "Stu": 10.3, "Bibi": 11.7, "Poco": 4.1, "R-T": 0.5, "Bull": 6.7, "Edgar": 23.5, "Mina": 3.7, "Moe": 1.1, "Gale": 3.2, "Otis": 7, "Jacky": 0.6, "Ruffs": 2.6, "Mortis": 20.2, "Darryl": 2.9, "Tick": 8.6, "Kenji": 6, "Chester": 11.7, "Meg": 24.1, "Bonnie": 0.4, "Trunk": 0.9, "Max": 6.7, "Lou": 2.1, "Maisie": 1.1, "Lily": 6.7, "Nori": 9.6, "Rico": 15.4, "Mico": 2.1, "Finx": 1, "Sam": 0.3, "Spike": 12.4, "Larry & Lawrie": 0.6, "Gigi": 1.1, "Cordelius": 5.2, "Leon": 12.5, "Buzz": 3.8, "Draco": 0.6, "Sirius": 4.1, "Bea": 2.1, "Brock": 16.7, "Lola": 0.6, "Belle": 0.8, "Juju": 0.2, "Hank": 0.4, "Grom": 1.3, "Frank": 4.8, "Glowy": 0.6, "Lumi": 3, "Meeple": 5.3, "Melodie": 0.7, "Alli": 1.9, "Gus": 1.8, "Gray": 1.3, "Dynamike": 7.7, "Gene": 1.3, "Byron": 4.1, "Chuck": 0.8, "Colt": 11.8, "Pierce": 5.4, "Shade": 2.7, "Kit": 4.9, "Najia": 1.9, "Amber": 1.8, "Kaze": 2.1, "Shelly": 4.6, "Colette": 7.1, "Squeak": 5, "Piper": 3.7, "Jae-Yong": 0.2, "El Primo": 1.7, "Willow": 0.6, "Barley": 0.8, "Ziggy": 0.3, "Mandy": 3, "Berry": 6.9, "Sprout": 0.6, "Nani": 1.2, "Angelo": 0.2 },
    notes: "Aggiunta il 6/9. Una versione precedente dell'app l'aveva tolta perché ritenuta fuori pool: risulta invece tracciata e con dati recenti.",
  },
  {
    mode: "Gem Grab", name: "Deathcap Trap", sample: 1556449, updated: "2026-09-10",
    winRates: { "Bolt": 63.6, "Clancy": 57.4, "Ash": 57, "Bo": 56.7, "Mr. P": 56.6, "Damian": 56.4, "Eve": 55.9, "Jessie": 55.8, "8-Bit": 54.9, "Surge": 54.8, "Starr Nova": 54.7, "Ollie": 54.6, "Penny": 54.1, "Carl": 53.9, "Pearl": 52.8, "Rosa": 52.5, "Griff": 52.3, "Tick": 51.9, "Tara": 51.8, "Stu": 51.7, "Janet": 51.6, "Nita": 51.6, "Pam": 51.6, "Buster": 51.5, "Moe": 51.5, "Charlie": 51.4, "Crow": 51.2, "Edgar": 51.2, "Sandy": 51.1, "Bull": 51, "Poco": 51, "Bibi": 50.8, "Mina": 50.5, "R-T": 50.4, "Gale": 50.3, "Ruffs": 50.3, "Emz": 50.2, "Fang": 50.2, "Otis": 49.9, "Doug": 49.8, "Mortis": 49.7, "Bonnie": 49.6, "Mico": 49.5, "Lou": 49.4, "Sam": 49.3, "Kenji": 49.1, "Maisie": 49.1, "Max": 49.1, "Nori": 49.1, "Meg": 48.9, "Darryl": 48.6, "Chester": 48.4, "Gigi": 48.4, "Lily": 48.4, "Larry & Lawrie": 48.3, "Rico": 48.3, "Spike": 48.3, "Juju": 48, "Finx": 47.9, "Leon": 47.9, "Jacky": 47.4, "Trunk": 47.3, "Meeple": 47.2, "Draco": 47.1, "Sirius": 47.1, "Cordelius": 46.9, "Hank": 46.8, "Belle": 46.6, "Gray": 46.6, "Bea": 46.4, "Buzz": 46.3, "Lola": 46.3, "Grom": 46.2, "Brock": 46.1, "Shade": 45.8, "Gus": 45.6, "Gene": 45.3, "Ziggy": 45.3, "Najia": 45.2, "Dynamike": 45.1, "Frank": 44.9, "Pierce": 44.9, "Chuck": 44.8, "Lumi": 44.8, "Barley": 44.6, "Amber": 44.5, "Squeak": 44.5, "Kit": 44.4, "Melodie": 44.3, "Colt": 44.2, "Alli": 44, "Byron": 43.8, "Glowy": 43.6, "Kaze": 43.5, "Piper": 43.1, "Colette": 42.9, "Jae-Yong": 42.9, "Willow": 42.5, "Shelly": 42.3, "Mandy": 42.2, "Sprout": 42, "El Primo": 41.3, "Berry": 40.8, "Angelo": 38.5, "Nani": 37.4 },
    pickRates: { "Bolt": 6.8, "Clancy": 2.9, "Ash": 1.2, "Bo": 24.6, "Mr. P": 1, "Damian": 5.9, "Eve": 0.3, "Jessie": 7, "8-Bit": 11.4, "Surge": 23.4, "Starr Nova": 13.3, "Ollie": 0.2, "Penny": 6, "Carl": 5.4, "Pearl": 2.8, "Rosa": 0.6, "Griff": 31.3, "Tick": 10.2, "Tara": 20.1, "Stu": 10.6, "Janet": 1.6, "Nita": 3.3, "Pam": 0.7, "Buster": 0.6, "Moe": 1.1, "Charlie": 2.1, "Crow": 28.6, "Edgar": 23.4, "Sandy": 3, "Bull": 5.4, "Poco": 4.4, "Bibi": 9.8, "Mina": 3.9, "R-T": 0.4, "Gale": 3.3, "Ruffs": 2.6, "Emz": 25.4, "Fang": 12.6, "Otis": 7.3, "Doug": 1.7, "Mortis": 20.2, "Bonnie": 0.5, "Mico": 2.1, "Lou": 2.3, "Sam": 0.3, "Kenji": 5.5, "Maisie": 1.1, "Max": 7.3, "Nori": 9.7, "Meg": 23.9, "Darryl": 2.7, "Chester": 10.9, "Gigi": 1.1, "Lily": 6.3, "Larry & Lawrie": 0.6, "Rico": 12.7, "Spike": 13.2, "Juju": 0.2, "Finx": 1.1, "Leon": 12.9, "Jacky": 0.4, "Trunk": 0.6, "Meeple": 5.6, "Draco": 0.5, "Sirius": 4.1, "Cordelius": 3.8, "Hank": 0.3, "Belle": 1, "Gray": 1.5, "Bea": 2.4, "Buzz": 3.5, "Lola": 0.7, "Grom": 1.4, "Brock": 18.5, "Shade": 2, "Gus": 2.1, "Gene": 1.6, "Ziggy": 0.4, "Najia": 2.3, "Dynamike": 7.1, "Frank": 4.5, "Pierce": 6.5, "Chuck": 0.8, "Lumi": 3, "Barley": 0.8, "Amber": 1.9, "Squeak": 5.3, "Kit": 4.7, "Melodie": 0.7, "Colt": 12.8, "Alli": 1, "Byron": 4.7, "Glowy": 0.6, "Kaze": 2, "Piper": 4.2, "Colette": 7.7, "Jae-Yong": 0.3, "Willow": 0.5, "Shelly": 3.8, "Mandy": 3.4, "Sprout": 0.7, "El Primo": 1.5, "Berry": 6.7, "Angelo": 0.2, "Nani": 1.3 },
    notes: "Funghi e cespugli attorno al centro, corsie laterali lunghe.",
  },
  {
    mode: "Gem Grab", name: "Flooded Mine", sample: 25976, updated: "2026-09-10",
    winRates: { "Bolt": 63.5, "Mr. P": 61.7, "Damian": 60.8, "Ash": 59.6, "Moe": 58, "Starr Nova": 57.8, "Pam": 57, "8-Bit": 56.4, "Surge": 56.4, "Clancy": 56, "Ollie": 54.9, "Griff": 54.4, "Jessie": 54.2, "Bo": 54, "Sandy": 54, "Eve": 53.8, "Lola": 53.6, "Buster": 53.5, "Crow": 53.5, "Nita": 52.6, "Tara": 52.5, "Rosa": 52.3, "Bonnie": 52.1, "Pearl": 52.1, "Trunk": 52.1, "Alli": 51.8, "Charlie": 51.8, "Emz": 51.7, "Gale": 51.1, "Carl": 50.9, "Lou": 50.8, "Fang": 50.5, "Bibi": 50.3, "Kenji": 50.3, "Stu": 50.1, "Edgar": 50, "Bull": 49.8, "Janet": 49.8, "Meg": 49.8, "Otis": 49.6, "Frank": 49, "Mortis": 48.9, "Maisie": 48.8, "Mina": 48.8, "Juju": 48.6, "Max": 48.5, "Tick": 48.4, "Spike": 48.3, "Doug": 48.2, "Glowy": 48, "Shelly": 47.9, "Sirius": 47.9, "Chester": 47.6, "R-T": 47.4, "Lumi": 47.3, "Finx": 47.2, "Mico": 47, "Penny": 46.8, "Colt": 46.7, "Darryl": 46.7, "Gigi": 46.5, "Kit": 46.4, "Cordelius": 46.1, "Lily": 45.9, "Kaze": 45.8, "Poco": 45.6, "Barley": 45.3, "Buzz": 44.8, "Brock": 44.7, "Rico": 44.5, "Meeple": 44.2, "Ruffs": 44.1, "Amber": 43.4, "Jae-Yong": 43.3, "Pierce": 43.3, "Byron": 43.2, "Bea": 43, "Leon": 42.9, "Gene": 42.8, "Belle": 42.2, "Najia": 42.1, "Gus": 42, "Colette": 41.8, "Angelo": 41.7, "Grom": 41.3, "Shade": 41.1, "Berry": 40.6, "Gray": 40.6, "El Primo": 40.3, "Dynamike": 40, "Mandy": 39.9, "Melodie": 39.2, "Draco": 39.1, "Squeak": 38.9, "Piper": 38.7, "Sprout": 37.3, "Willow": 36.9, "Nani": 35.6, "Chuck": 35 },
    pickRates: { "Bolt": 9.6, "Mr. P": 0.7, "Damian": 9.9, "Ash": 1.2, "Moe": 1, "Starr Nova": 14.5, "Pam": 0.6, "8-Bit": 12, "Surge": 26.6, "Clancy": 4.1, "Ollie": 0.4, "Griff": 31, "Jessie": 4.1, "Bo": 24.8, "Sandy": 3.3, "Eve": 1.8, "Lola": 0.6, "Buster": 0.9, "Crow": 33, "Nita": 2.6, "Tara": 24.4, "Rosa": 1.3, "Bonnie": 0.5, "Pearl": 1.9, "Trunk": 0.6, "Alli": 7.3, "Charlie": 3, "Emz": 17.1, "Gale": 2.7, "Carl": 5.1, "Lou": 2.1, "Fang": 13.2, "Bibi": 8.7, "Kenji": 5.8, "Stu": 8.5, "Edgar": 22.4, "Bull": 5.7, "Janet": 1.9, "Meg": 28.8, "Otis": 10.3, "Frank": 2.5, "Mortis": 23.6, "Maisie": 1.2, "Mina": 5.6, "Juju": 1, "Max": 7.6, "Tick": 6.1, "Spike": 10, "Doug": 1.5, "Glowy": 0.8, "Shelly": 2.4, "Sirius": 3.7, "Chester": 13.6, "R-T": 0.5, "Lumi": 4, "Finx": 1.4, "Mico": 2.3, "Penny": 3.8, "Colt": 13.7, "Darryl": 2.3, "Gigi": 1.1, "Kit": 5.9, "Cordelius": 4.6, "Lily": 8.2, "Kaze": 2.5, "Poco": 3.7, "Barley": 0.6, "Buzz": 3, "Brock": 13.1, "Rico": 7.6, "Meeple": 5.2, "Ruffs": 2.1, "Amber": 1.5, "Jae-Yong": 0.4, "Pierce": 8.7, "Byron": 5.1, "Bea": 2.3, "Leon": 12.1, "Gene": 2.1, "Belle": 1, "Najia": 3.2, "Gus": 2.1, "Colette": 9.6, "Angelo": 1.6, "Grom": 0.7, "Shade": 2.5, "Berry": 6, "Gray": 1.1, "El Primo": 1.2, "Dynamike": 4.2, "Mandy": 2.7, "Melodie": 0.7, "Draco": 0.7, "Squeak": 3, "Piper": 4, "Sprout": 0.4, "Willow": 0.4, "Nani": 1, "Chuck": 1.5 },
    notes: "Acqua e binari: passaggi obbligati, poche vie di fuga.",
  },
  {
    mode: "Gem Grab", name: "Lilygear Lake", sample: 25925, updated: "2026-09-10",
    winRates: { "Bolt": 66, "8-Bit": 57.1, "Ash": 56.8, "Pearl": 56.5, "Damian": 56, "Bo": 55.9, "Clancy": 55.8, "Lola": 55.7, "Starr Nova": 55.6, "Eve": 55.4, "Mr. P": 55.3, "Rosa": 54.7, "Crow": 54.6, "Jessie": 54.2, "Surge": 53.9, "Pam": 53.3, "Griff": 52.6, "Bonnie": 52.3, "Charlie": 52.3, "Chuck": 52.2, "Carl": 52, "Otis": 51.9, "Buster": 51.8, "Ruffs": 51.8, "Draco": 51.7, "Nita": 51, "Alli": 50.9, "Lou": 50.7, "Mina": 50.7, "Tara": 50.7, "Gigi": 50.6, "Meg": 50.6, "Fang": 50.2, "Juju": 50.1, "Max": 49.9, "Penny": 49.7, "Belle": 49.6, "Edgar": 49.6, "Maisie": 49.6, "Spike": 49.3, "Finx": 49.1, "Chester": 48.9, "Moe": 48.6, "Sandy": 48.4, "Lily": 48.3, "Mico": 48.3, "Poco": 48.3, "Brock": 48.1, "Stu": 48.1, "Bibi": 48, "Bull": 48, "Lumi": 47.9, "Rico": 47.8, "Mortis": 47.7, "Kenji": 47.6, "Tick": 47.6, "Glowy": 47, "Gus": 47, "Pierce": 46.9, "Darryl": 46.7, "Emz": 46.7, "Janet": 46.5, "Kit": 46.5, "Leon": 46.4, "Byron": 46.2, "Amber": 46, "Gene": 46, "Gray": 46, "Meeple": 45.7, "Angelo": 45.6, "Mandy": 45.2, "Doug": 45, "Kaze": 44.9, "Bea": 44.8, "Piper": 44.8, "Colt": 44.1, "Colette": 43.7, "Cordelius": 43.1, "Squeak": 43.1, "Najia": 43, "Nani": 42.4, "R-T": 42.4, "Trunk": 42.3, "Shade": 42.1, "Dynamike": 41.9, "Gale": 41.4, "Sirius": 41.4, "Frank": 40.7, "Buzz": 40.5, "Melodie": 40.5, "Jae-Yong": 40.2, "Shelly": 40.2, "Grom": 39.7, "Berry": 39.4, "El Primo": 37.4 },
    pickRates: { "Bolt": 11.6, "8-Bit": 13.8, "Ash": 0.7, "Pearl": 2.2, "Damian": 7.4, "Bo": 26.3, "Clancy": 3.3, "Lola": 0.9, "Starr Nova": 12.8, "Eve": 6.7, "Mr. P": 0.9, "Rosa": 1, "Crow": 36.1, "Jessie": 4, "Surge": 22.9, "Pam": 0.6, "Griff": 24.7, "Bonnie": 0.6, "Charlie": 3.1, "Chuck": 1.5, "Carl": 5.4, "Otis": 11, "Buster": 0.4, "Ruffs": 1.9, "Draco": 0.5, "Nita": 1.8, "Alli": 11, "Lou": 2.5, "Mina": 5.1, "Tara": 20.9, "Gigi": 1, "Meg": 26.5, "Fang": 14.9, "Juju": 5, "Max": 8.5, "Penny": 4.2, "Belle": 1.6, "Edgar": 21.5, "Maisie": 0.9, "Spike": 9.8, "Finx": 1.3, "Chester": 11.6, "Moe": 0.8, "Sandy": 1.9, "Lily": 7.6, "Mico": 1.9, "Poco": 3.2, "Brock": 13.4, "Stu": 7, "Bibi": 6, "Bull": 4.5, "Lumi": 3.7, "Rico": 9.1, "Mortis": 22.5, "Kenji": 4.4, "Tick": 5.6, "Glowy": 0.9, "Gus": 2.9, "Pierce": 12.2, "Darryl": 2.5, "Emz": 14.2, "Janet": 1.9, "Kit": 5.6, "Leon": 12.6, "Byron": 7.6, "Amber": 1.7, "Gene": 2.5, "Gray": 1.2, "Meeple": 4.5, "Angelo": 8, "Mandy": 3.1, "Doug": 1.3, "Kaze": 2.5, "Bea": 3.2, "Piper": 6, "Colt": 13.5, "Colette": 9.9, "Cordelius": 3.3, "Squeak": 3.1, "Najia": 4.1, "Nani": 1.7, "R-T": 0.6, "Trunk": 0.5, "Shade": 4.3, "Dynamike": 2.6, "Gale": 2.4, "Sirius": 2.6, "Frank": 1.9, "Buzz": 2.5, "Melodie": 0.7, "Jae-Yong": 0.4, "Shelly": 2.2, "Grom": 0.7, "Berry": 5.3, "El Primo": 0.8 },
    notes: "Lago centrale con ninfee: il centro si attraversa solo dai lati.",
  },
  // ---------- Brawl Ball ----------
  {
    mode: "Brawl Ball", name: "Sneaky Fields", sample: 1973903, updated: "2026-09-10",
    winRates: { "Jacky": 60.5, "Rosa": 57.9, "Ash": 57.7, "R-T": 57.6, "Doug": 56.8, "Wendy": 56.6, "Nita": 55.8, "Griff": 55.4, "Bibi": 55.3, "Damian": 54.8, "Clancy": 53.9, "Frank": 53.8, "Bull": 53.7, "Emz": 52.5, "Rico": 52.5, "Sandy": 52, "Tara": 51.9, "Buster": 51.8, "Gus": 51.7, "Carl": 51.4, "Sam": 51.4, "Maisie": 51.3, "Lou": 51.2, "Otis": 51.2, "Gale": 50.8, "Surge": 50.7, "Tick": 50.7, "Jessie": 50.5, "El Primo": 50.3, "Poco": 50.2, "Edgar": 49.7, "Ollie": 49.6, "Charlie": 49.5, "Cordelius": 48.9, "Bo": 48.8, "Chester": 48.8, "Amber": 48.6, "Buzz": 48.6, "Larry & Lawrie": 48.6, "Trunk": 48.5, "Moe": 48.4, "8-Bit": 48.1, "Shade": 48, "Dynamike": 47.9, "Sirius": 47.8, "Starr Nova": 47.8, "Darryl": 47.7, "Lumi": 47.7, "Fang": 47.5, "Spike": 47.5, "Shelly": 47.3, "Kenji": 47.2, "Meg": 47.1, "Bea": 46.7, "Willow": 46.7, "Pearl": 46.5, "Bolt": 46.1, "Stu": 45.9, "Hank": 45.7, "Barley": 45.5, "Gigi": 45.5, "Pam": 45.5, "Crow": 45.4, "Max": 45.2, "Meeple": 45.1, "Draco": 45, "Grom": 44.9, "Nori": 44.4, "Alli": 44.3, "Janet": 44.2, "Juju": 43.3, "Penny": 43.1, "Ruffs": 43.1, "Colette": 43, "Finx": 43, "Colt": 42.8, "Eve": 42.7, "Mr. P": 42.7, "Brock": 42.4, "Pierce": 42.4, "Ziggy": 42.3, "Mina": 41.8, "Lily": 41.3, "Bonnie": 40.9, "Mortis": 40.8, "Berry": 40.7, "Melodie": 40.4, "Leon": 39.7, "Kit": 39.4, "Glowy": 39.3, "Byron": 39.2, "Squeak": 39.1, "Najia": 38.8, "Belle": 38.5, "Lola": 38.3, "Jae-Yong": 37.9, "Gray": 37.8, "Kaze": 37.7, "Mico": 37.2, "Sprout": 36.9, "Mandy": 35.8, "Gene": 33.9, "Piper": 33.5, "Nani": 33.2, "Chuck": 31.8, "Angelo": 27.7 },
    pickRates: { "Jacky": 5.5, "Rosa": 3.2, "Ash": 4.6, "R-T": 1, "Doug": 10.7, "Wendy": 0.4, "Nita": 11.5, "Griff": 37.5, "Bibi": 29.5, "Damian": 12.1, "Clancy": 3.9, "Frank": 19.4, "Bull": 27.8, "Emz": 28.5, "Rico": 27.3, "Sandy": 1.7, "Tara": 16.6, "Buster": 0.9, "Gus": 1.2, "Carl": 3.1, "Sam": 0.6, "Maisie": 1.6, "Lou": 1.6, "Otis": 7.8, "Gale": 5.3, "Surge": 25.8, "Tick": 4, "Jessie": 2.5, "El Primo": 11.9, "Poco": 3.3, "Edgar": 25.4, "Ollie": 0.3, "Charlie": 0.7, "Cordelius": 7.7, "Bo": 7.1, "Chester": 17.6, "Amber": 1.7, "Buzz": 7.5, "Larry & Lawrie": 0.5, "Trunk": 4.8, "Moe": 1.2, "8-Bit": 2.8, "Shade": 6.6, "Dynamike": 9.5, "Sirius": 3.8, "Starr Nova": 10, "Darryl": 5, "Lumi": 4.6, "Fang": 7, "Spike": 9.3, "Shelly": 20.6, "Kenji": 6.9, "Meg": 17.7, "Bea": 0.6, "Willow": 3, "Pearl": 2, "Bolt": 2.2, "Stu": 7.7, "Hank": 0.7, "Barley": 0.9, "Gigi": 1.2, "Pam": 0.2, "Crow": 8.3, "Max": 4.9, "Meeple": 3.9, "Draco": 0.9, "Grom": 0.5, "Nori": 8.8, "Alli": 2.2, "Janet": 0.2, "Juju": 0.1, "Penny": 0.8, "Ruffs": 2.4, "Colette": 5.9, "Finx": 0.3, "Colt": 9.7, "Eve": 0.1, "Mr. P": 0.1, "Brock": 7.5, "Pierce": 1.4, "Ziggy": 0.2, "Mina": 2.5, "Lily": 1.5, "Bonnie": 0.1, "Mortis": 12.5, "Berry": 3.7, "Melodie": 0.9, "Leon": 2.5, "Kit": 2.2, "Glowy": 0.3, "Byron": 0.5, "Squeak": 1.6, "Najia": 0.3, "Belle": 0.1, "Lola": 0.2, "Jae-Yong": 0.1, "Gray": 0.4, "Kaze": 2.3, "Mico": 0.5, "Sprout": 0.5, "Mandy": 0.7, "Gene": 0.1, "Piper": 0.3, "Nani": 0.4, "Chuck": 0.1, "Angelo": 0 },
    notes: "Caos pieno di cespugli.",
  },
  {
    mode: "Brawl Ball", name: "Triple Dribble", sample: 1969517, updated: "2026-09-10",
    winRates: { "Jacky": 59.4, "Wendy": 58.8, "Larry & Lawrie": 58.3, "Ash": 56.7, "Bibi": 55.6, "Tick": 55.6, "Damian": 55.5, "Doug": 55.5, "R-T": 55.2, "Nita": 54.5, "Dynamike": 54.4, "Clancy": 54.3, "Willow": 54, "Shade": 53.6, "Barley": 53.5, "Surge": 53.2, "Juju": 53.1, "Hank": 53, "Lou": 52.8, "Sam": 52.6, "Griff": 52.5, "Maisie": 52.3, "Ollie": 52.3, "Carl": 52.2, "Frank": 51.8, "Edgar": 51.6, "Emz": 51.6, "Gus": 51.6, "El Primo": 51.1, "Rico": 51, "Sirius": 51, "Bull": 50.9, "Buster": 50.8, "Rosa": 50.8, "Sandy": 50.8, "Kenji": 50.6, "Jessie": 50.2, "Starr Nova": 49.9, "Tara": 49.9, "Cordelius": 49.8, "Ziggy": 49.8, "Amber": 49.7, "Grom": 49.7, "Buzz": 49.4, "Gale": 49.3, "Otis": 49.3, "Stu": 48.9, "Moe": 48.8, "Charlie": 48.5, "Lumi": 48.4, "Meeple": 48.4, "Trunk": 48.2, "Fang": 48, "Nori": 47.7, "Chester": 47.6, "Poco": 47.6, "Spike": 47.4, "Darryl": 47.1, "Gigi": 47.1, "Meg": 46.7, "Bo": 46.2, "Max": 46.2, "Mr. P": 45.9, "Bolt": 45.6, "Pearl": 45.5, "Mina": 45, "Draco": 44.9, "Bea": 44.7, "8-Bit": 44.6, "Crow": 44.5, "Eve": 44.2, "Ruffs": 44.1, "Brock": 44, "Penny": 44, "Najia": 43.9, "Shelly": 43.6, "Pierce": 43.3, "Mortis": 43.1, "Lily": 42.6, "Bonnie": 42.4, "Berry": 42.3, "Finx": 42.3, "Colette": 42.2, "Melodie": 42.2, "Mico": 42.2, "Sprout": 42.2, "Gray": 41.9, "Pam": 41.8, "Kit": 41.2, "Colt": 41.1, "Leon": 40.8, "Janet": 40.7, "Squeak": 40.2, "Kaze": 39.8, "Byron": 38.9, "Lola": 38.7, "Belle": 38.5, "Glowy": 38.4, "Jae-Yong": 37.8, "Alli": 37.4, "Mandy": 36.3, "Piper": 33.5, "Gene": 32.4, "Chuck": 32.3, "Nani": 30.6, "Angelo": 26.1 },
    pickRates: { "Jacky": 3.8, "Wendy": 0.5, "Larry & Lawrie": 2.2, "Ash": 2.9, "Bibi": 28.5, "Tick": 5.6, "Damian": 11.2, "Doug": 5.9, "R-T": 0.6, "Nita": 9.3, "Dynamike": 20.9, "Clancy": 3.4, "Willow": 9.1, "Shade": 12.6, "Barley": 4.4, "Surge": 29, "Juju": 0.6, "Hank": 2.2, "Lou": 1.7, "Sam": 0.6, "Griff": 35, "Maisie": 1.8, "Ollie": 0.4, "Carl": 3.9, "Frank": 15.6, "Edgar": 25.4, "Emz": 26.8, "Gus": 1.3, "El Primo": 9.8, "Rico": 25.1, "Sirius": 5.8, "Bull": 18.2, "Buster": 0.7, "Rosa": 0.8, "Sandy": 1.5, "Kenji": 8.3, "Jessie": 2.5, "Starr Nova": 11.9, "Tara": 12, "Cordelius": 6.8, "Ziggy": 0.8, "Amber": 1.6, "Grom": 1, "Buzz": 6.4, "Gale": 5.6, "Otis": 6.5, "Stu": 11.8, "Moe": 1.3, "Charlie": 0.8, "Lumi": 5.3, "Meeple": 8.1, "Trunk": 3.9, "Fang": 7.6, "Nori": 9.9, "Chester": 13.8, "Poco": 2.8, "Spike": 9.5, "Darryl": 4.6, "Gigi": 1.3, "Meg": 18.2, "Bo": 5.4, "Max": 5.9, "Mr. P": 0.2, "Bolt": 2.3, "Pearl": 1.6, "Mina": 4.2, "Draco": 0.8, "Bea": 0.7, "8-Bit": 2.2, "Crow": 8.6, "Eve": 0.1, "Ruffs": 2.5, "Brock": 7.2, "Penny": 0.9, "Najia": 0.7, "Shelly": 11.3, "Pierce": 1.5, "Mortis": 15.7, "Lily": 1.4, "Bonnie": 0.1, "Berry": 6.7, "Finx": 0.3, "Colette": 5.6, "Melodie": 1.2, "Mico": 1.1, "Sprout": 0.8, "Gray": 0.6, "Pam": 0.2, "Kit": 2.5, "Colt": 7.7, "Leon": 2.9, "Janet": 0.1, "Squeak": 1.8, "Kaze": 2.6, "Byron": 0.5, "Lola": 0.2, "Belle": 0.1, "Glowy": 0.3, "Jae-Yong": 0.1, "Alli": 0.5, "Mandy": 0.7, "Piper": 0.3, "Gene": 0.1, "Chuck": 0.2, "Nani": 0.4, "Angelo": 0.1 },
    notes: "Barriere centrali, gruppi di casse, apertura del goal stretta.",
  },
  {
    mode: "Brawl Ball", name: "Pinball Dreams", sample: 1968457, updated: "2026-09-10",
    winRates: { "Wendy": 60.4, "Ash": 58.5, "Jacky": 56.3, "Clancy": 55.9, "Damian": 55.3, "Larry & Lawrie": 55.2, "Griff": 55.1, "Bibi": 55, "R-T": 54.8, "Shade": 54.7, "Sam": 53.5, "Tick": 53.5, "Doug": 53.4, "Jessie": 53.3, "Frank": 53.1, "Surge": 53.1, "Buster": 53, "Carl": 53, "Nita": 53, "Ollie": 53, "Rico": 52.5, "Hank": 52.1, "Maisie": 52, "8-Bit": 51.4, "Edgar": 51.4, "Sandy": 51.4, "Gus": 51.3, "Starr Nova": 51.3, "Bull": 51.2, "Poco": 51.2, "Juju": 51.1, "Bo": 51, "Tara": 51, "Rosa": 50.9, "Emz": 50.8, "Gale": 50.7, "Barley": 50.6, "Dynamike": 50.4, "Lou": 50, "Willow": 50, "Otis": 49.9, "Charlie": 49.8, "El Primo": 49.8, "Cordelius": 49.7, "Kenji": 49.7, "Sirius": 49.7, "Bolt": 49.6, "Stu": 49.6, "Fang": 49.5, "Pearl": 49.4, "Grom": 49.3, "Mr. P": 49.2, "Amber": 49.1, "Chester": 49, "Buzz": 48.7, "Moe": 48.6, "Darryl": 48.4, "Meg": 48.1, "Nori": 48.1, "Bea": 48, "Penny": 48, "Spike": 47.9, "Ziggy": 47.9, "Meeple": 47.7, "Trunk": 47.6, "Brock": 47.5, "Gigi": 47.2, "Max": 46.9, "Eve": 46.8, "Pam": 46.8, "Crow": 46.6, "Draco": 46.2, "Bonnie": 46.1, "Mina": 45.5, "Najia": 45.4, "Lumi": 45.2, "Pierce": 45.1, "Colt": 44.9, "Lily": 44.9, "Ruffs": 44.8, "Finx": 44.7, "Mortis": 44.7, "Janet": 44.5, "Shelly": 43.5, "Colette": 43, "Mico": 43, "Sprout": 42.4, "Gray": 42.1, "Melodie": 42.1, "Leon": 42, "Byron": 41.9, "Belle": 41.5, "Kit": 41.2, "Alli": 41.1, "Glowy": 41.1, "Squeak": 41.1, "Berry": 40.6, "Lola": 39.9, "Mandy": 39.7, "Kaze": 39.4, "Jae-Yong": 39, "Piper": 38.4, "Chuck": 35.2, "Gene": 34.3, "Nani": 32.6, "Angelo": 32.3 },
    pickRates: { "Wendy": 0.5, "Ash": 2.5, "Jacky": 2, "Clancy": 3.9, "Damian": 9, "Larry & Lawrie": 0.9, "Griff": 38.3, "Bibi": 21.9, "R-T": 0.5, "Shade": 6.5, "Sam": 0.5, "Tick": 5, "Doug": 3.3, "Jessie": 3.8, "Frank": 15.9, "Surge": 26.1, "Buster": 0.7, "Carl": 5.3, "Nita": 6.2, "Ollie": 0.4, "Rico": 28.6, "Hank": 0.7, "Maisie": 2.2, "8-Bit": 5, "Edgar": 24, "Sandy": 1.4, "Gus": 1.5, "Starr Nova": 12, "Bull": 14.5, "Poco": 3.3, "Juju": 0.3, "Bo": 10.1, "Tara": 12.6, "Rosa": 0.7, "Emz": 26.7, "Gale": 6.5, "Barley": 1.5, "Dynamike": 11.6, "Lou": 2.2, "Willow": 4.7, "Otis": 9, "Charlie": 1, "El Primo": 7.8, "Cordelius": 4.9, "Kenji": 6.1, "Sirius": 4.3, "Bolt": 3, "Stu": 14.3, "Fang": 9.9, "Pearl": 2.4, "Grom": 1, "Mr. P": 0.2, "Amber": 1.9, "Chester": 14.2, "Buzz": 5.5, "Moe": 1.3, "Darryl": 4.5, "Meg": 18.7, "Nori": 10, "Bea": 1.5, "Penny": 1.7, "Spike": 11.2, "Ziggy": 0.5, "Meeple": 7.1, "Trunk": 2.5, "Brock": 16, "Gigi": 1.3, "Max": 7.9, "Eve": 0.1, "Pam": 0.2, "Crow": 12, "Draco": 0.7, "Bonnie": 0.2, "Mina": 4.4, "Najia": 0.9, "Lumi": 5, "Pierce": 4.6, "Colt": 16.6, "Lily": 1.3, "Ruffs": 3, "Finx": 0.4, "Mortis": 16.5, "Janet": 0.2, "Shelly": 9.2, "Colette": 7.8, "Mico": 0.7, "Sprout": 0.8, "Gray": 0.8, "Melodie": 1.5, "Leon": 3.2, "Byron": 1.2, "Belle": 0.2, "Kit": 2.2, "Alli": 0.6, "Glowy": 0.4, "Squeak": 2.6, "Berry": 4.1, "Lola": 0.3, "Mandy": 1.3, "Kaze": 2.4, "Jae-Yong": 0.2, "Piper": 0.8, "Chuck": 0.2, "Gene": 0.2, "Nani": 0.5, "Angelo": 0.1 },
    notes: "Vinci prima il centrocampo, poi rompi i muri per aprire linee di tiro.",
  },
  {
    mode: "Brawl Ball", name: "Center Stage", sample: 1967931, updated: "2026-09-10",
    winRates: { "Jacky": 59.7, "Wendy": 58.6, "Ash": 58.4, "Rosa": 57, "Doug": 56.5, "Griff": 56.4, "R-T": 55.8, "Damian": 55.7, "Clancy": 55.3, "Buster": 55, "Bolt": 54.8, "Bibi": 54.5, "Frank": 53.9, "Nita": 53.8, "Bull": 53.4, "Rico": 53.4, "Maisie": 52.7, "Carl": 52.6, "Gale": 52.5, "Tara": 52.1, "Sam": 51.9, "Otis": 51.8, "Emz": 51.3, "Ollie": 51.1, "Buzz": 50.8, "Surge": 50.8, "Gus": 50.5, "Pearl": 50.4, "Edgar": 50.3, "Sandy": 50.3, "Tick": 50.3, "Grom": 50.2, "Chester": 50.1, "El Primo": 50.1, "Bo": 50, "Darryl": 50, "Lou": 49.9, "Jessie": 49.7, "Charlie": 49, "Poco": 48.8, "Starr Nova": 48.8, "Meg": 48.6, "Amber": 48.5, "8-Bit": 48.4, "Cordelius": 48.4, "Fang": 48.4, "Spike": 48, "Janet": 47.8, "Kenji": 47.6, "Shade": 47.5, "Crow": 47.2, "Trunk": 47.2, "Stu": 47.1, "Max": 46.9, "Moe": 46.6, "Shelly": 46.6, "Sirius": 46.5, "Meeple": 46.2, "Gigi": 46.1, "Mr. P": 46, "Brock": 45.7, "Eve": 45.5, "Nori": 45.5, "Draco": 45.3, "Pam": 45.2, "Finx": 45.1, "Willow": 45.1, "Larry & Lawrie": 44.9, "Colt": 44.7, "Dynamike": 44.7, "Mina": 44.7, "Lumi": 44.6, "Alli": 44.5, "Bea": 44.4, "Ruffs": 44, "Lily": 43.6, "Mortis": 43.3, "Penny": 43.2, "Colette": 43, "Juju": 42.7, "Hank": 42.6, "Bonnie": 42.5, "Melodie": 42.2, "Lola": 42.1, "Barley": 41.7, "Leon": 41.6, "Squeak": 41.5, "Pierce": 40.5, "Byron": 39.8, "Kit": 39.7, "Najia": 39.7, "Gray": 39.4, "Belle": 39.2, "Berry": 39.2, "Jae-Yong": 39.1, "Kaze": 39.1, "Glowy": 38.8, "Sprout": 37.8, "Mico": 37.6, "Ziggy": 37.6, "Mandy": 35.7, "Piper": 33.9, "Gene": 33.4, "Chuck": 32.6, "Nani": 32.5, "Angelo": 28.5 },
    pickRates: { "Jacky": 3.6, "Wendy": 0.5, "Ash": 3.2, "Rosa": 2.3, "Doug": 6.6, "Griff": 38.7, "R-T": 0.6, "Damian": 9.8, "Clancy": 3.9, "Buster": 1.1, "Bolt": 3.2, "Bibi": 23.8, "Frank": 16.5, "Nita": 7.8, "Bull": 20.8, "Rico": 33.8, "Maisie": 2.2, "Carl": 6.6, "Gale": 6.9, "Tara": 16.1, "Sam": 0.5, "Otis": 12.6, "Emz": 25.1, "Ollie": 0.3, "Buzz": 7.6, "Surge": 25, "Gus": 1.4, "Pearl": 2.6, "Edgar": 24.7, "Sandy": 1.3, "Tick": 3.6, "Grom": 1.2, "Chester": 16.1, "El Primo": 9.3, "Bo": 9.6, "Darryl": 5, "Lou": 2.2, "Jessie": 2.7, "Charlie": 0.9, "Poco": 2.7, "Starr Nova": 10.9, "Meg": 19.5, "Amber": 2, "8-Bit": 4.2, "Cordelius": 5.4, "Fang": 8, "Spike": 10.9, "Janet": 0.3, "Kenji": 5.5, "Shade": 2.9, "Crow": 11.6, "Trunk": 3, "Stu": 10.1, "Max": 6.5, "Moe": 1.3, "Shelly": 14.5, "Sirius": 3.5, "Meeple": 5.2, "Gigi": 1.3, "Mr. P": 0.2, "Brock": 12.2, "Eve": 0.1, "Nori": 9, "Draco": 0.8, "Pam": 0.2, "Finx": 0.4, "Willow": 2.4, "Larry & Lawrie": 0.3, "Colt": 15.2, "Dynamike": 6.5, "Mina": 3.2, "Lumi": 5.6, "Alli": 1.7, "Bea": 0.8, "Ruffs": 4.7, "Lily": 1.7, "Mortis": 14, "Penny": 0.9, "Colette": 7.6, "Juju": 0.1, "Hank": 0.3, "Bonnie": 0.1, "Melodie": 1.2, "Lola": 0.4, "Barley": 0.5, "Leon": 3, "Squeak": 2.3, "Pierce": 2.1, "Byron": 0.9, "Kit": 2.1, "Najia": 0.5, "Gray": 0.5, "Belle": 0.2, "Berry": 3.5, "Jae-Yong": 0.2, "Kaze": 2.2, "Glowy": 0.3, "Sprout": 0.5, "Mico": 0.5, "Ziggy": 0.2, "Mandy": 0.8, "Piper": 0.5, "Gene": 0.2, "Chuck": 0.2, "Nani": 0.4, "Angelo": 0 },
    notes: "Simmetrica, copertura moderata: la mappa \"di skill\" per eccellenza.",
  },
  {
    mode: "Brawl Ball", name: "Spiraling Out", sample: 394309, updated: "2026-09-10",
    winRates: { "Wendy": 62.4, "Amber": 61.4, "Ash": 58.3, "Gus": 58.1, "Shade": 57.8, "Jacky": 57.1, "Bibi": 54.9, "Damian": 54.7, "Sam": 54.7, "Bolt": 54.6, "Clancy": 53.9, "El Primo": 53.9, "Meg": 53.7, "Stu": 53, "R-T": 52.7, "Larry & Lawrie": 52.5, "Max": 52.4, "Ollie": 52.2, "Sandy": 52.2, "Darryl": 52.1, "Charlie": 52, "Frank": 51.8, "Nita": 51.8, "Buster": 51.7, "Melodie": 51.7, "Starr Nova": 51.6, "Maisie": 51.4, "Griff": 51.3, "Pearl": 51.2, "Rico": 51.1, "Rosa": 51, "Surge": 51, "Emz": 50.9, "Carl": 50.8, "Lou": 50.7, "Tara": 50.7, "Edgar": 50.6, "Bull": 50.5, "Bea": 50.4, "Kenji": 50, "Hank": 49.9, "Moe": 49.8, "Buzz": 49.6, "Cordelius": 49.6, "Doug": 49.6, "Fang": 49.6, "Otis": 49.6, "Sirius": 49.6, "Chester": 49.5, "Gale": 49.4, "Pam": 49.4, "Janet": 49.3, "Meeple": 49.3, "Draco": 49.1, "Gigi": 49.1, "Tick": 48.9, "Mina": 48.6, "8-Bit": 48.4, "Finx": 48.4, "Bonnie": 48.1, "Spike": 48, "Nori": 47.8, "Mr. P": 47.2, "Colt": 46.9, "Leon": 46.9, "Jessie": 46.8, "Trunk": 46.6, "Poco": 46.5, "Bo": 46.4, "Lumi": 46.4, "Mortis": 46.4, "Eve": 46.3, "Pierce": 46.3, "Willow": 46.2, "Colette": 45.7, "Ziggy": 45.6, "Dynamike": 45.5, "Lola": 45.4, "Crow": 45.2, "Sprout": 45.2, "Brock": 45, "Gray": 44.8, "Ruffs": 44.8, "Glowy": 44.6, "Juju": 44.6, "Shelly": 44.2, "Barley": 44.1, "Jae-Yong": 44, "Penny": 43.9, "Najia": 43.8, "Alli": 43.7, "Kit": 43.5, "Byron": 43.4, "Lily": 42.9, "Grom": 42.4, "Mico": 42.4, "Kaze": 40.7, "Berry": 40.3, "Squeak": 39.5, "Piper": 39.3, "Belle": 39, "Chuck": 36.8, "Gene": 36.6, "Mandy": 35.2, "Nani": 35.1, "Angelo": 31.8 },
    pickRates: { "Wendy": 2.4, "Amber": 3.9, "Ash": 5.3, "Gus": 5.2, "Shade": 5.9, "Jacky": 1.2, "Bibi": 17.1, "Damian": 5.7, "Sam": 0.6, "Bolt": 3, "Clancy": 4.1, "El Primo": 6.4, "Meg": 10.1, "Stu": 30.3, "R-T": 0.5, "Larry & Lawrie": 0.6, "Max": 17.1, "Ollie": 0.4, "Sandy": 1, "Darryl": 3.3, "Charlie": 1.6, "Frank": 8, "Nita": 3.8, "Buster": 0.7, "Melodie": 2.5, "Starr Nova": 14.8, "Maisie": 2.8, "Griff": 42.9, "Pearl": 4.9, "Rico": 30.2, "Rosa": 0.4, "Surge": 31, "Emz": 20.5, "Carl": 8.1, "Lou": 2.5, "Tara": 3.5, "Edgar": 19.5, "Bull": 9.3, "Bea": 1.7, "Kenji": 4.9, "Hank": 0.7, "Moe": 3.2, "Buzz": 5.1, "Cordelius": 3.9, "Doug": 1.7, "Fang": 7.2, "Otis": 11, "Sirius": 3.4, "Chester": 12.8, "Gale": 5.2, "Pam": 0.2, "Janet": 0.2, "Meeple": 14.3, "Draco": 0.6, "Gigi": 1.7, "Tick": 3, "Mina": 10.5, "8-Bit": 2.6, "Finx": 0.5, "Bonnie": 0.2, "Spike": 7.6, "Nori": 17, "Mr. P": 0.2, "Colt": 16.6, "Leon": 2.2, "Jessie": 1.3, "Trunk": 7.3, "Poco": 2.6, "Bo": 4.8, "Lumi": 9.4, "Mortis": 18.9, "Eve": 0.1, "Pierce": 5.8, "Willow": 12.9, "Colette": 6.8, "Ziggy": 0.4, "Dynamike": 8.2, "Lola": 0.3, "Crow": 8.5, "Sprout": 0.5, "Brock": 12.4, "Gray": 1.2, "Ruffs": 6.6, "Glowy": 0.5, "Juju": 0.2, "Shelly": 4, "Barley": 1, "Jae-Yong": 0.3, "Penny": 0.8, "Najia": 0.6, "Alli": 0.3, "Kit": 1.6, "Byron": 1.3, "Lily": 0.8, "Grom": 0.4, "Mico": 0.4, "Kaze": 7.3, "Berry": 0.5, "Squeak": 0.9, "Piper": 0.6, "Belle": 0.2, "Chuck": 0.3, "Gene": 0.2, "Mandy": 0.5, "Nani": 0.2, "Angelo": 0.1 },
    notes: "Muri a spirale attorno al centro: le linee di tiro si aprono e si chiudono di continuo.",
  },
  {
    mode: "Brawl Ball", name: "Pinhole Punt", sample: 204936, updated: "2026-09-10",
    winRates: { "Jacky": 59.1, "Buster": 58.6, "Charlie": 57.1, "Doug": 56.5, "Ollie": 56.5, "Draco": 56.3, "Tara": 56.2, "Bibi": 55, "Hank": 55, "Maisie": 54.4, "Damian": 54.2, "Frank": 54.1, "Rosa": 53.8, "Meg": 53.7, "Nita": 53.4, "Griff": 53.2, "Sandy": 53.2, "Trunk": 53.2, "Kenji": 52.9, "Ash": 52.8, "Bull": 52.8, "Sam": 52.8, "Eve": 52.7, "Poco": 52.7, "Amber": 52.5, "Carl": 52.5, "Chester": 52.4, "Crow": 52.4, "Bea": 52.3, "Starr Nova": 52.3, "Clancy": 52.2, "Otis": 51.9, "Bolt": 51.7, "Mr. P": 51.5, "Pam": 51.3, "El Primo": 51.2, "Emz": 51.1, "Finx": 51.1, "Gale": 50.8, "Bo": 50.6, "Jessie": 50.6, "Bonnie": 50.3, "Buzz": 49.9, "Fang": 49.8, "Lou": 49.7, "Sirius": 49.6, "Darryl": 49.4, "Melodie": 49.3, "Jae-Yong": 48.8, "Lumi": 48.8, "Rico": 48.8, "Surge": 48.7, "Janet": 48.6, "Gigi": 48.5, "Moe": 48.5, "Lily": 48.4, "Mina": 48.4, "Spike": 48.2, "Gus": 47.9, "Tick": 47.4, "Lola": 47.2, "Max": 47, "Pierce": 46.8, "Stu": 46.7, "Edgar": 46.5, "Leon": 46.5, "Pearl": 46.5, "Grom": 46.4, "Shelly": 46.4, "Cordelius": 45.8, "Shade": 45.8, "Colette": 45.7, "Meeple": 45.7, "Willow": 45.6, "8-Bit": 45.5, "Alli": 45.5, "Kaze": 45.5, "Nori": 45.2, "Ruffs": 45.2, "Squeak": 45.1, "Berry": 45, "R-T": 44.8, "Colt": 44.2, "Juju": 44.2, "Mortis": 44.2, "Larry & Lawrie": 44.1, "Belle": 44, "Penny": 43.8, "Dynamike": 43.6, "Byron": 43, "Brock": 41.9, "Kit": 41, "Barley": 40.6, "Gray": 40.4, "Mico": 40.4, "Mandy": 40.3, "Angelo": 38.6, "Piper": 38.6, "Sprout": 38.2, "Gene": 37.8, "Nani": 32.8, "Chuck": 29 },
    pickRates: { "Jacky": 10.9, "Buster": 4.6, "Charlie": 2.5, "Doug": 5.7, "Ollie": 3, "Draco": 5, "Tara": 15.9, "Bibi": 15.5, "Hank": 4.7, "Maisie": 7.4, "Damian": 0.1, "Frank": 20.8, "Rosa": 1.6, "Meg": 3.2, "Nita": 9.4, "Griff": 21.1, "Sandy": 4.1, "Trunk": 0.1, "Kenji": 18.8, "Ash": 3.4, "Bull": 7.4, "Sam": 0.9, "Eve": 0.3, "Poco": 6.1, "Amber": 5.4, "Carl": 14.9, "Chester": 18.4, "Crow": 7.3, "Bea": 12, "Starr Nova": 0.4, "Clancy": 3.2, "Otis": 2.1, "Bolt": 0.1, "Mr. P": 12.1, "Pam": 0.3, "El Primo": 13.3, "Emz": 12.8, "Finx": 3.1, "Gale": 8.6, "Bo": 12.4, "Jessie": 5.6, "Bonnie": 1.5, "Buzz": 11, "Fang": 10.5, "Lou": 4.4, "Sirius": 0.1, "Darryl": 10, "Melodie": 3.8, "Jae-Yong": 3.7, "Lumi": 9.6, "Rico": 18.4, "Surge": 16.1, "Janet": 1.9, "Gigi": 0.1, "Moe": 0.9, "Lily": 4.5, "Mina": 0.3, "Spike": 13.2, "Gus": 6.7, "Tick": 4.6, "Lola": 0.6, "Max": 6, "Pierce": 0.4, "Stu": 15.8, "Edgar": 15.4, "Leon": 4.6, "Pearl": 2.2, "Grom": 2.6, "Shelly": 8.5, "Cordelius": 19.9, "Shade": 2.3, "Colette": 4.7, "Meeple": 1.1, "Willow": 1.1, "8-Bit": 0.8, "Alli": 4, "Kaze": 7, "Nori": 0.3, "Ruffs": 0.7, "Squeak": 5.5, "Berry": 2.5, "R-T": 0.4, "Colt": 12.6, "Juju": 0.6, "Mortis": 20.3, "Larry & Lawrie": 0.5, "Belle": 0.9, "Penny": 2.4, "Dynamike": 11.4, "Byron": 1.9, "Brock": 6, "Kit": 1.4, "Barley": 1.6, "Gray": 1.8, "Mico": 0.4, "Mandy": 3.4, "Angelo": 0.2, "Piper": 1.4, "Sprout": 0.4, "Gene": 0.4, "Nani": 0.4, "Chuck": 0.2 },
    notes: "Mix di corridoi stretti, corsie aperte e chokepoint chiave.",
  },
  {
    mode: "Brawl Ball", name: "Beach Ball", sample: 119620, updated: "2026-09-10",
    winRates: { "Amber": 64, "Shade": 62.3, "Wendy": 61.3, "Gus": 58.6, "Ash": 57.9, "El Primo": 57.5, "Bibi": 53.5, "Emz": 53.4, "Charlie": 53.2, "Larry & Lawrie": 52.6, "Damian": 52.5, "Meg": 52.5, "Sirius": 52.5, "Maisie": 51.8, "Stu": 51.2, "Frank": 50.9, "Kenji": 50.7, "Bea": 50.6, "Max": 50.5, "Griff": 50.3, "Sandy": 50.3, "Edgar": 50.2, "Nita": 50.2, "Surge": 50.1, "Rico": 50, "Bull": 49.9, "Jacky": 49.7, "Tara": 49.7, "Hank": 49.6, "Bolt": 49.2, "Sam": 49.2, "Lou": 49.1, "Bonnie": 49, "Chester": 49, "Clancy": 49, "Spike": 49, "Starr Nova": 48.9, "Carl": 48.7, "R-T": 48.7, "Moe": 48.6, "Buzz": 48.3, "Pearl": 48.2, "Draco": 48.1, "Cordelius": 48, "Meeple": 47.9, "Ollie": 47.9, "Rosa": 47.9, "Colette": 47.3, "Gale": 47.3, "Lola": 47.3, "Otis": 47.2, "Doug": 47.1, "Melodie": 47, "Barley": 46.9, "Leon": 46.9, "Trunk": 46.8, "8-Bit": 46.7, "Darryl": 46.7, "Pierce": 46.7, "Willow": 46.7, "Mortis": 46.5, "Buster": 46.2, "Mina": 46, "Jessie": 45.5, "Penny": 45.4, "Finx": 45.3, "Lumi": 45.3, "Shelly": 45.3, "Brock": 45.1, "Fang": 45.1, "Gray": 45.1, "Colt": 45, "Dynamike": 44.9, "Pam": 44.9, "Ruffs": 44.8, "Lily": 44.4, "Janet": 44.3, "Poco": 44.3, "Mr. P": 44.2, "Berry": 44.1, "Bo": 43.8, "Ziggy": 43.8, "Nori": 43.6, "Sprout": 43.5, "Juju": 43, "Gigi": 42.8, "Najia": 42.8, "Byron": 42.5, "Crow": 42.5, "Kaze": 41.6, "Mandy": 41.4, "Alli": 41.3, "Glowy": 40.9, "Tick": 40.9, "Piper": 38.2, "Grom": 37.3, "Jae-Yong": 37.2, "Nani": 36.9, "Kit": 36.6, "Squeak": 36.1, "Mico": 35.6, "Chuck": 35.4, "Gene": 27 },
    pickRates: { "Amber": 10.8, "Shade": 11.4, "Wendy": 7.8, "Gus": 16.5, "Ash": 9.3, "El Primo": 12.8, "Bibi": 9.2, "Emz": 23.8, "Charlie": 1.7, "Larry & Lawrie": 0.8, "Damian": 4.1, "Meg": 13.9, "Sirius": 4.6, "Maisie": 3.9, "Stu": 41, "Frank": 4.4, "Kenji": 3.5, "Bea": 1.3, "Max": 19.9, "Griff": 43.5, "Sandy": 1, "Edgar": 15.5, "Nita": 3.1, "Surge": 34, "Rico": 28, "Bull": 7, "Jacky": 0.8, "Tara": 3.3, "Hank": 0.7, "Bolt": 1.1, "Sam": 0.3, "Lou": 2.4, "Bonnie": 0.1, "Chester": 11.4, "Clancy": 2.7, "Spike": 6.3, "Starr Nova": 13.1, "Carl": 8.4, "R-T": 0.3, "Moe": 4.2, "Buzz": 5.3, "Pearl": 5, "Draco": 0.4, "Cordelius": 3.6, "Meeple": 21.8, "Ollie": 0.3, "Rosa": 0.4, "Colette": 8.7, "Gale": 3.2, "Lola": 0.3, "Otis": 10.7, "Doug": 0.9, "Melodie": 1.1, "Barley": 2, "Leon": 1, "Trunk": 3.9, "8-Bit": 1.9, "Darryl": 1.5, "Pierce": 5.4, "Willow": 11.7, "Mortis": 12.5, "Buster": 0.6, "Mina": 9.8, "Jessie": 0.8, "Penny": 0.7, "Finx": 0.4, "Lumi": 13.3, "Shelly": 2.5, "Brock": 11.2, "Fang": 3.3, "Gray": 0.9, "Colt": 10.8, "Dynamike": 6.7, "Pam": 0.1, "Ruffs": 9.4, "Lily": 0.6, "Janet": 0.2, "Poco": 3.5, "Mr. P": 0.1, "Berry": 0.4, "Bo": 3, "Ziggy": 0.5, "Nori": 13.8, "Sprout": 0.3, "Juju": 0.2, "Gigi": 1.9, "Najia": 0.5, "Byron": 0.6, "Crow": 5.9, "Kaze": 2.1, "Mandy": 0.2, "Alli": 0.2, "Glowy": 0.3, "Tick": 1.4, "Piper": 0.2, "Grom": 0.3, "Jae-Yong": 0.2, "Nani": 0.1, "Kit": 0.9, "Squeak": 0.7, "Mico": 0.3, "Chuck": 0.7, "Gene": 0.1 },
    notes: "Muri stretti e lunghi più grandi gruppi di cespugli, simmetria diagonale.",
  },
  // ---------- Bounty ----------
  {
    mode: "Bounty", name: "Hideout", sample: 1978906, updated: "2026-09-10",
    winRates: { "Bolt": 66.2, "Wendy": 63.3, "Mr. P": 58.2, "Pearl": 56.7, "Grom": 56.3, "Brock": 55.2, "Tick": 54.3, "Carl": 53.5, "Mico": 53.4, "Bo": 53.2, "Max": 53.1, "Leon": 53, "Piper": 53, "Sprout": 52.9, "8-Bit": 52.7, "Bonnie": 52.7, "Eve": 52.7, "Ollie": 52.5, "Mina": 52, "Nani": 52, "Belle": 51.9, "Najia": 51.8, "Ash": 51.7, "Gigi": 51.6, "Mortis": 51.4, "Gray": 51.2, "Penny": 50.9, "Buster": 50.8, "Damian": 50.6, "Edgar": 50.5, "Surge": 50.5, "Rosa": 50.2, "R-T": 50.1, "Gus": 50, "Janet": 50, "Angelo": 49.9, "Starr Nova": 49.8, "Glowy": 49.6, "Byron": 49.5, "Mandy": 49.4, "Ruffs": 49.4, "Stu": 49.4, "Doug": 49, "Otis": 49, "Spike": 49, "Squeak": 49, "Gene": 48.9, "Poco": 48.9, "Fang": 48.7, "Larry & Lawrie": 48.7, "Maisie": 48.4, "Meeple": 48.3, "Lily": 48.2, "Darryl": 48.1, "Jae-Yong": 47.9, "Charlie": 47.8, "Pierce": 47.8, "Bea": 47.6, "Colt": 47.6, "Lola": 47.6, "Amber": 47.5, "Dynamike": 47.2, "Griff": 47.2, "Jessie": 47.2, "Clancy": 46.7, "Gale": 46.6, "Meg": 46.6, "Juju": 46.4, "Crow": 46.2, "Moe": 46, "Kaze": 45.9, "Pam": 45.9, "Rico": 45.7, "Nori": 45.5, "Kit": 45.3, "Ziggy": 45.3, "Finx": 45.1, "Willow": 45, "Alli": 44.9, "Emz": 44.9, "Melodie": 44.8, "Chester": 44.7, "Kenji": 44.5, "Lou": 44.4, "Sam": 44.4, "Barley": 44.2, "Bull": 43.7, "Buzz": 43.7, "Shade": 43.7, "Cordelius": 43.6, "Chuck": 43.5, "Bibi": 43.3, "Hank": 43.2, "Tara": 42.8, "Sandy": 42.6, "Sirius": 42.6, "Colette": 41.9, "Jacky": 41.3, "Lumi": 40.6, "Trunk": 40, "Draco": 39.9, "Nita": 39.7, "Frank": 39.1, "El Primo": 39, "Shelly": 38.7, "Berry": 37.4 },
    pickRates: { "Bolt": 7.5, "Wendy": 0.5, "Mr. P": 2.1, "Pearl": 4.3, "Grom": 8.4, "Brock": 40.6, "Tick": 13.8, "Carl": 4.5, "Mico": 3.1, "Bo": 9.2, "Max": 12.1, "Leon": 18.9, "Piper": 37.2, "Sprout": 2.4, "8-Bit": 9.1, "Bonnie": 1.2, "Eve": 0.6, "Ollie": 0.2, "Mina": 5.9, "Nani": 14.1, "Belle": 8.7, "Najia": 10, "Ash": 0.2, "Gigi": 1.3, "Mortis": 16.2, "Gray": 7.3, "Penny": 3.6, "Buster": 0.2, "Damian": 1.8, "Edgar": 18.8, "Surge": 11, "Rosa": 0.3, "R-T": 0.9, "Gus": 9.8, "Janet": 0.7, "Angelo": 2.9, "Starr Nova": 7.1, "Glowy": 0.8, "Byron": 27, "Mandy": 17, "Ruffs": 1.5, "Stu": 7, "Doug": 0.8, "Otis": 4.3, "Spike": 11.3, "Squeak": 7.5, "Gene": 7.3, "Poco": 1.2, "Fang": 9.7, "Larry & Lawrie": 1.1, "Maisie": 1.3, "Meeple": 7.5, "Lily": 3.7, "Darryl": 1.2, "Jae-Yong": 0.7, "Charlie": 1.2, "Pierce": 19.7, "Bea": 9.7, "Colt": 25.3, "Lola": 0.6, "Amber": 1.5, "Dynamike": 10.5, "Griff": 12.7, "Jessie": 2.2, "Clancy": 0.2, "Gale": 1, "Meg": 8.8, "Juju": 0.4, "Crow": 14.8, "Moe": 0.3, "Kaze": 3.7, "Pam": 0.2, "Rico": 11.3, "Nori": 10.6, "Kit": 4.9, "Ziggy": 0.8, "Finx": 0.6, "Willow": 2.2, "Alli": 0.8, "Emz": 8.8, "Melodie": 0.6, "Chester": 3, "Kenji": 1.5, "Lou": 1, "Sam": 0.1, "Barley": 1, "Bull": 1.4, "Buzz": 1.6, "Shade": 1.9, "Cordelius": 1.2, "Chuck": 0.3, "Bibi": 1.8, "Hank": 0.2, "Tara": 4.7, "Sandy": 0.3, "Sirius": 2.5, "Colette": 5.1, "Jacky": 0.1, "Lumi": 0.8, "Trunk": 0.4, "Draco": 0.1, "Nita": 0.8, "Frank": 1.4, "El Primo": 0.9, "Shelly": 1.7, "Berry": 4.9 },
    notes: "Simmetria diagonale, due gruppi di staccionate con erba. La stella blu centrale è decisiva come spareggio.",
  },
  {
    mode: "Bounty", name: "Dry Season", sample: 1976052, updated: "2026-09-10",
    winRates: { "Bolt": 64.5, "Wendy": 63.3, "Mr. P": 61.3, "Grom": 56.7, "Carl": 56.5, "Pearl": 56, "Brock": 55.8, "Tick": 55.8, "Sprout": 55.2, "Penny": 54.6, "Ollie": 53.7, "Bonnie": 53.5, "Bo": 53.4, "Eve": 53, "8-Bit": 52.8, "Mico": 52.5, "Janet": 52.2, "Buster": 52.1, "Squeak": 52, "Gigi": 51.9, "Edgar": 51.8, "Gray": 51.8, "Najia": 51.5, "Ash": 51.4, "Mortis": 51.4, "Starr Nova": 51.4, "Mina": 51.3, "Damian": 51.2, "Doug": 51.2, "Leon": 51.1, "R-T": 51.1, "Rosa": 51.1, "Piper": 50.9, "Meeple": 50.8, "Surge": 50.6, "Ruffs": 50.5, "Gus": 50.4, "Mandy": 50.4, "Belle": 50.3, "Max": 50.1, "Poco": 49.8, "Angelo": 49.5, "Maisie": 49.5, "Otis": 49.5, "Spike": 49.5, "Byron": 49.2, "Jessie": 49.1, "Moe": 48.8, "Juju": 48.7, "Amber": 48.6, "Gene": 48.6, "Larry & Lawrie": 48.6, "Lily": 48.6, "Stu": 48.4, "Pierce": 48.2, "Jae-Yong": 48.1, "Ziggy": 48, "Charlie": 47.9, "Kaze": 47.9, "Fang": 47.8, "Hank": 47.6, "Darryl": 47.4, "Kenji": 47.2, "Shade": 47.2, "Bea": 47.1, "Meg": 47.1, "Griff": 46.9, "Nani": 46.8, "Gale": 46.7, "Lola": 46.7, "Nori": 46.7, "Sam": 46.6, "Emz": 46.5, "Rico": 46.3, "Crow": 46, "Dynamike": 46, "Bibi": 45.9, "Clancy": 45.8, "Sirius": 45.7, "Glowy": 45.6, "Lou": 45.6, "Finx": 45.5, "Kit": 45.4, "Pam": 45.4, "Chester": 45.3, "Sandy": 45, "Colt": 44.7, "Cordelius": 44.6, "Barley": 44.5, "Willow": 44.2, "Tara": 44, "Buzz": 43.9, "Bull": 43.6, "Lumi": 43.3, "Jacky": 43.1, "Trunk": 42.8, "Chuck": 42.4, "Nita": 42.3, "Melodie": 41.6, "Colette": 41.4, "El Primo": 40.2, "Alli": 40.1, "Draco": 39.4, "Shelly": 39.2, "Frank": 38.9, "Berry": 38.7 },
    pickRates: { "Bolt": 5.2, "Wendy": 0.5, "Mr. P": 2.9, "Grom": 6.8, "Carl": 6.6, "Pearl": 4.1, "Brock": 41.2, "Tick": 15.5, "Sprout": 2.4, "Penny": 5.8, "Ollie": 0.2, "Bonnie": 1.3, "Bo": 11.4, "Eve": 0.6, "8-Bit": 10.1, "Mico": 2.4, "Janet": 0.9, "Buster": 0.3, "Squeak": 10.2, "Gigi": 1.4, "Edgar": 19.9, "Gray": 7.5, "Najia": 12.1, "Ash": 0.3, "Mortis": 17.3, "Starr Nova": 8.5, "Mina": 5.8, "Damian": 2.3, "Doug": 0.9, "Leon": 16.2, "R-T": 0.9, "Rosa": 0.3, "Piper": 29.4, "Meeple": 11.3, "Surge": 12.1, "Ruffs": 2.1, "Gus": 9.9, "Mandy": 18.8, "Belle": 7.7, "Max": 9.8, "Poco": 1.5, "Angelo": 2.4, "Maisie": 1.6, "Otis": 5.6, "Spike": 13.2, "Byron": 25.3, "Jessie": 2.7, "Moe": 0.4, "Juju": 0.3, "Amber": 1.7, "Gene": 6.4, "Larry & Lawrie": 0.6, "Lily": 4.7, "Stu": 6.2, "Pierce": 20, "Jae-Yong": 0.5, "Ziggy": 0.8, "Charlie": 1.3, "Kaze": 4.6, "Fang": 8.7, "Hank": 0.2, "Darryl": 1.4, "Kenji": 2.1, "Shade": 1.3, "Bea": 9.4, "Meg": 10, "Griff": 13.5, "Nani": 7.1, "Gale": 1.2, "Lola": 0.6, "Nori": 10.9, "Sam": 0.2, "Emz": 9.2, "Rico": 12.3, "Crow": 16.6, "Dynamike": 5.1, "Bibi": 2.2, "Clancy": 0.3, "Sirius": 2.3, "Glowy": 0.6, "Lou": 1.1, "Finx": 0.7, "Kit": 5.6, "Pam": 0.2, "Chester": 3.8, "Sandy": 0.5, "Colt": 20.5, "Cordelius": 1.3, "Barley": 0.6, "Willow": 1.5, "Tara": 5.3, "Buzz": 1.8, "Bull": 1.5, "Lumi": 1.1, "Jacky": 0.1, "Trunk": 0.5, "Chuck": 0.3, "Nita": 0.8, "Melodie": 0.4, "Colette": 5.6, "El Primo": 1, "Alli": 0.5, "Draco": 0.1, "Shelly": 1.7, "Frank": 1.4, "Berry": 3.7 },
    notes: "Zone aperte con muri indistruttibili al centro.",
  },
  {
    mode: "Bounty", name: "Shooting Star", sample: 1973060, updated: "2026-09-10",
    winRates: { "Wendy": 67, "Bolt": 65.4, "Grom": 59.6, "Mr. P": 58.5, "Tick": 56.3, "Pearl": 55.7, "Sprout": 55.7, "Brock": 55.4, "Eve": 54.6, "Najia": 54.3, "Nani": 54.2, "Piper": 54.2, "Bonnie": 53.5, "Carl": 53.5, "8-Bit": 53.3, "Angelo": 52.9, "Bo": 52.6, "Penny": 52.6, "Belle": 52.1, "Max": 52.1, "Leon": 51.6, "Mina": 51.1, "Gigi": 50.7, "Mandy": 50.7, "Mico": 50.5, "Gray": 50.2, "Gus": 50.2, "Glowy": 50.1, "Squeak": 50.1, "Byron": 49.9, "Spike": 49.6, "Ollie": 49.4, "R-T": 49.4, "Pierce": 49.2, "Gene": 49.1, "Juju": 49, "Mortis": 49, "Otis": 48.8, "Ash": 48.7, "Janet": 48.6, "Poco": 48.6, "Edgar": 48.3, "Damian": 48.2, "Fang": 48.2, "Jessie": 48.2, "Bea": 48.1, "Jae-Yong": 48.1, "Ruffs": 48.1, "Rosa": 48, "Surge": 47.9, "Lola": 47.5, "Starr Nova": 47.3, "Doug": 47.2, "Buster": 47.1, "Amber": 47, "Maisie": 47, "Charlie": 46.9, "Stu": 46.7, "Meeple": 46.6, "Dynamike": 46.5, "Darryl": 46.3, "Lily": 46.1, "Larry & Lawrie": 46, "Colt": 45.9, "Pam": 45.7, "Gale": 45.6, "Chuck": 45.5, "Meg": 45.5, "Crow": 45.3, "Griff": 45.1, "Rico": 44.7, "Clancy": 44.5, "Nori": 44.5, "Kaze": 44.4, "Lou": 44.3, "Ziggy": 44, "Emz": 43.7, "Finx": 43.6, "Alli": 43.4, "Barley": 43.4, "Kit": 43.1, "Chester": 43, "Melodie": 42.9, "Moe": 42.9, "Willow": 42.8, "Kenji": 42.1, "Bibi": 41.9, "Sirius": 41.6, "Sam": 41.5, "Jacky": 41.4, "Tara": 41.4, "Shade": 41.3, "Colette": 41.2, "Sandy": 41.2, "Cordelius": 40.6, "Bull": 40.5, "Buzz": 40.4, "Hank": 39.3, "Lumi": 39.2, "Nita": 39.2, "Draco": 38.5, "Shelly": 37.8, "Trunk": 36.8, "El Primo": 36.7, "Frank": 36.4, "Berry": 35.9 },
    pickRates: { "Wendy": 0.4, "Bolt": 7.6, "Grom": 8.9, "Mr. P": 2, "Tick": 14.5, "Pearl": 3.3, "Sprout": 3, "Brock": 39.9, "Eve": 1.3, "Najia": 11.7, "Nani": 18.4, "Piper": 41.5, "Bonnie": 1.3, "Carl": 4.5, "8-Bit": 9.9, "Angelo": 9.3, "Bo": 9.4, "Penny": 3.8, "Belle": 10.8, "Max": 11.9, "Leon": 17.2, "Mina": 5.1, "Gigi": 1.1, "Mandy": 20, "Mico": 1.9, "Gray": 6.7, "Gus": 11, "Glowy": 0.8, "Squeak": 7.9, "Byron": 31.3, "Spike": 11.6, "Ollie": 0.1, "R-T": 0.9, "Pierce": 22, "Gene": 7.5, "Juju": 0.9, "Mortis": 14, "Otis": 4.2, "Ash": 0.2, "Janet": 0.7, "Poco": 1.2, "Edgar": 17.8, "Damian": 1.4, "Fang": 10.7, "Jessie": 2.4, "Bea": 11.7, "Jae-Yong": 0.6, "Ruffs": 1, "Rosa": 0.4, "Surge": 8.3, "Lola": 0.7, "Starr Nova": 5.9, "Doug": 0.7, "Buster": 0.1, "Amber": 1.5, "Maisie": 1.3, "Charlie": 1.2, "Stu": 5.1, "Meeple": 5.4, "Dynamike": 8.2, "Darryl": 1.2, "Lily": 3.1, "Larry & Lawrie": 0.7, "Colt": 23.6, "Pam": 0.2, "Gale": 1, "Chuck": 0.4, "Meg": 8.1, "Crow": 14.7, "Griff": 9.7, "Rico": 10.5, "Clancy": 0.2, "Nori": 9.9, "Kaze": 2.9, "Lou": 1, "Ziggy": 0.6, "Emz": 8.4, "Finx": 0.6, "Alli": 0.6, "Barley": 0.7, "Kit": 4, "Chester": 2.7, "Melodie": 0.6, "Moe": 0.2, "Willow": 1.6, "Kenji": 1.4, "Bibi": 1.6, "Sirius": 2, "Sam": 0.1, "Jacky": 0.1, "Tara": 4.4, "Shade": 1.3, "Colette": 5.4, "Sandy": 0.3, "Cordelius": 0.9, "Bull": 1.1, "Buzz": 1.4, "Hank": 0.1, "Lumi": 0.7, "Nita": 0.7, "Draco": 0.1, "Shelly": 1.5, "Trunk": 0.3, "El Primo": 0.8, "Frank": 1.3, "Berry": 3.8 },
    notes: "Mappa aperta con lunghe linee di tiro.",
  },
  {
    mode: "Bounty", name: "Layer Cake", sample: 1968629, updated: "2026-09-10",
    winRates: { "Bolt": 64.1, "Wendy": 61, "Mr. P": 59.3, "Tick": 57.5, "Carl": 56.9, "Penny": 56.5, "Pearl": 56.2, "Grom": 56, "Brock": 55.5, "Ash": 54.8, "Mico": 53.8, "Bo": 53.7, "Buster": 53.6, "Rosa": 53.6, "Sprout": 53.2, "Eve": 53, "Surge": 52.8, "Doug": 52.4, "Edgar": 52.4, "Ollie": 52.4, "Damian": 52.1, "Janet": 52, "Larry & Lawrie": 51.7, "Lily": 51.5, "Mortis": 51.5, "8-Bit": 51.4, "R-T": 51.1, "Squeak": 51.1, "Bonnie": 51, "Starr Nova": 50.9, "Gigi": 50.7, "Jacky": 50.7, "Otis": 50.7, "Dynamike": 50.4, "Gray": 50.4, "Griff": 50.1, "Jessie": 50, "Bibi": 49.9, "Shade": 49.9, "Mina": 49.8, "Emz": 49.7, "Kenji": 49.6, "Juju": 49.5, "Ruffs": 49.5, "Spike": 49.5, "Darryl": 49.3, "Meeple": 49.3, "Amber": 49.2, "Poco": 48.9, "Barley": 48.8, "Najia": 48.7, "Alli": 48.5, "Mandy": 48.5, "Cordelius": 48.4, "Leon": 48.4, "Maisie": 48.4, "Rico": 48.3, "Lou": 48.2, "Trunk": 48.2, "Willow": 48.2, "Gus": 48.1, "Bull": 47.9, "Gale": 47.9, "Nori": 47.9, "Max": 47.7, "Ziggy": 47.7, "Buzz": 47.5, "Chester": 47.5, "Fang": 47.5, "Stu": 47.3, "Belle": 47.2, "Gene": 47.2, "Hank": 46.7, "Sirius": 46.7, "Clancy": 46.5, "Sam": 46.5, "Meg": 46.4, "Sandy": 46.3, "Tara": 46.1, "Crow": 46, "Finx": 46, "Byron": 45.8, "Nita": 45.7, "Pierce": 45.7, "Charlie": 45.5, "Jae-Yong": 45.4, "Moe": 45.4, "Lumi": 45.2, "Kaze": 45.1, "Kit": 45, "Piper": 44.9, "Chuck": 44.5, "El Primo": 44.3, "Pam": 44.3, "Angelo": 43.8, "Lola": 43.8, "Bea": 43.3, "Shelly": 43.1, "Frank": 42.8, "Nani": 42.7, "Berry": 42.5, "Glowy": 41.9, "Colette": 41.6, "Colt": 41.6, "Draco": 40.9, "Melodie": 39.5 },
    pickRates: { "Bolt": 3.3, "Wendy": 0.5, "Mr. P": 3, "Tick": 19.3, "Carl": 6, "Penny": 8.2, "Pearl": 3.1, "Grom": 9.4, "Brock": 32.1, "Ash": 0.9, "Mico": 7.7, "Bo": 10, "Buster": 0.7, "Rosa": 0.7, "Sprout": 4.9, "Eve": 0.4, "Surge": 21.9, "Doug": 2.4, "Edgar": 22.3, "Ollie": 0.3, "Damian": 4.3, "Janet": 0.8, "Larry & Lawrie": 2.5, "Lily": 15.3, "Mortis": 18.1, "8-Bit": 5.8, "R-T": 0.7, "Squeak": 8.8, "Bonnie": 0.5, "Starr Nova": 11.4, "Gigi": 1.8, "Jacky": 0.4, "Otis": 5.1, "Dynamike": 17, "Gray": 5.4, "Griff": 19.6, "Jessie": 2.6, "Bibi": 6, "Shade": 13.4, "Mina": 4.2, "Emz": 14.4, "Kenji": 4.6, "Juju": 1.9, "Ruffs": 2.3, "Spike": 12.9, "Darryl": 2.1, "Meeple": 15, "Amber": 1.7, "Poco": 1.5, "Barley": 2.9, "Najia": 6.9, "Alli": 4.2, "Mandy": 8.4, "Cordelius": 5.7, "Leon": 14.5, "Maisie": 1, "Rico": 17.5, "Lou": 0.8, "Trunk": 1.6, "Willow": 5.6, "Gus": 3.8, "Bull": 4.1, "Gale": 1.4, "Nori": 12.2, "Max": 6.1, "Ziggy": 2.1, "Buzz": 3.3, "Chester": 6.2, "Fang": 5.7, "Stu": 4.6, "Belle": 1.7, "Gene": 4.2, "Hank": 1, "Sirius": 5.2, "Clancy": 0.4, "Sam": 0.2, "Meg": 11.7, "Sandy": 0.7, "Tara": 7.1, "Crow": 13.2, "Finx": 0.5, "Byron": 6.3, "Nita": 1.6, "Pierce": 7.1, "Charlie": 0.8, "Jae-Yong": 0.3, "Moe": 0.6, "Lumi": 1.7, "Kaze": 4.6, "Kit": 10.3, "Piper": 7.6, "Chuck": 0.3, "El Primo": 1.7, "Pam": 0.2, "Angelo": 0.7, "Lola": 0.4, "Bea": 2.8, "Shelly": 3.3, "Frank": 2.1, "Nani": 1.9, "Berry": 9.3, "Glowy": 0.4, "Colette": 3.7, "Colt": 9.9, "Draco": 0.2, "Melodie": 0.3 },
    notes: "Mappa a strati di muri, cespugli e chokepoint.",
  },
  // ---------- Heist ----------
  {
    mode: "Heist", name: "Hot Potato", sample: 1959999, updated: "2026-09-10",
    winRates: { "Nori": 61.8, "Bibi": 60.9, "Nita": 59.6, "Bull": 58.3, "Mico": 57.5, "Doug": 56.2, "Carl": 56.1, "Edgar": 56.1, "Sam": 55.5, "Jessie": 54.7, "Melodie": 54.7, "Shade": 54.6, "Gigi": 54.1, "Cordelius": 53.8, "Bolt": 53.2, "Griff": 53.2, "Ash": 53.1, "Chuck": 52.4, "8-Bit": 52.1, "Clancy": 52.1, "Starr Nova": 52, "Dynamike": 51.3, "Lily": 51.3, "Rosa": 51.1, "Kaze": 51, "Barley": 50.7, "Trunk": 50.7, "Berry": 50.6, "Emz": 50.5, "Darryl": 49.7, "Lumi": 49.5, "Otis": 49.4, "El Primo": 48.9, "Larry & Lawrie": 48.8, "Rico": 48.8, "Jacky": 48.5, "Buzz": 48.4, "R-T": 48.2, "Sirius": 48.1, "Penny": 47.8, "Kenji": 47.6, "Frank": 47.1, "Surge": 47.1, "Buster": 46.8, "Mr. P": 46.5, "Pearl": 46.5, "Maisie": 46.2, "Colt": 46.1, "Hank": 45.7, "Ruffs": 45.7, "Juju": 45.6, "Amber": 45.4, "Colette": 45.4, "Draco": 45.4, "Bo": 45.2, "Tara": 44.6, "Charlie": 44.5, "Brock": 44.3, "Gus": 44.3, "Fang": 43.8, "Eve": 43.7, "Kit": 43.5, "Chester": 43.4, "Crow": 43.4, "Gale": 43.4, "Spike": 42.9, "Bonnie": 42.4, "Wendy": 42.2, "Finx": 42.1, "Lou": 41.8, "Meg": 41.8, "Damian": 41.7, "Lola": 41.5, "Grom": 40.6, "Moe": 40.5, "Mina": 40.3, "Max": 40.2, "Willow": 40.2, "Pam": 40.1, "Sandy": 39.6, "Shelly": 39.6, "Bea": 39, "Mandy": 39, "Leon": 38.9, "Poco": 38.9, "Sprout": 38.8, "Alli": 38.7, "Belle": 38.7, "Janet": 38.7, "Mortis": 38.7, "Ziggy": 38.7, "Squeak": 38.6, "Stu": 38.6, "Pierce": 38.5, "Glowy": 38.2, "Meeple": 37.1, "Nani": 36.2, "Najia": 35.6, "Byron": 35.4, "Gray": 35.1, "Tick": 33.7, "Ollie": 32.6, "Piper": 32.6, "Jae-Yong": 28.2, "Angelo": 28.1, "Gene": 25.1 },
    pickRates: { "Nori": 12.7, "Bibi": 11.2, "Nita": 23.8, "Bull": 18.7, "Mico": 17.6, "Doug": 1.2, "Carl": 7.6, "Edgar": 34, "Sam": 0.2, "Jessie": 23.9, "Melodie": 7.2, "Shade": 4.3, "Gigi": 1.3, "Cordelius": 6.2, "Bolt": 4, "Griff": 31.6, "Ash": 0.5, "Chuck": 14.5, "8-Bit": 20, "Clancy": 2.1, "Starr Nova": 7.1, "Dynamike": 8.2, "Lily": 3.2, "Rosa": 0.4, "Kaze": 12.5, "Barley": 2.4, "Trunk": 1.4, "Berry": 22.3, "Emz": 16.4, "Darryl": 2.5, "Lumi": 3.7, "Otis": 6.3, "El Primo": 2.6, "Larry & Lawrie": 0.8, "Rico": 31.9, "Jacky": 0.3, "Buzz": 2.9, "R-T": 0.8, "Sirius": 3.3, "Penny": 11.8, "Kenji": 1.5, "Frank": 2.9, "Surge": 11.5, "Buster": 0.1, "Mr. P": 0.4, "Pearl": 1.1, "Maisie": 0.6, "Colt": 36.1, "Hank": 0.2, "Ruffs": 0.7, "Juju": 0.2, "Amber": 4.3, "Colette": 18.6, "Draco": 0.7, "Bo": 10, "Tara": 4.4, "Charlie": 0.6, "Brock": 26.9, "Gus": 0.8, "Fang": 2.5, "Eve": 0.2, "Kit": 1.2, "Chester": 4, "Crow": 20, "Gale": 1, "Spike": 8.3, "Bonnie": 0.3, "Wendy": 0.2, "Finx": 0.2, "Lou": 0.6, "Meg": 13.1, "Damian": 1, "Lola": 0.7, "Grom": 1, "Moe": 0.3, "Mina": 0.4, "Max": 1.1, "Willow": 1.1, "Pam": 0.2, "Sandy": 0.2, "Shelly": 2.3, "Bea": 0.6, "Mandy": 11.8, "Leon": 2.2, "Poco": 0.4, "Sprout": 0.5, "Alli": 0.4, "Belle": 0.4, "Janet": 0.2, "Mortis": 1.9, "Ziggy": 0.2, "Squeak": 3.6, "Stu": 0.8, "Pierce": 3.4, "Glowy": 0.3, "Meeple": 0.5, "Nani": 1.3, "Najia": 0.9, "Byron": 1.2, "Gray": 0.2, "Tick": 2.3, "Ollie": 0, "Piper": 1.8, "Jae-Yong": 0, "Angelo": 0.1, "Gene": 0.1 },
    notes: "Striscia diagonale di cespugli al centro; le torrette piazzate lì valgono molto.",
  },
  {
    mode: "Heist", name: "Bridge Too Far", sample: 1948738, updated: "2026-09-10",
    winRates: { "Wendy": 64.3, "Nori": 62.8, "8-Bit": 60.3, "Eve": 59.4, "Sam": 58.1, "Mico": 56.9, "Chuck": 56.4, "Carl": 55.4, "Jessie": 55.1, "Colt": 54.7, "Lola": 54.1, "Melodie": 54, "Bolt": 53.7, "Bibi": 53.5, "Bonnie": 53.3, "Edgar": 53.1, "Bull": 52.7, "Shade": 52.3, "Otis": 52.2, "Nita": 51.6, "Juju": 51.5, "Kaze": 51.5, "Griff": 51.4, "Bo": 51.3, "Angelo": 51, "Alli": 50.8, "Pearl": 50.7, "Brock": 50.3, "Starr Nova": 50.1, "Lily": 50, "Mr. P": 49.7, "Piper": 49.5, "Darryl": 49.4, "Clancy": 49.1, "Nani": 48.5, "Charlie": 48.4, "Rico": 48.4, "Max": 48.3, "Gigi": 48.2, "Ash": 48.1, "Amber": 47.7, "Colette": 47.6, "Maisie": 47.3, "Bea": 47.1, "Buzz": 47.1, "Lumi": 46.8, "Penny": 46.8, "Pierce": 46.5, "Belle": 46.4, "Gale": 46.4, "Finx": 46.3, "Glowy": 46.2, "Cordelius": 45.7, "El Primo": 45.7, "Mandy": 45.7, "Pam": 45.5, "Ruffs": 45.3, "Meg": 45.2, "Emz": 44.6, "Lou": 44.2, "Kenji": 43.9, "Spike": 43.5, "Crow": 43.4, "Gus": 43.4, "Trunk": 43.3, "Byron": 43.2, "Sirius": 43.2, "Doug": 43.1, "Fang": 42.8, "R-T": 42.6, "Janet": 42.3, "Mina": 42.1, "Najia": 42.1, "Squeak": 41.9, "Surge": 41.9, "Rosa": 41.6, "Frank": 41.4, "Chester": 41.2, "Kit": 41.2, "Moe": 41.2, "Grom": 41, "Draco": 40.6, "Sprout": 40.5, "Berry": 40.4, "Stu": 40.4, "Tara": 40.1, "Leon": 40, "Gray": 39, "Dynamike": 38.4, "Larry & Lawrie": 38.4, "Meeple": 37.7, "Buster": 37.1, "Damian": 37, "Poco": 36.3, "Mortis": 36.1, "Jacky": 36, "Barley": 35.9, "Shelly": 35.1, "Hank": 34.7, "Ziggy": 34.6, "Jae-Yong": 33.8, "Sandy": 32.9, "Willow": 31.6, "Tick": 30.1, "Ollie": 28.1, "Gene": 25 },
    pickRates: { "Wendy": 0.4, "Nori": 12.7, "8-Bit": 25.2, "Eve": 4.1, "Sam": 0.2, "Mico": 12.6, "Chuck": 13.8, "Carl": 7.2, "Jessie": 23.2, "Colt": 50.1, "Lola": 2.2, "Melodie": 9.9, "Bolt": 5.9, "Bibi": 3.2, "Bonnie": 0.9, "Edgar": 27.5, "Bull": 5, "Shade": 2.6, "Otis": 6.7, "Nita": 10.1, "Juju": 0.8, "Kaze": 11.6, "Griff": 18.6, "Bo": 12, "Angelo": 8.6, "Alli": 2, "Pearl": 1.3, "Brock": 40.1, "Starr Nova": 4.9, "Lily": 1.7, "Mr. P": 0.5, "Piper": 22.6, "Darryl": 2.3, "Clancy": 0.8, "Nani": 11, "Charlie": 1, "Rico": 21.2, "Max": 3.4, "Gigi": 0.8, "Ash": 0.1, "Amber": 5, "Colette": 22.4, "Maisie": 0.7, "Bea": 2.7, "Buzz": 1.8, "Lumi": 1.6, "Penny": 7.8, "Pierce": 15.3, "Belle": 3.8, "Gale": 0.9, "Finx": 0.3, "Glowy": 0.4, "Cordelius": 1.7, "El Primo": 1.4, "Mandy": 20.9, "Pam": 0.2, "Ruffs": 0.4, "Meg": 11, "Emz": 10.3, "Lou": 0.8, "Kenji": 0.9, "Spike": 8.6, "Crow": 22.7, "Gus": 1.5, "Trunk": 0.5, "Byron": 10.2, "Sirius": 2.2, "Doug": 0.4, "Fang": 3, "R-T": 0.6, "Janet": 0.2, "Mina": 0.5, "Najia": 3.3, "Squeak": 4.8, "Surge": 4.7, "Rosa": 0.1, "Frank": 1.9, "Chester": 2.3, "Kit": 1.4, "Moe": 0.3, "Grom": 1.1, "Draco": 0.3, "Sprout": 0.7, "Berry": 10.4, "Stu": 0.9, "Tara": 3, "Leon": 2.6, "Gray": 0.4, "Dynamike": 3.7, "Larry & Lawrie": 0.4, "Meeple": 0.5, "Buster": 0.1, "Damian": 0.5, "Poco": 0.3, "Mortis": 1.6, "Jacky": 0.1, "Barley": 0.6, "Shelly": 1.2, "Hank": 0.1, "Ziggy": 0.2, "Jae-Yong": 0.1, "Sandy": 0.1, "Willow": 0.5, "Tick": 2.1, "Ollie": 0, "Gene": 0.1 },
    notes: "Terreno limitato, poca mobilità: i marksman sparano lungo le corsie senza spostarsi.",
  },
  {
    mode: "Heist", name: "Safe Zone", sample: 1943186, updated: "2026-09-10",
    winRates: { "Nori": 64.1, "Chuck": 63.8, "Bolt": 61.8, "Mico": 60.8, "Wendy": 59.9, "Jessie": 58, "Eve": 56.9, "Carl": 56.7, "Starr Nova": 55.6, "Penny": 55.3, "Shade": 55, "Melodie": 54.7, "Edgar": 54.2, "8-Bit": 53.6, "Bibi": 53.5, "Clancy": 53.3, "Nita": 53.3, "Bull": 52.5, "Sam": 52.1, "Gigi": 51.8, "Juju": 51.6, "Darryl": 51.3, "Lily": 51.2, "Bonnie": 51.1, "Bo": 50.7, "Mr. P": 50.6, "Kaze": 50.3, "Griff": 49.7, "Grom": 49.6, "Ash": 49.5, "Alli": 49.2, "Angelo": 48.4, "Brock": 48.4, "Colette": 48.2, "Surge": 48.1, "Otis": 48, "Emz": 47.8, "Colt": 47.7, "Gus": 47.6, "Doug": 47.5, "Belle": 47.1, "Crow": 47, "Max": 46.7, "Amber": 46.5, "Kenji": 46.5, "Glowy": 46.3, "Rico": 46.3, "Fang": 46.1, "Gale": 46.1, "Pierce": 46.1, "Buzz": 45.9, "Trunk": 45.9, "Rosa": 45.8, "Cordelius": 45.5, "El Primo": 45.1, "Mandy": 45.1, "Bea": 44.9, "Buster": 44.9, "Ruffs": 44.9, "Lola": 44.6, "Pearl": 44.5, "Finx": 44.4, "Mina": 44.3, "Najia": 44.3, "Janet": 44.1, "Poco": 43.9, "Charlie": 43.7, "Spike": 43.7, "Meg": 43.4, "Maisie": 43.3, "Lou": 43.1, "R-T": 43, "Lumi": 42.9, "Berry": 42.8, "Draco": 42.8, "Moe": 42.8, "Tara": 42.5, "Larry & Lawrie": 42.4, "Piper": 42.3, "Sirius": 42.2, "Gray": 42.1, "Squeak": 41.8, "Byron": 41.7, "Kit": 41.6, "Pam": 41.6, "Chester": 41.4, "Jacky": 41.3, "Damian": 41, "Tick": 40.8, "Stu": 40.6, "Frank": 40.5, "Mortis": 40.5, "Nani": 40.5, "Barley": 40.2, "Sprout": 39.6, "Sandy": 39.5, "Dynamike": 39, "Ziggy": 38.9, "Leon": 38.2, "Meeple": 38, "Hank": 36, "Shelly": 35.4, "Willow": 35, "Jae-Yong": 33, "Ollie": 33, "Gene": 27.2 },
    pickRates: { "Nori": 13.3, "Chuck": 14.5, "Bolt": 4.3, "Mico": 18.1, "Wendy": 0.4, "Jessie": 25.2, "Eve": 2.8, "Carl": 10.9, "Starr Nova": 6.7, "Penny": 23.7, "Shade": 3.2, "Melodie": 7.1, "Edgar": 30.7, "8-Bit": 23.8, "Bibi": 3.2, "Clancy": 1.1, "Nita": 10.9, "Bull": 6.3, "Sam": 0.1, "Gigi": 1, "Juju": 0.6, "Darryl": 2.7, "Lily": 2.4, "Bonnie": 0.6, "Bo": 14.7, "Mr. P": 0.4, "Kaze": 10.3, "Griff": 21.9, "Grom": 2.1, "Ash": 0.2, "Alli": 0.8, "Angelo": 4.8, "Brock": 39, "Colette": 22.4, "Surge": 7.4, "Otis": 5.8, "Emz": 11.6, "Colt": 44.3, "Gus": 1.2, "Doug": 0.5, "Belle": 2.8, "Crow": 24.5, "Max": 2.5, "Amber": 4.2, "Kenji": 1, "Glowy": 0.3, "Rico": 18.8, "Fang": 3.8, "Gale": 1, "Pierce": 13.2, "Buzz": 2, "Trunk": 0.6, "Rosa": 0.1, "Cordelius": 2.8, "El Primo": 1.6, "Mandy": 20.6, "Bea": 1.5, "Buster": 0.1, "Ruffs": 0.5, "Lola": 0.9, "Pearl": 1.1, "Finx": 0.3, "Mina": 0.5, "Najia": 2.6, "Janet": 0.3, "Poco": 0.5, "Charlie": 0.6, "Spike": 9.1, "Meg": 11.5, "Maisie": 0.5, "Lou": 0.8, "R-T": 0.7, "Lumi": 1.7, "Berry": 11.7, "Draco": 0.3, "Moe": 0.3, "Tara": 3.4, "Larry & Lawrie": 0.4, "Piper": 9.7, "Sirius": 2.3, "Gray": 0.4, "Squeak": 5.5, "Byron": 4.5, "Kit": 1, "Pam": 0.2, "Chester": 2.5, "Jacky": 0.1, "Damian": 0.6, "Tick": 3.9, "Stu": 0.8, "Frank": 2, "Mortis": 1.8, "Nani": 3.7, "Barley": 0.8, "Sprout": 0.8, "Sandy": 0.2, "Dynamike": 4.3, "Ziggy": 0.2, "Leon": 2.2, "Meeple": 0.5, "Hank": 0.1, "Shelly": 1.3, "Willow": 0.6, "Jae-Yong": 0.1, "Ollie": 0, "Gene": 0.1 },
    notes: "Tre corsie ben definite; casseforti poco protette dai tiri lunghi.",
  },
  {
    mode: "Heist", name: "Kaboom Canyon", sample: 1943130, updated: "2026-09-10",
    winRates: { "Nori": 64.8, "Wendy": 61.2, "Mico": 59.9, "Bolt": 57.2, "Carl": 57.1, "Bibi": 56.5, "Melodie": 56.5, "Nita": 56.3, "Eve": 56.2, "Jessie": 55.8, "Bull": 55.5, "Clancy": 55.4, "Sam": 55.2, "Edgar": 55, "8-Bit": 54.5, "Starr Nova": 54.2, "Chuck": 53.2, "Griff": 53, "Gigi": 52.9, "Shade": 52.7, "Finx": 51.8, "Darryl": 51.7, "Ash": 51.5, "Otis": 51.4, "Lola": 51.3, "Kaze": 51, "Lily": 50.8, "Bonnie": 50.2, "Doug": 49.9, "Emz": 49.5, "Pearl": 49.5, "Colette": 49.4, "Colt": 49.3, "Bo": 49.2, "Cordelius": 49.1, "Amber": 48.9, "Glowy": 48.9, "Rosa": 48.9, "Surge": 48.8, "Crow": 48.4, "Alli": 48.3, "Gale": 48.2, "Penny": 48.1, "Bea": 47.6, "Gus": 47.6, "Mr. P": 47.4, "Buzz": 47.1, "Lumi": 47.1, "Angelo": 46.9, "Charlie": 46.6, "Max": 46.6, "Trunk": 46.6, "Brock": 46.4, "Kenji": 46.4, "Meg": 46.4, "Maisie": 46.2, "R-T": 46, "Rico": 46, "El Primo": 45.9, "Belle": 45.5, "Juju": 45.4, "Fang": 45.2, "Pierce": 45.2, "Ruffs": 44.6, "Frank": 44.3, "Tara": 44.3, "Chester": 44.2, "Sirius": 44.2, "Buster": 44, "Nani": 43.9, "Moe": 43.6, "Spike": 43.3, "Pam": 43.1, "Kit": 42.9, "Lou": 42.8, "Mina": 42.7, "Jacky": 42.6, "Byron": 42.5, "Gray": 42.5, "Piper": 42.5, "Draco": 42.2, "Janet": 42.2, "Berry": 41.8, "Larry & Lawrie": 41.6, "Stu": 41.3, "Leon": 40.7, "Najia": 40.3, "Sandy": 40.2, "Poco": 40.1, "Damian": 39.3, "Mandy": 38.7, "Dynamike": 38.6, "Meeple": 38.5, "Grom": 38.4, "Mortis": 38.3, "Squeak": 38.2, "Barley": 38, "Shelly": 37.9, "Hank": 37.1, "Sprout": 34.4, "Willow": 33.6, "Ollie": 33, "Ziggy": 32, "Jae-Yong": 31.1, "Tick": 30.9, "Gene": 26.5 },
    pickRates: { "Nori": 13.7, "Wendy": 0.4, "Mico": 18.1, "Bolt": 5.4, "Carl": 9.5, "Bibi": 5, "Melodie": 9.4, "Nita": 14.8, "Eve": 2.7, "Jessie": 22.9, "Bull": 10.7, "Clancy": 1.7, "Sam": 0.2, "Edgar": 31.7, "8-Bit": 19.9, "Starr Nova": 9.6, "Chuck": 15.1, "Griff": 28.2, "Gigi": 1.1, "Shade": 3.4, "Finx": 0.8, "Darryl": 2.9, "Ash": 0.2, "Otis": 6.3, "Lola": 1.6, "Kaze": 11.9, "Lily": 2.9, "Bonnie": 0.5, "Doug": 0.7, "Emz": 13.8, "Pearl": 1.5, "Colette": 21.5, "Colt": 44.6, "Bo": 11.8, "Cordelius": 3.8, "Amber": 4.8, "Glowy": 0.5, "Rosa": 0.2, "Surge": 10.2, "Crow": 29.7, "Alli": 2.3, "Gale": 1.1, "Penny": 11.9, "Bea": 1.3, "Gus": 1.1, "Mr. P": 0.4, "Buzz": 2.2, "Lumi": 2.1, "Angelo": 3.9, "Charlie": 0.8, "Max": 2.7, "Trunk": 0.8, "Brock": 35.5, "Kenji": 1.3, "Meg": 13.4, "Maisie": 0.5, "R-T": 0.7, "Rico": 15, "El Primo": 2, "Belle": 1.4, "Juju": 0.6, "Fang": 3.1, "Pierce": 9.4, "Ruffs": 0.4, "Frank": 2.5, "Tara": 4.2, "Chester": 3.4, "Sirius": 2.7, "Buster": 0.1, "Nani": 3.7, "Moe": 0.4, "Spike": 9.3, "Pam": 0.2, "Kit": 1.3, "Lou": 0.6, "Mina": 0.5, "Jacky": 0.2, "Byron": 3.8, "Gray": 0.5, "Piper": 6.7, "Draco": 0.4, "Janet": 0.2, "Berry": 13, "Larry & Lawrie": 0.6, "Stu": 1.1, "Leon": 2.8, "Najia": 1.5, "Sandy": 0.2, "Poco": 0.4, "Damian": 0.7, "Mandy": 9.9, "Dynamike": 6.2, "Meeple": 0.6, "Grom": 1.4, "Mortis": 2, "Squeak": 3.4, "Barley": 1.1, "Shelly": 1.8, "Hank": 0.1, "Sprout": 0.5, "Willow": 0.8, "Ollie": 0, "Ziggy": 0.2, "Jae-Yong": 0.1, "Tick": 3.1, "Gene": 0.1 },
    notes: "Mappa molto aperta, simmetria diagonale.",
  },
  {
    mode: "Heist", name: "Safe(r) Zone", sample: 867015, updated: "2026-09-10",
    winRates: { "Chuck": 64.4, "Nori": 63, "Bolt": 62.2, "Mico": 62, "Jessie": 56.2, "Carl": 56.1, "Eve": 55.9, "Penny": 55.9, "Starr Nova": 55.7, "Sam": 55, "Melodie": 54.9, "Edgar": 54.6, "8-Bit": 54.1, "Clancy": 54.1, "Shade": 53.5, "Bibi": 53.1, "Bull": 52.9, "Alli": 52.5, "Darryl": 52.2, "Gigi": 52.2, "Nita": 51.9, "Ash": 51.7, "Bonnie": 51.4, "Juju": 51.2, "Lily": 51.1, "Surge": 50.1, "Kaze": 49.7, "Crow": 49.4, "Grom": 49.3, "Griff": 49.2, "Bo": 49.1, "Mr. P": 48.7, "Colette": 48.6, "Angelo": 48.2, "Trunk": 47.9, "Brock": 47.8, "Colt": 47.6, "Otis": 47.5, "Doug": 47, "Max": 46.8, "Emz": 46.6, "Buzz": 46.5, "Belle": 46.3, "Fang": 45.9, "Glowy": 45.8, "Mandy": 45.8, "Pierce": 45.5, "Cordelius": 45.4, "Najia": 45.4, "Lola": 45.3, "Rico": 44.9, "Rosa": 44.9, "Bea": 44.8, "Finx": 44.6, "Pearl": 44.6, "El Primo": 44.5, "Gale": 44.5, "Janet": 44.4, "Amber": 44.3, "Charlie": 44.3, "Damian": 43.9, "R-T": 43.6, "Mina": 43.5, "Kit": 43.3, "Buster": 43, "Meg": 43, "Draco": 42.9, "Kenji": 42.7, "Moe": 42.7, "Poco": 42.7, "Ruffs": 42.7, "Spike": 42.7, "Gray": 42.6, "Larry & Lawrie": 42.3, "Chester": 42.2, "Berry": 42.1, "Lumi": 42.1, "Lou": 41.8, "Byron": 41.6, "Sirius": 41.4, "Squeak": 41.4, "Nani": 41.3, "Tara": 41, "Piper": 40.9, "Maisie": 40.8, "Jacky": 40.7, "Stu": 40.5, "Mortis": 40.4, "Sandy": 40.1, "Frank": 40, "Tick": 39, "Pam": 38.8, "Ziggy": 38.8, "Barley": 38.6, "Leon": 38.5, "Dynamike": 38, "Meeple": 37, "Sprout": 37, "Hank": 35.6, "Shelly": 35.4, "Gus": 35.1, "Ollie": 34.7, "Jae-Yong": 34.2, "Willow": 33.8, "Gene": 27.8 },
    pickRates: { "Chuck": 17.2, "Nori": 9.5, "Bolt": 4.2, "Mico": 20.3, "Jessie": 24.7, "Carl": 10.6, "Eve": 3.2, "Penny": 25, "Starr Nova": 5.2, "Sam": 0.1, "Melodie": 7.7, "Edgar": 29.8, "8-Bit": 21.1, "Clancy": 1.3, "Shade": 2.6, "Bibi": 3.1, "Bull": 6.1, "Alli": 1, "Darryl": 2.7, "Gigi": 1, "Nita": 10, "Ash": 0.2, "Bonnie": 0.6, "Juju": 0.6, "Lily": 2.7, "Surge": 6.4, "Kaze": 13, "Crow": 27.3, "Grom": 2.1, "Griff": 34, "Bo": 14.7, "Mr. P": 0.4, "Colette": 27.1, "Angelo": 5.7, "Trunk": 0.9, "Brock": 34.6, "Colt": 47.5, "Otis": 6.8, "Doug": 0.4, "Max": 2, "Emz": 10, "Buzz": 1.8, "Belle": 3, "Fang": 4.3, "Glowy": 0.3, "Mandy": 20.8, "Pierce": 14.9, "Cordelius": 2.9, "Najia": 4.8, "Lola": 1.1, "Rico": 17.7, "Rosa": 0.1, "Bea": 1.6, "Finx": 0.3, "Pearl": 0.9, "El Primo": 1.3, "Gale": 0.9, "Janet": 0.3, "Amber": 3.5, "Charlie": 0.8, "Damian": 0.7, "R-T": 0.6, "Mina": 0.6, "Kit": 1, "Buster": 0.1, "Meg": 3.3, "Draco": 0.3, "Kenji": 4.3, "Moe": 0.3, "Poco": 0.5, "Ruffs": 0.5, "Spike": 8.3, "Gray": 0.4, "Larry & Lawrie": 0.4, "Chester": 2.7, "Berry": 3.1, "Lumi": 2, "Lou": 0.7, "Byron": 4.8, "Sirius": 2.1, "Squeak": 5.1, "Nani": 3.6, "Tara": 0.9, "Piper": 8.4, "Maisie": 0.5, "Jacky": 0.1, "Stu": 0.8, "Mortis": 1.8, "Sandy": 0.2, "Frank": 1.6, "Tick": 3.3, "Pam": 0.2, "Ziggy": 0.3, "Barley": 0.8, "Leon": 2.2, "Dynamike": 3.8, "Meeple": 0.5, "Sprout": 0.6, "Hank": 0.1, "Shelly": 1.1, "Gus": 0.4, "Ollie": 0, "Jae-Yong": 0.9, "Willow": 1.1, "Gene": 0.1 },
  },
  {
    mode: "Heist", name: "Pit Stop", sample: 859572, updated: "2026-09-10",
    winRates: { "Nori": 62.5, "Bibi": 60.7, "Mico": 60, "Edgar": 58.1, "Nita": 58, "Shade": 57.7, "Gigi": 57.6, "Sam": 57.5, "Bull": 57.3, "Cordelius": 55.6, "Melodie": 54.2, "Ash": 53.9, "Carl": 53.2, "Dynamike": 52.8, "Berry": 52, "R-T": 51.6, "Larry & Lawrie": 51.4, "Barley": 51.1, "Griff": 51.1, "Buzz": 50.6, "Doug": 50.6, "Surge": 50.2, "Kaze": 50.1, "Starr Nova": 50.1, "Darryl": 49.9, "Lily": 49.9, "Jessie": 49.8, "Clancy": 49.6, "Lumi": 49.2, "El Primo": 48.8, "Juju": 48.8, "Trunk": 48.8, "Kit": 48.4, "Hank": 48.3, "Bolt": 48, "Sirius": 47.8, "Pearl": 47.7, "Otis": 47.6, "Emz": 47.3, "Rosa": 47.2, "Penny": 46.9, "Rico": 46.8, "Ruffs": 46.7, "Crow": 46.5, "Charlie": 46, "8-Bit": 45.9, "Mr. P": 45.9, "Jacky": 45.5, "Frank": 45.4, "Maisie": 45.4, "Colt": 45.3, "Draco": 44.2, "Brock": 44, "Tara": 44, "Bonnie": 43.9, "Eve": 43.7, "Chester": 43.6, "Kenji": 43.4, "Bo": 43.2, "Ziggy": 43.2, "Lou": 43.1, "Moe": 43, "Fang": 42.9, "Leon": 42.6, "Colette": 42.5, "Spike": 42.1, "Amber": 42, "Willow": 42, "Damian": 41.8, "Gale": 41.8, "Alli": 41.7, "Chuck": 41.7, "Lola": 41.4, "Gray": 40.7, "Buster": 40.4, "Meg": 40.4, "Stu": 40.4, "Najia": 40.2, "Meeple": 40, "Max": 39.8, "Sprout": 39.7, "Mina": 39.6, "Grom": 39.5, "Pam": 39.3, "Shelly": 39.2, "Mortis": 38.9, "Finx": 38.8, "Pierce": 38.5, "Janet": 38.3, "Bea": 38, "Sandy": 38, "Mandy": 37.7, "Squeak": 37.6, "Belle": 37.3, "Byron": 36.1, "Nani": 35.7, "Ollie": 35.4, "Glowy": 34.5, "Poco": 33.5, "Gus": 33.4, "Tick": 33.1, "Piper": 31.5, "Angelo": 31.4, "Jae-Yong": 30.5, "Gene": 30.3 },
    pickRates: { "Nori": 11, "Bibi": 15.1, "Mico": 22, "Edgar": 37.6, "Nita": 26.8, "Shade": 16.5, "Gigi": 1.6, "Sam": 0.3, "Bull": 17.8, "Cordelius": 11.2, "Melodie": 7.8, "Ash": 0.4, "Carl": 5.3, "Dynamike": 20.6, "Berry": 15.3, "R-T": 1.4, "Larry & Lawrie": 2.6, "Barley": 7, "Griff": 40.8, "Buzz": 4.7, "Doug": 1, "Surge": 13.7, "Kaze": 17, "Starr Nova": 7.1, "Darryl": 2.7, "Lily": 3.9, "Jessie": 20.2, "Clancy": 2.1, "Lumi": 4.4, "El Primo": 2.4, "Juju": 0.8, "Trunk": 2.4, "Kit": 2.8, "Hank": 0.8, "Bolt": 3.8, "Sirius": 5.4, "Pearl": 0.9, "Otis": 5.2, "Emz": 13.1, "Rosa": 0.2, "Penny": 12.9, "Rico": 21.3, "Ruffs": 0.7, "Crow": 22.4, "Charlie": 0.7, "8-Bit": 7.9, "Mr. P": 0.6, "Jacky": 0.3, "Frank": 2.2, "Maisie": 0.5, "Colt": 25.2, "Draco": 0.5, "Brock": 16.3, "Tara": 1.4, "Bonnie": 0.3, "Eve": 0.3, "Chester": 4.7, "Kenji": 6.5, "Bo": 7.5, "Ziggy": 0.7, "Lou": 0.5, "Moe": 0.5, "Fang": 2.3, "Leon": 3.1, "Colette": 16, "Spike": 7.5, "Amber": 2.4, "Willow": 5.2, "Damian": 1.2, "Gale": 1, "Alli": 0.6, "Chuck": 8.5, "Lola": 0.6, "Gray": 0.5, "Buster": 0.1, "Meg": 3.9, "Stu": 1.1, "Najia": 2.1, "Meeple": 2.6, "Max": 1.1, "Sprout": 0.8, "Mina": 0.7, "Grom": 2.5, "Pam": 0.1, "Shelly": 2, "Mortis": 2.4, "Finx": 0.2, "Pierce": 2.1, "Janet": 0.2, "Bea": 0.5, "Sandy": 0.2, "Mandy": 6.4, "Squeak": 2.6, "Belle": 0.3, "Byron": 1, "Nani": 1.2, "Ollie": 0, "Glowy": 0.2, "Poco": 0.4, "Gus": 0.2, "Tick": 4, "Piper": 0.9, "Angelo": 0.1, "Jae-Yong": 0.7, "Gene": 0.1 },
    notes: "Piena di cespugli, casseforti protette da un lungo muro orizzontale.",
  },
  // ---------- Hot Zone ----------
  {
    mode: "Hot Zone", name: "Dueling Beetles", sample: 1966764, updated: "2026-09-10",
    winRates: { "Wendy": 64.4, "Ash": 58.5, "Bolt": 58.5, "Doug": 57.1, "Damian": 57, "Kenji": 56.9, "Tick": 56.6, "Bibi": 56.5, "Bo": 56.5, "Jessie": 55.8, "Nita": 55.5, "Sandy": 55.4, "Rosa": 55.2, "Clancy": 54.9, "Griff": 54.9, "Sam": 54.9, "Surge": 54.7, "Poco": 54.3, "Starr Nova": 54.2, "Jacky": 54, "Buster": 53.9, "Gus": 53.8, "Penny": 52.1, "Draco": 52, "Emz": 52, "Stu": 51.6, "Edgar": 51.5, "Nori": 51.5, "Carl": 51, "Mortis": 50.9, "Chuck": 50.6, "Mina": 50.5, "Trunk": 50.5, "Hank": 50.4, "Frank": 50.3, "Lou": 50.2, "Meg": 50.1, "Ollie": 50.1, "8-Bit": 49.9, "Bull": 49.6, "Gale": 49.4, "Gray": 49.2, "Mico": 49.2, "Amber": 49.1, "Barley": 49.1, "Larry & Lawrie": 48.9, "Finx": 48.6, "Chester": 48.5, "Pam": 48.5, "Cordelius": 48, "Eve": 48, "Tara": 47.7, "El Primo": 47.5, "Maisie": 47.5, "Lily": 47.3, "Fang": 47, "Moe": 46.6, "Otis": 46.6, "Mr. P": 46.5, "Pearl": 46.3, "Spike": 46.1, "Grom": 46, "Crow": 45.9, "Meeple": 45.9, "R-T": 45.8, "Darryl": 45.7, "Shade": 45.7, "Charlie": 45.3, "Dynamike": 44.8, "Juju": 44.6, "Buzz": 44.5, "Bonnie": 44.4, "Glowy": 44.3, "Bea": 44.1, "Gigi": 44, "Sirius": 43.7, "Berry": 43.3, "Ziggy": 43.1, "Max": 43, "Kaze": 42.7, "Pierce": 42.6, "Ruffs": 42.6, "Janet": 42.4, "Colette": 42.1, "Lumi": 42, "Melodie": 42, "Rico": 41.4, "Leon": 41.3, "Brock": 40.8, "Sprout": 40.4, "Najia": 40.3, "Shelly": 40.3, "Alli": 40.2, "Lola": 39.8, "Squeak": 39, "Kit": 38.8, "Belle": 38, "Willow": 37.8, "Jae-Yong": 37.3, "Byron": 37.2, "Colt": 36.5, "Mandy": 31.8, "Piper": 30.7, "Gene": 29.7, "Nani": 28.9, "Angelo": 27.8 },
    pickRates: { "Wendy": 0.5, "Ash": 1.5, "Bolt": 3.2, "Doug": 5, "Damian": 9, "Kenji": 8.9, "Tick": 16.5, "Bibi": 16.8, "Bo": 28.2, "Jessie": 10.4, "Nita": 4.4, "Sandy": 4, "Rosa": 0.8, "Clancy": 2.1, "Griff": 33.4, "Sam": 0.2, "Surge": 22.2, "Poco": 7.4, "Starr Nova": 9.9, "Jacky": 1.1, "Buster": 0.8, "Gus": 1.3, "Penny": 17, "Draco": 1.3, "Emz": 33.3, "Stu": 7.5, "Edgar": 28.6, "Nori": 9.7, "Carl": 3.3, "Mortis": 12.4, "Chuck": 2.9, "Mina": 4.1, "Trunk": 2.9, "Hank": 1.1, "Frank": 9.9, "Lou": 9.7, "Meg": 23.7, "Ollie": 0.2, "8-Bit": 8.9, "Bull": 5.7, "Gale": 4.1, "Gray": 3.2, "Mico": 1.4, "Amber": 3, "Barley": 6.8, "Larry & Lawrie": 1.8, "Finx": 1.9, "Chester": 8.5, "Pam": 0.9, "Cordelius": 2.1, "Eve": 0.1, "Tara": 13.8, "El Primo": 2.7, "Maisie": 0.9, "Lily": 1.8, "Fang": 7.4, "Moe": 0.4, "Otis": 3.4, "Mr. P": 0.5, "Pearl": 1.6, "Spike": 13.9, "Grom": 4.5, "Crow": 11.6, "Meeple": 7.1, "R-T": 0.5, "Darryl": 1.5, "Shade": 3.6, "Charlie": 0.5, "Dynamike": 18.8, "Juju": 0.5, "Buzz": 2.4, "Bonnie": 0.1, "Glowy": 0.5, "Bea": 0.7, "Gigi": 0.9, "Sirius": 5, "Berry": 21, "Ziggy": 1.3, "Max": 3.2, "Kaze": 2.2, "Pierce": 5.7, "Ruffs": 1.9, "Janet": 0.2, "Colette": 4.5, "Lumi": 4.9, "Melodie": 0.5, "Rico": 6.5, "Leon": 2, "Brock": 10.7, "Sprout": 2.2, "Najia": 1.2, "Shelly": 3, "Alli": 0.3, "Lola": 0.3, "Squeak": 7.4, "Kit": 1.4, "Belle": 0.3, "Willow": 3, "Jae-Yong": 0.1, "Byron": 1.2, "Colt": 4.5, "Mandy": 1.3, "Piper": 0.6, "Gene": 0.1, "Nani": 0.3, "Angelo": 0.1 },
    notes: "Poco spazio per le gittate lunghissime: dominano AoE e medio raggio.",
  },
  {
    mode: "Hot Zone", name: "Open Business", sample: 1965103, updated: "2026-09-10",
    winRates: { "Wendy": 64.9, "Ash": 60.7, "Tick": 58.1, "Jessie": 58, "Bolt": 57.8, "Sandy": 57.8, "Kenji": 57.6, "Damian": 57, "Bibi": 56.2, "Hank": 56.1, "Clancy": 56, "Nita": 55.7, "Poco": 55.4, "Sam": 55.4, "Buster": 55.3, "Surge": 55.2, "Bo": 55, "Doug": 55, "Starr Nova": 54.8, "Draco": 54.4, "Griff": 54, "Rosa": 53.6, "Gray": 53.2, "Gus": 53.2, "Larry & Lawrie": 53.1, "Stu": 53, "Emz": 52.7, "Carl": 52.3, "Chuck": 52.1, "Ollie": 51.9, "Jacky": 51.7, "Frank": 51.6, "Nori": 51.3, "Mina": 51.2, "Juju": 51, "Mortis": 51, "Eve": 50.9, "Meg": 50.9, "Bull": 50.7, "Barley": 50.6, "Edgar": 50.6, "Penny": 50.4, "Trunk": 50.4, "8-Bit": 50.1, "Gale": 50.1, "Mr. P": 50, "Lou": 48.9, "Pam": 48.8, "Chester": 48.6, "Mico": 48.6, "Tara": 48.5, "Amber": 48.4, "Cordelius": 48.4, "Finx": 48.2, "Shade": 48, "Fang": 47.9, "Maisie": 47.7, "Moe": 47.7, "Spike": 47.6, "Meeple": 47.2, "Sirius": 47.2, "Darryl": 47, "Charlie": 46.8, "Pearl": 46.6, "R-T": 46.5, "Crow": 46.3, "El Primo": 46.3, "Otis": 46.2, "Ziggy": 46.1, "Bonnie": 45.8, "Grom": 45.8, "Buzz": 45.7, "Glowy": 45.2, "Dynamike": 45, "Ruffs": 45, "Lily": 44.6, "Bea": 44.5, "Gigi": 44.3, "Kaze": 43.5, "Janet": 43.3, "Berry": 43.1, "Najia": 42.9, "Pierce": 42.9, "Max": 42.7, "Leon": 42.2, "Melodie": 42, "Colette": 41.9, "Lumi": 41.9, "Willow": 41.5, "Rico": 41.4, "Sprout": 39.9, "Squeak": 39.9, "Lola": 39.6, "Shelly": 39.6, "Belle": 39.3, "Brock": 39.1, "Kit": 39.1, "Jae-Yong": 39, "Alli": 38.7, "Colt": 37, "Byron": 36.9, "Piper": 33.1, "Mandy": 31.6, "Gene": 30.7, "Nani": 28.9, "Angelo": 28.4 },
    pickRates: { "Wendy": 0.5, "Ash": 1.7, "Tick": 16.1, "Jessie": 10.5, "Bolt": 4, "Sandy": 4.2, "Kenji": 8.1, "Damian": 7.2, "Bibi": 12.4, "Hank": 1, "Clancy": 2.2, "Nita": 3.6, "Poco": 7.9, "Sam": 0.2, "Buster": 0.8, "Surge": 22, "Bo": 29.6, "Doug": 3.3, "Starr Nova": 10.5, "Draco": 1.2, "Griff": 34.6, "Rosa": 0.5, "Gray": 2.9, "Gus": 1.4, "Larry & Lawrie": 1.4, "Stu": 10.3, "Emz": 32, "Carl": 3.8, "Chuck": 3.1, "Ollie": 0.2, "Jacky": 0.6, "Frank": 8.7, "Nori": 9.8, "Mina": 4.6, "Juju": 0.4, "Mortis": 13, "Eve": 0.1, "Meg": 24.3, "Bull": 4.4, "Barley": 5.1, "Edgar": 26.4, "Penny": 11.6, "Trunk": 2.3, "8-Bit": 10.5, "Gale": 4.6, "Mr. P": 0.5, "Lou": 9.9, "Pam": 0.9, "Chester": 8.8, "Mico": 1.2, "Tara": 14.3, "Amber": 3.2, "Cordelius": 1.8, "Finx": 2.3, "Shade": 3.4, "Fang": 10.7, "Maisie": 0.9, "Moe": 0.6, "Spike": 14.7, "Meeple": 7.2, "Sirius": 4.7, "Darryl": 1.5, "Charlie": 0.6, "Pearl": 2, "R-T": 0.4, "Crow": 15.1, "El Primo": 2.3, "Otis": 3.6, "Ziggy": 1, "Bonnie": 0.2, "Grom": 3.8, "Buzz": 2.3, "Glowy": 0.7, "Dynamike": 14.6, "Ruffs": 2.5, "Lily": 1.1, "Bea": 1.1, "Gigi": 0.9, "Kaze": 2.3, "Janet": 0.3, "Berry": 18.2, "Najia": 1.5, "Pierce": 8.1, "Max": 4.1, "Leon": 2.5, "Melodie": 0.4, "Colette": 5.6, "Lumi": 5.5, "Willow": 2.5, "Rico": 6.5, "Sprout": 1.2, "Squeak": 7.7, "Lola": 0.4, "Shelly": 2.5, "Belle": 0.5, "Brock": 13.8, "Kit": 1.5, "Jae-Yong": 0.2, "Alli": 0.2, "Colt": 7.2, "Byron": 1.9, "Piper": 1.2, "Mandy": 1.5, "Gene": 0.2, "Nani": 0.5, "Angelo": 0.1 },
    notes: "I throwers fanno negazione d'area da dietro i muri.",
  },
  {
    mode: "Hot Zone", name: "Ring of Fire", sample: 1955834, updated: "2026-09-10",
    winRates: { "Wendy": 73, "Bolt": 63.8, "Ash": 60, "Bo": 59.6, "Poco": 57.8, "Clancy": 57.7, "Griff": 57.7, "Jessie": 57.7, "Damian": 57.2, "Eve": 57, "Rosa": 56.7, "Kenji": 56.5, "Tick": 56.1, "Draco": 55.8, "Buster": 55.5, "Chuck": 55.4, "Sandy": 55.1, "Starr Nova": 55.1, "Sam": 54.9, "Mina": 54.2, "Gale": 53.8, "Meg": 53.8, "Gray": 53.7, "Bibi": 53.3, "Finx": 53.1, "8-Bit": 52.8, "Pam": 52.8, "Stu": 52.8, "Doug": 52.5, "Surge": 52.1, "Gus": 51.8, "Penny": 51.7, "Nita": 51.6, "Glowy": 51.5, "Fang": 51.4, "Emz": 51.3, "Mortis": 51.1, "Ollie": 50.6, "Carl": 50.5, "Nori": 50.4, "Edgar": 50.2, "Lou": 50.2, "Bonnie": 50, "Frank": 49.7, "Crow": 49.6, "Mr. P": 49.6, "Amber": 49.5, "Bull": 49.5, "Alli": 49.2, "Pearl": 49.1, "Jacky": 49, "Spike": 48.9, "Tara": 48.9, "Chester": 48.8, "Trunk": 48.5, "Darryl": 48.2, "Bea": 47, "Otis": 47, "Juju": 46.7, "Mico": 46.6, "Charlie": 46.5, "Max": 46.5, "El Primo": 46.1, "Lily": 45.3, "Maisie": 45.1, "Melodie": 45.1, "Cordelius": 44.9, "Hank": 44.6, "Lola": 44.6, "Moe": 44.5, "Shade": 44.4, "Kaze": 44.2, "Colette": 43.9, "Grom": 43.6, "Leon": 43.6, "Pierce": 43.6, "Buzz": 43.5, "Gigi": 43.5, "Meeple": 43.2, "Belle": 42.8, "Janet": 42.7, "R-T": 42.2, "Brock": 42.1, "Ruffs": 41.6, "Rico": 41.2, "Larry & Lawrie": 40.4, "Shelly": 40.4, "Squeak": 40.3, "Barley": 40.2, "Byron": 39.8, "Berry": 39.7, "Colt": 39.7, "Sirius": 39.7, "Najia": 39.4, "Jae-Yong": 39.3, "Angelo": 39, "Kit": 38.7, "Lumi": 38.5, "Ziggy": 35.9, "Dynamike": 35.6, "Nani": 35.4, "Piper": 35.4, "Sprout": 35, "Willow": 32.5, "Mandy": 32.3, "Gene": 31.5 },
    pickRates: { "Wendy": 0.5, "Bolt": 5.2, "Ash": 0.9, "Bo": 33.7, "Poco": 7.7, "Clancy": 1.9, "Griff": 32.4, "Jessie": 10.9, "Damian": 5.7, "Eve": 0.5, "Rosa": 0.5, "Kenji": 5.2, "Tick": 16.8, "Draco": 1.1, "Buster": 0.6, "Chuck": 3.8, "Sandy": 2.7, "Starr Nova": 8.3, "Sam": 0.2, "Mina": 3.9, "Gale": 4.5, "Meg": 23, "Gray": 2.4, "Bibi": 7.9, "Finx": 3.1, "8-Bit": 16.1, "Pam": 1.1, "Stu": 6.3, "Doug": 2.5, "Surge": 15.3, "Gus": 1.6, "Penny": 19.9, "Nita": 2.3, "Glowy": 0.9, "Fang": 19.3, "Emz": 26.5, "Mortis": 11.5, "Ollie": 0.1, "Carl": 3.6, "Nori": 9.4, "Edgar": 24.8, "Lou": 12.3, "Bonnie": 0.3, "Frank": 6.3, "Crow": 19.8, "Mr. P": 0.5, "Amber": 3.9, "Bull": 3.4, "Alli": 2, "Pearl": 2.3, "Jacky": 0.4, "Spike": 15.8, "Tara": 13.2, "Chester": 7.2, "Trunk": 1.5, "Darryl": 1.4, "Bea": 2.4, "Otis": 3.7, "Juju": 0.8, "Mico": 0.8, "Charlie": 0.6, "Max": 5.9, "El Primo": 1.7, "Lily": 1.8, "Maisie": 0.7, "Melodie": 0.5, "Cordelius": 1, "Hank": 0.3, "Lola": 0.6, "Moe": 0.3, "Shade": 1.6, "Kaze": 2.1, "Colette": 6.7, "Grom": 4.3, "Leon": 3, "Pierce": 17.2, "Buzz": 1.8, "Gigi": 0.8, "Meeple": 2.8, "Belle": 1.5, "Janet": 0.3, "R-T": 0.3, "Brock": 19.8, "Ruffs": 1.6, "Rico": 6.7, "Larry & Lawrie": 0.9, "Shelly": 2.1, "Squeak": 8.9, "Barley": 3.1, "Byron": 4.8, "Berry": 14.5, "Colt": 8.8, "Sirius": 3.1, "Najia": 1.7, "Jae-Yong": 0.2, "Angelo": 0.3, "Kit": 1.4, "Lumi": 4.2, "Ziggy": 0.7, "Dynamike": 9.1, "Nani": 1, "Piper": 3.5, "Sprout": 1.3, "Willow": 1.4, "Mandy": 2.4, "Gene": 0.4 },
    notes: "Anello di muri attorno alla zona centrale. Tornata nel pool dopo essere stata fuori a lungo.",
  },
  {
    mode: "Hot Zone", name: "Parallel Plays", sample: 1948597, updated: "2026-09-10",
    winRates: { "Doug": 60.6, "R-T": 60.5, "Juju": 60.1, "Hank": 58.5, "Bibi": 58.3, "Jacky": 57.8, "Wendy": 57.6, "Ash": 56.1, "Trunk": 55.3, "Bolt": 55, "Larry & Lawrie": 55, "Kenji": 54.5, "Nita": 54.4, "Surge": 54.1, "Sam": 54, "Sirius": 53.8, "Rosa": 53.5, "Edgar": 53.2, "Gus": 53.2, "Bull": 52.1, "El Primo": 51.9, "Nori": 51.9, "Lou": 51.4, "Shade": 51.1, "Barley": 51, "Damian": 50.7, "Mico": 50.5, "Tick": 50.4, "Carl": 50.2, "Stu": 50.2, "Buzz": 49.9, "Cordelius": 49.9, "Pearl": 49.8, "Maisie": 49.2, "Starr Nova": 49.2, "Griff": 48.9, "Lily": 48.6, "Otis": 47.9, "Dynamike": 47.7, "Fang": 47.5, "Gigi": 47.4, "Mortis": 47.4, "Moe": 47.1, "Willow": 47.1, "Mina": 47, "Chester": 46.9, "Buster": 46.8, "Meeple": 46.8, "Amber": 46.7, "Gale": 46.6, "Charlie": 46.4, "Eve": 46.3, "Kit": 46.3, "Darryl": 46.1, "Berry": 46, "Ruffs": 45.8, "Lumi": 45.7, "Emz": 45.6, "Frank": 44.7, "Mr. P": 44.4, "Shelly": 44.4, "Spike": 44.3, "Ollie": 44.1, "Clancy": 43.8, "Leon": 43.8, "Melodie": 43.4, "Meg": 43.1, "Ziggy": 43.1, "Gray": 43, "Pam": 43, "Jessie": 42.9, "Tara": 42.9, "Draco": 42.8, "Bo": 42.7, "Kaze": 42.6, "Sandy": 42.3, "Brock": 42.2, "Chuck": 41.9, "Finx": 41.9, "Max": 41.8, "Bonnie": 41.6, "Penny": 41.3, "Crow": 41.2, "Poco": 40.7, "8-Bit": 40.3, "Colette": 40.2, "Najia": 40.2, "Rico": 40.1, "Alli": 39.9, "Squeak": 39.6, "Bea": 39.4, "Byron": 38.4, "Pierce": 38.4, "Glowy": 37.8, "Janet": 37.7, "Grom": 37.6, "Lola": 36.3, "Sprout": 35.6, "Jae-Yong": 35.5, "Colt": 34.8, "Mandy": 34.6, "Nani": 34, "Gene": 32.8, "Belle": 32.7, "Angelo": 32.1, "Piper": 31.8 },
    pickRates: { "Doug": 19, "R-T": 7, "Juju": 10, "Hank": 6.7, "Bibi": 30.2, "Jacky": 9.8, "Wendy": 0.4, "Ash": 2.2, "Trunk": 12.1, "Bolt": 2.2, "Larry & Lawrie": 4.9, "Kenji": 12.6, "Nita": 8.7, "Surge": 31.2, "Sam": 0.4, "Sirius": 11.4, "Rosa": 0.9, "Edgar": 32.9, "Gus": 1.2, "Bull": 12.4, "El Primo": 5.2, "Nori": 13.8, "Lou": 2.6, "Shade": 25.2, "Barley": 6.8, "Damian": 7, "Mico": 15, "Tick": 8.3, "Carl": 2.3, "Stu": 6.7, "Buzz": 8.8, "Cordelius": 10.2, "Pearl": 1.3, "Maisie": 0.8, "Starr Nova": 9.9, "Griff": 20.4, "Lily": 3.9, "Otis": 3.5, "Dynamike": 14.1, "Fang": 4.2, "Gigi": 1.5, "Mortis": 9.4, "Moe": 0.5, "Willow": 8, "Mina": 2.6, "Chester": 7.6, "Buster": 0.3, "Meeple": 8.2, "Amber": 2, "Gale": 3.3, "Charlie": 0.6, "Eve": 0.3, "Kit": 5.4, "Darryl": 2.2, "Berry": 22.1, "Ruffs": 1, "Lumi": 3.6, "Emz": 19.9, "Frank": 4.6, "Mr. P": 0.7, "Shelly": 6.1, "Spike": 8.6, "Ollie": 0.2, "Clancy": 0.9, "Leon": 4.1, "Melodie": 0.9, "Meg": 15.7, "Ziggy": 0.7, "Gray": 0.6, "Pam": 0.4, "Jessie": 4.2, "Tara": 7.4, "Draco": 0.6, "Bo": 6.5, "Kaze": 3.7, "Sandy": 0.9, "Brock": 6.3, "Chuck": 1.2, "Finx": 0.4, "Max": 1.7, "Bonnie": 0.1, "Penny": 2.3, "Crow": 6.3, "Poco": 1.2, "8-Bit": 3, "Colette": 3.1, "Najia": 0.9, "Rico": 6.2, "Alli": 1.2, "Squeak": 4.9, "Bea": 0.5, "Byron": 0.6, "Pierce": 1.2, "Glowy": 0.3, "Janet": 0.2, "Grom": 0.9, "Lola": 0.2, "Sprout": 0.6, "Jae-Yong": 0.1, "Colt": 2.8, "Mandy": 1, "Nani": 0.5, "Gene": 0.1, "Belle": 0.1, "Angelo": 0.2, "Piper": 0.5 },
    notes: "Due zone e centro aperto, poche mura: conviene allargarsi per il controllo.",
  },
  // ---------- Knockout ----------
  {
    mode: "Knockout", name: "Out in the Open", sample: 1989835, updated: "2026-09-10",
    winRates: { "Wendy": 67.9, "Pearl": 62.3, "Bolt": 59, "Mr. P": 58.9, "Eve": 58.4, "Brock": 58.1, "Buster": 56.9, "Grom": 55.8, "Carl": 55.7, "Angelo": 55, "Bonnie": 54.7, "Tick": 54.2, "Rosa": 54, "Ash": 53.4, "Doug": 53.1, "8-Bit": 52.9, "Darryl": 52.6, "Ollie": 52.5, "R-T": 52.5, "Mico": 52.2, "Piper": 51.7, "Sprout": 51.5, "Edgar": 51.4, "Otis": 51.2, "Poco": 51.2, "Meeple": 51.1, "Squeak": 51, "Bo": 50.9, "Najia": 50.7, "Meg": 50.6, "Lily": 50.5, "Gigi": 50.3, "Gus": 50.3, "Gene": 50.1, "Gray": 50.1, "Janet": 50.1, "Mina": 50.1, "Leon": 49.9, "Maisie": 49.9, "Starr Nova": 49.8, "Spike": 49.7, "Belle": 49.6, "Mandy": 49.6, "Damian": 49.5, "Penny": 49.4, "Ruffs": 49.4, "Nani": 49.3, "Charlie": 49.1, "Glowy": 49.1, "Jae-Yong": 49.1, "Sam": 49.1, "Griff": 49, "Emz": 48.8, "Fang": 48.7, "Jacky": 48.7, "Gale": 48.5, "Max": 48.3, "Byron": 48.2, "Rico": 47.9, "Juju": 47.8, "Pam": 47.7, "Bea": 47.5, "Stu": 47.5, "Mortis": 47.4, "Finx": 47.3, "Surge": 47.3, "Chester": 47.2, "Lola": 47, "Kit": 46.8, "Pierce": 46.7, "Amber": 46.3, "Jessie": 46.2, "Moe": 46.2, "Bibi": 46.1, "Cordelius": 46, "Lou": 45.4, "Nori": 45.4, "Larry & Lawrie": 45.3, "Alli": 45, "Buzz": 45, "Colt": 44.9, "Crow": 44.8, "Hank": 44.6, "Sandy": 44.5, "Shade": 44.4, "Sirius": 44.4, "Clancy": 44.2, "Tara": 44.1, "Bull": 43.8, "Dynamike": 43.8, "Frank": 43.2, "Kenji": 43.2, "Willow": 43.1, "Ziggy": 42.6, "Lumi": 42.5, "Colette": 42, "Nita": 42, "Shelly": 42, "Trunk": 42, "El Primo": 41.9, "Barley": 41.8, "Draco": 41.2, "Kaze": 40.8, "Melodie": 40.7, "Chuck": 39.8, "Berry": 37.4 },
    pickRates: { "Wendy": 0.5, "Pearl": 9.1, "Bolt": 3.7, "Mr. P": 2, "Eve": 4.5, "Brock": 40.9, "Buster": 1, "Grom": 4.5, "Carl": 5.5, "Angelo": 13.1, "Bonnie": 1.5, "Tick": 10.8, "Rosa": 0.3, "Ash": 0.2, "Doug": 1, "8-Bit": 9.6, "Darryl": 2.1, "Ollie": 0.2, "R-T": 1.1, "Mico": 2, "Piper": 32, "Sprout": 1.3, "Edgar": 17.6, "Otis": 6.3, "Poco": 1.6, "Meeple": 8, "Squeak": 11.8, "Bo": 9.2, "Najia": 9.2, "Meg": 11, "Lily": 7, "Gigi": 1.3, "Gus": 11.4, "Gene": 10.4, "Gray": 6.8, "Janet": 0.9, "Mina": 6, "Leon": 19.3, "Maisie": 1.8, "Starr Nova": 6.7, "Spike": 14.1, "Belle": 9.2, "Mandy": 21.4, "Damian": 1.5, "Penny": 2, "Ruffs": 2.4, "Nani": 10.6, "Charlie": 1.6, "Glowy": 0.9, "Jae-Yong": 0.8, "Sam": 0.2, "Griff": 13.5, "Emz": 8.5, "Fang": 7.4, "Jacky": 0.1, "Gale": 1.4, "Max": 9.8, "Byron": 26.4, "Rico": 14.7, "Juju": 0.5, "Pam": 0.2, "Bea": 9.9, "Stu": 5.2, "Mortis": 8.7, "Finx": 0.9, "Surge": 7.7, "Chester": 4.1, "Lola": 0.7, "Kit": 7.5, "Pierce": 18.4, "Amber": 1.7, "Jessie": 2.2, "Moe": 0.4, "Bibi": 1.7, "Cordelius": 1.4, "Lou": 1.2, "Nori": 9.8, "Larry & Lawrie": 0.4, "Alli": 0.7, "Buzz": 1.7, "Colt": 22.9, "Crow": 17.7, "Hank": 0.1, "Sandy": 0.4, "Shade": 1.1, "Sirius": 1.6, "Clancy": 0.2, "Tara": 5.2, "Bull": 1.2, "Dynamike": 3.6, "Frank": 1.3, "Kenji": 1.3, "Willow": 1.2, "Ziggy": 0.4, "Lumi": 1, "Colette": 6.3, "Nita": 0.7, "Shelly": 1.9, "Trunk": 0.4, "El Primo": 0.9, "Barley": 0.4, "Draco": 0.1, "Kaze": 2, "Melodie": 0.4, "Chuck": 0.3, "Berry": 3 },
    notes: "Linee di tiro lunghe: gioca paziente e commercia da lontano.",
  },
  {
    mode: "Knockout", name: "New Horizons", sample: 1980955, updated: "2026-09-10",
    winRates: { "Wendy": 67.1, "Bolt": 60.6, "Pearl": 60.5, "Mr. P": 57.6, "Brock": 56.7, "Grom": 56.7, "Mico": 56.6, "Sprout": 56.4, "Buster": 55.1, "Gray": 54.9, "Bonnie": 54.7, "Edgar": 54.6, "R-T": 54.4, "Carl": 54.3, "Tick": 53.9, "Darryl": 53.8, "Ollie": 53.7, "Ash": 53.3, "Eve": 53.2, "Doug": 52.7, "Gigi": 52.7, "Juju": 52, "Piper": 51.8, "Leon": 51.4, "Meeple": 51.4, "Najia": 51.3, "Mina": 51.1, "Starr Nova": 50.8, "Larry & Lawrie": 50.4, "Gus": 50.3, "8-Bit": 50.1, "Fang": 50.1, "Glowy": 50.1, "Surge": 50.1, "Gene": 50, "Otis": 50, "Stu": 50, "Spike": 49.8, "Angelo": 49.7, "Janet": 49.7, "Maisie": 49.6, "Charlie": 49.5, "Penny": 49.3, "Damian": 49.2, "Max": 49.2, "Alli": 49.1, "Lily": 49, "Rosa": 49, "Mandy": 48.9, "Nani": 48.6, "Squeak": 48.6, "Belle": 48.5, "Bo": 48.4, "Ruffs": 48.4, "Dynamike": 48.3, "Mortis": 48.3, "Ziggy": 48.1, "Jae-Yong": 48, "Kit": 48, "Byron": 47.9, "Meg": 47.9, "Gale": 47.8, "Griff": 47.7, "Jacky": 47.7, "Sirius": 47.6, "Rico": 47.5, "Colt": 47.4, "Moe": 47.4, "Poco": 47.4, "Willow": 47.3, "Bea": 47.2, "Bull": 47.2, "Cordelius": 47.2, "Nori": 47.1, "Pierce": 47.1, "Sam": 47, "Finx": 46.9, "Buzz": 46.6, "Amber": 46, "Chester": 46, "Lou": 46, "Shade": 45.9, "Hank": 45.8, "Emz": 45.7, "Bibi": 45.5, "Clancy": 45.5, "Pam": 45.1, "Lola": 45, "Barley": 44.9, "Crow": 44.4, "Jessie": 43.9, "Frank": 43.8, "Kenji": 43.7, "Trunk": 43, "Tara": 42.5, "Shelly": 42.3, "Colette": 41.6, "Melodie": 41.6, "Chuck": 41.4, "El Primo": 41.4, "Kaze": 41.2, "Lumi": 41.1, "Sandy": 41, "Nita": 40.4, "Draco": 39.3, "Berry": 39 },
    pickRates: { "Wendy": 0.5, "Bolt": 5.7, "Pearl": 4.8, "Mr. P": 2.6, "Brock": 40.8, "Grom": 6.7, "Mico": 6.6, "Sprout": 3.6, "Buster": 0.8, "Gray": 11.8, "Bonnie": 1.5, "Edgar": 19.4, "R-T": 1.2, "Carl": 5.1, "Tick": 11.9, "Darryl": 2.2, "Ollie": 0.3, "Ash": 0.2, "Eve": 0.8, "Doug": 1.1, "Gigi": 1.5, "Juju": 0.9, "Piper": 29.9, "Leon": 18.9, "Meeple": 10.6, "Najia": 10.2, "Mina": 6.5, "Starr Nova": 7.6, "Larry & Lawrie": 1.1, "Gus": 10, "8-Bit": 7.5, "Fang": 7.1, "Glowy": 0.8, "Surge": 11, "Gene": 8, "Otis": 5.2, "Stu": 7.6, "Spike": 12.5, "Angelo": 3.9, "Janet": 0.9, "Maisie": 1.6, "Charlie": 1.6, "Penny": 2.2, "Damian": 1.8, "Max": 10.3, "Alli": 1.4, "Lily": 5.1, "Rosa": 0.2, "Mandy": 17.6, "Nani": 8.6, "Squeak": 8.5, "Belle": 7.1, "Bo": 7.2, "Ruffs": 3.2, "Dynamike": 8.8, "Mortis": 10.9, "Ziggy": 1.2, "Jae-Yong": 0.7, "Kit": 9.2, "Byron": 23.4, "Meg": 9.6, "Gale": 1.2, "Griff": 13.4, "Jacky": 0.1, "Sirius": 2.7, "Rico": 18, "Colt": 24.9, "Moe": 0.4, "Poco": 1.2, "Willow": 2.9, "Bea": 8.9, "Bull": 1.4, "Cordelius": 2.1, "Nori": 11.4, "Pierce": 17.2, "Sam": 0.2, "Finx": 0.7, "Buzz": 2, "Amber": 1.5, "Chester": 3.6, "Lou": 1, "Shade": 2.1, "Hank": 0.3, "Emz": 7.7, "Bibi": 1.8, "Clancy": 0.2, "Pam": 0.2, "Lola": 0.5, "Barley": 0.9, "Crow": 14.2, "Jessie": 1.8, "Frank": 1.3, "Kenji": 1.4, "Trunk": 0.4, "Tara": 4.4, "Shelly": 2, "Colette": 5.5, "Melodie": 0.4, "Chuck": 0.3, "El Primo": 1, "Kaze": 2.3, "Lumi": 0.9, "Sandy": 0.3, "Nita": 0.7, "Draco": 0.1, "Berry": 4.9 },
    notes: "Niente respawn: la densità di cespugli conta più che altrove.",
  },
  {
    mode: "Knockout", name: "Flaring Phoenix", sample: 1980372, updated: "2026-09-10",
    winRates: { "Wendy": 62.2, "Pearl": 61.3, "Grom": 60.2, "Buster": 58.7, "Bolt": 58.1, "Doug": 57.9, "Mr. P": 57.3, "Darryl": 56.7, "Brock": 56.6, "Rosa": 56.4, "Tick": 56.4, "Sprout": 56.3, "Edgar": 55.5, "Carl": 54.8, "Ollie": 54.6, "Gray": 54, "R-T": 53.7, "Ash": 53.6, "Bonnie": 53.5, "Mico": 53.4, "Penny": 52.5, "Juju": 52.1, "Lily": 52.1, "Larry & Lawrie": 51.9, "8-Bit": 51.7, "Dynamike": 51.4, "Jacky": 50.9, "Gene": 50.8, "Maisie": 50.8, "Meeple": 50.8, "Eve": 50.7, "Mandy": 50.7, "Damian": 50.6, "Gigi": 50.6, "Janet": 50.4, "Surge": 50.2, "Otis": 50.1, "Sam": 50.1, "Squeak": 50.1, "Spike": 49.9, "Bo": 49.7, "Leon": 49.6, "Starr Nova": 49.5, "Bull": 49.2, "Emz": 49.1, "Fang": 49.1, "Najia": 49, "Willow": 49, "Gus": 48.9, "Cordelius": 48.8, "Poco": 48.8, "Mina": 48.7, "Griff": 48.6, "Piper": 48.6, "Gale": 48.4, "Barley": 48.3, "Kit": 48.1, "Bibi": 48, "Moe": 48, "Buzz": 47.9, "Meg": 47.9, "Mortis": 47.8, "Charlie": 47.7, "Chester": 47.6, "Ruffs": 47.6, "Sirius": 47.6, "Ziggy": 47.5, "Belle": 47.1, "Shade": 46.9, "Hank": 46.7, "Jessie": 46.5, "Finx": 46.4, "Stu": 46.4, "Nori": 46.3, "Lou": 46.1, "Frank": 46, "Byron": 45.9, "Clancy": 45.7, "Jae-Yong": 45.7, "Trunk": 45.7, "Glowy": 45.6, "Shelly": 45.5, "Amber": 45.4, "Max": 45.4, "Kenji": 45.3, "Angelo": 45.2, "El Primo": 45, "Pierce": 44.8, "Rico": 44.8, "Bea": 44.7, "Pam": 44.7, "Nani": 44.6, "Alli": 44.5, "Crow": 44.4, "Tara": 44.4, "Sandy": 43.9, "Chuck": 43.8, "Lola": 43.6, "Colt": 43.4, "Nita": 42.9, "Lumi": 42.6, "Berry": 42.4, "Draco": 42, "Colette": 41.8, "Kaze": 40, "Melodie": 39.2 },
    pickRates: { "Wendy": 0.5, "Pearl": 5.8, "Grom": 10.3, "Buster": 2.1, "Bolt": 3.7, "Doug": 2.4, "Mr. P": 2.9, "Darryl": 3.4, "Brock": 40.9, "Rosa": 0.7, "Tick": 17, "Sprout": 6.3, "Edgar": 20.8, "Carl": 4.9, "Ollie": 0.4, "Gray": 8.7, "R-T": 1.3, "Ash": 0.3, "Bonnie": 0.9, "Mico": 4.9, "Penny": 3.4, "Juju": 1.8, "Lily": 13.3, "Larry & Lawrie": 1.6, "8-Bit": 8.3, "Dynamike": 10.4, "Jacky": 0.2, "Gene": 10.5, "Maisie": 1.4, "Meeple": 10.7, "Eve": 0.6, "Mandy": 21.4, "Damian": 2.7, "Gigi": 1.6, "Janet": 0.9, "Surge": 13.5, "Otis": 6.3, "Sam": 0.2, "Squeak": 12, "Spike": 14.4, "Bo": 9, "Leon": 19.2, "Starr Nova": 8.1, "Bull": 2.8, "Emz": 9.6, "Fang": 5.9, "Najia": 8.6, "Willow": 4.3, "Gus": 6.4, "Cordelius": 3.7, "Poco": 1.3, "Mina": 4.2, "Griff": 16.6, "Piper": 20.7, "Gale": 1.3, "Barley": 1.7, "Kit": 10.8, "Bibi": 2.9, "Moe": 0.5, "Buzz": 2.7, "Meg": 10.9, "Mortis": 10.3, "Charlie": 1.3, "Chester": 5.2, "Ruffs": 2.5, "Sirius": 3.2, "Ziggy": 1.4, "Belle": 5, "Shade": 2.5, "Hank": 0.3, "Jessie": 2.2, "Finx": 0.7, "Stu": 3.6, "Nori": 10.7, "Lou": 1, "Frank": 1.6, "Byron": 15.4, "Clancy": 0.2, "Jae-Yong": 0.3, "Trunk": 0.7, "Glowy": 0.5, "Shelly": 3, "Amber": 1.7, "Max": 5.6, "Kenji": 2, "Angelo": 1.7, "El Primo": 1.3, "Pierce": 11.6, "Rico": 13.2, "Bea": 4.8, "Pam": 0.2, "Nani": 4.5, "Alli": 2, "Crow": 14.1, "Tara": 7.3, "Sandy": 0.5, "Chuck": 0.5, "Lola": 0.5, "Colt": 16, "Nita": 0.9, "Lumi": 1.1, "Berry": 6.4, "Draco": 0.2, "Colette": 4.9, "Kaze": 2.3, "Melodie": 0.3 },
    notes: "Acqua a scacchiera, cespugli e muri a strati.",
  },
  {
    mode: "Knockout", name: "Belle's Rock", sample: 1980209, updated: "2026-09-10",
    winRates: { "Wendy": 63.1, "Bolt": 59.9, "Grom": 59.6, "Mr. P": 57.6, "Pearl": 57.6, "Sprout": 56.9, "Brock": 56.4, "Tick": 56.4, "Gray": 55.5, "Mico": 55.2, "Carl": 55, "Edgar": 55, "Bonnie": 54.5, "R-T": 54.5, "Ollie": 54.4, "Darryl": 53.7, "Larry & Lawrie": 53.7, "Doug": 53.5, "Buster": 53.4, "Najia": 53.4, "Gigi": 53.3, "Penny": 52.3, "Rico": 51.7, "Ash": 51.3, "Leon": 50.8, "Hank": 50.7, "Barley": 50.6, "Juju": 50.5, "Meeple": 50.5, "Rosa": 50.5, "Eve": 50.1, "Janet": 49.8, "Ziggy": 49.8, "Maisie": 49.7, "Otis": 49.6, "Starr Nova": 49.6, "Gus": 49.5, "Dynamike": 49.4, "Mortis": 49.4, "Gene": 49.3, "Willow": 49.3, "8-Bit": 49.1, "Damian": 49, "Fang": 49, "Lily": 49, "Kit": 48.9, "Squeak": 48.9, "Stu": 48.7, "Mina": 48.6, "Nori": 48.5, "Spike": 48.5, "Mandy": 48.3, "Sam": 48.3, "Belle": 48.2, "Moe": 48.2, "Piper": 48.2, "Buzz": 48.1, "Cordelius": 48.1, "Sirius": 48.1, "Surge": 48, "Jacky": 47.8, "Byron": 47.5, "Ruffs": 47.5, "Shade": 47.5, "Charlie": 47.4, "Angelo": 47.3, "Bibi": 47.2, "Pierce": 47.1, "Bo": 46.8, "Jae-Yong": 46.3, "Gale": 46.2, "Lou": 46.2, "Max": 46.2, "Bull": 46, "Emz": 45.6, "Kenji": 45.6, "Meg": 45.3, "Jessie": 45.2, "Poco": 45.2, "Chester": 45, "Griff": 45, "Bea": 44.8, "Finx": 44.4, "Chuck": 44.3, "Amber": 44.2, "Berry": 43.8, "Trunk": 43.5, "Clancy": 43.3, "Lola": 43.3, "Lumi": 43.1, "Nani": 43.1, "Frank": 42.8, "Colt": 42.5, "El Primo": 42.5, "Pam": 42.4, "Sandy": 42.2, "Glowy": 42.1, "Shelly": 42, "Crow": 41.9, "Melodie": 41.9, "Colette": 41.3, "Nita": 40.9, "Tara": 40.9, "Kaze": 40.4, "Draco": 38.9, "Alli": 38.6 },
    pickRates: { "Wendy": 0.5, "Bolt": 4.4, "Grom": 12.9, "Mr. P": 3.3, "Pearl": 3.1, "Sprout": 10.5, "Brock": 40, "Tick": 16.3, "Gray": 12.5, "Mico": 10.9, "Carl": 5.5, "Edgar": 22.5, "Bonnie": 1, "R-T": 1.2, "Ollie": 0.5, "Darryl": 2.7, "Larry & Lawrie": 3.5, "Doug": 1.5, "Buster": 0.4, "Najia": 11.3, "Gigi": 1.6, "Penny": 2.8, "Rico": 32.6, "Ash": 0.2, "Leon": 15.3, "Hank": 0.8, "Barley": 3.8, "Juju": 0.9, "Meeple": 13.6, "Rosa": 0.2, "Eve": 0.4, "Janet": 0.8, "Ziggy": 2.7, "Maisie": 1.2, "Otis": 4.6, "Starr Nova": 8, "Gus": 7.2, "Dynamike": 17.3, "Mortis": 11.9, "Gene": 5.3, "Willow": 6.5, "8-Bit": 5.6, "Damian": 2.1, "Fang": 4.8, "Lily": 4.2, "Kit": 8.7, "Squeak": 9.5, "Stu": 5, "Mina": 5.6, "Nori": 12.5, "Spike": 13, "Mandy": 16.1, "Sam": 0.2, "Belle": 5.7, "Moe": 0.5, "Piper": 18.4, "Buzz": 2.3, "Cordelius": 2.6, "Sirius": 4.9, "Surge": 13.3, "Jacky": 0.2, "Byron": 15, "Ruffs": 3.5, "Shade": 4, "Charlie": 1.3, "Angelo": 1.8, "Bibi": 2.4, "Pierce": 12.2, "Bo": 6.1, "Jae-Yong": 0.4, "Gale": 1.1, "Lou": 0.8, "Max": 6.2, "Bull": 1.8, "Emz": 8.2, "Kenji": 1.9, "Meg": 9.1, "Jessie": 1.7, "Poco": 1, "Chester": 3.5, "Griff": 13.4, "Bea": 4.7, "Finx": 0.5, "Chuck": 0.5, "Amber": 1.5, "Berry": 11.6, "Trunk": 0.5, "Clancy": 0.1, "Lola": 0.4, "Lumi": 1, "Nani": 3.5, "Frank": 1.4, "Colt": 15.2, "El Primo": 1.1, "Pam": 0.1, "Sandy": 0.3, "Glowy": 0.4, "Shelly": 2.2, "Crow": 10.2, "Melodie": 0.3, "Colette": 4.2, "Nita": 0.8, "Tara": 4.1, "Kaze": 2, "Draco": 0.1, "Alli": 0.3 },
    notes: "Corsie laterali speculari con muri a L.",
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

// ============================================================
// MATCHUP — misurati brawler per brawler, e modellati dove non
// è possibile misurarli.
// ============================================================
//
// COS'È STATO RACCOLTO. Le pagine per brawler di BrawlMetrics sono state
// lette UNA PER UNA per 104 dei 108 brawler (mancano Bonnie e i due appena
// usciti, Vince e Cosmo, che non hanno ancora statistiche). Ogni pagina
// pubblica la win rate generale del brawler più i suoi 3 matchup migliori e
// 3 peggiori: in totale 623 coppie misurate, leggibili nei due versi.
//
// PERCHÉ I NUMERI GREZZI INGANNANO. Preso così com'è, quasi ogni brawler
// risulta "debole contro Wendy" e "forte contro Shelly": non è un matchup,
// è la classifica generale riscritta, perché Wendy è la più forte e Shelly
// la più debole. Si toglie quindi la parte spiegata dalla sola differenza
// di forza:
//     atteso(A,B) = 50 + (forzaGenerale(A) − forzaGenerale(B))
// e quel che resta, actual − atteso, è il matchup vero.
//
// IL MODELLO È STATO VERIFICATO, NON DATO PER BUONO. Sulle 623 coppie il
// residuo medio è −0,01 con deviazione standard 5,57: la formula non ha
// distorsione sistematica (se fosse sbagliata, la media non cadrebbe sullo
// zero), e la dispersione dice che i matchup veri valgono tipicamente ±5-6
// punti percentuali. Esempi: Edgar contro Wendy fa 22,6% con atteso 23,0
// (residuo −0,4: NON è un counter, è solo Wendy forte), mentre Jae-Yong
// contro Wendy fa 29,5% con atteso 43,0 (residuo −13,5: counter vero).
const BRAWLER_OVERALL = {
  "Wendy": 67.6, "Amber": 64.9, "Bolt": 64.5, "Shade": 64.4, "Gus": 63.9,
  "Trunk": 63.8, "Starr Nova": 63.0, "Damian": 62.5, "Nori": 61.5, "Gigi": 61.3,
  "Doug": 61.1, "Lumi": 61.0, "Jae-Yong": 60.6, "Meeple": 60.2, "Draco": 60.0,
  "Pierce": 59.8, "Finx": 59.4, "Glowy": 59.2, "Sprout": 59.1, "Rosa": 59.0,
  "R-T": 59.0, "Sam": 58.8, "Chester": 58.7, "Bo": 58.6, "Hank": 58.2,
  "Stu": 58.2, "Alli": 58.2, "Mina": 57.8, "Gray": 57.7, "Janet": 57.7,
  "Sirius": 57.6, "Moe": 57.6, "Najia": 57.4, "Ruffs": 57.2, "Mico": 57.1,
  "Kit": 56.9, "Mandy": 56.9, "Nani": 56.8, "Kaze": 56.3, "Willow": 56.1,
  "Chuck": 55.9, "Ziggy": 55.7, "Bull": 55.4, "Mortis": 54.4, "Ash": 54.3,
  "Juju": 54.3, "Angelo": 54.2, "Tara": 54.0, "Pearl": 52.8, "Maisie": 52.7,
  "Squeak": 52.0, "Larry & Lawrie": 51.8, "Griff": 51.7, "Gale": 51.3, "Buzz": 51.0,
  "Poco": 50.8, "Colette": 50.7, "Max": 50.5, "Melodie": 50.4, "Frank": 50.0,
  "Fang": 50.0, "El Primo": 49.7, "Lou": 49.7, "Carl": 49.6, "Pam": 49.5,
  "Otis": 49.4, "Sandy": 49.2, "Spike": 48.9, "Bea": 48.6, "Cordelius": 48.5,
  "Clancy": 48.4, "Bibi": 48.2, "Kenji": 48.2, "Belle": 48.2, "Berry": 48.0,
  "Leon": 47.9, "Penny": 47.9, "Meg": 47.7, "Gene": 47.7, "Charlie": 47.3,
  "Lily": 47.2, "Tick": 46.6, "Buster": 46.4, "Barley": 46.4, "Darryl": 46.2,
  "Surge": 45.7, "Byron": 45.7, "Jessie": 45.2, "Ollie": 44.8, "Emz": 44.7,
  "Piper": 44.7, "8-Bit": 44.4, "Colt": 44.2, "Grom": 44.0, "Dynamike": 43.8,
  "Crow": 43.5, "Jacky": 43.2, "Mr. P": 43.0, "Brock": 41.9, "Eve": 41.1,
  "Edgar": 40.6, "Nita": 40.5, "Shelly": 40.5, "Rico": 40.1,
};

// MATCHUPS[A][B] = percentuale di vittorie di A contro B (dato misurato).
const MATCHUPS = {
  "8-Bit": { "Eve": 59.5, "Clancy": 57.5, "Mr. P": 57.4, "Wendy": 27.5, "Gus": 27.8, "Jae-Yong": 28.9 },
  "Alli": { "Nita": 75.1, "Shelly": 74.6, "Rico": 69.2, "Wendy": 28.3, "Doug": 38.8, "Bolt": 38.9 },
  "Amber": { "Shelly": 76.1, "Nita": 72.5, "Colt": 71.8, "Wendy": 45.6, "Nori": 46.2, "Starr Nova": 49.3 },
  "Angelo": { "Shelly": 71.8, "Nita": 71.0, "Rico": 66.4, "Wendy": 27.2, "Nori": 33.3, "Shade": 34.8 },
  "Ash": { "Shelly": 67.9, "Mr. P": 64.9, "Nita": 64.0, "Jae-Yong": 38.0, "Nori": 38.6, "Amber": 40.4 },
  "Barley": { "Eve": 56.7, "Gene": 56.7, "Mr. P": 55.9, "Wendy": 19.6, "Nori": 23.6, "Bolt": 24.8 },
  "Bea": { "Shelly": 62.4, "Nita": 58.3, "Edgar": 54.5, "Wendy": 26.9, "Bo": 30.4, "Jae-Yong": 32.1 },
  "Belle": { "Shelly": 61.8, "Nita": 58.6, "Colt": 56.9, "Wendy": 29.4, "Nori": 31.4, "Trunk": 32.5 },
  "Berry": { "Shelly": 63.9, "Ollie": 61.1, "Eve": 60.5, "Wendy": 28.5, "Nori": 31.2, "Starr Nova": 34.3 },
  "Bibi": { "Eve": 61.6, "Mr. P": 61.4, "Grom": 59.7, "Wendy": 33.4, "Amber": 34.0, "Shade": 34.9 },
  "Bo": { "Gene": 73.2, "Ollie": 72.2, "Pam": 72.1, "Wendy": 31.5, "Bolt": 39.7, "Nori": 40.5 },
  "Bolt": { "Nita": 82.1, "Shelly": 80.3, "Eve": 75.2, "Wendy": 43.2, "Shade": 46.8, "Damian": 46.9 },
  "Brock": { "Piper": 49.1, "Eve": 49.0, "Grom": 48.9, "Wendy": 27.0, "Bolt": 28.0, "Nori": 28.2 },
  "Bull": { "Shelly": 68.8, "Nita": 68.3, "Rico": 61.7, "Wendy": 29.4, "Amber": 31.0, "Shade": 32.9 },
  "Buster": { "Shelly": 60.9, "Piper": 55.6, "Nita": 55.6, "Trunk": 31.1, "Nori": 31.4, "Wendy": 31.8 },
  "Buzz": { "Shelly": 66.1, "Nita": 61.4, "Bonnie": 59.8, "Wendy": 30.4, "Amber": 35.5, "Gus": 37.5 },
  "Byron": { "Shelly": 58.3, "Nita": 55.1, "Colt": 54.5, "Wendy": 26.4, "Trunk": 31.5, "Nori": 32.5 },
  "Carl": { "Shelly": 62.5, "Edgar": 61.3, "Eve": 61.3, "Wendy": 29.1, "Gus": 32.1, "Bolt": 32.3 },
  "Charlie": { "Shelly": 61.4, "Brock": 55.9, "Nita": 55.8, "Bo": 30.0, "Trunk": 31.4, "Wendy": 31.8 },
  "Chester": { "Shelly": 74.7, "Nita": 71.3, "Barley": 68.2, "Wendy": 31.6, "Shade": 44.5, "Lumi": 44.6 },
  "Chuck": { "Shelly": 73.2, "Gene": 66.3, "Ollie": 65.9, "Nori": 34.1, "Wendy": 34.3, "Amber": 38.9 },
  "Clancy": { "Shelly": 60.1, "Eve": 55.5, "Surge": 55.2, "Wendy": 30.7, "Gus": 34.2, "Amber": 36.1 },
  "Colette": { "Shelly": 62.9, "Mr. P": 58.9, "Nita": 58.9, "Wendy": 27.0, "Shade": 36.3, "Nori": 36.5 },
  "Colt": { "Shelly": 52.1, "Eve": 52.0, "Brock": 51.7, "Wendy": 20.6, "Gus": 24.7, "Bolt": 26.2 },
  "Cordelius": { "Shelly": 63.7, "Eve": 58.6, "Brock": 57.5, "Wendy": 28.9, "Gus": 34.9, "Amber": 35.8 },
  "Crow": { "Shelly": 56.0, "Nita": 54.8, "Mr. P": 54.7, "Wendy": 21.5, "Shade": 30.6, "Gus": 31.3 },
  "Damian": { "Shelly": 78.5, "Nita": 78.0, "Eve": 72.0, "Wendy": 39.3, "Amber": 45.2, "Shade": 46.0 },
  "Darryl": { "Eve": 60.2, "Edgar": 60.0, "Shelly": 59.8, "Wendy": 22.4, "Gus": 27.8, "Jae-Yong": 29.4 },
  "Doug": { "Shelly": 77.0, "Nita": 74.8, "Jacky": 70.9, "Wendy": 39.4, "Sirius": 46.2, "Amber": 46.3 },
  "Draco": { "Shelly": 77.4, "Nita": 75.7, "Eve": 72.5, "Wendy": 35.7, "Nori": 41.3, "Starr Nova": 41.4 },
  "Dynamike": { "Pam": 57.7, "Gene": 57.5, "Mr. P": 57.4, "Wendy": 23.4, "Bolt": 28.7, "Shade": 29.8 },
  "Edgar": { "Eve": 54.0, "Mr. P": 53.7, "Brock": 53.3, "Wendy": 22.6, "Gus": 24.5, "Bolt": 26.5 },
  "El Primo": { "Eve": 56.7, "Brock": 56.2, "Edgar": 54.9, "Bolt": 25.6, "Jae-Yong": 26.3, "Wendy": 29.0 },
  "Emz": { "Eve": 59.8, "Mr. P": 58.7, "Pam": 57.8, "Wendy": 29.8, "Bolt": 31.7, "Gus": 31.8 },
  "Eve": { "Piper": 53.2, "Shelly": 51.9, "Brock": 50.9, "Nori": 24.6, "Bolt": 24.9, "Wendy": 25.6 },
  "Fang": { "Shelly": 61.6, "Nita": 57.4, "Edgar": 57.0, "Wendy": 30.3, "Shade": 37.2, "Amber": 38.3 },
  "Finx": { "Shelly": 77.4, "Nita": 75.7, "Rico": 70.0, "Wendy": 32.8, "Bolt": 41.8, "Nori": 42.5 },
  "Frank": { "Eve": 64.8, "Mr. P": 63.1, "Pam": 62.4, "Wendy": 29.2, "Bolt": 32.7, "Gus": 34.4 },
  "Gale": { "Shelly": 67.2, "Nita": 63.3, "Eve": 59.9, "Wendy": 28.1, "Amber": 35.7, "Gus": 35.8 },
  "Gene": { "Shelly": 61.0, "Nita": 58.0, "Piper": 55.0, "Wendy": 24.5, "Nori": 26.9, "Bo": 26.9 },
  "Gigi": { "Shelly": 77.2, "Nita": 75.6, "Rico": 71.5, "Wendy": 38.2, "Damian": 43.0, "Nori": 43.6 },
  "Glowy": { "Shelly": 76.7, "Nita": 74.0, "Colt": 69.8, "Wendy": 35.3, "Nori": 38.2, "Sirius": 39.5 },
  "Gray": { "Shelly": 74.1, "Nita": 72.1, "Edgar": 67.0, "Wendy": 31.2, "Nori": 43.1, "Bolt": 43.2 },
  "Griff": { "Shelly": 62.0, "Eve": 59.9, "Nita": 59.9, "Wendy": 35.4, "Gus": 38.4, "Amber": 38.6 },
  "Grom": { "Shelly": 57.1, "Nita": 55.5, "Eve": 52.8, "Wendy": 23.7, "Nori": 25.7, "Bolt": 27.6 },
  "Gus": { "Shelly": 82.8, "Nita": 82.8, "Rico": 75.9, "Wendy": 40.6, "Nori": 46.1, "Amber": 46.7 },
  "Hank": { "Nita": 74.3, "Shelly": 74.1, "Rico": 67.2, "Wendy": 32.1, "Nori": 34.4, "Jae-Yong": 37.8 },
  "Jacky": { "Eve": 58.9, "Mr. P": 55.0, "Gene": 54.7, "Wendy": 23.3, "Bolt": 25.4, "Jae-Yong": 26.2 },
  "Jae-Yong": { "Nita": 80.5, "Shelly": 79.7, "Pam": 74.3, "Wendy": 29.5, "Nori": 37.3, "Starr Nova": 38.3 },
  "Janet": { "Shelly": 74.4, "Nita": 72.0, "Rico": 67.3, "Wendy": 31.4, "Bolt": 38.2, "Starr Nova": 39.6 },
  "Jessie": { "Eve": 62.0, "Ollie": 59.2, "Mr. P": 58.2, "Wendy": 25.6, "Bolt": 27.5, "Gus": 29.3 },
  "Juju": { "Shelly": 73.3, "Nita": 70.3, "Jacky": 65.0, "Wendy": 29.9, "Nori": 35.4, "Bolt": 37.5 },
  "Kaze": { "Shelly": 72.3, "Barley": 67.4, "Nita": 66.5, "Wendy": 33.6, "Nori": 43.3, "Starr Nova": 43.4 },
  "Kenji": { "Brock": 59.8, "Mr. P": 59.6, "Grom": 58.6, "Wendy": 32.5, "Bolt": 35.0, "Shade": 36.4 },
  "Kit": { "Shelly": 72.6, "Nita": 70.8, "Barley": 68.9, "Wendy": 35.2, "Damian": 43.7, "Shade": 44.0 },
  "Larry & Lawrie": { "Shelly": 66.9, "Nita": 64.0, "Eve": 62.8, "Wendy": 28.9, "Nori": 31.4, "Bolt": 32.2 },
  "Leon": { "Shelly": 60.6, "Nita": 59.8, "Brock": 57.5, "Wendy": 23.9, "Nori": 33.4, "Bolt": 33.5 },
  "Lily": { "Shelly": 60.9, "Grom": 56.1, "Nita": 56.1, "Wendy": 26.2, "Bolt": 33.1, "Shade": 33.1 },
  "Lou": { "Shelly": 60.8, "Surge": 57.7, "Colt": 56.4, "Wendy": 32.9, "Nori": 35.5, "Gus": 36.1 },
  "Lumi": { "Shelly": 77.4, "Nita": 74.4, "Colt": 70.7, "Wendy": 40.3, "Nori": 45.4, "Amber": 45.7 },
  "Maisie": { "Shelly": 65.8, "Nita": 60.5, "Mr. P": 59.9, "Wendy": 29.6, "Gus": 37.5, "Bolt": 37.7 },
  "Mandy": { "Shelly": 72.5, "Nita": 71.2, "Jacky": 69.8, "Wendy": 32.3, "Bolt": 42.9, "Starr Nova": 44.6 },
  "Max": { "Shelly": 63.7, "Nita": 62.3, "Eve": 60.3, "Wendy": 31.3, "Nori": 33.7, "Shade": 35.4 },
  "Meeple": { "Shelly": 76.9, "Nita": 76.4, "Rico": 70.1, "Wendy": 29.1, "Bolt": 40.8, "Damian": 41.1 },
  "Meg": { "Piper": 55.7, "Brock": 55.7, "Mr. P": 55.6, "Wendy": 29.4, "Bolt": 32.3, "Gus": 32.9 },
  "Melodie": { "Shelly": 63.9, "Eve": 58.7, "Brock": 58.0, "Wendy": 32.0, "Gus": 34.5, "Amber": 35.5 },
  "Mico": { "Shelly": 75.3, "Nita": 70.2, "Rico": 67.7, "Wendy": 28.3, "Nori": 36.6, "Bolt": 37.0 },
  "Mina": { "Shelly": 75.5, "Nita": 72.4, "Edgar": 68.9, "Wendy": 33.6, "Shade": 41.2, "Amber": 41.7 },
  "Moe": { "Shelly": 75.9, "Nita": 73.6, "Colt": 68.0, "Wendy": 30.3, "Nori": 39.1, "Shade": 40.0 },
  "Mortis": { "Nita": 75.5, "Shelly": 74.8, "Barley": 69.8, "Wendy": 26.2, "Shade": 33.3, "Amber": 34.0 },
  "Mr. P": { "Shelly": 56.6, "Piper": 53.2, "Nita": 53.2, "Wendy": 25.3, "Nori": 25.5, "Bolt": 25.6 },
  "Najia": { "Shelly": 74.8, "Nita": 72.5, "Colt": 68.3, "Wendy": 32.4, "Bolt": 36.4, "Starr Nova": 39.9 },
  "Nani": { "Shelly": 72.1, "Nita": 70.0, "Rico": 64.7, "Wendy": 27.9, "Nori": 37.9, "Starr Nova": 38.2 },
  "Nita": { "Edgar": 55.4, "Meg": 54.9, "Rico": 54.7, "Gus": 17.2, "Bolt": 17.9, "Wendy": 18.7 },
  "Nori": { "Barley": 76.4, "Shelly": 75.2, "Eve": 75.1, "Wendy": 40.8, "Bolt": 50.2, "Starr Nova": 50.2 },
  "Ollie": { "Shelly": 60.6, "Nita": 56.1, "Eve": 55.5, "Wendy": 27.0, "Bolt": 27.4, "Trunk": 27.4 },
  "Otis": { "Shelly": 61.5, "Colt": 57.1, "Surge": 57.0, "Wendy": 30.0, "Trunk": 35.7, "Bo": 36.1 },
  "Pam": { "Shelly": 60.7, "Eve": 59.2, "Nita": 57.7, "Wendy": 25.1, "Jae-Yong": 25.6, "Nori": 25.7 },
  "Pearl": { "Shelly": 66.3, "Nita": 61.4, "Brock": 61.3, "Wendy": 33.8, "Jae-Yong": 38.1, "Nori": 38.3 },
  "Penny": { "Eve": 62.5, "Shelly": 62.2, "Mr. P": 60.9, "Wendy": 24.5, "Bolt": 29.9, "Nori": 30.5 },
  "Pierce": { "Shelly": 76.1, "Nita": 72.7, "Jacky": 70.8, "Wendy": 36.4, "Starr Nova": 46.5, "Bolt": 47.7 },
  "Piper": { "Shelly": 52.7, "Colt": 52.6, "Nita": 51.8, "Wendy": 26.4, "Nori": 32.0, "Bolt": 32.6 },
  "Poco": { "Eve": 57.7, "Rico": 56.3, "Gene": 56.1, "Wendy": 27.8, "Bolt": 31.5, "Nori": 32.8 },
  "R-T": { "Shelly": 76.8, "Nita": 74.0, "Edgar": 69.0, "Wendy": 33.1, "Jae-Yong": 40.9, "Finx": 42.1 },
  "Rico": { "Eve": 52.9, "Brock": 51.3, "Mr. P": 51.0, "Gus": 24.1, "Wendy": 24.2, "Bolt": 25.9 },
  "Rosa": { "Shelly": 71.5, "Nita": 70.2, "Rico": 66.4, "Nori": 27.3, "Wendy": 27.9, "Bolt": 30.6 },
  "Ruffs": { "Shelly": 75.7, "Nita": 72.7, "Edgar": 68.0, "Wendy": 31.8, "Bolt": 38.8, "Damian": 40.9 },
  "Sam": { "Nita": 76.7, "Shelly": 76.6, "Rico": 68.7, "Wendy": 32.2, "Nori": 35.4, "Pierce": 37.3 },
  "Sandy": { "Eve": 62.8, "Shelly": 61.8, "Brock": 58.5, "Wendy": 30.2, "Gus": 34.6, "Bolt": 35.9 },
  "Shade": { "Shelly": 77.7, "Nita": 75.7, "Colt": 72.5, "Amber": 45.8, "Nori": 45.8, "Wendy": 47.7 },
  "Shelly": { "Rico": 52.3, "Brock": 52.3, "Edgar": 52.1, "Wendy": 16.4, "Gus": 17.3, "Bolt": 19.6 },
  "Sirius": { "Shelly": 74.9, "Nita": 70.2, "Pam": 68.1, "Wendy": 36.6, "Bolt": 43.6, "Shade": 44.3 },
  "Spike": { "Shelly": 61.9, "Nita": 60.7, "Ollie": 58.7, "Wendy": 27.0, "Shade": 35.6, "Bolt": 36.3 },
  "Sprout": { "Nita": 76.7, "Shelly": 76.2, "Gene": 71.0, "Wendy": 30.4, "Nori": 37.9, "Starr Nova": 39.3 },
  "Squeak": { "Shelly": 65.2, "Nita": 62.0, "Ollie": 61.6, "Wendy": 30.6, "Bolt": 36.4, "Starr Nova": 38.7 },
  "Starr Nova": { "Shelly": 77.3, "Nita": 75.1, "Barley": 72.5, "Wendy": 40.5, "Nori": 49.8, "Amber": 50.7 },
  "Stu": { "Shelly": 74.0, "Nita": 72.2, "Edgar": 65.6, "Wendy": 29.6, "Gus": 36.6, "Amber": 37.8 },
  "Surge": { "Brock": 54.2, "Colt": 53.6, "Barley": 53.3, "Wendy": 26.4, "Shade": 31.9, "Amber": 32.2 },
  "Tara": { "Shelly": 67.0, "Nita": 65.0, "Mr. P": 62.6, "Wendy": 29.6, "Nori": 35.9, "Bolt": 37.3 },
  "Tick": { "Gene": 60.1, "Pam": 59.5, "Shelly": 58.6, "Wendy": 28.5, "Bolt": 32.0, "Shade": 33.2 },
  "Trunk": { "Nita": 78.2, "Shelly": 77.9, "Mr. P": 74.1, "Wendy": 38.1, "Starr Nova": 42.0, "Nori": 42.8 },
  "Wendy": { "Shelly": 83.6, "Nita": 81.4, "Barley": 80.3, "Shade": 52.3, "Amber": 54.4, "Ash": 56.3 },
  "Willow": { "Shelly": 73.3, "Nita": 71.1, "Rico": 65.4, "Wendy": 28.8, "Nori": 36.2, "Bolt": 37.6 },
  "Ziggy": { "Shelly": 74.5, "Nita": 73.5, "Rico": 67.6, "Wendy": 29.1, "Bolt": 33.1, "Nori": 35.4 },
};

// MATRICE PER CLASSE, CALIBRATA SUI DATI. Le 623 coppie misurate coprono
// circa il 5% delle 11.556 combinazioni possibili: nessuna fonte pubblica
// la matrice completa, quindi il resto va stimato, non inventato. Qui i
// residui misurati sono stati raggruppati per coppia di classi e mediati:
// il risultato è una stima fondata su misure vere per OGNI combinazione.
//
// Questa matrice ha SOSTITUITO l'euristica scritta a mano che c'era prima,
// e in più punti la smentisce: la vecchia dava il Tank favorito contro
// l'Assassin (+1), i dati dicono −5,96. Confermano invece Assassin forte
// contro Artillery (+7,30) e Artillery contro Controller (+7,90).
//
// DUE CAUTELE, applicate nel codice (vedi classEdge in app.js):
//  1. Le coppie misurate sono gli ESTREMI di ogni brawler (3 migliori e 3
//     peggiori), non un campione casuale: le medie per classe sono quindi
//     più marcate del vero. Per questo l'app le dimezza (fattore 0,5)
//     invece di usarle tali e quali.
//  2. Le celle con meno di 5 osservazioni sono `null`, non un numero
//     traballante spacciato per stima: lì il contributo è zero.
// Il numero fra parentesi è il campione su cui la cella è calcolata.
const CLASS_EDGE = {
  "Artillery": { "Artillery": null, "Assassin": -6.16, "Controller": 7.9, "Damage Dealer": 4.43, "Marksman": null, "Support": -1.84, "Tank": -2.09 },
  "Assassin": { "Artillery": 7.3, "Assassin": -2.73, "Controller": 0.67, "Damage Dealer": 3.92, "Marksman": -0.28, "Support": -4.24, "Tank": -1.35 },
  "Controller": { "Artillery": null, "Assassin": -5.11, "Controller": 0.1, "Damage Dealer": 3.28, "Marksman": null, "Support": -1.33, "Tank": -0.91 },
  "Damage Dealer": { "Artillery": null, "Assassin": -1.81, "Controller": 1.24, "Damage Dealer": 3.78, "Marksman": 2.21, "Support": -4.45, "Tank": -0.63 },
  "Marksman": { "Artillery": null, "Assassin": -4.03, "Controller": null, "Damage Dealer": 2.86, "Marksman": null, "Support": -4.85, "Tank": 0.98 },
  "Support": { "Artillery": null, "Assassin": -4.41, "Controller": -2.82, "Damage Dealer": 4.37, "Marksman": null, "Support": -4.85, "Tank": -1.08 },
  "Tank": { "Artillery": null, "Assassin": -5.96, "Controller": 2.17, "Damage Dealer": 3.57, "Marksman": null, "Support": -4.19, "Tank": -4.84 },
};

// MARGINI PER CLASSE — la rete di sicurezza per le combinazioni che nemmeno
// la matrice per classe copre (celle con meno di 5 osservazioni). Sono i
// due effetti separati: quanto rende una classe COME ATTACCANTE, e quanto è
// facile batterla COME BERSAGLIO, entrambi al netto della differenza di
// forza. Per una coppia scoperta la stima è la somma dei due.
//
// Il dato più interessante che ne esce: conta molto più CHI AFFRONTI che
// chi sei. Da attaccante le classi si equivalgono (fra −0,78 e +0,56), da
// bersaglio no: l'artiglieria è preda facile (+6,48, cioè chi la affronta
// vince quasi 6,5 punti in più del previsto), mentre Assassin (−4,04) e
// Support (−3,66) sono i bersagli più duri. È il motivo per cui un
// artigliere lasciato scoperto perde la partita, anche se sulla carta è forte.
const CLASS_MARGIN_ATTACK = {"Artillery": 0.56, "Assassin": 0.37, "Controller": 0.34, "Damage Dealer": 0.1, "Marksman": -0.52, "Support": -0.15, "Tank": -0.78};
const CLASS_MARGIN_DEFEND = {"Artillery": 6.48, "Assassin": -4.04, "Controller": 1.34, "Damage Dealer": 3.71, "Marksman": 1.33, "Support": -3.66, "Tank": -1.31};

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
