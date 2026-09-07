import type { LucideIcon } from "lucide-react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Shared placeholder for a single static visual (no chart/graph logic).
 * Swap the contents for a real image once available, e.g.:
 *   <img src="/voice-analysis.png" alt="" className="h-full w-full object-cover rounded-md" />
 */
export function VisualPlaceholder({
  icon: Icon = ImageIcon,
  label = "Visual",
  height = 220,
  className,
}: {
  icon?: LucideIcon;
  label?: string;
  height?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center rounded-md border border-dashed border-border-strong bg-surface-sunken/50",
        className
      )}
      style={{ height }}
    >
      <div className="flex flex-col items-center gap-2 text-foreground-faint">
        <Icon className="size-6" />
        <span className="text-[12px]">{label}</span>
      </div>
    </div>
  );
}
