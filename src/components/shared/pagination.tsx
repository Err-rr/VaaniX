"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";

export function Pagination({
  page,
  pageCount,
  totalItems,
  pageSize,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-5 py-3">
      <p className="text-[12px] text-foreground-muted">
        Showing <span className="font-medium text-foreground">{formatNumber(start)}–{formatNumber(end)}</span> of{" "}
        <span className="font-medium text-foreground">{formatNumber(totalItems)}</span>
      </p>
      <div className="flex items-center gap-1.5">
        <Button variant="secondary" size="icon-sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)} aria-label="Previous page">
          <ChevronLeft className="size-3.5" />
        </Button>
        <span className="px-2 text-[12.5px] tabular text-foreground-muted">
          Page {page} of {Math.max(1, pageCount)}
        </span>
        <Button variant="secondary" size="icon-sm" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)} aria-label="Next page">
          <ChevronRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
