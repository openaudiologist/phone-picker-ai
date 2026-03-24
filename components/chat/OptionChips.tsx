"use client";

import type { ChatOption } from "@/types";
import { cn } from "@/lib/utils";

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
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value);
        const maxReached =
          multiSelect &&
          typeof maxSelect === "number" &&
          selectedValues.length >= maxSelect &&
          !isSelected;

        return (
          <button
            key={option.id}
            type="button"
            disabled={option.disabled || maxReached}
            onClick={() => onSelect(option)}
            className={cn(
              "group inline-flex min-h-[60px] w-full items-start justify-between rounded-[22px] border px-4 py-3 text-left transition-all duration-200",
              option.disabled || maxReached
                ? "cursor-not-allowed opacity-45"
                : "hover:-translate-y-0.5 active:scale-[0.99]",
              isSelected
                ? "border-violet-300/55 text-violet-50 shadow-[0_16px_36px_rgba(91,33,182,0.16)]"
                : "border-white/10 text-white/72 hover:border-violet-300/35 hover:text-violet-100"
            )}
            style={{
              background: isSelected
                ? "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(96,165,250,0.14))"
                : "linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.03))",
            }}
          >
            <span className="min-w-0 pr-3">
              <span className="block text-sm font-medium leading-5">{option.label}</span>
              {option.description ? (
                <span className="mt-1 block text-xs leading-5 text-white/42 group-hover:text-white/52">
                  {option.description}
                </span>
              ) : null}
            </span>

            <span
              className={cn(
                "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px]",
                isSelected
                  ? "border-violet-200/50 bg-violet-300/20 text-violet-100"
                  : "border-white/12 bg-white/4 text-white/35"
              )}
            >
              {isSelected ? "✓" : multiSelect ? "+" : "•"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
