"use client";

import { useMemo, useState } from "react";
import { Columns3, Download, Star } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/shared/filter-bar";
import { FilterSelect } from "@/components/shared/filter-select";
import { Pagination } from "@/components/shared/pagination";
import { CallHistoryTable, type CallHistoryColumns } from "@/components/tables/call-history-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ALL_CALLS } from "@/data/mock-calls";
import type { Severity } from "@/types/common";

const SEVERITY_OPTIONS = [
  { value: "all", label: "All Risk" },
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const DECISION_OPTIONS = [
  { value: "all", label: "All Decisions" },
  { value: "escalated", label: "Escalated" },
  { value: "verification_required", label: "Verification Required" },
  { value: "monitoring", label: "Monitoring" },
  { value: "cleared", label: "Cleared" },
];

const SAVED_VIEWS = [
  { label: "All Calls", severity: "all", decision: "all" },
  { label: "Critical Only", severity: "critical", decision: "all" },
  { label: "Escalated Cases", severity: "all", decision: "escalated" },
  { label: "Cleared Calls", severity: "all", decision: "cleared" },
] as const;

const PAGE_SIZE = 20;

export default function CallHistoryPage() {
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("all");
  const [decision, setDecision] = useState("all");
  const [page, setPage] = useState(1);
  const [columns, setColumns] = useState<CallHistoryColumns>({
    department: true,
    duration: true,
    channel: false,
    agent: false,
  });

  const sorted = useMemo(() => [...ALL_CALLS].sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1)), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sorted
      .filter((c) => severity === "all" || c.severity === (severity as Severity))
      .filter((c) => decision === "all" || c.decision === decision)
      .filter(
        (c) =>
          !q ||
          c.id.toLowerCase().includes(q) ||
          c.claimedIdentity.toLowerCase().includes(q) ||
          c.callerNumber.toLowerCase().includes(q)
      );
  }, [sorted, search, severity, decision]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function applyFilters(next: { severity: string; decision: string }) {
    setSeverity(next.severity);
    setDecision(next.decision);
    setPage(1);
  }

  function exportCsv() {
    const header = ["Call ID", "Date", "Caller", "Claimed Identity", "Synthetic Score", "Speaker Match", "Risk", "Decision"];
    const rows = filtered.map((c) => [c.id, c.startedAt, c.callerNumber, c.claimedIdentity, c.syntheticScore, c.speakerMatchScore, c.overallRisk, c.decision]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "vaanix-call-history.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col pb-8">
      <PageHeader title="Call History" subtitle="Complete audit trail of analyzed voice calls" />

      <div className="px-6">
        <Card className="overflow-hidden">
          <FilterBar
            searchValue={search}
            onSearchChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            searchPlaceholder="Search calls, identities, numbers…"
            actions={
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="sm">
                      <Star className="size-3.5" /> Saved Views
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Saved Views</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {SAVED_VIEWS.map((view) => (
                      <button
                        key={view.label}
                        onClick={() => applyFilters(view)}
                        className="flex w-full cursor-pointer items-center rounded-[5px] px-2.5 py-1.5 text-left text-[13px] text-foreground hover:bg-surface-sunken"
                      >
                        {view.label}
                      </button>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="sm">
                      <Columns3 className="size-3.5" /> Columns
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {(Object.keys(columns) as (keyof CallHistoryColumns)[]).map((key) => (
                      <DropdownMenuCheckboxItem
                        key={key}
                        checked={columns[key]}
                        onCheckedChange={(checked) => setColumns((c) => ({ ...c, [key]: checked }))}
                      >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="secondary" size="sm" onClick={exportCsv}>
                  <Download className="size-3.5" /> Export CSV
                </Button>
              </>
            }
          >
            <FilterSelect
              label="Risk"
              value={severity}
              onChange={(v) => {
                setSeverity(v);
                setPage(1);
              }}
              options={SEVERITY_OPTIONS}
              className="w-full sm:w-[150px]"
            />
            <FilterSelect
              label="Decision"
              value={decision}
              onChange={(v) => {
                setDecision(v);
                setPage(1);
              }}
              options={DECISION_OPTIONS}
              className="w-full sm:w-[200px]"
            />
          </FilterBar>
          <CallHistoryTable calls={pageItems} columns={columns} />
          <Pagination page={page} pageCount={pageCount} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </Card>
      </div>
    </div>
  );
}
