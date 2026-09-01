"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import type { Project } from "../../lib/project-storage";

type ProjectsCarouselProps = {
  projects: Project[];
};

export default function ProjectsCarousel({ projects }: ProjectsCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);

  const slide = useCallback((direction: -1 | 1) => {
    const carousel = carouselRef.current;
    const firstCard = carousel?.firstElementChild as HTMLElement | null;
    if (!carousel || !firstCard) return;

    const styles = window.getComputedStyle(carousel);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0");
    const distance = firstCard.getBoundingClientRect().width + gap;
    const atStart = carousel.scrollLeft <= 1;
    const atEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 1;

    if (direction === 1 && atEnd) {
      carousel.scrollTo({ left: 0, behavior: "smooth" });
    } else if (direction === -1 && atStart) {
      carousel.scrollTo({ left: carousel.scrollWidth, behavior: "smooth" });
    } else {
      carousel.scrollBy({ left: direction * distance, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (projects.length < 2) return;

    const timer = window.setInterval(() => {
      if (!isPausedRef.current) slide(1);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [projects.length, slide]);

  return (
    <div
      className="relative mt-8"
      onMouseEnter={() => {
        isPausedRef.current = true;
      }}
      onMouseLeave={() => {
        isPausedRef.current = false;
      }}
      onFocus={() => {
        isPausedRef.current = true;
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          isPausedRef.current = false;
        }
      }}
    >
      <div
        ref={carouselRef}
        className="carousel-scrollbar-hidden flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth overscroll-x-contain"
        aria-label="Featured projects carousel"
      >
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            className="group relative flex w-full shrink-0 snap-start snap-always flex-col overflow-hidden rounded-[2rem] p-4 transition duration-500 hover:-translate-y-2 md:basis-[calc((100%_-_3rem)/3)]"
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
                      <span key={tech} className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] text-slate-100">
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

      {projects.length > 1 ? (
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => slide(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] text-[color:var(--foreground)] transition hover:border-cyan-400 hover:text-cyan-400"
            aria-label="Previous project"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            onClick={() => slide(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] text-[color:var(--foreground)] transition hover:border-cyan-400 hover:text-cyan-400"
            aria-label="Next project"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
