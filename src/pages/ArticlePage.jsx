import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { marked } from 'marked'
import { CalendarDays, Clock, ArrowRight } from 'lucide-react'
import { getArticleBySlug, getRelatedArticles } from '../content/articles.js'
import { getToolBySlug } from '../tools/registry.js'
import { useDocumentMeta } from '../lib/useDocumentMeta.js'
import Breadcrumb from '../components/Breadcrumb.jsx'
import ToolCard from '../components/ToolCard.jsx'

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function ArticlePage() {
  const { slug } = useParams()
  const article = getArticleBySlug(slug)
  useDocumentMeta(article ? undefined : 'Article not found — ToolsBase')

  const html = useMemo(
    () => (article ? marked.parse(article.body, { breaks: false }) : ''),
    [article],
  )

  if (!article) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Article not found</h1>
        <Link to="/blog" className="btn-primary mt-6">
          Back to the blog
        </Link>
      </div>
    )
  }

  const relatedTools = (article.relatedTools || []).map(getToolBySlug).filter(Boolean)
  const relatedArticles = getRelatedArticles(slug, 3)

  return (
    <div className="container-page animate-fade-in py-8">
      <Breadcrumb
        items={[
          { label: 'Home', to: '/' },
          { label: 'Blog', to: '/blog' },
          { label: article.title },
        ]}
      />

      <article className="mx-auto mt-6 max-w-3xl">
        <span className="text-sm font-semibold text-brand-600">{article.category}</span>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          {article.title}
        </h1>
        <div className="mt-3 flex items-center gap-4 text-sm text-slate-400">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" /> {formatDate(article.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> {article.readMinutes} min read
          </span>
        </div>

        <div
          className="markdown-preview mt-8 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>

      {relatedTools.length > 0 && (
        <section className="mx-auto mt-12 max-w-3xl">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Tools used in this guide</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {relatedArticles.length > 0 && (
        <section className="mx-auto mt-12 max-w-3xl">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Keep reading</h2>
          <div className="mt-4 divide-y divide-slate-200 dark:divide-slate-800">
            {relatedArticles.map((a) => (
              <Link
                key={a.slug}
                to={`/blog/${a.slug}`}
                className="group flex items-center gap-3 py-3 text-slate-700 hover:text-brand-600 dark:text-slate-300"
              >
                <span className="flex-1 font-medium">{a.title}</span>
                <ArrowRight className="h-4 w-4 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
