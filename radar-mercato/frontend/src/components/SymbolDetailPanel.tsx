import { SymbolDetail } from "../lib/api";
import PriceChart from "./PriceChart";
import ScoreBar from "./ScoreBar";
import SeverityBadge from "./SeverityBadge";

type Props = {
  detail: SymbolDetail;
  onClose: () => void;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("it-IT", { day: "2-digit", month: "short" });
}

export default function SymbolDetailPanel({ detail, onClose }: Props) {
  const { symbol, signal, price_bars, filings, short_interests, mentions } = detail;

  return (
    <div className="rounded-xl border border-line bg-paper-raised">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-display text-2xl font-semibold">{symbol.ticker}</h2>
            <SeverityBadge severity={signal?.severity ?? "none"} />
          </div>
          {signal && <p className="mt-1 text-sm text-ink-dim">{signal.explanation}</p>}
        </div>
        <button
          onClick={onClose}
          className="rounded-full border border-line px-3 py-1.5 font-mono text-xs text-ink-faint hover:text-ink"
        >
          chiudi ✕
        </button>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-faint">Prezzo · 90gg</span>
            {signal && (
              <span className="font-mono text-xs text-ink-dim">
                composito <ScoreBar score={signal.composite_score} />
              </span>
            )}
          </div>
          <PriceChart bars={price_bars} height={240} />
        </div>

        <div className="space-y-4 lg:col-span-2">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-ink-faint">Short interest</span>
            <div className="mt-2 space-y-1.5">
              {short_interests.slice(0, 4).map((s) => (
                <div key={s.settlement_date} className="flex justify-between font-mono text-xs">
                  <span className="text-ink-faint">{s.settlement_date}</span>
                  <span className="tabular">{(s.short_interest / 1e6).toFixed(1)}M</span>
                  <span className="tabular text-ink-dim">{s.days_to_cover.toFixed(1)}gg copertura</span>
                </div>
              ))}
              {short_interests.length === 0 && (
                <p className="text-xs text-ink-faint">nessun dato FINRA ancora ricevuto</p>
              )}
            </div>
          </div>

          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-ink-faint">Menzioni social (Reddit)</span>
            {mentions[0] ? (
              <p className="mt-2 font-mono text-xs text-ink-dim">
                {mentions[0].mentions} menzioni oggi ({mentions[0].mentions_24h_ago} ieri) · rank #{mentions[0].rank}
              </p>
            ) : (
              <p className="mt-2 text-xs text-ink-faint">titolo non in classifica ApeWisdom oggi</p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-line px-5 py-4">
        <span className="font-mono text-xs uppercase tracking-wider text-ink-faint">
          Filing SEC recenti (Form 4 · 8-K)
        </span>
        <div className="mt-2 space-y-1.5">
          {filings.slice(0, 8).map((f) => (
            <a
              key={f.url}
              href={f.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm hover:bg-accent-soft"
            >
              <span className="w-14 shrink-0 font-mono text-xs text-ink-faint">{formatDate(f.filed_at)}</span>
              <span className="w-10 shrink-0 rounded bg-paper-sunk px-1.5 py-0.5 text-center font-mono text-[0.65rem] text-ink-dim">
                {f.form_type}
              </span>
              <span className="truncate text-teal">{f.filer_name || "vedi filing"}</span>
            </a>
          ))}
          {filings.length === 0 && <p className="text-xs text-ink-faint">nessun filing recente</p>}
        </div>
      </div>
    </div>
  );
}
