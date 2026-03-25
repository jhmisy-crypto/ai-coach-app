// src/pages/ActionPlanPage.jsx
// 또는 src/screens/ActionPlanPage.jsx

import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const STORAGE_KEY = "ai_action_plans_v1";

function readActionPlans() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("액션플랜 읽기 실패:", error);
    return [];
  }
}

function saveActionPlan(record) {
  try {
    const prev = readActionPlans();
    const next = [record, ...prev];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (error) {
    console.error("액션플랜 저장 실패:", error);
  }
}

function makeDefaultAction(summaryInsight, issueText) {
  if (summaryInsight?.trim()) {
    return "";
  }

  if (issueText?.trim()) {
    return `${issueText}와 관련해 오늘 바로 할 수 있는 작은 행동 1가지를 정해 보세요.`;
  }

  return "";
}

export default function ActionPlanPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const coachRecord = location.state?.coachRecord || null;
  const selectedCategory = location.state?.selectedCategory || coachRecord?.category || "general";
  const selectedLesson = location.state?.selectedLesson || coachRecord?.title || "문제의 명확화";
  const issueText = location.state?.issue || coachRecord?.problem || "";
  const summaryInsight = location.state?.summaryInsight || "";

  const sessionLog = useMemo(() => {
    return Array.isArray(coachRecord?.sessionLog) ? coachRecord.sessionLog : [];
  }, [coachRecord]);

  const [actionText, setActionText] = useState(makeDefaultAction(summaryInsight, issueText));
  const [whyText, setWhyText] = useState("");
  const [whenText, setWhenText] = useState("");

  const canGoNext =
    actionText.trim().length > 0 ||
    whyText.trim().length > 0 ||
    whenText.trim().length > 0;

  const handleSaveAndNext = () => {
    if (!canGoNext) {
      alert("행동 계획을 한 줄이라도 기록해 주세요.");
      return;
    }

    const actionPlanRecord = {
      id: `action-${Date.now()}`,
      type: "action-plan",
      createdAt: new Date().toISOString(),
      category: selectedCategory,
      title: selectedLesson,
      issue: issueText,
      summaryInsight,
      actionText: actionText.trim(),
      whyText: whyText.trim(),
      whenText: whenText.trim(),
      coachRecordId: coachRecord?.id || null,
      sessionLog,
    };

    saveActionPlan(actionPlanRecord);

    navigate("/reflection", {
      state: {
        coachRecord,
        actionPlanRecord,
        selectedCategory,
        selectedLesson,
        issue: issueText,
        summaryInsight,
      },
    });
  };

  const handleBackToSummary = () => {
    navigate("/summary", {
      state: {
        coachRecord,
        selectedCategory,
        selectedLesson,
        issue: issueText,
      },
    });
  };

  return (
    <div className="page">
      <div style={{ maxWidth: 860, margin: "0 auto", padding: 16 }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: 20,
            marginBottom: 16,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>
            행동 계획
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 28,
              lineHeight: 1.35,
              color: "#111",
              marginBottom: 10,
            }}
          >
            {selectedLesson}
          </h1>

          <div style={{ fontSize: 14, color: "#666" }}>
            이번 코칭에서 나온 생각을 작은 행동으로 옮겨 봅니다.
          </div>
        </div>

        {issueText ? (
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 20,
              marginBottom: 16,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>
              내가 가져온 문제
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 14,
                background: "#f7f7f8",
                lineHeight: 1.7,
                color: "#222",
              }}
            >
              {issueText}
            </div>
          </div>
        ) : null}

        {summaryInsight ? (
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 20,
              marginBottom: 16,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>
              이번 단계에서 남은 한 줄
            </div>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 14,
                background: "#f8f9fb",
                border: "1px solid #eceef3",
                lineHeight: 1.7,
                color: "#222",
                whiteSpace: "pre-wrap",
              }}
            >
              {summaryInsight}
            </div>
          </div>
        ) : null}

        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: 20,
            marginBottom: 16,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
            1. 지금 정하고 싶은 작은 행동
          </div>

          <textarea
            value={actionText}
            onChange={(e) => setActionText(e.target.value)}
            placeholder="예: 아내와 이번 주에 차 한 잔 하며 30분 이야기하기"
            rows={4}
            style={{
              width: "100%",
              resize: "vertical",
              borderRadius: 14,
              border: "1px solid #d9d9de",
              padding: 14,
              fontSize: 16,
              lineHeight: 1.6,
              outline: "none",
              boxSizing: "border-box",
              marginBottom: 16,
            }}
          />

          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
            2. 왜 이 행동이 중요한가
          </div>

          <textarea
            value={whyText}
            onChange={(e) => setWhyText(e.target.value)}
            placeholder="예: 관계 개선은 거창한 말보다 작은 시간을 함께 보내는 데서 시작되기 때문"
            rows={4}
            style={{
              width: "100%",
              resize: "vertical",
              borderRadius: 14,
              border: "1px solid #d9d9de",
              padding: 14,
              fontSize: 16,
              lineHeight: 1.6,
              outline: "none",
              boxSizing: "border-box",
              marginBottom: 16,
            }}
          />

          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
            3. 언제 실천할 것인가
          </div>

          <textarea
            value={whenText}
            onChange={(e) => setWhenText(e.target.value)}
            placeholder="예: 이번 토요일 저녁 식사 후"
            rows={3}
            style={{
              width: "100%",
              resize: "vertical",
              borderRadius: 14,
              border: "1px solid #d9d9de",
              padding: 14,
              fontSize: 16,
              lineHeight: 1.6,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: 20,
            marginBottom: 16,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>
            이번 코칭 흐름 참고
          </div>

          {sessionLog.length === 0 ? (
            <div style={{ fontSize: 14, color: "#777" }}>
              참고할 세션 기록이 없습니다.
            </div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {sessionLog.map((item, index) => (
                <div
                  key={`${item.questionId || "question"}-${index}`}
                  style={{
                    padding: 14,
                    borderRadius: 14,
                    background: "#f8f9fb",
                    border: "1px solid #eceef3",
                  }}
                >
                  <div style={{ fontSize: 13, color: "#666", marginBottom: 6 }}>
                    STEP {item.step || index + 1}
                  </div>
                  <div style={{ fontWeight: 700, marginBottom: 6, lineHeight: 1.6 }}>
                    Q. {item.question}
                  </div>
                  <div style={{ color: "#222", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                    A. {item.answer}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <button
            onClick={handleBackToSummary}
            style={{
              padding: "12px 18px",
              border: "none",
              borderRadius: 12,
              background: "#e5e7eb",
              color: "#222",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            요약으로 돌아가기
          </button>

          <button
            onClick={handleSaveAndNext}
            style={{
              padding: "12px 18px",
              border: "none",
              borderRadius: 12,
              background: "#111827",
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            회고 단계로
          </button>
        </div>
      </div>
    </div>
  );
}