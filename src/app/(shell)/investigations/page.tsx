"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { FilterBar } from "@/components/shared/filter-bar";
import { FilterSelect } from "@/components/shared/filter-select";
import { InvestigationsTable } from "@/components/tables/investigations-table";
import { ALL_INVESTIGATIONS } from "@/data/mock-investigations";

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "escalated", label: "Escalated" },
  { value: "closed", label: "Closed" },
];

export default function InvestigationsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ALL_INVESTIGATIONS.filter((inv) => status === "all" || inv.status === status).filter(
      (inv) =>
        !q ||
        inv.id.toLowerCase().includes(q) ||
        inv.title.toLowerCase().includes(q) ||
        inv.subject.toLowerCase().includes(q)
    ).sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  }, [search, status]);

  const openCount = ALL_INVESTIGATIONS.filter((i) => i.status === "open" || i.status === "in_progress").length;

  return (
    <div className="flex flex-col pb-8">
      <PageHeader
        title="Investigations"
        subtitle="Active and historical fraud analyst casework"
        actions={
          <div className="rounded-md border border-border bg-surface px-3 py-1.5 text-[12.5px] font-medium text-foreground">
            {openCount} open
          </div>
        }
      />

      <div className="px-6">
        <Card className="overflow-hidden">
          <FilterBar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search by investigation ID, title, or subject…"
          >
            <FilterSelect label="Status" value={status} onChange={setStatus} options={STATUS_OPTIONS} className="w-full sm:w-[170px]" />
          </FilterBar>
          <InvestigationsTable investigations={filtered} />
        </Card>
      </div>
    </div>
  );
}
