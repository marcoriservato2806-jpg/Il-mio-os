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

## Regola generale che ne esce

Quasi tutti sono stati trovati da **uno script che confronta i nomi fra loro** o da un **test in browser vero**, non rileggendo il codice. Vale la pena rifarli a ogni aggiornamento.
