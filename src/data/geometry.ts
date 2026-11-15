import { section, type Course } from './curriculum';
export const geometry: Course = {
  slug: 'geometry', name: '기하', category: '진로 선택', symbol: '△', summary: '곡선과 공간, 벡터로 발견하는 도형의 성질', sourcePage: 40,
  chapters: [
    { id: 'conics', title: '이차곡선', sections: [
      section('conic-equations', '이차곡선의 뜻과 방정식', [['parabola', '포물선'], ['ellipse', '타원'], ['hyperbola', '쌍곡선']]),
      section('conic-tangents', '이차곡선과 직선', [['tangents', '이차곡선의 접선']]),
    ] },
    { id: 'space', title: '공간도형과 공간좌표', sections: [
      section('space-figures', '공간도형', [['position', '직선과 평면의 위치 관계'], ['three-perpendiculars', '삼수선 정리'], ['projection', '정사영']]),
      section('space-coordinates', '공간좌표', [['coordinates', '공간에서의 점의 좌표'], ['distance-division', '두 점 사이의 거리와 선분의 내분'], ['sphere', '구의 방정식']]),
    ] },
    { id: 'vectors', title: '벡터', sections: [
      section('vector-operations', '벡터의 연산', [['vector', '벡터의 뜻'], ['operations', '벡터의 덧셈·뺄셈과 실수배']]),
      section('vector-coordinates', '벡터의 성분과 내적', [['position-vector', '위치벡터와 좌표'], ['dot-product', '벡터의 내적'], ['vector-lines', '벡터를 이용한 직선의 방정식'], ['vector-planes', '벡터를 이용한 평면의 방정식']]),
    ] },
  ],
};
