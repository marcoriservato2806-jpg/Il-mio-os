Questo file è l'indice. Non contiene il contesto: dice dove sta e quando aprirlo.

## Prima di tutto

Leggi `identity.md`, all'inizio di ogni conversazione. È chi sono, cosa faccio, come parlo e come non voglio che mi si scriva. Vale per qualsiasi cosa scrivi per me o a nome mio.

## Il contesto, quando serve

Non aprirli tutti ogni volta. Apri quello che serve al lavoro che stai facendo.

| File | Aprilo quando |
|---|---|
| `context/azienda.md` | il lavoro riguarda cosa vendo, a chi, o come si chiamano le cose qui dentro |
| `context/persone.md` | compare il nome di qualcuno |
| `context/tool.md` | ti serve sapere dove vive un dato |
| `context/obiettivi.md` | devi stabilire una priorità, o dirmi che una cosa non vale la pena |
| `context/regime-fiscale.md` | si parla di tasse, soglie, scadenze o costi deducibili |

## Chi scrive cosa

Tre cartelle, tre proprietari, e non si scambiano.

- **`context/` la scrivo io.** Tu la applichi, non la inventi. Se ti serve un dato che lì non c'è, chiedimelo invece di dedurlo.
- **`memoria/grezzo/` è roba mia.** Leggila quando serve. Non modificarla, non rinominarla e non cancellarla mai, nemmeno per riordinare.
- **`memoria/wiki/` la scrivi tu.** È quello che hai capito dal grezzo, in pagine corte e collegate fra loro con `[[nome-file]]` (il nome senza `.md`, minuscolo coi trattini: la pagina `rossi-srl.md` si linka `[[rossi-srl]]`). Seguire un link vuol dire aprire quel file: è così che si naviga la memoria. `index.md` dice cosa c'è, `log.md` cosa hai fatto e quando.

## Regole

1. **Se una cosa non la sai, dimmelo.** Non riempire il buco con una supposizione scritta bene. Una risposta sicura e sbagliata mi costa più di un "non lo so".
2. Quando scrivi una pagina in `memoria/wiki/`, aggiorna `index.md` nella stessa passata. Una pagina fuori dall'indice non la ritrova nessuno.
3. Dopo un lavoro non banale, una riga in cima a `memoria/wiki/log.md`: `## [AAAA-MM-GG HH:MM] tipo | cosa hai fatto`. Serve a me per controllarti quando lavori mentre non ci sono, e il formato lo rende leggibile con un `grep`.
4. Se un pezzo di lavoro non ha giudizio dentro (sommare, convertire, rinominare, scaricare), non rifarlo a mano ogni volta: scrivi uno script in `script/` e da lì in poi usa quello.
5. **Bozze sì, invii no.** Non mandare niente a nessuno e non pubblicare niente senza avermelo fatto leggere prima.
6. I numeri si controllano. Se un totale non torna con la somma delle righe, fermati e dimmelo invece di aggiustarlo.
