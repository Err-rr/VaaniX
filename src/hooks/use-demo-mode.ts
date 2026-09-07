"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useDemoStore } from "@/store/demo-store";
import { DEMO_STAGES } from "@/lib/demo-scenario";

/**
 * Drives the scripted "AI-Cloned CFO Attack" demo scenario: advances the
 * shared demo store through each analysis stage on a realistic cadence and
 * surfaces the same events an analyst would see as toast notifications.
 * Mount once near the root of the app (in AppShell) so state persists across
 * route changes.
 */
export function useDemoMode() {
  const active = useDemoStore((s) => s.active);
  const stageIndex = useDemoStore((s) => s.stageIndex);
  const isComplete = useDemoStore((s) => s.isComplete);
  const advance = useDemoStore((s) => s.advance);
  const tickDuration = useDemoStore((s) => s.tickDuration);
  const stageTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!active || isComplete) return;
    const nextStage = DEMO_STAGES[stageIndex + 1];
    if (!nextStage) return;
    stageTimeout.current = setTimeout(() => {
      advance();
      toast[nextStage.toastTone === "critical" ? "error" : nextStage.toastTone === "warning" ? "warning" : "message"](
        nextStage.toastTitle,
        { description: nextStage.toastDescription }
      );
    }, nextStage.delayMs);
    return () => {
      if (stageTimeout.current) clearTimeout(stageTimeout.current);
    };
  }, [active, stageIndex, isComplete, advance]);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => tickDuration(), 1000);
    return () => clearInterval(interval);
  }, [active, tickDuration]);
}
