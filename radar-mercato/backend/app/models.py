from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .db import Base


class Symbol(Base):
    __tablename__ = "symbols"

    id: Mapped[int] = mapped_column(primary_key=True)
    ticker: Mapped[str] = mapped_column(String(12), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(200), default="")
    cik: Mapped[str] = mapped_column(String(10), default="")  # identificativo SEC, per l'incrocio coi filing
    watched: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    price_bars: Mapped[list["PriceBar"]] = relationship(back_populates="symbol", cascade="all, delete-orphan")
    filings: Mapped[list["InsiderFiling"]] = relationship(back_populates="symbol", cascade="all, delete-orphan")
    short_interests: Mapped[list["ShortInterest"]] = relationship(back_populates="symbol", cascade="all, delete-orphan")
    mentions: Mapped[list["SocialMention"]] = relationship(back_populates="symbol", cascade="all, delete-orphan")
    signals: Mapped[list["Signal"]] = relationship(back_populates="symbol", cascade="all, delete-orphan")


class PriceBar(Base):
    """Barra giornaliera di prezzo/volume da Alpaca (feed IEX gratuito)."""

    __tablename__ = "price_bars"
    __table_args__ = (UniqueConstraint("symbol_id", "date", name="uq_pricebar_symbol_date"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    symbol_id: Mapped[int] = mapped_column(ForeignKey("symbols.id"), index=True)
    date: Mapped[str] = mapped_column(String(10))  # YYYY-MM-DD
    open: Mapped[float] = mapped_column(Float)
    high: Mapped[float] = mapped_column(Float)
    low: Mapped[float] = mapped_column(Float)
    close: Mapped[float] = mapped_column(Float)
    volume: Mapped[float] = mapped_column(Float)

    symbol: Mapped["Symbol"] = relationship(back_populates="price_bars")


class InsiderFiling(Base):
    """Form 4 (compravendita insider) o 8-K rilevante, da SEC EDGAR."""

    __tablename__ = "insider_filings"
    __table_args__ = (UniqueConstraint("accession_number", name="uq_filing_accession"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    symbol_id: Mapped[int] = mapped_column(ForeignKey("symbols.id"), index=True)
    accession_number: Mapped[str] = mapped_column(String(30))
    form_type: Mapped[str] = mapped_column(String(10))  # "4" oppure "8-K"
    filed_at: Mapped[datetime] = mapped_column(DateTime)
    filer_name: Mapped[str] = mapped_column(String(200), default="")
    transaction_code: Mapped[str] = mapped_column(String(4), default="")  # P=acquisto, S=vendita (solo Form 4)
    shares: Mapped[float] = mapped_column(Float, default=0.0)
    price: Mapped[float] = mapped_column(Float, default=0.0)
    url: Mapped[str] = mapped_column(String(300), default="")

    symbol: Mapped["Symbol"] = relationship(back_populates="filings")


class ShortInterest(Base):
    """Dato ufficiale bisettimanale FINRA (non è real-time: è il dato regolamentare)."""

    __tablename__ = "short_interests"
    __table_args__ = (UniqueConstraint("symbol_id", "settlement_date", name="uq_short_symbol_date"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    symbol_id: Mapped[int] = mapped_column(ForeignKey("symbols.id"), index=True)
    settlement_date: Mapped[str] = mapped_column(String(10))
    short_interest: Mapped[float] = mapped_column(Float)
    avg_daily_volume: Mapped[float] = mapped_column(Float, default=0.0)
    days_to_cover: Mapped[float] = mapped_column(Float, default=0.0)

    symbol: Mapped["Symbol"] = relationship(back_populates="short_interests")


class SocialMention(Base):
    """Conteggio menzioni giornaliere da ApeWisdom (Reddit, gratuito)."""

    __tablename__ = "social_mentions"
    __table_args__ = (UniqueConstraint("symbol_id", "date", "source", name="uq_mention_symbol_date_source"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    symbol_id: Mapped[int] = mapped_column(ForeignKey("symbols.id"), index=True)
    date: Mapped[str] = mapped_column(String(10))
    source: Mapped[str] = mapped_column(String(30), default="reddit")
    mentions: Mapped[int] = mapped_column(Integer, default=0)
    mentions_24h_ago: Mapped[int] = mapped_column(Integer, default=0)
    rank: Mapped[int] = mapped_column(Integer, default=0)
    rank_24h_ago: Mapped[int] = mapped_column(Integer, default=0)

    symbol: Mapped["Symbol"] = relationship(back_populates="mentions")


class Signal(Base):
    """Punteggio composito calcolato dal motore di scoring per un titolo in un dato momento."""

    __tablename__ = "signals"

    id: Mapped[int] = mapped_column(primary_key=True)
    symbol_id: Mapped[int] = mapped_column(ForeignKey("symbols.id"), index=True)
    computed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    volume_z: Mapped[float] = mapped_column(Float, default=0.0)
    price_move_pct: Mapped[float] = mapped_column(Float, default=0.0)
    insider_score: Mapped[float] = mapped_column(Float, default=0.0)
    short_interest_score: Mapped[float] = mapped_column(Float, default=0.0)
    social_score: Mapped[float] = mapped_column(Float, default=0.0)
    composite_score: Mapped[float] = mapped_column(Float, default=0.0, index=True)
    severity: Mapped[str] = mapped_column(String(10), default="none")  # none | watch | elevato | critico
    explanation: Mapped[str] = mapped_column(String(500), default="")

    symbol: Mapped["Symbol"] = relationship(back_populates="signals")


class Alert(Base):
    """Alert generato quando un Signal supera la soglia di severità 'elevato' o 'critico'."""

    __tablename__ = "alerts"

    id: Mapped[int] = mapped_column(primary_key=True)
    symbol_id: Mapped[int] = mapped_column(ForeignKey("symbols.id"), index=True)
    signal_id: Mapped[int] = mapped_column(ForeignKey("signals.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    severity: Mapped[str] = mapped_column(String(10))
    message: Mapped[str] = mapped_column(String(500))
    acknowledged: Mapped[bool] = mapped_column(default=False)

    symbol: Mapped["Symbol"] = relationship()
