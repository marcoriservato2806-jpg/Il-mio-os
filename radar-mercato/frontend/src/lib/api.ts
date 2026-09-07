const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export type Symbol = {
  id: number;
  ticker: string;
  name: string;
  watched: boolean;
};

export type Signal = {
  computed_at: string;
  volume_z: number;
  price_move_pct: number;
  insider_score: number;
  short_interest_score: number;
  social_score: number;
  composite_score: number;
  severity: "none" | "watch" | "elevato" | "critico";
  explanation: string;
};

export type Mover = {
  symbol: Symbol;
  signal: Signal | null;
};

export type PriceBar = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type InsiderFiling = {
  form_type: string;
  filed_at: string;
  filer_name: string;
  url: string;
};

export type ShortInterestRow = {
  settlement_date: string;
  short_interest: number;
  avg_daily_volume: number;
  days_to_cover: number;
};

export type SocialMention = {
  date: string;
  mentions: number;
  mentions_24h_ago: number;
  rank: number;
};

export type SymbolDetail = {
  symbol: Symbol;
  signal: Signal | null;
  price_bars: PriceBar[];
  filings: InsiderFiling[];
  short_interests: ShortInterestRow[];
  mentions: SocialMention[];
};

export type Alert = {
  id: number;
  created_at: string;
  severity: string;
  message: string;
  acknowledged: boolean;
  ticker: string;
};

export type Stats = {
  watched_symbols: number;
  total_alerts: number;
  last_computed_at: string | null;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const resp = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!resp.ok) {
    const body = await resp.text().catch(() => "");
    throw new Error(`${resp.status} ${resp.statusText}: ${body}`);
  }
  return resp.json();
}

export const api = {
  movers: () => request<Mover[]>("/api/movers"),
  symbolDetail: (ticker: string) => request<SymbolDetail>(`/api/symbols/${ticker}`),
  alerts: () => request<Alert[]>("/api/alerts"),
  ackAlert: (id: number) => request<Alert>(`/api/alerts/${id}/ack`, { method: "POST" }),
  watchlist: () => request<Symbol[]>("/api/watchlist"),
  addToWatchlist: (ticker: string) =>
    request<Symbol>("/api/watchlist", { method: "POST", body: JSON.stringify({ ticker }) }),
  removeFromWatchlist: (ticker: string) =>
    request<Symbol>(`/api/watchlist/${ticker}`, { method: "DELETE" }),
  runCycle: () => request<{ status: string }>("/api/run-cycle", { method: "POST" }),
  stats: () => request<Stats>("/api/stats"),
};
