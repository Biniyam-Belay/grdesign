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
      router.refresh(); // to reflect changes
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-neutral-200/50 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/works"
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
                <span className="font-medium text-sm">Back to Works</span>
              </Link>
              <div className="h-6 w-px bg-neutral-300" />
              <h1 className="text-lg font-semibold text-neutral-900">
                {isEditing ? "Edit Work" : "Add New Work"}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border-neutral-300 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border-neutral-300 bg-neutral-100 focus:border-purple-500 focus:ring-purple-500/20"
                    readOnly={isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-xl border-neutral-300 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">
                    Featured Image *
                  </label>
                  <ImageUpload
                    bucket="works"
                    value={formData.image || ""}
                    onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                      Aspect Ratio *
                    </label>
                    <select
                      name="aspect_ratio"
                      value={formData.aspect_ratio}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border-neutral-300 focus:border-purple-500 focus:ring-purple-500/20"
                    >
                      <option value="square">Square (1:1)</option>
                      <option value="portrait45">Portrait (4:5)</option>
                      <option value="portrait916">Tall Portrait (9:16)</option>
                    </select>
                  </div>
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
                      className="w-full rounded-xl border-neutral-300 focus:border-purple-500 focus:ring-purple-500/20"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-neutral-50 border-t border-neutral-200 px-8 py-6 flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 text-neutral-700 hover:text-neutral-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {loading ? "Saving..." : isEditing ? "Update Work" : "Create Work"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
