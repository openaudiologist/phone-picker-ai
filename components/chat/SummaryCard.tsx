"use client";

import type { ChatStepId } from "@/types";
import { ArrowRightIcon } from "@/components/ui/arrow-right";

interface SummaryItem {
  label: string;
  value: string;
  stepId?: ChatStepId;
}

interface SummaryCardProps {
  items: SummaryItem[];
  onConfirm: () => void;
  onEditAnswers: () => void;
  onEditStep?: (stepId: ChatStepId) => void;
  disabled?: boolean;
}

export default function SummaryCard({
  items,
  onConfirm,
  onEditAnswers,
  onEditStep,
  disabled = false,
}: SummaryCardProps) {
  return (
    <div className="summary-gradient-border">
      <div className="summary-gradient-inner space-y-5 sm:p-5">
        <div className="space-y-2">
          <p className="section-kicker m-0">Summary</p>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="m-0 text-lg font-medium text-[#f6f3ff]">Ready to shortlist your best phones</h3>
              <p className="mt-2 text-sm leading-6 text-white/55">
                This is the final brief I’ll send for recommendations. Edit anything, or launch the shortlist.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-[20px] border border-white/8 bg-white/4 p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="section-kicker mb-2">{item.label}</div>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.84)", fontSize: 13, lineHeight: 1.65 }}>
                  {item.value}
                </p>
              </div>

              {item.stepId && onEditStep ? (
                <button type="button" className="btn btn-link shrink-0" onClick={() => onEditStep(item.stepId!)}>
                  Edit
                </button>
              ) : null}
            </div>
          </div>
        ))}
        </div>

        <div className="flex flex-col gap-3 pt-1 sm:flex-row">
          <button type="button" onClick={onConfirm} className="btn btn-primary-lg sm:min-w-[220px]" disabled={disabled}>
            Find my best phones
            <ArrowRightIcon size={14} />
          </button>
          <button type="button" onClick={onEditAnswers} className="btn btn-ghost sm:min-w-[150px]" disabled={disabled}>
            Edit answers
          </button>
        </div>
      </div>
    </div>
  );
}
