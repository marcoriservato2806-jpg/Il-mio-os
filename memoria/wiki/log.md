Cosa è stato fatto e quando. Voce nuova sempre in cima, formato `## [AAAA-MM-GG HH:MM] tipo | cosa è stato fatto`.

## [2026-09-06 13:45] app | Una sola classifica invece di due, e bug del brawler contro se stesso
Media e caso peggiore erano in due tabelle separate che si ordinavano diversamente: l'utente non sapeva quale seguire, ed era una domanda legittima. Ora stanno nella stessa riga e l'ordine tiene conto di entrambi. Corretto anche un bug per cui un brawler veniva valutato come minaccia contro se stesso ("Wendy — peggio: Wendy 48%").

## [2026-09-06 13:10] app | Pulsante per saltare i ban in qualsiasi momento
In partita la fase ban dura una ventina di secondi e non si fa in tempo a inserirne sei. Il salto accorcia la sequenza ai ban effettivamente inseriti invece di spostare solo l'indice: senza questo, "annulla" tornava su caselle mai riempite e cancellava il ban sbagliato.

## [2026-09-06 12:40] app | Punteggio riscritto in percentuali di vittoria, analisi adattata all'ordine 1-2-2-1, memoria wiki creata
Il punteggio era in punti astratti e non si capiva: ora è una percentuale di vittorie stimata. Aggiunto il rischio residuo (esposizione a ciò che l'avversario può ancora prendere), perché con l'ordine 1-2-2-1 solo l'ultimo pick vede tre avversari. Corretto un bug per cui i brawler senza dati risultavano i più solidi.

## [2026-09-06 11:30] dati | Counter misurati su 104 brawler, modello esteso a tutte le 11.556 combinazioni
623 coppie misurate una per una, normalizzate per differenza di forza (residuo medio −0,01: modello senza distorsione). Matrice per classe calibrata sui dati al posto dell'euristica scritta a mano.

## [2026-09-06 10:15] dati | Win rate per mappa da quasi 16 milioni di partite, ban pesati, trappole e sottovalutati
29 mappe con dati reali, ciascuna con campione e data per pesarne l'affidabilità. Trovato che Ring of Fire era rimossa dal 2021.

## [2026-09-06 09:00] dati | Roster e meta verificati per fascia di rango; corrette due classi sbagliate
Sirius (Controller) e Penny (Artillery). Aggiunti Vince e Cosmo dopo verifica sull'API Brawlify.
