import {
  DailyStudyPlan,
  FixedSchedule,
  HandwrittenNote,
  ReviewItem,
  StudySession,
  UserSettings,
  VillageState,
  AiCoachMessage,
  MiniroomItem,
  WardrobeItem,
  TodoItem,
} from "./types";
import { EXAM_DATE } from "./constants";
import { getTodayDateString } from "./spaced-repetition";

export const initialUserSettings: UserSettings = {
  examDate: EXAM_DATE,
  userName: "홍길동",
  villageName: "푸른마을",
  dailyTargetMinutes: 180,
  busyDayMinMinutes: 60,
  soundEnabled: true,
  penOnlyMode: false,
  equippedOutfit: "student_hoodie",
  avatarPos: { x: 50, y: 65 },
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
        scope: "",
        lectureNumber: "",
        problemRange: "",
        questionCount: 0,
        reviewScope: "",
        estimatedMinutes: 65,
        actualMinutes: 0,
        completed: false,
      },
      police_studies: {
        subjectId: "police_studies",
        scope: "",
        lectureNumber: "",
        problemRange: "",
        questionCount: 0,
        reviewScope: "",
        estimatedMinutes: 65,
        actualMinutes: 0,
        completed: false,
      },
      constitution: {
        subjectId: "constitution",
        scope: "",
        lectureNumber: "",
        problemRange: "",
        questionCount: 0,
        reviewScope: "",
        estimatedMinutes: 50,
        actualMinutes: 0,
        completed: false,
      },
    },
    notes: "",
    dayReviewCompleted: false,
    todos: [],
  };
}

export const initialReviewItems: ReviewItem[] = [
  {
    id: "rev-1",
    subjectId: "criminal_law",
    topic: "형법총론 — 위법성조각사유 (정당방위)",
    textbookName: "2026 경찰공무원 형사법 단원별 기출 1000제",
    problemNumber: "142번",
    problemText: "문. 정당방위(형법 제21조)에 관한 판례의 태도로서 가장 옳지 않은 것은? (다툼이 있으면 판례에 의함)",
    optionsList: [
      "현재의 부당한 침해가 종료된 후의 공격행위는 방위의사가 결여되어 정당방위가 성립하지 않는다.",
      "이혼소송 계속 중 처의 주거에 무단 침입한 남편의 침해행위가 종료된 이후라도, 처가 남편을 공격한 행위는 정당방위로 인정된다.",
      "정당방위의 성립요건으로서의 방위의사는 오로지 방위의사만으로 차있어야 하는 것은 아니며 가해의사가 동시에 존재하여도 방위의사가 인정될 수 있다.",
      "야간 기타 불안스러운 상태하에서 공포·경악·흥분 또는 당황으로 인하여 방위행위가 과초된 때에는 벌하지 아니한다."
    ],
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
    problemText: "문. 경찰관 직무집행법상 불심검문에 관한 설명으로 가장 옳지 않은 것은?",
    optionsList: [
      "불심검문 대상자를 당해인에게 불리하거나 교통에 방해가 되는 때에 경찰관서에 동행할 것을 요구할 수 있다.",
      "당해인은 경찰관의 동행요구를 거절할 수 있다.",
      "불심검문 대상자가 소지한 물품 중 흉기인지 여부를 확인하기 위하여 외관을 만져보는 조사는 허용되지 않는다.",
      "임의동행을 한 경우 경찰관은 당해인을 6시간을 초과하여 경찰관서에 머물게 할 수 없다."
    ],
    selectedAnswer: "1",
    correctAnswer: "3",
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
    problemText: "문. 헌법 제12조 영장주의에 관한 헌법재판소 판례의 태도로서 가장 옳은 것은?",
    optionsList: [
      "영장주의는 형사절차뿐만 아니라 모든 국가행정조사작용에 예외 없이 직접 적용된다.",
      "전투경찰순경에 대한 영창처분은 사법절차에 준하므로 법관의 영장이 반드시 필요하다.",
      "교도소 수용자에 대한 신체검사 및 음주측정요구는 신체 안전을 위한 행정조사로서 영장주의가 직접 적용되지 않는다.",
      "검사의 기소독점주의는 영장주의의 본질적 내용에 포함되어 입법으로도 제한할 수 없다."
    ],
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
    problemText: "문. 위법수집증거배제법칙(형사소송법 제308조의2)에 관한 판례의 설명 중 옳은 것은?",
    optionsList: [
      "위법수집증거는 피고인이 동의하면 증거능력이 인정된다.",
      "사법경찰관이 영장 없이 긴급체포 후 석방한 경우 사후영장 청구 없이 압수한 물건도 증거로 쓸 수 있다.",
      "헌법과 형사소송법이 정한 절차에 따르지 않고 수집한 증거는 원칙적으로 유죄 인정의 증거로 삼을 수 없다.",
      "선량한 제3자가 우연히 제출한 위법증거는 어떠한 경우에도 증거능력이 배제된다."
    ],
    selectedAnswer: "4",
    correctAnswer: "3",
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

export const initialMiniroomItems: MiniroomItem[] = [
  { id: "mr-desk", type: "desk", name: "원목 독서실 책상", x: 26, y: 52, unlocked: true, placed: true, costBells: 0, category: "furniture", icon: "🪑" },
  { id: "mr-chair", type: "chair", name: "포근한 인체공학 의자", x: 38, y: 64, unlocked: true, placed: true, costBells: 0, category: "furniture", icon: "🛋️" },
  { id: "mr-bookshelf", type: "bookshelf", name: "경찰 수험서 가득 책장", x: 12, y: 35, unlocked: true, placed: true, costBells: 0, category: "furniture", icon: "📚" },
  { id: "mr-lamp", type: "lamp", name: "골드 스탠드 조명", x: 32, y: 44, unlocked: true, placed: true, costBells: 0, category: "prop", icon: "💡" },
  { id: "mr-rug", type: "rug", name: "파스텔 체크 러그", x: 50, y: 70, unlocked: true, placed: true, costBells: 0, category: "rug", icon: "🧶" },
  { id: "mr-poster", type: "poster", name: "2027 순경 합격 다짐 포스터", x: 74, y: 22, unlocked: true, placed: true, costBells: 0, category: "wall", icon: "📜" },
  { id: "mr-window", type: "window", name: "햇살 가득 벚꽃 창문", x: 44, y: 16, unlocked: true, placed: true, costBells: 0, category: "wall", icon: "🪟" },
  { id: "mr-bear", type: "teddy_bear", name: "경찰관 테디베어 인형", x: 80, y: 65, unlocked: true, placed: true, costBells: 30, category: "prop", icon: "🧸" },
  { id: "mr-plant", type: "plant", name: "합격 기원 행운목 화분", x: 86, y: 46, unlocked: false, placed: false, costBells: 25, category: "prop", icon: "🪴" },
  { id: "mr-bed", type: "bed", name: "단잠 휴식 미니 침대", x: 70, y: 50, unlocked: false, placed: false, costBells: 90, category: "furniture", icon: "🛏️" },
  { id: "mr-cap", type: "police_cap_stand", name: "경찰 정복 모자 스탠드", x: 18, y: 62, unlocked: false, placed: false, costBells: 45, category: "prop", icon: "👮" },
];

export const initialWardrobeItems: WardrobeItem[] = [
  { id: "student_hoodie", name: "수험생 파스텔 후드티", category: "outfit", unlocked: true, costBells: 0, description: "편안하고 따뜻해서 집중이 잘 되는 데일리 후드티", icon: "🧥", color: "#F3B8CC" },
  { id: "school_vest", name: "단정한 셔츠 & 니트 조끼", category: "outfit", unlocked: true, costBells: 25, description: "도서관에 갈 때 단정하게 입기 좋은 학구적인 룩", icon: "👔", color: "#B9D5B0" },
  { id: "police_trial", name: "순경 제복 체험복", category: "outfit", unlocked: false, costBells: 70, description: "미래의 나를 미리 입어보는 동기부여 경찰 정복 룩", icon: "👮‍♀️", color: "#3B5998" },
  { id: "study_glasses", name: "집중력 UP 뿔테 안경", category: "accessory", unlocked: true, costBells: 15, description: "지문이 또렷하게 보이는 스마트 안경", icon: "👓", color: "#51454A" },
  { id: "cherry_ribbon", name: "합격 기원 벚꽃 리본", category: "hair", unlocked: false, costBells: 20, description: "봄날의 합격을 약속하는 사랑스러운 리본 핀", icon: "🎀", color: "#FF758F" },
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
    { id: "dec-1", type: "cherry_tree", name: "벚꽃나무", x: 0, y: 0, unlocked: true, costXp: 20 },
    { id: "dec-2", type: "flower_bed", name: "합격 튤립 꽃밭", x: 2, y: 0, unlocked: true, costXp: 15 },
    { id: "dec-3", type: "bench", name: "따스한 원목 벤치", x: 4, y: 1, unlocked: true, costXp: 25 },
    { id: "dec-4", type: "street_lamp", name: "야간 가로등", x: 5, y: 0, unlocked: true, costXp: 30 },
    { id: "dec-5", type: "fountain", name: "중앙 순경 분수대", x: 2, y: 1, unlocked: false, costXp: 80 },
    { id: "dec-6", type: "bookshelf", name: "야외 책장", x: 1, y: 2, unlocked: false, costXp: 50 },
  ],
  miniroomItems: initialMiniroomItems,
  wardrobe: initialWardrobeItems,
  equippedOutfit: "student_hoodie",
  avatarPos: { x: 50, y: 65 },
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
