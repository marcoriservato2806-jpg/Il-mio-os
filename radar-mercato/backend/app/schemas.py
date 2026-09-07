from datetime import datetime

from pydantic import BaseModel, ConfigDict


class SymbolOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    ticker: str
    name: str
    watched: bool


class SignalOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    computed_at: datetime
    volume_z: float
    price_move_pct: float
    insider_score: float
    short_interest_score: float
    social_score: float
    composite_score: float
    severity: str
    explanation: str


class MoverOut(BaseModel):
    symbol: SymbolOut
    signal: SignalOut | None


class PriceBarOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: float


class InsiderFilingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    form_type: str
    filed_at: datetime
    filer_name: str
    url: str


class ShortInterestOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    settlement_date: str
    short_interest: float
    avg_daily_volume: float
    days_to_cover: float


class SocialMentionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    date: str
    mentions: int
    mentions_24h_ago: int
    rank: int


class SymbolDetailOut(BaseModel):
    symbol: SymbolOut
    signal: SignalOut | None
    price_bars: list[PriceBarOut]
    filings: list[InsiderFilingOut]
    short_interests: list[ShortInterestOut]
    mentions: list[SocialMentionOut]


class AlertOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
    severity: str
    message: str
    acknowledged: bool
    ticker: str


class WatchlistAddIn(BaseModel):
    ticker: str
