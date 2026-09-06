# Assistente Draft — Brawl Stars Classificata

App statica (HTML/CSS/JS puro, nessuna build) per gestire il pick & ban
durante una partita di Classificata e ricevere suggerimenti sul prossimo
pick in base alle classi già scelte.

## Come usarla

Apri `index.html` in un browser (doppio click, o un server statico
qualsiasi). Nessuna installazione richiesta.

1. Imposta **ban per squadra** e **ordine dei pick** in base al tuo rank
   attuale (sotto Diamante non ci sono ban; da Diamante in su ogni
   giocatore ne banna uno — regola i numeri di conseguenza) e premi
   "Applica e ricomincia".
2. Clicca sui brawler nel roster per bannarli/sceglierli, seguendo il
   turno indicato in alto.
3. Durante le fasi di pick, il pannello a destra suggerisce le scelte
   migliori in base alla classe degli avversari già scesi in campo.

## Limiti noti (importante)

- **Roster: 106 brawler su 108.** Mancano solo Vince (release ottobre
  2026, non ancora uscito) e Cosmo (annunciato per settembre 2026,
  disponibilità in Classificata non confermata) — esclusi apposta finché
  non verificati. Aggiornato il 6/9 con accesso web diretto (non più
  bloccato come nella sessione precedente): corretti due buchi reali
  (Angelo e Sirius comparivano nei dati ma mancavano dal roster).
  `brawlify.com`, `noff.gg` e `brawltime.ninja` restano bloccati al
  fetch diretto (403, anti-bot loro) — se un giorno si aprono, sono le
  fonti da controllare per primo per un terzo riscontro numerico.
- **I suggerimenti combinano due cose**: un'euristica di classe (chi
  batte chi in generale — non cambia mai) più i win rate reali su
  Classificata di `DEFAULT_META_SCORES`/`DEFAULT_META_SCORES_MASTERS`
  (106 brawler, letti da BrawlMetrics il 6/9/2026 e incrociati con
  Dexerto sulla top-5: Wendy, Shade, Gus, Amber, Nori). Non tengono
  conto di gadget/star power specifici né della mappa esatta oltre a
  `bestPicks`/tratti.
- **Ladder vs competitivo**: la fonte distingue "tutti i ranghi" da
  "solo Masters" perché la meta cambia parecchio con lo scaglione (es.
  El Primo rende molto di più con squadra coordinata ad alto livello).
  Scegli la fascia giusta dal menu "Dati meta" nell'app invece di
  fidarti di un numero unico per tutti i livelli.
- **Il formato esatto di ban/pick per fascia di rank non è stato
  verificato al 100%**: è per questo che è regolabile a mano invece che
  fisso nel codice.

## Struttura

- `index.html` — markup e layout
- `style.css` — stile
- `data.js` — roster brawler + matrice dei vantaggi di classe (l'unico
  file da toccare per aggiornare i dati)
- `app.js` — logica di stato, sequenza turni, punteggio suggerimenti
