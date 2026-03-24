# PhonePicker AI — Agent Instructions

> This document provides full context about the **phone-picker-ai** codebase for AI agents performing code generation, review, debugging, or feature work.

---

## Overview

**PhonePicker AI** is a free, AI-powered smartphone recommendation tool targeting **Indian buyers**. Users complete a 5-step form, and the app returns the top 3 phones matched to their needs with pricing and Amazon India affiliate links.

- **One page, no auth, no database.** All state is local React `useState`.
- **Server-side AI call only.** The Anthropic API key is never exposed to the client.
- **Monetization:** Amazon Associates affiliate links (India).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14.2 (App Router) |
| Language | TypeScript 5 |
| AI | Anthropic Claude (`claude-haiku-4-5-20251001`) via `@anthropic-ai/sdk` |
| Styling | Tailwind CSS 3 + custom CSS (glass-morphism) |
| Animations | Motion / Framer Motion v12 |
| UI primitives | Radix UI (`@radix-ui/react-progress`, `@radix-ui/react-separator`, `@radix-ui/react-slot`) |
| Class utility | `clsx` + `tailwind-merge` via `cn()` helper in `lib/utils.ts` |
| Fonts | Outfit (sans) + DM Mono (mono) via `next/font/google` |

---

## Project Structure

```
app/
  layout.tsx              Root layout: fonts, CosmicBg, metadata
  page.tsx                Single-page app; all app-level state lives here
  globals.css             Global styles, CSS variables, custom utility classes, keyframes
  api/
    recommend/
      route.ts            POST /api/recommend — server-side AI recommendation endpoint

components/
  StepForm.tsx            5-step wizard form; lifts final FormData to page.tsx on submit
  PhoneResults.tsx        Results screen; maps phones → PhoneCard
  PhoneCard.tsx           Single phone card with specs, scores, pros/cons, buy button
  BudgetSlider.tsx        Range slider ₹5,000–₹2,00,000
  SelectChips.tsx         Pill/chip multi-select or single-select toggle input
  LoadingCards.tsx        Skeleton loading state with cycling messages
  CosmicBg.tsx            Animated star/orb fixed background (decorative only)
  SpecBadge.tsx           Small glass tile for a single spec label+value
  ui/                     Custom SVG icon components (no third-party icon library)

lib/
  utils.ts                cn() helper (clsx + tailwind-merge)
  amazon.ts               Amazon Associates affiliate URL builders
  tracking.ts             Event tracking stubs (console.log / commented-out gtag)

types/
  index.ts                All shared TypeScript interfaces
```

---

## Environment Variables

| Variable | Side | Required | Purpose |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | Server | Yes | Authenticates Anthropic API calls. Never exposed to the client. |
| `NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG` | Client (public) | No | Amazon Associates tag. Defaults to `"YOUR-TAG-21"` if unset. |

Store both in `.env.local` at the project root (never commit this file).

---

## TypeScript Types (`types/index.ts`)

```ts
interface FormData {
  budget: number;           // ₹5,000–₹2,00,000
  primaryUse: string[];     // e.g. ["Camera", "Gaming"]
  brandPreference: string;  // e.g. "Samsung" | "No preference"
  currentPhone: string;     // free text, optional/skippable
  mustHaveFeatures: string[]; // e.g. ["5G", "Fast charging"]
}

interface PhoneRecommendation {
  rank: 1 | 2 | 3;
  name: string;
  brand: string;
  price: string;            // formatted "₹XX,XXX"
  priceNumeric: number;
  tagline: string;
  whyThisPhone: string;     // personalized 2-3 sentence AI explanation
  specs: {
    display: string;
    processor: string;
    camera: string;
    battery: string;
    ram: string;
    os: string;
  };
  scores: {
    camera: number;         // 0–100
    battery: number;
    performance: number;
    value: number;
    display: number;
  };
  pros: string[];
  cons: string[];
  amazonSearchQuery: string; // exact phone name used to build Amazon search URL
  isBestPick: boolean;       // true only for rank === 1
}

interface RecommendationResponse {
  phones: PhoneRecommendation[];
  summary: string;           // one-sentence summary shown above cards
}
```

---

## API Route — `POST /api/recommend`

**File:** `app/api/recommend/route.ts`

### Request body
```json
{
  "budget": 25000,
  "primaryUse": ["Camera", "Social Media"],
  "brandPreference": "No preference",
  "currentPhone": "Redmi Note 10",
  "mustHaveFeatures": ["5G", "Fast charging"]
}
```

### Validation
- `budget`, `primaryUse`, `brandPreference` are required.
- Budget must be between `5000` and `200000` (inclusive).
- Returns `400` with `{ error: string }` on validation failure.

### AI call
- Model: `claude-haiku-4-5-20251001`, max tokens: `4096`
- System prompt instructs the model to return **only raw JSON** (no markdown, no explanation).
- User prompt includes all form fields as natural language.
- JSON is extracted robustly by slicing from the first `{` to the last `}` to handle any stray markdown.

### Success response (`200`)
```json
{
  "phones": [ /* 3 × PhoneRecommendation */ ],
  "summary": "Based on your ₹25,000 budget and love for cameras..."
}
```

### Error responses
| Scenario | Status | Body |
|---|---|---|
| Missing/invalid fields | `400` | `{ "error": "..." }` |
| AI API failure | `500` | `{ "error": "AI service unavailable..." }` |
| JSON parse failure | `500` | `{ "error": "Failed to parse recommendation." }` |

---

## Data Flow

```
User fills StepForm (5 steps)
  └─ StepForm internal state: { budget, primaryUse, brandPreference, currentPhone, mustHaveFeatures }

"Find My Phone" clicked
  └─ StepForm.onSubmit(formData) → page.tsx handleSubmit()

page.tsx handleSubmit(data: FormData)
  ├─ setLoading(true)
  ├─ trackFormComplete(data)          ← lib/tracking.ts
  └─ fetch("POST /api/recommend", { body: JSON.stringify(data) })
       └─ server: validate → call Claude → parse JSON → return RecommendationResponse

page.tsx on success
  ├─ setResults(json)
  └─ setLoading(false)
       └─ renders <PhoneResults results={json} budget={formData.budget} />

PhoneResults → <PhoneCard> × 3

PhoneCard "Buy on Amazon" click
  ├─ trackPhoneClick(name, rank, budget)    ← lib/tracking.ts
  └─ getBestAmazonUrl(phone.amazonSearchQuery)  ← lib/amazon.ts
       └─ window.open(affiliateUrl, "_blank", "noopener,noreferrer")
```

---

## State Management

No external state library. All app-level state lives in `app/page.tsx` as `useState`:

| State | Type | Purpose |
|---|---|---|
| `formData` | `FormData \| null` | Last submitted form values (preserved for "Try Again") |
| `loading` | `boolean` | Toggles `LoadingCards` skeleton screen |
| `results` | `RecommendationResponse \| null` | AI results; when set, shows `PhoneResults` |
| `error` | `string \| null` | Inline error message below the form |

`StepForm` manages its own internal `step` (1–5) counter and `formData` draft state; it only lifts data to the parent on the final step submit.

---

## Styling Conventions

- **Design language:** Dark cosmic glass-morphism. Base background `#0d0818`, frosted-glass cards with `backdrop-filter: blur`, gradient accents in purple/blue/pink.
- **Always dark:** `<html className="dark">` is hardcoded. `tailwind.config.js` uses `darkMode: ["class"]`.
- **Custom CSS utility classes** (defined in `globals.css`):
  - `.glass-card` / `.glass-card-strong` — frosted glass surfaces
  - `.gradient-text` — purple-to-pink gradient text
  - `.btn`, `.btn-primary`, `.btn-primary-lg`, `.btn-ghost`, `.btn-link`, `.btn-amazon` — button variants
- **CSS variables:** `--glass`, `--glass-strong`, `--glass-border`, `--text-bright/mid/dim`, `--accent-purple/blue/pink/green/red`
- **Keyframes:** `twinkle` (stars), `shimmer` (skeleton loading), `pulse-star` (best pick badge), `score-fill`, `fadeUp`
- **Do not add light-mode styles.** The app intentionally has no light theme.
- **Use `cn()` from `lib/utils.ts`** for all conditional class merging.

---

## Components — Quick Reference

| Component | File | Key Props |
|---|---|---|
| `StepForm` | `components/StepForm.tsx` | `onSubmit: (data: FormData) => void` |
| `PhoneResults` | `components/PhoneResults.tsx` | `results`, `budget`, `onStartOver` |
| `PhoneCard` | `components/PhoneCard.tsx` | `phone: PhoneRecommendation`, `budget`, `animationDelay?` |
| `BudgetSlider` | `components/BudgetSlider.tsx` | `value`, `onChange` |
| `SelectChips` | `components/SelectChips.tsx` | `options`, `selected`, `onChange`, `multiSelect` |
| `LoadingCards` | `components/LoadingCards.tsx` | _(none)_ |
| `CosmicBg` | `components/CosmicBg.tsx` | _(none)_ — used once in layout |
| `SpecBadge` | `components/SpecBadge.tsx` | `label`, `value`, `icon?` |

### Icon components (`components/ui/`)
All icons are custom inline SVG React components. No third-party icon library is used. Available icons: `ArrowLeft`, `ArrowRight`, `Badge`, `Battery`, `Button`, `Card`, `Cart`, `Check`, `Cpu`, `Eye`, `Input`, `Layers`, `Maximize`, `Progress`, `Separator`, `Settings`, `Skeleton`, `Sparkles`.

---

## `lib/amazon.ts` — Affiliate URL Helpers

```ts
getAmazonSearchUrl(query: string): string
// → https://www.amazon.in/s?k=<encoded>&tag=<AMAZON_TAG>

getAmazonProductUrl(asin: string): string
// → https://www.amazon.in/dp/<asin>?tag=<AMAZON_TAG>

getBestAmazonUrl(phoneName: string): string
// Returns product URL if ASIN found in PHONE_ASINS map, else falls back to search URL.
// PHONE_ASINS is currently an empty map — populate it to enable direct product links.
```

---

## `lib/tracking.ts` — Analytics Stubs

Both functions currently log to `console.log`. The `gtag` calls are commented out. Replace the stubs with real analytics when integrating Google Analytics or similar.

```ts
trackPhoneClick(phoneName: string, rank: number, budget: number): void
trackFormComplete(formData: FormData): void
```

---

## Key Conventions & Constraints

1. **India-specific:** All prices are in INR (₹). Budget range is ₹5,000–₹2,00,000. Amazon links are `amazon.in`.
2. **No database or session storage.** Results are ephemeral; refreshing resets to the form.
3. **The API route is the only server-side code.** All other files are client components or shared utilities.
4. **`FormData` is a custom interface** defined in `types/index.ts`. Do not confuse it with the browser's native `FormData` Web API.
5. **Claude model name is hardcoded** in `app/api/recommend/route.ts`. Update it there if switching models.
6. **Amazon ASIN map (`PHONE_ASINS`) is empty.** `getBestAmazonUrl` falls back to search links for all phones until ASINs are populated.
7. **Tracking is a no-op in production** until the `gtag` calls in `lib/tracking.ts` are uncommented and Google Analytics is configured.
8. **`StepForm` step 4 (current phone) is skippable** — the Next button is not gated on that field.
