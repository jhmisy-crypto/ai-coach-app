// src/pages/LessonSelectPage.jsx

import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LESSON_CONFIG } from "../data/lessonConfig";
import { QUESTION_CATEGORIES } from "../data/questions";

export default function LessonSelectPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const selectedCategory =
    searchParams.get("category") ||
    searchParams.get("selectedCategory") ||
    "general";

  const selectedCategoryLabel = useMemo(() => {
    return QUESTION_CATEGORIES[selectedCategory] || "전체";
  }, [selectedCategory]);

  return (
    <div className="page">
      <div className="card">
        <div className="subtitle">강의 선택</div>
        <h1 style={{ marginTop: 8, marginBottom: 8 }}>어느 강의로 시작하시겠습니까?</h1>
        <div className="text" style={{ marginBottom: 8 }}>
          선택된 카테고리: <strong>{selectedCategoryLabel}</strong>
        </div>
        <div className="text" style={{ marginBottom: 20 }}>
          지금 단계에서는 강의를 선택하면 바로 코칭 화면으로 이동합니다.
        </div>

        {LESSON_CONFIG.map((lesson) => (
          <div
            key={lesson.id}
            className="card"
            style={{ marginBottom: 12, cursor: "pointer" }}
            onClick={() => {
              console.log(
                "[LessonSelectPage] navigate -> CoachChatPage, lessonId =",
                lesson.id
              );
              console.log(
                "[LessonSelectPage] selectedCategory =",
                selectedCategory
              );

              navigate(
              `/coach?lesson=${lesson.id}&category=${encodeURIComponent(selectedCategory)}`
       );
            }}
          >
            <div className="subtitle">
              {lesson.id.replace("lesson", "")}강. {lesson.title}
            </div>
            <div className="text">{lesson.hint}</div>
          </div>
        ))}

        <button
          className="button secondary"
          onClick={() => navigate("/")}
          style={{ marginTop: 8 }}
        >
          홈으로
        </button>
      </div>
    </div>
  );
}