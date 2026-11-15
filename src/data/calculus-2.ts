import { section, type Course } from './curriculum';
export const calculus2: Course = {
  slug: 'calculus-2', name: '미적분Ⅱ', category: '진로 선택', symbol: 'lim', summary: '수열의 극한과 다양한 함수의 미분·적분', sourcePage: 39,
  chapters: [
    { id: 'sequence-limits', title: '수열의 극한', sections: [
      section('limits', '수열의 극한', [['sequence-convergence', '수열의 수렴과 발산'], ['limit-properties', '수열의 극한의 성질'], ['geometric-limit', '등비수열의 극한']]),
      section('series', '급수', [['series-convergence', '급수의 수렴과 발산'], ['geometric-series', '등비급수와 그 활용']]),
    ] },
    { id: 'differentiation', title: '미분법', sections: [
      section('function-derivatives', '여러 가지 함수의 미분', [['exponential-log-limits', '지수함수와 로그함수의 극한'], ['exponential-log-derivatives', '지수함수와 로그함수의 미분'], ['trig-addition', '삼각함수의 덧셈정리'], ['trig-limits-derivatives', '삼각함수의 극한과 미분']]),
      section('derivative-rules', '여러 가지 미분법', [['quotient-chain', '몫의 미분법과 합성함수의 미분법'], ['parametric-implicit', '매개변수와 음함수의 미분법'], ['inverse-second', '역함수의 미분법과 이계도함수']]),
      section('applications', '도함수의 활용', [['tangent', '접선의 방정식'], ['curve-shape', '그래프의 개형과 최대·최소'], ['equations', '방정식과 부등식에의 활용'], ['motion', '속도와 가속도']]),
    ] },
    { id: 'integration', title: '적분법', sections: [
      section('methods', '여러 가지 적분법', [['various-integrals', '여러 가지 함수의 부정적분'], ['substitution', '치환적분법'], ['parts', '부분적분법'], ['definite-integrals', '여러 가지 함수의 정적분']]),
      section('integral-applications', '정적분의 활용', [['sum-integral', '정적분과 급수의 합의 관계'], ['area-volume', '넓이와 부피'], ['distance', '속도와 거리']]),
    ] },
  ],
};
