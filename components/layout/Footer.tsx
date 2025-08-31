import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-4">
            <Link
              href="/"
              className="inline-flex items-baseline gap-1 font-serif text-2xl text-black no-underline mb-4"
            >
              <span className="font-medium">GR</span>
              <span className="text-neutral-400">.</span>
            </Link>
            <p className="text-neutral-600 text-sm max-w-xs mb-6">
              Independent designer crafting clear, effective brands and interfaces.
            </p>
            <div className="text-xs text-neutral-500">
              © {year} GR Design. All rights reserved.
            </div>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              {["Work", "About", "Services", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-neutral-700 hover:text-black text-sm no-underline transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Expertise Column */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-4">
              Expertise
            </h3>
            <ul className="space-y-2 text-sm text-neutral-700">
              {["Brand Identity", "Editorial Design", "Packaging", "UI/UX Design"].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-4">
              Contact
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:hello@grdesign.studio"
                  className="text-neutral-700 hover:text-black no-underline transition-colors"
                >
                  hello@grdesign.studio
                </a>
              </li>
              <li className="text-neutral-600">
                Based in Addis Ababa
                <br />
                Working worldwide
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom divider and credit */}
        <div className="border-t border-neutral-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-neutral-500 text-xs mb-4 md:mb-0">
            Privacy Policy · Terms of Service
          </div>
          <div className="text-neutral-500 text-xs">Designed and developed by GR Design</div>
        </div>
      </div>
    </footer>
  );
}
