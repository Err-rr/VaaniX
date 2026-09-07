import { cn } from "@/lib/utils";

export function LoadingState({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2 p-4", className)} role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-9 w-full animate-pulse rounded-md bg-surface-sunken" />
      ))}
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", description }: { title?: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 py-14 text-center">
      <p className="text-[13.5px] font-medium text-critical-strong">{title}</p>
      {description && <p className="max-w-sm text-[12.5px] text-foreground-muted">{description}</p>}
    </div>
  );
}
