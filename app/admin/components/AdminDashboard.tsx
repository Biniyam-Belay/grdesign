"use client";

import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

interface AdminDashboardProps {
  user: User;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const router = useRouter();
  const supabase = createSupabaseClient();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const cards = [
    {
      href: "/admin/blogs",
      title: "Blog Posts",
      description: "Craft and publish compelling articles.",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
    },
    {
      href: "/admin/projects",
      title: "Projects Management",
      description: "Manage your portfolio projects and their order.",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      href: "/admin/works",
      title: "Featured Works",
      description: "Manage your featured works showcase.",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      ),
    },
    {
      href: "/admin/testimonials",
      title: "Testimonials",
      description: "Manage client feedback and reviews.",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      ),
    },
  ];

  const quickActions = [
    {
      href: "/admin/blogs/new",
      label: "New Post",
      showLabel: true,
      icon: (
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      href: "/admin/projects/new",
      label: "New Project",
      showLabel: true,
      icon: (
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      href: "/admin/works/new",
      label: "New Work",
      showLabel: true,
      icon: (
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      href: "/",
      label: "View Site",
      showLabel: false,
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      ),
    },
    {
      href: "/admin/settings",
      label: "Settings",
      showLabel: false,
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-800">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-neutral-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-neutral-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <header className="sticky top-0 z-40 bg-white/60 backdrop-blur-lg border-b border-neutral-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="inline-flex items-baseline gap-1.5 font-serif text-xl text-black hover:opacity-75 transition-opacity"
              >
                <span className="font-semibold">Bini</span>
                <span className="font-medium text-neutral-400">.B</span>
              </Link>
              <div className="hidden md:flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
                <span className="text-xs tracking-[0.2em] uppercase text-neutral-500 font-medium">
                  Admin
                </span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-neutral-100/60 rounded-full border border-neutral-200/70">
              <div className="h-2 w-2 rounded-full bg-black animate-pulse" />
              <span className="text-xs text-neutral-600 font-medium">Online</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div
          className={`mb-16 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-1 bg-black rounded-full" />
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-neutral-900">
                  Welcome back
                </h1>
              </div>
              <p className="text-neutral-500 text-lg ml-7">
                Ready to create something amazing today?
              </p>
            </div>
            <div className="flex items-center flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <Link
                  key={action.href}
                  href={action.href}
                  title={action.label}
                  className={`group flex items-center gap-2 ${action.showLabel ? "px-3.5 py-2" : "h-9 w-9 justify-center"} rounded-lg bg-neutral-100 hover:bg-black text-neutral-600 hover:text-white transition-all duration-200 hover:-translate-y-px`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {action.icon}
                  {action.showLabel && (
                    <span className="text-sm font-medium whitespace-nowrap">{action.label}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map((card, index) => (
            <Link
              key={card.href}
              href={card.href}
              className={`group relative overflow-hidden transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              <div className="relative h-full border border-neutral-200/80 rounded-2xl bg-white p-6 transition-all duration-300 hover:shadow-xl hover:shadow-neutral-200/80 hover:scale-[1.02]">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500 transition-all duration-300 group-hover:bg-black group-hover:text-white mb-4">
                  {card.icon}
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">{card.title}</h3>
                <p className="text-sm text-neutral-500 mb-4">{card.description}</p>
                <div className="absolute bottom-6 right-6 flex items-center justify-center h-8 w-8 rounded-full bg-neutral-100 group-hover:bg-black transition-all duration-300">
                  <svg
                    className="h-5 w-5 text-neutral-500 group-hover:text-white transition-transform duration-300 group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              </div>
            </Link>
          ))}
        </div>

        <div
          className={`border border-neutral-200/80 rounded-2xl bg-white p-6 transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: "400ms" }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white font-semibold text-lg">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-black border-2 border-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">Your Account</p>
                <p className="text-sm text-neutral-600">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 hover:text-black border border-neutral-300 rounded-lg hover:border-black bg-white hover:bg-neutral-50 transition-all duration-200 w-full sm:w-auto justify-center"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign Out
            </button>
          </div>
        </div>

        <footer className="mt-16 pt-8 border-t border-neutral-200/80">
          <p className="text-sm text-neutral-500 text-center">
            CMS · {new Date().getFullYear()} Bini.B
          </p>
        </footer>
      </main>
    </div>
  );
}
