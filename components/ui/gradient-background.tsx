"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function GradientBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const container = containerRef.current;
      if (container) {
        // Show gradient on home page OR when coming soon mode is active
        const isComingSoonMode = process.env.NEXT_PUBLIC_COMING_SOON === "true";
        if (pathname === "/" || isComingSoonMode) {
          // Forzar un reflow para asegurar que se renderiza correctamente
          container.style.display = "none";
          setTimeout(() => {
            container.style.display = "block";
          }, 10);
        } else {
          container.style.display = "none";
        }
      }
    }
  }, [pathname]);

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen -z-50 pointer-events-none overflow-hidden"
      ref={containerRef}
    >
      <div className="gradient gradient-1"></div>
      <div className="gradient gradient-2"></div>
      <div className="gradient gradient-3"></div>
    </div>
  );
}
