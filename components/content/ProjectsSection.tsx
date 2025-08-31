import { getProjects } from "@/lib/data/projects";
import ProjectCard from "@/components/content/ProjectCard";

export default function ProjectsSection() {
  const projects = getProjects();

  return (
    <section className="py-8 px-6 bg-white mt-30">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
