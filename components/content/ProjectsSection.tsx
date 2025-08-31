// app/components/sections/ProjectsSection.tsx
import Link from "next/link";
import { getProjects } from "@/lib/data/projects";
import ProjectCard from "@/components/content/ProjectCard";

export default function ProjectsSection() {
  const projects = getProjects();

  // simple rhythm: 0, 5, 10... are "wide"; 2, 7, 12... are "tall"
  type Variant = "wide" | "tall" | "standard";
  const variantFor = (i: number): Variant =>
    i % 5 === 0 ? "wide" : i % 5 === 2 ? "tall" : "standard";

  return (
    <section id="work" className="py-20 px-4 sm:px-8 lg:px-12 bg-white">
      {/* header */}
      <div className="mb-10 flex items-end justify-between">
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
        {projects.map((project, i) => {
          // layout spans (wide items span 8/12; tall/standard span 4/12 on lg)
          const variant = variantFor(i);
          const span =
            variant === "wide"
              ? "lg:col-span-8 sm:col-span-2 col-span-1"
              : "lg:col-span-4 sm:col-span-1 col-span-1";

          return (
            <div key={`${project.slug}-${i}`} className={span}>
              <ProjectCard project={project} variant={variant} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
