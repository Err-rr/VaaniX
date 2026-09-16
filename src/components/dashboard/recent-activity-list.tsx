import { AlertTriangle } from "lucide-react";
import type { FraudReport } from "@/types/fraud-report";
import { EmptyState } from "@/components/shared/empty-state";

const HEADERS = ["Reporter", "Suspected Mobile", "Incident", "Bank / Transaction", "Source"];

/** Tabulated view of parsed AI voice-clone fraud reports. */
export function RecentActivityList({ reports }: { reports: FraudReport[] }) {
  if (reports.length === 0) {
    return <EmptyState icon={AlertTriangle} title="No reports yet" description="Fraud reports from emails.json will appear here." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] border-collapse text-left text-[12.5px]">
        <thead>
          <tr className="border-b border-border text-[11px] font-semibold uppercase tracking-wide text-foreground-faint">
            {HEADERS.map((h) => (
              <th key={h} scope="col" className="whitespace-nowrap py-2 pr-4 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {reports.map((report) => (
            <tr key={report.id} className="align-top">
              <td className="py-3 pr-4">
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                  <AlertTriangle className="size-3.5 shrink-0 text-critical" aria-hidden />
                  {report.reporterName}
                </div>
                <div className="mt-0.5 text-foreground-faint">{report.reporterMobile}</div>
                <div className="text-foreground-faint">{report.reporterEmail}</div>
              </td>
              <td className="whitespace-nowrap py-3 pr-4 font-medium text-foreground">{report.suspectedMobile}</td>
              <td className="whitespace-nowrap py-3 pr-4 text-foreground-muted">
                <div>{report.dateOfIncident}</div>
                <div className="text-foreground-faint">{report.approxTime}</div>
              </td>
              <td className="whitespace-nowrap py-3 pr-4 text-foreground-muted">
                <div>{report.bankAccount}</div>
                <div className="text-foreground-faint">
                  {report.amountLost} · {report.transactionId}
                </div>
              </td>
              <td className="max-w-[220px] py-3 text-foreground-faint">
                <div className="truncate text-foreground-muted">{report.subject}</div>
                <div className="truncate">{report.from}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
