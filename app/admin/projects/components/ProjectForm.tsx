"use client";

import { useState } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/components/ui/ImageUpload";
import { Project } from "@/lib/types";

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
    // New fields for different project types
    highlights: project?.highlights?.join("\n") || "",
    deliverables: project?.deliverables?.join("\n") || "",
    process: project?.process
      ? typeof project.process === "string"
        ? project.process
        : JSON.stringify(project.process, null, 2)
      : "",
  });
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

      // Parse process array if provided
      let processArray = null;
      if (formData.process.trim()) {
        try {
          processArray = JSON.parse(formData.process);
        } catch {
          // If JSON parsing fails, treat as plain text
          processArray = formData.process;
        }
      }

      const projectData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        thumb: formData.thumb,
        video: formData.video || null,
        roles: rolesArray,
        tools: toolsArray,
        type: formData.type,
        featured: formData.featured,
        alt: formData.alt || null,
        credits: formData.credits || null,
        problem: formData.problem || null,
        solution: formData.solution || null,
        approach: formData.approach || null,
        outcome: formData.outcome || null,
        year: formData.year || null,
        client: formData.client || null,
        // Add new fields based on project type
        highlights: highlightsArray.length > 0 ? highlightsArray : null,
        deliverables: deliverablesArray.length > 0 ? deliverablesArray : null,
        process: processArray,
      };

      let result;
      if (isEditing && project?.id) {
        result = await supabase.from("projects").update(projectData).eq("id", project.id);
      } else {
        result = await supabase.from("projects").insert([projectData]);
      }

      if (result.error) throw result.error;

      router.push("/admin/projects");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save project");
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
                href="/admin/projects"
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
                Portfolio Projects
              </Link>
              <div className="h-4 w-px bg-neutral-300" />
              <h1 className="text-lg font-medium text-neutral-900">
                {isEditing ? "Edit Project" : "New Project"}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Project Information */}
              <div className="border border-neutral-200 rounded-lg bg-white p-8">
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-neutral-900">Project Overview</h2>
                  <p className="text-sm text-neutral-600 mt-1">
                    Core information about your project.
                  </p>
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
                      onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
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
              <div className="border border-blue-200 rounded-lg bg-blue-50 p-4">
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-blue-900">
                    Active Fields for "{formData.type}"
                  </h4>
                </div>
                <div className="space-y-2 text-xs text-blue-700">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${relevantFields.showHighlights ? "bg-green-500" : "bg-gray-300"}`}
                    ></span>
                    <span>Key Highlights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${relevantFields.showDeliverables ? "bg-green-500" : "bg-gray-300"}`}
                    ></span>
                    <span>Deliverables</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${relevantFields.showProcess ? "bg-green-500" : "bg-gray-300"}`}
                    ></span>
                    <span>Process Steps</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${relevantFields.showApproach ? "bg-green-500" : "bg-gray-300"}`}
                    ></span>
                    <span>Approach & Outcome</span>
                  </div>
                </div>
              </div>

              {/* Project Media */}
              <div className="border border-neutral-200 rounded-lg bg-white p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-neutral-900">Media</h3>
                  <p className="text-sm text-neutral-600 mt-1">Visual assets for your project.</p>
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
                      onChange={(e) => setFormData((prev) => ({ ...prev, video: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-colors"
                      placeholder="https://example.com/video.mp4"
                    />
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
                      className="w-full bg-black text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Saving..." : isEditing ? "Update Project" : "Create Project"}
                    </button>

                    <Link
                      href="/admin/projects"
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
