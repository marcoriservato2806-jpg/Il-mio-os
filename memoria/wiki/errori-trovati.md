# Errori trovati nei dati (e come sono saltati fuori)

Vedi anche [[fonti-brawl-stars]], [[app-draft-classificata]].

Elenco tenuto perché ognuno di questi è costato una verifica incrociata: ritrovarli sarebbe uno spreco.

| Errore | Come è emerso | Correzione |
|---|---|---|
| **Ring of Fire** in elenco come mappa attuale | 404 sulla pagina mappa + ricerca | Rimossa dal gioco nel **gennaio 2021**. Eliminata. |
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
