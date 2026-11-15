// User-provided 천재교과서 기하(전인태), chapter I. Printed book pages, not PDF indices.
export const geometryMaterials: Record<string, { pages: string; pdf: string; answers: string; legacyPdf: string; concept: string; problems: string }> = Object.fromEntries([
  ['parabola', '10–25'], ['ellipse', '26–41'], ['hyperbola', '42–61'],
].map(([slug, pages]) => [slug, {
  pages, pdf: `/materials/geometry/${slug}-worksheet-v1.pdf`, answers: `/materials/geometry/${slug}-solutions-v1.pdf`, legacyPdf: `/materials/geometry/${slug}-textbook.pdf`,
  concept: `/materials/geometry/${slug}-concept.pptx`, problems: `/materials/geometry/${slug}-problems.pptx`,
}]));
export const geometryAnswers = '/materials/geometry/chapter-1-answers.pdf';
