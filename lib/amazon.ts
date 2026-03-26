import type React from "react";

export const AMAZON_TAG =
  process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG || "YOUR-TAG-21";

/* ── Mobile deep-link constants ────────────────────────── */

const AMAZON_ANDROID_PACKAGE = "in.amazon.mShop.android.shopping";
const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${AMAZON_ANDROID_PACKAGE}`;
const APP_STORE_URL =
  "https://apps.apple.com/in/app/amazon-india/id1478350682";

function getMobilePlatform(): "ios" | "android" | null {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return null;
}

/**
 * Intercept an Amazon link click to prefer the native app on mobile.
 *
 * **Android** – uses an `intent://` URL that opens the Amazon Shopping app
 * when installed, otherwise falls back to the Play Store listing.
 *
 * **iOS** – navigates in the same window so Universal Links can open the
 * Amazon app.  If the page is still visible after a short delay (app not
 * installed), the user is redirected to the App Store.
 *
 * **Desktop** – no-op; the default `<a target="_blank">` behaviour is kept.
 *
 * Call this at the top of every Amazon `<a>` onClick handler and pass
 * the React mouse event so it can `preventDefault()` on mobile.
 */
export function handleAmazonDeepLink(
  webUrl: string,
  e: React.MouseEvent<HTMLAnchorElement>,
): void {
  const platform = getMobilePlatform();
  if (!platform) return; // desktop – let default behaviour work

  e.preventDefault();

  if (platform === "android") {
    const stripped = webUrl.replace(/^https?:\/\//, "");
    window.location.href = `intent://${stripped}#Intent;scheme=https;package=${AMAZON_ANDROID_PACKAGE};S.browser_fallback_url=${encodeURIComponent(PLAY_STORE_URL)};end`;
    return;
  }

  // iOS: navigate in same window for Universal Links
  const start = Date.now();
  window.location.href = webUrl;

  // If the page stays visible (app not installed, URL scheme fell through)
  // redirect to the App Store after a short grace period.
  const cleanup = () => {
    document.removeEventListener("visibilitychange", onHide);
    clearTimeout(fallback);
  };
  const onHide = () => {
    if (document.hidden) cleanup();
  };
  document.addEventListener("visibilitychange", onHide);

  const fallback = setTimeout(() => {
    cleanup();
    if (!document.hidden && Date.now() - start < 3000) {
      window.location.href = APP_STORE_URL;
    }
  }, 2000);
}

export function getAmazonSearchUrl(query: string): string {
  return `https://www.amazon.in/s?k=${encodeURIComponent(query)}&tag=${AMAZON_TAG}`;
}

export function getAmazonProductUrl(asin: string): string {
  return `https://www.amazon.in/dp/${asin}?tag=${AMAZON_TAG}`;
}

export function getAmazonTodaysDealUrl(keyword: string): string {
  return `https://www.amazon.in/s?k=${encodeURIComponent(keyword)}&deals-widget=1&tag=${AMAZON_TAG}`;
}

export function getAmazonCategoryUrl(keywords: string): string {
  return `https://www.amazon.in/s?k=${encodeURIComponent(keywords)}&tag=${AMAZON_TAG}`;
}

export function getAmazonDealsUrl(): string {
  return `https://www.amazon.in/deals?tag=${AMAZON_TAG}`;
}

export const PHONE_ASINS: Record<string, string> = {
  // Add ASINs manually from Associates dashboard:
  // Find on Amazon product page URL: amazon.in/dp/ASIN
  // "Samsung Galaxy S24 FE": "B0XXXXXXXXX",
  // "OnePlus Nord CE4": "B0XXXXXXXXX",
  // "Redmi Note 13 Pro": "B0XXXXXXXXX",
};

export function getBestAmazonUrl(phoneName: string): string {
  const asin = PHONE_ASINS[phoneName];
  return asin
    ? `https://www.amazon.in/dp/${asin}?tag=${AMAZON_TAG}`
    : getAmazonSearchUrl(phoneName);
}

export function getAccessoryUrl(phoneName: string, category: string): string {
  return getAmazonSearchUrl(`${phoneName} ${category}`);
}

export const BOUNTY_LINKS = {
  prime: "https://amzn.to/47kVXXF",
  audible: `https://www.amazon.in/dp/B077S5CVBQ?tag=${AMAZON_TAG}`,
} as const;
