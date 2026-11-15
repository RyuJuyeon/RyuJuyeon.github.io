import type { Activity } from './types';
export const exponential: Activity = {
  course:'algebra', lesson:'exponential-function', kind:'exponential', title:'지수함수',
  summary:'지수함수 y = aˣ에서 밑 a는 양수이고 1이 아닙니다. 정의역은 실수 전체, 치역은 양의 실수 전체입니다. 모든 그래프는 (0, 1)을 지나며, 밑에 따라 증가하거나 감소합니다.',
  formulas:['y = aˣ (a > 0, a ≠ 1)', 'a⁰ = 1, a⁻ˣ = 1/aˣ', 'a > 1이면 증가, 0 < a < 1이면 감소'],
  example:'y = 2ˣ는 x가 1만큼 증가할 때 함수값이 2배가 됩니다. y = (1/2)ˣ는 x가 1만큼 증가할 때 함수값이 절반이 됩니다.',
  guide:'밑 a와 관찰할 x를 바꾸며 그래프와 함수값을 비교하세요. a = 1일 때는 상수함수가 된다는 점도 확인하세요.',
  reflection:'a = 2와 a = 1/2의 그래프는 어떤 대칭 관계인가요? 모든 그래프가 (0, 1)을 지나는 이유를 설명하세요.',
  questions:[
    {id:'power',prompt:'y = 2ˣ에서 x = 3일 때 y는?',answer:8,explanation:'2³ = 8입니다.'},
    {id:'negative',prompt:'y = 2ˣ에서 x = −2일 때 y는? (분수 입력 가능)',answer:.25,explanation:'2⁻² = 1/2² = 1/4입니다.'},
    {id:'zero',prompt:'y = (1/3)ˣ에서 x = 0일 때 y는?',answer:1,explanation:'양수인 밑의 0제곱은 1입니다.'},
    {id:'base',prompt:'y = aˣ의 그래프가 (2, 9)를 지납니다. 양수인 밑 a는?',answer:3,explanation:'a² = 9이고 a > 0이므로 a = 3입니다.'},
  ],
};
