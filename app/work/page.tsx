"use client";
import Container from "@components/layout/Container";
import { useRef } from "react";
import { usePageTransition } from "@lib/gsapPageTransition";
import ProjectCard from "@components/content/ProjectCard";
import { getProjects } from "@lib/data/projects";
import type { Project } from "@lib/types";

export default function WorkPage() {
  const pageRef = useRef<HTMLElement>(null!);
  usePageTransition(pageRef);
  return (
    <main ref={pageRef} className="min-h-[70svh] bg-white">
      <Container>
        <h1 className="text-4xl font-semibold mb-8">Selected Work</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {getProjects().map((p: Project) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </Container>
    </main>
  );
}
