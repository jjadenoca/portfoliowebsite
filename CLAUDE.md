@AGENTS.md

# Portfolio (Next.js 16 / React 19 / Tailwind v4)

Personal site for **Jaden Oca / @jadeneoca**, a content creator ("I make content about decision making"). Two top-level tabs: **Overview** (`/`, the profile home) and **Work with me** (`/work-with-me`), which funnels into a **brand deal** (Beacons media kit link — `creator.mediaKitUrl`) or a **1:1 coaching call** (`creator.bookingUrl`, `$200/hr`). The corporate résumé and the résumé chatbot were **removed** in the 2026-07 revamp (see below).

## Design language — "Tiles" (dark bento glass)
Dark bento-grid layout, adopted 2026-08 (replaced the light "Mono" editorial pass, which replaced "Coastal"). Deep neutral-dark canvas (`#0B0C0F`) with faint fixed radial blue glows, and **rounded glass tiles** (`.tile`: translucent white surface, 22px radius, backdrop blur, inset highlight + soft drop shadow, `.tile-hover` lifts). One **cool blue** accent `#5B8CFF`. Buttons are **white pills** (`.btn-primary` ≡ `.btn-invert`, invert to outline on hover); `.btn-ghost` is a glass outline. **All headings, nav text, and button labels still render lowercase** (`text-transform: lowercase` in `globals.css` — string data stays normal-case for a11y/SEO). Bricolage Grotesque display + Space Mono micro-labels carry over from Mono. The Overview page is a single `BentoGrid` of tiles, including an **animated Galton board** canvas tile (`GaltonBoard.tsx` — balls through pegs into a bell-curve histogram; IntersectionObserver-paused offscreen, static curve under `prefers-reduced-motion`).

## Motion (this is a big part of the look)
- **Lenis smooth-scroll** (`lenis` dep) via `src/components/site/SmoothScroll.tsx` — a null-rendering client component mounted in `layout.tsx`; inits Lenis on window scroll, disabled under `prefers-reduced-motion`. Lenis adds `lenis lenis-smooth` classes to `<html>`; supporting CSS lives in `globals.css`.
- **Scroll reveals**: `src/components/site/RevealObserver.tsx` (mounted in `layout.tsx`) is an IntersectionObserver that adds `.is-visible` to every `.reveal` element as it enters view; re-scans on route change; falls back to showing all if IO is missing. `.reveal` CSS does the opacity+translateY ease-in. Add `className="reveal"` to any element you want to fade/slide in.

## Visual rules
- **Dark-first.** `globals.css` sets `color-scheme: dark`. Tokens live in `:root`, exposed to Tailwind via `@theme inline` (`bg-bg`, `text-text`, `text-muted`, `text-accent`, …). Palette: bg `#0B0C0F`, bg-alt `#101216`, surface `rgba(255,255,255,.055)` / surface-2 `.09`, text `#E8E9EB`, text-strong `#FFFFFF`, muted `#8B8F98`, border `rgba(255,255,255,.1)`, accent `#5B8CFF`. **Legacy `ink-navy`/`on-navy` tokens are remapped to the dark palette** so retired components keep compiling; `.dark-section` is now just a subtle shade shift.
- **Blue is accent-only** — the handle, links, Galton balls/bars, small marks. `.card` ≡ glass tile styling; `.tile`/`.tile-hover` are the canonical classes.
- **Type:** display **Bricolage Grotesque** (`font-display` — chosen over Space Grotesk, which read as a generic "AI-generated" default), body **Plus Jakarta Sans** (`font-sans`), mono micro-labels **Space Mono** (`font-mono`, used by `.eyebrow` and timeline years) — all via `next/font/google` in `layout.tsx`.
- **Shared utility classes** in `globals.css`: `.tile`/`.tile-hover`, `.card`/`.card-lift` (same glass look), `.dark-section` (subtle shade), `.reveal` (see Motion), `.marquee`/`.marquee-track` (currently unused), `.btn-primary`/`.btn-invert` (white pills), `.btn-ghost`, `.eyebrow`, `.stat-num`, `.link-underline`. All motion respects `prefers-reduced-motion`.

## Architecture
- Global chrome in `src/app/layout.tsx`: `<SmoothScroll>` + `<RevealObserver>` (motion, see above) then `<SiteNav>` (sticky glass nav, `src/components/site/SiteNav.tsx`). Two tabs: "Overview" (text link, `/`) + "Work with me" (white `btn-primary` pill, `/work-with-me`). No floating widget.
- **Home/Overview is one component**: `src/components/site/BentoGrid.tsx` — a 12-col bento grid of tiles: Identity (photo + name + roleLine + CTA + socials, col-span-7), Galton board (col-span-5, row-span-2, wraps `GaltonBoard.tsx`), Quote (col-span-4), Stats (col-span-3), `Timeline` (a tile itself now, col-span-7 — data in `creator.timeline`, mono years, "now" on latest, lowercase `<ol>`), Brands (col-span-5, color PNG logos), CTA banner (col-span-12, accent-gradient glass → `/work-with-me`). `CtaFooter` is a **slim footer** (copyright + socials only — big CTA lives in the grid). Old `Hero`/`StatBand`/`BrandWall` components were deleted in this redesign. UGC (route exists at `/ugc` but is **unlinked** from nav): `UgcHero`, `UgcAccountCard`, `BrandCollabGrid`. Shared: `SocialLinks` (inline SVG icons, `variant="light"|"navy"` — on the dark theme "navy" is the right variant).
- `src/app/work-with-me/page.tsx` — server component, two funnel cards (now glass tiles via `.card`; Brand deal → `creator.mediaKitUrl`; 1:1 coaching → `creator.bookingUrl`) + closing band.
- Content source of truth: `src/lib/content.ts`. Creator data is the `creator` export (handle, followers, socials, ugcAccounts, **brands** (4: Monarch Money, Blossom Social, Higgsfield AI, Finvest — Polymarket removed 2026-07 since it's a gambling app, conflicting with the No Dice mission), contactEmail, bio, **mediaKitUrl**, **bookingUrl**, **coachingRate**, **timeline**). The résumé exports (`profile`/`experiences`/…) are now **unused** (kept for possible revert; safe to delete). `@anthropic-ai/sdk` is still a dep but unused (chat route deleted).
- Sections are intentionally kept **vertically tight** — don't reintroduce generous `py-20`/`py-28`-style spacing without checking with the owner first; the site was deliberately de-bloated from an earlier, airier pass.
- Brand logos: color PNGs at `public/logos/brands/*.png` (rendered in the Brands tile and work-with-me page); the `.svg` files are old placeholder wordmarks, unused.
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

## Security posture (2026-08 audit)
- **Security headers** live in `next.config.ts`: CSP (self-only; `'unsafe-inline'` script/style for Next hydration, `'unsafe-eval'` dev-only), HSTS, `nosniff`, `X-Frame-Options: DENY` + `frame-ancestors 'none'`, Referrer-Policy, Permissions-Policy. **No third-party scripts are allowed by the CSP** — adding an external script/iframe/analytics requires editing the CSP first.
- **No PII in the repo**: phone number removed from `content.ts`; the résumé PDF was `git rm`'d from `public/` (an untracked `public/JadenOcaResume.pdf` may exist locally — do NOT commit it). `profile.email` is the public contact address.
- External links use `rel="noopener noreferrer"`; no `dangerouslySetInnerHTML`; no API routes; `/ai-daily`'s `date` param is allowlist-validated (no traversal).
- `npm audit` accepted residual: 3 highs pinned **inside** `next` itself (bundled `sharp`/`postcss`) — upstream, trusted-input contexts; do NOT run `npm audit fix --force` (it downgrades next to v9).

## Dev-loop gotcha
Turbopack hot-reload is unreliable for `globals.css` rewrites — when changing tokens, kill the dev server and `rm -rf .next` rather than expecting HMR.

Also: a stopped dev preview can leave a **zombie `next-server` bound to port 3000**. It keeps serving the tree it indexed at boot, so **newly-created files fail with "Module not found"** even after `rm -rf .next` + restart (the new preview proxies to the old process). Fix: `lsof -ti tcp:3000` → `kill -9` the `next-server` pid, then start fresh.
