"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createSupabaseClient } from "@/lib/supabase/client";

interface ClientLogo {
  name: string;
  url: string;
}

export default function ClientLogos() {
  const [clientLogos, setClientLogos] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogos = async () => {
      const supabase = createSupabaseClient();
      try {
        const { data } = await supabase.storage.from("works").list("", { limit: 100 });
        if (data) {
          const logos = data
            .filter(
              (f: { name: string }) =>
                f.name.toLowerCase().startsWith("client-logo") &&
                f.name.match(/\.(png|svg|webp|jpg)$/i),
            )
            .map((f: { name: string }) => {
              const { data: img } = supabase.storage.from("works").getPublicUrl(f.name);
              return { name: f.name, url: img.publicUrl };
            });
          setClientLogos(logos);
        }
      } catch (err) {
        console.error("Error fetching logos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogos();
  }, []);

  if (loading || clientLogos.length === 0) return null;

  return (
    <section className="w-full mb-10 lg:mb-14 px-4 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-8xl w-full bg-white py-8 sm:py-10 lg:py-14 border-b border-[#0B132B]/10 overflow-hidden rounded-2xl lg:rounded-none shadow-sm lg:shadow-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-10 px-6 lg:px-12">
          {/* Left: Text Hook */}
          <div className="md:w-1/3 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#FF0033]" />
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#FF0033]">
                Trusted By
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-light text-[#0B132B] tracking-tight leading-snug">
              Proud to work with visionary brands.
            </h3>
          </div>

          {/* Right: Marquee Track */}
          <div className="md:w-2/3 relative flex items-center h-[80px] sm:h-[110px] overflow-hidden">
            {/* Pause animations on hover */}
            <div className="flex items-center h-full hover:[&>div]:[animation-play-state:paused] w-full">
              {/* Track 1 */}
              <div className="flex items-center whitespace-nowrap flex-shrink-0 min-w-full animate-marquee">
                {[...clientLogos, ...clientLogos].map((client, i) => (
                  <div
                    key={`t1-${i}`}
                    className="flex-shrink-0 flex items-center justify-center px-8 md:px-12 h-full transition-all duration-500 cursor-pointer hover:scale-105"
                  >
                    <Image
                      src={client.url}
                      alt={client.name}
                      width={180}
                      height={72}
                      className="object-contain max-h-[58px] w-auto mix-blend-multiply flex-shrink-0"
                    />
                  </div>
                ))}
              </div>

              {/* Track 2 (Identical Clone for Seamless Loop) */}
              <div
                className="flex items-center whitespace-nowrap flex-shrink-0 min-w-full animate-marquee"
                aria-hidden="true"
              >
                {[...clientLogos, ...clientLogos].map((client, i) => (
                  <div
                    key={`t2-${i}`}
                    className="flex-shrink-0 flex items-center justify-center px-8 md:px-12 h-full transition-all duration-500 cursor-pointer hover:scale-105"
                  >
                    <Image
                      src={client.url}
                      alt={client.name}
                      width={180}
                      height={72}
                      className="object-contain max-h-[58px] w-auto mix-blend-multiply flex-shrink-0"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollMarquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: scrollMarquee 45s linear infinite;
        }
      `}</style>
    </section>
  );
}
