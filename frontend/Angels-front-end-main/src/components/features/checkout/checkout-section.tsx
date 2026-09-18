import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MapPin, ChevronRight, ArrowLeft, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShippingOptionModal } from "@/components/features/checkout/shipping-option-modal";
import { OrderSuccessModal } from "@/components/features/checkout/order-success-modal";
import { useCart } from "@/context/CartContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { shippingOptions } from "@/data/siteContent";
import type { ShippingOptionId } from "@/data/siteContent";
import { formatCurrency } from "@/lib/format";
import { placeOrder } from "@/lib/axios";

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function CheckoutSection() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useCustomerAuth();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState(user?.name ?? "");
  const [customerEmail, setCustomerEmail] = useState(user?.email ?? "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone ?? "");
  const [address, setAddress] = useState(user?.address ?? "");

  const [shippingId, setShippingId] = useState<ShippingOptionId>("standard");
  const [shippingModalOpen, setShippingModalOpen] = useState(false);
  const [note, setNote] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shipping =
    shippingOptions.find((option) => option.id === shippingId)?.price ?? 0;
  const total = subtotal + shipping;

  async function handlePlaceOrder() {
    setError(null);
    setSubmitting(true);
    try {
      await placeOrder({
        customer_name: customerName,
        customer_email: customerEmail || null,
        customer_phone: customerPhone,
        delivery_address: address,
        shipping_option: shippingId,
        shipping_price: shipping,
        payment_method: "cod",
        note: note || null,
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      });
      setOrderPlaced(true);
    } catch (err) {
      setError((err as Error).message || "Couldn't place your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleContinue() {
    clearCart();
    navigate("/");
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-cocoa-900">
          Sign in to check out
        </h1>
        <p className="mt-2 text-cocoa-900/60">
          Please log in or create an account to continue with your order.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button as={Link} to="/login" variant="outline">
            Log in
          </Button>
          <Button as={Link} to="/signup">
            Sign up
          </Button>
        </div>
      </section>
    );
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-cocoa-900">
          Nothing to check out yet
        </h1>
        <p className="mt-2 text-cocoa-900/60">
          Add something from the menu before checking out.
        </p>
        <Button as={Link} to="/menu" className="mt-6">
          View our Menu
        </Button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <Link
        to="/cart"
        className="flex items-center gap-1.5 text-sm text-cocoa-900/60 hover:text-cocoa-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to cart
      </Link>
      <h1 className="mt-3 font-display text-4xl text-cocoa-900">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cocoa-900 text-cream-50">
                <MapPin className="h-4.5 w-4.5" />
              </span>
              <h2 className="font-display text-lg text-cocoa-900">
                Delivery Details
              </h2>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Full name"
              />
              <Input
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Email address"
                type="email"
              />
              <Input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Phone number"
                type="tel"
              />
            </div>
            <Textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Delivery address"
              rows={2}
              className="mt-3"
            />
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-lg text-cocoa-900">Delivery Date</h2>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <Select defaultValue="Oct">
                {months.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </Select>
              <Select defaultValue="15">
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </Select>
              <Select defaultValue="2026">
                {[2026, 2027].map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </Select>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Select defaultValue="12:30 PM">
                <option>10:00 AM</option>
                <option>11:00 AM</option>
                <option>12:30 PM</option>
                <option>2:00 PM</option>
              </Select>
              <Select defaultValue="1:00 PM">
                <option>11:00 AM</option>
                <option>1:00 PM</option>
                <option>2:30 PM</option>
                <option>4:00 PM</option>
              </Select>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-lg text-cocoa-900">Items</h2>
            <div className="mt-3 divide-y divide-cocoa-900/8">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-4">
                  <img
                    src={item.image ?? undefined}
                    alt={item.name}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-cocoa-900">{item.name}</p>
                    <p className="text-sm text-caramel-600">
                      {formatCurrency(item.price)}
                    </p>
                    <p className="text-xs text-cocoa-900/50">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium text-cocoa-900">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <button
              onClick={() => setShippingModalOpen(true)}
              className="flex w-full items-center justify-between"
            >
              <h2 className="font-display text-lg text-cocoa-900">
                Shipping Option
              </h2>
              <ChevronRight className="h-5 w-5 text-cocoa-900/40" />
            </button>
            <div className="mt-3 flex items-center justify-between rounded-xl bg-cream-200 px-4 py-3">
              <span className="text-sm text-cocoa-900">
                {shippingOptions.find((o) => o.id === shippingId)?.label}
              </span>
              <span className="text-sm text-caramel-600">
                {shipping === 0 ? "Free" : formatCurrency(shipping)}
              </span>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-display text-lg text-cocoa-900">
              Payment Method
            </h2>
            <div className="mt-3 flex items-center gap-3 rounded-xl border border-caramel-500 bg-caramel-500/10 px-4 py-4">
              <Wallet className="h-5 w-5 shrink-0 text-caramel-600" />
              <div>
                <p className="text-sm font-medium text-cocoa-900">
                  Cash on Delivery
                </p>
                <p className="text-xs text-cocoa-900/60">
                  Pay in cash when your order arrives.
                </p>
              </div>
            </div>

            <h2 className="mt-6 font-display text-lg text-cocoa-900">
              Dedication Note
            </h2>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a message for the recipient (optional)"
              rows={3}
              className="mt-3"
            />
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-lg text-cocoa-900">
              Payment Details
            </h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-cocoa-900/70">
                <span>Product Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-cocoa-900/70">
                <span>Shipping Subtotal</span>
                <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
              </div>
            </div>
            <div className="mt-4 flex justify-between border-t border-cocoa-900/10 pt-4 font-medium text-cocoa-900">
              <span>Total Payment</span>
              <span>{formatCurrency(total)}</span>
            </div>

            {error && (
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <Button
              onClick={handlePlaceOrder}
              disabled={submitting}
              className="mt-6 w-full"
            >
              {submitting ? "Placing order…" : "Place Order"}
            </Button>
          </Card>
        </div>
      </div>

      <ShippingOptionModal
        open={shippingModalOpen}
        onClose={() => setShippingModalOpen(false)}
        selected={shippingId}
        onSelect={setShippingId}
      />

      <OrderSuccessModal open={orderPlaced} onContinue={handleContinue} />
    </section>
  );
}