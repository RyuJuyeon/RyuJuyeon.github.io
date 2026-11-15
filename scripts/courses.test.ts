import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { PDFDocument } from 'pdf-lib';
import { courses, allLessonEntries, worksheetConfig } from '../src/data/courses';
import { subjects } from '../src/data/subjects';
import { activityFor } from '../src/data/activities';
import { courseLessonUrl, worksheetUrl } from '../src/data/curriculum';
import { createBlankWorksheet } from '../src/lib/worksheet/blank';
import 'fake-indexeddb/auto';
import { openStorage, writePage, readPage } from '../src/lib/worksheet/storage';
const readRoute = (route: string) => fs.readFileSync(path.join('dist', route, 'index.html'), 'utf8');

test('home and subject catalog expose every course card with real lesson destinations', () => {
  assert.equal(subjects.length, courses.length);
  for (const route of ['/', '/subjects/']) {
    const html = readRoute(route);
    assert.equal([...html.matchAll(/data-subject="/g)].length, subjects.length);
    for (const subject of subjects) {
      assert.ok(html.includes(`data-subject="${subject.slug}"`));
      assert.ok(html.includes(`href="${subject.href}"`));
      const detail = readRoute(subject.href);
      assert.ok(detail.includes('id="units"'));
      assert.ok(!detail.includes('class="empty-state"'));
      const entries = allLessonEntries.filter(entry => entry.course.slug === subject.slug);
      assert.equal(subject.lessonCount, entries.length);
      for (const { lesson } of entries) assert.ok(detail.includes(`href="${courseLessonUrl(subject.slug, lesson.slug)}"`));
    }
  }
});

test('seven distinct courses have complete hierarchies and no invented new content', () => {
  assert.equal(courses.length, 7);
  assert.equal(new Set(courses.map(course => course.slug)).size, 7);
  assert.equal(allLessonEntries.length, 132);
  for (const course of courses) {
    assert.ok(course.chapters.length >= 3);
    assert.equal(new Set(course.chapters.map(chapter => chapter.id)).size, course.chapters.length);
    for (const chapter of course.chapters) for (const section of chapter.sections) assert.ok(section.lessons.length);
    const entries = allLessonEntries.filter(entry => entry.course === course);
    assert.equal(new Set(entries.map(entry => entry.lesson.slug)).size, entries.length);
    for (const { lesson } of entries) {
      assert.equal(lesson.achievementStandard, null);
      if (course.slug !== 'common-math-1' && !activityFor(course.slug, lesson.slug)) {
        assert.equal(lesson.concept, null);
        for (const resource of [lesson.pdf, lesson.answers, lesson.lab, lesson.assessment]) assert.equal(resource.status, 'pending');
      }
    }
  }
});
test('all lessons have shared learning areas and a correctly scoped writing room', () => {
  const scopes = new Set<string>();
  for (const { course, lesson } of allLessonEntries) {
    const html = readRoute(courseLessonUrl(course.slug, lesson.slug));
    for (const area of ['concept', 'pdf', 'answers', 'lab', 'assessment']) assert.ok(html.includes(`id="${area}"`));
    assert.ok(html.includes('aria-current="page"'));
    const config = worksheetConfig(course, lesson);
    const writing = readRoute(worksheetUrl(course.slug, lesson.slug));
    assert.ok(writing.includes(`data-storage-key="${config.storageKey}"`));
    assert.ok(writing.includes('id="ink-canvas"'));
    assert.ok(writing.includes('id="export-pdf"'));
    assert.ok(!scopes.has(config.storageKey));
    scopes.add(config.storageKey);
    if (!lesson.worksheetPdf) assert.ok(writing.includes('빈 모눈 필기장'));
  }
  const legacy = allLessonEntries.find(entry => entry.lesson.slug === 'quadratic-extrema')!;
  assert.equal(worksheetConfig(legacy.course, legacy.lesson).storageKey, 'quadratic-v1');
  assert.ok(readRoute('/worksheets/quadratic/').includes('data-storage-key="quadratic-v1"'));
});
test('blank worksheet is a deterministic two-page PDF; subject scopes restore separately', async () => {
  const first = await createBlankWorksheet(), second = await createBlankWorksheet();
  assert.deepEqual(first, second);
  assert.equal((await PDFDocument.load(first)).getPageCount(), 2);
  const db = await openStorage();
  const notes = [{ color: '#245b43', width: 2, points: [{ x: 100, y: 200, pressure: .5 }] }];
  const a = worksheetConfig(courses[1], courses[1].chapters[0].sections[0].lessons[0]).storageKey + ':1';
  const b = worksheetConfig(courses[2], courses[2].chapters[0].sections[0].lessons[0]).storageKey + ':1';
  await writePage(db, a, notes);
  assert.deepEqual(await readPage(db, a), notes);
  assert.deepEqual(await readPage(db, b), []);
  db.close();
});
test('every built internal link and anchor resolves, including legacy links and all labs', () => {
  const root = path.resolve('dist');
  const pages: string[] = [];
  const walk = (directory: string) => { for (const entry of fs.readdirSync(directory, { withFileTypes: true })) { const file = path.join(directory, entry.name); if (entry.isDirectory()) walk(file); else if (file.endsWith('.html')) pages.push(file); } };
  walk(root);
  const cache = new Map(pages.map(page => [page, fs.readFileSync(page, 'utf8')]));
  for (const page of pages) for (const match of cache.get(page)!.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (!href.startsWith('/') && !href.startsWith('#')) continue;
    const [pathname, hash] = href.split('#');
    let target = pathname ? path.join(root, pathname) : page;
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
    assert.ok(fs.existsSync(target), `${href} in ${page}`);
    if (hash) assert.ok(cache.get(target)?.includes(`id="${hash}"`), `${href} in ${page}`);
  }
  for (const course of courses) assert.ok(readRoute(`/labs/${course.slug}/`).includes('실험실'));
});
