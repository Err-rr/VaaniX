"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SeriesPoint } from "@/data/mock-analytics";

function SimpleTooltip({
  active,
  payload,
  label,
  suffix,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  suffix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border-strong bg-surface-raised px-3 py-2 text-[12px] shadow-lg">
      <p className="font-medium text-foreground">{label}</p>
      <p className="tabular text-foreground-muted">
        {payload[0].value}
        {suffix}
      </p>
    </div>
  );
}

export function TrendLineChart({ data, color = "var(--color-accent)", suffix = "" }: { data: SeriesPoint[]; color?: string; suffix?: string }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="var(--color-chart-grid)" vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: "var(--color-border)" }} tick={{ fontSize: 11, fill: "var(--color-foreground-faint)" }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--color-foreground-faint)" }} width={32} />
        <Tooltip content={<SimpleTooltip suffix={suffix} />} cursor={{ stroke: "var(--color-border-strong)" }} />
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
