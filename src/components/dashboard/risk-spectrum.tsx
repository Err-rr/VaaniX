"use client";

import { useMemo } from "react";
import { createSeededRandom } from "@/data/constants";
import { cn } from "@/lib/utils";

/** Ambient spectral-activity grid — a stylized proxy for aggregate signal activity, not a literal spectrogram. */
export function RiskSpectrum({
  columns = 56,
  rows = 12,
  seed = 9,
  className,
}: {
  columns?: number;
  rows?: number;
  seed?: number;
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
              className="block w-full rounded-[1px] animate-pulse-dot"
              style={{
                height: `${(100 / rows).toFixed(3)}%`,
                backgroundColor: "var(--color-accent)",
                opacity: Number((0.08 + v * 0.75).toFixed(3)),
                animationDelay: `${(c % 10) * 70}ms`,
                animationDuration: "2.2s",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
