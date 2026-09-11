import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { formatCurrency } from "@/lib/utils";

export function CartItemRow({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 border-b border-cocoa-900/8 py-6 last:border-0 sm:grid-cols-[auto_2fr_1fr_1fr]">
      <img
        src={item.image}
        alt={item.name}
        className="h-16 w-16 rounded-xl object-cover"
      />

      <div>
        <p className="font-medium text-cocoa-900">{item.name}</p>
        <p className="text-sm text-caramel-600">{formatCurrency(item.price)}</p>
        <button
          onClick={() => onRemove(item.id)}
          className="mt-1 rounded-full bg-cream-200 px-3 py-1 text-xs font-medium text-cocoa-900/70 hover:bg-cream-200/70"
        >
          Remove
        </button>
      </div>

      <QuantityStepper
        value={item.quantity}
        onDecrease={() => onUpdateQuantity(item.id, item.quantity - 1)}
        onIncrease={() => onUpdateQuantity(item.id, item.quantity + 1)}
        className="justify-self-start sm:justify-self-center"
      />

      <p className="justify-self-end font-medium text-cocoa-900">
        {formatCurrency(item.price * item.quantity)}
      </p>
    </div>
  );
}
