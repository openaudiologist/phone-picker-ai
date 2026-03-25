"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const loadingMessages = [
  "Finding the best options for you",
  "Balancing camera, battery, and value",
  "Checking the strongest fits in your budget",
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
    <div className="space-y-4">
      <Card className="border-border/70 bg-card/85">
        <CardContent className="flex items-center gap-3 p-4">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">
          {loadingMessages[messageIndex]}
          </span>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <Card key={i} className="border-border/70 bg-card/80">
            <CardContent className="space-y-4 p-5">
              <Skeleton className="h-3 w-24 rounded-full" />
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-3">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((j) => (
                  <Skeleton key={j} className="h-14 rounded-xl" />
                ))}
              </div>

              <div className="space-y-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-center gap-3">
                    <Skeleton className="h-3 w-20 rounded-full" />
                    <Skeleton className="h-2 flex-1 rounded-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
