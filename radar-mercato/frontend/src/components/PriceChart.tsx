import { PriceBar } from "../lib/api";

type Props = {
  bars: PriceBar[];
  height?: number;
  compact?: boolean;
};

export default function PriceChart({ bars, height = 220, compact = false }: Props) {
  if (bars.length < 2) {
    return (
      <div
        className="flex items-center justify-center rounded-lg border border-line bg-paper-sunk font-mono text-xs text-ink-faint"
        style={{ height }}
      >
        dati prezzo non disponibili (serve una chiave Alpaca gratuita)
      </div>
    );
  }

  const width = compact ? 160 : 640;
  const padX = compact ? 0 : 44;
  const padY = compact ? 4 : 20;
  const closes = bars.map((b) => b.close);
  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const span = max - min || 1;

  const points = bars.map((b, i) => {
    const x = padX + (i / (bars.length - 1)) * (width - padX * 2);
    const y = padY + (1 - (b.close - min) / span) * (height - padY * 2);
    return [x, y] as const;
  });

  const path = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const areaPath = `${path} L${points[points.length - 1][0].toFixed(1)},${(height - padY).toFixed(1)} L${points[0][0].toFixed(1)},${(height - padY).toFixed(1)} Z`;
  const last = points[points.length - 1];
  const up = closes[closes.length - 1] >= closes[0];
  const lineColor = up ? "var(--good)" : "var(--bad)";

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="none">
      <defs>
        <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lineColor} stopOpacity="0.18" />
          <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      {!compact && (
        <>
          <line x1={padX} y1={padY} x2={width - padX} y2={padY} stroke="var(--line)" strokeWidth="1" />
          <line
            x1={padX}
            y1={height - padY}
            x2={width - padX}
            y2={height - padY}
            stroke="var(--line)"
            strokeWidth="1"
          />
          <text x={padX - 8} y={padY + 4} textAnchor="end" className="fill-ink-faint font-mono" fontSize="10">
            {max.toFixed(2)}
          </text>
          <text
            x={padX - 8}
            y={height - padY + 4}
            textAnchor="end"
            className="fill-ink-faint font-mono"
            fontSize="10"
          >
            {min.toFixed(2)}
          </text>
        </>
      )}
      <path d={areaPath} fill="url(#priceFill)" stroke="none" />
      <path d={path} fill="none" stroke={lineColor} strokeWidth={compact ? 1.5 : 2} />
      <circle cx={last[0]} cy={last[1]} r={compact ? 2 : 3.5} fill={lineColor} />
    </svg>
  );
}
