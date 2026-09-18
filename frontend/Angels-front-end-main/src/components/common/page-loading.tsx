export function PageLoading() {
  return (
    <section className="mx-auto flex h-screen max-w-6xl flex-col items-center justify-center gap-4 bg-cream-100 text-cocoa-900/60">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-cream-200 border-t-caramel-500" />
      <p className="text-sm">Loading...</p>
    </section>
  );
}