import type { AlertStatus, Severity } from "./common";

export interface Alert {
  id: string;
  callId: string;
  severity: Severity;
  reason: string;
  riskScore: number;
  assignedTo: string | null;
  createdAt: string;
  status: AlertStatus;
  claimedIdentity: string;
  callerNumber: string;
}
