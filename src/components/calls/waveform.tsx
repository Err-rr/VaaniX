"use client";

import { useMemo } from "react";
import { createSeededRandom } from "@/data/constants";
import { cn } from "@/lib/utils";

/**
 * Stylized live waveform. Bars are pre-generated deterministically and
 * animated with a staggered CSS pulse to suggest continuous audio capture
 * without requiring microphone access or real audio data.
 */
export function Waveform({
  bars = 72,
  active = true,
  seed = 5,
  className,
  severity,
}: {
  bars?: number;
  active?: boolean;
  seed?: number;
  className?: string;
  severity?: "critical" | "high" | "medium" | "low";
}) {
  const heights = useMemo(() => {
    const random = createSeededRandom(seed);
    return Array.from({ length: bars }, (_, i) => {
      const envelope = Math.sin((i / bars) * Math.PI);
      return 0.12 + envelope * (0.5 + random() * 0.5);
    });
  }, [bars, seed]);

  const barColor =
    severity === "critical"
      ? "bg-critical"
      : severity === "high"
        ? "bg-warning"
        : severity === "medium"
          ? "bg-info"
          : "bg-accent";

  return (
    <div className={cn("flex h-16 items-center gap-[3px]", className)} aria-hidden>
      {heights.map((h, i) => (
        <span
          key={i}
          className={cn("w-[3px] rounded-full", barColor, active && "animate-pulse-dot")}
          style={{
            height: `${Math.round(h * 100)}%`,
            animationDelay: active ? `${(i % 12) * 90}ms` : undefined,
            animationDuration: active ? "1.4s" : undefined,
            opacity: active ? undefined : 0.35,
          }}
        />
      ))}
    </div>
  );
}
