const ARCHIVE_KEY = 'ai-coach-archive-v1';

export function loadArchive() {
  const raw = localStorage.getItem(ARCHIVE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveArchive(records) {
  localStorage.setItem(ARCHIVE_KEY, JSON.stringify(records));
}

export function appendRecord(record) {
  const current = loadArchive();
  const next = [record, ...current];
  saveArchive(next);
  return next;
}