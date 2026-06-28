import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../lib/useDocumentMeta.js'

export default function NotFoundPage() {
  useDocumentMeta('Page not found — ToolsBase')
  return (
    <div className="container-page flex animate-fade-in flex-col items-center py-28 text-center">
      <p className="text-7xl font-extrabold text-brand-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Page not found</h1>
      <p className="mt-2 max-w-md text-slate-500">
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <Link to="/" className="btn-primary mt-8">Back to home</Link>
    </div>
  )
}
