import { createSeededRandom } from "./constants";

export type TimeRange = "24H" | "7D" | "30D" | "90D";

export interface ActivityPoint {
  label: string;
  calls: number;
  riskEvents: number;
  criticalAlerts: number;
  syntheticDetections: number;
}

export interface AnomalyMarker {
  index: number;
  timestamp: string;
  callId: string;
  caller: string;
  riskScore: number;
  reason: string;
  decision: string;
}

export interface KpiStat {
  id: string;
  label: string;
  value: number;
  format: "number" | "score" | "percent";
  trend: number;
  trendDirection: "up" | "down";
  trendIsGood: boolean;
  comparison: string;
  emphasis?: "primary" | "critical";
}

export const KPI_STATS: KpiStat[] = [
  {
    id: "calls-analyzed",
    label: "Calls Analyzed",
    value: 12842,
    format: "number",
    trend: 8.4,
    trendDirection: "up",
    trendIsGood: true,
    comparison: "vs. 11,847 last period",
  },
  {
    id: "high-risk-calls",
    label: "High Risk Calls",
    value: 47,
    format: "number",
    trend: 12.1,
    trendDirection: "up",
    trendIsGood: false,
    comparison: "vs. 42 last period",
  },
  {
    id: "critical-alerts",
    label: "Critical Alerts",
    value: 8,
    format: "number",
    trend: 33.3,
    trendDirection: "up",
    trendIsGood: false,
    comparison: "vs. 6 last period",
    emphasis: "critical",
  },
  {
    id: "average-risk",
    label: "Average Risk",
    value: 21.4,
    format: "score",
    trend: 2.9,
    trendDirection: "down",
    trendIsGood: true,
    comparison: "vs. 22.0 last period",
  },
];

function buildSeries(points: number, seed: number, labelFn: (i: number) => string): ActivityPoint[] {
  const random = createSeededRandom(seed);
  const series: ActivityPoint[] = [];
  for (let i = 0; i < points; i++) {
    const base = 380 + Math.sin(i / 3) * 60 + random() * 40;
    const spike = random() < 0.08;
    const calls = Math.round(base + (spike ? random() * 200 : 0));
    const riskEvents = Math.round(calls * (0.04 + random() * 0.03) + (spike ? 8 : 0));
    const criticalAlerts = Math.round(riskEvents * (0.06 + random() * 0.05) + (spike ? 2 : 0));
    const syntheticDetections = Math.round(riskEvents * (0.3 + random() * 0.2));
    series.push({ label: labelFn(i), calls, riskEvents, criticalAlerts, syntheticDetections });
  }
  return series;
}

const HOUR_LABELS = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);
const DAY_LABELS_7 = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_LABELS_30 = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
const WEEK_LABELS_90 = Array.from({ length: 13 }, (_, i) => `Wk ${i + 1}`);

export const ACTIVITY_SERIES: Record<TimeRange, ActivityPoint[]> = {
  "24H": buildSeries(24, 11, (i) => HOUR_LABELS[i]),
  "7D": buildSeries(7, 22, (i) => DAY_LABELS_7[i]),
  "30D": buildSeries(30, 33, (i) => DAY_LABELS_30[i]),
  "90D": buildSeries(13, 44, (i) => WEEK_LABELS_90[i]),
};

const ANOMALY_REASONS = [
  { callId: "VS-28491", caller: "+91 90192 34821", riskScore: 98, reason: "Synthetic voice + high-value transfer request", decision: "Escalated" },
  { callId: "VS-28486", caller: "+91 70123 44821", riskScore: 79, reason: "Elevated synthetic-speech on payroll batch approval", decision: "Verification Required" },
  { callId: "VS-28487", caller: "+91 88991 21932", riskScore: 84, reason: "Speaker mismatch on credential reset request", decision: "Verification Required" },
];

function buildAnomalies(range: TimeRange, series: ActivityPoint[]): AnomalyMarker[] {
  const random = createSeededRandom(range.length + series.length);
  const count = range === "24H" ? 2 : range === "7D" ? 3 : range === "30D" ? 4 : 3;
  const usedIndexes = new Set<number>();
  const markers: AnomalyMarker[] = [];
  for (let i = 0; i < count; i++) {
    let idx = Math.floor(random() * series.length);
    while (usedIndexes.has(idx)) idx = Math.floor(random() * series.length);
    usedIndexes.add(idx);
    const ref = ANOMALY_REASONS[i % ANOMALY_REASONS.length];
    markers.push({
      index: idx,
      timestamp: series[idx].label,
      ...ref,
    });
  }
  return markers.sort((a, b) => a.index - b.index);
}

export const ANOMALY_MARKERS: Record<TimeRange, AnomalyMarker[]> = {
  "24H": buildAnomalies("24H", ACTIVITY_SERIES["24H"]),
  "7D": buildAnomalies("7D", ACTIVITY_SERIES["7D"]),
  "30D": buildAnomalies("30D", ACTIVITY_SERIES["30D"]),
  "90D": buildAnomalies("90D", ACTIVITY_SERIES["90D"]),
};
