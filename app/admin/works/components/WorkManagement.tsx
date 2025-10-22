"use client";

import { useState, useEffect, useCallback } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { Work } from "@/lib/types";

export default function WorkManagement() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const supabase = createSupabaseClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  };

  const fetchWorks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        window.location.href = "/admin/login";
        return;
      }

      // Direct database query instead of Edge Function
      const { data, error } = await supabase
        .from("works")
        .select("*")
        .order("featured_order", { ascending: true });

      if (error) {
        throw error;
      }

      setWorks(data || []);
    } catch (err) {
      console.error("Error fetching works:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch works");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchWorks();
  }, [fetchWorks]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this work?")) return;

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        window.location.href = "/admin/login";
        return;
      }

      // Direct database delete
      const { error } = await supabase.from("works").delete().eq("id", id);

      if (error) throw error;

      setWorks((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete work");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent mb-4"></div>
          <p className="text-neutral-600">Loading featured works...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-pink-400/5 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-neutral-200/50 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-all hover:scale-105"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span className="font-medium text-sm">Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-neutral-300" />
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h1 className="text-lg font-semibold text-neutral-900">Featured Works</h1>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 border border-neutral-300 rounded-xl hover:border-neutral-400 bg-white hover:bg-neutral-50 transition-all duration-200 hover:shadow-sm"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content Container */}
      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Actions Bar */}
          <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg border border-neutral-200 p-6 mb-6">
            <div className="flex items-center gap-1 bg-neutral-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-purple-600"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-white shadow-sm text-purple-600"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            <Link
              href="/admin/works/new"
              className="group relative overflow-hidden flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Work
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 animate-shake">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Works Display */}
          {works.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-neutral-200">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 mb-4">
                <svg
                  className="w-10 h-10 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">No featured works yet</h3>
              <p className="text-neutral-600 mb-6">
                Get started by adding your first featured work
              </p>
              <Link
                href="/admin/works/new"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Your First Work
              </Link>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {works.map((work) => (
                <div
                  key={work.id}
                  className="group bg-white rounded-2xl shadow-lg border border-neutral-200 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-square overflow-hidden bg-neutral-100">
                    {work.image && (
                      <Image
                        src={work.image}
                        alt={work.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Link
                        href={`/admin/works/edit/${work.slug}`}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors shadow-lg"
                      >
                        <svg
                          className="h-4 w-4 text-neutral-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </Link>
                      <button
                        onClick={() => work.id && handleDelete(work.id)}
                        className="p-2 bg-red-500/90 backdrop-blur-sm rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <svg
                          className="h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-1">
                      {work.title}
                    </h3>
                    {work.description && (
                      <p className="text-sm text-neutral-600 line-clamp-2 mb-3">
                        {work.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                        Order: {work.featured_order}
                      </span>
                      <span className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-full">
                        {work.aspect_ratio}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {works.map((work) => (
                <div
                  key={work.id}
                  className="flex items-center gap-6 bg-white rounded-2xl shadow-lg border border-neutral-200 p-6 hover:shadow-xl transition-all"
                >
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
                    {work.image && (
                      <Image src={work.image} alt={work.title} fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-neutral-900 truncate">
                      {work.title}
                    </h3>
                    {work.description && (
                      <p className="text-sm text-neutral-600 line-clamp-1">{work.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                        Order: {work.featured_order}
                      </span>
                      <span className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-full">
                        {work.aspect_ratio}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Link
                      href={`/admin/works/edit/${work.slug}`}
                      className="p-3 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors"
                    >
                      <svg
                        className="h-5 w-5 text-neutral-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </Link>
                    <button
                      onClick={() => work.id && handleDelete(work.id)}
                      className="p-3 bg-red-100 rounded-xl hover:bg-red-200 transition-colors"
                    >
                      <svg
                        className="h-5 w-5 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
