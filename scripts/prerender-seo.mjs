// Post-build SEO prerender. For each route, writes a static dist/<path>/index.html
// whose <head> carries the route's real title, description, canonical, Open
// Graph/Twitter tags and JSON-LD, plus a crawlable SEO fallback inside #root.
//
// This fixes the core SPA SEO weakness (every route served identical <head>)
// without SSR — Vercel serves the matching static file before the SPA rewrite,
// and React hydrates over the fallback markup on load.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { marked } from 'marked'
import { getAllRoutes, getRouteMeta, SITE_NAME, SITE_URL } from '../src/lib/seo.js'
import { ARTICLES } from '../src/content/articles.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dist = resolve(__dirname, '../dist')
const template = readFileSync(resolve(dist, 'index.html'), 'utf8')

const esc = (s = '') =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function headFor(meta) {
  const jsonLd = (meta.jsonLd || [])
    .map((obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`)
    .join('\n    ')
  return `<title>${esc(meta.title)}</title>
    <meta name="description" content="${esc(meta.description)}" />
    <link rel="canonical" href="${esc(meta.canonical)}" />
    <meta property="og:type" content="${meta.ogType || 'website'}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:title" content="${esc(meta.title)}" />
    <meta property="og:description" content="${esc(meta.description)}" />
    <meta property="og:url" content="${esc(meta.canonical)}" />
    <meta property="og:image" content="${esc(meta.ogImage)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(meta.title)}" />
    <meta name="twitter:description" content="${esc(meta.description)}" />
    <meta name="twitter:image" content="${esc(meta.ogImage)}" />
    ${jsonLd}`
}

// Crawlable fallback shown inside #root before React hydrates.
function bodyFallback(meta, path) {
  // For blog articles, bake the full rendered body into the static HTML so the
  // page is fully indexable without JS (content pages live or die on this).
  const articleMatch = path.match(/^\/blog\/([\w-]+)$/)
  if (articleMatch) {
    const a = ARTICLES.find((x) => x.slug === articleMatch[1])
    if (a) {
      return `<article style="max-width:768px;margin:0 auto;padding:24px">
        <h1>${esc(a.title)}</h1>
        <p><em>${esc(a.description)}</em></p>
        ${marked.parse(a.body)}
      </article>`
    }
  }
  return `<div style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">
        <h1>${esc(meta.h1)}</h1>
        <p>${esc(meta.description)}</p>
        <a href="${SITE_URL}/">ToolsBase — free online PDF, image and utility tools</a>
      </div>`
}

// Strip any existing SEO tags from the template so injected ones don't duplicate.
function stripExisting(html) {
  return html
    .replace(/\s*<title>[\s\S]*?<\/title>/g, '')
    .replace(/\s*<meta\s+name="description"[^>]*>/g, '')
    .replace(/\s*<link\s+rel="canonical"[^>]*>/g, '')
    .replace(/\s*<meta\s+property="og:[^"]*"[^>]*>/g, '')
    .replace(/\s*<meta\s+name="twitter:[^"]*"[^>]*>/g, '')
    .replace(/\s*<!-- Open Graph[^>]*-->/g, '')
}

let count = 0
for (const { path } of getAllRoutes()) {
  const meta = getRouteMeta(path)
  // Inject the route-specific head just before </head>.
  let html = stripExisting(template).replace('</head>', `    ${headFor(meta)}\n  </head>`)

  // Inject the crawlable fallback into the empty mount node.
  html = html.replace('<div id="root"></div>', `<div id="root">${bodyFallback(meta, path)}</div>`)

  const outPath = path === '/' ? resolve(dist, 'index.html') : resolve(dist, `.${path}`, 'index.html')
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, html)
  count++
}

console.log(`✓ prerendered ${count} route(s) with per-page SEO head + JSON-LD`)
