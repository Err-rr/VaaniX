"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronsUpDown, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRIMARY_NAV, type NavItem } from "./nav-config";
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
import { useAuthStore } from "@/store/auth-store";

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
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  function handleSignOut() {
    signOut();
    router.replace("/login");
  }

  return (
    <aside className="flex h-full w-[212px] shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex h-14 items-center border-b border-border px-4">
        <Logo />
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4">
        <div className="flex flex-col gap-0.5">
          {PRIMARY_NAV.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} />
          ))}
        </div>
      </nav>

      <div className="border-t border-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2.5 rounded-md px-1.5 py-1.5 text-left transition-colors hover:bg-surface-sunken">
              <Avatar className="size-7">
                <AvatarFallback>{user?.initials ?? "—"}</AvatarFallback>
              </Avatar>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12.5px] font-medium text-foreground">{user?.name ?? "Signed out"}</span>
              </span>
              <ChevronsUpDown className="size-3.5 shrink-0 text-foreground-faint" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" className="w-56">
            <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onSelect={handleSignOut}>
              <LogOut className="size-3.5" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
