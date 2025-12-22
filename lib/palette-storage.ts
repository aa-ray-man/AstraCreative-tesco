import type { GeneratedPalette } from "@/types/color-palette"

const STORAGE_KEY = "astracreative-saved-palettes"

export function getSavedPalettes(): GeneratedPalette[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function savePalette(palette: GeneratedPalette): void {
  const saved = getSavedPalettes()

  // Check if already saved
  if (saved.some((p) => p.id === palette.id)) {
    return
  }

  saved.push(palette)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
}

export function removePalette(paletteId: string): void {
  const saved = getSavedPalettes()
  const filtered = saved.filter((p) => p.id !== paletteId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}
