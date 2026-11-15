export function parseAnswer(raw: string): number | null {
  const value = raw.normalize('NFKC').replace(/−/g, '-').replace(/\s/g, '');
  const number = '[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)';
  if (!new RegExp(`^${number}(?:/${number})?$`).test(value)) return null;
  const [numerator, denominator = '1'] = value.split('/');
  const result = Number(numerator) / Number(denominator);
  return Number.isFinite(result) ? result : null;
}
export function gradeAnswer(raw: string, expected: number): 'empty' | 'invalid' | 'correct' | 'incorrect' {
  if (!raw.trim()) return 'empty';
  const value = parseAnswer(raw);
  return value === null ? 'invalid' : Math.abs(value - expected) <= .00051 ? 'correct' : 'incorrect';
}
export const circlePoint = (a: number, b: number, r: number, t: number) => ({ x: a + r * Math.cos(t), y: b + r * Math.sin(t) });
export const exponentialValue = (a: number, x: number) => a ** x;
export function quadraticSlopes(a: number, h: number) {
  if (h === 0) throw new Error('h must not be zero');
  return { secant: 2 * a + h, tangent: 2 * a };
}
export function ellipseState(a: number, b: number, t: number) {
  if (!(a > b && b > 0)) throw new Error('a > b > 0 required');
  const c = Math.sqrt(a * a - b * b), x = a * Math.cos(t), y = b * Math.sin(t);
  return { c, x, y, d1: Math.hypot(x + c, y), d2: Math.hypot(x - c, y) };
}
export const trigValue = (kind: string, x: number) => kind === 'sin' ? Math.sin(x) : Math.cos(x);
export const trigSlope = (kind: string, x: number) => kind === 'sin' ? Math.cos(x) : -Math.sin(x);
export const eventFaces = (event: string) => event === 'even' ? [2, 4, 6] : event === 'large' ? [5, 6] : [6];
export function probabilityStats(counts: number[], event: string) {
  const faces = eventFaces(event), total = counts.reduce((a, b) => a + b, 0);
  const successes = faces.reduce((sum, face) => sum + counts[face - 1], 0);
  return { total, successes, theoretical: faces.length / 6, frequency: total ? successes / total : null };
}
export function rollDice(counts: number[], times: number, random = Math.random) {
  const next = [...counts];
  for (let i = 0; i < times; i++) next[Math.min(5, Math.floor(random() * 6))]++;
  return next;
}
