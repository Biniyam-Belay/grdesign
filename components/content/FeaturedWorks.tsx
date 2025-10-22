"use client";

import { useMemo, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Work } from "@lib/types";
import { getWorks } from "@lib/data/works";

type TileVariant = "square" | "portrait45" | "portrait916"; // 1:1, 4:5, 9:16

type FeaturedWorksProps = {
  title?: string;
  subtitle?: string;
};

// A static, responsive grid for featured works
export default function FeaturedWorks({
  title = "Featured Works",
  subtitle = "A focused slice of recent works.",
}: FeaturedWorksProps) {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWorks()
      .then((data) => {
        setWorks(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const aspectClass = (variant?: string) =>
    variant === "square"
      ? "aspect-[1/1]"
      : variant === "portrait45"
        ? "aspect-[4/5]"
        : variant === "portrait916"
          ? "aspect-[9/16]"
          : "aspect-[1/1]"; // default

  if (loading || works.length === 0) return null;

  return (
    <section className="bg-white pt-14 pb-6 px-4 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-8xl">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900">
            {title}
          </h2>
          {subtitle && <p className="mt-2 text-sm text-neutral-500">{subtitle}</p>}
        </div>

        {/* 3-column collage on larger screens, vertical stack on mobile; tighter gaps */}
        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-0">
          {works.map((work, i) => {
            const variant = work.aspect_ratio || "square";
            return (
              <Link
                key={`${work.slug}-${i}`}
                href={work.link || "#"}
                className="block relative group"
              >
                <div
                  className={`relative w-full ${aspectClass(variant)} overflow-hidden border border-neutral-200 bg-white rounded-md transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-[1.06] group-hover:z-30 shadow-sm group-hover:shadow-xl`}
                >
                  <Image
                    src={work.image}
                    alt={work.title}
                    fill
                    className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 33vw, 100vw"
                    priority={false}
                  />
                  {/* Overlay with title */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-semibold text-lg">{work.title}</h3>
                      {work.description && (
                        <p className="text-sm text-white/80 mt-1 line-clamp-2">
                          {work.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
