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

      await Promise.all([
        fetch("/api/revalidate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: "/blog", type: "layout" }),
        }),
        fetch("/api/revalidate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: `/blog/${formData.slug}`, type: "page" }),
        }),
      ]);

      setSuccess(isEditing ? "Blog updated successfully!" : "Blog created successfully!");

      setTimeout(() => {
        router.push("/studio/blogs");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#0B132B] font-sans selection:bg-[#FF0033]/20 pb-20">
      <div className="absolute top-1/4 -left-20 w-[50vh] h-[50vh] bg-[#0055FF]/5 rounded-full blur-[100px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[50vh] h-[50vh] bg-[#FF0033]/5 rounded-full blur-[100px] animate-pulse delay-1000 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#F5F5F0]/80 backdrop-blur-xl border-b border-[#0B132B]/10">
        <div className="mx-auto max-w-8xl px-6 lg:px-12">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/studio/blogs"
                className="flex items-center gap-2 text-[#0B132B]/50 hover:text-[#FF0033] transition-all duration-300 group"
              >
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">← Archive</span>
              </Link>
              <div className="h-5 w-px bg-[#0B132B]/10" />
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-medium tracking-tight text-[#0B132B]">
                  {isEditing ? "Edit Post" : "Composer"}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative mx-auto max-w-8xl px-6 lg:px-12 py-8">
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
              <div className="bg-white/50 backdrop-blur-sm border border-[#0B132B]/10 p-8 transition-all duration-500 hover:bg-white hover:border-[#0055FF]/30">
                <div className="mb-6">
                  <h2 className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B] flex items-center gap-3">
                    <span className="h-[1px] w-4 bg-[#0B132B]/20"></span> Metadata
                  </h2>
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
                      className="w-full px-3 py-2 border border-[#0B132B]/20 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-colors text-lg"
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
                      className="w-full px-3 py-2 border border-[#0B132B]/20 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-colors resize-none"
                      placeholder="A brief summary of your post..."
                    />
                  </FormField>
                </div>
              </div>

              {/* Enhanced Content Editor */}
              <div className="bg-white/50 backdrop-blur-sm border border-[#0B132B]/10 transition-all duration-500 hover:bg-white hover:border-[#0055FF]/30">
                {/* Editor Header */}
                <div className="border-b border-[#0B132B]/5 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 bg-[#0055FF]/5 flex items-center justify-center text-[#0B132B]">
                          <svg
                            className="h-3 w-3 text-[#0B132B]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B]">
                          Writer
                        </h3>
                      </div>
                      <div className="h-4 w-px bg-[#0B132B]/10" />
                      <div className="flex items-center gap-1 text-sm text-[#0B132B]/60">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>Rich text editor with real-time preview</span>
                      </div>
                    </div>

                    {/* Word Count & Stats */}
                    <div className="flex items-center gap-4 text-sm text-[#0B132B]/60">
                      <div className="flex items-center gap-1">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span>
                          {formData.content.split(/\s+/).filter((word) => word.length > 0).length}{" "}
                          words
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>
                          {Math.ceil(
                            formData.content.split(/\s+/).filter((word) => word.length > 0).length /
                              200,
                          )}{" "}
                          min read
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Rich Text Editor */}
                <div className="p-6">
                  <FormField
                    label="Content"
                    error={getFieldError(validationErrors, "content")}
                    description="Write the main content of your blog post with full formatting options"
                    required
                  >
                    <RichTextEditor
                      content={formData.content}
                      onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
                      placeholder="Start writing your masterpiece..."
                      features={{
                        // Enhanced toolbar features
                        toolbar: {
                          headings: true,
                          bold: true,
                          italic: true,
                          underline: true,
                          strikethrough: true,
                          code: true,
                          blockquote: true,
                          codeBlock: true,
                          alignLeft: true,
                          alignCenter: true,
                          alignRight: true,
                          bulletList: true,
                          orderedList: true,
                          link: true,
                          image: true,
                          youtube: true,
                          table: true,
                          horizontalRule: true,
                          undo: true,
                          redo: true,
                        },
                        // Advanced features
                        advanced: {
                          wordCount: true,
                          readTime: true,
                          autoSave: true,
                          focusMode: true,
                          spellCheck: true,
                          emojiPicker: true,
                          markdownShortcuts: true,
                          tableOfContents: true,
                        },
                        // Layout options
                        layout: {
                          fullscreen: true,
                          dualPane: true,
                          distractionFree: true,
                        },
                      }}
                    />
                  </FormField>

                  {/* Quick Actions Bar */}
                  <div className="mt-6 pt-6 border-t border-[#0B132B]/10">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4 text-[#0B132B]/60">
                        <div className="flex items-center gap-2">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                            />
                          </svg>
                          <span>AI Assistant Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                          <span>Auto-save Enabled</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#0B132B]/60 hover:text-[#0B132B] hover:bg-white/50 border border-[#0B132B]/10 rounded-lg transition-colors"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          Schedule
                        </button>
                        <button
                          type="button"
                          className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#0B132B]/60 hover:text-[#0B132B] hover:bg-white/50 border border-[#0B132B]/10 rounded-lg transition-colors"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.452-7z"
                            />
                          </svg>
                          Preview
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Settings & Metadata */}
            <div className="space-y-8">
              {/* Publication Settings */}
              <div className="bg-white/50 backdrop-blur-sm border border-[#0B132B]/10 p-8 transition-all duration-500 hover:bg-white hover:border-[#0055FF]/30">
                <div className="mb-6">
                  <h2 className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B] flex items-center gap-3">
                    <span className="h-[1px] w-4 bg-[#0B132B]/20"></span> Settings
                  </h2>
                </div>

                <div className="space-y-6">
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
                      className="w-full bg-white border border-[#0B132B]/10 px-4 py-3 text-sm text-[#0B132B] focus:outline-none focus:border-[#0055FF]/50 transition-colors"
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
                      className="w-full bg-white border border-[#0B132B]/10 px-4 py-3 text-sm text-[#0B132B] focus:outline-none focus:border-[#0055FF]/50 transition-colors"
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
                      className="w-full bg-white border border-[#0B132B]/10 px-4 py-3 text-sm text-[#0B132B] focus:outline-none focus:border-[#0055FF]/50 transition-colors"
                    />
                  </FormField>
                </div>
              </div>

              {/* Featured Image */}
              <div className="bg-white/50 backdrop-blur-sm border border-[#0B132B]/10 p-8 transition-all duration-500 hover:bg-white hover:border-[#0055FF]/30">
                <div className="mb-6">
                  <h2 className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B] flex items-center gap-3">
                    <span className="h-[1px] w-4 bg-[#0B132B]/20"></span> Cover Image
                  </h2>
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

              <div className="bg-white/50 backdrop-blur-sm border border-[#0B132B]/10 p-8 transition-all duration-500 hover:bg-white hover:border-[#0B132B]/50">
                <div className="space-y-4">
                  <div className="flex flex-col gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#0B132B] hover:bg-[#FF0033] text-white px-8 py-4 text-[10px] uppercase font-bold tracking-[0.25em] transition-all duration-300 w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? "SAVING..." : isEditing ? "UPDATE ENTRY" : "PUBLISH ENTRY"}
                    </button>

                    <Link
                      href="/studio/blogs"
                      className="text-center bg-white hover:bg-[#0B132B]/5 border border-[#0B132B]/10 px-8 py-4 text-[10px] uppercase font-bold tracking-[0.25em] transition-all duration-300 w-full text-[#0B132B]/70 hover:border-[#0B132B]/30"
                    >
                      CANCEL
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
