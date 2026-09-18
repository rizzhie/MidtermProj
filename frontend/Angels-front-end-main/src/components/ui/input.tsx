import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-cocoa-900/15 bg-cream-50 px-4 py-2.5 text-sm text-cocoa-900 placeholder:text-cocoa-900/40 transition-colors focus:border-caramel-500",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "w-full rounded-xl border border-cocoa-900/15 bg-cream-50 px-4 py-2.5 text-sm text-cocoa-900 transition-colors focus:border-caramel-500",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}