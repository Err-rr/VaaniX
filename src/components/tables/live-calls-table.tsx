"use client";

import Link from "next/link";
import { PhoneOff } from "lucide-react";
import type { Call } from "@/types/call";
import { maskPhoneNumber, formatDuration, cn } from "@/lib/utils";
import { RiskBadge } from "@/components/shared/risk-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function StatusPip({ status }: { status: Call["status"] }) {
  const config =
    status === "active"
      ? { label: "Active", cls: "bg-critical animate-pulse-dot" }
      : { label: "Analyzing", cls: "bg-warning animate-pulse-dot" }
  return (
    <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-foreground">
      <span className={cn("size-1.5 rounded-full", config.cls)} />
      {config.label}
    </span>
  );
}

export function LiveCallsTable({ calls }: { calls: Call[] }) {
  if (calls.length === 0) {
    return (
      <EmptyState
        icon={PhoneOff}
        title="No active calls"
        description="There are currently no live or analyzing calls on monitored infrastructure."
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Call ID</TableHead>
          <TableHead>Caller</TableHead>
          <TableHead>Claimed Identity</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Synthetic Risk</TableHead>
          <TableHead>Speaker Match</TableHead>
          <TableHead>Context Risk</TableHead>
          <TableHead>Overall Risk</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {calls.map((call) => (
          <TableRow key={call.id} className={call.severity === "critical" ? "bg-critical-soft/30" : undefined}>
            <TableCell>
              <StatusPip status={call.status} />
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
            <TableCell className="tabular text-foreground-muted">{formatDuration(call.durationSeconds)}</TableCell>
            <TableCell className="tabular">{call.syntheticScore}%</TableCell>
            <TableCell className="tabular">{call.speakerMatchScore}%</TableCell>
            <TableCell className="tabular">{call.contextRiskScore}%</TableCell>
            <TableCell>
              <RiskBadge score={call.overallRisk} />
            </TableCell>
            <TableCell className="text-right">
              <Button asChild size="sm" variant={call.severity === "critical" || call.severity === "high" ? "critical" : "secondary"}>
                <Link href={`/live-calls/${call.id}`}>Investigate</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
