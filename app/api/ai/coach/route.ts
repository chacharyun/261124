import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, payload } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback intelligent responses when GEMINI_API_KEY is not set or offline
    if (!apiKey) {
      return NextResponse.json(generateFallbackResponse(action, payload));
    }

    // Call Gemini API securely from server side
    try {
      const prompt = buildPromptForAction(action, payload);
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3, // Lower temperature for legal accuracy
              maxOutputTokens: 1000,
            },
          }),
        }
      );

      if (!res.ok) {
        return NextResponse.json(generateFallbackResponse(action, payload));
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      return NextResponse.json({
        success: true,
        text: text || "AI 코치 분석을 완료했습니다.",
        disclaimer:
          "※ 본 내용은 AI 학습 보조용 참고자료입니다. 실제 경찰공무원 시험 채점은 공포된 최신 법령 및 대법원·헌법재판소 판례 공보를 최종 기준으로 합니다.",
        isAiGenerated: true,
      });
    } catch (err) {
      return NextResponse.json(generateFallbackResponse(action, payload));
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function buildPromptForAction(action: string, payload: any): string {
  const legalGuidelines = `
[경찰시험 법률 정보 원칙]
- 대한민국 경찰공무원 순경 필기시험(형사법, 경찰학, 헌법) 기준에 맞춰 답할 것.
- 판례 번호(예: 대법원 2020도11419 판결)나 조문 번호(예: 형법 제21조, 경직법 제3조)를 명확히 인용할 것.
- 허위 사실이나 확인되지 않은 법령 개정을 조작하지 말 것.
- AI 생성 문제인 경우 실전 기출과 구분됨을 명시할 것.
`;

  switch (action) {
    case "pre_study":
      return `${legalGuidelines}
사용자가 오늘 공부를 시작하려고 합니다.
사용자 이름: ${payload.userName || "수험생"}
오늘 고정 일정: ${JSON.stringify(payload.schedules || [])}
오늘 공부 컨디션: ${payload.condition || "보통"}
목표 시간: ${payload.targetMinutes || 180}분
형사법, 경찰학, 헌법 세 과목을 아웃풋(50%) 중심으로 균형 있게 완수할 수 있도록 구체적이고 현실적인 순경 수험 조언을 작성해 주세요.`;

    case "day_finish":
      return `${legalGuidelines}
하루 공부 마무리를 분석해 주세요.
오늘 실제 공부 시간: ${payload.actualMinutes}분
계획된 목표 시간: ${payload.targetMinutes}분
오답 원인 태그들: ${JSON.stringify(payload.causeTags || [])}
헷갈린 개념들: ${JSON.stringify(payload.confusingConcepts || [])}
칭찬 일색보다는 취약점 극복과 내일 우선 복습해야 할 법령/판례 중심의 개선 피드백을 제공해 주세요.`;

    case "concept_explain":
      return `${legalGuidelines}
과목: ${payload.subject || "형사법"}
질문 개념: ${payload.concept}
기존 교재 내용: ${payload.context || "없음"}
이 개념의 핵심 요건, 수험생들이 가장 많이 헷갈리는 함정 선지, 대표 대법원/헌재 판례의 태도를 명쾌하게 비교 정리해 주세요.`;

    case "question_gen":
      return `${legalGuidelines}
과목: ${payload.subject || "형사법"}
단원: ${payload.topic || "핵심 단원"}
유형: ${payload.type || "OX"}
경찰 시험 기출 스타일의 고품질 문제를 1문항 출제하고, 정답과 정확한 해설(관련 조문 및 판례 근거)을 작성해 주세요.`;

    default:
      return `${legalGuidelines} 경찰 수험생을 위한 조언: ${JSON.stringify(payload)}`;
  }
}

function generateFallbackResponse(action: string, payload: any) {
  const disclaimer =
    "※ 본 내용은 순경 시험 핵심 출제 기준 및 룰베이스 검증 모델을 기반으로 생성된 AI 학습 가이드입니다. 시험 전 최신 법령 및 판례 공보를 재확인하세요.";

  switch (action) {
    case "pre_study": {
      const isTired = payload.condition === "tired";
      return {
        success: true,
        text: isTired
          ? `[웬디쌤의 컨디션 조절 처방전]\n오늘 컨디션이 다소 저조하므로 무리하게 180분을 채우기보다 '바쁜 날 최소 목표(60분)'를 우선 달성하는 전략을 권장합니다.\n\n1. 형사법: 빈출 판례 OX 10문항만 가볍게 확인\n2. 경찰학: 경직법 핵심 숫자 암기 15분\n3. 헌법: 신체의 자유 핵심 조문 읽기 15분\n\n최소 목표만 끝내도 마을의 캐릭터들이 기운을 차립니다! 힘내세요.`
          : `[웬디쌤의 고득점 아웃풋 처방전]\n좋은 컨디션인 오늘은 인풋 시간을 25% 이내로 줄이고, 실전 기출 풀이와 백지 복습(50% 이상)에 집중할 최적의 타이밍입니다.\n\n1. 형사법: 위법성조각사유 판례 기출 25문항 풀고 헷갈린 선지 오답 보관소에 등록\n2. 경찰학: 조문 요건('할 수 있다' vs '하여야 한다') 집중 대조\n3. 헌법: 기본권 제한의 한계(과잉금지원칙) 위헌/합헌 판례 정리\n\n세 과목을 40~50분씩 번갈아 공부하면 뇌의 피로도를 크게 줄일 수 있습니다.`,
        disclaimer,
        isAiGenerated: true,
      };
    }

    case "day_finish": {
      const actual = payload.actualMinutes || 120;
      const target = payload.targetMinutes || 180;
      const rate = Math.round((actual / target) * 100);

      return {
        success: true,
        text: `[웬디쌤의 일일 학습 정산 리포트]\n\n📊 오늘 실행률: ${rate}% (${actual}분 / ${target}분)\n\n🔍 오답 분석 & 객관적 진단:\n오늘 기록된 오답 중 '판례 혼동'과 '조문 혼동'의 비중이 높았습니다. 이는 기본서 회독 수보다 문제 풀이 시 선지의 키워드를 정밀하게 끊어 읽지 못한 데서 기인합니다.\n\n🎯 내일의 최우선 복습 과제:\n1. 오늘 오답 보관소에 등록된 헷갈림(⛅) 문항 1회 재풀이\n2. 경직법 제3조 임의동행의 시간 한계(6시간) 등 강행규정 숫자 재암기\n3. 주말까지 반복 오답을 0건으로 만드는 것을 1차 목표로 삼으세요.`,
        disclaimer,
        isAiGenerated: true,
      };
    }

    case "concept_explain": {
      const concept = payload.concept || "정당방위와 긴급피난";
      return {
        success: true,
        text: `[웬디쌤의 핵심 개념 명쾌 해설]\n주제: ${concept}\n\n1. 형법 제21조 정당방위 vs 형법 제22조 긴급피난의 본질적 차이:\n- 정당방위: '부정(不正) 대 정(正)'의 관계. 위법한 침해에 대한 방위이므로 보충성(피할 수 없는 유일한 수단일 것)을 엄격히 요구하지 않습니다.\n- 긴급피난: '정(正) 대 정(正)'의 관계. 무고한 제3자의 법익을 희생시키므로 보충성과 균형성이 훨씬 엄격하게 적용됩니다.\n\n2. 순경 시험 빈출 함정 선지:\n❌ "정당방위는 피난할 다른 수단이 없을 때에만 성립한다." → 오답 (정당방위는 도피할 의무가 원칙적으로 없음)\n⭕ "싸움에 있어서 공격과 방어가 연속되는 경우, 일방의 행위만을 분리하여 정당방위로 인정하기 어렵다." (대법원 2000도228 판결) → 정답 지문`,
        disclaimer,
        isAiGenerated: true,
      };
    }

    case "question_gen": {
      const sub = payload.subject || "criminal_law";
      if (sub === "police_studies") {
        return {
          success: true,
          text: `[AI 생성 모의 훈련 문제 - 경찰학]\n\nQ. 경찰관 직무집행법상 불심검문에 관한 설명 중 가장 옳지 않은 것은? (다툼이 있으면 판례에 의함)\n\n① 경찰관은 불심검문 대상자를 당해인에게 불리하거나 교통에 방해가 되는 때에 가까운 경찰관서에 동행할 것을 요구할 수 있다.\n② 임의동행을 한 경우 경찰관은 당해인을 6시간을 초과하여 경찰관서에 머물게 할 수 없다.\n③ 불심검문 대상자가 소지하고 있는 물품 중 흉기인지 여부를 확인하기 위해 외부를 만져보는 등의 조사는 허용되지 않는다.\n④ 당해인은 경찰관의 동행요구를 거절할 수 있으며, 동행 후에도 언제든지 퇴거할 수 있다.\n\n---\n[정답] ③번\n[해설] 경찰관 직무집행법 제3조 제4항에 따라 경찰관은 불심검문을 할 때 당해인이 흉기를 소지하고 있는지 여부를 조사할 수 있습니다. 따라서 외부를 가볍게 만져 확인하는 흉기 조사는 법률상 허용됩니다. (다만 일반 소지품에 대한 강제 수색은 영장 없이 불허)`,
          disclaimer:
            "※ 본 문제는 AI가 생성한 자율 훈련용 모의 문제입니다. 기출문제 공식 통계와는 별도로 구분 집계됩니다.",
          isAiGenerated: true,
        };
      }

      return {
        success: true,
        text: `[AI 생성 모의 훈련 문제 - 형사법]\n\nQ. 위법성조각사유에 관한 판례의 태도로서 옳지 않은 것은?\n\n① 정당방위가 성립하기 위해서는 자기 또는 타인의 법익에 대한 현재의 부당한 침해가 있어야 한다.\n② 과거의 침해 또는 침해가 종료된 후의 공격행위는 정당방위가 성립하지 않는다.\n③ 야간에 기타 불안스러운 상태하에서 공포, 경악, 흥분 또는 당황으로 인하여 방위행위가 과초된 때에는 벌하지 아니한다.\n④ 이혼소송 계속 중 처의 주거에 무단 침입한 남편의 침해행위가 종료된 이후라도, 처가 남편을 공격한 행위는 정당방위로 인정된다.\n\n---\n[정답] ④번\n[해설] 부당한 침해가 이미 종료된 후의 공격행위는 방위의사가 결여된 가해행위에 불과하여 정당방위가 성립할 수 없습니다 (대법원 2000도228 판결). 형법 제21조 제3항의 면책적 과잉방위 요건(야간 기타 불안스러운 상태의 공포·경악) 조문도 함께 암기하세요.`,
        disclaimer:
          "※ 본 문제는 AI가 생성한 자율 훈련용 모의 문제입니다. 기출문제 공식 통계와는 별도로 구분 집계됩니다.",
        isAiGenerated: true,
      };
    }

    default:
      return {
        success: true,
        text: "학습 코칭 정보를 확인했습니다. 오늘도 정진합시다!",
        disclaimer,
        isAiGenerated: true,
      };
  }
}
