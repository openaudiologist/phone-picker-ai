import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { FormData, RecommendationResponse } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isScore(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100;
}

function validateRecommendationPayload(payload: RecommendationResponse) {
  if (!isNonEmptyString(payload.summary)) {
    throw new Error("Recommendation summary is missing.");
  }

  if (!Array.isArray(payload.phones) || payload.phones.length !== 3) {
    throw new Error("Recommendation response must contain exactly 3 phones.");
  }

  const ranks = new Set<number>();

  for (const phone of payload.phones) {
    if (![1, 2, 3].includes(phone.rank)) {
      throw new Error(`Invalid phone rank received: ${phone.rank}`);
    }

    if (ranks.has(phone.rank)) {
      throw new Error(`Duplicate phone rank received: ${phone.rank}`);
    }

    ranks.add(phone.rank);

    if (
      !isNonEmptyString(phone.name) ||
      !isNonEmptyString(phone.brand) ||
      !isNonEmptyString(phone.price) ||
      typeof phone.priceNumeric !== "number" ||
      !isNonEmptyString(phone.tagline) ||
      !isNonEmptyString(phone.whyThisPhone) ||
      !isNonEmptyString(phone.amazonSearchQuery)
    ) {
      throw new Error(`Phone payload is missing required string fields for rank ${phone.rank}.`);
    }

    if (!phone.price.startsWith("₹")) {
      throw new Error(`Phone price is not formatted in INR for rank ${phone.rank}.`);
    }

    if (
      !phone.specs ||
      !isNonEmptyString(phone.specs.display) ||
      !isNonEmptyString(phone.specs.processor) ||
      !isNonEmptyString(phone.specs.camera) ||
      !isNonEmptyString(phone.specs.battery) ||
      !isNonEmptyString(phone.specs.ram) ||
      !isNonEmptyString(phone.specs.os)
    ) {
      throw new Error(`Phone specs are incomplete for rank ${phone.rank}.`);
    }

    if (
      !phone.scores ||
      !isScore(phone.scores.camera) ||
      !isScore(phone.scores.battery) ||
      !isScore(phone.scores.performance) ||
      !isScore(phone.scores.value) ||
      !isScore(phone.scores.display)
    ) {
      throw new Error(`Phone scores are invalid for rank ${phone.rank}.`);
    }

    if (!isStringArray(phone.pros) || phone.pros.length === 0) {
      throw new Error(`Phone pros are missing for rank ${phone.rank}.`);
    }

    if (!isStringArray(phone.cons) || phone.cons.length === 0) {
      throw new Error(`Phone cons are missing for rank ${phone.rank}.`);
    }

    if (phone.matchReasons && !isStringArray(phone.matchReasons)) {
      throw new Error(`matchReasons must be a string array for rank ${phone.rank}.`);
    }

    if (phone.avoidIf && !isStringArray(phone.avoidIf)) {
      throw new Error(`avoidIf must be a string array for rank ${phone.rank}.`);
    }

    if (phone.bestFor && !isStringArray(phone.bestFor)) {
      throw new Error(`bestFor must be a string array for rank ${phone.rank}.`);
    }

    if (phone.matchScore !== undefined && !isScore(phone.matchScore)) {
      throw new Error(`matchScore must be between 0 and 100 for rank ${phone.rank}.`);
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as FormData;

    // Validate required fields
    if (
      !body.budget ||
      !body.primaryUse ||
      body.primaryUse.length === 0 ||
      !body.brandPreference
    ) {
      return NextResponse.json(
        { error: "Missing required fields: budget, primaryUse, and brandPreference are required." },
        { status: 400 }
      );
    }

    if (body.budget < 5000 || body.budget > 200000) {
      return NextResponse.json(
        { error: "Budget must be between ₹5,000 and ₹2,00,000." },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert mobile phone advisor for Indian buyers in 2025-2026. You have deep knowledge of phones sold in India across all major brands and price ranges. Prioritise phones that are realistically available in India and easy to find on Amazon India. Return ONLY a raw JSON object. No markdown, no backticks, no explanations, no notes before or after the JSON. Start with { and end with }.`;

    const primaryUses = body.primaryUse.join(", ");
    const mustHaveFeatures = body.mustHaveFeatures?.length
      ? body.mustHaveFeatures.join(", ")
      : "None";
    const painPoints = body.currentPainPoints?.length
      ? body.currentPainPoints.join(", ")
      : "None";

    const userPrompt = `A user wants a phone recommendation:
- Budget: ₹${body.budget.toLocaleString("en-IN")}
- Budget bracket label: ${
      body.budget <= 10000
        ? "Under ₹10,000"
        : body.budget <= 15000
          ? "₹10,000 to ₹15,000"
          : body.budget <= 20000
            ? "₹15,000 to ₹20,000"
            : body.budget <= 25000
              ? "₹20,000 to ₹25,000"
              : body.budget <= 35000
                ? "₹25,000 to ₹35,000"
                : body.budget <= 50000
                  ? "₹35,000 to ₹50,000"
                  : "₹50,000+"
    }
- Primary uses: ${primaryUses}
- Brand preference: ${body.brandPreference}
- Current phone / upgrade context: ${body.currentPhone || "Not specified"}
- Upgrade tier: ${body.upgradeTier || "Not specified"}
- Current pain points: ${painPoints}
- Camera priority: ${body.cameraPriority || "Not specified"}
- Gaming priority: ${body.gamingPriority || "Not specified"}
- Must-have features: ${mustHaveFeatures}

Recommend exactly 3 phones available in India in 2025-2026 within or close to their budget. Prioritise phones that best match the user's actual needs, not generic flagship picks. Return this exact JSON shape:
{
  "phones": [
    {
      "rank": 1,
      "name": "Full phone name",
      "brand": "Brand",
      "price": "₹XX,XXX",
      "priceNumeric": 12345,
      "tagline": "Short catchy tagline",
      "whyThisPhone": "2-3 sentences explaining why this phone is perfect for the user's specific needs",
      "specs": {
        "display": "e.g. 6.7 inch AMOLED 120Hz",
        "processor": "e.g. Snapdragon 8 Gen 3",
        "camera": "e.g. 200MP + 12MP + 50MP",
        "battery": "e.g. 5000mAh, 67W charging",
        "ram": "e.g. 12GB + 256GB",
        "os": "e.g. Android 14, One UI 6"
      },
      "scores": {
        "camera": 85,
        "battery": 90,
        "performance": 80,
        "value": 75,
        "display": 88
      },
      "pros": ["pro1", "pro2", "pro3"],
      "cons": ["con1", "con2"],
      "amazonSearchQuery": "exact phone name for amazon search",
      "isBestPick": true,
      "matchReasons": ["specific reason 1", "specific reason 2"],
      "avoidIf": ["who should avoid this"],
      "bestFor": ["best for camera users", "best for battery users"],
      "matchScore": 92
    }
  ],
  "summary": "One sentence summary of recommendations"
}
Rules:
- Set isBestPick: true only for rank 1.
- Make whyThisPhone genuinely personalised to the user's priorities.
- amazonSearchQuery should be the exact phone name.
- All scores and matchScore must be between 0 and 100.
- matchReasons, avoidIf, and bestFor should be concise and useful.
- Return only raw JSON.`;

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
      system: systemPrompt,
    });

    const raw =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Extract JSON from response
    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1) {
      return NextResponse.json(
        { error: "Failed to parse AI response." },
        { status: 500 }
      );
    }

    const jsonString = raw.slice(jsonStart, jsonEnd + 1);
    const parsed: RecommendationResponse = JSON.parse(jsonString);
    validateRecommendationPayload(parsed);

    return NextResponse.json(parsed, { status: 200 });
  } catch (error) {
    console.error("Recommendation API error:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: `Failed to get recommendations: ${message}` },
      { status: 500 }
    );
  }
}
