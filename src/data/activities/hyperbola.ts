import type { Activity } from './types';
export const hyperbola: Activity = {
  course:'geometry', lesson:'hyperbola', kind:'hyperbola', title:'쌍곡선',
  summary:'쌍곡선은 서로 다른 두 초점까지의 거리의 차의 절댓값이 일정한 점들의 집합입니다. 그 값 2a는 두 초점 사이의 거리 2c보다 작고 양수입니다. 두 갈래 곡선은 점근선에 가까워집니다.',
  formulas:['x²/a² − y²/b² = 1 (a, b > 0): c² = a² + b², 초점 (±c, 0)', '꼭짓점 (±a, 0), 주축의 길이 2a, |PF₁ − PF₂| = 2a', '점근선: y = ±(b/a)x', 'y²/a² − x²/b² = 1: 초점 (0, ±√(a² + b²)), 꼭짓점 (0, ±a)', 'x²/a² − y²/b² = 1 위의 점 (x₁, y₁)에서 접선: x₁x/a² − y₁y/b² = 1', '기울기가 m인 접선: y = mx ± √(a²m² − b²), 단 a²m² > b². 등호인 경우는 점근선입니다.'],
  example:'x²/9 − y²/4 = 1에서는 a = 3, b = 2, c = √13입니다. 두 초점까지 거리 차의 절댓값은 6이고 점근선은 y = ±(2/3)x입니다.',
  guide:'a, b와 점의 위치 t, 좌우 가지를 바꾸세요. 두 초점까지 거리 차의 절댓값이 2a인지 확인하세요. 보라 점선은 점근선, 주황 실선은 P에서의 접선입니다.',
  reflection:'왼쪽 가지와 오른쪽 가지에서 PF₁ − PF₂의 부호는 어떻게 달라지나요? 절댓값이 필요한 이유와 점근선이 접선과 다른 이유를 설명해 보세요.',
  questions:[
    {id:'h-a',prompt:'교과서 45쪽 1 재구성: 초점이 (±7, 0), 거리 차의 절댓값이 10인 쌍곡선의 a²는?',answer:25,explanation:'2a = 10이므로 a = 5, a² = 25입니다.'},
    {id:'h-b',prompt:'같은 쌍곡선 x²/25 − y²/b² = 1의 b²는?',answer:24,explanation:'c² = a² + b²이므로 b² = 49 − 25 = 24입니다.'},
    {id:'h-axis',prompt:'교과서 45쪽 2(2) 재구성: 9x² − 4y² = 36의 주축의 길이는?',answer:4,explanation:'x²/4 − y²/9 = 1에서 a = 2이므로 주축의 길이는 4입니다.'},
    {id:'h-tangent',prompt:'개념 적용: x² − 2y² = 1 위의 점 (3, 2)에서 접선의 기울기는?',answer:.75,explanation:'접선은 3x − 4y = 1, 즉 y = (3/4)x − 1/4이므로 기울기는 3/4입니다.'},
  ],
};
