"use client";

import type { YoutubeInsightResponse } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card className="border-border/70 bg-card/85">
      <CardHeader className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">What people are saying</p>
        <CardTitle className="text-base">Review signals from YouTube</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">
          Quick YouTube review signals, fetched separately from the main recommendation flow.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">

      {loading ? (
        <p className="m-0 text-sm text-muted-foreground">
          Pulling recent review highlights…
        </p>
      ) : insights.length === 0 ? (
        <p className="m-0 text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      ) : (
        <div className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.phoneName} className="rounded-3xl border border-border/70 bg-secondary/35 p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <h4 className="m-0 text-sm font-semibold text-foreground">
                  {insight.phoneName}
                </h4>
                <span className="text-xs text-muted-foreground">
                  {insight.videoCount} review videos
                </span>
              </div>

              {insight.topChannels.length > 0 ? (
                <p className="mb-3 text-xs leading-5 text-muted-foreground">
                  Top channels: {insight.topChannels.join(", ")}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-2">
                {insight.highlights.map((highlight) => (
                  <Badge key={highlight} variant="outline" className="rounded-full px-3 py-1 text-xs leading-5 text-foreground">
                    {highlight}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      </CardContent>
    </Card>
  );
}
