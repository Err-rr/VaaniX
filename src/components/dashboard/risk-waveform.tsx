"use client";

import { useEffect, useMemo, useRef } from "react";
import { createSeededRandom } from "@/data/constants";
import { cn } from "@/lib/utils";

/**
 * Ambient "always analyzing" visual for the dashboard — a purely frontend
 * effect, not wired to any real backend analysis state. Each bar's height
 * is redrawn every frame from a phase-shifted oscillator so the signal
 * actually moves, rather than sitting on a fixed shape.
 */
export function RiskWaveform({
  bars = 96,
  seed = 5,
  active = true,
  className,
}: {
  bars?: number;
  seed?: number;
  active?: boolean;
  className?: string;
}) {
  const baseHeights = useMemo(() => {
    const random = createSeededRandom(seed);
    return Array.from({ length: bars }, (_, i) => {
      const envelope = Math.sin((i / bars) * Math.PI * 2.4) * 0.5 + 0.5;
      return 0.1 + envelope * (0.45 + random() * 0.45);
    });
  }, [bars, seed]);

  const phases = useMemo(() => {
    const random = createSeededRandom(seed + 1);
    return Array.from({ length: bars }, () => random() * Math.PI * 2);
  }, [bars, seed]);

  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!active) {
      barRefs.current.forEach((el, i) => {
        if (el) el.style.height = `${(baseHeights[i] * 100).toFixed(2)}%`;
      });
      return;
    }

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = (now - start) / 1000;
      barRefs.current.forEach((el, i) => {
        if (!el) return;
        const speed = 2.1 + (i % 7) * 0.16;
        const wobble = Math.sin(t * speed + phases[i]) * 0.5 + 0.5;
        const h = Math.min(1, baseHeights[i] * (0.5 + wobble * 0.75));
        el.style.height = `${(h * 100).toFixed(2)}%`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, baseHeights, phases]);

  return (
    <div className={cn("flex h-20 w-full items-center gap-[2px] overflow-hidden sm:gap-[3px]", className)} aria-hidden>
      {baseHeights.map((h, i) => (
        <span
          key={i}
          ref={(el) => {
            barRefs.current[i] = el;
          }}
          className={cn("min-w-0 flex-1 rounded-full transition-colors duration-300", active ? "bg-accent" : "bg-border-strong")}
          style={{ height: `${(h * 100).toFixed(2)}%` }}
        />
      ))}
    </div>
  );
}
