export type CanvasFormat = "1:1" | "9:16" | "1.91:1"

export interface FormatDimensions {
  width: number
  height: number
  label: string
  aspectRatio: string
}

export const CANVAS_FORMATS: Record<CanvasFormat, FormatDimensions> = {
  "1:1": {
    width: 1080,
    height: 1080,
    label: "Square",
    aspectRatio: "1:1",
  },
  "9:16": {
    width: 1080,
    height: 1920,
    label: "Story",
    aspectRatio: "9:16",
  },
  "1.91:1": {
    width: 1200,
    height: 628,
    label: "Landscape",
    aspectRatio: "1.91:1",
  },
}

export interface SafeZone {
  top: number
  bottom: number
}

export const SAFE_ZONES: Record<CanvasFormat, SafeZone | null> = {
  "1:1": null,
  "9:16": {
    top: 200,
    bottom: 250,
  },
  "1.91:1": null,
}
