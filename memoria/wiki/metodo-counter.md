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
