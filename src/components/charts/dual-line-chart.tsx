"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DualSeriesPoint } from "@/data/mock-analytics";

export function DualLineChart({
  data,
  labelA,
  labelB,
}: {
  data: DualSeriesPoint[];
  labelA: string;
  labelB: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="var(--color-chart-grid)" vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: "var(--color-border)" }} tick={{ fontSize: 11, fill: "var(--color-foreground-faint)" }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--color-foreground-faint)" }} width={32} />
        <Tooltip
          contentStyle={{
            background: "var(--color-surface-raised)",
            border: "1px solid var(--color-border-strong)",
            borderRadius: 6,
            fontSize: 12,
          }}
        />
        <Line type="monotone" dataKey="a" name={labelA} stroke="var(--color-warning)" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="b" name={labelB} stroke="var(--color-critical)" strokeWidth={2} dot={false} strokeDasharray="4 3" />
      </LineChart>
    </ResponsiveContainer>
  );
}
