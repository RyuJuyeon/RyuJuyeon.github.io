import type { Activity } from './types';
export const circle: Activity = {
  course: 'common-math-2', lesson: 'circle-equation', kind: 'circle', title: '원의 방정식',
  summary: '원은 평면 위의 한 점에서 일정한 거리만큼 떨어진 점들의 집합입니다. 그 한 점이 중심이고, 일정한 거리가 반지름입니다. 방정식을 표준형으로 정리하면 중심과 반지름을 읽을 수 있습니다.',
  formulas: ['중심 (a, b), 반지름 r > 0인 원: (x − a)² + (y − b)² = r²', '중심이 원점인 원: x² + y² = r²'],
  example: '(x − 2)² + (y + 1)² = 9의 중심은 (2, −1), 반지름은 3입니다. 우변 9는 반지름의 제곱입니다.',
  guide: '중심의 x·y좌표와 반지름을 바꾸세요. 중심만 옮겼을 때 원의 크기가 유지되는지, 반지름을 두 배로 하면 넓이가 어떻게 변하는지 관찰하세요.',
  reflection: '원의 중심을 (0, 0)에서 (2, −1)로 옮기면 식에서 어떤 부호가 나타나나요? 반지름과 우변의 관계도 설명하세요.',
  questions: [
    { id:'cx', prompt:'(x − 2)² + (y + 1)² = 9인 원의 중심의 x좌표는?', answer:2, explanation:'x − a에서 a = 2이므로 중심의 x좌표는 2입니다.' },
    { id:'cy', prompt:'위 원의 중심의 y좌표는?', answer:-1, explanation:'y + 1 = y − (−1)이므로 중심의 y좌표는 −1입니다.' },
    { id:'radius', prompt:'x² + y² = 25인 원의 반지름은?', answer:5, explanation:'r² = 25이고 반지름은 양수이므로 r = 5입니다.' },
    { id:'constant', prompt:'중심이 (1, 3), 반지름이 4인 원의 식 (x − 1)² + (y − 3)² = k에서 k는?', answer:16, explanation:'우변은 r² = 4² = 16입니다.' },
  ],
};
