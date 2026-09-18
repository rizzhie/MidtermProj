import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { fetchProducts } from "@/lib/axios";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/lib/types";

export function FeaturedSection() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts()
      .then((data) => setProducts(data.slice(0, 4)))
      .catch(() => {
        // Homepage should still render even if the API is briefly unreachable.
      });
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-3xl text-cocoa-900">Baked this week</h2>
        <Link
          to="/menu"
          className="flex items-center gap-1.5 text-sm font-medium text-caramel-600 hover:text-caramel-500"
        >
          See full menu <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product.id}
            to="/menu"
            className="group overflow-hidden rounded-card bg-cream-50 border border-cocoa-900/8"
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={product.image ?? undefined}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <p className="font-medium text-cocoa-900">{product.name}</p>
              <p className="mt-1 text-sm text-caramel-600">
                {formatCurrency(product.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}