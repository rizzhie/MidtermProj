import { cn } from "@/lib/utils";

export function Input({ className, ...props }) {
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

export function Select({ className, children, ...props }) {
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

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border border-cocoa-900/15 bg-cream-50 px-4 py-2.5 text-sm text-cocoa-900 placeholder:text-cocoa-900/40 transition-colors focus:border-caramel-500",
        className
      )}
      {...props}
    />
  );
}
