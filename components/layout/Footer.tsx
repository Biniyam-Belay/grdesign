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
              className="inline-flex items-baseline gap-1 font-serif text-2xl text-black"
              aria-label="GR home"
            >
              <span className="font-medium">GR</span>
              <span className="text-neutral-400">.</span>
            </Link>
            <p className="mt-4 max-w-md text-sm text-neutral-600">
              Independent designer crafting clear, effective brands and interfaces.
            </p>

            {/* Socials (simple text links keep it minimal) */}
            <div className="mt-6 flex items-center gap-4">
              {[
                { label: "Instagram", href: "https://instagram.com/" },
                { label: "Dribbble", href: "https://dribbble.com/" },
                { label: "LinkedIn", href: "https://linkedin.com/" },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
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
                href="mailto:hello@grdesign.studio"
                className="text-neutral-700 hover:text-black transition-colors"
              >
                hello@grdesign.studio
              </a>
              <p className="mt-2 text-neutral-600">Based in Addis Ababa · Working worldwide</p>
            </div>
          </div>
        </div>

        {/* Single, tidy bottom line */}
        <div className="mt-10 border-t border-neutral-200 pt-6 text-xs text-neutral-500">
          © {year} GR Design
        </div>
      </div>
    </footer>
  );
}
