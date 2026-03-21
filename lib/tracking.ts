import type { FormData } from "@/types";

export function trackPhoneClick(
  phoneName: string,
  rank: number,
  budget: number
) {
  console.log("[amazon_click]", { phoneName, rank, budget });
  // gtag('event', 'amazon_affiliate_click', {
  //   phone_name: phoneName,
  //   recommendation_rank: rank,
  //   user_budget: budget,
  // });
}

export function trackFormComplete(formData: FormData) {
  console.log("[form_complete]", formData);
}
