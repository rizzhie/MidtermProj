import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { brand } from "@/data/siteContent";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-cocoa-900">
      <img
        src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1600&q=80"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-cocoa-900 via-cocoa-900/60 to-cocoa-900/20" />

      <div className="relative mx-auto max-w-6xl px-6 py-24">
        <p className="max-w-xl font-display text-3xl italic leading-snug text-cream-50 sm:text-4xl">
          {brand.tagline}
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Button as={Link} to="/about" variant="secondary" size="lg">
            About
          </Button>
          <Button as={Link} to="/menu" variant="primary" size="lg">
            View our Menu
          </Button>
        </div>
      </div>
    </section>
  );
}
