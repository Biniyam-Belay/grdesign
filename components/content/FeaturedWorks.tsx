"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Work } from "@lib/types";
import { getWorks } from "@lib/data/works";

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
              <div key={`${work.slug}-${i}`} className="block relative group">
                <div
                  className={`relative w-full ${aspectClass(variant)} overflow-hidden border border-neutral-200 bg-white transition-transform duration-300 ease-out group-hover:scale-[1.02]`}
                >
                  <Image
                    src={work.image}
                    alt={work.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 33vw, 100vw"
                    priority={false}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
