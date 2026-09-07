"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SeriesPoint } from "@/data/mock-analytics";

function barColor(value: number, max: number) {
  const ratio = value / max;
  if (ratio > 0.75) return "var(--color-critical)";
  if (ratio > 0.5) return "var(--color-warning)";
  if (ratio > 0.25) return "var(--color-info)";
  return "var(--color-positive)";
}

export function HorizontalBarChart({ data, suffix = "" }: { data: SeriesPoint[]; suffix?: string }) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <ResponsiveContainer width="100%" height={Math.max(180, data.length * 34)}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 20, left: 8, bottom: 4 }}>
        <CartesianGrid stroke="var(--color-chart-grid)" horizontal={false} />
        <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--color-foreground-faint)" }} />
        <YAxis
          type="category"
          dataKey="label"
          tickLine={false}
          axisLine={false}
          width={130}
          tick={{ fontSize: 12, fill: "var(--color-foreground-muted)" }}
        />
        <Tooltip
          cursor={{ fill: "var(--color-surface-sunken)" }}
          contentStyle={{
            background: "var(--color-surface-raised)",
            border: "1px solid var(--color-border-strong)",
            borderRadius: 6,
            fontSize: 12,
          }}
          formatter={(value) => [`${value}${suffix}`, "Value"]}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
          {data.map((d, i) => (
            <Cell key={i} fill={barColor(d.value, max)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
