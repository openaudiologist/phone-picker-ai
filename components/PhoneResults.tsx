"use client";

import PhoneCard from "@/components/PhoneCard";
import { ArrowLeftIcon } from "@/components/ui/arrow-left";
import { SparklesIcon } from "@/components/ui/sparkles";
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
      {/* Summary with animated gradient border */}
      <div className="summary-gradient-border">
        <div className="summary-gradient-inner">
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <SparklesIcon size={16} style={{ flexShrink: 0, marginTop: 2, color: "#a78bfa" }} />
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.65, margin: 0 }}>
              {results.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Phone cards stacked */}
      <div className="flex flex-col gap-4">
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
        <button onClick={onStartOver} className="btn btn-ghost">
          <ArrowLeftIcon size={14} />
          Start Over
        </button>
      </div>


    </div>
  );
}
