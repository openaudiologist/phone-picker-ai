export interface FormData {
  budget: number;
  primaryUse: string[];
  brandPreference: string;
  currentPhone: string;
  mustHaveFeatures: string[];
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
}

export interface RecommendationResponse {
  phones: PhoneRecommendation[];
  summary: string;
}
