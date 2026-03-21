"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, ArrowRight } from "lucide-react";
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
        "p-5 space-y-4"
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

      {/* 1. Best pick badge */}
      {phone.isBestPick && (
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
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            style={{ animation: "pulse-star 2s ease-in-out infinite" }}
          >
            <path
              d="M5 0l1.12 3.44h3.63l-2.94 2.13 1.13 3.43L5 6.88 2.06 9l1.13-3.43L.25 3.44h3.63L5 0z"
              fill="currentColor"
            />
          </svg>
          Best Pick
        </div>
      )}

      {/* 2. Header row */}
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

      {/* 3. Phone name */}
      <h3
        style={{
          fontSize: 18,
          fontWeight: 500,
          color: "#f1f0ff",
          margin: 0,
        }}
      >
        {phone.name}
      </h3>

      {/* 4. Tagline */}
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0 }}>
        {phone.tagline}
      </p>

      {/* 5. Why box */}
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
        <p
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {phone.whyThisPhone}
        </p>
      </div>

      {/* 6. Specs grid */}
      <div className="grid grid-cols-3 gap-2">
        <SpecBadge label="Display" value={phone.specs.display} />
        <SpecBadge label="Processor" value={phone.specs.processor} />
        <SpecBadge label="Camera" value={phone.specs.camera} />
        <SpecBadge label="Battery" value={phone.specs.battery} />
        <SpecBadge label="RAM" value={phone.specs.ram} />
        <SpecBadge label="OS" value={phone.specs.os} />
      </div>

      {/* 7. Score bars */}
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

      {/* 8. Pros / Cons */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          {phone.pros.map((pro, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <ArrowRight
                size={10}
                style={{ color: "#34d399", marginTop: 3, flexShrink: 0 }}
              />
              <span
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {pro}
              </span>
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          {phone.cons.map((con, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <ArrowRight
                size={10}
                style={{ color: "#fb7185", marginTop: 3, flexShrink: 0 }}
              />
              <span
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {con}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 9. Amazon CTA */}
      <button
        onClick={handleBuyClick}
        className="w-full flex items-center justify-center gap-2 transition-all duration-200"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,153,0,0.9), rgba(255,120,0,0.85))",
          color: "#fff",
          border: "none",
          borderRadius: 20,
          padding: "10px 20px",
          fontSize: 14,
          fontWeight: 500,
          cursor: "pointer",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.opacity = "0.9";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.opacity = "1";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <ShoppingCart size={16} />
        Buy on Amazon →
      </button>

      {/* 10. Disclaimer */}
      <p
        style={{
          color: "rgba(255,255,255,0.2)",
          fontSize: 10,
          textAlign: "center",
          margin: 0,
        }}
      >
        Prices may vary · Affiliate link
      </p>
    </div>
  );
}
