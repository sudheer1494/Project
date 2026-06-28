import { Link } from 'react-router-dom'
import { ShieldCheck, Zap, Heart, Globe } from 'lucide-react'
import { useDocumentMeta } from '../lib/useDocumentMeta.js'
import { TOOLS } from '../tools/registry.js'

const VALUES = [
  { icon: ShieldCheck, title: 'Private by design', text: 'Most tools run entirely in your browser. Your files are never uploaded to a server.' },
  { icon: Zap, title: 'Fast & free', text: 'No queues, no watermarks, no hidden fees. Get instant results, every time.' },
  { icon: Globe, title: 'Works everywhere', text: 'Fully responsive across mobile, tablet and desktop — no installation required.' },
  { icon: Heart, title: 'Made for everyone', text: 'A clean, simple interface that anyone can use, from students to professionals.' },
]

export default function AboutPage() {
  useDocumentMeta('About — ToolsBase', 'Learn about ToolsBase, the free online tool hub for PDFs, images and everyday utilities.')
  return (
    <div className="container-page animate-fade-in max-w-3xl py-16">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">About ToolsBase</h1>
      <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
        ToolsBase brings together {TOOLS.length}+ everyday tools in one fast, friendly place. Whether
        you need to merge a PDF, compress an image, or generate a QR code, you can do it instantly —
        no login, no installs, no nonsense.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {VALUES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="card p-5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/50">
              <Icon className="h-5 w-5" />
            </span>
            <h2 className="mt-3 font-semibold text-slate-900 dark:text-white">{title}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{text}</p>
          </div>
        ))}
      </div>
      <Link to="/" className="btn-primary mt-10">Explore the tools</Link>
    </div>
  )
}
