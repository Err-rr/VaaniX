import type { ApiCredential, AuditLogEntry, Integration, PolicyThreshold, TeamMember } from "@/types/settings";
import { createSeededRandom, daysAgo, hoursAgo, minutesAgo } from "./constants";

export const INTEGRATIONS: Integration[] = [
  {
    id: "int-twilio",
    name: "Twilio Voice",
    category: "Voice Infrastructure",
    status: "connected",
    description: "Live call audio ingestion via Twilio Media Streams for enrolled contact-center numbers.",
    lastSyncedAt: minutesAgo(2),
  },
  {
    id: "int-siprec",
    name: "SIPREC",
    category: "Voice Infrastructure",
    status: "ready",
    description: "Session recording protocol integration for on-premise PBX and SIP trunk capture.",
  },
  {
    id: "int-rest",
    name: "REST API",
    category: "API",
    status: "connected",
    description: "Programmatic access to calls, alerts, investigations, and voice profiles.",
    lastSyncedAt: minutesAgo(5),
  },
  {
    id: "int-ws",
    name: "WebSocket Stream",
    category: "API",
    status: "connected",
    description: "Real-time risk score and event streaming for live call sessions.",
    lastSyncedAt: minutesAgo(1),
  },
  {
    id: "int-fraud",
    name: "Fraud Engine",
    category: "Fraud & Risk",
    status: "connected",
    description: "Bi-directional risk signal exchange with the enterprise fraud detection platform.",
    lastSyncedAt: hoursAgo(1),
  },
  {
    id: "int-sip-carrier",
    name: "Carrier SIP Gateway",
    category: "Voice Infrastructure",
    status: "degraded",
    description: "Direct carrier-level SIP interconnect for regional mobile network call capture.",
    lastSyncedAt: hoursAgo(4),
  },
];

export const API_CREDENTIALS: ApiCredential[] = [
  {
    id: "cred-1",
    label: "Production — Core API",
    keyMasked: "vxg_live_••••••••••••7f2a",
    createdAt: daysAgo(180),
    lastUsedAt: minutesAgo(4),
    scope: "calls:read alerts:read investigations:write",
  },
  {
    id: "cred-2",
    label: "Fraud Engine Bridge",
    keyMasked: "vxg_live_••••••••••••b91c",
    createdAt: daysAgo(90),
    lastUsedAt: hoursAgo(1),
    scope: "risk:read risk:write",
  },
  {
    id: "cred-3",
    label: "Staging — QA",
    keyMasked: "vxg_test_••••••••••••3d0e",
    createdAt: daysAgo(30),
    lastUsedAt: daysAgo(6),
    scope: "calls:read",
  },
];

export const POLICY_THRESHOLDS: PolicyThreshold[] = [
  {
    id: "pol-synthetic",
    label: "Synthetic Detection Threshold",
    description: "Minimum synthetic-voice score required to flag a call for review.",
    value: 65,
    min: 0,
    max: 100,
    unit: "score",
  },
  {
    id: "pol-speaker-mismatch",
    label: "Speaker Mismatch Threshold",
    description: "Maximum acceptable deviation from the enrolled speaker embedding before flagging.",
    value: 40,
    min: 0,
    max: 100,
    unit: "score",
  },
  {
    id: "pol-critical",
    label: "Critical Risk Threshold",
    description: "Overall risk score at which a call is automatically escalated to the fraud team.",
    value: 85,
    min: 0,
    max: 100,
    unit: "score",
  },
  {
    id: "pol-secondary-verification",
    label: "Secondary Verification Threshold",
    description: "Overall risk score at which secondary verification is recommended to the analyst.",
    value: 60,
    min: 0,
    max: 100,
    unit: "score",
  },
  {
    id: "pol-audio-retention",
    label: "Audio Retention Period",
    description: "Number of days raw call audio is retained before automatic deletion.",
    value: 90,
    min: 7,
    max: 365,
    unit: "days",
  },
  {
    id: "pol-embedding-retention",
    label: "Embedding Retention Period",
    description: "Number of days derived voice embeddings are retained for enrolled profiles.",
    value: 730,
    min: 30,
    max: 1825,
    unit: "days",
  },
];

const AUDIT_ACTIONS = [
  { action: "Viewed call recording", resource: "VS-28491" },
  { action: "Updated policy threshold", resource: "Critical Risk Threshold" },
  { action: "Escalated alert", resource: "ALT-4198" },
  { action: "Exported call history", resource: "call-history.csv" },
  { action: "Enrolled voice profile", resource: "VP-1008" },
  { action: "Resolved investigation", resource: "INV-2019" },
  { action: "Generated report", resource: "Monthly Voice Risk Report" },
  { action: "Revoked API credential", resource: "cred-legacy-01" },
  { action: "Updated team member role", resource: "Ishaan Kulkarni" },
  { action: "Marked call as safe", resource: "VS-28480" },
];

const AUDIT_USERS = ["Shivam Rao", "Ishaan Kulkarni", "Meera Krishnan", "Farhan Ali", "Tanvi Deshpande", "System"];

function buildAuditLog(count: number): AuditLogEntry[] {
  const random = createSeededRandom(19);
  const entries: AuditLogEntry[] = [];
  for (let i = 0; i < count; i++) {
    const pick = AUDIT_ACTIONS[Math.floor(random() * AUDIT_ACTIONS.length)];
    entries.push({
      id: `AUD-${(9000 - i).toString()}`,
      timestamp: hoursAgo(i * 1.7 + random() * 1.5),
      user: AUDIT_USERS[Math.floor(random() * AUDIT_USERS.length)],
      action: pick.action,
      resource: pick.resource,
      ip: `10.${Math.floor(random() * 254)}.${Math.floor(random() * 254)}.${Math.floor(random() * 254)}`,
      result: random() < 0.05 ? "failure" : "success",
    });
  }
  return entries;
}

export const AUDIT_LOG: AuditLogEntry[] = buildAuditLog(120);

export const TEAM_MEMBERS: TeamMember[] = [
  { id: "usr_shivam", name: "Shivam Rao", email: "shivam@youngfoundersschool.com", role: "SOC Analyst", status: "active", lastActiveAt: minutesAgo(1) },
  { id: "usr_ishaan", name: "Ishaan Kulkarni", email: "ishaan.kulkarni@acmefs.in", role: "Fraud Analyst", status: "active", lastActiveAt: minutesAgo(12) },
  { id: "usr_meera", name: "Meera Krishnan", email: "meera.krishnan@acmefs.in", role: "Fraud Analyst", status: "active", lastActiveAt: hoursAgo(1) },
  { id: "usr_farhan", name: "Farhan Ali", email: "farhan.ali@acmefs.in", role: "SOC Analyst", status: "active", lastActiveAt: hoursAgo(3) },
  { id: "usr_tanvi", name: "Tanvi Deshpande", email: "tanvi.deshpande@acmefs.in", role: "Admin", status: "active", lastActiveAt: daysAgo(1) },
  { id: "usr_rakesh", name: "Rakesh Iyer", email: "rakesh.iyer@acmefs.in", role: "Auditor", status: "invited", lastActiveAt: daysAgo(4) },
];
