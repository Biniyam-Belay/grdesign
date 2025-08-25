"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  exact?: boolean;
};

export default function NavLink({
  href,
  children,
  className = "",
  activeClassName = "",
  exact = false,
}: NavLinkProps) {
  const pathname = usePathname();

  // Check if current path matches the link
  const isActive = exact
    ? pathname === href
    : pathname === href || (pathname && pathname.startsWith(`${href}/`));

  const baseClasses = [
    "group relative inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
    isActive ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-900",
    // underline accent on active/hover
    "before:absolute before:-bottom-1 before:left-3 before:right-3 before:h-[2px] before:rounded-full",
    "before:scale-x-0 before:transition-transform before:duration-200 before:origin-center",
    "before:bg-neutral-900",
    "hover:before:scale-x-100 data-[active=true]:before:scale-x-100",
    // focus ring
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
    className,
  ].join(" ");

  const combinedClasses = isActive ? `${baseClasses} ${activeClassName}`.trim() : baseClasses;

  return (
    <Link
      href={href}
      className={combinedClasses}
      aria-current={isActive ? "page" : undefined}
      data-active={isActive}
    >
      {children}
    </Link>
  );
}
