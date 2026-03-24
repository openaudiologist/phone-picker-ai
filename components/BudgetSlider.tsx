"use client";

interface BudgetSliderProps {
  value: number;
  onChange: (value: number) => void;
}

function formatBudget(value: number): string {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(value % 100000 === 0 ? 0 : 1)}L`;
  }
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function BudgetSlider({ value, onChange }: BudgetSliderProps) {
  return (
    <div className="space-y-5 rounded-[24px] border border-white/8 bg-white/4 p-4">
      <div className="text-center">
        <p className="section-kicker mb-2">Exact budget</p>
        <span
          className="gradient-text"
          style={{ fontSize: 36, fontWeight: 600 }}
        >
          {formatBudget(value)}
        </span>
      </div>

      <input
        type="range"
        min={5000}
        max={200000}
        step={1000}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider-track"
      />

      <div
        className="flex justify-between"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "rgba(255,255,255,0.25)",
        }}
      >
        <span>₹5k</span>
        <span>₹25k</span>
        <span>₹50k</span>
        <span>₹2L</span>
      </div>
    </div>
  );
}
