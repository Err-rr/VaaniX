"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";
import type { Severity } from "@/types/common";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ActionDef {
  key: string;
  label: string;
  description: string;
}

const PRIMARY_ACTION_LABEL: Record<Severity, string> = {
  critical: "Require Verification",
  high: "Require Verification",
  medium: "Hold Transaction",
  low: "Mark as Safe",
};

const RESPONSE_HEADLINE: Record<Severity, string> = {
  critical: "Secondary verification required",
  high: "Secondary verification required",
  medium: "Continued monitoring advised",
  low: "No action required",
};

const SECONDARY_ACTIONS: ActionDef[] = [
  { key: "hold", label: "Hold Transaction", description: "Place any pending transaction on hold pending review." },
  { key: "escalate", label: "Escalate to Fraud Team", description: "Open an investigation and notify the fraud response team." },
  { key: "safe", label: "Mark as Safe", description: "Confirm this call as legitimate and close the alert." },
  { key: "dismiss", label: "Dismiss Alert", description: "Dismiss without further action." },
];

export function ActionPanel({ severity }: { severity: Severity }) {
  const [taken, setTaken] = useState<string | null>(null);
  const primaryLabel = PRIMARY_ACTION_LABEL[severity];
  const secondaryActions = SECONDARY_ACTIONS.filter((a) => a.label !== primaryLabel);

  function record(label: string, description: string, key: string) {
    setTaken(key);
    toast.success(`${label} recorded`, { description });
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-faint">Recommended Response</p>
        <p className="mt-0.5 text-[13.5px] font-medium text-foreground">{RESPONSE_HEADLINE[severity]}</p>
      </div>

      <Button
        variant={severity === "critical" ? "critical" : "default"}
        className="justify-center"
        disabled={!!taken}
        onClick={() => record(primaryLabel, "Primary recommended action for this call.", "primary")}
      >
        {taken === "primary" ? <Check className="size-4" /> : null}
        {taken === "primary" ? `${primaryLabel} recorded` : primaryLabel}
      </Button>

      <div className={cn("flex flex-wrap gap-x-4 gap-y-1.5", taken && "opacity-50")}>
        {secondaryActions.map((action) => (
          <button
            key={action.key}
            type="button"
            disabled={!!taken}
            onClick={() => record(action.label, action.description, action.key)}
            className="text-[12.5px] font-medium text-foreground-muted underline-offset-2 hover:text-foreground hover:underline disabled:pointer-events-none"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
