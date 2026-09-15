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
