import { PDFDocument, rgb, LineCapStyle } from 'pdf-lib';
import { pointWidth, type Stroke } from './geometry';
export async function exportAnnotatedPdf(bytes: Uint8Array, pages: Map<number, Stroke[]>) {
  const doc = await PDFDocument.load(bytes);
  for (const [number, strokes] of pages) {
    const page = doc.getPage(number - 1);
    for (const stroke of strokes) {
      const hex = stroke.color.slice(1);
      const color = rgb(parseInt(hex.slice(0, 2), 16) / 255, parseInt(hex.slice(2, 4), 16) / 255, parseInt(hex.slice(4, 6), 16) / 255);
      stroke.points.forEach((point, i) => {
        const previous = stroke.points[Math.max(0, i - 1)];
        const width = (pointWidth(stroke, previous) + pointWidth(stroke, point)) / 2;
        if (i) page.drawLine({ start: previous, end: point, thickness: width, color, lineCap: LineCapStyle.Round });
        page.drawCircle({ x: point.x, y: point.y, size: pointWidth(stroke, point) / 2, color });
      });
    }
  }
  return doc.save();
}
