"use client";

import { useCallback, useEffect, useRef } from "react";
import type { Project } from "../../lib/project-storage";
import ProjectCard from "./project-card";

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
        {projects.map((project) => <ProjectCard key={project.id} project={project} carousel />)}
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
