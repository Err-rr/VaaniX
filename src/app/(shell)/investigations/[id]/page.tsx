"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { RiskBadge } from "@/components/shared/risk-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getInvestigationById } from "@/data/mock-investigations";
import { getCallById } from "@/data/mock-calls";
import { formatDateTime, maskPhoneNumber } from "@/lib/utils";
import { SeverityBadge } from "@/components/shared/severity-badge";

export default function InvestigationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const investigation = getInvestigationById(id);

  if (!investigation) notFound();

  const relatedCalls = investigation.relatedCallIds.map((cid) => getCallById(cid)).filter(Boolean);

  return (
    <div className="flex flex-col pb-10">
      <div className="px-6 pt-4">
        <Link href="/investigations" className="inline-flex items-center gap-1 text-[12.5px] font-medium text-foreground-muted hover:text-foreground">
          <ChevronLeft className="size-3.5" /> Investigations
        </Link>
      </div>

      <PageHeader
        title={investigation.title}
        subtitle={investigation.subject}
        actions={<StatusBadge status={investigation.status} />}
      />

      <div className="grid grid-cols-1 gap-4 px-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardHeader className="border-b border-border pb-3">
              <CardTitle className="text-[14px]">Case Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-[13.5px] leading-relaxed text-foreground">{investigation.summary}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-border pb-3">
              <CardTitle className="text-[14px]">Related Calls</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col divide-y divide-border pt-4">
              {relatedCalls.length === 0 && (
                <p className="py-2 text-[12.5px] text-foreground-faint">No related calls linked to this investigation.</p>
              )}
              {relatedCalls.map((call) => (
                <div key={call!.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <SeverityBadge severity={call!.severity} />
                    <div>
                      <p className="font-mono text-[12.5px] font-medium text-foreground">{call!.id}</p>
                      <p className="text-[11.5px] text-foreground-faint">
                        {call!.claimedIdentity} · {maskPhoneNumber(call!.callerNumber)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <RiskBadge score={call!.overallRisk} />
                    <Button asChild size="sm" variant="secondary">
                      <Link href={`/live-calls/${call!.id}`}>
                        Open <ArrowUpRight className="size-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="px-4 py-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-foreground-faint">Case Details</p>
            <dl className="flex flex-col gap-3 text-[13px]">
              <div className="flex items-center justify-between">
                <dt className="text-foreground-muted">Investigation ID</dt>
                <dd className="font-mono font-medium text-foreground">{investigation.id}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-foreground-muted">Risk Score</dt>
                <dd>
                  <RiskBadge score={investigation.riskScore} />
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-foreground-muted">Assigned Analyst</dt>
                <dd className="font-medium text-foreground">{investigation.analyst}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-foreground-muted">Created</dt>
                <dd className="text-foreground">{formatDateTime(investigation.createdAt)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-foreground-muted">Last Updated</dt>
                <dd className="text-foreground">{formatDateTime(investigation.updatedAt)}</dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}
