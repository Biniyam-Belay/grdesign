"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/ui/ImageUpload";
import Link from "next/link";
import { Testimonial } from "@/lib/types";
import { Star } from "lucide-react";

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
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className={`transition-all duration-200 ease-in-out hover:scale-110 ${
            star <= rating ? "text-[#0B132B]" : "text-[#0B132B]/15"
          }`}
        >
          <Star className="w-5 h-5" fill="currentColor" />
        </button>
      ))}
    </div>
  );
};

const inputClass =
  "w-full bg-white border border-[#0B132B]/10 px-4 py-3 text-sm text-[#0B132B] focus:outline-none focus:border-[#0055FF]/50 transition-colors";
const labelClass = "block text-[10px] uppercase font-bold tracking-[0.15em] text-[#0B132B]/60 mb-2";

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
    <div className="min-h-screen bg-[#F5F5F0] text-[#0B132B] font-sans selection:bg-[#FF0033]/20 pb-20">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-[50vh] h-[50vh] bg-[#0055FF]/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-[50vh] h-[50vh] bg-[#FF0033]/5 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#F5F5F0]/80 backdrop-blur-xl border-b border-[#0B132B]/10">
        <div className="mx-auto max-w-8xl px-6 lg:px-12">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/testimonials"
                className="flex items-center gap-2 text-[#0B132B]/50 hover:text-[#FF0033] transition-all duration-300 group"
              >
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                  ← Testimonials
                </span>
              </Link>
              <div className="h-5 w-px bg-[#0B132B]/10" />
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-medium tracking-tight text-[#0B132B]">
                  {isEditing ? "Edit Testimonial" : "New Testimonial"}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative mx-auto max-w-8xl px-6 lg:px-12 py-8">
        <div className="max-w-4xl">
          {error && (
            <div className="mb-6 border border-[#FF0033]/20 bg-[#FF0033]/5 p-4">
              <p className="text-sm text-[#FF0033] font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Image & Rating */}
              <div className="space-y-6">
                <div className="bg-white/50 backdrop-blur-sm border border-[#0B132B]/10 p-8 transition-all duration-500 hover:bg-white hover:border-[#0055FF]/30">
                  <div className="mb-6">
                    <h2 className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B] flex items-center gap-3">
                      <span className="h-[1px] w-4 bg-[#0B132B]/20"></span> Author
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <ImageUpload
                      bucket="testimonials"
                      value={formData.image}
                      onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                      label="Author Image"
                    />

                    <div>
                      <label className={labelClass}>Rating</label>
                      <StarRating rating={formData.rating} setRating={handleRatingChange} />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white/50 backdrop-blur-sm border border-[#0B132B]/10 p-8 transition-all duration-500 hover:bg-white hover:border-[#0B132B]/50">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#0B132B] hover:bg-[#FF0033] text-white px-8 py-4 text-[10px] uppercase font-bold tracking-[0.25em] transition-all duration-300 w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? "SAVING..." : isEditing ? "SAVE CHANGES" : "CREATE TESTIMONIAL"}
                      </button>

                      <Link
                        href="/admin/testimonials"
                        className="text-center bg-white hover:bg-[#0B132B]/5 border border-[#0B132B]/10 px-8 py-4 text-[10px] uppercase font-bold tracking-[0.25em] transition-all duration-300 w-full text-[#0B132B]/70 hover:border-[#0B132B]/30"
                      >
                        CANCEL
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Text Fields */}
              <div className="lg:col-span-2 space-y-8">
                {/* Identity */}
                <div className="bg-white/50 backdrop-blur-sm border border-[#0B132B]/10 p-8 transition-all duration-500 hover:bg-white hover:border-[#0055FF]/30">
                  <div className="mb-6">
                    <h2 className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B] flex items-center gap-3">
                      <span className="h-[1px] w-4 bg-[#0B132B]/20"></span> Details
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className={labelClass}>Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={inputClass}
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className={labelClass}>Role</label>
                        <input
                          type="text"
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="CEO, Designer..."
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Company</label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="Company name"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="bg-white/50 backdrop-blur-sm border border-[#0B132B]/10 p-8 transition-all duration-500 hover:bg-white hover:border-[#0055FF]/30">
                  <div className="mb-6">
                    <h2 className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B] flex items-center gap-3">
                      <span className="h-[1px] w-4 bg-[#0B132B]/20"></span> Testimonial
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className={labelClass}>Testimonial Content</label>
                      <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                        rows={5}
                        className={`${inputClass} resize-none`}
                        placeholder="What the client said about your work..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className={labelClass}>Result Highlight</label>
                        <input
                          type="text"
                          name="result"
                          value={formData.result}
                          onChange={handleChange}
                          placeholder="e.g., +200% Engagement"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Project</label>
                        <input
                          type="text"
                          name="project"
                          value={formData.project}
                          onChange={handleChange}
                          placeholder="e.g., Brand Identity Design"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
