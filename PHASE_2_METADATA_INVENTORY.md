# Phase 2: Metadata Inventory — SlideXY

> **Scope: Phase 2 — Metadata Repair (all indexable pages)**

## Core Pages

| URL | Page Type | Title | Meta Description | H1 | Intro |
|---|---|---|---|---|---|
| `/` | Homepage | SlideXY: Smart AI Tool for Presentations & Pitch Decks | Build impressive presentations with AI... | AI Presentation Maker for Slides and Pitch Decks | ✅ |
| `/tools` | Tools Hub | AI Presentation Tools — Create Decks, Videos & More | Explore SlideXY AI tools... | AI Presentation Tools | ✅ |
| `/templates` | Templates Hub | Presentation Templates — Ready-to-Use AI Slide Designs | Browse SlideXY presentation templates... | AI Presentation Templates | ✅ |
| `/pricing` | Pricing | Pricing Plans — SlideXY AI Presentation Builder | Compare SlideXY pricing plans... | SlideXY Pricing | ✅ |
| `/faqs` | FAQ | Frequently Asked Questions — SlideXY | Find answers to common questions... | Frequently Asked Questions | ✅ |
| `/blog` | Blog Hub | Blog — AI Presentation Tips & Updates | Read the SlideXY blog... | SlideXY Blog | ✅ |
| `/features` | Features | Features — AI-Powered Presentation Creation | Discover SlideXY features... | AI-Powered Presentation Features | ✅ |
| `/product` | Product | Product — SlideXY AI Presentation Platform | Learn how SlideXY transforms ideas... | SlideXY AI Presentation Platform | ✅ |
| `/privacy-policy` | Legal | Terms of Service — SlideXY | Read the SlideXY Terms of Service... | Terms of Service | ✅ |

## Tool Subpages

| URL | Page Type | Title | Meta Description | H1 | Intro |
|---|---|---|---|---|---|
| `/tools/prompt-to-deck` | Tool | Prompt to Deck — Generate Slides from Text | Type a prompt and let SlideXY AI generate... | Prompt to Deck | ✅ |
| `/tools/prompt-to-template` | Tool | Prompt to Template — AI Slide Template Generator | Generate custom slide templates... | Prompt to Template | ✅ |
| `/tools/prompt-to-ebook` | Tool | Prompt to eBook — AI eBook Creator | Turn a text prompt into a formatted eBook... | Prompt to eBook | ✅ |
| `/tools/prompt-to-pdf` | Tool | Prompt to PDF — AI PDF Document Generator | Generate polished PDF documents... | Prompt to PDF | ✅ |
| `/tools/prompt-to-proposal` | Tool | Prompt to Proposal — AI Proposal Generator | Create professional business proposals... | Prompt to Proposal | ✅ |
| `/tools/prompt-to-video` | Tool | Prompt to Video — AI Video Presentation Maker | Convert a text prompt into an animated video... | Prompt to Video | ✅ |
| `/tools/text-to-infographics` | Tool | Text to Infographics — AI Infographic Generator | Transform text into stunning infographics... | Text to Infographics | ✅ |
| `/tools/url-to-website` | Tool | URL to Website — AI Website Generator | Paste a URL and let SlideXY AI generate... | URL to Website | ✅ |
| `/tools/video-to-deck` | Tool | Video to Deck — Convert Videos into Slides | Upload a video and SlideXY AI extracts... | Video to Deck | ✅ |
| `/tools/web-to-deck` | Tool | Website to Presentation — Turn Any Webpage into Slides | Paste a website URL and SlideXY AI converts... | Website to Presentation Tool | ✅ |

## Definition of Done ✅

- ✅ Every indexable page has a **unique title** (19/19)
- ✅ Every indexable page has a **unique meta description** (19/19)
- ✅ Every indexable page has a **unique H1** (19/19)
- ✅ Every indexable page has a **unique visible intro section** (19/19)
- ✅ No two pages share the same title, description, or H1

---

## Testing Notes

### 308 vs 301 Redirects
When testing trailing-slash URLs (e.g., `slidexy.ai/blog/` → `slidexy.ai/blog`), you will see a **308 Permanent Redirect** instead of 301. This is **expected behavior** — it comes from Vercel's infrastructure, not from our code.

| Redirect Type | Source | Status Code |
|---|---|---|
| `www` → non-www | Our middleware | **301** |
| Trailing slash removal | Vercel built-in | **308** |

Both 301 and 308 are permanent redirects. Google treats them identically for SEO — so **308 is a pass, not a fail.**

Only flag it if you see:
- **302** (temporary redirect) — that's wrong
- **No redirect at all** — also wrong

### Windows CMD Note
Windows doesn't have `grep`. Use `findstr` instead:
```cmd
curl -s https://slidexy.ai/pricing | findstr /i "canonical"
curl -s https://slidexy.ai/tools | findstr /i "<title>"
```

### How to Verify Phase 2 Items

**Check title:**
```cmd
curl -s https://slidexy.ai/tools | findstr /i "<title>"
```

**Check canonical:**
```cmd
curl -s https://slidexy.ai/tools | findstr /i "canonical"
```

**Check H1 (look for the heading text in the HTML):**
```cmd
curl -s https://slidexy.ai/tools | findstr /i "AI Presentation Tools"
```

### Phase 2 Pass/Fail Checklist

| # | Test | Pass |
|---|---|---|
| 1 | Every page has a unique `<title>` (no two pages share the same) | ☐ |
| 2 | Every page has a unique `<meta name="description">` | ☐ |
| 3 | Every page has a visible H1 matching the table above | ☐ |
| 4 | Every page has a visible intro paragraph below the H1 | ☐ |
| 5 | No tool subpage inherits the homepage title | ☐ |
| 6 | No tool subpage inherits the homepage description | ☐ |
| 7 | Each tool subpage has a self-referencing canonical | ☐ |
