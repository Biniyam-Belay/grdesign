"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createSupabaseClient } from "@/lib/supabase/client";

interface ClientLogo {
  name: string;
  url: string;
}

// Helper to distribute mobile logos cleanly and aesthetically
// e.g. for 8 logos: [2, 4, 2]
const getMobileRows = (logos: ClientLogo[]) => {
  const n = logos.length;
  if (n === 8) return [logos.slice(0, 2), logos.slice(2, 6), logos.slice(6, 8)];
  if (n === 7) return [logos.slice(0, 2), logos.slice(2, 5), logos.slice(5, 7)];
  if (n === 6) return [logos.slice(0, 3), logos.slice(3, 6)];
  if (n === 5) return [logos.slice(0, 2), logos.slice(2, 5)];
  if (n === 9) return [logos.slice(0, 3), logos.slice(3, 6), logos.slice(6, 9)];
  if (n === 10) return [logos.slice(0, 3), logos.slice(3, 7), logos.slice(7, 10)];

  // Generic fallback
  const rows = [];
  for (let i = 0; i < n; i += 3) {
    if (n - i === 4) {
      rows.push(logos.slice(i, i + 4));
      break;
    }
    rows.push(logos.slice(i, i + 3));
  }
  return rows;
};

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
    <section className="w-full mb-10 lg:mb-14 px-0 lg:px-12">
      <div className="mx-auto max-w-8xl w-full bg-white py-8 sm:py-10 lg:py-14 border-y lg:border-t-0 border-[#0B132B]/10 overflow-hidden shadow-sm lg:shadow-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-10 px-6 lg:px-12">
          {/* Left: Text Hook */}
          <div className="md:w-1/3 flex flex-col gap-3 md:gap-4 border-b border-[#0B132B]/5 pb-6 md:pb-0 md:border-none">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#FF0033]" />
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold text-[#FF0033]">
                Trusted By
              </span>
            </div>
            <h3 className="text-xl md:text-3xl font-light text-[#0B132B] tracking-[-0.02em] leading-snug pr-4">
              Proud to work with visionary brands.
            </h3>
          </div>

          {/* Right: Marquee Track (Desktop) / Grid (Mobile) */}
          <div className="md:w-2/3 relative w-full mt-4 md:mt-0">
            {/* --- DESKTOP MARQUEE --- */}
            <div className="hidden md:flex relative items-center h-[110px] overflow-hidden">
              <div className="flex items-center h-full hover:[&>div]:[animation-play-state:paused] w-full">
                <div className="flex items-center whitespace-nowrap flex-shrink-0 min-w-full animate-marquee">
                  {[...clientLogos, ...clientLogos].map((client, i) => (
                    <div
                      key={`t1-${i}`}
                      className="flex-shrink-0 flex items-center justify-center px-10 lg:px-12 h-full transition-all duration-500 cursor-pointer hover:scale-105"
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
                <div
                  className="flex items-center whitespace-nowrap flex-shrink-0 min-w-full animate-marquee"
                  aria-hidden="true"
                >
                  {[...clientLogos, ...clientLogos].map((client, i) => (
                    <div
                      key={`t2-${i}`}
                      className="flex-shrink-0 flex items-center justify-center px-10 lg:px-12 h-full transition-all duration-500 cursor-pointer hover:scale-105"
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

            {/* --- MOBILE GRID --- */}
            {/* Symmetrically distributed rows with full original color */}
            <div className="flex md:hidden flex-col gap-y-10 py-6 items-center w-full">
              {getMobileRows(clientLogos).map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex justify-center items-center gap-x-8 sm:gap-x-10 w-full"
                >
                  {row.map((client, i) => (
                    <div
                      key={`mobile-${rowIndex}-${i}`}
                      className="flex items-center justify-center transition-all duration-500 hover:scale-105"
                    >
                      <Image
                        src={client.url}
                        alt={client.name}
                        width={100}
                        height={40}
                        className="object-contain max-h-[35px] max-w-[85px] w-auto mix-blend-multiply"
                      />
                    </div>
                  ))}
                </div>
              ))}
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
