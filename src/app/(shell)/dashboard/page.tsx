"use client";

import { useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { SummaryStrip } from "@/components/dashboard/summary-strip";
import { RecentActivityList } from "@/components/dashboard/recent-activity-list";
import { RiskWaveform } from "@/components/dashboard/risk-waveform";
import { Card } from "@/components/ui/card";
import { KPI_STATS } from "@/data/mock-overview";
import { useLiveCounter } from "@/hooks/use-risk-updates";
import { useFraudReports } from "@/hooks/use-fraud-reports";
import { useIsAnalyzing } from "@/store/analysis-store";

export default function DashboardPage() {
  const callsAnalyzed = useLiveCounter(KPI_STATS[0].value, { minMs: 5000, maxMs: 12000, step: 1 });
  const kpis = useMemo(
    () => KPI_STATS.map((k, i) => (i === 0 ? { ...k, value: callsAnalyzed } : k)),
    [callsAnalyzed]
  );

  const { reports } = useFraudReports();
  const isAnalyzing = useIsAnalyzing();

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
        <Card className="flex flex-col gap-2 px-6 py-6">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-foreground-faint">Live Signal</span>
          <RiskWaveform className="mt-2" active={isAnalyzing} />
        </Card>
      </section>

      <section className="px-6">
        <div className="mb-1 flex items-end justify-between gap-3 border-b border-border pb-3">
          <div>
            <h2 className="text-[14px] font-semibold text-foreground">Recent Activity</h2>
            <p className="mt-0.5 text-[12.5px] text-foreground-muted">Latest AI voice-clone fraud reports</p>
          </div>
          <Link href="/alerts" className="text-[12.5px] font-medium text-accent hover:underline">
            View all alerts
          </Link>
        </div>
        <RecentActivityList reports={reports} />
      </section>
    </div>
  );
}
