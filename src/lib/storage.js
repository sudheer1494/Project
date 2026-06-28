// localStorage helpers for "recently used" and "favorites" tools.

const RECENT_KEY = 'toolsbase-recent'
const FAV_KEY = 'toolsbase-favorites'
const MAX_RECENT = 8

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage full or unavailable — ignore */
  }
}

export function getRecent() {
  return read(RECENT_KEY, [])
}

export function pushRecent(slug) {
  const list = read(RECENT_KEY, []).filter((s) => s !== slug)
  list.unshift(slug)
  write(RECENT_KEY, list.slice(0, MAX_RECENT))
}

export function getFavorites() {
  return read(FAV_KEY, [])
}

export function isFavorite(slug) {
  return read(FAV_KEY, []).includes(slug)
}

export function toggleFavorite(slug) {
  const list = read(FAV_KEY, [])
  const next = list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug]
  write(FAV_KEY, next)
  return next
}
