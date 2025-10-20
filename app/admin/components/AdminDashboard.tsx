"use client";

import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/client";

interface AdminDashboardProps {
  user: User;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const router = useRouter();
  const supabase = createSupabaseClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="inline-flex items-baseline gap-1 font-serif text-xl text-black"
              >
                <span className="font-medium">Bini</span>
                <span className="text-neutral-400">.B</span>
              </Link>
              <div className="hidden md:block">
                <span className="text-xs tracking-[0.2em] uppercase text-neutral-500">
                  Content Management
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-600">{user.email}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-neutral-700 hover:text-black transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-2">
            Content Management
          </h1>
          <p className="text-neutral-600">Manage your portfolio content and blog posts.</p>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Blog Management */}
          <Link href="/admin/blogs" className="group block">
            <div className="border border-neutral-200 rounded-lg bg-white p-8 transition-all duration-200 hover:shadow-lg hover:border-neutral-300">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 group-hover:bg-neutral-200 transition-colors">
                  <svg
                    className="h-6 w-6 text-neutral-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-neutral-900 group-hover:text-black">
                    Blog Posts
                  </h3>
                  <p className="mt-1 text-sm text-neutral-600">
                    Create, edit, and manage blog articles
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-neutral-500">
                    <span>Manage content</span>
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M5 12h14M12 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Project Management */}
          <Link href="/admin/projects" className="group block">
            <div className="border border-neutral-200 rounded-lg bg-white p-8 transition-all duration-200 hover:shadow-lg hover:border-neutral-300">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 group-hover:bg-neutral-200 transition-colors">
                  <svg
                    className="h-6 w-6 text-neutral-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-neutral-900 group-hover:text-black">
                    Portfolio Projects
                  </h3>
                  <p className="mt-1 text-sm text-neutral-600">
                    Showcase your work and case studies
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-neutral-500">
                    <span>Manage portfolio</span>
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M5 12h14M12 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Quick Actions */}
          <div className="border border-neutral-200 rounded-lg bg-neutral-50 p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white">
                <svg
                  className="h-6 w-6 text-neutral-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-neutral-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    href="/admin/blogs/new"
                    className="block text-sm text-neutral-700 hover:text-black transition-colors"
                  >
                    + New blog post
                  </Link>
                  <Link
                    href="/admin/projects/new"
                    className="block text-sm text-neutral-700 hover:text-black transition-colors"
                  >
                    + New project
                  </Link>
                  <Link
                    href="/"
                    className="block text-sm text-neutral-700 hover:text-black transition-colors"
                  >
                    ← View site
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-16 border-t border-neutral-200 pt-8">
          <p className="text-xs text-neutral-500">
            Content Management System · {new Date().getFullYear()}
          </p>
        </div>
      </main>
    </div>
  );
}
