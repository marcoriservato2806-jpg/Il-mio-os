import { Alert } from "../lib/api";
import SeverityBadge from "./SeverityBadge";

type Props = {
  alerts: Alert[];
  onAck: (id: number) => void;
};

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso + "Z").getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "adesso";
  if (mins < 60) return `${mins} min fa`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h fa`;
  return `${Math.round(hours / 24)} gg fa`;
}

export default function AlertFeed({ alerts, onAck }: Props) {
  return (
    <div className="rounded-xl border border-line bg-paper-raised">
      <div className="border-b border-line px-4 py-3">
        <h2 className="font-display text-base font-semibold">Alert recenti</h2>
      </div>
      <div className="max-h-[480px] divide-y divide-line overflow-y-auto">
        {alerts.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-ink-faint">
            Nessun alert ancora. Appariranno qui quando un titolo supera la soglia "elevato".
          </p>
        )}
        {alerts.map((a) => (
          <div key={a.id} className={`flex gap-3 px-4 py-3 ${a.acknowledged ? "opacity-50" : ""}`}>
            <div className="pt-0.5">
              <SeverityBadge severity={a.severity} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-snug text-ink">{a.message}</p>
              <div className="mt-1 flex items-center gap-2 font-mono text-[0.7rem] text-ink-faint">
                <span>{timeAgo(a.created_at)}</span>
                {!a.acknowledged && (
                  <>
                    <span>·</span>
                    <button onClick={() => onAck(a.id)} className="text-teal hover:underline">
                      segna come vista
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
