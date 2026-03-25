import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LESSON_CONFIG } from "../data/lessonConfig";

const STORAGE_KEYS = ["ai_coach_records", "records"];

function readRecords() {
  for (const key of STORAGE_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;

      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (error) {
      console.error("[ArchivePage] readRecords error:", error);
    }
  }

  return [];
}

function getRecordTime(record) {
  const value =
    record?.createdAt ||
    record?.updatedAt ||
    record?.date ||
    record?.savedAt ||
    null;

  if (!value) return 0;

  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function formatDate(value) {
  if (!value) return "-";

  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (error) {
    return String(value);
  }
}

function getRecordId(record) {
  return record?.id || record?.createdAt || null;
}

function getLessonKey(record) {
  if (!record) return "";

  const raw = record.lessonId || record.lesson || "";

  if (typeof raw === "string" && raw.startsWith("lesson")) {
    return raw;
  }

  if (typeof raw === "number") {
    return `lesson${raw}`;
  }

  if (typeof raw === "string" && /^\d+$/.test(raw)) {
    return `lesson${raw}`;
  }

  return String(raw || "");
}

function getLessonTitleByRecord(record) {
  const lessonKey = getLessonKey(record);
  const found = LESSON_CONFIG.find((lesson) => lesson.id === lessonKey);

  if (found) {
    const num = String(found.id).replace("lesson", "");
    return `${num}강 (${found.title})`;
  }

  const fallbackTitle =
    record?.lessonTitle ||
    record?.lessonName ||
    record?.title ||
    "코칭";

  const fallbackNum = lessonKey.replace("lesson", "");
  if (fallbackNum && fallbackNum !== lessonKey) {
    return `${fallbackNum}강 (${fallbackTitle})`;
  }

  return fallbackTitle;
}

function getRecordPreview(record) {
  const text =
    record?.summary ||
    record?.content ||
    record?.answer ||
    record?.reflection ||
    record?.note ||
    record?.body ||
    "";

  if (!text) return "저장된 내용을 열어 자세히 확인해 보세요.";

  return String(text);
}

function normalizeText(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.toLowerCase();
  if (typeof value === "number") return String(value).toLowerCase();
  if (Array.isArray(value)) return value.join(" ").toLowerCase();

  try {
    return JSON.stringify(value).toLowerCase();
  } catch (error) {
    return String(value).toLowerCase();
  }
}

function matchesSearch(record, keyword) {
  if (!keyword.trim()) return true;

  const q = keyword.trim().toLowerCase();

  const target = [
    getLessonTitleByRecord(record),
    record?.title,
    record?.topic,
    record?.lessonTitle,
    record?.question,
    record?.summary,
    record?.content,
    record?.answer,
    record?.reflection,
    record?.note,
    record?.body,
    record?.category,
    record?.lesson,
    record?.lessonId,
  ]
    .map(normalizeText)
    .join(" ");

  return target.includes(q);
}

function matchesLesson(record, selectedLesson) {
  if (!selectedLesson) return true;
  return getLessonKey(record) === selectedLesson;
}

function EmptyState() {
  return (
    <div
      style={{
        border: "1px dashed #d8d8d8",
        borderRadius: 16,
        padding: 28,
        background: "#fafafa",
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: "#222",
          marginBottom: 8,
        }}
      >
        아직 저장된 기록이 없습니다
      </div>

      <div
        style={{
          fontSize: 14,
          color: "#666",
          lineHeight: 1.7,
        }}
      >
        코칭을 시작하고 기록을 남기면,
        이 보관함에서 다시 찾아보고 이어갈 수 있습니다.
      </div>
    </div>
  );
}

function NoSearchResult({ query, selectedLesson, onClear }) {
  const selectedLessonLabel = selectedLesson
    ? LESSON_CONFIG.find((l) => l.id === selectedLesson)?.title || selectedLesson
    : null;

  return (
    <div
      style={{
        border: "1px dashed #d8d8d8",
        borderRadius: 16,
        padding: 24,
        background: "#fafafa",
      }}
    >
      <div
        style={{
          fontSize: 17,
          fontWeight: 700,
          color: "#222",
          marginBottom: 8,
        }}
      >
        검색 결과가 없습니다
      </div>

      <div
        style={{
          fontSize: 14,
          color: "#666",
          lineHeight: 1.7,
          marginBottom: 16,
        }}
      >
        {selectedLessonLabel ? (
          <>
            <strong>{selectedLessonLabel}</strong> 범위에서
            {query.trim() ? ` "${query}"` : ""} 와 일치하는 기록을 찾지 못했습니다.
          </>
        ) : (
          <>
            <span style={{ fontWeight: 600 }}>"{query}"</span> 와 일치하는 기록을 찾지 못했습니다.
          </>
        )}
      </div>

      <button
        onClick={onClear}
        style={{
          padding: "10px 14px",
          borderRadius: 10,
          border: "1px solid #d9d9d9",
          background: "#fff",
          cursor: "pointer",
        }}
      >
        필터 초기화
      </button>
    </div>
  );
}

function RecordCard({ record, onClick }) {
  const title = getLessonTitleByRecord(record);
  const preview = getRecordPreview(record);
  const createdAt = record?.createdAt || record?.updatedAt || record?.date;

  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        padding: 18,
        borderRadius: 16,
        border: "1px solid #e8e8e8",
        background: "#fff",
        cursor: "pointer",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "flex-start",
          flexWrap: "wrap",
          marginBottom: 10,
        }}
      >
        <div style={{ flex: 1, minWidth: 220 }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#111",
              lineHeight: 1.45,
              marginBottom: 6,
            }}
          >
            {title}
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              fontSize: 12,
              color: "#666",
            }}
          >
            <span>category: {record?.category || "-"}</span>
          </div>
        </div>

        <div
          style={{
            fontSize: 12,
            color: "#777",
            whiteSpace: "nowrap",
          }}
        >
          {formatDate(createdAt)}
        </div>
      </div>

      <div
        style={{
          fontSize: 14,
          color: "#555",
          lineHeight: 1.7,
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 4,
          WebkitBoxOrient: "vertical",
          marginBottom: 12,
        }}
      >
        {preview}
      </div>

      <div
        style={{
          fontSize: 13,
          color: "#6b7280",
          fontWeight: 600,
        }}
      >
        기록 열기 →
      </div>
    </button>
  );
}

export default function ArchivePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedLesson, setSelectedLesson] = useState("");

  const allRecords = useMemo(() => {
    const records = readRecords();
    return [...records].sort((a, b) => getRecordTime(b) - getRecordTime(a));
  }, []);

  const filteredRecords = useMemo(() => {
    return allRecords.filter((record) => {
      return (
        matchesLesson(record, selectedLesson) &&
        matchesSearch(record, search)
      );
    });
  }, [allRecords, selectedLesson, search]);

  const handleGoHome = () => {
    navigate("/");
  };

  const handleOpenRecord = (record) => {
    const id = getRecordId(record);
    if (!id) return;
    navigate(`/record/${id}`);
  };

  const handleClearFilters = () => {
    setSearch("");
    setSelectedLesson("");
  };

  const hasRecords = allRecords.length > 0;
  const hasFilteredRecords = filteredRecords.length > 0;

  return (
    <div
      style={{
        maxWidth: 980,
        margin: "0 auto",
        padding: "24px 16px 48px",
      }}
    >
      <section
        style={{
          background: "#fff",
          border: "1px solid #e8e8e8",
          borderRadius: 20,
          padding: 22,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "flex-start",
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          <div>
            <div style={{ fontSize: 13, color: "#777", marginBottom: 6 }}>
              Archive
            </div>
            <h1
              style={{
                margin: "0 0 8px 0",
                fontSize: 28,
                color: "#111",
                lineHeight: 1.35,
              }}
            >
              기록 보관함
            </h1>
            <p
              style={{
                margin: 0,
                color: "#666",
                fontSize: 14,
                lineHeight: 1.7,
              }}
            >
              저장한 기록을 검색하고, 강의별로 좁혀 보고, 다시 열어볼 수 있습니다.
            </p>
          </div>

          <button
            onClick={handleGoHome}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #d9d9d9",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            홈으로
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 220px auto",
            gap: 10,
            alignItems: "center",
          }}
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="강의 제목, 질문, 요약, 회고로 검색해 보세요"
            style={{
              width: "100%",
              padding: "13px 14px",
              borderRadius: 12,
              border: "1px solid #d8dbe3",
              outline: "none",
              fontSize: 14,
              background: "#fff",
            }}
          />

          <select
            value={selectedLesson}
            onChange={(e) => setSelectedLesson(e.target.value)}
            style={{
              width: "100%",
              padding: "13px 14px",
              borderRadius: 12,
              border: "1px solid #d8dbe3",
              outline: "none",
              fontSize: 14,
              background: "#fff",
            }}
          >
            <option value="">전체 강의</option>
            {LESSON_CONFIG.map((lesson) => {
              const num = lesson.id.replace("lesson", "");
              return (
                <option key={lesson.id} value={lesson.id}>
                  {num}강. {lesson.title}
                </option>
              );
            })}
          </select>

          {search.trim() || selectedLesson ? (
            <button
              onClick={handleClearFilters}
              style={{
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid #d9d9d9",
                background: "#fff",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              초기화
            </button>
          ) : (
            <div
              style={{
                padding: "0 4px",
                fontSize: 13,
                color: "#777",
                whiteSpace: "nowrap",
              }}
            >
              총 {allRecords.length}개
            </div>
          )}
        </div>
      </section>

      {!hasRecords ? (
        <EmptyState />
      ) : !hasFilteredRecords ? (
        <NoSearchResult
          query={search}
          selectedLesson={selectedLesson}
          onClear={handleClearFilters}
        />
      ) : (
        <section>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: 14,
            }}
          >
            <div style={{ fontSize: 14, color: "#666" }}>
              {search.trim() || selectedLesson ? (
                <>
                  필터 결과 <strong style={{ color: "#111" }}>{filteredRecords.length}개</strong>
                </>
              ) : (
                <>
                  전체 기록 <strong style={{ color: "#111" }}>{allRecords.length}개</strong>
                </>
              )}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: 12,
            }}
          >
            {filteredRecords.map((record, index) => {
              const id = getRecordId(record);
              if (!id) return null;

              return (
                <RecordCard
                  key={`${id}-${index}`}
                  record={record}
                  onClick={() => handleOpenRecord(record)}
                />
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}