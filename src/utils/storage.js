const STORAGE_KEY = "ai_coach_records";

/**
 * 전체 기록 가져오기
 */
export function getAllRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

/**
 * 기록 저장 (전체 덮어쓰기)
 */
export function saveAllRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

/**
 * 기록 하나 추가
 */
export function addRecord(record) {
  const records = getAllRecords();
  records.unshift(record); // 최신 기록이 위로 오도록
  saveAllRecords(records);
}

/**
 * 기록 id로 찾기
 */
export function getRecordById(id) {
  const records = getAllRecords();
  return records.find((r) => r.id === id);
}

/**
 * 기록 삭제
 */
export function deleteRecord(id) {
  const records = getAllRecords().filter((r) => r.id !== id);
  saveAllRecords(records);
}