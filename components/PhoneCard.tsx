"use client";

import { useEffect, useState } from "react";
import { CartIcon } from "@/components/ui/cart";
import { ArrowRightIcon } from "@/components/ui/arrow-right";
import { SparklesIcon } from "@/components/ui/sparkles";
import { CpuIcon } from "@/components/ui/cpu";
import { BatteryIcon } from "@/components/ui/battery";
import { SettingsIcon } from "@/components/ui/settings";
import { LayersIcon } from "@/components/ui/layers";
import { MaximizeIcon } from "@/components/ui/maximize";
import { EyeIcon } from "@/components/ui/eye";
import { cn } from "@/lib/utils";
import { getBestAmazonUrl } from "@/lib/amazon";
import { trackPhoneClick } from "@/lib/tracking";
import SpecBadge from "@/components/SpecBadge";
import type { PhoneRecommendation } from "@/types";

interface PhoneCardProps {
  phone: PhoneRecommendation;
  budget: number;
  animationDelay?: number;
}

function ScoreBar({
  label,
  value,
  delay,
}: {
  label: string;
  value: number;
  delay: number;
}) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  const gradient =
    value >= 75
      ? "linear-gradient(90deg, #8b5cf6, #60a5fa)"
      : value >= 50
        ? "linear-gradient(90deg, #f472b6, #8b5cf6)"
        : "linear-gradient(90deg, #fb7185, #f472b6)";

  return (
    <div className="flex items-center gap-3">
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "rgba(255,255,255,0.35)",
          width: 96,
          flexShrink: 0,
          textTransform: "capitalize",
        }}
      >
        {label}
      </span>
      <div
        className="flex-1"
        style={{
          background: "rgba(255,255,255,0.07)",
          height: 3,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${width}%`,
            height: "100%",
            background: gradient,
            borderRadius: 2,
            transition: "width 0.8s ease-out",
          }}
        />
      </div>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "rgba(255,255,255,0.3)",
          width: 24,
          textAlign: "right",
        }}
      >
        {value}
      </span>
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
    <div
      className={cn(
        phone.isBestPick ? "glass-card-strong" : "glass-card",
        "p-5"
      )}
      style={{
        opacity: 0,
        animation: `fadeUp 0.5s ease-out ${animationDelay}s forwards`,
      }}
    >
      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Best pick badge — full width top */}
      {phone.isBestPick && (
        <div className="mb-4">
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(139,92,246,0.2)",
              border: "0.5px solid rgba(167,139,250,0.4)",
              borderRadius: 20,
              padding: "3px 12px",
              color: "#c4b5fd",
              fontSize: 11,
            }}
          >
            <SparklesIcon size={14} />
            Best Pick
          </div>
        </div>
      )}

      {/* 2-column layout */}
      <div className="flex gap-5">
        {/* LEFT: name, tagline, why, pros/cons, CTA */}
        <div className="flex flex-col gap-3 flex-[3] min-w-0">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <span
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "0.5px solid rgba(255,255,255,0.1)",
                borderRadius: 20,
                padding: "2px 10px",
                fontSize: 11,
                color: "rgba(255,255,255,0.45)",
              }}
            >
              #{phone.rank}
            </span>
            <span className="gradient-text" style={{ fontWeight: 600, fontSize: 16 }}>
              {phone.price}
            </span>
          </div>

          {/* Phone name */}
          <h3 style={{ fontSize: 18, fontWeight: 500, color: "#f1f0ff", margin: 0 }}>
            {phone.name}
          </h3>

          {/* Tagline */}
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0 }}>
            {phone.tagline}
          </p>

          {/* Why box */}
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "0.5px solid rgba(255,255,255,0.07)",
              borderRadius: 10,
              padding: "0.75rem 1rem",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "rgba(167,139,250,0.7)",
                letterSpacing: 1.5,
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              WHY WE PICKED THIS FOR YOU
            </div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: 0 }}>
              {phone.whyThisPhone}
            </p>
          </div>

          {/* Pros / Cons */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              {phone.pros.map((pro, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <ArrowRightIcon size={14} className="text-emerald-400" style={{ marginTop: 1, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{pro}</span>
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              {phone.cons.map((con, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <ArrowRightIcon size={14} className="text-rose-400" style={{ marginTop: 1, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{con}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Amazon CTA */}
          <button
            onClick={handleBuyClick}
            className="btn btn-amazon"
            style={{ marginTop: "auto" }}
          >
            <CartIcon size={16} />
            Buy on Amazon
            <ArrowRightIcon size={14} />
          </button>

          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 10, textAlign: "center", margin: 0 }}>
            Prices may vary
          </p>
        </div>

        {/* Divider */}
        <div style={{ width: "0.5px", background: "rgba(255,255,255,0.07)", flexShrink: 0 }} />

        {/* RIGHT: specs + score bars */}
        <div className="flex flex-col gap-4 flex-[2] min-w-0">
          {/* Specs grid */}
          <div className="grid grid-cols-2 gap-2">
            <SpecBadge label="Display" value={phone.specs.display} icon={<MaximizeIcon size={10} />} />
            <SpecBadge label="Processor" value={phone.specs.processor} icon={<CpuIcon size={10} />} />
            <SpecBadge label="Camera" value={phone.specs.camera} icon={<EyeIcon size={10} />} />
            <SpecBadge label="Battery" value={phone.specs.battery} icon={<BatteryIcon size={10} />} />
            <SpecBadge label="RAM" value={phone.specs.ram} icon={<LayersIcon size={10} />} />
            <SpecBadge label="OS" value={phone.specs.os} icon={<SettingsIcon size={10} />} />
          </div>

          {/* Score bars */}
          <div className="space-y-2">
            {Object.entries(phone.scores).map(([key, value], i) => (
              <ScoreBar
                key={key}
                label={key}
                value={value}
                delay={animationDelay * 1000 + 300 + i * 100}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
