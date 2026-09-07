import type { TimelineEvent } from "@/types/call";
import { formatTime, cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const TONE_DOT: Record<TimelineEvent["tone"], string> = {
  neutral: "bg-foreground-faint",
  info: "bg-info",
  success: "bg-positive",
  warning: "bg-warning",
  critical: "bg-critical",
};

export function RiskTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <Card>
      <CardHeader className="border-b border-border pb-3">
        <CardTitle className="text-[14px]">Call Timeline</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <ol className="flex flex-col">
          {events.map((event, i) => (
            <li key={event.id} className="relative flex gap-3 pb-4 last:pb-0">
              {i < events.length - 1 && (
                <span className="absolute left-[5px] top-3 h-full w-px bg-border" aria-hidden />
              )}
              <span className={cn("mt-1.5 size-[11px] shrink-0 rounded-full border-2 border-surface", TONE_DOT[event.tone])} />
              <div className="min-w-0 flex-1 pb-0.5">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[13px] font-medium text-foreground">{event.label}</p>
                  <span className="tabular shrink-0 text-[11.5px] text-foreground-faint">{formatTime(event.timestamp)}</span>
                </div>
                {event.detail && <p className="mt-0.5 text-[12px] text-foreground-muted">{event.detail}</p>}
              </div>
            </li>
          ))}
          {events.length === 0 && <p className="text-[12.5px] text-foreground-faint">No events recorded yet.</p>}
        </ol>
      </CardContent>
    </Card>
  );
}
