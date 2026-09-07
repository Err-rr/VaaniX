"use client";

import Link from "next/link";
import type { Investigation } from "@/types/investigation";
import { formatDateTime } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/status-badge";
import { RiskBadge } from "@/components/shared/risk-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FolderSearch } from "lucide-react";

export function InvestigationsTable({ investigations }: { investigations: Investigation[] }) {
  if (investigations.length === 0) {
    return <EmptyState icon={FolderSearch} title="No investigations" description="No investigations match the current filters." />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Investigation ID</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Related Calls</TableHead>
          <TableHead>Risk</TableHead>
          <TableHead>Analyst</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {investigations.map((inv) => (
          <TableRow key={inv.id}>
            <TableCell>
              <Link href={`/investigations/${inv.id}`} className="font-mono text-[12.5px] font-medium text-accent hover:underline">
                {inv.id}
              </Link>
            </TableCell>
            <TableCell>
              <p className="text-[13px] font-medium text-foreground">{inv.title}</p>
              <p className="text-[11.5px] text-foreground-faint">{inv.subject}</p>
            </TableCell>
            <TableCell className="text-[12.5px] text-foreground-muted">
              {inv.relatedCallIds.length > 0 ? (
                <span className="font-mono">{inv.relatedCallIds.join(", ")}</span>
              ) : (
                <span className="text-foreground-faint">—</span>
              )}
            </TableCell>
            <TableCell>
              <RiskBadge score={inv.riskScore} />
            </TableCell>
            <TableCell className="text-[12.5px] text-foreground">{inv.analyst}</TableCell>
            <TableCell className="text-[12.5px] text-foreground-muted">{formatDateTime(inv.createdAt)}</TableCell>
            <TableCell>
              <StatusBadge status={inv.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
