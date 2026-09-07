"use client";

import { toast } from "sonner";
import { KeyRound, Plug, RefreshCcw } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { API_CREDENTIALS, INTEGRATIONS } from "@/data/mock-settings";
import { formatDateTime, formatRelativeTime } from "@/lib/utils";

const CATEGORIES = ["Voice Infrastructure", "API", "Fraud & Risk"] as const;

export default function IntegrationsPage() {
  return (
    <div className="flex flex-col pb-8">
      <PageHeader title="Integrations" subtitle="Voice infrastructure, API, and fraud-engine connections" />

      <div className="flex flex-col gap-5 px-6">
        {CATEGORIES.map((category) => (
          <div key={category}>
            <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-foreground-faint">{category}</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {INTEGRATIONS.filter((i) => i.category === category).map((integration) => (
                <Card key={integration.id} className="flex flex-col p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-surface-sunken">
                        <Plug className="size-4 text-foreground-muted" />
                      </div>
                      <p className="text-[13.5px] font-semibold text-foreground">{integration.name}</p>
                    </div>
                    <StatusBadge status={integration.status} />
                  </div>
                  <p className="mt-2.5 text-[12.5px] leading-snug text-foreground-muted">{integration.description}</p>
                  <p className="mt-2.5 text-[11.5px] text-foreground-faint">
                    {integration.lastSyncedAt ? `Last synced ${formatRelativeTime(integration.lastSyncedAt)}` : "Not yet synced"}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        ))}

        <Card>
          <CardHeader className="flex-row items-center justify-between border-b border-border pb-3">
            <CardTitle className="text-[14px]">API Credentials</CardTitle>
            <Button size="sm" variant="secondary" onClick={() => toast.success("New API credential generated")}>
              <KeyRound className="size-3.5" /> Generate Credential
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Label</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {API_CREDENTIALS.map((cred) => (
                  <TableRow key={cred.id}>
                    <TableCell className="font-medium text-foreground">{cred.label}</TableCell>
                    <TableCell className="font-mono text-[12px] text-foreground-muted">{cred.keyMasked}</TableCell>
                    <TableCell className="font-mono text-[11.5px] text-foreground-faint">{cred.scope}</TableCell>
                    <TableCell className="text-[12.5px] text-foreground-muted">{formatDateTime(cred.createdAt)}</TableCell>
                    <TableCell className="text-[12.5px] text-foreground-muted">{formatRelativeTime(cred.lastUsedAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" onClick={() => toast.message(`Rotated credential — ${cred.label}`)}>
                        <RefreshCcw className="size-3.5" /> Rotate
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
