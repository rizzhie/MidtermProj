import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { cn } from "@/lib/cn";

interface AdminLink {
  to: string;
  label: string;
}

const links: AdminLink[] = [
  { to: "/admin/products", label: "Products" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/orders", label: "Orders" },
];

export function AdminLayout() {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/admin/login");
  }

  const navLinks = (
    <nav className="flex flex-col gap-1">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            cn(
              "rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-cocoa-900 text-cream-50"
                : "text-cocoa-900/70 hover:bg-cream-200"
            )
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen flex-col bg-cream-100 lg:flex-row">
      <header className="border-b border-cocoa-900/10 bg-cream-50 lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="font-display text-xl text-cocoa-900">Angel's Admin</p>
            {user && (
              <p className="text-xs text-cocoa-900/50">Signed in as {user.email}</p>
            )}
          </div>
          <nav className="flex items-center gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-cocoa-900 text-cream-50"
                      : "text-cocoa-900/70 hover:bg-cream-200"
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="ml-1 rounded-full px-3 py-2 text-sm font-medium text-cocoa-900/60 hover:bg-cream-200"
            >
              Log out
            </button>
          </nav>
        </div>
      </header>

      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-cocoa-900/10 bg-cream-50 lg:flex">
        <div className="px-6 py-6">
          <p className="font-display text-xl text-cocoa-900">Angel's Admin</p>
          <p className="text-xs text-cocoa-900/50">Bakeshop dashboard</p>
        </div>
        <div className="flex-1 overflow-y-auto px-3">{navLinks}</div>
        <div className="border-t border-cocoa-900/10 p-4">
          {user && (
            <p className="mb-2 truncate text-xs text-cocoa-900/50">
              Signed in as {user.email}
            </p>
          )}
          <button
            onClick={handleLogout}
            className="w-full rounded-xl px-4 py-2 text-sm font-medium text-cocoa-900/60 hover:bg-cream-200"
          >
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}