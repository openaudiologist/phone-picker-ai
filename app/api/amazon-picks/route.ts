import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { AmazonMarketPick } from "@/types";

const CLAUDE_MODEL = "claude-haiku-4-5-20251001";

interface AIAmazonMarketPicksResponse {
  phones: AmazonMarketPick[];
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function extractJsonObject(raw: string) {
  const jsonStart = raw.indexOf("{");
  const jsonEnd = raw.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("Failed to parse Amazon picks response.");
  }

  return raw.slice(jsonStart, jsonEnd + 1);
}

async function createClaudeResponse(systemPrompt: string, userPrompt: string) {
  const message = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: userPrompt,
      },
    ],
    system: systemPrompt,
  });

  return message.content[0].type === "text" ? message.content[0].text : "";
}

function validateAmazonPicksPayload(payload: AIAmazonMarketPicksResponse) {
  if (!Array.isArray(payload.phones) || payload.phones.length !== 4) {
    throw new Error("Amazon picks response must contain exactly 4 phones.");
  }

  const names = new Set<string>();

  for (const phone of payload.phones) {
    if (
      !isNonEmptyString(phone.name) ||
      !isNonEmptyString(phone.tag) ||
      !isPositiveInteger(phone.priceNumeric) ||
      !isNonEmptyString(phone.amazonSearchQuery)
    ) {
      throw new Error("Amazon pick is missing required fields.");
    }

    const normalizedName = phone.name.trim().toLowerCase();
    if (names.has(normalizedName)) {
      throw new Error(`Duplicate Amazon pick received: ${phone.name}`);
    }
    names.add(normalizedName);
  }
}

export async function GET() {
  try {
    const systemPrompt = `You are an expert smartphone market analyst for Indian buyers.

Build a compact strip of popular phones on Amazon India right now.

You must only include phones that are:
- Recent, popular, and widely available in India from major retailers.
- Not discontinued, not stale, not hard to find, and not outdated.

The result should feel current, relevant, and broad across shopper intents. Return only raw JSON.`;

    const userPrompt = `Return exactly 4 phones for a "Popular phones on Amazon right now" strip.

Output schema:
{
  "phones": [
    {
      "name": "Full phone name",
      "tag": "Short label like Best battery",
      "priceNumeric": 24999,
      "amazonSearchQuery": "exact phone name for amazon search"
    }
  ]
}

Rules:
- Keep the 4 phones meaningfully varied across buyer intent or brand; avoid near-duplicates.
- tag must be concise, 2 to 4 words, useful in a compact card (e.g. "Premium flagship", "Best camera system", "Fast charging king", "Budget all-rounder").
- priceNumeric must be your best realistic estimate of the current India market price.
- amazonSearchQuery should be the exact phone name.
- Return only raw JSON.`;

    const raw = await createClaudeResponse(systemPrompt, userPrompt);
    const parsed = JSON.parse(extractJsonObject(raw)) as AIAmazonMarketPicksResponse;

    validateAmazonPicksPayload(parsed);

    return NextResponse.json({ phones: parsed.phones }, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Amazon picks API error:", error);
    return NextResponse.json(
      { error: "Failed to load Amazon picks" },
      { status: 500 }
    );
  }
}
