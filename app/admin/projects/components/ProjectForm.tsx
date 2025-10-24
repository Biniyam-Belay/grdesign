"use client";

import { useState } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/components/ui/ImageUpload";
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
    // New fields for different project types
    highlights: project?.highlights?.join("\n") || "",
    deliverables: project?.deliverables?.join("\n") || "",
    process: project?.process
      ? typeof project.process === "string"
        ? project.process
        : JSON.stringify(project.process, null, 2)
      : "",
  });

  // Separate state for gallery images (array of { src, alt })
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

  // Get fields relevant to current project type
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

      // Parse highlights and deliverables arrays
      const highlightsArray = formData.highlights
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      const deliverablesArray = formData.deliverables
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      // Parse process array if provided: must be valid JSON or null
      let processArray: unknown = null;
      if (formData.process.trim()) {
        try {
          const parsed = JSON.parse(formData.process);
          processArray = parsed;
        } catch {
          // If JSON parsing fails, do not send an invalid value
          processArray = null;
        }
      }

      // Basic validation before hitting the DB
      if (rolesArray.length === 0) {
        throw new Error("Please add at least one role (e.g., Frontend, UI Design)");
      }

      // Ensure slug is unique (excluding the current project when editing)
      const slugCheckQuery = supabase
        .from("projects")
        .select("id")
        .eq("slug", formData.slug)
        .limit(1);
      const slugCheck =
        isEditing && project?.id
          ? await slugCheckQuery.neq("id", project.id)
          : await slugCheckQuery;
      if (slugCheck.error) {
        throw slugCheck.error;
      }
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
        // Add new fields based on project type
        highlights: highlightsArray.length > 0 ? highlightsArray : null,
        deliverables: deliverablesArray.length > 0 ? deliverablesArray : null,
      };

      // Only include process if it's valid JSON (object/array) or explicitly null
      projectData.process = processArray === null ? null : processArray;

      // Debug logging
      console.log("Submitting project with gallery:", gallery);
      console.log("Full project data:", projectData);

      const action = isEditing && project?.id ? "update" : "create";
      const payload =
        isEditing && project?.id
          ? { action, id: project.id, data: projectData }
          : { action, data: projectData };

      // Get session for auth
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("You are not signed in. Please log in again.");
      }

      const { error } = await supabase.functions.invoke("projects", {
        body: payload,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (error) {
        console.error("Update/Insert project failed:", error, projectData);
        throw error;
      }

      // Revalidate project paths to clear Next.js cache
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

      router.push("/admin/projects");
    } catch (err) {
      console.error("Project save error:", err);
      const e = err as { message?: string; details?: string; hint?: string; code?: string };
      const msg = e.message || e.details || e.hint || e.code || "Failed to save project";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-pink-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-neutral-200/50 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/projects"
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
                <span className="font-medium text-sm">Back to Projects</span>
              </Link>
              <div className="h-6 w-px bg-neutral-300" />
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
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
                  {isEditing ? "Edit Project" : "Create New Project"}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 animate-shake">
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
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Project Information */}
              <div className="border border-neutral-200/50 rounded-2xl bg-white shadow-sm p-8">
                <div className="mb-6 flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-900">Project Overview</h2>
                    <p className="text-sm text-neutral-600 mt-1">
                      Core information about your project
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-neutral-700 mb-2"
                    >
                      Project Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      required
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-colors text-lg"
                      placeholder="Enter project title..."
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="excerpt"
                      className="block text-sm font-medium text-neutral-700 mb-2"
                    >
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
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-colors resize-none"
                      placeholder="Brief description of the project..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="roles"
                        className="block text-sm font-medium text-neutral-700 mb-2"
                      >
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
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-colors"
                      />
                      <p className="text-xs text-neutral-500 mt-1">Separate with commas</p>
                    </div>

                    <div>
                      <label
                        htmlFor="tools"
                        className="block text-sm font-medium text-neutral-700 mb-2"
                      >
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
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-colors"
                      />
                      <p className="text-xs text-neutral-500 mt-1">Separate with commas</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Case Study Details */}
              <div className="border border-neutral-200 rounded-lg bg-white p-8">
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-neutral-900">
                    {relevantFields.caseStudyTitle}
                  </h2>
                  <p className="text-sm text-neutral-600 mt-1">
                    Project-specific details based on type: {formData.type}
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="problem"
                      className="block text-sm font-medium text-neutral-700 mb-2"
                    >
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
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-colors resize-none"
                      placeholder={`What ${formData.type === "ui-ux" ? "user problem" : formData.type === "branding" ? "brand challenge" : "challenge"} did this project solve?`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="solution"
                      className="block text-sm font-medium text-neutral-700 mb-2"
                    >
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
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-colors resize-none"
                      placeholder={`How did you solve the ${formData.type === "ui-ux" ? "user experience" : "problem"}?`}
                    />
                  </div>

                  {relevantFields.showApproach && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="approach"
                          className="block text-sm font-medium text-neutral-700 mb-2"
                        >
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
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-colors resize-none"
                          placeholder={`Your ${formData.type === "ui-ux" ? "design methodology" : formData.type === "web-dev" ? "development approach" : "methodology"}...`}
                        />
                      </div>

                      {relevantFields.showOutcome && (
                        <div>
                          <label
                            htmlFor="outcome"
                            className="block text-sm font-medium text-neutral-700 mb-2"
                          >
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
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-colors resize-none"
                            placeholder={`${formData.type === "ui-ux" ? "User impact and metrics" : formData.type === "web-dev" ? "Performance results" : "Results and impact"}...`}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {relevantFields.showHighlights && (
                    <div>
                      <label
                        htmlFor="highlights"
                        className="block text-sm font-medium text-neutral-700 mb-2"
                      >
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
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-colors resize-none"
                        placeholder={`One highlight per line:\n${formData.type === "ui-ux" ? "40% faster task completion\nImproved accessibility score\nReduced user errors by 60%" : formData.type === "web-dev" ? "99+ Lighthouse performance score\nCustom GSAP animations\nResponsive mobile-first design" : "Premium color system with accessible contrast\nVersatile logo variants for all media\nGrid-based layout rules for consistency"}`}
                      />
                      <p className="text-xs text-neutral-500 mt-1">
                        Enter each highlight on a new line
                      </p>
                    </div>
                  )}

                  {relevantFields.showDeliverables && (
                    <div>
                      <label
                        htmlFor="deliverables"
                        className="block text-sm font-medium text-neutral-700 mb-2"
                      >
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
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-colors resize-none"
                        placeholder={`One deliverable per line:\n${formData.type === "ui-ux" ? "User research report\nPersonas and journey maps\nWireframes and prototypes\nHigh-fidelity UI designs" : formData.type === "web-dev" ? "Responsive website\nPerformance optimization\nSEO optimization\nDeployment setup" : "Logo system\nBrand guidelines\nDesign kit\nTemplates"}`}
                      />
                      <p className="text-xs text-neutral-500 mt-1">
                        Enter each deliverable on a new line
                      </p>
                    </div>
                  )}

                  {relevantFields.showProcess && (
                    <div>
                      <label
                        htmlFor="process"
                        className="block text-sm font-medium text-neutral-700 mb-2"
                      >
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
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-colors resize-none font-mono text-sm"
                        placeholder={`[\n  {\n    "title": "Discovery",\n    "body": "Research and analysis phase..."\n  },\n  {\n    "title": "Design",\n    "body": "Concept development and iteration..."\n  }\n]`}
                      />
                      <p className="text-xs text-neutral-500 mt-1">
                        Enter process steps as JSON array with title and body fields
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Settings & Media */}
            <div className="space-y-8">
              {/* Project Settings */}
              <div className="border border-neutral-200 rounded-lg bg-white p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-neutral-900">Settings</h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    Project configuration and metadata.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="slug"
                      className="block text-sm font-medium text-neutral-700 mb-2"
                    >
                      URL Slug
                    </label>
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
                    <p className="text-xs text-neutral-500 mt-1">Used in the project URL</p>
                  </div>

                  <div>
                    <label
                      htmlFor="type"
                      className="block text-sm font-medium text-neutral-700 mb-2"
                    >
                      Project Type
                    </label>
                    <select
                      name="type"
                      id="type"
                      value={formData.type}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, type: e.target.value as ProjectType }))
                      }
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-colors"
                    >
                      <option value="web-dev">Web Development</option>
                      <option value="ui-ux">UI/UX Design</option>
                      <option value="branding">Branding</option>
                      <option value="social">Social Media</option>
                      <option value="print">Print Design</option>
                    </select>
                    <p className="text-xs text-neutral-500 mt-1">
                      This affects which fields are shown below
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="year"
                        className="block text-sm font-medium text-neutral-700 mb-2"
                      >
                        Year
                      </label>
                      <input
                        type="text"
                        name="year"
                        id="year"
                        value={formData.year}
                        onChange={(e) => setFormData((prev) => ({ ...prev, year: e.target.value }))}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-colors"
                        placeholder="2024"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="client"
                        className="block text-sm font-medium text-neutral-700 mb-2"
                      >
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
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-colors"
                        placeholder="Client name"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input
                      id="featured"
                      name="featured"
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, featured: e.target.checked }))
                      }
                      className="h-4 w-4 text-neutral-900 focus:ring-neutral-900 border-neutral-300 rounded"
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-neutral-700">
                      Featured Project
                    </label>
                  </div>
                  <p className="text-xs text-neutral-500">Display prominently on homepage</p>
                </div>
              </div>

              {/* Project Type Info */}
              <div className="border border-blue-200/50 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <svg
                      className="h-4 w-4 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-blue-900">
                    {relevantFields.caseStudyTitle}
                  </h3>
                </div>

                {/* Project Media */}
                <div className="border border-neutral-200/50 rounded-2xl bg-white shadow-sm p-6">
                  <div className="mb-6 flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-purple-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900">Media</h3>
                      <p className="text-sm text-neutral-600 mt-1">
                        Visual assets for your project
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <ImageUpload
                      bucket="project-images"
                      currentImage={formData.thumb}
                      onUpload={(url) => setFormData((prev) => ({ ...prev, thumb: url }))}
                      label="Thumbnail Image"
                    />

                    <div>
                      <label
                        htmlFor="video"
                        className="block text-sm font-medium text-neutral-700 mb-2"
                      >
                        Video URL (optional)
                      </label>
                      <input
                        type="url"
                        name="video"
                        id="video"
                        value={formData.video}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, video: e.target.value }))
                        }
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-colors"
                        placeholder="https://example.com/video.mp4"
                      />
                    </div>

                    <div>
                      <ImageUpload
                        bucket="project-images"
                        currentImage={formData.mobileHeroSrc}
                        onUpload={(url) => setFormData((prev) => ({ ...prev, mobileHeroSrc: url }))}
                        label="Mobile Hero Image (optional)"
                      />
                      <p className="text-xs text-neutral-500 mt-1">
                        Alternative hero image optimized for mobile devices
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Gallery Images (optional)
                      </label>
                      <p className="text-xs text-neutral-500 mb-3">
                        Add multiple images to showcase the project in detail
                      </p>

                      {/* Display existing gallery images */}
                      {gallery.length > 0 && (
                        <div className="mb-4 space-y-3">
                          {gallery.map((img, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-3 p-3 border border-neutral-200 rounded-lg bg-neutral-50"
                            >
                              <img
                                src={img.src}
                                alt={img.alt || `Gallery image ${idx + 1}`}
                                className="w-20 h-20 object-cover rounded"
                              />
                              <div className="flex-1 min-w-0">
                                <input
                                  type="text"
                                  value={img.alt}
                                  onChange={(e) => {
                                    const updated = [...gallery];
                                    updated[idx] = { ...updated[idx], alt: e.target.value };
                                    setGallery(updated);
                                  }}
                                  placeholder="Image alt text"
                                  className="w-full px-2 py-1 text-sm border border-neutral-300 rounded focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900"
                                />
                                <p className="text-xs text-neutral-500 mt-1 truncate">{img.src}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setGallery(gallery.filter((_, i) => i !== idx))}
                                className="text-red-600 hover:text-red-700 p-1"
                                title="Remove image"
                              >
                                <svg
                                  className="w-5 h-5"
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
                          ))}
                        </div>
                      )}

                      {/* Add new gallery image */}
                      <div className="border-2 border-dashed border-neutral-300 rounded-lg p-4 bg-neutral-50">
                        <ImageUpload
                          bucket="project-images"
                          currentImage=""
                          onUpload={(url) => {
                            if (url) {
                              setGallery([...gallery, { src: url, alt: "" }]);
                            }
                          }}
                          label="Add New Gallery Image"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="alt"
                        className="block text-sm font-medium text-neutral-700 mb-2"
                      >
                        Alt Text
                      </label>
                      <input
                        type="text"
                        name="alt"
                        id="alt"
                        value={formData.alt}
                        onChange={(e) => setFormData((prev) => ({ ...prev, alt: e.target.value }))}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-colors"
                        placeholder="Descriptive alt text for accessibility"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="credits"
                        className="block text-sm font-medium text-neutral-700 mb-2"
                      >
                        Credits (optional)
                      </label>
                      <textarea
                        name="credits"
                        id="credits"
                        rows={2}
                        value={formData.credits}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, credits: e.target.value }))
                        }
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-colors resize-none"
                        placeholder="Photo credits, attributions..."
                      />
                    </div>
                  </div>
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
                        className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
                              <span>{isEditing ? "Update Project" : "Create Project"}</span>
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
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                      </button>

                      <Link
                        href="/admin/projects"
                        className="w-full text-center px-4 py-2.5 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-all border border-neutral-300 rounded-xl hover:border-neutral-400 bg-white hover:bg-neutral-50 hover:shadow-sm"
                      >
                        Cancel
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
