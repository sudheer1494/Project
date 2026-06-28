import { useEffect, useRef, useState, useCallback } from 'react'
import imageCompression from 'browser-image-compression'
import { Loader2 } from 'lucide-react'
import DropZone from '../../components/DropZone.jsx'
import { CopyButton, DownloadButton, Field } from '../../components/ui.jsx'
import { downloadBlob, downloadDataUrl, formatBytes, loadImage, readFileAsDataURL, baseName } from '../../lib/files.js'
import { useToast } from '../../context/ToastContext.jsx'

const Panel = ({ children, className = '' }) => <div className={`card p-6 ${className}`}>{children}</div>

// Hook: manage a single uploaded image (File + dataURL + HTMLImageElement).
function useSingleImage() {
  const [file, setFile] = useState(null)
  const [src, setSrc] = useState('')
  const [img, setImg] = useState(null)

  const onFiles = useCallback(async (files) => {
    const f = files[0]
    if (!f) return
    const dataUrl = await readFileAsDataURL(f)
    const image = await loadImage(dataUrl)
    setFile(f)
    setSrc(dataUrl)
    setImg(image)
  }, [])

  const reset = () => {
    setFile(null)
    setSrc('')
    setImg(null)
  }

  return { file, src, img, onFiles, reset }
}

const HINT = 'PNG, JPG, WebP or GIF'

/* ---------------------------- Compress Image ---------------------------- */
export function CompressImage() {
  const { toast } = useToast()
  const { file, onFiles, reset } = useSingleImage()
  const [quality, setQuality] = useState(0.7)
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)

  const run = async () => {
    if (!file) return
    setBusy(true)
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 10,
        initialQuality: quality,
        useWebWorker: true,
        maxWidthOrHeight: 4096,
      })
      setResult({ blob: compressed, url: URL.createObjectURL(compressed), size: compressed.size })
    } catch {
      toast('Could not compress this image', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Panel>
      <DropZone accept="image/*" onFiles={onFiles} files={file ? [file] : []} onChange={reset} hint={HINT} />
      {file && (
        <>
          <div className="mt-5">
            <Field label={`Quality: ${Math.round(quality * 100)}%`}>
              <input type="range" min="0.1" max="1" step="0.05" value={quality}
                onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-brand-600" />
            </Field>
          </div>
          <button onClick={run} disabled={busy} className="btn-primary mt-4">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Compress image
          </button>
        </>
      )}
      {result && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm">
              <span className="text-slate-500">Original {formatBytes(file.size)} → </span>
              <span className="font-semibold text-emerald-600">{formatBytes(result.size)}</span>
              <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                −{Math.max(0, Math.round((1 - result.size / file.size) * 100))}%
              </span>
            </div>
            <DownloadButton onClick={() => downloadBlob(result.blob, `compressed-${file.name}`)} />
          </div>
          <img src={result.url} alt="Compressed preview" className="mt-4 max-h-72 rounded-xl" />
        </div>
      )}
    </Panel>
  )
}

/* ----------------------------- Resize Image ----------------------------- */
export function ResizeImage() {
  const { file, img, onFiles, reset } = useSingleImage()
  const [w, setW] = useState('')
  const [h, setH] = useState('')
  const [lock, setLock] = useState(true)

  useEffect(() => {
    if (img) {
      setW(img.naturalWidth)
      setH(img.naturalHeight)
    }
  }, [img])

  const ratio = img ? img.naturalWidth / img.naturalHeight : 1
  const onW = (val) => {
    setW(val)
    if (lock && val) setH(Math.round(Number(val) / ratio))
  }
  const onH = (val) => {
    setH(val)
    if (lock && val) setW(Math.round(Number(val) * ratio))
  }

  const download = () => {
    const canvas = document.createElement('canvas')
    canvas.width = Number(w)
    canvas.height = Number(h)
    canvas.getContext('2d').drawImage(img, 0, 0, Number(w), Number(h))
    canvas.toBlob((blob) => downloadBlob(blob, `resized-${baseName(file.name)}.png`), 'image/png')
  }

  return (
    <Panel>
      <DropZone accept="image/*" onFiles={onFiles} files={file ? [file] : []} onChange={reset} hint={HINT} />
      {img && (
        <>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Width (px)">
              <input type="number" className="input" value={w} onChange={(e) => onW(e.target.value)} />
            </Field>
            <Field label="Height (px)">
              <input type="number" className="input" value={h} onChange={(e) => onH(e.target.value)} />
            </Field>
          </div>
          <label className="mt-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <input type="checkbox" checked={lock} onChange={(e) => setLock(e.target.checked)} className="h-4 w-4 accent-brand-600" />
            Lock aspect ratio
          </label>
          <button onClick={download} disabled={!w || !h} className="btn-primary mt-4">Resize &amp; download</button>
          <p className="mt-3 text-xs text-slate-400">Original size: {img.naturalWidth} × {img.naturalHeight}px</p>
        </>
      )}
    </Panel>
  )
}

/* ------------------------------ Crop Image ------------------------------ */
export function CropImage() {
  const { file, img, src, onFiles, reset } = useSingleImage()
  const containerRef = useRef(null)
  const [rect, setRect] = useState(null) // in displayed px
  const [drag, setDrag] = useState(null)

  useEffect(() => {
    setRect(null)
  }, [src])

  const onPointerDown = (e) => {
    const bounds = containerRef.current.getBoundingClientRect()
    const x = e.clientX - bounds.left
    const y = e.clientY - bounds.top
    setDrag({ startX: x, startY: y })
    setRect({ x, y, w: 0, h: 0 })
  }
  const onPointerMove = (e) => {
    if (!drag) return
    const bounds = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - bounds.left, bounds.width))
    const y = Math.max(0, Math.min(e.clientY - bounds.top, bounds.height))
    setRect({
      x: Math.min(drag.startX, x),
      y: Math.min(drag.startY, y),
      w: Math.abs(x - drag.startX),
      h: Math.abs(y - drag.startY),
    })
  }
  const onPointerUp = () => setDrag(null)

  const crop = () => {
    if (!rect || rect.w < 5 || rect.h < 5) return
    const bounds = containerRef.current.getBoundingClientRect()
    const scale = img.naturalWidth / bounds.width
    const sx = rect.x * scale
    const sy = rect.y * scale
    const sw = rect.w * scale
    const sh = rect.h * scale
    const canvas = document.createElement('canvas')
    canvas.width = sw
    canvas.height = sh
    canvas.getContext('2d').drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh)
    canvas.toBlob((blob) => downloadBlob(blob, `cropped-${baseName(file.name)}.png`), 'image/png')
  }

  return (
    <Panel>
      <DropZone accept="image/*" onFiles={onFiles} files={file ? [file] : []} onChange={reset} hint={HINT} />
      {src && (
        <>
          <p className="mt-5 text-sm text-slate-500">Drag on the image to select the crop area.</p>
          <div
            ref={containerRef}
            className="relative mt-3 inline-block max-w-full cursor-crosshair select-none overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            <img src={src} alt="Crop source" className="block max-h-[480px] w-auto select-none" draggable={false} />
            {rect && (
              <div
                className="absolute border-2 border-brand-500 bg-brand-500/20"
                style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h }}
              />
            )}
          </div>
          <div className="mt-4">
            <button onClick={crop} disabled={!rect || rect.w < 5} className="btn-primary">Crop &amp; download</button>
          </div>
        </>
      )}
    </Panel>
  )
}

/* ----------------------------- Convert Image ---------------------------- */
export function ConvertImage() {
  const { file, img, onFiles, reset } = useSingleImage()
  const [format, setFormat] = useState('image/png')
  const formats = [
    { mime: 'image/png', label: 'PNG', ext: 'png' },
    { mime: 'image/jpeg', label: 'JPG', ext: 'jpg' },
    { mime: 'image/webp', label: 'WebP', ext: 'webp' },
  ]

  const convert = () => {
    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')
    if (format === 'image/jpeg') {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    ctx.drawImage(img, 0, 0)
    const ext = formats.find((f) => f.mime === format).ext
    canvas.toBlob((blob) => downloadBlob(blob, `${baseName(file.name)}.${ext}`), format, 0.92)
  }

  return (
    <Panel>
      <DropZone accept="image/*" onFiles={onFiles} files={file ? [file] : []} onChange={reset} hint={HINT} />
      {img && (
        <>
          <Field label="Convert to" >
            <div className="mt-1 flex flex-wrap gap-2">
              {formats.map((f) => (
                <button
                  key={f.mime}
                  onClick={() => setFormat(f.mime)}
                  className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                    format === f.mime
                      ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </Field>
          <button onClick={convert} className="btn-primary mt-4">Convert &amp; download</button>
        </>
      )}
    </Panel>
  )
}

/* --------------------------- Remove Background -------------------------- */
// Heuristic chroma-key: makes pixels close to the sampled corner color transparent.
export function RemoveBackground() {
  const { file, img, onFiles, reset } = useSingleImage()
  const [tolerance, setTolerance] = useState(40)
  const [result, setResult] = useState('')
  const [busy, setBusy] = useState(false)

  const run = () => {
    setBusy(true)
    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const px = data.data
    // Average the four corners as the background reference color.
    const corners = [0, (canvas.width - 1) * 4, (canvas.height - 1) * canvas.width * 4, (px.length - 4)]
    let r = 0, g = 0, b = 0
    corners.forEach((c) => { r += px[c]; g += px[c + 1]; b += px[c + 2] })
    r /= 4; g /= 4; b /= 4
    const tol = (tolerance / 100) * 441 // max euclidean distance in RGB
    for (let i = 0; i < px.length; i += 4) {
      const dist = Math.sqrt((px[i] - r) ** 2 + (px[i + 1] - g) ** 2 + (px[i + 2] - b) ** 2)
      if (dist < tol) px[i + 3] = 0
    }
    ctx.putImageData(data, 0, 0)
    setResult(canvas.toDataURL('image/png'))
    setBusy(false)
  }

  return (
    <Panel>
      <DropZone accept="image/*" onFiles={onFiles} files={file ? [file] : []} onChange={reset} hint={HINT} />
      {img && (
        <>
          <p className="mt-4 rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
            Works best on images with a solid, evenly-lit background.
          </p>
          <div className="mt-4">
            <Field label={`Tolerance: ${tolerance}%`}>
              <input type="range" min="5" max="80" value={tolerance}
                onChange={(e) => setTolerance(Number(e.target.value))} className="w-full accent-brand-600" />
            </Field>
          </div>
          <button onClick={run} disabled={busy} className="btn-primary mt-4">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Remove background
          </button>
        </>
      )}
      {result && (
        <div className="mt-6">
          <div
            className="inline-block rounded-xl p-2"
            style={{
              backgroundImage:
                'linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0,0 10px,10px -10px,-10px 0',
            }}
          >
            <img src={result} alt="Background removed" className="max-h-72" />
          </div>
          <div className="mt-3">
            <DownloadButton onClick={() => downloadDataUrl(result, `no-bg-${baseName(file.name)}.png`)} />
          </div>
        </div>
      )}
    </Panel>
  )
}

/* ---------------------------- Watermark Image --------------------------- */
export function WatermarkImage() {
  const { file, img, onFiles, reset } = useSingleImage()
  const [text, setText] = useState('© ToolsBase')
  const [opacity, setOpacity] = useState(0.5)
  const [position, setPosition] = useState('bottom-right')

  const positions = ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right']

  const apply = () => {
    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    const fontSize = Math.max(18, Math.round(canvas.width / 20))
    ctx.font = `bold ${fontSize}px Inter, sans-serif`
    ctx.fillStyle = `rgba(255,255,255,${opacity})`
    ctx.strokeStyle = `rgba(0,0,0,${opacity * 0.6})`
    ctx.lineWidth = Math.max(1, fontSize / 16)
    const m = ctx.measureText(text)
    const pad = fontSize * 0.6
    let x = pad, y = fontSize + pad
    if (position.includes('right')) x = canvas.width - m.width - pad
    if (position.includes('bottom')) y = canvas.height - pad
    if (position === 'center') {
      x = (canvas.width - m.width) / 2
      y = canvas.height / 2
    }
    ctx.strokeText(text, x, y)
    ctx.fillText(text, x, y)
    canvas.toBlob((blob) => downloadBlob(blob, `watermarked-${baseName(file.name)}.png`), 'image/png')
  }

  return (
    <Panel>
      <DropZone accept="image/*" onFiles={onFiles} files={file ? [file] : []} onChange={reset} hint={HINT} />
      {img && (
        <>
          <div className="mt-5 space-y-4">
            <Field label="Watermark text">
              <input className="input" value={text} onChange={(e) => setText(e.target.value)} />
            </Field>
            <Field label={`Opacity: ${Math.round(opacity * 100)}%`}>
              <input type="range" min="0.1" max="1" step="0.05" value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))} className="w-full accent-brand-600" />
            </Field>
            <Field label="Position">
              <div className="flex flex-wrap gap-2">
                {positions.map((p) => (
                  <button key={p} onClick={() => setPosition(p)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize ${
                      position === p ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300' : 'border-slate-200 dark:border-slate-700'
                    }`}>
                    {p.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </Field>
          </div>
          <button onClick={apply} className="btn-primary mt-4">Apply &amp; download</button>
        </>
      )}
    </Panel>
  )
}

/* --------------------------- Rotate / Flip Image ------------------------ */
export function RotateFlipImage() {
  const { file, img, src, onFiles, reset } = useSingleImage()
  const [rotation, setRotation] = useState(0)
  const [flipH, setFlipH] = useState(false)
  const [flipV, setFlipV] = useState(false)

  useEffect(() => {
    setRotation(0); setFlipH(false); setFlipV(false)
  }, [src])

  const download = () => {
    const rad = (rotation * Math.PI) / 180
    const swap = rotation % 180 !== 0
    const canvas = document.createElement('canvas')
    canvas.width = swap ? img.naturalHeight : img.naturalWidth
    canvas.height = swap ? img.naturalWidth : img.naturalHeight
    const ctx = canvas.getContext('2d')
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate(rad)
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1)
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2)
    canvas.toBlob((blob) => downloadBlob(blob, `transformed-${baseName(file.name)}.png`), 'image/png')
  }

  return (
    <Panel>
      <DropZone accept="image/*" onFiles={onFiles} files={file ? [file] : []} onChange={reset} hint={HINT} />
      {src && (
        <>
          <div className="mt-5 flex justify-center rounded-xl bg-slate-50 p-6 dark:bg-slate-800/50">
            <img
              src={src}
              alt="Transform preview"
              className="max-h-72 transition-transform"
              style={{ transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})` }}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={() => setRotation((r) => (r + 90) % 360)} className="btn-secondary">Rotate 90°</button>
            <button onClick={() => setRotation((r) => (r + 270) % 360)} className="btn-secondary">Rotate -90°</button>
            <button onClick={() => setFlipH((f) => !f)} className="btn-secondary">Flip horizontal</button>
            <button onClick={() => setFlipV((f) => !f)} className="btn-secondary">Flip vertical</button>
          </div>
          <button onClick={download} className="btn-primary mt-4">Download result</button>
        </>
      )}
    </Panel>
  )
}

/* ---------------------------- Image to Base64 --------------------------- */
export function ImageToBase64() {
  const { file, src, onFiles, reset } = useSingleImage()
  return (
    <Panel>
      <DropZone accept="image/*" onFiles={onFiles} files={file ? [file] : []} onChange={reset} hint={HINT} />
      {src && (
        <>
          <div className="mt-5 flex items-center gap-4">
            <img src={src} alt="Source" className="h-20 w-20 rounded-xl border border-slate-200 object-cover dark:border-slate-700" />
            <p className="text-sm text-slate-500">{file.name} · {formatBytes(src.length)} as Base64</p>
          </div>
          <Field label="Base64 data URI">
            <textarea readOnly value={src} spellCheck={false}
              className="input mt-1 min-h-[160px] resize-y break-all font-mono text-xs scroll-thin bg-slate-50 dark:bg-slate-800/50" />
          </Field>
          <div className="mt-3 flex gap-2">
            <CopyButton text={src} label="Copy data URI" />
            <CopyButton text={`<img src="${src}" alt="" />`} label="Copy <img> tag" />
          </div>
        </>
      )}
    </Panel>
  )
}
