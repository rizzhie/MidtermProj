import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LogOut,
  Menu,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { BrandMark } from "@/components/common/brand-mark";
import { ProfileModal } from "@/components/common/profile-modal";
import { LogoutModal } from "@/components/common/logout-modal";
import { nav } from "@/data/siteContent";
import { useCart } from "@/context/CartContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { cn } from "@/lib/cn";

interface NavbarProps {
  transparent?: boolean;
}

export function Navbar({ transparent = false }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, logout } = useCustomerAuth();
  const navigate = useNavigate();

  const initials = (user?.name ?? "?")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function handleConfirmLogout() {
    logout();
    setLogoutOpen(false);
    navigate("/");
  }

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

          {user && (
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              aria-label="Open your profile"
              className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-cream-50/10 ring-2 ring-caramel-500 transition-transform hover:scale-105"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-cream-50" />
              )}
            </button>
          )}

          {!user && (
            <div className="hidden items-center gap-2 md:flex">
              <NavLink
                to="/login"
                className="flex h-11 items-center justify-center rounded-xl border border-cream-50/40 px-4 text-sm font-medium text-cream-50 transition-colors hover:bg-cream-50/10"
              >
                Log in
              </NavLink>
              <NavLink
                to="/signup"
                className="flex h-11 items-center justify-center rounded-xl bg-caramel-500 px-4 text-sm font-medium text-cream-50 transition-colors hover:bg-caramel-600"
              >
                Sign up
              </NavLink>
            </div>
          )}

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
          {user ? (
            <div className="mt-2 flex items-center gap-3 rounded-lg bg-cream-50/10 px-3 py-2.5">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt=""
                  className="h-9 w-9 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-caramel-500 text-xs font-semibold text-cream-50">
                  {initials}
                </span>
              )}
              <span className="min-w-0 flex-1 truncate text-sm text-cream-50">
                {user.name}
              </span>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setProfileOpen(true);
                }}
                aria-label="Open your profile"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-cream-50/70 transition-colors hover:bg-cream-50/10 hover:text-cream-50"
              >
                <User className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setLogoutOpen(true);
                }}
                aria-label="Log out"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-cream-50/70 transition-colors hover:bg-cream-50/10 hover:text-cream-50"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 font-display text-cream-50/85"
              >
                Log in
              </NavLink>
              <NavLink
                to="/signup"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 font-display text-cream-50/85"
              >
                Sign up
              </NavLink>
            </>
          )}
        </nav>
      )}

      {user && (
        <ProfileModal
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
          onRequestLogout={() => {
            setProfileOpen(false);
            setLogoutOpen(true);
          }}
        />
      )}

      <LogoutModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </header>
  );
}