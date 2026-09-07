import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export function ChartCard({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-4 pb-1">
        <div>
          <h3 className="text-[13px] font-semibold text-foreground">{title}</h3>
          {description && <p className="mt-0.5 text-[12px] text-foreground-muted">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className={cn("px-3 pb-4 pt-2", bodyClassName)}>{children}</div>
    </Card>
  );
}
