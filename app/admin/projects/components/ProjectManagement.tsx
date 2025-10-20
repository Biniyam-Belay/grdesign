"use client";

import { useState, useEffect, useCallback } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { Project } from "@/lib/types";

export default function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const supabase = createSupabaseClient();

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("title", { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);

      if (error) throw error;

      setProjects(projects.filter((project) => project.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-300 border-t-neutral-900 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                href="/admin"
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
                Dashboard
              </Link>
              <div className="h-4 w-px bg-neutral-300" />
              <h1 className="text-lg font-medium text-neutral-900">Portfolio Projects</h1>
            </div>
            <div className="flex items-center">
              <Link
                href="/admin/projects/new"
                className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
              >
                New Project
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
                Portfolio Overview
              </h2>
              <p className="text-neutral-600 mt-1">
                {projects.length} {projects.length === 1 ? "project" : "projects"} in portfolio
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="border border-neutral-200 rounded-lg bg-neutral-50 p-4">
              <div className="text-sm font-medium text-neutral-600">Total Projects</div>
              <div className="mt-1 text-2xl font-semibold text-neutral-900">{projects.length}</div>
            </div>
            <div className="border border-neutral-200 rounded-lg bg-neutral-50 p-4">
              <div className="text-sm font-medium text-neutral-600">Featured</div>
              <div className="mt-1 text-2xl font-semibold text-neutral-900">
                {projects.filter((p) => p.featured).length}
              </div>
            </div>
            <div className="border border-neutral-200 rounded-lg bg-neutral-50 p-4">
              <div className="text-sm font-medium text-neutral-600">Project Types</div>
              <div className="mt-1 text-2xl font-semibold text-neutral-900">
                {new Set(projects.map((p) => p.type).filter(Boolean)).size || 1}
              </div>
            </div>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="border border-neutral-200 rounded-lg bg-neutral-50 p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-neutral-900">No projects yet</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Start building your portfolio by adding your first project.
            </p>
            <div className="mt-6">
              <Link
                href="/admin/projects/new"
                className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create your first project
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="border border-neutral-200 rounded-lg bg-white p-6 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 relative h-20 w-20">
                    <Image
                      className="rounded-lg object-cover border border-neutral-200"
                      src={project.thumb || "/placeholder-project.jpg"}
                      alt={project.title}
                      fill
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-medium text-neutral-900">{project.title}</h3>
                          {project.featured && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-neutral-600 text-sm leading-relaxed mb-3 line-clamp-2">
                          {project.excerpt}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {project.roles?.slice(0, 4).map((role, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-neutral-100 text-neutral-700"
                            >
                              {role}
                            </span>
                          ))}
                          {(project.roles?.length || 0) > 4 && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-neutral-100 text-neutral-700">
                              +{(project.roles?.length || 0) - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3 pt-4 border-t border-neutral-100">
                  <Link
                    href={`/admin/projects/edit/${project.id}`}
                    className="text-sm text-neutral-700 hover:text-black transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(project.id!)}
                    className="text-sm text-red-600 hover:text-red-700 transition-colors"
                  >
                    Delete
                  </button>
                  <div className="flex-1" />
                  <Link
                    href={`/work/${project.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-black transition-colors"
                  >
                    View project
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
