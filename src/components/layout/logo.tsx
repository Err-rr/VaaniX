import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={cn("size-6", className)} aria-hidden>
      <path
        d="M16 2.5 27 6.5V15c0 8-4.7 13-11 14.5C9.7 28 5 23 5 15V6.5L16 2.5Z"
        fill="var(--color-accent)"
      />
      <path
        d="M11 17.5 13.2 12l2 5.7 1.7-8.4 1.9 8.4 1.8-3.7H21"
        stroke="var(--color-accent-foreground)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
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
