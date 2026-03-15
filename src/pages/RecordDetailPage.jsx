import { useNavigate, useParams } from "react-router-dom";
import { deleteRecord, getRecordById } from "../utils/storage";
import { formatDate } from "../utils/formatDate";

export default function RecordDetailPage() {
  const navigate = useNavigate();
  const { recordId } = useParams();

  const record = getRecordById(recordId);

  if (!record) {
    return (
      <div className="app-container">
        <div className="page">
          <h2 className="title">기록을 찾을 수 없습니다.</h2>
          <button className="button" onClick={() => navigate("/archive")}>
            보관함으로
          </button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    deleteRecord(record.id);
    navigate("/archive");
  };

  return (
    <div className="app-container">
      <div className="page">
        <h1 className="title">{record.lessonTitle || "기록 상세"}</h1>

        <p className="text">
          <strong>작성일:</strong> {formatDate(record.createdAt)}
        </p>

        <div className="card">
          <div className="subtitle">문제</div>
          <div className="text">{record.problem}</div>
        </div>

        <div className="card">
          <div className="subtitle">답변</div>
          {(record.answers || []).length === 0 ? (
            <div className="text">답변이 없습니다.</div>
          ) : (
            record.answers.map((answer, index) => (
              <div key={index} className="text">
                {index + 1}. {answer}
              </div>
            ))
          )}
        </div>

        <div className="card">
          <div className="subtitle">요약</div>
          <div className="text">{record.summary}</div>
        </div>

        <div className="card">
          <div className="subtitle">실행 계획</div>
          <div className="text">{record.actionPlan}</div>
        </div>

        <div className="card">
          <div className="subtitle">회고</div>
          <div className="text">{record.reflection}</div>
        </div>

        <button className="button secondary" onClick={() => navigate("/archive")}>
          보관함으로
        </button>

        <button className="button" onClick={handleDelete}>
          기록 삭제
        </button>
      </div>
    </div>
  );
}