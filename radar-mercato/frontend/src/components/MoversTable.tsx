import { Mover } from "../lib/api";
import ScoreBar from "./ScoreBar";
import SeverityBadge from "./SeverityBadge";

type Props = {
  movers: Mover[];
  onSelect: (ticker: string) => void;
  selected: string | null;
};

export default function MoversTable({ movers, onSelect, selected }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-paper-raised">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-line bg-paper-sunk font-mono text-[0.68rem] uppercase tracking-wider text-ink-faint">
              <th className="px-4 py-3 text-left">Titolo</th>
              <th className="px-4 py-3 text-left">Punteggio</th>
              <th className="px-4 py-3 text-left">Severità</th>
              <th className="px-4 py-3 text-left">Prezzo</th>
              <th className="px-4 py-3 text-left">Perché</th>
            </tr>
          </thead>
          <tbody>
            {movers.map((m) => {
              const s = m.signal;
              const isSelected = m.symbol.ticker === selected;
              return (
                <tr
                  key={m.symbol.id}
                  onClick={() => onSelect(m.symbol.ticker)}
                  className={`cursor-pointer border-b border-line last:border-0 transition-colors hover:bg-accent-soft ${
                    isSelected ? "bg-accent-soft" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-mono font-medium">{m.symbol.ticker}</td>
                  <td className="px-4 py-3">
                    <ScoreBar score={s?.composite_score ?? 0} />
                  </td>
                  <td className="px-4 py-3">
                    <SeverityBadge severity={s?.severity ?? "none"} />
                  </td>
                  <td className="px-4 py-3 font-mono tabular">
                    {s && s.price_move_pct !== 0 ? (
                      <span className={s.price_move_pct >= 0 ? "text-good" : "text-bad"}>
                        {s.price_move_pct >= 0 ? "+" : ""}
                        {s.price_move_pct.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-ink-faint">—</span>
                    )}
                  </td>
                  <td className="max-w-[280px] truncate px-4 py-3 text-ink-dim">
                    {s?.explanation ?? "in attesa di dati"}
                  </td>
                </tr>
              );
            })}
            {movers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-ink-faint">
                  Nessun titolo in watchlist. Aggiungine uno qui sotto.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
