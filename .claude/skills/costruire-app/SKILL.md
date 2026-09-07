---
name: costruire-app
description: Metodo per costruire app e strumenti che devono dare risposte giuste con dati veri — scegliere fra fonti che si contraddicono, pubblicarli come pagina, progettare l'interfaccia perché non induca errori, e controllare il lavoro prima di consegnarlo. Usala ogni volta che si costruisce o si aggiorna un'app, un cruscotto, un assistente o uno strumento che mostra numeri presi da fonti esterne — anche quando la richiesta è piccola ("aggiungi un grafico", "cambia il layout", "aggiorna i dati"), e anche quando l'utente non nomina nessuna di queste cose. Vale in particolare quando i dati vengono dal web, quando la pagina va pubblicata come artifact, o quando chi la usa deve decidere in fretta.
---

# Costruire app che non mentono

Questo metodo viene da un'app vera (l'assistente draft di Brawl Stars in
`brawl-draft/`) e da tutti gli errori che ha fatto strada facendo. Ogni regola
qui sotto è costata una scoperta. Per il caso specifico di quell'app c'è la
skill `draft-brawl-stars`; qui c'è solo quello che vale anche altrove.

Il filo conduttore: **un'app che sbaglia con sicurezza è peggio di un'app che
non risponde.** Quasi tutto quello che segue serve a evitare la risposta
sicura e sbagliata.

## 1. Prima di credere a un dato, verifica di star leggendo la cosa giusta

L'errore più costoso non è stato scegliere la fonte sbagliata: è stato leggere
la **sezione sbagliata della fonte giusta**, per ore, senza accorgersene.

- **La scheda aperta di default può non essere quella che ti serve.** Una
  pagina con due schede ("classifica trofei" / "classificata") ne mostra una,
  e a occhio si prende quella. Ancoràti a un testo che identifica la scheda
  giusta, e fallo fare a uno script — non al tuo occhio.
- **La lista che hai può descrivere un'altra popolazione.** L'elenco delle
  mappe sembrava giusto ed era completo: era la rotazione sbagliata. Da lì
  venivano tre sintomi diversi che sembravano tre problemi separati (dati
  vecchi, dati mancanti, mappe assenti). Quando più sintomi arrivano insieme,
  sospetta una causa sola più a monte.
- **Un articolo vecchio non batte un'API che risponde oggi.** Una mappa è
  stata cancellata sulla fede di un articolo del 2021. Esisteva ancora.
- **Se una fonte pubblica un'API, usa quella e non lo scraping del sito.** È
  la porta d'ingresso prevista, non un aggiramento. Se un sito blocca i bot,
  cerca un'altra fonte: non fingerti un browser e non usare proxy.

## 2. Come scegliere fra due fonti che si contraddicono

Non a intuito, e non "quella con più dati". Quattro controlli, in ordine di
potenza. Adattali al dominio: la forma è generale, gli esempi sono del caso.

1. **Coerenza con la realtà.** Il dato deve avere la struttura che il dominio
   impone. Le mappe di una modalità devono premiare i personaggi adatti a
   quella modalità. Se una fonte dà **gli stessi nomi in cima ovunque**, non
   sta misurando il caso specifico: sta mostrando la classifica generale
   travestita.
2. **Misura quanto segnale specifico contiene davvero.** Confronta la
   somiglianza fra casi che dovrebbero somigliarsi *meno* quella fra casi che
   non dovrebbero. Qui: sovrapposizione media dei top 10 fra mappe della
   stessa modalità meno quella fra modalità diverse — **1,51/10 su una fonte,
   3,27/10 sull'altra**. Un numero, non un'impressione.
3. **Cerca una somma che deve tornare.** Le percentuali di scelta dei 106
   personaggi facevano **600%** su ogni mappa, cioè esattamente 6 scelte per
   partita. È la prova che la tabella è completa e non troncata. Quasi ogni
   dominio ha un'identità del genere: trovala e verificala.
4. **Smaschera il bias di selezione.** Correlazione fra il valore e quanto
   quella cosa è usata. Se il valore sale quando l'uso scende, la fonte
   premia i casi rari (pochi esperti che alzano la media) e non è utilizzabile
   per consigliare. Qui era **+0,40**: chi è scelto di più vince di più, cioè
   nessuna inflazione.

E poi: **cerca l'eccezione e dichiarala.** Un personaggio era primo su 12
mappe con lo 0,3% di scelte, contro la tendenza generale. Non era rumore ed
era confermato da altre due fonti — ma quel numero è misurato su chi lo gioca
abitualmente. L'app lo dice nel suggerimento invece di nasconderlo.

## 3. Mai mescolare due fonti nello stesso numero

Due fonti che misurano la stessa cosa contano popolazioni diverse. Si usa
l'una **o** l'altra, o si confrontano; non si mediano, sommano o miscelano.

Il corollario che si dimentica: **se il codice miscela due livelli di dato**
(il dato specifico con quello generale, quando il primo è poco affidabile),
quei due livelli devono venire **dalla stessa fonte**. Se il livello generale
non esiste in quella fonte, **calcolalo dai dati che hai** (media pesata sul
campione) invece di prenderlo altrove: così la scala è la stessa per
costruzione, non per fortuna.

Principio generale: **specifico batte generico e non si somma.** Contare sia
il caso particolare sia quello generale conta due volte lo stesso segnale.
E il dato incerto **si miscela** in proporzione all'affidabilità, non si
scarta né si prende per buono.

## 4. Distingui sempre misurato da stimato

Nel codice e a schermo. Se il 90% delle combinazioni è modellato e il 10%
misurato, l'utente deve poterlo vedere — un riquadro pieno contro uno vuoto
basta. E **non inventare mai un numero**: fonte irraggiungibile → tieni il
dato vecchio e annota la data del tentativo fallito. Meglio un dato
dichiaratamente vecchio che uno inventato bene.

## 5. I vincoli di una pagina pubblicata (artifact)

Sono rigidi e silenziosi: quando li violi non c'è nessun errore, la cosa
semplicemente non funziona.

- **Niente rete.** La pagina non può chiamare siti esterni. Se serve un dato
  esterno, **scaricalo qui e incorporalo** nel file.
- **Niente immagini da altri siti.** Vanno incorporate come data URI. Prima
  ridimensionale: 106 ritratti a 170px pesavano 1,1 MB, a 96px WebP 378 KB.
- **Gli script solo dai CDN in elenco**, con versione fissata.
- **Ripubblica sullo stesso URL**, passandolo come `url`, altrimenti il link
  dell'utente resta indietro.
- **Le capability** (`db`, `sample`, `mcp`, ...) non aprono la rete verso siti
  arbitrari: `mcp` raggiunge solo i connettori dell'utente. Se non c'è un
  connettore per quel servizio, il collegamento dal vivo **non esiste** — dillo
  invece di lasciarlo credere possibile, e proponi la fotografia periodica.

### La trappola delle prestazioni con i dati incorporati

Ricreare 108 `<img>` con data URI a ogni ridisegno porta il render **da 11ms a
66ms**, perché il browser ridecodifica ogni immagine — e se il ridisegno
avviene a ogni lettera digitata, si sente. **Crea i nodi una volta e
riordinali**: riappendere nodi esistenti non ridecodifica niente. Dopo la
correzione: 2,6ms, meno di prima che le immagini esistessero.

## 6. Dati personali e repository pubblici

Prima di scrivere un identificativo in un file, **controlla se il repository è
pubblico**. E attenzione al passo falso: **una regola scritta per proteggere un
identificativo non deve contenere l'identificativo.** Il controllo "questo tag
non deve finire nel file pubblicato" conteneva il tag in chiaro, dentro uno
script di un repo pubblico: cerca la *forma* del dato sensibile, non il valore.
Poi **prova il controllo facendolo fallire di proposito**: la prima versione
della forma era troppo corta e lasciava passare proprio il dato da proteggere,
e senza quella prova sarebbe passata per buona. Nel caso reale il tag del giocatore è rimasto fuori e nel file
sono finiti solo i dati non identificanti, con un controllo nella build che
fallisce se l'identificativo ricompare. Se noti dati personali esposti,
diccelo una volta con chiarezza e vai avanti.

## 7. Interfacce per chi ha fretta

Se l'utente dice "è lenta", **misura prima di toccare**: qui il render
completo costava 17ms con la CPU rallentata quattro volte. Non era il codice.
Era la distanza fra il consiglio e il punto dove si registra la mossa.

Misure che contano più delle impressioni — prendile con Playwright, viewport
telefono e `Emulation.setCPUThrottlingRate {rate:4}`, leggendo
`getBoundingClientRect().top + scrollY` e confrontando con `innerHeight`:

| | prima | dopo |
|---|---|---|
| altezza pagina | 2947px (3,5 schermate) | 1317px |
| il controllo più usato | **2052px** (fuori schermo) | 281px |

Le regole che ne sono uscite:

1. **Ordina per probabilità d'uso, non alfabeticamente né per categoria.** Il
   roster era ordinato per classe e l'elemento più cercato era il 95esimo. Se
   hai un dato che dice quanto una cosa viene usata *in questo contesto*, è
   l'ordinamento giusto: è letteralmente la probabilità che serva.
2. **Quello che si tocca sta sopra quello che si legge.**
3. **Quello che serve una volta si richiude** (impostazioni, provenienza,
   legenda); **i comandi che servono durante il lavoro mai.** Annulla e
   Ricomincia erano finiti dentro le impostazioni che si richiudono da sole:
   irraggiungibili proprio quando servivano.
4. **La strada più corta è la tastiera**: due lettere + Invio con anteprima di
   cosa confermerai, tasti numerici per le prime scelte, un tasto per il
   campo di ricerca. Il campo si svuota da solo dopo ogni mossa — e va
   svuotato **prima** di ridisegnare, o l'indizio sotto resta indietro.
5. **Mostra le immagini, non solo i nomi.** Riconoscere una faccia è più
   veloce che leggere. E l'immagine di ciò che si è selezionato da una tendina
   è il modo più rapido per accorgersi di aver scelto la cosa sbagliata.

### Meno controlli è una funzione, non estetica

**Ogni controllo che si può impostare al contrario è un modo per ottenere
risposte sicure e sbagliate senza che si veda.** C'erano due menu ("chi
inizia" e "in che squadra gioco"): bastava sbagliarne uno perché l'app
consigliasse con sicurezza per la squadra sbagliata. Diventati **un
interruttore solo**, l'errore non è più possibile.

Regole: elimina i campi di testo dove basta una virgola di troppo per rompere
tutto, se il formato è di fatto fisso; togli i filtri e gli ordinamenti quando
un ordinamento è giusto in ogni caso; non ripetere tre volte la stessa
informazione in punti diversi.

### Annullare: caselle, non pila

Se l'utente può sbagliare un inserimento, non basta "annulla l'ultimo":
l'errore vero è sbagliare al terzo passo e accorgersene al quinto. **Dai a
ogni passo la sua casella** e fai che ritoccare un elemento lo tolga — solo
quello, con il resto fermo e il turno che torna da solo sulla casella
liberata. Costa una riscrittura del modello e vale ogni riga.

## 8. Controlli obbligatori prima di consegnare

**Quasi tutti i bug veri sono usciti da uno script di controllo o da una prova
in browser vera. Nessuno dalla rilettura del codice.** Rileggere serve a
scrivere meglio, non a trovare errori.

1. **Sintassi** dei file di dati generati.
2. **Uno script di coerenza** che verifichi le invarianti del dominio: nessun
   duplicato, ogni nome usato esiste nell'anagrafica, ogni dato ha la sua
   provenienza e la sua data, nessun valore fuori dall'intervallo plausibile,
   e **le somme che devono tornare**.
3. **Una prova in browser vera**, con la pagina prodotta, che percorra il
   flusso completo e verifichi che non ci siano errori JavaScript.
4. **I numeri si controllano.** Se un totale non torna con la somma delle
   righe, fermati e dillo invece di aggiustarlo.

Il test in browser ha trovato, fra l'altro: un comando diventato
irraggiungibile, una nota che affermava numeri ormai falsi, virgole infinite
a schermo, una funzione cancellata da una riscrittura (la cui eccezione
interrompeva il disegno a metà e **sembrava un bug di tutt'altro**), e un
generatore che rompeva i nomi con l'apostrofo.

### Due trappole nei generatori di codice

- **Riscrivere un blocco per intervallo di testo cancella quello che c'è in
  mezzo.** Controlla cosa stai includendo negli estremi.
- **Per le chiavi stringa usa una codifica JSON vera**, mai `repr()` seguito
  da una sostituzione di virgolette: su un nome con l'apostrofo produce codice
  non valido e la pagina non parte proprio.

## 9. Il lavoro meccanico va in uno script

Se un pezzo di lavoro non ha giudizio dentro (scaricare, convertire, sommare,
rinominare, ridimensionare), non rifarlo a mano: scrivi uno script in
`script/` e da lì in poi usa quello. Aggiornare i dati deve diventare due
comandi, non un pomeriggio. Vale anche per i controlli del punto 8.

Gli script che si ritrovano quasi sempre, per forma:
- **scaricare** da una fonte, ancorandosi al pezzo giusto della pagina;
- **generare** i file di dati dell'app da quello scarico;
- **controllare** le invarianti;
- **impacchettare** in un file solo per la pubblicazione.

## 10. Cosa scrivere accanto al codice

- **Il perché, non il cosa.** I commenti che sono serviti dicono quale errore
  quella riga previene: "prima qui c'era X e sbagliava così".
- **Non ripetere in prosa un dato che l'app stampa già dai dati.** Le note
  delle mappe ripetevano campione e data, e dopo un aggiornamento
  continuavano a dire "dati di fine luglio" con dati di oggi. **La copia in
  prosa è quella che resta indietro e mente.** Se un generatore riscrive
  quei file, fagli ripulire anche le note.
- **Tieni un registro degli errori trovati e di come sono emersi.** Ognuno è
  costato una verifica: ritrovarlo è puro spreco.
