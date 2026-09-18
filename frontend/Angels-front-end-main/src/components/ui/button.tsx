import type { ComponentProps, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

const variants = {
  primary:
    "bg-caramel-500 text-cream-50 hover:bg-caramel-600 shadow-sm shadow-cocoa-900/10",
  secondary:
    "bg-cream-100 text-cocoa-900 border border-cocoa-900/15 hover:bg-cream-200",
  ghost: "bg-transparent text-cocoa-900 hover:bg-cocoa-900/5",
  outline:
    "bg-transparent border border-caramel-500 text-caramel-600 hover:bg-caramel-500 hover:text-cream-50",
} as const;

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
} as const;

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

type ButtonProps<T extends ElementType = "button"> = {
  as?: T;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
} & ComponentProps<T>;

export function Button<T extends ElementType = "button">({
  as,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps<T>) {
  const Component = (as ?? "button") as ElementType;
  return (
    <Component
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant as Variant],
        sizes[size as Size],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}