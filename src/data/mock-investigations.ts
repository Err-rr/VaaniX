import type { Investigation } from "@/types/investigation";
import { daysAgo, hoursAgo, minutesAgo } from "./constants";
import { FLAGSHIP_CALL } from "./mock-calls";

export const ALL_INVESTIGATIONS: Investigation[] = [
  {
    id: "INV-2041",
    title: "Possible CFO Voice Impersonation",
    subject: "Arjun Mehta — Chief Financial Officer",
    relatedCallIds: [FLAGSHIP_CALL.id],
    riskScore: 98,
    analyst: "Shivam Rao",
    createdAt: minutesAgo(1),
    updatedAt: minutesAgo(1),
    status: "open",
    summary:
      "Escalated call requesting an urgent ₹25,00,000 wire transfer. Voice biometrics match the enrolled CFO profile, but strong synthetic-speech indicators suggest the audio may be AI-generated. Secondary verification requested; transaction held pending analyst review.",
  },
  {
    id: "INV-2039",
    title: "Repeated Speaker Mismatch — Payments Desk",
    subject: "Vikram Sethi — Head of Payments",
    relatedCallIds: ["VS-28486"],
    riskScore: 79,
    analyst: "Ishaan Kulkarni",
    createdAt: hoursAgo(3),
    updatedAt: hoursAgo(1),
    status: "in_progress",
    summary:
      "Bulk payroll batch approval call flagged for elevated synthetic-speech and prosody signals. Analyst is cross-referencing prior call history for the Head of Payments profile.",
  },
  {
    id: "INV-2036",
    title: "Credential Reset Under Duress Language",
    subject: "Rohan Sharma — Retail Customer",
    relatedCallIds: ["VS-28487"],
    riskScore: 84,
    analyst: "Meera Krishnan",
    createdAt: hoursAgo(6),
    updatedAt: hoursAgo(2),
    status: "in_progress",
    summary:
      "Customer call requesting credential reset and transfer-limit increase shows inconclusive speaker match combined with high synthetic-voice score. Awaiting callback verification.",
  },
  {
    id: "INV-2028",
    title: "Cluster of Elevated-Risk Calls — Regional Ops",
    subject: "Karan Bhatt — Regional Director",
    relatedCallIds: ["VS-28499"],
    riskScore: 58,
    analyst: "Farhan Ali",
    createdAt: daysAgo(1),
    updatedAt: hoursAgo(5),
    status: "escalated",
    summary:
      "Three vendor-payment override calls in 48 hours attributed to the same claimed identity with inconsistent speaker confidence. Escalated to fraud team for pattern analysis.",
  },
  {
    id: "INV-2019",
    title: "Compliance Report Access Request",
    subject: "Devika Nair — Head of Compliance",
    relatedCallIds: ["VS-28495"],
    riskScore: 52,
    analyst: "Tanvi Deshpande",
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
    status: "closed",
    summary:
      "Request for restricted compliance report access flagged for moderate context risk. Verified via callback to registered extension. No impersonation confirmed — closed.",
  },
  {
    id: "INV-2004",
    title: "Synthetic Voice Trial — Test Line",
    subject: "Unknown Caller",
    relatedCallIds: [],
    riskScore: 91,
    analyst: "Shivam Rao",
    createdAt: daysAgo(4),
    updatedAt: daysAgo(3),
    status: "closed",
    summary:
      "Inbound call with extremely high synthetic-voice indicators and no enrolled speaker match. Determined to be a probing attempt against the IVR system. Number blocklisted.",
  },
];

export function getInvestigationById(id: string): Investigation | undefined {
  return ALL_INVESTIGATIONS.find((i) => i.id === id);
}
