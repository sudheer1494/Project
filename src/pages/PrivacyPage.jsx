import { useDocumentMeta } from '../lib/useDocumentMeta.js'

export default function PrivacyPage() {
  useDocumentMeta('Privacy Policy — ToolsBase', 'How ToolsBase handles your data. Most tools process files entirely in your browser.')
  return (
    <div className="container-page animate-fade-in max-w-3xl py-16">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-400">Last updated: {new Date().getFullYear()}</p>

      <div className="prose-toolsbase mt-8 space-y-6 text-slate-600 dark:text-slate-300">
        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Your files stay with you</h2>
          <p className="mt-2">
            The vast majority of ToolsBase tools run entirely in your browser using client-side
            JavaScript. This means your files — PDFs, images and text — are processed on your own
            device and are never uploaded to or stored on our servers.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">What we store locally</h2>
          <p className="mt-2">
            We use your browser’s <code>localStorage</code> to remember small preferences such as
            your theme (light/dark), recently used tools, and favorited tools. This data never
            leaves your device and you can clear it at any time from your browser settings.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Analytics & cookies</h2>
          <p className="mt-2">
            ToolsBase does not set advertising cookies or sell personal data. Any analytics, if
            enabled, are aggregated and anonymized to help us improve the product.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Contact</h2>
          <p className="mt-2">
            Questions about privacy? Reach out via our{' '}
            <a href="/contact" className="text-brand-600 hover:underline">contact page</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
