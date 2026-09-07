"""Motore di scoring, fase 1: solo regole esplicite e spiegabili, niente ML.

Ogni titolo prende un punteggio composito 0-100 da cinque componenti indipendenti,
pesate. L'idea (vedi la ricerca che ha preceduto questo codice) è che nessun segnale
da solo basta: un volume anomalo isolato è rumore, lo stesso volume anomalo insieme a
un cluster di acquisti insider è un segnale.
"""

import statistics
from dataclasses import dataclass
from datetime import datetime, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models import Alert, InsiderFiling, PriceBar, Signal, SocialMention, ShortInterest, Symbol

# Pesi delle componenti nel punteggio composito. Sommano a 1.0.
WEIGHTS = {
    "volume": 0.30,
    "price": 0.15,
    "insider": 0.20,
    "short_interest": 0.20,
    "social": 0.15,
}

SEVERITY_THRESHOLDS = (
    ("critico", 75),
    ("elevato", 50),
    ("watch", 30),
)


@dataclass
class ComponentResult:
    volume_z: float = 0.0
    price_move_pct: float = 0.0
    insider_score: float = 0.0
    short_interest_score: float = 0.0
    social_score: float = 0.0
    notes: list[str] | None = None

    def __post_init__(self):
        if self.notes is None:
            self.notes = []


def _clamp(value: float, lo: float = 0.0, hi: float = 100.0) -> float:
    return max(lo, min(hi, value))


def _volume_and_price(db: Session, symbol: Symbol) -> tuple[float, float, list[str]]:
    bars = (
        db.execute(
            select(PriceBar).where(PriceBar.symbol_id == symbol.id).order_by(PriceBar.date.asc())
        )
        .scalars()
        .all()
    )
    if len(bars) < 6:
        return 0.0, 0.0, []

    baseline = bars[:-1]
    today = bars[-1]
    volumes = [b.volume for b in baseline]
    mean_v = statistics.mean(volumes)
    std_v = statistics.pstdev(volumes) or 1.0
    volume_z = (today.volume - mean_v) / std_v

    prev_close = bars[-2].close if len(bars) >= 2 and bars[-2].close else today.close
    price_move_pct = ((today.close - prev_close) / prev_close * 100) if prev_close else 0.0

    notes = []
    if volume_z >= 2:
        notes.append(f"volume {today.volume / mean_v:.1f}x sopra la media a {len(baseline)}gg")
    if abs(price_move_pct) >= 5:
        notes.append(f"prezzo {price_move_pct:+.1f}% oggi")
    return volume_z, price_move_pct, notes


def _insider_score(db: Session, symbol: Symbol, window_days: int = 7) -> tuple[float, list[str]]:
    cutoff = datetime.utcnow() - timedelta(days=window_days)
    count = (
        db.execute(
            select(InsiderFiling)
            .where(InsiderFiling.symbol_id == symbol.id)
            .where(InsiderFiling.form_type == "4")
            .where(InsiderFiling.filed_at >= cutoff)
        )
        .scalars()
        .all()
    )
    n = len(count)
    # 3+ Form 4 nella stessa settimana = segnale di cluster pieno.
    score = _clamp(n / 3.0 * 100)
    notes = [f"{n} Form 4 depositati negli ultimi {window_days} giorni"] if n >= 2 else []
    return score, notes


def _short_interest_score(db: Session, symbol: Symbol) -> tuple[float, list[str]]:
    rows = (
        db.execute(
            select(ShortInterest)
            .where(ShortInterest.symbol_id == symbol.id)
            .order_by(ShortInterest.settlement_date.desc())
            .limit(2)
        )
        .scalars()
        .all()
    )
    if not rows:
        return 0.0, []
    latest = rows[0]
    pct_change = 0.0
    if len(rows) == 2 and rows[1].short_interest:
        pct_change = (latest.short_interest - rows[1].short_interest) / rows[1].short_interest * 100

    change_component = _clamp(max(pct_change, 0) / 50 * 100)
    cover_component = _clamp(latest.days_to_cover / 10 * 100)
    score = _clamp(0.6 * change_component + 0.4 * cover_component)

    notes = []
    if pct_change >= 15:
        notes.append(f"short interest +{pct_change:.0f}% dal ciclo precedente")
    if latest.days_to_cover >= 5:
        notes.append(f"{latest.days_to_cover:.1f} giorni per coprire lo short")
    return score, notes


def _social_score(db: Session, symbol: Symbol) -> tuple[float, list[str]]:
    row = (
        db.execute(
            select(SocialMention)
            .where(SocialMention.symbol_id == symbol.id)
            .order_by(SocialMention.date.desc())
            .limit(1)
        )
        .scalars()
        .first()
    )
    if row is None or row.mentions < 10:
        return 0.0, []
    prior = row.mentions_24h_ago or row.mentions
    ratio = row.mentions / max(prior, 1)
    score = _clamp((ratio - 1) * 50)
    notes = [f"menzioni social {ratio:.1f}x rispetto a ieri"] if ratio >= 1.5 else []
    return score, notes


def _severity_for(score: float) -> str:
    for label, threshold in SEVERITY_THRESHOLDS:
        if score >= threshold:
            return label
    return "none"


def compute_signal_for_symbol(db: Session, symbol: Symbol) -> Signal:
    volume_z, price_move_pct, vol_notes = _volume_and_price(db, symbol)
    insider_score, insider_notes = _insider_score(db, symbol)
    short_score, short_notes = _short_interest_score(db, symbol)
    social_score, social_notes = _social_score(db, symbol)

    volume_component = _clamp(max(volume_z, 0) / 4 * 100)
    price_component = _clamp(abs(price_move_pct) / 10 * 100)

    composite = (
        WEIGHTS["volume"] * volume_component
        + WEIGHTS["price"] * price_component
        + WEIGHTS["insider"] * insider_score
        + WEIGHTS["short_interest"] * short_score
        + WEIGHTS["social"] * social_score
    )
    severity = _severity_for(composite)
    all_notes = vol_notes + insider_notes + short_notes + social_notes
    explanation = "; ".join(all_notes) if all_notes else "nessuna anomalia rilevante"

    signal = Signal(
        symbol_id=symbol.id,
        computed_at=datetime.utcnow(),
        volume_z=volume_z,
        price_move_pct=price_move_pct,
        insider_score=insider_score,
        short_interest_score=short_score,
        social_score=social_score,
        composite_score=composite,
        severity=severity,
        explanation=explanation,
    )
    db.add(signal)
    db.flush()

    if severity in ("elevato", "critico"):
        _maybe_create_alert(db, symbol, signal)

    return signal


def _maybe_create_alert(db: Session, symbol: Symbol, signal: Signal) -> None:
    """Crea un alert solo se non ne esiste già uno recente della stessa severità per lo stesso
    titolo, per non spammare a ogni ciclo di polling."""
    recent_cutoff = datetime.utcnow() - timedelta(hours=6)
    existing = (
        db.execute(
            select(Alert)
            .where(Alert.symbol_id == symbol.id)
            .where(Alert.severity == signal.severity)
            .where(Alert.created_at >= recent_cutoff)
        )
        .scalars()
        .first()
    )
    if existing:
        return

    message = f"{symbol.ticker}: {signal.explanation} (punteggio {signal.composite_score:.0f}/100)"
    db.add(
        Alert(
            symbol_id=symbol.id,
            signal_id=signal.id,
            severity=signal.severity,
            message=message,
        )
    )


def run_scoring_cycle(db: Session) -> list[Signal]:
    symbols = db.execute(select(Symbol).where(Symbol.watched.is_(True))).scalars().all()
    signals = [compute_signal_for_symbol(db, s) for s in symbols]
    db.commit()
    return signals
