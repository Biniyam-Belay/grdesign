"use client";

import { useState, useEffect, useCallback } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { Testimonial } from "@/lib/types";
import { Star } from "lucide-react";

export default function TestimonialManagement() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const supabase = createSupabaseClient();

  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setTestimonials(data || []);
    } catch (err) {
      setError((err as Error).message || "Failed to fetch testimonials");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleDelete = async (testimonial: Testimonial) => {
    if (!confirm(`Are you sure you want to delete the testimonial from "${testimonial.name}"?`))
      return;
    try {
      if (testimonial.image) {
        const filePath = testimonial.image.substring(testimonial.image.lastIndexOf("/") + 1);
        if (filePath) {
          await supabase.storage.from("testimonials").remove([filePath]);
        }
      }
      const { error: dbError } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", testimonial.id);
      if (dbError) throw dbError;
      setTestimonials((prev) => prev.filter((t) => t.id !== testimonial.id));
    } catch (err) {
      alert("Failed to delete testimonial: " + (err as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent mb-4"></div>
          <p className="text-neutral-600">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
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
            <h1 className="text-lg font-semibold text-neutral-900">Manage Testimonials</h1>
          </div>
        </div>
      </header>

      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg border border-neutral-200 p-6 mb-6">
            <div className="flex items-center gap-1 bg-neutral-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-purple-600" : "text-neutral-600 hover:text-neutral-900"}`}
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
                className={`px-3 py-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm text-purple-600" : "text-neutral-600 hover:text-neutral-900"}`}
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
              href="/admin/testimonials/new"
              className="bg-purple-500 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-purple-600"
            >
              Add New Testimonial
            </Link>
          </div>

          {error && <div className="mb-6 bg-red-50 p-4 rounded-lg text-red-800">{error}</div>}

          {testimonials.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-neutral-200">
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">No testimonials yet</h3>
              <p className="text-neutral-600">Add your first testimonial to see it here.</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="group bg-white rounded-2xl shadow-lg border border-neutral-200 overflow-hidden flex flex-col"
                >
                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      {testimonial.image ? (
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          className="rounded-full object-cover w-12 h-12"
                          unoptimized
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 font-semibold">
                          ?
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-neutral-900">{testimonial.name}</p>
                        <p className="text-sm text-neutral-600">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <blockquote className="text-neutral-700 text-sm italic border-l-2 border-neutral-200 pl-4">
                      "{testimonial.content}"
                    </blockquote>
                  </div>
                  <div className="bg-neutral-50/70 p-4 border-t border-neutral-200 flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/testimonials/edit/${testimonial.id}`}
                      className="p-2 rounded-lg hover:bg-neutral-200 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 text-neutral-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleDelete(testimonial)}
                      className="p-2 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 text-red-600"
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
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-neutral-200">
              <ul className="divide-y divide-neutral-200">
                {testimonials.map((testimonial) => (
                  <li key={testimonial.id} className="flex items-center justify-between gap-6 p-6">
                    <div className="flex items-center gap-4">
                      {testimonial.image ? (
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          className="rounded-full object-cover w-12 h-12"
                          unoptimized
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 font-semibold">
                          ?
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-neutral-900">{testimonial.name}</p>
                        <p className="text-sm text-neutral-600">
                          {testimonial.role}, {testimonial.company}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/testimonials/edit/${testimonial.id}`}
                        className="p-2 rounded-lg hover:bg-neutral-100"
                      >
                        <svg
                          className="w-5 h-5 text-neutral-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDelete(testimonial)}
                        className="p-2 rounded-lg hover:bg-red-100"
                      >
                        <svg
                          className="w-5 h-5 text-red-600"
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
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
