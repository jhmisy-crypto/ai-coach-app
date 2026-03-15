export function searchRecords(records = [], keyword = "") {
  const q = keyword.trim().toLowerCase();

  if (!q) return records;

  return records.filter((record) => {
    const target = [
      record.lessonTitle,
      record.problem,
      record.summary,
      record.actionPlan,
      record.reflection,
      ...(record.answers || [])
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return target.includes(q);
  });
}