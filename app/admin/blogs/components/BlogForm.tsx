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

      let result;
      if (isEditing && blog?.id) {
        result = await supabase.from("blogs").update(blogData).eq("id", blog.id);
      } else {
        result = await supabase.from("blogs").insert([
          {
            ...blogData,
            created_at: new Date().toISOString(),
          },
        ]);
      }

      if (result.error) throw result.error;

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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                href="/admin/blogs"
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
                Blog Posts
              </Link>
              <div className="h-4 w-px bg-neutral-300" />
              <h1 className="text-lg font-medium text-neutral-900">
                {isEditing ? "Edit Post" : "New Post"}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 py-8">
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
              <div className="border border-neutral-200 rounded-lg bg-white p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-700">Status</span>
                    <span className="text-green-600 font-medium">Ready to publish</span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-black text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Saving..." : isEditing ? "Update Post" : "Publish Post"}
                    </button>

                    <Link
                      href="/admin/blogs"
                      className="w-full text-center px-4 py-2 text-sm font-medium text-neutral-700 hover:text-black transition-colors border border-neutral-300 rounded-lg hover:border-neutral-400"
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
