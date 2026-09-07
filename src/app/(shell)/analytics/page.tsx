import { PageHeader } from "@/components/layout/page-header";
import { ChartCard } from "@/components/charts/chart-card";
import { VoiceRiskActivitySection } from "@/components/charts/voice-risk-activity-section";
import { TrendLineChart } from "@/components/charts/trend-line-chart";
import { DualLineChart } from "@/components/charts/dual-line-chart";
import { HorizontalBarChart } from "@/components/charts/horizontal-bar-chart";
import { HourlyRiskChart } from "@/components/charts/hourly-risk-chart";
import { Card } from "@/components/ui/card";
import {
  AVERAGE_RISK_TREND,
  DETECTION_ACCURACY,
  HIGH_RISK_CALL_TREND,
  RISK_BY_CALL_TYPE,
  RISK_BY_DEPARTMENT,
  RISK_BY_HOUR,
  SPEAKER_MISMATCH_TREND,
  SYNTHETIC_DETECTION_TREND,
} from "@/data/mock-analytics";

const ACCURACY_STATS = [
  { label: "Detection Precision", value: `${DETECTION_ACCURACY.precision}%`, hint: "Of flagged calls, share confirmed as true positives" },
  { label: "Detection Recall", value: `${DETECTION_ACCURACY.recall}%`, hint: "Of confirmed impersonation attempts, share caught" },
  { label: "False Positive Rate", value: `${DETECTION_ACCURACY.falsePositiveRate}%`, hint: "Legitimate calls incorrectly flagged" },
  { label: "Mean Time to Detect", value: `${DETECTION_ACCURACY.meanTimeToDetectSeconds}s`, hint: "From call start to risk assessment" },
];

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col pb-8">
      <PageHeader title="Analytics" subtitle="Detection performance and risk trends across the organization" />

      <div className="px-6">
        <VoiceRiskActivitySection />
      </div>

      <div className="grid grid-cols-2 gap-3 px-6 pt-4 sm:grid-cols-4">
        {ACCURACY_STATS.map((s) => (
          <Card key={s.label} className="px-4 py-3.5">
            <p className="text-[12px] font-medium uppercase tracking-wide text-foreground-muted">{s.label}</p>
            <p className="tabular mt-1 text-[22px] font-semibold text-foreground">{s.value}</p>
            <p className="mt-1 text-[11px] text-foreground-faint">{s.hint}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 px-6 pt-4 lg:grid-cols-2">
        <ChartCard title="Synthetic Voice Detection Trend" description="Share of analyzed calls flagged for synthetic-speech indicators, by month">
          <TrendLineChart data={SYNTHETIC_DETECTION_TREND} color="var(--color-accent)" suffix="%" />
        </ChartCard>

        <ChartCard title="Average Risk Score" description="Organization-wide average impersonation risk score, by month">
          <TrendLineChart data={AVERAGE_RISK_TREND} color="var(--color-info)" />
        </ChartCard>

        <ChartCard title="High-Risk Call Trend" description="High-risk calls vs. critical alerts raised, by month">
          <DualLineChart data={HIGH_RISK_CALL_TREND} labelA="High-risk calls" labelB="Critical alerts" />
        </ChartCard>

        <ChartCard title="Speaker Mismatch Trend" description="Share of calls with speaker verification below policy threshold">
          <TrendLineChart data={SPEAKER_MISMATCH_TREND} color="var(--color-warning)" suffix="%" />
        </ChartCard>

        <ChartCard title="Risk by Hour of Day" description="Average risk score by call hour — elevated overnight and off-hours" className="lg:col-span-2">
          <HourlyRiskChart data={RISK_BY_HOUR} />
        </ChartCard>

        <ChartCard title="Risk by Department" description="Which departments receive the highest-risk impersonation attempts">
          <HorizontalBarChart data={RISK_BY_DEPARTMENT} />
        </ChartCard>

        <ChartCard title="Risk by Call Type" description="Which call intents carry the greatest impersonation risk">
          <HorizontalBarChart data={RISK_BY_CALL_TYPE} />
        </ChartCard>
      </div>
    </div>
  );
}
