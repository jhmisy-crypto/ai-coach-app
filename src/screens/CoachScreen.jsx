import { useMemo, useState } from "react";
import { saveCoachRecord, loadCoachRecords } from "../utils/storage";
import { QUESTION_CATEGORIES, CATEGORY_NAMES } from "../data/questions";


function getRandomIndex(length) {
  return Math.floor(Math.random() * length);
}

function getRandomIndexExcept(currentIndex, length) {
  if (length <= 1) return currentIndex;

  let nextIndex = currentIndex;

  while (nextIndex === currentIndex) {
    nextIndex = Math.floor(Math.random() * length);
  }

  return nextIndex;
}

function CoachScreen() {
  const [category, setCategory] = useState("감사");
  const questions = useMemo(() => QUESTION_CATEGORIES[category], [category]);

  const [questionIndex, setQuestionIndex] = useState(() =>
    getRandomIndex(QUESTION_CATEGORIES["감사"].length)
  );

  const [answer, setAnswer] = useState("");
  const [records, setRecords] = useState(loadCoachRecords());

  const question = questions[questionIndex];

  function getNow() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const h = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${d} ${h}:${min}`;
  }

  function handleSave() {
    if (!answer.trim()) {
      alert("답변을 입력해 주세요.");
      return;
    }

    const newRecord = {
      id: Date.now(),
      category,
      question,
      answer,
      createdAt: getNow(),
    };

    saveCoachRecord(newRecord);
    setRecords(loadCoachRecords());
    setAnswer("");
    alert("저장되었습니다.");
  }

  function handleNextQuestion() {
    const nextIndex = getRandomIndexExcept(questionIndex, questions.length);
    setQuestionIndex(nextIndex);
    setAnswer("");
  }

  function handleCategoryChange(nextCategory) {
    setCategory(nextCategory);
    const nextQuestions = QUESTION_CATEGORIES[nextCategory];
    const nextIndex = getRandomIndex(nextQuestions.length);
    setQuestionIndex(nextIndex);
    setAnswer("");
  }

  return (
    <div className="screen-wrap">
      <div className="card input-card single-card">
        <div className="question-top">
          <h2>오늘의 질문</h2>
          <span className="question-badge">
            {category} · {questionIndex + 1} / {questions.length}
          </span>
        </div>

        <div className="category-row">
          {CATEGORY_NAMES.map((name) => (
            <button
              key={name}
              className={
                name === category
                  ? "category-button active-category-button"
                  : "category-button"
              }
              onClick={() => handleCategoryChange(name)}
            >
              {name}
            </button>
          ))}
        </div>

        <p className="question">{question}</p>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="여기에 답변을 입력하세요."
          rows={6}
        />

        <div className="button-row dual-buttons">
          <button onClick={handleSave}>저장</button>
          <button className="secondary-button" onClick={handleNextQuestion}>
            랜덤 질문
          </button>
        </div>

        <p className="helper-text">현재 저장된 기록 수: {records.length}</p>
      </div>
    </div>
  );
}

export default CoachScreen;