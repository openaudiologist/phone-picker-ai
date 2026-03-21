"use client";

import PhoneCard from "@/components/PhoneCard";
import type { RecommendationResponse } from "@/types";

interface PhoneResultsProps {
  results: RecommendationResponse;
  budget: number;
  onStartOver: () => void;
}

export default function PhoneResults({
  results,
  budget,
  onStartOver,
}: PhoneResultsProps) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div
        className="glass-card"
        style={{
          padding: "1rem",
          color: "rgba(255,255,255,0.55)",
          fontSize: 14,
          lineHeight: 1.65,
        }}
      >
        {results.summary}
      </div>

      {/* Phone cards grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {results.phones.map((phone, i) => (
          <PhoneCard
            key={phone.name}
            phone={phone}
            budget={budget}
            animationDelay={0.1 + i * 0.15}
          />
        ))}
      </div>

      {/* Start Over button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onStartOver}
          className="transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "0.5px solid rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.6)",
            borderRadius: 20,
            padding: "8px 24px",
            fontSize: 13,
            cursor: "pointer",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            e.currentTarget.style.color = "rgba(255,255,255,0.6)";
          }}
        >
          ← Start Over
        </button>
      </div>

      {/* Amazon disclaimer */}
      <div
        className="glass-card"
        style={{
          padding: "0.75rem 1rem",
          color: "rgba(255,255,255,0.25)",
          fontSize: 11,
          lineHeight: 1.6,
          textAlign: "center",
        }}
      >
        As an Amazon Associate, we earn from qualifying purchases. Prices shown
        are approximate and may vary. Product availability is subject to change.
        Click links to check current prices on Amazon India.
      </div>
    </div>
  );
}
