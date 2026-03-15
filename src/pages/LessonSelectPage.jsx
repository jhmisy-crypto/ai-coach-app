import { useNavigate } from "react-router-dom";
import { LESSON_CONFIG } from "../data/lessonConfig";

export default function LessonSelectPage() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <div className="page">
        <h1 className="title">강의 선택</h1>
        <p className="text">지금 진행할 코칭 단계를 선택하세요.</p>

        {LESSON_CONFIG.map((lesson) => (
          <div
            key={lesson.id}
            className="card"
            onClick={() => navigate(`/problem/${lesson.id}`)}
          >
            <div className="subtitle">
              {lesson.id}. {lesson.title}
            </div>
            <div className="text">{lesson.hint}</div>
          </div>
        ))}

        <button className="button secondary" onClick={() => navigate("/")}>
          홈으로
        </button>
      </div>
    </div>
  );
}