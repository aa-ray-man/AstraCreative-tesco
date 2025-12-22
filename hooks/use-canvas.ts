"use client"

import { useEffect, useRef } from "react"
import * as fabric from "fabric"
import { useCanvasStore } from "@/store/canvas-store"
import { CANVAS_FORMATS } from "@/types/canvas-format"
import { showAlignmentGuides, clearAlignmentGuides } from "@/utils/alignment-guides"

export function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { setCanvas, setSelectedObject, updateObjects, currentFormat } = useCanvasStore()

  useEffect(() => {
    if (!canvasRef.current) {
      return
    }

    const initialDimensions = CANVAS_FORMATS[currentFormat]

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: initialDimensions.width,
      height: initialDimensions.height,
      backgroundColor: "#FFFFFF",
      preserveObjectStacking: true,
    })

    setCanvas(fabricCanvas)

    fabricCanvas.on("object:moving", (e) => {
      if (e.target && !e.target.data?.isSafeZone) {
        showAlignmentGuides(fabricCanvas, e.target)
      }
    })

    fabricCanvas.on("object:modified", () => {
      clearAlignmentGuides(fabricCanvas)
      updateObjects(fabricCanvas.getObjects().filter((obj) => !obj.data?.isSafeZone))
    })

    fabricCanvas.on("mouse:up", () => {
      clearAlignmentGuides(fabricCanvas)
    })

    fabricCanvas.on("selection:created", (e) => {
      if (e.selected && e.selected.length > 0) {
        if (e.selected[0].data?.isSafeZone) {
          fabricCanvas.discardActiveObject()
          return
        }
        setSelectedObject(e.selected[0])
      }
    })

    fabricCanvas.on("selection:updated", (e) => {
      if (e.selected && e.selected.length > 0) {
        if (e.selected[0].data?.isSafeZone) {
          fabricCanvas.discardActiveObject()
          return
        }
        setSelectedObject(e.selected[0])
      }
    })

    fabricCanvas.on("selection:cleared", () => {
      setSelectedObject(null)
    })

    fabricCanvas.on("object:added", () => {
      updateObjects(fabricCanvas.getObjects().filter((obj) => !obj.data?.isSafeZone))
    })

    fabricCanvas.on("object:removed", () => {
      updateObjects(fabricCanvas.getObjects().filter((obj) => !obj.data?.isSafeZone))
    })

    return () => {
      fabricCanvas.dispose()
      setCanvas(null)
    }
  }, [setCanvas, setSelectedObject, updateObjects, currentFormat])

  return canvasRef
}
