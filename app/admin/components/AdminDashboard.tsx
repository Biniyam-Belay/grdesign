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
    <div className="min-h-screen bg-[#F5F5F0] text-[#0B132B] font-sans selection:bg-[#FF0033]/20">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-[50vh] h-[50vh] bg-[#0055FF]/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-[50vh] h-[50vh] bg-[#FF0033]/5 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <header className="sticky top-0 z-40 bg-[#F5F5F0]/80 backdrop-blur-xl border-b border-[#0B132B]/10">
        <div className="mx-auto max-w-8xl px-6 lg:px-12">
          <div className="flex h-[72px] items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="inline-flex items-baseline gap-0.5 text-xl tracking-tight transition-opacity hover:opacity-80"
              >
                <span className="font-bold text-[#0B132B]">Ilaala</span>
                <span className="font-bold text-[#FF0033]">.Studio</span>
              </Link>
              <div className="hidden md:flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-[#0B132B]/30" />
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#0B132B]/50 font-bold">
                  Command Center
                </span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/40 rounded-full border border-[#0B132B]/10">
              <div className="h-2 w-2 rounded-full bg-[#FF0033] animate-pulse" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#0B132B]/70">
                Admin Active
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-8xl px-6 lg:px-12 py-16">
        <div
          className={`mb-16 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <div className="h-12 w-[3px] bg-gradient-to-b from-[#0055FF] to-[#01BBFF]" />
                <h1 className="text-4xl md:text-5xl font-light tracking-[-0.03em] text-[#0B132B]">
                  Welcome back<span className="font-semibold text-[#FF0033]">.</span>
                </h1>
              </div>
              <p className="text-[#0B132B]/50 font-light text-lg ml-5">
                Manage the archive and orchestrate the platform.
              </p>
            </div>
            <div className="flex items-center flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <Link
                  key={action.href}
                  href={action.href}
                  title={action.label}
                  className={`group flex items-center gap-2 ${action.showLabel ? "px-4 py-2.5" : "h-11 w-11 justify-center"} bg-white/40 border border-[#0B132B]/10 hover:bg-[#0B132B] hover:border-[#0B132B] text-[#0B132B] hover:text-white transition-all duration-300 hover:shadow-[0_10px_30px_rgba(11,19,43,0.15)]`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {action.icon}
                  {action.showLabel && (
                    <span className="text-xs uppercase font-bold tracking-[0.15em] whitespace-nowrap pt-[2px]">
                      {action.label}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
          {cards.map((card, index) => (
            <Link
              key={card.href}
              href={card.href}
              className={`group relative overflow-hidden transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              <div className="relative h-full border border-[#0B132B]/10 bg-white/50 p-8 transition-all duration-500 hover:bg-white hover:border-[#0055FF]/30 hover:shadow-[0_20px_60px_-15px_rgba(0,85,255,0.15)] group-hover:-translate-y-1">
                <div className="inline-flex h-12 w-12 items-center justify-center bg-[#0B132B]/5 text-[#0B132B]/60 transition-all duration-500 group-hover:bg-[#0055FF] group-hover:text-white mb-6">
                  {card.icon}
                </div>
                <h3 className="text-xl font-medium tracking-tight text-[#0B132B] mb-2">
                  {card.title}
                </h3>
                <p className="text-sm font-light text-[#0B132B]/50 leading-relaxed max-w-[90%] mb-12">
                  {card.description}
                </p>

                <div className="absolute bottom-8 right-8 flex items-center justify-center h-10 w-10 border border-[#0B132B]/10 text-[#0B132B]/30 group-hover:bg-[#FF0033] group-hover:border-[#FF0033] group-hover:text-white transition-all duration-500">
                  <svg
                    className="h-4 w-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                    />
                  </svg>
                </div>
                {/* Micro hover gradient sweep */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0055FF]/0 via-[#0055FF]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              </div>
            </Link>
          ))}
        </div>

        <div
          className={`border border-[#0B132B]/10 bg-white/50 p-6 lg:p-8 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: "400ms" }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0B132B] text-white font-medium text-lg">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-[#FF0033] border-2 border-[#F5F5F0]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#FF0033] mb-0.5">
                  Administrator
                </span>
                <p className="text-base font-medium text-[#0B132B]">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] text-[#0B132B]/60 hover:text-white border border-[#0B132B]/10 hover:border-[#FF0033] bg-white/40 hover:bg-[#FF0033] transition-all duration-300 w-full sm:w-auto justify-center group"
            >
              Sign Out
              <svg
                className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>

        <footer className="mt-20 pt-8 border-t border-[#0B132B]/10">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#0B132B]/30 text-center">
            {new Date().getFullYear()} © Ilaala.Studio Command System
          </p>
        </footer>
      </main>
    </div>
  );
}
