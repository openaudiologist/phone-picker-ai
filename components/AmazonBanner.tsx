"use client";

import { useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  trackAffiliateBannerClick,
  trackAffiliateBannerImpression,
} from "@/lib/tracking";
import { cn } from "@/lib/utils";

interface AmazonBannerProps {
  title: string;
  subtitle: string;
  ctaText: string;
  href: string;
  placement: string;
  variant: "deals" | "search" | "accessories";
  tone?: "default" | "integrated";
}

const variantClasses: Record<AmazonBannerProps["variant"], string> = {
  deals: "bg-muted/35",
  search: "bg-muted/30",
  accessories: "bg-muted/35",
};

export default function AmazonBanner({
  title,
  subtitle,
  ctaText,
  href,
  placement,
  variant,
  tone = "default",
}: AmazonBannerProps) {
  useEffect(() => {
    trackAffiliateBannerImpression(placement);
  }, [placement]);

  const isIntegrated = tone === "integrated";

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(isIntegrated ? "mx-auto flex w-full max-w-[32rem] justify-center" : undefined)}
    >
      <Card
        size="sm"
        className={cn(
          "gap-0 py-0 data-[size=sm]:py-0",
          variantClasses[variant],
          isIntegrated &&
            "w-full max-w-[32rem] border-border/60 bg-card/70 shadow-none backdrop-blur-sm"
        )}
      >
        <CardContent
          className={cn(
            "flex flex-col items-start gap-3 py-3 sm:flex-row sm:items-center sm:justify-between",
            isIntegrated
              ? "px-3"
              : undefined
          )}
        >
          <div className="min-w-0 flex-1">
            {isIntegrated ? (
              <Badge variant="secondary" className="mb-2 text-[10px] uppercase tracking-wide text-muted-foreground">
                Sponsored pick
              </Badge>
            ) : (
              <div className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground/40">
                Sponsored
              </div>
            )}
            <div className={cn("font-medium text-foreground", isIntegrated ? "text-[0.95rem] leading-5" : "text-sm")}>
              {title}
            </div>
            <div className={cn("mt-0.5 text-muted-foreground", isIntegrated ? "text-[0.8rem]" : "text-xs")}>
              {subtitle}
            </div>
          </div>

          <Button
            variant={isIntegrated ? "secondary" : "outline"}
            size="sm"
            className="self-start sm:shrink-0"
            asChild
          >
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer sponsored"
              onClick={() => trackAffiliateBannerClick(placement, variant)}
            >
              {ctaText}
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
