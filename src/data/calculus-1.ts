import { section, type Course } from './curriculum';
export const calculus1: Course = {
  slug: 'calculus-1', name: '미적분Ⅰ', category: '일반 선택', symbol: '∫', summary: '극한에서 미분과 적분으로, 변화의 이해', sourcePage: 37,
  chapters: [
    { id: 'limits-continuity', title: '함수의 극한과 연속', sections: [
      section('limits', '함수의 극한', [['function-limit', '함수의 극한'], ['limit-properties', '함수의 극한의 성질']]),
      section('continuity', '함수의 연속', [['continuous-function', '함수의 연속'], ['continuous-properties', '연속함수의 성질']]),
    ] },
    { id: 'differentiation', title: '미분', sections: [
      section('derivatives', '미분계수와 도함수', [['derivative-at-point', '미분계수'], ['differentiability', '미분가능성과 연속성'], ['polynomial-derivative', '도함수와 다항함수의 미분']]),
      section('derivative-applications', '도함수의 활용', [['tangent', '접선의 방정식'], ['mean-value', '평균값 정리'], ['increase-extrema', '함수의 증가·감소와 극대·극소'], ['graph-max-min', '함수의 그래프와 최대·최소'], ['equation-inequality', '방정식과 부등식에의 활용'], ['velocity-acceleration', '속도와 가속도']]),
    ] },
    { id: 'integration', title: '적분', sections: [
      section('integrals', '부정적분과 정적분', [['indefinite-integral', '부정적분'], ['definite-integral', '정적분']]),
      section('integral-applications', '정적분의 활용', [['area', '넓이'], ['distance', '속도와 거리']]),
    ] },
  ],
};
