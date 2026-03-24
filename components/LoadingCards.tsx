"use client";

import { useEffect, useState } from "react";

const loadingMessages = [
  "Finding the best options for you",
  "Balancing camera, battery, and value",
  "Checking the strongest fits in your budget",
  "Polishing your shortlist",
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
    <div className="space-y-4">
      <div className="glass-card flex items-center gap-3 px-4 py-3.5">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "rgba(167,139,250,0.9)",
                animation: `typingPulse 1.2s ease-in-out ${dot * 0.14}s infinite`,
                display: "inline-block",
              }}
            />
          ))}
        </div>
        <span style={{ color: "rgba(255,255,255,0.58)", fontSize: 13, lineHeight: 1.6 }}>
          {loadingMessages[messageIndex]}
        </span>
      </div>

      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="glass-card space-y-4 p-5"
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            <div
              style={{
                height: 10,
                width: "22%",
                borderRadius: 999,
                background: "rgba(167,139,250,0.12)",
                animation: "shimmer 1.5s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            />
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1 space-y-3">
                <div
                  style={{
                    height: 16,
                    width: "52%",
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.06)",
                    animation: "shimmer 1.5s ease-in-out infinite",
                    animationDelay: `${i * 0.2 + 0.05}s`,
                  }}
                />
                <div
                  style={{
                    height: 12,
                    width: "34%",
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.04)",
                    animation: "shimmer 1.5s ease-in-out infinite",
                    animationDelay: `${i * 0.2 + 0.1}s`,
                  }}
                />
              </div>
              <div
                style={{
                  height: 16,
                  width: 74,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.06)",
                  animation: "shimmer 1.5s ease-in-out infinite",
                  animationDelay: `${i * 0.2 + 0.12}s`,
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((j) => (
                <div
                  key={j}
                  style={{
                    height: 54,
                    borderRadius: 16,
                    background: "rgba(255,255,255,0.035)",
                    animation: "shimmer 1.5s ease-in-out infinite",
                    animationDelay: `${i * 0.2 + j * 0.08}s`,
                  }}
                />
              ))}
            </div>

            <div className="space-y-2">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex items-center gap-3">
                  <div
                    style={{
                      height: 8,
                      width: 72,
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.04)",
                      animation: "shimmer 1.5s ease-in-out infinite",
                      animationDelay: `${i * 0.2 + j * 0.08}s`,
                    }}
                  />
                  <div
                    style={{
                      height: 6,
                      flex: 1,
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.04)",
                      animation: "shimmer 1.5s ease-in-out infinite",
                      animationDelay: `${i * 0.2 + j * 0.1}s`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes typingPulse {
          0%,
          80%,
          100% {
            opacity: 0.35;
            transform: translateY(0);
          }
          40% {
            opacity: 1;
            transform: translateY(-2px);
          }
        }
      `}</style>
    </div>
  );
}
