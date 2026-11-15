export type Point = { x: number; y: number; pressure: number };
export type Stroke = { color: string; width: number; points: Point[] };
export function transformPoint(x: number, y: number, m: number[]) {
  return { x: m[0] * x + m[2] * y + m[4], y: m[1] * x + m[3] * y + m[5] };
}
export function inversePoint(x: number, y: number, m: number[]) {
  const det = m[0] * m[3] - m[1] * m[2];
  if (!det) throw new Error('Invalid page transform');
  return { x: (m[3] * (x - m[4]) - m[2] * (y - m[5])) / det, y: (-m[1] * (x - m[4]) + m[0] * (y - m[5])) / det };
}
export const pointWidth = (stroke: Stroke, point: Point) => stroke.width * (0.5 + point.pressure);
export function segmentDistance(p: Point, a: Point, b: Point) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const t = dx || dy ? Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy))) : 0;
  return Math.hypot(p.x - a.x - t * dx, p.y - a.y - t * dy);
}
export function hitsStroke(p: Point, stroke: Stroke, radius: number) {
  return stroke.points.some((point, i) => segmentDistance(p, stroke.points[Math.max(0, i - 1)], point) <= radius + stroke.width * .75);
}
