"use client"

import { useState } from "react"
import { useCanvasStore } from "@/store/canvas-store"
import type { ComplianceReport, CanvasObjectData } from "@/types/compliance"
import { removeSafeZones } from "@/utils/safe-zones"

export function useCompliance() {
  const [report, setReport] = useState<ComplianceReport | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const canvas = useCanvasStore((state) => state.canvas)
  const backgroundColor = useCanvasStore((state) => state.backgroundColor)
  const currentFormat = useCanvasStore((state) => state.currentFormat)

  const checkCompliance = async () => {
    if (!canvas) {
      console.error("Canvas not initialized")
      return
    }

    setIsChecking(true)

    try {
      // Remove selection handles
      canvas.discardActiveObject()
      canvas.renderAll()

      // Temporarily remove safe zones for export
      const safeZones = removeSafeZones(canvas)

      // Export canvas as PNG
      const screenshot = canvas.toDataURL({
        format: "png",
        quality: 1,
        multiplier: 1,
      })

      // Collect canvas object data
      const objects: CanvasObjectData[] = canvas.getObjects().map((obj, index) => {
        const bounds = obj.getBoundingRect()

        return {
          type: obj.type === "text" || obj.type === "i-text" || obj.type === "textbox" ? "text" : "image",
          id: (obj as any).id || `object-${index}`,
          x: bounds.left,
          y: bounds.top,
          width: bounds.width,
          height: bounds.height,
          text: (obj as any).text || undefined,
          fontSize: (obj as any).fontSize || undefined,
          fill: (obj as any).fill || undefined,
          fontFamily: (obj as any).fontFamily || undefined,
          imageName: (obj as any).name || (obj as any).src || undefined,
          isDrinkaware: (obj as any).isDrinkaware || false,
          zIndex: canvas.getObjects().indexOf(obj),
        }
      })

      // Re-add safe zones
      if (safeZones.length > 0) {
        safeZones.forEach((zone) => canvas.add(zone))
        canvas.renderAll()
      }

      // Call compliance API
      const response = await fetch("/api/check-compliance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          canvasData: {
            objects,
            backgroundColor,
            width: canvas.width || 1080,
            height: canvas.height || 1080,
            format: currentFormat,
          },
          screenshot,
          productType: "non-alcohol",
        }),
      })

      if (!response.ok) {
        throw new Error("Compliance check failed")
      }

      const complianceReport: ComplianceReport = await response.json()

      setReport(complianceReport)
    } catch (error) {
      console.error("Compliance check error:", error)
      alert("Failed to run compliance check. Please try again.")
    } finally {
      setIsChecking(false)
    }
  }

  return {
    report,
    isChecking,
    checkCompliance,
  }
}
