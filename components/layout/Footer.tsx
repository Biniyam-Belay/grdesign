"use client";

import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="px-4 sm:px-8 lg:px-12 py-12">
        <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand + short bio */}
          <div className="md:col-span-6">
            <Link
              href="/"
              className="inline-flex items-baseline gap-1 font-serif text-2xl text-black group"
              aria-label="Bini.B home"
            >
              <span
                className="font-medium transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.color = "#EDFF00")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "")}
              >
                Bini
              </span>
              <span className="text-neutral-400">.B</span>
            </Link>
            <p className="mt-4 max-w-md text-sm text-neutral-600">
              Independent designer crafting clear, effective brands and interfaces.
            </p>

            {/* Socials (simple text links keep it minimal) */}
            <div className="mt-6 flex items-center gap-4">
              {[
                {
                  label: "Instagram",
                  href: "https://www.instagram.com/bini.b.g?igsh=enp4OTM1NDU5YjNj",
                },
                { label: "Dribbble", href: "https://dribbble.com/bini-yam" },
                { label: "LinkedIn", href: "https://www.linkedin.com/in/biniyam-belay-147673270/" },
                { label: "Behance", href: "https://www.behance.net/biniyambelay" },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-neutral-500 transition-colors"
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#FC703C")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "")}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Nav + contact */}
          <div className="md:col-span-6 md:ml-auto">
            <nav aria-label="Footer Navigation" className="mb-6">
              <ul className="flex flex-wrap gap-6 text-sm">
                {["Work", "About", "Contact"].map((item) => (
                  <li key={item}>
                    {item === "Contact" ? (
                      <Link
                        href="https://calendar.app.google/1RTjShD5sgqBmm3K7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-700 hover:text-black transition-colors"
                      >
                        {item}
                      </Link>
                    ) : (
                      <Link
                        href={`/${item.toLowerCase()}`}
                        className="text-neutral-700 hover:text-black transition-colors"
                      >
                        {item}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="text-sm">
              <a
                href="mailto:biniyam.be.go@gmail.com"
                className="text-neutral-700 hover:text-black transition-colors"
              >
                biniyam.be.go@gmail.com
              </a>
              <p className="mt-2 text-neutral-600">Based in Addis Ababa · Working worldwide</p>
            </div>
          </div>
        </div>

        {/* Single, tidy bottom line */}
        <div className="mt-10 border-t border-neutral-200 pt-6 text-xs text-neutral-500">
          © {year} Bini.B
        </div>
      </div>
    </footer>
  );
}
