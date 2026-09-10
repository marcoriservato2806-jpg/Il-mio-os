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

## Gli altri draft tool, e il disaccordo sui counter (10/9)

Analizzati sette strumenti. Documento leggibile: artifact «Cosa sanno gli altri draft tool», copia in `brawl-draft/concorrenza.html`.

| Strumento | Modello | Cosa se ne ricava |
|---|---|---|
| **deepdraft.fr** | **codice in chiaro, non minificato** | Il più avanzato: motore NNUE + hash di Zobrist + tabelle di trasposizione in un Web Worker, cioè vera ricerca ad albero. Dati pubblici in `deepdraft.fr/--data/per_map_draft_analytics.json` con `trio_uplift` e `co_occurrence_lift`. Coefficienti: `USERATE_WEIGHT 0.85`, `SYNERGY_COEFFICIENT 0.7`, `COUNTER_COEFFICIENT 1`, `TRIO_COEFFICIENT 0.1`, **`GLOBAL_COUNTER_BONUS 0`** (costruito e spento) |
| **powerleagueprodigy.com** | server (`/api/plprodigy/eval`) | Nel client si legge il payload: **pesi per fascia di rango** (vedi sotto), `isEnemyPerspective`, `minLevel`, `userBrawlers`. **Il loro bundle contiene una `X-API-Key` in chiaro: non usata, non annotata altrove** |
| **metapick-ai.com** | server | Endpoint `simulate_draft` (ricerca sul draft), `predict_winrate` (solo a squadre complete), `stats`. Pesi decisi dall'utente con cursori: `synergy_weight`, `counter_weight`, `ban_penalty_weight`. Le risposte hanno un `type`, fra cui `counter_pick` |
| brawl360, brawldraft.pro, brawltrack, brawlpick | server (REST / tRPC) | Niente di leggibile. Non è un giudizio sulla qualità: non si vede |
| brawlytics.pro | — | **403 alle richieste automatiche, non aggirato** |

### I pesi per rango di PL Prodigy (sommano a 100)

| fascia | counter | win rate | sinergia | ban | fit | popolarità |
|---|---|---|---|---|---|---|
| Diamante e sotto | 32 | 27 | 14 | 9 | 9 | 9 |
| Mythic | 34 | 25 | 13 | 10 | 11 | 7 |
| Leggenda | 36 | 23 | 12 | 12 | 12 | 5 |
| Masters e oltre | 40 | 20 | 10 | 13 | 13 | 4 |

Salendo di rango i counter contano di più e la forza nuda di meno. **Non replicabile qui**: la nostra fonte mette in chiaro che i suoi dati sono «Diamond 1 and above, pooled across every league», perché dividendoli per lega restano troppe poche partite per coppia. Pesi per rango senza dati per rango sarebbero inventati. L'app fa già la stessa cosa per un'altra via: `QUOTA_RISPOSTA` è 0,2 da Mythic in su e 0,15 fino a Diamante.

### IL DISACCORDO, ed è la cosa da ricordare

`script/confronta-fonti-counter.js`. Il `matchup_performance_delta` di Deep Draft contro la nostra matrice, stesse mappe e stesse coppie, **24.558 confronti**:

- correlazione **r = 0,007**; stesso segno sui counter netti **50%**, cioè testa o croce.
- **Non è che il loro sia rotto**: è coerente con sé stesso (delta[A][B] contro delta[B][A] dà r = −0,895) e la sua dispersione è 11,1 punti contro gli 1,3 attesi dal solo campionamento.
- Spiegazione parziale: il loro numero è ancora mescolato alla forza generale (correla 0,28 con la differenza di win rate), il nostro è al netto. E le loro win rate di mappa vanno dal 4% al 96%, cioè pochissime partite su molti brawler.
- Campione: 154k partite per mappa contro 1,9 milioni; copertura dei matchup 8,6% contro 95,8%.

**Non si mescolano.** È esattamente la situazione per cui esiste la regola «mai due fonti dentro lo stesso numero». E vale come cautela sul nostro dato: quando un'app mostra un numero sui counter, quel numero è meno solido di come appare.

### Cosa NON prendere da loro, e perché

- **`trio_uplift` e `co_occurrence_lift`** (Deep Draft): le due idee migliori viste — soprattutto la seconda, che deduce il conflitto di ruolo da quanto la gente sceglie due brawler *insieme*, non dagli esiti. Ma stanno su un campione 13 volte più piccolo e su dati che non concordano coi nostri.
- **Il bonus «matchup positivo contro tutti e tre»**: l'app ce l'ha già in forma migliore (il pavimento, graduato invece che acceso/spento). Loro l'hanno messo a zero.
- **I cursori per i pesi**: scaricano sull'utente una taratura che non si è saputa misurare.

## Quelle bloccate (403/402/429)

brawlify.com (il sito), noff.gg, brawltime.ninja, topbrawl.com, brawlytix.com, brawlhq.com, wiki Fandom, brawlstats.net.

**Non aggirarle fingendosi un browser.** Dove esiste un'API pubblica (Brawlify) si usa quella; altrove si cerca un'altra fonte.

## Scartate per qualità

- **brawl.tube**: tier list di aprile 2026 con brawler inesistenti ("Anita", "Macy", "BB"). Da non usare.
- **brawlio.app/counters**: counter senza numeri, con terne identiche per brawler di classi diverse. Rumore travestito da dato.
- **brawltime.com**: dati freschi ma da 22 a 411 partite per brawler. Troppo poche: è rumore.
- **brawlcalculator.com**: 3+3 counter per brawler, senza numeri, da luglio, basati sul parere di un singolo giocatore (SpenLC) — e contraddicono la statistica.

## Il "tetto strutturale" era mio, non del dato (corretto il 9/9)

Qui c'era scritto: «nessuna fonte pubblica la matrice completa dei matchup, tutte si fermano ai 3 migliori e 3 peggiori per brawler; non è pigrizia di chi cerca, è un limite del dato». **Era falso, e ha fatto smettere di cercare per settimane.** L'utente ha insistito — «questi dati ci sono, altre applicazioni lo fanno, da qualche parte saranno» — e aveva ragione.

**La matrice completa sta qui:**

| Indirizzo | Cosa dà |
|---|---|
| `storage.googleapis.com/brawlanalyzer-public/draft/pairs-<modalità>.json.gz` | **matrice 108×108 per modalità**: `matchup.adv` (vantaggio al netto della forza generale dei due, ×10), `matchup.wr` (win rate vera, ×10), `synergy.adv` e `synergy.wr` (le stesse due cose da COMPAGNI), `calibration`. Modalità: `gemGrab`, `brawlBall`, `bounty`, `heist`, `hotZone`, `knockout`. |
| `storage.googleapis.com/brawlanalyzer-public/pl-results.json.gz` | **tutte le mappe ranked in un file**: `individual` (win rate, pick rate, star rate per brawler), `teams` (i 10 trii più vincenti), campione e data. È lo stesso dato che `fetch-brawlplanet-ranked.js` gratta dall'HTML. |
| `storage.googleapis.com/brawlanalyzer-public/brawlers.json.gz` | il roster come lo usa il loro draft helper |
| `storage.googleapis.com/brawlanalyzer-public/normal-map-index.json` | indice delle mappe trofei (182 attive, tutte le modalità) |

Bucket pubblico, senza chiave, CORS aperto: è quello da cui il loro sito stesso legge nel browser. **La lista degli oggetti (`/storage/v1/b/.../o`) risponde 401**, quindi i nomi dei file non si scoprono elencando — si leggono nel codice della pagina che li scarica.

### Come si è trovato, cioè il metodo da riusare

1. La pagina brawler mostra 5+5. Il pannello ha un selettore «Game mode» → se cambiare modalità non ricarica la pagina, il dato di tutte le modalità è già nel browser.
2. Nel payload della pagina (`self.__next_f.push`) c'erano stringhe di un pannello che sulle pagine non si vede: `weGoFirst`, `turnBan`, `noMatrixForMode`, `banExplainer`, `counterHeading`. Esiste un Draft Helper.
3. Non è nella sitemap. Trovato provando gli indirizzi: **`/powerleague/draft`**.
4. Scaricati i suoi chunk JavaScript e cercate le chiamate di rete: `fetch(\`https://storage.googleapis.com/brawlanalyzer-public/draft/pairs-${e}.json.gz\`)`, con `e` = la modalità.

**La regola generale: una pagina che mostra dieci righe non prova che il dato sia dieci righe.** Se la pagina è interattiva, il dato pieno è già passato dal browser. Si trova guardando *cosa scarica*, non rileggendo l'HTML. Vale per qualsiasi sito, non solo per questo.

### Cosa resta vero

- Le **pagine** dei siti si fermano davvero a 3+3 o 5+5. Non era sbagliato quello: era sbagliato concludere che quindi il dato non esistesse.
- La copertura non è totale: dall'89% al 96% delle 5.778 coppie secondo la modalità. Il resto ha troppe poche partite, e la fonte lo dice mettendo `null` invece di un numero inventato.
- Le win rate per coppia hanno una soglia più alta delle `adv`: dal 60% all'83% delle coppie. Dove c'è la `adv` ma non la `wr`, la percentuale si ricostruisce e **a schermo si dice che è ricostruita**.

### Il controllo che serve, e perché

Il file è codificato in base64 di interi nel triangolo superiore. **Un solo indice sbagliato sposterebbe tutti i vantaggi su coppie sbagliate senza che niente sembri rotto**: i numeri resterebbero plausibili e i consigli diventerebbero silenziosamente spazzatura. Nessuna rilettura del codice lo trova. `script/verifica-matrice.js` riconfronta la matrice decodificata dall'app col file della fonte cella per cella, in entrambi i versi, su tutte e sei le modalità: **277.344 confronti**. Da rifare a ogni aggiornamento.

## Gadget e star power: quello che NON esiste

Cercato il 9/9/2026, non rifarlo da zero.

- **Nessuna fonte raggiungibile pubblica la win rate PER GADGET.** BrawlMetrics
  ha le pagine build (`/brawlers/<slug>`) ma riporta solo la **pick rate** di
  ciascun gadget e star power, non quanto vincono. Verificato su Damian, Meg,
  Surge e altri otto. Brawlio e Brawlvision: solo per brawler. Le uniche fonti
  che sembrano avere una tier list dei gadget (brawltime.ninja, topbrawl,
  brawlytix) sono nella lista dei bloccati, e non si aggirano.
- È lo stesso tetto della matrice dei counter: è del dato, non della ricerca.
- **I nomi e le descrizioni** dei gadget si prendono da
  `api.brawlapi.com/v1/brawlers` (campi `gadgets` e `starPowers`). Attenzione:
  i valori numerici arrivano come segnaposto (`<!card.value1>`), quindi da lì
  si ricava cosa fa un gadget, non quanto.
- **La maggior parte delle pick rate è 51/49 o 52/48**, cioè la comunità è
  spaccata e il dato non dice niente. Solo pochi casi hanno una maggioranza
  vera (8-Bit 58/42, Nita 56/44, Damian/Surge/Griff 55/45).

## Costi in monete: fonti che si contraddicono

- `theriagames.com/guide/brawl-stars-coins/` (pubblicato 12/3/2025) ha la
  tabella completa per livello: totale 1→11 = **3.740 punti potenza e 7.765
  monete**; 9→10 = 890 PP + 1.875 monete; 10→11 = 1.440 PP + 2.800 monete.
- `topuplive.com` (aggiornato 25/3/2026) dà numeri diversi e apparentemente
  con le colonne confuse, ma per gadget/star power/gear dà 1.000 / 2.000 /
  1.000-2.000 monete e hypercharge 5.000.
- **Si contraddicono: non scegliere per conto tuo.** Il gioco mostra il costo
  esatto sul tasto di potenziamento — quello è la fonte vera.
- Negozio: pacchetti di monete da 300 monete per 30 gemme fino a 4.680 monete
  per 360 gemme, cioè fra 10 e 13 monete per gemma.

