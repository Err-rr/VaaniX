import { AlertTriangle } from "lucide-react";
import type { FraudReport } from "@/types/fraud-report";
import { EmptyState } from "@/components/shared/empty-state";

/** Compact, editorial activity list of parsed AI voice-clone fraud reports. */
export function RecentActivityList({ reports }: { reports: FraudReport[] }) {
  if (reports.length === 0) {
    return <EmptyState icon={AlertTriangle} title="No reports yet" description="Fraud reports from emails.json will appear here." />;
  }

  return (
    <ul className="divide-y divide-border">
      {reports.map((report) => (
        <li key={report.id}>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 py-3">
            <AlertTriangle className="size-3.5 shrink-0 text-critical" aria-hidden />
            <span className="shrink-0 font-mono text-[12.5px] text-foreground-muted sm:w-[80px]">{report.id}</span>
            <span className="min-w-0 flex-1 truncate text-[13px] text-foreground">
              {report.reporterName}
              <span className="ml-1.5 text-foreground-faint">{report.reporterMobile}</span>
            </span>
            <span className="shrink-0 text-[12.5px] text-foreground-muted sm:w-[170px]">
              Suspected: <span className="font-medium text-foreground">{report.suspectedMobile}</span>
            </span>
            <span className="shrink-0 text-[12px] text-foreground-faint sm:w-24 sm:text-right">
              {report.dateOfIncident}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
