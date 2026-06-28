import { Link } from 'react-router-dom'
import { CalendarDays, Clock, ArrowRight } from 'lucide-react'
import { ARTICLES } from '../content/articles.js'
import { useDocumentMeta } from '../lib/useDocumentMeta.js'
import Breadcrumb from '../components/Breadcrumb.jsx'

const CATEGORY_ACCENT = {
  PDF: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400',
  Image: 'bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400',
  Utilities: 'bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400',
  Privacy: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function BlogPage() {
  useDocumentMeta()
  const articles = [...ARTICLES].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="container-page animate-fade-in py-8">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Blog' }]} />
      <header className="mt-6 max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          ToolsBase Blog
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Practical guides for working with PDFs, images and everyday utilities — fast, free and
          private.
        </p>
      </header>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.slug}
            to={`/blog/${article.slug}`}
            className="card group flex flex-col p-5 transition duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card-hover dark:hover:border-brand-800"
          >
            <span
              className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                CATEGORY_ACCENT[article.category] || CATEGORY_ACCENT.Utilities
              }`}
            >
              {article.category}
            </span>
            <h2 className="mt-3 font-bold text-slate-900 dark:text-white">{article.title}</h2>
            <p className="mt-2 flex-1 text-sm text-slate-500 dark:text-slate-400">
              {article.description}
            </p>
            <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" /> {formatDate(article.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {article.readMinutes} min
              </span>
              <ArrowRight className="ml-auto h-4 w-4 text-brand-500 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
