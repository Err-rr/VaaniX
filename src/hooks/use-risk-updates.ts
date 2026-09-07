"use client";

import { useEffect, useState } from "react";

/**
 * Simulates a live counter that ticks upward at a randomized interval,
 * used to give steady-state metrics (e.g. "Calls Analyzed") a live feel
 * without a real streaming backend.
 */
export function useLiveCounter(baseValue: number, options?: { minMs?: number; maxMs?: number; step?: number }) {
  const { minMs = 4000, maxMs = 9000, step = 1 } = options ?? {};
  const [value, setValue] = useState(baseValue);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = minMs + Math.random() * (maxMs - minMs);
      timeout = setTimeout(() => {
        setValue((v) => v + step);
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, [minMs, maxMs, step]);

  return value;
}

/** Forces dependents to re-render on an interval, useful for relative-time labels ("2m ago"). */
export function useClockTick(intervalMs = 15000) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs]);
  return tick;
}
