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
  forceColor?: "red" | "green";
}

export function RiskGauge({ score, size = 208, strokeWidth = 12, label, forceColor }: RiskGaugeProps) {
  const band = scoreToBand(score);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, score));
  const offset = circumference * (1 - clamped / 100);

  const strokeColor =
    forceColor === "red"
      ? "#ef4444"
      : forceColor === "green"
      ? "#22c55e"
      : BAND_STROKE[band];

  const scoreTextColor =
    forceColor === "red"
      ? "text-red-600 dark:text-red-500 font-bold"
      : forceColor === "green"
      ? "text-green-600 dark:text-green-500 font-bold"
      : "text-foreground";

  const bandTextColor =
    forceColor === "red"
      ? "text-red-600 dark:text-red-500 font-bold"
      : forceColor === "green"
      ? "text-green-600 dark:text-green-500 font-bold"
      : BAND_TEXT[band];

  return (
    <div className="flex flex-col items-center gap-3" role="img" aria-label={`Synthetic voice risk score ${score} out of 100`}>
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
            stroke={strokeColor}
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
            className={cn("tabular text-[44px] leading-none", scoreTextColor)}
          >
            {clamped}
          </motion.span>
          <span className="mt-1 text-[12px] text-foreground-faint">/ 100</span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <span className={cn("text-[13px] uppercase tracking-wide", bandTextColor)}>
          {forceColor === "red" ? "High Synthetic Risk" : forceColor === "green" ? "Low Risk" : RISK_BAND_LABEL[band]}
        </span>
        {label && <span className={cn("text-[13px] font-semibold text-center max-w-[220px]", bandTextColor)}>{label}</span>}
      </div>
    </div>
  );
}
