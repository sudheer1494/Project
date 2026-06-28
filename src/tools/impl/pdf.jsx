import { useState } from 'react'
import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib'
import * as pdfjsLib from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { Loader2, GripVertical, Server } from 'lucide-react'
import DropZone from '../../components/DropZone.jsx'
import { DownloadButton, Field } from '../../components/ui.jsx'
import { downloadBlob, formatBytes, baseName } from '../../lib/files.js'
import { useToast } from '../../context/ToastContext.jsx'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

const Panel = ({ children, className = '' }) => <div className={`card p-6 ${className}`}>{children}</div>
const PDF_HINT = 'PDF files only'

const readArrayBuffer = (file) => file.arrayBuffer()

function Busy({ children }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      {children}
    </span>
  )
}

/* ------------------------------- Merge PDF ------------------------------ */
export function MergePdf() {
  const { toast } = useToast()
  const [files, setFiles] = useState([])
  const [busy, setBusy] = useState(false)

  const move = (idx, dir) => {
    const next = [...files]
    const target = idx + dir
    if (target < 0 || target >= next.length) return
    ;[next[idx], next[target]] = [next[target], next[idx]]
    setFiles(next)
  }

  const merge = async () => {
    if (files.length < 2) return toast('Add at least two PDFs to merge', 'info')
    setBusy(true)
    try {
      const out = await PDFDocument.create()
      for (const file of files) {
        const doc = await PDFDocument.load(await readArrayBuffer(file), { ignoreEncryption: true })
        const pages = await out.copyPages(doc, doc.getPageIndices())
        pages.forEach((p) => out.addPage(p))
      }
      const bytes = await out.save()
      downloadBlob(new Blob([bytes], { type: 'application/pdf' }), 'merged.pdf')
      toast('Merged successfully', 'success')
    } catch {
      toast('Could not merge these files', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Panel>
      <DropZone
        accept="application/pdf"
        multiple
        files={files}
        onChange={setFiles}
        onFiles={(f) => setFiles((prev) => [...prev, ...f])}
        hint={PDF_HINT}
      />
      {files.length > 1 && (
        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-800/50">
          Use the arrows to reorder pages before merging.
          <div className="mt-2 space-y-1">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg bg-white px-2 py-1.5 dark:bg-slate-800">
                <GripVertical className="h-4 w-4 text-slate-300" />
                <span className="flex-1 truncate text-slate-700 dark:text-slate-200">{f.name}</span>
                <button onClick={() => move(i, -1)} className="btn-ghost px-2 py-1" aria-label="Move up">↑</button>
                <button onClick={() => move(i, 1)} className="btn-ghost px-2 py-1" aria-label="Move down">↓</button>
              </div>
            ))}
          </div>
        </div>
      )}
      <button onClick={merge} disabled={busy || files.length < 2} className="btn-primary mt-4">
        {busy ? <Busy>Merging…</Busy> : 'Merge PDFs'}
      </button>
    </Panel>
  )
}

/* ------------------------------- Split PDF ------------------------------ */
export function SplitPdf() {
  const { toast } = useToast()
  const [file, setFile] = useState(null)
  const [range, setRange] = useState('')
  const [busy, setBusy] = useState(false)
  const [pageCount, setPageCount] = useState(0)

  const onFiles = async (f) => {
    setFile(f[0])
    try {
      const doc = await PDFDocument.load(await readArrayBuffer(f[0]), { ignoreEncryption: true })
      setPageCount(doc.getPageCount())
    } catch {
      setPageCount(0)
    }
  }

  // Parse "1-3,5,8-10" into zero-based indices.
  const parseRange = (str, max) => {
    const idx = new Set()
    str.split(',').forEach((part) => {
      const [a, b] = part.trim().split('-').map((n) => parseInt(n, 10))
      if (!a) return
      const end = b || a
      for (let i = a; i <= end; i++) if (i >= 1 && i <= max) idx.add(i - 1)
    })
    return [...idx].sort((x, y) => x - y)
  }

  const split = async () => {
    if (!file) return
    setBusy(true)
    try {
      const src = await PDFDocument.load(await readArrayBuffer(file), { ignoreEncryption: true })
      const indices = range.trim() ? parseRange(range, src.getPageCount()) : src.getPageIndices()
      if (!indices.length) {
        toast('No valid pages in that range', 'error')
        return
      }
      const out = await PDFDocument.create()
      const pages = await out.copyPages(src, indices)
      pages.forEach((p) => out.addPage(p))
      const bytes = await out.save()
      downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `${baseName(file.name)}-pages.pdf`)
      toast(`Extracted ${indices.length} page(s)`, 'success')
    } catch {
      toast('Could not split this PDF', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Panel>
      <DropZone accept="application/pdf" files={file ? [file] : []} onChange={() => setFile(null)} onFiles={onFiles} hint={PDF_HINT} />
      {file && (
        <>
          <p className="mt-4 text-sm text-slate-500">This PDF has {pageCount} page(s).</p>
          <Field label="Pages to extract" hint="e.g. 1-3, 5, 8-10 — leave blank to keep all pages">
            <input className="input" value={range} onChange={(e) => setRange(e.target.value)} placeholder="1-3, 5, 8-10" />
          </Field>
          <button onClick={split} disabled={busy} className="btn-primary mt-4">
            {busy ? <Busy>Extracting…</Busy> : 'Extract pages'}
          </button>
        </>
      )}
    </Panel>
  )
}

/* ------------------------------ Compress PDF ---------------------------- */
export function CompressPdf() {
  const { toast } = useToast()
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)

  const compress = async () => {
    if (!file) return
    setBusy(true)
    try {
      const doc = await PDFDocument.load(await readArrayBuffer(file), { ignoreEncryption: true })
      const bytes = await doc.save({ useObjectStreams: true })
      const blob = new Blob([bytes], { type: 'application/pdf' })
      setResult({ blob, size: blob.size })
      toast('PDF optimized', 'success')
    } catch {
      toast('Could not process this PDF', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Panel>
      <DropZone accept="application/pdf" files={file ? [file] : []} onChange={() => { setFile(null); setResult(null) }} onFiles={(f) => setFile(f[0])} hint={PDF_HINT} />
      {file && (
        <>
          <p className="mt-4 rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
            Optimizes structure with object streams. Savings depend on how the PDF was created.
          </p>
          <button onClick={compress} disabled={busy} className="btn-primary mt-4">
            {busy ? <Busy>Optimizing…</Busy> : 'Compress PDF'}
          </button>
        </>
      )}
      {result && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
          <span className="text-sm">
            <span className="text-slate-500">{formatBytes(file.size)} → </span>
            <span className="font-semibold text-emerald-600">{formatBytes(result.size)}</span>
          </span>
          <DownloadButton onClick={() => downloadBlob(result.blob, `compressed-${file.name}`)} />
        </div>
      )}
    </Panel>
  )
}

/* ------------------------------ Rotate PDF ------------------------------ */
export function RotatePdf() {
  const { toast } = useToast()
  const [file, setFile] = useState(null)
  const [angle, setAngle] = useState(90)
  const [busy, setBusy] = useState(false)

  const rotate = async () => {
    if (!file) return
    setBusy(true)
    try {
      const doc = await PDFDocument.load(await readArrayBuffer(file), { ignoreEncryption: true })
      doc.getPages().forEach((p) => {
        const current = p.getRotation().angle
        p.setRotation(degrees((current + angle) % 360))
      })
      const bytes = await doc.save()
      downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `rotated-${file.name}`)
      toast('PDF rotated', 'success')
    } catch {
      toast('Could not rotate this PDF', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Panel>
      <DropZone accept="application/pdf" files={file ? [file] : []} onChange={() => setFile(null)} onFiles={(f) => setFile(f[0])} hint={PDF_HINT} />
      {file && (
        <>
          <Field label="Rotation">
            <div className="flex flex-wrap gap-2">
              {[90, 180, 270].map((a) => (
                <button key={a} onClick={() => setAngle(a)}
                  className={`rounded-xl border px-4 py-2 text-sm font-medium ${
                    angle === a ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300' : 'border-slate-200 dark:border-slate-700'
                  }`}>
                  {a}°
                </button>
              ))}
            </div>
          </Field>
          <button onClick={rotate} disabled={busy} className="btn-primary mt-4">
            {busy ? <Busy>Rotating…</Busy> : 'Rotate & download'}
          </button>
        </>
      )}
    </Panel>
  )
}

/* ------------------------------ JPG to PDF ------------------------------ */
export function JpgToPdf() {
  const { toast } = useToast()
  const [files, setFiles] = useState([])
  const [busy, setBusy] = useState(false)

  const convert = async () => {
    if (!files.length) return
    setBusy(true)
    try {
      const doc = await PDFDocument.create()
      for (const file of files) {
        const buf = await readArrayBuffer(file)
        const img = file.type.includes('png') ? await doc.embedPng(buf) : await doc.embedJpg(buf)
        const page = doc.addPage([img.width, img.height])
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height })
      }
      const bytes = await doc.save()
      downloadBlob(new Blob([bytes], { type: 'application/pdf' }), 'images.pdf')
      toast('PDF created', 'success')
    } catch {
      toast('Could not convert these images', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Panel>
      <DropZone accept="image/jpeg,image/png" multiple files={files} onChange={setFiles}
        onFiles={(f) => setFiles((prev) => [...prev, ...f])} hint="JPG or PNG images" />
      <button onClick={convert} disabled={busy || !files.length} className="btn-primary mt-4">
        {busy ? <Busy>Building PDF…</Busy> : 'Convert to PDF'}
      </button>
    </Panel>
  )
}

/* ----------------------------- Watermark PDF ---------------------------- */
export function WatermarkPdf() {
  const { toast } = useToast()
  const [file, setFile] = useState(null)
  const [text, setText] = useState('CONFIDENTIAL')
  const [busy, setBusy] = useState(false)

  const apply = async () => {
    if (!file) return
    setBusy(true)
    try {
      const doc = await PDFDocument.load(await readArrayBuffer(file), { ignoreEncryption: true })
      const font = await doc.embedFont(StandardFonts.HelveticaBold)
      doc.getPages().forEach((page) => {
        const { width, height } = page.getSize()
        const size = Math.min(width, height) / 8
        page.drawText(text, {
          x: width / 2 - (text.length * size) / 4,
          y: height / 2,
          size,
          font,
          color: rgb(0.5, 0.5, 0.5),
          opacity: 0.3,
          rotate: degrees(45),
        })
      })
      const bytes = await doc.save()
      downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `watermarked-${file.name}`)
      toast('Watermark added', 'success')
    } catch {
      toast('Could not watermark this PDF', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Panel>
      <DropZone accept="application/pdf" files={file ? [file] : []} onChange={() => setFile(null)} onFiles={(f) => setFile(f[0])} hint={PDF_HINT} />
      {file && (
        <>
          <Field label="Watermark text">
            <input className="input" value={text} onChange={(e) => setText(e.target.value)} />
          </Field>
          <button onClick={apply} disabled={busy} className="btn-primary mt-4">
            {busy ? <Busy>Stamping…</Busy> : 'Add watermark'}
          </button>
        </>
      )}
    </Panel>
  )
}

/* ---------------------------- Page Numbers PDF -------------------------- */
export function PageNumbersPdf() {
  const { toast } = useToast()
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [position, setPosition] = useState('bottom-center')

  const apply = async () => {
    if (!file) return
    setBusy(true)
    try {
      const doc = await PDFDocument.load(await readArrayBuffer(file), { ignoreEncryption: true })
      const font = await doc.embedFont(StandardFonts.Helvetica)
      const pages = doc.getPages()
      pages.forEach((page, i) => {
        const { width } = page.getSize()
        const label = `${i + 1} / ${pages.length}`
        const size = 11
        const textWidth = font.widthOfTextAtSize(label, size)
        let x = (width - textWidth) / 2
        if (position.includes('left')) x = 30
        if (position.includes('right')) x = width - textWidth - 30
        page.drawText(label, { x, y: 24, size, font, color: rgb(0.3, 0.3, 0.3) })
      })
      const bytes = await doc.save()
      downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `numbered-${file.name}`)
      toast('Page numbers added', 'success')
    } catch {
      toast('Could not add page numbers', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Panel>
      <DropZone accept="application/pdf" files={file ? [file] : []} onChange={() => setFile(null)} onFiles={(f) => setFile(f[0])} hint={PDF_HINT} />
      {file && (
        <>
          <Field label="Position">
            <div className="flex flex-wrap gap-2">
              {['bottom-left', 'bottom-center', 'bottom-right'].map((p) => (
                <button key={p} onClick={() => setPosition(p)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize ${
                    position === p ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300' : 'border-slate-200 dark:border-slate-700'
                  }`}>
                  {p.replace('-', ' ')}
                </button>
              ))}
            </div>
          </Field>
          <button onClick={apply} disabled={busy} className="btn-primary mt-4">
            {busy ? <Busy>Numbering…</Busy> : 'Add page numbers'}
          </button>
        </>
      )}
    </Panel>
  )
}

/* ------------------------------ PDF to JPG ------------------------------ */
export function PdfToJpg() {
  const { toast } = useToast()
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [pages, setPages] = useState([])

  const render = async (f) => {
    setFile(f[0])
    setPages([])
    setBusy(true)
    try {
      const data = new Uint8Array(await readArrayBuffer(f[0]))
      const pdf = await pdfjsLib.getDocument({ data }).promise
      const out = []
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 2 })
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width
        canvas.height = viewport.height
        await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise
        out.push({ num: i, url: canvas.toDataURL('image/jpeg', 0.92) })
      }
      setPages(out)
    } catch {
      toast('Could not render this PDF', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Panel>
      <DropZone accept="application/pdf" files={file ? [file] : []} onChange={() => { setFile(null); setPages([]) }} onFiles={render} hint={PDF_HINT} />
      {busy && (
        <p className="mt-4 flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Rendering pages…</p>
      )}
      {pages.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((p) => (
            <div key={p.num} className="card overflow-hidden p-2">
              <img src={p.url} alt={`Page ${p.num}`} className="w-full rounded-lg" />
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-xs text-slate-400">Page {p.num}</span>
                <button
                  onClick={() => downloadBlob(dataUrlToBlob(p.url), `${baseName(file.name)}-page-${p.num}.jpg`)}
                  className="btn-secondary px-3 py-1 text-xs"
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  )
}

function dataUrlToBlob(dataUrl) {
  const [meta, b64] = dataUrl.split(',')
  const mime = meta.match(/:(.*?);/)[1]
  const bin = atob(b64)
  const arr = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i)
  return new Blob([arr], { type: mime })
}

/* ------------------------------ PDF to Word ----------------------------- */
// Extracts text from the PDF and exports a Word-openable .doc (HTML) file.
export function PdfToWord() {
  const { toast } = useToast()
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [text, setText] = useState('')

  const extract = async (f) => {
    setFile(f[0])
    setText('')
    setBusy(true)
    try {
      const data = new Uint8Array(await readArrayBuffer(f[0]))
      const pdf = await pdfjsLib.getDocument({ data }).promise
      let full = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        full += content.items.map((it) => it.str).join(' ') + '\n\n'
      }
      setText(full.trim())
      if (!full.trim()) toast('No selectable text found (the PDF may be scanned)', 'info')
    } catch {
      toast('Could not read this PDF', 'error')
    } finally {
      setBusy(false)
    }
  }

  const downloadDoc = () => {
    const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'><head><meta charset='utf-8'></head><body><pre style="font-family:Calibri,sans-serif;white-space:pre-wrap;">${text.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</pre></body></html>`
    downloadBlob(new Blob([html], { type: 'application/msword' }), `${baseName(file.name)}.doc`)
  }

  return (
    <Panel>
      <DropZone accept="application/pdf" files={file ? [file] : []} onChange={() => { setFile(null); setText('') }} onFiles={extract} hint={PDF_HINT} />
      {busy && <p className="mt-4 flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Extracting text…</p>}
      {text && (
        <>
          <Field label="Extracted text (editable)">
            <textarea className="input mt-1 min-h-[240px] resize-y scroll-thin" value={text} onChange={(e) => setText(e.target.value)} />
          </Field>
          <button onClick={downloadDoc} className="btn-primary mt-4">Download as Word (.doc)</button>
        </>
      )}
    </Panel>
  )
}

/* ------------------------------ Word to PDF ----------------------------- */
// Accepts pasted text or a .txt file and generates a clean PDF.
export function WordToPdf() {
  const { toast } = useToast()
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)

  const onFiles = async (f) => {
    const file = f[0]
    if (file.type.includes('text') || file.name.endsWith('.txt')) {
      setText(await file.text())
    } else {
      toast('Please paste text, or upload a .txt file. (DOCX parsing isn’t supported in-browser.)', 'info', 6000)
    }
  }

  const generate = async () => {
    if (!text.trim()) return
    setBusy(true)
    try {
      const doc = await PDFDocument.create()
      const font = await doc.embedFont(StandardFonts.Helvetica)
      const fontSize = 12
      const margin = 50
      const lineHeight = fontSize * 1.5
      let page = doc.addPage()
      let { width, height } = page.getSize()
      let y = height - margin
      const maxWidth = width - margin * 2

      const wrap = (line) => {
        const words = line.split(' ')
        const lines = []
        let current = ''
        words.forEach((word) => {
          const test = current ? `${current} ${word}` : word
          if (font.widthOfTextAtSize(test, fontSize) > maxWidth) {
            if (current) lines.push(current)
            current = word
          } else current = test
        })
        if (current) lines.push(current)
        return lines.length ? lines : ['']
      }

      for (const rawLine of text.split('\n')) {
        for (const line of wrap(rawLine)) {
          if (y < margin) {
            page = doc.addPage()
            ;({ width, height } = page.getSize())
            y = height - margin
          }
          page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) })
          y -= lineHeight
        }
      }
      const bytes = await doc.save()
      downloadBlob(new Blob([bytes], { type: 'application/pdf' }), 'document.pdf')
      toast('PDF created', 'success')
    } catch {
      toast('Could not generate the PDF', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Panel>
      <DropZone accept=".txt,text/plain" onFiles={onFiles} onChange={() => {}} hint="Upload a .txt file, or just type below" />
      <Field label="Document text">
        <textarea className="input mt-1 min-h-[220px] resize-y" value={text} onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste the text for your PDF…" />
      </Field>
      <button onClick={generate} disabled={busy || !text.trim()} className="btn-primary mt-4">
        {busy ? <Busy>Generating…</Busy> : 'Create PDF'}
      </button>
    </Panel>
  )
}

/* -------------------- Protect / Unlock (server-only) -------------------- */
function ServerOnly({ title }) {
  return (
    <Panel className="text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/40">
        <Server className="h-7 w-7" />
      </span>
      <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">{title} needs secure processing</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
        PDF password encryption can’t be done safely in the browser, so this tool runs on a secure
        server that deletes your file immediately after processing. That backend isn’t enabled in
        this demo build — everything else here works fully client-side and privately.
      </p>
    </Panel>
  )
}
export function ProtectPdf() {
  return <ServerOnly title="Protect PDF" />
}
export function UnlockPdf() {
  return <ServerOnly title="Unlock PDF" />
}
