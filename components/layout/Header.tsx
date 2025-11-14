"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  {
    href: "#",
    label: "Services",
    submenu: [
      {
        href: "/services/graphic-design",
        label: "Graphic Design",
        description: "Visual storytelling that captivates",
        badge: "Popular",
      },
      {
        href: "/services/branding",
        label: "Branding",
        description: "Identity systems that resonate",
        badge: "Featured",
      },
      {
        href: "/services/social-media",
        label: "Social Media Design",
        description: "Content that drives engagement",
      },
      {
        href: "/services/web-development",
        label: "Web Development",
        description: "Digital experiences that convert",
      },
    ],
  },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMenuOpen]);

  if (!isMounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 items-center justify-between px-6 lg:px-12">
          <div className="h-8" />
        </div>
      </header>
    );
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl border-b border-neutral-100"
            : "bg-white/80 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-20 items-center justify-between px-6 lg:px-12">
          {/* Logo/Brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="/"
              className="inline-flex items-baseline gap-1 font-serif text-xl text-neutral-900 group"
            >
              <span className="font-medium transition-colors duration-300 group-hover:text-neutral-600">
                Bini
              </span>
              <span className="text-neutral-400">.B</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation - Left Aligned */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="hidden md:flex items-center gap-1 flex-1 ml-12"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const hasSubmenu = item.submenu && item.submenu.length > 0;

              if (hasSubmenu) {
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <button className="relative px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-all duration-300 flex items-center gap-1">
                      {item.label}
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className={`transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {servicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-[800px] bg-white rounded-2xl border border-neutral-100 overflow-hidden"
                        >
                          <div className="flex">
                            {/* Left Column - Services List */}
                            <div className="w-96 border-r border-neutral-100">
                              {/* Header */}
                              <div className="px-6 py-5 border-b border-neutral-100 bg-gradient-to-br from-neutral-50 to-white">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center">
                                    <svg
                                      width="18"
                                      height="18"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="white"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                    >
                                      <rect x="3" y="3" width="7" height="7" rx="1" />
                                      <rect x="14" y="3" width="7" height="7" rx="1" />
                                      <rect x="14" y="14" width="7" height="7" rx="1" />
                                      <rect x="3" y="14" width="7" height="7" rx="1" />
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="text-base font-bold text-neutral-900">
                                      Services I Offer
                                    </div>
                                    <div className="text-xs text-neutral-500">
                                      Elevating brands through design
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Services List */}
                              <div className="py-3">
                                {item.submenu?.map((subItem, idx) => (
                                  <a
                                    key={subItem.href}
                                    href="https://calendar.app.google/1RTjShD5sgqBmm3K7"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onMouseEnter={() => setHoveredService(idx)}
                                    className={`group block px-6 py-4 transition-all duration-300 relative overflow-hidden ${
                                      hoveredService === idx ? "bg-neutral-50" : ""
                                    }`}
                                  >
                                    {/* Hover effect background */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    <div className="relative flex items-start gap-3">
                                      {/* Icon */}
                                      <div className="mt-0.5 w-11 h-11 rounded-xl bg-neutral-100 group-hover:bg-neutral-900 flex items-center justify-center transition-all duration-300 flex-shrink-0">
                                        {idx === 0 && (
                                          <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            className="text-neutral-600 group-hover:text-white transition-colors duration-300"
                                          >
                                            <rect x="3" y="3" width="18" height="18" rx="2" />
                                            <path d="M3 9h18" />
                                            <path d="M9 21V9" />
                                          </svg>
                                        )}
                                        {idx === 1 && (
                                          <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            className="text-neutral-600 group-hover:text-white transition-colors duration-300"
                                          >
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M12 6v12" />
                                            <path d="M6 12h12" />
                                          </svg>
                                        )}
                                        {idx === 2 && (
                                          <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            className="text-neutral-600 group-hover:text-white transition-colors duration-300"
                                          >
                                            <rect x="2" y="2" width="20" height="20" rx="5" />
                                            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                                            <path d="M17.5 6.5h.01" />
                                          </svg>
                                        )}
                                        {idx === 3 && (
                                          <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            className="text-neutral-600 group-hover:text-white transition-colors duration-300"
                                          >
                                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                          </svg>
                                        )}
                                      </div>

                                      {/* Content */}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                          <div className="font-bold text-base text-neutral-900 group-hover:text-neutral-900 transition-colors duration-300">
                                            {subItem.label}
                                          </div>
                                          {subItem.badge && (
                                            <span
                                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                subItem.badge === "Popular"
                                                  ? "bg-blue-100 text-blue-700"
                                                  : "bg-amber-100 text-amber-700"
                                              }`}
                                            >
                                              {subItem.badge}
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-xs text-neutral-500 leading-relaxed">
                                          {subItem.description}
                                        </div>
                                      </div>

                                      {/* Arrow */}
                                      <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        className="mt-1 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all duration-300 flex-shrink-0"
                                      >
                                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                                      </svg>
                                    </div>
                                  </a>
                                ))}
                              </div>

                              {/* Footer CTA */}
                              <div className="px-6 py-5 border-t border-neutral-100 bg-gradient-to-br from-white to-neutral-50">
                                <a
                                  href="https://calendar.app.google/1RTjShD5sgqBmm3K7"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between w-full px-5 py-3 bg-neutral-900 text-white text-sm font-semibold rounded-xl hover:bg-neutral-800 transition-all duration-300 group"
                                >
                                  <span>Book a Meeting</span>
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    className="group-hover:translate-x-0.5 transition-transform duration-300"
                                  >
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                  </svg>
                                </a>
                              </div>
                            </div>

                            {/* Right Column - Service Details */}
                            <div className="flex-1 p-8 bg-gradient-to-br from-neutral-50/50 to-white">
                              <AnimatePresence mode="wait">
                                {hoveredService !== null && item.submenu?.[hoveredService] && (
                                  <motion.div
                                    key={hoveredService}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="h-full"
                                  >
                                    <div className="mb-6">
                                      <h3 className="text-xl font-bold text-neutral-900 mb-2">
                                        {item.submenu[hoveredService].label}
                                      </h3>
                                      <p className="text-sm text-neutral-600 leading-relaxed">
                                        {item.submenu[hoveredService].description}
                                      </p>
                                    </div>

                                    {/* Key Features */}
                                    <div className="space-y-4">
                                      <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                                        What You Get
                                      </div>

                                      {hoveredService === 0 && (
                                        <div className="space-y-2.5">
                                          {[
                                            "Poster & Flyer Design",
                                            "Brand Collateral",
                                            "Marketing Materials",
                                            "Print-Ready Files",
                                          ].map((feature) => (
                                            <div
                                              key={feature}
                                              className="flex items-center gap-3 text-sm text-neutral-700"
                                            >
                                              <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                                              {feature}
                                            </div>
                                          ))}
                                        </div>
                                      )}

                                      {hoveredService === 1 && (
                                        <div className="space-y-2.5">
                                          {[
                                            "Logo & Identity Design",
                                            "Brand Guidelines",
                                            "Color & Typography System",
                                            "Brand Assets Library",
                                          ].map((feature) => (
                                            <div
                                              key={feature}
                                              className="flex items-center gap-3 text-sm text-neutral-700"
                                            >
                                              <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                                              {feature}
                                            </div>
                                          ))}
                                        </div>
                                      )}

                                      {hoveredService === 2 && (
                                        <div className="space-y-2.5">
                                          {[
                                            "Instagram & Facebook Content",
                                            "Story Templates",
                                            "Carousel Posts",
                                            "Social Media Kit",
                                          ].map((feature) => (
                                            <div
                                              key={feature}
                                              className="flex items-center gap-3 text-sm text-neutral-700"
                                            >
                                              <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                                              {feature}
                                            </div>
                                          ))}
                                        </div>
                                      )}

                                      {hoveredService === 3 && (
                                        <div className="space-y-2.5">
                                          {[
                                            "Responsive Web Design",
                                            "Custom Development",
                                            "Performance Optimization",
                                            "SEO Implementation",
                                          ].map((feature) => (
                                            <div
                                              key={feature}
                                              className="flex items-center gap-3 text-sm text-neutral-700"
                                            >
                                              <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                                              {feature}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>

                                    {/* Timeline Badge */}
                                    <div className="mt-6 pt-5 border-t border-neutral-200">
                                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-full text-xs font-medium">
                                        <svg
                                          width="14"
                                          height="14"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                        >
                                          <circle cx="12" cy="12" r="10" />
                                          <path d="M12 6v6l4 2" />
                                        </svg>
                                        <span className="text-neutral-600">
                                          {hoveredService === 0 && "Typical delivery: 2-3 weeks"}
                                          {hoveredService === 1 && "Typical delivery: 3-4 weeks"}
                                          {hoveredService === 2 && "Typical delivery: 1-2 weeks"}
                                          {hoveredService === 3 && "Typical delivery: 4-6 weeks"}
                                        </span>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}

                                {hoveredService === null && (
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full flex items-center justify-center"
                                  >
                                    <div className="text-center text-neutral-400">
                                      <svg
                                        width="56"
                                        height="56"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        className="mx-auto mb-4 opacity-40"
                                      >
                                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                        <path d="M2 17l10 5 10-5" />
                                        <path d="M2 12l10 5 10-5" />
                                      </svg>
                                      <p className="text-sm font-medium">
                                        Hover over a service to explore details
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    isActive ? "text-neutral-900" : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-5 bg-neutral-900 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </motion.nav>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="hidden md:block"
          >
            <a
              href="https://calendar.app.google/1RTjShD5sgqBmm3K7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-full hover:bg-neutral-800 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Let's Talk
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </a>
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden relative z-50 flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-100 transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <div className="flex flex-col gap-1.5">
              <motion.span
                className="h-0.5 w-5 rounded-full bg-neutral-900"
                animate={isMenuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="h-0.5 w-5 rounded-full bg-neutral-900"
                animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="h-0.5 w-5 rounded-full bg-neutral-900"
                animate={isMenuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Menu - Outside header for full screen */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Slide-in Menu from Left */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 z-[101] w-[80%] bg-white md:hidden overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Close Button - Top Right Corner */}
              <button
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-4 right-4 z-1000 w-10 h-10 rounded-full bg-neutral-900 hover:bg-neutral-800 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl group"
                aria-label="Close menu"
              >
                <X
                  className="w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-90"
                  strokeWidth={2.5}
                />
              </button>

              {/* Menu Content */}
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="px-6 py-5 border-b border-neutral-100 bg-gradient-to-br from-neutral-50 to-white flex-shrink-0">
                  <Link
                    href="/"
                    onClick={() => setIsMenuOpen(false)}
                    className="inline-flex items-baseline gap-1 font-serif text-2xl text-neutral-900"
                  >
                    <span className="font-medium">Bini</span>
                    <span className="text-neutral-400">.B</span>
                  </Link>
                </div>

                {/* Navigation - Scrollable if needed */}
                <div className="flex-1 overflow-y-auto py-4 px-4">
                  <nav className="space-y-1">
                    {NAV_ITEMS.map((item, idx) => {
                      const isActive = pathname === item.href;
                      const hasSubmenu = item.submenu && item.submenu.length > 0;

                      if (hasSubmenu) {
                        return (
                          <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 + idx * 0.04, duration: 0.4 }}
                            className="space-y-1"
                          >
                            {/* Services Header */}
                            <div className="px-3 py-2.5 text-sm font-bold text-neutral-900 flex items-center gap-2">
                              <div className="w-6 h-6 rounded-lg bg-neutral-900 flex items-center justify-center flex-shrink-0">
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="white"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                >
                                  <rect x="3" y="3" width="7" height="7" rx="1" />
                                  <rect x="14" y="3" width="7" height="7" rx="1" />
                                  <rect x="14" y="14" width="7" height="7" rx="1" />
                                  <rect x="3" y="14" width="7" height="7" rx="1" />
                                </svg>
                              </div>
                              {item.label}
                            </div>

                            {/* Services List */}
                            <div className="ml-3 pl-3 border-l-2 border-neutral-100 space-y-0.5">
                              {item.submenu?.map((subItem) => (
                                <a
                                  key={subItem.href}
                                  href="https://calendar.app.google/1RTjShD5sgqBmm3K7"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => setIsMenuOpen(false)}
                                  className="group flex items-start gap-2 px-3 py-2.5 rounded-lg hover:bg-neutral-50 transition-all duration-300"
                                >
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-0.5">
                                      <span className="text-sm font-semibold text-neutral-900 group-hover:text-neutral-900">
                                        {subItem.label}
                                      </span>
                                      {subItem.badge && (
                                        <span
                                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                            subItem.badge === "Popular"
                                              ? "bg-blue-100 text-blue-700"
                                              : "bg-amber-100 text-amber-700"
                                          }`}
                                        >
                                          {subItem.badge}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-neutral-500 leading-relaxed">
                                      {subItem.description}
                                    </p>
                                  </div>
                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    className="mt-1 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all duration-300 flex-shrink-0"
                                  >
                                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                                  </svg>
                                </a>
                              ))}
                            </div>
                          </motion.div>
                        );
                      }

                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 + idx * 0.04, duration: 0.4 }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-300 ${
                              isActive
                                ? "bg-neutral-900 text-white"
                                : "text-neutral-900 hover:bg-neutral-50"
                            }`}
                          >
                            <span className="text-sm font-semibold">{item.label}</span>
                            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </nav>
                </div>

                {/* Footer - Fixed at bottom */}
                <div className="px-6 py-5 border-t border-neutral-100 bg-gradient-to-br from-white to-neutral-50 flex-shrink-0 space-y-4">
                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <a
                      href="https://calendar.app.google/1RTjShD5sgqBmm3K7"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full px-5 py-3.5 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-800 transition-all duration-300 group text-sm"
                    >
                      <span>Book a Meeting</span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        className="group-hover:translate-x-0.5 transition-transform duration-300"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </a>
                  </motion.div>

                  {/* Contact Info */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="space-y-2"
                  >
                    <a
                      href="mailto:biniyam.be.go@gmail.com"
                      className="block text-xs text-neutral-600 hover:text-neutral-900 transition-colors duration-300"
                    >
                      biniyam.be.go@gmail.com
                    </a>
                    <p className="text-xs text-neutral-400">
                      Based in Addis Ababa · Working worldwide
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
