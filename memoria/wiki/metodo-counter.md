# Metodo: come si ricava un counter vero da dati grezzi

Vedi anche [[fonti-brawl-stars]], [[app-draft-classificata]].

## Il problema

I "forte contro / debole contro" pubblicati sembrano oro e sono quasi inutili presi così: **quasi ogni brawler risulta debole contro Wendy e forte contro Shelly**, perché Wendy è la più forte del gioco e Shelly la più debole. Non è un matchup, è la classifica generale riscritta. Su 17 brawler campionati, "debole contro Wendy" compariva in 15 — perfino per Shelly stessa.

Usarli grezzi significa **contare due volte la forza generale**, facendola sembrare informazione nuova.

## La correzione

Si toglie la parte spiegata dalla sola differenza di forza:

```
atteso(A,B) = 50 + (forzaGenerale(A) − forzaGenerale(B))
residuo     = misurato − atteso
```

Il residuo è il matchup vero.

## La verifica (fondamentale: il modello non va dato per buono)

Su **623 coppie misurate** il residuo medio è **−0,01** con deviazione standard **5,57**. La media sullo zero dimostra che la formula non ha distorsione sistematica; la dispersione dice che i matchup veri valgono tipicamente ±5-6 punti percentuali.

Esempi che mostrano la differenza:
- **Edgar contro Wendy**: 22,6% misurato, 23,0 atteso → residuo −0,4. **Non è un counter**, è solo Wendy forte.
- **Jae-Yong contro Wendy**: 29,5% misurato, 43,0 atteso → residuo −13,5. **Counter vero.**
- **Nita contro Edgar**: 55,4% misurato, 49,9 atteso → +5,5. Nita lo batte davvero pur essendo più debole.

## Coprire le combinazioni non misurabili

623 coppie su 11.556 sono il 5%. Il resto si stima raggruppando i residui misurati per coppia di classi (`CLASS_EDGE`), con due cautele:
1. **Stime dimezzate**: le coppie misurate sono gli *estremi* di ogni brawler, quindi le medie per classe esagerano.
2. **Celle con meno di 5 osservazioni** non usano un numero traballante ma un modello additivo sui margini (`CLASS_MARGIN_ATTACK` / `_DEFEND`).

Risultato: 100% delle combinazioni coperte, con la distinzione fra misurato e stimato **mantenuta visibile** nell'interfaccia.

## Cosa ha smentito l'euristica scritta a mano

La matrice calibrata contraddice il buon senso in punti importanti: davo il Tank favorito contro l'Assassin (+1), i dati dicono **−5,96**. E il risultato più utile: **conta molto più chi affronti che chi sei** — da attaccante le classi stanno tutte entro 1,3 punti; da bersaglio no, l'Artiglieria è preda facile (+6,48) mentre Assassin (−4,04) e Support (−3,66) sono i più duri.

## Il tetto vero, misurato il 9/9: quanto counter è invisibile

Domanda dell'utente: «in base ai pick dell'avversario ci sarà una sorta di vantaggio tecnico di brawler, non è possibile che non riesci a individuarlo». Ha ragione che esiste. Misurato quanto se ne vede.

- Coppie **misurate**: 605 uniche su 5.778 (5,4% delle 11.556 orientate).
- Vantaggio centrato sulle **misurate**: deviazione standard **4,54** punti (fino a ±15).
- Previsione sulle **stimate**: deviazione standard **1,67** punti. Quasi piatta.
- Sulle misurate, classe + favore per brawler spiegano il **53,2%** della varianza fuori campione. Il **46,8%** che resta è specifico della coppia: circa **3,1 punti** di deviazione standard di vantaggio vero, invisibile dove nessuno ha misurato.

Quindi: dove la coppia è misurata l'app **muove il punteggio fino a ±15 punti** e lo fa; dove non lo è offre ±2, e quel ±2 è la quantità *calibrata giusta* — gonfiarlo vorrebbe dire inventare counter. Il tetto è del dato.

### Il tentativo per alzarlo, e perché non ha funzionato

`script/estrai-tratti.js` + `script/calibra-tratti.js`. Nove tratti meccanici estratti con regole di parola chiave dall'etichetta ufficiale di stile di gioco di `api.brawlapi.com` (`class.name`, una per brawler: per Piper «Poke From Range And Escape With A Super») — lontano, addosso, muri, spazio, squadra, regge, cespugli, scoppio, blocca. 95 brawler su 108 ne prendono almeno uno; in 398 delle 605 coppie misurate almeno un tratto distingue i due. Poi 36 coefficienti di interazione antisimmetrici (`ha_s(io)·ha_t(lui) − ha_s(lui)·ha_t(io)`), ridge, validazione a 10 pieghe con favore, celle di classe e coefficienti ricalcolati solo sull'allenamento.

**Esito: dal 53,2% al 53,4%.** Due decimi, cioè niente. I coefficienti più grandi stanno sotto mezzo punto (il massimo: +0,33 per «io occupo spazio contro chi blocca»).

**Perché.** Il favore per brawler assorbe già quasi tutto quello che una descrizione a grana grossa può dire — è lo stesso meccanismo per cui il peso di `CLASS_EDGE` era crollato da 0,75 a 0,2 quando il favore è entrato. Ciò che resta è specifico della coppia: Shelly contro Frank, non «corto raggio contro chi regge».

**Non rifarlo con altre parole chiave.** Il collo di bottiglia non è l'estrazione: nove tratti binari non possono contenere l'informazione di 5.778 coppie. L'unica cosa che alzerebbe davvero il tetto è **più coppie misurate**, e nessuna fonte le pubblica — vedi [[fonti-brawl-stars]].
