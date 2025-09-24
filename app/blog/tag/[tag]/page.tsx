import Image from "next/image";
import Link from "next/link";
import { getAllBlogTags, getBlogsByTag } from "@lib/data/blogs";
import { generateMeta } from "@lib/meta";

export async function generateStaticParams() {
  return getAllBlogTags().map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  return generateMeta({
    title: `Tag: ${tag}`,
    description: `Posts tagged with ${tag}.`,
  });
}

export default async function BlogTagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const posts = getBlogsByTag(tag);
  return (
    <main className="bg-white pt-24 pb-16">
      <section className="px-4 sm:px-8 lg:px-12 mx-auto max-w-7xl">
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
            Tag: {tag}
          </h1>
          <p className="mt-2 text-neutral-500">Posts tagged with “{tag}”.</p>
        </header>
        {posts.length === 0 ? (
          <p className="text-neutral-500">No posts found.</p>
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
