# Amazon India Associates Program — Compliance Reference

> Extracted from the [Amazon India Associates Program Help Center](https://affiliate-program.amazon.in/help/node) on 2026-03-26.  
> This file is a reference for building and maintaining compliance in the PhonePicker AI app.

---

## Table of Contents

1. [Operating Agreement — Key Sections](#operating-agreement--key-sections)
2. [Participation Requirements](#participation-requirements)
3. [Linking Requirements](#linking-requirements)
4. [Advertising Fee Schedule](#advertising-fee-schedule)

---

## Operating Agreement — Key Sections

Source: https://affiliate-program.amazon.in/help/operating/agreement/

### §3 — Links on Your Site

- Must use properly tagged **Special Links** for tracking.
- Links must direct customers to the Amazon Site to browse, buy, or consume content.
- Associates earn fees only on **Qualifying Purchases** made through properly formatted Special Links.
- Amazon may modify link formats over time; Associates must comply.

### §5 — Your Responsibilities

- **Privacy Policy Required:** "Your site must include and you will abide by a privacy policy that provides each visitor with clear and conspicuous notice of your data collection practices, including for any data collected by third party ad networks."
- Must ensure accuracy of product descriptions on your site.
- Must not make false or misleading claims about products or Amazon.
- You are responsible for the development, operation, and maintenance of your site.

### §7 — Advertising Fees

- Fees are earned on **Qualifying Purchases** that occur within a **24-hour session window** after a customer clicks a Special Link.
- **Exclusions — no fees earned on:**
  - Your own personal purchases
  - Incentivized clicks (offering rewards/credits for clicking)
  - Improperly formatted links (missing tag, broken tracking)
  - Mobile apps that are not approved under the Mobile Application Policy
- Fee rates vary by product category (see Fee Schedule below).

### §8 — Payment and Tax

- Minimum payout: **₹1,000 for NEFT** transfers.
- **GST compliance required** — Amazon may withhold taxes as required.
- Tax withholding applies per Indian tax law.

### §10 — Identifying Yourself as an Associate (MANDATORY DISCLOSURE)

> **You must clearly state the following (or substantially similar wording) on your site:**
>
> **"As an Amazon Associate I earn from qualifying purchases."**

- This disclosure must be prominent and visible.
- Applies to all Associates regardless of whether they use the PA API.

### §11 — License to Use Product Advertising API (PA API)

- PA API content can be **cached ≤24 hours**.
- If product price data is refreshed less than hourly, you **must include a date/time stamp** showing when the price was last updated.
- You **must include a price disclaimer** indicating prices may change.
- **Must NOT store or cache product images** locally.
- Product content **must link only to the Amazon Site**.
- Requires the PA API License Agreement to be accepted.

#### Key rule on price display:

> "Product prices and availability may vary from time to time. Because prices for and availability of Products that you have listed on your site may change, your site may only show prices and availability if:  
> **(a)** we serve the link in which that price and availability data are displayed; or  
> **(b)** you obtain Product pricing and availability data via the Product Advertising API and you comply with the requirements set forth in the License Agreement."

**AI-estimated prices satisfy neither (a) nor (b). Displaying them is a violation.**

### §21 — Mobile Application Policy

- App must be **free**.
- Must have **original content**.
- Must **NOT emulate Amazon shopping** experience.
- Must **NOT have price tracking or alerting** functionality.

---

## Participation Requirements

Source: https://affiliate-program.amazon.in/gp/associates/help/operating/participation

31 numbered rules. Key rules for PhonePicker AI:

| Rule | Summary |
|------|---------|
| **5** | Content must link **only to Amazon** (not competitor marketplaces) |
| **7** | Mobile restrictions (but does not apply to non-mobile-optimized web accessed via browser) |
| **14** | **No incentives or rewards** for using affiliate links (cashback, points, etc.) |
| **20** | **No customer confusion** about your relationship with Amazon — do not imply official partnership |
| **22** | **No framing** of the Amazon Site (iframes, etc.) |
| **28** | **No star ratings or reviews** unless obtained from the PA API |
| **31** | **Must NOT have price tracking or alerting functionality** |

### Full list:

1. Site must contain original content, not just product links
2. Content must be appropriate (no adult, violent, defamatory, or illegal content)
3. No misleading claims about products
4. No impersonation of Amazon or its employees
5. Links must direct to Amazon only, not competitors
6. No cloaking affiliate links (must be clear you're linking to Amazon)
7. Mobile restrictions apply if your app is a mobile-optimized application
8. No placement of ads that obscure site content
9. No pop-ups or pop-unders triggered by affiliate links
10. No automatic redirects to Amazon
11. No use of Amazon Special Links in offline material (print, TV, radio)
12. No use of Special Links in email (except as specifically permitted)
13. No use of Special Links in ebooks or documents
14. No offering monetary or other incentives for clicks
15. No purchasing through your own affiliate links
16. No misleading domain names (e.g., Amazon-anything.com)
17. No use of Amazon trademarks in domain names
18. No paid search (SEM/PPC) bidding on Amazon brand terms
19. No link placement on sites you don't own/control
20. No creating confusion about your relationship with Amazon
21. No false urgency or scarcity claims about Amazon promotions
22. No framing of the Amazon Site
23. No use of Amazon product information except through approved methods
24. No scraping or programmatic access to Amazon (except through PA API)
25. No use of Amazon product images except through PA API
26. No use of Amazon customer reviews except through PA API
27. No API calls that violate the PA API License Agreement
28. No star ratings or reviews unless from PA API
29. Pricing information only from approved sources (PA API or Amazon-served widgets)
30. No malware, spyware, or adware
31. No price tracking, price alerting, or price comparison tools (except using PA API data with both new and used lowest prices)

---

## Linking Requirements

Source: https://affiliate-program.amazon.in/gp/associates/help/operating/linking

### General Requirements

- **All links must include your Associate tag** (format: `XXXXX-21` or as designated) as a URL parameter.
- Must not use a link shortener in a way that hides the Amazon destination.
- You may add or delete product links at any time without approval.
- **Must remove references to expired promotions** immediately on/before expiry.
- Must not make inaccurate, overbroad, deceptive, or misleading claims about any Product, the Amazon Site, or Amazon's policies/promotions/prices.

### Price Display Rules (Critical)

> Your site may **only show prices and availability** if:
>
> **(a)** we serve the link in which that price and availability data are displayed; or
>
> **(b)** you obtain Product pricing and availability data via the Product Advertising API and you comply with the requirements set forth in the License Agreement.
>
> **You may not otherwise include price information on your site.**

### Price Comparison Rules

If you display prices in any "comparison" format alongside non-Amazon prices, you must display:
- The lowest "new" price on Amazon
- The lowest "used" price if Amazon provides it

### Dynamic Link Requirements

Certain Amazon-provided links dynamically generate products based on page context. If you implement mechanisms that prevent Amazon from crawling your site, these links may malfunction — you bear responsibility.

---

## Advertising Fee Schedule

Source: https://affiliate-program.amazon.in/gp/associates/help/operating/advertisingfees

### Table 1 — Advertising Rates (March 2026)

| Category | Rate |
|----------|------|
| Beauty, Apparel & Accessories, Shoes, Luggage & Bags, Home | 5% |
| Kitchen, Furniture, Home Improvement | 5% |
| Grocery, Amazon Fresh | 4% |
| Echo & Alexa Devices, Fire TV Devices | 5% |
| Baby, Pet, Health & Personal Care | 4% |
| Mobile Accessories | **4%** |
| Books, Office Products, Toys | 5% |
| BISS, Lawn & Garden, Automotive, Sports | 2% |
| Personal Care Appliances | 5% |
| PCs, Smart Watches, TVs, Electronics, Large Appliances | 3.5% |
| Bicycles & Heavy Gym Equipment, Tyres & Rims | 2.5% |
| Jewellery (excl silver & gold coins), Data Storage | 2% |
| **Mobile Phones** | **1%** |
| Bill Payment & Recharges | 30% (max ₹3) |
| All Other Categories | 5% |

### Mobile Phones — Differential Rates (Critical for PhonePicker AI)

**Most popular phone models earn 0% commission:**

| Brand/Models | Rate |
|---|---|
| All iPhone models | **0%** |
| Samsung Galaxy S23 Ultra, S24, S25, S25 Plus, S25 Ultra, Fold6, Flip6, Fold7, A-series, M-series | **0%** |
| OnePlus Open, 12, 12R, Nord CE4 Lite, Nord 4 | **0%** |
| Xiaomi 14, 15, 14 Civi | **0%** |
| All iQOO Z-series, Neo series, flagships | **0%** |
| Motorola Razr series | **0%** |
| Vivo Y-series, X Fold, V50/V50e | **0%** |
| Oppo F27, A3X, A3 Pro, A5x | **0%** |
| Realme narzo 70/N65/GT 6T/13+ | **0%** |
| Redmi Note 13 Pro+, Note 12, A3, 13C, 13 5G | **0%** |
| POCO M6 Plus, X6 Pro, X6, C65, C61 | **0%** |
| Tecno, itel, Nokia, Lava, HMD, Honor, Jio models | **0%** |

**Some newer/specific models earn 0.5%:**

| Brand/Models | Rate |
|---|---|
| Redmi Note 14 Pro, Note 14 Pro+ 5G, A5, 15, 14C, Note 14, 15C 5G | **0.5%** |
| OnePlus Nord CE4, 13, 13R, 13s | **0.5%** |
| Samsung Fold7, S25 Ultra, S25, M06, M07, M36, M17 | **0.5%** |
| Realme GT 7T, GT 7 Pro, narzo 80 series | **0.5%** |
| iQOO Z10X, Neo 10, Z10 series | **0.5%** |
| OPPO Reno 14, Reno 14 Pro | **0.5%** |

### Excluded Products (0% always)

- Flight Bookings and Gift Cards
- Video Gaming Consoles & Hardware
- Prime Membership
- Kindle EBooks
- Gold & Silver Coins
- Apple Products (MacBooks, Apple Watch, iPads, PC Accessories)
- All Earphones, Headphones, Speakers & Audio Accessories below ₹3000 MRP
- All Microwaves & Semi-Automatic Washing Machines

### Table 2 — Bounty Events (Higher Value)

| Event | Bounty |
|-------|--------|
| Prime Paid Membership signup | **₹100** |
| Amazon Business registration | **₹200** |
| Audible Free Trial | **₹150** |
| Audible Paid Membership | **₹150** |
| Sell On Amazon — Completed Registration | ₹10 |
| Sell On Amazon — GST Validated | **₹400** |
| Prime Music First Stream | **₹100** |
| Prime Music Paid Membership | **₹100** |

---

## Revenue Strategy Implications

### The 0% Commission Problem

Most phones the AI recommends will earn **zero commission**. The 1% general mobile rate only applies to unlisted models. For a ₹20,000 phone recommendation:
- Listed model (most popular phones): ₹0
- Unlisted model: ₹200 maximum
- 0.5% model: ₹100

### Higher-Value Opportunities

| Source | Potential |
|--------|-----------|
| Phone accessories (cases, chargers, earphones >₹3000) | **4% per sale** |
| Mobile accessories | **4% per sale** |
| Amazon Prime signups | **₹100 per registration** |
| Audible trials | **₹150 per trial** |
| General "All Other" category | **5% per sale** |

**Recommendation:** Position phone recommendations as the traffic driver. Monetize through accessory cross-sells and Prime/Audible bounty links post-recommendation.
