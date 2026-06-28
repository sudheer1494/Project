import { useState } from 'react'
import { Heart } from 'lucide-react'
import { isFavorite, toggleFavorite } from '../lib/storage.js'

export default function FavoriteButton({ slug, className = '' }) {
  const [fav, setFav] = useState(() => isFavorite(slug))

  const handle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(slug)
    setFav((f) => !f)
  }

  return (
    <button
      onClick={handle}
      aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={fav}
      className={`rounded-lg p-1.5 text-slate-300 transition hover:bg-slate-100 hover:text-rose-500 dark:hover:bg-slate-800 ${
        fav ? 'text-rose-500' : ''
      } ${className}`}
    >
      <Heart className={`h-5 w-5 ${fav ? 'fill-current' : ''}`} />
    </button>
  )
}
