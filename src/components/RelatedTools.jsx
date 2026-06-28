import { getRelatedTools } from '../tools/registry.js'
import ToolCard from './ToolCard.jsx'

export default function RelatedTools({ slug }) {
  const related = getRelatedTools(slug, 4)
  if (!related.length) return null
  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Related tools</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  )
}
