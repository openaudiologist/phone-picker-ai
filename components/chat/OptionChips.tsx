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
import { Button } from "@/components/ui/button";

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
          <Button
            key={option.id}
            type="button"
            variant={isSelected ? "chip-active" : "chip"}
            size="chip"
            disabled={option.disabled || maxReached}
            onClick={() => onSelect(option)}
            className="justify-start"
          >
            {icon}
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}
