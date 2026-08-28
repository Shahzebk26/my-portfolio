import type { Metadata } from "next";
import SiteShell from "../components/site-shell";
import { readContent } from "../../lib/content-storage";

export async function generateMetadata(): Promise<Metadata> {
  const { aboutPage } = await readContent();
  return {
    title: aboutPage.metaTitle,
    description: aboutPage.metaDescription,
  };
}

export default async function AboutPage() {
  const { aboutPage } = await readContent();

  return (
    <SiteShell title={aboutPage.heroTitle} intro={aboutPage.heroIntro}>
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel animate-fade-up rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] p-8 shadow-2xl shadow-slate-950/20">
          <h2 className="text-2xl font-semibold text-[color:var(--text-strong)]">{aboutPage.approachHeading}</h2>
          {aboutPage.approachParagraphs.map((paragraph) => (
            <p key={paragraph} className="mt-4 text-lg leading-8 text-[color:var(--muted)]">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="glass-panel animate-fade-up rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-8">
          <h3 className="text-xl font-semibold text-[color:var(--text-strong)]">{aboutPage.strengthsHeading}</h3>
          <ul className="mt-5 space-y-3 text-[color:var(--muted)]">
            {aboutPage.strengths.map((item) => (
              <li key={item} className="rounded-xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-3 transition duration-300 hover:border-cyan-400/40">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        {aboutPage.highlights.map((item) => (
          <div
            key={item.label}
            className="glass-panel animate-fade-up rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40"
          >
            <p className="text-3xl font-semibold text-cyan-400">{item.value}</p>
            <p className="mt-2 text-sm uppercase tracking-[0.24em] text-[color:var(--muted)]">{item.label}</p>
          </div>
        ))}
      </section>
    </SiteShell>
  );
}
