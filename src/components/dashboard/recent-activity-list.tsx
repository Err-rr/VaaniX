import Link from "next/link";
import type { Call } from "@/types/call";
import { formatRelativeTime, maskPhoneNumber } from "@/lib/utils";
import { SeverityDot } from "@/components/shared/severity-badge";
import { StatusBadge } from "@/components/shared/status-badge";

/** Compact, editorial activity list — not a full data table. Full filtering lives on Alerts / Call History. */
export function RecentActivityList({ calls }: { calls: Call[] }) {
  return (
    <ul className="divide-y divide-border">
      {calls.map((call) => (
        <li key={call.id}>
          <Link
            href={`/live-calls/${call.id}`}
            className="flex flex-wrap items-center gap-x-4 gap-y-1.5 py-3 transition-colors hover:bg-surface-sunken/50"
          >
            <SeverityDot severity={call.severity} className="shrink-0" />
            <span className="shrink-0 font-mono text-[12.5px] text-foreground-muted sm:w-[92px]">{call.id}</span>
            <span className="min-w-0 flex-1 truncate text-[13px] text-foreground">
              {call.claimedIdentity}
              <span className="ml-1.5 text-foreground-faint">{maskPhoneNumber(call.callerNumber)}</span>
            </span>
            <span className="tabular shrink-0 text-[13px] font-semibold text-foreground sm:w-8 sm:text-right">
              {call.overallRisk}
            </span>
            <span className="shrink-0 sm:w-[150px]">
              <StatusBadge status={call.decision} />
            </span>
            <span className="shrink-0 text-[12px] text-foreground-faint sm:w-16 sm:text-right">
              {formatRelativeTime(call.startedAt)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
