import type { Alert } from "@/types/alert";
import type { AlertStatus } from "@/types/common";
import { ANALYSTS, createSeededRandom } from "./constants";
import { ALL_CALLS, FLAGSHIP_CALL } from "./mock-calls";

const REASON_BY_SEVERITY: Record<string, string[]> = {
  critical: [
    "Synthetic voice + high-value transaction request",
    "Speaker mismatch on privileged account access",
    "AI-generated speech indicators on executive impersonation",
  ],
  high: [
    "Elevated synthetic-speech score on identity-sensitive call",
    "Speaker match below policy threshold",
    "Unusual prosody pattern on payment approval call",
  ],
  medium: [
    "Moderate risk signals on standard verification call",
    "Context risk elevated due to urgency language",
    "Partial speaker mismatch flagged for review",
  ],
  low: [
    "Routine call cleared after automated review",
    "Minor variance within accepted speaker baseline",
    "No impersonation indicators — logged for audit trail",
  ],
};

function statusForSeverity(severity: string, random: () => number): AlertStatus {
  if (severity === "critical") return random() < 0.5 ? "escalated" : "investigating";
  if (severity === "high") return (["investigating", "open", "escalated"] as const)[Math.floor(random() * 3)];
  if (severity === "medium") return (["open", "investigating", "resolved"] as const)[Math.floor(random() * 3)];
  return (["resolved", "dismissed", "resolved"] as const)[Math.floor(random() * 3)];
}

function buildAlerts(): Alert[] {
  const random = createSeededRandom(7);
  const eligible = ALL_CALLS;
  const alerts: Alert[] = eligible.map((call, i) => {
    const pool = REASON_BY_SEVERITY[call.severity] ?? REASON_BY_SEVERITY.medium;
    const status = call.id === FLAGSHIP_CALL.id ? "escalated" : statusForSeverity(call.severity, random);
    const assigned = status === "open" ? null : ANALYSTS[Math.floor(random() * ANALYSTS.length)];
    return {
      id: `ALT-${(4200 - i).toString()}`,
      callId: call.id,
      severity: call.severity,
      reason: pool[Math.floor(random() * pool.length)],
      riskScore: call.overallRisk,
      assignedTo: assigned,
      createdAt: call.startedAt,
      status,
      claimedIdentity: call.claimedIdentity,
      callerNumber: call.callerNumber,
    };
  });
  return alerts;
}

export const ALL_ALERTS: Alert[] = buildAlerts();

export function getAlertById(id: string): Alert | undefined {
  return ALL_ALERTS.find((a) => a.id === id);
}

export const ALERT_COUNTS = {
  critical: ALL_ALERTS.filter((a) => a.severity === "critical").length,
  high: ALL_ALERTS.filter((a) => a.severity === "high").length,
  medium: ALL_ALERTS.filter((a) => a.severity === "medium").length,
  low: ALL_ALERTS.filter((a) => a.severity === "low").length,
};
