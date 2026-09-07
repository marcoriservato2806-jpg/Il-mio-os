"""Menzioni Reddit da ApeWisdom: gratis, senza API key, nessuna registrazione.

Documentazione: https://apewisdom.io/api/
"""

from datetime import date

import httpx

BASE_URL = "https://apewisdom.io/api/v1.0/filter/all-stocks/page/{page}"


def fetch_trending(max_pages: int = 3) -> dict[str, dict]:
    """Ritorna {ticker: {mentions, mentions_24h_ago, rank, rank_24h_ago}} per i titoli in classifica."""
    today = date.today().isoformat()
    out: dict[str, dict] = {}
    with httpx.Client(timeout=20.0) as client:
        for page in range(1, max_pages + 1):
            resp = client.get(BASE_URL.format(page=page))
            resp.raise_for_status()
            payload = resp.json()
            for row in payload.get("results", []):
                ticker = row["ticker"].upper()
                out[ticker] = {
                    "date": today,
                    "mentions": int(row["mentions"]),
                    "mentions_24h_ago": int(row.get("mentions_24h_ago") or 0),
                    "rank": int(row["rank"]),
                    "rank_24h_ago": int(row.get("rank_24h_ago") or 0),
                }
            if page >= int(payload.get("pages", 1)):
                break
    return out
