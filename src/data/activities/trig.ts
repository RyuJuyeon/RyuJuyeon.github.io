import type { Activity } from './types';
export const trig: Activity = {
  course:'calculus-2',lesson:'trig-limits-derivatives',kind:'trig',title:'삼각함수의 미분',
  summary:'삼각함수의 미분 공식은 각을 라디안으로 나타낼 때 성립합니다. sin x의 도함수는 cos x이고, cos x의 도함수는 −sin x입니다. 접선의 기울기는 도함수에 해당 점의 x좌표를 대입한 값입니다.',
  formulas:['(sin x)′ = cos x', '(cos x)′ = −sin x', 'y = f(x)의 x = a에서 접선: y = f(a) + f′(a)(x − a)', '모든 각은 라디안으로 계산합니다.'],
  example:'f(x) = sin x이면 f′(0) = cos 0 = 1입니다. f(x) = cos x이면 f′(π/2) = −sin(π/2) = −1입니다.',
  guide:'sin x와 cos x를 선택하고 접점 a를 움직이세요. 초록색 원함수, 점선 도함수, 주황색 접선의 관계를 관찰하세요. 기울기가 0이 되는 점도 찾아보세요.',
  reflection:'sin x의 극대·극소에서 도함수와 접선은 어떻게 보이나요? cos x를 미분할 때 음수 부호가 필요한 이유를 그래프의 증가·감소와 연결해 설명하세요.',
  questions:[
    {id:'sin-zero',prompt:'f(x) = sin x에서 f′(0)은?',answer:1,explanation:'f′(x) = cos x이므로 cos 0 = 1입니다.'},
    {id:'sin-half',prompt:'f(x) = sin x에서 f′(π/2)는?',answer:0,explanation:'cos(π/2) = 0입니다. 접선은 수평입니다.'},
    {id:'cos-half',prompt:'f(x) = cos x에서 f′(π/2)는?',answer:-1,explanation:'f′(x) = −sin x이므로 −sin(π/2) = −1입니다.'},
    {id:'sin-third',prompt:'f(x) = sin x에서 f′(π/3)은?',answer:.5,explanation:'cos(π/3) = 1/2입니다.'},
  ],
};
