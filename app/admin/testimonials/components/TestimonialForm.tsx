"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/ui/ImageUpload";
import Link from "next/link";
import { Testimonial } from "@/lib/types";
import { Star, ChevronLeft } from "lucide-react";

interface TestimonialFormProps {
  testimonial?: Testimonial;
  isEditing?: boolean;
}

// Custom Star Rating Component
const StarRating = ({
  rating,
  setRating,
}: {
  rating: number;
  setRating: (rating: number) => void;
}) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className={`transition-transform duration-200 ease-in-out hover:scale-125 ${
            star <= rating ? "text-amber-400" : "text-neutral-300"
          }`}
        >
          <Star className="w-6 h-6" fill="currentColor" />
        </button>
      ))}
    </div>
  );
};

const inputClasses =
  "block w-full px-4 py-2 text-neutral-800 bg-white border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 ease-in-out hover:border-neutral-400";

export default function TestimonialForm({ testimonial, isEditing = false }: TestimonialFormProps) {
  const router = useRouter();
  const supabase = createSupabaseClient();

  const [formData, setFormData] = useState({
    name: testimonial?.name || "",
    role: testimonial?.role || "",
    company: testimonial?.company || "",
    image: testimonial?.image || "",
    content: testimonial?.content || "",
    result: testimonial?.result || "",
    project: testimonial?.project || "",
    rating: testimonial?.rating || 5,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (newRating: number) => {
    setFormData((prev) => ({ ...prev, rating: newRating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const testimonialData = { ...formData };

      if (isEditing && testimonial?.id) {
        const { error: updateError } = await supabase
          .from("testimonials")
          .update(testimonialData)
          .eq("id", testimonial.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("testimonials")
          .insert([testimonialData]);
        if (insertError) throw insertError;
      }

      router.push("/admin/testimonials");
      router.refresh();
    } catch (err) {
      setError((err as Error).message || "Failed to save testimonial.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-neutral-200/50 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <Link
              href="/admin/testimonials"
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="font-medium text-sm">Back to Testimonials</span>
            </Link>
            <h1 className="text-lg font-semibold text-neutral-900">
              {isEditing ? "Edit Testimonial" : "Create New Testimonial"}
            </h1>
          </div>
        </div>
      </header>

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-lg border border-neutral-200/80"
          >
            {error && (
              <div className="mb-6 bg-red-100 border border-red-200 p-4 rounded-lg text-red-800 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column for Image and Rating */}
              <div className="lg:col-span-1 flex flex-col items-center lg:items-start gap-6">
                <ImageUpload
                  bucket="testimonials"
                  value={formData.image}
                  onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                  label="Author Image"
                />
                <div className="w-full">
                  <label className="block text-sm font-medium text-neutral-700 mb-2 text-center lg:text-left">
                    Rating
                  </label>
                  <StarRating rating={formData.rating} setRating={handleRatingChange} />
                </div>
              </div>

              {/* Right Column for Text Fields */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Role</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Testimonial Content
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    rows={5}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Result Highlight
                  </label>
                  <input
                    type="text"
                    name="result"
                    value={formData.result}
                    onChange={handleChange}
                    placeholder="e.g., +200% Engagement"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Project</label>
                  <input
                    type="text"
                    name="project"
                    value={formData.project}
                    onChange={handleChange}
                    placeholder="e.g., Brand Identity Design"
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-8 mt-8 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-all"
              >
                {loading ? "Saving..." : isEditing ? "Save Changes" : "Create Testimonial"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
