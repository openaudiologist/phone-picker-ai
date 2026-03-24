"use client";

import type { YoutubeInsightResponse } from "@/types";

interface YoutubeInsightCardProps {
  insights: YoutubeInsightResponse[];
  loading?: boolean;
  emptyMessage?: string;
}

export default function YoutubeInsightCard({
  insights,
  loading = false,
  emptyMessage = "No review insights yet.",
}: YoutubeInsightCardProps) {
  return (
    <div className="glass-card space-y-4 p-4 sm:p-5">
      <div>
        <div className="section-kicker mb-2">What people are saying</div>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.6 }}>
          Quick YouTube review signals, fetched separately from the main recommendation flow.
        </p>
      </div>

      {loading ? (
        <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
          Pulling recent review highlights…
        </p>
      ) : insights.length === 0 ? (
        <p style={{ margin: 0, color: "rgba(255,255,255,0.45)", fontSize: 13 }}>
          {emptyMessage}
        </p>
      ) : (
        <div className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.phoneName} className="rounded-[24px] border border-white/8 bg-white/4 p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <h4 style={{ margin: 0, fontSize: 15, color: "#f1f0ff", fontWeight: 500 }}>
                  {insight.phoneName}
                </h4>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                  {insight.videoCount} review videos
                </span>
              </div>

              {insight.topChannels.length > 0 ? (
                <p style={{ margin: "0 0 10px", color: "rgba(255,255,255,0.48)", fontSize: 12, lineHeight: 1.5 }}>
                  Top channels: {insight.topChannels.join(", ")}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-2">
                {insight.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs leading-5 text-white/74"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
