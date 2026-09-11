import { useEffect, useState } from "react";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Input";
import { fetchOrders, updateOrderStatus, deleteOrder } from "@/lib/api";
import { formatCurrency, cn } from "@/lib/utils";

const STATUSES = [
  "pending",
  "preparing",
  "out_for_delivery",
  "completed",
  "cancelled",
];

const statusStyles = {
  pending: "bg-amber-100 text-amber-800",
  preparing: "bg-blue-100 text-blue-800",
  out_for_delivery: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function formatStatus(status) {
  return status.replace(/_/g, " ");
}

export function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function load() {
    setLoading(true);
    fetchOrders(statusFilter)
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, [statusFilter]);

  async function handleStatusChange(order, status) {
    const previous = orders;
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status } : o))
    );
    try {
      await updateOrderStatus(order.id, status);
    } catch (err) {
      setOrders(previous);
      alert(err.message || "Couldn't update order status.");
    }
  }

  async function handleDelete(order) {
    if (!confirm(`Delete order #${order.id}? This can't be undone.`)) return;
    try {
      await deleteOrder(order.id);
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
    } catch (err) {
      alert(err.message || "Couldn't delete order.");
    }
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-cocoa-900">Orders</h1>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-48"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {formatStatus(s)}
            </option>
          ))}
        </Select>
      </div>

      {error && (
        <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-6 text-sm text-cocoa-900/50">Loading…</p>
      ) : (
        <Card className="mt-6 divide-y divide-cocoa-900/8 overflow-hidden">
          {orders.length === 0 && (
            <p className="p-6 text-sm text-cocoa-900/50">No orders yet.</p>
          )}
          {orders.map((order) => {
            const expanded = expandedId === order.id;
            return (
              <div key={order.id}>
                <div className="flex flex-wrap items-center gap-4 p-4">
                  <button
                    onClick={() => setExpandedId(expanded ? null : order.id)}
                    className="flex items-center gap-2 text-left"
                  >
                    {expanded ? (
                      <ChevronUp className="h-4 w-4 text-cocoa-900/40" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-cocoa-900/40" />
                    )}
                    <div>
                      <p className="font-medium text-cocoa-900">
                        #{order.id} · {order.customer_name}
                      </p>
                      <p className="text-xs text-cocoa-900/50">
                        {order.items.length} item
                        {order.items.length !== 1 && "s"} ·{" "}
                        {formatCurrency(order.total)}
                      </p>
                    </div>
                  </button>

                  <span
                    className={cn(
                      "ml-auto rounded-full px-3 py-1 text-xs font-medium capitalize",
                      statusStyles[order.status]
                    )}
                  >
                    {formatStatus(order.status)}
                  </span>

                  <Select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order, e.target.value)}
                    className="w-44"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {formatStatus(s)}
                      </option>
                    ))}
                  </Select>

                  <button
                    onClick={() => handleDelete(order)}
                    className="rounded-full p-2 text-red-500/80 hover:bg-red-50"
                    aria-label={`Delete order ${order.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {expanded && (
                  <div className="bg-cream-100 px-4 pb-4 pt-1">
                    <div className="grid gap-1 text-xs text-cocoa-900/60 sm:grid-cols-2">
                      <p>Phone: {order.customer_phone}</p>
                      <p>Payment: {order.payment_method.toUpperCase()}</p>
                      <p className="sm:col-span-2">
                        Address: {order.delivery_address}
                      </p>
                      {order.note && (
                        <p className="sm:col-span-2">Note: {order.note}</p>
                      )}
                    </div>
                    <div className="mt-3 divide-y divide-cocoa-900/8 rounded-xl bg-cream-50 border border-cocoa-900/8">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between px-4 py-2 text-sm"
                        >
                          <span className="text-cocoa-900">
                            {item.quantity}× {item.name}
                          </span>
                          <span className="text-cocoa-900/60">
                            {formatCurrency(item.line_total)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </Card>
      )}
    </section>
  );
}
