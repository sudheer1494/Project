import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from './AuthContext.jsx'
import {
  getFavorites as getLocalFavorites,
  toggleFavorite as toggleLocalFavorite,
} from '../lib/storage.js'

const FavoritesContext = createContext({
  favorites: [],
  isFavorite: () => false,
  toggleFavorite: () => {},
})

export function FavoritesProvider({ children }) {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState([])

  // Load favorites from Supabase (when signed in) or localStorage.
  useEffect(() => {
    let active = true
    async function load() {
      if (user) {
        const { data } = await supabase.from('favorites').select('tool_slug')
        if (!active) return
        const remote = (data || []).map((r) => r.tool_slug)
        // Merge any local favorites into the account on first sign-in.
        const local = getLocalFavorites()
        const missing = local.filter((s) => !remote.includes(s))
        if (missing.length) {
          await supabase
            .from('favorites')
            .insert(missing.map((tool_slug) => ({ tool_slug, user_id: user.id })))
        }
        if (active) setFavorites([...new Set([...remote, ...local])])
      } else {
        setFavorites(getLocalFavorites())
      }
    }
    load()
    return () => {
      active = false
    }
  }, [user])

  const isFavorite = useCallback((slug) => favorites.includes(slug), [favorites])

  const toggleFavorite = useCallback(
    async (slug) => {
      const has = favorites.includes(slug)
      // Optimistic UI update
      setFavorites((prev) => (has ? prev.filter((s) => s !== slug) : [...prev, slug]))
      if (user) {
        if (has) {
          await supabase.from('favorites').delete().eq('user_id', user.id).eq('tool_slug', slug)
        } else {
          await supabase.from('favorites').insert({ user_id: user.id, tool_slug: slug })
        }
      } else {
        toggleLocalFavorite(slug)
      }
    },
    [favorites, user],
  )

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => useContext(FavoritesContext)
