"""Orchestrazione: chiama i connettori, scrive/aggiorna il database, poi fa girare lo scoring.

Pensato per essere invocato sia da un job periodico (APScheduler, vedi main.py) sia a mano
per un primo popolamento (vedi backend/scripts/seed.py).
"""

import logging

from sqlalchemy import select
from sqlalchemy.orm import Session

from .config import get_settings
from .connectors import alpaca, apewisdom, edgar, finra_short
from .connectors.alpaca import AlpacaNotConfigured
from .models import InsiderFiling, PriceBar, ShortInterest, SocialMention, Symbol
from .scoring.engine import run_scoring_cycle

logger = logging.getLogger("radar.scheduler")


def ensure_watchlist_symbols(db: Session) -> list[Symbol]:
    settings = get_settings()
    symbols = []
    for ticker in settings.watchlist_symbols:
        existing = db.execute(select(Symbol).where(Symbol.ticker == ticker)).scalar_one_or_none()
        if existing is None:
            existing = Symbol(ticker=ticker)
            db.add(existing)
        symbols.append(existing)
    db.commit()
    for s in symbols:
        db.refresh(s)
    return symbols


def _ingest_prices(db: Session, symbols: list[Symbol]) -> None:
    try:
        bars_by_ticker = alpaca.fetch_daily_bars([s.ticker for s in symbols])
    except AlpacaNotConfigured as exc:
        logger.warning("Alpaca non configurato, salto i prezzi: %s", exc)
        return
    except Exception:
        logger.exception("Errore nel recupero prezzi da Alpaca")
        return

    by_ticker = {s.ticker: s for s in symbols}
    for ticker, bars in bars_by_ticker.items():
        symbol = by_ticker.get(ticker)
        if symbol is None:
            continue
        for bar in bars:
            existing = db.execute(
                select(PriceBar).where(PriceBar.symbol_id == symbol.id, PriceBar.date == bar["date"])
            ).scalar_one_or_none()
            if existing:
                existing.open, existing.high = bar["open"], bar["high"]
                existing.low, existing.close, existing.volume = bar["low"], bar["close"], bar["volume"]
            else:
                db.add(PriceBar(symbol_id=symbol.id, **bar))
    db.commit()


def _ingest_edgar(db: Session, symbols: list[Symbol]) -> None:
    try:
        ticker_cik = edgar.load_ticker_cik_map()
    except Exception:
        logger.exception("Errore nel caricare la mappa ticker->CIK da SEC EDGAR")
        return

    for symbol in symbols:
        cik = ticker_cik.get(symbol.ticker)
        if cik is None:
            continue
        if symbol.cik != cik:
            symbol.cik = cik
        try:
            filings = edgar.fetch_recent_filings(symbol.ticker, cik)
        except Exception:
            logger.exception("Errore EDGAR per %s", symbol.ticker)
            continue
        for f in filings:
            exists = db.execute(
                select(InsiderFiling).where(InsiderFiling.accession_number == f["accession_number"])
            ).scalar_one_or_none()
            if exists:
                continue
            db.add(
                InsiderFiling(
                    symbol_id=symbol.id,
                    accession_number=f["accession_number"],
                    form_type=f["form_type"],
                    filed_at=f["filed_at"],
                    filer_name=f["filer_name"],
                    url=f["url"],
                )
            )
    db.commit()


def _ingest_short_interest(db: Session, symbols: list[Symbol]) -> None:
    for symbol in symbols:
        try:
            rows = finra_short.fetch_short_interest(symbol.ticker)
        except Exception:
            logger.exception("Errore FINRA short interest per %s", symbol.ticker)
            continue
        for row in rows:
            exists = db.execute(
                select(ShortInterest).where(
                    ShortInterest.symbol_id == symbol.id,
                    ShortInterest.settlement_date == row["settlement_date"],
                )
            ).scalar_one_or_none()
            if exists:
                continue
            db.add(ShortInterest(symbol_id=symbol.id, **row))
    db.commit()


def _ingest_social(db: Session, symbols: list[Symbol]) -> None:
    try:
        trending = apewisdom.fetch_trending()
    except Exception:
        logger.exception("Errore nel recupero dati ApeWisdom")
        return

    for symbol in symbols:
        row = trending.get(symbol.ticker)
        if row is None:
            continue
        exists = db.execute(
            select(SocialMention).where(
                SocialMention.symbol_id == symbol.id,
                SocialMention.date == row["date"],
                SocialMention.source == "reddit",
            )
        ).scalar_one_or_none()
        if exists:
            exists.mentions = row["mentions"]
            exists.mentions_24h_ago = row["mentions_24h_ago"]
            exists.rank = row["rank"]
            exists.rank_24h_ago = row["rank_24h_ago"]
        else:
            db.add(
                SocialMention(
                    symbol_id=symbol.id,
                    date=row["date"],
                    source="reddit",
                    mentions=row["mentions"],
                    mentions_24h_ago=row["mentions_24h_ago"],
                    rank=row["rank"],
                    rank_24h_ago=row["rank_24h_ago"],
                )
            )
    db.commit()


def run_full_cycle(db: Session) -> int:
    """Ingest da tutte le fonti + scoring. Ritorna il numero di segnali calcolati."""
    symbols = ensure_watchlist_symbols(db)
    logger.info("Ciclo di raccolta per %d titoli", len(symbols))
    _ingest_prices(db, symbols)
    _ingest_edgar(db, symbols)
    _ingest_short_interest(db, symbols)
    _ingest_social(db, symbols)
    signals = run_scoring_cycle(db)
    logger.info("Calcolati %d segnali", len(signals))
    return len(signals)
