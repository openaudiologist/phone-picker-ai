"use client";

import { useEffect, useRef } from "react";

export default function CosmicBg() {
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = starsRef.current;
    if (!container) return;

    // Clear any existing stars
    container.innerHTML = "";

    for (let i = 0; i < 55; i++) {
      const star = document.createElement("div");
      const size = Math.random() > 0.7 ? (Math.random() > 0.5 ? 2 : 1.5) : 1;
      const opacity = 0.3 + Math.random() * 0.7;
      const duration = 2 + Math.random() * 3;
      const delay = -(Math.random() * 3);

      star.style.cssText = `
        position: absolute;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: #fff;
        --star-opacity: ${opacity};
        opacity: ${opacity};
        animation: twinkle ${duration}s ease-in-out infinite;
        animation-delay: ${delay}s;
      `;

      container.appendChild(star);
    }
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Orb 1 — Purple */}
      <div
        style={{
          position: "fixed",
          zIndex: 0,
          pointerEvents: "none",
          width: 400,
          height: 400,
          top: -100,
          right: -80,
          background:
            "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />
      {/* Orb 2 — Blue */}
      <div
        style={{
          position: "fixed",
          zIndex: 0,
          pointerEvents: "none",
          width: 300,
          height: 300,
          bottom: 80,
          left: -80,
          background:
            "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />
      {/* Orb 3 — Pink */}
      <div
        style={{
          position: "fixed",
          zIndex: 0,
          pointerEvents: "none",
          width: 220,
          height: 220,
          top: "45%",
          left: "42%",
          background:
            "radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />
      {/* Stars container */}
      <div ref={starsRef} style={{ position: "absolute", inset: 0 }} />
    </div>
  );
}
