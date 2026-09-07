"use client";

import { useMemo } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Mail, MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { SummaryStrip } from "@/components/dashboard/summary-strip";
import { RecentActivityList } from "@/components/dashboard/recent-activity-list";
import { RiskWaveform } from "@/components/dashboard/risk-waveform";
import { RiskSpectrum } from "@/components/dashboard/risk-spectrum";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KPI_STATS } from "@/data/mock-overview";
import { ALL_CALLS } from "@/data/mock-calls";
import { useLiveCounter } from "@/hooks/use-risk-updates";
import { SEVERITY_ORDER } from "@/lib/risk";

export default function DashboardPage() {
  const callsAnalyzed = useLiveCounter(KPI_STATS[0].value, { minMs: 5000, maxMs: 12000, step: 1 });
  const kpis = useMemo(
    () => KPI_STATS.map((k, i) => (i === 0 ? { ...k, value: callsAnalyzed } : k)),
    [callsAnalyzed]
  );

  const recentActivity = useMemo(
    () =>
      [...ALL_CALLS]
        .sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1))
        .slice(0, 40)
        .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])
        .slice(0, 8),
    []
  );

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div>
        <PageHeader title="Security Overview" subtitle="Real-time voice integrity and impersonation monitoring" />
        <div className="px-6">
          <SummaryStrip stats={kpis} />
        </div>
      </div>

      <section className="px-6">
        <div className="mb-4 border-b border-border pb-3">
          <h2 className="text-[14px] font-semibold text-foreground">Risk Overview</h2>
          <p className="mt-0.5 text-[12.5px] text-foreground-muted">
            Organization-wide voice risk at a glance
          </p>
        </div>
        <Card className="flex flex-col gap-6 px-6 py-6">
          <div className="flex items-start gap-6">
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-foreground-faint">Live Signal</span>
              <RiskWaveform className="mt-2" />
            </div>
            <div className="flex w-[168px] shrink-0 flex-col gap-2">
              <span className="text-right text-[11.5px] text-foreground-faint">Aggregate across active calls</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast.message("Not connected yet", {
                    description: "Will notify the cybersecurity team once the backend is connected.",
                  })
                }
              >
                <Mail className="size-3.5" /> Mail Cybersec
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast.message("Not connected yet", {
                    description: "Will message the user once the backend is connected.",
                  })
                }
              >
                <MessageSquare className="size-3.5" /> Message User
              </Button>
            </div>
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-foreground-faint">Spectral Activity</span>
              <span className="text-[11.5px] text-foreground-faint">Organization-wide</span>
            </div>
            <RiskSpectrum />
          </div>
        </Card>
      </section>

      <section className="px-6">
        <div className="mb-1 flex items-end justify-between gap-3 border-b border-border pb-3">
          <div>
            <h2 className="text-[14px] font-semibold text-foreground">Recent Activity</h2>
            <p className="mt-0.5 text-[12.5px] text-foreground-muted">Latest calls ranked by severity</p>
          </div>
          <Link href="/alerts" className="text-[12.5px] font-medium text-accent hover:underline">
            View all alerts
          </Link>
        </div>
        <RecentActivityList calls={recentActivity} />
      </section>
    </div>
  );
}
