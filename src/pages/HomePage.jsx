import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Sparkles, ShieldCheck, Zap, Clock, Heart } from 'lucide-react'
import { TOOLS, CATEGORIES, getToolBySlug } from '../tools/registry.js'
import ToolCard from '../components/ToolCard.jsx'
import { getRecent } from '../lib/storage.js'
import { useFavorites } from '../context/FavoritesContext.jsx'
import { useDocumentMeta } from '../lib/useDocumentMeta.js'

export default function HomePage() {
  useDocumentMeta(
    'ToolsBase — Every tool you need, in one place',
    'Free online PDF tools, image tools and utilities. Merge PDFs, compress images, generate QR codes and more — fast, private, no login required.',
  )

  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') || 'all'
  const [query, setQuery] = useState('')
  const [recent, setRecent] = useState([])
  const { favorites: favoriteSlugs } = useFavorites()
  const favorites = useMemo(
    () => favoriteSlugs.map(getToolBySlug).filter(Boolean),
    [favoriteSlugs],
  )

  useEffect(() => {
    setRecent(getRecent().map(getToolBySlug).filter(Boolean))
  }, [])

  const setCategory = (id) => {
    const next = new URLSearchParams(searchParams)
    if (id === 'all') next.delete('category')
    else next.set('category', id)
    setSearchParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return TOOLS.filter((t) => {
      const matchesCat = activeCategory === 'all' || t.category === activeCategory
      if (!matchesCat) return false
      if (!q) return true
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.keywords?.some((k) => k.includes(q))
      )
    })
  }, [query, activeCategory])

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 to-transparent dark:from-brand-950/30" />
        <div className="pointer-events-none absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl dark:bg-brand-800/20" />
        <div className="container-page py-16 text-center sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-medium text-brand-700 shadow-sm dark:border-brand-800 dark:bg-slate-900 dark:text-brand-300">
            <Sparkles className="h-3.5 w-3.5" />
            {TOOLS.length}+ free tools, no sign-up needed
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Every tool you need, <span className="text-brand-600">in one place</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            PDF, image and everyday utilities — fast, secure and free. Most tools run entirely in
            your browser, so your files never leave your device.
          </p>

          {/* Search */}
          <div className="mx-auto mt-8 flex max-w-xl items-center gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools, e.g. “merge pdf” or “qr code”"
                className="input h-12 pl-12 text-base shadow-sm"
                aria-label="Search tools"
              />
            </div>
          </div>

          <div className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" /> Private by design
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-amber-500" /> Instant results
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-brand-500" /> 100% free
            </span>
          </div>
        </div>
      </section>

      {/* Favorites & recently used */}
      {(recent.length > 0 || favorites.length > 0) && !query && activeCategory === 'all' && (
        <section className="container-page">
          {favorites.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                <Heart className="h-5 w-5 fill-current text-rose-500" /> Your favorites
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {favorites.slice(0, 4).map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </div>
          )}
          {recent.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                <Clock className="h-5 w-5 text-brand-500" /> Recently used
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {recent.slice(0, 4).map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Tool grid */}
      <section id="tools" className="container-page scroll-mt-20 pb-8 pt-4">
        {/* Category tabs */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((c) => {
            const Icon = c.icon
            const active = c.id === activeCategory
            return (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {c.label}
              </button>
            )
          })}
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
              No tools match “{query}”
            </p>
            <p className="mt-1 text-sm text-slate-500">Try a different keyword or category.</p>
          </div>
        )}
      </section>
    </div>
  )
}
