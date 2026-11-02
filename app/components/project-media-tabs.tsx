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
      {image && videoUrl ? (
        <div className="flex gap-2 border-b border-(--border) px-5 pt-4" role="tablist" aria-label={`${title} media`}>
          <button
            id="project-image-tab"
            type="button"
            role="tab"
            aria-selected={activeTab === "image"}
            aria-controls="project-image-panel"
            onClick={() => selectTab("image")}
            className={`rounded-t-xl border-b-2 px-4 py-2 text-sm font-semibold transition ${activeTab === "image" ? "border-cyan-400 text-cyan-300" : "border-transparent text-(--muted) hover:text-(--text-strong)"}`}
          >
            Portfolio image
          </button>
          <button
            id="project-video-tab"
            type="button"
            role="tab"
            aria-selected={activeTab === "video"}
            aria-controls="project-video-panel"
            onClick={() => selectTab("video")}
            className={`rounded-t-xl border-b-2 px-4 py-2 text-sm font-semibold transition ${activeTab === "video" ? "border-cyan-400 text-cyan-300" : "border-transparent text-(--muted) hover:text-(--text-strong)"}`}
          >
            Video
          </button>
        </div>
      ) : null}

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
    </div>
  );
}
