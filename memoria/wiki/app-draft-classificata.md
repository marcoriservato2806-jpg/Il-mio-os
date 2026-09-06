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

Attenzione: i gestori dei menu devono chiamare `render()`, non solo `renderSuggestions()`, altrimenti pezzi di interfaccia restano indietro e mostrano il falso.

## Trappola di progettazione già incontrata

Ordinando i pick per "peggior matchup" nudo, in cima finivano i brawler **senza dati** (Vince, Cosmo, Bonnie): tutte le loro previsioni stanno vicino al 50%, quindi sembravano i più solidi. **L'ignoranza veniva premiata.** Il caso peggiore va calcolato come win rate *nel contesto* (base sulla mappa + matchup peggiore), non come matchup isolato.
