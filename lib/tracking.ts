import type { FormData } from "@/types";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function ga(...args: unknown[]) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag(...args);
  }
}

export function trackPhoneClick(
  phoneName: string,
  rank: number,
  budget: number
) {
  ga("event", "amazon_affiliate_click", {
    phone_name: phoneName,
    recommendation_rank: rank,
    user_budget: budget,
  });
}

export function trackFormComplete(formData: FormData) {
  ga("event", "recommendation_complete", {
    budget: formData.budget,
    primary_use: formData.primaryUse.join(","),
    brand: formData.brandPreference,
  });
}

export function trackAffiliateBannerClick(
  placement: string,
  variant: string
) {
  ga("event", "affiliate_banner_click", { placement, variant });
}

export function trackAffiliateBannerImpression(placement: string) {
  ga("event", "affiliate_banner_impression", { placement });
}

export function trackAccessoryClick(category: string, placement: string) {
  ga("event", "accessory_click", { category, placement });
}

export function trackBountyClick(bountyType: string) {
  ga("event", "bounty_click", { bounty_type: bountyType });
}
