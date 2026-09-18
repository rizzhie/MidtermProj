import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export function Section({ children, className, fullWidth }: SectionProps) {
  return (
    <section
      className={cn(
        "mx-auto px-6 py-10",
        fullWidth ? "w-full" : "max-w-6xl",
        className
      )}
    >
      {children}
    </section>
  );
}