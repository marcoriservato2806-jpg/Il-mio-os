export default function ScoreBar({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, score));
  const color = clamped >= 75 ? "bg-bad" : clamped >= 50 ? "bg-accent" : clamped >= 30 ? "bg-teal" : "bg-ink-faint";
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-paper-sunk">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${clamped}%` }} />
      </div>
      <span className="font-mono text-sm tabular text-ink-dim">{clamped.toFixed(0)}</span>
    </div>
  );
}
