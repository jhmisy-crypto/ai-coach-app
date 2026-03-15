import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ActionPlanPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { lessonId, lessonTitle, problem, answers, summary } =
    location.state || {};

  const [plan, setPlan] = useState("");

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

  return (
    <div className="app-container">
      <div className="page">
        <h1 className="title">실행 계획</h1>

        <textarea
          className="textarea"
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          placeholder="오늘 바로 실행할 행동을 적어보세요."
        />

        <button
          className="button"
          disabled={!plan.trim()}
          onClick={() =>
            navigate("/reflection", {
              state: {
                lessonId,
                lessonTitle,
                problem,
                answers,
                summary,
                actionPlan: plan
              }
            })
          }
        >
          회고로 이동
        </button>
      </div>
    </div>
  );
}