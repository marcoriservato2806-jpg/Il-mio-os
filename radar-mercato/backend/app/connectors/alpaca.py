"""Prezzo/volume giornaliero da Alpaca, feed IEX gratuito.

Serve una API key gratuita (piano "Basic" / paper trading) da alpaca.markets.
Documentazione: https://docs.alpaca.markets/reference/stockbars
"""

from datetime import datetime, timedelta

import httpx

from ..config import get_settings

BASE_URL = "https://data.alpaca.markets/v2/stocks/bars"


class AlpacaNotConfigured(RuntimeError):
    pass


def fetch_daily_bars(symbols: list[str], lookback_days: int = 90) -> dict[str, list[dict]]:
    """Ritorna {ticker: [ {date, open, high, low, close, volume}, ... ]} ordinate per data.

    Usa il feed IEX (gratuito): volume parziale rispetto al consolidato, ma sufficiente
    per calcolare z-score di volume/prezzo nella fase di test.
    """
    settings = get_settings()
    if not settings.alpaca_api_key_id or not settings.alpaca_api_secret_key:
        raise AlpacaNotConfigured(
            "ALPACA_API_KEY_ID / ALPACA_API_SECRET_KEY mancanti nel .env "
            "(registrazione gratuita su https://alpaca.markets)"
        )

    end = datetime.utcnow().date()
    start = end - timedelta(days=lookback_days)
    headers = {
        "APCA-API-KEY-ID": settings.alpaca_api_key_id,
        "APCA-API-SECRET-KEY": settings.alpaca_api_secret_key,
    }
    out: dict[str, list[dict]] = {s: [] for s in symbols}

    with httpx.Client(timeout=20.0) as client:
        params = {
            "symbols": ",".join(symbols),
            "timeframe": "1Day",
            "start": start.isoformat(),
            "end": end.isoformat(),
            "feed": "iex",
            "limit": 10000,
            "adjustment": "raw",
        }
        page_token = None
        while True:
            if page_token:
                params["page_token"] = page_token
            resp = client.get(BASE_URL, headers=headers, params=params)
            resp.raise_for_status()
            payload = resp.json()
            for ticker, bars in (payload.get("bars") or {}).items():
                for bar in bars:
                    out.setdefault(ticker, []).append(
                        {
                            "date": bar["t"][:10],
                            "open": bar["o"],
                            "high": bar["h"],
                            "low": bar["l"],
                            "close": bar["c"],
                            "volume": bar["v"],
                        }
                    )
            page_token = payload.get("next_page_token")
            if not page_token:
                break
    return out
