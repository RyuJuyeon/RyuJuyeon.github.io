import type { Resource, Lesson, Chapter } from './curriculum';
export type { Resource, Lesson, Chapter } from './curriculum';
const lesson = (slug: string, title: string, summary: string, example: string, lab: Resource = { status: 'pending' }): Lesson => ({
  slug, title, concept: { summary, example }, pdf: slug === 'quadratic-extrema'
    ? { status: 'ready', href: '/worksheets/quadratic/', label: '태블릿 필기 학습지 열기 (2쪽 샘플)' }
    : { status: 'pending' }, lab,
  assessment: { status: 'pending' }, answers: { status: 'pending' },
  worksheetPdf: slug === 'quadratic-extrema' ? '/materials/quadratic-worksheet-v1.pdf' : null,
  achievementStandard: null,
});
export const curriculumNote = '2022 개정 교육과정의 내용 영역을 바탕으로 구성했습니다. 중단원·소단원은 이 사이트의 학습 탐색용 분류이며, 교과서별 목차와 다를 수 있습니다. 개념 요약과 예시는 자체 작성 자료입니다.';
export const curriculumSource = { title: '경기도교육청 · 2022 개정 교육과정 고등학교 과목 선택 안내자료', href: 'https://www.goe.go.kr/resource/old/BBSMSTR_000000030136/BBS_202404250409254370.pdf' };
export const commonMath1: Chapter[] = [
  { id: 'polynomials', title: '다항식', sections: [
    { id: 'operations', title: '다항식의 연산', lessons: [
      lesson('polynomial-addition', '다항식의 덧셈과 뺄셈', '동류항끼리 계수를 더하거나 빼서 정리합니다. 괄호 앞에 음수가 있으면 괄호 안의 모든 항의 부호를 바꿉니다.', '(2x² + 3x) − (x² − x) = x² + 4x'),
      lesson('polynomial-multiplication', '다항식의 곱셈과 나눗셈', '분배법칙으로 다항식을 곱합니다. 나눗셈은 A = BQ + R로 나타내며, 나머지 R의 차수는 나누는 식 B의 차수보다 작거나 R = 0입니다.', '(x² + 3x + 2) ÷ (x + 1)의 몫은 x + 2, 나머지는 0입니다.'),
    ] },
    { id: 'remainder-factorization', title: '나머지정리와 인수분해', lessons: [
      lesson('identity', '항등식', '문자에 어떤 값을 대입해도 항상 성립하는 등식입니다. 양변의 동류항 계수를 비교하여 미정계수를 구할 수 있습니다.', 'ax + b = 2x + 3이 모든 실수 x에 대해 성립하면 a = 2, b = 3입니다.'),
      lesson('remainder-theorem', '나머지정리와 인수정리', '다항식 P(x)를 x − a로 나눈 나머지는 P(a)입니다. P(a) = 0이면 x − a는 P(x)의 인수입니다.', 'P(x) = x² + 2x + 3을 x − 1로 나눈 나머지는 P(1) = 6입니다.'),
      lesson('factorization', '인수분해', '다항식을 더 낮은 차수의 다항식들의 곱으로 나타냅니다. 공통인수를 찾거나 곱셈공식, 인수정리를 활용합니다.', 'x³ − 1 = (x − 1)(x² + x + 1)'),
    ] },
  ] },
  { id: 'equations-inequalities', title: '방정식과 부등식', sections: [
    { id: 'complex-quadratic', title: '복소수와 이차방정식', lessons: [
      lesson('complex-numbers', '복소수의 뜻과 연산', 'i² = −1을 만족하는 허수단위 i를 사용하여 복소수를 a + bi (a, b는 실수)로 나타냅니다.', '(1 + 2i)(1 − 2i) = 1 − 4i² = 5'),
      lesson('quadratic-equations', '이차방정식과 판별식', 'ax² + bx + c = 0 (a ≠ 0)의 판별식은 D = b² − 4ac입니다. 실수 계수일 때 D의 부호에 따라 서로 다른 두 실근, 중근, 서로 다른 두 허근을 구분합니다.', 'x² − 3x + 2 = 0은 D = 1 > 0이므로 서로 다른 두 실근 1, 2를 갖습니다.'),
      lesson('roots-coefficients', '근과 계수의 관계', '이차방정식 ax² + bx + c = 0의 두 근을 α, β라 하면 α + β = −b/a, αβ = c/a입니다.', 'x² − 5x + 6 = 0의 두 근의 합은 5, 곱은 6입니다.'),
    ] },
    { id: 'quadratic-functions', title: '이차방정식과 이차함수', lessons: [
      lesson('quadratic-intersections', '이차방정식과 이차함수의 관계', '이차함수 y = ax² + bx + c의 그래프와 x축의 교점의 x좌표는 이차방정식 ax² + bx + c = 0의 실근입니다.', 'y = x² − 1의 그래프는 x축과 (−1, 0), (1, 0)에서 만납니다.'),
      lesson('quadratic-line', '이차함수와 직선의 위치 관계', '이차함수와 직선의 식을 연립해 얻은 이차방정식의 실근 개수로 교점의 개수를 판단합니다.', 'y = x²와 y = 2x − 1은 (x − 1)² = 0이므로 (1, 1)에서 접합니다.'),
      lesson('quadratic-extrema', '이차함수의 최대·최소', '닫힌 구간에서는 꼭짓점의 x좌표가 구간에 속하는지 확인한 뒤, 꼭짓점과 구간 양 끝점에서의 함수값을 비교합니다.', 'y = 2(x − 1)² − 3, 0 ≤ x ≤ 3에서 최솟값은 −3 (x = 1), 최댓값은 5 (x = 3)입니다.', { status: 'ready', href: '/subjects/common-math-1/#quadratic-lab', label: '이차함수 계수 조절 실험실' }),
    ] },
    { id: 'various-equations', title: '여러 가지 방정식', lessons: [
      lesson('higher-equations', '삼차방정식과 사차방정식', '인수분해 또는 치환을 이용해 낮은 차수의 방정식으로 바꾸어 풉니다.', 'x³ − x = x(x − 1)(x + 1) = 0의 해는 −1, 0, 1입니다.'),
      lesson('simultaneous-quadratic', '연립이차방정식', '대입이나 소거로 하나의 미지수를 구한 뒤, 원래의 두 식을 모두 만족하는 순서쌍을 찾습니다.', 'y = x, x² + y² = 2의 해는 (1, 1), (−1, −1)입니다.'),
    ] },
    { id: 'various-inequalities', title: '여러 가지 부등식', lessons: [
      lesson('linear-inequalities', '연립일차부등식', '각 부등식의 해를 구한 뒤 공통부분을 찾습니다. 음수를 곱하거나 나눌 때는 부등호의 방향이 바뀝니다.', '2x > 2, x + 1 ≤ 4를 동시에 만족하는 범위는 1 < x ≤ 3입니다.'),
      lesson('absolute-inequalities', '절댓값을 포함한 일차부등식', '절댓값 안의 식의 부호에 따라 구간을 나누거나, 수직선에서 거리의 의미를 이용합니다.', '|x − 1| < 2의 해는 −1 < x < 3입니다.'),
      lesson('quadratic-inequalities', '이차부등식과 연립이차부등식', '이차함수 그래프가 x축 위 또는 아래에 있는 구간을 살핍니다. 연립부등식은 각 해의 공통부분을 구합니다.', 'x² − 3x + 2 ≤ 0의 해는 1 ≤ x ≤ 2입니다.'),
    ] },
  ] },
  { id: 'counting', title: '경우의 수', sections: [
    { id: 'counting-rules', title: '합의 법칙과 곱의 법칙', lessons: [
      lesson('sum-product-rules', '경우의 수를 세는 원리', '동시에 일어나지 않는 경우들을 나누어 셀 때 합의 법칙을, 연속된 선택의 경우를 셀 때 곱의 법칙을 사용합니다.', '상의 3벌과 하의 2벌에서 각각 하나씩 고르는 방법은 3 × 2 = 6가지입니다.'),
    ] },
    { id: 'permutations-combinations', title: '순열과 조합', lessons: [
      lesson('permutations', '순열', '서로 다른 n개에서 r개를 골라 순서 있게 나열하는 경우의 수는 nPr = n! / (n − r)!입니다. (0 ≤ r ≤ n)', '서로 다른 4명 중 회장과 부회장을 정하는 방법은 4 × 3 = 12가지입니다.'),
      lesson('combinations', '조합', '서로 다른 n개에서 순서 없이 r개를 고르는 경우의 수는 nCr = n! / (r!(n − r)!)입니다. (0 ≤ r ≤ n)', '서로 다른 4명 중 대표 2명을 고르는 방법은 4C2 = 6가지입니다.'),
    ] },
  ] },
  { id: 'matrices', title: '행렬', sections: [
    { id: 'matrix-basics', title: '행렬과 그 연산', lessons: [
      lesson('matrix-meaning', '행렬의 뜻과 표현', '수나 식을 직사각형 모양으로 배열한 것을 행렬이라 합니다. 가로줄을 행, 세로줄을 열이라고 합니다.', '두 학생의 국어·수학·영어 점수를 학생별로 한 행에 정리하면 2행 3열의 행렬입니다.'),
      lesson('matrix-addition', '행렬의 덧셈·뺄셈과 실수배', '크기가 같은 행렬끼리 같은 위치의 성분을 더하거나 뺍니다. 실수배는 모든 성분에 같은 실수를 곱합니다.', '행벡터 [1, 2] + [3, 4] = [4, 6], 2[1, 2] = [2, 4]입니다.'),
      lesson('matrix-multiplication', '행렬의 곱셈', '앞 행렬의 열 수와 뒤 행렬의 행 수가 같아야 곱할 수 있습니다. 결과의 (i, j) 성분은 앞 행렬의 i행과 뒤 행렬의 j열의 대응 성분을 곱한 값의 합입니다.', '1행 2열 행렬 [1, 2]와 성분이 위에서부터 3, 4인 2행 1열 행렬의 곱은 1행 1열 행렬 [11]입니다.'),
    ] },
  ] },
];
export const lessonEntries = commonMath1.flatMap(chapter => chapter.sections.flatMap(section => section.lessons.map(lesson => ({ chapter, section, lesson }))));
export const lessonUrl = (slug: string) => `/subjects/common-math-1/${slug}/`;
