// src/pages/ReflectionPage.jsx

import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getLessonCoachConfig } from "../data/lessonCoachConfig";
import { saveRecord } from "../utils/storage";

export default function ReflectionPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state || {};

  const rawLessonId =
    state.lessonId ||
    state.selectedLessonId ||
    state.lesson ||
    "lesson1";

  const lessonId = String(rawLessonId).startsWith("lesson")
    ? String(rawLessonId)
    : `lesson${String(rawLessonId).replace(/[^\d]/g, "") || "1"}`;

  const coachConfig = useMemo(
    () => getLessonCoachConfig(lessonId),
    [lessonId]
  );

  const lessonTitle = state.lessonTitle || coachConfig.title || "코칭";
  const lessonTheme = state.lessonTheme || coachConfig.theme || "";

  const reflectionPrompt =
    state.reflectionPrompt ||
    coachConfig.reflectionPrompt ||
    "이번 코칭을 돌아보며 나의 통찰을 정리해 보세요.";

  const summaryText =
    state.summary ||
    state.summaryText ||
    "아직 요약할 내용이 충분하지 않습니다.";

  const answers = Array.isArray(state.answers)
    ? state.answers
    : [];

  const draftRecord =
    state.draftRecord ||
    state.record ||
    null;

  const [reflectionText, setReflectionText] = useState(
    draftRecord?.reflection ||
      ""
  );

  const handleBack = () => {
    navigate(-1);
  };

  const handleSaveAndFinish = () => {
    try {
      if (!draftRecord) {
        console.error("[ReflectionPage] draftRecord 없음", state);
        alert("저장할 기록 정보가 없습니다.");
        return;
      }

      const finalRecord = {
        ...draftRecord,
        summary: draftRecord.summary || summaryText,
        reflection: String(reflectionText || "").trim(),
        updatedAt: new Date().toISOString(),
      };

      console.log("[ReflectionPage] finalRecord", finalRecord);

     saveRecord(finalRecord);

      navigate(`/record/${finalRecord.id}`);

    } catch (error) {
      console.error("[ReflectionPage 저장 오류]", error);
      alert("기록 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="page">
      <div className="card">

        <div className="subtitle">회고</div>

        <h1 style={{ marginTop: 8, marginBottom: 8 }}>
          {lessonTheme || lessonTitle}
        </h1>

        <div className="text" style={{ marginBottom: 20 }}>
          이번 코칭을 돌아보며 나에게 남은 통찰을 정리해 보세요.
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <div className="subtitle">코칭 요약</div>
          <p>{summaryText}</p>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <div className="subtitle">회고 문장 가이드</div>
          <p>{reflectionPrompt}</p>
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <div className="subtitle">나의 회고</div>

          <textarea
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            placeholder="이번 코칭을 통해 느낀 점을 적어 보세요."
            style={{
              width: "100%",
              minHeight: 180,
              padding: 14,
              borderRadius: 12,
              border: "1px solid #ccc",
              fontSize: 16,
            }}
          />
        </div>

        {answers.length > 0 && (
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="subtitle">참고할 나의 답변</div>

            {answers.map((a, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <b>답변 {i + 1}</b>
                <div>{a}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="button"
            className="button secondary"
            onClick={handleBack}
          >
            뒤로
          </button>

          <button
            type="button"
            className="button"
            onClick={handleSaveAndFinish}
          >
            회고 저장하고 마무리
          </button>
        </div>

      </div>
    </div>
  );
}