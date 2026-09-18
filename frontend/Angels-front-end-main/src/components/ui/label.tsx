import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function Label({ className, children, ...props }: ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "mb-1 block text-sm text-cocoa-900/70",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
}