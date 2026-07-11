export function isShapeNode(iconId: string): boolean {
  return iconId.startsWith('shape-')
}

export function applyShapeStyle(
  svgContent: string,
  strokeColor?: string,
  strokeWidth?: number,
  cornerRadius?: number,
): string {
  let result = svgContent

  if (strokeColor) {
    // Replace the default shape color wherever it appears (stroke or fill)
    result = result.replace(/#374151/g, strokeColor)
  }

  if (strokeWidth !== undefined) {
    if (/stroke-width="/i.test(result)) {
      // Shape already has stroke-width attributes — replace all of them
      result = result.replace(/stroke-width="[^"]*"/g, `stroke-width="${strokeWidth}"`)
    } else {
      // Fill-only shape (e.g. Arrow) — add stroke so thickness has effect
      const color = strokeColor ?? '#374151'
      result = result
        .replace(/fill="(?!none)[^"]*"/g, `fill="none" stroke="${color}" stroke-width="${strokeWidth}"`)
    }
  }

  // Corner radius only makes sense on a <rect> (shape-rect / shape-rect-rounded)
  // — every other shape's <rect>-less markup is left untouched by this regex.
  if (cornerRadius !== undefined) {
    if (/<rect\b[^>]*\brx="[^"]*"/i.test(result)) {
      result = result.replace(/(<rect\b[^>]*\brx=")[^"]*(")/i, `$1${cornerRadius}$2`)
    } else {
      result = result.replace(/(<rect\b)([^>]*?)(\/?>)/i, (_m, open, attrs, close) => `${open}${attrs} rx="${cornerRadius}"${close}`)
    }
  }

  return result
}
