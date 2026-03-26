"use client";

import { useState } from "react";
import {
  ArrowRight,
  Battery,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Layers3,
  MonitorSmartphone,
  ShoppingCart,
  Smartphone,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getBestAmazonUrl } from "@/lib/amazon";
import { trackPhoneClick } from "@/lib/tracking";
import { cn } from "@/lib/utils";
import type { PhoneRecommendation } from "@/types";

const layoutTransition = {
  duration: 0.24,
  ease: [0.22, 1, 0.36, 1] as const,
};

const contentTransition = {
  duration: 0.18,
  ease: "easeOut" as const,
};

interface PhoneCardProps {
  phone: PhoneRecommendation;
  budget: number;
  animationDelay?: number;
  pagination?: {
    currentIndex: number;
    total: number;
    onPrevious: () => void;
    onNext: () => void;
  };
}

function DetailList({
  items,
  icon,
  tone = "primary",
}: {
  items: string[];
  icon: React.ReactNode;
  tone?: "primary" | "muted";
}) {
  if (!items.length) return null;

  return (
    <div className="space-y-1.5">
      {items.slice(0, 3).map((item) => (
        <div key={item} className="flex items-start gap-2 text-[11px] leading-4 text-foreground sm:text-xs sm:leading-4">
          <span className={cn("mt-0.5", tone === "primary" ? "text-primary" : "text-muted-foreground")}>{icon}</span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

function SpecCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card size="sm" className="gap-0.5 bg-muted/40 ring-1 ring-border/60">
      <CardContent className="space-y-0.5 px-2.5 py-0 sm:px-3 sm:py-0">
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground sm:text-xs">
          <span className="opacity-70">{icon}</span>
          <span>{label}</span>
        </div>
        <div className="text-[11px] font-medium leading-4 text-foreground sm:text-xs sm:leading-4">{value}</div>
      </CardContent>
    </Card>
  );
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span className="capitalize">{label}</span>
        <span>{value}</span>
      </div>
      <Progress value={value} className="h-1.5 bg-muted" />
    </div>
  );
}

export default function PhoneCard({
  phone,
  budget,
  animationDelay = 0,
  pagination,
}: PhoneCardProps) {
  const [activeDetailTab, setActiveDetailTab] = useState<"scores" | "strengths" | "whyfits">("strengths");
  const amazonHref = getBestAmazonUrl(phone.amazonSearchQuery);

  const handleBuyClick = () => {
    trackPhoneClick(phone.name, phone.rank, budget);
  };

  const detailReasons = phone.matchReasons?.length ? phone.matchReasons : phone.pros;

  return (
    <Card
      size="sm"
      className={cn(
        "animate-in fade-in-0 slide-in-from-bottom-2 gap-2.5",
        phone.isBestPick && "ring-2 ring-primary/30"
      )}
      style={{ animationDelay: `${animationDelay}s` }}
    >
      <CardHeader className="space-y-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-medium leading-tight tracking-tight">
                {phone.name}
              </h3>
              {phone.isBestPick ? <Badge variant="accent">Best match</Badge> : null}
            </div>
          </div>

          {pagination ? (
            <div className="flex shrink-0 justify-end gap-1">
              <Button
                type="button"
                variant="secondary"
                size="icon-xs"
                onClick={pagination.onPrevious}
                disabled={pagination.currentIndex === 0}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon-xs"
                onClick={pagination.onNext}
                disabled={pagination.currentIndex === pagination.total - 1}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-2">
          <SpecCard label="Display" value={phone.specs.display} icon={<MonitorSmartphone className="h-3.5 w-3.5" />} />
          <SpecCard label="Processor" value={phone.specs.processor} icon={<Cpu className="h-3.5 w-3.5" />} />
          <SpecCard label="Camera" value={phone.specs.camera} icon={<Camera className="h-3.5 w-3.5" />} />
          <SpecCard label="Battery" value={phone.specs.battery} icon={<Battery className="h-3.5 w-3.5" />} />
          <SpecCard label="RAM" value={phone.specs.ram} icon={<Layers3 className="h-3.5 w-3.5" />} />
          <SpecCard label="OS" value={phone.specs.os} icon={<Smartphone className="h-3.5 w-3.5" />} />
        </div>
      </CardHeader>

      <CardContent className="space-y-2.5">
        <motion.div layout transition={layoutTransition} className="sm:hidden">
          <Card size="sm" className="flex w-full flex-col gap-2 bg-muted/35 ring-1 ring-border/60">
            <CardHeader className="gap-2">
              <div className="flex flex-wrap gap-1.5">
                <Button
                  type="button"
                  variant={activeDetailTab === "scores" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 rounded-full px-2.5 text-xs"
                  onClick={() => setActiveDetailTab("scores")}
                >
                  Scores
                </Button>
                <Button
                  type="button"
                  variant={activeDetailTab === "strengths" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 rounded-full px-2.5 text-xs"
                  onClick={() => setActiveDetailTab("strengths")}
                >
                  Strengths
                </Button>
                <Button
                  type="button"
                  variant={activeDetailTab === "whyfits" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 rounded-full px-2.5 text-xs"
                  onClick={() => setActiveDetailTab("whyfits")}
                >
                  Why this fits
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-1.5 overflow-hidden">
              <motion.div layout transition={layoutTransition} className="h-full">
                <AnimatePresence mode="wait" initial={false}>
                  {activeDetailTab === "scores" ? (
                    <motion.div
                      key="scores"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={contentTransition}
                      className="space-y-2.5"
                    >
                      {Object.entries(phone.scores).map(([key, value]) => (
                        <ScoreRow key={key} label={key} value={value} />
                      ))}
                    </motion.div>
                  ) : activeDetailTab === "strengths" ? (
                    <motion.div
                      key="strengths"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={contentTransition}
                      className="h-full"
                    >
                      <DetailList
                        items={detailReasons}
                        icon={<CheckCircle2 className="h-4 w-4" />}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="whyfits"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={contentTransition}
                      className="h-full"
                    >
                      <div className="space-y-1.5">
                        <CardDescription className="text-[11px] leading-4 text-foreground sm:text-xs sm:leading-4">
                          {phone.whyThisPhone}
                        </CardDescription>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div layout transition={layoutTransition} className="hidden grid-cols-2 items-stretch gap-2.5 sm:grid">
          <Card size="sm" className="flex h-full flex-col gap-2 bg-muted/35 ring-1 ring-border/60">
            <CardHeader className="gap-1.5">
              <Badge variant="outline">Scores</Badge>
            </CardHeader>
            <CardContent className="flex-1 space-y-2.5">
              {Object.entries(phone.scores).map(([key, value]) => (
                <ScoreRow key={key} label={key} value={value} />
              ))}
            </CardContent>
          </Card>

          <motion.div layout transition={layoutTransition} className="h-full">
            <Card size="sm" className="flex h-full flex-col gap-2 bg-muted/35 ring-1 ring-border/60">
              <CardHeader className="gap-2">
                <div className="flex flex-wrap gap-1.5">
                  <Button
                    type="button"
                    variant={activeDetailTab === "strengths" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 rounded-full px-2.5 text-xs"
                    onClick={() => setActiveDetailTab("strengths")}
                  >
                    Strengths
                  </Button>
                  <Button
                    type="button"
                    variant={activeDetailTab === "whyfits" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 rounded-full px-2.5 text-xs"
                    onClick={() => setActiveDetailTab("whyfits")}
                  >
                    Why this fits
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-1.5 overflow-hidden">
                <motion.div layout transition={layoutTransition} className="h-full">
                  <AnimatePresence mode="wait" initial={false}>
                    {activeDetailTab === "strengths" ? (
                      <motion.div
                        key="strengths"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={contentTransition}
                        className="h-full"
                      >
                        <DetailList
                          items={detailReasons}
                          icon={<CheckCircle2 className="h-4 w-4" />}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="whyfits"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={contentTransition}
                        className="h-full"
                      >
                        <div className="space-y-1.5">
                          <CardDescription className="text-[11px] leading-4 text-foreground sm:text-xs sm:leading-4">
                            {phone.whyThisPhone}
                          </CardDescription>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <div className="space-y-1">
          <Button asChild className="w-full">
            <a
              href={amazonHref}
              target="_blank"
              rel="noopener noreferrer sponsored"
              onClick={handleBuyClick}
              aria-label={`Check ${phone.name} on Amazon`}
            >
              <ShoppingCart className="h-4 w-4" />
              Check on Amazon
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Prices and availability subject to change
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
