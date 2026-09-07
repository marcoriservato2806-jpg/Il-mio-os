import { useCallback, useEffect, useState } from "react";
import { api, Alert, Mover, Stats, Symbol, SymbolDetail } from "./lib/api";
import MoversTable from "./components/MoversTable";
import AlertFeed from "./components/AlertFeed";
import WatchlistManager from "./components/WatchlistManager";
import SymbolDetailPanel from "./components/SymbolDetailPanel";

const REFRESH_MS = 30_000;

export default function App() {
  const [movers, setMovers] = useState<Mover[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [watchlist, setWatchlist] = useState<Symbol[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState<SymbolDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadAll = useCallback(async () => {
    try {
      const [m, a, w, s] = await Promise.all([
        api.movers(),
        api.alerts(),
        api.watchlist(),
        api.stats(),
      ]);
      setMovers(m);
      setAlerts(a);
      setWatchlist(w);
      setStats(s);
      setError(null);
    } catch (e) {
      setError(
        `Non riesco a raggiungere il backend su ${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}. ` +
          "È avviato? (vedi README, uvicorn app.main:app)"
      );
    }
  }, []);

  useEffect(() => {
    loadAll();
    const id = setInterval(loadAll, REFRESH_MS);
    return () => clearInterval(id);
  }, [loadAll]);

  useEffect(() => {
    if (!selected) {
      setDetail(null);
      return;
    }
    api.symbolDetail(selected).then(setDetail).catch(() => setDetail(null));
  }, [selected]);

  async function handleAck(id: number) {
    await api.ackAlert(id);
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
  }

  async function handleAdd(ticker: string) {
    await api.addToWatchlist(ticker);
    await loadAll();
  }

  async function handleRemove(ticker: string) {
    await api.removeFromWatchlist(ticker);
    if (selected === ticker) setSelected(null);
    await loadAll();
  }

  async function handleRunNow() {
    setRefreshing(true);
    try {
      await api.runCycle();
      setTimeout(loadAll, 4000);
    } finally {
      setTimeout(() => setRefreshing(false), 4000);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="mb-1.5 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Fase 1 · fonti gratuite
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Radar Mercato</h1>
          <p className="mt-1 text-sm text-ink-dim">
            Punteggio composito per titolo: volume, prezzo, insider, short interest, social.
          </p>
        </div>
        <div className="flex items-center gap-5">
          {stats && (
            <div className="flex gap-5 font-mono text-xs text-ink-faint">
              <span>
                <span className="text-ink-dim">{stats.watched_symbols}</span> seguiti
              </span>
              <span>
                <span className="text-ink-dim">{stats.total_alerts}</span> alert totali
              </span>
            </div>
          )}
          <button
            onClick={handleRunNow}
            disabled={refreshing}
            className="rounded-lg border border-line bg-paper-raised px-3.5 py-2 font-mono text-xs uppercase tracking-wide text-ink-dim hover:border-accent hover:text-accent disabled:opacity-50"
          >
            {refreshing ? "raccolta in corso…" : "aggiorna ora"}
          </button>
        </div>
      </header>

      {error && (
        <div className="mb-6 rounded-lg border border-bad/30 bg-bad-soft px-4 py-3 text-sm text-bad">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <MoversTable movers={movers} onSelect={setSelected} selected={selected} />
          {detail && <SymbolDetailPanel detail={detail} onClose={() => setSelected(null)} />}
          <WatchlistManager symbols={watchlist} onAdd={handleAdd} onRemove={handleRemove} />
        </div>
        <div>
          <AlertFeed alerts={alerts} onAck={handleAck} />
        </div>
      </div>
    </div>
  );
}
