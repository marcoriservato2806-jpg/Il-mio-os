# Fonti Brawl Stars — cosa funziona e cosa no

Aggiornato: 6 settembre 2026. Vedi anche [[metodo-counter]], [[app-draft-classificata]], [[errori-trovati]].

## Quelle che funzionano

| Fonte | Cosa dà | Note |
|---|---|---|
| **api.brawlapi.com** | roster con campo `released`, mappe con campo `disabled` | **API pubblica ufficiale di Brawlify.** Niente chiave, niente limiti, CORS aperto. Il *sito* brawlify.com blocca lo scraping, l'API no: è la porta d'ingresso prevista. Le letture arrivano troncate (dice "50 brawler" quando sono 108), quindi non fidarsi dei conteggi — i singoli campi letti sì. |
| **brawlmetrics.gg** | tier list Ranked per fascia di rango, per modalità, per mappa, e pagina per brawler | Fonte numerica principale. `/tier-list/ranked`, `/tier-list/ranked/masters`, `/tier-list/<modalità>`, `/maps/<modalità>/<mappa>`, `/brawlers/<nome>`. Le pagine mappa danno anche **campione e data**, che servono a pesare l'affidabilità. |
| dexerto.com, pockettactics.com, brawlvision.com | tier list e classi | Utili come riscontro incrociato indipendente, senza numeri fini. |

## Quelle bloccate (403/402/429)

brawlify.com (il sito), noff.gg, brawltime.ninja, topbrawl.com, brawlytix.com, brawlhq.com, wiki Fandom, brawlstats.net.

**Non aggirarle fingendosi un browser.** Dove esiste un'API pubblica (Brawlify) si usa quella; altrove si cerca un'altra fonte.

## Scartate per qualità

- **brawl.tube**: tier list di aprile 2026 con brawler inesistenti ("Anita", "Macy", "BB"). Da non usare.
- **brawlio.app/counters**: counter senza numeri, con terne identiche per brawler di classi diverse. Rumore travestito da dato.
- **brawlcalculator.com**: 3+3 counter per brawler, senza numeri, da luglio, basati sul parere di un singolo giocatore (SpenLC) — e contraddicono la statistica.

## Il tetto strutturale

**Nessuna fonte pubblica la matrice completa dei matchup.** Tutte si fermano ai 3 migliori e 3 peggiori per brawler. Non è pigrizia di chi cerca: è un limite del dato disponibile. La risposta è modellare il resto — vedi [[metodo-counter]].
