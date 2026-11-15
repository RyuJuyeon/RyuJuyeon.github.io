import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { PDFDocument } from 'pdf-lib';
import { parabolaState, hyperbolaState } from '../src/lib/activities/conics';
import { activities } from '../src/data/activities';
import { geometryMaterials } from '../src/data/geometry-materials';
const close=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
test('parabola focus/directrix distances and tangent equations agree for positive and negative p',()=>{
  for(const p of [-2,-1,-.5,.5,1,2]) for(const t of [-4,-2,0,2,4]) {
    const s=parabolaState(p,t);
    close(s.y*s.y,4*p*s.x);close(s.focusDistance,s.directrixDistance);
    close(s.y*s.y,2*p*(s.x+s.x));
    if(t!==0) {
      const m=2*p/t,intercept=p/m;
      // Substitute y=mx+n into y²=4px: discriminant must vanish.
      close((2*m*intercept-4*p)**2-4*m*m*intercept*intercept,0);
    } else close(s.x,0);
  }
  assert.throws(()=>parabolaState(0,1));
});
test('hyperbola distances, equation, and tangent double intersections hold on both branches',()=>{
  for(const a of [1,2,3]) for(const b of [1,2,3]) for(const t of [-1.2,0,1.2]) for(const branch of [-1,1]) {
    const s=hyperbolaState(a,b,t,branch);
    close(s.x*s.x/(a*a)-s.y*s.y/(b*b),1);close(Math.abs(s.d1-s.d2),2*a);
    close(s.c*s.c,a*a+b*b);
    if(t!==0) {
      const m=b*b*s.x/(a*a*s.y),n=-b*b/s.y;
      close(n*n,a*a*m*m-b*b);
      close((2*m*n/(b*b))**2-4*(1/(a*a)-m*m/(b*b))*(-n*n/(b*b)-1),0);
    } else close(Math.abs(s.x),a);
  }
  assert.throws(()=>hyperbolaState(0,1,0,1));
});
test('new source-based and tangent problems have independent correct answers',()=>{
  const expected: Record<string,number[]>={parabola:[16/4,-(-12/4),64/(-16),8/4],hyperbola:[(10/2)**2,7**2-5**2,2*Math.sqrt(36/9),3/4],tangents:[1,5,-1/4,Math.sqrt(4)]};
  for(const [slug,answers] of Object.entries(expected)) {
    const questions=activities.find(a=>a.course==='geometry' && a.lesson===slug)!.questions;
    assert.equal(questions.length,answers.length);questions.forEach((q,i)=>close(q.answer,answers[i]));
  }
  const extra=activities.find(a=>a.lesson==='ellipse')!.questions.slice(4);
  extra.forEach((q,i)=>close(q.answer,[Math.sqrt(100-64),2*Math.sqrt(144/9),3][i]));
});
test('problem worksheets, separate solutions and legacy handwriting are published',async()=>{
  for(const [slug,m] of Object.entries(geometryMaterials)) {
    const doc=await PDFDocument.load(fs.readFileSync(`public${m.pdf}`));assert.equal(doc.getPageCount(),3);
    assert.equal((await PDFDocument.load(fs.readFileSync(`public${m.answers}`))).getPageCount(),1);
    for(const page of doc.getPages()) {assert.ok(page.getWidth()>500);assert.ok(page.getHeight()>700);}
    for(const href of [m.concept,m.problems]) assert.ok(fs.readFileSync(`dist${href}`).subarray(0,2).equals(Buffer.from('PK')));
    const html=fs.readFileSync(`dist/worksheets/geometry/${slug}/index.html`,'utf8');assert.ok(html.includes(`data-source-url="${m.pdf}"`));
    const old=fs.readFileSync(`dist/worksheets/geometry/${slug}/notes/index.html`,'utf8');assert.ok(old.includes(`data-storage-key="geometry:${slug}:blank-v1"`));
    const previous=fs.readFileSync(`dist/worksheets/geometry/${slug}/previous/index.html`,'utf8');assert.ok(previous.includes(`data-source-url="${m.legacyPdf}"`));
    assert.ok(previous.includes(`data-storage-key="geometry:${slug}:pdf-v1"`));
    const lesson=fs.readFileSync(`dist/subjects/geometry/${slug}/index.html`,'utf8');assert.ok(lesson.includes(m.answers));assert.ok(!lesson.includes('교과서 PDF 제공'));
  }
  assert.equal((await PDFDocument.load(fs.readFileSync('public/materials/geometry/chapter-1-answers.pdf'))).getPageCount(),9);
  assert.ok(fs.existsSync('dist/pdfjs/cmaps/Adobe-Korea1-UCS2.bcmap'));
});
