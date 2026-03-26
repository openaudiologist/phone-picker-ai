export const AMAZON_TAG =
  process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG || "YOUR-TAG-21";

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
