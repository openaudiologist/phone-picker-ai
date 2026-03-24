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
        "overflow-hidden p-5 sm:p-6"
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

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/45">
            #{phone.rank}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/55">
            {phone.brand}
          </span>
          {phone.isBestPick ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-violet-300/30 bg-violet-400/15 px-3 py-1 text-[11px] text-violet-100">
              <SparklesIcon size={13} />
              Best pick
            </span>
          ) : null}
          {typeof phone.matchScore === "number" ? (
            <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-[11px] text-emerald-200/90">
              Match {phone.matchScore}
            </span>
          ) : null}
        </div>

        <div className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm font-semibold text-white/92 shadow-[0_10px_24px_rgba(6,4,15,0.22)]">
          {phone.price}
        </div>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-[1.2] space-y-4">
          <div className="space-y-2">
            <h3 style={{ fontSize: 22, fontWeight: 500, color: "#f1f0ff", margin: 0 }}>
              {phone.name}
            </h3>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", margin: 0, lineHeight: 1.65 }}>
              {phone.tagline}
            </p>
          </div>

          {phone.bestFor?.length ? (
            <div className="flex flex-wrap gap-2">
              {phone.bestFor.map((tag) => (
                <span
                  key={tag}
                  style={{
                    background: "rgba(96,165,250,0.1)",
                    border: "0.5px solid rgba(96,165,250,0.16)",
                    borderRadius: 999,
                    padding: "4px 10px",
                    color: "rgba(191,219,254,0.9)",
                    fontSize: 11,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {/* Why box */}
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "0.5px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: "1rem 1rem",
            }}
          >
            <div className="section-kicker" style={{ marginBottom: 8 }}>Why this fits</div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: 0 }}>
              {phone.whyThisPhone}
            </p>
          </div>

          {phone.matchReasons?.length ? (
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  textTransform: "uppercase",
                  letterSpacing: 1.2,
                  color: "rgba(96,165,250,0.75)",
                  marginBottom: 6,
                }}
              >
                Match reasons
              </div>
              <div className="space-y-1.5">
                {phone.matchReasons.map((reason) => (
                  <div key={reason} className="flex items-start gap-1.5">
                    <ArrowRightIcon size={14} className="text-sky-400" style={{ marginTop: 1, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Pros / Cons */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[20px] border border-emerald-300/10 bg-emerald-400/5 p-4">
              <div className="section-kicker" style={{ color: "rgba(110,231,183,0.72)", marginBottom: 8 }}>
                Pros
              </div>
              <div className="space-y-2">
                {phone.pros.map((pro, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <ArrowRightIcon size={14} className="text-emerald-300" style={{ marginTop: 1, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.55 }}>{pro}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[20px] border border-rose-300/10 bg-rose-400/5 p-4">
              <div className="section-kicker" style={{ color: "rgba(251,113,133,0.72)", marginBottom: 8 }}>
                Cons
              </div>
              <div className="space-y-2">
                {phone.cons.map((con, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <ArrowRightIcon size={14} className="text-rose-300" style={{ marginTop: 1, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.55 }}>{con}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {phone.avoidIf?.length ? (
            <div
              style={{
                background: "rgba(251,113,133,0.06)",
                border: "0.5px solid rgba(251,113,133,0.12)",
                borderRadius: 10,
                padding: "0.75rem 1rem",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  textTransform: "uppercase",
                  letterSpacing: 1.2,
                  color: "rgba(251,113,133,0.72)",
                  marginBottom: 6,
                }}
              >
                Avoid if
              </div>
              <div className="space-y-1.5">
                {phone.avoidIf.map((reason) => (
                  <p key={reason} style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.52)", lineHeight: 1.55 }}>
                    {reason}
                  </p>
                ))}
              </div>
            </div>
          ) : null}

        </div>

        <div className="hidden lg:block" style={{ width: "0.5px", background: "rgba(255,255,255,0.07)", flexShrink: 0, alignSelf: "stretch" }} />

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="grid grid-cols-2 gap-2">
            <SpecBadge label="Display" value={phone.specs.display} icon={<MaximizeIcon size={10} />} />
            <SpecBadge label="Processor" value={phone.specs.processor} icon={<CpuIcon size={10} />} />
            <SpecBadge label="Camera" value={phone.specs.camera} icon={<EyeIcon size={10} />} />
            <SpecBadge label="Battery" value={phone.specs.battery} icon={<BatteryIcon size={10} />} />
            <SpecBadge label="RAM" value={phone.specs.ram} icon={<LayersIcon size={10} />} />
            <SpecBadge label="OS" value={phone.specs.os} icon={<SettingsIcon size={10} />} />
          </div>

          <div className="rounded-[22px] border border-white/8 bg-white/4 p-4">
            <div className="section-kicker mb-3">Scores</div>
            <div className="space-y-2.5">
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

          <button
            onClick={handleBuyClick}
            className="btn btn-amazon"
            style={{ marginTop: 4 }}
          >
            <CartIcon size={16} />
            Check on Amazon
            <ArrowRightIcon size={14} />
          </button>
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 10, textAlign: "center", margin: 0 }}>
            Prices may vary
          </p>
        </div>
      </div>
    </div>
  );
}
