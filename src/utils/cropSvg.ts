export async function trimSvgWhitespace(svgContent: string): Promise<string> {
  const SIZE = 400
  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) return svgContent

  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const img = new Image()
  try {
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('Failed to load SVG'))
      img.src = url
    })
  } finally {
    URL.revokeObjectURL(url)
  }

  ctx.clearRect(0, 0, SIZE, SIZE)
  ctx.drawImage(img, 0, 0, SIZE, SIZE)

  let data: ImageData
  try {
    data = ctx.getImageData(0, 0, SIZE, SIZE)
  } catch {
    return svgContent  // canvas tainted (cross-origin resources)
  }

  let minX = SIZE, maxX = 0, minY = SIZE, maxY = 0
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (data.data[(y * SIZE + x) * 4 + 3] > 8) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }

  if (minX >= maxX || minY >= maxY) return svgContent

  // Map pixel bounds back to original viewBox coordinates
  const vbMatch = svgContent.match(/\bviewBox\s*=\s*["']([^"']+)["']/)
  const [vx, vy, vw, vh] = (vbMatch ? vbMatch[1] : `0 0 ${SIZE} ${SIZE}`)
    .split(/\s+/).map(Number)

  const pad = 4
  const scaleX = vw / SIZE
  const scaleY = vh / SIZE
  const nx = vx + minX * scaleX - pad * scaleX
  const ny = vy + minY * scaleY - pad * scaleY
  const nw = (maxX - minX) * scaleX + pad * scaleX * 2
  const nh = (maxY - minY) * scaleY + pad * scaleY * 2

  return svgContent.replace(
    /\bviewBox\s*=\s*["'][^"']*["']/,
    `viewBox="${nx} ${ny} ${nw} ${nh}"`,
  )
}
