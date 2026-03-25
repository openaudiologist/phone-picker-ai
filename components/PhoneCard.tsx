"use client";

import {
  ArrowRight,
  Battery,
  Camera,
  CheckCircle2,
  Cpu,
  Layers3,
  MonitorSmartphone,
  ShieldAlert,
  ShoppingCart,
  Smartphone,
  Sparkles,
} from "lucide-react";
import SpecBadge from "@/components/SpecBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { getBestAmazonUrl } from "@/lib/amazon";
import { trackPhoneClick } from "@/lib/tracking";
import { cn } from "@/lib/utils";
import type { PhoneRecommendation } from "@/types";

interface PhoneCardProps {
  phone: PhoneRecommendation;
  budget: number;
  animationDelay?: number;
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span className="capitalize">{label}</span>
        <span>{value}</span>
      </div>
      <Progress value={value} className="h-2 bg-muted" />
    </div>
  );
}

export default function PhoneCard({
  phone,
  budget,
  animationDelay = 0,
}: PhoneCardProps) {
  const handleBuyClick = () => {
    trackPhoneClick(phone.name, phone.rank, budget);
    window.open(getBestAmazonUrl(phone.amazonSearchQuery), "_blank", "noopener,noreferrer");
  };

  return (
    <Card
      className={cn(
        "border-border/70 bg-card/90 shadow-lg animate-in fade-in-0 slide-in-from-bottom-2",
        phone.isBestPick && "ring-1 ring-ring/40"
      )}
      style={{ animationDelay: `${animationDelay}s` }}
    >
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-full px-3 py-1">#{phone.rank}</Badge>
            <Badge variant="outline" className="rounded-full px-3 py-1">{phone.brand}</Badge>
            {phone.isBestPick ? (
              <Badge className="rounded-full px-3 py-1">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                Best pick
              </Badge>
            ) : null}
            {typeof phone.matchScore === "number" ? (
              <Badge variant="outline" className="rounded-full px-3 py-1">
                Match {phone.matchScore}
              </Badge>
            ) : null}
          </div>

          <Badge variant="secondary" className="rounded-full px-3 py-1.5 text-sm font-semibold text-foreground">
            {phone.price}
          </Badge>
        </div>

        <div className="space-y-2">
          <CardTitle className="text-2xl">{phone.name}</CardTitle>
          <CardDescription className="text-sm leading-6">{phone.tagline}</CardDescription>
        </div>

        {phone.bestFor?.length ? (
          <div className="flex flex-wrap gap-2">
            {phone.bestFor.map((tag) => (
              <Badge key={tag} variant="outline" className="rounded-full px-3 py-1">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_auto_1fr]">
          <div className="space-y-5">
            <div className="rounded-3xl border border-border/70 bg-secondary/35 p-4">
              <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Why this fits
              </div>
              <p className="text-sm leading-6 text-foreground">{phone.whyThisPhone}</p>
            </div>

            {phone.matchReasons?.length ? (
              <div className="space-y-2">
                <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Match reasons
                </div>
                <ul className="space-y-2">
                  {phone.matchReasons.map((reason) => (
                    <li key={reason} className="flex items-start gap-2 text-sm leading-6 text-foreground">
                      <CheckCircle2 className="mt-1 h-4 w-4 text-primary" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-border/70 bg-secondary/35 p-4">
                <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Pros
                </div>
                <ul className="space-y-2">
                  {phone.pros.map((pro, index) => (
                    <li key={`${pro}-${index}`} className="flex items-start gap-2 text-sm leading-6 text-foreground">
                      <CheckCircle2 className="mt-1 h-4 w-4 text-primary" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-border/70 bg-secondary/35 p-4">
                <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Cons
                </div>
                <ul className="space-y-2">
                  {phone.cons.map((con, index) => (
                    <li key={`${con}-${index}`} className="flex items-start gap-2 text-sm leading-6 text-foreground">
                      <ShieldAlert className="mt-1 h-4 w-4 text-muted-foreground" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {phone.avoidIf?.length ? (
              <div className="rounded-3xl border border-border/70 bg-secondary/35 p-4">
                <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Avoid if
                </div>
                <ul className="space-y-2">
                  {phone.avoidIf.map((reason) => (
                    <li key={reason} className="text-sm leading-6 text-muted-foreground">{reason}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <Separator orientation="vertical" className="hidden lg:block" />

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <SpecBadge label="Display" value={phone.specs.display} icon={<MonitorSmartphone className="h-3 w-3" />} />
              <SpecBadge label="Processor" value={phone.specs.processor} icon={<Cpu className="h-3 w-3" />} />
              <SpecBadge label="Camera" value={phone.specs.camera} icon={<Camera className="h-3 w-3" />} />
              <SpecBadge label="Battery" value={phone.specs.battery} icon={<Battery className="h-3 w-3" />} />
              <SpecBadge label="RAM" value={phone.specs.ram} icon={<Layers3 className="h-3 w-3" />} />
              <SpecBadge label="OS" value={phone.specs.os} icon={<Smartphone className="h-3 w-3" />} />
            </div>

            <div className="rounded-3xl border border-border/70 bg-secondary/35 p-4">
              <div className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Scores
              </div>
              <div className="space-y-3">
                {Object.entries(phone.scores).map(([key, value]) => (
                  <ScoreRow key={key} label={key} value={value} />
                ))}
              </div>
            </div>

            <Button onClick={handleBuyClick} className="w-full rounded-full">
              <ShoppingCart className="h-4 w-4" />
              Check on Amazon
              <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="text-center text-xs text-muted-foreground">Prices may vary</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
