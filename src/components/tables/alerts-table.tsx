"use client";

import type { Alert } from "@/types/alert";
import { formatRelativeTime } from "@/lib/utils";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { RiskBadge } from "@/components/shared/risk-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BellOff } from "lucide-react";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AlertsTable({ alerts, onSelect }: { alerts: Alert[]; onSelect: (alert: Alert) => void }) {
  if (alerts.length === 0) {
    return <EmptyState icon={BellOff} title="No alerts" description="No alerts match the current filters." />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Alert ID</TableHead>
          <TableHead>Severity</TableHead>
          <TableHead>Call</TableHead>
          <TableHead>Reason</TableHead>
          <TableHead>Risk</TableHead>
          <TableHead>Assigned To</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {alerts.map((alert) => (
          <TableRow key={alert.id} className="cursor-pointer" onClick={() => onSelect(alert)}>
            <TableCell className="font-mono text-[12.5px] font-medium text-accent">{alert.id}</TableCell>
            <TableCell>
              <SeverityBadge severity={alert.severity} />
            </TableCell>
            <TableCell className="font-mono text-[12.5px] text-foreground-muted">{alert.callId}</TableCell>
            <TableCell className="max-w-[260px] truncate text-foreground">{alert.reason}</TableCell>
            <TableCell>
              <RiskBadge score={alert.riskScore} />
            </TableCell>
            <TableCell>
              {alert.assignedTo ? (
                <span className="flex items-center gap-2">
                  <Avatar className="size-6">
                    <AvatarFallback className="text-[10px]">{initials(alert.assignedTo)}</AvatarFallback>
                  </Avatar>
                  <span className="text-[12.5px] text-foreground">{alert.assignedTo}</span>
                </span>
              ) : (
                <span className="text-[12.5px] text-foreground-faint">Unassigned</span>
              )}
            </TableCell>
            <TableCell className="text-[12.5px] text-foreground-muted">{formatRelativeTime(alert.createdAt)}</TableCell>
            <TableCell>
              <StatusBadge status={alert.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
