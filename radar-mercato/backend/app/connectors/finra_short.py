"""Short interest ufficiale FINRA (dato bisettimanale, non real-time), gratis senza API key.

Endpoint e nome dataset verificati a mano (la doc PDF ufficiale di FINRA mostra un esempio
sul dataset OTC, ma per titoli quotati NYSE/Nasdaq come AAPL o TSLA il dataset giusto è
"ConsolidatedShortInterest", trovato per tentativi):
POST https://api.finra.org/data/group/otcmarket/name/ConsolidatedShortInterest

Il filtro per simbolo usa il campo "symbolCode" (non "issueSymbolIdentifier", che appartiene
solo al dataset "EquityShortInterest" per i titoli OTC). L'ordinamento server-side richiede
che tutte le "partition key" (fra cui settlementDate) siano filtrate con EQUAL, quindi per
prendere "gli ultimi N" si filtra per intervallo di date con dateRangeFilters e si ordina
lato client.
"""

from datetime import date, timedelta

import httpx

BASE_URL = "https://api.finra.org/data/group/otcmarket/name/ConsolidatedShortInterest"


def fetch_short_interest(symbol: str, lookback_days: int = 150) -> list[dict]:
    """Ritorna le rilevazioni di short interest negli ultimi `lookback_days`, più recenti prima.

    FINRA pubblica un dato ogni ~15 giorni: 150 giorni bastano per avere storico a sufficienza
    per il grafico e per calcolare la variazione percentuale fra gli ultimi due cicli.
    """
    end = date.today()
    start = end - timedelta(days=lookback_days)
    body = {
        "compareFilters": [
            {"compareType": "EQUAL", "fieldName": "symbolCode", "fieldValue": symbol.upper()}
        ],
        "dateRangeFilters": [
            {"fieldName": "settlementDate", "startDate": start.isoformat(), "endDate": end.isoformat()}
        ],
        "limit": 20,
    }
    with httpx.Client(timeout=20.0) as client:
        resp = client.post(
            BASE_URL,
            json=body,
            headers={"Content-Type": "application/json", "Accept": "application/json"},
        )
        resp.raise_for_status()
        rows = resp.json()

    parsed = [
        {
            "settlement_date": row["settlementDate"],
            "short_interest": float(row["currentShortPositionQuantity"]),
            "avg_daily_volume": float(row.get("averageDailyVolumeQuantity") or 0),
            "days_to_cover": float(row.get("daysToCoverQuantity") or 0),
        }
        for row in rows
    ]
    parsed.sort(key=lambda r: r["settlement_date"], reverse=True)
    return parsed
