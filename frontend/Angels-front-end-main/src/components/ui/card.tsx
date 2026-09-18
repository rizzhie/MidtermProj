import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-card bg-cream-50 border border-cocoa-900/8 shadow-sm shadow-cocoa-900/5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}