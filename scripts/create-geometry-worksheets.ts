import { PDFDocument, rgb, type PDFPage } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'node:fs/promises';
import { geometryWorksheets } from '../src/data/geometry-worksheets';
const fontBytes=await fs.readFile(process.env.WORKSHEET_FONT_PATH || 'C:/Windows/Fonts/malgun.ttf');
const green=rgb(.14,.35,.26),ink=rgb(.16,.19,.18),muted=rgb(.42,.46,.44),rule=rgb(.85,.88,.86);
await fs.mkdir('public/materials/geometry',{recursive:true});
for(const [slug,unit] of Object.entries(geometryWorksheets)) for(const answers of [false,true]) {
  const doc=await PDFDocument.create();doc.registerFontkit(fontkit);
  const font=await doc.embedFont(fontBytes,{subset:true});
  const text=(p:PDFPage,s:string,x:number,y:number,size=11,color=ink)=>{
    if(font.widthOfTextAtSize(s,size)>511) throw new Error(`Text overflow: ${s}`);
    p.drawText(s,{x,y,size,font,color});
  };
  const pageCount=answers?1:3;
  for(let n=0;n<pageCount;n++) {
    const p=doc.addPage([595.28,841.89]);
    p.drawRectangle({x:42,y:791,width:32,height:4,color:green});
    text(p,'고등 수학 탐구 아카이브  /  기하 · 이차곡선',42,772,10,green);
    text(p,`${unit.title} ${answers?'정답·해설':'문제 학습지'}`,42,736,24,green);
    text(p,answers?'문제 번호는 학생용 학습지와 같습니다.':'이름 __________________    날짜 __________________',42,708,10,muted);
    text(p,answers?'':'문제를 읽고 풀이 과정과 답을 직접 작성하세요.',42,686,10,muted);
    const questions=answers?unit.questions:unit.questions.slice(n*2,n*2+2);
    questions.forEach((q,i)=>{
      const top=answers?660-i*94:646-i*290;
      text(p,`${String(answers?i+1:n*2+i+1).padStart(2,'0')}  ${q.title}`,42,top,13,green);
      if(answers) {q.solution.forEach((s,j)=>text(p,s,42,top-24-j*18,10));return;}
      text(p,q.source,42,top-20,8,muted);
      q.lines.forEach((s,j)=>text(p,s,42,top-45-j*19));
      const bottom=top-252;
      if(q.grid) {
        text(p,'풀이 / 그래프 (축과 눈금은 직접 표시하세요)',42,top-109,9,muted);
        for(let x=42;x<=552;x+=17) p.drawLine({start:{x,y:bottom},end:{x,y:top-120},color:rule,thickness:.35});
        for(let y=bottom;y<=top-120;y+=17) p.drawLine({start:{x:42,y},end:{x:552,y},color:rule,thickness:.35});
      } else {
        text(p,'풀이 / 답',42,top-109,9,muted);
        for(let y=top-140;y>=bottom;y-=28) p.drawLine({start:{x:42,y},end:{x:553,y},color:rule,thickness:.45});
      }
    });
    text(p,'출처: 천재교과서 기하(전인태), Ⅰ. 이차곡선 · 일부 문항 재구성 / 자체 구성 표시',42,38,8,muted);
    text(p,`${n+1} / ${pageCount}`,520,20,9,muted);
  }
  doc.setTitle(`기하 ${unit.title} ${answers?'정답·해설':'문제 학습지'}`);doc.setAuthor('고등 수학 탐구 아카이브');
  await fs.writeFile(`public/materials/geometry/${slug}-${answers?'solutions':'worksheet'}-v1.pdf`,await doc.save());
}
console.log('Created 3 problem-only worksheets (3 pages each) and 3 separate answer sheets.');
