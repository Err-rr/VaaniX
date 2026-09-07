"use client";

import Link from "next/link";
import type { Call } from "@/types/call";
import { formatDateTime, formatDuration, maskPhoneNumber } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/status-badge";
import { RiskBadge } from "@/components/shared/risk-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History } from "lucide-react";

export interface CallHistoryColumns {
  department: boolean;
  duration: boolean;
  channel: boolean;
  agent: boolean;
}

export function CallHistoryTable({ calls, columns }: { calls: Call[]; columns: CallHistoryColumns }) {
  if (calls.length === 0) {
    return <EmptyState icon={History} title="No calls found" description="No calls match the current filters." />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Call ID</TableHead>
          <TableHead>Caller</TableHead>
          <TableHead>Claimed Identity</TableHead>
          {columns.department && <TableHead>Department</TableHead>}
          {columns.agent && <TableHead>Agent</TableHead>}
          {columns.channel && <TableHead>Channel</TableHead>}
          {columns.duration && <TableHead>Duration</TableHead>}
          <TableHead>Synthetic Score</TableHead>
          <TableHead>Speaker Match</TableHead>
          <TableHead>Risk</TableHead>
          <TableHead>Decision</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {calls.map((call) => (
          <TableRow key={call.id}>
            <TableCell className="whitespace-nowrap text-[12.5px] text-foreground-muted">{formatDateTime(call.startedAt)}</TableCell>
            <TableCell>
              <Link href={`/live-calls/${call.id}`} className="font-mono text-[12.5px] font-medium text-accent hover:underline">
                {call.id}
              </Link>
            </TableCell>
            <TableCell className="font-mono text-[12.5px] text-foreground-muted">{maskPhoneNumber(call.callerNumber)}</TableCell>
            <TableCell className="text-[12.5px] text-foreground">{call.claimedIdentity}</TableCell>
            {columns.department && <TableCell className="text-[12.5px] text-foreground-muted">{call.department}</TableCell>}
            {columns.agent && <TableCell className="text-[12.5px] text-foreground-muted">{call.agent}</TableCell>}
            {columns.channel && <TableCell className="text-[12.5px] text-foreground-muted">{call.channel}</TableCell>}
            {columns.duration && <TableCell className="tabular text-[12.5px] text-foreground-muted">{formatDuration(call.durationSeconds)}</TableCell>}
            <TableCell className="tabular">{call.syntheticScore}%</TableCell>
            <TableCell className="tabular">{call.speakerMatchScore}%</TableCell>
            <TableCell>
              <RiskBadge score={call.overallRisk} />
            </TableCell>
            <TableCell>
              <StatusBadge status={call.decision} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
