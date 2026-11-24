import { UnderstandingLevel } from "./types";
import { EXAM_DATE } from "./constants";

export interface SpacedRepetitionResult {
  nextReviewDate: string; // YYYY-MM-DD
  nextStage: number; // 1 ~ 4
  overcome: boolean;
  daysAdded: number;
}

/**
 * Calculates next review interval according to candidate's self-evaluation.
 * Clamped so it never exceeds the exam date (2027-03-20).
 */
export function calculateNextReview(
  currentDateStr: string,
  understanding: UnderstandingLevel,
  currentStage: number = 1,
  isCorrect?: boolean
): SpacedRepetitionResult {
  const baseDate = new Date(currentDateStr);
  let days = 1;
  let nextStage = currentStage;
  let overcome = false;

  // If wrong in 4-choice or self-rated none/confused
  if (isCorrect === false || understanding === "none" || understanding === "confused") {
    days = 1; // 내일 바로 복습
    nextStage = Math.max(1, currentStage - 1); // 단축 단계로 회귀
    overcome = false;
  } else if (understanding === "unsure") {
    days = 3;
    nextStage = currentStage; // 유지
    overcome = false;
  } else if (understanding === "mastered") {
    // 확실히 이해함: 3일 -> 7일 -> 14일 -> 30일
    const intervals = [3, 7, 14, 30];
    const stageIdx = Math.min(Math.max(currentStage - 1, 0), intervals.length - 1);
    days = intervals[stageIdx];
    nextStage = Math.min(4, currentStage + 1);
    overcome = currentStage >= 2; // 2회 이상 연속 통과 시 극복 판정
  }

  // Calculate target date
  const targetDate = new Date(baseDate);
  targetDate.setDate(targetDate.getDate() + days);

  // Clamp before or at exam date (2027-03-20)
  const examDate = new Date(EXAM_DATE);
  if (targetDate > examDate) {
    targetDate.setTime(examDate.getTime());
  }

  const yyyy = targetDate.getFullYear();
  const mm = String(targetDate.getMonth() + 1).padStart(2, "0");
  const dd = String(targetDate.getDate()).padStart(2, "0");

  return {
    nextReviewDate: `${yyyy}-${mm}-${dd}`,
    nextStage,
    overcome,
    daysAdded: days,
  };
}

/**
 * Format date to YYYY-MM-DD in local time
 */
export function getTodayDateString(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Calculate D-Day from a target date
 */
export function calculateDDay(targetDateStr: string = EXAM_DATE): { days: number; text: string } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(targetDateStr);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { days: 0, text: "D-Day (오늘 시험!)" };
  } else if (diffDays > 0) {
    return { days: diffDays, text: `D-${diffDays}` };
  } else {
    return { days: diffDays, text: `D+${Math.abs(diffDays)}` };
  }
}
