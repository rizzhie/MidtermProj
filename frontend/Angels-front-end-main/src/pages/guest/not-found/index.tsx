import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-6xl flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-6xl text-cocoa-900">404</h1>
      <p className="mt-3 text-cocoa-900/60">
        This page hasn't come out of the oven yet.
      </p>
      <Button as={Link} to="/" className="mt-6">
        Back to Home
      </Button>
    </section>
  );
}