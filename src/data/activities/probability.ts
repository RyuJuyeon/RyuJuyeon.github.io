import type { Activity } from './types';
export const probabilityActivity: Activity = {
  course:'probability',lesson:'probability-meaning',kind:'probability',title:'확률 실험',
  summary:'각 결과가 일어날 가능성이 같은 유한한 표본공간에서는 사건에 속하는 결과 수를 전체 결과 수로 나누어 확률을 구합니다. 상대도수는 실제 시행에서 관찰한 비율로, 이론적 확률과 반드시 같지는 않습니다.',
  formulas:['P(A) = 사건 A의 결과 수 / 전체 결과 수 (각 결과의 가능성이 같을 때)', '상대도수 = 사건 발생 횟수 / 전체 시행 횟수', '공정한 주사위에서 짝수가 나올 확률 = 3/6 = 1/2'],
  example:'주사위를 20번 던져 짝수가 12번 나오면 상대도수는 12/20 = 0.6입니다. 이론적 확률은 여전히 0.5입니다.',
  guide:'사건을 선택하고 주사위를 1회·10회·100회 던져 보세요. 눈별 도수와 사건의 상대도수를 관찰하세요. 시행 횟수가 늘어도 오차가 매번 줄어드는 것은 아닙니다. 사건 변경 시 같은 시행 기록을 새 사건으로 다시 집계합니다.',
  reflection:'시행 횟수에 따라 상대도수는 어떻게 변했나요? 관찰값이 이론적 확률과 다른 이유, 많은 시행에서도 정확히 일치하지 않을 수 있는 이유를 설명하세요.',
  questions:[
    {id:'even',prompt:'공정한 주사위에서 짝수가 나올 확률은?',answer:.5,explanation:'짝수는 2, 4, 6이므로 3/6 = 1/2입니다.'},
    {id:'large',prompt:'공정한 주사위에서 5 이상이 나올 확률은? (분수 또는 소수 셋째 자리 이상)',answer:1/3,explanation:'5, 6의 두 경우이므로 2/6 = 1/3입니다.'},
    {id:'observed',prompt:'50번 시행 중 짝수가 28번 나왔습니다. 짝수의 상대도수는?',answer:.56,explanation:'28/50 = 0.56입니다. 이론적 확률 0.5와 구분합니다.'},
    {id:'impossible',prompt:'눈이 1~6인 주사위에서 7이 나올 확률은?',answer:0,explanation:'불가능한 사건의 확률은 0입니다.'},
  ],
};
