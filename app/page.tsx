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
    <div className="relative z-[1] min-h-screen px-0 pb-0 pt-0 sm:px-4 sm:pb-4 sm:pt-4 lg:px-6 lg:pb-6 lg:pt-6">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col sm:min-h-[calc(100vh-2rem)] lg:min-h-[calc(100vh-3rem)]">
        <header className="sticky top-0 z-20 px-3 py-3 sm:px-0 sm:py-0">
          <div className="glass-card-strong flex items-center justify-between gap-4 px-4 py-4 sm:px-5">
            <div className="min-w-0">
              <div className="section-kicker mb-1">Guided AI phone assistant</div>
              <div className="flex items-center gap-2">
                <h1 className="truncate text-lg font-medium text-[#f7f4ff] sm:text-xl">
                  PhonePicker AI
                </h1>
                <span className="hidden rounded-full border border-violet-300/20 bg-violet-400/10 px-2.5 py-1 text-[11px] text-violet-100/80 sm:inline-flex">
                  Mobile-first
                </span>
              </div>
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              {[
                "India prices",
                "No typing",
                loading ? "Thinking…" : results ? "3 matches ready" : "Structured flow",
              ].map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/55"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </header>

        <main className="flex min-h-0 flex-1">
          <GuidedChat
            loading={loading}
            results={results}
            error={error}
            onSubmitFinal={handleSubmit}
            onStartOver={handleStartOver}
            onFetchYoutubeInsights={handleFetchYoutubeInsights}
          />
        </main>
      </div>
    </div>
  );
}
