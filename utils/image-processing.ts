import type { fabric } from "fabric"

export async function removeImageBackground(imageDataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        reject(new Error("Could not get canvas context"))
        return
      }

      canvas.width = img.width
      canvas.height = img.height

      ctx.drawImage(img, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      const bgR = data[0]
      const bgG = data[1]
      const bgB = data[2]

      const tolerance = 50

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        const distance = Math.sqrt(Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2))

        if (distance < tolerance) {
          data[i + 3] = 0
        }
      }

      ctx.putImageData(imageData, 0, 0)
      resolve(canvas.toDataURL("image/png"))
    }

    img.onerror = () => reject(new Error("Failed to load image"))
    img.src = imageDataUrl
  })
}

export function fabricImageToDataUrl(fabricImage: fabric.FabricImage): string {
  const tempCanvas = document.createElement("canvas")
  const ctx = tempCanvas.getContext("2d")

  if (!ctx || !fabricImage._element) {
    throw new Error("Cannot convert image to data URL")
  }

  const element = fabricImage._element as HTMLImageElement
  tempCanvas.width = element.naturalWidth || element.width
  tempCanvas.height = element.naturalHeight || element.height

  ctx.drawImage(element, 0, 0)
  return tempCanvas.toDataURL("image/png")
}
