import { create } from "zustand";
import type { Call } from "@/types/call";
import { createBaseDemoCall, DEMO_STAGES } from "@/lib/demo-scenario";

interface DemoState {
  active: boolean;
  stageIndex: number;
  call: Call | null;
  isComplete: boolean;
  start: () => void;
  stop: () => void;
  advance: () => void;
  tickDuration: () => void;
}

export const useDemoStore = create<DemoState>((set, get) => ({
  active: false,
  stageIndex: -1,
  call: null,
  isComplete: false,
  start: () =>
    set({
      active: true,
      stageIndex: -1,
      call: createBaseDemoCall(),
      isComplete: false,
    }),
  stop: () => set({ active: false, stageIndex: -1, call: null, isComplete: false }),
  advance: () => {
    const { stageIndex, call } = get();
    if (!call) return;
    const nextIndex = stageIndex + 1;
    if (nextIndex >= DEMO_STAGES.length) {
      set({ isComplete: true });
      return;
    }
    const stage = DEMO_STAGES[nextIndex];
    set({ stageIndex: nextIndex, call: stage.apply(call) });
  },
  tickDuration: () => {
    const { call, active } = get();
    if (!call || !active) return;
    set({ call: { ...call, durationSeconds: call.durationSeconds + 1 } });
  },
}));
