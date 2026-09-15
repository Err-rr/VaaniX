"use client";

import { Loader2, Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MicState } from "@/hooks/use-live-detection";

export function MicOrb({
  state,
  level,
  onClick,
  onDoubleClick,
}: {
  state: MicState;
  level: number;
  onClick?: () => void;
  onDoubleClick?: () => void;
}) {
  const listening = state === "listening";
  const requesting = state === "requesting";

  return (
    <button
      type="button"
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      disabled={requesting}
      aria-pressed={listening}
      aria-label={listening ? "Stop microphone recording" : "Start microphone recording"}
      className={cn(
        "group relative flex size-28 shrink-0 items-center justify-center rounded-full border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-not-allowed cursor-pointer",
        listening
          ? "border-accent bg-accent text-accent-foreground shadow-lg scale-105"
          : "border-border-strong bg-surface text-foreground-muted hover:border-accent/40 hover:text-foreground hover:scale-105"
      )}
    >
      {listening && (
        <span
          className="absolute inset-0 rounded-full bg-accent/25 animate-ping opacity-75"
          style={{ transform: `scale(${1 + level * 0.55})`, transition: "transform 90ms linear" }}
          aria-hidden
        />
      )}
      <span className="relative">
        {requesting ? (
          <Loader2 className="size-9 animate-spin" />
        ) : listening ? (
          <Mic className="size-9" />
        ) : (
          <MicOff className="size-9" />
        )}
      </span>
    </button>
  );
}
