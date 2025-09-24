import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getBlogBySlug, getBlogSlugs, getBlogs } from "@lib/data/blogs";
import { generateMeta } from "@lib/meta";
import ShareButtons from "@components/ui/ShareButtons";
import ReadingProgress from "@components/content/ReadingProgress";

export async function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);
  if (!blog) return notFound();
  const related = getBlogs()
    .filter((b) => b.slug !== blog.slug && b.tags?.some((t) => blog.tags?.includes(t)))
    .slice(0, 3);
  const base = "https://www.binidoes.tech";
  const canonical = `${base}/blog/${blog.slug}`;

  // rough reading time based on content or excerpt length
  const text = (blog.content || blog.excerpt || "").replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const readingMins = Math.max(1, Math.round(words / 220));
  return (
    <main className="bg-white pt-24 pb-16">
      <ReadingProgress />
      {/* Two-column hero: image left, meta right */}
      <section className="px-4 sm:px-8 lg:px-12 mx-auto max-w-6xl">
        <div className="mb-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            ← Back to Blog
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Big image without rounded/border/shadow */}
          <div className="lg:col-span-7">
            <div className="relative w-full aspect-[16/10] overflow-hidden">
              <Image src={blog.cover} alt={blog.title} fill className="object-cover" priority />
            </div>
          </div>
          {/* Right: Title + meta + tags + share */}
          <div className="lg:col-span-5 lg:pt-4">
            <p className="text-neutral-500 text-sm font-medium">
              {new Date(blog.date).toLocaleDateString()}
            </p>
            <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
              {blog.title}
            </h1>
            {blog.excerpt && (
              <p className="mt-4 text-neutral-700 text-lg leading-relaxed">{blog.excerpt}</p>
            )}
            <div className="mt-6 flex items-center gap-4 text-sm text-neutral-600">
              <span>{readingMins} min read</span>
            </div>
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {blog.tags.map((t) => (
                  <Link
                    key={t}
                    href={`/blog/tag/${encodeURIComponent(t)}`}
                    className="inline-flex items-center rounded-full bg-neutral-100 text-neutral-700 px-3 py-1 text-xs font-medium hover:bg-neutral-200 transition-colors"
                  >
                    {t}
                  </Link>
                ))}
              </div>
            )}
            <div className="mt-8">
              <ShareButtons url={canonical} title={blog.title} />
            </div>
          </div>
        </div>
      </section>

      {/* Content centered below */}
      <article className="px-4 sm:px-8 lg:px-12 mx-auto max-w-4xl">
        {blog.content && (
          <div
            className="prose prose-neutral prose-lg max-w-none mt-12 prose-headings:font-bold prose-headings:text-neutral-900 prose-headings:font-outfit prose-p:text-neutral-700 prose-p:leading-relaxed prose-p:font-outfit prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-neutral-900 prose-code:bg-neutral-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-neutral-900 prose-pre:text-neutral-100 prose-code:font-outfit prose-pre:font-outfit"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        )}
        {!blog.content && (
          <p className="mt-12 text-neutral-700 text-lg">Full content coming soon.</p>
        )}

        {/* Author section */}
        <div className="mt-16 pt-8 border-t border-neutral-200">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="w-20 h-20 bg-neutral-100 rounded-full overflow-hidden relative flex-shrink-0">
              <Image src="/assets/avatardesk.png" alt="Author" fill className="object-cover" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-neutral-900">Biniyam Belay</h3>
              <p className="mt-1 text-neutral-600">Graphic and UI/UX Designer & Developer</p>
              <p className="mt-3 text-neutral-700">
                I write about design systems, brand identity, and the intersection of design and
                development.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Share section */}
        <div className="mt-12 flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-medium text-neutral-900">Enjoyed this article?</h3>
          <p className="mt-2 text-neutral-600">Share it with your network</p>
          <div className="mt-4">
            <ShareButtons url={canonical} title={blog.title} />
          </div>
        </div>
      </article>

      {/* Related */}
      <section className="mt-24 px-4 sm:px-8 lg:px-12 py-16 bg-neutral-50">
        <div className="mx-auto max-w-6xl">
          {related.length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Continue Reading</h2>
              <p className="text-neutral-600 mb-8">More insights on similar topics</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {related.map((b) => (
                  <Link key={b.slug} href={`/blog/${b.slug}`} className="group block">
                    <div className="relative w-full aspect-[16/10] overflow-hidden rounded-lg">
                      <Image
                        src={b.cover}
                        alt={b.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-neutral-900 group-hover:text-primary transition-colors">
                      {b.title}
                    </h3>
                    <p className="mt-2 text-sm text-neutral-600 line-clamp-2">{b.excerpt}</p>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Portfolio CTA section */}
          <div className="mt-20">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 p-8 bg-white rounded-xl shadow-sm">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">
                  Interested in working together?
                </h2>
                <p className="mt-2 text-neutral-600 max-w-lg">
                  Check out my portfolio to see more of my work or get in touch to discuss your
                  project needs.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/work"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors"
                >
                  View Portfolio
                </Link>
                <Link
                  href="https://calendar.app.google/1RTjShD5sgqBmm3K7"
                  target="_blank"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-neutral-300 text-neutral-900 font-medium hover:border-neutral-900 transition-colors"
                >
                  Schedule a Call
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);
  if (!blog) return {};
  return generateMeta({ title: blog.title, description: blog.excerpt, image: blog.cover });
}
