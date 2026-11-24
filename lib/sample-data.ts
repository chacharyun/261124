import {
  DailyStudyPlan,
  FixedSchedule,
  HandwrittenNote,
  ReviewItem,
  StudySession,
  UserSettings,
  VillageState,
  AiCoachMessage,
} from "./types";
import { EXAM_DATE } from "./constants";
import { getTodayDateString } from "./spaced-repetition";

export const initialUserSettings: UserSettings = {
  examDate: EXAM_DATE,
  userName: "순경합격이",
  villageName: "푸른 순경마을",
  dailyTargetMinutes: 180,
  busyDayMinMinutes: 60,
  soundEnabled: true,
  penOnlyMode: false,
};

export const initialSchedules: FixedSchedule[] = [
  {
    id: "sch-1",
    title: "대학교 전공 대면 강의",
    dayOfWeek: 1, // 월
    startTime: "09:30",
    endTime: "13:30",
    category: "school",
    memo: "경찰행정학 전공 수업 및 팀플",
  },
  {
    id: "sch-2",
    title: "동네 편의점 파트타임",
    dayOfWeek: 2, // 화
    startTime: "14:00",
    endTime: "19:00",
    category: "part_time",
    memo: "화/목 고정 알바 (틈틈이 OX 단어장 암기)",
  },
  {
    id: "sch-3",
    title: "대학교 전공 대면 강의",
    dayOfWeek: 3, // 수
    startTime: "10:00",
    endTime: "14:00",
    category: "school",
    memo: "형사소송법 세미나",
  },
  {
    id: "sch-4",
    title: "동네 편의점 파트타임",
    dayOfWeek: 4, // 목
    startTime: "14:00",
    endTime: "19:00",
    category: "part_time",
    memo: "화/목 고정 알바",
  },
];

export function getInitialTodayPlan(): DailyStudyPlan {
  const today = getTodayDateString();
  return {
    id: `plan-${today}`,
    date: today,
    targetTier: "standard",
    totalTargetMinutes: 180,
    subjects: {
      criminal_law: {
        subjectId: "criminal_law",
        scope: "형법총론 위법성조각사유 (정당방위, 긴급피난) 판례 정복",
        lectureNumber: "기본이론 18강~19강",
        problemRange: "핵심기출 150번~175번 (25문항)",
        questionCount: 25,
        reviewScope: "어제 오답 4문항 복습",
        estimatedMinutes: 65,
        actualMinutes: 45,
        completed: false,
      },
      police_studies: {
        subjectId: "police_studies",
        scope: "경찰작용법 — 경찰관 직무집행법 제3조~제6조 핵심 조문 암기",
        lectureNumber: "심화기출 12강",
        problemRange: "단원별 기출 80번~105번 (25문항)",
        questionCount: 25,
        reviewScope: "불심검문 및 무기사용 조문 암기 점검",
        estimatedMinutes: 65,
        actualMinutes: 30,
        completed: false,
      },
      constitution: {
        subjectId: "constitution",
        scope: "기본권총론 — 신체의 자유 및 적법절차 원칙, 영장주의 예외 판례",
        lectureNumber: "핵심요약 8강",
        problemRange: "기출 모의고사 35번~50번 (15문항)",
        questionCount: 15,
        reviewScope: "체포·구속적부심사 청구권 복습",
        estimatedMinutes: 50,
        actualMinutes: 20,
        completed: false,
      },
    },
    notes: "오늘 학교 수업 끝난 후 저녁 7시부터 도서관에서 집중 공부!",
    dayReviewCompleted: false,
  };
}

export const initialReviewItems: ReviewItem[] = [
  {
    id: "rev-1",
    subjectId: "criminal_law",
    topic: "형법총론 — 위법성조각사유 (정당방위)",
    textbookName: "2026 경찰공무원 형사법 단원별 기출 1000제",
    problemNumber: "142번",
    selectedAnswer: "3",
    correctAnswer: "2",
    causeTags: ["case_confusion", "option_confusion"],
    understanding: "confused",
    registeredDate: getTodayDateString(),
    nextReviewDate: getTodayDateString(),
    reviewStage: 1,
    reviewCount: 1,
    overcome: false,
    memo: "대법원 2000도228 판결: 이혼소송 중인 남편이 처의 주거에 침입한 사건에서 방위의사가 인정되는지 여부 혼동함. 부당한 침해가 종료된 후의 공격은 정당방위가 성립하지 않음에 유의할 것!",
  },
  {
    id: "rev-2",
    subjectId: "police_studies",
    topic: "경찰작용법 — 경찰관 직무집행법 (불심검문)",
    textbookName: "2026 알기 쉬운 경찰학 핵심 기출문제집",
    problemNumber: "88번",
    selectedAnswer: "1",
    correctAnswer: "4",
    causeTags: ["provision_confusion", "memorization_lack"],
    understanding: "none",
    registeredDate: getTodayDateString(),
    nextReviewDate: getTodayDateString(),
    reviewStage: 1,
    reviewCount: 2,
    overcome: false,
    memo: "경직법 제3조 임의동행: 당해인을 6시간을 초과하여 경찰관서에 머물게 할 수 없다(강행규정). 흉기 조사권은 정지 시 가능하나 일반 소지품 검사는 강제할 수 없음!",
  },
  {
    id: "rev-3",
    subjectId: "constitution",
    topic: "개별기본권 — 신체의 자유 (영장주의)",
    textbookName: "2026 헌법 객관식 판례완성",
    problemNumber: "54번",
    selectedAnswer: "2",
    correctAnswer: "3",
    causeTags: ["case_confusion"],
    understanding: "unsure",
    registeredDate: getTodayDateString(),
    nextReviewDate: getTodayDateString(),
    reviewStage: 1,
    reviewCount: 1,
    overcome: false,
    memo: "헌법재판소 2018헌바300 판시: 교도소 수용자에 대한 신체검사 및 음주측정요구의 영장주의 적용 여부 — 행정 목적의 조사나 즉각적 안전확보 조치에는 영장주의가 직접 적용되지 않음.",
  },
  {
    id: "rev-4",
    subjectId: "criminal_law",
    topic: "형사소송법 — 위법수집증거배제법칙",
    textbookName: "형사소송법 핵심 기출총정리",
    problemNumber: "210번",
    selectedAnswer: "4",
    correctAnswer: "4",
    causeTags: ["option_confusion"],
    understanding: "mastered",
    registeredDate: "2026-11-20",
    nextReviewDate: "2026-11-27",
    reviewStage: 2,
    reviewCount: 3,
    overcome: true,
    memo: "독수의 과실 이론과 인과관계 희석·단절 예외 판례 완벽 정리됨.",
  },
];

export const initialNotes: HandwrittenNote[] = [
  {
    id: "note-1",
    title: "형법총론 위법성조각사유 한눈에 백지 복습",
    subjectId: "criminal_law",
    topic: "위법성조각사유 (제20조~제24조)",
    createdAt: "2026-11-22",
    updatedAt: "2026-11-23",
    pages: [
      {
        id: "p-1",
        pageNumber: 1,
        template: "grid",
        strokes: [],
      },
    ],
  },
  {
    id: "note-2",
    title: "경찰관 직무집행법 조문별 숫자 암기장",
    subjectId: "police_studies",
    topic: "경직법 핵심 조문 요약",
    createdAt: "2026-11-21",
    updatedAt: "2026-11-22",
    pages: [
      {
        id: "p-2",
        pageNumber: 1,
        template: "lined",
        strokes: [],
      },
    ],
  },
];

export const initialVillageState: VillageState = {
  level: 3,
  totalXp: 145,
  coins: 350,
  buildings: {
    criminal_law: {
      id: "criminal_law",
      name: "형사법 도서관",
      level: 2,
      xp: 45,
      maxXp: 100,
      unlockedFeatures: ["판례 열람실", "백지 복습 서재"],
    },
    police_studies: {
      id: "police_studies",
      name: "경찰학 경찰서",
      level: 2,
      xp: 60,
      maxXp: 100,
      unlockedFeatures: ["조문 상황실", "112 순찰차"],
    },
    constitution: {
      id: "constitution",
      name: "헌법 법원",
      level: 1,
      xp: 40,
      maxXp: 100,
      unlockedFeatures: ["정의의 여신상"],
    },
  },
  characters: {
    criminal_law: {
      id: "criminal_law",
      name: "보미 (토끼)",
      animal: "rabbit",
      dialogue: "안녕! 오늘도 형사법 판례 3개만 확실히 내 것으로 만들어볼까?",
      level: 2,
      mood: "reading",
      outfit: "도서관 사서 조끼 & 안경",
    },
    police_studies: {
      id: "police_studies",
      name: "곰순 (곰돌이)",
      animal: "bear",
      dialogue: "충성! 경찰학 조문은 매일 10분씩 눈에 익히는 게 합격의 열쇠예요!",
      level: 2,
      mood: "happy",
      outfit: "멋진 정복 경찰 모자 & 배지",
    },
    constitution: {
      id: "constitution",
      name: "나비 (고양이)",
      animal: "cat",
      dialogue: "헌법 기본권의 본질적 내용은 절대 침해받을 수 없다냥! 힘내자!",
      level: 1,
      mood: "cheering",
      outfit: "학사모 & 정의의 망토",
    },
  },
  decorations: [
    { id: "dec-1", type: "cherry_tree", name: "벚꽃나무", x: 1, y: 1, unlocked: true, costXp: 20 },
    { id: "dec-2", type: "flower_bed", name: "합격 튤립 꽃밭", x: 2, y: 2, unlocked: true, costXp: 15 },
    { id: "dec-3", type: "bench", name: "따스한 원목 벤치", x: 4, y: 2, unlocked: true, costXp: 25 },
    { id: "dec-4", type: "street_lamp", name: "야간 가로등", x: 5, y: 1, unlocked: true, costXp: 30 },
    { id: "dec-5", type: "fountain", name: "중앙 순경 분수대", x: 3, y: 3, unlocked: false, costXp: 80 },
    { id: "dec-6", type: "bookshelf", name: "야외 책장", x: 6, y: 3, unlocked: false, costXp: 50 },
  ],
  recentUnlocks: ["형사법 도서관 2층 증축", "벚꽃나무 장식"],
};

export const initialAiMessages: AiCoachMessage[] = [
  {
    id: "ai-1",
    date: getTodayDateString(),
    type: "pre_study",
    title: "웬디쌤의 오늘의 아침 학습 처방전 🌸",
    content:
      "좋은 아침이에요, 순경합격 님! 오늘은 오후 대학교 수업 일정이 있으니, 남은 여유 시간 동안 형사법 '위법성조각사유' 기출 25문항과 경직법 핵심 조문을 아웃풋 중심(50% 이상)으로 먼저 해결하는 것을 강력 추천합니다. 바쁜 날이라도 최소 60분 목표만 달성하면 마을 캐릭터들이 큰 힘을 얻어요!",
    disclaimer: "※ 본 조언은 사용자 설정 스케줄 및 최근 7일 학습 패턴을 기반으로 한 학습 가이드입니다.",
    createdAt: "2026-11-24 08:30",
  },
];

export const initialSessions: StudySession[] = [
  {
    id: "sess-1",
    date: getTodayDateString(),
    subjectId: "criminal_law",
    startTime: "09:00",
    endTime: "09:45",
    durationMinutes: 45,
    phases: {
      skimCompleted: true,
      inputCompleted: true,
      outputCompleted: true,
      feedbackCompleted: false,
      skimMinutes: 5,
      inputMinutes: 15,
      outputMinutes: 20,
      feedbackMinutes: 5,
    },
    attemptedQuestions: 20,
    correctQuestions: 17,
    confusingConcepts: ["정당방위 상당성 판례", "오상방위의 법적 성격"],
    notes: "아웃풋 위주로 푸니 시간 배분이 훨씬 수월했음.",
  },
];
