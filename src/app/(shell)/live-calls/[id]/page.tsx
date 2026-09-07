"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { CallMeta } from "@/components/calls/call-meta";
import { RiskGauge } from "@/components/calls/risk-gauge";
import { SignalPanel } from "@/components/calls/signal-panel";
import { EvidencePanel } from "@/components/calls/evidence-panel";
import { ActionPanel } from "@/components/calls/action-panel";
import { RiskTimeline } from "@/components/calls/risk-timeline";
import { Waveform } from "@/components/calls/waveform";
import { Spectrogram } from "@/components/calls/spectrogram";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLiveCall } from "@/hooks/use-live-call";
import { formatCurrencyINR } from "@/lib/utils";

export default function LiveCallAnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { call, isLiveDemo } = useLiveCall(id);

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
        subtitle={isLiveDemo ? "Simulated scenario — AI-Cloned CFO Attack" : "Full authenticity, identity, and behavioral analysis"}
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
            <CardContent className="flex flex-col gap-5 pt-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-foreground-faint">Live Waveform</span>
                  <span className="text-[11.5px] text-foreground-faint">Signal quality: Good</span>
                </div>
                <Waveform active={isActive} severity={call.severity} seed={call.id.length} />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-foreground-faint">Spectral Activity</span>
                  <span className="text-[11.5px] text-foreground-faint">Analysis window: 4.0s</span>
                </div>
                <Spectrogram active={isActive} seed={call.id.length + 3} />
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-border pt-3 text-[12px] text-foreground-muted">
                <span>Current segment: {call.durationSeconds}s</span>
                <span>Channel: {call.channel}</span>
                <span>Sample rate: 16 kHz</span>
              </div>
            </CardContent>
          </Card>

          <div>
            <h3 className="mb-2 px-0.5 text-[13px] font-semibold text-foreground">AI Analysis Signals</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {call.signals.map((signal) => (
                <SignalPanel key={signal.key} signal={signal} />
              ))}
            </div>
          </div>

          <EvidencePanel evidence={call.evidence} assessment={call.systemAssessment} />
          <RiskTimeline events={call.timeline} />
        </div>

        <div className="flex flex-col gap-4">
          <Card className="flex flex-col items-center gap-3 px-5 py-6">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-foreground-faint">
              Impersonation Risk
            </span>
            <RiskGauge
              score={call.overallRisk}
              label={call.overallRisk >= 60 ? "Possible AI voice impersonation" : "No impersonation detected"}
            />
          </Card>
          <ActionPanel severity={call.severity} />
          <Card className="px-4 py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-faint">Voice Profile</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[13px] font-medium text-foreground">{call.claimedIdentity}</span>
              <Button asChild variant="link" size="sm" className="text-[12px]">
                <Link href="/voice-profiles">View profile</Link>
              </Button>
            </div>
            <p className="mt-0.5 text-[12px] text-foreground-muted">{call.claimedRole} · {call.department}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
