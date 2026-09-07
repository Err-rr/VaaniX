import type { ProfileStatus } from "./common";

export interface VoiceProfile {
  id: string;
  name: string;
  role: string;
  department: string;
  enrolledAt: string;
  speakerConsistency: number;
  lastVerifiedAt: string;
  status: ProfileStatus;
  verificationCount: number;
  embeddingVersion: string;
}
