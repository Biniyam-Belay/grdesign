# Graphic Design Portfolio — Action Plan (GSAP, Next.js App Router)

Status: 5% • Owner: you • Repo: grdesign • Aesthetic: white, sleek, modern, elegant • Motion: GSAP (smooth, subtle)

This plan is a living document. Use the checkboxes to track progress. Each task includes success criteria to ensure superior quality.

## Guiding Principles

- White background, ample whitespace, restrained palette, elegant typography
- Motion supports content (never distracts); prefer small, confident gestures over flashy effects
- Performance-first: optimize images, fonts, and timelines; avoid scroll-jank
- Accessibility and SEO are first-class; reduced motion respected everywhere

---

## Phase 0 — Project Setup & Quality Rigging

- [ ] Verify Node, PNPM/NPM versions and lockfile consistency
- [x] TypeScript strict mode on; aliases in `tsconfig.json`
- [x] ESLint + Prettier configured; run on staged files (husky + lint-staged)
- [x] Styling strategy: Tailwind CSS (v4); remove unused CSS later
- [x] Path aliases: `@components`, `@lib`, `@styles`, `@data`
- [x] Minimal folder scaffold: `components/`, `lib/`, `styles/`, `data/`, `public/assets/`
- [x] Install GSAP and register plugins where needed

Success criteria

- Commands: dev, build, lint succeed locally
- No TypeScript errors in app directory
- CI (optional) runs lint + build on PRs

---

## Phase 1 — Design System (Tokens & Typography)

- [x] Choose type pair (serif headings + sans body)
  - Serif: Playfair Display via next/font (variable: `--font-serif`)
  - Sans: Geist (already included) for body and UI (variables preserved)
- [x] Define type scale, line-height, tracking for desktop/mobile
  - Clamp-based sizes for h1–h6, balanced leading and subtle tracking
- [x] Color tokens (background, foreground, accent)
  - `--accent` and `--accent-contrast` added
- [x] Spacing/radius/shadow tokens; container widths; grid
  - `--radius-sm/md/lg`, `--shadow-sm/md`, spacing step tokens
- [ ] Iconography set and sizes (decision: Lucide 20/24px; wire when needed)

Success criteria

- Tokens live in CSS variables and are referenced by components
- WCAG AA contrast for text and interactive states (accent chosen with AA in mind)

---

## Phase 2 — Content & IA

- [ ] Sitemap & navigation (Home, Work, Project, About, Services, Contact, 404)
  - Note: sitemap implemented via `app/sitemap.ts`; nav scaffolded in Header
- [ ] Tone/voice guidelines and microcopy
- [x] Project content model (title, slug, roles, tools, hero, body, credits)
- [x] Populate initial 3–6 projects in `/data/projects` (JSON/MDX) with optimized assets (3 added)
- [x] Image/asset inventory + alt text (for initial set)

Success criteria

- Every page has real copy and at least one visual
- Project data schema validated at build time

---

## Phase 3 — Core Layout & Navigation

- [x] `app/layout.tsx` base structure with `Header` and `Footer`
- [x] Header: active link state; sticky header (transparent→solid on scroll: deferred)
- [x] Footer: contact, socials, copyright, subtle divider
- [x] Page transition layer (GSAP) with graceful fallback on SSR (initial in/out)

Success criteria

- Navigation is keyboard accessible and focus-visible
- Header color shift is smooth and jank-free

---

## Phase 4 — Pages

Home (`/`)

- [x] Hero: crisp typography intro; subtle reveal timeline on mount
- [ ] Selected work grid (3–6 items) with elegant hover; lazy-load images
- [ ] Statement section (philosophy/process) with split-text reveal
- [ ] Contact CTA; social proof (logos/testimonials optional)

Work (`/work`)

- [x] Projects grid with gentle hover (initial)
- [ ] Infinite or paginated loading; skeletons

Project (`/work/[slug]`)

- [x] Hero with image
- [x] Narrative sections: brief, role, process, outcomes, credits (scaffold)
- [x] Section reveals with ScrollTrigger (gentle)
- [ ] Pinned/sticky sections for highlights
- [ ] Responsive gallery with lightbox/carousel; next/previous navigation

About (`/about`)

- [ ] Portrait, bio, values, timeline; GSAP for text and image reveals

Services (`/services`)

- [ ] Offerings, process diagram, FAQs; CTA

Contact (`/contact`)

- [ ] Form with server action/email provider; success/error states; spam mitigation

System pages

- [ ] 404 and 500 with link back home (404 implemented)

Success criteria

- All pages responsive (360px–1440px+)
- No CLS during hero/above-the-fold content

---

## Phase 5 — Components (Re-usable, Accessible)

- [x] Layout primitives: `Container` (Section/Grid deferred)
- [ ] UI: `Button`, `Link`, `NavLink`, `Marquee`, `Badge`, `Divider`
- [ ] Media: `NextImage` wrapper, `Video`, `Lightbox`
- [x] Content: `ProjectCard` (Testimonial/FAQ deferred)
- [ ] Overlays: `Modal`, `Tooltip` (ESC closes, trap focus)
- [x] Hooks: `useIsomorphicLayoutEffect`, `useReducedMotion` (`useScrollProgress` deferred)

Success criteria

- Components keyboard accessible; tab order sensible; ARIA labels where needed
- Hover and focus states distinct and elegant

---

## Phase 6 — Animation Architecture (GSAP)

- [x] Install gsap; selectively import core + `ScrollTrigger`
- [x] Create `lib/gsap.ts` to register plugins once (client only)
- [x] Motion tokens: durations/easings (initial)
- [x] Page transition manager (mount timeline) applied to pages
- [ ] Split-text utility (semantic-friendly) for headings
- [x] Scroll-linked reveals with `ScrollTrigger`; avoid over-triggering (batch/simple)
- [x] Respect `prefers-reduced-motion` and disable heavy timelines

Success criteria

- 60fps during simple scroll on mid-tier laptop/mobile
- No animation blocks interaction; timelines are killable on route change

---

## Phase 7 — Data Layer

- [x] Start with local JSON/MDX for projects
- [x] Utility to load and type projects (Zod schema)
- [ ] Optional future: CMS (Sanity/Contentful) behind the same TypeScript interfaces

Success criteria

- All project pages are statically generated or cached; typesafe data access

---

## Phase 8 — Performance

- [ ] `next/image` everywhere; modern formats; responsive sizes
- [ ] Font optimization with `next/font`; preload key fonts; avoid FOIT/FOUT
- [ ] Code-split heavy sections; dynamic import non-critical components
- [ ] Tree-shake GSAP (import from `gsap/dist/...` only what’s used)
- [ ] Lighthouse budgets: LCP < 2.5s, CLS < 0.1, INP < 200ms (targets)

Success criteria

- Mobile Lighthouse Perf ≥ 90 on Home and a Project page
- No long tasks > 200ms attributable to animations

---

## Phase 9 — Accessibility (A11y)

- [ ] Semantic landmarks; headings in order
- [ ] Labels/alt text; form errors announced via ARIA
- [ ] Focus management and visible outlines; skip-to-content
- [ ] Reduced motion support

Success criteria

- Axe DevTools shows 0 critical violations
- Keyboard-only navigation works across the site

---

## Phase 10 — SEO & Social

- [ ] Next.js Metadata API per page; titles/descriptions unique (projects wired)
- [ ] Open Graph/Twitter images; dynamic OG for project pages
- [x] `sitemap.xml` (app/sitemap.ts); `robots.txt`, canonical URLs (deferred)
- [ ] JSON-LD: `Person` and `CreativeWork` for projects

Success criteria

- Indexable pages, metadata validated (Rich Results Test), no duplicate titles

---

## Phase 11 — Analytics & Monitoring

- [ ] Vercel Analytics (or Plausible)
- [ ] Error monitoring (Sentry) optional
- [ ] Basic event tracking: contact submit, project view

Success criteria

- PII-safe analytics events; error rate visible

---

## Phase 12 — Testing & QA

- [ ] Unit tests for utils/hooks (Vitest/Jest)
- [ ] Playwright e2e: navigation, form submit, reduced motion
- [ ] Visual regression (optional): key pages at 3 breakpoints
- [ ] Manual device pass (iOS Safari, Android Chrome)

Success criteria

- CI runs tests; e2e green on key paths

---

## Phase 13 — Deployment

- [ ] Vercel project; Preview deployments on PRs
- [ ] Environment variables (if any) documented
- [ ] Custom domain + HTTPS; 404/500 wired

Success criteria

- Zero-config deploy from main; rollback strategy tested

---

## Phase 14 — Polish & Launch

- [ ] Micro-interactions tuned (hover, tap, focus)
- [ ] Copyediting pass; link audit; favicon/OG verification
- [ ] Lighthouse + Axe final passes; perf/a11y/SEO ≥ 90
- [ ] Launch announcement assets (optional)

Success criteria

- No console errors; no broken links; crisp feel throughout

---

## Implementation Notes (Next.js App Router + GSAP)

- RSC vs client: animation code in `"use client"` components; lazy-load where possible
- Create `lib/gsap.ts` that safely checks for `window` before registering plugins
- Use `next/navigation` for route events; kill timelines on route change to avoid leaks
- Prefer intersection observers or `ScrollTrigger.batch` over many individual triggers
- Respect SSR by guarding DOM refs; use `useIsomorphicLayoutEffect`

---

## Folder Structure (proposed)

```
app/
  (routes...)
components/
  layout/, ui/, media/, content/
data/
lib/
styles/
public/assets/
```

---

## Definition of Done (per page/component)

- Typesafe, lint-clean, and tested (where applicable)
- Accessible (labels, focus, reduced motion)
- Performance-checked (no layout shifts, optimized media)
- Documented props and usage; design tokens applied

---

## Risks & Mitigations

- Heavy animations cause jank → cap simultaneous timelines, throttle `ScrollTrigger`
- Large media bloats LCP → pre-optimize, lazy-load, use `next/image`
- Content churn → type schemas + content pipeline with validation
- Timeboxing polish → lock scope; prioritize Home + 1–2 case studies first

---

## Working Checklist (quick view)

- [x] Phase 0 — Setup ✅
- [x] Phase 1 — Design System ✅
- [ ] Phase 2 — Content & IA
- [x] Phase 3 — Layout & Nav ✅
- [ ] Phase 4 — Pages
- [ ] Phase 5 — Components
- [ ] Phase 6 — Animation
- [ ] Phase 7 — Data
- [ ] Phase 8 — Performance
- [ ] Phase 9 — A11y
- [ ] Phase 10 — SEO
- [ ] Phase 11 — Analytics
- [ ] Phase 12 — Testing
- [ ] Phase 13 — Deployment
- [ ] Phase 14 — Polish & Launch
