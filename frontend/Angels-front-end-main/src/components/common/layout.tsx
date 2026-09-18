import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/common/navbar";
import { Footer } from "@/components/common/footer";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-cream-100">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}