import { ArrowDown, ArrowUp } from "lucide-react";
import type { KpiStat } from "@/data/mock-overview";
import { cn, formatNumber } from "@/lib/utils";

function formatValue(stat: KpiStat): string {
  if (stat.format === "number") return formatNumber(stat.value);
  if (stat.format === "score") return stat.value.toFixed(1);
  return `${stat.value}%`;
}

/** Single editorial strip presenting the headline metrics as inline stat groups, not separate cards. */
export function SummaryStrip({ stats }: { stats: KpiStat[] }) {
  return (
    // Grid + `gap-px bg-border` draws hairline dividers via the gap itself, so wrapped
    // rows on narrow screens don't end up with stray/misaligned `divide-x` borders.
    <div className="grid grid-cols-2 gap-px border-y border-border bg-border sm:flex sm:flex-wrap sm:gap-0 sm:divide-x sm:divide-border sm:bg-transparent">
      {stats.map((stat) => {
        const TrendIcon = stat.trendDirection === "up" ? ArrowUp : ArrowDown;
        const trendColor = stat.trendIsGood ? "text-positive-strong" : "text-critical-strong";
        return (
          <div
            key={stat.id}
            className="flex min-w-0 flex-col gap-1 bg-background px-4 py-4 sm:min-w-[180px] sm:flex-1 sm:bg-transparent sm:px-6 sm:py-5 sm:first:pl-0"
          >
            <span className="text-[12px] font-medium uppercase tracking-wide text-foreground-muted">{stat.label}</span>
            <div className="flex items-baseline gap-2.5">
              <span className="tabular text-[26px] font-semibold leading-none text-foreground">
                {formatValue(stat)}
              </span>
              <span className={cn("flex items-center gap-0.5 text-[12px] font-medium", trendColor)}>
                <TrendIcon className="size-3" />
                {stat.trend}%
              </span>
            </div>
            <span className="text-[11.5px] text-foreground-faint">{stat.comparison}</span>
          </div>
        );
      })}
    </div>
  );
}
