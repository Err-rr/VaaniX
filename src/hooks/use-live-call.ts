"use client";

import { useMemo } from "react";
import { getCallById, LIVE_CALLS } from "@/data/mock-calls";
import type { Call } from "@/types/call";

export function useLiveCall(id: string): { call: Call | undefined } {
  return useMemo(() => ({ call: getCallById(id) }), [id]);
}

export function useLiveCallsList(): Call[] {
  return LIVE_CALLS;
}
