"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { CommandMenu } from "./command-menu";
import { DemoModeToggle } from "./demo-mode-toggle";
import { NotificationCenter } from "./notification-center";

export function Topbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-surface px-5">
      <div className="flex items-center gap-2">
        <CommandMenu />
      </div>
      <div className="flex items-center gap-2">
        <DemoModeToggle />
        <NotificationCenter />
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
      </div>
    </header>
  );
}
