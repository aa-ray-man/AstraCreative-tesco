import type * as fabric from "fabric"
import { CANVAS_FORMATS, type CanvasFormat } from "@/types/canvas-format"

export interface ScaleContext {
  fromWidth: number
  fromHeight: number
  toWidth: number
  toHeight: number
  scaleX: number
  scaleY: number
}

/**
 * Calculate scaling context when switching formats
 */
export function calculateScaleContext(fromFormat: CanvasFormat, toFormat: CanvasFormat): ScaleContext {
  const from = CANVAS_FORMATS[fromFormat]
  const to = CANVAS_FORMATS[toFormat]

  const scaleX = to.width / from.width
  const scaleY = to.height / from.height

  return {
    fromWidth: from.width,
    fromHeight: from.height,
    toWidth: to.width,
    toHeight: to.height,
    scaleX,
    scaleY,
  }
}

/**
 * Scale a single Fabric.js object proportionally
 */
export function scaleObject(obj: fabric.Object, context: ScaleContext): void {
  // Scale position
  if (obj.left !== undefined && obj.top !== undefined) {
    obj.left = obj.left * context.scaleX
    obj.top = obj.top * context.scaleY
  }

  // Scale size
  if (obj.scaleX !== undefined && obj.scaleY !== undefined) {
    obj.scaleX = obj.scaleX * context.scaleX
    obj.scaleY = obj.scaleY * context.scaleY
  }

  // Update coordinates
  obj.setCoords()
}

/**
 * Scale all objects on canvas when switching formats
 */
export function scaleAllObjects(canvas: fabric.Canvas, fromFormat: CanvasFormat, toFormat: CanvasFormat): void {
  const context = calculateScaleContext(fromFormat, toFormat)
  const objects = canvas.getObjects()

  const objectsToScale = objects.filter((obj) => !obj.data?.isSafeZone)

  // Deselect all objects before scaling
  canvas.discardActiveObject()

  // Scale each object
  objectsToScale.forEach((obj) => {
    scaleObject(obj, context)
  })
}

/**
 * Resize canvas dimensions
 */
export function resizeCanvas(canvas: fabric.Canvas, format: CanvasFormat): void {
  const dimensions = CANVAS_FORMATS[format]

  canvas.setWidth(dimensions.width)
  canvas.setHeight(dimensions.height)
  canvas.requestRenderAll()
}
