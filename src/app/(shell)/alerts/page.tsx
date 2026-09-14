"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { FilterBar } from "@/components/shared/filter-bar";
import { FilterSelect } from "@/components/shared/filter-select";
import { AlertsTable } from "@/components/tables/alerts-table";
import { AlertDetailSheet } from "@/components/alerts/alert-detail-sheet";
import { ALL_ALERTS, ALERT_COUNTS } from "@/data/mock-alerts";
import { SEVERITY_ORDER } from "@/lib/risk";
import type { Alert } from "@/types/alert";
import type { Severity } from "@/types/common";

const SEVERITY_OPTIONS = [
  { value: "all", label: "All" },
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "investigating", label: "Investigating" },
  { value: "escalated", label: "Escalated" },
  { value: "resolved", label: "Resolved" },
  { value: "dismissed", label: "Dismissed" },
];

const COUNT_CARDS: { key: keyof typeof ALERT_COUNTS; label: string; cls: string }[] = [
  { key: "critical", label: "Critical", cls: "text-critical-strong" },
  { key: "high", label: "High", cls: "text-warning-strong" },
  { key: "medium", label: "Medium", cls: "text-info" },
  { key: "low", label: "Low", cls: "text-positive-strong" },
];

export default function AlertsPage() {
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("all");
  const [status, setStatus] = useState("all");
  const [riskThreshold, setRiskThreshold] = useState(0);
  const [selected, setSelected] = useState<Alert | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return [...ALL_ALERTS]
      .filter((a) => severity === "all" || a.severity === (severity as Severity))
      .filter((a) => status === "all" || a.status === status)
      .filter((a) => a.riskScore > riskThreshold)
      .filter(
        (a) =>
          !q ||
          a.id.toLowerCase().includes(q) ||
          a.callId.toLowerCase().includes(q) ||
          a.claimedIdentity.toLowerCase().includes(q) ||
          a.reason.toLowerCase().includes(q)
      )
      .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] || (a.createdAt < b.createdAt ? 1 : -1));
  }, [search, severity, status, riskThreshold]);

  function exportCsv() {
    const escapeCsv = (value: string | number | null) => {
      const text = value == null ? "" : String(value);
      return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
    };
    const header = ["Alert ID", "Call ID", "Client", "Caller Number", "Risk Score", "Severity", "Reason", "Assigned To", "Created", "Status"];
    const rows = filtered.map((alert) => [
      alert.id,
      alert.callId,
      alert.claimedIdentity,
      alert.callerNumber,
      alert.riskScore,
      alert.severity,
      alert.reason,
      alert.assignedTo,
      alert.createdAt,
      alert.status,
    ]);
    const csv = [header, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `voxaegis-alerts-risk-over-${riskThreshold}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col pb-8">
      <PageHeader title="Security Alerts" subtitle="Triage and respond to flagged voice impersonation activity" />

      <div className="grid grid-cols-2 gap-3 px-6 sm:grid-cols-4">
        {COUNT_CARDS.map((c) => (
          <Card key={c.key} className="px-4 py-3.5">
            <p className="text-[12px] font-medium uppercase tracking-wide text-foreground-muted">{c.label}</p>
            <p className={`tabular mt-1 text-[24px] font-semibold ${c.cls}`}>{ALERT_COUNTS[c.key]}</p>
          </Card>
        ))}
      </div>

      <div className="px-6 pt-4">
        <Card className="overflow-hidden">
          <FilterBar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search by alert ID, call ID, identity, or reason…"
            actions={
              <Button variant="secondary" size="sm" onClick={exportCsv}>
                <Download className="size-3.5" /> Export
              </Button>
            }
          >
            <FilterSelect label="Severity" value={severity} onChange={setSeverity} options={SEVERITY_OPTIONS} />
            <FilterSelect label="Status" value={status} onChange={setStatus} options={STATUS_OPTIONS} className="w-full sm:w-[170px]" />
            <div className="ml-auto flex min-w-[300px] flex-1 items-center gap-3 pl-2" aria-label="Risk score threshold">
              <span className="whitespace-nowrap text-[11.5px] font-medium text-foreground-muted">Risk score</span>
              <Slider
                value={[riskThreshold]}
                onValueChange={([value]) => setRiskThreshold(value)}
                min={0}
                max={100}
                step={1}
                aria-label="Minimum risk score"
                variant="risk-threshold"
                className="min-w-0 flex-1"
              />
              <output className="flex h-8 min-w-[94px] items-baseline justify-center gap-1.5 rounded-md border border-border bg-surface px-2.5 font-mono text-[13px] font-semibold text-foreground shadow-sm">
                {riskThreshold}
                <span className="text-[11px] font-medium text-foreground-muted">/ 100</span>
              </output>
            </div>
          </FilterBar>
          <AlertsTable alerts={filtered.slice(0, 60)} onSelect={setSelected} />
        </Card>
      </div>

      <AlertDetailSheet alert={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </div>
  );
}
