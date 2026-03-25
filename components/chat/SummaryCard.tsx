"use client";

import { ArrowRight } from "lucide-react";
import type { ChatStepId } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

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
    <Card size="sm" className="gap-2">
      <CardHeader className="gap-1 px-3">
        <div>
          <Badge variant="secondary" className="h-5 px-1.5 text-xs">Summary</Badge>
        </div>
        <CardTitle className="text-sm">Ready to shortlist your best phones</CardTitle>
        <CardDescription className="text-xs leading-4">
          Final brief before recommendations. Tweak any answer or launch the shortlist.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 px-3">
        <Separator className="bg-border/70" />

        <div className="grid gap-0.5">
          {items.map((item) => (
            <div
              key={item.label}
              className={cn(
                "flex items-start justify-between gap-3 rounded-lg px-2 py-2",
                item.stepId ? "hover:bg-muted/35" : ""
              )}
            >
              <div className="min-w-0 space-y-0.5">
                <div className="text-xs text-muted-foreground">{item.label}</div>
                <div className="text-sm font-medium leading-tight text-foreground">{item.value}</div>
              </div>

              {item.stepId && onEditStep ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  className="mt-0.5 shrink-0"
                  onClick={() => onEditStep(item.stepId!)}
                >
                  Edit
                </Button>
              ) : null}
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2 border-0 bg-transparent px-3 pb-3 pt-0 sm:flex-row">
        <Button type="button" onClick={onConfirm} className="w-full sm:flex-1" disabled={disabled}>
            Find my best phones
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button type="button" onClick={onEditAnswers} variant="secondary" className="w-full sm:flex-1" disabled={disabled}>
            Edit answers
          </Button>
      </CardFooter>
    </Card>
  );
}
