---
name: draft-brawl-stars
description: Aggiorna o modifica l'app Assistente Draft Classificata (Brawl Stars) in brawl-draft/. Usala quando si tratta di aggiornare i dati (win rate, mappe, counter, roster), correggere la logica dei suggerimenti, o ripubblicare l'app. Contiene le fonti che funzionano, il metodo di normalizzazione dei counter e gli errori già trovati, così non vanno riscoperti.
---

# Lavorare sull'app draft Brawl Stars

**Leggi prima `memoria/wiki/app-draft-classificata.md`, `metodo-counter.md`, `fonti-brawl-stars.md` e `errori-trovati.md`.** Contengono il contesto che segue in forma estesa; qui c'è la procedura operativa.

## Regole non negoziabili

1. **Mai inventare un numero.** Fonte irraggiungibile → tieni il dato vecchio e annota nel commento la data del tentativo fallito. Meglio un dato dichiaratamente vecchio che uno inventato.
2. **Misurato e stimato restano distinguibili**, nel codice e a schermo.
3. **Specifico batte generico e non si somma**: mappa > modalità > meta.
4. **Il dato incerto si miscela** in proporzione all'affidabilità, non si scarta né si prende per buono.

## Fonti

**Mappe e modalità: `brawlplanet.com`.** `/maps/<nomesenzaspazi>_<modalitasenzaspazi>` (es. `kaboomcanyon_heist`), `/powerleague` per il pool ranked. Aggiornamento orario, 106 brawler per mappa, win rate **e** pick rate.

> **La pagina ha due schede e quella aperta di default è "Trophy ladder", non "Ranked".** Leggerla a occhio significa prendere i numeri della modalità sbagliata. È già successo, e ha prodotto una conclusione falsa che è finita nella wiki. **Non leggerla a mano: usa lo script.**

**Meta generale e counter: `brawlmetrics.gg`** — `/tier-list/ranked`, `/tier-list/ranked/masters`, `/brawlers/<slug>`. Non usarlo per le mappe: segue la rotazione trofei, quindi le mappe solo-ranked non si aggiornano mai e alcune non hanno pagina.

**Roster e mappe attive:** `api.brawlapi.com/v1/brawlers` (campo `released`) e `/v1/maps` (campo `disabled`) — API pubblica, niente chiave. Le letture arrivano troncate: fidati dei singoli campi, non dei conteggi.

Riscontro incrociato: Dexerto, Pocket Tactics, Brawlvision.
Bloccati (non aggirare): brawlify.com come sito, noff.gg, brawltime.ninja, topbrawl, brawlytix, brawlhq, Fandom.
Da scartare: brawl.tube (dati fasulli), brawlio counters e brawlcalculator (senza numeri), brawltime.com (22-411 partite per brawler: rumore).

Quando chiedi una tabella, **pretendi che sia completa**: se la risposta sembra troncata, rifai la richiesta insistendo sull'esaustività.

## Aggiornare i dati delle mappe: due comandi

Il lavoro è meccanico, non rifarlo a mano:

```bash
node script/fetch-brawlplanet-ranked.js > /tmp/bp.json   # scarica pool + 33 mappe
node script/build-map-data.js /tmp/bp.json               # riscrive MAPS e MODE_WIN_RATES
```

Il secondo rigenera anche `MODE_WIN_RATES` come media delle mappe della modalità pesata sul campione. **Non prenderlo da un'altra fonte:** `app.js` *miscela* il dato mappa con quello di modalità, e miscelare due scale diverse dà un numero che non vuol dire niente.

## Regola aggiuntiva: mai mescolare due fonti nello stesso numero

Due fonti che misurano la stessa cosa contano popolazioni diverse. Si usa l'una **o** l'altra, o si confrontano; non si mediano, sommano o miscelano. Su mappa per mappa i top 10 di brawlmetrics e brawlplanet coincidono solo per 2-3 nomi su 10: non è una scala da riallineare, sono due misure diverse.

## Come si sceglie fra due fonti che si contraddicono

Non a intuito, e non "quella con più partite". Quattro controlli che hanno funzionato:

1. **Coerenza fisica** — le mappe Bounty devono premiare i tiratori lunghi, quelle Brawl Ball i tank. Se una fonte dà gli stessi nomi in cima in *tutte* le modalità, sta mostrando la classifica generale travestita.
2. **Segnale mappa/modalità, misurato** — sovrapposizione media dei top 10 fra mappe della stessa modalità *meno* quella fra modalità diverse. Vale 1,51/10 su brawlmetrics e 3,27/10 su brawlplanet.
3. **Somma che deve tornare** — le pick rate dei 106 brawler devono fare **600%** (6 pick per partita). Prova che la tabella è completa e non troncata.
4. **Inflazione dei rari** — correlazione fra win rate e log(pick rate). Se è negativa, la fonte premia i brawler poco giocati e non è usabile per consigliare pick. Su brawlplanet è **+0,40**: chi è scelto di più vince di più.

## Il metodo counter, in breve

I "forte/debole contro" grezzi sono la classifica generale travestita. Normalizza:
`atteso(A,B) = 50 + (forzaGenerale(A) − forzaGenerale(B))`, e usa il residuo.
Verifica sempre che il residuo medio sul totale delle coppie sia vicino a zero: se non lo è, il modello ha una distorsione e va corretto prima di usarlo.

## Controlli obbligatori prima di pubblicare

```bash
cd brawl-draft && node -e "new Function(require('fs').readFileSync('data.js','utf8'))()"   # sintassi
```

Poi `node script/check-brawl-data.js`, che carica `data.js` e verifica:
- nessun duplicato in `BRAWLERS`;
- ogni nome usato in `winRates`, `bestPicks`, `MODE_WIN_RATES`, `DEFAULT_META_SCORES`, `USE_RATES`, `MATCHUPS`, `BRAWLER_OVERALL` esiste nel roster;
- ogni mappa con `winRates` ha anche `sample` e `updated`;
- su ogni mappa la somma di `pickRates` fa 600% ± 2 (6 pick per partita: se non torna la tabella è troncata);
- nessuna nota contiene percentuali, date o dimensioni di campione;
- nessuna win rate fuori da 10–95.

**La maggior parte degli errori trovati finora è emersa da questo script o da un test in browser vero, non rileggendo il codice.**

Poi build e prova reale:
```bash
node script/build-brawl-draft.js
cd brawl-draft/dist && python3 -m http.server 8799 &
# Playwright: chromium in /opt/pw-browsers/chromium, NODE_PATH=$(npm root -g)
```
Nel browser: scegli modalità e mappa, verifica che compaiano ban e pick, che "Chi inizia" inverta i turni, e che non ci siano `pageerror`. Avvolgi `dist/app-completa.html` in un wrapper html minimo, perché il file è pensato per essere inserito in una pagina già esistente.

## Pubblicazione

L'app vive su un artifact. Ripubblica sullo **stesso URL** passandolo come `url`, altrimenti ne crei uno nuovo e il link dell'utente resta indietro. Prima di pubblicare fai `action: "read"` sull'URL.

## Cosa NON rifare

- Non ricercare la matrice completa dei matchup: **nessuna fonte la pubblica**, tutte danno 3 migliori e 3 peggiori per brawler. Il tetto è del dato, non della ricerca.
- Non reintrodurre l'euristica di classe scritta a mano: è stata sostituita da `CLASS_EDGE`, calibrata sui dati, che la smentisce in più punti.
- Non ordinare i pick per matchup nudo: premia i brawler senza dati. Usa la win rate nel contesto.
- Non ripetere campione e data dentro `notes`: l'app li stampa già da sé leggendoli dai dati, e la copia in prosa è quella che resta indietro e mente. Le note descrivono **solo il terreno**.
- Non cancellare una mappa sulla base di un articolo quando c'è un'API che risponde. Ring of Fire è stata tolta così, e c'era ancora.
- Non fidarti della scheda aperta di default su una pagina che ne ha due.
- Non toccare l'interfaccia per "renderla più veloce" senza aver prima misurato se è lenta: il render completo costa ~11ms con CPU rallentata 4x. Se l'utente dice "è lenta", quasi sempre parla dei gesti, non dei millisecondi.
- Non chiudere Annulla e Ricomincia dentro le impostazioni: servono durante il draft.
- `node script/build-brawl-draft.js` va lanciato dalla radice del repo. Se hai fatto `cd brawl-draft`, usa il percorso assoluto: lo script regge, il percorso relativo no.

## Il vincolo dell'interfaccia: 22 secondi a pick

Ogni pixel di scorrimento fra il consiglio e il punto dove si registra la mossa è tempo perso. Regole già pagate:

1. **Il roster si ordina per pick rate della mappa**, non per classe: è la probabilità che ti serva quella carta.
2. **Quello che si tocca sta sopra quello che si legge.**
3. **Quello che serve una volta si richiude** (impostazioni, provenienza, legenda); **i comandi del draft mai.**
4. Scorciatoie: due lettere + Invio, tasti 1-8, `/`, Backspace. La ricerca si svuota da sola dopo ogni mossa, e va svuotata PRIMA di ridisegnare.

Per misurare: Playwright con `Emulation.setCPUThrottlingRate {rate:4}` e viewport 390×844, poi leggi `getBoundingClientRect().top + scrollY` degli elementi chiave e confronta con `innerHeight`.
