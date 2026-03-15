import { useMemo, useState } from "react";
import {
  loadCoachRecords,
  deleteCoachRecord,
  clearCoachRecords,
} from "../utils/storage";

const FILTERS = ["전체", "감사", "실행", "감정", "관계"];

function HistoryScreen() {
  const [records, setRecords] = useState(loadCoachRecords());
  const [filter, setFilter] = useState("전체");

  const filteredRecords = useMemo(() => {
    if (filter === "전체") return records;
    return records.filter((record) => record.category === filter);
  }, [records, filter]);

  function handleDelete(id) {
    const ok = window.confirm("이 기록을 삭제하시겠습니까?");
    if (!ok) return;

    const next = deleteCoachRecord(id);
    setRecords(next);
  }

  function handleClearAll() {
    const ok = window.confirm("모든 기록을 비우시겠습니까?");
    if (!ok) return;

    const next = clearCoachRecords();
    setRecords(next);
  }

  return (
    <div className="screen-wrap">
      <section className="card history-card single-history-card">
        <div className="history-header">
          <div>
            <h2>나의 코칭 기록</h2>
            <p className="history-count">
              현재 보기: {filter} · 총 {filteredRecords.length}개
            </p>
          </div>

          {records.length > 0 && (
            <button className="clear-button strong-button" onClick={handleClearAll}>
              전체 비우기
            </button>
          )}
        </div>

        <div className="filter-row">
          {FILTERS.map((name) => (
            <button
              key={name}
              className={
                name === filter
                  ? "filter-button active-filter-button"
                  : "filter-button"
              }
              onClick={() => setFilter(name)}
            >
              {name}
            </button>
          ))}
        </div>

        {filteredRecords.length === 0 ? (
          <div className="empty-box">
            <p className="empty-text">해당 조건의 기록이 없습니다.</p>
            <p className="empty-subtext">
              다른 카테고리를 선택하거나 코칭 화면에서 새 기록을 저장해 보세요.
            </p>
          </div>
        ) : (
          <div className="record-list tall-list">
            {filteredRecords.map((r) => (
              <div className="record-card record-card-solid" key={r.id}>
                <div className="record-category">카테고리: {r.category || "미분류"}</div>
                <div className="record-question">질문: {r.question}</div>
                <div className="record-answer">답변: {r.answer}</div>
                <div className="record-date">저장일시: {r.createdAt}</div>

                <div className="record-actions">
                  <button
                    className="delete-button strong-delete-button"
                    onClick={() => handleDelete(r.id)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default HistoryScreen;