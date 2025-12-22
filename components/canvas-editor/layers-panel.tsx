"use client"

import { useLayers } from "@/hooks/use-layers"
import { Button } from "@/components/ui/button"
import { Trash2, ChevronUp, ChevronDown, ImageIcon, Type } from "lucide-react"
import type { fabric } from "fabric"

export function LayersPanel() {
  const { objects, getLayerName, bringForward, sendBackward, deleteObject, selectObject } = useLayers()

  if (objects.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-8">
        No layers yet. Add images or text to get started.
      </div>
    )
  }

  const getLayerIcon = (obj: fabric.Object) => {
    if (obj.type === "image") {
      return <ImageIcon className="w-4 h-4 text-blue-600" />
    }
    if (obj.type === "i-text" || obj.type === "text") {
      return <Type className="w-4 h-4 text-purple-600" />
    }
    return null
  }

  return (
    <div className="flex flex-col gap-1">
      {objects.map((obj, index) => (
        <div
          key={index}
          className="flex items-center gap-2 p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
        >
          {/* Layer Icon & Name */}
          <button onClick={() => selectObject(obj)} className="flex items-center gap-2 flex-1 min-w-0 text-left">
            {getLayerIcon(obj)}
            <span className="text-sm truncate">{getLayerName(obj, index)}</span>
          </button>

          {/* Layer Controls */}
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => bringForward(obj)}
              title="Bring forward"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => sendBackward(obj)}
              title="Send backward"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={() => deleteObject(obj)}
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
