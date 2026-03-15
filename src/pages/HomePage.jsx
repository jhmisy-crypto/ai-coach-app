import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <div className="page">
        <h1 className="title">AI 코치 앱</h1>
        <p className="text">
          문제를 정리하고, 질문에 답하고, 실행 계획까지 이어가는 코칭형
          학습 앱입니다.
        </p>
        <p className="text">
          먼저 강의를 선택한 뒤, 현재 고민이나 과제를 입력하고 코칭을
          시작합니다.
        </p>

        <button className="button" onClick={() => navigate("/lessons")}>
          시작하기
        </button>

        <button className="button secondary" onClick={() => navigate("/archive")}>
          보관함 보기
         </button>
      </div>
    </div>
  );
}