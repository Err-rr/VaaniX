import { ArrowDown, ArrowUp } from "lucide-react";
import type { KpiStat } from "@/data/mock-overview";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

function formatValue(stat: KpiStat): string {
  if (stat.format === "number") return formatNumber(stat.value);
  if (stat.format === "score") return stat.value.toFixed(1);
  return `${stat.value}%`;
}

export function MetricCard({ stat }: { stat: KpiStat }) {
  const isPrimary = stat.emphasis === "primary";
  const isCritical = stat.emphasis === "critical";
  const trendColor = stat.trendIsGood ? "text-positive-strong" : "text-critical-strong";
  const TrendIcon = stat.trendDirection === "up" ? ArrowUp : ArrowDown;

  return (
    <Card
      className={cn(
        "relative overflow-hidden px-5 py-4",
        isCritical && "border-critical/30 bg-critical-soft/40",
        isPrimary && "border-accent/30"
      )}
    >
      {isCritical && <span className="absolute inset-y-0 left-0 w-1 bg-critical" aria-hidden />}
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium uppercase tracking-wide text-foreground-muted">{stat.label}</span>
        {isCritical && <span className="size-1.5 rounded-full bg-critical animate-pulse-dot" aria-hidden />}
      </div>
      <div className="mt-2 flex items-baseline gap-3">
        <span
          className={cn(
            "tabular font-semibold leading-none text-foreground",
            isPrimary ? "text-[34px]" : "text-[26px]"
          )}
        >
          {formatValue(stat)}
        </span>
        <span className={cn("flex items-center gap-0.5 text-[12.5px] font-medium", trendColor)}>
          <TrendIcon className="size-3" />
          {stat.trend}%
        </span>
      </div>
      <p className="mt-1.5 text-[12px] text-foreground-faint">{stat.comparison}</p>
    </Card>
  );
}
