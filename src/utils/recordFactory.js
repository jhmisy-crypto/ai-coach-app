// src/utils/recordFactory.js

export function createRecord({
  lesson = "lesson-unknown",
  lessonId = "",
  lessonTitle = "",
  lessonTheme = "",
  category = "general",
  question = "",
  answer = "",
  summary = "",
  reflection = "",
  actionPlan = "",
  answers = [],
  messages = [],
}) {
  const now = new Date();

  const normalizedLessonId = normalizeLessonId(lessonId || lesson);
  const normalizedCategory = normalizeCategory(category);

  return {
    id: `record_${now.getTime()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now.toISOString(),

    title: buildTitle({
      lessonTitle,
      lessonTheme,
      lessonId: normalizedLessonId,
    }),

    lesson: normalizedLessonId,
    lessonId: normalizedLessonId,
    lessonTitle: lessonTitle || "",
    lessonTheme: lessonTheme || "",
    category: normalizedCategory,

    question: question || "",
    answer: answer || "",
    summary: summary || "",
    reflection: reflection || "",
    actionPlan: actionPlan || "",

    answers: Array.isArray(answers) ? answers : [],
    messages: Array.isArray(messages) ? messages : [],
  };
}

function buildTitle({ lessonTitle, lessonTheme, lessonId }) {
  if (lessonTitle && String(lessonTitle).trim()) {
    const lessonNumber = extractLessonNumber(lessonId);
    return lessonNumber
      ? `${String(lessonTitle).trim()} (${lessonNumber}강)`
      : String(lessonTitle).trim();
  }

  if (lessonTheme && String(lessonTheme).trim()) {
    return String(lessonTheme).trim();
  }

  const lessonNumber = extractLessonNumber(lessonId);
  if (lessonNumber) return `${lessonNumber}강`;

  return "기본 코칭";
}

function normalizeLessonId(value) {
  if (!value) return "lesson-unknown";

  const text = String(value).trim();

  if (text.startsWith("lesson")) return text;

  const onlyNumber = text.replace(/[^\d]/g, "");
  if (onlyNumber) return `lesson${onlyNumber}`;

  return "lesson-unknown";
}

function extractLessonNumber(value) {
  if (!value) return "";

  const match = String(value).match(/\d+/);
  return match ? match[0] : "";
}

function normalizeCategory(value) {
  if (!value) return "general";

  const text = String(value).trim().toLowerCase();

  if (
    text === "gratitude" ||
    text === "감사"
  ) {
    return "gratitude";
  }

  if (
    text === "emotion" ||
    text === "감정"
  ) {
    return "emotion";
  }

  if (
    text === "relation" ||
    text === "relationship" ||
    text === "relationships" ||
    text === "관계"
  ) {
    return "relation";
  }

  if (
    text === "action" ||
    text === "실행"
  ) {
    return "action";
  }

  if (
    text === "general" ||
    text === "기타" ||
    text === "전체"
  ) {
    return "general";
  }

  return "general";
}