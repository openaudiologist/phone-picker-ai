export interface FormData {
  budget: number;
  primaryUse: string[];
  brandPreference: string;
  currentPhone: string;
  mustHaveFeatures: string[];
  upgradeTier?: string | null;
  currentPainPoints?: string[];
  cameraPriority?: string | null;
  gamingPriority?: string | null;
}

export type ChatStepId =
  | "welcome"
  | "budget"
  | "primary_use"
  | "brand"
  | "upgrade_tier"
  | "pain_points"
  | "must_have"
  | "camera_priority"
  | "gaming_priority"
  | "summary"
  | "results";

export interface GuidedAnswers {
  quickStart?: string | null;
  budget: number;
  budgetRangeLabel: string;
  primaryUse: string[];
  brandPreference: string;
  upgradeTier?: string | null;
  currentPainPoints: string[];
  mustHaveFeatures: string[];
  cameraPriority?: string | null;
  gamingPriority?: string | null;
}

export interface ChatOption {
  id: string;
  label: string;
  value: string | number;
  description?: string;
  kind?: "chip" | "action" | "slider" | "skip" | "quick-start";
  disabled?: boolean;
}

export interface ChatFlowMessage {
  id: string;
  role: "assistant" | "user";
  stepId?: ChatStepId;
  text: string;
  kind?: "prompt" | "answer" | "summary" | "result" | "status";
  responseLabel?: string;
  createdAt: string;
  data?: Record<string, unknown>;
}

export interface PhoneRecommendation {
  rank: 1 | 2 | 3;
  name: string;
  brand: string;
  price: string;
  priceNumeric: number;
  tagline: string;
  whyThisPhone: string;
  specs: {
    display: string;
    processor: string;
    camera: string;
    battery: string;
    ram: string;
    os: string;
  };
  scores: {
    camera: number;
    battery: number;
    performance: number;
    value: number;
    display: number;
  };
  pros: string[];
  cons: string[];
  amazonSearchQuery: string;
  isBestPick: boolean;
  matchReasons?: string[];
  avoidIf?: string[];
  bestFor?: string[];
  matchScore?: number;
}

export interface RecommendationResponse {
  phones: PhoneRecommendation[];
  summary: string;
}

export interface YoutubeInsightResponse {
  phoneName: string;
  videoCount: number;
  topChannels: string[];
  highlights: string[];
}
