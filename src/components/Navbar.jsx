import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Wrench, LogOut } from 'lucide-react'
import { CATEGORIES } from '../tools/registry.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import ThemeToggle from './ThemeToggle.jsx'

const navCategories = CATEGORIES.filter((c) => c.id !== 'all')

function initials(user) {
  const name = user?.user_metadata?.full_name || user?.email || '?'
  return name.trim().charAt(0).toUpperCase()
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { toast } = useToast()

  const handleSignOut = async () => {
    await signOut()
    setOpen(false)
    toast('Signed out', 'info')
    navigate('/')
  }

  const goCategory = (id) => {
    setOpen(false)
    navigate(`/?category=${id}#tools`)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-950/80">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-extrabold tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white shadow-sm">
            <Wrench className="h-5 w-5" />
          </span>
          <span className="text-lg">
            Tools<span className="text-brand-600">Base</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navCategories.map((c) => (
            <button
              key={c.id}
              onClick={() => goCategory(c.id)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              {c.label}
            </button>
          ))}
          <Link
            to="/blog"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            Blog
          </Link>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {user ? (
            <>
              <span
                className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300"
                title={user.email}
              >
                {initials(user)}
              </span>
              <button onClick={handleSignOut} className="btn-ghost" title="Sign out">
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                Log in
              </Link>
              <Link to="/login" className="btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-col gap-1">
            {navCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => goCategory(c.id)}
                className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {c.label}
              </button>
            ))}
            <Link
              to="/blog"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Blog
            </Link>
            <div className="mt-2 flex gap-2">
              {user ? (
                <button onClick={handleSignOut} className="btn-secondary flex-1">
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary flex-1" onClick={() => setOpen(false)}>
                    Log in
                  </Link>
                  <Link to="/login" className="btn-primary flex-1" onClick={() => setOpen(false)}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
