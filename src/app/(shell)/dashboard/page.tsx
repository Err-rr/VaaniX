"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { SummaryStrip } from "@/components/dashboard/summary-strip";
import { RecentActivityList } from "@/components/dashboard/recent-activity-list";
import { RiskWaveform } from "@/components/dashboard/risk-waveform";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { KPI_STATS } from "@/data/mock-overview";
import { useLiveCounter } from "@/hooks/use-risk-updates";
import { useFraudReports } from "@/hooks/use-fraud-reports";

export default function DashboardPage() {
  const callsAnalyzed = useLiveCounter(KPI_STATS[0].value, { minMs: 5000, maxMs: 12000, step: 1 });
  const kpis = useMemo(
    () => KPI_STATS.map((k, i) => (i === 0 ? { ...k, value: callsAnalyzed } : k)),
    [callsAnalyzed]
  );

  const { reports, refetch } = useFraudReports();

  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  async function handleRefresh() {
    setRefreshing(true);
    setRefreshError(null);
    try {
      const res = await fetch("/api/emails/refresh", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Refresh failed");
      await refetch();
    } catch (err) {
      setRefreshError(err instanceof Error ? err.message : "Refresh failed");
    } finally {
      setRefreshing(false);
    }
  }

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
          <RiskWaveform className="mt-2" />
        </Card>
      </section>

      <section className="px-6">
        <div className="mb-1 flex items-end justify-between gap-3 border-b border-border pb-3">
          <div>
            <h2 className="text-[14px] font-semibold text-foreground">Recent Activity</h2>
            <p className="mt-0.5 text-[12.5px] text-foreground-muted">Latest AI voice-clone fraud reports</p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-1.5 text-[12.5px] font-medium text-accent hover:underline disabled:cursor-not-allowed disabled:opacity-60 disabled:no-underline"
            >
              <RefreshCw className={cn("size-3.5", refreshing && "animate-spin")} />
              {refreshing ? "Refreshing…" : "Refresh"}
            </button>
            <Link href="/alerts" className="text-[12.5px] font-medium text-accent hover:underline">
              View all alerts
            </Link>
          </div>
        </div>
        {refreshError && (
          <p className="mb-2 text-[12px] text-critical-strong">{refreshError}</p>
        )}
        <RecentActivityList reports={reports} />
      </section>
    </div>
  );
}
