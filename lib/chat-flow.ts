import type { ChatOption, ChatStepId, GuidedAnswers } from "@/types";

export interface ChatStepDefinition {
  id: ChatStepId;
  title: string;
  multiSelect?: boolean;
  maxSelect?: number;
  options?: ChatOption[];
  allowSkip?: boolean;
  allowExactBudget?: boolean;
}

export const QUICK_START_OPTIONS: ChatOption[] = [
  { id: "quick-camera", label: "Best camera phone", value: "Best camera phone", kind: "quick-start" },
  { id: "quick-gaming", label: "Best gaming phone", value: "Best gaming phone", kind: "quick-start" },
  { id: "quick-battery", label: "Best battery phone", value: "Best battery phone", kind: "quick-start" },
  { id: "quick-all-rounder", label: "Best all-rounder", value: "Best all-rounder", kind: "quick-start" },
  { id: "quick-upgrade", label: "Upgrade my current phone", value: "Upgrade my current phone", kind: "quick-start" },
];

export const QUICK_START_PRESETS: Record<string, Partial<GuidedAnswers>> = {
  "Best camera phone": {
    primaryUse: ["Camera"],
  },
  "Best gaming phone": {
    primaryUse: ["Gaming"],
  },
  "Best battery phone": {
    primaryUse: ["Battery life"],
  },
  "Best all-rounder": {
    primaryUse: ["Daily use"],
  },
  "Upgrade my current phone": {},
};

export const BUDGET_OPTIONS: ChatOption[] = [
  { id: "budget-under-10", label: "Under ₹10,000", value: 10000, description: "Entry-level picks" },
  { id: "budget-10-15", label: "₹10,000 to ₹15,000", value: 15000, description: "Strong value segment" },
  { id: "budget-15-20", label: "₹15,000 to ₹20,000", value: 20000, description: "Balanced mid-range" },
  { id: "budget-20-25", label: "₹20,000 to ₹25,000", value: 25000, description: "Popular sweet spot" },
  { id: "budget-25-35", label: "₹25,000 to ₹35,000", value: 35000, description: "Upper mid-range" },
  { id: "budget-35-50", label: "₹35,000 to ₹50,000", value: 50000, description: "Near-premium options" },
  { id: "budget-50-plus", label: "₹50,000+", value: 60000, description: "Premium and flagship" },
  { id: "budget-exact", label: "Choose exact budget", value: "exact-budget", kind: "slider" },
];

export const PRIMARY_USE_OPTIONS: ChatOption[] = [
  { id: "use-camera", label: "Camera", value: "Camera" },
  { id: "use-gaming", label: "Gaming", value: "Gaming" },
  { id: "use-daily", label: "Daily use", value: "Daily use" },
  { id: "use-social", label: "Social media", value: "Social media" },
  { id: "use-battery", label: "Battery life", value: "Battery life" },
  { id: "use-work", label: "Work", value: "Work" },
  { id: "use-video", label: "Video", value: "Video" },
  { id: "use-content", label: "Content creation", value: "Content creation" },
];

export const BRAND_OPTIONS: ChatOption[] = [
  { id: "brand-none", label: "No preference", value: "No preference" },
  { id: "brand-samsung", label: "Samsung", value: "Samsung" },
  { id: "brand-oneplus", label: "OnePlus", value: "OnePlus" },
  { id: "brand-xiaomi", label: "Xiaomi / Redmi", value: "Xiaomi / Redmi" },
  { id: "brand-realme", label: "Realme", value: "Realme" },
  { id: "brand-iqoo", label: "iQOO", value: "iQOO" },
  { id: "brand-motorola", label: "Motorola", value: "Motorola" },
  { id: "brand-vivo", label: "Vivo", value: "Vivo" },
  { id: "brand-oppo", label: "Oppo", value: "Oppo" },
  { id: "brand-nothing", label: "Nothing", value: "Nothing" },
  { id: "brand-apple", label: "Apple", value: "Apple" },
];

export const UPGRADE_TIER_OPTIONS: ChatOption[] = [
  { id: "tier-budget", label: "Budget phone", value: "Budget phone" },
  { id: "tier-mid", label: "Mid-range phone", value: "Mid-range phone" },
  { id: "tier-premium", label: "Premium phone", value: "Premium phone" },
  { id: "tier-unsure", label: "Not sure", value: "Not sure" },
  { id: "tier-skip", label: "Skip", value: "Skip", kind: "skip" },
];

export const PAIN_POINT_OPTIONS: ChatOption[] = [
  { id: "pain-performance", label: "Slow performance", value: "Slow performance" },
  { id: "pain-battery", label: "Weak battery", value: "Weak battery" },
  { id: "pain-camera", label: "Poor camera", value: "Poor camera" },
  { id: "pain-storage", label: "Storage issues", value: "Storage issues" },
  { id: "pain-display", label: "Display quality", value: "Display quality" },
  { id: "pain-upgrade", label: "Just want an upgrade", value: "Just want an upgrade" },
  { id: "pain-skip", label: "Skip", value: "Skip", kind: "skip" },
];

export const MUST_HAVE_OPTIONS: ChatOption[] = [
  { id: "must-5g", label: "5G", value: "5G" },
  { id: "must-fast-charge", label: "Fast charging", value: "Fast charging" },
  { id: "must-camera", label: "Great camera", value: "Great camera" },
  { id: "must-clean-ui", label: "Clean UI", value: "Clean UI" },
  { id: "must-battery", label: "Big battery", value: "Big battery" },
  { id: "must-amoled", label: "AMOLED display", value: "AMOLED display" },
  { id: "must-performance", label: "High performance", value: "High performance" },
  { id: "must-light", label: "Lightweight", value: "Lightweight" },
  { id: "must-stereo", label: "Stereo speakers", value: "Stereo speakers" },
  { id: "must-water", label: "Water resistance", value: "Water resistance" },
  { id: "must-support", label: "Long software support", value: "Long software support" },
];

export const CAMERA_PRIORITY_OPTIONS: ChatOption[] = [
  { id: "camera-photos", label: "Photos", value: "Photos" },
  { id: "camera-portraits", label: "Portraits", value: "Portraits" },
  { id: "camera-low-light", label: "Low light", value: "Low light" },
  { id: "camera-video", label: "Video", value: "Video" },
  { id: "camera-all-round", label: "All-round camera", value: "All-round camera" },
];

export const GAMING_PRIORITY_OPTIONS: ChatOption[] = [
  { id: "gaming-raw", label: "Raw performance", value: "Raw performance" },
  { id: "gaming-stable", label: "Stable long gaming", value: "Stable long gaming" },
  { id: "gaming-battery", label: "Better battery", value: "Better battery" },
  { id: "gaming-display", label: "Smooth display", value: "Smooth display" },
  { id: "gaming-light", label: "Not a heavy gamer", value: "Not a heavy gamer" },
];

export const CHAT_STEPS: Record<Exclude<ChatStepId, "results">, ChatStepDefinition> = {
  welcome: {
    id: "welcome",
    title: "Hi, I’ll help you find the right phone. Let’s narrow it down.",
    options: QUICK_START_OPTIONS,
  },
  budget: {
    id: "budget",
    title: "What’s your budget?",
    options: BUDGET_OPTIONS,
    allowExactBudget: true,
  },
  primary_use: {
    id: "primary_use",
    title: "What matters most in your next phone?",
    options: PRIMARY_USE_OPTIONS,
    multiSelect: true,
    maxSelect: 3,
  },
  brand: {
    id: "brand",
    title: "Any brand you want me to prioritise?",
    options: BRAND_OPTIONS,
  },
  upgrade_tier: {
    id: "upgrade_tier",
    title: "What are you upgrading from?",
    options: UPGRADE_TIER_OPTIONS,
    allowSkip: true,
  },
  pain_points: {
    id: "pain_points",
    title: "What bothered you most about your current phone?",
    options: PAIN_POINT_OPTIONS,
    multiSelect: true,
    allowSkip: true,
  },
  must_have: {
    id: "must_have",
    title: "Any non-negotiables?",
    options: MUST_HAVE_OPTIONS,
    multiSelect: true,
  },
  camera_priority: {
    id: "camera_priority",
    title: "What matters most in camera quality?",
    options: CAMERA_PRIORITY_OPTIONS,
  },
  gaming_priority: {
    id: "gaming_priority",
    title: "For gaming, what should I prioritise?",
    options: GAMING_PRIORITY_OPTIONS,
  },
  summary: {
    id: "summary",
    title: "Here’s what I’ll optimise for.",
  },
};

export const DEFAULT_GUIDED_ANSWERS: GuidedAnswers = {
  quickStart: null,
  budget: 25000,
  budgetRangeLabel: "₹20,000 to ₹25,000",
  primaryUse: [],
  brandPreference: "No preference",
  upgradeTier: null,
  currentPainPoints: [],
  mustHaveFeatures: [],
  cameraPriority: null,
  gamingPriority: null,
};

const BASE_STEP_ORDER: ChatStepId[] = [
  "welcome",
  "budget",
  "primary_use",
  "brand",
  "upgrade_tier",
  "pain_points",
  "must_have",
  "summary",
  "results",
];

export function shouldAskCameraPriority(answers: Pick<GuidedAnswers, "primaryUse">) {
  return answers.primaryUse.some((value) => value === "Camera" || value === "Video");
}

export function shouldAskGamingPriority(answers: Pick<GuidedAnswers, "primaryUse">) {
  return answers.primaryUse.includes("Gaming");
}

export function getBudgetRangeLabel(budget: number): string {
  if (budget < 10000) return "Under ₹10,000";
  if (budget <= 15000) return "₹10,000 to ₹15,000";
  if (budget <= 20000) return "₹15,000 to ₹20,000";
  if (budget <= 25000) return "₹20,000 to ₹25,000";
  if (budget <= 35000) return "₹25,000 to ₹35,000";
  if (budget <= 50000) return "₹35,000 to ₹50,000";
  return "₹50,000+";
}

export function getBudgetValueFromOption(optionValue: ChatOption["value"]) {
  return typeof optionValue === "number" ? optionValue : DEFAULT_GUIDED_ANSWERS.budget;
}

export function getIncludedStepIds(answers: GuidedAnswers): ChatStepId[] {
  const steps = [...BASE_STEP_ORDER];

  const summaryIndex = steps.indexOf("summary");
  const conditionalSteps: ChatStepId[] = [];

  if (shouldAskCameraPriority(answers)) {
    conditionalSteps.push("camera_priority");
  }

  if (shouldAskGamingPriority(answers)) {
    conditionalSteps.push("gaming_priority");
  }

  steps.splice(summaryIndex, 0, ...conditionalSteps);

  return steps;
}

export function getNextStepId(currentStepId: ChatStepId, answers: GuidedAnswers): ChatStepId | null {
  const includedSteps = getIncludedStepIds(answers);
  const currentIndex = includedSteps.indexOf(currentStepId);

  if (currentIndex === -1 || currentIndex === includedSteps.length - 1) {
    return null;
  }

  return includedSteps[currentIndex + 1] ?? null;
}

export function getPreviousStepId(currentStepId: ChatStepId, answers: GuidedAnswers): ChatStepId | null {
  const includedSteps = getIncludedStepIds(answers);
  const currentIndex = includedSteps.indexOf(currentStepId);

  if (currentIndex <= 0) {
    return null;
  }

  return includedSteps[currentIndex - 1] ?? null;
}

export function isConditionalStep(stepId: ChatStepId) {
  return stepId === "camera_priority" || stepId === "gaming_priority";
}

export function isSkippableValue(value: string) {
  return value.trim().toLowerCase() === "skip";
}
