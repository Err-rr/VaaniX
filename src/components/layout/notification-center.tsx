"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { ALL_ALERTS } from "@/data/mock-alerts";
import { SEVERITY_ORDER } from "@/lib/risk";
import { formatRelativeTime } from "@/lib/utils";
import { SeverityDot } from "@/components/shared/severity-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const RECENT_ALERTS = [...ALL_ALERTS]
  .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] || (a.createdAt < b.createdAt ? 1 : -1))
  .slice(0, 6);

export function NotificationCenter() {
  const unreadCount = RECENT_ALERTS.filter((a) => a.severity === "critical" || a.severity === "high").length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex size-1.5 rounded-full bg-critical" />
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-w-[calc(100vw-2rem)]">
        <DropdownMenuLabel className="flex items-center justify-between px-2.5">
          <span>Recent Alerts</span>
          <Link href="/alerts" className="text-[11px] font-medium normal-case text-accent hover:underline">
            View all
          </Link>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex flex-col">
          {RECENT_ALERTS.map((alert) => (
            <DropdownMenuItem key={alert.id} asChild className="flex-col items-start gap-0.5 py-2">
              <Link href={`/alerts?focus=${alert.id}`}>
                <span className="flex w-full items-center gap-2">
                  <SeverityDot severity={alert.severity} />
                  <span className="flex-1 truncate text-[12.5px] font-medium text-foreground">{alert.reason}</span>
                </span>
                <span className="pl-4 text-[11.5px] text-foreground-faint">
                  {alert.callId} · {formatRelativeTime(alert.createdAt)}
                </span>
              </Link>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
