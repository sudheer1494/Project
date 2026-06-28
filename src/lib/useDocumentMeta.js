import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getRouteMeta } from './seo.js'

function setMeta(selector, attr, value) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    const [, name] = selector.match(/\[(?:name|property)="(.+)"\]/) || []
    if (selector.includes('property=')) el.setAttribute('property', name)
    else el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

function setCanonical(href) {
  let link = document.head.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

// SEO hook: keeps the document title, description, canonical and social tags in
// sync with the current route during client-side navigation. Pass overrides to
// customise title/description; otherwise values come from the shared SEO map.
export function useDocumentMeta(title, description) {
  const { pathname } = useLocation()

  useEffect(() => {
    const meta = getRouteMeta(pathname)
    const finalTitle = title || meta.title
    const finalDesc = description || meta.description

    document.title = finalTitle
    setMeta('meta[name="description"]', 'content', finalDesc)
    setCanonical(meta.canonical)

    setMeta('meta[property="og:title"]', 'content', finalTitle)
    setMeta('meta[property="og:description"]', 'content', finalDesc)
    setMeta('meta[property="og:url"]', 'content', meta.canonical)
    setMeta('meta[name="twitter:title"]', 'content', finalTitle)
    setMeta('meta[name="twitter:description"]', 'content', finalDesc)
  }, [pathname, title, description])
}
