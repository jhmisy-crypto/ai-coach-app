// src/pages/CoachChatPage.jsx
// 또는 현재 프로젝트에서 사용하는 정확한 경로의 CoachChatPage.jsx

import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import {
  COACH_DEPTHS,
  getDepthQuestions,
  getNextDepth,
  getRandomQuestionFromPool,
  isLastDepth,
} from "../data/QUESTION_POOLS";

import {
  getRandomQuestion,
  findFollowUpQuestion,
  getQuestionById,
} from "../data/questions";

import {
  createSession,
  normalizeSession,
  appendFlowMemory,
  appendAnswerHistory,
  updateSessionDepth,
} from "../utils/sessionFactory";

// ✅ 프로젝트에 이미 있으면 그 경로를 유지하세요.
import { LESSON_CONFIG } from "../data/lessonConfig";

// ✅ 저장 함수 경로가 다르면 현재 프로젝트 기준으로만 수정하세요.
import { saveRecord } from "../utils/storage";

export default function CoachChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const lessonId =
    searchParams.get("lesson") ||
    searchParams.get("lessonId") ||
    location.state?.lessonId ||
    "lesson1";

  const selectedCategory =
    searchParams.get("category") ||
    location.state?.selectedCategory ||
    location.state?.category ||
    "general";

  const problem =
    searchParams.get("problem") ||
    location.state?.problem ||
    "";

  const lessonTitle = useMemo(() => {
    const found = LESSON_CONFIG?.find((item) => item.id === lessonId);
    return found?.title || lessonId;
  }, [lessonId]);

  const [session, setSession] = useState(null);
  const [currentDepth, setCurrentDepth] = useState(COACH_DEPTHS[0]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentQuestionMeta, setCurrentQuestionMeta] = useState(null);
  const [answer, setAnswer] = useState("");
  const [questionHistory, setQuestionHistory] = useState([]);
  const [usedQuestionIds, setUsedQuestionIds] = useState([]);
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [detectedIntentLabel, setDetectedIntentLabel] = useState("");
  const [answersByDepth, setAnswersByDepth] = useState({
    entry: [],
    explore: [],
    deepen: [],
    action: [],
  });

  const safeSession = useMemo(() => {
    return normalizeSession(session || {});
  }, [session]);

  useEffect(() => {
    const firstDepth = COACH_DEPTHS[0];

    const initialQuestionMeta =
      getRandomQuestion(lessonId, selectedCategory, []) || null;
    const safeFirstQuestion =
      initialQuestionMeta?.text ||
      "이 강의의 첫 질문을 아직 준비하지 못했습니다.";

    const initialSession = createSession({
      lessonId,
      lessonTitle,
      category: selectedCategory,
      problem,
      initialQuestion: initialQuestionMeta,
    });

    setCurrentDepth(firstDepth);
    setCurrentQuestion(safeFirstQuestion);
    setCurrentQuestionMeta(initialQuestionMeta);
    setSession(normalizeSession(initialSession));
    setQuestionHistory([safeFirstQuestion]);
    setUsedQuestionIds(initialQuestionMeta?.id ? [initialQuestionMeta.id] : []);
    setDetectedIntentLabel("");
    setSessionQuestions([
      {
        depth: firstDepth,
        question: safeFirstQuestion,
        answer: "",
        questionId: initialQuestionMeta?.id || null,
        intent: initialQuestionMeta?.intent || null,
        type: initialQuestionMeta?.type || null,
        stage: initialQuestionMeta?.stage || null,
        energy: initialQuestionMeta?.energy ?? null,
      },
    ]);
    setAnswer("");
    setAnswersByDepth({
      entry: [],
      explore: [],
      deepen: [],
      action: [],
    });
  }, [lessonId, lessonTitle, selectedCategory, problem]);

  const progressText = useMemo(() => {
    const currentIndex = COACH_DEPTHS.indexOf(currentDepth) + 1;
    return `${currentIndex} / ${COACH_DEPTHS.length}`;
  }, [currentDepth]);

  function makeRecord(finalSessionQuestions, finalAnswersByDepth) {
    const firstQuestion = finalSessionQuestions?.[0]?.question || "";
    const lastAnswer =
      finalSessionQuestions?.[finalSessionQuestions.length - 1]?.answer || "";

    return {
      id: `coach_${Date.now()}`,
      type: "coach",
      title: `${lessonTitle} 코칭 기록`,
      lessonId,
      lessonTitle,
      category: selectedCategory || "general",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      problem,
      firstQuestion,
      preview: String(lastAnswer).slice(0, 100),
      sessionQuestions: finalSessionQuestions,
      answersByDepth: finalAnswersByDepth,
      summary: null,
      reflection: null,
      flowMemory: safeSession.flowMemory || null,
    };
  }
function getTargetStageByDepth(depth) {
  if (depth === "entry") return ["open", "insight"];
  if (depth === "explore") return ["insight", "deep"];
  if (depth === "deepen") return ["deep", "integrate"];
  if (depth === "action") return ["integrate"];
  return ["insight", "deep", "integrate"];
}

function getTargetEnergyByDepth(depth) {
  if (depth === "entry") return [1, 2];
  if (depth === "explore") return [2, 3];
  if (depth === "deepen") return [3, 4];
  if (depth === "action") return [3, 4, 5];
  return [2, 3];
}

function scoreQuestionFlow(candidate, ctx) {
  if (!candidate) return -9999;

  const {
    nextDepth,
    flowMemory,
    usedIds,
    currentQuestionMeta,
    preferredFollowUpIds = [],
  } = ctx;

  let score = 0;

  const recentTypes = flowMemory?.recentTypes || [];
  const recentStages = flowMemory?.recentStages || [];
  const recentEnergies = flowMemory?.recentEnergies || [];
  const recentQuestionIds = flowMemory?.recentQuestionIds || [];

  const lastType = recentTypes[recentTypes.length - 1] || null;
  const lastStage = recentStages[recentStages.length - 1] || null;
  const lastEnergy =
    typeof recentEnergies[recentEnergies.length - 1] === "number"
      ? recentEnergies[recentEnergies.length - 1]
      : null;

  const targetStages = getTargetStageByDepth(nextDepth);
  const targetEnergies = getTargetEnergyByDepth(nextDepth);

  // 1. 이미 쓴 질문 강한 패널티
  if (usedIds.includes(candidate.id)) {
    score -= 100;
  }

  // 2. 방금 질문과 완전 동일 타입 반복 패널티
  if (lastType && candidate.type === lastType) {
    score -= 22;
  } else {
    score += 8;
  }

  // 3. 최근 2개와 타입이 겹치면 추가 패널티
  const recentTwoTypes = recentTypes.slice(-2);
  if (candidate.type && recentTwoTypes.includes(candidate.type)) {
    score -= 10;
  }

  // 4. 같은 stage 연속 반복 패널티
  if (lastStage && candidate.stage === lastStage) {
    score -= 20;
  } else {
    score += 6;
  }

  // 5. 최근 2개와 같은 stage면 추가 패널티
  const recentTwoStages = recentStages.slice(-2);
  if (candidate.stage && recentTwoStages.includes(candidate.stage)) {
    score -= 8;
  }

  // 6. 다음 depth에 맞는 stage 보너스
  if (candidate.stage && targetStages.includes(candidate.stage)) {
    score += 18;
  }

  // 7. energy 목표 구간 보너스
  if (
    typeof candidate.energy === "number" &&
    targetEnergies.includes(candidate.energy)
  ) {
    score += 12;
  }

  // 8. energy가 너무 평평하면 약한 패널티
  if (
    typeof lastEnergy === "number" &&
    typeof candidate.energy === "number" &&
    candidate.energy === lastEnergy
  ) {
    score -= 8;
  }

  // 9. energy 급변 완화
  if (
    typeof lastEnergy === "number" &&
    typeof candidate.energy === "number" &&
    Math.abs(candidate.energy - lastEnergy) >= 3
  ) {
    score -= 10;
  }

  // 10. deepen/action 구간에서 integrate/action 성향 선호
  if (nextDepth === "deepen" || nextDepth === "action") {
    if (candidate.stage === "integrate") score += 10;
    if (candidate.type === "action") score += 8;
    if (candidate.type === "meaning") score += 6;
  }

  // 11. 현재 질문과 완전히 같은 id는 금지
  if (currentQuestionMeta?.id && candidate.id === currentQuestionMeta.id) {
    score -= 100;
  }

  // 12. 최근 질문 id 반복 방지
  if (recentQuestionIds.includes(candidate.id)) {
    score -= 26;
  }
  // 13. 현재 질문의 공식 follow-up이면 약한 우대
  if (candidate.id && preferredFollowUpIds.includes(candidate.id)) {
    score += 16;
  }
  return score;
}

function pickBestQuestionByFlow(candidates, ctx) {
  if (!Array.isArray(candidates) || candidates.length === 0) return null;

  let best = null;
  let bestScore = -Infinity;

  for (const candidate of candidates) {
    const score = scoreQuestionFlow(candidate, ctx);
    if (score > bestScore) {
      best = candidate;
      bestScore = score;
    }
  }

  return best;
}

function pickNextQuestionMeta(nextDepth, intentLabel = "") {
  const usedIds = Array.isArray(usedQuestionIds) ? usedQuestionIds : [];
  const flowMemory = safeSession.flowMemory || {};

  const preferredFollowUpIds = Array.isArray(currentQuestionMeta?.followUps)
    ? currentQuestionMeta.followUps.filter(Boolean)
    : [];

  const scoreContext = {
    nextDepth,
    flowMemory,
    usedIds,
    currentQuestionMeta,
    preferredFollowUpIds,
  };

  const candidateMap = new Map();

  function addCandidate(item) {
    if (!item || !item.id) return;
    if (!candidateMap.has(item.id)) {
      candidateMap.set(item.id, item);
    }
  }

  // 1) 공식 follow-up 후보 전부 수집
  preferredFollowUpIds.forEach((id) => {
    const q = getQuestionById(id);
    if (q) addCandidate(q);
  });

  // 2) 기존 follow-up 추천 엔진 결과도 후보로 포함
  if (currentQuestionMeta?.id) {
    const linkedFollowUp = findFollowUpQuestion({
      currentQuestionId: currentQuestionMeta.id,
      lessonId,
      category: selectedCategory,
      usedQuestionIds: usedIds,
      depth: safeSession.currentDepth || 1,
    });

    if (linkedFollowUp) addCandidate(linkedFollowUp);
  }

  // 3) depth pool 후보 수집
  const depthPoolRaw = getDepthQuestions(nextDepth, {
    lessonId,
    category: selectedCategory,
    intent: intentLabel,
  });

  const depthPool = Array.isArray(depthPoolRaw)
    ? depthPoolRaw.filter(Boolean)
    : [];

  depthPool.forEach((item) => {
    if (item?.text && item?.id) {
      addCandidate(item);
      return;
    }

    if (item?.questionId) {
      const linked = getQuestionById(item.questionId);
      if (linked) addCandidate(linked);
    }
  });

  // 4) lesson/category 랜덤 후보 추가
  for (let i = 0; i < 6; i += 1) {
    const randomCandidate = getRandomQuestion(
      lessonId,
      selectedCategory,
      usedIds
    );
    if (randomCandidate) addCandidate(randomCandidate);
  }

  // 5) general fallback 후보 추가
  for (let i = 0; i < 4; i += 1) {
    const generalCandidate = getRandomQuestion(lessonId, "general", usedIds);
    if (generalCandidate) addCandidate(generalCandidate);
  }

  const candidates = Array.from(candidateMap.values());

  // 6) follow-up 우대 + flowScore 재심사
  const best = pickBestQuestionByFlow(candidates, scoreContext);
  if (best) return best;

  return candidates[0] || null;
}

 function handleOtherQuestion() {
  const usedIds = Array.isArray(usedQuestionIds) ? usedQuestionIds : [];
  const flowMemory = safeSession.flowMemory || {};

  const candidateMap = new Map();

  function addCandidate(item) {
    if (!item || !item.id) return;
    if (!candidateMap.has(item.id)) {
      candidateMap.set(item.id, item);
    }
  }

  for (let i = 0; i < 8; i += 1) {
    const candidate = getRandomQuestion(lessonId, selectedCategory, usedIds);
    if (candidate) addCandidate(candidate);
  }

  for (let i = 0; i < 4; i += 1) {
    const fallback = getRandomQuestion(lessonId, "general", usedIds);
    if (fallback) addCandidate(fallback);
  }

  const candidates = Array.from(candidateMap.values());

  const picked = pickBestQuestionByFlow(candidates, {
    nextDepth: currentDepth,
    flowMemory,
    usedIds,
    currentQuestionMeta,
  });

  if (!picked) return;

  setSession((prev) => appendFlowMemory(prev, picked));
  setCurrentQuestion(picked.text || "");
  setCurrentQuestionMeta(picked);

  setUsedQuestionIds((prev) =>
    picked.id && !prev.includes(picked.id) ? [...prev, picked.id] : prev
  );

  setQuestionHistory((prev) => [...prev, picked.text || ""]);

  setSessionQuestions((prev) => {
    if (!prev.length) return prev;
    const copied = [...prev];
    copied[copied.length - 1] = {
      ...copied[copied.length - 1],
      question: picked.text || "",
      questionId: picked.id || null,
      intent: picked.intent || null,
      type: picked.type || null,
      stage: picked.stage || null,
      energy: picked.energy ?? null,
    };
    return copied;
  });

  setAnswer("");
  setDetectedIntentLabel("");
}

  function handleGoSummary(nextSessionQuestions, nextAnswersByDepth, finalSession) {
    navigate("/summary", {
      state: {
        lessonId,
        lessonTitle,
        category: selectedCategory,
        problem,
        session: normalizeSession(finalSession || session),
        sessionQuestions: nextSessionQuestions,
        answersByDepth: nextAnswersByDepth,
        record: makeRecord(nextSessionQuestions, nextAnswersByDepth),
      },
    });
  }

  function handleNextStep() {
    if (!answer.trim()) return;

    const trimmedAnswer = answer.trim();
    const intentLabel = "";

    setDetectedIntentLabel(intentLabel || "");

    const currentQuestionId = currentQuestionMeta?.id || null;
    const currentQuestionText = currentQuestionMeta?.text || currentQuestion || "";

    const nextSessionStateAfterAnswer = appendAnswerHistory(safeSession, {
      questionId: currentQuestionId,
      questionText: currentQuestionText,
      answer: trimmedAnswer,
      depth: safeSession.currentDepth,
    });

    const nextAnswersByDepth = {
      ...answersByDepth,
      [currentDepth]: [
        ...(answersByDepth[currentDepth] || []),
        {
          questionId: currentQuestionId,
          question: currentQuestionText,
          answer: trimmedAnswer,
          intent: intentLabel || null,
          type: currentQuestionMeta?.type || null,
          stage: currentQuestionMeta?.stage || null,
          energy: currentQuestionMeta?.energy ?? null,
        },
      ],
    };

    const nextSessionQuestions = sessionQuestions.map((item, index) => {
      if (index !== sessionQuestions.length - 1) return item;
      return {
        ...item,
        answer: trimmedAnswer,
        intent: intentLabel || item.intent || null,
      };
    });

    // 마지막 단계면 요약으로 이동
    if (isLastDepth(currentDepth)) {
      const finalRecord = makeRecord(nextSessionQuestions, nextAnswersByDepth);

      setSession(nextSessionStateAfterAnswer);
      setAnswersByDepth(nextAnswersByDepth);
      setSessionQuestions(nextSessionQuestions);

      handleGoSummary(
        nextSessionQuestions,
        nextAnswersByDepth,
        nextSessionStateAfterAnswer
      );
      return;
    }

    const nextDepth = getNextDepth(currentDepth);
    const nextQuestionMeta = pickNextQuestionMeta(nextDepth, intentLabel);

    if (!nextQuestionMeta) {
      const finalRecord = makeRecord(nextSessionQuestions, nextAnswersByDepth);
      saveRecord(finalRecord);

      setSession(nextSessionStateAfterAnswer);
      setAnswersByDepth(nextAnswersByDepth);
      setSessionQuestions(nextSessionQuestions);

      handleGoSummary(
        nextSessionQuestions,
        nextAnswersByDepth,
        nextSessionStateAfterAnswer
      );
      return;
    }

    const nextQuestionText =
      nextQuestionMeta.text || "다음 질문을 준비하지 못했습니다.";

    const sessionWithDepth = updateSessionDepth(
      nextSessionStateAfterAnswer,
      (safeSession.currentDepth || 1) + 1
    );
    const sessionWithFlow = appendFlowMemory(sessionWithDepth, nextQuestionMeta);

    setSession(sessionWithFlow);
    setCurrentDepth(nextDepth);
    setCurrentQuestion(nextQuestionText);
    setCurrentQuestionMeta(nextQuestionMeta);
    setAnswer("");
    setAnswersByDepth(nextAnswersByDepth);
    setSessionQuestions([
      ...nextSessionQuestions,
      {
        depth: nextDepth,
        question: nextQuestionText,
        answer: "",
        questionId: nextQuestionMeta.id || null,
        intent: nextQuestionMeta.intent || null,
        type: nextQuestionMeta.type || null,
        stage: nextQuestionMeta.stage || null,
        energy: nextQuestionMeta.energy ?? null,
      },
    ]);
    setQuestionHistory((prev) => [...prev, nextQuestionText]);
    setUsedQuestionIds((prev) =>
      nextQuestionMeta.id && !prev.includes(nextQuestionMeta.id)
        ? [...prev, nextQuestionMeta.id]
        : prev
    );
  }

  function handleGoBack() {
    navigate(-1);
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>AI 코칭</h1>
        <p className="page-subtitle">
          강의별 질문 흐름에 따라 한 단계씩 생각을 깊게 해봅니다.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: 12, color: "#777", marginBottom: 4 }}>
              현재 강의
            </div>
            <div style={{ fontWeight: 700 }}>{lessonTitle}</div>
          </div>

          <div>
            <div style={{ fontSize: 12, color: "#777", marginBottom: 4 }}>
              현재 단계
            </div>
            <div style={{ fontWeight: 700 }}>
              {currentDepth} ({progressText})
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, color: "#777", marginBottom: 4 }}>
              선택 카테고리
            </div>
            <div style={{ fontWeight: 700 }}>{selectedCategory}</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: "#777", marginBottom: 8 }}>
          현재 질문
        </div>

        <div style={{ fontSize: 12, color: "#777", marginTop: 4 }}>
          type: {currentQuestionMeta?.type || "-"} / stage: {currentQuestionMeta?.stage || "-"} / energy: {currentQuestionMeta?.energy ?? "-"}
        </div>

        <div style={{ fontSize: 12, color: "#777", marginTop: 8 }}>
          stage: {safeSession.flowMemory?.recentStages?.join(" → ") || "-"} / energy:{" "}
          {safeSession.flowMemory?.recentEnergies?.join(" → ") || "-"}
        </div>

        {detectedIntentLabel ? (
          <div style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>
            현재 답변 흐름 인식: {detectedIntentLabel}
          </div>
        ) : null}

        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            lineHeight: 1.6,
            marginBottom: 20,
          }}
        >
          {currentQuestion}
        </div>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="여기에 답변을 천천히 적어 보세요."
          rows={7}
          style={{
            width: "100%",
            boxSizing: "border-box",
            borderRadius: 12,
            border: "1px solid #ddd",
            padding: 14,
            fontSize: 15,
            lineHeight: 1.6,
            resize: "vertical",
          }}
        />

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginTop: 16,
          }}
        >
          <button
            className="primary-button"
            onClick={handleNextStep}
            disabled={!answer.trim()}
          >
            {isLastDepth(currentDepth) ? "요약으로 이동" : "다음 단계로"}
          </button>

          <button className="secondary-button" onClick={handleOtherQuestion}>
            다른 질문 보기
          </button>

          <button className="ghost-button" onClick={handleGoBack}>
            뒤로
          </button>
        </div>
      </div>

      <div className="card">
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
          코칭 흐름
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {COACH_DEPTHS.map((depth, index) => {
            const currentIndex = COACH_DEPTHS.indexOf(currentDepth);
            const isActive = depth === currentDepth;
            const isDone = index < currentIndex;

            return (
              <div
                key={depth}
                style={{
                  padding: "8px 12px",
                  borderRadius: 999,
                  border: "1px solid #ddd",
                  fontSize: 13,
                  fontWeight: 600,
                  opacity: isActive || isDone ? 1 : 0.5,
                }}
              >
                {depth}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}