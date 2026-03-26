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
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const supabase = createSupabaseClient();

  useEffect(() => {
    setMounted(true);
  }, []);

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
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F0]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0B132B] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#0B132B] selection:bg-[#FF0033]/20 pb-24">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-[50vh] h-[50vh] bg-[#0055FF]/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-[50vh] h-[50vh] bg-[#FF0033]/5 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#F5F5F0]/80 backdrop-blur-xl border-b border-[#0B132B]/10">
        <div className="mx-auto max-w-8xl px-6 lg:px-12">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="flex items-center gap-2 text-[#0B132B]/50 hover:text-[#FF0033] transition-all duration-300 group"
              >
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                  ← Dashboard
                </span>
              </Link>
              <div className="h-5 w-px bg-[#0B132B]/10" />
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-medium tracking-tight text-[#0B132B]">Testimonials</h1>
              </div>
            </div>

            <Link
              href="/admin/testimonials/new"
              className="hidden sm:inline-flex items-center justify-center gap-2 bg-[#0B132B] text-white px-5 py-2.5 text-[9px] uppercase font-bold tracking-[0.2em] transition-all duration-300 hover:bg-[#FF0033] hover:shadow-[0_5px_15px_rgba(255,0,51,0.25)] rounded-none"
            >
              Add Testimonial
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative mx-auto max-w-8xl px-6 lg:px-12 py-12">
        <div
          className={`transition-all duration-500 ease-in-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          {error && (
            <div className="mb-6 border border-[#FF0033]/20 bg-[#FF0033]/5 p-4">
              <p className="text-sm text-[#FF0033] font-medium">{error}</p>
            </div>
          )}

          {/* Controls */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/40 mr-2">
                VIEW
              </span>
              <div className="flex bg-white/50 border border-[#0B132B]/10 p-0.5">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center justify-center h-10 w-10 text-sm font-medium transition-colors duration-200 ${viewMode === "grid" ? "bg-[#0B132B] text-white" : "text-[#0B132B]/40 hover:bg-[#0B132B]/5 hover:text-[#0B132B]"}`}
                  title="Grid View"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  className={`flex items-center justify-center h-10 w-10 text-sm font-medium transition-colors duration-200 ${viewMode === "list" ? "bg-[#0B132B] text-white" : "text-[#0B132B]/40 hover:bg-[#0B132B]/5 hover:text-[#0B132B]"}`}
                  title="List View"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <Link
              href="/admin/testimonials/new"
              className="sm:hidden inline-flex items-center justify-center bg-[#0B132B] text-white px-5 py-2.5 text-[9px] uppercase font-bold tracking-[0.2em] transition-all duration-300 hover:bg-[#FF0033] rounded-none w-full"
            >
              Add Testimonial
            </Link>
          </div>

          {/* Counter */}
          <div className="mb-8 border-t border-[#0B132B]/10 pt-6 flex items-center justify-between">
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/40">
              <span className="text-[#0B132B]">{testimonials.length}</span> / TESTIMONIALS
            </p>
          </div>
        </div>

        {testimonials.length === 0 ? (
          <div
            className={`transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
          >
            <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-[#0B132B]/10 bg-white/30">
              <h3 className="text-xl font-medium text-[#0B132B] mb-3">No testimonials yet</h3>
              <p className="text-sm text-[#0B132B]/40 mb-8 max-w-xs">
                Add your first testimonial to see it here.
              </p>
              <Link
                href="/admin/testimonials/new"
                className="inline-flex items-center gap-2 bg-[#0B132B] text-white px-8 py-4 text-[10px] uppercase font-bold tracking-[0.25em] transition-all duration-300 hover:bg-[#FF0033]"
              >
                Add First Testimonial
              </Link>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`group transition-all duration-500 ease-in-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="relative h-full overflow-hidden bg-white/50 border border-[#0B132B]/10 transition-all duration-300 ease-in-out hover:bg-white hover:border-[#0055FF]/30 flex flex-col">
                  {/* Content */}
                  <div className="p-6 flex-1">
                    {/* Author */}
                    <div className="flex items-center gap-4 mb-5">
                      {testimonial.image ? (
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-10 h-10 bg-[#0B132B]/5 flex items-center justify-center text-[#0B132B]/30 font-bold text-sm">
                          {testimonial.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-[#0B132B] tracking-tight">
                          {testimonial.name}
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.15em] text-[#0B132B]/40 font-bold">
                          {testimonial.role}
                          {testimonial.company ? ` · ${testimonial.company}` : ""}
                        </p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-0.5 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#0B132B] text-[#0B132B]" />
                      ))}
                      {[...Array(5 - (testimonial.rating || 0))].map((_, i) => (
                        <Star
                          key={`empty-${i}`}
                          className="w-3.5 h-3.5 fill-transparent text-[#0B132B]/15"
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-sm font-light text-[#0B132B]/60 line-clamp-4 leading-relaxed border-l-2 border-[#0B132B]/10 pl-4">
                      &ldquo;{testimonial.content}&rdquo;
                    </blockquote>

                    {testimonial.result && (
                      <div className="mt-4 inline-flex bg-[#0055FF]/5 px-2 py-1">
                        <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#0055FF]/70">
                          {testimonial.result}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-0 border-t border-[#0B132B]/5 px-6 py-3">
                    <Link
                      href={`/admin/testimonials/edit/${testimonial.id}`}
                      className="flex-1 text-[9px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/50 hover:text-[#0055FF] transition-colors py-2"
                    >
                      EDIT
                    </Link>
                    <button
                      onClick={() => handleDelete(testimonial)}
                      className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/30 hover:text-[#FF0033] transition-colors py-2 px-2"
                      title="Delete"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-0">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`group transition-all duration-500 ease-in-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: `${index * 30}ms` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 border-b border-[#0B132B]/10 bg-white/50 p-6 transition-all duration-300 ease-in-out hover:bg-white hover:border-[#0055FF]/30">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {testimonial.image ? (
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-12 h-12 bg-[#0B132B]/5 flex items-center justify-center text-[#0B132B]/30 font-bold">
                        {testimonial.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg tracking-tight font-medium text-[#0B132B]">
                        {testimonial.name}
                      </h3>
                      <div className="flex items-center gap-0.5">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-[#0B132B] text-[#0B132B]" />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0B132B]/40">
                        {testimonial.role}
                        {testimonial.company ? ` · ${testimonial.company}` : ""}
                      </span>
                      {testimonial.result && (
                        <span className="inline-flex px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#0055FF]/60 border-l border-[#0B132B]/10">
                          {testimonial.result}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-6 sm:gap-4 flex-shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-[#0B132B]/5">
                    <Link
                      href={`/admin/testimonials/edit/${testimonial.id}`}
                      className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/50 hover:text-[#0055FF] transition-colors"
                    >
                      EDIT
                    </Link>
                    <button
                      onClick={() => handleDelete(testimonial)}
                      className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/30 hover:text-[#FF0033] transition-colors"
                      title="Delete"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
