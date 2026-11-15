import { section, type Course } from './curriculum';
export const probability: Course = {
  slug: 'probability', name: '확률과 통계', category: '일반 선택', symbol: 'P(A)', summary: '가능성을 계산하고 데이터로 세상 읽기', sourcePage: 38,
  chapters: [
    { id: 'counting', title: '경우의 수', sections: [
      section('permutations-combinations', '순열과 조합', [['permutations', '원순열과 중복순열'], ['repeated-permutations', '같은 것이 있는 순열'], ['repeated-combinations', '중복조합']]),
      section('binomial', '이항정리', [['binomial-theorem', '이항정리']]),
    ] },
    { id: 'probability', title: '확률', sections: [
      section('probability-rules', '확률의 뜻과 활용', [['probability-meaning', '확률의 뜻과 기본 성질'], ['addition-complement', '확률의 덧셈정리와 여사건']]),
      section('conditional', '조건부확률', [['conditional-probability', '조건부확률'], ['independence', '사건의 독립과 종속'], ['multiplication', '확률의 곱셈정리']]),
    ] },
    { id: 'statistics', title: '통계', sections: [
      section('distributions', '확률분포', [['random-variable', '확률변수와 확률분포'], ['expectation-variance', '이산확률변수의 기댓값과 표준편차'], ['binomial-distribution', '이항분포'], ['normal-distribution', '정규분포']]),
      section('estimation', '통계적 추정', [['population-sample', '모집단과 표본'], ['sample-mean', '표본평균의 분포'], ['mean-estimation', '모평균의 추정'], ['proportion-estimation', '모비율의 추정']]),
    ] },
  ],
};
