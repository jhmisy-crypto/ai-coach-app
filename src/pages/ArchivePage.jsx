import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllRecords } from "../utils/storage";
import { searchRecords } from "../utils/search";
import { formatDate } from "../utils/formatDate";

export default function ArchivePage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [records] = useState(getAllRecords());

  const filteredRecords = useMemo(() => {
    return searchRecords(records, keyword);
  }, [records, keyword]);

  return (
    <div className="app-container">
      <div className="page">
        <h1 className="title">보관함</h1>

        <input
          className="input"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="강의명, 문제, 요약, 실행계획, 회고 검색"
        />

        {filteredRecords.length === 0 ? (
          <p className="text">저장된 기록이 없습니다.</p>
        ) : (
          filteredRecords.map((record) => (
            <div
              key={record.id}
              className="card"
              onClick={() => navigate(`/records/${record.id}`)}
            >
              <div className="subtitle">{record.lessonTitle || "제목 없음"}</div>
              <div className="text">
                {record.problem || "문제 내용이 없습니다."}
              </div>
              <div className="text">{formatDate(record.createdAt)}</div>
            </div>
          ))
        )}

        <button className="button secondary" onClick={() => navigate("/")}>
          홈으로
        </button>
      </div>
    </div>
  );
}