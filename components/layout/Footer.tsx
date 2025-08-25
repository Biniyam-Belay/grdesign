import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200/70 bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-6 py-10 sm:grid-cols-2">
        <div>
          <p className="text-sm text-neutral-500">© {new Date().getFullYear()} GR Design</p>
        </div>
        <nav aria-label="Social" className="justify-self-start sm:justify-self-end">
          <ul className="flex gap-4 text-sm text-neutral-600">
            <li>
              <Link
                className="hover:underline"
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer noopener"
              >
                Instagram
              </Link>
            </li>
            <li>
              <Link
                className="hover:underline"
                href="https://dribbble.com"
                target="_blank"
                rel="noreferrer noopener"
              >
                Dribbble
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href="mailto:hello@example.com">
                Email
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
