import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { shippingOptions } from "@/data/siteContent";
import type { ShippingOptionId } from "@/data/siteContent";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/lib/format";

interface ShippingOptionModalProps {
  open: boolean;
  onClose: () => void;
  selected: ShippingOptionId;
  onSelect: (id: ShippingOptionId) => void;
}

export function ShippingOptionModal({
  open,
  onClose,
  selected,
  onSelect,
}: ShippingOptionModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="font-display text-2xl text-cocoa-900">Shipping Options</h2>
      <div className="mt-5 space-y-3">
        {shippingOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={cn(
              "flex w-full items-center justify-between rounded-xl border px-5 py-4 text-left transition-colors",
              selected === option.id
                ? "border-caramel-500 bg-caramel-500/10"
                : "border-cocoa-900/12 hover:border-cocoa-900/25"
            )}
          >
            <span className="font-medium text-cocoa-900">{option.label}</span>
            <span className="text-caramel-600">
              {option.price === 0 ? "Free" : formatCurrency(option.price)}
            </span>
          </button>
        ))}
      </div>
      <Button onClick={onClose} variant="secondary" className="mt-6 w-full">
        Confirm
      </Button>
    </Modal>
  );
}