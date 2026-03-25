import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getLessonCoachConfig } from "../data/lessonCoachConfig";
import { buildSummaryFromSessionQuestions } from "../services/summaryEngine";


export default function SummaryPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state || {};
  const record = state.record || {};

  const rawLessonId =
    state.lessonId ||
    state.selectedLessonId ||
    record.lessonId ||
    "lesson1";

  const lessonId = String(rawLessonId).startsWith("lesson")
    ? String(rawLessonId)
    : `lesson${rawLessonId}`;

  const coachConfig = useMemo(() => getLessonCoachConfig(lessonId), [lessonId]);

  const lessonTitle =
    state.lessonTitle ||
    record.lessonTitle ||
    coachConfig.title ||
    "1강";

  const lessonTheme =
    state.lessonTheme ||
    record.lessonTheme ||
    coachConfig.theme ||
    lessonTitle ||
    "기본 코칭";

  const reflectionPrompt =
    state.reflectionPrompt ||
    coachConfig.reflectionPrompt ||
    "오늘 나는 내 생각을 한 걸음 더 또렷하게 바라보았다.";

  // 1) 예전 구조
  const legacyAnswers = Array.isArray(state.answers) ? state.answers : [];
  const legacyMessages = Array.isArray(state.messages) ? state.messages : [];

  // 2) 새 구조
  const summarySource = Array.isArray(state.summarySource)
    ? state.summarySource
    : Array.isArray(record.summarySource)
    ? record.summarySource
    : [];

  const sessionQuestions = Array.isArray(state.sessionQuestions)
    ? state.sessionQuestions
    : Array.isArray(record.sessionQuestions)
    ? record.sessionQuestions
    : [];

  const answersByDepth =
    state.answersByDepth ||
    record.answersByDepth ||
    {};

  // 질문 목록 구성
  const coachQuestions = useMemo(() => {
    if (sessionQuestions.length > 0) {
      return sessionQuestions
        .map((item) => item?.question || "")
        .filter(Boolean);
    }

    return legacyMessages
      .filter((message) => message.role === "coach")
      .map((message) => message.text)
      .filter(Boolean);
  }, [sessionQuestions, legacyMessages]);

  // 답변 목록 구성
  const userAnswers = useMemo(() => {
    if (summarySource.length > 0) {
      return summarySource
        .map((item) => item?.answer || "")
        .filter((text) => String(text).trim());
    }

    if (sessionQuestions.length > 0) {
      const fromSession = sessionQuestions
        .map((item) => item?.answer || "")
        .filter((text) => String(text).trim());

      if (fromSession.length > 0) return fromSession;
    }

    const fromDepth = Object.values(answersByDepth).flatMap((value) => {
      if (Array.isArray(value)) {
        return value
          .map((v) => String(v || "").trim())
          .filter(Boolean);
      }

      const one = String(value || "").trim();
      return one ? [one] : [];
    });

    if (fromDepth.length > 0) return fromDepth;

    if (legacyAnswers.length > 0) return legacyAnswers;

    return legacyMessages
      .filter((message) => message.role === "user")
      .map((message) => message.text)
      .filter((text) => String(text).trim());
  }, [summarySource, sessionQuestions, answersByDepth, legacyAnswers, legacyMessages]);

const summaryText = useMemo(() => {
  return (
    buildSummaryFromSessionQuestions(sessionQuestions) ||
    "아직 요약할 답변이 없습니다."
  );
}, [sessionQuestions]);

  const handleNext = () => {
    navigate("/reflection", {
      state: {
        lessonId,
        lessonTitle,
        lessonTheme,
        messages: legacyMessages,
        answers: userAnswers,
        reflectionPrompt,
        summaryText,
        category:
          state.selectedCategory ||
          state.category ||
          record.category ||
          "general",
        record: {
          ...record,
          lessonId,
          lessonTitle,
          lessonTheme,
          category:
            state.selectedCategory ||
            state.category ||
            record.category ||
            "general",
          summary: summaryText,
          sessionQuestions,
          answersByDepth,
          summarySource,
        },
        sessionQuestions,
        answersByDepth,
        summarySource,
      },
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="page">
      <div className="card">
        <div className="subtitle">코칭 요약</div>

        <h1 style={{ marginTop: 8, marginBottom: 8 }}>
          {lessonTheme || lessonTitle}
        </h1>

        <div className="text" style={{ marginBottom: 20 }}>
          이번 코칭에서 드러난 핵심 내용을 간단히 정리했습니다.
        </div>

        <div
          className="card"
          style={{
            marginBottom: 16,
            background: "#fafafa",
            border: "1px solid #e5e7eb",
          }}
        >
          <div className="subtitle" style={{ marginBottom: 10 }}>
            핵심 요약
          </div>
          <div className="text" style={{ lineHeight: 1.7 }}>
            {summaryText}
          </div>
        </div>

        <div
          className="card"
          style={{
            marginBottom: 16,
            background: "#fff",
            border: "1px solid #e5e7eb",
          }}
        >
          <div className="subtitle" style={{ marginBottom: 10 }}>
            회고 문장
          </div>
          <div className="text" style={{ lineHeight: 1.7 }}>
            {reflectionPrompt}
          </div>
        </div>

        {coachQuestions.length > 0 && (
          <div
            className="card"
            style={{
              marginBottom: 16,
              background: "#fff",
              border: "1px solid #e5e7eb",
            }}
          >
            <div className="subtitle" style={{ marginBottom: 10 }}>
              이번 코칭 질문
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              {coachQuestions.map((question, index) => (
                <div
                  key={`${index}-${question}`}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: "#f8fafc",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#6b7280",
                      marginBottom: 4,
                    }}
                  >
                    질문 {index + 1}
                  </div>
                  <div className="text">{question}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {userAnswers.length > 0 && (
          <div
            className="card"
            style={{
              marginBottom: 20,
              background: "#fff",
              border: "1px solid #e5e7eb",
            }}
          >
            <div className="subtitle" style={{ marginBottom: 10 }}>
              나의 답변 정리
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              {userAnswers.map((answer, index) => (
                <div
                  key={`${index}-${answer}`}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: "#eef6ff",
                    border: "1px solid #dbeafe",
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#4b5563",
                      marginBottom: 4,
                    }}
                  >
                    답변 {index + 1}
                  </div>
                  <div className="text">{answer}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 12 }}>
          <button className="button secondary" onClick={handleBack}>
            뒤로
          </button>

          <button className="button" onClick={handleNext}>
            회고로 이동
          </button>
        </div>
      </div>
    </div>
  );
}