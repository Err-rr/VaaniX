"use client";

import { motion } from "framer-motion";
import type { RiskSignal } from "@/types/call";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

const STATUS_CLASS: Record<RiskSignal["status"], { text: string; bar: string; ring: string }> = {
  critical: { text: "text-critical-strong", bar: "bg-critical", ring: "stroke-critical" },
  high: { text: "text-warning-strong", bar: "bg-warning", ring: "stroke-warning" },
  medium: { text: "text-info", bar: "bg-info", ring: "stroke-info" },
  low: { text: "text-positive-strong", bar: "bg-positive", ring: "stroke-positive" },
  safe: { text: "text-positive-strong", bar: "bg-positive", ring: "stroke-positive" },
};

export function SignalPanel({ signal }: { signal: RiskSignal }) {
  const cls = STATUS_CLASS[signal.status];

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold uppercase tracking-wide text-foreground-muted">{signal.label}</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" className="text-foreground-faint hover:text-foreground-muted" aria-label={`About ${signal.label}`}>
                <Info className="size-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[240px]">
              {signal.detail}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <motion.span
          key={signal.score}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          className={cn("tabular text-[28px] font-semibold leading-none", cls.text)}
        >
          {signal.score}%
        </motion.span>
      </div>
      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
        <motion.div
          className={cn("h-full rounded-full", cls.bar)}
          initial={false}
          animate={{ width: `${signal.score}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <p className="mt-2.5 text-[12.5px] leading-snug text-foreground-muted">{signal.summary}</p>
    </Card>
  );
}
