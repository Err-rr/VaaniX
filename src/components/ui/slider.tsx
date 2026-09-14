"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & { variant?: "default" | "risk-threshold" }
>(({ className, variant = "default", ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}
  >
    <SliderPrimitive.Track
      className={cn(
        "relative h-1.5 w-full grow overflow-hidden rounded-full border border-border bg-surface-sunken",
        variant === "risk-threshold" && "h-2 border border-border bg-surface"
      )}
    >
      <SliderPrimitive.Range className={cn("absolute h-full bg-accent", variant === "risk-threshold" && "bg-[#3b82f6]")} />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        "block size-4 rounded-full border-2 border-accent bg-surface shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
        variant === "risk-threshold" && "size-5 border-[3px] border-surface bg-[#3b82f6] shadow-[0_0_0_1px_#60a5fa] focus-visible:ring-[#3b82f6]/30"
      )}
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
