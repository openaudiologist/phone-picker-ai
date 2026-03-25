"use client";

import { Button } from "@/components/ui/button";

interface ResultActionsProps {
  onCompare: () => void;
  onPeopleSaying: () => void;
  onStartOver: () => void;
  onEditAnswers: () => void;
  showCompare?: boolean;
  showPeopleSaying?: boolean;
}

export default function ResultActions({
  onCompare,
  onPeopleSaying,
  onStartOver,
  onEditAnswers,
  showCompare = true,
  showPeopleSaying = true,
}: ResultActionsProps) {
  const actions = [
    ...(showCompare ? [{ label: "Compare these 3", onClick: onCompare }] : []),
    ...(showPeopleSaying ? [{ label: "What people are saying", onClick: onPeopleSaying }] : []),
    { label: "Edit answers", onClick: onEditAnswers },
    { label: "Start over", onClick: onStartOver },
  ];

  return (
    <div className="flex flex-wrap gap-2 pt-1 pb-4">
      {actions.map((action) => (
        <Button
          key={action.label}
          type="button"
          onClick={action.onClick}
          variant="chip"
          size="chip"
          className="justify-start"
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
