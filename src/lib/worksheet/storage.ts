import type { Stroke } from './geometry';
export function openStorage(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('math-archive-worksheets', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('pages');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Storage blocked'));
  });
}
export function readPage(db: IDBDatabase, key: string): Promise<Stroke[]> {
  return new Promise((resolve, reject) => {
    const request = db.transaction('pages').objectStore('pages').get(key);
    request.onsuccess = () => resolve(request.result?.strokes ?? []);
    request.onerror = () => reject(request.error);
  });
}
export function writePage(db: IDBDatabase, key: string, strokes: Stroke[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('pages', 'readwrite');
    transaction.objectStore('pages').put({ strokes, updatedAt: Date.now(), version: 1 }, key);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}
