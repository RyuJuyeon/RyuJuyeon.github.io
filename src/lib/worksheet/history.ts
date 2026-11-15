import type { Stroke } from './geometry';
export type History = { strokes: Stroke[]; undo: Stroke[][]; redo: Stroke[][] };
export function commitGesture(state: History, before: Stroke[]) {
  state.undo.push(before);
  if (state.undo.length > 80) state.undo.shift();
  state.redo = [];
}
export function travelHistory(state: History, action: 'undo' | 'redo') {
  const change = state[action].pop();
  if (!change) return false;
  state[action === 'undo' ? 'redo' : 'undo'].push(state.strokes);
  state.strokes = change;
  return true;
}
