import { useMemo, useState } from 'react';
import { buildSummary, getCoachingQuestion } from './services/coachEngine';
import { appendRecord, loadArchive } from './utils/storage';

const SCREENS = {
  START: 'start',
  PROBLEM: 'problem',
  COACHING: 'coaching',
  SUMMARY: 'summary',
  PLAN: 'plan',
  REFLECTION: 'reflection',
  ARCHIVE: 'archive',
};

function Card({ title, children, footer }) {
  return (
    <section className="card">
      <h1>{title}</h1>
      <div className="card-body">{children}</div>
      {footer ? <div className="card-footer">{footer}</div> : null}
    </section>
  );
}

export default function App() {
  const [screen, setScreen] = useState(SCREENS.START);
  const [problem, setProblem] = useState('');
  const [answers, setAnswers] = useState(['', '', '']);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputAnswer, setInputAnswer] = useState('');
  const [summary, setSummary] = useState(null);
  const [planAction, setPlanAction] = useState('');
  const [reflection, setReflection] = useState('');
  const [archive, setArchive] = useState(() => loadArchive());

  const question = useMemo(
    () => getCoachingQuestion(currentStep, { problem, answers }),
    [currentStep, problem, answers],
  );

  const resetFlow = () => {
    setProblem('');
    setAnswers(['', '', '']);
    setCurrentStep(0);
    setInputAnswer('');
    setSummary(null);
    setPlanAction('');
    setReflection('');
    setScreen(SCREENS.START);
  };

  const startCoaching = () => {
    if (!problem.trim()) return;
    setScreen(SCREENS.COACHING);
  };

  const submitAnswer = () => {
    if (!inputAnswer.trim()) return;

    const nextAnswers = [...answers];
    nextAnswers[currentStep] = inputAnswer.trim();
    setAnswers(nextAnswers);
    setInputAnswer('');

    if (currentStep === 2) {
      const nextSummary = buildSummary(problem.trim(), nextAnswers);
      setSummary(nextSummary);
      setPlanAction(nextSummary.weeklyAction);
      setScreen(SCREENS.SUMMARY);
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const saveReflection = () => {
    if (!summary) return;

    const record = {
      id: Date.now(),
      createdAt: new Date().toLocaleString('ko-KR'),
      summary,
      planAction,
      reflection,
      answers,
    };
    const next = appendRecord(record);
    setArchive(next);
    setScreen(SCREENS.ARCHIVE);
  };

  if (screen === SCREENS.START) {
    return (
      <main className="app">
        <Card
          title="AI코치"
          footer={<button onClick={() => setScreen(SCREENS.PROBLEM)}>시작하기</button>}
        >
          <p>실제 고민을 입력하고, 3단계 코칭으로 해결 방향을 정리해보세요.</p>
          <p>큰 글씨와 단순한 흐름으로 천천히 따라갈 수 있습니다.</p>
        </Card>
      </main>
    );
  }

  if (screen === SCREENS.PROBLEM) {
    return (
      <main className="app">
        <Card
          title="1) 문제 입력"
          footer={
            <>
              <button className="sub" onClick={() => setScreen(SCREENS.START)}>
                이전
              </button>
              <button onClick={startCoaching}>다음</button>
            </>
          }
        >
          <label htmlFor="problem">지금 해결하고 싶은 문제를 한 문장으로 써주세요.</label>
          <textarea
            id="problem"
            rows={5}
            placeholder="예: 일을 미루게 되어 하루가 금방 지나갑니다."
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
          />
        </Card>
      </main>
    );
  }

  if (screen === SCREENS.COACHING) {
    return (
      <main className="app">
        <Card
          title={`2) AI 코칭 대화 (${currentStep + 1}/3)`}
          footer={
            <>
              <button className="sub" onClick={() => setScreen(SCREENS.PROBLEM)}>
                이전
              </button>
              <button onClick={submitAnswer}>다음 질문</button>
            </>
          }
        >
          <p className="bubble ai">{question}</p>
          <label htmlFor="answer">내 답변</label>
          <textarea
            id="answer"
            rows={4}
            placeholder="천천히 적어주세요."
            value={inputAnswer}
            onChange={(e) => setInputAnswer(e.target.value)}
          />
        </Card>
      </main>
    );
  }

  if (screen === SCREENS.SUMMARY && summary) {
    return (
      <main className="app">
        <Card
          title="3) 결과 요약"
          footer={<button onClick={() => setScreen(SCREENS.PLAN)}>실행 계획으로 이동</button>}
        >
          <ul className="summary-list">
            <li>
              <strong>내가 다루는 문제:</strong> {summary.problemStatement}
            </li>
            <li>
              <strong>핵심 원인:</strong> {summary.coreCause}
            </li>
            <li>
              <strong>가능한 해결 방향 3개:</strong>
              <ol>
                {summary.possibleDirections.map((direction) => (
                  <li key={direction}>{direction}</li>
                ))}
              </ol>
            </li>
            <li>
              <strong>추천 방향:</strong> {summary.recommendedDirection}
            </li>
            <li>
              <strong>이번 주 실천 1가지:</strong> {summary.weeklyAction}
            </li>
          </ul>
        </Card>
      </main>
    );
  }

  if (screen === SCREENS.PLAN) {
    return (
      <main className="app">
        <Card
          title="4) 실행 계획"
          footer={<button onClick={() => setScreen(SCREENS.REFLECTION)}>회고 작성하기</button>}
        >
          <label htmlFor="plan">이번 주 실천 1가지를 확정하세요.</label>
          <textarea
            id="plan"
            rows={4}
            value={planAction}
            onChange={(e) => setPlanAction(e.target.value)}
          />
          <p className="hint">실천은 작고 구체적일수록 좋습니다. (시간/장소/횟수)</p>
        </Card>
      </main>
    );
  }

  if (screen === SCREENS.REFLECTION) {
    return (
      <main className="app">
        <Card
          title="5) 회고"
          footer={<button onClick={saveReflection}>기록 저장</button>}
        >
          <label htmlFor="reflection">실천 후 느낀 점이나 배운 점을 적어주세요.</label>
          <textarea
            id="reflection"
            rows={5}
            placeholder="예: 10분만 시작해도 마음이 한결 가벼워졌습니다."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
          />
        </Card>
      </main>
    );
  }

  return (
    <main className="app">
      <Card
        title="6) 기록 보관함"
        footer={
          <>
            <button className="sub" onClick={resetFlow}>
              새 코칭 시작
            </button>
          </>
        }
      >
        {archive.length === 0 ? (
          <p>아직 저장된 기록이 없습니다.</p>
        ) : (
          <ul className="archive-list">
            {archive.map((record) => (
              <li key={record.id}>
                <p>
                  <strong>{record.createdAt}</strong>
                </p>
                <p>문제: {record.summary.problemStatement}</p>
                <p>추천: {record.summary.recommendedDirection}</p>
                <p>실천: {record.planAction}</p>
                <p>회고: {record.reflection || '작성 전'}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </main>
  );
}