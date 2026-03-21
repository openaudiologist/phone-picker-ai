"use client";

import { useEffect, useState } from "react";

const loadingMessages = [
  "Analysing your preferences…",
  "Searching 500+ phones…",
  "Comparing specs and prices…",
  "Finding your perfect match…",
];

export default function LoadingCards() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Loading text with spinner */}
      <div className="flex items-center justify-center gap-3 py-4">
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.1)",
            borderTopColor: "#8b5cf6",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
          {loadingMessages[messageIndex]}
        </span>
      </div>

      {/* 3 skeleton cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="glass-card p-6 space-y-4"
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            {/* Title skeleton */}
            <div
              style={{
                height: 14,
                width: "60%",
                borderRadius: 8,
                background: "rgba(255,255,255,0.06)",
                animation: "shimmer 1.5s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            />
            {/* Subtitle skeleton */}
            <div
              style={{
                height: 10,
                width: "40%",
                borderRadius: 8,
                background: "rgba(255,255,255,0.04)",
                animation: "shimmer 1.5s ease-in-out infinite",
                animationDelay: `${i * 0.2 + 0.1}s`,
              }}
            />
            {/* Content lines */}
            {[1, 2, 3].map((j) => (
              <div
                key={j}
                style={{
                  height: 8,
                  width: `${70 + Math.random() * 20}%`,
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.04)",
                  animation: "shimmer 1.5s ease-in-out infinite",
                  animationDelay: `${i * 0.2 + j * 0.1}s`,
                }}
              />
            ))}
            {/* Button skeleton */}
            <div
              style={{
                height: 36,
                width: "100%",
                borderRadius: 20,
                background: "rgba(255,255,255,0.04)",
                animation: "shimmer 1.5s ease-in-out infinite",
                animationDelay: `${i * 0.2 + 0.4}s`,
              }}
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
