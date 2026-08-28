"use client";

import { useEffect, useRef } from "react";

/**
 * Full-viewport, fixed animated backdrop: drifting aurora mesh gradients,
 * a faint perspective grid, film-grain noise, and a soft glow that tracks
 * the pointer. Pure CSS/transform driven so it stays cheap to paint.
 */
export default function AnimatedBackground() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    let targetX = 50;
    let targetY = 35;
    let currentX = 50;
    let currentY = 35;

    const handlePointerMove = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth) * 100;
      targetY = (event.clientY / window.innerHeight) * 100;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      glowRef.current?.style.setProperty("--pointer-x", `${currentX}%`);
      glowRef.current?.style.setProperty("--pointer-y", `${currentY}%`);
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="bg-scene" aria-hidden="true">
      <div className="bg-aurora bg-aurora-a" />
      <div className="bg-aurora bg-aurora-b" />
      <div className="bg-aurora bg-aurora-c" />
      <div className="bg-grid" />
      <div ref={glowRef} className="bg-pointer-glow" />
      <div className="bg-vignette" />
      <div className="bg-noise" />
    </div>
  );
}
