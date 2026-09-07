# Errori trovati nei dati (e come sono saltati fuori)

Vedi anche [[fonti-brawl-stars]], [[app-draft-classificata]].

Elenco tenuto perché ognuno di questi è costato una verifica incrociata: ritrovarli sarebbe uno spreco.

| Errore | Come è emerso | Correzione |
|---|---|---|
| ~~**Ring of Fire** rimossa dal gioco~~ **← era sbagliato, vedi sotto** | 404 sulla pagina mappa + un articolo del 2021 | **Correzione del 6/9 sera: la mappa c'è.** L'API di Brawlify la dà `disabled: false` e sta nel pool ranked di brawlplanet. Rimessa. |
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
