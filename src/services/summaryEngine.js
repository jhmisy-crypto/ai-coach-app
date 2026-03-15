/**
 * 답변 배열을 받아 간단 요약 문장 생성
 * answers: string[]
 * summaryType: string
 */

export function generateSummary(answers = [], summaryType = "") {
  const cleaned = answers.filter((a) => a && a.trim() !== "");

  if (!cleaned.length) {
    return "아직 정리할 내용이 충분하지 않습니다.";
  }

  const joined = cleaned.join(" / ");

  switch (summaryType) {
    case "problem":
      return `지금 당신이 다루고 있는 핵심 문제는 "${cleaned[0]}" 입니다. 이 문제는 ${joined} 와(과) 연결되어 있습니다.`;

    case "goal":
      return `당신은 "${cleaned[0]}" 상태를 목표로 설정했습니다. 이를 위해 ${joined} 방향으로 움직이려 합니다.`;

    case "block":
      return `현재 행동을 막는 요소는 "${cleaned[0]}" 입니다. 이는 ${joined} 형태로 나타나고 있습니다.`;

    case "resource":
      return `당신은 "${cleaned[0]}" 라는 자원을 가지고 있습니다. 또한 ${joined} 를 활용할 수 있습니다.`;

    case "idea":
      return `실행 아이디어로 "${cleaned[0]}" 를 떠올렸습니다. 추가로 ${joined} 가능성도 있습니다.`;

    case "action":
      return `당신은 "${cleaned[0]}" 행동을 실행하기로 했습니다. 실행 조건은 ${joined} 입니다.`;

    case "commit":
      return `실행을 지속하기 위해 "${cleaned[0]}" 방식으로 책임을 설정했습니다. 또한 ${joined} 전략을 고려하고 있습니다.`;

    case "review":
      return `실행 이후 "${cleaned[0]}" 변화를 관찰했습니다. 그리고 ${joined} 조정이 필요합니다.`;

    case "insight":
      return `이번 경험을 통해 "${cleaned[0]}" 통찰을 얻었습니다. 더 나아가 ${joined} 이해가 생겼습니다.`;

    case "return":
      return `이번 여정을 통해 "${cleaned[0]}" 변화를 선언합니다. 앞으로 ${joined} 삶을 살아가려 합니다.`;

    default:
      return `당신의 핵심 생각은 "${cleaned[0]}" 입니다. 추가로 ${joined} 내용이 있습니다.`;
  }
}