import { FormEvent, useState } from "react";
import { Symbol } from "../lib/api";

type Props = {
  symbols: Symbol[];
  onAdd: (ticker: string) => Promise<void>;
  onRemove: (ticker: string) => Promise<void>;
};

export default function WatchlistManager({ symbols, onAdd, onRemove }: Props) {
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const ticker = value.trim().toUpperCase();
    if (!ticker) return;
    setBusy(true);
    try {
      await onAdd(ticker);
      setValue("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-line bg-paper-raised p-4">
      <h2 className="mb-3 font-display text-base font-semibold">Watchlist</h2>
      <form onSubmit={handleSubmit} className="mb-3 flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="es. AAPL"
          className="min-w-0 flex-1 rounded-lg border border-line bg-paper px-3 py-2 font-mono text-sm uppercase outline-none placeholder:normal-case placeholder:text-ink-faint focus:border-accent"
          maxLength={8}
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-accent px-3.5 py-2 font-mono text-xs font-medium uppercase tracking-wide text-paper-raised disabled:opacity-50"
        >
          Aggiungi
        </button>
      </form>
      <div className="flex flex-wrap gap-2">
        {symbols.map((s) => (
          <span
            key={s.id}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper-sunk px-2.5 py-1 font-mono text-xs"
          >
            {s.ticker}
            <button
              onClick={() => onRemove(s.ticker)}
              className="text-ink-faint hover:text-bad"
              aria-label={`Rimuovi ${s.ticker}`}
            >
              ×
            </button>
          </span>
        ))}
        {symbols.length === 0 && <span className="text-sm text-ink-faint">Nessun titolo seguito.</span>}
      </div>
    </div>
  );
}
