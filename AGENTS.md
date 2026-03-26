# PhonePicker AI — Agent Instructions

> This document provides up-to-date context about the **phone-picker-ai** codebase for AI agents performing code generation, review, debugging, or feature work.

---

## Overview

**PhonePicker AI** is a free, AI-powered smartphone recommendation tool for **Indian buyers**.

The app now uses a **guided chat-style flow** instead of the original standalone step form. Users answer a structured sequence of prompts, the app fetches the top 3 recommendations from Anthropic, and then optionally enriches the shortlist with lightweight YouTube review signals.

- **One page, no auth, no database.**
- **Server-side AI calls only.** The Anthropic API key is never exposed to the client.
- **Optional YouTube enrichment.** Review insights are fetched server-side from the YouTube Data API when available.
- **Monetization:** Amazon India affiliate links (phones, accessories, Prime bounties).
- **Amazon Associates compliance:** Mandatory §10 disclosure, no AI-fabricated prices, `rel="sponsored"` on all affiliate links, privacy policy page.
- **State is local React state.** No external app state manager is used for the user flow.

---

## Current Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.1 (App Router) |
| Language | TypeScript 5 |
| React | React 19.2.4 |
| AI | Anthropic Claude (`claude-haiku-4-5-20251001`) via `@anthropic-ai/sdk` |
| Optional review data | YouTube Data API v3 |
| Styling | Tailwind CSS 4.2 (CSS-first config in `app/globals.css`) |
| UI system | shadcn-style custom primitives + `radix-ui` package |
| Chat UI runtime | `@assistant-ui/react` + custom thread/message rendering |
| Animation | `motion` v12 |
| Icons | `lucide-react` + `@hugeicons/react` |
| Class utility | `clsx` + `tailwind-merge` via `cn()` in `lib/utils.ts` |
| Fonts | Public Sans + DM Mono via `next/font/google` |

---

## High-Level Product Flow

```text
User lands on /
  └─ `app/page.tsx` renders `GuidedChat`

Guided chat flow
  ├─ prompt sequence is defined in `lib/chat-flow.ts`
  ├─ helper mapping lives in `lib/chat-helpers.ts`
  └─ message rendering is handled by `components/assistant-ui/thread.tsx`

Final submit
  └─ `GuidedChat` → `onSubmitFinal(formData)` → POST `/api/recommend`

Recommendation response
  ├─ top 3 `PhoneRecommendation` results
  ├─ summary sentence
  └─ rendered as paginated single-card results inside the thread

Optional follow-up actions
  ├─ local comparison panel (no extra AI call)
  └─ POST `/api/youtube-insights` per phone for review signals

Phone purchase action
  └─ `getBestAmazonUrl()` → Amazon India affiliate URL

Post-results monetization
  ├─ `AccessoryCrossSell` — phone-specific accessory links (4% commission)
  ├─ Prime bounty link (₹100 per signup)
  ├─ `AmazonProductStrip` — popular phones strip
  └─ `AmazonBanner` — category/deals banners
```

---

## Project Structure

```text
app/
  layout.tsx                    Root layout, fonts, tooltip provider wrapper, GA script
  page.tsx                      App entry; owns loading/results/error state
  globals.css                   Tailwind 4 imports, tokens, dark theme, assistant-ui overrides
  privacy/
    page.tsx                    Privacy policy page (Amazon §5 compliance)
  api/
    recommend/
      route.ts                  POST /api/recommend — Anthropic recommendation endpoint
    amazon-picks/
      route.ts                  GET /api/amazon-picks — AI-generated popular phone picks
    youtube-insights/
      route.ts                  POST /api/youtube-insights — YouTube review signal endpoint

components/
  GuidedChat.tsx                Main guided chat experience and orchestration
  AmazonBanner.tsx              Sponsored affiliate banner (deals, search, accessories)
  AmazonProductStrip.tsx        Horizontal scrollable strip of popular Amazon phones
  AppFooterNotice.tsx           Fixed footer with §10 affiliate disclosure + privacy link
  BudgetSlider.tsx              Exact budget slider UI
  LoadingCards.tsx              Recommendation loading skeletons
  PhoneCard.tsx                 Single recommendation card with pagination controls
  SpecBadge.tsx                 Legacy/simple spec tile helper still available
  providers.tsx                 Global UI providers (currently tooltip provider)
  assistant-ui/
    attachment.tsx              Attachment UI helpers
    markdown-text.tsx           Markdown renderer for assistant messages
    thread.tsx                  Chat thread, avatars, scroll behavior, message layout
    tool-fallback.tsx           Tool rendering fallback
    tooltip-icon-button.tsx     Icon button wrapper for thread controls
  chat/
    AccessoryCrossSell.tsx      Post-results accessory grid + Prime bounty CTA
    OptionChips.tsx             Reusable chip-based option selector
    ResultActions.tsx           Compare / YouTube / edit / restart actions
    SummaryCard.tsx             Final summary before recommendation fetch
    YoutubeInsightCard.tsx      Displays YouTube review highlights
  ui/
    avatar.tsx                  Avatar primitive
    badge.tsx                   Badge primitive
    button.tsx                  Button + chip variants
    card.tsx                    Card primitive
    collapsible.tsx             Collapsible primitive
    dialog.tsx                  Dialog primitive
    progress.tsx                Progress primitive
    scroll-area.tsx             Scroll area primitive
    separator.tsx               Separator primitive
    skeleton.tsx                Skeleton primitive
    slider.tsx                  Slider primitive
    tooltip.tsx                 Tooltip primitive

lib/
  amazon.ts                     Amazon affiliate URL helpers, accessory URLs, bounty links
  chat-flow.ts                  Guided chat step definitions and branching rules
  chat-helpers.ts               Message helpers, formatting, request mapping
  tracking.ts                   GA4 event tracking (real gtag calls)
  utils.ts                      `cn()` helper

types/
  index.ts                      Shared app types for chat flow, API payloads, and results

docs/
  amazon-associates-compliance.md  Full Amazon India Associates program reference
```

---

## Environment Variables

| Variable | Side | Required | Purpose |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | Server | Yes | Authenticates recommendation requests to Anthropic. |
| `NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG` | Public/client | No | Amazon India Associates tag. Defaults to `"YOUR-TAG-21"`. |
| `YOUTUBE_API_KEY` | Server | No | Enables `/api/youtube-insights`; if missing, the endpoint returns an empty response. |

### Local env notes

- Use `.env.local` for real local secrets.
- `.env.example` should stay safe to commit.
- Do **not** commit real credentials.
- A root `.env` may exist locally as a placeholder, but it should remain ignored.

---

## Core TypeScript Types (`types/index.ts`)

```ts
interface FormData {
  budget: number;
  primaryUse: string[];
  brandPreference: string;
  currentPhone: string;
  mustHaveFeatures: string[];
  upgradeTier?: string | null;
  currentPainPoints?: string[];
  cameraPriority?: string | null;
  gamingPriority?: string | null;
}

type ChatStepId =
  | "welcome"
  | "budget"
  | "primary_use"
  | "brand"
  | "upgrade_tier"
  | "pain_points"
  | "must_have"
  | "camera_priority"
  | "gaming_priority"
  | "summary"
  | "results";

interface GuidedAnswers {
  quickStart?: string | null;
  budget: number;
  budgetRangeLabel: string;
  primaryUse: string[];
  brandPreference: string;
  upgradeTier?: string | null;
  currentPainPoints: string[];
  mustHaveFeatures: string[];
  cameraPriority?: string | null;
  gamingPriority?: string | null;
}

interface PhoneRecommendation {
  rank: 1 | 2 | 3;
  name: string;
  brand: string;
  price: string;
  priceNumeric: number;
  tagline: string;
  whyThisPhone: string;        // max 200 chars enforced server-side
  specs: {
    display: string;
    processor: string;
    camera: string;
    battery: string;
    ram: string;
    os: string;
  };
  scores: {
    camera: number;
    battery: number;
    performance: number;
    value: number;
    display: number;
  };
  pros: string[];
  cons: string[];
  amazonSearchQuery: string;
  isBestPick: boolean;
  matchReasons?: string[];
  avoidIf?: string[];
  bestFor?: string[];
  matchScore?: number;
}

interface RecommendationResponse {
  phones: PhoneRecommendation[];
  summary: string;
}

interface YoutubeInsightResponse {
  phoneName: string;
  videoCount: number;
  topChannels: string[];
  highlights: string[];
}
```

---

## Guided Chat Architecture

### Main orchestrator: `components/GuidedChat.tsx`

This is the core of the product experience.

Responsibilities:

- Stores guided answers in local state.
- Stores chat message history in local state.
- Converts local messages into `@assistant-ui/react` runtime messages.
- Chooses the next step based on selected priorities.
- Shows a final summary card before submission.
- Renders results inline inside the thread.
- Supports one-card-at-a-time result pagination.
- Adds optional result accessories:
  - comparison panel
  - YouTube review insights

### Flow definition: `lib/chat-flow.ts`

This file defines:

- quick-start presets
- budget options
- step options
- conditional step rules
- default answers
- step ordering and branching helpers

Important branching rules:

- `camera_priority` is only asked if primary use includes `Camera` or `Video`
- `gaming_priority` is only asked if primary use includes `Gaming`

### Mapping helpers: `lib/chat-helpers.ts`

This file handles:

- creating chat message objects
- normalizing skipped answers
- formatting reply labels
- building summary content
- converting `GuidedAnswers` → API `FormData`

---

## Assistant UI Layer

The app uses `@assistant-ui/react` as a rendering/runtime foundation, but **not** as an open-ended chatbot. The experience is tightly scripted.

### `components/assistant-ui/thread.tsx`

Customizes:

- assistant/user message layout
- assistant avatar and user avatar
- auto-scroll behavior
- empty thread welcome state
- markdown rendering
- inline accessory rendering below messages

Important constraint:

- The user does **not** send free-text messages in the current guided flow.

---

## API Routes

### `POST /api/recommend`

**File:** `app/api/recommend/route.ts`

Purpose:

- validate the guided request payload
- call Anthropic server-side
- coerce and validate the AI JSON response
- return exactly 3 recommendations

#### Input expectations

- `budget` is required and must be between `5000` and `200000`
- `primaryUse` must be a non-empty array
- `brandPreference` is required

#### AI model

- `claude-haiku-4-5-20251001`

#### Output constraints enforced in code

- exactly 3 phones
- ranks must be `1`, `2`, `3` with no duplicates
- prices must be INR-formatted (`₹...`)
- scores and `matchScore` must be between `0` and `100`
- `whyThisPhone` must be **200 characters or fewer** after whitespace normalization

#### Error behavior

- `400` for invalid client input
- `500` for AI failures or invalid AI payloads

### `POST /api/youtube-insights`

**File:** `app/api/youtube-insights/route.ts`

Purpose:

- fetch India-focused YouTube review results for a phone
- optionally pull top comments from a subset of videos
- derive lightweight review highlights via keyword heuristics

Behavior:

- if `YOUTUBE_API_KEY` is missing, the endpoint returns an **empty success payload**
- if no videos are found, it also returns an empty success payload
- this route is intentionally resilient and should not block the core recommendation experience

---

## Results Experience

### `components/PhoneCard.tsx`

Displays one phone at a time with:

- headline (no price — prices are not displayed per Amazon Associates Linking Requirements)
- spec grid
- mobile tabbed detail card (`Scores`, `Strengths`, `Why this fits`)
- desktop split layout for scores/details
- Amazon CTA button
- optional pagination controls

### Comparison panel

Implemented inside `GuidedChat.tsx` as `CompareCard`.

Characteristics:

- local-only calculation from returned scores
- no extra AI or network call
- shows category winners and a compact score grid

### YouTube insights panel

Rendered via `components/chat/YoutubeInsightCard.tsx`.

Characteristics:

- fetched only on user action
- shown below results in click order alongside comparison panel
- includes loading state, best-match badge, highlights, and reference channels

---

## State Management

### `app/page.tsx`

Top-level app state:

| State | Type | Purpose |
|---|---|---|
| `formData` | `FormData \| null` | Last submitted request payload |
| `loading` | `boolean` | Active recommendation fetch state |
| `results` | `RecommendationResponse \| null` | Recommendation response |
| `error` | `string \| null` | Fetch failure message |

### `components/GuidedChat.tsx`

Local guided-flow state includes:

- `answers`
- `messages`
- `currentStep`
- draft chip/slider selections
- comparison visibility
- result panel ordering
- current result index
- YouTube insight loading + data

No global store is required for the guided experience.

---

## Styling Conventions

- **Dark mode only.** `<html className="dark">` is hardcoded.
- Tailwind 4 is configured directly in `app/globals.css` using CSS imports and theme tokens.
- Prefer existing primitives in `components/ui/*` over ad hoc styling.
- Shared visual language:
  - rounded, compact cards
  - muted surfaces with subtle rings
  - amber/gold primary accent
  - dense mobile-first spacing
- Assistant UI markdown typing dots are intentionally suppressed in `globals.css`.

When editing styles:

- preserve the compact chat-card layout
- avoid reintroducing a light theme
- prefer tokenized classes (`bg-muted`, `text-muted-foreground`, etc.)

---

## Tracking and Monetization

### `lib/tracking.ts`

Real GA4 event tracking via `window.gtag()`:

- `trackFormComplete(formData)` — fires on recommendation submission
- `trackPhoneClick(phoneName, rank, budget)` — fires on Amazon CTA click
- `trackAffiliateBannerClick(placement, variant)` — fires on banner click
- `trackAffiliateBannerImpression(placement)` — fires on banner view
- `trackAccessoryClick(category, placement)` — fires on accessory card click
- `trackBountyClick(bountyType)` — fires on Prime/Audible bounty click

### `lib/amazon.ts`

- builds Amazon India affiliate URLs with tag from `NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG`
- `getBestAmazonUrl()` — ASIN lookup with search URL fallback
- `getAccessoryUrl()` — phone-specific accessory search links
- `BOUNTY_LINKS` — Prime (₹100 bounty) and Audible (₹150 bounty) tagged URLs
- `getAmazonTodaysDealUrl()`, `getAmazonCategoryUrl()`, `getAmazonDealsUrl()` — category/deals links
- `PHONE_ASINS` is currently empty; all links fall back to search URLs

### Revenue architecture

Most popular phone models earn **0% commission** on Amazon India. Revenue strategy:

| Source | Commission | Component |
|---|---|---|
| Phone accessories (cases, chargers, earphones >₹3000) | **4%** | `AccessoryCrossSell` |
| Amazon Prime signup bounty | **₹100 flat** | `AccessoryCrossSell` (Prime CTA) |
| Audible trial bounty | **₹150 flat** | `BOUNTY_LINKS.audible` (not yet wired) |
| Mobile phones (unlisted models) | 1% | `PhoneCard` Amazon CTA |
| Mobile phones (most popular models) | 0–0.5% | `PhoneCard` Amazon CTA |

See `docs/amazon-associates-compliance.md` for the full fee schedule and compliance reference.

### Amazon Associates compliance

Key compliance measures implemented:

1. **§10 disclosure:** "As an Amazon Associate I earn from qualifying purchases" in `AppFooterNotice.tsx`
2. **No AI-fabricated prices:** Prices from Claude are kept server-side for budget matching but **never rendered** to users (violates Linking Requirements §11)
3. **Privacy policy:** `/privacy` page covers GA, affiliate tracking, third-party services
4. **`rel="sponsored"`** on all Amazon affiliate `<a>` tags
5. **"Sponsored" labels** on all affiliate sections (banners, product strip, accessory cross-sell)
6. **No price tracking/alerting** (Participation Requirement Rule 31)
7. **No Amazon framing** (Rule 22) or customer confusion (Rule 20)

---

## Key Constraints and Conventions

1. **India-specific product assumptions**
   - prices are INR
   - Amazon links must use `amazon.in`
   - YouTube search is biased toward India reviews

2. **No auth, no persistence, no database**
   - everything resets on refresh

3. **Only server routes talk to external APIs**
   - Anthropic and YouTube calls must remain server-side

4. **This is a guided experience, not an open chat bot**
   - avoid adding freeform user input unless intentionally redesigning the UX

5. **`whyThisPhone` is intentionally short**
   - keep recommendation copy concise
   - server validation enforces the limit

6. **Recommendation response shape is stricter than the original app**
   - optional fields like `matchReasons`, `avoidIf`, `bestFor`, and `matchScore` are supported

7. **YouTube insights are optional enrichment**
   - failure or missing API key must not break the main flow

8. **Prefer updating `lib/chat-flow.ts` for step changes**
   - do not hardcode step logic across multiple components when it belongs in the flow definition

9. **Prefer existing UI primitives and tokens**
   - avoid reviving deleted legacy icon/button/card implementations

10. **Google Analytics is loaded in `app/layout.tsx`**
    - `lib/tracking.ts` fires real GA4 events via `window.gtag()`
    - if analytics behavior changes, update both script usage and tracking helpers intentionally

11. **Amazon Associates compliance is enforced**
    - never display AI-estimated prices to users
    - all affiliate links must include `rel="sponsored"` and the associate tag
    - the §10 disclosure in `AppFooterNotice.tsx` must remain visible on every page
    - see `docs/amazon-associates-compliance.md` for the full reference

---

## Recommended Agent Workflow for This Repo

When making changes:

1. Identify whether the change belongs to:
   - chat flow definition
   - UI rendering
   - server recommendation logic
   - YouTube enrichment
   - styling primitives

2. Prefer small, local changes over broad refactors.

3. If changing the user flow, inspect both:
   - `lib/chat-flow.ts`
   - `components/GuidedChat.tsx`

4. If changing result rendering, inspect:
   - `components/PhoneCard.tsx`
   - `components/chat/ResultActions.tsx`
   - `components/chat/AccessoryCrossSell.tsx`
   - `components/chat/YoutubeInsightCard.tsx`

5. If changing server response shape, update:
   - `types/index.ts`
   - `app/api/recommend/route.ts`
   - any consuming UI components

6. If changing affiliate/monetization, inspect:
   - `lib/amazon.ts`
   - `lib/tracking.ts`
   - `components/AmazonBanner.tsx`
   - `components/AmazonProductStrip.tsx`
   - `components/chat/AccessoryCrossSell.tsx`
   - `components/AppFooterNotice.tsx`
   - `docs/amazon-associates-compliance.md`

7. Validate with a production build when possible:

```bash
npm run build
```

---

## Known Historical Drift to Avoid

Older project docs or assumptions may still refer to:

- `StepForm.tsx`
- `PhoneResults.tsx`
- `SelectChips.tsx`
- `CosmicBg.tsx`
- Tailwind 3 config in `tailwind.config.js`
- Next.js 14 / React 18

Those are **outdated**. The current app is centered around `GuidedChat.tsx`, `@assistant-ui/react`, Tailwind 4 CSS-first styling, the `/api/youtube-insights` route, and the Amazon affiliate compliance layer.

---

## Future Considerations

- **Amazon Creators API:** PA API 5.0 is deprecated April 30, 2026. The replacement (Creators API) requires 10 qualifying sales in 30 days. Once qualified, integrate to show real prices and product images.
- **PHONE_ASINS population:** Currently empty. Direct product links convert better than search links. Becomes unnecessary with Creators API.
- **Audible bounty link:** `BOUNTY_LINKS.audible` exists in `lib/amazon.ts` but is not yet wired into any UI component.
