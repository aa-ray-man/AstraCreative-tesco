"use client"

import type React from "react"

import { useRef } from "react"
import * as fabric from "fabric"
import { useCanvasStore } from "@/store/canvas-store"
import { fileToBase64 } from "@/utils/file-to-base64"
import { fitImageToCanvas } from "@/utils/image-fit"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

export function ImageUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { canvas, addObject } = useCanvasStore()

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0 || !canvas) {
      return
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      if (!file.type.startsWith("image/")) {
        continue
      }

      try {
        const base64 = await fileToBase64(file)

        fabric.FabricImage.fromURL(base64)
          .then((img) => {
            const scale = fitImageToCanvas(img.width || 1, img.height || 1, canvas.width || 1080, canvas.height || 1080)

            img.scale(scale)

            img.set({
              left: canvas.width / 2 - img.getScaledWidth() / 2,
              top: canvas.height / 2 - img.getScaledHeight() / 2,
            })

            addObject(img)
          })
          .catch((error) => {
            console.error("Error loading image:", error)
          })
      } catch (error) {
        console.error("Error processing image:", error)
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div>
      <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
      <Button onClick={handleButtonClick} variant="outline" className="w-full justify-start gap-2 bg-transparent">
        <Upload className="w-4 h-4" />
        Upload Image
      </Button>
    </div>
  )
}
