# Mettere online Radar Mercato (gratis, senza terminale)

Serve un posto che tenga acceso il backend (Render, gratis) e uno che serva la
dashboard (Vercel, gratis). Ti registri sui due siti con il tuo account GitHub
— lo stesso dove sta già il codice — e colleghi il repository. Nessun comando
da digitare.

**Prima cosa da sapere**: sul piano gratuito di Render, se nessuno usa l'app per
un po', il server "si addormenta" e il database SQLite si svuota al risveglio.
Non è un problema: si ripopola da solo in circa un minuto, perché ogni fonte
dati viene riscaricata a ogni riavvio. Vuol dire solo che lo storico di alert
già letti si può azzerare ogni tanto, durante queste settimane di test gratuito.

## 1. Backend su Render

1. Vai su [render.com](https://render.com) → **Get Started** → accedi con GitHub.
2. **New** → **Web Service** → scegli il repository (`Il-mio-os` o come l'hai chiamato).
3. Render chiede alcuni campi, riempili così:
   - **Root Directory**: `radar-mercato/backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free
4. Prima di premere "Create", apri **Advanced** → **Environment Variables** e aggiungi:
   - `SEC_EDGAR_USER_AGENT` = `Nome Cognome tuaemail@esempio.it` (obbligatoria, la vuole la SEC)
   - `ALPACA_API_KEY_ID` e `ALPACA_API_SECRET_KEY` = se ti sei registrato gratis su alpaca.markets, altrimenti lasciale vuote
   - `CORS_ORIGIN` = per ora `http://localhost:5173` (la aggiorni al passo 3 qui sotto)
5. **Create Web Service**. Aspetta che finisca (qualche minuto), poi copia l'indirizzo
   che ti dà in alto, tipo `https://radar-mercato-xxxx.onrender.com`.

## 2. Frontend su Vercel

1. Vai su [vercel.com](https://vercel.com) → accedi con GitHub.
2. **Add New** → **Project** → scegli lo stesso repository.
3. Nei campi di configurazione:
   - **Root Directory**: `radar-mercato/frontend`
   - **Framework Preset**: Vite (di solito lo riconosce da solo)
4. Apri **Environment Variables** e aggiungi:
   - `VITE_API_BASE_URL` = l'indirizzo di Render copiato al passo 1.5, es. `https://radar-mercato-xxxx.onrender.com`
5. **Deploy**. In un minuto ti dà il link pubblico, tipo `https://radar-mercato.vercel.app` — **è questo il link dell'app**.

## 3. Un ultimo aggiustamento

Torna su Render → il tuo servizio → **Environment** → modifica `CORS_ORIGIN`
mettendo l'indirizzo Vercel del passo 2.5, così:

```
CORS_ORIGIN=http://localhost:5173,https://radar-mercato.vercel.app
```

Salva: Render si riavvia da solo in automatico. Fatto — il link Vercel è la tua
app, sempre raggiungibile, aggiornata da sola ogni 15 minuti.

## Se qualcosa non va

- **La dashboard si apre ma resta vuota**: il backend su Render si sta ancora
  "svegliando" (può richiedere fino a 50 secondi al primo accesso sul piano
  gratuito). Aspetta e ricarica.
- **Errore di CORS nella console del browser**: l'indirizzo in `CORS_ORIGIN` su
  Render non coincide esattamente con quello di Vercel (controlla `https://` e
  che non ci sia uno `/` finale).
