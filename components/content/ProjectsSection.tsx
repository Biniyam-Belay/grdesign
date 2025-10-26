// app/components/sections/ProjectsSection.tsx
import Link from "next/link";
import ProjectCard from "@/components/content/ProjectCard";
import type { Project } from "@/lib/types";

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects: allProjects }: ProjectsSectionProps) {
  // Show only projects marked as featured for homepage display
  // Projects can be marked as featured in the admin panel
  const projects = allProjects.filter((p) => p.featured);

  // Show up to 6 featured projects on the homepage
  // For lg screens: Row 1 = wide(8) + standard(4) = 12 cols, Row 2 = standard(4) + tall(4) + standard(4) = 12 cols
  const maxProjectCount = 6;

  // simple rhythm: 0, 5, 10... are "wide"; 2, 7, 12... are "tall"
  type Variant = "wide" | "tall" | "standard";
  const variantFor = (i: number): Variant =>
    i % 5 === 0 ? "wide" : i % 5 === 2 ? "tall" : "standard";

  return (
    <section id="work" className="py-20 px-4 sm:px-8 lg:px-12 bg-white" data-reveal>
      {/* header */}
      <div className="mb-10 flex items-end justify-between" data-reveal>
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900">
            Selected Work
          </h2>
          <p className="mt-2 text-sm text-neutral-500">A focused slice of recent projects.</p>
        </div>
        <Link
          href="/work"
          className="hidden md:inline-flex items-center gap-3 text-sm text-neutral-900 hover:opacity-80"
        >
          View all
          <span className="h-px w-8 bg-neutral-900" />
        </Link>
      </div>

      {/* full-bleed responsive grid with slim gutters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6">
        {projects.slice(0, maxProjectCount).map((project, i) => {
          // layout spans (wide items span 8/12; tall/standard span 4/12 on lg)
          const variant = variantFor(i);
          const span =
            variant === "wide"
              ? "lg:col-span-8 sm:col-span-2 col-span-1"
              : "lg:col-span-4 sm:col-span-1 col-span-1";

          return (
            <div key={`${project.slug}-${i}`} className={span} data-reveal>
              <ProjectCard project={project} variant={variant} />
            </div>
          );
        })}
      </div>

      {/* See more button - show if there are more than max featured projects */}
      {projects.length > maxProjectCount && (
        <div className="mt-10 flex justify-center">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-6 py-3 text-sm text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors"
          >
            See more projects
          </Link>
        </div>
      )}
    </section>
  );
}
