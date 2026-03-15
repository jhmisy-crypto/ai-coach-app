export function createSession({
  lessonId,
  lessonTitle = "",
  problem = "",
  answers = [],
  summary = "",
  actionPlan = "",
  reflection = ""
}) {
  return {
    id: `session_${Date.now()}`,
    lessonId,
    lessonTitle,
    problem,
    answers,
    summary,
    actionPlan,
    reflection,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}