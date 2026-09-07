import { cn } from "@/lib/utils";

/**
 * Minimal monogram mark: a rounded badge containing an open signal ring with
 * a directional aperture — evokes monitoring/detection without resorting to
 * a literal shield, lock, or waveform glyph.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={cn("size-[22px]", className)} aria-hidden>
      <rect x="0.5" y="0.5" width="27" height="27" rx="7" fill="var(--color-accent)" />
      <path
        d="M14 6.4a7.6 7.6 0 1 1 -6.7 4"
        stroke="var(--color-accent-foreground)"
        strokeWidth="2.1"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="14" cy="14" r="2.15" fill="var(--color-accent-foreground)" />
    </svg>
  );
}

export function Logo({ className, wordmarkClassName }: { className?: string; wordmarkClassName?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LogoMark />
      <span className={cn("text-[14.5px] font-semibold tracking-tight text-foreground", wordmarkClassName)}>
        VoxAegis
      </span>
    </div>
  );
}
