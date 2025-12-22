import type * as fabric from "fabric"
import { CANVAS_FORMATS, type CanvasFormat } from "@/types/canvas-format"
import { scaleAllObjects, resizeCanvas } from "@/utils/canvas-scaling"
import { removeSafeZoneOverlays, addSafeZoneOverlays } from "@/utils/safe-zones"

export interface ExportResult {
  format: CanvasFormat
  dataUrl: string
  filename: string
  width: number
  height: number
}

interface ObjectState {
  left: number
  top: number
  scaleX: number
  scaleY: number
}

/**
 * Export canvas in a specific format
 */
async function exportFormat(
  canvas: fabric.Canvas,
  format: CanvasFormat,
  fileFormat: "png" | "jpeg",
  quality = 0.9,
): Promise<ExportResult> {
  const dimensions = CANVAS_FORMATS[format]

  // Remove selection
  canvas.discardActiveObject()

  // Remove safe zone overlays before export
  removeSafeZoneOverlays(canvas)

  // Wait for render
  canvas.requestRenderAll()
  await new Promise((resolve) => setTimeout(resolve, 100))

  // Export to data URL
  const dataUrl = canvas.toDataURL({
    format: fileFormat,
    quality: fileFormat === "jpeg" ? quality : 1,
    multiplier: 1,
  })

  const filename = `creative_${dimensions.width}x${dimensions.height}.${fileFormat}`

  return {
    format,
    dataUrl,
    filename,
    width: dimensions.width,
    height: dimensions.height,
  }
}

/**
 * Export all formats at once
 */
export async function exportAllFormats(
  canvas: fabric.Canvas,
  currentFormat: CanvasFormat,
  fileFormat: "png" | "jpeg" = "png",
): Promise<ExportResult[]> {
  const formats: CanvasFormat[] = ["1:1", "9:16", "1.91:1"]
  const results: ExportResult[] = []

  const objects = canvas.getObjects().filter((obj) => !obj.data?.isSafeZone)
  const originalStates = new Map<fabric.Object, ObjectState>()

  objects.forEach((obj) => {
    originalStates.set(obj, {
      left: obj.left || 0,
      top: obj.top || 0,
      scaleX: obj.scaleX || 1,
      scaleY: obj.scaleY || 1,
    })
  })

  for (const format of formats) {
    if (format !== currentFormat) {
      objects.forEach((obj) => {
        const state = originalStates.get(obj)
        if (state) {
          obj.set({
            left: state.left,
            top: state.top,
            scaleX: state.scaleX,
            scaleY: state.scaleY,
          })
          obj.setCoords()
        }
      })

      // Now scale from original format to target format
      scaleAllObjects(canvas, currentFormat, format)
      resizeCanvas(canvas, format)
      addSafeZoneOverlays(canvas, format)
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    // Export this format
    const result = await exportFormat(canvas, format, fileFormat, fileFormat === "jpeg" ? 0.85 : 1)
    results.push(result)
  }

  objects.forEach((obj) => {
    const state = originalStates.get(obj)
    if (state) {
      obj.set({
        left: state.left,
        top: state.top,
        scaleX: state.scaleX,
        scaleY: state.scaleY,
      })
      obj.setCoords()
    }
  })

  // Restore original canvas dimensions
  resizeCanvas(canvas, currentFormat)
  addSafeZoneOverlays(canvas, currentFormat)
  canvas.requestRenderAll()

  return results
}

/**
 * Download a single export result
 */
export function downloadExport(result: ExportResult): void {
  const link = document.createElement("a")
  link.download = result.filename
  link.href = result.dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Download all export results
 */
export function downloadAllExports(results: ExportResult[]): void {
  results.forEach((result, index) => {
    // Stagger downloads slightly to avoid browser blocking
    setTimeout(() => {
      downloadExport(result)
    }, index * 200)
  })
}
