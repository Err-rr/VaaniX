"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FilterBar } from "@/components/shared/filter-bar";
import { FilterSelect } from "@/components/shared/filter-select";
import { Pagination } from "@/components/shared/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AUDIT_LOG } from "@/data/mock-settings";
import { formatDateTime } from "@/lib/utils";

const RESULT_OPTIONS = [
  { value: "all", label: "All" },
  { value: "success", label: "Success" },
  { value: "failure", label: "Failure" },
];

const PAGE_SIZE = 15;

export default function AuditLogPage() {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return AUDIT_LOG.filter((e) => result === "all" || e.result === result).filter(
      (e) =>
        !q ||
        e.user.toLowerCase().includes(q) ||
        e.action.toLowerCase().includes(q) ||
        e.resource.toLowerCase().includes(q) ||
        e.ip.includes(q)
    );
  }, [search, result]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col pb-8">
      <PageHeader title="Audit Log" subtitle="Immutable record of administrative and analyst actions" />

      <div className="px-6">
        <Card className="overflow-hidden">
          <FilterBar
            searchValue={search}
            onSearchChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            searchPlaceholder="Search by user, action, resource, or IP…"
            actions={
              <Button variant="secondary" size="sm">
                <Download className="size-3.5" /> Export
              </Button>
            }
          >
            <FilterSelect
              label="Result"
              value={result}
              onChange={(v) => {
                setResult(v);
                setPage(1);
              }}
              options={RESULT_OPTIONS}
            />
          </FilterBar>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="whitespace-nowrap text-[12.5px] text-foreground-muted">{formatDateTime(entry.timestamp)}</TableCell>
                  <TableCell className="text-[12.5px] font-medium text-foreground">{entry.user}</TableCell>
                  <TableCell className="text-[12.5px] text-foreground">{entry.action}</TableCell>
                  <TableCell className="font-mono text-[12px] text-foreground-muted">{entry.resource}</TableCell>
                  <TableCell className="font-mono text-[12px] text-foreground-muted">{entry.ip}</TableCell>
                  <TableCell>
                    <Badge variant={entry.result === "success" ? "positive" : "critical"}>{entry.result}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination page={page} pageCount={pageCount} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </Card>
      </div>
    </div>
  );
}
