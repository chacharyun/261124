export type SubjectId = "criminal_law" | "police_studies" | "constitution";

export interface SubjectInfo {
  id: SubjectId;
  name: string;
  nameKr: string;
  shortName: string;
  questionCount: number;
  characterName: string;
  characterTitle: string;
  characterAnimal: "rabbit" | "bear" | "cat";
  buildingName: string;
  color: string;
  accentColor: string;
  lightColor: string;
}

export type UnderstandingLevel = "none" | "confused" | "unsure" | "mastered";

export type MistakeCause =
  | "concept_lack"       // 개념 부족
  | "memorization_lack"  // 암기 부족
  | "case_confusion"     // 판례 혼동
  | "provision_confusion"// 조문 혼동
  | "option_confusion"   // 선지 혼동
  | "interpretation_error"// 문제 해석 오류
  | "careless_mistake"   // 단순 실수
  | "time_shortage";     // 시간 부족

export interface UserSettings {
  examDate: string; // "2027-03-20"
  userName: string; // "홍길동"
  villageName: string; // "푸른마을"
  dailyTargetMinutes: number; // 180
  busyDayMinMinutes: number; // 60
  soundEnabled: boolean;
  penOnlyMode: boolean;
  equippedOutfit?: string; // e.g. "uniform", "hoodie", "vest", "police_trial"
  avatarPos?: { x: number; y: number }; // Cyworld miniroom avatar coordinates %
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}

export interface TodoItem {
  id: string;
  title: string;
  subjectId: SubjectId;
  estimatedMinutes: number;
  completed: boolean;
  category: "lecture" | "problem" | "review" | "memorize" | "custom";
}

export interface FixedSchedule {
  id: string;
  title: string;
  dayOfWeek: number; // 0=Sun, 1=Mon... 6=Sat
  startTime: string; // "09:00"
  endTime: string; // "12:00"
  category: "school" | "part_time" | "volunteer" | "etc";
  memo?: string;
}

export interface SubjectPlan {
  subjectId: SubjectId;
  scope: string; // e.g. "형법총론 위법성조각사유"
  lectureNumber?: string; // e.g. "제 14강"
  problemRange?: string; // e.g. "기출 120번 ~ 145번"
  questionCount?: number; // 25
  reviewScope?: string; // e.g. "어제 오답 5문항"
  estimatedMinutes: number; // 60
  actualMinutes: number; // 55
  completed: boolean;
}

export interface DailyStudyPlan {
  id: string;
  date: string; // "YYYY-MM-DD"
  targetTier: "minimum" | "standard" | "extended"; // 60m, 180m, custom
  totalTargetMinutes: number;
  subjects: Record<SubjectId, SubjectPlan>;
  todos?: TodoItem[]; // 투두리스트 형식 항목들
  notes?: string;
  dayReviewCompleted?: boolean;
}

export interface StudySessionPhase {
  skimCompleted: boolean;     // 1단계: 훑어보기 (5%)
  inputCompleted: boolean;    // 2단계: 인풋 (25%)
  outputCompleted: boolean;   // 3단계: 아웃풋 (50%)
  feedbackCompleted: boolean; // 4단계: 피드백 (20%)
  skimMinutes: number;
  inputMinutes: number;
  outputMinutes: number;
  feedbackMinutes: number;
}

export interface StudySession {
  id: string;
  date: string; // "YYYY-MM-DD"
  subjectId: SubjectId;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  phases: StudySessionPhase;
  attemptedQuestions: number;
  correctQuestions: number;
  confusingConcepts: string[];
  notes?: string;
}

export interface ReviewItem {
  id: string;
  subjectId: SubjectId;
  topic: string;
  textbookName: string;
  problemNumber: string;
  problemImageUrl?: string; // Data URL or storage URL (문제/지문 영역)
  optionsImageUrl?: string; // 선지 ①~④ 분리 이미지
  problemText?: string;     // 문제 지문 텍스트
  optionsList?: string[];   // [①번 선지, ②번 선지, ③번 선지, ④번 선지] 분리 텍스트
  solutionImageUrl?: string;// 해설 이미지
  selectedAnswer?: string;
  correctAnswer?: string;
  causeTags: MistakeCause[];
  understanding: UnderstandingLevel;
  registeredDate: string; // "YYYY-MM-DD"
  nextReviewDate: string; // "YYYY-MM-DD"
  reviewStage: number; // 1, 2, 3, 4 (3d, 7d, 14d, 30d)
  reviewCount: number;
  overcome: boolean;
  memo?: string;
  isAiGenerated?: boolean;
}

export interface ReviewAttempt {
  id: string;
  reviewItemId: string;
  attemptDate: string;
  selectedAnswer?: string;
  isCorrect?: boolean;
  understanding: UnderstandingLevel;
  spentSeconds: number;
}

export interface StrokePoint {
  x: number;
  y: number;
  pressure?: number;
}

export interface Stroke {
  points: StrokePoint[];
  color: string;
  width: number;
  tool: "pen" | "highlighter" | "eraser";
}

export interface NotePage {
  canvasWidth?: number;
  id: string;
  pageNumber: number;
  template: "blank" | "lined" | "grid" | "problem";
  backgroundImage?: string;
  strokes: Stroke[];
  previewUrl?: string;
}

export interface HandwrittenNote {
  id: string;
  title: string;
  subjectId: SubjectId;
  topic: string;
  createdAt: string;
  updatedAt: string;
  pages: NotePage[];
  thumbnailUrl?: string;
}

export interface AiCoachMessage {
  id: string;
  date: string;
  type: "pre_study" | "during_study" | "day_finish" | "weekly" | "concept_explainer" | "question_gen";
  title: string;
  content: string;
  disclaimer?: string; // 법령/판례 기준 및 비검증 표기 안내
  relatedSubject?: SubjectId;
  createdAt: string;
}

export interface VillageBuilding {
  id: SubjectId;
  name: string;
  level: number; // 1 ~ 5
  xp: number;
  maxXp: number;
  unlockedFeatures: string[];
}

export interface VillageCharacter {
  id: SubjectId;
  name: string;
  animal: "rabbit" | "bear" | "cat";
  dialogue: string;
  level: number;
  mood: "happy" | "reading" | "cheering" | "proud";
  outfit: string;
}

export interface VillageDecorationItem {
  id: string;
  type: "cherry_tree" | "flower_bed" | "bench" | "street_lamp" | "fountain" | "bookshelf" | "stone_path" | "flag" | "tea_table";
  name: string;
  x: number; // grid coords 0-7
  y: number; // grid coords 0-7
  unlocked: boolean;
  costXp: number;
}

export interface MiniroomItem {
  id: string;
  type: "desk" | "chair" | "bookshelf" | "bed" | "rug" | "lamp" | "plant" | "poster" | "window" | "teddy_bear" | "police_cap_stand";
  name: string;
  x: number; // 0-100 percentage in miniroom
  y: number; // 0-100 percentage in miniroom
  unlocked: boolean;
  placed: boolean;
  costBells: number;
  category: "furniture" | "wall" | "rug" | "prop";
  icon: string;
}

export interface WardrobeItem {
  id: string;
  name: string;
  category: "outfit" | "hair" | "accessory";
  unlocked: boolean;
  costBells: number;
  description: string;
  icon: string;
  color: string;
}

export interface VillageState {
  level: number;
  totalXp: number;
  coins: number;
  buildings: Record<SubjectId, VillageBuilding>;
  characters: Record<SubjectId, VillageCharacter>;
  decorations: VillageDecorationItem[];
  miniroomItems: MiniroomItem[];
  wardrobe: WardrobeItem[];
  equippedOutfit: string;
  avatarPos: { x: number; y: number };
  recentUnlocks: string[];
}

export interface XpTransaction {
  id: string;
  idempotencyKey: string;
  activityType:
    | "subject_complete"
    | "questions_10"
    | "review_problem"
    | "repeat_mistake_overcome"
    | "all_three_complete"
    | "day_finish"
    | "weekly_goal";
  xpAwarded: number;
  subjectId?: SubjectId;
  timestamp: string;
}
