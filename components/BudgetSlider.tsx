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
    <div className="space-y-4">
      <div className="text-center">
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
        className="w-full"
        style={{ accentColor: "#8b5cf6" }}
      />

      <div
        className="flex justify-between"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "rgba(255,255,255,0.25)",
        }}
      >
        <span>Budget</span>
        <span>Mid-range</span>
        <span>Premium</span>
        <span>Flagship</span>
      </div>
    </div>
  );
}
