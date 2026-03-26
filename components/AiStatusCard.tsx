"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AiStatusCardProps {
  messages: readonly string[];
  intervalMs?: number;
  className?: string;
}

export default function AiStatusCard({
  messages,
  intervalMs = 1800,
  className,
}: AiStatusCardProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    setMessageIndex(0);

    if (messages.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, intervalMs);

    return () => window.clearInterval(interval);
  }, [intervalMs, messages]);

  return (
    <Card
      size="sm"
      className={[
        "gap-0 py-0 data-[size=sm]:py-0 bg-muted/35 ring-1 ring-border/60",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <CardContent className="flex items-center gap-2.5 p-3">
        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
        <span className="text-sm leading-5 text-muted-foreground">
          {messages[messageIndex]}
        </span>
      </CardContent>
    </Card>
  );
}