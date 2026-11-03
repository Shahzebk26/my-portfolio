"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type ProjectMediaTabsProps = {
  title: string;
  image: string;
  videoUrl?: string;
};

export default function ProjectMediaTabs({ title, image, videoUrl }: ProjectMediaTabsProps) {
  const initialTab = image ? "image" : "video";
  const [activeTab, setActiveTab] = useState<"image" | "video">(initialTab);
  const videoRef = useRef<HTMLVideoElement>(null);

  function selectTab(tab: "image" | "video") {
    setActiveTab(tab);
    if (tab === "video") {
      void videoRef.current?.play().catch(() => {
        // Browser playback policies may require the visitor to press play.
      });
    } else {
      videoRef.current?.pause();
    }
  }

  return (
    <div>
      <div className="relative aspect-video w-full bg-(--panel-strong)">
        {image ? (
          <div
            id="project-image-panel"
            role={image && videoUrl ? "tabpanel" : undefined}
            aria-labelledby={image && videoUrl ? "project-image-tab" : undefined}
            hidden={activeTab !== "image"}
            className="absolute inset-0"
          >
            <Image src={image} alt={`${title} portfolio image`} fill unoptimized priority className="object-cover" />
          </div>
        ) : null}
        {videoUrl ? (
          <div
            id="project-video-panel"
            role={image && videoUrl ? "tabpanel" : undefined}
            aria-labelledby={image && videoUrl ? "project-video-tab" : undefined}
            hidden={activeTab !== "video"}
            className="absolute inset-0"
          >
            <video
              ref={videoRef}
              src={videoUrl}
              poster={image || undefined}
              controls
              playsInline
              preload="metadata"
              className="h-full w-full object-contain"
            />
          </div>
        ) : null}
        {!image && !videoUrl ? <div className="h-full w-full" /> : null}
      </div>

      {image && videoUrl ? (
        <div className="flex gap-3 overflow-x-auto bg-slate-950/50 px-4 py-4 sm:gap-4 sm:px-6 sm:py-5" role="tablist" aria-label={`${title} media`}>
          <button
            id="project-image-tab"
            type="button"
            role="tab"
            aria-selected={activeTab === "image"}
            aria-controls="project-image-panel"
            onClick={() => selectTab("image")}
            className={`group relative h-20 w-32 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-24 sm:w-40 ${activeTab === "image" ? "border-orange-400 shadow-lg shadow-orange-500/15" : "border-white/10 opacity-75 hover:border-white/40 hover:opacity-100"}`}
          >
            <span className="absolute inset-0">
              <Image src={image} alt="" fill unoptimized className="object-cover transition group-hover:scale-105" />
            </span>
            <span className="absolute inset-x-0 bottom-0 bg-slate-950/75 px-2 py-1 text-left text-[10px] font-semibold text-white sm:text-xs">Portfolio image</span>
          </button>
          <button
            id="project-video-tab"
            type="button"
            role="tab"
            aria-selected={activeTab === "video"}
            aria-controls="project-video-panel"
            onClick={() => selectTab("video")}
            className={`group relative flex h-20 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 transition sm:h-24 sm:w-40 ${activeTab === "video" ? "border-orange-400 shadow-lg shadow-orange-500/15" : "border-white/10 opacity-75 hover:border-white/40 hover:opacity-100"}`}
          >
            <span className="absolute inset-0">
              {image ? <Image src={image} alt="" fill unoptimized className="object-cover blur-[1px] transition group-hover:scale-105" /> : <video src={videoUrl} muted preload="none" className="h-full w-full object-cover" />}
              <span className="absolute inset-0 bg-slate-950/45" />
            </span>
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-950 shadow sm:h-10 sm:w-10" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4 sm:h-5 sm:w-5" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            </span>
            <span className="absolute inset-x-0 bottom-0 bg-slate-950/75 px-2 py-1 text-left text-[10px] font-semibold text-white sm:text-xs">Animation video</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
