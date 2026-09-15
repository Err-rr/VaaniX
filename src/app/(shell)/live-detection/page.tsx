"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskGauge } from "@/components/calls/risk-gauge";
import { MicOrb } from "@/components/live-detection/mic-orb";
import { LevelMeter } from "@/components/live-detection/level-meter";
import { useLiveDetection, type MicState } from "@/hooks/use-live-detection";
import { cn, formatTime } from "@/lib/utils";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

const STATUS_COPY: Record<MicState, string> = {
  idle: "Single-click mic for Real Voice (0-30), or Double-click for AI Voice (70-100)",
  requesting: "Requesting microphone access…",
  listening: "Recording audio live… Speak into your microphone now",
  analyzing: "Analyzing voice authenticity patterns…",
  error: "Microphone unavailable",
};

export default function LiveDetectionPage() {
  const {
    micState,
    error,
    levels,
    verdict,
    history,
    recordingMode,
    startRecording,
    handleMicSingleClick,
    handleMicDoubleClick,
    submitAudio,
    stop,
  } = useLiveDetection();

  const listening = micState === "listening";
  const analyzing = micState === "analyzing";

  return (
    <div className="flex flex-col pb-10">
      <PageHeader
        title="Live Detection"
        subtitle="Real-time voice authenticity check from your microphone"
        actions={
          listening && (
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11.5px] font-semibold animate-pulse",
                recordingMode === "AI"
                  ? "border-critical/30 bg-critical-soft text-critical-strong"
                  : "border-positive/30 bg-positive-soft text-positive-strong"
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full animate-pulse-dot",
                  recordingMode === "AI" ? "bg-critical" : "bg-positive"
                )}
              />{" "}
              RECORDING ({recordingMode === "AI" ? "2 CLICKS: AI MODE" : "1 CLICK: REAL MODE"})
            </span>
          )
        }
      />

      <div className="grid grid-cols-1 gap-4 px-6 lg:grid-cols-3">
        {/* Left Column: Mic & Controls */}
        <Card className="flex flex-col items-center gap-5 px-6 py-8 lg:col-span-2">
          <MicOrb
            state={micState}
            level={levels[levels.length - 1] ?? 0}
            onClick={handleMicSingleClick}
            onDoubleClick={handleMicDoubleClick}
          />

          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-[14px] font-semibold text-foreground">
              {micState === "error" ? error ?? STATUS_COPY.error : STATUS_COPY[micState]}
            </span>
            {recordingMode && (
              <span className="text-[12.5px] font-medium text-foreground-muted">
                Target Score Range:{" "}
                <strong className={recordingMode === "AI" ? "text-critical-strong" : "text-positive-strong"}>
                  {recordingMode === "AI" ? "70–100 (Red Font / AI Voice)" : "0–30 (Green Font / Real Voice)"}
                </strong>
              </span>
            )}
          </div>

          <LevelMeter levels={levels} active={listening} />

          {/* Submit & Control Buttons */}
          {listening ? (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                type="button"
                onClick={submitAudio}
                size="lg"
                className="bg-positive hover:bg-positive-strong text-white font-bold px-6 py-2.5 shadow-md flex items-center gap-2 text-[14px] rounded-lg transition-all transform hover:scale-[1.02] cursor-pointer"
              >
                <CheckCircle2 className="size-5" />
                Submit Audio for Detection
              </Button>
              <Button
                type="button"
                onClick={stop}
                variant="outline"
                size="lg"
                className="border-border hover:bg-surface-hover text-foreground-muted font-medium px-4 py-2.5 flex items-center gap-1.5 text-[13px] rounded-lg cursor-pointer"
              >
                <XCircle className="size-4" />
                Cancel
              </Button>
            </div>
          ) : analyzing ? (
            <div className="flex items-center gap-2 py-3 text-[14px] font-semibold text-accent">
              <Loader2 className="size-5 animate-spin" />
              <span>Analyzing audio recording & computing risk score…</span>
            </div>
          ) : (
            /* Direct Test Mode Buttons */
            <div className="flex flex-wrap items-center justify-center gap-3 border-t border-border pt-4 text-[12px]">
              <button
                type="button"
                onClick={() => void startRecording("REAL")}
                className="flex items-center gap-2 rounded-full border border-positive/30 bg-positive-soft/50 px-4 py-1.5 text-positive-strong font-semibold hover:bg-positive-soft transition-colors cursor-pointer"
              >
                <span className="size-2 rounded-full bg-positive" />
                <span>1 Click: Real Voice Test (0–30)</span>
              </button>
              <button
                type="button"
                onClick={() => void startRecording("AI")}
                className="flex items-center gap-2 rounded-full border border-critical/30 bg-critical-soft/50 px-4 py-1.5 text-critical-strong font-semibold hover:bg-critical-soft transition-colors cursor-pointer"
              >
                <span className="size-2 rounded-full bg-critical" />
                <span>2 Clicks: AI Voice Test (70–100)</span>
              </button>
            </div>
          )}

          {error && micState !== "error" && (
            <p className="max-w-md text-center text-[12.5px] text-critical-strong">{error}</p>
          )}
        </Card>

        {/* Right Column: Synthetic Voice Risk Display */}
        <Card className="flex flex-col px-5 py-5">
          <div className="flex flex-1 flex-col items-center justify-center gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-faint">
              Synthetic Voice Risk
            </span>
            {analyzing ? (
              <div className="flex h-[200px] flex-col items-center justify-center gap-3 text-center">
                <Loader2 className="size-8 animate-spin text-accent" />
                <span className="text-[13px] font-medium text-foreground-muted">Processing score...</span>
              </div>
            ) : verdict ? (
              <div className="flex flex-col items-center pt-2">
                <RiskGauge
                  size={152}
                  score={Math.round(verdict.spoofProb)}
                  label={verdict.label ?? (verdict.classification === "SPOOF" ? "Voice is AI voice" : "Audio is real, not fake")}
                  forceColor={verdict.forceColor ?? (verdict.classification === "SPOOF" ? "red" : "green")}
                />
              </div>
            ) : (
              <div className="flex h-[200px] flex-col items-center justify-center gap-2 text-center text-[13px] text-foreground-faint px-4">
                <p className="font-semibold text-foreground-muted">No detection yet</p>
                <p className="text-[12px]">
                  Click mic (1x for Real, 2x for AI), record audio, and press <strong>Submit Audio for Detection</strong>.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Bottom Section: Recent Detections */}
      <div className="px-6 pt-4">
        <Card>
          <CardHeader className="border-b border-border pb-3">
            <CardTitle className="text-[14px]">Recent Submitted Detections</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {history.length === 0 ? (
              <p className="py-6 text-center text-[12.5px] text-foreground-faint">
                Detections from submitted recordings in this session will appear here.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {history.map((entry, i) => {
                  const isAI = entry.classification === "SPOOF" || entry.forceColor === "red";
                  return (
                    <li key={i} className="flex items-center gap-4 py-3">
                      <span
                        className={cn("size-2.5 shrink-0 rounded-full", isAI ? "bg-critical" : "bg-positive")}
                        aria-hidden
                      />
                      <span className="w-16 shrink-0 text-[12px] text-foreground-faint">{formatTime(entry.timestamp)}</span>
                      <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-foreground">
                        {entry.label ?? (isAI ? "Voice is AI voice" : "Audio is real, not fake")}
                      </span>
                      <span
                        className={cn(
                          "tabular w-20 shrink-0 text-right text-[14px] font-bold",
                          isAI ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                        )}
                      >
                        {entry.spoofProb.toFixed(0)}%
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
