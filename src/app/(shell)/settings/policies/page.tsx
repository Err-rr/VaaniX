"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { POLICY_THRESHOLDS } from "@/data/mock-settings";
import type { PolicyThreshold } from "@/types/settings";
import { cn } from "@/lib/utils";

function thresholdTone(id: string, value: number): string {
  if (id === "pol-critical" && value >= 85) return "text-critical-strong";
  if (id === "pol-secondary-verification" && value >= 60) return "text-warning-strong";
  return "text-accent-strong";
}

function ThresholdControl({ policy, value, onChange }: { policy: PolicyThreshold; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex flex-col gap-2 border-b border-border py-4 last:border-0">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] font-medium text-foreground">{policy.label}</p>
          <p className="text-[12px] text-foreground-muted">{policy.description}</p>
        </div>
        <span className={cn("tabular text-[18px] font-semibold", thresholdTone(policy.id, value))}>
          {value}
          <span className="text-[12px] font-normal text-foreground-faint"> {policy.unit === "score" ? "/ 100" : "days"}</span>
        </span>
      </div>
      <Slider min={policy.min} max={policy.max} step={1} value={[value]} onValueChange={([v]) => onChange(v)} />
    </div>
  );
}

export default function PoliciesPage() {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(POLICY_THRESHOLDS.map((p) => [p.id, p.value]))
  );
  const [autoEscalate, setAutoEscalate] = useState(true);
  const [notifyAnalysts, setNotifyAnalysts] = useState(true);

  const scoreThresholds = POLICY_THRESHOLDS.filter((p) => p.unit === "score");
  const retentionThresholds = POLICY_THRESHOLDS.filter((p) => p.unit === "days");

  function handleSave() {
    toast.success("Policy thresholds updated", { description: "New thresholds apply to calls analyzed from now on." });
  }

  return (
    <div className="flex flex-col pb-8">
      <PageHeader
        title="Detection Policies"
        subtitle="Configure organization-wide risk thresholds and retention rules"
        actions={<Button onClick={handleSave}>Save Changes</Button>}
      />

      <div className="grid grid-cols-1 gap-4 px-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardHeader className="border-b border-border pb-3">
              <CardTitle className="text-[14px]">Risk Thresholds</CardTitle>
              <CardDescription>Score thresholds that determine when calls are flagged, escalated, or require verification.</CardDescription>
            </CardHeader>
            <CardContent className="pt-1">
              {scoreThresholds.map((policy) => (
                <ThresholdControl
                  key={policy.id}
                  policy={policy}
                  value={values[policy.id]}
                  onChange={(v) => setValues((prev) => ({ ...prev, [policy.id]: v }))}
                />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-border pb-3">
              <CardTitle className="text-[14px]">Data Retention</CardTitle>
              <CardDescription>Retention periods for raw audio and derived biometric embeddings.</CardDescription>
            </CardHeader>
            <CardContent className="pt-1">
              {retentionThresholds.map((policy) => (
                <ThresholdControl
                  key={policy.id}
                  policy={policy}
                  value={values[policy.id]}
                  onChange={(v) => setValues((prev) => ({ ...prev, [policy.id]: v }))}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader className="border-b border-border pb-3">
              <CardTitle className="text-[14px]">Alert Policies</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 pt-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Label htmlFor="auto-escalate">Auto-escalate critical calls</Label>
                  <p className="mt-0.5 text-[11.5px] text-foreground-faint">Automatically open an investigation when risk crosses the critical threshold.</p>
                </div>
                <Switch id="auto-escalate" checked={autoEscalate} onCheckedChange={setAutoEscalate} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Label htmlFor="notify-analysts">Notify on-call analysts</Label>
                  <p className="mt-0.5 text-[11.5px] text-foreground-faint">Send real-time notifications for high and critical severity alerts.</p>
                </div>
                <Switch id="notify-analysts" checked={notifyAnalysts} onCheckedChange={setNotifyAnalysts} />
              </div>
            </CardContent>
          </Card>

          <Card className="px-4 py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-faint">Current Summary</p>
            <ul className="mt-2 flex flex-col gap-1.5 text-[12.5px] text-foreground-muted">
              <li>
                Calls scoring <span className="font-medium text-critical-strong">{values["pol-critical"]}+</span> are
                auto-escalated
              </li>
              <li>
                Calls scoring <span className="font-medium text-warning-strong">{values["pol-secondary-verification"]}+</span> require
                secondary verification
              </li>
              <li>
                Audio retained for <span className="font-medium text-foreground">{values["pol-audio-retention"]} days</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
