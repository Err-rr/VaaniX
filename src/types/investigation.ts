import type { InvestigationStatus } from "./common";

export interface Investigation {
  id: string;
  title: string;
  subject: string;
  relatedCallIds: string[];
  riskScore: number;
  analyst: string;
  createdAt: string;
  updatedAt: string;
  status: InvestigationStatus;
  summary: string;
}
