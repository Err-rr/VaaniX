"use client";

import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { CommandMenu } from "./command-menu";
import { NotificationCenter } from "./notification-center";

export function Topbar({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border bg-surface px-3 sm:gap-3 sm:px-5">
      <div className="flex min-w-0 items-center gap-2">
        <Button variant="ghost" size="icon" className="shrink-0 lg:hidden" onClick={onOpenMobileNav} aria-label="Open menu">
          <Menu className="size-4" />
        </Button>
        <Logo className="shrink-0 lg:hidden" />
        <CommandMenu />
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <NotificationCenter />
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
      </div>
    </header>
  );
}
