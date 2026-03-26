"use client";

import { useState } from "react";
import AmazonBanner from "@/components/AmazonBanner";
import AmazonProductStrip from "@/components/AmazonProductStrip";
import AccessoryCrossSell from "@/components/chat/AccessoryCrossSell";
import GuidedChat from "@/components/GuidedChat";
import {
  getAmazonCategoryUrl,
  getAmazonTodaysDealUrl,
} from "@/lib/amazon";
import { trackFormComplete } from "@/lib/tracking";
import type {
  FormData,
  RecommendationErrorState,
  RecommendationResponse,
  YoutubeInsightResponse,
} from "@/types";

const RECOMMENDATION_FALLBACK_ERROR: RecommendationErrorState = {
  type: "technical",
  message:
    "I’m refreshing your shortlist right now so I can return the strongest current matches. Please try again in a moment.",
};
const RECOMMENDATION_FETCH_TIMEOUT_MS = 45000;

function getRecommendationErrorState(payload: unknown): RecommendationErrorState {
  if (typeof payload === "object" && payload !== null) {
    const candidate = payload as Partial<RecommendationErrorState>;

    if (
      (candidate.type === "technical" || candidate.type === "no-match") &&
      typeof candidate.message === "string" &&
      candidate.message.trim()
    ) {
      return {
        type: candidate.type,
        message: candidate.message,
      };
    }

    if (typeof (payload as { error?: unknown }).error === "string") {
      return {
        type: "technical",
        message: (payload as { error: string }).error,
      };
    }
  }

  return RECOMMENDATION_FALLBACK_ERROR;
}

function getRecommendationErrorFromCatch(error: unknown): RecommendationErrorState {
  if (error instanceof Error && error.message.trim()) {
    return {
      type: "technical",
      message: error.message,
    };
  }

  return RECOMMENDATION_FALLBACK_ERROR;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState<RecommendationErrorState | null>(null);
  const [stripRefreshKey, setStripRefreshKey] = useState(0);

  const handleSubmit = async (data: FormData) => {
    setFormData(data);
    setLoading(true);
    setError(null);
    setResults(null);
    trackFormComplete(data);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, RECOMMENDATION_FETCH_TIMEOUT_MS);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        setError(getRecommendationErrorState(errBody));
        return;
      }

      const json: RecommendationResponse = await res.json();
      setResults(json);
      setStripRefreshKey((k) => k + 1);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError({
          type: "technical",
          message:
            "This shortlist is taking longer than expected, so I stopped the request instead of leaving you stuck on loading. Please try again or tweak your answers for a faster match.",
        });
      } else {
        setError(getRecommendationErrorFromCatch(err));
      }
    } finally {
      clearTimeout(timeoutId);
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

  const resultsFooterSlot = results ? (
    (currentPhoneIndex: number) => (
      <div className="space-y-3">
        <AccessoryCrossSell phoneName={results.phones[currentPhoneIndex]?.name ?? results.phones[0].name} />
        <AmazonProductStrip title="Popular phones on Amazon" refreshKey={stripRefreshKey} />
        <AmazonBanner
          title="Phone accessories worth exploring"
          subtitle="Cases, chargers, earphones & more"
          ctaText="Shop accessories"
          href="https://amzn.to/4d6TML1"
          placement="post_results_accessories"
          variant="accessories"
        />
      </div>
    )
  ) : null;

  const welcomeHeaderSlot = !results && !loading ? (
    <AmazonBanner
      title="Today's smartphone deals on Amazon India"
      subtitle="Limited-time offers updated daily"
      ctaText="Browse deals"
      href="https://amzn.to/4uSMIYI"
      placement="hero_idle"
      variant="deals"
      tone="integrated"
    />
  ) : null;

  const loadingAccessorySlot = loading ? (
    <AmazonBanner
      title="Explore all phones on Amazon India"
      subtitle="500+ models across every budget"
      ctaText="Browse phones"
      href="https://amzn.to/4rWISLx"
      placement="loading_interstitial"
      variant="search"
    />
  ) : null;

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden p-2 pb-10">
      <div className="min-h-0 flex-1 overflow-hidden">
        <GuidedChat
          loading={loading}
          results={results}
          error={error}
          onSubmitFinal={handleSubmit}
          onStartOver={handleStartOver}
          welcomeHeaderSlot={welcomeHeaderSlot}
          loadingAccessorySlot={loadingAccessorySlot}
          resultsFooterSlot={resultsFooterSlot}
          onFetchYoutubeInsights={handleFetchYoutubeInsights}
        />
      </div>
    </div>
  );
}
