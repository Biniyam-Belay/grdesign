"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/client";
import type { Work } from "@/lib/types";
import ImageUpload from "@/components/ui/ImageUpload";

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
    featured_order: work?.featured_order || 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title]);

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
        link: null,
        featured_order: Number(formData.featured_order) || 0,
      };

      if (isEditing && work?.id) {
        // Update existing work
        const { error: updateError } = await supabase
          .from("works")
          .update(workData)
          .eq("id", work.id);

        if (updateError) {
          console.error("Update work failed:", updateError);
          throw updateError;
        }
      } else {
        // Create new work
        const { error: insertError } = await supabase.from("works").insert([workData]);

        if (insertError) {
          console.error("Insert work failed:", insertError);
          throw insertError;
        }
      }

      router.push("/admin/works");
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <svg
                className="w-6 h-6 text-white"
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
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {isEditing ? "Edit Featured Work" : "Add Featured Work"}
              </h1>
              <p className="text-neutral-600 mt-1">
                {isEditing ? "Update featured work details" : "Create a new featured work item"}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 animate-shake">
              <div className="flex items-start gap-3">
                <svg
                  className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0"
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
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
            <div className="p-8 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-neutral-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="Featured Work Title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-neutral-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="Brief description..."
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Featured Image *
                </label>
                <ImageUpload
                  bucket="works"
                  value={formData.image || ""}
                  onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                  label="Upload featured work image"
                />
              </div>

              {/* Aspect Ratio */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Aspect Ratio *
                </label>
                <select
                  name="aspect_ratio"
                  value={formData.aspect_ratio}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-neutral-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                >
                  <option value="square">Square (1:1)</option>
                  <option value="portrait45">Portrait (4:5)</option>
                  <option value="portrait916">Tall Portrait (9:16)</option>
                </select>
              </div>

              {/* Featured Order */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Display Order *
                </label>
                <input
                  type="number"
                  name="featured_order"
                  value={formData.featured_order}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-neutral-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="0"
                />
                <p className="text-xs text-neutral-500 mt-1">Lower numbers appear first</p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="bg-neutral-50 border-t border-neutral-200 px-8 py-6 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 text-neutral-700 hover:text-neutral-900 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
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
                      Saving...
                    </>
                  ) : (
                    <>
                      {isEditing ? "Update Work" : "Create Work"}
                      <svg
                        className="h-5 w-5 transition-transform group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
