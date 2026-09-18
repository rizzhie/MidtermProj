import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CartItemRow } from "@/components/features/cart/cart-item-row";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";

export function CartSection() {
  const { items, updateQuantity, removeFromCart, subtotal, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-cocoa-900/25" />
        <h1 className="mt-4 font-display text-3xl text-cocoa-900">
          Your cart is empty
        </h1>
        <p className="mt-2 text-cocoa-900/60">
          Browse the menu and add something sweet.
        </p>
        <Button as={Link} to="/menu" className="mt-6">
          View our Menu
        </Button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <div className="flex items-baseline justify-between">
        <h1 className="font-display text-4xl text-cocoa-900">My Cart</h1>
        <p className="text-cocoa-900/60">{itemCount} items</p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <Card className="p-6">
          {items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}
        </Card>

        <Card className="h-fit p-6">
          <h2 className="font-display text-xl text-cocoa-900">Summary</h2>
          <div className="mt-4 flex justify-between text-sm text-cocoa-900/70">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <p className="mt-1 text-xs text-cocoa-900/45">
            Shipping calculated at checkout.
          </p>
          <Button as={Link} to="/checkout" className="mt-6 w-full">
            Proceed to Checkout
          </Button>
          <Link
            to="/menu"
            className="mt-4 flex items-center justify-center gap-1.5 text-sm text-cocoa-900/60 hover:text-cocoa-900"
          >
            <ArrowLeft className="h-4 w-4" /> Continue ordering
          </Link>
        </Card>
      </div>
    </section>
  );
}