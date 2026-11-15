import type { Activity } from './types';
export const parabola: Activity = {
  course:'geometry', lesson:'parabola', kind:'parabola', title:'포물선',
  summary:'포물선은 한 점(초점)과 그 점을 지나지 않는 한 직선(준선)까지의 거리가 같은 점들의 집합입니다. 초점과 준선 사이의 중점이 꼭짓점이며, p의 부호에 따라 열리는 방향이 달라집니다.',
  formulas:['y² = 4px (p ≠ 0): 초점 (p, 0), 준선 x = −p, 꼭짓점 (0, 0)', 'x² = 4py (p ≠ 0): 초점 (0, p), 준선 y = −p', '(y − k)² = 4p(x − h): 꼭짓점 (h, k), 초점 (h + p, k), 준선 x = h − p', 'y² = 4px 위의 점 (x₁, y₁)에서 접선: y₁y = 2p(x + x₁)', '기울기가 m인 접선: y = mx + p/m (m ≠ 0). 꼭짓점의 접선은 x = 0.'],
  example:'y² = 16x에서는 4p = 16이므로 p = 4입니다. 초점은 (4, 0), 준선은 x = −4입니다. 점 (1, 4)에서의 접선은 4y = 8(x + 1), 즉 y = 2x + 2입니다.',
  guide:'p와 점 P의 y좌표 t를 바꾸세요. 초점 F까지의 거리와 준선 위 수선의 발 H까지의 거리를 비교하세요. 주황색 접선은 꼭짓점에서도 표시됩니다. p는 0이 될 수 없습니다.',
  reflection:'p의 부호를 바꾸면 포물선과 초점은 어떻게 달라지나요? 서로 다른 세 점에서 PF와 PH를 기록하고, 접선과 포물선의 교점이 하나임을 식으로 설명해 보세요.',
  questions:[
    {id:'p-focus',prompt:'교과서 13쪽 2(1) 재구성: y² = 16x의 초점의 x좌표는?',answer:4,explanation:'4p = 16이므로 초점은 (4, 0)입니다.'},
    {id:'p-directrix',prompt:'교과서 13쪽 2(2) 재구성: y² = −12x의 준선을 x = k라 할 때 k는?',answer:3,explanation:'p = −3이므로 준선은 x = −p = 3입니다.'},
    {id:'p-point',prompt:'교과서 13쪽 3 재구성: 초점이 (−4, 0), 준선이 x = 4인 포물선 위 점 (a, −8)의 a는?',answer:-4,explanation:'y² = −16x에 대입하면 64 = −16a이므로 a = −4입니다.'},
    {id:'p-tangent',prompt:'개념 적용: y² = 16x 위의 점 (1, 4)에서 접선의 y절편은?',answer:2,explanation:'4y = 8(x + 1)이므로 y = 2x + 2, y절편은 2입니다.'},
  ],
};
