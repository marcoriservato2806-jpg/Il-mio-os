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

E poi, dal repository, i controlli sul MODELLO — non sui dati. Girano fuori dal
browser grazie a `script/carica-app.js`, che carica `data.js` e `app.js` in node
con un DOM finto:

```bash
node script/verifica-scorciatoia.js   # la scorciatoia algebrica == versione ovvia (deve dare ~1e-15)
node script/verifica-consigli.js 11   # cosa consiglia DAVVERO su 132 posizioni, col rango Mythic
node script/misura-interazioni.js     # quanto pesa ogni pezzo del punteggio
```

`verifica-consigli.js` è la rete: se un cambiamento fa ricomparire un difetto
vecchio (un nome che prende più del 20% delle prime posizioni, il primo
consigliato che crolla sotto il 50% nel caso peggiore più di ~25 volte su 132,
un pick raro consigliato spesso) si vede lì. Le calibrazioni si rifanno con
`calibra-classi.js`, `calibra-favore-matchup.js`, `calibra-quota-risposta.js`,
`misura-distorsione-matchup.js` e `misura-ban.js`: **ogni costante del modello ha
lo script che l'ha prodotta, e va rifatto se i dati cambiano.**

Prima di pubblicare, misura anche il ridisegno con la CPU rallentata quattro
volte: il bilancio è **sotto i 20ms**, e ci si arriva. Se un cambiamento lo
sfonda, la strada è l'algebra o una cache, non troncare i dati.

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
- **Non sommare il vantaggio nei matchup senza centrarlo sul candidato**: la sua forza generale è già nella win rate di mappa, che è la base. Contarla due volte fa uscire sempre gli stessi nomi. Quello dell'avversario invece va contato.
- **Non riportare `CLASS_EDGE_SHRINK` a 0,75**: quel valore è corretto solo *senza* il favore per brawler accanto. Con il favore nel modello, stimati insieme fuori campione, la classe vale 0,2.
- Non ri-ordinare i ban in base a quanto sai rispondere alla minaccia: il divario è piccolo (57,3% contro 53,3%) e non esiste un giudice indipendente per validarlo — ogni giudice costruibile usa lo stesso modello dell'ordinamento. Il numero si mostra, l'ordine no.
- **Non aggiungere una descrizione della geometria delle mappe** (aperta/chiusa, corridoi, muri): è già dentro le win rate di mappa. Misurato con `script/apertura-mappe.py`, che ricava l'ingombro dalle immagini: tolto l'effetto della modalità (che da solo spiega l'84% della varianza), la win rate di mappa dei singoli brawler segue la geometria con i segni giusti — Piper −0,46, Wendy −0,49, contro Nita +0,44 e Ash +0,31. Aggiungerla a mano la conterebbe due volte.
- I "tratti mappa" spuntati a mano sono un **ripiego per quando la mappa non ha dati**, non un'aggiunta: non applicarli mai sopra una mappa con `winRates`.
- Non troncare la distribuzione degli avversari possibili per andare più veloce: i primi venti coprono solo il 61% della probabilità. La velocità si prende con l'algebra (vedi `edgeCasellaVuota`).
- Non ripetere campione e data dentro `notes`: l'app li stampa già da sé leggendoli dai dati, e la copia in prosa è quella che resta indietro e mente. Le note descrivono **solo il terreno**.
- Non cancellare una mappa sulla base di un articolo quando c'è un'API che risponde. Ring of Fire è stata tolta così, e c'era ancora.
- Non fidarti della scheda aperta di default su una pagina che ne ha due.
- Non far girare `renderGrid` prima di `renderSuggestions`: è quest'ultima a calcolare `_classifica`, che la griglia legge per il punteggio sulle carte. Al contrario, la griglia mostra i punteggi del turno prima.
- Non scrivere il tag del giocatore in nessun file del repo: è pubblico.
- Quando riscrivi un blocco di `app.js` per intervallo di testo, controlla cosa c'era in mezzo: una riscrittura ha cancellato `ritratto()` e l'eccezione interrompeva `render()` a metà, il che sembrava un bug del modello dei turni.
- Nei generatori, per le chiavi stringa usa `json.dumps`, mai `repr()` + `.replace("'", '\"')`: su `Belle's Rock` produce JavaScript non valido.
- Non toccare l'interfaccia per "renderla più veloce" senza aver prima misurato se è lenta: il render completo costa ~11ms con CPU rallentata 4x. Se l'utente dice "è lenta", quasi sempre parla dei gesti, non dei millisecondi.
- Non chiudere Annulla e Ricomincia dentro le impostazioni: servono durante il draft.
- `node script/build-brawl-draft.js` va lanciato dalla radice del repo. Se hai fatto `cd brawl-draft`, usa il percorso assoluto: lo script regge, il percorso relativo no.

## La regola che cambia tutti i consigli: potenza minima

**In Classificata un brawler sotto POTENZA 9 non si può schierare, e da Mythic in su ne serve uno a POTENZA 11.** Non è una preferenza dell'utente, è una regola del gioco (verificata su due fonti). Un consiglio su un brawler non schierabile è peggio che inutile: fa perdere i secondi che non ci sono.

Il filtro vale **solo per la squadra dell'utente** (`state.myTeam`). Il roster resta intero: l'avversario li avrà maxati, e i suoi pick vanno comunque registrati.

## Profilo del giocatore

`node script/fetch-profilo-brawl.js <tag>` legge dal tracker pubblico di brawlplanet quali brawler possiede un profilo, con livello, rank e trofei. Niente chiave, niente login.

Scrive `brawl-draft/profilo.js` con i soli livelli di potenza. **Il tag non ci finisce: il repository è pubblico** ed è il tag a collegare questa cartella al profilo di gioco. Il build ha un controllo che fallisce se il tag compare nel file prodotto.

**Non esiste una via dal vivo dentro la pagina pubblicata.** L'API ufficiale di Supercell vuole una chiave legata a un IP fisso (in una pagina sarebbe in chiaro e l'IP non combacerebbe), e le capability degli artifact (artifact, db, downloads, mcp, room, sample) non aprono la rete verso siti arbitrari — `mcp` raggiunge solo i connettori claude.ai dell'utente, e per Brawl Stars non ce n'è. Quindi è sempre una fotografia da rilanciare, mai un collegamento.

## Ritratti

`node script/fetch-ritratti.js` scarica i ritratti dal CDN pubblico di Brawlify e scrive `brawl-draft/ritratti.js` (data URI, 96px WebP, ~378 KB per 106 brawler). **Incorporati e non collegati**: la pagina pubblicata non carica immagini da altri siti, e non dà nemmeno errore — semplicemente non compaiono. Vince e Cosmo non hanno immagine sul CDN: l'app mostra le iniziali.

**Trappola già pagata:** ricreare 108 `<img>` con data URI a ogni render porta il ridisegno da 11ms a 66ms, perché il browser ridecodifica ogni immagine — e la ricerca ridisegna a ogni lettera. Le carte del roster si creano **una volta** e si riordinano (`_carte` in app.js): 2,6ms. Non tornare a ricostruirle.

## Il modello dei turni è a CASELLE, non a pila

Ogni turno della sequenza ha un `k` che dice quale casella di quella squadra occupa; `currentTurn()` è la prima casella vuota. Da qui viene gratis il comportamento che serve: **ritoccare un brawler lo toglie**, anche se sta a metà draft, e il turno torna sulla casella liberata senza smuovere il resto. Non tornare a un modello ad accodamento: l'errore vero è toccare la faccia sbagliata al terzo turno e accorgersene al quinto.

## Meno controlli è una funzione, non estetica

Ogni controllo che si può impostare al contrario è un modo per avere consigli **sicuri e sbagliati** senza che si veda. Già tolti, non reintrodurli:
- i due menu "chi inizia" + "io gioco in" → un interruttore solo; **gli Alleati sono sempre l'utente**;
- il campo di testo con l'ordine dei pick (`A,B,B,A,A,B`): l'ordine 1-2-2-1 è fisso;
- filtro per classe e menu dell'ordinamento: il roster si ordina sempre per quanto un brawler vale adesso.

## Il vincolo dell'interfaccia: 22 secondi a pick

Ogni pixel di scorrimento fra il consiglio e il punto dove si registra la mossa è tempo perso. Regole già pagate:

1. **Il roster si ordina per pick rate della mappa**, non per classe: è la probabilità che ti serva quella carta.
2. **Quello che si tocca sta sopra quello che si legge.**
3. **Quello che serve una volta si richiude** (impostazioni, provenienza, legenda); **i comandi del draft mai.**
4. Scorciatoie: due lettere + Invio, tasti 1-8, `/`, Backspace. La ricerca si svuota da sola dopo ogni mossa, e va svuotata PRIMA di ridisegnare.

Per misurare: Playwright con `Emulation.setCPUThrottlingRate {rate:4}` e viewport 390×844, poi leggi `getBoundingClientRect().top + scrollY` degli elementi chiave e confronta con `innerHeight`.
