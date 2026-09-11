import { Wallet, CreditCard, Smartphone } from "lucide-react";
import { paymentMethods } from "@/data/siteContent";
import { cn } from "@/lib/utils";

const icons = {
  cod: Wallet,
  card: CreditCard,
  gcash: Smartphone,
};

export function PaymentMethodPicker({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {paymentMethods.map((method) => {
        const Icon = icons[method.id];
        const active = selected === method.id;
        return (
          <button
            key={method.id}
            type="button"
            onClick={() => onSelect(method.id)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl border px-4 py-4 transition-colors",
              active
                ? "border-caramel-500 bg-caramel-500/10"
                : "border-cocoa-900/12 hover:border-cocoa-900/25"
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5",
                active ? "text-caramel-600" : "text-cocoa-900/60"
              )}
            />
            <span className="text-xs font-medium text-cocoa-900">
              {method.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
