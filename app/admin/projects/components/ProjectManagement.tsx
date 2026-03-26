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
  index: number;
  mounted: boolean;
}

function SortableProjectItem({
  project,
  handleDelete,
  viewMode,
  index,
  mounted,
}: SortableProjectItemProps) {
  const sortableId = project.id ?? project.slug;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: sortableId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.7 : 1,
  };

  if (viewMode === "grid") {
    return (
      <div
        ref={setNodeRef}
        style={{ ...style, transitionDelay: `${index * 50}ms` }}
        {...attributes}
        {...listeners}
        className={`group cursor-grab transition-all duration-500 ease-in-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} ${
          isDragging ? "ring-2 ring-[#0055FF]/30" : ""
        }`}
      >
        <div className="relative h-full overflow-hidden bg-white/50 border border-[#0B132B]/10 transition-all duration-300 ease-in-out hover:bg-white hover:border-[#0055FF]/30">
          {/* Thumbnail */}
          <div className="relative aspect-[4/3] overflow-hidden bg-[#0B132B]/5">
            {project.thumb && (
              <Image
                src={project.thumb}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
            {/* Drag indicator */}
            <div className="absolute top-3 left-3">
              <div className="flex items-center gap-1 bg-[#0B132B]/80 backdrop-blur-sm px-2 py-1">
                <svg
                  className="h-3 w-3 text-white/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8h16M4 16h16"
                  />
                </svg>
                <span className="text-[8px] uppercase tracking-[0.15em] font-bold text-white/70">
                  DRAG
                </span>
              </div>
            </div>
            {project.featured && (
              <div className="absolute top-3 right-3 bg-[#FF0033] px-2 py-1">
                <span className="text-[8px] uppercase tracking-[0.15em] font-bold text-white">
                  FEATURED
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-lg tracking-tight font-medium text-[#0B132B] line-clamp-1 mb-2 group-hover:text-[#FF0033] transition-colors">
              {project.title}
            </h3>
            {project.excerpt && (
              <p className="text-sm font-light text-[#0B132B]/50 line-clamp-2 mb-4 leading-relaxed">
                {project.excerpt}
              </p>
            )}
            {project.roles && project.roles.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {project.roles.slice(0, 3).map((role) => (
                  <span
                    key={role}
                    className="inline-flex bg-[#0B132B]/5 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#0B132B]/50"
                  >
                    {role}
                  </span>
                ))}
              </div>
            )}
            {/* Actions */}
            <div className="flex items-center gap-0 border-t border-[#0B132B]/5 pt-4">
              <Link
                href={`/admin/projects/edit/${project.slug}`}
                className="flex-1 text-[9px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/50 hover:text-[#0055FF] transition-colors py-2"
              >
                EDIT PROJECT
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(project);
                }}
                className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/30 hover:text-[#FF0033] transition-colors py-2 px-2"
                title="Delete Entry"
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div
      ref={setNodeRef}
      style={{ ...style, transitionDelay: `${index * 30}ms` }}
      {...attributes}
      {...listeners}
      className={`group cursor-grab transition-all duration-500 ease-in-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} ${
        isDragging ? "ring-2 ring-[#0055FF]/30" : ""
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 border-b border-[#0B132B]/10 bg-white/50 p-6 transition-all duration-300 ease-in-out hover:bg-white hover:border-[#0055FF]/30">
        {/* Thumbnail */}
        <div className="relative w-20 h-20 overflow-hidden bg-[#0B132B]/5 flex-shrink-0">
          {project.thumb && (
            <Image src={project.thumb} alt={project.title} fill className="object-cover" />
          )}
        </div>
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg tracking-tight font-medium text-[#0B132B] truncate">
              {project.title}
            </h3>
            {project.featured && (
              <span className="bg-[#FF0033] px-2 py-0.5 text-[8px] uppercase tracking-[0.15em] font-bold text-white flex-shrink-0">
                FEATURED
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {project.type && (
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0B132B]/40">
                {project.type}
              </span>
            )}
            {project.roles && project.roles.length > 0 && (
              <div className="flex items-center gap-2">
                {project.roles.slice(0, 2).map((role) => (
                  <span
                    key={role}
                    className="inline-flex px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#0B132B]/40 border-l border-[#0B132B]/10"
                  >
                    {role}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Actions */}
        <div className="flex items-center justify-end gap-6 sm:gap-4 flex-shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-[#0B132B]/5">
          <Link
            href={`/admin/projects/edit/${project.slug}`}
            className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/50 hover:text-[#0055FF] transition-colors"
          >
            EDIT
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(project);
            }}
            className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/30 hover:text-[#FF0033] transition-colors"
            title="Delete Entry"
          >
            DELETE
          </button>
        </div>
      </div>
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

      if (project.thumb) {
        const filePath = project.thumb.substring(project.thumb.lastIndexOf("/") + 1);
        if (filePath) {
          const { error: storageError } = await supabase.storage
            .from("project-images")
            .remove([filePath]);
          if (storageError) {
            console.error("Failed to delete image from storage:", storageError.message);
          }
        }
      }

      const { error: dbError } = await supabase.from("projects").delete().eq("id", project.id);
      if (dbError) throw dbError;

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

        const updatePromises = updates.map(async (updateData) => {
          const { error: updateError } = await supabase
            .from("projects")
            .update({ position: updateData.position })
            .eq("id", updateData.id);
          if (updateError) throw updateError;
        });

        await Promise.all(updatePromises);
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
        updateProjectOrder(newOrder);
        return newOrder;
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F0]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0B132B] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#0B132B] selection:bg-[#FF0033]/20 pb-24">
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
                href="/admin"
                className="flex items-center gap-2 text-[#0B132B]/50 hover:text-[#FF0033] transition-all duration-300 group"
              >
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                  ← Dashboard
                </span>
              </Link>
              <div className="h-5 w-px bg-[#0B132B]/10" />
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-medium tracking-tight text-[#0B132B]">
                  Project Archive
                </h1>
              </div>
            </div>

            <Link
              href="/admin/projects/new"
              className="hidden sm:inline-flex items-center justify-center gap-2 bg-[#0B132B] text-white px-5 py-2.5 text-[9px] uppercase font-bold tracking-[0.2em] transition-all duration-300 hover:bg-[#FF0033] hover:shadow-[0_5px_15px_rgba(255,0,51,0.25)] rounded-none"
            >
              Add New Project
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative mx-auto max-w-8xl px-6 lg:px-12 py-12">
        <div
          className={`transition-all duration-500 ease-in-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          {error && (
            <div className="mb-6 border border-[#0B132B]/20 bg-white/40 p-4">
              <div className="flex items-start gap-3">
                <p className="text-sm text-[#0B132B] font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/40 mr-2">
                VIEW
              </span>
              <div className="flex bg-white/50 border border-[#0B132B]/10 p-0.5">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center justify-center h-10 w-10 text-sm font-medium transition-colors duration-200 ${viewMode === "grid" ? "bg-[#0B132B] text-white" : "text-[#0B132B]/40 hover:bg-[#0B132B]/5 hover:text-[#0B132B]"}`}
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
                  className={`flex items-center justify-center h-10 w-10 text-sm font-medium transition-colors duration-200 ${viewMode === "list" ? "bg-[#0B132B] text-white" : "text-[#0B132B]/40 hover:bg-[#0B132B]/5 hover:text-[#0B132B]"}`}
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

            <Link
              href="/admin/projects/new"
              className="sm:hidden inline-flex items-center justify-center bg-[#0B132B] text-white px-5 py-2.5 text-[9px] uppercase font-bold tracking-[0.2em] transition-all duration-300 hover:bg-[#FF0033] rounded-none w-full"
            >
              Add New Project
            </Link>
          </div>

          {/* Counter */}
          <div className="mb-8 border-t border-[#0B132B]/10 pt-6 flex items-center justify-between">
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/40">
              <span className="text-[#0B132B]">{projects.length}</span> / PROJECTS
            </p>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0B132B]/30">
              DRAG TO REORDER
            </span>
          </div>
        </div>

        {projects.length === 0 ? (
          <div
            className={`transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
          >
            <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-[#0B132B]/10 bg-white/30">
              <h3 className="text-xl font-medium text-[#0B132B] mb-3">No projects yet</h3>
              <p className="text-sm text-[#0B132B]/40 mb-8 max-w-xs">
                Start building your archive by adding your first project.
              </p>
              <Link
                href="/admin/projects/new"
                className="inline-flex items-center gap-2 bg-[#0B132B] text-white px-8 py-4 text-[10px] uppercase font-bold tracking-[0.25em] transition-all duration-300 hover:bg-[#FF0033]"
              >
                Add First Project
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {projects.map((project, index) => (
                    <SortableProjectItem
                      key={project.id ?? project.slug}
                      project={project}
                      handleDelete={handleDelete}
                      viewMode="grid"
                      index={index}
                      mounted={mounted}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-0">
                  {projects.map((project, index) => (
                    <SortableProjectItem
                      key={project.id ?? project.slug}
                      project={project}
                      handleDelete={handleDelete}
                      viewMode="list"
                      index={index}
                      mounted={mounted}
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
