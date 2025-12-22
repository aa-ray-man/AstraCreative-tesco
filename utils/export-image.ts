import type * as fabric from "fabric"

/**
 * Export canvas as PNG
 * @param canvas - The Fabric.js canvas instance
 * @param filename - The name for the downloaded file
 */
export function exportAsPNG(canvas: fabric.Canvas, filename = "astracreative-design.png") {
  // Deselect all objects to remove selection borders
  canvas.discardActiveObject()
  canvas.renderAll()

  // Generate PNG data URL
  const dataURL = canvas.toDataURL({
    format: "png",
    quality: 1,
    multiplier: 1,
  })

  // Trigger download
  downloadImage(dataURL, filename)
}

/**
 * Export canvas as JPEG
 * @param canvas - The Fabric.js canvas instance
 * @param filename - The name for the downloaded file
 * @param quality - JPEG quality (0-1)
 */
export function exportAsJPEG(canvas: fabric.Canvas, filename = "astracreative-design.jpg", quality = 0.9) {
  // Deselect all objects to remove selection borders
  canvas.discardActiveObject()
  canvas.renderAll()

  // Generate JPEG data URL
  const dataURL = canvas.toDataURL({
    format: "jpeg",
    quality: quality,
    multiplier: 1,
  })

  // Trigger download
  downloadImage(dataURL, filename)
}

/**
 * Helper function to trigger image download
 * @param dataURL - The base64 data URL
 * @param filename - The name for the downloaded file
 */
function downloadImage(dataURL: string, filename: string) {
  const link = document.createElement("a")
  link.download = filename
  link.href = dataURL
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
