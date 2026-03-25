// src/data/questions.js

export const QUESTION_CATEGORIES = [
  { id: "general", label: "전체" },
  { id: "gratitude", label: "감사" },
  { id: "emotion", label: "감정" },
  { id: "relationship", label: "관계" },
  { id: "action", label: "실행" },
];

const FLOW_TYPES = {
  emotion: "emotion",
  thinking: "thinking",
  action: "action",
  relation: "relation",
  meaning: "meaning",
  awareness: "awareness",
};

const FLOW_STAGES = {
  open: "open",
  insight: "insight",
  deep: "deep",
  integrate: "integrate",
};

function createQuestion({
  id,
  text,
  category = "general",
  lessonId = "lesson1",
  type = FLOW_TYPES.thinking,
  energy = 2,
  stage = FLOW_STAGES.open,
  tags = [],
  followUps = [],
}) {
  return {
    id,
    text,
    category,
    lessonId,
    type,
    energy,
    stage,
    tags,
    followUps,
  };
}

const QUESTIONS = [
  // lesson1 - AI의 첫 만남
  createQuestion({
    id: "l1_q1",
    lessonId: "lesson1",
    category: "general",
    text: "AI를 처음 만날 때 가장 기대되는 점은 무엇인가요?",
    type: FLOW_TYPES.awareness,
    energy: 1,
    stage: FLOW_STAGES.open,
    tags: ["시작", "기대", "AI입문"],
    followUps: ["l1_q2", "l1_q3"],
  }),
  createQuestion({
    id: "l1_q2",
    lessonId: "lesson1",
    category: "emotion",
    text: "AI를 떠올릴 때 동시에 드는 걱정이나 망설임은 무엇인가요?",
    type: FLOW_TYPES.emotion,
    energy: 2,
    stage: FLOW_STAGES.insight,
    tags: ["불안", "감정", "저항"],
    followUps: ["l1_q4", "l1_q5"],
  }),
  createQuestion({
    id: "l1_q3",
    lessonId: "lesson1",
    category: "gratitude",
    text: "지금까지의 삶에서 새로운 도구를 배워낸 나의 힘을 떠올린다면 어떤 경험이 생각나나요?",
    type: FLOW_TYPES.meaning,
    energy: 2,
    stage: FLOW_STAGES.insight,
    tags: ["감사", "성장", "자기신뢰"],
    followUps: ["l1_q5"],
  }),
  createQuestion({
    id: "l1_q4",
    lessonId: "lesson1",
    category: "relationship",
    text: "AI를 잘 활용하게 된다면 나와 주변 사람들의 관계에는 어떤 변화가 생길까요?",
    type: FLOW_TYPES.relation,
    energy: 3,
    stage: FLOW_STAGES.deep,
    tags: ["관계", "변화", "영향"],
    followUps: ["l1_q6"],
  }),
  createQuestion({
    id: "l1_q5",
    lessonId: "lesson1",
    category: "action",
    text: "AI와 친해지기 위해 오늘 가장 작게 시작할 수 있는 행동은 무엇인가요?",
    type: FLOW_TYPES.action,
    energy: 2,
    stage: FLOW_STAGES.integrate,
    tags: ["실행", "첫걸음"],
    followUps: ["l1_q6"],
  }),
  createQuestion({
    id: "l1_q6",
    lessonId: "lesson1",
    category: "general",
    text: "오늘 이 만남을 통해 '나는 생각보다 할 수 있다'고 느끼는 부분은 무엇인가요?",
    type: FLOW_TYPES.meaning,
    energy: 3,
    stage: FLOW_STAGES.integrate,
    tags: ["통합", "자기인식"],
  }),

  // lesson2 - 디지털 친숙해지기
  createQuestion({
    id: "l2_q1",
    lessonId: "lesson2",
    category: "general",
    text: "디지털 도구를 사용할 때 가장 자주 막히는 순간은 언제인가요?",
    type: FLOW_TYPES.awareness,
    energy: 1,
    stage: FLOW_STAGES.open,
    tags: ["디지털", "장벽"],
    followUps: ["l2_q2", "l2_q3"],
  }),
  createQuestion({
    id: "l2_q2",
    lessonId: "lesson2",
    category: "emotion",
    text: "그 막히는 순간에 내 안에서 올라오는 감정은 무엇인가요?",
    type: FLOW_TYPES.emotion,
    energy: 2,
    stage: FLOW_STAGES.insight,
    tags: ["감정", "긴장", "불안"],
    followUps: ["l2_q4"],
  }),
  createQuestion({
    id: "l2_q3",
    lessonId: "lesson2",
    category: "gratitude",
    text: "그래도 지금까지 디지털 환경에 적응해온 나의 수고를 떠올리면 어떤 점이 고맙나요?",
    type: FLOW_TYPES.meaning,
    energy: 2,
    stage: FLOW_STAGES.insight,
    tags: ["감사", "적응"],
    followUps: ["l2_q5"],
  }),
  createQuestion({
    id: "l2_q4",
    lessonId: "lesson2",
    category: "relationship",
    text: "디지털 사용이 편안해지면 가족이나 지인과의 연결은 어떻게 달라질까요?",
    type: FLOW_TYPES.relation,
    energy: 3,
    stage: FLOW_STAGES.deep,
    tags: ["연결", "관계"],
    followUps: ["l2_q6"],
  }),
  createQuestion({
    id: "l2_q5",
    lessonId: "lesson2",
    category: "action",
    text: "앞으로 디지털 친숙함을 높이기 위해 반복할 수 있는 아주 작은 습관은 무엇인가요?",
    type: FLOW_TYPES.action,
    energy: 2,
    stage: FLOW_STAGES.integrate,
    tags: ["습관", "실행"],
    followUps: ["l2_q6"],
  }),
  createQuestion({
    id: "l2_q6",
    lessonId: "lesson2",
    category: "general",
    text: "디지털을 '두려운 대상'이 아니라 '익숙해질 친구'로 본다면 무엇이 달라질까요?",
    type: FLOW_TYPES.meaning,
    energy: 3,
    stage: FLOW_STAGES.integrate,
    tags: ["관점전환"],
  }),

  // lesson3 - 질문의 힘
  createQuestion({
    id: "l3_q1",
    lessonId: "lesson3",
    category: "general",
    text: "요즘 내 삶에서 가장 분명하게 묻고 싶은 질문은 무엇인가요?",
    type: FLOW_TYPES.awareness,
    energy: 1,
    stage: FLOW_STAGES.open,
    tags: ["질문", "탐색"],
    followUps: ["l3_q2", "l3_q3"],
  }),
  createQuestion({
    id: "l3_q2",
    lessonId: "lesson3",
    category: "thinking",
    text: "그 질문을 지금까지 충분히 묻지 못하게 한 생각의 습관은 무엇인가요?",
    type: FLOW_TYPES.thinking,
    energy: 2,
    stage: FLOW_STAGES.insight,
    tags: ["사고습관", "제한"],
    followUps: ["l3_q4"],
  }),
  createQuestion({
    id: "l3_q3",
    lessonId: "lesson3",
    category: "emotion",
    text: "좋은 질문 앞에서 설레는 마음과 두려운 마음 중 무엇이 더 큰가요?",
    type: FLOW_TYPES.emotion,
    energy: 2,
    stage: FLOW_STAGES.insight,
    tags: ["감정", "질문"],
    followUps: ["l3_q4", "l3_q5"],
  }),
  createQuestion({
    id: "l3_q4",
    lessonId: "lesson3",
    category: "relationship",
    text: "내가 더 좋은 질문을 하게 되면 주변 사람들과의 대화는 어떻게 달라질까요?",
    type: FLOW_TYPES.relation,
    energy: 3,
    stage: FLOW_STAGES.deep,
    tags: ["대화", "관계", "질문력"],
    followUps: ["l3_q6"],
  }),
  createQuestion({
    id: "l3_q5",
    lessonId: "lesson3",
    category: "action",
    text: "오늘부터 사용할 나만의 '좋은 질문 한 문장'을 만든다면 무엇인가요?",
    type: FLOW_TYPES.action,
    energy: 3,
    stage: FLOW_STAGES.integrate,
    tags: ["실행", "문장화"],
    followUps: ["l3_q6"],
  }),
  createQuestion({
    id: "l3_q6",
    lessonId: "lesson3",
    category: "general",
    text: "질문 하나가 삶의 방향을 바꾼 경험이 있다면 그것은 어떤 순간이었나요?",
    type: FLOW_TYPES.meaning,
    energy: 4,
    stage: FLOW_STAGES.integrate,
    tags: ["의미", "전환"],
  }),

  // lesson4 - 생활문제 해결
  createQuestion({
    id: "l4_q1",
    lessonId: "lesson4",
    category: "general",
    text: "지금 내 일상에서 가장 해결하고 싶은 생활 문제는 무엇인가요?",
    type: FLOW_TYPES.awareness,
    energy: 1,
    stage: FLOW_STAGES.open,
    tags: ["생활문제", "탐색"],
    followUps: ["l4_q2", "l4_q3"],
  }),
  createQuestion({
    id: "l4_q2",
    lessonId: "lesson4",
    category: "thinking",
    text: "그 문제를 더 명확하게 정의한다면 핵심은 무엇이라고 말할 수 있나요?",
    type: FLOW_TYPES.thinking,
    energy: 2,
    stage: FLOW_STAGES.insight,
    tags: ["문제정의", "명확화"],
    followUps: ["l4_q4"],
  }),
  createQuestion({
    id: "l4_q3",
    lessonId: "lesson4",
    category: "emotion",
    text: "그 문제가 반복될 때 내 마음은 어떤 식으로 지치고 있나요?",
    type: FLOW_TYPES.emotion,
    energy: 2,
    stage: FLOW_STAGES.insight,
    tags: ["감정", "피로"],
    followUps: ["l4_q4", "l4_q5"],
  }),
  createQuestion({
    id: "l4_q4",
    lessonId: "lesson4",
    category: "relationship",
    text: "이 문제는 나 혼자만의 문제인가요, 아니면 주변 사람들과 얽혀 있나요?",
    type: FLOW_TYPES.relation,
    energy: 3,
    stage: FLOW_STAGES.deep,
    tags: ["관계", "맥락"],
    followUps: ["l4_q6"],
  }),
  createQuestion({
    id: "l4_q5",
    lessonId: "lesson4",
    category: "action",
    text: "AI의 도움을 받아 이 문제를 풀기 위한 첫 실험은 무엇으로 할 수 있을까요?",
    type: FLOW_TYPES.action,
    energy: 3,
    stage: FLOW_STAGES.integrate,
    tags: ["실험", "실행", "AI활용"],
    followUps: ["l4_q6"],
  }),
  createQuestion({
    id: "l4_q6",
    lessonId: "lesson4",
    category: "general",
    text: "문제를 작게 나누어 본다면 지금 당장 다룰 수 있는 부분은 어디인가요?",
    type: FLOW_TYPES.meaning,
    energy: 3,
    stage: FLOW_STAGES.integrate,
    tags: ["분해", "실행가능성"],
  }),

  // lesson5 - AI 답변 판단하기
  createQuestion({
    id: "l5_q1",
    lessonId: "lesson5",
    category: "general",
    text: "AI의 답변을 볼 때 가장 먼저 점검해야 한다고 느끼는 것은 무엇인가요?",
    type: FLOW_TYPES.awareness,
    energy: 1,
    stage: FLOW_STAGES.open,
    tags: ["판단", "검토"],
    followUps: ["l5_q2", "l5_q3"],
  }),
  createQuestion({
    id: "l5_q2",
    lessonId: "lesson5",
    category: "thinking",
    text: "AI 답변을 무조건 믿거나 무조건 거부하게 만드는 내 사고 습관은 무엇인가요?",
    type: FLOW_TYPES.thinking,
    energy: 2,
    stage: FLOW_STAGES.insight,
    tags: ["비판적사고", "습관"],
    followUps: ["l5_q4"],
  }),
  createQuestion({
    id: "l5_q3",
    lessonId: "lesson5",
    category: "emotion",
    text: "AI가 그럴듯하게 말할 때 나는 안심하나요, 아니면 더 경계하게 되나요?",
    type: FLOW_TYPES.emotion,
    energy: 2,
    stage: FLOW_STAGES.insight,
    tags: ["감정", "신뢰", "경계"],
    followUps: ["l5_q4", "l5_q5"],
  }),
  createQuestion({
    id: "l5_q4",
    lessonId: "lesson5",
    category: "relationship",
    text: "AI 판단력을 기르면 타인과의 대화나 협업에는 어떤 장점이 생길까요?",
    type: FLOW_TYPES.relation,
    energy: 3,
    stage: FLOW_STAGES.deep,
    tags: ["협업", "대화"],
    followUps: ["l5_q6"],
  }),
  createQuestion({
    id: "l5_q5",
    lessonId: "lesson5",
    category: "action",
    text: "앞으로 AI 답변을 볼 때 내가 적용할 '3초 점검 질문' 하나를 만든다면 무엇인가요?",
    type: FLOW_TYPES.action,
    energy: 3,
    stage: FLOW_STAGES.integrate,
    tags: ["실행", "점검법"],
    followUps: ["l5_q6"],
  }),
  createQuestion({
    id: "l5_q6",
    lessonId: "lesson5",
    category: "general",
    text: "좋은 사용자는 정답을 찾는 사람이 아니라 판단하는 사람이라는 말에 얼마나 공감하나요?",
    type: FLOW_TYPES.meaning,
    energy: 4,
    stage: FLOW_STAGES.integrate,
    tags: ["성찰", "사용자역량"],
  }),

  // lesson6 - AI와 나의 생각 구분하기
  createQuestion({
    id: "l6_q1",
    lessonId: "lesson6",
    category: "general",
    text: "AI의 말과 나의 생각이 섞인다고 느끼는 순간은 언제인가요?",
    type: FLOW_TYPES.awareness,
    energy: 1,
    stage: FLOW_STAGES.open,
    tags: ["구분", "인식"],
    followUps: ["l6_q2", "l6_q3"],
  }),
  createQuestion({
    id: "l6_q2",
    lessonId: "lesson6",
    category: "thinking",
    text: "내 생각을 더 분명하게 하기 위해 먼저 정리해야 할 기준은 무엇인가요?",
    type: FLOW_TYPES.thinking,
    energy: 2,
    stage: FLOW_STAGES.insight,
    tags: ["기준", "분별"],
    followUps: ["l6_q4"],
  }),
  createQuestion({
    id: "l6_q3",
    lessonId: "lesson6",
    category: "emotion",
    text: "AI가 너무 잘 말할 때 내 생각이 약해지는 느낌이 드나요?",
    type: FLOW_TYPES.emotion,
    energy: 2,
    stage: FLOW_STAGES.insight,
    tags: ["위축", "감정"],
    followUps: ["l6_q4", "l6_q5"],
  }),
  createQuestion({
    id: "l6_q4",
    lessonId: "lesson6",
    category: "relationship",
    text: "내 생각을 분명히 가진 사람이 타인과 더 건강하게 대화할 수 있는 이유는 무엇일까요?",
    type: FLOW_TYPES.relation,
    energy: 3,
    stage: FLOW_STAGES.deep,
    tags: ["대화", "자기입장"],
    followUps: ["l6_q6"],
  }),
  createQuestion({
    id: "l6_q5",
    lessonId: "lesson6",
    category: "action",
    text: "앞으로 AI 답변을 받은 뒤 반드시 덧붙일 '나의 생각 한 문장'은 어떤 형식이면 좋을까요?",
    type: FLOW_TYPES.action,
    energy: 3,
    stage: FLOW_STAGES.integrate,
    tags: ["실행", "자기목소리"],
    followUps: ["l6_q6"],
  }),
  createQuestion({
    id: "l6_q6",
    lessonId: "lesson6",
    category: "general",
    text: "AI를 참고하되 중심은 나에게 두는 태도는 어떤 삶의 자세와 연결될까요?",
    type: FLOW_TYPES.meaning,
    energy: 4,
    stage: FLOW_STAGES.integrate,
    tags: ["중심", "주체성"],
  }),

  // lesson7 - 경험의 자산화
  createQuestion({
    id: "l7_q1",
    lessonId: "lesson7",
    category: "gratitude",
    text: "내가 살아오며 쌓아온 경험 중 지금 다시 꺼내 볼 만한 자산은 무엇인가요?",
    type: FLOW_TYPES.meaning,
    energy: 1,
    stage: FLOW_STAGES.open,
    tags: ["경험", "자산", "감사"],
    followUps: ["l7_q2", "l7_q3"],
  }),
  createQuestion({
    id: "l7_q2",
    lessonId: "lesson7",
    category: "thinking",
    text: "그 경험이 단순한 과거가 아니라 자산이 되려면 어떤 의미를 붙여야 할까요?",
    type: FLOW_TYPES.thinking,
    energy: 2,
    stage: FLOW_STAGES.insight,
    tags: ["의미화", "재해석"],
    followUps: ["l7_q4"],
  }),
  createQuestion({
    id: "l7_q3",
    lessonId: "lesson7",
    category: "emotion",
    text: "돌아보면 힘들었지만 지금은 고맙게 느껴지는 경험이 있나요?",
    type: FLOW_TYPES.emotion,
    energy: 3,
    stage: FLOW_STAGES.insight,
    tags: ["회고", "감정", "감사"],
    followUps: ["l7_q4", "l7_q5"],
  }),
  createQuestion({
    id: "l7_q4",
    lessonId: "lesson7",
    category: "relationship",
    text: "내 경험은 누구에게 도움이 될 수 있을까요?",
    type: FLOW_TYPES.relation,
    energy: 3,
    stage: FLOW_STAGES.deep,
    tags: ["기여", "관계", "전달"],
    followUps: ["l7_q6"],
  }),
  createQuestion({
    id: "l7_q5",
    lessonId: "lesson7",
    category: "action",
    text: "내 경험을 기록이나 강의, 글로 남긴다면 가장 먼저 무엇부터 시작할 수 있을까요?",
    type: FLOW_TYPES.action,
    energy: 3,
    stage: FLOW_STAGES.integrate,
    tags: ["실행", "기록", "콘텐츠"],
    followUps: ["l7_q6"],
  }),
  createQuestion({
    id: "l7_q6",
    lessonId: "lesson7",
    category: "general",
    text: "내 삶의 경험을 하나의 선물이라고 본다면 그 핵심 메시지는 무엇인가요?",
    type: FLOW_TYPES.meaning,
    energy: 4,
    stage: FLOW_STAGES.integrate,
    tags: ["선물", "메시지"],
  }),

  // lesson8 - 나의 주제 찾기
  createQuestion({
    id: "l8_q1",
    lessonId: "lesson8",
    category: "general",
    text: "지금 내 삶에서 반복해서 붙드는 주제는 무엇인가요?",
    type: FLOW_TYPES.awareness,
    energy: 1,
    stage: FLOW_STAGES.open,
    tags: ["주제", "반복"],
    followUps: ["l8_q2", "l8_q3"],
  }),
  createQuestion({
    id: "l8_q2",
    lessonId: "lesson8",
    category: "thinking",
    text: "그 주제가 내 삶에서 중요해진 이유를 한 문장으로 말하면 무엇인가요?",
    type: FLOW_TYPES.thinking,
    energy: 2,
    stage: FLOW_STAGES.insight,
    tags: ["핵심", "정리"],
    followUps: ["l8_q4"],
  }),
  createQuestion({
    id: "l8_q3",
    lessonId: "lesson8",
    category: "emotion",
    text: "그 주제를 떠올릴 때 가장 강하게 살아나는 감정은 무엇인가요?",
    type: FLOW_TYPES.emotion,
    energy: 2,
    stage: FLOW_STAGES.insight,
    tags: ["감정", "주제"],
    followUps: ["l8_q4", "l8_q5"],
  }),
  createQuestion({
    id: "l8_q4",
    lessonId: "lesson8",
    category: "relationship",
    text: "그 주제가 타인과 사회에 연결될 때 어떤 의미를 가질 수 있을까요?",
    type: FLOW_TYPES.relation,
    energy: 3,
    stage: FLOW_STAGES.deep,
    tags: ["사회", "관계", "연결"],
    followUps: ["l8_q6"],
  }),
  createQuestion({
    id: "l8_q5",
    lessonId: "lesson8",
    category: "action",
    text: "내 주제를 더 선명하게 만들기 위해 이번 주 할 수 있는 구체적 행동은 무엇인가요?",
    type: FLOW_TYPES.action,
    energy: 3,
    stage: FLOW_STAGES.integrate,
    tags: ["주제화", "실행"],
    followUps: ["l8_q6"],
  }),
  createQuestion({
    id: "l8_q6",
    lessonId: "lesson8",
    category: "general",
    text: "결국 나는 어떤 사람으로 기억되고 싶은가요?",
    type: FLOW_TYPES.meaning,
    energy: 4,
    stage: FLOW_STAGES.integrate,
    tags: ["정체성", "삶의방향"],
  }),

  // lesson9 - 나의 콘텐츠 만들기
  createQuestion({
    id: "l9_q1",
    lessonId: "lesson9",
    category: "general",
    text: "내가 만들고 싶은 콘텐츠는 누구를 위한 것인가요?",
    type: FLOW_TYPES.awareness,
    energy: 1,
    stage: FLOW_STAGES.open,
    tags: ["콘텐츠", "대상"],
    followUps: ["l9_q2", "l9_q3"],
  }),
  createQuestion({
    id: "l9_q2",
    lessonId: "lesson9",
    category: "thinking",
    text: "그 콘텐츠가 해결해 줄 문제나 필요는 무엇인가요?",
    type: FLOW_TYPES.thinking,
    energy: 2,
    stage: FLOW_STAGES.insight,
    tags: ["문제", "가치"],
    followUps: ["l9_q4"],
  }),
  createQuestion({
    id: "l9_q3",
    lessonId: "lesson9",
    category: "emotion",
    text: "내 이야기를 세상에 내놓는 일에서 가장 떨리는 부분은 무엇인가요?",
    type: FLOW_TYPES.emotion,
    energy: 2,
    stage: FLOW_STAGES.insight,
    tags: ["두려움", "표현"],
    followUps: ["l9_q4", "l9_q5"],
  }),
  createQuestion({
    id: "l9_q4",
    lessonId: "lesson9",
    category: "relationship",
    text: "이 콘텐츠를 통해 어떤 사람들과 연결되고 싶나요?",
    type: FLOW_TYPES.relation,
    energy: 3,
    stage: FLOW_STAGES.deep,
    tags: ["연결", "독자", "청중"],
    followUps: ["l9_q6"],
  }),
  createQuestion({
    id: "l9_q5",
    lessonId: "lesson9",
    category: "action",
    text: "오늘 당장 만들 수 있는 가장 작은 콘텐츠 한 조각은 무엇인가요?",
    type: FLOW_TYPES.action,
    energy: 3,
    stage: FLOW_STAGES.integrate,
    tags: ["작게시작", "실행"],
    followUps: ["l9_q6"],
  }),
  createQuestion({
    id: "l9_q6",
    lessonId: "lesson9",
    category: "general",
    text: "내 콘텐츠가 결국 전하고 싶은 한 문장은 무엇인가요?",
    type: FLOW_TYPES.meaning,
    energy: 4,
    stage: FLOW_STAGES.integrate,
    tags: ["메시지", "핵심문장"],
  }),

  // lesson10 - 나의 다음 역할
  createQuestion({
    id: "l10_q1",
    lessonId: "lesson10",
    category: "general",
    text: "앞으로의 삶에서 내가 맡고 싶은 다음 역할은 무엇인가요?",
    type: FLOW_TYPES.awareness,
    energy: 1,
    stage: FLOW_STAGES.open,
    tags: ["역할", "미래"],
    followUps: ["l10_q2", "l10_q3"],
  }),
  createQuestion({
    id: "l10_q2",
    lessonId: "lesson10",
    category: "thinking",
    text: "그 역할을 위해 지금부터 준비해야 할 가장 중요한 역량은 무엇인가요?",
    type: FLOW_TYPES.thinking,
    energy: 2,
    stage: FLOW_STAGES.insight,
    tags: ["역량", "준비"],
    followUps: ["l10_q4"],
  }),
  createQuestion({
    id: "l10_q3",
    lessonId: "lesson10",
    category: "emotion",
    text: "새로운 역할을 떠올릴 때 가장 크게 살아나는 감정은 기대인가요, 부담인가요?",
    type: FLOW_TYPES.emotion,
    energy: 2,
    stage: FLOW_STAGES.insight,
    tags: ["감정", "기대", "부담"],
    followUps: ["l10_q4", "l10_q5"],
  }),
  createQuestion({
    id: "l10_q4",
    lessonId: "lesson10",
    category: "relationship",
    text: "그 역할은 나 자신뿐 아니라 어떤 사람들에게 좋은 영향을 줄 수 있을까요?",
    type: FLOW_TYPES.relation,
    energy: 3,
    stage: FLOW_STAGES.deep,
    tags: ["영향", "기여"],
    followUps: ["l10_q6"],
  }),
  createQuestion({
    id: "l10_q5",
    lessonId: "lesson10",
    category: "action",
    text: "그 역할로 나아가기 위해 이번 달 안에 해볼 첫 실천은 무엇인가요?",
    type: FLOW_TYPES.action,
    energy: 3,
    stage: FLOW_STAGES.integrate,
    tags: ["실천", "첫걸음"],
    followUps: ["l10_q6"],
  }),
  createQuestion({
    id: "l10_q6",
    lessonId: "lesson10",
    category: "general",
    text: "지금까지의 삶과 앞으로의 삶을 잇는 한 문장을 만든다면 무엇인가요?",
    type: FLOW_TYPES.meaning,
    energy: 4,
    stage: FLOW_STAGES.integrate,
    tags: ["연결", "서사", "정리"],
  }),
];

export const QUESTIONS_BY_LESSON = QUESTIONS.reduce((acc, question) => {
  if (!acc[question.lessonId]) acc[question.lessonId] = [];
  acc[question.lessonId].push(question);
  return acc;
}, {});

export const ALL_QUESTIONS = QUESTIONS;

function normalizeCategory(category) {
  if (!category) return "general";
  const value = String(category).trim().toLowerCase();

  if (value === "all" || value === "전체") return "general";
  if (value === "감사") return "gratitude";
  if (value === "감정") return "emotion";
  if (value === "관계") return "relationship";
  if (value === "실행") return "action";

  return value;
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function randomPick(list) {
  if (!Array.isArray(list) || list.length === 0) return null;
  return list[Math.floor(Math.random() * list.length)];
}

export function getQuestionById(questionId) {
  return QUESTIONS.find((q) => q.id === questionId) || null;
}

export function getLessonQuestions(lessonId, category = "general") {
  const normalizedCategory = normalizeCategory(category);
  const lessonQuestions = QUESTIONS_BY_LESSON[lessonId] || [];

  if (normalizedCategory === "general") return lessonQuestions;

  return lessonQuestions.filter((q) => q.category === normalizedCategory);
}

export function getQuestionsByCategory(category = "general") {
  const normalizedCategory = normalizeCategory(category);

  if (normalizedCategory === "general") return QUESTIONS;

  return QUESTIONS.filter((q) => q.category === normalizedCategory);
}

export function getRandomQuestion(
  lessonId = "lesson1",
  category = "general",
  excludeIds = []
) {
  const normalizedCategory = normalizeCategory(category);
  const excluded = new Set(ensureArray(excludeIds));

  let pool = getLessonQuestions(lessonId, normalizedCategory).filter(
    (q) => !excluded.has(q.id)
  );

  if (pool.length === 0 && normalizedCategory !== "general") {
    pool = getLessonQuestions(lessonId, "general").filter(
      (q) => !excluded.has(q.id)
    );
  }

  if (pool.length === 0) {
    pool = (QUESTIONS_BY_LESSON[lessonId] || []).filter((q) => !excluded.has(q.id));
  }

  if (pool.length === 0) {
    pool = QUESTIONS.filter((q) => !excluded.has(q.id));
  }

  return randomPick(pool);
}

export function findFollowUpQuestion({
  currentQuestionId,
  lessonId = "lesson1",
  category = "general",
  usedQuestionIds = [],
  depth = 1,
} = {}) {
  const excluded = new Set(ensureArray(usedQuestionIds));
  const current = getQuestionById(currentQuestionId);

  if (!current) {
    return getRandomQuestion(lessonId, category, usedQuestionIds);
  }

  const followUpIds = ensureArray(current.followUps).filter((id) => !excluded.has(id));
  const directFollowUps = followUpIds
    .map((id) => getQuestionById(id))
    .filter(Boolean);

  if (directFollowUps.length > 0) {
    return randomPick(directFollowUps);
  }

  const lessonPool = QUESTIONS_BY_LESSON[lessonId] || [];
  const normalizedCategory = normalizeCategory(category);

  const preferredStageOrder =
    depth <= 1
      ? [FLOW_STAGES.insight, FLOW_STAGES.deep, FLOW_STAGES.integrate]
      : depth === 2
      ? [FLOW_STAGES.deep, FLOW_STAGES.integrate, FLOW_STAGES.insight]
      : [FLOW_STAGES.integrate, FLOW_STAGES.deep, FLOW_STAGES.insight];

  for (const stage of preferredStageOrder) {
    const sameCategoryPool = lessonPool.filter(
      (q) =>
        !excluded.has(q.id) &&
        q.id !== current.id &&
        q.stage === stage &&
        (normalizedCategory === "general" || q.category === normalizedCategory)
    );

    if (sameCategoryPool.length > 0) {
      return randomPick(sameCategoryPool);
    }
  }

  const fallbackPool = lessonPool.filter(
    (q) => !excluded.has(q.id) && q.id !== current.id
  );

  if (fallbackPool.length > 0) {
    return randomPick(fallbackPool);
  }

  return null;
}