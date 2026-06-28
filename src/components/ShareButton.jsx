import { Share2 } from 'lucide-react'
import { useToast } from '../context/ToastContext.jsx'
import { copyToClipboard } from '../lib/files.js'

export default function ShareButton({ title }) {
  const { toast } = useToast()

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch {
        /* user cancelled or unsupported — fall back to copy */
      }
    }
    const ok = await copyToClipboard(url)
    toast(ok ? 'Link copied to clipboard' : 'Could not copy link', ok ? 'success' : 'error')
  }

  return (
    <button onClick={handleShare} className="btn-secondary" type="button">
      <Share2 className="h-4 w-4" />
      Share
    </button>
  )
}
