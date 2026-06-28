import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Wrench, Mail, Lock } from 'lucide-react'
import { useDocumentMeta } from '../lib/useDocumentMeta.js'
import { useToast } from '../context/ToastContext.jsx'
import { Field } from '../components/ui.jsx'

export default function LoginPage() {
  useDocumentMeta('Sign in — ToolsBase', 'Sign in or create a free ToolsBase account.')
  const { toast } = useToast()
  const [mode, setMode] = useState('signup')

  const handleSubmit = (e) => {
    e.preventDefault()
    toast('Accounts are coming soon — all tools are free to use right now!', 'info', 5000)
  }

  return (
    <div className="container-page flex animate-fade-in items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-600 text-white shadow-sm">
            <Wrench className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold text-slate-900 dark:text-white">
            {mode === 'signup' ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {mode === 'signup'
              ? 'Save favorites and unlock larger file limits.'
              : 'Sign in to continue to ToolsBase.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4 p-6">
          <Field label="Email">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input required type="email" className="input pl-10" placeholder="you@example.com" />
            </div>
          </Field>
          <Field label="Password">
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input required type="password" className="input pl-10" placeholder="••••••••" />
            </div>
          </Field>
          <button type="submit" className="btn-primary w-full">
            {mode === 'signup' ? 'Sign up' : 'Log in'}
          </button>
          <div className="relative py-1 text-center">
            <span className="relative z-10 bg-white px-3 text-xs uppercase text-slate-400 dark:bg-slate-900">
              or
            </span>
            <span className="absolute left-0 top-1/2 h-px w-full bg-slate-200 dark:bg-slate-700" />
          </div>
          <button type="button" onClick={handleSubmit} className="btn-secondary w-full">
            Continue with Google
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          {mode === 'signup' ? 'Already have an account?' : 'New to ToolsBase?'}{' '}
          <button
            onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
            className="font-semibold text-brand-600 hover:underline"
          >
            {mode === 'signup' ? 'Log in' : 'Sign up'}
          </button>
        </p>
        <p className="mt-6 text-center text-xs text-slate-400">
          <Link to="/" className="hover:text-brand-600">← Back to all tools</Link>
        </p>
      </div>
    </div>
  )
}
