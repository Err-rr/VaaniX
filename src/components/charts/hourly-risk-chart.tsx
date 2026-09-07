"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SeriesPoint } from "@/data/mock-analytics";

function barColor(value: number) {
  if (value >= 32) return "var(--color-critical)";
  if (value >= 24) return "var(--color-warning)";
  return "var(--color-positive)";
}

export function HourlyRiskChart({ data }: { data: SeriesPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="var(--color-chart-grid)" vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={{ stroke: "var(--color-border)" }}
          tick={{ fontSize: 10, fill: "var(--color-foreground-faint)" }}
          interval={2}
        />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--color-foreground-faint)" }} width={32} />
        <Tooltip
          cursor={{ fill: "var(--color-surface-sunken)" }}
          contentStyle={{
            background: "var(--color-surface-raised)",
            border: "1px solid var(--color-border-strong)",
            borderRadius: 6,
            fontSize: 12,
          }}
          formatter={(value) => [`${value} avg risk`, ""]}
        />
        <Bar dataKey="value" radius={[3, 3, 0, 0]}>
          {data.map((d, i) => (
            <Cell key={i} fill={barColor(d.value)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
