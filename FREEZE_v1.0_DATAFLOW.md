# AI Coach App v1.0

## Data Flow Freeze Declaration

Version: v1.0
Scope: Category Routing & Record Storage Flow

### Frozen Structure

Home
→ LessonSelect (category 생성)
→ ProblemInput (category 전달)
→ CoachChat (category 유지)
→ Summary (record 저장 발생)
→ Archive (normalize + filter)

### Stability Status

* Category state propagation: Stable
* Record persistence structure: Stable
* Archive filtering logic: Stable
* Fallback collision issue: Resolved
* Data normalization: Implemented

### Development Rule After Freeze

No structural changes to routing or record schema
until v1.1 planning begins.

This version is considered a **baseline architecture lock**.


# 📘 AI Coach App

## DATA FLOW FREEZE v1.0 선언문

### 선언 목적

본 문서는 AI Coach 앱의 **기록 생성 → 저장 → 조회 → 검색 흐름이 안정적으로 작동함을 공식적으로 선언**하기 위한 것이다.

v1.0에서는 기능 확장보다
**데이터 흐름의 신뢰성과 단순성을 최우선 가치로 둔다.**

---

## ✅ v1.0 데이터 흐름 구조

### 1️⃣ 기록 생성

* 기록은 코칭 세션 종료 후 Reflection 단계에서 생성된다.
* `createRecord()`를 통해 항상 동일한 구조의 record 객체가 생성된다.

#### record 구조 (v1.0 고정)

```
{
  id: string (timestamp 기반)
  title: string
  lessonId: string | number
  summary: string
  reflection: string
  answer: string
  answers: string[]
  createdAt: string (ISO Date)
}
```

---

### 2️⃣ 기록 저장

* 모든 기록은 localStorage의 **단일 key 구조**에 저장된다.

```
ai_coach_records
```

* 배열 형태로 관리한다.
* 최신 기록이 항상 앞에 오도록 저장한다.

---

### 3️⃣ 기록 조회

* ArchivePage에서 `getRecords()`로 전체 기록을 조회한다.
* 조회 시 항상 **최신순 정렬(useMemo)**을 적용한다.

---

### 4️⃣ 기록 검색

* 검색 대상 필드 (v1.0 고정)

```
title
summary
reflection
answer
answers[]
```

* 검색은 부분 문자열 포함 기준 (includes)
* 대소문자 구분 없음
* 검색어가 없으면 전체 기록 표시

---

### 5️⃣ 기록 상세 이동

* Archive 카드 클릭 시

```
/record/:id
```

라우트로 이동한다.

* RecordDetailPage는 id 기반 단건 조회 구조로 안정화되었다.

---

## 🚫 v1.0에서 하지 않기로 결정한 것

* 카테고리 기반 저장 / 필터
* 기록 삭제 기능
* 서버 DB 연동
* 사용자 계정 기능
* 기록 수정 기능
* 고급 검색 조건

---

## ⭐ v1.0 안정 기준

다음 조건이 충족되면 v1.0 데이터 흐름은 안정된 것으로 간주한다.

* 기록 생성 시 오류 없음
* 저장 후 Archive 즉시 조회 가능
* 검색 정상 작동
* 상세 페이지 이동 정상 작동
* 새로고침 후에도 기록 유지
* 데이터 구조 변경 없이 사용 가능

---

## 📌 v1.0 리더십 원칙

> 완성보다 안정이 우선이다.
> 기능보다 흐름이 먼저다.
> 확장보다 봉인이 먼저다.

---

## 선언

AI Coach App 데이터 흐름 v1.0은
현재 상태로 **봉인(FREEZE)한다.**

향후 모든 기능 개발은
**이 데이터 구조를 절대 변경하지 않는 것을 전제로 진행한다.**

---

**Freeze Version:** v1.0
**Status:** Stable
**Next Phase:** UX 개선 + 기능 확장 설계

