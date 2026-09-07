import { AlertTriangle, ShieldAlert, ShieldCheck, TriangleAlert } from "lucide-react";
import type { Severity } from "@/types/common";
import { SEVERITY_LABEL } from "@/lib/risk";
import { cn } from "@/lib/utils";

const ICON: Record<Severity, React.ComponentType<{ className?: string }>> = {
  critical: ShieldAlert,
  high: TriangleAlert,
  medium: AlertTriangle,
  low: ShieldCheck,
};

const CLASSES: Record<Severity, string> = {
  critical: "bg-critical-soft text-critical-strong border-critical/25",
  high: "bg-warning-soft text-warning-strong border-warning/25",
  medium: "bg-info-soft text-info border-info/25",
  low: "bg-positive-soft text-positive-strong border-positive/25",
};

export function SeverityBadge({ severity, className }: { severity: Severity; className?: string }) {
  const Icon = ICON[severity];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[12px] font-semibold leading-5",
        CLASSES[severity],
        className
      )}
    >
      <Icon className="size-3.5" />
      {SEVERITY_LABEL[severity]}
    </span>
  );
}

export function SeverityDot({ severity, className }: { severity: Severity; className?: string }) {
  const dotClass =
    severity === "critical"
      ? "bg-critical"
      : severity === "high"
        ? "bg-warning"
        : severity === "medium"
          ? "bg-info"
          : "bg-positive";
  return <span className={cn("inline-block size-2 rounded-full", dotClass, className)} aria-hidden />;
}
