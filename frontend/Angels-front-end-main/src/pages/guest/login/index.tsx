import { useState, type FormEvent } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandMark } from "@/components/common/brand-mark";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

export default function LoginPage() {
  const { login, isAuthenticated } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as { from?: { pathname?: string } } | null)?.from
    ?.pathname;

  if (isAuthenticated) {
    return <Navigate to={from || "/menu"} replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from || "/menu", { replace: true });
    } catch (err) {
      setError((err as Error).message || "Couldn't log in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <div className="flex justify-center">
        <BrandMark dark />
      </div>
      <h1 className="mt-8 text-center font-display text-3xl text-cocoa-900">
        Welcome back
      </h1>
      <p className="mt-1 text-center text-sm text-cocoa-900/60">
        Sign in to check out with your saved details.
      </p>

      <Card className="mt-6 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-cocoa-900">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5"
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-cocoa-900">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Link
            to="/forgot-password"
            className="text-sm text-caramel-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </Card>

      <p className="mt-4 text-center text-sm text-cocoa-900/60">
        New here?{" "}
        <Link to="/signup" className="text-caramel-600 hover:underline">
          Create an account
        </Link>
      </p>
    </section>
  );
}