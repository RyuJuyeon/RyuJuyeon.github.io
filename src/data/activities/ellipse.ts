import type { Activity } from './types';
export const ellipse: Activity = {
  course:'geometry',lesson:'ellipse',kind:'ellipse',title:'타원',
  summary:'타원은 두 초점까지의 거리의 합이 일정한 점들의 집합입니다. 중심이 원점이고 장축이 x축 위에 있을 때 장반경 a, 단반경 b와 초점 거리 c 사이에는 c² = a² − b²의 관계가 있습니다.',
  formulas:['x²/a² + y²/b² = 1 (a > b > 0)', '초점: (−c, 0), (c, 0), c = √(a² − b²)', '타원 위 점 P에서 PF₁ + PF₂ = 2a', '장축의 길이 2a, 단축의 길이 2b', '장축이 y축인 경우: x²/b² + y²/a² = 1 (a > b > 0), 초점 (0, ±√(a² − b²))', 'x²/a² + y²/b² = 1 위의 점 (x₁, y₁)에서 접선: x₁x/a² + y₁y/b² = 1', '기울기가 m인 접선: y = mx ± √(a²m² + b²)'],
  example:'x²/25 + y²/9 = 1에서 a = 5, b = 3, c = 4입니다. 초점은 (−4, 0), (4, 0)이고 거리의 합은 10입니다.',
  guide:'a, b와 점 P의 각도 θ를 바꾸세요. P = (a cos θ, b sin θ)의 위치가 달라도 두 초점까지 거리의 합이 2a인지 확인하세요. 주황 실선은 점 P에서의 접선입니다. 이 실험은 항상 a > b > 0을 유지합니다. 삼각함수는 점을 움직이는 도구이며 타원의 정의는 거리의 합입니다.',
  reflection:'P를 움직여도 거리의 합이 일정한 것을 확인했나요? a를 고정하고 b를 늘릴 때 초점은 어느 방향으로 움직이나요?',
  questions:[
    {id:'major',prompt:'x²/25 + y²/9 = 1인 타원의 장축의 길이는?',answer:10,explanation:'장반경 a = 5이므로 장축의 길이는 2a = 10입니다.'},
    {id:'focus',prompt:'위 타원의 양의 x축 위 초점의 x좌표는?',answer:4,explanation:'c = √(25 − 9) = 4입니다.'},
    {id:'sum',prompt:'위 타원 위 점에서 두 초점까지 거리의 합은?',answer:10,explanation:'정의에 따라 2a = 10입니다.'},
    {id:'minor',prompt:'장반경이 5, 초점 거리 c가 3인 타원의 단반경 b는?',answer:4,explanation:'b² = a² − c² = 25 − 9 = 16이므로 b = 4입니다.'},
    {id:'book-focus',prompt:'교과서 29쪽 예제 1 재구성: x²/100 + y²/64 = 1의 양의 x축 위 초점의 x좌표는?',answer:6,explanation:'c² = 100 − 64 = 36이므로 c = 6입니다.'},
    {id:'book-axis',prompt:'교과서 29쪽 2(2) 재구성: 9x² + 16y² = 144의 장축의 길이는?',answer:8,explanation:'x²/16 + y²/9 = 1이므로 a = 4, 장축의 길이는 8입니다.'},
    {id:'e-tangent',prompt:'개념 적용: x²/25 + y²/9 = 1의 점 (0, 3)에서 접선의 y절편은?',answer:3,explanation:'0x/25 + 3y/9 = 1이므로 접선은 y = 3입니다.'},
  ],
};
