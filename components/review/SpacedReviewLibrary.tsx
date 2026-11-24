"use client";

import React, { useState, useMemo } from "react";
import { useForestStore } from "@/lib/store";
import { SUBJECTS, MISTAKE_CAUSES, UNDERSTANDING_LEVELS } from "@/lib/constants";
import { SubjectId, ReviewItem, UnderstandingLevel } from "@/lib/types";
import { AnimalAvatar } from "../village/AnimalAvatar";
import { getTodayDateString } from "@/lib/spaced-repetition";
import { soundManager } from "@/lib/sounds";
import confetti from "canvas-confetti";
import {
  Library,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Eye,
  EyeOff,
  ChevronRight,
  Filter,
  Layers,
  Award,
  Calendar,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

type ReviewMode =
  | "today"
  | "overdue"
  | "criminal_law"
  | "police_studies"
  | "constitution"
  | "repeated"
  | "all_mix"
  | "random";

export function SpacedReviewLibrary({ onNavigateToMistakes }: { onNavigateToMistakes?: () => void }) {
  const { reviewItems, recordReviewAttempt, awardXp } = useForestStore();
  const todayStr = getTodayDateString();

  // Mode & batch filters
  const [selectedMode, setSelectedMode] = useState<ReviewMode>("today");
  const [batchSize, setBatchSize] = useState<5 | 10 | 20>(5);

  // Active drill state
  const [isDrillActive, setIsDrillActive] = useState(false);
  const [drillItems, setDrillItems] = useState<ReviewItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userSelectedChoice, setUserSelectedChoice] = useState<string | null>(null);
  const [isSolutionRevealed, setIsSolutionRevealed] = useState(false);
  const [drillCompleted, setDrillCompleted] = useState(false);
  const [drillResults, setDrillResults] = useState<{
    correctCount: number;
    masteredCount: number;
  }>({ correctCount: 0, masteredCount: 0 });

  // Filter items according to mode
  const filteredItems = useMemo(() => {
    let list: ReviewItem[] = [];

    switch (selectedMode) {
      case "today":
        list = reviewItems.filter((r) => r.nextReviewDate === todayStr && !r.overcome);
        break;
      case "overdue":
        list = reviewItems.filter((r) => r.nextReviewDate < todayStr && !r.overcome);
        break;
      case "criminal_law":
        list = reviewItems.filter((r) => r.subjectId === "criminal_law");
        break;
      case "police_studies":
        list = reviewItems.filter((r) => r.subjectId === "police_studies");
        break;
      case "constitution":
        list = reviewItems.filter((r) => r.subjectId === "constitution");
        break;
      case "repeated":
        list = reviewItems.filter((r) => r.reviewCount >= 2 && !r.overcome);
        break;
      case "all_mix":
      case "random":
      default:
        list = [...reviewItems];
        break;
    }

    if (selectedMode === "random") {
      list = [...list].sort(() => Math.random() - 0.5);
    }

    return list.slice(0, batchSize);
  }, [reviewItems, selectedMode, batchSize, todayStr]);

  const currentItem = drillItems[currentIdx];

  const startDrill = () => {
    if (filteredItems.length === 0) return;
    setDrillItems([...filteredItems]);
    setIsDrillActive(true);
    setCurrentIdx(0);
    setUserSelectedChoice(null);
    setIsSolutionRevealed(false);
    setDrillCompleted(false);
    setDrillResults({ correctCount: 0, masteredCount: 0 });
    soundManager.playPop();
  };

  const handleRateUnderstanding = (understanding: UnderstandingLevel) => {
    if (!currentItem) return;

    const isCorrect = currentItem.correctAnswer
      ? userSelectedChoice === currentItem.correctAnswer
      : undefined;

    recordReviewAttempt(currentItem.id, understanding, isCorrect, 45);

    setDrillResults((prev) => ({
      correctCount: isCorrect ? prev.correctCount + 1 : prev.correctCount,
      masteredCount: understanding === "mastered" ? prev.masteredCount + 1 : prev.masteredCount,
    }));

    // Next item or complete drill
    if (currentIdx + 1 < drillItems.length) {
      setCurrentIdx((prev) => prev + 1);
      setUserSelectedChoice(null);
      setIsSolutionRevealed(false);
      soundManager.playChime();
    } else {
      setDrillCompleted(true);
      soundManager.playLevelUp();
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#F3B8CC", "#B9D5B0", "#D8C9ED"],
        });
      } catch {}
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-forest-border shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-forest-text">복습 도서관</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              에빙하우스 간격 반복
            </span>
          </div>
          <p className="text-xs text-forest-text-muted mt-0.5">
            전혀 모르겠음(1일) → 헷갈림(1일) → 맞혔지만 확신없음(3일) → 확실히 이해함(3/7/14/30일)
          </p>
        </div>

        {onNavigateToMistakes && (
          <button
            onClick={onNavigateToMistakes}
            className="px-3.5 py-2 rounded-2xl bg-forest-pink/30 hover:bg-forest-pink text-forest-pink-dark font-bold text-xs transition-all flex items-center gap-1.5 btn-bubbly self-start sm:self-auto"
          >
            <span>오답 보관소 바로가기</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Mode selection if NOT actively in drill */}
      {!isDrillActive && (
        <div className="space-y-6">
          {/* Mode Tabs */}
          <div className="bg-white rounded-3xl p-5 border border-forest-border shadow-soft space-y-4">
            <h2 className="text-sm font-bold text-forest-text flex items-center gap-2">
              <Filter className="w-4 h-4 text-forest-pink-dark" />
              <span>복습 모드 선택</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: "today", label: "오늘의 복습", desc: "오늘 예정된 문제" },
                { id: "overdue", label: "밀린 복습", desc: "이전 날짜 미완료" },
                { id: "repeated", label: "반복 오답 복습", desc: "2회 이상 틀린 문제" },
                { id: "all_mix", label: "세 과목 혼합", desc: "형사·경찰·헌법 혼합" },
                { id: "criminal_law", label: "형사법 집중", desc: "형법 및 형소법" },
                { id: "police_studies", label: "경찰학 집중", desc: "경찰행정·조문" },
                { id: "constitution", label: "헌법 집중", desc: "기본권·통치구조" },
                { id: "random", label: "무작위 훈련", desc: "랜덤 셔플 풀이" },
              ].map((m) => {
                const isSelected = selectedMode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedMode(m.id as any);
                      soundManager.playClick();
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all btn-bubbly ${
                      isSelected
                        ? "bg-forest-pink/20 border-forest-pink text-forest-pink-dark font-bold shadow-cute"
                        : "bg-forest-warm/30 border-forest-border hover:bg-forest-warm text-forest-text"
                    }`}
                  >
                    <div className="text-xs sm:text-sm">{m.label}</div>
                    <div className="text-[10px] text-forest-text-muted mt-0.5">{m.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Batch Size Selection */}
            <div className="pt-3 border-t border-forest-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-forest-text-muted">1회 복습 분량:</span>
                <span className="text-xs text-forest-text-muted">
                  (밀린 문제가 많아도 부담 없이 쪼개어 풀기)
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {[5, 10, 20].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => {
                      setBatchSize(sz as any);
                      soundManager.playClick();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      batchSize === sz
                        ? "bg-forest-pink-dark text-white shadow-sm"
                        : "bg-forest-warm text-forest-text-muted hover:bg-white border border-forest-border"
                    }`}
                  >
                    {sz}문제 단위
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Drill Preview & Launch Card */}
          <div className="bg-gradient-to-br from-forest-cream/60 via-white to-forest-pink/20 rounded-3xl p-6 border border-forest-border shadow-soft text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-forest-pink text-white flex items-center justify-center text-2xl mx-auto shadow-cute animate-float">
              📖
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-forest-text">
                선택된 복습: 총 {filteredItems.length}문제 대기 중
              </h3>
              <p className="text-xs text-forest-text-muted max-w-md mx-auto">
                한 번에 문제 하나씩 집중하여 풀고, 정답 확인 후 4단계 이해도를 체크하면 다음 최적의
                복습 날짜가 자동으로 계산됩니다.
              </p>
            </div>

            {filteredItems.length > 0 ? (
              <button
                onClick={startDrill}
                className="px-8 py-3.5 rounded-2xl bg-forest-pink-dark text-white font-black text-sm hover:opacity-90 shadow-cute transition-all btn-bubbly inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>복습 시작하기 ({filteredItems.length}문항)</span>
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-white/80 border border-forest-border inline-block text-xs text-forest-text-muted">
                현재 선택된 조건에 해당하는 복습 문제가 없습니다. 다른 모드를 선택해 보세요! 🌱
              </div>
            )}
          </div>
        </div>
      )}

      {/* ACTIVE DRILL VIEW: 1 Question at a time */}
      {isDrillActive && currentItem && !drillCompleted && (
        <div className="bg-white rounded-3xl border border-forest-border p-5 sm:p-7 shadow-soft space-y-6 animate-in zoom-in-95 duration-150">
          {/* Top Progress & Exit */}
          <div className="flex items-center justify-between pb-3 border-b border-forest-border">
            <div className="flex items-center gap-2">
              <AnimalAvatar subjectId={currentItem.subjectId} size="sm" />
              <div>
                <span className="font-bold text-xs text-forest-text">
                  {SUBJECTS[currentItem.subjectId].nameKr}
                </span>
                <span className="text-[11px] text-forest-text-muted ml-2">
                  {currentItem.topic}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-forest-pink-dark">
                {currentIdx + 1} / {drillItems.length} 문항
              </span>
              <button
                onClick={() => setIsDrillActive(false)}
                className="px-2.5 py-1 rounded-xl text-xs text-forest-text-muted hover:bg-forest-warm"
              >
                나가기
              </button>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-forest-warm/30 rounded-2xl p-5 border border-forest-border space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-forest-text-muted">
                {currentItem.textbookName} · <strong>{currentItem.problemNumber}</strong>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-forest-pink/20 text-forest-pink-dark font-bold text-[10px]">
                복습 {currentItem.reviewCount}회차 (단계 {currentItem.reviewStage})
              </span>
            </div>

            {/* Problem Image if uploaded */}
            {currentItem.problemImageUrl && (
              <div className="rounded-xl overflow-hidden border border-forest-border max-h-72 flex justify-center bg-white">
                <img
                  src={currentItem.problemImageUrl}
                  alt="문제 이미지"
                  className="object-contain max-h-72 w-full"
                />
              </div>
            )}

            {/* Question Note / Text */}
            {currentItem.memo && (
              <div className="text-xs text-forest-text font-medium leading-relaxed bg-white/80 p-3.5 rounded-xl border border-forest-border/60">
                {currentItem.memo}
              </div>
            )}

            {/* 4-Choice Option Selector (Optional) */}
            <div>
              <div className="text-[11px] font-bold text-forest-text-muted mb-2">
                답안 선택 (선택 사항)
              </div>
              <div className="grid grid-cols-4 gap-2">
                {["1", "2", "3", "4"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setUserSelectedChoice(opt);
                      soundManager.playPop();
                    }}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      userSelectedChoice === opt
                        ? "bg-forest-pink text-white border-forest-pink-dark shadow-sm"
                        : "bg-white border-forest-border text-forest-text hover:bg-forest-warm"
                    }`}
                  >
                    {opt === "1" ? "①" : opt === "2" ? "②" : opt === "3" ? "③" : "④"} 번
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reveal Solution Button */}
          {!isSolutionRevealed ? (
            <button
              onClick={() => {
                setIsSolutionRevealed(true);
                soundManager.playClick();
              }}
              className="w-full py-3 rounded-2xl bg-forest-warm border border-forest-border hover:bg-white text-forest-text font-bold text-xs flex items-center justify-center gap-2 btn-bubbly"
            >
              <Eye className="w-4 h-4 text-forest-pink-dark" />
              <span>정답 및 해설 확인하기</span>
            </button>
          ) : (
            /* Solution & Explanation Area */
            <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-200 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-800">정답:</span>
                  <span className="text-base font-black text-emerald-700">
                    {currentItem.correctAnswer
                      ? `${currentItem.correctAnswer}번`
                      : "자기 평가형 문제"}
                  </span>
                </div>

                {currentItem.correctAnswer && userSelectedChoice && (
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      userSelectedChoice === currentItem.correctAnswer
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {userSelectedChoice === currentItem.correctAnswer ? "정답! 👏" : "오답"}
                  </span>
                )}
              </div>

              {/* Solution image if present */}
              {currentItem.solutionImageUrl && (
                <div className="rounded-xl overflow-hidden border border-emerald-200 max-h-60 flex justify-center bg-white">
                  <img
                    src={currentItem.solutionImageUrl}
                    alt="해설 이미지"
                    className="object-contain max-h-60 w-full"
                  />
                </div>
              )}

              {/* Past Cause Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentItem.causeTags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-forest-border text-forest-text font-semibold flex items-center gap-1"
                  >
                    <span>{MISTAKE_CAUSES[tag]?.icon}</span>
                    <span>{MISTAKE_CAUSES[tag]?.label}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Understanding Assessment (Spaced Repetition Trigger) */}
          <div className="pt-2 border-t border-forest-border space-y-2">
            <div className="text-xs font-bold text-forest-text-muted flex items-center justify-between">
              <span>내 기억 상태 평가 (선택 시 다음 복습 날짜 자동 계산):</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(["none", "confused", "unsure", "mastered"] as UnderstandingLevel[]).map((level) => {
                const info = UNDERSTANDING_LEVELS[level];
                return (
                  <button
                    key={level}
                    onClick={() => handleRateUnderstanding(level)}
                    className={`p-3 rounded-2xl border text-center transition-all btn-bubbly ${info.color}`}
                  >
                    <div className="text-lg">{info.icon}</div>
                    <div className="text-xs font-bold mt-0.5">{info.label}</div>
                    <div className="text-[10px] opacity-80 mt-0.5">{info.nextDays}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* DRILL COMPLETED SUMMARY */}
      {isDrillActive && drillCompleted && (
        <div className="bg-white rounded-3xl border border-forest-border p-8 shadow-soft text-center space-y-5 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-cute">
            🎉
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-forest-text">복습 세션 완료!</h2>
            <p className="text-xs text-forest-text-muted">
              총 {drillItems.length}문제를 성실히 복습했습니다. 기억의 주기가 최적화되었어요!
            </p>
          </div>

          <div className="flex justify-center gap-6 py-2">
            <div className="text-center">
              <div className="text-2xl font-black text-forest-pink-dark">
                {drillItems.length * 2} XP
              </div>
              <div className="text-xs text-forest-text-muted">획득 경험치</div>
            </div>
            <div className="text-center border-l border-forest-border pl-6">
              <div className="text-2xl font-black text-emerald-600">
                {drillResults.masteredCount}문제
              </div>
              <div className="text-xs text-forest-text-muted">확실히 이해함 판정</div>
            </div>
          </div>

          <button
            onClick={() => setIsDrillActive(false)}
            className="px-6 py-2.5 rounded-2xl bg-forest-pink text-forest-text font-bold text-xs hover:bg-forest-pink-dark hover:text-white transition-all shadow-soft btn-bubbly"
          >
            복습 도서관 메인으로 돌아가기
          </button>
        </div>
      )}
    </div>
  );
}
