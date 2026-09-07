import { createSeededRandom } from "./constants";

export interface SeriesPoint {
  label: string;
  value: number;
}

export interface DualSeriesPoint {
  label: string;
  a: number;
  b: number;
}

const monthRandom = createSeededRandom(101);
export const SYNTHETIC_DETECTION_TREND: SeriesPoint[] = Array.from({ length: 12 }, (_, i) => ({
  label: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"][i],
  value: Math.round(3.2 + i * 0.35 + monthRandom() * 1.2),
}));

const avgRiskRandom = createSeededRandom(102);
export const AVERAGE_RISK_TREND: SeriesPoint[] = Array.from({ length: 12 }, (_, i) => ({
  label: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"][i],
  value: Math.round((18 + Math.sin(i / 2) * 3 + avgRiskRandom() * 4) * 10) / 10,
}));

export const HIGH_RISK_CALL_TREND: DualSeriesPoint[] = [
  { label: "Oct", a: 28, b: 4 },
  { label: "Nov", a: 31, b: 5 },
  { label: "Dec", a: 26, b: 3 },
  { label: "Jan", a: 34, b: 6 },
  { label: "Feb", a: 38, b: 7 },
  { label: "Mar", a: 33, b: 5 },
  { label: "Apr", a: 41, b: 8 },
  { label: "May", a: 44, b: 9 },
  { label: "Jun", a: 39, b: 7 },
  { label: "Jul", a: 46, b: 10 },
  { label: "Aug", a: 43, b: 8 },
  { label: "Sep", a: 47, b: 8 },
];

export const SPEAKER_MISMATCH_TREND: SeriesPoint[] = [
  { label: "Oct", value: 2.1 },
  { label: "Nov", value: 2.4 },
  { label: "Dec", value: 1.9 },
  { label: "Jan", value: 2.6 },
  { label: "Feb", value: 3.0 },
  { label: "Mar", value: 2.5 },
  { label: "Apr", value: 3.3 },
  { label: "May", value: 3.6 },
  { label: "Jun", value: 3.1 },
  { label: "Jul", value: 3.8 },
  { label: "Aug", value: 3.4 },
  { label: "Sep", value: 3.9 },
];

export const RISK_BY_HOUR: SeriesPoint[] = Array.from({ length: 24 }, (_, i) => {
  const businessHours = i >= 9 && i <= 18;
  const lateNight = i >= 22 || i <= 4;
  const base = businessHours ? 18 + Math.sin(i / 3) * 4 : lateNight ? 34 + Math.sin(i) * 6 : 24;
  return { label: `${i.toString().padStart(2, "0")}:00`, value: Math.round(base) };
});

export const RISK_BY_DEPARTMENT: SeriesPoint[] = [
  { label: "Finance", value: 38 },
  { label: "Payments", value: 33 },
  { label: "Executive", value: 29 },
  { label: "Compliance", value: 22 },
  { label: "Operations", value: 19 },
  { label: "Retail Banking", value: 11 },
];

export const RISK_BY_CALL_TYPE: SeriesPoint[] = [
  { label: "High-Value Transfer", value: 41 },
  { label: "Credential Reset", value: 27 },
  { label: "Payment Approval", value: 24 },
  { label: "Access Request", value: 16 },
  { label: "Balance Inquiry", value: 4 },
  { label: "Card Services", value: 5 },
];

export const DETECTION_ACCURACY = {
  precision: 96.8,
  recall: 94.2,
  falsePositiveRate: 1.4,
  meanTimeToDetectSeconds: 22,
};
