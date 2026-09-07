"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsUpDown, LogOut, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_NAV, PRIMARY_NAV, type NavItem } from "./nav-config";
import { Logo } from "./logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ORGANIZATION, CURRENT_USER } from "@/data/constants";

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[13px] font-medium transition-colors",
        active
          ? "bg-accent-soft text-accent-strong"
          : "text-foreground-muted hover:bg-surface-sunken hover:text-foreground"
      )}
    >
      <Icon className={cn("size-[15px] shrink-0", active ? "text-accent-strong" : "text-foreground-faint group-hover:text-foreground-muted")} />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/settings") return pathname === "/settings";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[228px] shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex h-14 items-center border-b border-border px-4">
        <Logo />
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4">
        <div className="flex flex-col gap-0.5">
          {PRIMARY_NAV.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} />
          ))}
        </div>

        <div className="my-4 h-px bg-border" />

        <p className="px-2.5 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-foreground-faint">
          Administration
        </p>
        <div className="flex flex-col gap-0.5">
          {ADMIN_NAV.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} />
          ))}
        </div>
      </nav>

      <div className="border-t border-border p-3">
        <div className="mb-2.5 flex items-center gap-2 rounded-md px-1">
          <span className="size-1.5 shrink-0 rounded-full bg-positive animate-pulse-dot" aria-hidden />
          <span className="text-[11.5px] font-medium text-foreground-muted">System Operational</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2.5 rounded-md px-1.5 py-1.5 text-left transition-colors hover:bg-surface-sunken">
              <Avatar className="size-7">
                <AvatarFallback>{CURRENT_USER.initials}</AvatarFallback>
              </Avatar>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12.5px] font-medium text-foreground">{ORGANIZATION.name}</span>
                <span className="block truncate text-[11.5px] text-foreground-faint">{CURRENT_USER.name}</span>
              </span>
              <ChevronsUpDown className="size-3.5 shrink-0 text-foreground-faint" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" className="w-56">
            <DropdownMenuLabel>{CURRENT_USER.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserCircle className="size-3.5" /> Account settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive>
              <LogOut className="size-3.5" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
