import { commonMath1 } from './common-math-1';
import { commonMath2 } from './common-math-2';
import { algebra } from './algebra';
import { calculus1 } from './calculus-1';
import { probability } from './probability';
import { geometry } from './geometry';
import { calculus2 } from './calculus-2';
import { entriesFor, type Course } from './curriculum';
export const courses: Course[] = [
  { slug: 'common-math-1', name: '공통수학Ⅰ', category: '공통과목', symbol: 'x²', summary: '다항식부터 방정식, 경우의 수와 행렬까지', chapters: commonMath1, sourcePage: 32 },
  commonMath2, algebra, calculus1, probability, geometry, calculus2,
];
export const allLessonEntries = courses.flatMap(course => entriesFor(course).map((entry, index) => ({ course, ...entry, index })));
export function worksheetConfig(course: Course, lesson: import('./curriculum').Lesson) {
  const legacy = course.slug === 'common-math-1' && lesson.slug === 'quadratic-extrema';
  return {
    sourceUrl: lesson.worksheetPdf ?? '',
    storageKey: legacy ? 'quadratic-v1' : `${course.slug}:${lesson.slug}:${lesson.worksheetPdf ? 'pdf-v1' : 'blank-v1'}`,
    title: `${course.name} · ${lesson.title}`,
    backUrl: `/subjects/${course.slug}/${lesson.slug}/`,
    labUrl: lesson.lab.status === 'ready' ? lesson.lab.href : `/labs/${course.slug}/`,
  };
}
