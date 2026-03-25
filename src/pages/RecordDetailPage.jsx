import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LESSON_CONFIG } from "../data/lessonConfig";
import { buildSummaryFromSessionQuestions } from "../services/summaryEngine";

const STORAGE_KEYS = ["ai_coach_records", "records"];

function readRecords() {
  for (const key of STORAGE_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;

      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return { key, records: parsed };
      }
    } catch (error) {
      console.error("[RecordDetailPage] readRecords error:", error);
    }
  }

  return { key: STORAGE_KEYS[0], records: [] };
}

function writeRecords(records, preferredKey) {
  const key = preferredKey || STORAGE_KEYS[0];

  try {
    localStorage.setItem(key, JSON.stringify(records));
  } catch (error) {
    console.error("[RecordDetailPage] writeRecords error:", error);
  }
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

function getText(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.join("\n");

  try {
    return JSON.stringify(value, null, 2);
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

function getLessonInfo(record) {
  const lessonKey = getLessonKey(record);
  const found = LESSON_CONFIG.find((lesson) => lesson.id === lessonKey);

  if (found) {
    const num = String(found.id).replace("lesson", "");
    return {
      lessonKey: found.id,
      lessonNumber: `${num}강`,
      lessonTitle: found.title,
      heading: `${num}강 (${found.title})`,
    };
  }

  const rawTitle =
    record?.lessonTitle ||
    record?.lessonName ||
    record?.title ||
    "코칭";

  const rawNum = lessonKey.replace("lesson", "");

  if (rawNum && rawNum !== lessonKey) {
    return {
      lessonKey,
      lessonNumber: `${rawNum}강`,
      lessonTitle: rawTitle,
      heading: `${rawNum}강 (${rawTitle})`,
    };
  }

  return {
    lessonKey: lessonKey || "-",
    lessonNumber: "강의",
    lessonTitle: rawTitle,
    heading: rawTitle,
  };
}

function getMainContent(record) {
  return (
    getText(record?.content) ||
    getText(record?.answer) ||
    getText(record?.note) ||
    getText(record?.body) ||
    ""
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 12, color: "#777", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 15, color: "#222", lineHeight: 1.5 }}>
        {value || "-"}
      </div>
    </div>
  );
}

function Section({ title, content }) {
  if (!content) return null;

  return (
    <section
      style={{
        background: "#fff",
        border: "1px solid #e8e8e8",
        borderRadius: 14,
        padding: 16,
        marginBottom: 14,
      }}
    >
      <h3
        style={{
          margin: "0 0 10px 0",
          fontSize: 16,
          fontWeight: 700,
          color: "#222",
        }}
      >
        {title}
      </h3>
      <div
        style={{
          whiteSpace: "pre-wrap",
          lineHeight: 1.7,
          fontSize: 15,
          color: "#333",
        }}
      >
        {content}
      </div>
    </section>
  );
}

export default function RecordDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { storageKey, record } = useMemo(() => {
    const { key, records } = readRecords();

    const found =
      records.find((item) => String(item?.id) === String(id)) ||
      records.find((item) => String(item?.createdAt) === String(id)) ||
      null;

    return {
      storageKey: key,
      record: found,
    };
  }, [id]);

  const handleDelete = () => {
    if (!record) return;

    const ok = window.confirm("이 기록을 삭제하시겠습니까?\n삭제 후에는 되돌릴 수 없습니다.");
    if (!ok) return;

    const { records } = readRecords();
    const recordId = getRecordId(record);

    const nextRecords = records.filter(
      (item) => String(getRecordId(item)) !== String(recordId)
    );

    writeRecords(nextRecords, storageKey);
    window.alert("기록이 삭제되었습니다.");
    navigate("/archive", { replace: true });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoArchive = () => {
    navigate("/archive");
  };

  const handleRetrySameLesson = () => {
    if (!record) return;

    const lessonKey = getLessonKey(record);
    if (!lessonKey) return;

    const category = record?.category || "general";

    navigate(
      `/coach?lessonId=${encodeURIComponent(lessonKey)}&category=${encodeURIComponent(category)}`
    );
  };

  if (!record) {
    return (
      <div
        style={{
          maxWidth: 860,
          margin: "0 auto",
          padding: "24px 16px 40px",
        }}
      >
        <div
          style={{
            background: "#fff",
            border: "1px solid #e8e8e8",
            borderRadius: 16,
            padding: 24,
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: 12 }}>기록을 찾을 수 없습니다</h2>
          <p style={{ color: "#666", lineHeight: 1.6, marginBottom: 20 }}>
            이미 삭제되었거나, 잘못된 주소로 들어온 것일 수 있습니다.
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
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
              보관함으로
            </button>

            <button
              onClick={handleGoHome}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                background: "#111",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              홈으로
            </button>
          </div>
        </div>
      </div>
    );
  }

  const lessonInfo = getLessonInfo(record);

  const questionText =
    getText(record?.question) ||
    getText(record?.firstQuestion);

  const mainContent =
    getMainContent(record) ||
    getText(record?.preview);

  const summaryText =
    getText(record?.summary) ||
    buildSummaryFromSessionQuestions(record?.sessionQuestions || []) ||
    "아직 요약이 없습니다.";

  const actionPlanText = getText(record?.actionPlan || record?.action_plan);
  const reflectionText = getText(record?.reflection);
  const coachCommentText = getText(record?.coachComment || record?.coachSummary);

  return (
    <div
      style={{
        maxWidth: 860,
        margin: "0 auto",
        padding: "24px 16px 40px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 18,
        }}
      >
        <div>
          <div style={{ fontSize: 13, color: "#777", marginBottom: 6 }}>
            기록 상세
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 26,
              lineHeight: 1.35,
              color: "#111",
            }}
          >
            {lessonInfo.heading}
          </h1>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={handleBack}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #d9d9d9",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            뒤로
          </button>

          <button
            onClick={handleDelete}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "none",
              background: "#d92d20",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            삭제
          </button>
        </div>
      </div>

      <section
        style={{
          background: "#fff",
          border: "1px solid #e8e8e8",
          borderRadius: 16,
          padding: 18,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
          }}
        >
          <InfoRow label="강의" value={lessonInfo.lessonTitle} />
          <InfoRow label="회차" value={lessonInfo.lessonNumber} />
          <InfoRow label="분류" value={record?.category || "-"} />
          <InfoRow label="저장일" value={formatDate(record?.createdAt)} />
        </div>
      </section>

      <Section title="질문" content={questionText} />
      <Section title="기록 내용" content={mainContent} />
      <Section title="요약" content={summaryText} />
      <Section title="실행 계획" content={actionPlanText} />
      <Section title="회고" content={reflectionText} />
      <Section title="AI 코치 정리" content={coachCommentText} />

      <div style={{ marginTop: 24, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          onClick={handleGoArchive}
          style={{
            padding: "11px 16px",
            borderRadius: 10,
            border: "1px solid #d9d9d9",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          보관함으로
        </button>

        <button
          onClick={handleRetrySameLesson}
          style={{
            padding: "11px 16px",
            borderRadius: 10,
            border: "none",
            background: "#111827",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          같은 강의 다시 코칭하기
        </button>

        <button
          onClick={handleGoHome}
          style={{
            padding: "11px 16px",
            borderRadius: 10,
            border: "none",
            background: "#111",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          홈으로
        </button>
      </div>
    </div>
  );
}