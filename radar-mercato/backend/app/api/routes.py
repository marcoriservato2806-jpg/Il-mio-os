from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .. import scheduler
from ..db import get_db
from ..models import Alert, Signal, Symbol
from ..schemas import (
    AlertOut,
    MoverOut,
    SignalOut,
    SymbolDetailOut,
    SymbolOut,
    WatchlistAddIn,
)

router = APIRouter(prefix="/api")


def _latest_signal(db: Session, symbol_id: int) -> Signal | None:
    return (
        db.execute(
            select(Signal)
            .where(Signal.symbol_id == symbol_id)
            .order_by(Signal.computed_at.desc())
            .limit(1)
        )
        .scalars()
        .first()
    )


@router.get("/movers", response_model=list[MoverOut])
def get_movers(limit: int = 25, db: Session = Depends(get_db)):
    symbols = db.execute(select(Symbol).where(Symbol.watched.is_(True))).scalars().all()
    movers = [MoverOut(symbol=SymbolOut.model_validate(s), signal=_latest_signal(db, s.id)) for s in symbols]
    movers.sort(key=lambda m: m.signal.composite_score if m.signal else -1, reverse=True)
    return movers[:limit]


@router.get("/symbols/{ticker}", response_model=SymbolDetailOut)
def get_symbol_detail(ticker: str, db: Session = Depends(get_db)):
    symbol = db.execute(select(Symbol).where(Symbol.ticker == ticker.upper())).scalar_one_or_none()
    if symbol is None:
        raise HTTPException(status_code=404, detail="Titolo non seguito")

    price_bars = sorted(symbol.price_bars, key=lambda b: b.date)[-90:]
    filings = sorted(symbol.filings, key=lambda f: f.filed_at, reverse=True)[:20]
    short_interests = sorted(symbol.short_interests, key=lambda s: s.settlement_date, reverse=True)[:12]
    mentions = sorted(symbol.mentions, key=lambda m: m.date, reverse=True)[:30]

    return SymbolDetailOut(
        symbol=SymbolOut.model_validate(symbol),
        signal=_latest_signal(db, symbol.id),
        price_bars=price_bars,
        filings=filings,
        short_interests=short_interests,
        mentions=mentions,
    )


@router.get("/alerts", response_model=list[AlertOut])
def get_alerts(limit: int = 50, only_unacknowledged: bool = False, db: Session = Depends(get_db)):
    query = select(Alert).order_by(Alert.created_at.desc()).limit(limit)
    if only_unacknowledged:
        query = query.where(Alert.acknowledged.is_(False))
    alerts = db.execute(query).scalars().all()
    return [
        AlertOut(
            id=a.id,
            created_at=a.created_at,
            severity=a.severity,
            message=a.message,
            acknowledged=a.acknowledged,
            ticker=a.symbol.ticker,
        )
        for a in alerts
    ]


@router.post("/alerts/{alert_id}/ack", response_model=AlertOut)
def acknowledge_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.get(Alert, alert_id)
    if alert is None:
        raise HTTPException(status_code=404, detail="Alert non trovato")
    alert.acknowledged = True
    db.commit()
    db.refresh(alert)
    return AlertOut(
        id=alert.id,
        created_at=alert.created_at,
        severity=alert.severity,
        message=alert.message,
        acknowledged=alert.acknowledged,
        ticker=alert.symbol.ticker,
    )


@router.get("/watchlist", response_model=list[SymbolOut])
def get_watchlist(db: Session = Depends(get_db)):
    symbols = db.execute(select(Symbol).where(Symbol.watched.is_(True)).order_by(Symbol.ticker)).scalars().all()
    return symbols


@router.post("/watchlist", response_model=SymbolOut)
def add_to_watchlist(payload: WatchlistAddIn, db: Session = Depends(get_db)):
    ticker = payload.ticker.strip().upper()
    if not ticker:
        raise HTTPException(status_code=400, detail="Ticker mancante")
    symbol = db.execute(select(Symbol).where(Symbol.ticker == ticker)).scalar_one_or_none()
    if symbol is None:
        symbol = Symbol(ticker=ticker)
        db.add(symbol)
    else:
        symbol.watched = True
    db.commit()
    db.refresh(symbol)
    return symbol


@router.delete("/watchlist/{ticker}", response_model=SymbolOut)
def remove_from_watchlist(ticker: str, db: Session = Depends(get_db)):
    symbol = db.execute(select(Symbol).where(Symbol.ticker == ticker.upper())).scalar_one_or_none()
    if symbol is None:
        raise HTTPException(status_code=404, detail="Titolo non trovato")
    symbol.watched = False
    db.commit()
    db.refresh(symbol)
    return symbol


@router.post("/run-cycle")
def trigger_cycle(background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Fa partire subito un ciclo di raccolta + scoring, senza aspettare lo scheduler
    (utile in fase di test per non aspettare fino a POLL_INTERVAL_MINUTES)."""
    background_tasks.add_task(_run_cycle_isolated)
    return {"status": "avviato"}


def _run_cycle_isolated() -> None:
    from ..db import SessionLocal

    db = SessionLocal()
    try:
        scheduler.run_full_cycle(db)
    finally:
        db.close()


@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    total_watched = db.execute(
        select(func.count()).select_from(Symbol).where(Symbol.watched.is_(True))
    ).scalar_one()
    total_alerts = db.execute(select(func.count()).select_from(Alert)).scalar_one()
    last_signal = db.execute(select(Signal).order_by(Signal.computed_at.desc()).limit(1)).scalars().first()
    return {
        "watched_symbols": total_watched,
        "total_alerts": total_alerts,
        "last_computed_at": last_signal.computed_at if last_signal else None,
    }
