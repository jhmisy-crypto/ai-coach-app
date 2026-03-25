// src/utils/sessionFactory.js

function nowIso() {
  return new Date().toISOString();
}

function createEmptyFlowMemory() {
  return {
    recentQuestionIds: [],
    recentTypes: [],
    recentStages: [],
    recentEnergies: [],
    lastQuestionId: null,
    lastType: null,
    lastStage: null,
    lastEnergy: null,
  };
}

export function normalizeFlowMemory(flowMemory = {}) {
  return {
    recentQuestionIds: Array.isArray(flowMemory.recentQuestionIds)
      ? flowMemory.recentQuestionIds
      : [],
    recentTypes: Array.isArray(flowMemory.recentTypes)
      ? flowMemory.recentTypes
      : [],
    recentStages: Array.isArray(flowMemory.recentStages)
      ? flowMemory.recentStages
      : [],
    recentEnergies: Array.isArray(flowMemory.recentEnergies)
      ? flowMemory.recentEnergies
      : [],
    lastQuestionId: flowMemory.lastQuestionId ?? null,
    lastType: flowMemory.lastType ?? null,
    lastStage: flowMemory.lastStage ?? null,
    lastEnergy:
      typeof flowMemory.lastEnergy === "number" ? flowMemory.lastEnergy : null,
  };
}

export function createSession({
  lessonId = "lesson1",
  lessonTitle = "",
  category = "general",
  problem = "",
  initialQuestion = null,
} = {}) {
  const firstQuestionId = initialQuestion?.id ?? null;
  const firstType = initialQuestion?.type ?? null;
  const firstStage = initialQuestion?.stage ?? null;
  const firstEnergy =
    typeof initialQuestion?.energy === "number" ? initialQuestion.energy : null;

  return {
    id: `session_${Date.now()}`,
    lessonId,
    lessonTitle,
    category,
    problem,
    createdAt: nowIso(),
    updatedAt: nowIso(),

    currentQuestionId: firstQuestionId,
    currentDepth: 1,

    questionHistory: firstQuestionId ? [firstQuestionId] : [],
    answerHistory: [],

    summary: null,
    reflection: null,

    flowMemory: firstQuestionId
      ? {
          recentQuestionIds: [firstQuestionId],
          recentTypes: firstType ? [firstType] : [],
          recentStages: firstStage ? [firstStage] : [],
          recentEnergies:
            typeof firstEnergy === "number" ? [firstEnergy] : [],
          lastQuestionId: firstQuestionId,
          lastType: firstType,
          lastStage: firstStage,
          lastEnergy: firstEnergy,
        }
      : createEmptyFlowMemory(),
  };
}

export function normalizeSession(session = {}) {
  return {
    id: session.id ?? `session_${Date.now()}`,
    lessonId: session.lessonId ?? "lesson1",
    lessonTitle: session.lessonTitle ?? "",
    category: session.category ?? "general",
    problem: session.problem ?? "",
    createdAt: session.createdAt ?? nowIso(),
    updatedAt: session.updatedAt ?? nowIso(),

    currentQuestionId: session.currentQuestionId ?? null,
    currentDepth:
      typeof session.currentDepth === "number" ? session.currentDepth : 1,

    questionHistory: Array.isArray(session.questionHistory)
      ? session.questionHistory
      : [],
    answerHistory: Array.isArray(session.answerHistory)
      ? session.answerHistory
      : [],

    summary: session.summary ?? null,
    reflection: session.reflection ?? null,

    flowMemory: normalizeFlowMemory(session.flowMemory),
  };
}

function limitRecent(list, max = 5) {
  return list.slice(-max);
}

export function appendFlowMemory(session, question) {
  const safeSession = normalizeSession(session);
  if (!question || !question.id) return safeSession;

  const prev = normalizeFlowMemory(safeSession.flowMemory);

  const nextQuestionIds = limitRecent(
    [...prev.recentQuestionIds, question.id].filter(Boolean),
    6
  );

  const nextTypes = limitRecent(
    [...prev.recentTypes, question.type].filter(Boolean),
    4
  );

  const nextStages = limitRecent(
    [...prev.recentStages, question.stage].filter(Boolean),
    4
  );

  const nextEnergies = limitRecent(
    [
      ...prev.recentEnergies,
      typeof question.energy === "number" ? question.energy : null,
    ].filter((v) => typeof v === "number"),
    4
  );

  return {
    ...safeSession,
    updatedAt: nowIso(),
    currentQuestionId: question.id,
    questionHistory: Array.from(
      new Set([...(safeSession.questionHistory || []), question.id])
    ),
    flowMemory: {
      recentQuestionIds: nextQuestionIds,
      recentTypes: nextTypes,
      recentStages: nextStages,
      recentEnergies: nextEnergies,
      lastQuestionId: question.id,
      lastType: question.type ?? null,
      lastStage: question.stage ?? null,
      lastEnergy:
        typeof question.energy === "number" ? question.energy : null,
    },
  };
}

export function appendAnswerHistory(session, payload = {}) {
  const safeSession = normalizeSession(session);

  const nextAnswer = {
    questionId: payload.questionId ?? null,
    questionText: payload.questionText ?? "",
    answer: payload.answer ?? "",
    depth: typeof payload.depth === "number" ? payload.depth : safeSession.currentDepth,
    createdAt: nowIso(),
  };

  return {
    ...safeSession,
    updatedAt: nowIso(),
    answerHistory: [...safeSession.answerHistory, nextAnswer],
  };
}

export function updateSessionDepth(session, nextDepth) {
  const safeSession = normalizeSession(session);

  return {
    ...safeSession,
    updatedAt: nowIso(),
    currentDepth: typeof nextDepth === "number" ? nextDepth : safeSession.currentDepth,
  };
}