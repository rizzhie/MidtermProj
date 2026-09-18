import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";

interface BrandMarkProps {
  className?: string;
  dark?: boolean;
}

export function BrandMark({ className, dark = false }: BrandMarkProps) {
  return (
    <Link to="/" className={cn("flex items-center gap-3", className)}>
      <span
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-full border-2 font-display text-[0.6rem] uppercase tracking-wide",
          dark
            ? "border-cocoa-900 text-cocoa-900"
            : "border-cream-50 text-cream-50"
        )}
      >
        A&P
      </span>
      <span
        className={cn(
          "font-display text-lg leading-none",
          dark ? "text-cocoa-900" : "text-cream-50"
        )}
      >
        Angel's
        <span className="block text-[0.6rem] font-sans font-medium uppercase tracking-[0.2em] opacity-70">
          Cake &amp; Pastries
        </span>
      </span>
    </Link>
  );
}