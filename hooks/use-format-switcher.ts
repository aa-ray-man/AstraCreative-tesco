"use client"

import { useCallback } from "react"
import { useCanvasStore } from "@/store/canvas-store"
import type { CanvasFormat } from "@/types/canvas-format"
import { scaleAllObjects, resizeCanvas } from "@/utils/canvas-scaling"
import { updateSafeZones } from "@/utils/safe-zones"

export function useFormatSwitcher() {
  const { canvas, currentFormat, setCurrentFormat } = useCanvasStore()

  const switchFormat = useCallback(
    (newFormat: CanvasFormat) => {
      if (!canvas || currentFormat === newFormat) {
        return
      }

      // Store the old format
      const oldFormat = currentFormat

      setCurrentFormat(newFormat)

      // Scale all objects proportionally
      scaleAllObjects(canvas, oldFormat, newFormat)

      // Resize the canvas
      resizeCanvas(canvas, newFormat)

      // Update safe zones for new format
      updateSafeZones(canvas, newFormat)

      // Final render
      canvas.requestRenderAll()
    },
    [canvas, currentFormat, setCurrentFormat],
  )

  return { switchFormat, currentFormat }
}
