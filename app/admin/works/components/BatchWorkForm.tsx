"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/client";
import BatchImageUpload from "@/components/ui/BatchImageUpload";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";
import Link from "next/link";
import Image from "next/image";

interface UploadedWork {
  url: string;
  title: string;
  slug: string;
  description: string;
  aspect_ratio: "square" | "portrait45" | "portrait916";
  featured_order: number;
}

export default function BatchWorkForm() {
  const router = useRouter();
  const supabase = createSupabaseClient();

  const [newWorks, setNewWorks] = useState<UploadedWork[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUploadChange = (uploads: { url: string; name: string }[]) => {
    const worksToCreate: UploadedWork[] = uploads.map((upload, index) => ({
      url: upload.url,
      title: upload.name,
      slug: upload.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      description: "",
      aspect_ratio: "square",
      featured_order: newWorks.length + index,
    }));
    setNewWorks((prev) => [...prev, ...worksToCreate]);
  };

  const handleSelectFromLibrary = (urls: string | string[]) => {
    if (!Array.isArray(urls)) return; // Ensure we have an array for multi-select

    const worksToCreate: UploadedWork[] = urls.map((url, index) => {
      const name =
        url
          .split("/")
          .pop()
          ?.replace(/\.[^/.]+$/, "") || `work-${Date.now()}`;
      return {
        url: url,
        title: name,
        slug: name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
        description: "",
        aspect_ratio: "square",
        featured_order: newWorks.length + index,
      };
    });
    setNewWorks((prev) => [...prev, ...worksToCreate]);
    setIsModalOpen(false);
  };

  const handleWorkChange = (index: number, field: keyof UploadedWork, value: string | number) => {
    const updatedWorks = [...newWorks];
    const workToUpdate = { ...updatedWorks[index], [field]: value };

    if (field === "title" && typeof value === "string") {
      workToUpdate.slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    updatedWorks[index] = workToUpdate;
    setNewWorks(updatedWorks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newWorks.length === 0) {
      setError("Please upload or select at least one image.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("You are not signed in. Please log in again.");

      const worksToInsert = newWorks.map((work) => ({
        title: work.title,
        slug: work.slug,
        description: work.description || null,
        image: work.url,
        aspect_ratio: work.aspect_ratio || "square",
        featured_order: Number(work.featured_order) || 0,
      }));

      const { error: insertError } = await supabase.from("works").insert(worksToInsert);
      if (insertError) throw insertError;

      router.push("/admin/works");
      router.refresh();
    } catch (err) {
      console.error("Work save error:", err);
      const e = err as { message?: string; details?: string; hint?: string; code?: string };
      const msg = e.message || e.details || e.hint || e.code || "Failed to save works";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
                <h1 className="text-lg font-semibold text-neutral-900">Add Works in Batch</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 p-8">
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">1. Add Images</h2>
                <p className="text-sm text-neutral-600 mb-4">
                  Upload new images or select existing ones from your library.
                </p>
                <div className="p-6 border border-neutral-200 rounded-xl">
                  <h3 className="text-base font-semibold text-neutral-800 mb-3">
                    Upload New Images
                  </h3>
                  <BatchImageUpload bucket="works" onChange={handleUploadChange} />
                </div>
                <div className="text-center my-4">
                  <span className="text-sm font-semibold text-neutral-500">OR</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-3 px-4 text-center font-semibold text-purple-700 bg-purple-100 rounded-xl hover:bg-purple-200 transition-colors"
                >
                  Select from Library
                </button>
              </div>

              {newWorks.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 p-8">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-6">2. Edit Details</h2>
                  <div className="space-y-8">
                    {newWorks.map((work, index) => (
                      <div
                        key={work.url}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-neutral-200 pt-6 first:border-t-0 first:pt-0"
                      >
                        <div className="md:col-span-1">
                          <Image
                            src={work.url}
                            alt={work.title}
                            width={200}
                            height={200}
                            className="rounded-lg object-cover w-full aspect-square"
                            unoptimized
                          />
                        </div>
                        <div className="md:col-span-2 space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-neutral-900 mb-2">
                              Title
                            </label>
                            <input
                              type="text"
                              value={work.title}
                              onChange={(e) => handleWorkChange(index, "title", e.target.value)}
                              required
                              className="w-full rounded-xl border-neutral-300 focus:border-purple-500 focus:ring-purple-500/20"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-neutral-900 mb-2">
                              Description
                            </label>
                            <textarea
                              value={work.description}
                              onChange={(e) =>
                                handleWorkChange(index, "description", e.target.value)
                              }
                              rows={2}
                              className="w-full rounded-xl border-neutral-300 focus:border-purple-500 focus:ring-purple-500/20"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-neutral-900 mb-2">
                                Aspect Ratio
                              </label>
                              <select
                                value={work.aspect_ratio}
                                onChange={(e) =>
                                  handleWorkChange(index, "aspect_ratio", e.target.value)
                                }
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
                                Display Order
                              </label>
                              <input
                                type="number"
                                value={work.featured_order}
                                onChange={(e) =>
                                  handleWorkChange(index, "featured_order", e.target.value)
                                }
                                required
                                className="w-full rounded-xl border-neutral-300 focus:border-purple-500 focus:ring-purple-500/20"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 text-neutral-700 hover:text-neutral-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || newWorks.length === 0}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : `Save ${newWorks.length} Works`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <MediaLibraryModal
        bucket="works"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelectFromLibrary}
        multiple={true}
      />
    </>
  );
}
