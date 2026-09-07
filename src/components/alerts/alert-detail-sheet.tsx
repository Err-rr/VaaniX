"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Alert } from "@/types/alert";
import { getCallById } from "@/data/mock-calls";
import { formatDateTime, maskPhoneNumber } from "@/lib/utils";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { RiskBadge } from "@/components/shared/risk-badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export function AlertDetailSheet({ alert, onOpenChange }: { alert: Alert | null; onOpenChange: (open: boolean) => void }) {
  const call = alert ? getCallById(alert.callId) : undefined;

  return (
    <Sheet open={!!alert} onOpenChange={onOpenChange}>
      <SheetContent widthClassName="max-w-md">
        {alert && (
          <>
            <SheetHeader>
              <div className="flex items-center gap-2">
                <SeverityBadge severity={alert.severity} />
                <StatusBadge status={alert.status} />
              </div>
              <SheetTitle>{alert.id}</SheetTitle>
              <SheetDescription>{alert.reason}</SheetDescription>
            </SheetHeader>
            <SheetBody className="flex flex-col gap-5">
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-foreground-faint">Risk Score</p>
                <RiskBadge score={alert.riskScore} className="gap-3" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-faint">Call ID</p>
                  <p className="mt-0.5 font-mono text-[13px] text-foreground">{alert.callId}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-faint">Caller</p>
                  <p className="mt-0.5 font-mono text-[13px] text-foreground">{maskPhoneNumber(alert.callerNumber)}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-faint">Claimed Identity</p>
                  <p className="mt-0.5 text-[13px] text-foreground">{alert.claimedIdentity}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-faint">Created</p>
                  <p className="mt-0.5 text-[13px] text-foreground">{formatDateTime(alert.createdAt)}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-faint">Assigned To</p>
                  <p className="mt-0.5 text-[13px] text-foreground">{alert.assignedTo ?? "Unassigned"}</p>
                </div>
              </div>

              {call && (
                <div className="rounded-md border border-border bg-surface-sunken/60 p-3.5">
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-foreground-faint">System Assessment</p>
                  <p className="text-[13px] leading-snug text-foreground">{call.systemAssessment}</p>
                </div>
              )}
            </SheetBody>
            <SheetFooter>
              <Button variant="secondary" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button asChild>
                <Link href={`/live-calls/${alert.callId}`}>
                  Open Full Investigation <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
