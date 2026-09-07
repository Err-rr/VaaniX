"use client";

import { motion } from "framer-motion";
import { scoreToBand, RISK_BAND_LABEL } from "@/lib/risk";
import { cn } from "@/lib/utils";

const BAND_STROKE: Record<string, string> = {
  critical: "var(--color-critical)",
  high: "var(--color-warning)",
  elevated: "var(--color-info)",
  low: "var(--color-positive)",
};

const BAND_TEXT: Record<string, string> = {
  critical: "text-critical-strong",
  high: "text-warning-strong",
  elevated: "text-info",
  low: "text-positive-strong",
};

interface RiskGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function RiskGauge({ score, size = 208, strokeWidth = 12, label }: RiskGaugeProps) {
  const band = scoreToBand(score);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, score));
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className="flex flex-col items-center gap-3" role="img" aria-label={`Impersonation risk score ${score} out of 100, ${RISK_BAND_LABEL[band]}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={BAND_STROKE[band]}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={false}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={score}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            className="tabular text-[44px] font-semibold leading-none text-foreground"
          >
            {clamped}
          </motion.span>
          <span className="mt-1 text-[12px] text-foreground-faint">/ 100</span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span className={cn("text-[13px] font-semibold uppercase tracking-wide", BAND_TEXT[band])}>
          {RISK_BAND_LABEL[band]}
        </span>
        {label && <span className="text-[12.5px] text-foreground-muted">{label}</span>}
      </div>
    </div>
  );
}
