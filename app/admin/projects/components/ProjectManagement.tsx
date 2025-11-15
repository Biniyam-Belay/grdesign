"use client";

import { useState, useEffect, useCallback } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { Project } from "@/lib/types";

export default function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [brokenThumbs, setBrokenThumbs] = useState<Record<string, boolean>>({});
  const supabase = createSupabaseClient();

  useEffect(() => {
    // This triggers the entry animations
    setMounted(true);
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("You are not signed in. Please log in again.");
      }

      const { data, error } = await supabase.functions.invoke("projects", {
        body: { action: "list" },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      setProjects((data?.projects as Project[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async (project: Project) => {
    if (
      !confirm(
        `Are you sure you want to delete "${project.title}"? This will also permanently delete all associated images and cannot be undone.`,
      )
    )
      return;

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("You are not signed in. Please log in again.");

      const pathsToDelete: string[] = [];
      if (project.thumb)
        pathsToDelete.push(project.thumb.substring(project.thumb.lastIndexOf("/") + 1));
      if (project.video)
        pathsToDelete.push(project.video.substring(project.video.lastIndexOf("/") + 1));
      if (project.mobileHeroSrc)
        pathsToDelete.push(
          project.mobileHeroSrc.substring(project.mobileHeroSrc.lastIndexOf("/") + 1),
        );
      if (project.featuredSrc)
        pathsToDelete.push(project.featuredSrc.substring(project.featuredSrc.lastIndexOf("/") + 1));
      if (project.gallery) {
        project.gallery.forEach((item) => {
          if (item.src) pathsToDelete.push(item.src.substring(item.src.lastIndexOf("/") + 1));
        });
      }

      const uniquePaths = [...new Set(pathsToDelete.filter((p) => p))];

      if (uniquePaths.length > 0) {
        await supabase.storage.from("project-images").remove(uniquePaths);
      }

      await supabase.from("projects").delete().eq("id", project.id);

      await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/work", type: "layout" }),
      });

      setProjects((prev) => prev.filter((p) => p.id !== project.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || project.type === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(
    new Set(projects.filter((p) => p.type).map((p) => p.type as string)),
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center transition-opacity duration-300">
        <div className="text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-black" />
          <p className="mt-4 text-neutral-600 font-medium">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-800">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-neutral-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-neutral-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <header className="sticky top-0 z-40 bg-white/60 backdrop-blur-lg border-b border-neutral-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="flex items-center gap-2 text-neutral-500 hover:text-black transition-all duration-200 group"
              >
                <svg
                  className="h-5 w-5 transition-transform duration-200 ease-in-out group-hover:-translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="font-medium text-sm hidden sm:block">Dashboard</span>
              </Link>
              <div className="h-5 w-px bg-neutral-200/80" />
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-neutral-600"
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
                <h1 className="text-lg font-semibold text-neutral-900">Manage Projects</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div
          className={`transition-all duration-500 ease-in-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          {error && (
            <div className="mb-6 rounded-xl border border-neutral-300 bg-neutral-100/80 p-4 animate-shake">
              <div className="flex items-start gap-3">
                <svg
                  className="h-5 w-5 text-neutral-800 mt-0.5 flex-shrink-0"
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
                <p className="text-sm text-neutral-800 font-medium">{error}</p>
              </div>
            </div>
          )}

          <div className="mb-8 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full max-w-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-neutral-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-lg border border-neutral-200/80 bg-white py-2.5 pl-10 pr-3 text-sm placeholder-neutral-500 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="flex-1 w-full rounded-lg border border-neutral-200/80 bg-white px-3 py-2.5 text-sm font-medium text-neutral-700 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="flex rounded-lg border border-neutral-200/80 bg-white p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center justify-center h-8 w-8 rounded-md text-sm font-medium transition-colors duration-200 ${viewMode === "grid" ? "bg-black text-white" : "text-neutral-500 hover:bg-neutral-100 hover:text-black"}`}
                  title="Grid View"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center justify-center h-8 w-8 rounded-md text-sm font-medium transition-colors duration-200 ${viewMode === "list" ? "bg-black text-white" : "text-neutral-500 hover:bg-neutral-100 hover:text-black"}`}
                  title="List View"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="mb-8 border-t border-neutral-200/80 pt-6 flex items-center justify-between">
            <p className="text-sm text-neutral-500">
              <span className="font-medium text-black">{filteredProjects.length}</span>
              <span> {filteredProjects.length === 1 ? "project" : "projects"} found</span>
            </p>
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition-all duration-200 ease-in-out hover:bg-neutral-800 hover:-translate-y-px active:scale-95"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Project
            </Link>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div
            className={`transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
          >
            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-neutral-200 rounded-2xl">
              <div className="mb-4 h-16 w-16 rounded-full bg-neutral-100 flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-neutral-400"
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
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">No projects found</h3>
              <p className="text-neutral-500 mb-6 max-w-xs">
                {searchQuery
                  ? `Your search for "${searchQuery}" did not return any results.`
                  : "Get started by creating your first project."}
              </p>
              <Link
                href="/admin/projects/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg font-medium transition-all duration-200 ease-in-out hover:bg-neutral-800 hover:-translate-y-px active:scale-95"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create First Project
              </Link>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className={`group relative transition-all duration-500 ease-in-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="relative h-full overflow-hidden rounded-2xl border border-neutral-200/80 bg-white transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-neutral-200/80 hover:-translate-y-1">
                  <div className="relative aspect-video overflow-hidden bg-neutral-100">
                    {project.thumb && !brokenThumbs[project.id || ""] ? (
                      <Image
                        src={project.thumb}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                        onError={() =>
                          setBrokenThumbs((prev) => ({ ...prev, [project.id || ""]: true }))
                        }
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <svg
                          className="h-12 w-12 text-neutral-300"
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
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  <div className="p-5">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold text-neutral-900 line-clamp-2">
                        {project.title}
                      </h3>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-700">
                          {project.type || "Project"}
                        </span>
                        {project.featured && (
                          <span className="inline-flex items-center rounded-md bg-neutral-800 text-white px-2 py-1 text-xs font-medium">
                            <svg className="h-3 w-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-neutral-500 line-clamp-2 mb-4">{project.excerpt}</p>

                    <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                      <Link
                        href={`/admin/projects/edit/${project.slug}`}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200 transition-colors duration-200"
                      >
                        <svg
                          className="h-4 w-4"
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
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(project)}
                        disabled={!project.id}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200/80 text-neutral-500 hover:border-black hover:text-black transition-colors duration-200 disabled:opacity-50"
                        title="Delete project"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className={`group transition-all duration-500 ease-in-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: `${index * 30}ms` }}
              >
                <div className="flex items-center gap-4 rounded-xl border border-neutral-200/80 bg-white p-3 transition-all duration-300 ease-in-out hover:shadow-lg hover:border-neutral-300 hover:translate-x-1">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                    {project.thumb && !brokenThumbs[project.id || ""] ? (
                      <Image
                        src={project.thumb}
                        alt={project.title}
                        fill
                        className="object-cover"
                        onError={() =>
                          setBrokenThumbs((prev) => ({ ...prev, [project.id || ""]: true }))
                        }
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <svg
                          className="h-8 w-8 text-neutral-300"
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
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-neutral-900 truncate">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700">
                        {project.type || "Project"}
                      </span>
                      {project.featured && (
                        <span className="inline-flex items-center rounded-md bg-neutral-800 text-white px-2 py-0.5 text-xs font-medium">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link
                      href={`/admin/projects/edit/${project.slug}`}
                      className="flex items-center gap-2 rounded-lg bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-200 transition-colors duration-200"
                    >
                      <svg
                        className="h-4 w-4"
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
                      <span className="hidden sm:inline">Edit</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(project)}
                      disabled={!project.id}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200/80 text-neutral-500 hover:border-black hover:text-black transition-colors duration-200 disabled:opacity-50"
                      title="Delete project"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
