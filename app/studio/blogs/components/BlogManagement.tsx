"use client";

import { useState, useEffect, useCallback } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Blog } from "@/lib/types";

export default function BlogManagement() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTag, setFilterTag] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const supabase = createSupabaseClient();

  useEffect(() => {
    // This triggers the entry animations
    setMounted(true);
  }, []);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("You are not signed in. Please log in again.");
      }

      const { data, error } = await supabase.functions.invoke("blogs", {
        body: { action: "list" },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      setBlogs((data?.blogs as Blog[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = async (blog: Blog) => {
    if (
      !confirm(
        `Are you sure you want to delete the blog post "${blog.title}"? This will also permanently delete the cover image.`,
      )
    )
      return;

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("You are not signed in. Please log in again.");

      // 1. Delete cover image from storage
      if (blog.cover) {
        const filePath = blog.cover.substring(blog.cover.lastIndexOf("/") + 1);
        if (filePath) {
          const { error: storageError } = await supabase.storage
            .from("blog-images")
            .remove([filePath]);
          if (storageError) {
            console.error("Failed to delete cover image from storage:", storageError.message);
          }
        }
      }

      // 2. Delete the record from the database
      const { error: dbError } = await supabase.from("blogs").delete().eq("id", blog.id);
      if (dbError) throw dbError;

      // 3. Revalidate and update UI
      await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/blog", type: "layout" }),
      });

      setBlogs((prev) => prev.filter((b) => b.id !== blog.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete blog post");
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = filterTag === "all" || (blog.tags && blog.tags.includes(filterTag));
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(blogs.flatMap((blog) => blog.tags || [])));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center transition-opacity duration-300">
        <div className="text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-[#0B132B]/10 border-t-black" />
          <p className="mt-4 text-[#0B132B]/60 font-medium">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#0B132B] selection:bg-[#FF0033]/20 pb-24">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-[50vh] h-[50vh] bg-[#0055FF]/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-[50vh] h-[50vh] bg-[#FF0033]/5 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <header className="sticky top-0 z-40 bg-[#F5F5F0]/80 backdrop-blur-xl border-b border-[#0B132B]/10">
        <div className="mx-auto max-w-8xl px-6 lg:px-12">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/studio"
                className="flex items-center gap-2 text-[#0B132B]/50 hover:text-[#FF0033] transition-all duration-300 group"
              >
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                  ← Dashboard
                </span>
              </Link>
              <div className="h-5 w-px bg-[#0B132B]/10" />
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-medium tracking-tight text-[#0B132B]">
                  Editorial Posts
                </h1>
              </div>
            </div>

            <Link
              href="/studio/blogs/new"
              className="hidden sm:inline-flex items-center justify-center gap-2 bg-[#0B132B] text-white px-5 py-2.5 text-[9px] uppercase font-bold tracking-[0.2em] transition-all duration-300 hover:bg-[#FF0033] hover:shadow-[0_5px_15px_rgba(255,0,51,0.25)] rounded-none"
            >
              Compose New Post
            </Link>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-8xl px-6 lg:px-12 py-12">
        <div
          className={`transition-all duration-500 ease-in-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          {error && (
            <div className="mb-6 rounded-xl border border-[#0B132B]/20 bg-white/40 p-4 animate-shake">
              <div className="flex items-start gap-3">
                <svg
                  className="h-5 w-5 text-[#0B132B] mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm text-[#0B132B] font-medium">{error}</p>
              </div>
            </div>
          )}

          <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full max-w-sm">
              <input
                type="text"
                placeholder="Search Archive..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full bg-white border border-[#0B132B]/10 px-4 py-3 text-sm text-[#0B132B] focus:outline-none focus:border-[#0055FF]/50 transition-colors uppercase tracking-[0.1em] placeholder-[#0B132B]/30"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="flex-1 w-full bg-white border border-[#0B132B]/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[#0B132B]/70 focus:outline-none focus:border-[#0055FF]/50 transition-colors rounded-none appearance-none"
              >
                <option value="all">ALL TAGS</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag.toUpperCase()}
                  </option>
                ))}
              </select>
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
          </div>
          <div className="mb-8 border-t border-[#0B132B]/10 pt-6 flex items-center justify-between">
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/40">
              <span className="text-[#0B132B]">{filteredBlogs.length}</span> / POSTS
            </p>
            <Link
              href="/studio/blogs/new"
              className="sm:hidden inline-flex items-center justify-center bg-[#0B132B] text-white px-5 py-2.5 text-[9px] uppercase font-bold tracking-[0.2em] transition-all duration-300 hover:bg-[#FF0033] rounded-none"
            >
              Compose New Post
            </Link>
          </div>
        </div>

        {filteredBlogs.length === 0 ? (
          <div
            className={`transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
          >
            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-[#0B132B]/10 rounded-2xl">
              <div className="mb-4 h-16 w-16 rounded-full bg-white/50 border border-[#0B132B]/10 flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-[#0B132B]/30"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#0B132B] mb-2">No blog posts found</h3>
              <p className="text-[#0B132B]/50 mb-6 max-w-xs">
                {searchQuery
                  ? `Your search for "${searchQuery}" did not return any results.`
                  : "Get started by creating your first blog post."}
              </p>
              <Link
                href="/studio/blogs/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B132B] text-white hover:bg-[#FF0033] hover:shadow-[0_10px_20px_rgba(255,0,51,0.2)] border-none transition-all duration-300 rounded-lg font-medium transition-all duration-200 ease-in-out hover:bg-neutral-800 hover:-translate-y-px active:scale-95"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create First Post
              </Link>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog, index) => (
              <div
                key={blog.id}
                className={`group relative transition-all duration-500 ease-in-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="relative h-full overflow-hidden rounded-2xl border border-[#0B132B]/10 bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-neutral-200/80 hover:-translate-y-1">
                  <div className="p-6">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <h3 className="text-xl tracking-tight font-medium text-[#0B132B] line-clamp-2 group-hover:text-[#FF0033] transition-colors">
                        {blog.title}
                      </h3>
                    </div>
                    <div className="mb-6">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0B132B]/40">
                        {formatDate(blog.date)}
                      </span>
                    </div>
                    <p className="text-sm font-light text-[#0B132B]/60 line-clamp-3 mb-6 leading-relaxed">
                      {blog.excerpt}
                    </p>
                    <div className="mb-8 flex flex-wrap gap-2">
                      {blog.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex bg-[#0B132B]/5 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#0B132B]/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-0 border-t border-[#0B132B]/5 pt-4">
                      <Link
                        href={`/studio/blogs/edit/${blog.slug}`}
                        className="flex-1 text-[9px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/50 hover:text-[#0055FF] transition-colors py-2"
                      >
                        EDIT ENTRY
                      </Link>
                      <button
                        onClick={() => handleDelete(blog)}
                        disabled={!blog.id}
                        className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/30 hover:text-[#FF0033] transition-colors py-2 px-2 disabled:opacity-50"
                        title="Delete Entry"
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBlogs.map((blog, index) => (
              <div
                key={blog.id}
                className={`group transition-all duration-500 ease-in-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: `${index * 30}ms` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 border-b border-[#0B132B]/10 bg-white/50 p-6 transition-all duration-300 ease-in-out hover:bg-white hover:border-[#0055FF]/30">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <h3 className="text-lg tracking-tight font-medium text-[#0B132B] truncate">
                        {blog.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0B132B]/40">
                        {formatDate(blog.date)}
                      </span>
                      <div className="flex items-center gap-2">
                        {blog.tags?.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#0B132B]/40 border-l border-[#0B132B]/10"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-6 sm:gap-4 flex-shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-[#0B132B]/5">
                    <Link
                      href={`/studio/blogs/edit/${blog.slug}`}
                      className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/50 hover:text-[#0055FF] transition-colors"
                    >
                      EDIT
                    </Link>
                    <button
                      onClick={() => handleDelete(blog)}
                      disabled={!blog.id}
                      className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/30 hover:text-[#FF0033] transition-colors disabled:opacity-50"
                      title="Delete Entry"
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
