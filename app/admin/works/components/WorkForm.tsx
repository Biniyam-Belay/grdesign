"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/client";
import type { Work } from "@/lib/types";
import ImageUpload from "@/components/ui/ImageUpload";
import Link from "next/link";

interface WorkFormProps {
  work?: Work;
  isEditing?: boolean;
}

export default function WorkForm({ work, isEditing = false }: WorkFormProps) {
  const router = useRouter();
  const supabase = createSupabaseClient();

  const [formData, setFormData] = useState<Partial<Work>>({
    title: work?.title || "",
    slug: work?.slug || "",
    description: work?.description || "",
    image: work?.image || "",
    aspect_ratio: work?.aspect_ratio || "square",
    category: work?.category || "",
    featured_order: work?.featured_order || 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEditing && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title, isEditing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("You are not signed in. Please log in again.");
      }

      const workData = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description || null,
        image: formData.image,
        aspect_ratio: formData.aspect_ratio || "square",
        category: formData.category || null,
        link: null,
        featured_order: Number(formData.featured_order) || 0,
      };

      if (isEditing && work?.id) {
        const { error: updateError } = await supabase
          .from("works")
          .update(workData)
          .eq("id", work.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from("works").insert([workData]);
        if (insertError) throw insertError;
      }

      router.push("/admin/works");
      router.refresh();
    } catch (err) {
      console.error("Work save error:", err);
      const e = err as { message?: string; details?: string; hint?: string; code?: string };
      const msg = e.message || e.details || e.hint || e.code || "Failed to save work";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-neutral-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/works"
                className="inline-flex items-center text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Works
              </Link>
              <div className="text-lg font-semibold text-neutral-900">
                {isEditing ? "Edit Work" : "New Work"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                    placeholder="Enter work title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Slug *</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-neutral-50 focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                    readOnly={isEditing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                    placeholder="Brief description of the work"
                  />
                </div>
              </div>
            </div>

            {/* Media & Categorization */}
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                Media & Categorization
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                    placeholder="e.g., UI/UX, Web Design, Branding"
                    list="category-suggestions"
                  />
                  <datalist id="category-suggestions">
                    <option value="UI/UX" />
                    <option value="Web Design" />
                    <option value="Web Development" />
                    <option value="Social Media Design" />
                    <option value="Branding" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Featured Image *
                  </label>
                  <ImageUpload
                    bucket="works"
                    value={formData.image || ""}
                    onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Aspect Ratio *
                  </label>
                  <select
                    name="aspect_ratio"
                    value={formData.aspect_ratio}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                  >
                    <option value="square">Square (1:1)</option>
                    <option value="portrait45">Portrait (4:5)</option>
                    <option value="portrait916">Tall Portrait (9:16)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Display Settings */}
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Display Settings</h2>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Display Order *
                </label>
                <input
                  type="number"
                  name="featured_order"
                  value={formData.featured_order}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-neutral-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Saving..." : isEditing ? "Update Work" : "Create Work"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
