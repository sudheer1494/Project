import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
      {items.map((item, i) => {
        const last = i === items.length - 1
        return (
          <span key={i} className="flex items-center gap-1">
            {item.to && !last ? (
              <Link to={item.to} className="hover:text-brand-600">
                {item.label}
              </Link>
            ) : (
              <span className={last ? 'font-medium text-slate-700 dark:text-slate-200' : ''}>
                {item.label}
              </span>
            )}
            {!last && <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600" />}
          </span>
        )
      })}
    </nav>
  )
}
