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
            className="flex items-center gap-4 py-3 transition-colors hover:bg-surface-sunken/50"
          >
            <SeverityDot severity={call.severity} className="shrink-0" />
            <span className="w-[92px] shrink-0 font-mono text-[12.5px] text-foreground-muted">{call.id}</span>
            <span className="min-w-0 flex-1 truncate text-[13px] text-foreground">
              {call.claimedIdentity}
              <span className="ml-1.5 text-foreground-faint">{maskPhoneNumber(call.callerNumber)}</span>
            </span>
            <span className="tabular w-8 shrink-0 text-right text-[13px] font-semibold text-foreground">
              {call.overallRisk}
            </span>
            <span className="w-[150px] shrink-0">
              <StatusBadge status={call.decision} />
            </span>
            <span className="w-16 shrink-0 text-right text-[12px] text-foreground-faint">
              {formatRelativeTime(call.startedAt)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
