import { daysAgo } from "./constants";

export interface ReportDefinition {
  id: string;
  title: string;
  description: string;
  category: "Risk" | "Fraud" | "Compliance";
  lastGeneratedAt: string;
  cadence: string;
}

export const REPORT_DEFINITIONS: ReportDefinition[] = [
  {
    id: "rep-monthly-voice-risk",
    title: "Monthly Voice Risk Report",
    description: "Aggregate risk activity, detection trends, and analyst response times for the reporting month.",
    category: "Risk",
    lastGeneratedAt: daysAgo(6),
    cadence: "Monthly",
  },
  {
    id: "rep-ai-impersonation-summary",
    title: "AI Impersonation Summary",
    description: "Breakdown of confirmed and suspected synthetic-voice impersonation attempts by department and channel.",
    category: "Risk",
    lastGeneratedAt: daysAgo(6),
    cadence: "Monthly",
  },
  {
    id: "rep-fraud-investigation",
    title: "Fraud Investigation Report",
    description: "Detailed case log of escalated investigations, evidence collected, and disposition outcomes.",
    category: "Fraud",
    lastGeneratedAt: daysAgo(13),
    cadence: "Bi-weekly",
  },
  {
    id: "rep-compliance-audit",
    title: "Compliance Audit Report",
    description: "Policy adherence, retention compliance, and access-control audit summary for regulators.",
    category: "Compliance",
    lastGeneratedAt: daysAgo(29),
    cadence: "Quarterly",
  },
];

export interface GeneratedReport {
  id: string;
  reportId: string;
  title: string;
  generatedAt: string;
  generatedBy: string;
  period: string;
  format: "PDF" | "CSV";
}

export const GENERATED_REPORTS: GeneratedReport[] = [
  { id: "gr-1", reportId: "rep-monthly-voice-risk", title: "Monthly Voice Risk Report — Aug 2026", generatedAt: daysAgo(6), generatedBy: "Shivam Rao", period: "Aug 1 – Aug 31, 2026", format: "PDF" },
  { id: "gr-2", reportId: "rep-ai-impersonation-summary", title: "AI Impersonation Summary — Aug 2026", generatedAt: daysAgo(6), generatedBy: "Shivam Rao", period: "Aug 1 – Aug 31, 2026", format: "PDF" },
  { id: "gr-3", reportId: "rep-fraud-investigation", title: "Fraud Investigation Report — Cycle 17", generatedAt: daysAgo(13), generatedBy: "Meera Krishnan", period: "Aug 18 – Aug 31, 2026", format: "PDF" },
  { id: "gr-4", reportId: "rep-compliance-audit", title: "Compliance Audit Report — Q2 FY26", generatedAt: daysAgo(29), generatedBy: "Tanvi Deshpande", period: "Apr 1 – Jun 30, 2026", format: "PDF" },
  { id: "gr-5", reportId: "rep-monthly-voice-risk", title: "Monthly Voice Risk Report — Jul 2026", generatedAt: daysAgo(36), generatedBy: "Shivam Rao", period: "Jul 1 – Jul 31, 2026", format: "CSV" },
];
