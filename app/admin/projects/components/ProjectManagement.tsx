"use client";

import { useState, useEffect, useCallback } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { Project } from "@/lib/types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableProjectItemProps {
  project: Project;
  handleDelete: (project: Project) => void;
  viewMode: "grid" | "list";
}

function SortableProjectItem({ project, handleDelete, viewMode }: SortableProjectItemProps) {
  const sortableId = project.id ?? project.slug;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: sortableId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.8 : 1,
  };

  const commonContent = (
    <>
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        {project.thumb && (
          <Image src={project.thumb} alt={project.title} fill className="object-cover" />
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <Link
            href={`/admin/projects/edit/${project.slug}`}
            className="p-2 bg-white/90 rounded-lg shadow-lg"
          >
            <svg
              className="h-4 w-4 text-neutral-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </Link>
          <button
            onClick={() => handleDelete(project)}
            className="p-2 bg-red-500/90 rounded-lg shadow-lg"
          >
            <svg
              className="h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-neutral-900">{project.title}</h3>
        {project.excerpt && (
          <p className="text-sm text-neutral-600 line-clamp-2">{project.excerpt}</p>
        )}
      </div>
    </>
  );

  const listItemContent = (
    <>
      <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
        {project.thumb && (
          <Image src={project.thumb} alt={project.title} fill className="object-cover" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-neutral-900">{project.title}</h3>
        {project.excerpt && <p className="text-sm text-neutral-600">{project.excerpt}</p>}
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <Link
          href={`/admin/projects/edit/${project.slug}`}
          className="p-3 bg-neutral-100 rounded-xl"
        >
          <svg
            className="h-5 w-5 text-neutral-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </Link>
        <button onClick={() => handleDelete(project)} className="p-3 bg-red-100 rounded-xl">
          <svg
            className="h-5 w-5 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </>
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group bg-white rounded-2xl shadow-lg border border-neutral-200 overflow-hidden cursor-grab ${
        isDragging ? "ring-2 ring-purple-500" : ""
      } ${viewMode === "list" ? "flex items-center gap-6 p-6" : ""}`}
    >
      {viewMode === "grid" ? commonContent : listItemContent}
    </div>
  );
}

export default function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const supabase = createSupabaseClient();

  useEffect(() => {
    // Trigger entry animations similar to other management pages
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  };

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        window.location.href = "/admin/login";
        return;
      }

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("position", { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
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
        `Are you sure you want to delete "${project.title}"? This will also permanently delete the associated image.`,
      )
    )
      return;

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/admin/login";
        return;
      }

      // 1. Delete image from storage
      if (project.thumb) {
        const filePath = project.thumb.substring(project.thumb.lastIndexOf("/") + 1);
        if (filePath) {
          const { error: storageError } = await supabase.storage
            .from("project-images")
            .remove([filePath]);
          if (storageError) {
            // Log error but don't block DB deletion
            console.error("Failed to delete image from storage:", storageError.message);
          }
        }
      }

      // 2. Delete record from database
      const { error: dbError } = await supabase.from("projects").delete().eq("id", project.id);
      if (dbError) throw dbError;

      // 3. Update UI
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete project: " + (err as Error).message);
    }
  };

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const updateProjectOrder = useCallback(
    async (newOrder: Project[]) => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          window.location.href = "/admin/login";
          return;
        }

        const updates = newOrder.map((project, index) => ({
          id: project.id,
          position: index,
        }));

        // Instead of a single upsert, perform individual updates for each project
        // This ensures only the position is updated and other fields are not touched
        const updatePromises = updates.map(async (updateData) => {
          const { error: updateError } = await supabase
            .from("projects")
            .update({ position: updateData.position })
            .eq("id", updateData.id);
          if (updateError) throw updateError;
        });

        await Promise.all(updatePromises);
        // Optionally, re-fetch projects to ensure consistency, or just rely on local state
        // fetchProjects();
      } catch (err) {
        console.error("Error updating project order:", err);
        alert("Failed to update project order: " + (err as Error).message);
      }
    },
    [supabase],
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setProjects((items) => {
        const getSortableId = (p: Project) => p.id ?? p.slug;
        const oldIndex = items.findIndex((item) => getSortableId(item) === active.id);
        const newIndex = items.findIndex((item) => getSortableId(item) === over?.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        updateProjectOrder(newOrder); // Call function to update database
        return newOrder;
      });
    }
  };

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
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </div>
                <h1 className="text-lg font-semibold text-neutral-900">Manage Projects</h1>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="hidden sm:inline-flex items-center justify-center rounded-lg border border-neutral-200/80 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 transition-colors duration-200"
            >
              Logout
            </button>
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
            <div className="flex items-center gap-3 w-full sm:w-auto">
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

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <Link
                href="/admin/projects/new"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200/80 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 transition-all duration-200 ease-in-out hover:bg-neutral-50 hover:-translate-y-px active:scale-95"
              >
                Add Single
              </Link>
            </div>
          </div>

          <div className="mb-8 border-t border-neutral-200/80 pt-6 flex items-center justify-between">
            <p className="text-sm text-neutral-500">
              <span className="font-medium text-black">{projects.length}</span>
              <span> {projects.length === 1 ? "project" : "projects"} found</span>
            </p>
          </div>
        </div>

        {projects.length === 0 ? (
          <div
            className={`transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
          >
            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-neutral-200 rounded-2xl bg-white/70">
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">No projects yet</h3>
              <p className="text-neutral-500 mb-6 max-w-xs">
                Get started by adding your first project.
              </p>
              <Link
                href="/admin/projects/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg font-medium transition-all duration-200 ease-in-out hover:bg-neutral-800 hover:-translate-y-px active:scale-95"
              >
                Add Your First Project
              </Link>
            </div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={projects.map((project) => project.id ?? project.slug)}
              strategy={verticalListSortingStrategy}
            >
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <SortableProjectItem
                      key={project.id ?? project.slug}
                      project={project}
                      handleDelete={handleDelete}
                      viewMode="grid"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <SortableProjectItem
                      key={project.id ?? project.slug}
                      project={project}
                      handleDelete={handleDelete}
                      viewMode="list"
                    />
                  ))}
                </div>
              )}
            </SortableContext>
          </DndContext>
        )}
      </main>
    </div>
  );
}
