import type { IntegrationStatus } from "./common";

export interface Integration {
  id: string;
  name: string;
  category: "Voice Infrastructure" | "API" | "Fraud & Risk";
  status: IntegrationStatus;
  description: string;
  lastSyncedAt?: string;
}

export interface ApiCredential {
  id: string;
  label: string;
  keyMasked: string;
  createdAt: string;
  lastUsedAt: string;
  scope: string;
}

export interface PolicyThreshold {
  id: string;
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  unit: "score" | "days";
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  ip: string;
  result: "success" | "failure";
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Fraud Analyst" | "SOC Analyst" | "Auditor";
  status: "active" | "invited" | "suspended";
  lastActiveAt: string;
}
