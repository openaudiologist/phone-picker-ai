"use client";

import type { ReactNode } from "react";
import {
  Camera,
  Gamepad2,
  BatteryFull,
  Star,
  ArrowUpCircle,
} from "lucide-react";
import type { ChatOption } from "@/types";
import { cn } from "@/lib/utils";

const OPTION_ICONS: Record<string, ReactNode> = {
  "quick-camera": <Camera className="h-3.5 w-3.5" />,
  "quick-gaming": <Gamepad2 className="h-3.5 w-3.5" />,
  "quick-battery": <BatteryFull className="h-3.5 w-3.5" />,
  "quick-all-rounder": <Star className="h-3.5 w-3.5" />,
  "quick-upgrade": <ArrowUpCircle className="h-3.5 w-3.5" />,
};

interface OptionChipsProps {
  options: ChatOption[];
  selectedValues?: Array<string | number>;
  multiSelect?: boolean;
  maxSelect?: number;
  onSelect: (option: ChatOption) => void;
}

export default function OptionChips({
  options,
  selectedValues = [],
  multiSelect = false,
  maxSelect,
  onSelect,
}: OptionChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value);
        const maxReached =
          multiSelect &&
          typeof maxSelect === "number" &&
          selectedValues.length >= maxSelect &&
          !isSelected;
        const icon = OPTION_ICONS[option.id];

        return (
          <button
            key={option.id}
            type="button"
            disabled={option.disabled || maxReached}
            onClick={() => onSelect(option)}
            className={cn(
              "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm transition-all duration-200",
              option.disabled || maxReached
                ? "cursor-not-allowed opacity-45"
                : "hover:bg-[var(--accent-color)] hover:text-[var(--accent-foreground)] hover:shadow-[0_0_12px_rgba(56,189,248,0.25)]",
              isSelected
                ? "border-[var(--accent-color)] bg-[var(--accent-color)]/10 text-[var(--accent-color)]"
                : "border-[var(--accent-color)]/60 text-[var(--accent-color)]"
            )}
          >
            {icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
