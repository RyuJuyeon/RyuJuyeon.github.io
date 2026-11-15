import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { PDFDocument } from 'pdf-lib';
// Explicit source directory argument; never required at deployment/build time.
const directory=process.argv[2];
if(!directory) throw new Error('Usage: node scripts/prepare-geometry-materials.mjs <source-directory>');
const output='public/materials/geometry';
await mkdir(output,{recursive:true});
const source=await PDFDocument.load(await readFile(path.join(directory,'교과서 PDF(1단원).pdf')));
if(source.getPageCount()!==69) throw new Error('Unexpected source edition/page count; verify page ranges first');
for(const [slug,start,end] of [['parabola',3,18],['ellipse',19,34],['hyperbola',35,54],['chapter-1-answers',61,69]]) {
  const doc=await PDFDocument.create();
  const pages=await doc.copyPages(source,Array.from({length:end-start+1},(_,i)=>start-1+i));
  pages.forEach(page=>doc.addPage(page));
  doc.setTitle(`기하 Ⅰ. 이차곡선 · ${slug}`);
  await writeFile(`${output}/${slug}${slug==='chapter-1-answers'?'':'-textbook'}.pdf`,await doc.save());
}
for(const [slug,number,name] of [['parabola','1','포물선'],['ellipse','2','타원'],['hyperbola','3','쌍곡선']]) {
  await copyFile(path.join(directory,`개념 정리 PPT_Ⅰ-${number}_${name}.pptx`),`${output}/${slug}-concept.pptx`);
  await copyFile(path.join(directory,`Ⅰ-${number}_${name}_문제 PPT(천재교과서_기하(전인태)).pptx`),`${output}/${slug}-problems.pptx`);
}
console.log('Prepared 4 PDFs and 6 original PPTX files.');
