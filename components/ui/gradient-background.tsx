"use client";

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function GradientBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const container = containerRef.current;
      if (container) {
        // Only show the gradient on the home page
        if (pathname === '/') {
          // Forzar un reflow para asegurar que se renderiza correctamente
          container.style.display = 'none';
          setTimeout(() => {
            container.style.display = 'block';
          }, 10);
        } else {
          container.style.display = 'none';
        }
      }
    }
  }, [pathname]);

  return (
    <div className="gradient-container" ref={containerRef}>
      <div className="gradient gradient-1"></div>
      <div className="gradient gradient-2"></div>
      <div className="gradient gradient-3"></div>
    </div>
  );
} 