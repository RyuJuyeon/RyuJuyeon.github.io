import fs from 'node:fs/promises';
import path from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
if(!process.argv[2]) throw new Error('Pass the source textbook PDF path as the first argument');
await fs.mkdir('tmp/geometry',{recursive:true});
const task=getDocument({data:new Uint8Array(await fs.readFile(process.argv[2])),cMapUrl:path.resolve('node_modules/pdfjs-dist/cmaps')+'/',cMapPacked:true,standardFontDataUrl:path.resolve('node_modules/pdfjs-dist/standard_fonts')+'/'});
const doc=await task.promise;
for(const n of [6,14,22,30,38,48,61,63,66]){
  const page=await doc.getPage(n);const viewport=page.getViewport({scale:1.15});const canvas=createCanvas(Math.ceil(viewport.width),Math.ceil(viewport.height));
  await page.render({canvas,viewport}).promise;
  await fs.writeFile(`tmp/geometry/book-${n}.png`,canvas.toBuffer('image/png'));
}
await task.destroy();
