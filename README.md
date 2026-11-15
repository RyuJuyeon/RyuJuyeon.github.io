# RyuJuyeon.github.io
고등학교 수학 개념 학습 및 탐구 활동을 위한 웹사이트


## 실제 학습 콘텐츠: 대표 단원 6개

각 단원은 핵심 개념·공식·예시, 확인 문제 4개 이상과 정답·해설, 조작형 SVG 실험, 학생 답변 기록, PDF 필기장 연결을 제공합니다. 기하의 제공 자료 기반 확장은 아래를 참조하세요.

| 과목 | 단원 주소 | 실험 |
| --- | --- | --- |
| 공통수학Ⅱ | `/subjects/common-math-2/circle-equation/` | 중심과 반지름 조절 |
| 대수 | `/subjects/algebra/exponential-function/` | 지수함수의 밑과 관찰점 조절 |
| 미적분Ⅰ | `/subjects/calculus-1/derivative-at-point/` | 두 방향의 차분과 접선 비교 |
| 확률과 통계 | `/subjects/probability/probability-meaning/` | 공정한 주사위 모의 시행, 사건 변경과 상대도수 |
| 기하 | `/subjects/geometry/ellipse/` | 반경·점 이동, 두 초점까지 거리의 합 |
| 미적분Ⅱ | `/subjects/calculus-2/trig-limits-derivatives/` | sin/cos와 도함수·접선, 라디안 |

- 콘텐츠 파일: `src/data/activities/`의 단원별 파일. `index.ts`에 등록하면 `courses.ts`가 해당 소단원의 공개 상태와 실제 링크를 반영합니다.
- 화면: `src/components/InteractiveActivity.astro`, 스타일: `src/styles/activities.css`.
- 채점·수학 로직: `src/lib/activities/math.ts`. 입력 문자열을 실행하지 않으며 정수·소수·분수만 해석합니다. 절대 오차 0.00051 이하를 허용하여 소수 셋째 자리 반올림 답을 인정합니다. 빈 답과 잘못된 형식을 구분합니다.
- 조작·기록: `src/lib/activities/controller.ts`. 답안과 자유 서술을 `math-activity-v1:{course}:{lesson}` 키의 localStorage에 저장하며 복원한 답은 다시 채점하도록 합니다. 저장 실패 안내와 UTF-8 텍스트 내보내기를 제공합니다. 정답은 학습용 클라이언트 데이터이므로 시험 보안이나 교사용 성적 관리 기능은 아닙니다.
- 실험 설정과 확률 시행 횟수는 세션 중에만 유지하며 초기화 버튼은 실험만 초기화합니다. 학생 답안은 삭제하지 않습니다.
- PDF 버튼은 자료가 있는 단원의 교과서/학습지, 그 외 단원의 빈 모눈 필기장으로 연결합니다. 온라인 학습 답변이 PDF에 자동 삽입되지는 않습니다.
- `npm run test:activities`: 24개 정답, 분수 입력과 오답 처리, 원·타원의 정의, 수치 미분 대조, 주사위 집계, 실제 페이지 연결 검사. `npm test`는 기존 PDF·과목 탐색 회귀 테스트도 실행합니다.

## 기하 문제 전용 학습지

포물선·타원·쌍곡선별로 6문제, 3쪽의 학생용 학습지와 1쪽의 별도 정답·해설을 제공합니다. 교과서 페이지를 그대로 보여 주지 않고 문제와 넉넉한 풀이 공간으로 재편집했습니다. 각 단원 앞 3문제는 제공 교과서 문항 재구성, 뒤 3문제는 자체 개념 적용 문항입니다. 온라인 자동 채점 문제와 PDF 문제의 번호는 별도입니다.

- 콘텐츠: src/data/geometry-worksheets.ts
- 생성: node --import tsx scripts/create-geometry-worksheets.ts (WORKSHEET_FONT_PATH로 한국어 글꼴 지정 가능, 기본 Windows 맑은 고딕)
- 출력: public/materials/geometry/*-worksheet-v1.pdf 및 *-solutions-v1.pdf
- 경로: /worksheets/geometry/{parabola|ellipse|hyperbola}/
- 이전 교과서 필기: 위 경로의 previous/; 기존 빈 모눈 필기: notes/
- 이전 PDF 파일과 저장 키를 유지합니다. 새 학습지는 PDF 지문이 달라 별도의 필기 데이터로 저장됩니다.
- 문항 수정 후 PDF 생성 명령을 다시 실행하고 생성된 PDF도 함께 배포합니다. 일반 빌드는 Windows 글꼴이나 원본 Downloads 폴더를 요구하지 않습니다.
- PDF 검증: node --import tsx scripts/verify-geometry-pdfs.ts (12페이지 전부 렌더링, 학생용 정답 분리, 필기 포함 내보내기)

검증: npm run build (287페이지), npm run typecheck, 회귀 테스트 20개 통과. 원본 PPT는 보조 자료로, 이전 교과서 PDF는 기존 필기 복원용으로만 연결합니다.
