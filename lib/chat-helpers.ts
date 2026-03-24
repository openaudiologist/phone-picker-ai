import {
  DEFAULT_GUIDED_ANSWERS,
  QUICK_START_PRESETS,
  getBudgetRangeLabel,
  isSkippableValue,
} from "@/lib/chat-flow";
import type {
  ChatFlowMessage,
  FormData,
  GuidedAnswers,
} from "@/types";

function createMessageId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createChatMessage(
  input: Omit<ChatFlowMessage, "id" | "createdAt">
): ChatFlowMessage {
  return {
    id: createMessageId(),
    createdAt: new Date().toISOString(),
    ...input,
  };
}

export function normalizeSkipValue(value?: string | null) {
  if (!value) return null;
  return isSkippableValue(value) ? null : value;
}

export function normalizeSkippedArray(values: string[] = []) {
  return values.filter((value) => !isSkippableValue(value));
}

export function applyQuickStartPreset(
  quickStart: string,
  answers: GuidedAnswers
): GuidedAnswers {
  const preset = QUICK_START_PRESETS[quickStart] ?? {};

  return {
    ...answers,
    ...preset,
    quickStart,
  };
}

export function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function formatListLabel(values: string[]) {
  if (values.length === 0) return "None";
  if (values.length === 1) return values[0];
  if (values.length === 2) return `${values[0]} and ${values[1]}`;

  return `${values.slice(0, -1).join(", ")}, and ${values[values.length - 1]}`;
}

export function formatUserReplyLabel(
  value: string | number | string[] | null | undefined,
  fallback = "Skipped"
) {
  if (Array.isArray(value)) {
    return value.length > 0 ? formatListLabel(value) : fallback;
  }

  if (typeof value === "number") {
    return formatCurrency(value);
  }

  if (!value) {
    return fallback;
  }

  return value;
}

export function buildSummaryData(answers: GuidedAnswers) {
  return [
    { label: "Budget", value: answers.budgetRangeLabel || getBudgetRangeLabel(answers.budget) },
    { label: "Primary use", value: formatUserReplyLabel(answers.primaryUse) },
    { label: "Brand", value: formatUserReplyLabel(answers.brandPreference, "No preference") },
    { label: "Upgrade tier", value: formatUserReplyLabel(answers.upgradeTier) },
    { label: "Pain points", value: formatUserReplyLabel(normalizeSkippedArray(answers.currentPainPoints)) },
    { label: "Must-haves", value: formatUserReplyLabel(answers.mustHaveFeatures) },
    ...(answers.cameraPriority
      ? [{ label: "Camera priority", value: answers.cameraPriority }]
      : []),
    ...(answers.gamingPriority
      ? [{ label: "Gaming priority", value: answers.gamingPriority }]
      : []),
  ];
}

export function mapGuidedAnswersToRequest(answers: GuidedAnswers): FormData {
  return {
    budget: answers.budget,
    primaryUse: answers.primaryUse,
    brandPreference: answers.brandPreference,
    currentPhone: normalizeSkipValue(answers.upgradeTier) ?? "",
    mustHaveFeatures: answers.mustHaveFeatures,
    upgradeTier: normalizeSkipValue(answers.upgradeTier),
    currentPainPoints: normalizeSkippedArray(answers.currentPainPoints),
    cameraPriority: normalizeSkipValue(answers.cameraPriority),
    gamingPriority: normalizeSkipValue(answers.gamingPriority),
  };
}

export function getInitialGuidedAnswers(): GuidedAnswers {
  return {
    ...DEFAULT_GUIDED_ANSWERS,
  };
}
