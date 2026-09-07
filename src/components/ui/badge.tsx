import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[12px] font-medium leading-5",
  {
    variants: {
      variant: {
        default: "bg-surface-sunken border-border text-foreground-muted",
        outline: "bg-transparent border-border-strong text-foreground",
        accent: "bg-accent-soft border-transparent text-accent-strong",
        critical: "bg-critical-soft border-transparent text-critical-strong",
        warning: "bg-warning-soft border-transparent text-warning-strong",
        positive: "bg-positive-soft border-transparent text-positive-strong",
        info: "bg-info-soft border-transparent text-info",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { Badge, badgeVariants };
