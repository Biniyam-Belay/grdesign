"use client";

import { useState } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RichTextEditor from "./RichTextEditor";
import ImageUpload from "@/components/ui/ImageUpload";
import { FormField, SuccessMessage, ErrorMessage } from "@/components/ui/FormComponents";
import { validateBlog, getFieldError } from "@/lib/validation";
import { Blog } from "@/lib/types";
import { clearBlogsCache } from "@/lib/data/blogs";

interface BlogFormProps {
  blog?: Blog;
  isEditing?: boolean;
}

export default function BlogForm({ blog, isEditing = false }: BlogFormProps) {
  const [formData, setFormData] = useState({
    title: blog?.title || "",
    slug: blog?.slug || "",
    excerpt: blog?.excerpt || "",
    cover: blog?.cover || "",
    content: blog?.content || "",
    tags: blog?.tags?.join(", ") || "",
    date: blog?.date
      ? new Date(blog.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validationErrors, setValidationErrors] = useState<{ field: string; message: string }[]>(
    [],
  );
  const router = useRouter();
  const supabase = createSupabaseClient();

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug === "" ? generateSlug(title) : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setValidationErrors([]);

    // Validate form data
    const validation = validateBlog(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setLoading(false);
      return;
    }

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const blogData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        cover: formData.cover,
        content: formData.content,
        tags: tagsArray,
        date: new Date(formData.date).toISOString(),
        updated_at: new Date().toISOString(),
      };

      const action = isEditing && blog?.id ? "update" : "create";
      const payload =
        isEditing && blog?.id
          ? { action, id: blog.id, data: blogData }
          : { action, data: blogData };

      // Get session for auth
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("You are not signed in. Please log in again.");
      }

      const { error } = await supabase.functions.invoke("blogs", {
        body: payload,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (error) throw error;

      // Clear the cache so new slug is reflected immediately
      clearBlogsCache();

      setSuccess(isEditing ? "Blog updated successfully!" : "Blog created successfully!");
      setTimeout(() => {
        router.push("/admin/blogs");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-neutral-200/50 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/blogs"
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
                <span className="font-medium text-sm">Back to Blog Posts</span>
              </Link>
              <div className="h-6 w-px bg-neutral-300" />
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <h1 className="text-lg font-semibold text-neutral-900">
                  {isEditing ? "Edit Blog Post" : "Create New Post"}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {success && <SuccessMessage message={success} onClose={() => setSuccess("")} />}

        {/* Error Message */}
        {error && <ErrorMessage message={error} onClose={() => setError("")} />}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Basic Information */}
            <div className="lg:col-span-2 space-y-8">
              {/* Post Details */}
              <div className="border border-neutral-200 rounded-lg bg-white p-8">
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-neutral-900">Post Content</h2>
                  <p className="text-sm text-neutral-600 mt-1">
                    The main content and details of your blog post.
                  </p>
                </div>

                <div className="space-y-6">
                  <FormField
                    label="Title"
                    error={getFieldError(validationErrors, "title")}
                    required
                  >
                    <input
                      type="text"
                      name="title"
                      id="title"
                      required
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-colors text-lg"
                      placeholder="Enter a compelling title..."
                    />
                  </FormField>

                  <FormField
                    label="Excerpt"
                    error={getFieldError(validationErrors, "excerpt")}
                    description="A brief summary of your post"
                    required
                  >
                    <textarea
                      name="excerpt"
                      id="excerpt"
                      rows={3}
                      required
                      value={formData.excerpt}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-colors resize-none"
                      placeholder="A brief summary of your post..."
                    />
                  </FormField>
                </div>
              </div>

              {/* Content Editor */}
              <div className="border border-neutral-200 rounded-lg bg-white p-8">
                <FormField
                  label="Article Content"
                  error={getFieldError(validationErrors, "content")}
                  description="Write the main content of your blog post"
                  required
                >
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
                    placeholder="Start writing your post..."
                  />
                </FormField>
              </div>
            </div>

            {/* Right Column - Settings & Metadata */}
            <div className="space-y-8">
              {/* Publication Settings */}
              <div className="border border-neutral-200 rounded-lg bg-white p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-neutral-900">Publication</h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    Settings and metadata for your post.
                  </p>
                </div>

                <div className="space-y-4">
                  <FormField
                    label="Publication Date"
                    error={getFieldError(validationErrors, "date")}
                    required
                  >
                    <input
                      type="date"
                      name="date"
                      id="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-colors"
                    />
                  </FormField>

                  <FormField
                    label="URL Slug"
                    error={getFieldError(validationErrors, "slug")}
                    description="Used in the post URL"
                    required
                  >
                    <input
                      type="text"
                      name="slug"
                      id="slug"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-colors"
                      placeholder="url-friendly-slug"
                    />
                  </FormField>

                  <FormField
                    label="Tags"
                    error={getFieldError(validationErrors, "tags")}
                    description="Separate tags with commas"
                  >
                    <input
                      type="text"
                      name="tags"
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                      placeholder="design, ui/ux, development"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-colors"
                    />
                  </FormField>
                </div>
              </div>

              {/* Featured Image */}
              <div className="border border-neutral-200 rounded-lg bg-white p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-neutral-900">Featured Image</h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    Upload or select the main image for your post.
                  </p>
                </div>

                <FormField
                  label="Cover Image"
                  error={getFieldError(validationErrors, "cover")}
                  required
                >
                  <ImageUpload
                    bucket="blog-images"
                    currentImage={formData.cover}
                    onUpload={(url) => setFormData((prev) => ({ ...prev, cover: url }))}
                    label=""
                  />
                </FormField>
              </div>

              {/* Actions */}
              <div className="border border-neutral-200/50 rounded-2xl bg-white shadow-sm p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-700 font-medium">Status</span>
                    <span className="flex items-center gap-1.5 text-green-600 font-medium">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      Ready to publish
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <span>{isEditing ? "Update Post" : "Publish Post"}</span>
                            <svg
                              className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    </button>

                    <Link
                      href="/admin/blogs"
                      className="w-full text-center px-4 py-2.5 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-all border border-neutral-300 rounded-xl hover:border-neutral-400 bg-white hover:bg-neutral-50 hover:shadow-sm"
                    >
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
