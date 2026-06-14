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
    result = result.replace(/#374151/g, strokeColor)
  }
  if (strokeWidth !== undefined) {
    result = result.replace(/stroke-width="[^"]*"/g, `stroke-width="${strokeWidth}"`)
  }
  return result
}
