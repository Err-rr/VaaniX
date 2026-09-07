import type { RiskBand, Severity } from "@/types/common";

export function scoreToBand(score: number): RiskBand {
  if (score >= 85) return "critical";
  if (score >= 60) return "high";
  if (score >= 30) return "elevated";
  return "low";
}

export function scoreToSeverity(score: number): Severity {
  if (score >= 85) return "critical";
  if (score >= 60) return "high";
  if (score >= 30) return "medium";
  return "low";
}

export const SEVERITY_ORDER: Record<Severity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export const SEVERITY_LABEL: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const RISK_BAND_LABEL: Record<RiskBand, string> = {
  critical: "Critical",
  high: "High",
  elevated: "Elevated",
  low: "Low",
};

/** Semantic color tokens keyed by severity — never rely on color alone in the UI. */
export const SEVERITY_TOKEN: Record<Severity, { fg: string; bg: string; border: string; dot: string }> = {
  critical: {
    fg: "text-critical-strong",
    bg: "bg-critical-soft",
    border: "border-critical/30",
    dot: "bg-critical",
  },
  high: {
    fg: "text-warning-strong",
    bg: "bg-warning-soft",
    border: "border-warning/30",
    dot: "bg-warning",
  },
  medium: {
    fg: "text-info",
    bg: "bg-info-soft",
    border: "border-info/30",
    dot: "bg-info",
  },
  low: {
    fg: "text-positive-strong",
    bg: "bg-positive-soft",
    border: "border-positive/30",
    dot: "bg-positive",
  },
};

export function riskFusionScore(inputs: {
  syntheticScore: number;
  speakerMatchScore: number;
  prosodyAnomalyScore: number;
  contextRiskScore: number;
}): number {
  const { syntheticScore, speakerMatchScore, prosodyAnomalyScore, contextRiskScore } = inputs;
  const speakerMismatch = 100 - speakerMatchScore;
  const weighted =
    syntheticScore * 0.38 +
    speakerMismatch * 0.22 +
    prosodyAnomalyScore * 0.2 +
    contextRiskScore * 0.2;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}
