export type Resource = { status: 'pending' } | { status: 'ready'; href: string; label: string };
export interface Lesson {
  slug: string;
  title: string;
  concept: { summary: string; example: string } | null;
  pdf: Resource;
  answers: Resource;
  lab: Resource;
  assessment: Resource;
  worksheetPdf: string | null;
  achievementStandard: { code: string; text: string; source: string } | null;
}
export interface Chapter { id: string; title: string; sections: { id: string; title: string; lessons: Lesson[] }[] }
export interface Course {
  slug: string; name: string; category: string; symbol: string; summary: string;
  chapters: Chapter[];
  sourcePage: number;
}
export const curriculumSource = { title: '경기도교육청 · 2022 개정 교육과정 고등학교 과목 선택 안내자료', href: 'https://www.goe.go.kr/resource/old/BBSMSTR_000000030136/BBS_202404011050095450.pdf' };
export const officialNotice = 'https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=141&boardSeq=93458&lev=0&statusYN=W';
export const curriculumNote = '교육부 고시 제2022-33호 수학과 교육과정과 교육청 과목 안내의 내용 영역을 바탕으로 구성했습니다. 중단원·소단원은 학습 탐색을 위한 사이트 분류이며 교과서별 목차와 다를 수 있습니다. 성취기준 코드와 원문은 검증 전까지 제공하지 않습니다.';
export const pendingLesson = (slug: string, title: string): Lesson => ({ slug, title, concept: null, pdf: { status: 'pending' }, answers: { status: 'pending' }, lab: { status: 'pending' }, assessment: { status: 'pending' }, worksheetPdf: null, achievementStandard: null });
export const section = (id: string, title: string, lessons: [string, string][]) => ({ id, title, lessons: lessons.map(([slug, title]) => pendingLesson(slug, title)) });
export const entriesFor = (course: Course) => course.chapters.flatMap(chapter => chapter.sections.flatMap(section => section.lessons.map(lesson => ({ chapter, section, lesson }))));
export const courseLessonUrl = (course: string, lesson: string) => `/subjects/${course}/${lesson}/`;
export const worksheetUrl = (course: string, lesson: string) => `/worksheets/${course}/${lesson}/`;
