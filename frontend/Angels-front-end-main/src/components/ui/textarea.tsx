import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

interface TextareaProps extends ComponentProps<"textarea"> {
  error?: boolean | string;
}

export function Textarea({ className, error, ...props }: TextareaProps) {
  return (
    <div>
      <textarea
        className={cn(
          "w-full rounded-xl border bg-cream-50 px-4 py-2.5 text-sm text-cocoa-900 placeholder:text-cocoa-900/40 transition-colors focus:border-caramel-500",
          error ? "border-red-500" : "border-cocoa-900/15",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}