"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const loadingMessages = [
  "Finding the best options for you",
  "Balancing camera, battery, and value",
  "Checking your best fits",
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
    <div className="space-y-3">
      <Card size="sm" className="gap-0 py-0 bg-muted/35 ring-1 ring-border/60">
        <CardContent className="flex items-center gap-2.5 p-3">
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
          <span className="text-sm leading-5 text-muted-foreground">
            {loadingMessages[messageIndex]}
          </span>
        </CardContent>
      </Card>

      <Card size="sm" className="gap-2.5 ring-1 ring-border/60">
        <CardHeader className="space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1.5">
              <Skeleton className="h-7 w-36 rounded-lg sm:h-8 sm:w-44" />
              <Skeleton className="h-5 w-24 rounded-md" />
            </div>
            <div className="flex shrink-0 gap-1">
              <Skeleton className="size-6 rounded-[10px]" />
              <Skeleton className="size-6 rounded-[10px]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-2">
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="rounded-xl bg-muted/40 px-2.5 py-2.5 ring-1 ring-border/60 sm:px-3">
                <Skeleton className="mb-1 h-3 w-12 rounded-sm" />
                <Skeleton className="h-7 w-full rounded-md" />
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            <Card size="sm" className="gap-2 bg-muted/35 ring-1 ring-border/60">
              <CardHeader className="gap-1.5">
                <Skeleton className="h-5 w-14 rounded-full" />
              </CardHeader>
              <CardContent className="space-y-2.5">
                {[0, 1, 2, 3, 4].map((item) => (
                  <div key={item} className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <Skeleton className="h-3 w-14 rounded-sm" />
                      <Skeleton className="h-3 w-6 rounded-sm" />
                    </div>
                    <Skeleton className="h-1.5 w-full rounded-full" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card size="sm" className="gap-2 bg-muted/35 ring-1 ring-border/60">
              <CardHeader className="gap-2">
                <div className="flex flex-wrap gap-1.5">
                  <Skeleton className="h-7 w-20 rounded-full" />
                  <Skeleton className="h-7 w-24 rounded-full" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <Skeleton className="mt-0.5 size-4 rounded-full" />
                    <Skeleton className="h-10 flex-1 rounded-md" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-1">
            <Skeleton className="h-8 w-full rounded-lg" />
            <Skeleton className="mx-auto h-3 w-24 rounded-sm" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
