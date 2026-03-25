import { useMemo } from "react";
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
      console.error("[HomePage] readRecords error:", error);
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

function getLessonTitleById(lessonId) {
  const lesson = LESSON_CONFIG.find((l) => l.id === lessonId);
  if (!lesson) return "코칭";

  const num = lesson.id.replace("lesson", "");
  return `${num}강 (${lesson.title})`;
}

function getRecordTitle(record) {
  return (
    record?.title ||
    record?.topic ||
    record?.lessonTitle ||
    record?.question ||
    "제목 없는 기록"
  );
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

  if (!text) return "저장된 기록을 열어 자세한 내용을 확인해 보세요.";
  return String(text);
}

function getRecordId(record) {
  return record?.id || record?.createdAt || null;
}


function RecentRecordCard({ record, onClick }) {
  const title = getRecordTitle(record);
  const preview = getRecordPreview(record);
  const createdAt = record?.createdAt || record?.updatedAt || record?.date;

  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        padding: 16,
        borderRadius: 16,
        border: "1px solid #e7e7e7",
        background: "#fff",
        cursor: "pointer",
        marginBottom: 12,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "flex-start",
          marginBottom: 8,
          flexWrap: "wrap",
        }}
      >
        <div className="subtitle">
  {       getLessonTitleById(record.lessonId || record.lesson)}
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
          lineHeight: 1.6,
          marginBottom: 10,
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
        }}
      >
        {preview}
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          fontSize: 12,
          color: "#666",
        }}
      >
        <span>lesson: {record?.lesson || record?.lessonId || "-"}</span>
        <span>category: {record?.category || "-"}</span>
      </div>
    </button>
  );
}

export default function HomePage() {
  const navigate = useNavigate();

  const recentRecords = useMemo(() => {
    const records = readRecords();

    return [...records]
      .sort((a, b) => getRecordTime(b) - getRecordTime(a))
      .slice(0, 3);
  }, []);

  const handleGoArchive = () => {
    navigate("/archive");
  };

  const handleGoRecord = (record) => {
    const id = getRecordId(record);
    if (!id) return;

    navigate(`/record/${id}`);
  };

  const handleStartCoach = () => {
  navigate("/lessons");
  };

  return (
    <div
      style={{
        maxWidth: 920,
        margin: "0 auto",
        padding: "24px 16px 48px",
      }}
    >
      <section
        style={{
          background: "linear-gradient(135deg, #f7f8ff 0%, #ffffff 100%)",
          border: "1px solid #eceef5",
          borderRadius: 20,
          padding: 24,
          marginBottom: 22,
        }}
      >
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
          AI Coach App
        </div>

        <h1
          style={{
            margin: "0 0 10px 0",
            fontSize: 30,
            lineHeight: 1.35,
            color: "#111827",
          }}
        >
          오늘의 질문으로
          <br />
          다시 생각을 시작해 보세요.
        </h1>

        <p
          style={{
            margin: 0,
            color: "#4b5563",
            fontSize: 15,
            lineHeight: 1.7,
          }}
        >
          질문에 답하고, 정리하고, 돌아보며
          자신의 기록을 차곡차곡 쌓아가는 AI 코치 앱입니다.
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
          <button
            onClick={handleStartCoach}
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              border: "none",
              background: "#111827",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            코칭 시작
          </button>

          <button
            onClick={handleGoArchive}
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              border: "1px solid #d7dbe7",
              background: "#fff",
              color: "#111827",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            기록 보관함
          </button>
        </div>
      </section>

      <section
        style={{
          background: "#fff",
          border: "1px solid #e8e8e8",
          borderRadius: 18,
          padding: 20,
        }}
      >
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
          <div>
            <h2
              style={{
                margin: "0 0 6px 0",
                fontSize: 22,
                color: "#111",
              }}
            >
              최근 기록
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: "#666",
                lineHeight: 1.6,
              }}
            >
              최근에 저장한 기록을 바로 다시 열어볼 수 있습니다.
            </p>
          </div>

          <button
            onClick={handleGoArchive}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #d9d9d9",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            전체 보기
          </button>
        </div>

        {recentRecords.length === 0 ? (
          <div
            style={{
              border: "1px dashed #d8d8d8",
              borderRadius: 14,
              padding: 24,
              background: "#fafafa",
            }}
          >
            <div
              style={{
                fontSize: 16,
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
                marginBottom: 14,
              }}
            >
              첫 질문에 답하고 기록을 남기면,
              이곳에 최근 기록이 표시됩니다.
            </div>

            <button
              onClick={handleStartCoach}
              style={{
                padding: "11px 15px",
                borderRadius: 10,
                border: "none",
                background: "#111827",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              첫 기록 시작하기
            </button>
          </div>
        ) : (
          <div>
            {recentRecords.map((record, index) => {
              const id = getRecordId(record);
              if (!id) return null;

              return (
                <RecentRecordCard
                  key={`${id}-${index}`}
                  record={record}
                  onClick={() => handleGoRecord(record)}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}