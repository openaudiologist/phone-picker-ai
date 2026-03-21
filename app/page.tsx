"use client";

import { useState } from "react";
import StepForm from "@/components/StepForm";
import PhoneResults from "@/components/PhoneResults";
import LoadingCards from "@/components/LoadingCards";
import { trackFormComplete } from "@/lib/tracking";
import type { FormData, RecommendationResponse } from "@/types";

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

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-14"
      style={{ position: "relative", zIndex: 1 }}
    >
      {/* Hero section */}
      {!results && !loading && (
        <div className="text-center mb-14 space-y-6">
          {/* Badge */}
          <div className="flex justify-center">
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(139,92,246,0.12)",
                border: "0.5px solid rgba(139,92,246,0.25)",
                borderRadius: 20,
                padding: "5px 14px",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#a78bfa",
                  animation: "pulse-star 2s ease-in-out infinite",
                  display: "inline-block",
                }}
              />
              <span style={{ color: "#c4b5fd", fontSize: 11 }}>
                Free · AI Powered · No Signup
              </span>
            </div>
          </div>

          {/* H1 */}
          <h1
            style={{
              fontSize: "clamp(34px, 6vw, 52px)",
              fontWeight: 500,
              color: "#f1f0ff",
              lineHeight: 1.1,
            }}
          >
            Find your perfect{" "}
            <span className="gradient-text">phone</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: 15,
              maxWidth: 440,
              margin: "12px auto 0",
              lineHeight: 1.7,
            }}
          >
            Answer 5 quick questions and our AI will recommend the top 3 phones
            matched to your needs — with real Amazon prices.
          </p>

          {/* Trust pills */}
          <div className="flex justify-center gap-3 flex-wrap pt-1">
            {["🇮🇳 India prices", "⚡ 60 seconds", "🔒 No data stored"].map(
              (pill) => (
                <span
                  key={pill}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "0.5px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.45)",
                    borderRadius: 20,
                    padding: "5px 14px",
                    fontSize: 12,
                  }}
                >
                  {pill}
                </span>
              )
            )}
          </div>
        </div>
      )}

      {/* Conditional render */}
      {!results && !loading && !error && <StepForm onSubmit={handleSubmit} />}

      {loading && <LoadingCards />}

      {error && !loading && (
        <div className="glass-card p-6 text-center space-y-4">
          <p style={{ color: "#fb7185", fontSize: 14 }}>{error}</p>
          <button
            onClick={() => formData && handleSubmit(formData)}
            className="btn btn-primary"
          >
            Try Again
          </button>
          <button
            onClick={handleStartOver}
            className="btn btn-link block mx-auto"
          >
            Start Over
          </button>
        </div>
      )}

      {results && formData && (
        <PhoneResults
          results={results}
          budget={formData.budget}
          onStartOver={handleStartOver}
        />
      )}
    </div>
  );
}
