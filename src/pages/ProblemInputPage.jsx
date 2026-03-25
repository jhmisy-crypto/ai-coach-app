import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getLessonById } from "../services/coachEngine";

export default function ProblemInputPage() {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "general";

  console.log("[ProblemInputPage] lessonId =", lessonId);
  console.log("[ProblemInputPage] searchParams category =", selectedCategory);
  console.log("[ProblemInputPage] full search =", window.location.search);

  const lesson = getLessonById(Number(lessonId));
  const [problem, setProblem] = useState("");

  const CATEGORY_LABEL = {
  general: "전체",
  gratitude: "감사",
  emotion: "감정",
  relationship: "관계",
  action: "실행",
};

  if (!lesson) {
    return (
      <div className="app-container">
        <div className="page">
          <h2 className="title">강의를 찾을 수 없습니다.</h2>
          <button className="button" onClick={() => navigate("/")}>
            홈으로
          </button>
        </div>
      </div>
    );
  }

  const handleStart = () => {
  if (!problem.trim()) return;

  

  navigate(
  `/coach?lesson=${lessonId}&category=${encodeURIComponent(selectedCategory)}`,
  {
    state: {
      lessonId,
      selectedCategory,
      selectedLesson: lesson.title,
      issue: problem,
      problemText: problem,
    },
  }
);
};

  return (
    <div className="app-container">
      <div className="page">
        <h1 className="title">{lesson.title}</h1>

        <p>질문 카테고리: {CATEGORY_LABEL[selectedCategory]}</p>

        <div className="text">현재 다루고 싶은 문제를 입력하세요.</div>

        <textarea
          className="textarea"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="예: 시간 관리를 잘 못해서 중요한 일을 자주 미룹니다."
        />

        <button
          className="button"
          onClick={handleStart}
          disabled={!problem.trim()}
        >
          코칭 시작
        </button>

        <button
          className="button secondary"
          onClick={() => navigate("/lessons")}
        >
          강의 선택으로
        </button>
      </div>
    </div>
  );
}