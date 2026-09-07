import { scoreToSeverity } from "@/lib/risk";
import { cn } from "@/lib/utils";

const BAR_CLASS: Record<string, string> = {
  critical: "bg-critical",
  high: "bg-warning",
  medium: "bg-info",
  low: "bg-positive",
};

const TEXT_CLASS: Record<string, string> = {
  critical: "text-critical-strong",
  high: "text-warning-strong",
  medium: "text-info",
  low: "text-positive-strong",
};

/** Compact numeric risk indicator for dense tables: score + mini bar. */
export function RiskBadge({ score, className }: { score: number; className?: string }) {
  const severity = scoreToSeverity(score);
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("tabular text-[13px] font-semibold w-6 text-right", TEXT_CLASS[severity])}>{score}</span>
      <span className="h-1.5 w-12 overflow-hidden rounded-full bg-surface-sunken">
        <span
          className={cn("block h-full rounded-full", BAR_CLASS[severity])}
          style={{ width: `${Math.max(4, score)}%` }}
        />
      </span>
    </div>
  );
}
