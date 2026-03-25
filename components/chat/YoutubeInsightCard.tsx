"use client";

import { useEffect, useState } from "react";
import { BookOpenText, Loader2 } from "lucide-react";
import type { YoutubeInsightResponse } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const youtubeLoadingMessages = [
  "Scanning recent YouTube reviews",
  "Pulling standout review highlights",
  "Checking what reviewers keep repeating",
  "Summarizing the strongest review signals",
];

interface YoutubeInsightCardProps {
  insights: YoutubeInsightResponse[];
  loading?: boolean;
  emptyMessage?: string;
  bestMatchPhoneName?: string;
}

export default function YoutubeInsightCard({
  insights,
  loading = false,
  emptyMessage = "No review insights yet.",
  bestMatchPhoneName,
}: YoutubeInsightCardProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!loading) {
      setMessageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % youtubeLoadingMessages.length);
    }, 1800);

    return () => clearInterval(interval);
  }, [loading]);

  return (
    <Card>
      <CardHeader className="gap-1">
        <p className="text-xs font-medium text-muted-foreground">What people are saying</p>
        <CardTitle className="text-base">Review signals from YouTube</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

      {loading ? (
        <Card size="sm" className="gap-0 bg-muted/35 py-0 ring-1 ring-border/60">
          <CardContent className="flex items-center gap-2.5 p-3">
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
            <span className="text-sm leading-5 text-muted-foreground">
              {youtubeLoadingMessages[messageIndex]}
            </span>
          </CardContent>
        </Card>
      ) : insights.length === 0 ? (
        <CardDescription className="m-0 text-sm">
          {emptyMessage}
        </CardDescription>
      ) : (
        <div className="space-y-4">
          {insights.map((insight) => (
            <Card key={insight.phoneName} size="sm" className="gap-2 bg-muted/35 ring-1 ring-border/60">
              <CardHeader className="gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="min-w-0 text-sm font-semibold leading-5 text-foreground break-words">
                    {insight.phoneName}
                  </h4>
                  {bestMatchPhoneName === insight.phoneName ? (
                    <Badge variant="accent">Best match</Badge>
                  ) : null}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {insight.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="rounded-lg border border-border/70 bg-background/10 px-3 py-2"
                    >
                      <p className="text-xs leading-5 text-foreground break-words">
                        {highlight}
                      </p>
                    </div>
                  ))}
                </div>

                {insight.topChannels.length > 0 ? (
                  <>
                    <Separator className="bg-border/70" />
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <BookOpenText className="h-3.5 w-3.5" />
                        <span>Reference</span>
                      </div>
                      <CardDescription className="text-xs leading-5 break-words">
                        {insight.topChannels.join(", ")}
                      </CardDescription>
                    </div>
                  </>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      </CardContent>
    </Card>
  );
}
