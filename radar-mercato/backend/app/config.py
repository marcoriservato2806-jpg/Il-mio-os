from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file="../.env", env_file_encoding="utf-8", extra="ignore")

    alpaca_api_key_id: str = ""
    alpaca_api_secret_key: str = ""
    sec_edgar_user_agent: str = "Radar Mercato contact@example.com"
    watchlist_default: str = "AAPL,TSLA,GME,NVDA,AMC,PLTR,SOFI,RIVN"
    database_url: str = "sqlite:///./radar.db"
    poll_interval_minutes: int = 15
    cors_origin: str = "http://localhost:5173"

    @property
    def watchlist_symbols(self) -> list[str]:
        return [s.strip().upper() for s in self.watchlist_default.split(",") if s.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
