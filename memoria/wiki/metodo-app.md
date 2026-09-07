# Il metodo, in breve

Aggiornato: 7 settembre 2026. Il testo completo sta nella skill
`costruire-app` (`.claude/skills/costruire-app/SKILL.md`), che si carica da
sola quando si costruisce qualcosa. Qui c'è solo l'indice di cosa contiene e
perché, per ritrovarlo leggendo la memoria.

Vedi anche [[app-draft-classificata]] (il caso concreto),
[[fonti-brawl-stars]] (le fonti), [[errori-trovati]] (gli errori).

Per **come** si tiene questa memoria e cosa fare quando salta fuori un
errore c'è la skill `memoria-di-lavoro`, e il controllo
`node script/check-memoria.js` che verifica che l'indice non punti nel vuoto,
che nessun collegamento sia morto e che il registro sia in ordine.

## Il filo

**Un'app che sbaglia con sicurezza è peggio di un'app che non risponde.**
Quasi tutte le regole servono a evitare la risposta sicura e sbagliata.

## Le dieci cose

1. **Verifica di star leggendo la cosa giusta** prima di credere al dato. La
   scheda di default può essere quella sbagliata; la lista che hai può
   descrivere un'altra popolazione; un articolo vecchio non batte un'API.
2. **Scegliere fra fonti contraddittorie**, con quattro misure e non a
   intuito: coerenza con la realtà, quanto segnale specifico contiene, una
   somma che deve tornare, e la correlazione che smaschera il bias.
3. **Mai mescolare due fonti nello stesso numero.** Se il codice miscela due
   livelli, quei livelli devono venire dalla stessa fonte — al limite si
   calcola il generale dai dati specifici.
4. **Misurato e stimato restano distinguibili**, e un numero non si inventa.
5. **I vincoli di una pagina pubblicata**: niente rete, niente immagini da
   fuori, e la trappola delle prestazioni quando i dati sono incorporati.
6. **Dati personali e repository pubblici**: controlla prima di scrivere.
7. **Interfacce per chi ha fretta**: misura prima di ottimizzare, ordina per
   probabilità d'uso, e **meno controlli è una funzione** — ogni controllo
   impostabile al contrario produce risposte sicure e sbagliate.
8. **I controlli obbligatori**: quasi tutti i bug veri sono usciti da uno
   script di verifica o da una prova in browser, nessuno dalla rilettura.
9. **Il lavoro meccanico va in uno script.**
10. **Nei commenti il perché**, e mai ripetere in prosa un dato che l'app
    stampa già dai dati: la copia in prosa è quella che resta indietro.
