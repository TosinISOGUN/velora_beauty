# VELORA BEAUTY

A design concept for a fictional beauty label aimed at adult women, mainly Gen Z and millennial shoppers in the US, with an inclusive range of ages and skin tones. Fifteen pages: Home, Shop, three collections, six product pages, Routine builder, Our Story, Bag, Checkout, Contact, Privacy and Terms.

VELORA is not a real brand. Prices, shades, policies and contact details are demonstration content, nothing is charged or shipped, the forms send nothing, and every page is set to `noindex`.

## Stack

- TanStack Start (React 19, file-based routing, server-rendered), TypeScript strict
- Tailwind CSS v4, CSS-only and scroll-driven motion, Phosphor icons
- Gambetta (display, with italic; Fontshare free licence, self-hosted) and Manrope (SIL OFL), both variable fonts
- Nitro for the production build (it picks the Vercel output on Vercel and a Node server elsewhere)

## Run it

```bash
bun install
bun run dev        # http://localhost:5173
bun run build      # production build
bun run lint
bun run test
```

## Deploying to Vercel

Framework Preset: Nitro (or Other). Leave Output Directory blank and use Node 22.x. No environment variables are needed. Open Graph and canonical URLs use the deployment domain automatically (the Vercel production domain, or `SITE_URL` if you set it).

## Design

Midnight Cobalt and Apricot: a cool ink-navy ground, one apricot accent, no brown or beige. The colour comes from the photography. Dark by default, with a chalk-blue light theme behind the header toggle (stored in `localStorage` as `velora-theme`). Every top-level page opens with a full-bleed photograph and a short block of type. Product packaging is drawn as shaded vector art that takes the colour of the selected shade.

## Images

Originals live in `assets-source/photos/` (gitignored) and are never served. `bun run images` builds the responsive AVIF and WebP copies in `public/images/`, the typed manifest `src/data/images.generated.ts`, and one Open Graph image per page and product in `public/og/`. Keep the original file names: the manifest ids (for example `heroCampaign`) come from them.

The photographs are stock images from Pexels (free licence, no attribution required). Pexels photo ids: 5034021 (the hero is this portrait with its rust backdrop extended to the left for the type), 7290642, 6713329, 6925480, 10816496, 34321279, 7321499, 3762879, 29755259, 5938217, 4482931, 33976561, 30062508, 12260115, 6713324, 27759990, 8528483, 5262276, 14581433, 33393745. None show a real VELORA product, so keep captions neutral.

The favicon set is built from the VELORA logo: save it as `assets-source/brand/velora-logo.png` and run `node scripts/build-favicons.mjs`, which crops the VB monogram onto the logo's own pink.

## Content rules

No reviews, ratings, health or certification claims, and no shade-matching promise. No em or en dashes in any source file (a test enforces it). To make the site indexable, set `INDEXABLE` to `true` in `src/data/site.ts` and update `public/robots.txt`.
