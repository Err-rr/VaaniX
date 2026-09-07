import type { RiskSignal } from "@/types/call";
import { cn } from "@/lib/utils";

const STATUS_TEXT: Record<RiskSignal["status"], string> = {
  critical: "text-critical-strong",
  high: "text-warning-strong",
  medium: "text-info",
  low: "text-positive-strong",
  safe: "text-positive-strong",
};

const STATUS_BAR: Record<RiskSignal["status"], string> = {
  critical: "bg-critical",
  high: "bg-warning",
  medium: "bg-info",
  low: "bg-positive",
  safe: "bg-positive",
};

/** Compact row presentation for a single AI analysis signal — several stack inside one bordered panel. */
export function SignalRow({ signal }: { signal: RiskSignal }) {
  return (
    <div className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
      <div className="w-[124px] shrink-0 text-[12.5px] font-medium text-foreground-muted">{signal.label}</div>
      <div className={cn("w-12 shrink-0 tabular text-[15px] font-semibold", STATUS_TEXT[signal.status])}>
        {signal.score}%
      </div>
      <div className="h-1 w-20 shrink-0 overflow-hidden rounded-full bg-surface-sunken">
        <div className={cn("h-full rounded-full", STATUS_BAR[signal.status])} style={{ width: `${signal.score}%` }} />
      </div>
      <p className="min-w-0 flex-1 truncate text-[12.5px] text-foreground-muted">{signal.summary}</p>
    </div>
  );
}
