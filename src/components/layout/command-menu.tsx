"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import { ALL_NAV } from "./nav-config";
import { getCallById } from "@/data/mock-calls";
import { Button } from "@/components/ui/button";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function go(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  const directCallMatch = query.trim().length >= 4 ? getCallById(query.trim().toUpperCase()) : undefined;

  return (
    <>
      <Button variant="secondary" size="sm" className="gap-2 text-foreground-muted" onClick={() => setOpen(true)}>
        <Search className="size-3.5" />
        <span className="hidden sm:inline">Search…</span>
        <kbd className="ml-1 hidden rounded border border-border-strong bg-surface-sunken px-1.5 py-0.5 text-[10px] font-medium text-foreground-faint sm:inline">
          ⌘K
        </kbd>
      </Button>
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Command menu"
        className="fixed left-1/2 top-[18%] z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-lg border border-border bg-surface-raised shadow-lg"
      >
        <div className="flex items-center gap-2 border-b border-border px-3">
          <Search className="size-4 text-foreground-faint" />
          <Command.Input
            value={query}
            onValueChange={setQuery}
            placeholder="Jump to a page or call ID (e.g. VS-28491)…"
            className="h-11 w-full bg-transparent text-[13.5px] text-foreground outline-none placeholder:text-foreground-faint"
          />
        </div>
        <Command.List className="max-h-80 overflow-y-auto scrollbar-thin p-1.5">
          <Command.Empty className="px-3 py-6 text-center text-[12.5px] text-foreground-muted">
            No results found.
          </Command.Empty>
          {directCallMatch && (
            <Command.Group heading="Call" className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-foreground-faint">
              <Command.Item
                onSelect={() => go(`/live-calls/${directCallMatch.id}`)}
                className="flex cursor-pointer items-center justify-between rounded-md px-2.5 py-2 text-[13px] text-foreground data-[selected=true]:bg-surface-sunken"
              >
                <span>Open {directCallMatch.id}</span>
                <span className="text-[11.5px] text-foreground-faint">{directCallMatch.claimedIdentity}</span>
              </Command.Item>
            </Command.Group>
          )}
          <Command.Group heading="Navigate" className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-foreground-faint">
            {ALL_NAV.map((item) => (
              <Command.Item
                key={item.href}
                value={item.label}
                onSelect={() => go(item.href)}
                className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-foreground data-[selected=true]:bg-surface-sunken"
              >
                <item.icon className="size-3.5 text-foreground-faint" />
                {item.label}
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </Command.Dialog>
    </>
  );
}
