import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/lib/types";

interface CakeCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity?: number) => void;
  onBuyNow: (product: Product) => void;
  className?: string;
}

export function CakeCard({ product, onAddToCart, onBuyNow, className }: CakeCardProps) {
  return (
    <Card className={cn("flex flex-col overflow-hidden p-5", className)}>
      <div className="aspect-square overflow-hidden rounded-2xl bg-cream-200">
        <img
          src={product.image ?? undefined}
          alt={product.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <p className="mt-4 text-lg font-semibold text-caramel-600">
        {formatCurrency(product.price)}
      </p>
      <p className="mt-1 font-display text-lg text-cocoa-900">{product.name}</p>
      <p className="mt-1 text-sm text-cocoa-900/60 line-clamp-2">
        {product.description}
      </p>

      <div className="mt-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onBuyNow(product)}
        >
          Buy
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          onClick={() => onAddToCart(product)}
        >
          Add to cart
        </Button>
      </div>
    </Card>
  );
}