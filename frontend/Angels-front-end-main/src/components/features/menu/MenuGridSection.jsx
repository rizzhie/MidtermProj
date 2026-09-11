import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCategories, fetchProducts } from "@/lib/api";
import { CakeCard } from "@/components/features/menu/CakeCard";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

export function MenuGridSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => {
        // Category tabs are a nice-to-have; a failed fetch shouldn't block the grid.
      });
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchProducts(activeCategory)
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Couldn't load the menu.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeCategory]);

  function handleBuyNow(product) {
    addToCart(product, 1);
    navigate("/cart");
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory("all")}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-medium transition-colors",
            activeCategory === "all"
              ? "bg-cocoa-900 text-cream-50"
              : "bg-cream-200 text-cocoa-900/70 hover:bg-cream-200/70"
          )}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.key)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-medium transition-colors",
              activeCategory === category.key
                ? "bg-cocoa-900 text-cream-50"
                : "bg-cream-200 text-cocoa-900/70 hover:bg-cream-200/70"
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-8 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error} — is the API running at the configured VITE_API_URL?
        </p>
      )}

      {loading && !error && (
        <p className="mt-8 text-sm text-cocoa-900/50">Loading the menu…</p>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="mt-8 text-sm text-cocoa-900/50">
          Nothing in this category yet.
        </p>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <CakeCard
            key={product.id}
            product={product}
            onAddToCart={addToCart}
            onBuyNow={handleBuyNow}
          />
        ))}
      </div>
    </section>
  );
}
