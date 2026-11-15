import { section, type Course } from './curriculum';
export const algebra: Course = {
  slug: 'algebra', name: '대수', category: '일반 선택', symbol: 'aⁿ', summary: '지수와 로그, 삼각함수와 수열의 규칙', sourcePage: 36,
  chapters: [
    { id: 'exponential-logarithmic', title: '지수함수와 로그함수', sections: [
      section('exponents-logs', '지수와 로그', [['exponents', '거듭제곱근과 지수의 확장'], ['logarithms', '로그의 뜻과 성질'], ['common-logarithms', '상용로그']]),
      section('exponential-log-functions', '지수함수와 로그함수', [['exponential-function', '지수함수의 그래프'], ['logarithmic-function', '로그함수의 그래프'], ['exponential-log-applications', '지수함수와 로그함수의 활용']]),
    ] },
    { id: 'trigonometry', title: '삼각함수', sections: [
      section('trig-functions', '삼각함수의 뜻과 그래프', [['radians', '일반각과 호도법'], ['trig-definition', '삼각함수의 뜻'], ['trig-graphs', '삼각함수의 그래프']]),
      section('trig-applications', '삼각함수의 활용', [['sine-cosine-laws', '사인법칙과 코사인법칙'], ['triangle-applications', '삼각형에의 활용']]),
    ] },
    { id: 'sequences', title: '수열', sections: [
      section('arithmetic-geometric', '등차수열과 등비수열', [['arithmetic', '등차수열'], ['geometric', '등비수열']]),
      section('sequence-sums', '수열의 합', [['sigma', '합의 기호 Σ'], ['sums', '여러 가지 수열의 합']]),
      section('induction', '수학적 귀납법', [['recurrence', '수열의 귀납적 정의'], ['mathematical-induction', '수학적 귀납법']]),
    ] },
  ],
};
