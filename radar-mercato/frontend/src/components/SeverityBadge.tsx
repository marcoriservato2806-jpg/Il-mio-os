const LABELS: Record<string, string> = {
  none: "nessuno",
  watch: "watch",
  elevato: "elevato",
  critico: "critico",
};

const STYLES: Record<string, string> = {
  none: "bg-paper-sunk text-ink-faint",
  watch: "bg-teal-soft text-teal",
  elevato: "bg-accent-soft text-accent",
  critico: "bg-bad-soft text-bad",
};

export default function SeverityBadge({ severity }: { severity: string }) {
  const style = STYLES[severity] ?? STYLES.none;
  const label = LABELS[severity] ?? severity;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-wider ${style}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
