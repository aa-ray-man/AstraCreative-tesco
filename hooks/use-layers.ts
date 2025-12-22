import { useCanvasStore } from "@/store/canvas-store"
import type * as fabric from "fabric"

export function useLayers() {
  const { canvas, objects, removeObject } = useCanvasStore()

  // Get layer name based on object type
  const getLayerName = (obj: fabric.Object, index: number): string => {
    if (obj.type === "image") return `Image ${index + 1}`
    if (obj.type === "i-text" || obj.type === "text") {
      const text = (obj as fabric.IText).text || ""
      return text.length > 20 ? `${text.substring(0, 20)}...` : text || `Text ${index + 1}`
    }
    return `Layer ${index + 1}`
  }

  // Bring object forward
  const bringForward = (obj: fabric.Object) => {
    if (canvas) {
      canvas.bringObjectForward(obj)
      canvas.renderAll()
    }
  }

  // Send object backward
  const sendBackward = (obj: fabric.Object) => {
    if (canvas) {
      canvas.sendObjectBackwards(obj)
      canvas.renderAll()
    }
  }

  // Delete object
  const deleteObject = (obj: fabric.Object) => {
    removeObject(obj)
  }

  // Select object
  const selectObject = (obj: fabric.Object) => {
    if (canvas) {
      canvas.setActiveObject(obj)
      canvas.renderAll()
    }
  }

  return {
    objects,
    getLayerName,
    bringForward,
    sendBackward,
    deleteObject,
    selectObject,
  }
}
