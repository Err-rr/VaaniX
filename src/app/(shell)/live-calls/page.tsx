"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { FilterBar } from "@/components/shared/filter-bar";
import { FilterSelect } from "@/components/shared/filter-select";
import { LiveCallsTable } from "@/components/tables/live-calls-table";
import { useLiveCallsList } from "@/hooks/use-live-call";
import { SEVERITY_ORDER } from "@/lib/risk";
import type { Severity } from "@/types/common";

const SEVERITY_OPTIONS = [
  { value: "all", label: "All" },
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export default function LiveCallsPage() {
  const calls = useLiveCallsList();
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("all");

  const counts = useMemo(
    () => ({
      active: calls.filter((c) => c.status === "active").length,
      analyzing: calls.filter((c) => c.status === "analyzing").length,
      critical: calls.filter((c) => c.severity === "critical").length,
    }),
    [calls]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return calls
      .filter((c) => severity === "all" || c.severity === (severity as Severity))
      .filter(
        (c) =>
          !q ||
          c.id.toLowerCase().includes(q) ||
          c.claimedIdentity.toLowerCase().includes(q) ||
          c.callerNumber.toLowerCase().includes(q)
      )
      .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
  }, [calls, search, severity]);

  return (
    <div className="flex flex-col pb-8">
      <PageHeader
        title="Live Call Monitoring"
        subtitle="Authorized enterprise call streams"
        actions={
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-md border border-border bg-surface px-3.5 py-1.5 text-[12.5px]">
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <span className="size-1.5 rounded-full bg-critical animate-pulse-dot" /> {counts.active} Active Calls
            </span>
            <span className="hidden h-3.5 w-px bg-border sm:block" />
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <span className="size-1.5 rounded-full bg-warning animate-pulse-dot" /> {counts.analyzing} Under Analysis
            </span>
            <span className="hidden h-3.5 w-px bg-border sm:block" />
            <span className="flex items-center gap-1.5 font-medium text-critical-strong">
              <span className="size-1.5 rounded-full bg-critical" /> {counts.critical} Critical
            </span>
          </div>
        }
      />

      <div className="px-6">
        <Card className="overflow-hidden">
          <FilterBar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search calls, identities, numbers…"
          >
            <FilterSelect label="Severity" value={severity} onChange={setSeverity} options={SEVERITY_OPTIONS} />
          </FilterBar>
          <LiveCallsTable calls={filtered} />
        </Card>
      </div>
    </div>
  );
}
