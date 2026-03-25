import { NextRequest, NextResponse } from "next/server";
import type { YoutubeInsightResponse } from "@/types";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

function createEmptyResponse(phoneName: string): YoutubeInsightResponse {
  return {
    phoneName,
    videoCount: 0,
    topChannels: [],
    highlights: [],
  };
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function extractHighlights(
  phoneName: string,
  videoTitles: string[],
  commentTexts: string[]
) {
  const corpus = [...videoTitles, ...commentTexts].join(" ").toLowerCase();
  const highlights: string[] = [];

  const signalDefinitions = [
    {
      label: "camera",
      keywords: ["camera", "photo", "portrait", "selfie", "low light", "video"],
      text: `Reviewers repeatedly focus on the ${phoneName} camera experience.`,
    },
    {
      label: "battery",
      keywords: ["battery", "backup", "screen on time", "charging", "drain"],
      text: `Battery life and charging are common talking points for the ${phoneName}.`,
    },
    {
      label: "performance",
      keywords: ["performance", "gaming", "fps", "smooth", "fast", "processor", "lag"],
      text: `Performance and gaming behaviour show up often in review coverage for the ${phoneName}.`,
    },
    {
      label: "display",
      keywords: ["display", "screen", "amoled", "brightness", "refresh rate"],
      text: `Display quality is a recurring theme in ${phoneName} reviews.`,
    },
    {
      label: "software",
      keywords: ["software", "ui", "update", "bloat", "clean ui"],
      text: `Software experience comes up frequently when reviewers discuss the ${phoneName}.`,
    },
    {
      label: "value",
      keywords: ["value", "price", "worth", "budget", "money"],
      text: `Value for money is frequently discussed in ${phoneName} reviews.`,
    },
  ];

  for (const signal of signalDefinitions) {
    const matches = signal.keywords.reduce((count, keyword) => {
      return count + (corpus.includes(keyword) ? 1 : 0);
    }, 0);

    if (matches >= 2) {
      highlights.push(signal.text);
    }
  }

  const complaintKeywords = [
    "heating",
    "heat",
    "overheat",
    "throttling",
    "lag",
    "battery drain",
    "overpriced",
    "slow charging",
    "ads",
    "bloatware",
    "issue",
    "problem",
    "poor",
  ];

  const complaintHits = complaintKeywords.filter((keyword) => corpus.includes(keyword));
  if (complaintHits.length > 0) {
    highlights.push(
      `Common complaints mention ${complaintHits.slice(0, 2).join(" and ")} in some reviews of the ${phoneName}.`
    );
  }

  if (highlights.length === 0 && videoTitles.length > 0) {
    highlights.push(
      `Recent India-focused reviews are available for the ${phoneName}, but no strong repeated signal stood out from the limited sample.`
    );
  }

  return highlights.slice(0, 4);
}

async function fetchYouTubeJson<T>(path: string, params: Record<string, string>) {
  const url = new URL(`${YOUTUBE_API_BASE}/${path}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`YouTube API request failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function POST(req: NextRequest) {
  try {
    const { phoneName } = (await req.json()) as { phoneName?: string };

    if (!phoneName || !phoneName.trim()) {
      return NextResponse.json(
        { error: "phoneName is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(createEmptyResponse(phoneName), { status: 200 });
    }

    const searchResponse = await fetchYouTubeJson<{
      items?: Array<{
        id?: { videoId?: string };
        snippet?: { title?: string; channelTitle?: string };
      }>;
    }>("search", {
      key: apiKey,
      part: "snippet",
      q: `${phoneName} review india`,
      type: "video",
      maxResults: "6",
      relevanceLanguage: "en",
      regionCode: "IN",
      safeSearch: "moderate",
      order: "relevance",
    });

    const searchItems = searchResponse.items ?? [];
    const videoIds = searchItems
      .map((item) => item.id?.videoId)
      .filter((videoId): videoId is string => Boolean(videoId));

    if (videoIds.length === 0) {
      return NextResponse.json(createEmptyResponse(phoneName), { status: 200 });
    }

    const videoTitles = searchItems
      .map((item) => item.snippet?.title?.trim())
      .filter((title): title is string => Boolean(title));
    const topChannels = uniqueStrings(
      searchItems
        .map((item) => item.snippet?.channelTitle?.trim())
        .filter((channel): channel is string => Boolean(channel))
    ).slice(0, 4);

    const commentTexts: string[] = [];

    for (const videoId of videoIds.slice(0, 2)) {
      try {
        const commentsResponse = await fetchYouTubeJson<{
          items?: Array<{
            snippet?: {
              topLevelComment?: {
                snippet?: {
                  textDisplay?: string;
                };
              };
            };
          }>;
        }>("commentThreads", {
          key: apiKey,
          part: "snippet",
          videoId,
          maxResults: "4",
          order: "relevance",
          textFormat: "plainText",
        });

        for (const item of commentsResponse.items ?? []) {
          const text = item.snippet?.topLevelComment?.snippet?.textDisplay?.trim();
          if (text) {
            commentTexts.push(text);
          }
        }
      } catch {
        // Comments are optional; keep the endpoint resilient if they are disabled.
      }
    }

    const highlights = extractHighlights(phoneName, videoTitles, commentTexts);

    return NextResponse.json(
      {
        phoneName,
        videoCount: videoIds.length,
        topChannels,
        highlights,
      } satisfies YoutubeInsightResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error("YouTube insights API error:", error);

    return NextResponse.json(
      createEmptyResponse("Unknown phone"),
      { status: 200 }
    );
  }
}
