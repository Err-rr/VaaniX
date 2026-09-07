"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckCheck, PauseCircle, ShieldAlert, ShieldCheck, X } from "lucide-react";
import type { Severity } from "@/types/common";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ActionDef {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  variant: "critical" | "warning" | "secondary" | "positive" | "outline";
  description: string;
}

const ACTIONS: ActionDef[] = [
  { key: "verify", label: "Require Verification", icon: ShieldAlert, variant: "warning", description: "Send a secondary verification challenge before proceeding." },
  { key: "hold", label: "Hold Transaction", icon: PauseCircle, variant: "secondary", description: "Place any pending transaction on hold pending review." },
  { key: "escalate", label: "Escalate to Fraud Team", icon: ShieldAlert, variant: "critical", description: "Open an investigation and notify the fraud response team." },
  { key: "safe", label: "Mark as Safe", icon: ShieldCheck, variant: "positive", description: "Confirm this call as legitimate and close the alert." },
  { key: "dismiss", label: "Dismiss Alert", icon: X, variant: "outline", description: "Dismiss without further action." },
];

function recommendedActionKey(severity: Severity): string {
  if (severity === "critical") return "verify";
  if (severity === "high") return "verify";
  if (severity === "medium") return "hold";
  return "safe";
}

export function ActionPanel({ severity }: { severity: Severity }) {
  const [taken, setTaken] = useState<string | null>(null);
  const recommended = recommendedActionKey(severity);

  function handleAction(action: ActionDef) {
    setTaken(action.key);
    toast.success(`${action.label} recorded`, { description: action.description });
  }

  return (
    <Card className="border-accent/25">
      <CardHeader className="border-b border-border pb-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-accent-strong">Recommended Response</p>
          <CardTitle className="mt-0.5 text-[14px]">
            {severity === "critical" || severity === "high"
              ? "Secondary verification required"
              : severity === "medium"
                ? "Continued monitoring advised"
                : "No action required"}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 pt-4">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          const isRecommended = action.key === recommended;
          const isTaken = taken === action.key;
          return (
            <Button
              key={action.key}
              variant={isTaken ? "secondary" : action.variant}
              className={cn("justify-start gap-2.5", isRecommended && !taken && "ring-2 ring-accent/30")}
              onClick={() => handleAction(action)}
              disabled={!!taken && !isTaken}
            >
              {isTaken ? <CheckCheck className="size-4" /> : <Icon className="size-4" />}
              {action.label}
              {isRecommended && !taken && (
                <span className="ml-auto rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                  Recommended
                </span>
              )}
              {isTaken && <span className="ml-auto text-[11px] font-medium">Recorded</span>}
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
