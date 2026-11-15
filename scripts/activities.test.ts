import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { activities } from '../src/data/activities';
import { courses } from '../src/data/courses';
import { entriesFor } from '../src/data/curriculum';
import { circlePoint, exponentialValue, quadraticSlopes, ellipseState, trigValue, trigSlope, probabilityStats, rollDice, gradeAnswer } from '../src/lib/activities/math';
const close = (a:number,b:number) => assert.ok(Math.abs(a-b)<1e-9, `${a} ≠ ${b}`);
test('grading accepts exact values, fractions, signed decimals and rounded thirds; rejects missing and invalid input',()=>{
  for(const activity of activities) for(const q of activity.questions) {
    assert.equal(gradeAnswer(String(q.answer),q.answer),'correct');
    assert.equal(gradeAnswer(String(q.answer+1),q.answer),'incorrect');
  }
  assert.equal(gradeAnswer('1/3',1/3),'correct');
  assert.equal(gradeAnswer('0.333',1/3),'correct');
  assert.equal(gradeAnswer('0.33',1/3),'incorrect');
  assert.equal(gradeAnswer('−1',-1),'correct');
  assert.equal(gradeAnswer('１／２',.5),'correct');
  assert.equal(gradeAnswer('',0),'empty');
  for(const raw of ['1/0','NaN','Infinity','alert(1)','1+1','0x10','1/2/3']) assert.equal(gradeAnswer(raw,0),'invalid');
});
test('all 24 answers match independently calculated formulas',()=>{
  const expected = [[2,-1,Math.sqrt(25),4**2],[2**3,2**-2,(1/3)**0,Math.sqrt(9)],[(3**2-1)/(3-1),2*3,3,2*(-2)],[3/6,2/6,28/50,0],[2*Math.sqrt(25),Math.sqrt(25-9),2*5,Math.sqrt(25-9)],[Math.cos(0),Math.cos(Math.PI/2),-Math.sin(Math.PI/2),Math.cos(Math.PI/3)]];
  activities.slice(0,6).forEach((a,i)=>a.questions.slice(0,4).forEach((q,j)=>close(q.answer,expected[i][j])));
});
test('circle and ellipse points satisfy their equations, focus distances and scale constraints',()=>{
  for(const a of [-2,0,2]) for(const b of [-2,0,2]) for(const r of [.5,2,3]) for(let t=0;t<7;t+=.2){
    const p=circlePoint(a,b,r,t);close((p.x-a)**2+(p.y-b)**2,r*r);
  }
  for(const a of [3.5,4,5]) for(const b of [1,2,3]) for(let t=0;t<7;t+=.2){
    const s=ellipseState(a,b,t);close(s.x*s.x/(a*a)+s.y*s.y/(b*b),1);close(s.d1+s.d2,2*a);close(s.c*s.c,a*a-b*b);
  }
  assert.throws(()=>ellipseState(2,3,0));
});
test('exponentials and derivative labs agree with definitions at slider boundaries and both signs of h',()=>{
  for(const a of [.25,.5,1,2,3]){close(exponentialValue(a,0),1);close(exponentialValue(a,-2),1/exponentialValue(a,2));}
  for(const a of [-2,0,1,2])for(const h of [-1,-.1,-.01,.01,.1,1]){
    const s=quadraticSlopes(a,h);close(s.secant,((a+h)**2-a*a)/h);close(s.tangent,2*a);
  }
  assert.throws(()=>quadraticSlopes(1,0));
  for(const kind of ['sin','cos'])for(const a of [-Math.PI,-1,0,Math.PI/2,Math.PI]){
    const numerical=(trigValue(kind,a+1e-5)-trigValue(kind,a-1e-5))/(2e-5);
    close(numerical,trigSlope(kind,a));
  }
});
test('dice counts, event changes and zero-trial states are mathematically consistent',()=>{
  assert.equal(probabilityStats([0,0,0,0,0,0],'even').frequency,null);
  let i=0;const counts=rollDice([0,0,0,0,0,0],60,()=>((i++%6)+.1)/6);
  assert.deepEqual(counts,[10,10,10,10,10,10]);
  close(probabilityStats(counts,'even').frequency!,1/2);
  close(probabilityStats(counts,'large').frequency!,1/3);
  close(probabilityStats(counts,'six').frequency!,1/6);
  assert.equal(probabilityStats(counts,'six').total,60);
});
test('published lessons render questions, labs, reflection and PDF links, and are discoverable from their courses',()=>{
  assert.equal(activities.length,9);
  for(const activity of activities){
    const course=courses.find(c=>c.slug===activity.course)!;
    const lesson=entriesFor(course).find(e=>e.lesson.slug===activity.lesson)!.lesson;
    assert.ok(lesson.concept);assert.equal(lesson.lab.status,'ready');assert.equal(lesson.assessment.status,'ready');assert.equal(lesson.answers.status,'ready');
    const html=fs.readFileSync(path.join('dist','subjects',activity.course,activity.lesson,'index.html'),'utf8');
    assert.ok(html.includes('class="activity-plot"'));assert.ok(html.includes('class="student-reflection"'));
    assert.ok(html.includes(`/worksheets/${activity.course}/${activity.lesson}/`));
    assert.ok(html.includes('id="lab"'));assert.ok(html.includes('id="assessment"'));assert.ok(html.includes('id="answers"'));
    for(const q of activity.questions)assert.ok(html.includes(`id="answer-${q.id}"`));
    const overview=fs.readFileSync(path.join('dist','subjects',activity.course,'index.html'),'utf8');
    assert.ok(overview.includes(`href="/subjects/${activity.course}/${activity.lesson}/"`));
  }
});
