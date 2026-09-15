"use client";

import { useLiveMicDetection } from "@/hooks/use-live-mic-detection";
import { Mic, MicOff, AlertCircle, ShieldAlert, ShieldCheck, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function LiveMicWidget({ className }: { className?: string }) {
  const { isListening, result, audioLevel, error, startListening, stopListening } =
    useLiveMicDetection();

  // Create 16 dynamic spectrum visualizer bar heights
  const bars = Array.from({ length: 16 }, (_, i) => {
    if (!isListening) return 8;
    const factor = Math.sin((i / 16) * Math.PI) * 0.8 + 0.2;
    return Math.max(6, Math.min(60, Math.round(audioLevel * 60 * factor + Math.random() * 10)));
  });

  return (
    <Card className={`overflow-hidden border-border/80 bg-surface shadow-sm ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-surface-hover/30 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <Activity className="size-4.5 text-primary animate-pulse" />
          <CardTitle className="text-[14.5px] font-semibold text-foreground">
            Real-Time Microphone Voice Analysis
          </CardTitle>
        </div>
        {isListening ? (
          <Badge className="flex items-center gap-1.5 border-critical/30 bg-critical-soft px-2.5 py-0.5 text-[11px] font-semibold text-critical-strong">
            <span className="size-2 rounded-full bg-critical animate-pulse-dot" /> LIVE MIC STREAM
          </Badge>
        ) : (
          <Badge variant="outline" className="text-[11px] text-foreground-muted">
            READY
          </Badge>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-5 p-5">
        {/* Controls & Waveform Section */}
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-border/60 bg-background/50 py-6 px-4">
          {/* Dynamic 16-Bar Spectrum Visualizer */}
          <div className="flex items-center justify-center gap-1.5 h-16 w-full max-w-xs px-2">
            {bars.map((height, idx) => (
              <div
                key={idx}
                className={`w-2.5 rounded-full transition-all duration-75 ${
                  isListening
                    ? result?.is_deepfake
                      ? "bg-critical"
                      : "bg-primary"
                    : "bg-border/60"
                }`}
                style={{ height: `${height}px` }}
              />
            ))}
          </div>

          {/* Mic Trigger Button */}
          <Button
            onClick={isListening ? stopListening : startListening}
            variant={isListening ? "critical" : "default"}
            size="lg"
            className="flex items-center gap-2.5 rounded-full px-6 py-5 text-[13.5px] font-semibold shadow-md transition-all hover:scale-[1.02]"
          >
            {isListening ? (
              <>
                <MicOff className="size-4.5 animate-bounce" /> Stop Live Analysis
              </>
            ) : (
              <>
                <Mic className="size-4.5" /> Start Live Mic Analysis
              </>
            )}
          </Button>

          <span className="text-[11.5px] text-foreground-muted">
            {isListening
              ? "Listening to microphone... Speak into your mic to trigger real-time AI detection."
              : "Click above to enable microphone and test real-time voice anti-spoofing."}
          </span>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-critical/30 bg-critical-soft px-3 py-2 text-[12px] font-medium text-critical-strong">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Live Results Panel */}
        {result && (
          <div className="flex flex-col gap-3 rounded-xl border border-border/80 bg-background p-4 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-foreground-muted">
                Nes2Net Classification Result
              </span>
              <span className="text-[11px] font-medium text-foreground-faint">
                Buffer: {result.buffer_duration_sec}s
              </span>
            </div>

            {/* Verdict Badge */}
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-surface px-4 py-3">
              <div className="flex items-center gap-3">
                {result.is_deepfake ? (
                  <ShieldAlert className="size-6 text-critical" />
                ) : (
                  <ShieldCheck className="size-6 text-success" />
                )}
                <div>
                  <div
                    className={`text-[15px] font-bold tracking-tight ${
                      result.is_deepfake ? "text-critical-strong" : "text-success-strong"
                    }`}
                  >
                    {result.classification}
                  </div>
                  <div className="text-[11.5px] text-foreground-muted">
                    Confidence Level: <strong className="text-foreground">{result.confidence}%</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Probability Bars */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="flex flex-col gap-1 rounded-lg border border-border/40 bg-surface/50 p-2.5">
                <div className="flex justify-between text-[11.5px] font-medium">
                  <span className="text-foreground-muted">Real Voice</span>
                  <span className="font-semibold text-foreground">{result.real_prob}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-border/40">
                  <div
                    className="h-full bg-success transition-all duration-300"
                    style={{ width: `${result.real_prob}%` }}
                  />
                </div>
                <span className="text-[10px] text-foreground-faint pt-0.5">
                  Logit: {result.real_logit}
                </span>
              </div>

              <div className="flex flex-col gap-1 rounded-lg border border-border/40 bg-surface/50 p-2.5">
                <div className="flex justify-between text-[11.5px] font-medium">
                  <span className="text-foreground-muted">Spoof / Deepfake</span>
                  <span className="font-semibold text-foreground">{result.spoof_prob}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-border/40">
                  <div
                    className="h-full bg-critical transition-all duration-300"
                    style={{ width: `${result.spoof_prob}%` }}
                  />
                </div>
                <span className="text-[10px] text-foreground-faint pt-0.5">
                  Logit: {result.spoof_logit}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
