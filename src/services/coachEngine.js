import { LESSON_CONFIG } from "../data/lessonConfig";

/**
 * 강의 id로 강의 정보 가져오기
 */
export function getLessonById(lessonId) {
  return LESSON_CONFIG.find((lesson) => lesson.id === lessonId);
}

/**
 * 특정 강의의 전체 질문 가져오기
 */
export function getQuestionsByLessonId(lessonId) {
  const lesson = getLessonById(lessonId);
  if (!lesson) return [];
  return lesson.questions || [];
}

/**
 * 다음 질문 index 계산
 */
export function getNextQuestionIndex(currentIndex, lessonId) {
  const questions = getQuestionsByLessonId(lessonId);
  if (!questions.length) return null;

  const nextIndex = currentIndex + 1;
  if (nextIndex >= questions.length) return null;

  return nextIndex;
}

/**
 * 현재 질문 텍스트 가져오기
 */
export function getQuestionText(lessonId, index) {
  const questions = getQuestionsByLessonId(lessonId);
  if (!questions.length) return "";
  return questions[index] || "";
}

/**
 * 힌트 가져오기
 */
export function getHintByLessonId(lessonId) {
  const lesson = getLessonById(lessonId);
  if (!lesson) return "";
  return lesson.hint || "";
}

/**
 * 요약 타입 가져오기
 */
export function getSummaryType(lessonId) {
  const lesson = getLessonById(lessonId);
  if (!lesson) return "";
  return lesson.summaryType || "";
}