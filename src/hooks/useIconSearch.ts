import { useMemo } from 'react'
import type { Icon } from '../types'

export function useIconSearch(
  icons: Icon[],
  query: string,
  selectedCategory: string,
): Icon[] {
  return useMemo(() => {
    const q = query.toLowerCase().trim()
    return icons.filter((icon) => {
      const categoryMatch =
        selectedCategory === 'All' || icon.category === selectedCategory
      if (!categoryMatch) return false
      if (!q) return true
      return (
        icon.name.toLowerCase().includes(q) ||
        icon.tags.some((tag) => tag.toLowerCase().includes(q))
      )
    })
  }, [icons, query, selectedCategory])
}
