"use client";

import { Button } from "@/components/ui/button";

interface ResultActionsProps {
  onCompare: () => void;
  onBatteryRefine: () => void;
  onCameraRefine: () => void;
  onCheaperRefine: () => void;
  onPeopleSaying: () => void;
  onStartOver: () => void;
  onEditAnswers: () => void;
}

export default function ResultActions({
  onCompare,
  onBatteryRefine,
  onCameraRefine,
  onCheaperRefine,
  onPeopleSaying,
  onStartOver,
  onEditAnswers,
}: ResultActionsProps) {
  const actions = [
    { label: "Compare these 3", onClick: onCompare },
    { label: "Better battery", onClick: onBatteryRefine },
    { label: "Better camera", onClick: onCameraRefine },
    { label: "Cheaper options", onClick: onCheaperRefine },
    { label: "What people are saying", onClick: onPeopleSaying },
    { label: "Edit answers", onClick: onEditAnswers },
    { label: "Start over", onClick: onStartOver },
  ];

  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 pt-2">
      {actions.map((action) => (
        <Button
          key={action.label}
          type="button"
          onClick={action.onClick}
          variant="secondary"
          className="shrink-0 rounded-full px-4 text-xs"
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
