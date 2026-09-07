# Radar Mercato

Fase 1 (MVP gratuito) del sistema di early-warning per movimenti anomali in borsa:
vedi la ricerca che ha preceduto questo codice per il perché delle scelte.

Un punteggio composito 0-100 per ogni titolo seguito, calcolato da regole esplicite
(niente ML ancora) su cinque fonti, tutte gratuite:

| Fonte | Cosa dà | Serve una chiave? |
|---|---|---|
| [Alpaca](https://alpaca.markets) (feed IEX) | prezzo/volume giornaliero | sì, gratuita |
| [SEC EDGAR](https://www.sec.gov/search-filings/edgar-application-programming-interfaces) | Form 4 (insider) e 8-K | no |
| [FINRA](https://www.finra.org/finra-data/browse-catalog/equity-short-interest) | short interest ufficiale (bisettimanale) | no |
| [ApeWisdom](https://apewisdom.io/api/) | menzioni Reddit | no |

Senza la chiave Alpaca il sistema funziona lo stesso: mancano solo le componenti
volume/prezzo del punteggio, il resto (insider, short interest, social) gira comunque.

## Come si avvia

### 1. Backend

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp ../.env.example ../.env   # poi apri .env e metti la tua email in SEC_EDGAR_USER_AGENT
                              # (obbligatoria per SEC EDGAR) e, se ce l'hai, la chiave Alpaca
uvicorn app.main:app --reload --port 8000
```

Al primo avvio crea da solo `radar.db` (SQLite) e parte subito un primo giro di raccolta
dati in background, poi uno ogni `POLL_INTERVAL_MINUTES` (default 15).

Documentazione interattiva delle API: http://localhost:8000/docs

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # va bene il default se il backend gira su localhost:8000
npm run dev
```

Apri http://localhost:5173

## Come si legge il punteggio

Composito = 30% volume anomalo + 15% movimento di prezzo + 20% cluster insider
(Form 4) + 20% short interest in salita + 15% menzioni social in salita.
Sopra 50 = "elevato" (genera un alert), sopra 75 = "critico".
Il dettaglio del calcolo è in `backend/app/scoring/engine.py`, commentato.

## Limiti noti di questa fase (onesti, non nascosti)

- **Form 4 senza il verso della transazione.** Per ora contiamo *quanti* Form 4
  sono stati depositati in una settimana (cluster = segnale), non se erano acquisti
  o vendite: quello richiede di parsare l'XML della singola submission, rimandato
  a una fase 2.
- **Feed prezzi IEX**: volume parziale rispetto al consolidato. Va bene per
  calcolare z-score relativi, non per un'esecuzione reale.
- **Short interest FINRA è bisettimanale**, non real-time: è il dato ufficiale,
  non una stima intraday come quelle vendute dai servizi a pagamento.
- **Niente ancora**: modelli ML, backtest, opzioni flow, dark pool. Sono le fasi
  successive della roadmap nella ricerca iniziale.

## Struttura

```
backend/app/
  connectors/   un modulo per fonte dati, ognuno normalizza in righe DB
  scoring/       il motore di punteggio (regole, fase 1)
  api/           le route FastAPI consumate dal frontend
  models.py      schema SQLite (SQLAlchemy)
  scheduler.py   orchestrazione: ingest da tutte le fonti poi scoring
frontend/src/
  components/    tabella movers, dettaglio titolo, feed alert, watchlist
  lib/api.ts     client tipato verso il backend
```
