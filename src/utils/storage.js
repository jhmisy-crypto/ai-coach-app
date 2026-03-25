const STORAGE_KEY = "ai_coach_records";

export function getRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRecord(record) {
  const records = getRecords();

  const nextRecords = Array.isArray(records) ? [...records] : [];
  const index = nextRecords.findIndex((item) => item.id === record.id);

  if (index >= 0) {
    nextRecords[index] = {
      ...nextRecords[index],
      ...record,
      updatedAt: new Date().toISOString(),
    };
  } else {
    nextRecords.unshift({
      ...record,
      createdAt: record.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRecords));
}

export function getRecordById(id) {
  const records = getRecords();
  return records.find((record) => String(record.id) === String(id));
}

export function deleteRecord(id) {
  try {
    const records = getRecords();
    const nextRecords = records.filter(
      (record) => String(record.id) !== String(id)
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRecords));
    return true;
  } catch (error) {
    console.error("기록 삭제 실패:", error);
    return false;
  }
}

export function deleteRecordById(recordId) {
  try {
    const records = getRecords();
    const nextRecords = records.filter((record) => record.id !== recordId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRecords));
    return true;
  } catch (error) {
    console.error("deleteRecordById error:", error);
    return false;
  }
}

export function normalizeAllRecordCategories() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { updated: 0, total: 0 };

    const records = JSON.parse(raw);

    if (!Array.isArray(records)) return { updated: 0, total: 0 };

    let updatedCount = 0;

    const nextRecords = records.map((record) => {
      const normalized = normalizeCategory(record.category);

      if (normalized !== record.category) {
        updatedCount++;
        return {
          ...record,
          category: normalized,
        };
      }

      return record;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRecords));

    return {
      updated: updatedCount,
      total: records.length,
    };
  } catch (error) {
    console.error("normalizeAllRecordCategories error:", error);
    return { updated: 0, total: 0 };
  }
}

function normalizeCategory(value) {
  if (!value) return "general";

  const text = String(value).trim().toLowerCase();

  if (text === "gratitude" || text === "감사") return "gratitude";
  if (text === "emotion" || text === "감정") return "emotion";

  if (
    text === "relation" ||
    text === "relationship" ||
    text === "relationships" ||
    text === "관계"
  ) {
    return "relation";
  }

  if (text === "action" || text === "실행") return "action";

  if (text === "general" || text === "기타" || text === "전체")
    return "general";

  return "general";
}