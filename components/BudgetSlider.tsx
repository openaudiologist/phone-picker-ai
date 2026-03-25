"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

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
    <Card className="border-border/70 bg-secondary/40">
      <CardContent className="space-y-6 p-5">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Exact budget
          </p>
          <div className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
            {formatBudget(value)}
          </div>
        </div>

        <Slider
          min={5000}
          max={200000}
          step={1000}
          value={[value]}
          onValueChange={(nextValue) => onChange(nextValue[0] ?? value)}
        />

        <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
          <span>₹5k</span>
          <span>₹25k</span>
          <span>₹50k</span>
          <span>₹2L</span>
        </div>
      </CardContent>
    </Card>
  );
}
