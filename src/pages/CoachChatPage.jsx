import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getHintByLessonId,
  getLessonById,
  getNextQuestionIndex,
  getQuestionText,
  getSummaryType
} from "../services/coachEngine";
import { generateSummary } from "../services/summaryEngine";

export default function CoachChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lessonId } = useParams();

  const numericLessonId = Number(lessonId);
  const lesson = getLessonById(numericLessonId);
  const problem = location.state?.problem || "";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [answers, setAnswers] = useState([]);

  const questionText = useMemo(() => {
    return getQuestionText(numericLessonId, currentIndex);
  }, [numericLessonId, currentIndex]);

  const hint = getHintByLessonId(numericLessonId);

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

  if (!problem) {
    return (
      <div className="app-container">
        <div className="page">
          <h2 className="title">먼저 문제를 입력해 주세요.</h2>
          <button
            className="button"
            onClick={() => navigate(`/problem/${numericLessonId}`)}
          >
            문제 입력으로
          </button>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if (!input.trim()) return;

    const nextAnswers = [...answers, input.trim()];
    const nextIndex = getNextQuestionIndex(currentIndex, numericLessonId);

    if (nextIndex === null) {
      const summaryType = getSummaryType(numericLessonId);
      const summary = generateSummary(nextAnswers, summaryType);

      navigate("/summary", {
        state: {
          lessonId: numericLessonId,
          lessonTitle: lesson.title,
          problem,
          answers: nextAnswers,
          summary
        }
      });
      return;
    }

    setAnswers(nextAnswers);
    setCurrentIndex(nextIndex);
    setInput("");
  };

  return (
    <div className="app-container">
      <div className="page">
        <h1 className="title">{lesson.title}</h1>

        <p className="text">
          <strong>현재 문제:</strong> {problem}
        </p>

        <p className="text">
          <strong>질문 {currentIndex + 1}</strong>
        </p>

        <div className="card">
          <div className="subtitle">{questionText}</div>
          <div className="text">{hint}</div>
        </div>

        <textarea
          className="textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="여기에 답변을 입력하세요."
        />

        <button
          className="button"
          onClick={handleNext}
          disabled={!input.trim()}
        >
          {getNextQuestionIndex(currentIndex, numericLessonId) === null
            ? "요약 보기"
            : "다음 질문"}
        </button>

        <button
          className="button secondary"
          onClick={() => navigate(`/problem/${numericLessonId}`)}
        >
          이전으로
        </button>
      </div>
    </div>
  );
}