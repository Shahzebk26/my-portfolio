import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { readProjects } from "../../lib/project-storage";
import SiteShell from "../components/site-shell";

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
              {sectionProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-[2rem] p-4 transition duration-500 hover:-translate-y-2"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-(--panel-strong)">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={`${project.title} featured image`}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        unoptimized
                      />
                    ) : null}

                    {project.featured ? (
                      <span className="absolute right-4 top-4 z-10 rounded-full bg-cyan-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-950">
                        Featured
                      </span>
                    ) : null}

                    {/* Hover reveal: category, description, and stack */}
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">{project.category}</p>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-200">{project.description}</p>
                      {project.stack.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {project.stack.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] text-slate-100"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between px-1">
                    <h3 className="text-xl font-bold text-(--text-strong) transition duration-300 group-hover:text-cyan-400">
                      {project.title}
                    </h3>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-(--border) bg-(--panel-strong) text-(--text-strong) transition duration-300 group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:from-cyan-400 group-hover:to-indigo-500 group-hover:text-slate-950">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 17L17 7" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </SiteShell>
  );
}
