export function isShapeNode(iconId: string): boolean {
  return iconId.startsWith('shape-')
}

export function applyShapeStyle(
  svgContent: string,
  strokeColor?: string,
  strokeWidth?: number,
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

  return result
}
