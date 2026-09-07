import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2 py-14 text-center", className)}>
      <div className="flex size-10 items-center justify-center rounded-full bg-surface-sunken">
        <Icon className="size-5 text-foreground-faint" />
      </div>
      <p className="text-[13.5px] font-medium text-foreground">{title}</p>
      {description && <p className="max-w-sm text-[12.5px] text-foreground-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
