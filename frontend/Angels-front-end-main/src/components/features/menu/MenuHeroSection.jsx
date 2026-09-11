export function MenuHeroSection() {
  return (
    <section className="relative flex min-h-[45vh] items-center justify-center overflow-hidden bg-cocoa-900">
      <img
        src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1600&q=80"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-cocoa-900/40" />
      <h1 className="relative font-display text-5xl text-cream-50 sm:text-6xl">
        Our Menu
      </h1>
    </section>
  );
}
