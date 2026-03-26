"use client";

import { ExternalLink, Headphones, Shield, Zap, Crown } from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getAccessoryUrl, BOUNTY_LINKS, handleAmazonDeepLink } from "@/lib/amazon";
import { trackAccessoryClick, trackBountyClick } from "@/lib/tracking";

interface AccessoryCrossSellProps {
  phoneName: string;
}

const ACCESSORY_CATEGORIES = [
  { key: "case", label: "Cases & Covers", query: "back cover case", icon: Shield },
  { key: "charger", label: "Fast Chargers", query: "fast charger", icon: Zap },
  { key: "earphones", label: "Earphones", query: "earphones", icon: Headphones },
  { key: "screenguard", label: "Screen Guards", query: "tempered glass screen protector", icon: Shield },
] as const;

export default function AccessoryCrossSell({ phoneName }: AccessoryCrossSellProps) {
  if (!phoneName) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="text-xs font-medium text-muted-foreground/70">
          Complete your setup
        </div>
        <span className="rounded-sm bg-muted/60 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-muted-foreground/50">
          Sponsored
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {ACCESSORY_CATEGORIES.map((cat, i) => {
          const href = getAccessoryUrl(phoneName, cat.query);
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="h-full"
            >
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer sponsored"
                onClick={(e) => { trackAccessoryClick(cat.key, "post_results"); handleAmazonDeepLink(href, e); }}
                className="block h-full"
              >
                <Card
                  size="sm"
                  className="flex h-full flex-col items-center gap-1.5 rounded-xl bg-muted/30 p-3 text-center transition-all hover:ring-1 hover:ring-ring/80"
                >
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <div className="text-xs font-medium text-foreground">{cat.label}</div>
                  <div className="mt-auto flex items-center gap-1 pt-1 text-[10px] text-muted-foreground">
                    <span>Shop</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </div>
                </Card>
              </a>
            </motion.div>
          );
        })}
      </div>

      <a
        href={BOUNTY_LINKS.prime}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={(e) => { trackBountyClick("prime"); handleAmazonDeepLink(BOUNTY_LINKS.prime, e); }}
        className="block"
      >
        <Card
          size="sm"
          className="flex flex-col items-center gap-2 rounded-xl bg-muted/30 p-4 text-center transition-all hover:ring-1 hover:ring-ring/80"
        >
          <Crown className="h-5 w-5 text-primary" />
          <div>
            <div className="text-sm font-medium text-foreground">
              Get free, fast delivery with Prime
            </div>
            <div className="text-xs text-muted-foreground">
              Free delivery, early deals & more on your new phone
            </div>
          </div>
          <Badge variant="outline" className="text-[10px]">
            Try Prime
          </Badge>
        </Card>
      </a>
    </section>
  );
}
