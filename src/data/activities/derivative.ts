import type { Activity } from './types';
export const derivative: Activity = {
  course:'calculus-1',lesson:'derivative-at-point',kind:'derivative',title:'미분계수',
  summary:'평균변화율은 두 점을 잇는 할선의 기울기입니다. 두 점 사이의 간격을 0으로 보낼 때 평균변화율의 극한이 존재하면 이를 미분계수라 합니다. 미분계수는 그 점에서 접선의 기울기입니다.',
  formulas:['평균변화율: [f(a + h) − f(a)] / h (h ≠ 0)', 'f′(a) = lim(h → 0) [f(a + h) − f(a)] / h', 'f(x) = x²이면 평균변화율 = 2a + h, f′(a) = 2a'],
  example:'f(x) = x²에서 a = 1, h = 0.1이면 평균변화율은 2.1입니다. h가 0에 가까워질수록 이 값은 미분계수 2에 가까워집니다.',
  guide:'f(x) = x²의 기준점 a를 바꾸고, 양수·음수인 h를 0에 가깝게 조절하세요. 초록색 할선과 주황색 접선의 기울기를 비교하세요. h = 0은 차분식의 분모가 0이므로 직접 대입하지 않습니다.',
  reflection:'같은 a에서 h가 양수일 때와 음수일 때 평균변화율이 미분계수에 어떻게 접근하나요? 두 방향의 극한을 비교해 보세요.',
  questions:[
    {id:'average',prompt:'f(x) = x²의 x = 1에서 x = 3까지 평균변화율은?',answer:4,explanation:'(9 − 1)/(3 − 1) = 4입니다.'},
    {id:'point',prompt:'f(x) = x²에서 f′(3)은?',answer:6,explanation:'f′(a) = 2a이므로 f′(3) = 6입니다.'},
    {id:'linear',prompt:'f(x) = 3x + 2에서 f′(1)은?',answer:3,explanation:'직선의 기울기는 항상 3이고, 평균변화율과 미분계수 모두 3입니다.'},
    {id:'negative',prompt:'f(x) = x²에서 f′(−2)는?',answer:-4,explanation:'2 × (−2) = −4입니다. 음수 기울기도 가능합니다.'},
  ],
};
