import { cn } from "@/lib/utils";

/** Real-time input-level bars driven by the mic's AnalyserNode (see use-live-detection). */
export function LevelMeter({ levels, active }: { levels: number[]; active: boolean }) {
  return (
    <div className="flex h-14 w-full max-w-md items-center justify-center gap-[3px]" aria-hidden>
      {levels.map((level, i) => (
        <span
          key={i}
          className={cn("w-[3px] shrink-0 rounded-full transition-[height,background-color] duration-75", active ? "bg-accent" : "bg-border-strong")}
          style={{ height: `${Math.max(6, level * 100)}%` }}
        />
      ))}
    </div>
  );
}
