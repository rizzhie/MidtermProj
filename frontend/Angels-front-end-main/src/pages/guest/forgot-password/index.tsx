import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandMark } from "@/components/common/brand-mark";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useCustomerAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await forgotPassword({ email, password, password_confirmation: confirm });
      setMessage(result.message);
    } catch (err) {
      setError((err as Error).message || "Couldn't reset your password.");
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
        Forgot password
      </h1>
      <p className="mt-1 text-center text-sm text-cocoa-900/60">
        Enter your account email and a new password.
      </p>

      <Card className="mt-6 p-6">
        {message ? (
          <div className="space-y-4">
            <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </p>
            <Button as={Link} to="/login" className="w-full">
              Back to sign in
            </Button>
          </div>
        ) : (
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
                New password
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
                Confirm new password
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
              {submitting ? "Resetting password…" : "Reset password"}
            </Button>
          </form>
        )}
      </Card>

      <p className="mt-4 text-center text-sm text-cocoa-900/60">
        Remembered it?{" "}
        <Link to="/login" className="text-caramel-600 hover:underline">
          Sign in
        </Link>
      </p>
    </section>
  );
}