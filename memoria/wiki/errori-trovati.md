# Errori trovati nei dati (e come sono saltati fuori)

Vedi anche [[fonti-brawl-stars]], [[app-draft-classificata]].

Elenco tenuto perché ognuno di questi è costato una verifica incrociata: ritrovarli sarebbe uno spreco.

| Errore | Come è emerso | Correzione |
|---|---|---|
| ~~**Ring of Fire** rimossa dal gioco~~ **← era sbagliato, vedi sotto** | 404 sulla pagina mappa + un articolo del 2021 | **Correzione del 6/9 sera: la mappa c'è.** L'API di Brawlify la dà `disabled: false` e sta nel pool ranked di brawlplanet. Rimessa. |
| **"Non predice" detto al posto di "non riesco a misurarlo"** | avevo sintetizzato con «il dato di mappa non predice le tue partite, AUC 0,493». Il test diretto per quartili da' +3,6 punti nella direzione giusta (previsti 7) con errore standard 9,4: per dimostrarlo servirebbero ~3.200 partite contro le 226 disponibili | **Assenza di prova non e' prova di assenza. Prima di dire che un effetto non c'e', calcola quale effetto minimo il tuo campione potrebbe vedere.** |
| **Il mio consiglio era sovradattamento** | «smetti di giocare le combinazioni sotto il 45% e passi dal 60% al 68%». Scegliendo le combinazioni cattive dalla prima meta' delle partite e misurandole sulla seconda, il guadagno vero e' **0,6 punti** | Detto all'utente prima che ci contasse. **Regola: quando scegli un sottoinsieme in base ai dati e poi misuri il guadagno sugli stessi dati, il numero e' finto. Vale anche per i TUOI consigli, non solo per le fonti esterne.** |
| **Il record personale era un veto, non un ingrediente** | con 11 partite Damian si spostava di 25 punti, piu' di tutto il resto del punteggio insieme | Tetto ±8, **misurato** sulle 226 partite vere (log-loss 0,6704 contro 0,6703 senza tetto, AUC 0,581 contro 0,560). **Un termine che da solo supera la somma di tutti gli altri non e' una media ponderata.** |
| **"Non ho gli esiti delle partite" era falso** | lo ripetevo per giustificare ogni assunzione non calibrabile. Il registro `battles` era nello stesso payload: 269 partite con mappa, brawler ed esito | Ora ogni assunzione si puo' verificare. **Prima di dichiarare che un dato non esiste, guarda tutte le chiavi di quello che scarichi gia'.** (terza volta nella stessa sessione) |
| **Allarme su un buco di dati che non c'era** | contate 46 mappe nel pool contro le mie 33, annunciato il buco. Erano 33 attive + 13 ARCHIVIATE | Verificato prima di agire, corretto in corsa. **Un conteggio che sorprende va guardato due volte prima di raccontarlo.** |
| **Consigliavo sulla media della gente avendo i dati DI CHI USA L'APP** | tre segnalazioni di fila su pick che facevano perdere. Il campo `detail` del tracker ha partite e vittorie per brawler: Damian 1 su 11, contro una media personale del 58,8%. Probabilita' dello 0,165% se il 56,4% dell'app fosse vero per lui | Il record personale entra come scarto dalla media personale, con peso n/(n+11) calibrato sulla varianza dei suoi risultati (sd vera 14,9 punti). **Regola: prima di modellare il comportamento di una popolazione, guarda se hai i dati della persona.** |
| **La stessa trappola dei data URI per la TERZA volta** | ritratti ricreati a ogni ridisegno nelle righe dei consigli, dopo averla corretta sulle carte del roster e sulle caselle del palco | Cache anche li' (21,9 -> 13,7ms). **Quando trovi una trappola, cercala in OGNI punto che le somiglia nello stesso file, subito — non aspettare che si ripresenti.** |
| **Un'euristica scritta a mano scavalcava il dato misurato** | segnalazione con schermata: Otis primo su Bridge Too Far. Il +2 "manca la frontline" lo portava da 51 a 53 e da sesto a primo, ma su quella mappa Tank e Controller sono le due classi PEGGIORI (-2,5 e -1,9). Succede su 9 mappe su 33 | Il bonus si applica solo se il dato di mappa non lo smentisce. **Ogni euristica generica va condizionata al dato specifico, se il dato specifico c'e'.** |
| **Un numero mediocre mostrato come se fosse buono** | il primo consigliato sta fra 51,1% e 61,0%, mediana 54,1%: un 53% e' un draft pari, ma a schermo era in oro come un 61% | Riga che compare solo sotto la mediana. **Un numero senza riferimento non e' informazione: mostra dove sta rispetto al normale.** |
| **Valori di acquisti diversi sommati come se fossero indipendenti** | Ash e Bolt erano i primi due della lista, ma quattro delle sei mappe di Ash sono Gem Grab, dove Bolt e' molto piu' forte: al primo pick Bolt assorbe il 55% del valore di Ash | Il secondo acquisto si valuta **dopo** il primo, non da solo. `quali-potenziare.js` accetta `GIA_PRESO`. **Regola: due cose forti nello stesso posto non sommano il loro valore, se lo contendono.** |
| **Numeri citati senza averli letti** | avevo dato le pick rate dei gadget di sei brawler come se venissero dalla fonte, avendone interrogati solo sette altri. Verificate dopo: tutte e sei giuste | Il risultato giusto non salva il processo sbagliato. **Se un numero non viene da una chiamata che hai fatto in questo giro, non scriverlo.** |
| **Il dato c'era nel payload e non lo leggevo** | consigliati gadget che l'utente possiede gia' su 9 brawler su 11: il tracker espone `abilities` con un flag `owned`, lo script prendeva solo potenza e trofei | Script esteso a posseduti e mancanti. **Prima di dire "non ho quel dato", guarda tutte le chiavi di quello che stai gia' scaricando.** |
| **Analisi su una fotografia non riverificata** | `profilo.js` dava Bolt a potenza 1; era passato a potenza 8 il giorno dopo. Il costo scende da 7.765 a 5.925 monete e il valore per moneta sale da 9,00 a 11,79 | Rigenerare il profilo prima di ogni analisi che ci si appoggia, non fidarsi della data in cima al file. |
| **I gadget di Bolt sono sbagliati alla fonte** | l'API di Brawlify gli attribuisce quattro gadget, due dei quali (Rocket Laces, Rocket Fuel) sono di Brock. BrawlMetrics ha lo stesso errore, quindi viene da monte | I gadget veri di Bolt sono **Oil Change** e **Bouncy Ball**. **Regola: due fonti che sbagliano uguale non sono una conferma, sono la stessa fonte.** |
| **Pessimismo applicato due volte** | schermata dell'utente: un pick primo per base, per matchup e per media (55,6 contro 53,7) mostrato terzo | La quota del caso peggiore stava sia dentro il valore della singola casella vuota sia nella miscela di squadra. Applicata una volta sola. **Regola: se un fattore compare in due punti della catena, cercalo nell'altro prima di aggiungerlo.** |
| **La quota di rischio non scalava con le occasioni rimaste** | veniva usata identica con tre caselle avversarie libere e con una sola | `1-(1-Q)^(k/3)`: un avversario con una scelta ha una occasione di trovare la risposta, non tre. |
| **Percentuale mostrata e numero usato erano cose diverse** | «vs Nita 78%» accanto a un punteggio che usa lo scarto centrato: la lista sembrava sbagliata a chi la leggeva | Il riquadrino porta due numeri (`vs Nita 78% +5`) e il colore segue lo scarto. **Se il punteggio usa una trasformazione del numero, mostra la trasformazione, non solo il numero.** |
| **Doppio conteggio della forza generale** | il favore per brawler, aggiunto al modello, faceva prendere a un solo nome il 21% delle posizioni e i primi sei erano i sei col favore piu' alto | Il vantaggio che entra nel punteggio e' **centrato sul candidato**: la sua forza generale e' gia' nella win rate di mappa, che e' la base. Quello dell'avversario resta. **Regola: prima di sommare un termine, chiedi se e' gia' dentro la base.** |
| **Il caso peggiore calcolato, mostrato e ignorato** | 50 su 132 posizioni: il primo consigliato aveva il pavimento sotto il 50%, 13 sotto il 45% | Il punteggio e' una miscela dichiarata di media e pavimento, con la quota al ginocchio della curva misurata. **Un numero che calcoli e mostri ma non usi e' un numero che non hai.** |
| **Il pavimento scelto per win rate assoluto** invece che per vantaggio peggiore | il pavimento e' `base + vantaggio`, quindi lo determina il vantaggio: su Wendy contro Bull+Rosa veniva 59% invece di 48% | Si sceglie la minaccia col vantaggio peggiore. Undici punti di ottimismo, sul pick che l'utente aveva segnalato. |
| **`CLASS_EDGE` era in gran parte un effetto per brawler travestito** | stimando le due cose insieme fuori campione, il peso della classe crolla da 0,75 a 0,19 e la varianza spiegata passa dal 19,8% al 53,9% | Aggiunto il favore per brawler (validato split-half: correlazione 0,91 fra due meta'). **Un raggruppamento che sembra spiegare puo' stare assorbendo un effetto piu' fine.** |
| **"Il reset non resetta"** — e invece resettava | otto scenari in browser vero: `resetDraft` azzerava sempre. Misurato il tasto: **60×30px a 15px dal bordo alto**, contro i 44px minimi, nell'angolo dove i visualizzatori mettono la loro barra | Bersaglio a 84×46px, staccato dal bordo, `touch-action: manipulation`, barra promossa a livello suo; e una conferma visibile ("Azzerato"), perché su un draft vuoto "non ha fatto niente" e "non ha sentito" erano indistinguibili. **Regola: quando una cosa "non funziona", misura prima il bersaglio del dito, poi il codice.** |
| **Angelo** citato nei consigli mappa ma assente dal roster | script di coerenza nomi | Aggiunto (Marksman). |
| **Sirius** assente dal roster | compariva nelle tabelle Ranked ma non fra i brawler | Aggiunto. |
| **Sirius** classificato Damage Dealer | confronto classi con l'elenco completo di BrawlMetrics | È **Controller**. |
| **Penny** classificata Controller | stesso confronto | È **Artillery** (tre fonti concordi). |
| **Vince e Cosmo** esclusi come "non ancora usciti" | API Brawlify: `released: true` | Erano già nel gioco. Gli articoli di agosto sbagliavano la previsione: **il dato di gioco batte la previsione giornalistica**. |
| 7 mappe marcate "non verificate" | campo `disabled` dell'API mappe | Center Stage, Layer Cake, Safe Zone, Bridge Too Far, Pit Stop sono **attive**: è BrawlMetrics che non ha la pagina, perché segue la rotazione trofei e quelle mappe non ci passano. |
| Ban ordinati per sola forza | test su Super Beach | Rosa vince l'80,7% ma è scelta globalmente dallo 0,14%: pesare una win rate **di mappa** con una use rate **globale** mescola due popolazioni. Il peso della popolarità ora scala con la specificità della fonte. |
| Mappa e modalità sommate | rilettura del punteggio | Doppio conteggio: la mappa è un sottoinsieme della modalità. |
| Punteggi con rumore in virgola mobile (`+1.7600000000000002`) | test in browser | Arrotondamento. |
| Cache dei ranking non invalidata incollando dati propri | test in browser | Un unico setter che invalida. |
| Un brawler valutato come minaccia **contro se stesso** | screenshot dell'utente: "Wendy — peggio: Wendy 48%" | In Classificata non può stare in entrambe le squadre: escluso dalla propria lista minacce. |
| Bonus composizione applicato a **squadra vuota** | dubbio dell'utente su Parallel Plays: l'app dava Damian e Trunk al 70% mentre la fonte diceva 67,5 e 68,4 | Al primo pick "manca la frontline" è vero per definizione: dava +2 a ogni Tank e Controller, spingendoli sopra il dato misurato. Ora i bonus scattano solo da un pick in poi. |
| Ordine della lista **non monotono** nel numero mostrato | stesso screenshot: 68, 69, 70, 70, 67, 66… | Ordinava per una miscela di media e caso peggiore: la lista sembrava casuale e non era più confrontabile con la fonte. Ora si ordina per il numero mostrato; il rischio resta visibile nel riquadrino, che cambia colore quando il divario è grande. |
| Etichetta "trappola" su un pick **consigliato in cima** | stesso screenshot (Trunk) | L'etichetta parla del meta generale, il consiglio della mappa. Se il dato specifico dice che è forte lì, l'etichetta tace invece di contraddire il consiglio a fianco. |

## Regola generale che ne esce

Quasi tutti sono stati trovati da **uno script che confronta i nomi fra loro** o da un **test in browser vero**, non rileggendo il codice. Vale la pena rifarli a ogni aggiornamento.

## Gli errori del 6/9 sera, tutti dello stesso tipo

Tre errori, una causa sola: **stavo leggendo la sezione trofei del gioco e credevo fosse la Classificata.**

| Errore | Come è emerso | Correzione |
|---|---|---|
| **L'elenco mappe era la rotazione trofei, non il pool Classificata** | il pool ranked di brawlplanet elenca 33 mappe attive e 13 archiviate; confrontandolo con il nostro | C'erano dentro mappe che in Classificata non escono mai (Super Beach, Sunny Soccer, Konnakol, Jedna, Hot Tubs, Photic Doom, Open Space, On A Roll, Tasty Berry, Backyard Bowl, Grass Knot) e ne mancavano che invece ci sono (Ring of Fire, Lilygear Lake, Flooded Mine, Deathcap Trap). Ora la lista è il pool ranked. |
| **Una mappa cancellata sulla fede di un articolo** | vedi sopra, Ring of Fire | C'era un'API che rispondeva e diceva il contrario. **Un articolo del 2021 non batte un'API che risponde oggi.** |
| **Le 7 mappe "404, dati non verificate" non erano un buco del dato** | avevano tutte una pagina su brawlplanet con ~1,9M di partite | Erano mappe **solo ranked** cercate nella sezione trofei. Il buco era nella ricerca, non nel dato. Ora hanno tutte win rate reali per tutti e 106 i brawler. |

### E uno che ho commesso analizzando

Avevo confrontato brawlmetrics (Classificata) con brawlplanet **scheda trofei**, e concluso: "concordano su chi è forte ma su scale diverse, quindi userò brawlplanet solo come lista di nomi". Confronto sbagliato, conclusione sbagliata. Con la scheda giusta i top 10 coincidono per 2-3 nomi su 10: **non è una differenza di scala, sono due misure diverse.** Da qui `script/fetch-brawlplanet-ranked.js`, che sceglie la scheda dal codice invece di lasciarlo al mio occhio.

### Errori più piccoli dello stesso giro

| Errore | Come è emerso | Correzione |
|---|---|---|
| Una nota di mappa continuava a dire "dati di fine luglio" con dati di oggi | test in browser su Flaring Phoenix | Le note in prosa ripetevano campione e data, che l'app **stampa già da sé** leggendoli dai dati. La prosa è la copia che resta indietro e mente. Ora il generatore tiene solo la descrizione del terreno. |
| Due note affermavano win rate contraddette dai nuovi dati ("Gus qui è fuori scala (78,4%)" — è 47,4%) | controllo automatico delle percentuali nelle note | Stesso rimedio. |
| Pick rate con code infinite a schermo (`6.783333333333334%`) | test in browser | La divisione per 6 (per portare la pick rate di mappa sulla scala di `USE_RATES`) va arrotondata alla fonte, non a schermo. |

**Il solito:** tutti e tre trovati dal test in browser o da uno script di controllo. **Nessuno rileggendo il codice.**

## Il controllo che causava il problema che doveva impedire (7/9)

| Errore | Come è emerso | Correzione |
|---|---|---|
| Il controllo "il tag del giocatore non finisce nel file pubblicato" conteneva **il tag scritto in chiaro**, dentro uno script di un repository **pubblico** | verifica dopo il merge su main: `git grep` del tag | Il controllo cerca ora la **forma** di un tag (`#[0289PYLQGRJCUV]{4,12}`), non un tag preciso. |
| La prima versione della forma si fermava a 9 caratteri e **lasciava passare proprio il tag da proteggere** (ne ha 10) | provato di proposito aggiungendo il tag al file e verificando che scattasse | Portata a 12. |

**La lezione, che vale oltre questo caso:** una regola scritta per proteggere un segreto non deve contenere il segreto. E un controllo di sicurezza va **provato facendolo fallire** — scritto e mai messo alla prova, questo passava senza accorgersi di niente.

## L'errore più silenzioso di tutti (7/9)

| Errore | Come è emerso | Correzione |
|---|---|---|
| `CLAUDE.md` rimandava a `context/azienda.md`, `context/persone.md`, `context/obiettivi.md`, `context/tool.md`, `context/regime-fiscale.md`: **quella cartella non esisteva** e i file stavano nella radice | controllando la memoria dopo il merge, non lavorando | File spostati dove l'indice li cerca. Scritto `script/check-memoria.js` che verifica che ogni file citato in `CLAUDE.md` esista davvero. |

**Perché è il peggiore:** non dà nessun sintomo. Ogni volta che serviva sapere
qualcosa sull'azienda o sulle persone, la ricerca non trovava niente e la
risposta onesta era "non lo so" — con il dato a due passi. Un indice che punta
nel vuoto è peggio di un indice assente, perché fa sembrare che il dato non
esista. Nessuna rilettura del codice lo avrebbe trovato: è saltato fuori solo
andandolo a cercare apposta.

## La win rate di un pick raro non è la tua win rate (8/9)

| Errore | Come è emerso | Correzione |
|---|---|---|
| L'app consigliava **Wendy prima su 13 mappe su 33** (nei primi tre su 29), e l'utente perdeva trofei seguendola | segnalazione dell'utente dopo partite vere, poi misurata | La win rate viene tirata verso il 50% in proporzione a quanto poco quel brawler viene scelto. Wendy: prima su nessuna mappa, ricompare solo come risposta mirata. |
| I counter erano di fatto ignorati | misurato: la mappa spaziava **31 punti**, un counter ne sposta **3,9**, mediati su più avversari | La correzione riduce lo spread mappa da 23 a 14, quindi il matchup passa da ~1/6 a ~1/3 del margine. |

**Le tre misure che hanno inchiodato il problema**, tutte sui dati già in casa:
1. chi ha la rarità di Wendy (0,3-1% di scelte) vince in media **45,8%**; lei **61,8%** — sedici punti sopra i suoi pari;
2. i dati **non** premiano i rari in generale: si sale dal 42,3% della fascia più rara al 51,8% della più giocata. Wendy è l'eccezione;
3. **la prova decisiva**: un brawler forte *su certe mappe* varia fra modalità (Bolt 5,15 di scarto). Wendy vince ~62% ovunque, scarto 2,88, **sotto** la media di 3,61. Il numero non segue la mappa, segue chi la usa.

**Il parametro è stato calibrato misurando**, non a occhio: con p0=2 la correlazione fra punteggio e popolarità *scende* da 0,40 a 0,14 — cioè la correzione toglie un difetto invece di aggiungerne uno — e resta 0,81 col dato grezzo.

**Asimmetria voluta:** nella fase ban la win rate resta grezza. «Quanto renderebbe a me» va corretto; «quanto fa paura se lo prende l'avversario» no, perché se lo prende è probabilmente proprio uno che lo gioca.
