import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createCanvas } from '@napi-rs/canvas';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { exportAnnotatedPdf } from '../src/lib/worksheet/export';
await fs.mkdir('tmp/geometry',{recursive:true});
const options={cMapUrl:path.resolve('node_modules/pdfjs-dist/cmaps')+'/',cMapPacked:true,standardFontDataUrl:path.resolve('node_modules/pdfjs-dist/standard_fonts')+'/'};
const sheet=createCanvas(1200,1800);const context=sheet.getContext('2d');context.fillStyle='white';context.fillRect(0,0,1200,1800);
let index=0;
for(const slug of ['parabola-worksheet-v1','parabola-solutions-v1','ellipse-worksheet-v1','ellipse-solutions-v1','hyperbola-worksheet-v1','hyperbola-solutions-v1']) {
  const original=new Uint8Array(await fs.readFile(`public/materials/geometry/${slug}.pdf`));
  const task=getDocument({...options,data:original.slice()});const doc=await task.promise;
  assert.equal(doc.numPages,slug.includes('solutions')?1:3);
  for(let n=1;n<=doc.numPages;n++) {
    const page=await doc.getPage(n);const viewport=page.getViewport({scale:1});const canvas=createCanvas(Math.ceil(viewport.width),Math.ceil(viewport.height));
    await page.render({canvas:canvas as any,viewport}).promise;
    const text=(await page.getTextContent()).items.map((item:any)=>item.str??'').join('');
    assert.ok(text.includes('학습지')||text.includes('정답'));
    if(!slug.includes('solutions')) assert.ok(!text.includes('정답·해설'));
    await fs.writeFile(`tmp/geometry/${slug}-${n}.png`,canvas.toBuffer('image/png'));
    const col=index%3,row=Math.floor(index/3);index++;
    context.drawImage(canvas,col*400+42,row*450+5,310,438);
  }
  if(!slug.includes('solutions')) {
    const bytes=await exportAnnotatedPdf(original,new Map([[doc.numPages,[{color:'#ff0000',width:8,points:[{x:100,y:100,pressure:.5},{x:200,y:100,pressure:.5}]}]]]));
    const annotatedTask=getDocument({...options,data:bytes});const annotated=await annotatedTask.promise;
    assert.equal(annotated.numPages,doc.numPages);
    const page=await annotated.getPage(doc.numPages);const viewport=page.getViewport({scale:1});const canvas=createCanvas(Math.ceil(viewport.width),Math.ceil(viewport.height));
    await page.render({canvas:canvas as any,viewport}).promise;
    const [x,y]=viewport.convertToViewportPoint(150,100);const pixel=canvas.getContext('2d').getImageData(Math.round(x),Math.round(y),1,1).data;
    assert.ok(pixel[0]>230 && pixel[1]<30,`Missing exported ink: ${slug}`);
    await fs.writeFile(`tmp/geometry/${slug}-annotated.png`,canvas.toBuffer('image/png'));
    await annotatedTask.destroy();
  }
  console.log(`${slug}: all ${doc.numPages} pages rendered; ${slug.includes('solutions')?'answers verified':'annotated last-page export verified'}`);
  await task.destroy();
}
await fs.writeFile('tmp/geometry/deliverables-contact.png',sheet.toBuffer('image/png'));
