"use client";

import { ArrowRight } from "lucide-react";
import type { ChatStepId } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card className="border-border/70 bg-card/90 shadow-lg">
      <CardHeader className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Summary</p>
        <CardTitle className="text-lg">Ready to shortlist your best phones</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">
          This is the final brief I’ll send for recommendations. Edit anything, or launch the shortlist.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-3xl border border-border/70 bg-secondary/35 p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">{item.label}</div>
                <p className="m-0 text-sm leading-6 text-foreground">
                  {item.value}
                </p>
              </div>

              {item.stepId && onEditStep ? (
                <Button type="button" variant="ghost" size="sm" className="shrink-0 rounded-full" onClick={() => onEditStep(item.stepId!)}>
                  Edit
                </Button>
              ) : null}
            </div>
          </div>
        ))}
        </div>

        <div className="flex flex-col gap-3 pt-1 sm:flex-row">
          <Button type="button" onClick={onConfirm} className="rounded-full sm:min-w-[220px]" disabled={disabled}>
            Find my best phones
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button type="button" onClick={onEditAnswers} variant="secondary" className="rounded-full sm:min-w-[150px]" disabled={disabled}>
            Edit answers
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
