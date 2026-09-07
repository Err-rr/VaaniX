"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { CallMeta } from "@/components/calls/call-meta";
import { RiskGauge } from "@/components/calls/risk-gauge";
import { SignalRow } from "@/components/calls/signal-panel";
import { EvidencePanel } from "@/components/calls/evidence-panel";
import { ActionPanel } from "@/components/calls/action-panel";
import { RiskTimeline } from "@/components/calls/risk-timeline";
import { VoiceAnalysisVisual } from "@/components/calls/voice-analysis-visual";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLiveCall } from "@/hooks/use-live-call";
import { formatCurrencyINR } from "@/lib/utils";

export default function LiveCallAnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { call } = useLiveCall(id);

  if (!call) {
    notFound();
  }

  const isActive = call.status === "active" || call.status === "analyzing";

  return (
    <div className="flex flex-col pb-10">
      <div className="px-6 pt-4">
        <Link href="/live-calls" className="inline-flex items-center gap-1 text-[12.5px] font-medium text-foreground-muted hover:text-foreground">
          <ChevronLeft className="size-3.5" /> Live Call Monitoring
        </Link>
      </div>

      <PageHeader
        title="Live Call Analysis"
        subtitle="Voice identity and behavioral analysis"
        actions={
          <>
            <SeverityBadge severity={call.severity} />
            <StatusBadge status={call.decision} />
            {isActive && (
              <span className="flex items-center gap-1.5 rounded-md border border-critical/25 bg-critical-soft px-2.5 py-1 text-[11.5px] font-semibold text-critical-strong">
                <span className="size-1.5 rounded-full bg-critical animate-pulse-dot" /> LIVE
              </span>
            )}
          </>
        }
      />

      <div className="px-6">
        <Card className="px-5 py-4">
          <CallMeta call={call} />
          {call.transactionContext && (
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3 text-[12.5px]">
              <span className="font-medium text-foreground-muted">Transaction context:</span>
              <span className="text-foreground">{call.transactionContext}</span>
              {call.transactionAmount && (
                <span className="rounded-md bg-warning-soft px-2 py-0.5 font-semibold text-warning-strong">
                  {formatCurrencyINR(call.transactionAmount)}
                </span>
              )}
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 px-6 pt-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardHeader className="border-b border-border pb-3">
              <CardTitle className="text-[14px]">Voice Analysis</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 pt-4">
              <VoiceAnalysisVisual />
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-[12px] text-foreground-muted">
                <span>Signal quality: Good</span>
                <span>Channel: {call.channel}</span>
                <span>Segment: {call.durationSeconds}s</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-border pb-3">
              <CardTitle className="text-[14px]">AI Analysis Signals</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border pt-0">
              {call.signals.map((signal) => (
                <SignalRow key={signal.key} signal={signal} />
              ))}
            </CardContent>
          </Card>

          <EvidencePanel evidence={call.evidence} assessment={call.systemAssessment} />
          <RiskTimeline events={call.timeline} />
        </div>

        <div className="flex flex-col gap-4">
          <Card className="px-5 py-5">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-foreground-faint">
                Impersonation Risk
              </span>
              <RiskGauge
                size={168}
                score={call.overallRisk}
                label={call.overallRisk >= 60 ? "Possible AI voice impersonation" : "No impersonation detected"}
              />
            </div>
            <Separator className="my-5" />
            <ActionPanel severity={call.severity} />
          </Card>
        </div>
      </div>
    </div>
  );
}
