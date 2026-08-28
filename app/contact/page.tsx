import type { Metadata } from "next";
import SiteShell from "../components/site-shell";
import ConnectCard from "../components/connect-card";
import { readContent } from "../../lib/content-storage";

export async function generateMetadata(): Promise<Metadata> {
  const { contactPage } = await readContent();
  return {
    title: contactPage.metaTitle,
    description: contactPage.metaDescription,
  };
}

export default async function ContactPage() {
  const { contactPage, connect } = await readContent();

  return (
    <SiteShell title={contactPage.heroTitle} intro={contactPage.heroIntro}>
      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-panel animate-fade-up rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] p-8 shadow-2xl shadow-slate-950/20">
          <h2 className="text-2xl font-semibold text-[color:var(--text-strong)]">{contactPage.heading}</h2>
          <p className="mt-4 text-lg leading-8 text-[color:var(--muted)]">
            {contactPage.description}
          </p>
          <a
            href={`mailto:${contactPage.email}`}
            className="btn-primary mt-8 inline-flex rounded-full px-6 py-3 font-semibold text-slate-950"
          >
            {contactPage.ctaLabel}
          </a>

          {connect.features.length > 0 ? (
            <div className="mt-10 space-y-6 border-t border-[color:var(--border)] pt-8">
              {connect.features.map((feature) => (
                <div key={feature.rest}>
                  <h3 className="text-lg font-semibold text-[color:var(--text-strong)]">
                    <span className="text-cyan-400">{feature.highlight}</span> {feature.rest}
                  </h3>
                  <p className="mt-1 text-sm leading-7 text-[color:var(--muted)]">{feature.description}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <ConnectCard connect={connect} fallbackEmail={contactPage.email} extraMethods={contactPage.methods} />
      </section>
    </SiteShell>
  );
}
