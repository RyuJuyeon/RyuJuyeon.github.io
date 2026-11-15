import { courses } from './courses';
export const subjects = courses.map(course => ({
  ...course,
  href: `/subjects/${course.slug}/`,
  topics: course.chapters.map(chapter => chapter.title),
  lessonCount: course.chapters.reduce((total, chapter) => total + chapter.sections.reduce((count, section) => count + section.lessons.length, 0), 0),
  hasConcepts: course.chapters.some(chapter => chapter.sections.some(section => section.lessons.some(lesson => lesson.concept !== null))),
}));
