"use client"

import { useState, useEffect } from "react"
import type * as fabric from "fabric"
import * as fabricModule from "fabric"
import { useCanvasStore } from "@/store/canvas-store"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Wand2, Loader2, ChevronDown, ChevronUp } from "lucide-react"
import { removeImageBackground, fabricImageToDataUrl } from "@/utils/image-processing"
import { useToast } from "@/hooks/use-toast"

export function ImagePanel() {
  const { selectedObject, canvas } = useCanvasStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [adjustmentsOpen, setAdjustmentsOpen] = useState(false)
  const [brightness, setBrightness] = useState(0)
  const [contrast, setContrast] = useState(0)
  const [saturation, setSaturation] = useState(0)
  const { toast } = useToast()

  const isImageObject = selectedObject && selectedObject.type === "image"

  useEffect(() => {
    if (isImageObject) {
      setBrightness(0)
      setContrast(0)
      setSaturation(0)
    }
  }, [isImageObject, selectedObject])

  if (!isImageObject || !canvas) {
    return <div className="text-sm text-muted-foreground">Select an image to edit its properties</div>
  }

  const imageObj = selectedObject as fabric.FabricImage

  const handleRemoveBackground = async () => {
    setIsProcessing(true)
    try {
      const dataUrl = fabricImageToDataUrl(imageObj)

      toast({
        title: "Processing",
        description: "Removing solid color background...",
      })

      const processedDataUrl = await removeImageBackground(dataUrl)

      const newImg = await fabricModule.FabricImage.fromURL(processedDataUrl)

      newImg.set({
        left: imageObj.left,
        top: imageObj.top,
        angle: imageObj.angle,
        scaleX: imageObj.scaleX,
        scaleY: imageObj.scaleY,
      })

      canvas.remove(imageObj)
      canvas.add(newImg)
      canvas.setActiveObject(newImg)
      canvas.renderAll()

      toast({
        title: "Success",
        description: "Background removed successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove background. Works best with solid color backgrounds.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const applyFilters = (brightnessValue: number, contrastValue: number, saturationValue: number) => {
    const filters = []

    if (brightnessValue !== 0) {
      filters.push(new fabricModule.filters.Brightness({ brightness: brightnessValue / 100 }))
    }

    if (contrastValue !== 0) {
      filters.push(new fabricModule.filters.Contrast({ contrast: contrastValue / 100 }))
    }

    if (saturationValue !== 0) {
      filters.push(new fabricModule.filters.Saturation({ saturation: saturationValue / 100 }))
    }

    imageObj.filters = filters
    imageObj.applyFilters()
    canvas.renderAll()
  }

  const handleBrightnessChange = (value: number) => {
    setBrightness(value)
    applyFilters(value, contrast, saturation)
  }

  const handleContrastChange = (value: number) => {
    setContrast(value)
    applyFilters(brightness, value, saturation)
  }

  const handleSaturationChange = (value: number) => {
    setSaturation(value)
    applyFilters(brightness, contrast, value)
  }

  const resetAdjustments = () => {
    setBrightness(0)
    setContrast(0)
    setSaturation(0)
    applyFilters(0, 0, 0)
  }

  return (
    <div className="flex flex-col gap-4 p-4 bg-muted/30 rounded-lg border">
      <div className="font-semibold text-sm">Image Tools</div>

      <div className="flex flex-col gap-2">
        <Button
          onClick={handleRemoveBackground}
          disabled={isProcessing}
          variant="outline"
          className="w-full justify-start gap-2 bg-transparent"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
          Remove Background
        </Button>
      </div>

      <Collapsible open={adjustmentsOpen} onOpenChange={setAdjustmentsOpen} className="border-t pt-4">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto font-semibold text-sm">
            Adjustments
            {adjustmentsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="flex flex-col gap-4 pt-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="brightness" className="text-xs">
              Brightness ({brightness})
            </Label>
            <Input
              id="brightness"
              type="range"
              min="-100"
              max="100"
              value={brightness}
              onChange={(e) => handleBrightnessChange(Number(e.target.value))}
              className="cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="contrast" className="text-xs">
              Contrast ({contrast})
            </Label>
            <Input
              id="contrast"
              type="range"
              min="-100"
              max="100"
              value={contrast}
              onChange={(e) => handleContrastChange(Number(e.target.value))}
              className="cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="saturation" className="text-xs">
              Saturation ({saturation})
            </Label>
            <Input
              id="saturation"
              type="range"
              min="-100"
              max="100"
              value={saturation}
              onChange={(e) => handleSaturationChange(Number(e.target.value))}
              className="cursor-pointer"
            />
          </div>

          <Button onClick={resetAdjustments} variant="outline" size="sm" className="w-full bg-transparent">
            Reset Adjustments
          </Button>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
