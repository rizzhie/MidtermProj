import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/common/layout";
import { AdminLayout } from "@/components/common/admin-layout";
import { RequireAdmin } from "@/components/common/require-admin";
import HomePage from "@/pages/guest/home";
import AboutPage from "@/pages/guest/about";
import MenuPage from "@/pages/guest/menu";
import CartPage from "@/pages/guest/cart";
import CheckoutPage from "@/pages/guest/checkout";
import LoginPage from "@/pages/guest/login";
import SignupPage from "@/pages/guest/signup";
import ForgotPasswordPage from "@/pages/guest/forgot-password";
import NotFoundPage from "@/pages/guest/not-found";
import AdminLoginPage from "@/pages/admin/login";
import AdminProductsPage from "@/pages/admin/products";
import AdminProductFormPage from "@/pages/admin/products/form";
import AdminCategoriesPage from "@/pages/admin/categories";
import AdminOrdersPage from "@/pages/admin/orders";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<Navigate to="products" replace />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="products/new" element={<AdminProductFormPage />} />
        <Route path="products/:id/edit" element={<AdminProductFormPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}