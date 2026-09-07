"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ChartCard } from "@/components/charts/chart-card";
import { ActivityChart } from "@/components/charts/activity-chart";
import { SecurityEventsTable } from "@/components/tables/security-events-table";
import { FilterBar } from "@/components/shared/filter-bar";
import { FilterSelect } from "@/components/shared/filter-select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KPI_STATS, ACTIVITY_SERIES, ANOMALY_MARKERS, type TimeRange } from "@/data/mock-overview";
import { ALL_CALLS } from "@/data/mock-calls";
import { ORGANIZATION } from "@/data/constants";
import { useLiveCounter } from "@/hooks/use-risk-updates";
import { SEVERITY_ORDER } from "@/lib/risk";
import type { Severity } from "@/types/common";

const TIME_RANGES: TimeRange[] = ["24H", "7D", "30D", "90D"];

const SEVERITY_OPTIONS = [
  { value: "all", label: "All" },
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const CHART_LEGEND = [
  { key: "calls", label: "Calls analyzed", color: "var(--color-accent)" },
  { key: "riskEvents", label: "Risk events", color: "var(--color-warning)" },
  { key: "criticalAlerts", label: "Critical alerts", color: "var(--color-critical)" },
  { key: "syntheticDetections", label: "Synthetic detections", color: "var(--color-info)", dashed: true },
];

export default function DashboardPage() {
  const [range, setRange] = useState<TimeRange>("24H");
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("all");

  const callsAnalyzed = useLiveCounter(KPI_STATS[0].value, { minMs: 5000, maxMs: 12000, step: 1 });
  const kpis = useMemo(
    () => KPI_STATS.map((k, i) => (i === 0 ? { ...k, value: callsAnalyzed } : k)),
    [callsAnalyzed]
  );

  const recentEvents = useMemo(() => {
    const sorted = [...ALL_CALLS].sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1)).slice(0, 40);
    return sorted.filter((call) => {
      const matchesSeverity = severity === "all" || call.severity === (severity as Severity);
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        call.id.toLowerCase().includes(q) ||
        call.claimedIdentity.toLowerCase().includes(q) ||
        call.callerNumber.toLowerCase().includes(q);
      return matchesSeverity && matchesSearch;
    }).sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]).slice(0, 12);
  }, [search, severity]);

  return (
    <div className="flex flex-col pb-8">
      <PageHeader
        title="Security Overview"
        subtitle="Real-time voice integrity and impersonation monitoring"
        actions={
          <>
            <div className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-[12.5px] font-medium text-foreground">
              {ORGANIZATION.name}
            </div>
            <div className="flex items-center gap-1.5 rounded-md border border-positive/25 bg-positive-soft px-3 py-1.5 text-[12px] font-medium text-positive-strong">
              <span className="size-1.5 rounded-full bg-positive animate-pulse-dot" />
              System Operational
            </div>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 px-6 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((stat, i) => (
          <MetricCard key={stat.id} stat={i === 0 ? { ...stat, emphasis: "primary" } : stat} />
        ))}
      </div>

      <div className="px-6 pt-4">
        <ChartCard
          title="Voice Risk Activity"
          description="Call volume, risk events, and detections over time. Hover markers for anomaly detail."
          actions={
            <Tabs value={range} onValueChange={(v) => setRange(v as TimeRange)}>
              <TabsList>
                {TIME_RANGES.map((r) => (
                  <TabsTrigger key={r} value={r}>
                    {r}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          }
        >
          <ActivityChart data={ACTIVITY_SERIES[range]} anomalies={ANOMALY_MARKERS[range]} />
          <div className="flex flex-wrap items-center gap-4 border-t border-border px-2 pt-3">
            {CHART_LEGEND.map((item) => (
              <div key={item.key} className="flex items-center gap-1.5 text-[11.5px] text-foreground-muted">
                <span
                  className="inline-block h-0.5 w-3"
                  style={{
                    backgroundColor: item.dashed ? "transparent" : item.color,
                    borderTop: item.dashed ? `1.5px dashed ${item.color}` : undefined,
                  }}
                />
                {item.label}
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="px-6 pt-4">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-4">
            <div>
              <h3 className="text-[13px] font-semibold text-foreground">Recent Security Events</h3>
              <p className="mt-0.5 text-[12px] text-foreground-muted">Latest analyzed calls ranked by severity</p>
            </div>
          </div>
          <FilterBar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search calls, identities, numbers…"
            actions={
              <Button variant="secondary" size="sm">
                <Download className="size-3.5" /> Export
              </Button>
            }
          >
            <FilterSelect label="Severity" value={severity} onChange={setSeverity} options={SEVERITY_OPTIONS} />
          </FilterBar>
          <SecurityEventsTable calls={recentEvents} />
        </Card>
      </div>
    </div>
  );
}
