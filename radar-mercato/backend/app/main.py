import logging

from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.routes import router
from .config import get_settings
from .db import SessionLocal, init_db
from .scheduler import run_full_cycle

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("radar.main")

settings = get_settings()

app = FastAPI(title="Radar Mercato", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.cors_origin],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

scheduler = BackgroundScheduler()


def _scheduled_job() -> None:
    db = SessionLocal()
    try:
        run_full_cycle(db)
    except Exception:
        logger.exception("Ciclo di raccolta fallito")
    finally:
        db.close()


@app.on_event("startup")
def on_startup() -> None:
    init_db()
    scheduler.add_job(
        _scheduled_job,
        "interval",
        minutes=settings.poll_interval_minutes,
        next_run_time=None,  # il primo giro parte subito, vedi sotto
        id="radar_cycle",
        max_instances=1,
    )
    scheduler.start()
    # Primo giro immediato in background per non partire con la dashboard vuota.
    import threading

    threading.Thread(target=_scheduled_job, daemon=True).start()
    logger.info(
        "Radar Mercato avviato. Poll ogni %d minuti su %d titoli.",
        settings.poll_interval_minutes,
        len(settings.watchlist_symbols),
    )


@app.on_event("shutdown")
def on_shutdown() -> None:
    scheduler.shutdown(wait=False)


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}
