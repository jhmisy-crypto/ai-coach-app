import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addRecord } from "../utils/storage";
import { createSession } from "../utils/sessionFactory";

export default function ReflectionPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    lessonId,
    lessonTitle,
    problem,
    answers,
    summary,
    actionPlan
  } = location.state || {};

  const [reflection, setReflection] = useState("");

  if (!summary) {
    return (
      <div className="app-container">
        <div className="page">
          <h2 className="title">잘못된 접근입니다.</h2>
          <button className="button" onClick={() => navigate("/")}>
            홈으로
          </button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    const session = createSession({
      lessonId,
      lessonTitle,
      problem,
      answers,
      summary,
      actionPlan,
      reflection
    });

    addRecord(session);
    navigate("/");
  };

  return (
    <div className="app-container">
      <div className="page">
        <h1 className="title">회고</h1>

        <textarea
          className="textarea"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="실행 후 느낀 점이나 배운 점을 적어보세요."
        />

        <button
          className="button"
          disabled={!reflection.trim()}
          onClick={handleSave}
        >
          기록 저장 후 홈으로
        </button>
      </div>
    </div>
  );
}