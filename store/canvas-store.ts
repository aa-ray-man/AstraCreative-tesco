import { create } from "zustand"
import type * as fabric from "fabric"
import type { CanvasFormat } from "@/types/canvas-format"

// Canvas store interface
interface CanvasStore {
  canvas: fabric.Canvas | null
  selectedObject: fabric.Object | null
  backgroundColor: string
  objects: fabric.Object[]
  currentFormat: CanvasFormat
  customFonts: { name: string; url: string }[]
  setCanvas: (canvas: fabric.Canvas | null) => void
  setSelectedObject: (obj: fabric.Object | null) => void
  setBackgroundColor: (color: string) => void
  updateObjects: (objects: fabric.Object[]) => void
  addObject: (obj: fabric.Object) => void
  removeObject: (obj: fabric.Object) => void
  setCurrentFormat: (format: CanvasFormat) => void
  addCustomFont: (name: string, url: string) => void
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  canvas: null,
  selectedObject: null,
  backgroundColor: "#FFFFFF",
  objects: [],
  currentFormat: "1:1",
  customFonts: [],

  setCanvas: (canvas) => set({ canvas }),

  setSelectedObject: (obj) => set({ selectedObject: obj }),

  setBackgroundColor: (color) => {
    const { canvas } = get()
    if (canvas) {
      canvas.backgroundColor = color
      canvas.renderAll()
    }
    set({ backgroundColor: color })
  },

  updateObjects: (objects) => set({ objects }),

  addObject: (obj) => {
    const { canvas, objects } = get()
    if (canvas) {
      canvas.add(obj)
      canvas.renderAll()
      set({ objects: [...objects, obj] })
    }
  },

  removeObject: (obj) => {
    const { canvas, objects } = get()
    if (canvas) {
      canvas.remove(obj)
      canvas.renderAll()
      set({ objects: objects.filter((o) => o !== obj) })
    }
  },

  setCurrentFormat: (format) => set({ currentFormat: format }),

  addCustomFont: (name, url) => {
    set((state) => ({
      customFonts: [...state.customFonts, { name, url }],
    }))
  },
}))
