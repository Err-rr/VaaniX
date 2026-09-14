"use client";

import { useMemo } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle } from "lucide-react";
import type { ActivityPoint, AnomalyMarker } from "@/data/mock-overview";
import { formatNumber } from "@/lib/utils";

interface ActivityChartProps {
  data: ActivityPoint[];
  anomalies: AnomalyMarker[];
}

interface TooltipPayloadEntry {
  payload: ActivityPoint;
}

function ChartTooltip({
  active,
  payload,
  label,
  anomaliesByLabel,
}: {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
  anomaliesByLabel: Record<string, AnomalyMarker>;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  const anomaly = label ? anomaliesByLabel[label] : undefined;

  return (
    <div className="min-w-[210px] max-w-[calc(100vw-2rem)] rounded-md border border-border-strong bg-surface-raised p-3 text-[12px] shadow-lg">
      <p className="mb-1.5 font-semibold text-foreground">{label}</p>
      <dl className="space-y-0.5">
        <div className="flex items-center justify-between">
          <dt className="text-foreground-muted">Calls analyzed</dt>
          <dd className="tabular font-medium text-foreground">{formatNumber(point.calls)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-foreground-muted">Risk events</dt>
          <dd className="tabular font-medium text-foreground">{point.riskEvents}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-foreground-muted">Critical alerts</dt>
          <dd className="tabular font-medium text-critical-strong">{point.criticalAlerts}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-foreground-muted">Synthetic detections</dt>
          <dd className="tabular font-medium text-foreground">{point.syntheticDetections}</dd>
        </div>
      </dl>
      {anomaly && (
        <div className="mt-2 border-t border-border pt-2">
          <p className="mb-1 flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-wide text-critical-strong">
            <AlertTriangle className="size-3" /> Anomaly detected
          </p>
          <dl className="space-y-0.5">
            <div className="flex items-center justify-between">
              <dt className="text-foreground-muted">Call ID</dt>
              <dd className="font-mono text-foreground">{anomaly.callId}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-foreground-muted">Caller</dt>
              <dd className="text-foreground">{anomaly.caller}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-foreground-muted">Risk score</dt>
              <dd className="tabular font-semibold text-critical-strong">{anomaly.riskScore}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-foreground-muted">Decision</dt>
              <dd className="text-foreground">{anomaly.decision}</dd>
            </div>
          </dl>
          <p className="mt-1.5 leading-snug text-foreground-muted">{anomaly.reason}</p>
        </div>
      )}
    </div>
  );
}

export function ActivityChart({ data, anomalies }: ActivityChartProps) {
  const anomaliesByLabel = useMemo(() => {
    const map: Record<string, AnomalyMarker> = {};
    for (const a of anomalies) map[a.timestamp] = a;
    return map;
  }, [anomalies]);

  const scatterData = useMemo(
    () => anomalies.map((a) => ({ label: a.timestamp, riskEvents: data[a.index]?.riskEvents ?? 0 })),
    [anomalies, data]
  );

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="callsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.16} />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--color-chart-grid)" vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={{ stroke: "var(--color-border)" }}
          tick={{ fontSize: 11, fill: "var(--color-foreground-faint)" }}
          minTickGap={24}
        />
        <YAxis
          yAxisId="volume"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: "var(--color-foreground-faint)" }}
          width={36}
        />
        <YAxis
          yAxisId="risk"
          orientation="right"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: "var(--color-foreground-faint)" }}
          width={30}
        />
        <Tooltip content={<ChartTooltip anomaliesByLabel={anomaliesByLabel} />} cursor={{ stroke: "var(--color-border-strong)" }} />
        <Area
          yAxisId="volume"
          type="monotone"
          dataKey="calls"
          stroke="var(--color-accent)"
          strokeWidth={1.75}
          fill="url(#callsFill)"
          name="Calls analyzed"
        />
        <Line
          yAxisId="risk"
          type="monotone"
          dataKey="riskEvents"
          stroke="var(--color-warning)"
          strokeWidth={1.75}
          dot={false}
          name="Risk events"
        />
        <Line
          yAxisId="risk"
          type="monotone"
          dataKey="criticalAlerts"
          stroke="var(--color-critical)"
          strokeWidth={1.75}
          dot={false}
          name="Critical alerts"
        />
        <Line
          yAxisId="risk"
          type="monotone"
          dataKey="syntheticDetections"
          stroke="var(--color-info)"
          strokeWidth={1.5}
          strokeDasharray="3 3"
          dot={false}
          name="Synthetic detections"
        />
        <Scatter
          yAxisId="risk"
          data={scatterData}
          dataKey="riskEvents"
          shape={(props: { cx?: number; cy?: number }) => (
            <svg x={(props.cx ?? 0) - 5} y={(props.cy ?? 0) - 5} width={10} height={10} viewBox="0 0 10 10">
              <path d="M5 0 L10 5 L5 10 L0 5 Z" fill="var(--color-critical)" stroke="var(--color-surface)" strokeWidth={1} />
            </svg>
          )}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
