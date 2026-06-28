import { useState } from 'react'
import { Mail, MapPin, Send } from 'lucide-react'
import { useDocumentMeta } from '../lib/useDocumentMeta.js'
import { useToast } from '../context/ToastContext.jsx'
import { Field } from '../components/ui.jsx'

export default function ContactPage() {
  useDocumentMeta('Contact — ToolsBase', 'Get in touch with the ToolsBase team.')
  const { toast } = useToast()
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    toast('Thanks! Your message has been sent.', 'success')
    e.target.reset()
    setTimeout(() => setSent(false), 2000)
  }

  return (
    <div className="container-page animate-fade-in max-w-5xl py-16">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Contact us</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">
        Have feedback, a bug report, or a tool request? We’d love to hear from you.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <div className="card flex items-center gap-3 p-4">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/50">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Email</p>
              <p className="text-sm text-slate-500">hello@toolsbase.app</p>
            </div>
          </div>
          <div className="card flex items-center gap-3 p-4">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/50">
              <MapPin className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Location</p>
              <p className="text-sm text-slate-500">Remote — everywhere</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4 p-6 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <input required className="input" placeholder="Your name" />
            </Field>
            <Field label="Email">
              <input required type="email" className="input" placeholder="you@example.com" />
            </Field>
          </div>
          <Field label="Message">
            <textarea required rows={5} className="input resize-y" placeholder="How can we help?" />
          </Field>
          <button type="submit" className="btn-primary" disabled={sent}>
            <Send className="h-4 w-4" />
            {sent ? 'Sent!' : 'Send message'}
          </button>
        </form>
      </div>
    </div>
  )
}
