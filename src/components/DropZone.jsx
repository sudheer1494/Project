import { useRef, useState } from 'react'
import { UploadCloud, FileIcon, X } from 'lucide-react'
import { formatBytes } from '../lib/files.js'

/**
 * Drag-and-drop + click file picker.
 * @param {string} accept   - input accept string, e.g. "application/pdf" or "image/*"
 * @param {boolean} multiple
 * @param {(files: File[]) => void} onFiles
 * @param {File[]} files     - currently selected files (controlled)
 * @param {(files: File[]) => void} onChange - replace the whole list (for removals/reorder)
 */
export default function DropZone({
  accept,
  multiple = false,
  onFiles,
  files = [],
  onChange,
  hint,
}) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFiles = (fileList) => {
    const arr = Array.from(fileList)
    if (arr.length) onFiles(arr)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files)
  }

  const removeAt = (idx) => {
    onChange?.(files.filter((_, i) => i !== idx))
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition ${
          dragOver
            ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30'
            : 'border-slate-300 bg-slate-50 hover:border-brand-400 hover:bg-brand-50/50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-brand-700'
        }`}
      >
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-100 text-brand-600 dark:bg-brand-950/60">
          <UploadCloud className="h-7 w-7" />
        </span>
        <p className="mt-4 font-semibold text-slate-800 dark:text-slate-100">
          Drag &amp; drop {multiple ? 'files' : 'a file'} here
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          or <span className="font-medium text-brand-600">browse</span> from your device
        </p>
        {hint && <p className="mt-2 text-xs text-slate-400">{hint}</p>}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((file, idx) => (
            <li
              key={`${file.name}-${idx}`}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-700">
                <FileIcon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                  {file.name}
                </p>
                <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
              </div>
              {onChange && (
                <button
                  onClick={() => removeAt(idx)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-500 dark:hover:bg-slate-700"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
