"use client";

import Link from "next/link";
import type { Call } from "@/types/call";
import { maskPhoneNumber, formatTime } from "@/lib/utils";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { RiskBadge } from "@/components/shared/risk-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldOff } from "lucide-react";

export function SecurityEventsTable({ calls }: { calls: Call[] }) {
  if (calls.length === 0) {
    return <EmptyState icon={ShieldOff} title="No security events" description="No calls match the current filters." />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Severity</TableHead>
          <TableHead>Call ID</TableHead>
          <TableHead>Caller</TableHead>
          <TableHead>Claimed Identity</TableHead>
          <TableHead>Synthetic Score</TableHead>
          <TableHead>Speaker Match</TableHead>
          <TableHead>Risk</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {calls.map((call) => (
          <TableRow key={call.id}>
            <TableCell>
              <SeverityBadge severity={call.severity} />
            </TableCell>
            <TableCell>
              <Link href={`/live-calls/${call.id}`} className="font-mono text-[12.5px] font-medium text-accent hover:underline">
                {call.id}
              </Link>
            </TableCell>
            <TableCell className="font-mono text-[12.5px] text-foreground-muted">{maskPhoneNumber(call.callerNumber)}</TableCell>
            <TableCell>
              <span className="font-medium text-foreground">{call.claimedIdentity}</span>
              <span className="ml-1.5 text-[11.5px] text-foreground-faint">{call.claimedRole}</span>
            </TableCell>
            <TableCell className="tabular">{call.syntheticScore}%</TableCell>
            <TableCell className="tabular">{call.speakerMatchScore}%</TableCell>
            <TableCell>
              <RiskBadge score={call.overallRisk} />
            </TableCell>
            <TableCell>
              <StatusBadge status={call.decision} />
            </TableCell>
            <TableCell className="tabular text-right text-foreground-muted">{formatTime(call.startedAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
