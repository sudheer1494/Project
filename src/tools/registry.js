import {
  Combine,
  Scissors,
  Minimize2,
  FileText,
  FileType2,
  FileImage,
  Images,
  RotateCw,
  Lock,
  Unlock,
  Stamp,
  Hash,
  Image as ImageIcon,
  Maximize,
  Crop,
  Replace,
  Eraser,
  Type,
  FlipHorizontal2,
  Binary,
  CaseSensitive,
  Pipette,
  QrCode,
  Link2,
  FileCode2,
  KeyRound,
  Braces,
  Code2,
  Pilcrow,
} from 'lucide-react'
import { CATALOG, CATEGORY_LABELS } from './catalog.js'

// Resolve the catalog's string icon names to lucide-react components.
const ICONS = {
  Combine, Scissors, Minimize2, FileText, FileType2, FileImage, Images, RotateCw,
  Lock, Unlock, Stamp, Hash, Maximize, Crop, Replace, Eraser, Type,
  FlipHorizontal2, Binary, CaseSensitive, Pipette, QrCode, Link2, FileCode2,
  KeyRound, Braces, Code2, Pilcrow,
}

export { CATEGORY_LABELS }

export const CATEGORIES = [
  { id: 'all', label: 'All', icon: null },
  { id: 'pdf', label: 'PDF Tools', icon: FileText },
  { id: 'image', label: 'Image Tools', icon: ImageIcon },
  { id: 'utility', label: 'Utilities', icon: Braces },
]

// Full tool list with icon components resolved from the plain catalog.
export const TOOLS = CATALOG.map((tool) => ({ ...tool, icon: ICONS[tool.icon] }))

export const getToolBySlug = (slug) => TOOLS.find((t) => t.slug === slug)

export const getToolsByCategory = (category) =>
  category === 'all' ? TOOLS : TOOLS.filter((t) => t.category === category)

// Return up to `count` related tools from the same category (excluding current).
export function getRelatedTools(slug, count = 4) {
  const tool = getToolBySlug(slug)
  if (!tool) return []
  const sameCategory = TOOLS.filter((t) => t.category === tool.category && t.slug !== slug)
  if (sameCategory.length >= count) return sameCategory.slice(0, count)
  const others = TOOLS.filter((t) => t.category !== tool.category).slice(0, count - sameCategory.length)
  return [...sameCategory, ...others]
}
