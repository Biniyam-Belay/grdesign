export default function BlogLoading() {
  return (
    <main className="bg-white pt-24 pb-16">
      <section className="px-4 sm:px-8 lg:px-12 mx-auto max-w-7xl">
        <header className="mb-6">
          <div className="h-10 w-32 bg-neutral-200 animate-pulse rounded" />
          <div className="mt-2 h-5 w-64 bg-neutral-100 animate-pulse rounded" />
          <div className="mt-4 flex items-center gap-3">
            <div className="w-full sm:w-80 h-10 bg-neutral-100 animate-pulse rounded-md" />
            <div className="w-20 h-10 bg-neutral-200 animate-pulse rounded-md" />
          </div>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="group block">
              <div className="relative w-full aspect-[4/3] overflow-hidden border border-neutral-200 bg-neutral-100 rounded-md animate-pulse" />
              <div className="mt-3 space-y-2">
                <div className="h-5 bg-neutral-200 animate-pulse rounded w-3/4" />
                <div className="h-4 bg-neutral-100 animate-pulse rounded w-full" />
                <div className="h-4 bg-neutral-100 animate-pulse rounded w-5/6" />
                <div className="flex gap-2 mt-2">
                  <div className="h-5 w-16 bg-neutral-100 animate-pulse rounded-full" />
                  <div className="h-5 w-16 bg-neutral-100 animate-pulse rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
