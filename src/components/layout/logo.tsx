import { cn } from "@/lib/utils";

/**
 * Shield + call-waves mark — a protected phone line, evoking the product's
 * voice-impersonation-defense positioning directly.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("size-[22px]", className)} aria-hidden>
      <path
        d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
        stroke="var(--color-foreground)"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <g transform="translate(6,6) scale(0.5)">
        <path d="M13 2a9 9 0 0 1 9 9" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
        <path d="M13 6a5 5 0 0 1 5 5" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
        <path
          d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"
          fill="var(--color-foreground)"
        />
      </g>
    </svg>
  );
}

export function Logo({ className, wordmarkClassName }: { className?: string; wordmarkClassName?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LogoMark />
      <span className={cn("text-[14.5px] font-semibold tracking-tight text-foreground", wordmarkClassName)}>
        VaaniX
      </span>
    </div>
  );
}
