import Image from "next/image";
import Link from "next/link";
import { generateMeta } from "@lib/meta";
import { getBlogsAsync } from "@lib/data/blogs";

export const metadata = generateMeta({
  title: "Blog",
  description: "Thoughts on design, motion, and building for the web.",
});

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const q = sp.q?.toLowerCase()?.trim() ?? "";
  const blogs = (await getBlogsAsync()).filter((b) => {
    const matchText = `${b.title} ${b.excerpt} ${b.tags?.join(" ") ?? ""}`.toLowerCase();
    const matchesQuery = q ? matchText.includes(q) : true;
    return matchesQuery;
  });

  return (
    <main className="bg-white pt-24 pb-16">
      <section className="px-4 sm:px-8 lg:px-12 mx-auto max-w-7xl">
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
            Blog
          </h1>
          <p className="mt-2 text-neutral-500">
            Thoughts on design, motion, and building for the web.
          </p>
          <form action="/blog" className="mt-4 flex items-center gap-3">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search posts"
              className="w-full sm:w-80 rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900"
            />
            <button className="rounded-md bg-neutral-900 text-white text-sm px-3 py-2">
              Search
            </button>
          </form>
        </header>
        {blogs.length === 0 ? (
          <p className="text-neutral-500">No posts found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((b) => (
              <Link key={b.slug} href={`/blog/${b.slug}`} className="group block">
                <div className="relative w-full aspect-[4/3] overflow-hidden border border-neutral-200 bg-white rounded-md">
                  <Image
                    src={b.cover}
                    alt={b.title}
                    fill
                    className="object-cover transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.05]"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                </div>
                <div className="mt-3">
                  <h2 className="text-[1.05rem] leading-tight text-neutral-900 font-semibold">
                    {b.title}
                  </h2>
                  <p className="mt-1 text-sm text-neutral-600 line-clamp-2">{b.excerpt}</p>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    {b.tags?.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="inline-block rounded-full bg-neutral-100 text-neutral-700 px-2 py-0.5 text-[11px]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-neutral-400">
                    {new Date(b.date).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
