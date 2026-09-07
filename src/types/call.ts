import type { CallDecision, CallStatus, Severity } from "./common";

export interface RiskSignal {
  key: "synthetic" | "speakerMatch" | "prosody" | "context";
  label: string;
  score: number;
  status: Severity | "safe";
  summary: string;
  detail: string;
}

export interface EvidenceItem {
  id: string;
  kind: "supporting" | "concern";
  label: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  label: string;
  detail?: string;
  tone: "neutral" | "info" | "warning" | "critical" | "success";
}

export interface Call {
  id: string;
  callerNumber: string;
  claimedIdentity: string;
  claimedRole: string;
  department: string;
  agent: string;
  organization: string;
  startedAt: string;
  durationSeconds: number;
  status: CallStatus;
  severity: Severity;
  syntheticScore: number;
  speakerMatchScore: number;
  prosodyAnomalyScore: number;
  contextRiskScore: number;
  overallRisk: number;
  decision: CallDecision;
  transactionContext?: string;
  transactionAmount?: number;
  signals: RiskSignal[];
  evidence: EvidenceItem[];
  systemAssessment: string;
  timeline: TimelineEvent[];
  channel: "Inbound PSTN" | "SIP Trunk" | "Mobile Carrier" | "IVR Transfer";
}

export interface SecurityEvent {
  id: string;
  callId: string;
  severity: Severity;
  callerNumber: string;
  claimedIdentity: string;
  syntheticScore: number;
  speakerMatchScore: number;
  riskScore: number;
  decision: CallDecision;
  timestamp: string;
}
