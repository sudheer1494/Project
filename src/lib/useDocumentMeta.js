import { useEffect } from 'react'

// Lightweight SEO helper: sets document title and meta description per page.
export function useDocumentMeta(title, description) {
  useEffect(() => {
    const prevTitle = document.title
    if (title) document.title = title
    let meta = document.querySelector('meta[name="description"]')
    const prevDesc = meta?.getAttribute('content')
    if (description && meta) meta.setAttribute('content', description)
    return () => {
      document.title = prevTitle
      if (meta && prevDesc != null) meta.setAttribute('content', prevDesc)
    }
  }, [title, description])
}
