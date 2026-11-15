export type LabKind = 'circle' | 'exponential' | 'derivative' | 'probability' | 'ellipse' | 'trig' | 'parabola' | 'hyperbola';
export interface Question { id: string; prompt: string; answer: number; explanation: string }
export interface Activity {
  course: string; lesson: string; kind: LabKind; title: string;
  summary: string; formulas: string[]; example: string;
  guide: string; reflection: string; questions: Question[];
}
