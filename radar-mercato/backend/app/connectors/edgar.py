"""SEC EDGAR: mappa ticker -> CIK e filing recenti (Form 4, 8-K), gratis e senza API key.

Richiede solo uno User-Agent con un contatto reale, come da policy SEC:
https://www.sec.gov/os/webmaster-faq#developers

Limite noto (fase 1): l'API submissions restituisce metadati del filing (chi, quando,
che tipo), non il dettaglio della singola transazione del Form 4 (compra/vende, quante
azioni, a che prezzo) - quello richiede di scaricare e parsare l'XML della singola
submission, rimandato a una fase successiva. Per ora il segnale insider è "quanti Form 4
sono stati depositati per questo titolo nell'ultima settimana" (cluster), non il verso.
"""

from datetime import datetime

import httpx

from ..config import get_settings

TICKERS_URL = "https://www.sec.gov/files/company_tickers.json"
SUBMISSIONS_URL = "https://data.sec.gov/submissions/CIK{cik}.json"

_ticker_to_cik_cache: dict[str, str] | None = None


def _headers() -> dict[str, str]:
    return {"User-Agent": get_settings().sec_edgar_user_agent}


def load_ticker_cik_map(client: httpx.Client | None = None) -> dict[str, str]:
    """Scarica (una volta, poi in cache di processo) la mappa ticker -> CIK a 10 cifre."""
    global _ticker_to_cik_cache
    if _ticker_to_cik_cache is not None:
        return _ticker_to_cik_cache

    owns_client = client is None
    client = client or httpx.Client(timeout=20.0)
    try:
        resp = client.get(TICKERS_URL, headers=_headers())
        resp.raise_for_status()
        data = resp.json()
        mapping = {}
        for row in data.values():
            mapping[row["ticker"].upper()] = str(row["cik_str"]).zfill(10)
        _ticker_to_cik_cache = mapping
        return mapping
    finally:
        if owns_client:
            client.close()


def fetch_recent_filings(ticker: str, cik: str, forms: tuple[str, ...] = ("4", "8-K")) -> list[dict]:
    """Ritorna i filing recenti (Form 4 e 8-K di default) per un CIK già noto."""
    with httpx.Client(timeout=20.0) as client:
        resp = client.get(SUBMISSIONS_URL.format(cik=cik), headers=_headers())
        resp.raise_for_status()
        payload = resp.json()

    recent = payload.get("filings", {}).get("recent", {})
    out: list[dict] = []
    n = len(recent.get("accessionNumber", []))
    for i in range(n):
        form = recent["form"][i]
        if form not in forms:
            continue
        accession = recent["accessionNumber"][i]
        accession_nodash = accession.replace("-", "")
        primary_doc = recent["primaryDocument"][i]
        out.append(
            {
                "ticker": ticker,
                "accession_number": accession,
                "form_type": form,
                "filed_at": datetime.fromisoformat(recent["filingDate"][i]),
                "filer_name": payload.get("name", ""),
                "url": (
                    f"https://www.sec.gov/Archives/edgar/data/{int(cik)}/"
                    f"{accession_nodash}/{primary_doc}"
                ),
            }
        )
    return out
