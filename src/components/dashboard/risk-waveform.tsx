"use client";

import { useMemo } from "react";
import { createSeededRandom } from "@/data/constants";
import { cn } from "@/lib/utils";

/**
 * Static by default — bars only animate while `active` is true, driven by
 * a real analysis in flight (see src/store/analysis-store.ts), not a fake
 * perpetual loop. Bars are percentage-widthed (flex-1) instead of a fixed
 * pixel size, so the whole thing compresses to fit any container width
 * instead of overflowing on narrow screens.
 */
export function RiskWaveform({
  bars = 96,
  seed = 5,
  active = false,
  className,
}: {
  bars?: number;
  seed?: number;
  active?: boolean;
  className?: string;
}) {
  const heights = useMemo(() => {
    const random = createSeededRandom(seed);
    return Array.from({ length: bars }, (_, i) => {
      const envelope = Math.sin((i / bars) * Math.PI * 2.4) * 0.5 + 0.5;
      return 0.1 + envelope * (0.45 + random() * 0.45);
    });
  }, [bars, seed]);

  return (
    <div className={cn("flex h-20 w-full items-center gap-[2px] overflow-hidden sm:gap-[3px]", className)} aria-hidden>
      {heights.map((h, i) => (
        <span
          key={i}
          className={cn("min-w-0 flex-1 rounded-full", active ? "bg-accent animate-pulse-dot" : "bg-border-strong")}
          style={{
            height: `${(h * 100).toFixed(2)}%`,
            ...(active
              ? { animationDelay: `${(i % 14) * 90}ms`, animationDuration: "1.6s" }
              : undefined),
          }}
        />
      ))}
    </div>
  );
}
