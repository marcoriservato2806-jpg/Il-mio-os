# Fonti Brawl Stars — cosa funziona e cosa no

Aggiornato: 6 settembre 2026. Vedi anche [[metodo-counter]], [[app-draft-classificata]], [[errori-trovati]].

## Quelle che funzionano

| Fonte | Cosa dà | Note |
|---|---|---|
| **api.brawlapi.com** | roster con campo `released`, mappe con campo `disabled` | **API pubblica ufficiale di Brawlify.** Niente chiave, niente limiti, CORS aperto. Il *sito* brawlify.com blocca lo scraping, l'API no: è la porta d'ingresso prevista. Le letture arrivano troncate (dice "50 brawler" quando sono 108), quindi non fidarsi dei conteggi — i singoli campi letti sì. |
| **brawlplanet.com** | win rate e pick rate di **Classificata** per tutti i 106 brawler su ognuna delle 33 mappe del pool, più l'elenco di quali mappe sono nel pool e quali archiviate | **Fonte principale per mappe e modalità dal 6/9.** `/maps/<nomesenzaspazi>_<modalitasenzaspazi>` (es. `kaboomcanyon_heist`), `/powerleague` per il pool. Aggiornamento orario. **Attenzione: la pagina ha due schede e quella aperta di default è "Trophy ladder", non "Ranked".** Vedi sotto. |
| **brawlmetrics.gg** | tier list Ranked per fascia di rango e pagina per brawler (matchup misurati) | Fonte del meta generale e dei counter. `/tier-list/ranked`, `/tier-list/ranked/masters`, `/brawlers/<nome>`. **Non più usata per le mappe**, vedi sotto. |
| dexerto.com, pockettactics.com, brawlvision.com | tier list e classi | Utili come riscontro incrociato indipendente, senza numeri fini. |

## La trappola delle due schede (costata un giro intero)

Su brawlplanet ogni pagina mappa ha **Trophy ladder** e **Ranked**. Quella aperta di default è trofei. Leggendo la pagina a occhio si prendono i numeri sbagliati — è successo. Il modo giusto è ancorarsi alla didascalia `"Ranked matches on this map, across all leagues"` e leggere la tabella dopo quella: lo fa `script/fetch-brawlplanet-ranked.js`, che esiste apposta perché a mano si sbaglia.

Il confronto fatto con la scheda sbagliata aveva prodotto la conclusione "le due fonti concordano su chi è forte ma su scale diverse". **Era falsa.** Con la scheda giusta i top 10 coincidono solo per 2-3 nomi su 10: non sono due scale, sono due misure diverse.

## Perché le mappe non vengono più da brawlmetrics

Non è un problema di qualità del sito, è che **segue la rotazione trofei**. Conseguenze, tutte verificate:

- le mappe che escono **solo in Classificata** lì non si aggiornano mai (alcune erano ferme al 24 luglio, e rifare il fetch non serviva a niente);
- alcune non hanno proprio una pagina → risultavano "404, dati non verificati" quando invece esistevano benissimo;
- l'elenco mappe che se ne ricava è quello dei trofei, non il pool Classificata.

In più i numeri sono poco specifici. **Misura:** la sovrapposizione fra i top 10 di due mappe della *stessa* modalità meno quella fra modalità *diverse* — cioè quanta informazione sulla mappa c'è davvero nel dato — vale **1,51/10 su brawlmetrics e 3,27/10 su brawlplanet**. E la media dei 5 migliori per mappa stava fra 68% e 79%, con in cima quasi sempre gli stessi brawler rari in *tutte* le modalità.

## Regola: non mescolare mai due fonti nello stesso numero

Due fonti che misurano la stessa cosa danno numeri diversi perché contano popolazioni diverse. Si può usare l'una **o** l'altra, o confrontarle; non si possono mediare, sommare o miscelare. In `app.js` il dato mappa viene *miscelato* con quello di modalità quando la mappa è poco affidabile: per questo `MODE_WIN_RATES` è **calcolato dalle stesse tabelle mappa** (media pesata sul campione) invece di essere scaricato altrove. Stessa scala per costruzione.

## Come si è deciso quale fonte credere

Non a intuito. Quattro controlli:

1. **Coerenza di modalità** — su brawlplanet le mappe Bounty premiano i tiratori lunghi, quelle Brawl Ball i tank. Struttura fisicamente sensata.
2. **Somma delle pick rate** — su ogni mappa i 106 brawler sommano **600%**, cioè esattamente 6 pick per partita. Prova che le tabelle sono complete e non troncate.
3. **Nessuna inflazione dei rari** — la correlazione fra win rate e log(pick rate) è **+0,40**: chi viene scelto di più vince di più (30,9% nella fascia più rara, 51,2% nella più giocata). Il dato *non* premia i brawler poco giocati, che era il sospetto principale.
4. **Nomi** — i 106 nomi coincidono con il roster senza una sola eccezione (mancano solo Vince e Cosmo, troppo recenti per avere statistiche).

**Eccezione nota:** Wendy è prima su 12 mappe su 33 con lo 0,3% di scelte, contro la tendenza generale. Non è rumore (0,3% di ~1,9M sono ~5.700 partite) ed è confermata S tier da Dexerto e BrawlMetrics, che sono indipendenti. Ma quel numero è misurato su chi la gioca abitualmente: l'app lo dice nel suggerimento invece di nasconderlo.

## Quelle bloccate (403/402/429)

brawlify.com (il sito), noff.gg, brawltime.ninja, topbrawl.com, brawlytix.com, brawlhq.com, wiki Fandom, brawlstats.net.

**Non aggirarle fingendosi un browser.** Dove esiste un'API pubblica (Brawlify) si usa quella; altrove si cerca un'altra fonte.

## Scartate per qualità

- **brawl.tube**: tier list di aprile 2026 con brawler inesistenti ("Anita", "Macy", "BB"). Da non usare.
- **brawlio.app/counters**: counter senza numeri, con terne identiche per brawler di classi diverse. Rumore travestito da dato.
- **brawltime.com**: dati freschi ma da 22 a 411 partite per brawler. Troppo poche: è rumore.
- **brawlcalculator.com**: 3+3 counter per brawler, senza numeri, da luglio, basati sul parere di un singolo giocatore (SpenLC) — e contraddicono la statistica.

## Il tetto strutturale

**Nessuna fonte pubblica la matrice completa dei matchup.** Tutte si fermano ai 3 migliori e 3 peggiori per brawler. Non è pigrizia di chi cerca: è un limite del dato disponibile. La risposta è modellare il resto — vedi [[metodo-counter]].
