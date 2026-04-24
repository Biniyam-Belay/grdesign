"use client";

import { useState } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ImageUpload from "@/components/ui/ImageUpload";
import BatchImageUpload from "@/components/ui/BatchImageUpload";
import { Project, ProjectType } from "@/lib/types";

interface ProjectFormProps {
  project?: Project;
  isEditing?: boolean;
}

export default function ProjectForm({ project, isEditing = false }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: project?.title || "",
    slug: project?.slug || "",
    excerpt: project?.excerpt || "",
    thumb: project?.thumb || "",
    video: project?.video || "",
    roles: project?.roles?.join(", ") || "",
    tools: project?.tools?.join(", ") || "",
    type: project?.type || "web-dev",
    featured: project?.featured || false,
    alt: project?.alt || "",
    credits: project?.credits || "",
    problem: project?.problem || "",
    solution: project?.solution || "",
    approach: project?.approach || "",
    outcome: project?.outcome || "",
    year: project?.year?.toString() || "",
    client: project?.client || "",
    mobileHeroSrc: project?.mobileHeroSrc || "",
    highlights: project?.highlights?.join("\n") || "",
    deliverables: project?.deliverables?.join("\n") || "",
    process: project?.process
      ? typeof project.process === "string"
        ? project.process
        : JSON.stringify(project.process, null, 2)
      : "",
  });

  const [gallery, setGallery] = useState<Array<{ src: string; alt: string }>>(
    project?.gallery || [],
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  const getRelevantFields = (type: string) => {
    switch (type) {
      case "branding":
        return {
          showHighlights: true,
          showDeliverables: true,
          showProcess: true,
          showApproach: true,
          showOutcome: true,
          caseStudyTitle: "Brand Strategy & Process",
          problemLabel: "Brand Challenge",
          solutionLabel: "Brand Solution & Strategy",
          approachLabel: "Design Process",
          outcomeLabel: "Brand Impact & Results",
        };
      case "social":
        return {
          showHighlights: true,
          showDeliverables: true,
          showProcess: true,
          showApproach: true,
          showOutcome: true,
          caseStudyTitle: "Content Strategy & Approach",
          problemLabel: "Content Challenge",
          solutionLabel: "Content Strategy & Solution",
          approachLabel: "Content Approach & Workflow",
          outcomeLabel: "Engagement & Results",
        };
      case "ui-ux":
        return {
          showHighlights: true,
          showDeliverables: true,
          showProcess: true,
          showApproach: true,
          showOutcome: true,
          caseStudyTitle: "UX Research & Design Process",
          problemLabel: "User Problem & Research Insights",
          solutionLabel: "Design Solution & User Experience",
          approachLabel: "Design Methodology & Testing",
          outcomeLabel: "Results & User Impact",
        };
      case "web-dev":
        return {
          showHighlights: true,
          showDeliverables: true,
          showProcess: false,
          showApproach: true,
          showOutcome: true,
          caseStudyTitle: "Technical Implementation & Performance",
          problemLabel: "Technical Challenge",
          solutionLabel: "Technical Solution & Architecture",
          approachLabel: "Development Approach & Stack",
          outcomeLabel: "Performance & Results",
        };
      case "print":
        return {
          showHighlights: true,
          showDeliverables: true,
          showProcess: true,
          showApproach: true,
          showOutcome: true,
          caseStudyTitle: "Design & Production Process",
          problemLabel: "Design Challenge",
          solutionLabel: "Design Solution & Production",
          approachLabel: "Design & Production Approach",
          outcomeLabel: "Event Success & Impact",
        };
      default:
        return {
          showHighlights: false,
          showDeliverables: false,
          showProcess: false,
          showApproach: false,
          showOutcome: false,
          caseStudyTitle: "Project Details",
          problemLabel: "Problem Statement",
          solutionLabel: "Solution",
          approachLabel: "Approach",
          outcomeLabel: "Outcome",
        };
    }
  };

  const relevantFields = getRelevantFields(formData.type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const rolesArray = formData.roles
        .split(",")
        .map((role) => role.trim())
        .filter((role) => role.length > 0);
      const toolsArray = formData.tools
        .split(",")
        .map((tool) => tool.trim())
        .filter((tool) => tool.length > 0);
      const highlightsArray = formData.highlights
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
      const deliverablesArray = formData.deliverables
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      let processArray: unknown = null;
      if (formData.process.trim()) {
        try {
          processArray = JSON.parse(formData.process);
        } catch {
          processArray = null;
        }
      }

      if (rolesArray.length === 0) {
        throw new Error("Please add at least one role (e.g., Frontend, UI Design)");
      }

      const slugCheckQuery = supabase
        .from("projects")
        .select("id")
        .eq("slug", formData.slug)
        .limit(1);
      const slugCheck =
        isEditing && project?.id
          ? await slugCheckQuery.neq("id", project.id)
          : await slugCheckQuery;
      if (slugCheck.error) throw slugCheck.error;
      if (slugCheck.data && slugCheck.data.length > 0) {
        throw new Error(
          "This slug is already used by another project. Please choose a different slug.",
        );
      }

      const projectData: Record<string, unknown> = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        thumb: formData.thumb,
        video: formData.video?.trim() ? formData.video : null,
        roles: rolesArray,
        tools: toolsArray.length > 0 ? toolsArray : null,
        type: formData.type,
        featured: formData.featured,
        alt: formData.alt?.trim() ? formData.alt : null,
        credits: formData.credits?.trim() ? formData.credits : null,
        problem: formData.problem?.trim() ? formData.problem : null,
        solution: formData.solution?.trim() ? formData.solution : null,
        approach: formData.approach?.trim() ? formData.approach : null,
        outcome: formData.outcome?.trim() ? formData.outcome : null,
        year: formData.year?.trim() ? formData.year : null,
        client: formData.client?.trim() ? formData.client : null,
        mobileHeroSrc: formData.mobileHeroSrc?.trim() ? formData.mobileHeroSrc : null,
        gallery: gallery.length > 0 ? gallery : null,
        highlights: highlightsArray.length > 0 ? highlightsArray : null,
        deliverables: deliverablesArray.length > 0 ? deliverablesArray : null,
      };
      projectData.process = processArray === null ? null : processArray;

      const action = isEditing && project?.id ? "update" : "create";
      const payload =
        isEditing && project?.id
          ? { action, id: project.id, data: projectData }
          : { action, data: projectData };

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("You are not signed in. Please log in again.");

      const { error } = await supabase.functions.invoke("projects", {
        body: payload,
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (error) throw error;

      await Promise.all([
        fetch("/api/revalidate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: "/work", type: "layout" }),
        }),
        fetch("/api/revalidate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: `/work/${formData.slug}`, type: "page" }),
        }),
      ]);

      router.push("/studio/projects");
    } catch (err) {
      const e = err as { message?: string; details?: string; hint?: string; code?: string };
      setError(e.message || e.details || e.hint || e.code || "Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white border border-[#0B132B]/10 px-4 py-3 text-sm text-[#0B132B] focus:outline-none focus:border-[#0055FF]/50 transition-colors";
  const labelClass =
    "block text-[10px] uppercase font-bold tracking-[0.15em] text-[#0B132B]/60 mb-2";
  const hintClass = "text-[10px] text-[#0B132B]/40 mt-1.5";

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
                href="/studio/projects"
                className="flex items-center gap-2 text-[#0B132B]/50 hover:text-[#FF0033] transition-all duration-300 group"
              >
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">← Archive</span>
              </Link>
              <div className="h-5 w-px bg-[#0B132B]/10" />
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-medium tracking-tight text-[#0B132B]">
                  {isEditing ? "Edit Project" : "New Project"}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative mx-auto max-w-8xl px-6 lg:px-12 py-8">
        {error && (
          <div className="mb-6 border border-[#FF0033]/20 bg-[#FF0033]/5 p-4">
            <p className="text-sm text-[#FF0033] font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Project Overview */}
              <div className="bg-white/50 backdrop-blur-sm border border-[#0B132B]/10 p-8 transition-all duration-500 hover:bg-white hover:border-[#0055FF]/30">
                <div className="mb-6">
                  <h2 className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B] flex items-center gap-3">
                    <span className="h-[1px] w-4 bg-[#0B132B]/20"></span> Project Overview
                  </h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="title" className={labelClass}>
                      Project Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      required
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className={inputClass}
                      placeholder="Enter project title..."
                    />
                  </div>

                  <div>
                    <label htmlFor="excerpt" className={labelClass}>
                      Project Description
                    </label>
                    <textarea
                      name="excerpt"
                      id="excerpt"
                      rows={4}
                      required
                      value={formData.excerpt}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                      }
                      className={`${inputClass} resize-none`}
                      placeholder="Brief description of the project..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="roles" className={labelClass}>
                        Roles & Technologies
                      </label>
                      <input
                        type="text"
                        name="roles"
                        id="roles"
                        value={formData.roles}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, roles: e.target.value }))
                        }
                        placeholder="Frontend Development, UI Design, React"
                        className={inputClass}
                      />
                      <p className={hintClass}>Separate with commas</p>
                    </div>
                    <div>
                      <label htmlFor="tools" className={labelClass}>
                        Tools Used
                      </label>
                      <input
                        type="text"
                        name="tools"
                        id="tools"
                        value={formData.tools}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, tools: e.target.value }))
                        }
                        placeholder="Figma, React, Next.js"
                        className={inputClass}
                      />
                      <p className={hintClass}>Separate with commas</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Media & Assets */}
              <div className="bg-white/50 backdrop-blur-sm border border-[#0B132B]/10 p-8 transition-all duration-500 hover:bg-white hover:border-[#0055FF]/30">
                <div className="mb-6">
                  <h2 className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B] flex items-center gap-3">
                    <span className="h-[1px] w-4 bg-[#0B132B]/20"></span> Media & Assets
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <ImageUpload
                      bucket="project-images"
                      currentImage={formData.thumb}
                      onUpload={(url) => setFormData((prev) => ({ ...prev, thumb: url }))}
                      label="Thumbnail Image"
                    />
                    <p className={hintClass}>Main project thumbnail for cards and listings</p>
                  </div>
                  <div>
                    <ImageUpload
                      bucket="project-images"
                      currentImage={formData.mobileHeroSrc}
                      onUpload={(url) => setFormData((prev) => ({ ...prev, mobileHeroSrc: url }))}
                      label="Mobile Hero (optional)"
                    />
                    <p className={hintClass}>Alternative hero image optimized for mobile</p>
                  </div>
                </div>

                {/* Video URL */}
                <div className="mt-6">
                  <label htmlFor="video" className={labelClass}>
                    Video URL (optional)
                  </label>
                  <input
                    type="url"
                    name="video"
                    id="video"
                    value={formData.video}
                    onChange={(e) => setFormData((prev) => ({ ...prev, video: e.target.value }))}
                    className={inputClass}
                    placeholder="https://example.com/video.mp4"
                  />
                </div>

                {/* Gallery Section */}
                <div className="mt-6 pt-6 border-t border-[#0B132B]/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/60">
                      Project Gallery
                    </h3>
                    {gallery.length > 0 && (
                      <span className="text-[9px] uppercase font-bold tracking-[0.15em] text-[#0B132B]/40 bg-[#0B132B]/5 px-2 py-1">
                        {gallery.length} {gallery.length === 1 ? "IMAGE" : "IMAGES"}
                      </span>
                    )}
                  </div>

                  {gallery.length > 0 && (
                    <div className="mb-4 max-h-[500px] overflow-y-auto border border-[#0B132B]/5 bg-[#0B132B]/[0.02] p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {gallery.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative group bg-white border border-[#0B132B]/10 overflow-hidden transition-all hover:border-[#0055FF]/30"
                          >
                            <div className="relative w-full aspect-square bg-[#0B132B]/5">
                              <Image
                                src={img.src}
                                alt={img.alt || `Gallery image ${idx + 1}`}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute top-2 left-2 w-6 h-6 bg-[#0B132B] text-white text-[9px] flex items-center justify-center font-bold">
                                {idx + 1}
                              </div>
                            </div>
                            <div className="p-3 space-y-2">
                              <input
                                type="text"
                                value={img.alt}
                                onChange={(e) => {
                                  const updated = [...gallery];
                                  updated[idx] = { ...updated[idx], alt: e.target.value };
                                  setGallery(updated);
                                }}
                                placeholder="Alt text"
                                className="w-full bg-white border border-[#0B132B]/10 px-3 py-2 text-xs focus:outline-none focus:border-[#0055FF]/50 transition-colors"
                              />
                              <button
                                type="button"
                                onClick={() => setGallery(gallery.filter((_, i) => i !== idx))}
                                className="absolute top-2 right-2 p-1.5 bg-[#FF0033] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                title="Remove image"
                              >
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border border-dashed border-[#0B132B]/15 p-5 bg-white/30 hover:border-[#0055FF]/30 transition-all">
                    <BatchImageUpload
                      bucket="project-images"
                      onChange={(uploads) => {
                        const newImages = uploads.map((upload) => ({
                          src: upload.url,
                          alt: upload.name,
                        }));
                        setGallery([...gallery, ...newImages]);
                      }}
                    />
                  </div>
                </div>

                {/* Additional Fields */}
                <div className="mt-6 pt-6 border-t border-[#0B132B]/10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="alt" className={labelClass}>
                      Default Alt Text
                    </label>
                    <input
                      type="text"
                      name="alt"
                      id="alt"
                      value={formData.alt}
                      onChange={(e) => setFormData((prev) => ({ ...prev, alt: e.target.value }))}
                      className={inputClass}
                      placeholder="General image description"
                    />
                    <p className={hintClass}>Fallback for accessibility</p>
                  </div>
                  <div>
                    <label htmlFor="credits" className={labelClass}>
                      Image Credits
                    </label>
                    <input
                      type="text"
                      name="credits"
                      id="credits"
                      value={formData.credits}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, credits: e.target.value }))
                      }
                      className={inputClass}
                      placeholder="Photo credits, attributions..."
                    />
                    <p className={hintClass}>Attribution for images</p>
                  </div>
                </div>
              </div>

              {/* Case Study Details */}
              <div className="bg-white/50 backdrop-blur-sm border border-[#0B132B]/10 p-8 transition-all duration-500 hover:bg-white hover:border-[#0055FF]/30">
                <div className="mb-6">
                  <h2 className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B] flex items-center gap-3">
                    <span className="h-[1px] w-4 bg-[#0B132B]/20"></span>{" "}
                    {relevantFields.caseStudyTitle}
                  </h2>
                  <p className="text-[10px] text-[#0B132B]/40 mt-2 ml-7">
                    Project-specific details based on type:{" "}
                    <span className="uppercase tracking-wider font-bold">{formData.type}</span>
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="problem" className={labelClass}>
                      {relevantFields.problemLabel}
                    </label>
                    <textarea
                      name="problem"
                      id="problem"
                      rows={4}
                      value={formData.problem}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, problem: e.target.value }))
                      }
                      className={`${inputClass} resize-none`}
                      placeholder={`What ${formData.type === "ui-ux" ? "user problem" : formData.type === "branding" ? "brand challenge" : "challenge"} did this project solve?`}
                    />
                  </div>

                  <div>
                    <label htmlFor="solution" className={labelClass}>
                      {relevantFields.solutionLabel}
                    </label>
                    <textarea
                      name="solution"
                      id="solution"
                      rows={4}
                      value={formData.solution}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, solution: e.target.value }))
                      }
                      className={`${inputClass} resize-none`}
                      placeholder={`How did you solve the ${formData.type === "ui-ux" ? "user experience" : "problem"}?`}
                    />
                  </div>

                  {relevantFields.showApproach && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="approach" className={labelClass}>
                          {relevantFields.approachLabel}
                        </label>
                        <textarea
                          name="approach"
                          id="approach"
                          rows={3}
                          value={formData.approach}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, approach: e.target.value }))
                          }
                          className={`${inputClass} resize-none`}
                          placeholder={`Your ${formData.type === "ui-ux" ? "design methodology" : formData.type === "web-dev" ? "development approach" : "methodology"}...`}
                        />
                      </div>
                      {relevantFields.showOutcome && (
                        <div>
                          <label htmlFor="outcome" className={labelClass}>
                            {relevantFields.outcomeLabel}
                          </label>
                          <textarea
                            name="outcome"
                            id="outcome"
                            rows={3}
                            value={formData.outcome}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, outcome: e.target.value }))
                            }
                            className={`${inputClass} resize-none`}
                            placeholder={`${formData.type === "ui-ux" ? "User impact and metrics" : formData.type === "web-dev" ? "Performance results" : "Results and impact"}...`}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {relevantFields.showHighlights && (
                    <div>
                      <label htmlFor="highlights" className={labelClass}>
                        Key Highlights
                      </label>
                      <textarea
                        name="highlights"
                        id="highlights"
                        rows={4}
                        value={formData.highlights}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, highlights: e.target.value }))
                        }
                        className={`${inputClass} resize-none`}
                        placeholder={`One highlight per line:\n${formData.type === "ui-ux" ? "40% faster task completion\nImproved accessibility score" : formData.type === "web-dev" ? "99+ Lighthouse performance score\nCustom GSAP animations" : "Premium color system\nVersatile logo variants"}`}
                      />
                      <p className={hintClass}>Enter each highlight on a new line</p>
                    </div>
                  )}

                  {relevantFields.showDeliverables && (
                    <div>
                      <label htmlFor="deliverables" className={labelClass}>
                        Project Deliverables
                      </label>
                      <textarea
                        name="deliverables"
                        id="deliverables"
                        rows={3}
                        value={formData.deliverables}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, deliverables: e.target.value }))
                        }
                        className={`${inputClass} resize-none`}
                        placeholder={`One deliverable per line:\n${formData.type === "ui-ux" ? "User research report\nWireframes and prototypes" : formData.type === "web-dev" ? "Responsive website\nSEO optimization" : "Logo system\nBrand guidelines"}`}
                      />
                      <p className={hintClass}>Enter each deliverable on a new line</p>
                    </div>
                  )}

                  {relevantFields.showProcess && (
                    <div>
                      <label htmlFor="process" className={labelClass}>
                        Process Steps (JSON Format)
                      </label>
                      <textarea
                        name="process"
                        id="process"
                        rows={6}
                        value={formData.process}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, process: e.target.value }))
                        }
                        className={`${inputClass} resize-none font-mono text-xs`}
                        placeholder={`[\n  {\n    "title": "Discovery",\n    "body": "Research and analysis phase..."\n  }\n]`}
                      />
                      <p className={hintClass}>
                        Enter process steps as JSON array with title and body fields
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Settings */}
            <div className="space-y-8">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Project Settings */}
                <div className="bg-white/50 backdrop-blur-sm border border-[#0B132B]/10 p-8 transition-all duration-500 hover:bg-white hover:border-[#0055FF]/30">
                  <div className="mb-6">
                    <h2 className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B] flex items-center gap-3">
                      <span className="h-[1px] w-4 bg-[#0B132B]/20"></span> Settings
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label htmlFor="slug" className={labelClass}>
                        URL Slug
                      </label>
                      <input
                        type="text"
                        name="slug"
                        id="slug"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                        className={inputClass}
                        placeholder="url-friendly-slug"
                      />
                      <p className={hintClass}>Used in the project URL</p>
                    </div>

                    <div>
                      <label htmlFor="type" className={labelClass}>
                        Project Type
                      </label>
                      <select
                        name="type"
                        id="type"
                        value={formData.type}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, type: e.target.value as ProjectType }))
                        }
                        className={`${inputClass} appearance-none`}
                      >
                        <option value="web-dev">Web Development</option>
                        <option value="ui-ux">UI/UX Design</option>
                        <option value="branding">Branding</option>
                        <option value="social">Social Media</option>
                        <option value="print">Print Design</option>
                      </select>
                      <p className={hintClass}>This affects which fields are shown</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="year" className={labelClass}>
                          Year
                        </label>
                        <input
                          type="text"
                          name="year"
                          id="year"
                          value={formData.year}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, year: e.target.value }))
                          }
                          className={inputClass}
                          placeholder="2024"
                        />
                      </div>
                      <div>
                        <label htmlFor="client" className={labelClass}>
                          Client
                        </label>
                        <input
                          type="text"
                          name="client"
                          id="client"
                          value={formData.client}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, client: e.target.value }))
                          }
                          className={inputClass}
                          placeholder="Client name"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2 border-t border-[#0B132B]/5">
                      <input
                        id="featured"
                        name="featured"
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, featured: e.target.checked }))
                        }
                        className="h-4 w-4 accent-[#0B132B] border-[#0B132B]/20"
                      />
                      <label
                        htmlFor="featured"
                        className="text-[10px] uppercase font-bold tracking-[0.15em] text-[#0B132B]/60"
                      >
                        Show on Homepage
                      </label>
                    </div>
                    <p className={hintClass}>
                      Display this project in the &ldquo;Selected Work&rdquo; section on the
                      homepage (max 6 projects recommended)
                    </p>
                  </div>
                </div>

                {/* Info Panel */}
                <div className="bg-[#0055FF]/5 border border-[#0055FF]/10 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0055FF]/70">
                      {relevantFields.caseStudyTitle}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#0B132B]/50 leading-relaxed">
                    Fill out the case study fields on the left to create a rich project detail page.
                    Fields adjust based on project type.
                  </p>
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
                        {loading ? "SAVING..." : isEditing ? "UPDATE PROJECT" : "CREATE PROJECT"}
                      </button>

                      <Link
                        href="/studio/projects"
                        className="text-center bg-white hover:bg-[#0B132B]/5 border border-[#0B132B]/10 px-8 py-4 text-[10px] uppercase font-bold tracking-[0.25em] transition-all duration-300 w-full text-[#0B132B]/70 hover:border-[#0B132B]/30"
                      >
                        CANCEL
                      </Link>
                    </div>
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
