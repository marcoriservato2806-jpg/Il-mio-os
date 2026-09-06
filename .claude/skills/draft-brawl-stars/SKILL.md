---
name: draft-brawl-stars
description: Aggiorna o modifica l'app Assistente Draft Classificata (Brawl Stars) in brawl-draft/. Usala quando si tratta di aggiornare i dati (win rate, mappe, counter, roster), correggere la logica dei suggerimenti, o ripubblicare l'app. Contiene le fonti che funzionano, il metodo di normalizzazione dei counter e gli errori già trovati, così non vanno riscoperti.
---

# Lavorare sull'app draft Brawl Stars

**Leggi prima `memoria/wiki/app-draft-classificata.md`, `metodo-counter.md`, `fonti-brawl-stars.md` e `errori-trovati.md`.** Contengono il contesto che segue in forma estesa; qui c'è la procedura operativa.

## Regole non negoziabili

1. **Mai inventare un numero.** Fonte irraggiungibile → tieni il dato vecchio e annota nel commento la data del tentativo fallito. Meglio un dato dichiaratamente vecchio che uno inventato.
2. **Misurato e stimato restano distinguibili**, nel codice e a schermo.
3. **Specifico batte generico e non si somma**: mappa > modalità > meta.
4. **Il dato incerto si miscela** in proporzione all'affidabilità, non si scarta né si prende per buono.

## Fonti

Principale: `brawlmetrics.gg` — `/tier-list/ranked`, `/tier-list/ranked/masters`, `/tier-list/<modalità>`, `/maps/<modalità>/<mappa>`, `/brawlers/<slug>`.
Roster e mappe attive: `api.brawlapi.com/v1/brawlers` (campo `released`) e `/v1/maps` (campo `disabled`) — API pubblica, niente chiave. Le letture arrivano troncate: fidati dei singoli campi, non dei conteggi.
Riscontro incrociato: Dexerto, Pocket Tactics, Brawlvision.
Bloccati (non aggirare): brawlify.com come sito, noff.gg, brawltime.ninja, topbrawl, brawlytix, brawlhq, Fandom.
Da scartare: brawl.tube (dati fasulli), brawlio counters e brawlcalculator (senza numeri).

Quando chiedi una tabella, **pretendi che sia completa**: se la risposta sembra troncata, rifai la richiesta insistendo sull'esaustività.

## Il metodo counter, in breve

I "forte/debole contro" grezzi sono la classifica generale travestita. Normalizza:
`atteso(A,B) = 50 + (forzaGenerale(A) − forzaGenerale(B))`, e usa il residuo.
Verifica sempre che il residuo medio sul totale delle coppie sia vicino a zero: se non lo è, il modello ha una distorsione e va corretto prima di usarlo.

## Controlli obbligatori prima di pubblicare

```bash
cd brawl-draft && node -e "new Function(require('fs').readFileSync('data.js','utf8'))()"   # sintassi
```

Poi uno script node al volo che carichi `data.js` e verifichi:
- nessun duplicato in `BRAWLERS`;
- ogni nome usato in `winRates`, `bestPicks`, `MODE_WIN_RATES`, `DEFAULT_META_SCORES`, `USE_RATES`, `MATCHUPS`, `BRAWLER_OVERALL` esiste nel roster;
- ogni mappa con `winRates` ha anche `sample` e `updated`;
- nessuna win rate fuori da 10–95.

**La maggior parte degli errori trovati finora è emersa da questo script o da un test in browser vero, non rileggendo il codice.**

Poi build e prova reale:
```bash
node script/build-brawl-draft.js
cd brawl-draft/dist && python3 -m http.server 8799 &
# Playwright: chromium in /opt/pw-browsers/chromium, NODE_PATH=$(npm root -g)
```
Nel browser: scegli modalità e mappa, verifica che compaiano ban e pick, che "Chi inizia" inverta i turni, e che non ci siano `pageerror`. Avvolgi `dist/app-completa.html` in un wrapper html minimo, perché il file è pensato per essere inserito in una pagina già esistente.

## Pubblicazione

L'app vive su un artifact. Ripubblica sullo **stesso URL** passandolo come `url`, altrimenti ne crei uno nuovo e il link dell'utente resta indietro. Prima di pubblicare fai `action: "read"` sull'URL.

## Cosa NON rifare

- Non ricercare la matrice completa dei matchup: **nessuna fonte la pubblica**, tutte danno 3 migliori e 3 peggiori per brawler. Il tetto è del dato, non della ricerca.
- Non reintrodurre l'euristica di classe scritta a mano: è stata sostituita da `CLASS_EDGE`, calibrata sui dati, che la smentisce in più punti.
- Non ordinare i pick per matchup nudo: premia i brawler senza dati. Usa la win rate nel contesto.
