"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Project } from "../../lib/project-storage";

export default function ProjectCard({ project, carousel = false }: { project: Project; carousel?: boolean }) {
  const [previewing, setPreviewing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (previewing) {
      video.currentTime = 0;
      void video.play().catch(() => setPreviewing(false));
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [previewing]);

  return (
    <Link
      href={`/projects/${project.slug}`}
      onMouseEnter={() => project.videoUrl && setPreviewing(true)}
      onMouseLeave={() => setPreviewing(false)}
      onFocus={() => project.videoUrl && setPreviewing(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPreviewing(false);
      }}
      className={`group relative flex flex-col overflow-hidden rounded-[2rem] p-4 transition duration-500 hover:-translate-y-2 ${carousel ? "w-full shrink-0 snap-start snap-always md:basis-[calc((100%_-_3rem)/3)]" : "w-full"}`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[color:var(--panel-strong)]">
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} featured image`}
            fill
            className={`object-cover transition duration-500 group-hover:scale-105 ${previewing && project.videoUrl ? "opacity-0" : "opacity-100"}`}
            unoptimized
          />
        ) : null}
        {project.videoUrl ? (
          <video
            ref={videoRef}
            src={project.videoUrl}
            muted
            loop
            playsInline
            preload="none"
            aria-label={`${project.title} animated preview`}
            className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${previewing ? "opacity-100" : "opacity-0"}`}
          />
        ) : null}

        {project.featured ? (
          <span className="absolute right-4 top-4 z-10 rounded-full bg-cyan-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-950">
            Featured
          </span>
        ) : null}

        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">{project.category}</p>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-200">{project.description}</p>
          {project.stack.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.stack.slice(0, 4).map((tech) => (
                <span key={tech} className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] text-slate-100">{tech}</span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between px-1">
        <h3 className="text-xl font-bold text-(--text-strong) transition duration-300 group-hover:text-cyan-400">{project.title}</h3>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-(--border) bg-(--panel-strong) text-(--text-strong) transition duration-300 group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:from-cyan-400 group-hover:to-indigo-500 group-hover:text-slate-950">
          <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M7 17L17 7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
