import { useLocation, useNavigate } from "react-router-dom";

export default function SummaryPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { lessonId, lessonTitle, problem, answers, summary } =
    location.state || {};

  if (!summary) {
    return (
      <div className="app-container">
        <div className="page">
          <h2 className="title">요약 정보가 없습니다.</h2>
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
        <h1 className="title">코칭 요약</h1>

        <p className="text">
          <strong>강의:</strong> {lessonTitle}
        </p>

        <p className="text">
          <strong>문제:</strong> {problem}
        </p>

        <div className="card">
          <div className="subtitle">요약</div>
          <div className="text">{summary}</div>
        </div>

        <button
          className="button"
          onClick={() =>
            navigate("/action", {
              state: {
                lessonId,
                lessonTitle,
                problem,
                answers,
                summary
              }
            })
          }
        >
          실행 계획 작성
        </button>
      </div>
    </div>
  );
}