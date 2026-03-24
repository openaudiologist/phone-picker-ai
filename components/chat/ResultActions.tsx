"use client";

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
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 pt-2 app-scrollbar">
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          onClick={action.onClick}
          className="btn btn-ghost"
          style={{ paddingInline: 14, fontSize: 12, whiteSpace: "nowrap", flexShrink: 0 }}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
