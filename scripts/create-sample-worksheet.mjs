import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'node:fs/promises';
const doc = await PDFDocument.create();
doc.registerFontkit(fontkit);
const fontPath = process.env.WORKSHEET_FONT_PATH || 'C:/Windows/Fonts/malgun.ttf';
const font = await doc.embedFont(await fs.readFile(fontPath), { subset: true });
const green = rgb(.14, .35, .26), gray = rgb(.39, .44, .4), rule = rgb(.84, .88, .83);
function text(page, value, x, y, size = 11, color = gray) { page.drawText(value, { x, y, size, font, color }); }
function base(number, title, subtitle) {
  const page = doc.addPage([595.28, 841.89]);
  page.drawRectangle({ x: 0, y: 826, width: 595.28, height: 16, color: green });
  text(page, '고등 수학 탐구 아카이브  /  공통수학Ⅰ', 42, 788, 10, green);
  text(page, title, 42, 750, 23, green);
  text(page, subtitle, 42, 723, 10);
  text(page, '이름: ____________________     학습 날짜: ____________________', 42, 690, 10);
  page.drawLine({ start: { x: 42, y: 674 }, end: { x: 553, y: 674 }, thickness: 1, color: rule });
  text(page, '직접 작성한 학습용 샘플 · 공식 성취기준이나 평가 문항이 아닙니다.', 42, 31, 8);
  text(page, `${number} / 2`, 527, 31, 9);
  return page;
}
function lines(page, top, count) {
  for (let i = 0; i < count; i++) page.drawLine({ start: { x: 48, y: top - i * 30 }, end: { x: 547, y: top - i * 30 }, thickness: .5, color: rule });
}
const first = base(1, '이차함수, 그래프로 이해하기', '개념을 확인하고 그래프를 그리며 나만의 설명을 써 보세요.');
text(first, '01  꼭짓점과 대칭축', 42, 642, 14, green);
text(first, 'y = 2(x - 1)² - 3의 꼭짓점과 대칭축을 구하고, 그래프를 그려 보세요.', 42, 617);
text(first, '꼭짓점: (          ,          )       대칭축: x =', 42, 586);
for (let x = 92; x <= 512; x += 28) first.drawLine({ start: { x, y: 287 }, end: { x, y: 539 }, color: rule, thickness: .5 });
for (let y = 287; y <= 539; y += 28) first.drawLine({ start: { x: 92, y }, end: { x: 512, y }, color: rule, thickness: .5 });
first.drawLine({ start: { x: 92, y: 399 }, end: { x: 512, y: 399 }, color: gray, thickness: 1 });
first.drawLine({ start: { x: 288, y: 287 }, end: { x: 288, y: 539 }, color: gray, thickness: 1 });
text(first, 'O', 275, 384, 9); text(first, 'x', 519, 394, 10); text(first, 'y', 296, 535, 10);
text(first, '한 칸을 1로 두고 그려 보세요.', 92, 267, 9);
text(first, '02  구간에서의 최대·최소', 42, 231, 14, green);
text(first, '위 함수에서 0 ≤ x ≤ 3일 때 최댓값과 최솟값을 구하세요.', 42, 206);
text(first, '꼭짓점과 양 끝점에서의 함수값을 비교하여 이유를 써 보세요.', 42, 186, 10);
lines(first, 158, 4);
const second = base(2, '계수의 변화, 나의 발견', '탐구 실험실에서 y = ax²의 계수 a를 바꾸고 관찰 결과를 기록하세요.');
text(second, '03  관찰 기록', 42, 642, 14, green);
const columns = [42, 115, 250, 405, 553];
for (const x of columns) second.drawLine({ start: { x, y: 416 }, end: { x, y: 610 }, color: rule, thickness: .7 });
for (const y of [610, 576, 536, 496, 456, 416]) second.drawLine({ start: { x: 42, y }, end: { x: 553, y }, color: rule, thickness: .7 });
text(second, 'a', 70, 589); text(second, '열리는 방향', 145, 589); text(second, 'a = 1과 폭 비교', 272, 589); text(second, '최댓값 / 최솟값', 420, 589);
['1', '2', '-1', '-2'].forEach((a, i) => text(second, a, 70, 551 - i * 40, 12));
text(second, '04  발견을 문장으로', 42, 381, 14, green);
text(second, 'a의 부호와 절댓값은 그래프에 어떤 영향을 주나요?', 42, 355);
lines(second, 325, 3);
text(second, '05  생각 넓히기', 42, 222, 14, green);
text(second, 'a = 0이면 왜 이차함수가 아닐까요? 식과 그래프로 설명해 보세요.', 42, 196);
lines(second, 166, 4);
doc.setTitle('공통수학Ⅰ 이차함수 탐구 학습지');
doc.setAuthor('고등 수학 탐구 아카이브');
await fs.mkdir('public/materials', { recursive: true });
await fs.writeFile('public/materials/quadratic-worksheet-v1.pdf', await doc.save());
console.log('Created 2-page Korean sample worksheet.');
