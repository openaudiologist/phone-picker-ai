export const AMAZON_TAG =
  process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG || "YOUR-TAG-21";

export function getAmazonSearchUrl(query: string): string {
  return `https://www.amazon.in/s?k=${encodeURIComponent(query)}&tag=${AMAZON_TAG}`;
}

export function getAmazonProductUrl(asin: string): string {
  return `https://www.amazon.in/dp/${asin}?tag=${AMAZON_TAG}`;
}

export const PHONE_ASINS: Record<string, string> = {
  // Add ASINs manually from Associates dashboard later
  // "Samsung Galaxy S24 FE": "B0XXXXXXXXX",
};

export function getBestAmazonUrl(phoneName: string): string {
  const asin = PHONE_ASINS[phoneName];
  return asin ? getAmazonProductUrl(asin) : getAmazonSearchUrl(phoneName);
}
