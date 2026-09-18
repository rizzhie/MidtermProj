import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandMark } from "@/components/common/brand-mark";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

export default function SignupPage() {
  const { register, isAuthenticated } = useCustomerAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/menu" replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await register({ name, email, phone, password, password_confirmation: confirm });
      navigate("/menu", { replace: true });
    } catch (err) {
      setError((err as Error).message || "Couldn't create your account.");
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
        Create an account
      </h1>
      <p className="mt-1 text-center text-sm text-cocoa-900/60">
        Sign up and we'll remember your details at checkout.
      </p>

      <Card className="mt-6 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-cocoa-900">
              Full name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5"
              autoComplete="name"
              required
            />
          </div>
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
            <label className="text-sm font-medium text-cocoa-900">Phone</label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1.5"
              autoComplete="tel"
              placeholder="+63 900 000 0000"
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
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-cocoa-900">
              Confirm password
            </label>
            <Input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1.5"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Creating account…" : "Sign up"}
          </Button>
        </form>
      </Card>

      <p className="mt-4 text-center text-sm text-cocoa-900/60">
        Already have an account?{" "}
        <Link to="/login" className="text-caramel-600 hover:underline">
          Sign in
        </Link>
      </p>
    </section>
  );
}