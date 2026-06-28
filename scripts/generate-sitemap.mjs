// Generates dist/sitemap.xml from the tool catalog. Runs after `vite build`.
import { writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getAllRoutes, SITE_URL } from '../src/lib/seo.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dist = resolve(__dirname, '../dist')
const today = new Date().toISOString().split('T')[0]

const urls = getAllRoutes()
  .map(
    ({ path, priority, changefreq }) => `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

writeFileSync(resolve(dist, 'sitemap.xml'), xml)
console.log(`✓ sitemap.xml written with ${getAllRoutes().length} URLs`)
