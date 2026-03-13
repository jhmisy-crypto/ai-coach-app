const stepPrompts = [
  '지금 문제를 떠올릴 때, 가장 답답한 순간은 언제인가요?',
  '그 순간이 반복되는 이유를 하나만 꼽는다면 무엇일까요?',
  '이번 주 안에 부담 없이 시도할 수 있는 작은 행동은 무엇일까요?',
];

const keywordMap = {
  건강: ['생활 리듬 점검', '가까운 의료 상담', '가벼운 운동 루틴 만들기'],
  가족: ['대화 시간 정하기', '감정 먼저 전달하기', '작은 부탁부터 요청하기'],
  일: ['우선순위 1개 정하기', '도움 요청 대상 정리', '작업 시간을 30분 단위로 쪼개기'],
  돈: ['지출 기록 시작', '고정비 점검', '상담 기관 정보 확인'],
};

const baseDirections = ['상황을 더 구체적으로 기록하기', '주변 도움 자원 1곳 찾기', '작은 행동을 1회 실행하기'];

export function getCoachingQuestion(stepIndex, context) {
  const { problem } = context;
  const prefix = problem ? `"${problem}"에 대해 함께 생각해볼게요.` : '함께 천천히 정리해볼게요.';
  return `${prefix}\n${stepPrompts[stepIndex]}`;
}

function pickDirections(problem) {
  const foundKey = Object.keys(keywordMap).find((key) => problem.includes(key));
  return foundKey ? keywordMap[foundKey] : baseDirections;
}

export function buildSummary(problem, answers) {
  const directions = pickDirections(problem);
  const mainCause = answers[1] || '문제를 바라보는 기준이 아직 구체화되지 않음';
  const recommendedDirection = directions[0];
  const weeklyAction = answers[2] || `${recommendedDirection}를 오늘 10분 실행하기`;

  return {
    problemStatement: problem,
    coreCause: mainCause,
    possibleDirections: directions,
    recommendedDirection,
    weeklyAction,
  };
}