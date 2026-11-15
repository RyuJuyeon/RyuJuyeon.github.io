import fs from 'node:fs/promises';
import path from 'node:path';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
const directory = process.argv[2];
if(!directory) throw new Error('Pass the source directory as the first argument');
await fs.mkdir('tmp/geometry', { recursive: true });
for (const filename of (await fs.readdir(directory)).filter(name => name.endsWith('.pdf'))) {
  const task = getDocument({ data: new Uint8Array(await fs.readFile(path.join(directory, filename))), cMapUrl: path.resolve('node_modules/pdfjs-dist/cmaps') + '/', cMapPacked: true, standardFontDataUrl: path.resolve('node_modules/pdfjs-dist/standard_fonts') + '/' });
  const doc = await task.promise;
  const pages = [];
  for (let n = 1; n <= doc.numPages; n++) {
    const page = await doc.getPage(n);
    const text = (await page.getTextContent()).items.map(item => item.str ?? '').join(' ');
    pages.push({ page: n, text });
  }
  await fs.writeFile(path.join('tmp/geometry', filename + '.json'), JSON.stringify(pages, null, 2));
  console.log(filename, doc.numPages, 'pages');
  await task.destroy();
}
