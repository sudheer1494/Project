import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { CATEGORY_LABELS } from '../tools/registry.js'
import FavoriteButton from './FavoriteButton.jsx'

const CATEGORY_ACCENT = {
  pdf: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400',
  image: 'text-sky-600 bg-sky-50 dark:bg-sky-950/40 dark:text-sky-400',
  utility: 'text-brand-600 bg-brand-50 dark:bg-brand-950/40 dark:text-brand-400',
}

export default function ToolCard({ tool }) {
  const Icon = tool.icon
  return (
    <Link
      to={`/tool/${tool.slug}`}
      className="card group relative flex flex-col gap-3 p-5 transition duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card-hover dark:hover:border-brand-800"
    >
      <div className="flex items-start justify-between">
        <span className={`grid h-11 w-11 place-items-center rounded-xl ${CATEGORY_ACCENT[tool.category]}`}>
          <Icon className="h-6 w-6" />
        </span>
        <FavoriteButton slug={tool.slug} />
      </div>
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-white">{tool.name}</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{tool.description}</p>
      </div>
      <div className="mt-auto flex items-center gap-1 pt-1 text-xs font-medium text-slate-400">
        <span className="rounded-full bg-slate-100 px-2 py-0.5 dark:bg-slate-800">
          {CATEGORY_LABELS[tool.category]}
        </span>
        <ArrowRight className="ml-auto h-4 w-4 text-brand-500 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
      </div>
    </Link>
  )
}
