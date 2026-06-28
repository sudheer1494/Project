# SEO Guide

This project ships an automated technical-SEO pipeline. Most of the on-page work is done for you on every build; the remaining levers are off-page and need your action.

## ✅ What's automated (runs on every `npm run build`)

- **Per-route prerendered HTML** — `scripts/prerender-seo.mjs` writes a static
  `dist/<route>/index.html` for all 34 routes, each with its own `<title>`,
  meta description, canonical URL, Open Graph/Twitter tags, JSON-LD, and a
  crawlable `<h1>`/description fallback. This fixes the SPA problem where every
  route otherwise served an identical `<head>`.
- **`sitemap.xml`** — generated from the tool catalog (`scripts/generate-sitemap.mjs`).
- **`robots.txt`** — allows all crawlers and points to the sitemap.
- **Structured data** — `SoftwareApplication`, `BreadcrumbList` and `FAQPage`
  per tool; `WebSite` + `Organization` on the homepage.
- **Open Graph image** — `public/og-image.png` (1200×630).
- **Runtime sync** — `useDocumentMeta` keeps title/description/canonical/OG in
  sync during client-side navigation (single source of truth: `src/lib/seo.js`).

## 🌍 What you need to do (off-page — the real ranking levers)

1. **Custom domain.** A `*.vercel.app` subdomain can't build lasting authority.
   Buy a domain (e.g. `toolsbase.app`), add it in Vercel → Project → Domains,
   then set `VITE_SITE_URL=https://yourdomain.com` as a Vercel env var and
   update `public/robots.txt` + the default canonical in `index.html`.
2. **Google Search Console.** Add the property, verify, and submit
   `https://yourdomain.com/sitemap.xml`. Do the same in **Bing Webmaster Tools**.
3. **Backlinks & content.** Get listed in tool directories, write a few
   genuinely useful blog posts / how-to pages, and earn links. This is the
   slowest but highest-impact factor.
4. **Analytics.** Add Vercel Analytics or Plausible to track what ranks.

## Changing the site URL

The canonical origin is read from `VITE_SITE_URL` at build time (falls back to
the current Vercel domain in `src/lib/seo.js`). Set it once in Vercel's env vars
and every generated URL, canonical and sitemap entry updates automatically.
