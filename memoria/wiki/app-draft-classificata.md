# App Assistente Draft Classificata

Vedi anche [[fonti-brawl-stars]], [[metodo-counter]], [[errori-trovati]].

## Cos'è e dov'è

Assistente per il draft della Classificata di Brawl Stars. Codice in `brawl-draft/`, pubblicata come pagina singola su un artifact privato. Branch `claude/app-ranked-brawl-stars-8oxick`, PR #1.

## Struttura

| File | Contenuto |
|---|---|
| `brawl-draft/data.js` | tutti i dati: roster, win rate per rango/modalità/mappa, use rate, matchup, matrici di classe. **È l'unico file che l'aggiornamento settimanale riscrive.** |
| `brawl-draft/app.js` | logica: sequenza turni, punteggio, analisi rischio, rendering |
| `brawl-draft/index.html`, `style.css` | markup e stile |
| `script/build-brawl-draft.js` | unisce i quattro file in `dist/app-completa.html` per la pubblicazione |

## Principi di progetto (non cambiarli senza motivo)

1. **Il punteggio è una percentuale di vittorie stimata**, non punti astratti. Tutti i pezzi erano già in punti di win rate: sommarli direttamente dà un numero che si legge senza spiegazioni. Prima erano punti arbitrari e l'utente giustamente non li capiva.
2. **Specifico batte generico, e non si sommano.** Mappa > modalità > meta: la mappa è un sottoinsieme della modalità, contarle entrambe conterebbe due volte lo stesso segnale.
3. **Il dato incerto si miscela, non si scarta né si prende per buono.** Una mappa con campione piccolo o dati vecchi viene fusa col dato generale in proporzione all'affidabilità (`mapConfidence`).
4. **Misurato e stimato restano distinguibili a schermo.** Riquadri pieni = misurato, contorno = previsione.
5. **Non inventare numeri.** Fonte irraggiungibile → si tiene il dato vecchio e si annota la data del tentativo fallito.

## L'ordine dei pick cambia tutto

La Classificata usa **1-2-2-1**. Chi sceglie per primo vede 0, poi 2, poi 2 avversari; chi sceglie per secondo ne vede 1, 1, poi 3. **Solo l'ultimo pick vede la squadra avversaria al completo**, quindi un'analisi che presuppone tre avversari a schermo serve in un caso su sei. L'app guarda invece a quello che è visibile *adesso* e aggiunge il **rischio residuo**: quanto sei esposto a ciò che l'avversario può ancora prendere.

## Regola sull'interfaccia

**Un numero grande = sempre una percentuale di vittorie**, in ogni fase. Un punteggio astratto in una schermata e una percentuale in un'altra rende illeggibili entrambe. E le impostazioni attive vanno mostrate accanto ai risultati: scorrendo, i menu finiscono fuori schermo e non si capisce più su quali dati stia rispondendo l'app.

**La classifica deve restare verificabile contro la fonte.** Se sulla mappa il migliore è Gus, l'app deve mostrare Gus in cima: è così che l'utente capisce se fidarsi. Ne discendono due vincoli — l'ordine segue il numero mostrato (mai una miscela di due numeri, che rende la lista non monotona e incontrollabile), e nessun bonus euristico può spingere un brawler sopra la sua win rate misurata.

Attenzione: i gestori dei menu devono chiamare `render()`, non solo `renderSuggestions()`, altrimenti pezzi di interfaccia restano indietro e mostrano il falso.

## Trappola di progettazione già incontrata

Ordinando i pick per "peggior matchup" nudo, in cima finivano i brawler **senza dati** (Vince, Cosmo, Bonnie): tutte le loro previsioni stanno vicino al 50%, quindi sembravano i più solidi. **L'ignoranza veniva premiata.** Il caso peggiore va calcolato come win rate *nel contesto* (base sulla mappa + matchup peggiore), non come matchup isolato.

## Gli script (6/9 sera)

Il lavoro sui dati è meccanico, quindi vive negli script e non nelle mani:

| Script | Cosa fa |
|---|---|
| `script/fetch-brawlplanet-ranked.js` | Scarica il pool ranked e le tabelle **Classificata** delle 33 mappe. Sceglie la scheda giusta dal codice: la pagina ne ha due e quella di default è trofei. |
| `script/build-map-data.js` | Riscrive `MAPS` e ricalcola `MODE_WIN_RATES` dalle stesse tabelle. Ripulisce le note dai dati statistici, che l'app stampa già da sé. |
| `script/check-brawl-data.js` | Controlli di coerenza. Da far girare sempre prima di pubblicare. |
| `script/build-brawl-draft.js` | Bundle in un file solo per l'artifact. **Si lancia dalla radice del repo, non da `brawl-draft/`.** |

Aggiornare i dati sono due comandi, non un pomeriggio. Vedi [[fonti-brawl-stars]] per come si è scelta la fonte e [[errori-trovati]] per cosa non rifare.

## L'interfaccia: il vincolo è il timer (7/9)

Il draft dà **22 secondi a pick**. Il costo vero non è il calcolo, sono i gesti. Prima di cambiare qualcosa va misurato quale dei due è il collo di bottiglia: qui il codice faceva un render completo in **17ms** con la CPU rallentata quattro volte, cioè non era lui.

Quello che era lento, misurato sul telefono (390×844):

| | prima | dopo |
|---|---|---|
| altezza pagina | 2947px (3,5 schermate) | 1317px |
| banner del turno | 595px | 173px |
| casella di ricerca | **2052px** | 376px |
| consigli | 888px | 440px |

Registrare un pick avversario voleva dire scorrere duemila pixel e tornare su. E il roster era ordinato **per classe**: i 16 Tank davanti, Wendy 95esima.

### I principi che ne sono usciti

1. **Ordina il roster per quanto un brawler viene giocato QUI**, non per classe o alfabeticamente. La pick rate della mappa ce l'avevamo già: è letteralmente la probabilità che ti serva quella carta.
2. **Quello che si tocca sta sopra quello che si legge.** La ricerca è passata sopra i consigli; le caselle delle squadre, che si guardano e basta, sono scese sotto.
3. **Quello che serve una volta si richiude.** Impostazioni, provenienza dei dati, legenda: sezioni apribili, non pareti fisse in cima.
4. **Ma i comandi del draft non si nascondono mai.** Annulla e Ricomincia servono *durante*: stanno accanto al turno. (Erano finiti dentro le impostazioni che si richiudono — lo ha trovato il test in browser, non la rilettura.)
5. **La strada più corta è la tastiera**: due lettere + Invio, tasti 1-8 per i consigli, `/` per la ricerca, Backspace per annullare. La ricerca si svuota da sola dopo ogni mossa.

### Cosa fanno gli altri

- **brawlplanet** (draft helper): filtra il pool ai brawler che possiedi collegando il tag giocatore. Buona idea, non copiata: richiede l'API giocatori. Se servisse, la versione senza rete è farglieli spuntare una volta e tenerli in localStorage.
- **PL Prodigy**: hotkey per le due azioni frequenti (`/` cambia turno, backtick resetta) e una vista "come la vede l'avversario".
- **Draftly / uDrafter** (League of Legends): ricerca per nome + filtro ruolo, aggiornamento istantaneo senza ricaricare.

## Il metodo generale è uscito da qui

Quello che di questo lavoro vale anche per altre app sta nella skill
`costruire-app`: come scegliere fra fonti che si contraddicono, perché due
fonti non si mescolano mai nello stesso numero, i vincoli di una pagina
pubblicata, come si progetta un'interfaccia perché non induca errori, e i
controlli da fare prima di consegnare. Questa pagina resta il caso concreto.
