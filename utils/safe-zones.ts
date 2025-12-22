import * as fabric from "fabric"
import { SAFE_ZONES, CANVAS_FORMATS, type CanvasFormat } from "@/types/canvas-format"

/**
 * Create a safe zone overlay rectangle
 */
function createSafeZoneRect(width: number, height: number, top: number, label: string): fabric.Rect {
  const rect = new fabric.Rect({
    left: 0,
    top,
    width,
    height,
    fill: "rgba(255, 0, 0, 0.2)",
    selectable: false,
    evented: false,
    hoverCursor: "default",
  })

  // Mark as safe zone for identification
  rect.data = { isSafeZone: true, label }

  return rect
}

/**
 * Add safe zone overlays to canvas for Story format (9:16)
 */
export function addSafeZoneOverlays(canvas: fabric.Canvas, format: CanvasFormat): void {
  // Remove existing safe zones first
  removeSafeZoneOverlays(canvas)

  const safeZone = SAFE_ZONES[format]
  if (!safeZone) {
    return
  }

  const dimensions = CANVAS_FORMATS[format]

  // Create top safe zone
  const topZone = createSafeZoneRect(dimensions.width, safeZone.top, 0, "Top Safe Zone")

  // Create bottom safe zone
  const bottomZone = createSafeZoneRect(
    dimensions.width,
    safeZone.bottom,
    dimensions.height - safeZone.bottom,
    "Bottom Safe Zone",
  )

  // Add to canvas
  canvas.add(topZone, bottomZone)

  canvas.bringObjectToFront(topZone)
  canvas.bringObjectToFront(bottomZone)

  canvas.requestRenderAll()
}

/**
 * Remove all safe zone overlays from canvas
 */
export function removeSafeZoneOverlays(canvas: fabric.Canvas): void {
  const objects = canvas.getObjects()
  const safeZones = objects.filter((obj) => obj.data?.isSafeZone)

  if (safeZones.length > 0) {
    safeZones.forEach((zone) => canvas.remove(zone))
    canvas.requestRenderAll()
  }
}

/**
 * Update safe zones when format changes
 */
export function updateSafeZones(canvas: fabric.Canvas, format: CanvasFormat): void {
  removeSafeZoneOverlays(canvas)
  addSafeZoneOverlays(canvas, format)
}

/**
 * Remove safe zone overlays and return them for later restoration
 * Used during compliance checks and exports
 */
export function removeSafeZones(canvas: fabric.Canvas): fabric.Object[] {
  const objects = canvas.getObjects()
  const safeZones = objects.filter((obj) => obj.data?.isSafeZone)

  if (safeZones.length > 0) {
    safeZones.forEach((zone) => canvas.remove(zone))
    canvas.requestRenderAll()
  }

  return safeZones
}
