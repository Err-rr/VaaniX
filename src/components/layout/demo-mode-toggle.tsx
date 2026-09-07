"use client";

import Link from "next/link";
import { Radio } from "lucide-react";
import { useDemoStore } from "@/store/demo-store";
import { DEMO_CALL_ID, DEMO_SCENARIO_TITLE } from "@/lib/demo-scenario";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DemoModeToggle() {
  const active = useDemoStore((s) => s.active);
  const start = useDemoStore((s) => s.start);
  const stop = useDemoStore((s) => s.stop);

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border px-2.5 py-1.5 transition-colors",
        active ? "border-critical/30 bg-critical-soft" : "border-border bg-surface"
      )}
    >
      <Radio className={cn("size-3.5", active ? "text-critical-strong" : "text-foreground-faint")} />
      <span className={cn("text-[12px] font-semibold uppercase tracking-wide", active ? "text-critical-strong" : "text-foreground-muted")}>
        {active ? DEMO_SCENARIO_TITLE : "Demo Mode"}
      </span>
      <Switch checked={active} onCheckedChange={(checked) => (checked ? start() : stop())} aria-label="Toggle demo mode" />
      {active && (
        <Button asChild size="sm" variant="critical" className="h-6 px-2 text-[11px]">
          <Link href={`/live-calls/${DEMO_CALL_ID}`}>View Call</Link>
        </Button>
      )}
    </div>
  );
}
