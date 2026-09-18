import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface TagProps {
  children: ReactNode;
  className?: string;
}

export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={cn(
        "rounded-full bg-cream-200 px-2.5 py-0.5 text-sm text-cocoa-900/70",
        className
      )}
    >
      {children}
    </span>
  );
}