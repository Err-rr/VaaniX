"use client";

import { useMemo } from "react";
import { createSeededRandom } from "@/data/constants";
import { cn } from "@/lib/utils";

/** Stylized spectral-activity heatmap grid — not a literal audio spectrogram, but a legible visual proxy for it. */
export function Spectrogram({
  columns = 48,
  rows = 14,
  seed = 9,
  active = true,
  className,
}: {
  columns?: number;
  rows?: number;
  seed?: number;
  active?: boolean;
  className?: string;
}) {
  const grid = useMemo(() => {
    const random = createSeededRandom(seed);
    return Array.from({ length: columns }, (_, c) => {
      const centerBias = Math.sin((c / columns) * Math.PI);
      return Array.from({ length: rows }, (_, r) => {
        const rowBias = 1 - Math.abs(r - rows / 2) / (rows / 2);
        const v = centerBias * 0.5 + rowBias * 0.4 + random() * 0.35;
        return Math.max(0, Math.min(1, v));
      });
    });
  }, [columns, rows, seed]);

  return (
    <div className={cn("flex h-24 gap-[2px]", className)} aria-hidden>
      {grid.map((col, c) => (
        <div key={c} className="flex h-full flex-1 flex-col-reverse gap-[2px]">
          {col.map((v, r) => (
            <span
              key={r}
              className={cn("block w-full rounded-[1px]", active && "animate-pulse-dot")}
              style={{
                height: `${(100 / rows).toFixed(3)}%`,
                backgroundColor: "var(--color-accent)",
                opacity: Number((0.08 + v * 0.75).toFixed(3)),
                animationDelay: active ? `${(c % 10) * 70}ms` : undefined,
                animationDuration: "2.2s",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
