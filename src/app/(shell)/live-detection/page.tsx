"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RiskGauge } from "@/components/calls/risk-gauge";
import { MicOrb } from "@/components/live-detection/mic-orb";
import { LevelMeter } from "@/components/live-detection/level-meter";
import { useLiveDetection, type MicState } from "@/hooks/use-live-detection";
import { cn, formatTime } from "@/lib/utils";

const STATUS_COPY: Record<MicState, string> = {
  idle: "Tap the mic to unmute and start speaking",
  requesting: "Requesting microphone access…",
  listening: "Listening — analyzing your voice every few seconds",
  error: "Microphone unavailable",
};

export default function LiveDetectionPage() {
  const { micState, error, levels, verdict, history, isAnalyzing, start, stop } = useLiveDetection();
  const listening = micState === "listening";

  return (
    <div className="flex flex-col pb-10">
      <PageHeader
        title="Live Detection"
        subtitle="Real-time voice authenticity check from your microphone"
        actions={
          listening && (
            <span className="flex items-center gap-1.5 rounded-md border border-critical/25 bg-critical-soft px-2.5 py-1 text-[11.5px] font-semibold text-critical-strong">
              <span className="size-1.5 rounded-full bg-critical animate-pulse-dot" /> LIVE
            </span>
          )
        }
      />

      <div className="grid grid-cols-1 gap-4 px-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center gap-5 px-6 py-10 lg:col-span-2">
          <MicOrb state={micState} level={levels[levels.length - 1] ?? 0} onClick={listening ? stop : start} />

          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-[13.5px] font-medium text-foreground">
              {micState === "error" ? error ?? STATUS_COPY.error : STATUS_COPY[micState]}
            </span>
            {isAnalyzing && <span className="text-[12px] text-foreground-faint">Analyzing chunk…</span>}
          </div>

          <LevelMeter levels={levels} active={listening} />

          {error && micState !== "error" && (
            <p className="max-w-md text-center text-[12.5px] text-critical-strong">{error}</p>
          )}
        </Card>

        <Card className="flex flex-col px-5 py-5">
          <div className="flex flex-1 flex-col items-center justify-center gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-foreground-faint">
              Synthetic Voice Risk
            </span>
            {verdict ? (
              <RiskGauge
                size={152}
                score={Math.round(verdict.spoofProb)}
                label={verdict.classification === "SPOOF" ? "Likely synthetic voice" : "Voice appears authentic"}
              />
            ) : (
              <div className="flex h-[190px] items-center justify-center text-center text-[12.5px] text-foreground-faint">
                No detection yet
              </div>
            )}
          </div>
          {verdict?.stub && (
            <>
              <Separator className="my-4" />
              <p className="text-center text-[11.5px] text-warning-strong">
                Stub mode — scores are randomized, the real model isn&apos;t loaded on the server yet.
              </p>
            </>
          )}
        </Card>
      </div>

      <div className="px-6 pt-4">
        <Card>
          <CardHeader className="border-b border-border pb-3">
            <CardTitle className="text-[14px]">Recent Detections</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {history.length === 0 ? (
              <p className="py-6 text-center text-[12.5px] text-foreground-faint">
                Detections from this session will appear here.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {history.map((entry, i) => (
                  <li key={i} className="flex items-center gap-4 py-2.5">
                    <span
                      className={cn("size-2 shrink-0 rounded-full", entry.classification === "SPOOF" ? "bg-critical" : "bg-positive")}
                      aria-hidden
                    />
                    <span className="w-16 shrink-0 text-[12px] text-foreground-faint">{formatTime(entry.timestamp)}</span>
                    <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-foreground">
                      {entry.classification === "SPOOF" ? "Synthetic voice detected" : "Voice appears authentic"}
                    </span>
                    {entry.stub && <span className="text-[11px] text-foreground-faint">stub</span>}
                    <span className="tabular w-14 shrink-0 text-right text-[13px] font-semibold text-foreground">
                      {entry.confidence.toFixed(1)}%
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
