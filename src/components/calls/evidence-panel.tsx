import { AlertTriangle, CircleCheck } from "lucide-react";
import type { EvidenceItem } from "@/types/call";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EvidencePanel({ evidence, assessment }: { evidence: EvidenceItem[]; assessment: string }) {
  return (
    <Card>
      <CardHeader className="border-b border-border pb-3">
        <CardTitle className="text-[14px]">Why is this call flagged?</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <ul className="flex flex-col gap-2.5">
          {evidence.map((item) => (
            <li key={item.id} className="flex items-start gap-2.5 text-[13px] leading-snug text-foreground">
              {item.kind === "supporting" ? (
                <CircleCheck className="mt-0.5 size-4 shrink-0 text-positive" />
              ) : (
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
              )}
              <span>{item.label}</span>
            </li>
          ))}
          {evidence.length === 0 && (
            <li className="text-[12.5px] text-foreground-faint">Evidence will populate as analysis progresses.</li>
          )}
        </ul>

        <div className="mt-4 rounded-md border border-border bg-surface-sunken/60 p-3.5">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-foreground-faint">
            System Assessment
          </p>
          <p className="text-[13px] leading-snug text-foreground">{assessment}</p>
        </div>
      </CardContent>
    </Card>
  );
}
