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

- **Il roster in `data.js` è compilato via ricerche web di settembre
  2026**, non da un fetch diretto a un database ufficiale (bloccato dalla
  rete di questa sessione). Il gioco ha 108 brawler, qui ce ne sono
  circa 104 con classe abbastanza affidabile. Mancano probabilmente le
  uscite più recenti. Controlla su brawlify.com/brawlers e aggiorna
  `data.js` — è un array, una riga per brawler.
- **I suggerimenti sono un'euristica di classe** (chi batte chi in
  generale: Tank/Assassin, Damage Dealer/Tank-Assassin-Marksman, ecc.),
  non una tier-list di meta aggiornata. Non tengono conto di mappa,
  modalità, gadget/star power o win-rate della stagione corrente.
- **Il formato esatto di ban/pick per fascia di rank non è stato
  verificato al 100%**: è per questo che è regolabile a mano invece che
  fisso nel codice.

## Struttura

- `index.html` — markup e layout
- `style.css` — stile
- `data.js` — roster brawler + matrice dei vantaggi di classe (l'unico
  file da toccare per aggiornare i dati)
- `app.js` — logica di stato, sequenza turni, punteggio suggerimenti
