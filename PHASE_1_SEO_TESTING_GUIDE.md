# Phase 1 SEO Testing Guide — SlideXY

> **Scope: Phase 1 Only — Canonical Domain & URL Control**
>
> This guide covers **Phase 1** of the SlideXY SEO roadmap. It tests canonical domain enforcement, URL normalization, self-referencing canonical tags, 404 handling, sitemap, and robots.txt.
>
> Phase 2 (on-page content & structured data), Phase 3 (content scaling), and Phase 4 (link building) are **not** covered here. Do not begin those phases until every test in this guide passes.

---

## 1. Canonical Domain & Redirects

### 1.1 www → non-www Redirect (301)

| Test URL | Expected Redirect |
|---|---|
| `https://www.slidexy.ai/` | → `https://slidexy.ai/` |
| `https://www.slidexy.ai/pricing` | → `https://slidexy.ai/pricing` |
| `https://www.slidexy.ai/tools` | → `https://slidexy.ai/tools` |
| `http://www.slidexy.ai/` | → `https://slidexy.ai/` |

```bash
curl -I https://www.slidexy.ai/pricing
# Look for: HTTP/2 301 → Location: https://slidexy.ai/pricing
```

### 1.2 Trailing Slash Normalization (301)

| Test URL | Expected Redirect |
|---|---|
| `https://slidexy.ai/pricing/` | → `https://slidexy.ai/pricing` |
| `https://slidexy.ai/tools/` | → `https://slidexy.ai/tools` |
| `https://slidexy.ai/templates/` | → `https://slidexy.ai/templates` |

**Note:** Root `/` should NOT redirect.

---

## 2. Self-Referencing Canonical Tags

| Page | Expected Canonical |
|---|---|
| `https://slidexy.ai/` | `https://slidexy.ai/` |
| `https://slidexy.ai/tools` | `https://slidexy.ai/tools` |
| `https://slidexy.ai/templates` | `https://slidexy.ai/templates` |
| `https://slidexy.ai/pricing` | `https://slidexy.ai/pricing` |
| `https://slidexy.ai/faqs` | `https://slidexy.ai/faqs` |
| `https://slidexy.ai/blog` | `https://slidexy.ai/blog` |
| `https://slidexy.ai/features` | `https://slidexy.ai/features` |
| `https://slidexy.ai/product` | `https://slidexy.ai/product` |
| `https://slidexy.ai/privacy-policy` | `https://slidexy.ai/privacy-policy` |

❌ **Failure:** If any subpage shows `href="https://slidexy.ai/"` — homepage canonical leakage.

---

## 3. 404 Page

Navigate to `https://slidexy.ai/this-page-does-not-exist`:
- HTTP status: `404`
- Shows **"404"** + **"Page Not Found"**
- "Back to Homepage" button links to `/`

---

## 4. Sitemap

Navigate to `https://slidexy.ai/sitemap.xml` — must contain 19 URLs (9 core + 10 tools).

---

## 5. Robots.txt

Navigate to `https://slidexy.ai/robots.txt` — must disallow `/account`, `/auth`, `/editor`, `/onboarding`, `/success`, `/api/`, `/slice`, `/store`.

---

## 6. Tracking Parameters

```bash
curl -s "https://slidexy.ai/pricing?utm_source=google" | grep -i "canonical"
# Expected: href="https://slidexy.ai/pricing" (no query params)
```

---

## Pass/Fail Checklist

| # | Test | Pass |
|---|---|---|
| 1 | `www` → 301 to non-www | ☐ |
| 2 | Trailing slash → 301 | ☐ |
| 3 | Self-referencing canonicals | ☐ |
| 4 | No homepage canonical leakage | ☐ |
| 5 | 404 page renders correctly | ☐ |
| 6 | Valid pages have no "page not found" text | ☐ |
| 7 | `/sitemap.xml` lists 19 URLs | ☐ |
| 8 | `/robots.txt` disallows private routes | ☐ |
| 9 | Tracking params not in canonical | ☐ |
