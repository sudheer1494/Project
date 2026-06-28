import { Suspense, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { getToolBySlug, CATEGORY_LABELS } from '../tools/registry.js'
import { TOOL_COMPONENTS } from '../tools/components.js'
import { pushRecent } from '../lib/storage.js'
import { useDocumentMeta } from '../lib/useDocumentMeta.js'
import Breadcrumb from '../components/Breadcrumb.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import RelatedTools from '../components/RelatedTools.jsx'
import ShareButton from '../components/ShareButton.jsx'
import FavoriteButton from '../components/FavoriteButton.jsx'

export default function ToolPage() {
  const { slug } = useParams()
  const tool = getToolBySlug(slug)

  // Title/description come from the shared SEO map (matches the prerendered
  // HTML); only override for the not-found case.
  useDocumentMeta(tool ? undefined : 'Tool not found — ToolsBase')

  useEffect(() => {
    if (tool) pushRecent(tool.slug)
  }, [tool])

  if (!tool) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tool not found</h1>
        <p className="mt-2 text-slate-500">The tool you’re looking for doesn’t exist.</p>
        <Link to="/" className="btn-primary mt-6">
          Back to all tools
        </Link>
      </div>
    )
  }

  const ToolComponent = TOOL_COMPONENTS[tool.component]
  const Icon = tool.icon

  return (
    <div className="container-page animate-fade-in py-8">
      <Breadcrumb
        items={[
          { label: 'Home', to: '/' },
          { label: CATEGORY_LABELS[tool.category], to: `/?category=${tool.category}#tools` },
          { label: tool.name },
        ]}
      />

      <header className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950/50">
            <Icon className="h-7 w-7" />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              {tool.name}
            </h1>
            <p className="mt-1 max-w-2xl text-slate-500 dark:text-slate-400">{tool.description}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <FavoriteButton slug={tool.slug} className="border border-slate-200 dark:border-slate-700" />
          <ShareButton title={`${tool.name} — ToolsBase`} />
        </div>
      </header>

      <div className="mt-8">
        {ToolComponent ? (
          <Suspense
            fallback={
              <div className="card flex items-center justify-center gap-2 p-16 text-slate-400">
                <Loader2 className="h-5 w-5 animate-spin" /> Loading tool…
              </div>
            }
          >
            <ToolComponent tool={tool} />
          </Suspense>
        ) : (
          <div className="card p-8 text-center text-slate-500">
            This tool is coming soon.
          </div>
        )}
      </div>

      <HowItWorks />
      <RelatedTools slug={tool.slug} />
    </div>
  )
}
