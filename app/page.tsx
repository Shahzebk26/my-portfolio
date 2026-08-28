import Image from "next/image";
import Link from "next/link";
import SiteShell from "./components/site-shell";
import path from "path";
import { readFile } from "fs/promises";
import { readContent } from "../lib/content-storage";
import { readProjects } from "../lib/project-storage";
import ConnectCard from "./components/connect-card";

async function getSiteConfig() {
  try {
    const filePath = path.join(process.cwd(), "data", "site.json");
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { profileImage: "/profile-illustration.svg" };
  }
}

export default async function Home() {
  const [siteConfig, content, allProjects] = await Promise.all([getSiteConfig(), readContent(), readProjects()]);
  const { hero, expertise, aboutTeaser, homeProjects, connect, contactPage } = content;
  const featuredProjects = allProjects.filter((project) => project.featured);
  const showcaseProjects = (featuredProjects.length > 0 ? featuredProjects : allProjects).slice(0, 3);

  return (
    <SiteShell>
      <section className="glass-panel relative overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--panel)] p-8 shadow-2xl shadow-slate-950/20 sm:p-10 lg:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(129,140,248,0.16),_transparent_35%)]" />
        <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-sm font-medium text-cyan-500 reveal-up stagger-1">
              {hero.eyebrow}
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[color:var(--text-strong)] sm:text-5xl lg:text-6xl">
              <span className="block reveal-up stagger-2">{hero.greeting}{" "}
                <span className="word-animate stagger-1">{hero.firstName}</span>
                <span className="word-animate stagger-2">{hero.lastName}</span>
              </span>
              <span className="mt-3 block text-xl font-medium text-[color:var(--muted)] reveal-up stagger-3 lg:text-2xl">{hero.tagline}</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-[color:var(--muted)] reveal-up stagger-4">
              {hero.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={hero.primaryCtaHref}
                className="hero-cta btn-primary animate-pop stagger-3 rounded-full px-6 py-3 font-semibold text-slate-950"
              >
                {hero.primaryCtaLabel}
              </Link>
              <Link
                href={hero.secondaryCtaHref}
                className="hero-cta animate-pop stagger-4 rounded-full border border-[color:var(--border)] px-6 py-3 font-semibold text-[color:var(--text-strong)] transition duration-300 hover:-translate-y-0.5 hover:border-cyan-400 hover:text-cyan-500"
              >
                {hero.secondaryCtaLabel}
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {hero.metrics.map((item) => (
                <div key={item.label} className="glass-panel rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel-strong)]/80 p-4 animate-pop stagger-1">
                  <p className="text-2xl font-semibold text-cyan-500">{item.value}</p>
                  <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-fade-up">
            <div className="glass-panel relative rounded-[1.75rem] border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-4 shadow-2xl shadow-cyan-950/20">
              <div className="animate-float absolute -right-3 top-6 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-sm font-medium text-cyan-400">
                {hero.availableBadge}
              </div>
              <Image
                src={siteConfig.profileImage || "/profile-illustration.svg"}
                alt={`${hero.firstName} ${hero.lastName} profile`}
                width={640}
                height={640}
                priority
                className="rounded-[1.25rem]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16 space-y-6">
        <div className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">{expertise.eyebrow}</p>
          <h2 className="text-3xl font-semibold text-[color:var(--text-strong)]">{expertise.heading}</h2>
          <p className="max-w-xl text-base leading-8 text-[color:var(--muted)]">
            {expertise.description}
          </p>
        </div>

        <div className="flex flex-wrap items-stretch justify-between gap-5 lg:flex-nowrap">
          {expertise.cards.map((card) => (
            <article
              key={card.title}
              className="group glass-panel relative flex-1 min-w-[16rem] overflow-hidden rounded-[1.75rem] border border-[color:var(--border)] bg-[color:var(--panel)] p-6 shadow-[0_20px_80px_-50px_rgba(15,23,42,0.9)] transition duration-500 hover:-translate-y-2 hover:border-cyan-400/40 hover:shadow-[0_40px_120px_-30px_rgba(34,211,238,0.26)]"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-slate-400 to-cyan-400 opacity-0 transition duration-300 group-hover:opacity-100" />
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">{card.label}</p>
              <h3 className="mt-4 text-xl font-semibold text-[color:var(--text-strong)]">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                {card.description}
              </p>
              <div className="mt-6 inline-flex rounded-full border border-cyan-400/20 px-4 py-2 text-sm font-medium text-cyan-300 transition duration-300 group-hover:bg-cyan-500/10 group-hover:text-cyan-200">
                Explore
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="glass-panel mt-16 animate-fade-up rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] p-8 shadow-lg shadow-slate-950/20">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">{aboutTeaser.eyebrow}</p>
            <h2 className="mt-3 text-2xl font-semibold text-[color:var(--text-strong)]">{aboutTeaser.heading}</h2>
            <p className="mt-4 text-base leading-8 text-[color:var(--muted)]">
              {aboutTeaser.description}
            </p>
          </div>
          <div className="glass-panel rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-6">
            <h3 className="text-lg font-semibold text-[color:var(--text-strong)]">{aboutTeaser.strengthsHeading}</h3>
            <ul className="mt-4 space-y-2 text-[color:var(--muted)]">
              {aboutTeaser.strengths.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {showcaseProjects.length > 0 ? (
        <section className="mt-16" id="projects">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">{homeProjects.eyebrow}</p>
              <h2 className="mt-2 text-3xl font-semibold text-[color:var(--text-strong)]">{homeProjects.heading}</h2>
            </div>
            <Link href="/projects" className="text-sm font-medium text-cyan-500 transition hover:text-cyan-400">
              {homeProjects.linkLabel}
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {showcaseProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-[2rem] p-4 transition duration-500 hover:-translate-y-2"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[color:var(--panel-strong)]">
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
                  <h3 className="text-xl font-bold text-[color:var(--text-strong)] transition duration-300 group-hover:text-cyan-400">
                    {project.title}
                  </h3>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--panel-strong)] text-[color:var(--text-strong)] transition duration-300 group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:from-cyan-400 group-hover:to-indigo-500 group-hover:text-slate-950">
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
      ) : null}

      <section className="mt-16 grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="animate-fade-up">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">{connect.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-[color:var(--text-strong)] sm:text-4xl">
            {connect.heading} <span className="text-cyan-400">{connect.headingHighlight}</span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-[color:var(--muted)]">{connect.description}</p>
        </div>

        <ConnectCard connect={connect} fallbackEmail={contactPage.email} />
      </section>
    </SiteShell>
  );
}
