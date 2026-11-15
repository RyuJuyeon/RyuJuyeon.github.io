import { section, type Course } from './curriculum';
export const commonMath2: Course = {
  slug: 'common-math-2', name: '공통수학Ⅱ', category: '공통과목', symbol: 'ƒ(x)', summary: '도형과 집합, 함수로 넓히는 수학의 언어', sourcePage: 33,
  chapters: [
    { id: 'coordinate-geometry', title: '도형의 방정식', sections: [
      section('coordinates', '평면좌표', [['distance', '두 점 사이의 거리'], ['division-point', '선분의 내분']]),
      section('lines', '직선의 방정식', [['line-equation', '직선의 방정식'], ['parallel-perpendicular', '두 직선의 평행과 수직'], ['point-line-distance', '점과 직선 사이의 거리']]),
      section('circles', '원의 방정식', [['circle-equation', '원의 방정식'], ['circle-line', '원과 직선의 위치 관계']]),
      section('transformations', '도형의 이동', [['translation', '평행이동'], ['reflection', '대칭이동']]),
    ] },
    { id: 'sets-propositions', title: '집합과 명제', sections: [
      section('sets', '집합', [['sets', '집합의 뜻과 포함 관계'], ['set-operations', '집합의 연산']]),
      section('propositions', '명제', [['proposition-condition', '명제와 조건'], ['converse-contrapositive', '명제의 역과 대우'], ['necessary-sufficient', '필요조건과 충분조건'], ['proof', '대우를 이용한 증명과 귀류법']]),
    ] },
    { id: 'functions-graphs', title: '함수와 그래프', sections: [
      section('functions', '함수', [['function', '함수의 뜻과 그래프'], ['composition', '합성함수'], ['inverse', '역함수']]),
      section('rational-radical', '유리함수와 무리함수', [['rational', '유리함수'], ['radical', '무리함수']]),
    ] },
  ],
};

