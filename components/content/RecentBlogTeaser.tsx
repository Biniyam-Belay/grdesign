"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getBlogsAsync } from "@lib/data/blogs";
import type { Blog } from "@lib/types";

export default function RecentBlogTeaser() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  // hydrate with async Supabase data when available
  useEffect(() => {
    let mounted = true;
    getBlogsAsync().then((b) => {
      if (mounted && b && b.length > 0) setBlogs(b);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // compute most recent within last 7 days
  const { top, rest } = useMemo(() => {
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    const recent = blogs.filter((b) => now - new Date(b.date).getTime() <= sevenDays);
    return { top: recent[0], rest: recent.slice(1) } as const;
  }, [blogs]);

  if (!top) return null;

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

  return (
    <>
      <section className="bg-white pt-4 pb-2 px-4 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-8xl">
          <Link href={`/blog/${top.slug}`} className="group block">
            <div className="relative w-full overflow-hidden border-y border-neutral-200 bg-white">
              <div className="flex flex-col md:flex-row-reverse items-stretch gap-0">
                {/* Thumbnail on the right (3x larger) */}
                <div className="relative w-full md:w-[360px] lg:w-[480px] xl:w-[560px] aspect-[16/10] md:aspect-auto md:h-[220px] lg:h-[280px] xl:h-[320px] shrink-0">
                  <Image
                    src={top.cover}
                    alt={top.title}
                    fill
                    sizes="(min-width: 1280px) 560px, (min-width: 1024px) 480px, (min-width: 768px) 360px, 100vw"
                    className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
                  />
                </div>

                {/* Text content on the left and spanning remaining width */}
                <div className="min-w-0 flex-1 p-4 sm:p-6 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                    <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[10px] text-neutral-700">
                      New this week
                    </span>
                    <span>•</span>
                    <span>{fmt(top.date)}</span>
                  </div>
                  <h3 className="mt-1.5 line-clamp-2 text-lg md:text-xl font-semibold tracking-tight text-neutral-900">
                    {top.title}
                  </h3>
                  {top.excerpt && (
                    <p className="mt-1 line-clamp-2 md:line-clamp-3 text-sm text-neutral-600 max-w-3xl">
                      {top.excerpt}
                    </p>
                  )}
                  <div className="mt-3 text-sm font-medium text-neutral-900/80 group-hover:underline">
                    Read more →
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>
      {rest.length > 0 && (
        <section className="bg-white px-4 sm:px-8 lg:px-12 pb-4">
          <div className="mx-auto max-w-8xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rest.map((b) => (
                <Link key={b.slug} href={`/blog/${b.slug}`} className="group block">
                  <div className="relative w-full overflow-hidden rounded-lg border border-neutral-200 bg-white">
                    <div className="flex items-stretch gap-3 p-3">
                      <div className="relative w-[110px] aspect-[4/3] rounded-md overflow-hidden border border-neutral-200/70">
                        <Image
                          src={b.cover}
                          alt={b.title}
                          fill
                          sizes="(min-width: 1024px) 110px, 110px"
                          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                          {fmt(b.date)}
                        </div>
                        <h4 className="mt-1 line-clamp-2 text-sm font-semibold tracking-tight text-neutral-900">
                          {b.title}
                        </h4>
                        {b.excerpt && (
                          <p className="mt-1 line-clamp-2 text-sm text-neutral-600">{b.excerpt}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
