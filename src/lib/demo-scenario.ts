import type { Call, EvidenceItem, TimelineEvent } from "@/types/call";
import { buildSignals } from "@/data/mock-calls";

export const DEMO_CALL_ID = "VS-DEMO-01";

let timelineCounter = 0;
function nextTimelineId() {
  timelineCounter += 1;
  return `demo-tl-${timelineCounter}`;
}

function pushEvent(call: Call, event: Omit<TimelineEvent, "id">): Call {
  return { ...call, timeline: [...call.timeline, { ...event, id: nextTimelineId() }] };
}

function pushEvidence(call: Call, item: Omit<EvidenceItem, "id">): Call {
  return { ...call, evidence: [...call.evidence, { ...item, id: `demo-ev-${call.evidence.length + 1}` }] };
}

export function createBaseDemoCall(): Call {
  return {
    id: DEMO_CALL_ID,
    callerNumber: "+91 90192 34821",
    claimedIdentity: "Arjun Mehta",
    claimedRole: "Chief Financial Officer",
    department: "Finance",
    agent: "Contact Center — Priority Desk",
    organization: "Acme Financial Security",
    startedAt: new Date().toISOString(),
    durationSeconds: 0,
    status: "active",
    severity: "low",
    syntheticScore: 0,
    speakerMatchScore: 0,
    prosodyAnomalyScore: 0,
    contextRiskScore: 0,
    overallRisk: 0,
    decision: "monitoring",
    channel: "SIP Trunk",
    signals: buildSignals({ synthetic: 0, speakerMatch: 0, prosody: 0, context: 0, identityLabel: "CFO" }),
    evidence: [],
    systemAssessment: "Call connected. Voice and behavioral analysis in progress.",
    timeline: [],
  };
}

export interface DemoStage {
  key: string;
  toastTitle: string;
  toastDescription?: string;
  toastTone: "info" | "warning" | "critical" | "success";
  delayMs: number;
  apply: (call: Call) => Call;
}

export const DEMO_SCENARIO_TITLE = "AI-Cloned CFO Attack";

export const DEMO_STAGES: DemoStage[] = [
  {
    key: "incoming",
    toastTitle: "Incoming call detected",
    toastDescription: "+91 90192 34821 — claimed identity: Arjun Mehta, CFO",
    toastTone: "info",
    delayMs: 400,
    apply: (call) => pushEvent(call, { timestamp: new Date().toISOString(), label: "Incoming call detected", tone: "neutral" }),
  },
  {
    key: "connected",
    toastTitle: "Call connected",
    toastTone: "info",
    delayMs: 2200,
    apply: (call) => pushEvent(call, { timestamp: new Date().toISOString(), label: "Call connected", tone: "neutral" }),
  },
  {
    key: "voice_analysis",
    toastTitle: "Voice analysis started",
    toastDescription: "Capturing live waveform and spectral signature",
    toastTone: "info",
    delayMs: 2200,
    apply: (call) => pushEvent(call, { timestamp: new Date().toISOString(), label: "Voice analysis started", tone: "info" }),
  },
  {
    key: "speaker_matching",
    toastTitle: "Speaker matching in progress",
    toastTone: "info",
    delayMs: 2400,
    apply: (call) => {
      const updated: Call = {
        ...call,
        speakerMatchScore: 92,
        overallRisk: 18,
        signals: buildSignals({
          synthetic: call.syntheticScore,
          speakerMatch: 92,
          prosody: call.prosodyAnomalyScore,
          context: call.contextRiskScore,
          identityLabel: "CFO",
        }),
      };
      const withEvent = pushEvent(updated, {
        timestamp: new Date().toISOString(),
        label: "Speaker profile matched",
        detail: "92% consistency with enrolled CFO profile",
        tone: "success",
      });
      return pushEvidence(withEvent, { kind: "supporting", label: "Voice strongly matches enrolled CFO profile (92% consistency)" });
    },
  },
  {
    key: "synthetic_detection",
    toastTitle: "Synthetic speech anomaly detected",
    toastDescription: "Spectral discontinuities consistent with AI voice generation",
    toastTone: "warning",
    delayMs: 2600,
    apply: (call) => {
      const updated: Call = {
        ...call,
        syntheticScore: 96,
        prosodyAnomalyScore: 87,
        severity: "high",
        overallRisk: 68,
        signals: buildSignals({
          synthetic: 96,
          speakerMatch: call.speakerMatchScore,
          prosody: 87,
          context: call.contextRiskScore,
          identityLabel: "CFO",
        }),
      };
      const withEvent = pushEvent(updated, {
        timestamp: new Date().toISOString(),
        label: "Synthetic speech anomaly detected",
        detail: "Spectral discontinuities consistent with AI voice generation",
        tone: "warning",
      });
      const withProsody = pushEvent(withEvent, {
        timestamp: new Date().toISOString(),
        label: "Prosody deviation flagged",
        detail: "Unusual pause and cadence patterns versus baseline",
        tone: "warning",
      });
      const withEv1 = pushEvidence(withProsody, { kind: "concern", label: "Synthetic speech indicators detected in spectral analysis" });
      return pushEvidence(withEv1, { kind: "concern", label: "Unusual prosody and pause patterns versus baseline" });
    },
  },
  {
    key: "context_analysis",
    toastTitle: "High-risk transaction intent detected",
    toastDescription: "₹25,00,000 transfer request to unrecognized beneficiary",
    toastTone: "warning",
    delayMs: 2600,
    apply: (call) => {
      const updated: Call = {
        ...call,
        contextRiskScore: 95,
        severity: "high",
        overallRisk: 86,
        transactionContext: "Urgent outbound wire transfer to a new beneficiary account",
        transactionAmount: 2500000,
        signals: buildSignals({
          synthetic: call.syntheticScore,
          speakerMatch: call.speakerMatchScore,
          prosody: call.prosodyAnomalyScore,
          context: 95,
          identityLabel: "CFO",
        }),
      };
      const withEvent = pushEvent(updated, {
        timestamp: new Date().toISOString(),
        label: "High-risk transaction intent detected",
        detail: "₹25,00,000 transfer request to unrecognized beneficiary",
        tone: "warning",
      });
      const withEv1 = pushEvidence(withEvent, { kind: "concern", label: "High-value transaction requested (₹25,00,000)" });
      return pushEvidence(withEv1, { kind: "concern", label: "Urgency and pressure language detected in transcript" });
    },
  },
  {
    key: "risk_escalating",
    toastTitle: "Risk crossed critical threshold",
    toastDescription: "Overall risk score: 98 / 100",
    toastTone: "critical",
    delayMs: 2200,
    apply: (call) => {
      const updated: Call = { ...call, overallRisk: 98, severity: "critical" };
      return pushEvent(updated, {
        timestamp: new Date().toISOString(),
        label: "Risk crossed critical threshold",
        detail: "Overall risk score: 98 / 100",
        tone: "critical",
      });
    },
  },
  {
    key: "critical_alert",
    toastTitle: "Critical alert raised",
    toastDescription: "Secondary verification recommended before processing transaction",
    toastTone: "critical",
    delayMs: 1800,
    apply: (call) => {
      const updated: Call = {
        ...call,
        decision: "escalated",
        systemAssessment:
          "Voice identity appears consistent with the claimed speaker, but audio authenticity signals indicate possible AI-generated speech. Recommend secondary verification before processing the requested transaction.",
      };
      return pushEvent(updated, {
        timestamp: new Date().toISOString(),
        label: "Secondary verification recommended",
        tone: "critical",
      });
    },
  },
];
