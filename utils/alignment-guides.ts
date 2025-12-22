import * as fabric from "fabric"

const SNAP_THRESHOLD = 10
const GUIDE_COLOR = "#00D4FF"
const GUIDE_WIDTH = 1

interface AlignmentGuides {
  vertical: fabric.Line[]
  horizontal: fabric.Line[]
}

let guides: AlignmentGuides = {
  vertical: [],
  horizontal: [],
}

export function showAlignmentGuides(canvas: fabric.Canvas, activeObject: fabric.FabricObject) {
  clearAlignmentGuides(canvas)

  if (!activeObject) return

  const canvasWidth = canvas.width || 1080
  const canvasHeight = canvas.height || 1080

  const objectCenterX = (activeObject.left || 0) + activeObject.getScaledWidth() / 2
  const objectCenterY = (activeObject.top || 0) + activeObject.getScaledHeight() / 2
  const objectLeft = activeObject.left || 0
  const objectTop = activeObject.top || 0
  const objectRight = objectLeft + activeObject.getScaledWidth()
  const objectBottom = objectTop + activeObject.getScaledHeight()

  const canvasCenterX = canvasWidth / 2
  const canvasCenterY = canvasHeight / 2

  if (Math.abs(objectCenterX - canvasCenterX) < SNAP_THRESHOLD) {
    const verticalGuide = new fabric.Line([canvasCenterX, 0, canvasCenterX, canvasHeight], {
      stroke: GUIDE_COLOR,
      strokeWidth: GUIDE_WIDTH,
      selectable: false,
      evented: false,
      strokeDashArray: [5, 5],
    })

    canvas.add(verticalGuide)
    guides.vertical.push(verticalGuide)

    activeObject.set({ left: canvasCenterX - activeObject.getScaledWidth() / 2 })
  }

  if (Math.abs(objectCenterY - canvasCenterY) < SNAP_THRESHOLD) {
    const horizontalGuide = new fabric.Line([0, canvasCenterY, canvasWidth, canvasCenterY], {
      stroke: GUIDE_COLOR,
      strokeWidth: GUIDE_WIDTH,
      selectable: false,
      evented: false,
      strokeDashArray: [5, 5],
    })

    canvas.add(horizontalGuide)
    guides.horizontal.push(horizontalGuide)

    activeObject.set({ top: canvasCenterY - activeObject.getScaledHeight() / 2 })
  }

  const otherObjects = canvas
    .getObjects()
    .filter((obj) => obj !== activeObject && !obj.data?.isSafeZone && obj.type !== "line")

  for (const otherObj of otherObjects) {
    const otherCenterX = (otherObj.left || 0) + otherObj.getScaledWidth() / 2
    const otherCenterY = (otherObj.top || 0) + otherObj.getScaledHeight() / 2
    const otherLeft = otherObj.left || 0
    const otherTop = otherObj.top || 0
    const otherRight = otherLeft + otherObj.getScaledWidth()
    const otherBottom = otherTop + otherObj.getScaledHeight()

    if (Math.abs(objectCenterX - otherCenterX) < SNAP_THRESHOLD) {
      const verticalGuide = new fabric.Line([otherCenterX, 0, otherCenterX, canvasHeight], {
        stroke: GUIDE_COLOR,
        strokeWidth: GUIDE_WIDTH,
        selectable: false,
        evented: false,
        strokeDashArray: [5, 5],
      })

      canvas.add(verticalGuide)
      guides.vertical.push(verticalGuide)

      activeObject.set({ left: otherCenterX - activeObject.getScaledWidth() / 2 })
    }

    if (Math.abs(objectLeft - otherLeft) < SNAP_THRESHOLD) {
      const verticalGuide = new fabric.Line([otherLeft, 0, otherLeft, canvasHeight], {
        stroke: GUIDE_COLOR,
        strokeWidth: GUIDE_WIDTH,
        selectable: false,
        evented: false,
        strokeDashArray: [5, 5],
      })

      canvas.add(verticalGuide)
      guides.vertical.push(verticalGuide)

      activeObject.set({ left: otherLeft })
    }

    if (Math.abs(objectRight - otherRight) < SNAP_THRESHOLD) {
      const verticalGuide = new fabric.Line([otherRight, 0, otherRight, canvasHeight], {
        stroke: GUIDE_COLOR,
        strokeWidth: GUIDE_WIDTH,
        selectable: false,
        evented: false,
        strokeDashArray: [5, 5],
      })

      canvas.add(verticalGuide)
      guides.vertical.push(verticalGuide)

      activeObject.set({ left: otherRight - activeObject.getScaledWidth() })
    }

    if (Math.abs(objectCenterY - otherCenterY) < SNAP_THRESHOLD) {
      const horizontalGuide = new fabric.Line([0, otherCenterY, canvasWidth, otherCenterY], {
        stroke: GUIDE_COLOR,
        strokeWidth: GUIDE_WIDTH,
        selectable: false,
        evented: false,
        strokeDashArray: [5, 5],
      })

      canvas.add(horizontalGuide)
      guides.horizontal.push(horizontalGuide)

      activeObject.set({ top: otherCenterY - activeObject.getScaledHeight() / 2 })
    }

    if (Math.abs(objectTop - otherTop) < SNAP_THRESHOLD) {
      const horizontalGuide = new fabric.Line([0, otherTop, canvasWidth, otherTop], {
        stroke: GUIDE_COLOR,
        strokeWidth: GUIDE_WIDTH,
        selectable: false,
        evented: false,
        strokeDashArray: [5, 5],
      })

      canvas.add(horizontalGuide)
      guides.horizontal.push(horizontalGuide)

      activeObject.set({ top: otherTop })
    }

    if (Math.abs(objectBottom - otherBottom) < SNAP_THRESHOLD) {
      const horizontalGuide = new fabric.Line([0, otherBottom, canvasWidth, otherBottom], {
        stroke: GUIDE_COLOR,
        strokeWidth: GUIDE_WIDTH,
        selectable: false,
        evented: false,
        strokeDashArray: [5, 5],
      })

      canvas.add(horizontalGuide)
      guides.horizontal.push(horizontalGuide)

      activeObject.set({ top: otherBottom - activeObject.getScaledHeight() })
    }
  }

  canvas.renderAll()
}

export function clearAlignmentGuides(canvas: fabric.Canvas) {
  ;[...guides.vertical, ...guides.horizontal].forEach((guide) => {
    canvas.remove(guide)
  })

  guides = {
    vertical: [],
    horizontal: [],
  }

  canvas.renderAll()
}
