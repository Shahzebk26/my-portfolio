import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readProjects } from "../../../lib/project-storage";
import SiteShell from "../../components/site-shell";

// Newly created slugs must be resolved from the current project file.
export const dynamic = "force-dynamic";

async function getProject(slug: string) {
  const projects = await readProjects();
  return projects.find((project) => project.slug === slug) ?? null;
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return { title: "Project Not Found | Shahzeb" };
  }

  return {
    title: `${project.title} | Shahzeb`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const overview = project.overview || project.description;
  const stats = project.stats ?? [];
  const keyFeatures = project.keyFeatures ?? [];
  const gallery = project.gallery ?? [];
  const eyebrow = project.industry || project.category;

  return (
    <SiteShell>
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm font-medium text-(--muted) transition duration-300 hover:text-cyan-400"
      >
        <span aria-hidden="true">←</span> Back to Projects
      </Link>

      {/* Hero media */}
      <section className="glass-panel relative mt-6 overflow-hidden rounded-[2rem] border border-(--border) bg-(--panel) shadow-2xl shadow-slate-950/20">
        <div className="relative aspect-video w-full">
          {project.videoUrl ? (
            <video
              src={project.videoUrl}
              poster={project.image || undefined}
              controls
              className="h-full w-full object-cover"
            />
          ) : project.image ? (
            <Image
              src={project.image}
              alt={`${project.title} showcase`}
              fill
              unoptimized
              priority
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-(--panel-strong)" />
          )}
        </div>
        {project.featured ? (
          <span className="absolute right-5 top-5 rounded-full bg-cyan-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-950">
            Featured
          </span>
        ) : null}
      </section>

      {/* Title */}
      <section className="mt-10 animate-fade-up">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-400">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-(--text-strong) sm:text-5xl">
          {project.title}
        </h1>
      </section>

      {/* Stats */}
      {stats.length > 0 ? (
        <section className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass-panel rounded-2xl border border-(--border) bg-(--panel) p-4 text-center transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40"
            >
              <p className="text-xl font-semibold text-cyan-400">{stat.value}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-(--muted)">{stat.label}</p>
            </div>
          ))}
        </section>
      ) : null}

      {/* Overview + sidebar */}
      <section className="mt-14 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-10">
          <div className="glass-panel rounded-3xl border border-(--border) bg-(--panel) p-8 shadow-lg shadow-slate-950/10">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">About the project</p>
            <h2 className="mt-3 text-2xl font-semibold text-(--text-strong)">Project overview</h2>
            <p className="mt-4 whitespace-pre-line text-base leading-8 text-(--muted)">{overview}</p>
          </div>

          {keyFeatures.length > 0 ? (
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">Key Features</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {keyFeatures.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 rounded-2xl border border-(--border) bg-(--panel) px-4 py-3 transition duration-300 hover:border-cyan-400/40"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-400">
                      ✓
                    </span>
                    <span className="text-sm text-(--text-strong)">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="glass-panel rounded-3xl border border-(--border) bg-(--panel-strong) p-6 shadow-lg shadow-slate-950/10">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">Project Info</p>

            <dl className="mt-5 space-y-4">
              {project.client ? (
                <div className="flex items-center justify-between border-b border-(--border) pb-3">
                  <dt className="text-sm text-(--muted)">Client</dt>
                  <dd className="text-sm font-semibold text-(--text-strong)">{project.client}</dd>
                </div>
              ) : null}
              {project.industry ? (
                <div className="flex items-center justify-between border-b border-(--border) pb-3">
                  <dt className="text-sm text-(--muted)">Industry</dt>
                  <dd className="text-sm font-semibold text-(--text-strong)">{project.industry}</dd>
                </div>
              ) : null}
              {project.year ? (
                <div className="flex items-center justify-between border-b border-(--border) pb-3">
                  <dt className="text-sm text-(--muted)">Year</dt>
                  <dd className="text-sm font-semibold text-(--text-strong)">{project.year}</dd>
                </div>
              ) : null}
              <div className="flex items-center justify-between">
                <dt className="text-sm text-(--muted)">Category</dt>
                <dd className="text-sm font-semibold text-(--text-strong)">{project.category}</dd>
              </div>
            </dl>

            {project.stack.length > 0 ? (
              <>
                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-(--muted)">Tech Stack</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-(--border) bg-(--panel) px-3 py-1 text-xs text-(--muted)"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </>
            ) : null}

            <div className="mt-7 flex flex-col gap-3">
              {project.liveUrl ? (
                <a
                  href={project.liveUrl.startsWith("http") ? project.liveUrl : `https://${project.liveUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-slate-950"
                >
                  Visit Live Project ↗
                </a>
              ) : null}
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-(--border) px-5 py-3 text-sm font-semibold text-(--text-strong) transition duration-300 hover:-translate-y-0.5 hover:border-cyan-400 hover:text-cyan-400"
              >
                Start Your Project →
              </Link>
            </div>
          </div>
        </aside>
      </section>

      {/* Gallery */}
      {gallery.length > 0 ? (
        <section className="mt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">Product Gallery</p>
          <h2 className="mt-2 text-2xl font-semibold text-(--text-strong)">A closer look</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="glass-panel relative aspect-video overflow-hidden rounded-2xl border border-(--border) bg-(--panel)"
              >
                <Image src={src} alt={`${project.title} gallery image`} fill unoptimized className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* CTA */}
      <section className="mt-16 animate-fade-up rounded-[2rem] border border-(--border) bg-[linear-gradient(135deg,rgba(34,211,238,0.16),rgba(129,140,248,0.12))] p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">Next project</p>
            <h2 className="mt-2 text-2xl font-semibold text-(--text-strong)">
              Ready to start your own success story?
            </h2>
          </div>
          <Link href="/contact" className="btn-primary inline-flex rounded-full px-6 py-3 font-semibold text-slate-950">
            Start a conversation
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
