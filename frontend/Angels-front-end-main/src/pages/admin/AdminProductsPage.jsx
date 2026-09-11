import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { fetchProducts, deleteProduct } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

export function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function load() {
    setLoading(true);
    fetchProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleDelete(product) {
    if (!confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    try {
      await deleteProduct(product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch (err) {
      alert(err.message || "Couldn't delete product.");
    }
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-cocoa-900">Products</h1>
        <Button as={Link} to="/admin/products/new">
          <Plus className="h-4 w-4" /> Add product
        </Button>
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
          {products.length === 0 && (
            <p className="p-6 text-sm text-cocoa-900/50">No products yet.</p>
          )}
          {products.map((product) => (
            <div key={product.id} className="flex items-center gap-4 p-4">
              <img
                src={product.image}
                alt={product.name}
                className="h-14 w-14 shrink-0 rounded-lg object-cover bg-cream-200"
              />
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-cocoa-900">
                  {product.name}
                </p>
                <p className="text-xs text-cocoa-900/50">
                  {product.category} · {formatCurrency(product.price)}
                  {!product.is_available && " · unavailable"}
                </p>
              </div>
              <Link
                to={`/admin/products/${product.id}/edit`}
                className="rounded-full p-2 text-cocoa-900/60 hover:bg-cream-200"
                aria-label={`Edit ${product.name}`}
              >
                <Pencil className="h-4 w-4" />
              </Link>
              <button
                onClick={() => handleDelete(product)}
                className="rounded-full p-2 text-red-500/80 hover:bg-red-50"
                aria-label={`Delete ${product.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </Card>
      )}
    </section>
  );
}
