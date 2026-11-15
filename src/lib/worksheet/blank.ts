import { PDFDocument, rgb } from 'pdf-lib';
// A neutral scratchpad, not a fabricated concept worksheet. Update the storage version if layout changes.
export async function createBlankWorksheet() {
  const doc = await PDFDocument.create();
  doc.setCreationDate(new Date('2026-01-01T00:00:00Z'));
  doc.setModificationDate(new Date('2026-01-01T00:00:00Z'));
  for (let n = 0; n < 2; n++) {
    const page = doc.addPage([595.28, 841.89]);
    const color = rgb(.88, .91, .86);
    for (let x = 35; x <= 560; x += 21) page.drawLine({start:{x,y:35},end:{x,y:807},color,thickness:.4});
    for (let y = 35; y <= 807; y += 21) page.drawLine({start:{x:35,y},end:{x:560,y},color,thickness:.4});
  }
  return doc.save();
}
