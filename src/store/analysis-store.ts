import { create } from "zustand";

interface AnalysisState {
  activeCount: number;
  begin: () => void;
  end: () => void;
}

/**
 * Tracks how many voice-detection analyses are genuinely in flight right
 * now (driven by use-live-detection's "analyzing" state), so ambient UI
 * elsewhere in the app — like the dashboard's Live Signal waveform — can
 * reflect real backend activity instead of animating on a fake loop.
 */
export const useAnalysisStore = create<AnalysisState>((set) => ({
  activeCount: 0,
  begin: () => set((s) => ({ activeCount: s.activeCount + 1 })),
  end: () => set((s) => ({ activeCount: Math.max(0, s.activeCount - 1) })),
}));

export function useIsAnalyzing(): boolean {
  return useAnalysisStore((s) => s.activeCount > 0);
}
