import { about } from "@/data/siteContent";

export function AboutHeroSection() {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-cocoa-900">
      <img
        src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1600&q=80"
        alt="Inside Angel's bakeshop, shelves lined with fresh pastries"
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-cocoa-900 via-cocoa-900/70 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-6 py-20">
        <h1 className="font-display text-5xl text-cream-50 sm:text-6xl">
          {about.heading}
        </h1>
        <p className="mt-6 max-w-lg text-cream-50/85 leading-relaxed">
          {about.body}
        </p>
      </div>
    </section>
  );
}
