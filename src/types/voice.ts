import type { ProfileStatus } from "./common";

/** One verdict from the live microphone detection feed (src/app/(shell)/live-detection). */
export interface LiveDetectionVerdict {
  classification: "REAL" | "SPOOF";
  confidence: number;
  realProb: number;
  spoofProb: number;
  stub: boolean;
  timestamp: string;
  label?: string;
  forceColor?: "red" | "green";
}

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
