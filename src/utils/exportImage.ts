import { toPng, toSvg, toBlob } from 'html-to-image'

function captureOptions(style: { width: number; height: number; transform: string }, bgColor: string) {
  return {
    backgroundColor: bgColor === 'none' ? undefined : bgColor,
    width: style.width,
    height: style.height,
    style: {
      width: `${style.width}px`,
      height: `${style.height}px`,
      transform: style.transform,
    },
  }
}

// Rasterizes the ACTUAL rendered `.react-flow__viewport` DOM node (via
// html-to-image) instead of reconstructing the diagram from scratch. A
// hand-authored re-implementation of React Flow's icon layout, arrow curves,
// and stacking order drifts out of sync with what's really on screen —
// capturing the live DOM guarantees the export always matches the canvas.
export async function captureElement(
  format: 'png' | 'svg',
  el: HTMLElement,
  style: { width: number; height: number; transform: string },
  bgColor: string,
): Promise<string> {
  const options = captureOptions(style, bgColor)
  return format === 'png' ? toPng(el, options) : toSvg(el, options)
}

export async function captureBlob(
  el: HTMLElement,
  style: { width: number; height: number; transform: string },
  bgColor: string,
): Promise<Blob | null> {
  return toBlob(el, captureOptions(style, bgColor))
}

export async function copyBlobToClipboard(blob: Blob): Promise<void> {
  await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
}

export function triggerDownload(dataUrl: string, filename: string) {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  a.click()
}

export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
