export function fitImageToCanvas(
  imgWidth: number,
  imgHeight: number,
  canvasWidth: number,
  canvasHeight: number,
): number {
  const maxWidth = canvasWidth * 0.7
  const maxHeight = canvasHeight * 0.7

  const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight, 1)

  return scale
}
