Cosa è stato fatto e quando. Voce nuova sempre in cima, formato `## [AAAA-MM-GG HH:MM] tipo | cosa è stato fatto`.

## [2026-09-06 21:20] dati | Mappe rifatte da zero: erano quelle dei trofei, non della Classificata
L'utente ha segnalato mappe ferme a luglio e mappe scoperte. Cercando la fonte giusta è emerso che il problema era a monte: l'elenco mappe era la **rotazione trofei**, non il pool Classificata — con dentro 11 mappe che in Classificata non escono e senza 4 che invece ci sono. Era anche la ragione delle mappe "ferme a luglio" (le mappe solo-ranked lì non si aggiornano mai) e delle 7 "senza dati" (cercate nella sezione sbagliata). Ora: **33 mappe del pool ranked, win rate e pick rate di Classificata per tutti e 106 i brawler, aggiornamento orario alla fonte.** Scelta la fonte con quattro controlli, non a intuito (coerenza di modalità, somma pick rate = 600%, correlazione win/pick +0,40, nomi coincidenti). `MODE_WIN_RATES` ora è calcolato dalle stesse tabelle per non mescolare due scale. Scritti `script/fetch-brawlplanet-ranked.js` e `script/build-map-data.js`: il lavoro è meccanico e si rifà con due comandi. Corretto un errore mio di stamattina: Ring of Fire non era stata rimossa dal gioco, è attiva. Dettagli in [[fonti-brawl-stars]] e [[errori-trovati]].

## [2026-09-06 14:55] app | Tre errori di classifica trovati da un dubbio dell'utente su Parallel Plays
Il bonus composizione scattava a squadra vuota gonfiando Tank e Controller sopra il dato misurato; l'ordine non seguiva il numero mostrato; l'etichetta "trappola" compariva su pick consigliati. Ora la classifica del primo pick combacia riga per riga con la fonte, quindi è verificabile.

## [2026-09-06 14:20] app | Unità coerente in tutte le fasi e riga di contesto sempre visibile
Nella fase ban il numero era ancora un punteggio astratto (12.8) mentre la legenda parlava di percentuali: due unità nella stessa schermata. Ora è sempre una percentuale di vittorie. Aggiunta una riga che mostra modalità, mappa e fascia attive accanto ai risultati, perché scorrendo i menu finiscono fuori schermo. Corretto un bug: quella riga non si aggiornava cambiando mappa, perché i menu chiamavano solo renderSuggestions.

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
