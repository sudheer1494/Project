import { MousePointerClick, Settings2, Download } from 'lucide-react'

const DEFAULT_STEPS = [
  { icon: MousePointerClick, title: 'Add your input', text: 'Upload a file or paste your content to get started.' },
  { icon: Settings2, title: 'Adjust & run', text: 'Choose your options and run the tool in one click.' },
  { icon: Download, title: 'Get the result', text: 'Preview and download your result instantly.' },
]

export default function HowItWorks({ steps = DEFAULT_STEPS }) {
  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">How it works</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {steps.map((step, i) => {
          const Icon = step.icon
          return (
            <div key={i} className="card p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/50">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-bold text-slate-300 dark:text-slate-600">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-3 font-semibold text-slate-900 dark:text-white">{step.title}</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{step.text}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
