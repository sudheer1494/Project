import { useEffect, useMemo, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { marked } from 'marked'
import { RefreshCw, Check, X, Wand2 } from 'lucide-react'
import { CopyButton, DownloadButton, Stat, Field } from '../../components/ui.jsx'
import { downloadBlob, downloadDataUrl } from '../../lib/files.js'
import { useToast } from '../../context/ToastContext.jsx'

const Panel = ({ children, className = '' }) => (
  <div className={`card p-6 ${className}`}>{children}</div>
)

/* ----------------------------- Word Counter ----------------------------- */
export function WordCounter() {
  const [text, setText] = useState('')
  const stats = useMemo(() => {
    const trimmed = text.trim()
    const words = trimmed ? trimmed.split(/\s+/).length : 0
    const sentences = trimmed ? (trimmed.match(/[.!?]+(\s|$)/g) || []).length || 1 : 0
    const paragraphs = trimmed ? trimmed.split(/\n+/).filter((p) => p.trim()).length : 0
    const readingTime = Math.max(1, Math.round(words / 200))
    return { words, characters: text.length, sentences, paragraphs, readingTime }
  }, [text])

  return (
    <Panel>
      <Field label="Your text">
        <textarea
          className="input min-h-[200px] resize-y font-sans"
          placeholder="Start typing or paste your text here…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Field>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <Stat label="Words" value={stats.words} />
        <Stat label="Characters" value={stats.characters} />
        <Stat label="Sentences" value={stats.sentences} />
        <Stat label="Paragraphs" value={stats.paragraphs} />
        <Stat label="Min read" value={stats.readingTime} />
      </div>
    </Panel>
  )
}

/* ---------------------------- Character Counter -------------------------- */
export function CharacterCounter() {
  const [text, setText] = useState('')
  const withSpaces = text.length
  const withoutSpaces = text.replace(/\s/g, '').length
  const lines = text ? text.split('\n').length : 0
  return (
    <Panel>
      <Field label="Your text">
        <textarea
          className="input min-h-[200px] resize-y"
          placeholder="Type or paste text to count characters…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Field>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="With spaces" value={withSpaces} />
        <Stat label="Without spaces" value={withoutSpaces} />
        <Stat label="Spaces" value={withSpaces - withoutSpaces} />
        <Stat label="Lines" value={lines} />
      </div>
    </Panel>
  )
}

/* ---------------------------- Case Converter ---------------------------- */
const toTitle = (s) =>
  s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
const toSentence = (s) =>
  s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())

export function CaseConverter() {
  const [text, setText] = useState('')
  const transforms = [
    { label: 'UPPERCASE', fn: (s) => s.toUpperCase() },
    { label: 'lowercase', fn: (s) => s.toLowerCase() },
    { label: 'Title Case', fn: toTitle },
    { label: 'Sentence case', fn: toSentence },
    { label: 'camelCase', fn: (s) => s.toLowerCase().replace(/[^a-z0-9]+(.)/g, (_, c) => c.toUpperCase()) },
    { label: 'snake_case', fn: (s) => s.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^\w]/g, '') },
    { label: 'kebab-case', fn: (s) => s.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') },
    { label: 'aLtErNaTiNg', fn: (s) => s.split('').map((c, i) => (i % 2 ? c.toUpperCase() : c.toLowerCase())).join('') },
  ]
  return (
    <Panel>
      <Field label="Your text">
        <textarea
          className="input min-h-[160px] resize-y"
          placeholder="Type or paste text to convert…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Field>
      <div className="mt-4 flex flex-wrap gap-2">
        {transforms.map((t) => (
          <button key={t.label} onClick={() => setText(t.fn(text))} className="btn-secondary">
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <CopyButton text={text} label="Copy result" />
        <button onClick={() => setText('')} className="btn-ghost">
          Clear
        </button>
      </div>
    </Panel>
  )
}

/* ----------------------------- Color Picker ----------------------------- */
function hexToRgb(hex) {
  const m = hex.replace('#', '')
  const v = m.length === 3 ? m.split('').map((c) => c + c).join('') : m
  const num = parseInt(v, 16)
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
}
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0)
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h /= 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function ColorPicker() {
  const [hex, setHex] = useState('#7c3aed')
  const { r, g, b } = hexToRgb(hex)
  const { h, s, l } = rgbToHsl(r, g, b)
  const rgb = `rgb(${r}, ${g}, ${b})`
  const hsl = `hsl(${h}, ${s}%, ${l}%)`
  const rows = [
    { label: 'HEX', value: hex.toUpperCase() },
    { label: 'RGB', value: rgb },
    { label: 'HSL', value: hsl },
  ]
  return (
    <Panel>
      <div className="grid gap-6 sm:grid-cols-[200px_1fr]">
        <div>
          <div
            className="aspect-square w-full rounded-2xl border border-slate-200 shadow-inner dark:border-slate-700"
            style={{ background: hex }}
          />
          <input
            type="color"
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            className="mt-3 h-12 w-full cursor-pointer rounded-xl"
            aria-label="Pick a color"
          />
        </div>
        <div className="space-y-3">
          <Field label="HEX value">
            <input
              className="input font-mono"
              value={hex}
              onChange={(e) => {
                const v = e.target.value
                setHex(v.startsWith('#') ? v : `#${v}`)
              }}
            />
          </Field>
          {rows.map((row) => (
            <div key={row.label} className="flex items-center gap-2">
              <span className="w-12 text-xs font-semibold uppercase text-slate-400">{row.label}</span>
              <code className="flex-1 rounded-lg bg-slate-100 px-3 py-2 font-mono text-sm dark:bg-slate-800">
                {row.value}
              </code>
              <CopyButton text={row.value} label="" />
            </div>
          ))}
        </div>
      </div>
    </Panel>
  )
}

/* -------------------------- QR Code Generator --------------------------- */
export function QrCodeGenerator() {
  const [text, setText] = useState('https://toolsbase.app')
  const [size, setSize] = useState(320)
  const [dataUrl, setDataUrl] = useState('')

  useEffect(() => {
    if (!text) {
      setDataUrl('')
      return
    }
    QRCode.toDataURL(text, { width: size, margin: 2, errorCorrectionLevel: 'M' })
      .then(setDataUrl)
      .catch(() => setDataUrl(''))
  }, [text, size])

  return (
    <Panel>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-4">
          <Field label="Text or URL">
            <textarea
              className="input min-h-[120px] resize-y"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter a URL or any text…"
            />
          </Field>
          <Field label={`Size: ${size}px`}>
            <input
              type="range"
              min="120"
              max="600"
              step="40"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full accent-brand-600"
            />
          </Field>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-slate-50 p-6 dark:bg-slate-800/50">
          {dataUrl ? (
            <>
              <img src={dataUrl} alt="QR code" className="rounded-xl bg-white p-2 shadow-sm" width={220} height={220} />
              <DownloadButton onClick={() => downloadDataUrl(dataUrl, 'qrcode.png')} label="Download PNG" />
            </>
          ) : (
            <p className="text-sm text-slate-400">Enter text to generate a QR code</p>
          )}
        </div>
      </div>
    </Panel>
  )
}

/* ------------------------- URL Encoder / Decoder ------------------------ */
export function UrlEncoder() {
  const { toast } = useToast()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const run = (mode) => {
    try {
      setOutput(mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input))
    } catch {
      toast('Invalid input for decoding', 'error')
    }
  }
  return (
    <TwoWayText
      input={input}
      setInput={setInput}
      output={output}
      onEncode={() => run('encode')}
      onDecode={() => run('decode')}
      placeholder="Enter text or a URL…"
    />
  )
}

/* ------------------------- Base64 Encode / Decode ----------------------- */
export function Base64Tool() {
  const { toast } = useToast()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const run = (mode) => {
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))))
      } else {
        setOutput(decodeURIComponent(escape(atob(input.trim()))))
      }
    } catch {
      toast('Invalid Base64 input', 'error')
    }
  }
  return (
    <TwoWayText
      input={input}
      setInput={setInput}
      output={output}
      onEncode={() => run('encode')}
      onDecode={() => run('decode')}
      placeholder="Enter text to encode, or Base64 to decode…"
    />
  )
}

// Shared encode/decode UI used by URL & Base64 tools.
function TwoWayText({ input, setInput, output, onEncode, onDecode, placeholder }) {
  return (
    <Panel>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Input">
          <textarea
            className="input min-h-[180px] resize-y font-mono text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
          />
        </Field>
        <Field label="Output">
          <textarea
            readOnly
            className="input min-h-[180px] resize-y bg-slate-50 font-mono text-sm dark:bg-slate-800/50"
            value={output}
            placeholder="Result appears here…"
          />
        </Field>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={onEncode} className="btn-primary">Encode</button>
        <button onClick={onDecode} className="btn-secondary">Decode</button>
        <CopyButton text={output} label="Copy result" />
      </div>
    </Panel>
  )
}

/* -------------------------- Password Generator -------------------------- */
export function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [opts, setOpts] = useState({ upper: true, lower: true, numbers: true, symbols: true })
  const [password, setPassword] = useState('')

  const generate = () => {
    const sets = {
      upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lower: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()-_=+[]{};:,.<>?',
    }
    const pool = Object.entries(opts)
      .filter(([, on]) => on)
      .map(([k]) => sets[k])
      .join('')
    if (!pool) {
      setPassword('')
      return
    }
    const arr = new Uint32Array(length)
    crypto.getRandomValues(arr)
    setPassword(Array.from(arr, (n) => pool[n % pool.length]).join(''))
  }

  useEffect(() => {
    generate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const strength = useMemo(() => {
    let score = 0
    if (length >= 12) score++
    if (length >= 16) score++
    if (opts.numbers) score++
    if (opts.symbols) score++
    if (opts.upper && opts.lower) score++
    if (score <= 2) return { label: 'Weak', color: 'bg-red-500', w: '33%' }
    if (score <= 3) return { label: 'Good', color: 'bg-amber-500', w: '66%' }
    return { label: 'Strong', color: 'bg-emerald-500', w: '100%' }
  }, [length, opts])

  return (
    <Panel>
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800">
        <code className="flex-1 overflow-x-auto px-3 py-2 font-mono text-lg text-slate-800 dark:text-slate-100">
          {password || '—'}
        </code>
        <button onClick={generate} className="btn-ghost shrink-0" aria-label="Regenerate">
          <RefreshCw className="h-4 w-4" />
        </button>
        <CopyButton text={password} label="" className="shrink-0" />
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Strength</span>
          <span className="font-medium text-slate-600 dark:text-slate-300">{strength.label}</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div className={`h-full rounded-full transition-all ${strength.color}`} style={{ width: strength.w }} />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <Field label={`Length: ${length} characters`}>
          <input
            type="range"
            min="6"
            max="48"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-brand-600"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { key: 'upper', label: 'A-Z' },
            { key: 'lower', label: 'a-z' },
            { key: 'numbers', label: '0-9' },
            { key: 'symbols', label: '!@#' },
          ].map((o) => (
            <label
              key={o.key}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700"
            >
              <input
                type="checkbox"
                checked={opts[o.key]}
                onChange={(e) => setOpts({ ...opts, [o.key]: e.target.checked })}
                className="h-4 w-4 accent-brand-600"
              />
              <span className="font-mono">{o.label}</span>
            </label>
          ))}
        </div>
      </div>
      <button onClick={generate} className="btn-primary mt-6">
        <RefreshCw className="h-4 w-4" /> Generate password
      </button>
    </Panel>
  )
}

/* ---------------------------- JSON Formatter ---------------------------- */
export function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState(null) // {ok, message}

  const format = (minify = false) => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, minify ? 0 : 2))
      setStatus({ ok: true, message: 'Valid JSON' })
    } catch (e) {
      setStatus({ ok: false, message: e.message })
    }
  }

  return (
    <Panel>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Input JSON">
          <textarea
            className="input min-h-[280px] resize-y font-mono text-sm scroll-thin"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{ "hello": "world" }'
            spellCheck={false}
          />
        </Field>
        <Field label="Formatted output">
          <textarea
            readOnly
            className="input min-h-[280px] resize-y bg-slate-50 font-mono text-sm scroll-thin dark:bg-slate-800/50"
            value={output}
            placeholder="Formatted JSON appears here…"
            spellCheck={false}
          />
        </Field>
      </div>
      {status && (
        <div
          className={`mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
            status.ok
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
              : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
          }`}
        >
          {status.ok ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
          {status.message}
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => format(false)} className="btn-primary">
          <Wand2 className="h-4 w-4" /> Prettify
        </button>
        <button onClick={() => format(true)} className="btn-secondary">Minify</button>
        <CopyButton text={output} label="Copy result" />
      </div>
    </Panel>
  )
}

/* --------------------------- Markdown to HTML --------------------------- */
export function MarkdownToHtml() {
  const [md, setMd] = useState('# Hello, ToolsBase\n\nType **Markdown** on the left and see the _preview_ on the right.\n\n- Lists\n- [Links](https://toolsbase.app)\n- `code`\n')
  const html = useMemo(() => marked.parse(md, { breaks: true }), [md])

  return (
    <Panel>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Markdown">
          <textarea
            className="input min-h-[320px] resize-y font-mono text-sm scroll-thin"
            value={md}
            onChange={(e) => setMd(e.target.value)}
            spellCheck={false}
          />
        </Field>
        <Field label="Preview">
          <div
            className="markdown-preview min-h-[320px] overflow-auto rounded-xl border border-slate-200 bg-white p-4 text-sm scroll-thin dark:border-slate-700 dark:bg-slate-800/50"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </Field>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <CopyButton text={html} label="Copy HTML" />
        <DownloadButton
          onClick={() => downloadBlob(new Blob([html], { type: 'text/html' }), 'converted.html')}
          label="Download .html"
        />
      </div>
    </Panel>
  )
}
