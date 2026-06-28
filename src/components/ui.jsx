import { useState } from 'react'
import { Copy, Check, Download } from 'lucide-react'
import { copyToClipboard } from '../lib/files.js'

export function CopyButton({ text, label = 'Copy', className = '' }) {
  const [copied, setCopied] = useState(false)
  const handle = async () => {
    const ok = await copyToClipboard(text)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }
  return (
    <button onClick={handle} className={`btn-secondary ${className}`} type="button" disabled={!text}>
      {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
      {copied ? 'Copied' : label}
    </button>
  )
}

export function DownloadButton({ onClick, label = 'Download', className = '' }) {
  return (
    <button onClick={onClick} className={`btn-primary ${className}`} type="button">
      <Download className="h-4 w-4" />
      {label}
    </button>
  )
}

// A labelled stat used by counters.
export function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 text-center dark:border-slate-700 dark:bg-slate-800">
      <div className="text-2xl font-bold text-brand-600 dark:text-brand-400">{value}</div>
      <div className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </div>
    </div>
  )
}

// Consistent section heading inside tools.
export function Field({ label, children, hint }) {
  return (
    <div>
      {label && <label className="label">{label}</label>}
      {children}
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  )
}
