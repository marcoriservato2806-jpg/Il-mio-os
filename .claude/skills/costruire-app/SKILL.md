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

### Una media misurata su chi sceglie una cosa non vale per chi non la sceglierebbe

La trappola più costosa trovata finora, e non è rumore statistico: il campione
era grande e il numero corretto. Un'opzione scelta dallo 0,5% delle persone ha
statistiche misurate **su quello 0,5%**, cioè su chi la sceglie apposta —
tipicamente chi la sa usare. Presentarla a chi non è di quel gruppo è un
consiglio sbagliato con un numero giusto dietro.

**Come si riconosce:** confronta l'opzione con quelle della sua stessa rarità,
non con tutte. E controlla se il suo vantaggio **varia col contesto**: un
vantaggio reale dipende dalla situazione, uno che riflette *chi sceglie* resta
uguale ovunque. Qui: 16 punti sopra i pari per rarità, e meno variabilità fra
contesti della media.

**Come si corregge:** tira il valore verso la media generale in proporzione a
quanto l'opzione è rara — `valore = medio + (misurato − medio) × p/(p+p0)`.
**Calibra p0 misurando**, non a occhio: la correlazione fra punteggio finale e
popolarità deve *scendere* (altrimenti stai solo inseguendo la folla) e quella
col dato grezzo deve restare alta (altrimenti hai buttato il segnale). Qui:
0,40 → 0,14 e 0,81 conservato.

**Attenzione all'asimmetria:** la correzione vale per «quanto renderebbe a
me», non per «quanto vale in mano a chi l'ha scelta». Le due domande hanno
risposte diverse e vanno tenute separate.

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

### Prima di sommare un termine, chiedi se è già dentro la base

Il difetto più costoso trovato su questa app non era un numero sbagliato: era
un numero **contato due volte**. Il punteggio partiva dalla win rate misurata
in quel contesto (la base) e ci sommava il vantaggio nei confronti diretti. Ma
un soggetto che se la cava meglio *contro chiunque* ha, proprio per questo, una
base più alta: la sua forza generale stava in tutti e due i termini. Il sintomo
era esattamente quello che l'utente segnalava, «consiglia sempre gli stessi
nomi» — e in una versione intermedia un solo nome prendeva il 21% delle
posizioni, con i primi sei che erano i sei col valore più alto di quel termine.

La correzione è **centrare**: il termine di interazione deve essere lo
scostamento rispetto alla media del soggetto stesso, non il valore assoluto.
Il termine relativo alla *controparte* invece resta, e non è doppio conteggio:
la base è misurata contro una controparte media, e questa non è quella media.

Come accorgersene senza aspettare la segnalazione: **somma il termine di
interazione su tutte le controparti possibili.** Se non fa zero, quel termine
sta spostando il livello, e il livello è già nella base. Un termine di
interazione onesto è a media nulla per costruzione.

Corollario che vale in generale: **un raggruppamento che sembra spiegare può
star assorbendo un effetto più fine.** Qui la matrice per classe spiegava il
19,8% della varianza; aggiunto un effetto per singolo soggetto, il peso della
classe crollava da 0,75 a 0,19 e l'insieme arrivava al 53,9%. Le classi
raggruppano soggetti, quindi le medie per classe stavano facendo da
approssimazione all'effetto individuale. Quando aggiungi un predittore più
fine, **ri-stima i coefficienti di quelli vecchi insieme al nuovo** invece di
sommarli: tenere il vecchio peso significa contare due volte.

### Un numero che calcoli e mostri ma non usi è un numero che non hai

Il caso peggiore era calcolato per ogni candidato, mostrato in un riquadrino, e
**ignorato dall'ordinamento**. Su 132 situazioni misurate, la prima scelta
consigliata aveva un caso peggiore sotto la soglia di parità 50 volte, e ben
sotto 13 volte. Chi legge una lista ordinata segue il primo elemento: se
l'ordine non tiene conto di un rischio, mostrarlo accanto non protegge nessuno.

Quando il peso da dare al rischio non è calibrabile — qui mancavano gli esiti
reali, quindi non c'era un bersaglio — **misura il compromesso invece del
peso**: fai variare il parametro e traccia quanto perdi sull'una e guadagni
sull'altra. Il punto dove il cambio smette di convenire è una scelta
difendibile, e si spiega in una riga. Qui: a 0,4 si lasciavano 0,17 punti di
resa media per 0,76 di robustezza, oltre quattro guadagnati per uno perso;
oltre 0,5 il cambio scendeva sotto tre.

E dichiara l'assunzione **nel codice e a schermo**, distinta dalle misure: chi
legge deve poter sapere quale numero è misurato e quale è deciso.

### Ottimizza con l'algebra, non con l'approssimazione

Tenere conto di tutte le controparti possibili significava valutare diecimila
coppie per ridisegno: da 17 a 41ms con la CPU rallentata quattro volte. La
tentazione è troncare (le prime venti controparti coprivano solo il 61% della
probabilità: troncare avrebbe cambiato le risposte).

La via giusta è guardare la formula. Sulle coppie *stimate* il termine si
semplificava a «effetto del gruppo × effetto della controparte», cioè non
dipendeva più dal singolo soggetto: la somma su cento controparti diventava una
somma su sette gruppi, più una correzione sulle poche coppie davvero misurate.
Con un indice delle coppie misurate per soggetto — senza, si torna a scorrere
tutte le controparti e la scorciatoia non serve a niente — il costo è crollato.

Due regole che ne restano:

1. **Scrivi uno script che confronti la versione veloce con quella ovvia** su
   tutti i casi reali. Qui la differenza massima su 3267 casi è 2,8·10⁻¹⁵, cioè
   arrotondamento macchina: la scorciatoia non è un'approssimazione, ed è
   dimostrato ogni volta che lo script gira.
2. **Profila, non indovinare.** Il primo tentativo (memorizzare una funzione
   che scandiva un array di 108 elementi) non cambiò niente di misurabile. Il
   costo vero stava altrove, e due voci su tre le ha trovate il profilo: una
   funzione che faceva il parsing di una data cento volte per ridisegno, e
   dodici immagini incorporate ricreate a ogni tocco — la stessa trappola dei
   data URI già trovata mesi prima su un altro pezzo della stessa pagina. **Una
   trappola già documentata va cercata di nuovo in ogni punto che le somiglia.**

### "Non funziona": misura il bersaglio prima del codice

Segnalazione: «premo Reset e non si resetta». La tentazione è riscrivere
`resetDraft`. **Otto scenari in browser vero dicevano che azzerava sempre** —
draft a metà, draft completo, dopo aver saltato i ban, con testo nella
ricerca, due volte di fila. Il difetto stava altrove: il tasto era
**60×30px a 15px dal bordo alto**, contro i **44px minimi**, nell'angolo in
alto a destra dove i visualizzatori mettono la loro barra. Era il tocco a non
arrivare.

Quindi, in ordine:

1. **Riproduci prima di spiegare.** Se non riesci a riprodurlo, dillo: è
   un'informazione, non una sconfitta. Cambiare codice che funziona per una
   causa mai vista aggiunge un difetto invece di toglierne uno.
2. **Misura il bersaglio**: `getBoundingClientRect()` su tutte le larghezze
   che l'utente usa. Sotto 44×44px, o a meno di ~20px dal bordo alto in una
   pagina incorporata, il difetto è lì.
3. `touch-action: manipulation` su tutto ciò che si tocca di corsa: toglie
   l'attesa di ~300ms con cui il browser decide se era un doppio tocco.
4. Una barra `position: sticky` su iOS, durante lo scorrimento per inerzia,
   si disegna nel posto giusto ma **tiene la zona sensibile dov'era**:
   promuovila a livello suo (`transform: translateZ(0)`).

**E soprattutto: ogni comando il cui effetto può essere invisibile deve
confermare.** Reset premuto su un draft già vuoto lascia lo schermo identico,
quindi «non ha fatto niente» e «non ha sentito il tocco» erano
indistinguibili — e finché lo sono, la segnalazione successiva non è
diagnosticabile. Un secondo di "Azzerato" sul tasto separa i due casi, e la
risposta dell'utente diventa una misura.

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
