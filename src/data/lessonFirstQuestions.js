// src/data/lessonFirstQuestions.js

export const LESSON_FIRST_QUESTIONS = {
  lesson1: {
    lessonId: "lesson1",
    title: "1강",
    firstQuestion: "AI를 배우려는 지금, 당신이 가장 기대하는 변화는 무엇인가요?",
  },
  lesson2: {
    lessonId: "lesson2",
    title: "2강",
    firstQuestion: "스마트폰으로 새로운 것을 배울 때, 당신이 가장 자주 느끼는 어려움은 무엇인가요?",
  },
  lesson3: {
    lessonId: "lesson3",
    title: "3강",
    firstQuestion: "AI에게 질문할 때, 좋은 답을 얻기 위해 가장 먼저 분명히 해야 할 것은 무엇일까요?",
  },
  lesson4: {
    lessonId: "lesson4",
    title: "4강",
    firstQuestion: "지금 당신이 일상에서 해결하고 싶은 작은 문제 하나는 무엇인가요?",
  },
  lesson5: {
    lessonId: "lesson5",
    title: "5강",
    firstQuestion: "AI의 답변을 보면서 ‘이건 맞다, 아니다’를 판단할 때 당신은 무엇을 기준으로 삼나요?",
  },
  lesson6: {
    lessonId: "lesson6",
    title: "6강",
    firstQuestion: "AI를 사용할 때, 당신만의 생각과 AI의 도움은 어떻게 구분되어야 한다고 보시나요?",
  },
  lesson7: {
    lessonId: "lesson7",
    title: "7강",
    firstQuestion: "당신의 경험과 경력이 다른 사람에게 가장 도움이 될 수 있는 주제는 무엇인가요?",
  },
  lesson8: {
    lessonId: "lesson8",
    title: "8강",
    firstQuestion: "AI를 활용해 글이나 기록을 남긴다면, 가장 먼저 정리해 보고 싶은 삶의 주제는 무엇인가요?",
  },
  lesson9: {
    lessonId: "lesson9",
    title: "9강",
    firstQuestion: "지역사회나 공동체 안에서 AI를 활용해 개선해 보고 싶은 일은 무엇인가요?",
  },
  lesson10: {
    lessonId: "lesson10",
    title: "10강",
    firstQuestion: "이 10개 강의를 지나며, 당신 안에서 가장 달라졌다고 느끼는 점은 무엇인가요?",
  },
};

export function getLessonFirstQuestion(lessonId) {
  return (
    LESSON_FIRST_QUESTIONS[lessonId]?.firstQuestion ||
    "오늘 이 대화에서 가장 먼저 다루고 싶은 주제는 무엇인가요?"
  );
}

export function getLessonTitle(lessonId) {
  return LESSON_FIRST_QUESTIONS[lessonId]?.title || "강의";
}