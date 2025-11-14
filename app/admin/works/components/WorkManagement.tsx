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

      const { data, error } = await supabase
        .from("works")
        .select("*")
        .order("featured_order", { ascending: true });

      if (error) throw error;
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

  const handleDelete = async (work: Work) => {
    if (
      !confirm(
        `Are you sure you want to delete "${work.title}"? This will also permanently delete the associated image.`,
      )
    )
      return;

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/admin/login";
        return;
      }

      // 1. Delete image from storage
      if (work.image) {
        const filePath = work.image.substring(work.image.lastIndexOf("/") + 1);
        if (filePath) {
          const { error: storageError } = await supabase.storage.from("works").remove([filePath]);
          if (storageError) {
            // Log error but don't block DB deletion
            console.error("Failed to delete image from storage:", storageError.message);
          }
        }
      }

      // 2. Delete record from database
      const { error: dbError } = await supabase.from("works").delete().eq("id", work.id);
      if (dbError) throw dbError;

      // 3. Update UI
      setWorks((prev) => prev.filter((w) => w.id !== work.id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete work: " + (err as Error).message);
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
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-neutral-200/50 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900"
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
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-neutral-700 border border-neutral-300 rounded-xl hover:bg-neutral-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg border border-neutral-200 p-6 mb-6">
            <div className="flex items-center gap-1 bg-neutral-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 rounded-lg ${viewMode === "grid" ? "bg-white shadow-sm text-purple-600" : "text-neutral-600"}`}
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
                className={`px-3 py-2 rounded-lg ${viewMode === "list" ? "bg-white shadow-sm text-purple-600" : "text-neutral-600"}`}
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
            <div className="flex items-center gap-4">
              <Link
                href="/admin/works/batch"
                className="bg-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
              >
                Add in Batch
              </Link>
              <Link
                href="/admin/works/new"
                className="bg-white border border-neutral-300 text-neutral-700 px-6 py-3 rounded-xl font-semibold shadow-sm"
              >
                Add Single
              </Link>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {works.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-neutral-200">
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">No featured works yet</h3>
              <p className="text-neutral-600 mb-6">
                Get started by adding your first featured work
              </p>
              <Link
                href="/admin/works/new"
                className="bg-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
              >
                Add Your First Work
              </Link>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {works.map((work) => (
                <div
                  key={work.id}
                  className="group bg-white rounded-2xl shadow-lg border border-neutral-200 overflow-hidden"
                >
                  <div className="relative aspect-square overflow-hidden bg-neutral-100">
                    {work.image && (
                      <Image src={work.image} alt={work.title} fill className="object-cover" />
                    )}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Link
                        href={`/admin/works/edit/${work.slug}`}
                        className="p-2 bg-white/90 rounded-lg shadow-lg"
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
                        onClick={() => handleDelete(work)}
                        className="p-2 bg-red-500/90 rounded-lg shadow-lg"
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
                    <h3 className="text-lg font-semibold text-neutral-900">{work.title}</h3>
                    {work.description && (
                      <p className="text-sm text-neutral-600 line-clamp-2">{work.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {works.map((work) => (
                <div
                  key={work.id}
                  className="flex items-center gap-6 bg-white rounded-2xl shadow-lg border border-neutral-200 p-6"
                >
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
                    {work.image && (
                      <Image src={work.image} alt={work.title} fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-neutral-900">{work.title}</h3>
                    {work.description && (
                      <p className="text-sm text-neutral-600">{work.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Link
                      href={`/admin/works/edit/${work.slug}`}
                      className="p-3 bg-neutral-100 rounded-xl"
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
                      onClick={() => handleDelete(work)}
                      className="p-3 bg-red-100 rounded-xl"
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
