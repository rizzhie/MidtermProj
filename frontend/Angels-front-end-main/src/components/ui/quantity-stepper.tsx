import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

interface QuantityStepperProps {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  className?: string;
}

export function QuantityStepper({
  value,
  onDecrease,
  onIncrease,
  className,
}: QuantityStepperProps) {
  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <button
        type="button"
        onClick={onDecrease}
        aria-label="Decrease quantity"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-cream-200 text-cocoa-800 transition-colors hover:bg-cocoa-900/15"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-4 text-center font-medium tabular-nums">{value}</span>
      <button
        type="button"
        onClick={onIncrease}
        aria-label="Increase quantity"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-cream-200 text-cocoa-800 transition-colors hover:bg-cocoa-900/15"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}