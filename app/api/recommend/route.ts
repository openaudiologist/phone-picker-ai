import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { FormData, RecommendationResponse } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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

    const systemPrompt = `You are an expert mobile phone advisor for Indian buyers in 2025-2026. You have deep knowledge of all phones available in India across all brands and price ranges. Always recommend phones that are actually available on Amazon India. Return ONLY a raw JSON object. No markdown, no backticks, no explanation. Start with { and end with }.`;

    const userPrompt = `A user wants a phone recommendation:
- Budget: ₹${body.budget.toLocaleString("en-IN")}
- Primary uses: ${body.primaryUse.join(", ")}
- Brand preference: ${body.brandPreference}
- Current phone: ${body.currentPhone || "Not specified"}
- Must-have features: ${body.mustHaveFeatures?.length ? body.mustHaveFeatures.join(", ") : "None"}

Recommend exactly 3 phones available in India 2025-2026 within or close to their budget. Return this JSON:
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
      "isBestPick": true
    }
  ],
  "summary": "One sentence summary of recommendations"
}
Set isBestPick: true only for rank 1. Make whyThisPhone personalised to their use case. amazonSearchQuery should be the exact phone name. All scores should be between 0 and 100.`;

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20241022",
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

    return NextResponse.json(parsed, { status: 200 });
  } catch (error) {
    console.error("Recommendation API error:", error);
    return NextResponse.json(
      { error: "Failed to get recommendations. Please try again." },
      { status: 500 }
    );
  }
}
