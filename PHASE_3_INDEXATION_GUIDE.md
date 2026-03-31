# Phase 3: Indexation & Crawl Management — SlideXY

> **Scope: Phase 3 — Sitemap, robots.txt, indexability, and search engine setup**
>
> This guide covers sitemap coverage, low-value URL exclusion, robots.txt rules, indexability verification, and search engine monitoring.
>
> Phase 1 (canonical domain & URL control) and Phase 2 (metadata & content) must already be passing before starting Phase 3.

---

## 1. Sitemap Coverage

Navigate to `https://slidexy.ai/sitemap.xml` — must contain exactly **19 URLs**.

### Core pages (9)

| # | URL | Priority | Frequency |
|---|-----|:---:|:---:|
| 1 | `https://slidexy.ai/` | 1.0 | weekly |
| 2 | `https://slidexy.ai/tools` | 0.9 | weekly |
| 3 | `https://slidexy.ai/templates` | 0.9 | weekly |
| 4 | `https://slidexy.ai/pricing` | 0.8 | monthly |
| 5 | `https://slidexy.ai/blog` | 0.8 | weekly |
| 6 | `https://slidexy.ai/faqs` | 0.6 | monthly |
| 7 | `https://slidexy.ai/features` | 0.7 | monthly |
| 8 | `https://slidexy.ai/product` | 0.7 | monthly |
| 9 | `https://slidexy.ai/privacy-policy` | 0.3 | yearly |

### Tool pages (10)

| # | URL | Priority | Frequency |
|---|-----|:---:|:---:|
| 10 | `https://slidexy.ai/tools/prompt-to-deck` | 0.7 | monthly |
| 11 | `https://slidexy.ai/tools/prompt-to-template` | 0.7 | monthly |
| 12 | `https://slidexy.ai/tools/prompt-to-ebook` | 0.7 | monthly |
| 13 | `https://slidexy.ai/tools/prompt-to-pdf` | 0.7 | monthly |
| 14 | `https://slidexy.ai/tools/prompt-to-proposal` | 0.7 | monthly |
| 15 | `https://slidexy.ai/tools/prompt-to-video` | 0.7 | monthly |
| 16 | `https://slidexy.ai/tools/text-to-infographics` | 0.7 | monthly |
| 17 | `https://slidexy.ai/tools/url-to-website` | 0.7 | monthly |
| 18 | `https://slidexy.ai/tools/video-to-deck` | 0.7 | monthly |
| 19 | `https://slidexy.ai/tools/web-to-deck` | 0.7 | monthly |

---

## 2. Low-Value URL Exclusion

Search the sitemap (Ctrl+F) for each path below — **all must return zero results**.

| # | Path | Reason |
|---|------|--------|
| 1 | `/account` | Auth-gated dashboard |
| 2 | `/auth` | Login/signup flow |
| 3 | `/editor` | Requires authentication |
| 4 | `/onboarding` | Post-signup flow |
| 5 | `/success` | Payment callback |
| 6 | `/waiting-list` | No SEO value |
| 7 | `/proposal` | Internal document |
| 8 | `/reports` | Internal document |
| 9 | `/api/` | Backend API routes |
| 10 | `/slice` | Internal state |
| 11 | `/store` | Internal state |

```cmd
curl -s https://slidexy.ai/sitemap.xml | findstr /i "account auth editor onboarding success waiting-list proposal reports /api/ slice store"
```

❌ **Failure:** Any of the above paths appear in sitemap.xml.

---

## 3. Robots.txt

Navigate to `https://slidexy.ai/robots.txt` — must match:

```
User-Agent: *
Allow: /
Allow: /_next/static/
Allow: /_next/image/
Disallow: /account
Disallow: /auth
Disallow: /editor
Disallow: /onboarding
Disallow: /success
Disallow: /api/
Disallow: /slice
Disallow: /store
Disallow: /waiting-list
Disallow: /proposal
Disallow: /reports

Sitemap: https://slidexy.ai/sitemap.xml
```

Key points:
- `/_next/static/` and `/_next/image/` must be **allowed** (crawlers need JS/CSS to render)
- All private/low-value routes must be **disallowed**
- Sitemap URL must be present
- No public page (`/tools`, `/templates`, etc.) should be accidentally blocked

---

## 4. Indexability Verification

For each of the 19 indexable pages, verify four things:

### How to check

```cmd
curl -s https://slidexy.ai/tools | findstr /i "noindex"
curl -s https://slidexy.ai/tools | findstr /i "canonical"
curl -I https://slidexy.ai/tools
```

### Per-page matrix

| # | URL | No noindex | Self-canonical | Status 200 | H1 + intro visible |
|---|-----|:---:|:---:|:---:|:---:|
| 1 | `/` | ☐ | ☐ | ☐ | ☐ |
| 2 | `/tools` | ☐ | ☐ | ☐ | ☐ |
| 3 | `/templates` | ☐ | ☐ | ☐ | ☐ |
| 4 | `/pricing` | ☐ | ☐ | ☐ | ☐ |
| 5 | `/blog` | ☐ | ☐ | ☐ | ☐ |
| 6 | `/faqs` | ☐ | ☐ | ☐ | ☐ |
| 7 | `/features` | ☐ | ☐ | ☐ | ☐ |
| 8 | `/product` | ☐ | ☐ | ☐ | ☐ |
| 9 | `/privacy-policy` | ☐ | ☐ | ☐ | ☐ |
| 10 | `/tools/prompt-to-deck` | ☐ | ☐ | ☐ | ☐ |
| 11 | `/tools/prompt-to-template` | ☐ | ☐ | ☐ | ☐ |
| 12 | `/tools/prompt-to-ebook` | ☐ | ☐ | ☐ | ☐ |
| 13 | `/tools/prompt-to-pdf` | ☐ | ☐ | ☐ | ☐ |
| 14 | `/tools/prompt-to-proposal` | ☐ | ☐ | ☐ | ☐ |
| 15 | `/tools/prompt-to-video` | ☐ | ☐ | ☐ | ☐ |
| 16 | `/tools/text-to-infographics` | ☐ | ☐ | ☐ | ☐ |
| 17 | `/tools/url-to-website` | ☐ | ☐ | ☐ | ☐ |
| 18 | `/tools/video-to-deck` | ☐ | ☐ | ☐ | ☐ |
| 19 | `/tools/web-to-deck` | ☐ | ☐ | ☐ | ☐ |

❌ **Failure:** Any page has `noindex`, a wrong canonical, a non-200 status, or missing H1/intro.

---

## 5. Search Engine Monitoring

### 5.1 Google Search Console
1. Go to https://search.google.com/search-console
2. Property `https://slidexy.ai` must exist and be **verified**
3. Sitemap `https://slidexy.ai/sitemap.xml` must be submitted — status **"Success"**
4. Discovered URLs count should be ~19

### 5.2 Bing Webmaster Tools
1. Go to https://www.bing.com/webmasters
2. Site `https://slidexy.ai` must exist and be **verified**
3. Sitemap `https://slidexy.ai/sitemap.xml` must be submitted and processed

---

## 6. Manual URL Inspection (Post-Deploy)

Use the **URL Inspection** tool in Google Search Console for these priority URLs:

| Priority | URL | Watch For |
|:---:|------|-----------|
| 1 | `https://slidexy.ai/` | Canonical = self, no soft-404 |
| 2 | `https://slidexy.ai/tools` | Canonical = self, indexed |
| 3 | `https://slidexy.ai/templates` | Canonical = self, indexed |
| 4 | `https://slidexy.ai/pricing` | Canonical = self, indexed |
| 5 | `https://slidexy.ai/faqs` | Canonical = self, indexed |
| 6 | `https://slidexy.ai/tools/prompt-to-deck` | Canonical = self, not blocked |
| 7 | `https://slidexy.ai/tools/web-to-deck` | Canonical = self, not blocked |
| 8 | `https://slidexy.ai/tools/prompt-to-video` | Canonical = self, not blocked |
| 9 | `https://slidexy.ai/tools/video-to-deck` | Canonical = self, not blocked |
| 10 | `https://slidexy.ai/tools/prompt-to-template` | Canonical = self, not blocked |

Red flags (any of these = **FAIL**):
- ❌ "Duplicate without user-selected canonical"
- ❌ "Crawled — currently not indexed"
- ❌ "Soft 404"
- ❌ "Alternate page with proper canonical tag"
- ❌ "Blocked by robots.txt"

---

## Testing Notes

### Timing
- **Tests 1–4** can be run immediately after deployment.
- **Test 5** requires one-time manual setup in GSC and Bing after first production deploy.
- **Test 6** requires GSC to have crawled the site — results may take **24–48 hours** after sitemap submission.

### Windows CMD Note
Windows doesn't have `grep`. Use `findstr` instead:
```cmd
curl -s https://slidexy.ai/sitemap.xml | findstr "<loc>"
curl -s https://slidexy.ai/tools | findstr /i "noindex"
curl -s https://slidexy.ai/tools | findstr /i "canonical"
curl -I https://slidexy.ai/tools
```

### 308 vs 301 Redirects
When testing trailing-slash URLs, you will see a **308 Permanent Redirect** instead of 301. This is **expected behavior** — Vercel's infrastructure does this.

| Redirect Type | Source | Status Code |
|---|---|---|
| `www` → non-www | Our middleware | **301** |
| Trailing slash removal | Vercel built-in | **308** |

Both are permanent redirects. Google treats them identically — **308 is a pass, not a fail.**

---

## Phase 3 Pass/Fail Checklist

| # | Test | Pass |
|---|---|---|
| 1 | `/sitemap.xml` loads as valid XML | ☐ |
| 2 | Sitemap contains exactly 19 URLs | ☐ |
| 3 | All 19 expected URLs are present in sitemap | ☐ |
| 4 | No low-value URLs in sitemap (`/account`, `/auth`, `/editor`, etc.) | ☐ |
| 5 | `robots.txt` allows `/`, `/_next/static/`, `/_next/image/` | ☐ |
| 6 | `robots.txt` disallows all 9 private routes | ☐ |
| 7 | `robots.txt` includes `Sitemap: https://slidexy.ai/sitemap.xml` | ☐ |
| 8 | No public page accidentally blocked in robots.txt | ☐ |
| 9 | Zero `noindex` tags on all 19 ranking pages | ☐ |
| 10 | All 19 pages have self-referencing canonical | ☐ |
| 11 | All 19 pages return HTTP 200 | ☐ |
| 12 | All 19 pages have unique visible H1 + intro | ☐ |
| 13 | GSC property verified | ☐ |
| 14 | Sitemap submitted to GSC — status "Success" | ☐ |
| 15 | Bing property verified | ☐ |
| 16 | Sitemap submitted to Bing — status successful | ☐ |
| 17 | Top 10 URLs inspected in GSC — no red flags | ☐ |
