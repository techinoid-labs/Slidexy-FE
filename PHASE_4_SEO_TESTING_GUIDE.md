# Phase 4 SEO Testing Guide — SlideXY

> **Scope: Phase 4 — High-Converting Landing Pages & Hub Optimization**
>
> This guide covers the final transformation of all public URLs into search-optimized landing pages. It verifies the presence of required semantic elements, internal linking equity, and the quality of the hub pages (/tools, /templates, /pricing, /faqs).
>
> All previous phases (1–3) must be passing before starting Phase 4 validation.

---

## 1. Landing Page Semantic Structure (Step 21)

For **every** tool page (e.g., `/tools/prompt-to-deck`, `/tools/web-to-deck`), verify the following 10 elements are visible in the source code or rendered UI.

### Required Elements Checklist
1.  [ ] **Unique H1**: Matches the tool name + primary keyword.
2.  [ ] **Unique Opening Paragraph**: 2–3 sentences explaining the core value.
3.  [ ] **Problem Statement**: Explicit "The Problem" section (uses `ProblemSolution` component).
4.  [ ] **SlideXY Solution**: Explicit "The SlideXY Solution" section (uses `ProblemSolution` component).
5.  [ ] **Who It Is For**: Persona-based targeting (uses `WhoItsFor` component).
6.  [ ] **Workflow Steps**: 3-step numbered guide (uses `WorkflowSteps` component).
7.  [ ] **Key Benefits**: At least 3 benefits with unique icons (uses `BenefitsList` component).
8.  [ ] **Contextual FAQ**: Minimum 3 questions specific to that tool (uses `ContextualFAQ` component).
9.  [ ] **CTA Section**: Prominent conversion buttons (uses `CTASection` component).
10. [ ] **Internal Links**: Links to at least 3 related SlideXY tools (uses `InternalLinks` component).

---

## 2. Hub Page Optimization (Steps 22–25)

### 2.1 /tools (The Tool Hub)
- [ ] Contains a unique H1 (`AI Presentation Tools — SlideXY Hub`).
- [ ] Displays a grid of all 10 tools with individual descriptions.
- [ ] Includes "Who is this tool for?" section.
- [ ] Includes "Common Tool Questions" FAQ hub.
- [ ] **Internal Link Test**: Every tool link must use standard `<a href="...">` or Next.js `<Link>` for crawlability.

### 2.2 /templates (The Template Library)
- [ ] Unique SEO Title (`Professional Slide Templates — SlideXY Library`).
- [ ] Explains template categories and what users can build.
- [ ] Includes custom Benefits section (`BenefitsList`).
- [ ] Includes Template-specific FAQs.
- [ ] All category links are crawlable.

### 2.3 /pricing (Rankable Pricing)
- [ ] Unique H1 (`Simple, Transparent Pricing`).
- [ ] Persona section mapping plans to user types (Students, Pros, Startups).
- [ ] Detailed "Understand Your Plan Features" text explaining Credits and Branding.
- [ ] Pricing-specific FAQ hub.
- [ ] **Competitor Evaluation**: Mentions why SlideXY scale/value is competitive.

### 2.4 /faqs (Search & AEO Utility)
- [ ] Unique H1 (`SlideXY FAQ Hub`).
- [ ] Contains high-intent keywords in questions (e.g., "alternative to Gamma", "startup pitch deck", "text into slides").
- [ ] Answers are substantial (40–60 words) to target Google Featured Snippets and AI Overviews (AEO).

---

## 3. Crawl Equity & Deindexation (Step 20)

### 3.1 Metadata Check
No indexable landing page should accidentally contain a `noindex` tag.

```cmd
# Windows Findstr check
curl -s https://slidexy.ai/tools/prompt-to-deck | findstr "noindex"
# Expected: Zero results
```

### 3.2 Sitemap Integrity
The sitemap must contain **only** high-value pages. Check `https://slidexy.ai/sitemap.xml`.

| Page Type | Should be in Sitemap? | Status |
|---|:---:|:---:|
| Core Hubs (Tools, Templates, Pricing, FAQs) | ✅ Yes | |
| Individual Tool Pages (10 total) | ✅ Yes | |
| `/waiting-list` | ❌ No | |
| `/account` | ❌ No | |
| `/editor` | ❌ No | |
| `/auth` | ❌ No | |

---

## Pass/Fail Checklist

| # | Test | Pass |
|---|---|---|
| 1 | All 10 tool pages have unique H1 + Intro | ☐ |
| 2 | Problem/Solution components present on all 10 tools | ☐ |
| 3 | Workflow/Steps components present on all 10 tools | ☐ |
| 4 | Contextual FAQs present on all tool & hub pages | ☐ |
| 5 | `/tools` hub provides crawlable links to all 10 sub-tools | ☐ |
| 6 | `/pricing` contains >300 words of rankable text + plan FAQs | ☐ |
| 7 | FAQ answers target long-tail queries (e.g., "Alternative to Gamma") | ☐ |
| 8 | Internal Link equity: Home → Hubs → Tools → Related Tools (Cycle closing) | ☐ |
| 9 | Low-value utility pages are successfully disallowed in `robots.ts` | ☐ |
| 10 | `/templates` library shows categories and audience guidance | ☐ |
