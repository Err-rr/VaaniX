import { LiveMicWidget } from "@/components/calls/live-mic-widget";

/** Live Microphone Voice Analysis Visualizer component for Nes2Net real-time detection. */
export function VoiceAnalysisVisual({ className }: { className?: string }) {
  return <LiveMicWidget className={className} />;
}
