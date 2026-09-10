# Come ragionano i draft engine migliori

Ricerca del 10 settembre 2026, su richiesta («copia il sistema di pick dei migliori siti, ogni tassello»). Il documento leggibile è l'artifact **Anatomia di un draft engine**, con copia in `brawl-draft/anatomia-draft.html`. Qui c'è quello che serve al lavoro. Vedi anche [[metodo-counter]], [[fonti-brawl-stars]], [[app-draft-classificata]].

## Il pezzo più prezioso non era un articolo: era il codice

Il draft helper di brawlplanet (`/powerleague/draft`) è client-side, quindi il suo modello sta nei suoi chunk JavaScript. Letto:

**Punteggio per candidato**
```
punteggio = (win rate di mappa − 50)
          + media dei vantaggi di matchup contro i nemici GIÀ IN CAMPO
          + media delle sinergie con i compagni GIÀ IN CAMPO
```

**Probabilità del tabellone** (questa è la parte che mancava all'app)
```
S = Σ vantaggio_matchup[mio][loro]  su tutte e nove le coppie
  + Σ sinergie dentro la mia squadra  −  Σ sinergie dentro la loro
  + Σ (win rate di mappa − 50) dei miei  −  la stessa cosa per i loro
p = 1 / (1 + e^−(intercetta + pendenza · S))
```
Intercetta e pendenza stanno nel file `pairs-<modalità>.json.gz` sotto `calibration`, **insieme al Brier e al numero di partite su cui è misurato**. Ora sono in `matrice.js` e in `probabilitaTabellone()`.

Cosa il loro modello NON fa: nessuna correzione per rarità (win rate di mappa grezza), nessun termine per la forza dell'avversario in campo, niente caselle vuote, niente caso peggiore, nessun filtro sulla potenza dei brawler che possiedi.

## Il tetto, che è la cosa più importante di tutta la ricerca

| Cosa | Numero |
|---|---|
| Draft di Brawl Stars, composizione da sola | AUC 0,625 su 1.059.778 partite ranked |
| brawlplanet, probabilità del tabellone | Brier 0,225–0,237 su 8.000–12.800 partite |
| Miglior modello di draft per LoL (rete neurale) | accuratezza 55,88%, Brier 0,2449 su 32.750 |
| Un modello «a coppie» sullo stesso test | accuratezza 54,66%, Brier 0,2469 |
| Chi tira a indovinare | Brier 0,25 |

**Due millesimi di Brier fra la rete neurale e il modello a coppie.** Il tetto è basso per tutti, e la differenza fra un buon modello e un modello ottimo è minuscola rispetto alla differenza fra un modello e nessun modello. Da ricordare prima di promettere qualsiasi cosa: il suo effetto tilt (74% dopo una vittoria, 49% dopo una sconfitta) è più grande di tutto il draft.

## Il cieco strutturale dei modelli a coppie

Il confronto LoLDraftAI/DraftGap è la fonte migliore su questo: DraftGap dava **64,88%** a una squadra tutta dello stesso tipo di danno, che il modello vero valuta **40,2%**. Ventiquattro punti su un difetto che non sta in nessuna coppia ma nella squadra intera.

**Conseguenza per l'app, ed è la correzione di un mio errore:** avevo tolto la penalità per classi ripetute perché era arrivata la sinergia misurata, applicando «specifico batte generico». Sbagliato — anche la sinergia misurata è una somma di coppie. La penalità va **sommata**, non sostituita. Misurata sui 320 trii vincenti di 34 mappe (`script/misura-composizione-trii.js`): monoclasse 1,56% osservato contro 4,30% atteso a caso (z = −2,41), tutte tre diverse 64,4% contro 50,5%. Tutti e cinque i trii monoclasse vincenti stanno in Heist e Hot Zone, quindi la penalità resta spenta da `classeRendeQui`.

## Il ragionamento a più mosse: provato e SCARTATO

La ricerca (`The Art of Drafting`, arXiv 1806.10130) dà +5–8% alla ricerca ad albero contro la scelta greedy, e le guide dei giocatori dicono la stessa cosa a parole (all'ultimo pick lo specialista è sicuro perché nessuno può counterare il tuo counter).

Implementato in `script/misura-lookahead.js` e misurato:

- cambia il pick in **20/132** posizioni, e dove cambia guadagna **+2,79 punti** — **se** l'avversario risponde sempre al meglio;
- contro un avversario che prende il brawler più giocato sulla mappa, cioè quello che fa la gente: **−0,03 punti**. Il guadagno svanisce.

**Stava sfruttando la propria ipotesi.** Non è nell'app. Il controllo che l'ha smascherato — rivalutare con un modello dell'avversario diverso da quello che l'ottimizzatore assume — vale in generale ogni volta che si ottimizza contro una controparte simulata.

## Il confronto che conta, con un giudice non mio

132 posizioni di draft, ogni scelta valutata dalla probabilità calibrata della fonte (l'unica funzione tarata su esiti veri), lasciando giocare il resto del draft:

| Modello dell'avversario | app | greedy | lookahead |
|---|---|---|---|
| risponde sempre al meglio | **48,15%** | 46,78% | 47,20% |
| prende il più giocato | **57,95%** | 56,09% | 56,07% |

L'app vince sotto entrambi i modelli, **giudicata dalla funzione della fonte** — e la funzione della fonte usa la win rate grezza, quindi se mai favorisce il greedy. Il margine viene da: correzione per rarità, forza dell'avversario in campo, caselle vuote, caso peggiore, filtro di potenza.

Da rifare quando si cambia il punteggio: `node script/misura-lookahead.js 11 18`. Se l'app scende sotto il greedy, il cambiamento ha rotto qualcosa.

## Fuori portata, e va detto invece di aggirarlo

- **Gli esiti con i pick avversari.** Il registro del tracker dà mappa, brawler ed esito, non i nemici. Senza quelli il peso del caso peggiore resta un'assunzione dichiarata.
- **I dati sui ban.** Non li ha nessuno, e la fonte lo scrive: «nobody has real ban data». Un ban non lascia traccia nel risultato.
- **Il best-of-3** da Diamante I in su (fonte Supercell). La ricerca ha un lavoro sul best-of-N, ma le regole di cosa resta disponibile fra una partita e l'altra non sono verificate: non si inventano.
- **Il «blind pick sotto Mythic»**: tre siti di guide lo affermano, il supporto Supercell **non lo conferma** (descrive una fase a turni con pulsante «Suggerisci»). Fra un sito di guide e la fonte primaria vince la primaria: non è stato cambiato niente. Da chiudere con un'osservazione diretta a quei ranghi.

## Fonti, e quanto valgono

| Fonte | Che tipo di fonte è |
|---|---|
| brawlplanet `/powerleague/draft` | **primaria per il modello**: il codice, non la pagina |
| `loldraftai.com/blog/draftgap-vs-loldraftai-comparison` | confronto misurato, stesso gioco, 32.750 partite di test |
| arXiv 1806.10130, 2012.10171 | ricerca con metodo e numeri |
| arXiv 2204.12750 (DraftRec, personalizzazione) | **PDF non estraibile: citato, numeri non letti** |
| `brawldraft.com/guide` | sito di guide. Utile per la logica per sedia e per l'AUC 0,625; non primaria |
| `support.supercell.com` | **primaria per il formato**: ban da Diamante I, best-of-3, da 3 a 6 ban |
