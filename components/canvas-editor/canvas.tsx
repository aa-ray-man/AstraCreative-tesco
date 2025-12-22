"use client"

import { useCanvas } from "@/hooks/use-canvas"

export function Canvas() {
  const canvasRef = useCanvas()

  return (
    <div className="flex items-start justify-center min-h-full bg-muted/20 py-10">
      <div className="shadow-2xl rounded-lg overflow-hidden border-2 border-border">
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}
