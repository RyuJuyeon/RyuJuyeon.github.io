import type { Activity } from '../../data/activities/types';
import { circlePoint, exponentialValue, quadraticSlopes, ellipseState, trigValue, trigSlope, probabilityStats, rollDice, eventFaces, gradeAnswer } from './math';
import { parabolaState, hyperbolaState } from './conics';
const ns = 'http://www.w3.org/2000/svg';
const format = (n: number) => Math.abs(n) < .00005 ? '0' : Number(n.toFixed(4)).toString();
for (const root of document.querySelectorAll<HTMLElement>('[data-activity]')) {
  const activity: Activity = JSON.parse(root.dataset.activity!);
  const svg = root.querySelector<SVGSVGElement>('.activity-plot')!;
  const readout = root.querySelector<HTMLOutputElement>('.lab-readout')!;
  const controls = [...root.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-param]')];
  const defaults = controls.map(input => input.value);
  let counts = [0,0,0,0,0,0];
  const value = (name: string) => controls.find(input => input.dataset.param === name)!.value;
  const number = (name: string) => Number(value(name));
  const element = (tag: string, attrs: Record<string,string|number>, text?: string, parent: SVGElement = svg) => {
    const node = document.createElementNS(ns,tag);
    for (const [key,val] of Object.entries(attrs)) node.setAttribute(key,String(val));
    if (text !== undefined) node.textContent = text;
    parent.append(node); return node;
  };
  function render() {
    svg.replaceChildren();
    for (const input of controls) {
      const output = root.querySelector<HTMLOutputElement>(`[data-value="${input.dataset.param}"]`);
      if (output) output.value = input.value;
    }
    if (activity.kind === 'probability') {
      const stats = probabilityStats(counts,value('event'));
      const max = Math.max(1,...counts), selected = eventFaces(value('event'));
      counts.forEach((count,index)=>{
        const height = count/max*280;
        element('rect',{x:65+index*82,y:335-height,width:48,height,fill:selected.includes(index+1)?'#35724b':'#aebba6'});
        element('text',{x:89+index*82,y:360,'text-anchor':'middle',fill:'#405a38','font-size':15},String(index+1));
        element('text',{x:89+index*82,y:325-height,'text-anchor':'middle',fill:'#405a38','font-size':14},String(count));
        root.querySelector(`[data-face="${index+1}"]`)!.textContent=String(count);
      });
      element('text',{x:25,y:25,fill:'#405a38','font-size':13},'눈별 발생 횟수 (막대 위 숫자)');
      readout.value=`시행 ${stats.total}회 · 사건 발생 ${stats.successes}회\n이론적 확률: ${format(stats.theoretical)} · 상대도수: ${stats.frequency===null?'아직 시행하지 않음':format(stats.frequency)}${stats.frequency===null?'':`\n절대 오차: ${format(Math.abs(stats.frequency-stats.theoretical))}`}`;
      return;
    }
    const kind = activity.kind;
    const bounds = ['circle','parabola','hyperbola'].includes(kind)?[-9,9,-6,6]:kind==='ellipse'?[-6,6,-4,4]:kind==='exponential'?[-3.5,3.5,-1,10]:kind==='derivative'?[-3.5,3.5,-2,10]:[-Math.PI*1.2,Math.PI*1.2,-2.3,2.3];
    const [xmin,xmax,ymin,ymax]=bounds;
    // Equal x/y scale for circle and ellipse: 516/12 == 344/8.
    const X=(x:number)=>42+(x-xmin)/(xmax-xmin)*516;
    const Y=(y:number)=>372-(y-ymin)/(ymax-ymin)*344;
    const clipId=`clip-${activity.kind}`;
    const defs=element('defs',{}); const clip=element('clipPath',{id:clipId},undefined,defs);
    element('rect',{x:42,y:28,width:516,height:344},undefined,clip);
    const plot=element('g',{'clip-path':`url(#${clipId})`});
    const line=(x1:number,y1:number,x2:number,y2:number,color='#cddbc5',dash='')=>element('line',{x1:X(x1),y1:Y(y1),x2:X(x2),y2:Y(y2),stroke:color,'stroke-width':color==='#cddbc5'?.7:1.5,'stroke-dasharray':dash},undefined,plot);
    for(let x=Math.ceil(xmin);x<=xmax;x++) {line(x,ymin,x,ymax); element('text',{x:X(x),y:Math.min(389,Y(0)+17),'text-anchor':'middle','font-size':10,fill:'#66765e'},String(x));}
    for(let y=Math.ceil(ymin);y<=ymax;y++) {line(xmin,y,xmax,y);if(y!==0)element('text',{x:Math.max(18,X(0)-8),y:Y(y)+3,'text-anchor':'end','font-size':10,fill:'#66765e'},String(y));}
    line(xmin,0,xmax,0,'#7a8f70');line(0,ymin,0,ymax,'#7a8f70');
    element('text',{x:555,y:Y(0)+4,'font-size':11,fill:'#405a38'},kind==='trig'?'x(rad)':'x');
    element('text',{x:X(0)+8,y:20,'font-size':13,fill:'#405a38'},'y');
    const dot=(x:number,y:number,label:string,color='#287149')=>{element('circle',{cx:X(x),cy:Y(y),r:4,fill:color},undefined,plot);element('text',{x:X(x)+8,y:Y(y)-8,fill:color,'font-size':12},label,plot);};
    const path=(points:{x:number;y:number}[],color='#287149',dash='')=>element('path',{d:points.map((p,i)=>`${i?'L':'M'}${X(p.x)},${Y(p.y)}`).join(' '),fill:'none',stroke:color,'stroke-width':2.4,'stroke-dasharray':dash},undefined,plot);
    const curve=(fn:(x:number)=>number,color='#287149',dash='')=>path(Array.from({length:401},(_,i)=>{const x=xmin+(xmax-xmin)*i/400;return{x,y:fn(x)};}),color,dash);
    // Ax + By = C, including vertical tangents at vertices; no division by zero.
    const tangent=(A:number,B:number,C:number)=>Math.abs(B)<1e-10?line(C/A,ymin,C/A,ymax,'#bd762b'):line(xmin,(C-A*xmin)/B,xmax,(C-A*xmax)/B,'#bd762b');
    if(kind==='circle') {
      const a=number('a'),b=number('b'),r=number('r');
      path(Array.from({length:201},(_,i)=>circlePoint(a,b,r,Math.PI*2*i/200)));
      dot(a,b,'C');line(a,b,a+r,b,'#bd762b');dot(a+r,b,'P','#bd762b');
      readout.value=`중심 C = (${format(a)}, ${format(b)}) · 반지름 r = ${format(r)}\n(x − (${format(a)}))² + (y − (${format(b)}))² = ${format(r*r)}\n넓이 = ${format(r*r)}π ≈ ${format(Math.PI*r*r)}`;
    } else if(kind==='exponential') {
      const a=number('base'),x=number('x'),y=exponentialValue(a,x);curve(t=>exponentialValue(a,t));dot(0,1,'(0, 1)');dot(x,y,'P','#bd762b');
      readout.value=`y = ${format(a)}ˣ · 관찰점 (${format(x)}, ${format(y)})\n${a===1?'a = 1: y = 1인 상수함수로, 여기서 정의한 지수함수에서 제외합니다.':a>1?'밑이 1보다 커서 증가합니다.':'밑이 0과 1 사이이므로 감소합니다.'}${y>ymax?'\n관찰점이 표시 범위(y ≤ 10)를 벗어났습니다. 수치는 위에서 확인하세요.':''}`;
    } else if(kind==='derivative') {
      const a=number('a'),h=number('h'),s=quadraticSlopes(a,h);curve(x=>x*x);curve(x=>a*a+s.secant*(x-a),'#498459','6 3');curve(x=>a*a+s.tangent*(x-a),'#bd762b');dot(a,a*a,'A');dot(a+h,(a+h)**2,'B');
      readout.value=`f(x) = x² · a = ${a} · h = ${h}\n평균변화율 = 2a + h = ${format(s.secant)}\n미분계수 f′(a) = 2a = ${format(s.tangent)} · 차이 = ${format(s.secant-s.tangent)}`;
    } else if(kind==='parabola') {
      const p=number('p'),s=parabolaState(p,number('t'));
      path(Array.from({length:301},(_,i)=>{const y=ymin+(ymax-ymin)*i/300;return{x:y*y/(4*p),y};}));
      line(-p,ymin,-p,ymax,'#8056a0','5 4');line(p,0,s.x,s.y,'#bd762b');line(-p,s.y,s.x,s.y,'#bd762b');
      tangent(-2*p,s.y,2*p*s.x);dot(p,0,'F');dot(-p,s.y,'H');dot(s.x,s.y,'P','#bd762b');
      readout.value=`y² = ${format(4*p)}x · 초점 F = (${p}, 0) · 준선 x = ${-p}\nP = (${format(s.x)}, ${format(s.y)})\nPF = ${format(s.focusDistance)} · PH = ${format(s.directrixDistance)}\n접선: (${format(s.y)})y = ${format(2*p)}(x + (${format(s.x)}))`;
    } else if(kind==='hyperbola') {
      const a=number('a'),b=number('b'),s=hyperbolaState(a,b,number('t'),number('branch'));
      for(const branch of [-1,1]) path(Array.from({length:401},(_,i)=>{const y=ymin+(ymax-ymin)*i/400;return{x:branch*a*Math.sqrt(1+y*y/(b*b)),y};}));
      line(xmin,b/a*xmin,xmax,b/a*xmax,'#8056a0','5 4');line(xmin,-b/a*xmin,xmax,-b/a*xmax,'#8056a0','5 4');
      line(-s.c,0,s.x,s.y,'#bd762b');line(s.c,0,s.x,s.y,'#bd762b');tangent(s.x/(a*a),-s.y/(b*b),1);
      dot(-s.c,0,'F₁');dot(s.c,0,'F₂');dot(s.x,s.y,'P','#bd762b');
      readout.value=`x²/${format(a*a)} − y²/${format(b*b)} = 1 · c = ${format(s.c)}\nP = (${format(s.x)}, ${format(s.y)})\nPF₁ = ${format(s.d1)} · PF₂ = ${format(s.d2)}\n|PF₁ − PF₂| = ${format(Math.abs(s.d1-s.d2))} = 2a\n점근선: y = ±${format(b/a)}x · 접선: (${format(s.x/(a*a))})x − (${format(s.y/(b*b))})y = 1`;
    } else if(kind==='ellipse') {
      const a=number('a'),b=number('b'),state=ellipseState(a,b,number('theta'));
      path(Array.from({length:241},(_,i)=>({x:a*Math.cos(i*Math.PI/120),y:b*Math.sin(i*Math.PI/120)})));
      dot(-state.c,0,'F₁');dot(state.c,0,'F₂');dot(state.x,state.y,'P','#bd762b');line(-state.c,0,state.x,state.y,'#bd762b');line(state.c,0,state.x,state.y,'#bd762b');
      tangent(state.x/(a*a),state.y/(b*b),1);
      readout.value=`x²/${format(a*a)} + y²/${format(b*b)} = 1 · c = ${format(state.c)}\nP = (${format(state.x)}, ${format(state.y)})\nPF₁ = ${format(state.d1)} · PF₂ = ${format(state.d2)}\n거리의 합 = ${format(state.d1+state.d2)} = 2a`;
    } else {
      const fn=value('function'),a=number('a'),slope=trigSlope(fn,a),y=trigValue(fn,a);
      curve(x=>trigValue(fn,x));curve(x=>trigSlope(fn,x),'#8056a0','5 4');curve(x=>y+slope*(x-a),'#bd762b');dot(a,y,'P');
      readout.value=`f(x) = ${fn} x · a = ${format(a)} rad\nf(a) = ${format(y)} · f′(a) = ${format(slope)}\n접선: y = ${format(y)} + (${format(slope)})(x − (${format(a)}))`;
    }
  }
  controls.forEach(input=>input.addEventListener('input',render));
  root.querySelectorAll<HTMLButtonElement>('[data-roll]').forEach(button=>button.addEventListener('click',()=>{counts=rollDice(counts,Number(button.dataset.roll));render();}));
  root.querySelector('.lab-reset')!.addEventListener('click',()=>{controls.forEach((input,i)=>input.value=defaults[i]);counts=[0,0,0,0,0,0];render();});
  render();

  const form=root.querySelector<HTMLFormElement>('.activity-quiz')!;
  const reflection=root.querySelector<HTMLTextAreaElement>('.student-reflection')!;
  const saveStatus=root.querySelector<HTMLElement>('.response-save')!;
  const score=root.querySelector<HTMLOutputElement>('.quiz-score')!;
  const key=`math-activity-v1:${activity.course}:${activity.lesson}`;
  const inputFor=(id:string)=>form.elements.namedItem(id) as HTMLInputElement;
  try {
    const saved=JSON.parse(localStorage.getItem(key)||'null');
    if(saved && typeof saved==='object') {
      reflection.value=typeof saved.reflection==='string'?saved.reflection.slice(0,10000):'';
      activity.questions.forEach(q=>{if(typeof saved.answers?.[q.id]==='string')inputFor(q.id).value=saved.answers[q.id].slice(0,80);});
      saveStatus.textContent='이전에 작성한 답안과 탐구 기록을 복원했습니다.';
    }
  } catch {saveStatus.textContent='저장소를 읽을 수 없습니다. 기록을 텍스트로 다운로드해 보관하세요.';}
  function save() {
    try {localStorage.setItem(key,JSON.stringify({answers:Object.fromEntries(activity.questions.map(q=>[q.id,inputFor(q.id).value])),reflection:reflection.value}));saveStatus.textContent='답안과 탐구 기록이 이 브라우저에 저장됨';}
    catch {saveStatus.textContent='자동 저장 실패 · 기록을 텍스트로 다운로드해 보관하세요.';}
  }
  form.addEventListener('input',event=>{const input=event.target as HTMLInputElement;if(input.name){const feedback=root.querySelector<HTMLElement>(`#feedback-${input.name}`)!;feedback.textContent='';delete feedback.dataset.result;input.removeAttribute('aria-invalid');score.value='답안이 변경되었습니다. 다시 채점하세요.';}save();});
  reflection.addEventListener('input',save);
  form.addEventListener('submit',event=>{
    event.preventDefault();let correct=0;
    activity.questions.forEach(q=>{
      const input=inputFor(q.id),result=gradeAnswer(input.value,q.answer),feedback=root.querySelector<HTMLElement>(`#feedback-${q.id}`)!;
      feedback.dataset.result=result;
      feedback.textContent=result==='correct'?`정답입니다. ${q.explanation}`:result==='empty'?'답을 입력해 주세요.':result==='invalid'?'숫자 또는 분수 형식으로 입력해 주세요. 0으로 나눌 수 없습니다.':'다시 생각해 보세요. 아래 정답·해설에서 풀이를 확인할 수 있습니다.';
      input.setAttribute('aria-invalid',String(result!=='correct'));
      if(result==='correct')correct++;
    });
    score.value=`${activity.questions.length}문제 중 ${correct}문제 정답`;save();
  });
  root.querySelector('.response-download')!.addEventListener('click',()=>{
    const content=[activity.title,...activity.questions.map((q,i)=>`${i+1}. ${q.prompt}\n내 답: ${inputFor(q.id).value||'(미입력)'}`),'나의 탐구 기록',reflection.value].join('\n\n');
    const url=URL.createObjectURL(new Blob(['\ufeff'+content],{type:'text/plain;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;link.download=`${activity.title}-학습기록.txt`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
}

