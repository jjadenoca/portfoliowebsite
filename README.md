# jadenoca.com — Personal Portfolio

Personal portfolio site for Jaden Oca. Built with **Next.js 16 (App Router)**, **TypeScript**, and **Tailwind CSS v4**.

## Sections

- **Hero** — name, title, location, intro
- **About** — long bio + skill chips
- **Experience** — Capital One, Cotality, Truist, Link Logistics
- **Projects** — Spotify Streaming Insights + future builds
- **Activities & Education** — research lab, Texas A&M, room for college clubs
- **Writing** — auto-pulled from Medium RSS (cached hourly)
- **Contact** — email, LinkedIn, GitHub, Medium

## Edit content

All copy lives in **one file**: [`src/lib/content.ts`](./src/lib/content.ts).

Update profile info, experiences, projects, activities, education, and skills there. The site updates automatically.

```ts
// src/lib/content.ts
export const profile = {
  name: "Jaden Oca",
  email: "jadenesoca@gmail.com",
  linkedin: "https://www.linkedin.com/in/jadenoca",
  github: "https://github.com/jadenoca",
  mediumUsername: "jadenoca", // <- update this for the Writing section
  // ...
};
```

### To-do (replace placeholders)

- Verify LinkedIn / GitHub / Medium URLs in `profile`
- Add a project repo link (`projects[i].href`)
- Fill in `activities[]` with college clubs, leadership, hackathons, TA roles, etc.

### Replace the resume PDF

Drop your latest resume at `public/JadenOcaResume.pdf` (already there). The Nav "Resume" button + hidden links use this file.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel + custom domain

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo. Accept defaults.
3. Once deployed, go to **Project → Settings → Domains** and add `jadenoca.com` and `www.jadenoca.com`.
4. Vercel will show two DNS records to add at your registrar:
   - An `A` record for `jadenoca.com` → `76.76.21.21`
   - A `CNAME` for `www` → `cname.vercel-dns.com`
5. SSL provisions automatically. Site goes live within a few minutes.

## Tech

- [Next.js 16](https://nextjs.org) (App Router, RSC, Turbopack)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Inter](https://fonts.google.com/specimen/Inter) + [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) via `next/font`
- Medium RSS via [rss2json](https://rss2json.com) (cached hourly)

## File structure

```
src/
├── app/
│   ├── layout.tsx       # site metadata, fonts, theme
│   ├── page.tsx         # composes all sections
│   └── globals.css      # CSS variables + Tailwind theme
├── components/          # one file per section
│   ├── Nav.tsx
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Experience.tsx
│   ├── Projects.tsx
│   ├── Activities.tsx
│   ├── Writing.tsx      # async RSC, fetches Medium RSS
│   ├── Contact.tsx
│   ├── Footer.tsx
│   └── Section.tsx
└── lib/
    └── content.ts       # ALL site content lives here
```
