"use client";

import { useState, useEffect, useCallback } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Blog } from "@/lib/types";

export default function BlogManagement() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const supabase = createSupabaseClient();

  const fetchBlogs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      const { error } = await supabase.from("blogs").delete().eq("id", id);

      if (error) throw error;

      // Remove from local state
      setBlogs(blogs.filter((blog) => blog.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete blog");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg text-neutral-600">Loading blogs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                href="/admin"
                className="flex items-center gap-2 text-neutral-600 hover:text-black transition-colors text-sm"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Dashboard
              </Link>
              <div className="h-4 w-px bg-neutral-300" />
              <h1 className="text-lg font-medium text-neutral-900">Blog Posts</h1>
            </div>
            <div className="flex items-center">
              <Link
                href="/admin/blogs/new"
                className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
              >
                New Post
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
                Content Overview
              </h2>
              <p className="text-neutral-600 mt-1">
                {blogs.length} {blogs.length === 1 ? "post" : "posts"} published
              </p>
            </div>
          </div>
        </div>

        {blogs.length === 0 ? (
          <div className="border border-neutral-200 rounded-lg bg-neutral-50 p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 48 48"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-neutral-900">No blog posts yet</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Start sharing your thoughts and insights with your first post.
            </p>
            <div className="mt-6">
              <Link
                href="/admin/blogs/new"
                className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create your first post
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="border border-neutral-200 rounded-lg bg-white p-6 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-neutral-900 mb-2">{blog.title}</h3>
                        <p className="text-neutral-600 text-sm leading-relaxed mb-3 line-clamp-2">
                          {blog.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-neutral-500">
                          <time className="font-medium">
                            {new Date(blog.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </time>
                          {blog.tags && blog.tags.length > 0 && (
                            <div className="flex items-center gap-1">
                              <span>•</span>
                              <div className="flex gap-1">
                                {blog.tags.slice(0, 3).map((tag, index) => (
                                  <span
                                    key={index}
                                    className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded text-xs"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {blog.tags.length > 3 && (
                                  <span className="text-neutral-500">+{blog.tags.length - 3}</span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Published
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3 pt-4 border-t border-neutral-100">
                  <Link
                    href={`/admin/blogs/edit/${blog.id}`}
                    className="text-sm text-neutral-700 hover:text-black transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(blog.id!)}
                    className="text-sm text-red-600 hover:text-red-700 transition-colors"
                  >
                    Delete
                  </button>
                  <div className="flex-1" />
                  <Link
                    href={`/blog/${blog.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-black transition-colors"
                  >
                    View post
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
