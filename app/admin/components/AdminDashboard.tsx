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
      description: "Craft and publish compelling articles",
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
      color: "from-blue-500/10 to-cyan-500/10",
      borderColor: "border-blue-200/50 hover:border-blue-300",
      iconBg: "bg-blue-50 group-hover:bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      href: "/admin/projects",
      title: "Portfolio Projects",
      description: "Showcase your best creative work",
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
      color: "from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-200/50 hover:border-purple-300",
      iconBg: "bg-purple-50 group-hover:bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      href: "/admin/works",
      title: "Featured Works",
      description: "Manage your featured works showcase",
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
      color: "from-amber-500/10 to-orange-500/10",
      borderColor: "border-amber-200/50 hover:border-amber-300",
      iconBg: "bg-amber-50 group-hover:bg-amber-100",
      iconColor: "text-amber-600",
    },
  ];

  const quickActions = [
    {
      href: "/admin/blogs/new",
      label: "New blog post",
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      href: "/admin/projects/new",
      label: "New project",
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      href: "/admin/works/new",
      label: "New featured work",
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      href: "/",
      label: "View public site",
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-neutral-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="inline-flex items-baseline gap-1 font-serif text-xl text-black hover:opacity-70 transition-opacity"
              >
                <span className="font-medium">Bini</span>
                <span className="text-neutral-400">.B</span>
              </Link>
              <div className="hidden md:flex items-center gap-3">
                <div className="h-1 w-1 rounded-full bg-neutral-300" />
                <span className="text-xs tracking-[0.2em] uppercase text-neutral-500 font-medium">
                  Admin
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/60 backdrop-blur-sm rounded-full border border-neutral-200/50 shadow-sm">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-neutral-600 font-medium">Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section with Quick Actions - Horizontal Layout */}
        <div
          className={`mb-12 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Welcome Text */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
                  Welcome back
                </h1>
              </div>
              <p className="text-neutral-600 text-lg ml-7">
                Ready to create something amazing today?
              </p>
            </div>

            {/* Quick Actions - Horizontal */}
            <div className="flex flex-wrap gap-3">
              {quickActions.map((action, index) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-neutral-300 transition-all duration-200 hover:shadow-md ${mounted ? "opacity-100" : "opacity-0"}`}
                  style={{ transitionDelay: `${(index + 1) * 50}ms` }}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-50 group-hover:bg-neutral-100 transition-colors">
                    {action.icon}
                  </div>
                  <span className="text-sm font-medium text-neutral-700 group-hover:text-neutral-900 transition-colors whitespace-nowrap">
                    {action.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Management Cards */}
          {cards.map((card, index) => (
            <Link
              key={card.href}
              href={card.href}
              className={`group relative overflow-hidden transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              <div
                className={`relative h-full border ${card.borderColor} rounded-2xl bg-gradient-to-br ${card.color} backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
              >
                {/* Icon */}
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor} transition-all duration-300 mb-4 group-hover:scale-110`}
                >
                  {card.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-neutral-900 mb-2 group-hover:text-neutral-800 transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-neutral-600 mb-4">{card.description}</p>

                {/* Arrow */}
                <div className="flex items-center gap-2 text-sm font-medium text-neutral-700 group-hover:text-neutral-900 transition-colors">
                  <span>Manage</span>
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 12h14M12 5l7 7-7 7"
                    />
                  </svg>
                </div>

                {/* Hover Gradient Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              </div>
            </Link>
          ))}
        </div>

        {/* Account Section */}
        <div
          className={`border border-neutral-200/50 rounded-2xl bg-white backdrop-blur-sm p-6 shadow-sm transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: "400ms" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold text-lg shadow-lg">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">Your Account</p>
                <p className="text-xs text-neutral-600">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:text-neutral-900 border border-neutral-300 rounded-xl hover:border-neutral-400 bg-white hover:bg-neutral-50 transition-all duration-200 hover:shadow-sm"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign Out
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-neutral-200/50">
          <p className="text-xs text-neutral-500 text-center">
            Content Management System · Built with precision · {new Date().getFullYear()}
          </p>
        </div>
      </main>
    </div>
  );
}
