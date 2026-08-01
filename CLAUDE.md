@AGENTS.md

# Portfolio (Next.js 16 / React 19 / Tailwind v4)

Personal site for **Jaden Oca / @jadeneoca**, a content creator ("I make content about decision making"). Two top-level tabs: **Overview** (`/`, the profile home) and **Work with me** (`/work-with-me`), which funnels into a **brand deal** (Beacons media kit link — `creator.mediaKitUrl`) or a **1:1 coaching call** (`creator.bookingUrl`, `$200/hr`). The corporate résumé and the résumé chatbot were **removed** in the 2026-07 revamp (see below).

## Design language — "Mono" (monochrome editorial)
Full monochrome, minimalist, editorial — inspired by itseileenyang.com (Framer + Lenis). Replaced the "Coastal" navy/light-blue palette on 2026-07. Pure **white** canvas, near-**black** ink, **gray** muted, and one **classic link-blue** accent (`#0000EE`) used sparingly (the `@jadeneoca` handle, text links, small marks/icons, timeline "Now"). Buttons are **black pills**; one **black section** (the CtaFooter) anchors the page for rhythm. Grotesque display + mono micro-labels. **All headings, nav text, and button labels render lowercase** (`text-transform: lowercase` in `globals.css` — the string data itself stays normal-case for accessibility/SEO; only the visual rendering is lowercased) — a deliberate personality choice, not a bug. The look is deliberately un-"vibe-coded": no colored feature-bands, no gradient buttons, no bordered/shadowed SaaS cards, no count-up stats, no glow blobs, no generic-feeling display font.

## Motion (this is a big part of the look)
- **Lenis smooth-scroll** (`lenis` dep) via `src/components/site/SmoothScroll.tsx` — a null-rendering client component mounted in `layout.tsx`; inits Lenis on window scroll, disabled under `prefers-reduced-motion`. Lenis adds `lenis lenis-smooth` classes to `<html>`; supporting CSS lives in `globals.css`.
- **Scroll reveals**: `src/components/site/RevealObserver.tsx` (mounted in `layout.tsx`) is an IntersectionObserver that adds `.is-visible` to every `.reveal` element as it enters view; re-scans on route change; falls back to showing all if IO is missing. `.reveal` CSS does the opacity+translateY ease-in. Add `className="reveal"` to any element you want to fade/slide in.

## Visual rules
- **Light-first.** `globals.css` sets `color-scheme: light`. Tokens live in `:root`, exposed to Tailwind via `@theme inline` (`bg-bg`, `text-text`, `text-muted`, `text-accent`, `bg-ink-navy`, `text-on-navy`, …). Palette: bg `#FFFFFF`, surface `#FFFFFF`, alt `#F4F4F2`, text `#141414`, text-strong `#000000`, muted `#8A8A8A`, border `#E5E5E2`, accent link-blue `#0000EE`. **The `ink-navy`/`on-navy` token names are kept but now hold BLACK values** (`--color-ink-navy:#0A0A0A`, `--color-on-navy:#F4F4F2`) so `.dark-section` renders a black band — don't be fooled by the "navy" names.
- **Blue is accent-only** — links, the handle, small marks. Buttons are black (`.btn-primary` = black pill, inverts to outline on hover); on black sections use `.btn-invert` (white pill). Stat numbers and timeline years are black, not blue.
- **Type:** display **Bricolage Grotesque** (`font-display` — chosen over Space Grotesk, which read as a generic "AI-generated" default), body **Plus Jakarta Sans** (`font-sans`), mono micro-labels **Space Mono** (`font-mono`, used by `.eyebrow` and timeline years) — all via `next/font/google` in `layout.tsx`.
- **Shared utility classes** in `globals.css`: `.dark-section` (black band), `.reveal` (see Motion), `.marquee`/`.marquee-track`, `.btn-primary` (black pill), `.btn-invert` (white pill for dark bands), `.btn-ghost`, `.card`/`.card-lift` (minimal: light border, 6px radius, no shadow), `.eyebrow` (mono uppercase gray), `.stat-num` (black), `.link-underline` (blue). All motion respects `prefers-reduced-motion`.

## Architecture
- Global chrome in `src/app/layout.tsx`: `<SmoothScroll>` + `<RevealObserver>` (motion, see above) then `<SiteNav>` (sticky nav, `src/components/site/SiteNav.tsx`). Two tabs: "Overview" (text link, `/`) + "Work with me" (black `btn-primary` pill, `/work-with-me`). No floating widget.
- Page sections live in `src/components/site/` — Home/Overview: `Hero` (photo `/headshot.jpeg`, thin border), `StatBand` (static minimal 3-stat row, hairline-framed — no count-up), `BrandWall` (gray brand-**name** text marquee — placeholder logos dropped), `Timeline` (vertical career timeline, data in `creator.timeline`; each year is `{ year, items: string[], link? }` — bulleted list per year, mono years, black nodes, "now" on the latest, whole section rendered lowercase via `.lowercase` on the `<ol>`), `CtaFooter` (**black** section, `.btn-invert` CTA → `/work-with-me`). UGC (route exists at `/ugc` but is **unlinked** from nav): `UgcHero`, `UgcAccountCard`, `BrandCollabGrid`. Shared: `SocialLinks` (inline SVG icons, `variant="light"|"navy"`).
- `src/app/work-with-me/page.tsx` — server component, two minimal funnel cards (Brand deal → `creator.mediaKitUrl`; 1:1 coaching → `creator.bookingUrl`) + **black** closing band (`.btn-invert`).
- Content source of truth: `src/lib/content.ts`. Creator data is the `creator` export (handle, followers, socials, ugcAccounts, **brands** (4: Monarch Money, Blossom Social, Higgsfield AI, Finvest — Polymarket removed 2026-07 since it's a gambling app, conflicting with the No Dice mission), contactEmail, bio, **mediaKitUrl**, **bookingUrl**, **coachingRate**, **timeline**). The résumé exports (`profile`/`experiences`/…) are now **unused** (kept for possible revert; safe to delete). `@anthropic-ai/sdk` is still a dep but unused (chat route deleted).
- Sections are intentionally kept **vertically tight** (compressed padding across `Hero`/`StatBand`/`BrandWall`/`Timeline`/`CtaFooter`/`work-with-me`) — don't reintroduce generous `py-20`/`py-28`-style spacing without checking with the owner first; the site was deliberately de-bloated from an earlier, airier pass.
- Brand logos: `public/logos/brands/*.svg` exist but the site no longer renders them (BrandWall uses text). 
- **Removed across the 2026-07 revamps**: `/resume` route + résumé components, `Services` + `AboutBlock` + `WorkTeaser` home sections, `ChatWidget` + `/api/chat` (résumé chatbot).
- **Retired but kept on disk for revert** (do NOT delete without owner sign-off): `src/components/terminal/*`, `src/lib/aiDaily.ts`, the `/ai-daily` route, and the old orphaned `Hero/Section/Reveal/ScrollProgress/Projects/Experience/Education/Activities/Nav/Contact/Footer.tsx`. `/ai-daily` still builds but is unlinked from all nav.

## Next.js 16 conventions (this is NOT the Next.js you know)
Bundled docs in `node_modules/next/dist/docs/` are authoritative — consult them before recalling older App Router conventions.
- `params` and `searchParams` are `Promise`-wrapped — `await` them: `const sp = await searchParams`.
- Use the global `PageProps<'/route'>` and `LayoutProps<'/route'>` helpers (no import needed). Generated by `next dev` / `next build` / `next typegen`.
- Server Components are default; add `'use client'` only when needed (state, hooks, browser APIs).
- `fetch` is no longer cached by default — use the `use cache` directive or wrap in `<Suspense>` for streaming.
- For instant client navigation, Suspense alone isn't enough — see `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.mdx`.
- Tailwind v4 via `@tailwindcss/postcss`; theme tokens defined inline in `globals.css` with `@theme inline` against CSS custom properties — do NOT introduce a separate Tailwind config file.

## Dev-loop gotcha
Turbopack hot-reload is unreliable for `globals.css` rewrites — when changing tokens, kill the dev server and `rm -rf .next` rather than expecting HMR.

Also: a stopped dev preview can leave a **zombie `next-server` bound to port 3000**. It keeps serving the tree it indexed at boot, so **newly-created files fail with "Module not found"** even after `rm -rf .next` + restart (the new preview proxies to the old process). Fix: `lsof -ti tcp:3000` → `kill -9` the `next-server` pid, then start fresh.
