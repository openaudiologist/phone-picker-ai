import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type {
  FormData,
  RecommendationErrorState,
  RecommendationResponse,
} from "@/types";

const WHY_THIS_PHONE_MAX_CHARS = 200;
const CLAUDE_MODEL = "claude-haiku-4-5-20251001";
const MAX_RECOMMENDATION_ATTEMPTS = 2;
const CLAUDE_REQUEST_TIMEOUT_MS = 30000;
const CLAUDE_MAX_TOKENS = 2600;

interface AIRecommendationResponse {
  phones: RecommendationResponse["phones"];
  summary: string;
}

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

function normalizeInlineText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function formatInr(value: number) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function extractJsonObject(raw: string) {
  const jsonStart = raw.indexOf("{");
  const jsonEnd = raw.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("Failed to parse AI response.");
  }

  return raw.slice(jsonStart, jsonEnd + 1);
}

function getFriendlyRecommendationErrorDetails(error: unknown): RecommendationErrorState {
  const rawMessage = error instanceof Error ? error.message : "Unknown error occurred";
  const normalizedMessage = rawMessage.toLowerCase();

  if (
    normalizedMessage.includes("timed out")
  ) {
    return {
      type: "technical",
      message:
        "The recommendation took a bit too long. Please try again.",
    };
  }

  if (
    normalizedMessage.includes("failed to parse ai response") ||
    normalizedMessage.includes("recommendation summary is missing") ||
    normalizedMessage.includes("must contain exactly 3 phones") ||
    normalizedMessage.includes("payload") ||
    normalizedMessage.includes("scores are invalid") ||
    normalizedMessage.includes("specs are incomplete")
  ) {
    return {
      type: "technical",
      message:
        "I’m refreshing your shortlist right now to make sure the recommendations stay complete and reliable. Please try again in a moment.",
    };
  }

  return {
    type: "technical",
    message:
      "I’m refreshing your shortlist right now so I can return the strongest current matches. Please try again in a moment.",
  };
}

function formatRecommendationAttemptFeedback(error: unknown) {
  return error instanceof Error && error.message.trim()
    ? error.message.trim()
    : "The previous shortlist failed validation. Return a corrected shortlist that satisfies every rule.";
}

async function createClaudeResponse(systemPrompt: string, userPrompt: string) {
  const message = await Promise.race([
    anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: CLAUDE_MAX_TOKENS,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
      system: systemPrompt,
    }),
    new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(
          new Error("Claude request timed out while building the shortlist.")
        );
      }, CLAUDE_REQUEST_TIMEOUT_MS);
    }),
  ]);

  return message.content[0].type === "text" ? message.content[0].text : "";
}

function validateRecommendationPayload(payload: AIRecommendationResponse) {
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
      !isPositiveInteger(phone.priceNumeric) ||
      !isNonEmptyString(phone.tagline) ||
      !isNonEmptyString(phone.whyThisPhone) ||
      !isNonEmptyString(phone.amazonSearchQuery)
    ) {
      throw new Error(`Phone payload is missing required fields for rank ${phone.rank}.`);
    }

    if (normalizeInlineText(phone.whyThisPhone).length > WHY_THIS_PHONE_MAX_CHARS) {
      throw new Error(
        `whyThisPhone must be ${WHY_THIS_PHONE_MAX_CHARS} characters or fewer for rank ${phone.rank}.`
      );
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
        {
          error: "I need your budget, primary use, and brand preference before I can build the shortlist.",
          errorType: "technical",
        },
        { status: 400 }
      );
    }

    if (body.budget < 5000 || body.budget > 200000) {
      return NextResponse.json(
        {
          error: "Please choose a budget between ₹5,000 and ₹2,00,000 so I can compare realistic options.",
          errorType: "technical",
        },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert mobile phone advisor for Indian buyers. You have deep knowledge of phones sold in India across all major brands and price ranges.

You must recommend only phones that are:
- Recent, popular, and widely available in India right now from major retailers or brand stores.
- Not discontinued, not hard to find, not niche import models, and not outdated.

Prioritise smart market-aware recommendations: choose the best current-value, current-relevance phones for the user's actual needs, not generic famous models.

Return ONLY a raw JSON object. No markdown, no backticks, no explanations. Start with { and end with }.`;

    const primaryUses = body.primaryUse.join(", ");
    const mustHaveFeatures = body.mustHaveFeatures?.length
      ? body.mustHaveFeatures.join(", ")
      : "None";
    const painPoints = body.currentPainPoints?.length
      ? body.currentPainPoints.join(", ")
      : "None";

    const recommendationPrompt = `A user wants a phone recommendation:
- Budget: ₹${body.budget.toLocaleString("en-IN")}
- Primary uses: ${primaryUses}
- Brand preference: ${body.brandPreference}
- Current phone / upgrade context: ${body.currentPhone || "Not specified"}
- Upgrade tier: ${body.upgradeTier || "Not specified"}
- Current pain points: ${painPoints}
- Camera priority: ${body.cameraPriority || "Not specified"}
- Gaming priority: ${body.gamingPriority || "Not specified"}
- Must-have features: ${mustHaveFeatures}

Recommend exactly 3 phones within or close to their budget. Prioritise phones that best match the user's actual needs. Only include phones that are popular and widely available in India today. Return this exact JSON shape:
{
  "phones": [
    {
      "rank": 1,
      "name": "Full phone name",
      "brand": "Brand",
      "price": "₹XX,XXX",
      "priceNumeric": 12345,
      "tagline": "Short catchy tagline",
      "whyThisPhone": "1-2 concise sentences, max 200 characters, explaining why this phone fits the user's specific needs",
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
- priceNumeric must be your best estimate of the current India market price.
- price must be priceNumeric formatted in INR (e.g. ₹59,999).
- Make whyThisPhone genuinely personalised to the user's priorities.
- whyThisPhone must be 200 characters or fewer.
- amazonSearchQuery should be the exact phone name.
- All scores and matchScore must be between 0 and 100.
- matchReasons, avoidIf, and bestFor should be concise and useful.
- Return only raw JSON.`;

    let parsed: AIRecommendationResponse | null = null;
    let lastAttemptError: unknown = null;

    for (let attempt = 0; attempt < MAX_RECOMMENDATION_ATTEMPTS; attempt++) {
      try {
        const recommendationAttemptPrompt = `${recommendationPrompt}${
          attempt === 0
            ? ""
            : `\n\nCorrection note for this retry:\n- The previous attempt failed: ${formatRecommendationAttemptFeedback(lastAttemptError)}\n- Fix the issue and return valid JSON.\n- Do not repeat the same invalid response.`
        }`;

        const rawRecommendation = await createClaudeResponse(
          systemPrompt,
          recommendationAttemptPrompt
        );
        const candidate = JSON.parse(
          extractJsonObject(rawRecommendation)
        ) as AIRecommendationResponse;

        validateRecommendationPayload(candidate);
        parsed = candidate;
        break;
      } catch (attemptError) {
        console.error(`Recommendation attempt ${attempt + 1} failed:`, attemptError);
        lastAttemptError = attemptError;
      }
    }

    if (!parsed) {
      throw lastAttemptError instanceof Error
        ? lastAttemptError
        : new Error("Unable to build a valid shortlist after multiple attempts.");
    }

    const response: RecommendationResponse = {
      summary: parsed.summary,
      phones: parsed.phones.map((phone) => ({
        ...phone,
        priceNumeric: Math.round(phone.priceNumeric),
        price: formatInr(phone.priceNumeric),
      })),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Recommendation API error:", error);
    const errorDetails = getFriendlyRecommendationErrorDetails(error);
    return NextResponse.json(
      errorDetails,
      { status: 500 }
    );
  }
}
