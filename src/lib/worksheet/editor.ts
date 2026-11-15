import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy, type PageViewport } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { hitsStroke, inversePoint, pointWidth, transformPoint, type Point, type Stroke } from './geometry';
import { openStorage, readPage, writePage } from './storage';
import { commitGesture, travelHistory, type History } from './history';

GlobalWorkerOptions.workerSrc = workerUrl;
const element = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const app = element('worksheet-app');
const canvas = element<HTMLCanvasElement>('pdf-canvas');
const ink = element<HTMLCanvasElement>('ink-canvas');
const paper = element('paper');
const scroller = element('pdf-scroll');
const status = element('save-status');
const message = element('worksheet-message');
const color = element<HTMLInputElement>('ink-color');
const width = element<HTMLSelectElement>('ink-width');
const penOnly = element<HTMLInputElement>('pen-only');
const button = (id: string) => element<HTMLButtonElement>(id);
const histories = new Map<number, History>();
let doc: PDFDocumentProxy;
let source: Uint8Array;
let db: IDBDatabase | undefined;
let docKey = '';
let pageNumber = 1;
let zoom = 1;
let viewport: PageViewport;
let busy = true;
let initialized = false;
let tool = 'pen';
let pointer: number | null = null;
let activeStroke: Stroke | null = null;
let beforeGesture: Stroke[] | null = null;
let pan: { x: number; y: number; left: number; top: number } | null = null;
let saveQueue = Promise.resolve();
let pendingSaves = 0;
let saveFailed = false;
let frame = 0;
const history = () => histories.get(pageNumber)!;

function refreshControls() {
  app.setAttribute('aria-busy', String(busy));
  app.querySelectorAll<HTMLButtonElement | HTMLInputElement | HTMLSelectElement>('button,input,select').forEach(control => control.disabled = busy);
  if (!initialized) return;
  button('previous-page').disabled = busy || pageNumber === 1;
  button('next-page').disabled = busy || pageNumber === doc.numPages;
  button('undo').disabled = busy || !history().undo.length;
  button('redo').disabled = busy || !history().redo.length;
  button('zoom-out').disabled = busy || zoom <= .4;
  button('zoom-in').disabled = busy || zoom >= 3;
  element('page-indicator').textContent = `${pageNumber} / ${doc.numPages} 쪽`;
  element('zoom-indicator').textContent = `${Math.round(zoom * 100)}%`;
}
function savePage() {
  if (!db) { status.textContent = '자동 저장 불가 · PDF로 내려받아 보관하세요.'; return; }
  const key = `${docKey}:${pageNumber}`;
  // Snapshot before queuing, so page switches and later gestures cannot change this write.
  const snapshot = structuredClone(history().strokes);
  pendingSaves++;
  status.textContent = '저장 중…';
  saveQueue = saveQueue.then(() => writePage(db!, key, snapshot)).then(() => {
    pendingSaves--;
    if (!pendingSaves) status.textContent = saveFailed ? '일부 저장 실패 · PDF로 내려받아 보관하세요.' : '모든 필기가 이 브라우저에 저장됨';
  }).catch(() => {
    pendingSaves--;
    saveFailed = true;
    status.textContent = '저장 실패 · 저장 공간을 확인하고 PDF로 내려받으세요.';
  });
}
function draw() {
  frame = 0;
  if (!viewport || !histories.has(pageNumber)) return;
  const ctx = ink.getContext('2d')!;
  const sx = ink.width / viewport.width, sy = ink.height / viewport.height;
  ctx.setTransform(sx, 0, 0, sy, 0, 0);
  ctx.clearRect(0, 0, viewport.width, viewport.height);
  const scale = Math.hypot(viewport.transform[0], viewport.transform[1]);
  for (const stroke of [...history().strokes, ...(activeStroke ? [activeStroke] : [])]) {
    ctx.strokeStyle = ctx.fillStyle = stroke.color;
    ctx.lineCap = ctx.lineJoin = 'round';
    stroke.points.forEach((point, index) => {
      const previous = stroke.points[Math.max(0, index - 1)];
      const p = transformPoint(point.x, point.y, viewport.transform);
      const q = transformPoint(previous.x, previous.y, viewport.transform);
      if (index) {
        ctx.lineWidth = (pointWidth(stroke, point) + pointWidth(stroke, previous)) / 2 * scale;
        ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(p.x, p.y); ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(p.x, p.y, pointWidth(stroke, point) * scale / 2, 0, Math.PI * 2); ctx.fill();
    });
  }
}
function scheduleDraw() { if (!frame) frame = requestAnimationFrame(draw); }
function pointFromEvent(event: PointerEvent): Point {
  const rect = ink.getBoundingClientRect();
  // DOM/CSS size, HiDPI backing pixels, and PDF units are deliberately separate.
  const x = Math.max(0, Math.min(viewport.width, (event.clientX - rect.left) * viewport.width / rect.width));
  const y = Math.max(0, Math.min(viewport.height, (event.clientY - rect.top) * viewport.height / rect.height));
  return { ...inversePoint(x, y, viewport.transform), pressure: event.pointerType === 'pen' ? Math.max(.1, event.pressure || .5) : .5 };
}
function finishGesture(cancel = false) {
  if (pointer === null) return;
  const id = pointer;
  pointer = null;
  if (beforeGesture) {
    if (cancel) history().strokes = beforeGesture;
    else {
      if (activeStroke) history().strokes = [...history().strokes, activeStroke];
      if (activeStroke || history().strokes !== beforeGesture) {
        commitGesture(history(), beforeGesture);
        savePage();
      }
    }
  }
  activeStroke = null; beforeGesture = null; pan = null;
  if (ink.hasPointerCapture(id)) ink.releasePointerCapture(id);
  scheduleDraw(); refreshControls();
}
function addPoint(event: PointerEvent) {
  const point = pointFromEvent(event);
  if (activeStroke) {
    const last = activeStroke.points.at(-1);
    if (!last || Math.hypot(last.x - point.x, last.y - point.y) > .1) activeStroke.points.push(point);
  } else if (tool === 'eraser') {
    const radius = 12 / Math.hypot(viewport.transform[0], viewport.transform[1]);
    const filtered = history().strokes.filter(stroke => !hitsStroke(point, stroke, radius));
    if (filtered.length !== history().strokes.length) history().strokes = filtered;
  }
}
ink.addEventListener('pointerdown', event => {
  if (busy || !initialized || pointer !== null || (event.pointerType === 'mouse' && event.button !== 0)) return;
  if (tool === 'move') {
    if (event.pointerType !== 'mouse') return; // Native touch scrolling and pinch zoom.
    pointer = event.pointerId;
    pan = { x: event.clientX, y: event.clientY, left: scroller.scrollLeft, top: scroller.scrollTop };
  } else {
    if (penOnly.checked && event.pointerType === 'touch') return;
    pointer = event.pointerId;
    beforeGesture = history().strokes;
    if (tool === 'pen') activeStroke = { color: color.value, width: Number(width.value), points: [] };
    addPoint(event); scheduleDraw();
  }
  event.preventDefault(); ink.setPointerCapture(event.pointerId);
});
ink.addEventListener('pointermove', event => {
  if (event.pointerId !== pointer) return;
  if (pan) { scroller.scrollLeft = pan.left - event.clientX + pan.x; scroller.scrollTop = pan.top - event.clientY + pan.y; return; }
  const events = event.getCoalescedEvents?.() ?? [];
  for (const sample of events.length ? events : [event]) addPoint(sample);
  scheduleDraw();
});
ink.addEventListener('pointerup', event => { if (event.pointerId === pointer) { if (!pan) addPoint(event); finishGesture(); } });
ink.addEventListener('pointercancel', event => { if (event.pointerId === pointer) finishGesture(true); });
ink.addEventListener('lostpointercapture', event => { if (event.pointerId === pointer) finishGesture(true); });
ink.addEventListener('contextmenu', event => event.preventDefault());
app.querySelectorAll<HTMLButtonElement>('[data-tool]').forEach(control => control.addEventListener('click', () => {
  finishGesture(); tool = control.dataset.tool!;
  app.querySelectorAll('[data-tool]').forEach(item => item.setAttribute('aria-pressed', String((item as HTMLElement).dataset.tool === tool)));
  ink.style.touchAction = tool === 'move' ? 'pan-x pan-y pinch-zoom' : 'none';
  ink.style.cursor = tool === 'move' ? 'grab' : tool === 'eraser' ? 'cell' : 'crosshair';
}));
async function renderPage(target = pageNumber, scale = zoom) {
  if (busy) return;
  finishGesture(); busy = true; refreshControls();
  const previous = pageNumber;
  try {
    const page = await doc.getPage(target);
    if (!histories.has(target)) {
      let strokes: Stroke[] = [];
      if (db) strokes = await readPage(db, `${docKey}:${target}`);
      histories.set(target, { strokes, undo: [], redo: [] });
    }
    const nextViewport = page.getViewport({ scale });
    // Render offscreen and swap atomically: never show new ink on an old PDF page.
    const rendered = document.createElement('canvas');
    const dpr = Math.min(window.devicePixelRatio || 1, 2, 4096 / Math.max(nextViewport.width, nextViewport.height));
    rendered.width = Math.ceil(nextViewport.width * dpr); rendered.height = Math.ceil(nextViewport.height * dpr);
    await page.render({ canvas: rendered, viewport: nextViewport, transform: [rendered.width / nextViewport.width, 0, 0, rendered.height / nextViewport.height, 0, 0] }).promise;
    pageNumber = target; zoom = scale; viewport = nextViewport;
    canvas.width = ink.width = rendered.width; canvas.height = ink.height = rendered.height;
    paper.style.width = `${viewport.width}px`; paper.style.height = `${viewport.height}px`;
    canvas.getContext('2d')!.drawImage(rendered, 0, 0);
    draw();
    if (previous !== target) scroller.scrollTo(0, 0);
    message.textContent = '펜으로 생각을 적어 보세요. 확대해도 필기 위치는 유지됩니다.';
  } catch (error) {
    console.error(error);
    message.textContent = '페이지를 표시하지 못했습니다. 페이지 이동 또는 확대 버튼으로 다시 시도하세요.';
  } finally { busy = !viewport; refreshControls(); }
}
button('previous-page').addEventListener('click', () => { if (pageNumber > 1) void renderPage(pageNumber - 1); });
button('next-page').addEventListener('click', () => { if (pageNumber < doc.numPages) void renderPage(pageNumber + 1); });
button('zoom-in').addEventListener('click', () => void renderPage(pageNumber, Math.min(3, +(zoom + .2).toFixed(2))));
button('zoom-out').addEventListener('click', () => void renderPage(pageNumber, Math.max(.4, +(zoom - .2).toFixed(2))));
async function fit() {
  if (busy) return;
  const page = await doc.getPage(pageNumber);
  const base = page.getViewport({ scale: 1 });
  await renderPage(pageNumber, Math.max(.4, Math.min(2, (scroller.clientWidth - 32) / base.width)));
}
button('fit-page').addEventListener('click', () => void fit());
for (const action of ['undo', 'redo'] as const) button(action).addEventListener('click', () => {
  finishGesture();
  if (!travelHistory(history(), action)) return;
  draw(); savePage(); refreshControls();
});
button('export-pdf').addEventListener('click', async () => {
  finishGesture(); busy = true; refreshControls(); message.textContent = '필기를 포함한 PDF를 만들고 있습니다…';
  try {
    await saveQueue;
    const pages = new Map<number, Stroke[]>();
    for (let n = 1; n <= doc.numPages; n++) pages.set(n, histories.get(n)?.strokes ?? (db ? await readPage(db, `${docKey}:${n}`) : []));
    const { exportAnnotatedPdf } = await import('./export');
    const bytes = await exportAnnotatedPdf(source, pages);
    const url = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: 'application/pdf' }));
    const link = document.createElement('a'); link.href = url; link.download = `${app.dataset.title || '학습지'}-나의-필기.pdf`;
    document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 60000);
    message.textContent = '필기 포함 PDF 다운로드를 요청했습니다. 다운로드 목록을 확인하세요.';
  } catch (error) { console.error(error); message.textContent = 'PDF 다운로드에 실패했습니다. 필기는 그대로 유지됩니다. 다시 시도해 주세요.'; }
  finally { busy = false; refreshControls(); }
});
window.addEventListener('beforeunload', event => {
  if (pendingSaves || saveFailed || (pointer !== null && beforeGesture)) { event.preventDefault(); event.returnValue = ''; }
});
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') finishGesture(); });
async function start() {
  try {
    try { db = await openStorage(); status.textContent = '이 브라우저에 자동 저장'; }
    catch { status.textContent = '자동 저장 불가 · PDF로 내려받아 보관하세요.'; }
    const sourceUrl = app.dataset.sourceUrl;
    if (sourceUrl) {
      const response = await fetch(sourceUrl);
      if (!response.ok) throw new Error('PDF fetch failed');
      source = new Uint8Array(await response.arrayBuffer());
    } else {
      const { createBlankWorksheet } = await import('./blank');
      source = await createBlankWorksheet();
    }
    doc = await getDocument({ data: source.slice() }).promise;
    docKey = sourceUrl ? `${app.dataset.storageKey}:${doc.fingerprints[0]}` : app.dataset.storageKey!;
    // Restore before permitting any gesture, so old notes cannot be overwritten.
    histories.set(1, { strokes: db ? await readPage(db, `${docKey}:1`) : [], undo: [], redo: [] });
    initialized = true; busy = false;
    await fit();
  } catch (error) {
    console.error(error);
    message.textContent = '학습지를 열지 못했습니다. 새로고침하거나 원본 PDF를 다운로드해 주세요.';
    busy = true; refreshControls();
  }
}
void start();
