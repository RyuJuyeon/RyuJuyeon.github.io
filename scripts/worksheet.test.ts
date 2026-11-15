import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createCanvas, DOMMatrix, Path2D, ImageData } from '@napi-rs/canvas';
import 'fake-indexeddb/auto';
import { inversePoint, transformPoint, hitsStroke, type Stroke } from '../src/lib/worksheet/geometry';
import { exportAnnotatedPdf } from '../src/lib/worksheet/export';
import { openStorage, readPage, writePage } from '../src/lib/worksheet/storage';
import { commitGesture, travelHistory, type History } from '../src/lib/worksheet/history';
Object.assign(globalThis, { DOMMatrix, Path2D, ImageData });
const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
const original = new Uint8Array(await fs.readFile('public/materials/quadratic-worksheet-v1.pdf'));
const stroke: Stroke = { color: '#ff0000', width: 6, points: [{ x: 100, y: 100, pressure: .5 }, { x: 220, y: 140, pressure: .7 }] };

test('PDF coordinates survive zoom, CSS resizing, device pixel ratios and page rotation', async () => {
  const task = getDocument({ data: original.slice() });
  const doc = await task.promise;
  const page = await doc.getPage(1);
  for (const rotation of [0, 90, 180, 270]) for (const scale of [.4, 1, 1.8, 3]) for (const dpr of [1, 2, 3]) {
    const viewport = page.getViewport({ scale, rotation });
    const originalPoint = { x: 183.2, y: 517.9 };
    const projected = transformPoint(originalPoint.x, originalPoint.y, viewport.transform);
    const browserScale = .87;
    const backingX = projected.x * dpr;
    const cssX = backingX / dpr * browserScale;
    const cssY = projected.y * browserScale;
    const restored = inversePoint(cssX / browserScale, cssY / browserScale, viewport.transform);
    assert.ok(Math.abs(restored.x - originalPoint.x) < 1e-9);
    assert.ok(Math.abs(restored.y - originalPoint.y) < 1e-9);
  }
  await task.destroy();
});
test('eraser detects the middle of a segment and isolated dots', () => {
  assert.equal(hitsStroke({ x: 160, y: 120, pressure: .5 }, stroke, 2), true);
  assert.equal(hitsStroke({ x: 160, y: 170, pressure: .5 }, stroke, 2), false);
  assert.equal(hitsStroke(stroke.points[0], { ...stroke, points: [stroke.points[0]] }, 2), true);
});
test('undo and redo restore erased strokes, isolate pages, and discard redo after a new gesture', () => {
  const first: History = { strokes: [stroke], undo: [], redo: [] };
  const second: History = { strokes: [], undo: [], redo: [] };
  commitGesture(first, []);
  const beforeErase = first.strokes;
  first.strokes = [];
  commitGesture(first, beforeErase);
  assert.equal(travelHistory(first, 'undo'), true);
  assert.deepEqual(first.strokes, [stroke]);
  assert.equal(travelHistory(first, 'redo'), true);
  assert.deepEqual(first.strokes, []);
  travelHistory(first, 'undo');
  const previous = first.strokes;
  first.strokes = [...previous, { ...stroke, color: '#0000ff' }];
  commitGesture(first, previous);
  assert.equal(travelHistory(first, 'redo'), false);
  assert.equal(first.strokes.length, 2);
  assert.equal(travelHistory(second, 'undo'), false);
  assert.deepEqual(second.strokes, []);
});
test('IndexedDB restores page-specific notes, keeps documents isolated and persists undo-to-empty', async () => {
  let db = await openStorage();
  await writePage(db, 'sample:1', [stroke]);
  await writePage(db, 'sample:2', [{ ...stroke, color: '#0000ff' }]);
  await writePage(db, 'other-document:1', []);
  db.close(); db = await openStorage();
  assert.deepEqual(await readPage(db, 'sample:1'), [stroke]);
  assert.equal((await readPage(db, 'sample:2'))[0].color, '#0000ff');
  assert.deepEqual(await readPage(db, 'other-document:1'), []);
  await writePage(db, 'sample:1', []);
  assert.deepEqual(await readPage(db, 'sample:1'), []);
  assert.equal((await readPage(db, 'sample:2')).length, 1);
  db.close();
});
test('export preserves both source pages and places colored ink at PDF coordinates', async () => {
  await fs.mkdir('tmp/pdfs', { recursive: true });
  const exported = await exportAnnotatedPdf(original, new Map([[1, [stroke]], [2, [{ color: '#0000ff', width: 8, points: [{ x: 150, y: 180, pressure: .5 }] }]]]));
  await fs.writeFile('tmp/pdfs/annotated-test.pdf', exported);
  for (const [name, bytes] of [['sample', original], ['annotated', exported]] as const) {
    const task = getDocument({ data: bytes.slice() });
    const doc = await task.promise;
    assert.equal(doc.numPages, 2);
    for (let n = 1; n <= 2; n++) {
      const page = await doc.getPage(n);
      const viewport = page.getViewport({ scale: 1.2 });
      const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
      const context = canvas.getContext('2d');
      await page.render({ canvas: canvas as any, canvasContext: context as any, viewport }).promise;
      await fs.writeFile(`tmp/pdfs/${name}-${n}.png`, canvas.toBuffer('image/png'));
      const text = (await page.getTextContent()).items.map((item: any) => item.str ?? '').join('');
      assert.ok(text.includes('수학'));
      if (name === 'annotated') {
        const p = viewport.convertToViewportPoint(n === 1 ? 160 : 150, n === 1 ? 120 : 180);
        const pixel = context.getImageData(Math.round(p[0]), Math.round(p[1]), 1, 1).data;
        assert.ok(n === 1 ? pixel[0] > 230 && pixel[1] < 30 : pixel[2] > 230 && pixel[0] < 30, `Ink missing on page ${n}`);
      }
    }
    await task.destroy();
  }
});
