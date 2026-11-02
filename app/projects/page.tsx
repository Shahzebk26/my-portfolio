import type { Metadata } from "next";
import { readProjects } from "../../lib/project-storage";
import SiteShell from "../components/site-shell";
import ProjectCard from "../components/project-card";

// This page reads projects created at runtime by the admin API.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects | Shahzeb",
  description: "A selection of full-stack web projects built with modern technologies and thoughtful UI.",
};

export default async function ProjectsPage() {
  const projects = await readProjects();
  const categories = projects.reduce<Record<string, typeof projects>>((acc, project) => {
    const key = project.category || "General";
    acc[key] = acc[key] ?? [];
    acc[key].push(project);
    return acc;
  }, {});

  return (
    <SiteShell
      title="Projects"
      intro="A collection of modern web products focused on usability, performance, and reliable delivery."
    >
      <div className="space-y-14">
        {Object.entries(categories).map(([category, sectionProjects]) => (
          <section key={category} className="animate-fade-up">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-400">{category}</p>
                <h2 className="mt-2 text-3xl font-semibold text-(--text-strong)">{category} Projects</h2>
              </div>
              <p className="text-sm text-(--muted)">{sectionProjects.length} project{sectionProjects.length === 1 ? "" : "s"}</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {sectionProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
            </div>
          </section>
        ))}
      </div>
    </SiteShell>
  );
}
