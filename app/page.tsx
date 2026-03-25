"use client";

import { useState } from "react";
import GuidedChat from "@/components/GuidedChat";
import { trackFormComplete } from "@/lib/tracking";
import type {
  FormData,
  RecommendationResponse,
  YoutubeInsightResponse,
} from "@/types";

export default function Home() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: FormData) => {
    setFormData(data);
    setLoading(true);
    setError(null);
    setResults(null);
    trackFormComplete(data);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errBody = await res.json();
        throw new Error(errBody.error || "Something went wrong");
      }

      const json: RecommendationResponse = await res.json();
      setResults(json);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to get recommendations"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    setFormData(null);
    setResults(null);
    setError(null);
  };

  const handleFetchYoutubeInsights = async (phoneNames: string[]) => {
    const responses = await Promise.all(
      phoneNames.map(async (phoneName) => {
        const res = await fetch("/api/youtube-insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneName }),
        });

        if (!res.ok) {
          const errorBody = await res.json().catch(() => null);
          throw new Error(errorBody?.error || `Failed to fetch YouTube insights for ${phoneName}`);
        }

        return (await res.json()) as YoutubeInsightResponse;
      })
    );

    return responses.filter((item) => item.videoCount > 0 || item.highlights.length > 0);
  };

  return (
    <div className="h-full overflow-hidden">
      <GuidedChat
        loading={loading}
        results={results}
        error={error}
        onSubmitFinal={handleSubmit}
        onStartOver={handleStartOver}
        onFetchYoutubeInsights={handleFetchYoutubeInsights}
      />
    </div>
  );
}
