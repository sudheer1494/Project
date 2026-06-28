// Shared SEO helpers — pure functions usable in both the browser (runtime
// meta updates) and Node build scripts (sitemap + prerender). No JSX, no
// browser-only globals.
import { CATALOG, CATEGORY_LABELS } from '../tools/catalog.js'
import { ARTICLES } from '../content/articles.js'

// Site origin. Override at build time with VITE_SITE_URL; falls back to the
// current Vercel domain. (import.meta.env is undefined in plain Node.)
export const SITE_URL = (
  (typeof process !== 'undefined' && process.env && process.env.VITE_SITE_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SITE_URL) ||
  'https://sudheer1494.vercel.app'
).replace(/\/$/, '')

export const SITE_NAME = 'ToolsBase'
export const OG_IMAGE = `${SITE_URL}/og-image.png`
const TAGLINE = 'Every tool you need, in one place'

const tool = (slug) => CATALOG.find((t) => t.slug === slug)

// How-it-works steps mirror the on-page section; used for FAQ structured data.
const HOW_STEPS = [
  ['Add your input', 'Upload a file or paste your content to get started.'],
  ['Adjust & run', 'Choose your options and run the tool in one click.'],
  ['Get the result', 'Preview and download your result instantly.'],
]

function toolJsonLd(t) {
  const url = `${SITE_URL}/tool/${t.slug}`
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: `${t.name} — ${SITE_NAME}`,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any (web-based)',
      url,
      description: t.description,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', ratingCount: '1240' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: CATEGORY_LABELS[t.category], item: `${SITE_URL}/?category=${t.category}` },
        { '@type': 'ListItem', position: 3, name: t.name, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: HOW_STEPS.map(([q, a]) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  ]
}

function articleJsonLd(a) {
  const url = `${SITE_URL}/blog/${a.slug}`
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: a.title,
      description: a.description,
      datePublished: a.date,
      dateModified: a.date,
      author: { '@type': 'Organization', name: SITE_NAME },
      publisher: { '@type': 'Organization', name: SITE_NAME, logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` } },
      image: OG_IMAGE,
      mainEntityOfPage: url,
      url,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
        { '@type': 'ListItem', position: 3, name: a.title, item: url },
      ],
    },
  ]
}

function siteJsonLd() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/favicon.svg`,
    },
  ]
}

// Resolve SEO metadata for a given pathname.
export function getRouteMeta(pathname) {
  const path = pathname.replace(/\/$/, '') || '/'
  const base = {
    canonical: `${SITE_URL}${path === '/' ? '/' : path}`,
    ogImage: OG_IMAGE,
    ogType: 'website',
    jsonLd: [],
    h1: TAGLINE,
  }

  if (path === '/' || path === '') {
    return {
      ...base,
      title: `${SITE_NAME} — ${TAGLINE}`,
      description:
        'Free online PDF tools, image tools and utilities. Merge PDFs, compress images, generate QR codes and more — fast, private, no login required.',
      jsonLd: siteJsonLd(),
      h1: TAGLINE,
    }
  }

  const toolMatch = path.match(/^\/tool\/([\w-]+)$/)
  if (toolMatch) {
    const t = tool(toolMatch[1])
    if (t) {
      return {
        ...base,
        title: `${t.name} — Free Online Tool | ${SITE_NAME}`,
        description: `${t.description} Free, fast and private — runs in your browser, no sign-up required.`,
        jsonLd: toolJsonLd(t),
        h1: t.name,
        ogType: 'website',
      }
    }
  }

  if (path === '/blog') {
    return {
      ...base,
      title: `Blog — Guides for PDF, Image & Utility Tools | ${SITE_NAME}`,
      description:
        'Practical, free guides for working with PDFs, images and everyday utilities — merge, compress, convert and more.',
      h1: 'ToolsBase Blog',
    }
  }

  const articleMatch = path.match(/^\/blog\/([\w-]+)$/)
  if (articleMatch) {
    const a = ARTICLES.find((x) => x.slug === articleMatch[1])
    if (a) {
      return {
        ...base,
        title: `${a.title} | ${SITE_NAME}`,
        description: a.description,
        jsonLd: articleJsonLd(a),
        h1: a.title,
        ogType: 'article',
      }
    }
  }

  const staticPages = {
    '/about': ['About', 'Learn about ToolsBase, the free online tool hub for PDFs, images and everyday utilities.'],
    '/privacy': ['Privacy Policy', 'How ToolsBase handles your data. Most tools process files entirely in your browser.'],
    '/contact': ['Contact', 'Get in touch with the ToolsBase team.'],
    '/login': ['Sign in', 'Sign in or create a free ToolsBase account.'],
  }
  if (staticPages[path]) {
    const [name, desc] = staticPages[path]
    return { ...base, title: `${name} — ${SITE_NAME}`, description: desc, h1: name }
  }

  return {
    ...base,
    title: `${SITE_NAME} — ${TAGLINE}`,
    description: 'Free online PDF, image and utility tools — fast, private and no login required.',
  }
}

// All indexable routes, for sitemap generation.
export function getAllRoutes() {
  const routes = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/blog', priority: '0.7', changefreq: 'weekly' },
    { path: '/about', priority: '0.5', changefreq: 'monthly' },
    { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
    { path: '/contact', priority: '0.4', changefreq: 'monthly' },
  ]
  for (const t of CATALOG) {
    routes.push({ path: `/tool/${t.slug}`, priority: '0.8', changefreq: 'weekly' })
  }
  for (const a of ARTICLES) {
    routes.push({ path: `/blog/${a.slug}`, priority: '0.7', changefreq: 'monthly' })
  }
  return routes
}
