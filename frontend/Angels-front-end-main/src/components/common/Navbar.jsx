import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { BrandMark } from "@/components/common/BrandMark";
import { nav } from "@/data/siteContent";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

export function Navbar({ transparent = false }) {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full",
        transparent
          ? "bg-cocoa-800/95 backdrop-blur"
          : "bg-cocoa-800"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <BrandMark />

        <nav className="hidden items-center gap-10 md:flex">
          {nav.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "font-display text-[0.95rem] text-cream-50/85 transition-colors hover:text-cream-50",
                  isActive && "text-cream-50 underline underline-offset-8 decoration-2 decoration-caramel-400"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <NavLink
            to="/cart"
            aria-label="View cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-cream-50 text-cocoa-900 transition-transform hover:scale-105"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-berry-500 px-1 text-[0.65rem] font-semibold text-cream-50">
                {itemCount}
              </span>
            )}
          </NavLink>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex h-11 w-11 items-center justify-center rounded-xl text-cream-50 md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-cream-50/10 px-6 py-4 md:hidden">
          {nav.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3 py-2.5 font-display text-cream-50/85",
                  isActive && "bg-cream-50/10 text-cream-50"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
