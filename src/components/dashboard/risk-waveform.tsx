"use client";

import { useMemo } from "react";
import { createSeededRandom } from "@/data/constants";
import { cn } from "@/lib/utils";

/** Ambient animated waveform — decorative, not tied to a single call's live audio. */
export function RiskWaveform({ bars = 96, seed = 5, className }: { bars?: number; seed?: number; className?: string }) {
  const heights = useMemo(() => {
    const random = createSeededRandom(seed);
    return Array.from({ length: bars }, (_, i) => {
      const envelope = Math.sin((i / bars) * Math.PI * 2.4) * 0.5 + 0.5;
      return 0.1 + envelope * (0.45 + random() * 0.45);
    });
  }, [bars, seed]);

  return (
    <div className={cn("flex h-20 items-center gap-[3px]", className)} aria-hidden>
      {heights.map((h, i) => (
        <span
          key={i}
          className="w-[3px] shrink-0 rounded-full bg-accent animate-pulse-dot"
          style={{
            height: `${(h * 100).toFixed(2)}%`,
            animationDelay: `${(i % 14) * 90}ms`,
            animationDuration: "1.6s",
          }}
        />
      ))}
    </div>
  );
}
