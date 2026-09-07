import type { Call, EvidenceItem, RiskSignal, TimelineEvent } from "@/types/call";
import type { CallDecision, Severity } from "@/types/common";
import { scoreToSeverity } from "@/lib/risk";
import {
  CUSTOMER_NAMES,
  DEMO_NOW,
  EMPLOYEE_NAMES,
  INDIAN_CALLER_NUMBERS,
  createSeededRandom,
  minutesAgo,
} from "./constants";

function secondsAgo(seconds: number): string {
  return new Date(DEMO_NOW.getTime() - seconds * 1000).toISOString();
}

export function buildSignals(input: {
  synthetic: number;
  speakerMatch: number;
  prosody: number;
  context: number;
  identityLabel: string;
}): RiskSignal[] {
  const { synthetic, speakerMatch, prosody, context, identityLabel } = input;
  return [
    {
      key: "synthetic",
      label: "Synthetic Voice",
      score: synthetic,
      status: synthetic >= 85 ? "critical" : synthetic >= 60 ? "high" : synthetic >= 30 ? "medium" : "safe",
      summary:
        synthetic >= 85
          ? "Strong indicators of synthetic speech generation."
          : synthetic >= 60
            ? "Moderate synthetic-generation artifacts present."
            : synthetic >= 30
              ? "Minor spectral irregularities detected."
              : "No synthetic-generation indicators detected.",
      detail:
        "Spectral and harmonic analysis of vocoder artifacts, phase discontinuities, and unnatural formant transitions characteristic of AI voice generation models.",
    },
    {
      key: "speakerMatch",
      label: "Speaker Match",
      score: speakerMatch,
      status: speakerMatch >= 85 ? "safe" : speakerMatch >= 60 ? "medium" : speakerMatch >= 30 ? "high" : "critical",
      summary:
        speakerMatch >= 85
          ? `Voice strongly resembles enrolled ${identityLabel} profile.`
          : speakerMatch >= 60
            ? `Voice partially matches enrolled ${identityLabel} profile.`
            : `Voice does not match the enrolled ${identityLabel} profile.`,
      detail:
        "Cosine similarity between the live voice embedding and the enrolled biometric embedding for the claimed identity, normalized against historical intra-speaker variance.",
    },
    {
      key: "prosody",
      label: "Prosody Anomaly",
      score: prosody,
      status: prosody >= 85 ? "critical" : prosody >= 60 ? "high" : prosody >= 30 ? "medium" : "safe",
      summary:
        prosody >= 85
          ? "Unusual pause and cadence patterns inconsistent with baseline."
          : prosody >= 60
            ? "Noticeable deviation in speech rhythm and intonation."
            : prosody >= 30
              ? "Slight rhythm variance within acceptable range."
              : "Speech rhythm consistent with historical baseline.",
      detail:
        "Behavioral analysis of pause distribution, speech rate, pitch contour, and micro-hesitations compared against the speaker's historical prosodic fingerprint.",
    },
    {
      key: "context",
      label: "Context Risk",
      score: context,
      status: context >= 85 ? "critical" : context >= 60 ? "high" : context >= 30 ? "medium" : "safe",
      summary:
        context >= 85
          ? "High-value transaction and urgency detected."
          : context >= 60
            ? "Elevated-risk request pattern detected."
            : context >= 30
              ? "Routine request with minor risk indicators."
              : "No elevated contextual risk indicators.",
      detail:
        "Assessment of transaction value, request urgency language, deviation from typical call purpose, and time-of-day / channel risk factors.",
    },
  ];
}

function genericEvidence(sev: Severity, identityLabel: string, hasTransaction: boolean): EvidenceItem[] {
  if (sev === "low") {
    return [
      { id: "ev-1", kind: "supporting", label: `Voice matches enrolled ${identityLabel} profile within expected variance` },
      { id: "ev-2", kind: "supporting", label: "No synthetic-generation indicators detected" },
      { id: "ev-3", kind: "supporting", label: "Speech rhythm consistent with historical baseline" },
    ];
  }
  const items: EvidenceItem[] = [
    { id: "ev-1", kind: "supporting", label: `Voice partially matches enrolled ${identityLabel} profile` },
    { id: "ev-2", kind: "concern", label: "Synthetic speech indicators detected in spectral analysis" },
    { id: "ev-3", kind: "concern", label: "Unusual prosody and pause patterns versus baseline" },
  ];
  if (hasTransaction) items.push({ id: "ev-4", kind: "concern", label: "High-value transaction requested" });
  items.push({ id: "ev-5", kind: "concern", label: "Urgency language detected in transcript" });
  return items;
}

function genericTimeline(startIso: string, sev: Severity, decision: CallDecision): TimelineEvent[] {
  const t0 = new Date(startIso).getTime();
  const at = (s: number) => new Date(t0 + s * 1000).toISOString();
  const events: TimelineEvent[] = [
    { id: "tl-1", timestamp: at(0), label: "Call connected", tone: "neutral" },
    { id: "tl-2", timestamp: at(15), label: "Speaker profile matched", tone: "success" },
  ];
  if (sev !== "low") {
    events.push({ id: "tl-3", timestamp: at(22), label: "Synthetic speech anomaly detected", tone: "warning" });
    events.push({ id: "tl-4", timestamp: at(29), label: "Prosody deviation flagged", tone: "warning" });
  }
  if (sev === "critical" || sev === "high") {
    events.push({ id: "tl-5", timestamp: at(36), label: "Elevated risk context detected", tone: "warning" });
  }
  events.push({
    id: "tl-6",
    timestamp: at(40),
    label: `Risk assessment finalized`,
    tone: sev === "critical" ? "critical" : sev === "high" ? "warning" : "success",
  });
  const decisionLabel =
    decision === "escalated"
      ? "Escalated to fraud team"
      : decision === "verification_required"
        ? "Secondary verification recommended"
        : decision === "hold"
          ? "Transaction placed on hold"
          : decision === "cleared"
            ? "Call cleared — no action required"
            : "Marked for monitoring";
  events.push({ id: "tl-7", timestamp: at(41), label: decisionLabel, tone: sev === "low" ? "success" : "critical" });
  return events;
}

function decisionForSeverity(sev: Severity): CallDecision {
  if (sev === "critical") return "escalated";
  if (sev === "high") return "verification_required";
  if (sev === "medium") return "monitoring";
  return "cleared";
}

/** The flagship scenario referenced throughout the product: AI-Cloned CFO Attack. */
export const FLAGSHIP_CALL: Call = {
  id: "VS-28491",
  callerNumber: "+91 90192 34821",
  claimedIdentity: "Arjun Mehta",
  claimedRole: "Chief Financial Officer",
  department: "Finance",
  agent: "Contact Center — Priority Desk",
  organization: "Acme Financial Security",
  startedAt: secondsAgo(58),
  durationSeconds: 58,
  status: "active",
  severity: "critical",
  syntheticScore: 96,
  speakerMatchScore: 92,
  prosodyAnomalyScore: 87,
  contextRiskScore: 95,
  overallRisk: 98,
  decision: "escalated",
  transactionContext: "Urgent outbound wire transfer to a new beneficiary account",
  transactionAmount: 2500000,
  channel: "SIP Trunk",
  signals: buildSignals({ synthetic: 96, speakerMatch: 92, prosody: 87, context: 95, identityLabel: "CFO" }),
  evidence: [
    { id: "ev-1", kind: "supporting", label: "Voice strongly matches enrolled CFO profile (94% consistency)" },
    { id: "ev-2", kind: "concern", label: "Synthetic speech indicators detected in spectral analysis" },
    { id: "ev-3", kind: "concern", label: "Unusual prosody and pause patterns versus baseline" },
    { id: "ev-4", kind: "concern", label: "High-value transaction requested (₹25,00,000)" },
    { id: "ev-5", kind: "concern", label: "Urgency and pressure language detected in transcript" },
  ],
  systemAssessment:
    "Voice identity appears consistent with the claimed speaker, but audio authenticity signals indicate possible AI-generated speech. Recommend secondary verification before processing the requested transaction.",
  timeline: [
    { id: "tl-1", timestamp: secondsAgo(58 - 0), label: "Call connected", tone: "neutral" },
    { id: "tl-2", timestamp: secondsAgo(58 - 15), label: "Speaker profile matched", detail: "94% consistency with enrolled CFO profile", tone: "success" },
    { id: "tl-3", timestamp: secondsAgo(58 - 22), label: "Synthetic speech anomaly detected", detail: "Spectral discontinuities consistent with AI voice generation", tone: "warning" },
    { id: "tl-4", timestamp: secondsAgo(58 - 36), label: "High-risk transaction intent detected", detail: "₹25,00,000 transfer request to unrecognized beneficiary", tone: "warning" },
    { id: "tl-5", timestamp: secondsAgo(58 - 39), label: "Risk crossed critical threshold", detail: "Overall risk score: 98 / 100", tone: "critical" },
    { id: "tl-6", timestamp: secondsAgo(58 - 40), label: "Secondary verification recommended", tone: "critical" },
  ],
};

const HANDCRAFTED: Call[] = [
  FLAGSHIP_CALL,
  {
    id: "VS-28487",
    callerNumber: "+91 88991 21932",
    claimedIdentity: "Rohan Sharma",
    claimedRole: "Retail Customer",
    department: "Retail Banking",
    agent: "Contact Center — General Queue",
    organization: "Acme Financial Security",
    startedAt: minutesAgo(6),
    durationSeconds: 212,
    status: "analyzing",
    severity: "high",
    syntheticScore: 81,
    speakerMatchScore: 64,
    prosodyAnomalyScore: 58,
    contextRiskScore: 70,
    overallRisk: 84,
    decision: "verification_required",
    transactionContext: "Request to reset net-banking credentials and raise transfer limit",
    channel: "Inbound PSTN",
    signals: buildSignals({ synthetic: 81, speakerMatch: 64, prosody: 58, context: 70, identityLabel: "customer" }),
    evidence: genericEvidence("high", "customer", false),
    systemAssessment:
      "Voice match against the enrolled customer profile is inconclusive and synthetic-speech indicators are present. Secondary verification is recommended before actioning the request.",
    timeline: genericTimeline(minutesAgo(6), "high", "verification_required"),
  },
  {
    id: "VS-28480",
    callerNumber: "+91 99201 57712",
    claimedIdentity: "Priya Verma",
    claimedRole: "Retail Customer",
    department: "Retail Banking",
    agent: "Contact Center — General Queue",
    organization: "Acme Financial Security",
    startedAt: minutesAgo(24),
    durationSeconds: 184,
    status: "completed",
    severity: "low",
    syntheticScore: 6,
    speakerMatchScore: 94,
    prosodyAnomalyScore: 9,
    contextRiskScore: 12,
    overallRisk: 11,
    decision: "cleared",
    transactionContext: "Balance inquiry and statement request",
    channel: "Mobile Carrier",
    signals: buildSignals({ synthetic: 6, speakerMatch: 94, prosody: 9, context: 12, identityLabel: "customer" }),
    evidence: genericEvidence("low", "customer", false),
    systemAssessment:
      "Voice identity and behavioral patterns are fully consistent with the enrolled customer profile. No impersonation indicators detected.",
    timeline: genericTimeline(minutesAgo(24), "low", "cleared"),
  },
  {
    id: "VS-28495",
    callerNumber: "+91 78221 90344",
    claimedIdentity: "Devika Nair",
    claimedRole: "Head of Compliance",
    department: "Compliance",
    agent: "Contact Center — Priority Desk",
    organization: "Acme Financial Security",
    startedAt: minutesAgo(2),
    durationSeconds: 41,
    status: "active",
    severity: "medium",
    syntheticScore: 48,
    speakerMatchScore: 76,
    prosodyAnomalyScore: 40,
    contextRiskScore: 55,
    overallRisk: 52,
    decision: "monitoring",
    transactionContext: "Requesting access to a restricted compliance report",
    channel: "SIP Trunk",
    signals: buildSignals({ synthetic: 48, speakerMatch: 76, prosody: 40, context: 55, identityLabel: "Head of Compliance" }),
    evidence: genericEvidence("medium", "Head of Compliance", false),
    systemAssessment:
      "Moderate risk indicators present. Voice match is within an acceptable range but call context warrants continued monitoring.",
    timeline: genericTimeline(minutesAgo(2), "medium", "monitoring"),
  },
  {
    id: "VS-28499",
    callerNumber: "+91 96543 21012",
    claimedIdentity: "Karan Bhatt",
    claimedRole: "Regional Director",
    department: "Operations",
    agent: "Contact Center — Priority Desk",
    organization: "Acme Financial Security",
    startedAt: minutesAgo(1),
    durationSeconds: 19,
    status: "analyzing",
    severity: "medium",
    syntheticScore: 55,
    speakerMatchScore: 71,
    prosodyAnomalyScore: 61,
    contextRiskScore: 48,
    overallRisk: 58,
    decision: "monitoring",
    transactionContext: "Vendor payment approval override",
    channel: "SIP Trunk",
    signals: buildSignals({ synthetic: 55, speakerMatch: 71, prosody: 61, context: 48, identityLabel: "Regional Director" }),
    evidence: genericEvidence("medium", "Regional Director", true),
    systemAssessment: "Analysis in progress. Preliminary signals suggest elevated but inconclusive risk.",
    timeline: genericTimeline(minutesAgo(1), "medium", "monitoring"),
  },
  {
    id: "VS-28488",
    callerNumber: "+91 81234 56789",
    claimedIdentity: "Aditya Kulkarni",
    claimedRole: "Retail Customer",
    department: "Retail Banking",
    agent: "Contact Center — General Queue",
    organization: "Acme Financial Security",
    startedAt: minutesAgo(5),
    durationSeconds: 96,
    status: "active",
    severity: "low",
    syntheticScore: 11,
    speakerMatchScore: 91,
    prosodyAnomalyScore: 14,
    contextRiskScore: 8,
    overallRisk: 13,
    decision: "cleared",
    transactionContext: "Card limit increase request",
    channel: "Mobile Carrier",
    signals: buildSignals({ synthetic: 11, speakerMatch: 91, prosody: 14, context: 8, identityLabel: "customer" }),
    evidence: genericEvidence("low", "customer", false),
    systemAssessment: "No impersonation indicators detected. Voice and behavior consistent with enrolled profile.",
    timeline: genericTimeline(minutesAgo(5), "low", "cleared"),
  },
  {
    id: "VS-28486",
    callerNumber: "+91 70123 44821",
    claimedIdentity: "Vikram Sethi",
    claimedRole: "Head of Payments",
    department: "Payments",
    agent: "Contact Center — Priority Desk",
    organization: "Acme Financial Security",
    startedAt: minutesAgo(7),
    durationSeconds: 267,
    status: "analyzing",
    severity: "high",
    syntheticScore: 74,
    speakerMatchScore: 68,
    prosodyAnomalyScore: 71,
    contextRiskScore: 80,
    overallRisk: 79,
    decision: "verification_required",
    transactionContext: "Bulk NEFT batch approval for payroll disbursement",
    transactionAmount: 8400000,
    channel: "SIP Trunk",
    signals: buildSignals({ synthetic: 74, speakerMatch: 68, prosody: 71, context: 80, identityLabel: "Head of Payments" }),
    evidence: genericEvidence("high", "Head of Payments", true),
    systemAssessment:
      "Elevated synthetic-speech and prosody indicators combined with a high-value batch approval request. Secondary verification recommended.",
    timeline: genericTimeline(minutesAgo(7), "high", "verification_required"),
  },
  {
    id: "VS-28502",
    callerNumber: "+91 93456 78123",
    claimedIdentity: "Neha Joshi",
    claimedRole: "Retail Customer",
    department: "Retail Banking",
    agent: "Contact Center — General Queue",
    organization: "Acme Financial Security",
    startedAt: minutesAgo(1),
    durationSeconds: 34,
    status: "active",
    severity: "low",
    syntheticScore: 4,
    speakerMatchScore: 97,
    prosodyAnomalyScore: 6,
    contextRiskScore: 5,
    overallRisk: 6,
    decision: "cleared",
    transactionContext: "Address update request",
    channel: "Mobile Carrier",
    signals: buildSignals({ synthetic: 4, speakerMatch: 97, prosody: 6, context: 5, identityLabel: "customer" }),
    evidence: genericEvidence("low", "customer", false),
    systemAssessment: "No impersonation indicators detected.",
    timeline: genericTimeline(minutesAgo(1), "low", "cleared"),
  },
];

function generateBulkCalls(count: number, seed = 42): Call[] {
  const random = createSeededRandom(seed);
  const calls: Call[] = [];
  for (let i = 0; i < count; i++) {
    const isEmployee = random() < 0.3;
    const identity = isEmployee
      ? EMPLOYEE_NAMES[Math.floor(random() * EMPLOYEE_NAMES.length)]
      : { name: CUSTOMER_NAMES[Math.floor(random() * CUSTOMER_NAMES.length)], role: "Retail Customer", department: "Retail Banking" };
    const riskRoll = random();
    let overallRisk: number;
    if (riskRoll < 0.035) overallRisk = 88 + Math.floor(random() * 12);
    else if (riskRoll < 0.135) overallRisk = 60 + Math.floor(random() * 24);
    else if (riskRoll < 0.39) overallRisk = 28 + Math.floor(random() * 28);
    else overallRisk = Math.floor(random() * 26);

    const severity = scoreToSeverity(overallRisk);
    const synthetic = clamp(overallRisk + (random() * 20 - 10));
    const speakerMatch = clamp(100 - overallRisk * 0.7 + (random() * 16 - 8));
    const prosody = clamp(overallRisk * 0.8 + (random() * 20 - 10));
    const context = clamp(overallRisk * 0.75 + (random() * 24 - 12));
    const decision = decisionForSeverity(severity);
    const startedAt = minutesAgo(30 + Math.floor(random() * 60 * 24 * 21));
    const id = `VS-${(28000 - i * 3 - Math.floor(random() * 3)).toString()}`;

    calls.push({
      id,
      callerNumber: INDIAN_CALLER_NUMBERS[Math.floor(random() * INDIAN_CALLER_NUMBERS.length)],
      claimedIdentity: identity.name,
      claimedRole: identity.role,
      department: identity.department,
      agent: isEmployee ? "Contact Center — Priority Desk" : "Contact Center — General Queue",
      organization: "Acme Financial Security",
      startedAt,
      durationSeconds: 30 + Math.floor(random() * 400),
      status: "completed",
      severity,
      syntheticScore: Math.round(synthetic),
      speakerMatchScore: Math.round(speakerMatch),
      prosodyAnomalyScore: Math.round(prosody),
      contextRiskScore: Math.round(context),
      overallRisk,
      decision,
      transactionContext: isEmployee && overallRisk > 50 ? "High-value transaction approval" : undefined,
      transactionAmount: isEmployee && overallRisk > 50 ? Math.round((50000 + random() * 4000000) / 1000) * 1000 : undefined,
      channel: isEmployee ? "SIP Trunk" : (["Mobile Carrier", "Inbound PSTN"] as const)[Math.floor(random() * 2)],
      signals: buildSignals({
        synthetic: Math.round(synthetic),
        speakerMatch: Math.round(speakerMatch),
        prosody: Math.round(prosody),
        context: Math.round(context),
        identityLabel: isEmployee ? identity.role : "customer",
      }),
      evidence: genericEvidence(severity, isEmployee ? identity.role : "customer", overallRisk > 50),
      systemAssessment:
        severity === "low"
          ? "No impersonation indicators detected. Voice and behavior consistent with enrolled profile."
          : "Review recommended based on combined authenticity and behavioral risk indicators.",
      timeline: genericTimeline(startedAt, severity, decision),
    });
  }
  return calls;
}

function clamp(n: number): number {
  return Math.min(100, Math.max(0, n));
}

export const BULK_CALLS = generateBulkCalls(230);
export const ALL_CALLS: Call[] = [...HANDCRAFTED, ...BULK_CALLS];

export const LIVE_CALLS: Call[] = ALL_CALLS.filter((c) => c.status === "active" || c.status === "analyzing");

export function getCallById(id: string): Call | undefined {
  return ALL_CALLS.find((c) => c.id === id);
}
