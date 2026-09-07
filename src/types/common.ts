export type Severity = "critical" | "high" | "medium" | "low";

export type RiskBand = "critical" | "high" | "elevated" | "low";

export type CallDecision =
  | "escalated"
  | "verification_required"
  | "hold"
  | "cleared"
  | "dismissed"
  | "monitoring";

export type CallStatus = "active" | "analyzing" | "completed" | "dropped";

export type AlertStatus = "open" | "investigating" | "escalated" | "resolved" | "dismissed";

export type InvestigationStatus = "open" | "in_progress" | "escalated" | "closed";

export type ProfileStatus = "protected" | "pending" | "under_review" | "revoked";

export type IntegrationStatus = "connected" | "ready" | "degraded" | "disconnected";

export interface TrendPoint {
  label: string;
  value: number;
}

export interface Organization {
  id: string;
  name: string;
  sector: "Banking" | "Telecom" | "Insurance" | "Fintech";
  plan: "Enterprise" | "Enterprise Plus";
}
