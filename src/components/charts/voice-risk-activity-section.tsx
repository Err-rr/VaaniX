"use client";

import { useState } from "react";
import { ChartCard } from "@/components/charts/chart-card";
import { ActivityChart } from "@/components/charts/activity-chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ACTIVITY_SERIES, ANOMALY_MARKERS, type TimeRange } from "@/data/mock-overview";

const TIME_RANGES: TimeRange[] = ["24H", "7D", "30D", "90D"];

const CHART_LEGEND = [
  { key: "calls", label: "Calls analyzed", color: "var(--color-accent)" },
  { key: "riskEvents", label: "Risk events", color: "var(--color-warning)" },
  { key: "criticalAlerts", label: "Critical alerts", color: "var(--color-critical)" },
  { key: "syntheticDetections", label: "Synthetic detections", color: "var(--color-info)", dashed: true },
];

export function VoiceRiskActivitySection() {
  const [range, setRange] = useState<TimeRange>("24H");

  return (
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
  );
}
