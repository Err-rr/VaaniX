"use client";

import { useMemo } from "react";
import { getCallById, LIVE_CALLS } from "@/data/mock-calls";
import { DEMO_CALL_ID } from "@/lib/demo-scenario";
import { useDemoStore } from "@/store/demo-store";
import type { Call } from "@/types/call";

/** Resolves a call by id, transparently sourcing the live demo call from the demo store when active. */
export function useLiveCall(id: string): { call: Call | undefined; isLiveDemo: boolean } {
  const demoCall = useDemoStore((s) => s.call);
  const demoActive = useDemoStore((s) => s.active);

  return useMemo(() => {
    if (id === DEMO_CALL_ID && demoActive && demoCall) {
      return { call: demoCall, isLiveDemo: true };
    }
    return { call: getCallById(id), isLiveDemo: false };
  }, [id, demoActive, demoCall]);
}

export function useLiveCallsList(): Call[] {
  const demoCall = useDemoStore((s) => s.call);
  const demoActive = useDemoStore((s) => s.active);

  return useMemo(() => {
    if (demoActive && demoCall) return [demoCall, ...LIVE_CALLS];
    return LIVE_CALLS;
  }, [demoActive, demoCall]);
}
