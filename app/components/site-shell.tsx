"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

const searchIndex = [
  { href: "/", label: "Home", description: "Overview of the portfolio" },
  { href: "/about", label: "About", description: "Background, strengths, and experience" },
  { href: "/projects", label: "Projects", description: "Selected work and case studies" },
  { href: "/contact", label: "Contact", description: "Get in touch for opportunities or collaborations" },
];

type SiteShellProps = {
  children: ReactNode;
  title?: string;
  intro?: string;
  hideHeader?: boolean;
};

export default function SiteShell({ children, title, intro, hideHeader = false }: SiteShellProps) {
  const pathname = usePathname();
  // Default to dark during server render so the markup is stable.
  // Read persisted theme from localStorage only on mount to avoid
  // SSR/CSR hydration mismatches.
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [siteSettings, setSiteSettings] = useState({
    footerTagline: "Designed and developed with care for modern brands, startups, and ambitious teams.",
    ownerName: "Shahzeb Khan",
  });

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (data?.content?.siteSettings) {
          setSiteSettings(data.content.siteSettings);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("portfolio-theme") as "dark" | "light" | null;
    const preferredTheme =
      savedTheme ?? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    setTheme(preferredTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filteredResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return searchIndex.slice(0, 4);
    }

    return searchIndex.filter((item) =>
      [item.label, item.description, item.href].some((value) => value.toLowerCase().includes(normalizedQuery)),
    );
  }, [query]);

  const isDark = theme === "dark";
  const mutedText = isDark ? "text-slate-300" : "text-slate-600";
  const strongText = isDark ? "text-white" : "text-slate-900";

  return (
    <div className={`relative min-h-screen ${isDark ? "text-slate-100" : "text-slate-900"}`}>
      {!hideHeader ? (
        <header
          className={`sticky top-0 z-40 border-b transition-all duration-300 ${
            scrolled
              ? "border-[color:var(--border)] bg-[color:var(--panel-strong)] shadow-[0_8px_30px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl"
              : "border-transparent bg-transparent backdrop-blur-0"
          }`}
        >
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
            <Link href="/" className="group flex items-center">
              <Image
                src="/logo-full.png"
                alt="Shahzeb Khan"
                width={1393}
                height={388}
                priority
                className={`h-8 w-auto transition-all duration-300 drop-shadow-[0_0_10px_var(--accent-soft)] group-hover:scale-105 ${
                  isDark ? "" : "invert hue-rotate-180"
                }`}
              />
            </Link>

            <div className="flex flex-1 justify-center">
              <div className="hidden items-center gap-1 rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-1.5 py-1.5 text-sm font-medium md:flex">
                {navLinks.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`rounded-full px-4 py-1.5 transition-all duration-300 ${
                        active
                          ? "bg-[color:var(--accent-soft)] text-[color:var(--accent)]"
                          : isDark
                            ? "text-slate-300 hover:text-white"
                            : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSearchOpen((open) => !open)}
                className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] p-2.5 text-[color:var(--foreground)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                aria-label="Toggle search"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="6" />
                  <path d="M20 20L16.5 16.5" strokeLinecap="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
                className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-2 text-sm font-medium text-[color:var(--foreground)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                aria-label="Toggle theme"
              >
                {isDark ? "☀️ Light" : "🌙 Dark"}
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen((open) => !open)}
                className={`group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border text-[color:var(--foreground)] shadow-[0_8px_24px_-14px_var(--accent)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-12px_var(--accent)] md:hidden ${
                  mobileMenuOpen
                    ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--accent)]"
                    : "border-[color:var(--border)] bg-[color:var(--panel)] hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                }`}
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation"
              >
                <span className="sr-only">{mobileMenuOpen ? "Close menu" : "Open menu"}</span>
                <span className="relative flex h-4 w-5 items-center justify-center" aria-hidden="true">
                  <span className={`absolute h-px w-5 rounded-full bg-current transition-all duration-300 ${mobileMenuOpen ? "rotate-45" : "-translate-y-1.5 group-hover:w-4"}`} />
                  <span className={`absolute h-px rounded-full bg-current transition-all duration-300 ${mobileMenuOpen ? "w-5 -rotate-45" : "w-4 group-hover:w-5"}`} />
                  <span className={`absolute h-px w-5 rounded-full bg-current transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : "translate-y-1.5 group-hover:w-3"}`} />
                </span>
              </button>
            </div>
          </nav>

          {searchOpen ? (
            <div className="mx-auto max-w-3xl px-6 pb-4 lg:px-10">
              <div className="glass-panel rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-4 shadow-2xl">
                <label className="flex items-center gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--background)]/40 px-3 py-3">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-[color:var(--accent)]" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="11" cy="11" r="6" />
                    <path d="M20 20L16.5 16.5" strokeLinecap="round" />
                  </svg>
                  <input
                    autoFocus
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search pages..."
                    className={`w-full bg-transparent text-sm outline-none ${strongText}`}
                  />
                </label>

                <div className="mt-3 space-y-2">
                  {filteredResults.length > 0 ? (
                    filteredResults.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => {
                          setSearchOpen(false);
                          setQuery("");
                        }}
                        className="block rounded-xl border border-[color:var(--border)] px-3 py-3 transition duration-300 hover:border-[color:var(--accent)]/50 hover:bg-[color:var(--accent-soft)]"
                      >
                        <p className={`font-medium ${strongText}`}>{item.label}</p>
                        <p className={`mt-1 text-sm ${mutedText}`}>{item.description}</p>
                      </Link>
                    ))
                  ) : (
                    <p className={`rounded-xl border border-dashed border-[color:var(--border)] px-3 py-3 text-sm ${mutedText}`}>
                      No matching pages found.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {mobileMenuOpen ? (
            <div id="mobile-navigation" className="border-t border-[color:var(--border)] px-6 py-3 md:hidden">
              <div className="mx-auto max-w-7xl space-y-1 rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-2">
                {navLinks.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-300 ${
                        active
                          ? "bg-[color:var(--accent-soft)] text-[color:var(--accent)]"
                          : isDark
                            ? "text-slate-300 hover:bg-white/5 hover:text-white"
                            : "text-slate-600 hover:bg-slate-900/5 hover:text-slate-900"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : null}
        </header>
      ) : null}

      <main className="relative mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
        {title ? (
          <section className="mb-10 animate-fade-up">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[color:var(--accent)]">
              Portfolio
            </p>
            <h1 className={`mt-3 text-3xl font-semibold sm:text-4xl ${strongText}`}>
              {title}
            </h1>
            {intro ? <p className={`mt-4 max-w-2xl text-lg leading-8 ${mutedText}`}>{intro}</p> : null}
          </section>
        ) : null}

        {children}
      </main>

      <footer className="border-t border-[color:var(--border)] px-6 py-10 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 text-center">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
          <p className={`text-sm ${mutedText}`}>
            {siteSettings.footerTagline}
          </p>
          <p className={`text-xs ${mutedText} opacity-70`}>
            © {new Date().getFullYear()} {siteSettings.ownerName}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
