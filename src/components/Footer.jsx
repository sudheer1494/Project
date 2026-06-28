import { Link } from 'react-router-dom'
import { Wrench, Github, Twitter, Linkedin } from 'lucide-react'
import { CATEGORIES } from '../tools/registry.js'

const categories = CATEGORIES.filter((c) => c.id !== 'all')

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 font-extrabold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white">
              <Wrench className="h-5 w-5" />
            </span>
            <span className="text-lg">
              Tools<span className="text-brand-600">Base</span>
            </span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-slate-500 dark:text-slate-400">
            Every tool you need, in one place. Fast, private, and free — most tools run entirely
            in your browser.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Categories</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  to={`/?category=${c.id}#tools`}
                  className="text-slate-500 hover:text-brand-600 dark:text-slate-400"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Company</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/about" className="text-slate-500 hover:text-brand-600 dark:text-slate-400">
                About
              </Link>
            </li>
            <li>
              <Link to="/blog" className="text-slate-500 hover:text-brand-600 dark:text-slate-400">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="text-slate-500 hover:text-brand-600 dark:text-slate-400">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-slate-500 hover:text-brand-600 dark:text-slate-400">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Follow us</h3>
          <div className="mt-3 flex gap-2">
            {[
              { Icon: Twitter, label: 'Twitter' },
              { Icon: Github, label: 'GitHub' },
              { Icon: Linkedin, label: 'LinkedIn' },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-brand-300 hover:text-brand-600 dark:border-slate-700 dark:text-slate-400"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 py-6 dark:border-slate-800">
        <p className="container-page text-center text-sm text-slate-400">
          © {new Date().getFullYear()} ToolsBase. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
