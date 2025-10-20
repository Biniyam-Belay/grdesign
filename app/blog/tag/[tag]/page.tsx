import Image from "next/image";
import Link from "next/link";
import { getAllBlogTags, getBlogsByTag } from "@lib/data/blogs";
import { generateMeta } from "@lib/meta";

export async function generateStaticParams() {
  return (await getAllBlogTags()).map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return generateMeta({
    title: `Tag: ${decoded}`,
    description: `Posts tagged with ${decoded}.`,
  });
}

export default async function BlogTagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = await getBlogsByTag(decoded);
  const all = await getAllBlogTags();
  const otherTags = all.filter((t) => t.toLowerCase() !== decoded.toLowerCase());
  return (
    <main className="bg-white pt-24 pb-16">
      <section className="px-4 sm:px-8 lg:px-12 mx-auto max-w-7xl">
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
            Tag: {decoded}
          </h1>
          <p className="mt-2 text-neutral-500">Posts tagged with “{decoded}”.</p>
        </header>
        {posts.length === 0 ? (
          <div className="text-neutral-600 space-y-4">
            <p>No posts found for this tag.</p>
            {otherTags.length > 0 && (
              <div className="text-sm">
                <p className="text-neutral-500 mb-2">Browse other tags:</p>
                <div className="flex flex-wrap gap-2">
                  {otherTags.map((t) => (
                    <Link
                      key={t}
                      href={`/blog/tag/${encodeURIComponent(t)}`}
                      className="inline-flex items-center rounded-full bg-neutral-100 text-neutral-700 px-3 py-1 text-xs font-medium hover:bg-neutral-200 transition-colors"
                    >
                      {t}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              ← Back to Blog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((b) => (
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
