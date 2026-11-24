"use client";

import React, { useState } from "react";
import { useForestStore } from "@/lib/store";
import { SUBJECTS } from "@/lib/constants";
import { SubjectId } from "@/lib/types";
import { calculateDDay, getTodayDateString } from "@/lib/spaced-repetition";
import { AnimalAvatar } from "../village/AnimalAvatar";
import { BuildingIllustration } from "../village/BuildingIllustration";
import {
  Sparkles,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Play,
  Camera,
  RotateCcw,
  PenTool,
  PartyPopper,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import confetti from "canvas-confetti";

export function VillageDashboard({
  onNavigate,
  onOpenQuickMistakeModal,
}: {
  onNavigate: (tab: string) => void;
  onOpenQuickMistakeModal: () => void;
}) {
  const {
    settings,
    todayPlan,
    sessions,
    reviewItems,
    village,
    aiMessages,
    toggleSubjectComplete,
    awardXp,
  } = useForestStore();

  const [finishedDay, setFinishedDay] = useState(false);
  const dday = calculateDDay(settings.examDate);
  const todayStr = getTodayDateString();

  // Date formatting in Korean
  const dateObj = new Date();
  const daysOfWeek = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  const formattedToday = `${dateObj.getFullYear()}년 ${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일 ${
    daysOfWeek[dateObj.getDay()]
  }`;

  // Reviews due & overdue
  const dueReviews = reviewItems.filter((r) => r.nextReviewDate === todayStr && !r.overcome);
  const overdueReviews = reviewItems.filter((r) => r.nextReviewDate < todayStr && !r.overcome);

  // Today study actual minutes from sessions or plans
  const totalActualMinutes = Object.values(todayPlan.subjects).reduce(
    (acc, curr) => acc + (curr.actualMinutes || 0),
    0
  );

  const targetMinutes =
    todayPlan.targetTier === "minimum"
      ? settings.busyDayMinMinutes
      : todayPlan.totalTargetMinutes;

  const studyProgress = Math.min(100, Math.round((totalActualMinutes / targetMinutes) * 100));

  // Weekly study progress calculation (last 7 days sessions)
  const completedSubjectsCount = Object.values(todayPlan.subjects).filter((s) => s.completed).length;

  // Handle Day Finish celebration
  const handleDayFinish = () => {
    setFinishedDay(true);
    awardXp("day_finish", `day_finish_${todayStr}`);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#F3B8CC", "#B9D5B0", "#D8C9ED", "#FFD166"],
      });
    } catch {}
  };

  const latestWendyTip = aiMessages.length > 0 ? aiMessages[0] : null;

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & D-Day Greeting */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest-pink/30 via-forest-cream/50 to-forest-green/20 border border-forest-border p-5 sm:p-7 shadow-soft">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs sm:text-sm font-semibold px-3 py-1 rounded-full bg-white/90 text-forest-text-muted border border-forest-border flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-forest-pink-dark" />
                {formattedToday}
              </span>
              <span className="text-xs sm:text-sm font-bold px-3 py-1 rounded-full bg-forest-pink-dark text-white shadow-cute">
                시험까지 {dday.text}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-forest-text tracking-tight">
              {settings.userName} 님의 평화로운 {settings.villageName} 🌸
            </h1>
            <p className="text-xs sm:text-sm text-forest-text-muted leading-relaxed max-w-xl">
              오늘도 조급해하지 말고 형사법, 경찰학, 헌법을 세 과목 균형 있게! 훑어보기에서 아웃풋까지
              마을 친구들과 함께 성장해 볼까요?
            </p>
          </div>

          {/* Quick Village Stats Card */}
          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm border border-forest-border p-3.5 rounded-2xl shadow-soft shrink-0">
            <div className="flex -space-x-3">
              <AnimalAvatar subjectId="criminal_law" size="md" mood="reading" />
              <AnimalAvatar subjectId="police_studies" size="md" mood="happy" />
              <AnimalAvatar subjectId="constitution" size="md" mood="cheering" />
            </div>
            <div className="border-l border-forest-border pl-3">
              <div className="text-[11px] font-bold text-forest-text-muted">마을 주민 만족도</div>
              <div className="text-base font-black text-forest-pink-dark flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Lv.{village.level} 평화로움
              </div>
              <div className="text-[10px] text-forest-text-muted">
                완료된 과목 {completedSubjectsCount}/3개
              </div>
            </div>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none translate-x-8 translate-y-8">
          <BuildingIllustration buildingId="cherry_tree" className="w-48 h-48" />
        </div>
      </div>

      {/* 2. Quick Action Buttons (최대 2번 클릭으로 주요 학습 시작) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <button
          onClick={() => onNavigate("study")}
          className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white border border-forest-pink/40 hover:border-forest-pink shadow-soft hover:shadow-cute transition-all text-center group btn-bubbly"
        >
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-rose-500 text-rose-500" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-forest-text">공부 시작</span>
          <span className="text-[10px] text-forest-text-muted">4단계 학습 타이머</span>
        </button>

        <button
          onClick={onOpenQuickMistakeModal}
          className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white border border-amber-200 hover:border-amber-400 shadow-soft hover:shadow-cute transition-all text-center group btn-bubbly"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <Camera className="w-5 h-5 text-amber-600" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-forest-text">오답 사진 등록</span>
          <span className="text-[10px] text-forest-text-muted">10초 초간편 저장</span>
        </button>

        <button
          onClick={() => onNavigate("review")}
          className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white border border-sky-200 hover:border-sky-400 shadow-soft hover:shadow-cute transition-all text-center group btn-bubbly relative"
        >
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <RotateCcw className="w-5 h-5 text-sky-600" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-forest-text">오늘의 복습</span>
          <span className="text-[10px] text-forest-text-muted">
            {dueReviews.length + overdueReviews.length > 0 ? (
              <strong className="text-amber-600 font-bold">
                {dueReviews.length + overdueReviews.length}문제 대기 중
              </strong>
            ) : (
              "밀린 복습 없음"
            )}
          </span>
        </button>

        <button
          onClick={() => onNavigate("notes")}
          className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white border border-purple-200 hover:border-purple-400 shadow-soft hover:shadow-cute transition-all text-center group btn-bubbly"
        >
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <PenTool className="w-5 h-5 text-purple-600" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-forest-text">손필기 노트</span>
          <span className="text-[10px] text-forest-text-muted">백지 복습 캔버스</span>
        </button>

        <button
          onClick={handleDayFinish}
          disabled={finishedDay}
          className={`col-span-2 sm:col-span-1 flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border transition-all text-center group btn-bubbly ${
            finishedDay
              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
              : "bg-gradient-to-b from-forest-pink/20 to-forest-pink/40 border-forest-pink/60 hover:border-forest-pink shadow-soft hover:shadow-cute"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform ${
              finishedDay ? "bg-emerald-100 text-emerald-600" : "bg-forest-pink text-white"
            }`}
          >
            <PartyPopper className="w-5 h-5" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-forest-text">
            {finishedDay ? "하루 마무리 완료! 🎉" : "하루 마무리"}
          </span>
          <span className="text-[10px] text-forest-text-muted">+10 XP 피드백 정산</span>
        </button>
      </div>

      {/* 3. Wendy ssam AI Learning Coach Quick Card */}
      {latestWendyTip && (
        <div className="bg-white rounded-3xl border border-forest-border p-4 sm:p-5 shadow-soft flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-forest-pink to-forest-lavender flex items-center justify-center text-2xl shadow-sm shrink-0">
            🦉
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-forest-pink/20 text-forest-pink-dark">
                웬디쌤의 오늘의 학습 코칭
              </span>
              <button
                onClick={() => onNavigate("wendy")}
                className="text-xs text-forest-pink-dark font-bold hover:underline flex items-center gap-0.5"
              >
                자세히 보기 <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <h4 className="text-sm font-bold text-forest-text mb-1">{latestWendyTip.title}</h4>
            <p className="text-xs text-forest-text-muted leading-relaxed line-clamp-2">
              {latestWendyTip.content}
            </p>
          </div>
        </div>
      )}

      {/* 4. Subject Cards: 형사법, 경찰학, 헌법 (세 과목 매일 균형 학습) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-forest-text flex items-center gap-2">
            <span>오늘의 세 과목 정원</span>
            <span className="text-xs font-normal text-forest-text-muted">
              (매일 세 과목 모두 골고루 공부하기)
            </span>
          </h2>
          <button
            onClick={() => onNavigate("planner")}
            className="text-xs font-bold text-forest-pink-dark hover:underline flex items-center gap-0.5"
          >
            플래너에서 조정 <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["criminal_law", "police_studies", "constitution"] as SubjectId[]).map((subId) => {
            const subject = SUBJECTS[subId];
            const plan = todayPlan.subjects[subId];
            const isDone = plan.completed;

            return (
              <div
                key={subId}
                className={`relative rounded-3xl p-5 border transition-all shadow-soft flex flex-col justify-between ${
                  isDone
                    ? "bg-[#FAFDF9] border-emerald-300 shadow-md"
                    : "bg-white border-forest-border hover:border-forest-pink/60 hover:shadow-cute"
                }`}
              >
                <div>
                  {/* Top Bar with Animal & Subject Title */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <AnimalAvatar subjectId={subId} size="md" mood={isDone ? "proud" : "reading"} />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-base text-forest-text">
                            {subject.nameKr}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-forest-cream font-bold text-forest-text-muted">
                            {subject.questionCount}문항
                          </span>
                        </div>
                        <div className="text-[11px] text-forest-text-muted">
                          {subject.buildingName} · {subject.characterName}
                        </div>
                      </div>
                    </div>

                    {/* Completion Checkbox Button */}
                    <button
                      onClick={() => toggleSubjectComplete(subId)}
                      className={`p-2 rounded-2xl transition-all btn-bubbly ${
                        isDone
                          ? "bg-emerald-500 text-white shadow-cute"
                          : "bg-forest-border/60 hover:bg-forest-pink/30 text-forest-text-muted"
                      }`}
                      title={isDone ? "완료 취소" : "공부 완료 체크 (+10 XP)"}
                    >
                      <CheckCircle2 className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Study Scope & Targets */}
                  <div className="space-y-1.5 my-3 bg-forest-warm/40 rounded-2xl p-3 border border-forest-border/50 text-xs">
                    <div className="font-semibold text-forest-text line-clamp-2">
                      📍 {plan.scope || "오늘 학습 범위 미설정"}
                    </div>
                    {plan.problemRange && (
                      <div className="text-forest-text-muted text-[11px]">
                        📝 {plan.problemRange}
                      </div>
                    )}
                    {plan.reviewScope && (
                      <div className="text-forest-text-muted text-[11px]">
                        🔄 {plan.reviewScope}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer: Time & Action */}
                <div className="pt-2 border-t border-forest-border/50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-forest-text-muted">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {plan.actualMinutes}분 / {plan.estimatedMinutes}분
                    </span>
                  </div>

                  <button
                    onClick={() => onNavigate("study")}
                    className="text-xs font-bold text-forest-pink-dark hover:underline flex items-center gap-0.5"
                  >
                    학습 시작 <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Summary Stats: Today's Time + Spaced Review Status + Weekly Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Daily Time Tracker Card */}
        <div className="bg-white rounded-3xl border border-forest-border p-5 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-forest-text-muted">오늘의 공부 시간</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-forest-pink/20 text-forest-pink-dark">
              {todayPlan.targetTier === "minimum" ? "바쁜 날 (60분)" : "기본 목표 (180분)"}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-black text-forest-text">{totalActualMinutes}</span>
            <span className="text-sm font-semibold text-forest-text-muted">
              / {targetMinutes}분 달성
            </span>
          </div>

          <div className="w-full bg-forest-border rounded-full h-3 overflow-hidden mb-2">
            <div
              className="bg-gradient-to-r from-forest-pink to-forest-pink-dark h-full rounded-full transition-all duration-500"
              style={{ width: `${studyProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-forest-text-muted">
            <span>달성률 {studyProgress}%</span>
            <span>
              {totalActualMinutes >= targetMinutes
                ? "오늘 목표 초과 달성! 멋져요 👏"
                : `${targetMinutes - totalActualMinutes}분 남음`}
            </span>
          </div>
        </div>

        {/* Spaced Review Library Status */}
        <div className="bg-white rounded-3xl border border-forest-border p-5 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-forest-text-muted">복습 도서관 현황</span>
            <button
              onClick={() => onNavigate("review")}
              className="text-xs font-bold text-forest-pink-dark hover:underline"
            >
              전체 보기
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200">
              <div className="text-[11px] text-amber-700 font-semibold">오늘 예정 복습</div>
              <div className="text-2xl font-black text-amber-900 mt-0.5">
                {dueReviews.length}
                <span className="text-xs font-normal ml-0.5">문항</span>
              </div>
            </div>

            <div className="bg-rose-50 rounded-2xl p-3 border border-rose-200">
              <div className="text-[11px] text-rose-700 font-semibold">밀린 복습</div>
              <div className="text-2xl font-black text-rose-900 mt-0.5">
                {overdueReviews.length}
                <span className="text-xs font-normal ml-0.5">문항</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-forest-text-muted leading-relaxed">
            {dueReviews.length + overdueReviews.length > 0
              ? "밀려도 괜찮아요! 5문제씩 가볍게 시작할 수 있도록 묶어둘게요."
              : "훌륭해요! 밀린 복습 없이 완벽하게 복습을 끝마쳤습니다."}
          </p>
        </div>

        {/* Village & Building Growth Status */}
        <div className="bg-white rounded-3xl border border-forest-border p-5 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-forest-text-muted">마을 성장 센터</span>
              <button
                onClick={() => onNavigate("decor")}
                className="text-xs font-bold text-forest-pink-dark hover:underline"
              >
                꾸미기 가기
              </button>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 rounded-2xl bg-forest-cream border border-forest-border flex items-center justify-center text-2xl">
                🏡
              </div>
              <div>
                <div className="text-sm font-black text-forest-text">
                  Lv.{village.level} {settings.villageName}
                </div>
                <div className="text-xs text-forest-pink-dark font-bold">
                  누적 {village.totalXp} XP 획득
                </div>
                <div className="text-[10px] text-forest-text-muted">
                  쉬어가도 마을과 캐릭터는 퇴화하지 않아요 🌱
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-forest-border/50 flex justify-between text-xs text-forest-text-muted">
            <span>도서관 Lv.{village.buildings.criminal_law.level}</span>
            <span>경찰서 Lv.{village.buildings.police_studies.level}</span>
            <span>법원 Lv.{village.buildings.constitution.level}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
