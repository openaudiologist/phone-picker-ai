"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { getBestAmazonUrl, handleAmazonDeepLink } from "@/lib/amazon";
import { trackPhoneClick } from "@/lib/tracking";
import type { AmazonMarketPick } from "@/types";

interface AmazonProductStripProps {
  title?: string;
  refreshKey?: number;
}

const EDGE_OFFSET = 8;

const CARD_WIDTH = 176;
const CARD_GAP = 12; // gap-3
const SCROLL_STEP = CARD_WIDTH + CARD_GAP;

function LoadingCard() {
  return (
    <Card
      size="sm"
      className="flex h-full w-[176px] flex-col gap-2 rounded-xl bg-muted/30 p-3 ring-1 ring-border/60"
    >
      <Skeleton className="h-5 w-20 rounded-full" />
      <Skeleton className="h-11 w-full rounded-md" />
      <Skeleton className="h-4 w-24 rounded-md" />
      <Skeleton className="mt-auto h-4 w-20 rounded-md" />
    </Card>
  );
}

export default function AmazonProductStrip({
  title = "Popular right now",
  refreshKey = 0,
}: AmazonProductStripProps) {
  const scrollAreaRef = React.useRef<HTMLDivElement | null>(null);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);
  const [phones, setPhones] = React.useState<AmazonMarketPick[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const abortController = new AbortController();

    const loadPicks = async () => {
      try {
        setLoading(true);
        setHasError(false);

        const response = await fetch("/api/amazon-picks", {
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load Amazon picks");
        }

        const json = (await response.json()) as { phones?: AmazonMarketPick[] };
        setPhones(Array.isArray(json.phones) ? json.phones : []);
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }

        console.error("Failed to load Amazon picks", error);
        setPhones([]);
        setHasError(true);
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void loadPicks();

    return () => abortController.abort();
  }, [refreshKey]);

  const getViewport = React.useCallback(() => {
    return (
      scrollAreaRef.current?.querySelector<HTMLElement>(
        '[data-slot="scroll-area-viewport"]'
      ) ?? null
    );
  }, []);

  const updateScrollState = React.useCallback(() => {
    const viewport = getViewport();

    if (!viewport) {
      setCanScrollPrev(false);
      setCanScrollNext(false);
      return;
    }

    const maxScrollLeft = viewport.scrollWidth - viewport.clientWidth;

    setCanScrollPrev(viewport.scrollLeft > EDGE_OFFSET);
    setCanScrollNext(viewport.scrollLeft < maxScrollLeft - EDGE_OFFSET);
  }, [getViewport]);

  React.useEffect(() => {
    const viewport = getViewport();

    if (!viewport) {
      return;
    }

    updateScrollState();

    const handleScroll = () => updateScrollState();
    viewport.addEventListener("scroll", handleScroll, { passive: true });

    const resizeObserver = new ResizeObserver(() => updateScrollState());
    resizeObserver.observe(viewport);

    const content = viewport.firstElementChild;
    if (content instanceof HTMLElement) {
      resizeObserver.observe(content);
    }

    return () => {
      viewport.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, [getViewport, updateScrollState]);

  const scrollByPage = React.useCallback(
    (direction: "prev" | "next") => {
      const viewport = getViewport();

      if (!viewport) {
        return;
      }

      viewport.scrollBy({
        left: direction === "next" ? SCROLL_STEP : -SCROLL_STEP,
        behavior: "smooth",
      });
    },
    [getViewport]
  );

  if (!loading && (hasError || phones.length === 0)) {
    return null;
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="text-xs font-medium text-muted-foreground/70">
            {title}
          </div>
          <span className="rounded-sm bg-muted/60 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-muted-foreground/50">
            Sponsored
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="bg-background/70"
            aria-label="Scroll Amazon picks left"
            onClick={() => scrollByPage("prev")}
            disabled={!canScrollPrev}
          >
            <ChevronLeft />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="bg-background/70"
            aria-label="Scroll Amazon picks right"
            onClick={() => scrollByPage("next")}
            disabled={!canScrollNext}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      <div
        ref={scrollAreaRef}
        className="rounded-xl border border-border/60 bg-muted/15"
      >
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max gap-3 p-1.5">
            {loading
              ? Array.from({ length: 4 }, (_, index) => <LoadingCard key={`loading-${index}`} />)
              : phones.map((phone, index) => {
                  const href = getBestAmazonUrl(phone.amazonSearchQuery);

                  return (
                    <motion.div
                      key={phone.name}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className="shrink-0"
                    >
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        onClick={(e) => { trackPhoneClick(phone.name, index + 1, 0); handleAmazonDeepLink(href, e); }}
                        className="block"
                      >
                        <Card
                          size="sm"
                          className="flex h-full w-[176px] flex-col gap-2 rounded-xl bg-muted/30 p-3 transition-all hover:ring-1 hover:ring-ring/80"
                        >
                          <Badge variant="outline" className="w-fit rounded-full px-2 py-0.5 text-[10px] font-medium text-foreground/90">
                            {phone.tag}
                          </Badge>
                          <div className="line-clamp-2 min-h-[2.75rem] text-base font-medium leading-tight tracking-tight text-foreground whitespace-normal">
                            {phone.name}
                          </div>
                          <div className="mt-auto flex items-center gap-1 pt-2 text-xs text-muted-foreground">
                            <span>View on Amazon</span>
                            <ExternalLink className="h-3 w-3" />
                          </div>
                        </Card>
                      </a>
                    </motion.div>
                  );
                })}
          </div>
        </ScrollArea>
      </div>
    </section>
  );
}
