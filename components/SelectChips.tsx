"use client";

import { CheckIcon } from "@/components/ui/check";

interface SelectChipsProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multiSelect: boolean;
}

export default function SelectChips({
  options,
  selected,
  onChange,
  multiSelect,
}: SelectChipsProps) {
  const handleClick = (option: string) => {
    if (multiSelect) {
      if (selected.includes(option)) {
        onChange(selected.filter((s) => s !== option));
      } else {
        onChange([...selected, option]);
      }
    } else {
      onChange([option]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => handleClick(option)}
            className="flex items-center gap-1.5 transition-all duration-200"
            style={{
              background: isSelected
                ? "rgba(139,92,246,0.2)"
                : "rgba(255,255,255,0.04)",
              border: isSelected
                ? "0.5px solid rgba(167,139,250,0.5)"
                : "0.5px solid rgba(255,255,255,0.12)",
              color: isSelected ? "#c4b5fd" : "rgba(255,255,255,0.55)",
              borderRadius: 20,
              padding: "8px 16px",
              fontSize: 13,
              cursor: "pointer",
            }}
            onMouseOver={(e) => {
              if (!isSelected) {
                e.currentTarget.style.background = "rgba(139,92,246,0.1)";
                e.currentTarget.style.borderColor = "rgba(167,139,250,0.4)";
                e.currentTarget.style.color = "#c4b5fd";
              }
            }}
            onMouseOut={(e) => {
              if (!isSelected) {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                e.currentTarget.style.color = "rgba(255,255,255,0.55)";
              }
            }}
          >
            {isSelected && <CheckIcon size={14} />}
            {option}
          </button>
        );
      })}
    </div>
  );
}
