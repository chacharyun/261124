"use client";

import React, { useState } from "react";
import { useForestStore } from "@/lib/store";
import { SUBJECTS, MISTAKE_CAUSES } from "@/lib/constants";
import { SubjectId, MistakeCause } from "@/lib/types";
import { AnimalAvatar } from "../village/AnimalAvatar";
import {
  BarChart3,
  Clock,
  TrendingUp,
  Award,
  AlertCircle,
  PieChart,
  CheckCircle2,
  Calendar,
  Layers,
} from "lucide-react";

export function GrowthAnalytics() {
  const { sessions, reviewItems, reviewAttempts, todayPlan } = useForestStore();

  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">("weekly");

  // Total study time by subject from sessions
  const subjectStudyMinutes: Record<SubjectId, number> = {
    criminal_law: 0,
    police_studies: 0,
    constitution: 0,
  };

  let totalSkimMinutes = 0;
  let totalInputMinutes = 0;
  let totalOutputMinutes = 0;
  let totalFeedbackMinutes = 0;

  sessions.forEach((s) => {
    if (subjectStudyMinutes[s.subjectId] !== undefined) {
      subjectStudyMinutes[s.subjectId] += s.durationMinutes;
    }
    totalSkimMinutes += s.phases?.skimMinutes || 0;
    totalInputMinutes += s.phases?.inputMinutes || 0;
    totalOutputMinutes += s.phases?.outputMinutes || 0;
    totalFeedbackMinutes += s.phases?.feedbackMinutes || 0;
  });

  const totalAllMinutes =
    subjectStudyMinutes.criminal_law +
    subjectStudyMinutes.police_studies +
    subjectStudyMinutes.constitution;

  // Input vs Output ratio
  const totalPhaseMinutes =
    totalSkimMinutes + totalInputMinutes + totalOutputMinutes + totalFeedbackMinutes;
  const inputRatio =
    totalPhaseMinutes > 0 ? Math.round((totalInputMinutes / totalPhaseMinutes) * 100) : 25;
  const outputRatio =
    totalPhaseMinutes > 0 ? Math.round((totalOutputMinutes / totalPhaseMinutes) * 100) : 50;

  // Accuracy calculation from sessions
  const totalQuestionsAttempted = sessions.reduce((acc, s) => acc + (s.attemptedQuestions || 0), 0);
  const totalQuestionsCorrect = sessions.reduce((acc, s) => acc + (s.correctQuestions || 0), 0);
  const overallAccuracy =
    totalQuestionsAttempted > 0
      ? Math.round((totalQuestionsCorrect / totalQuestionsAttempted) * 100)
      : null;

  // Review accuracy from review attempts
  const gradedAttempts = reviewAttempts.filter((a) => a.isCorrect !== undefined);
  const reviewCorrect = gradedAttempts.filter((a) => a.isCorrect === true).length;
  const reviewAccuracy =
    gradedAttempts.length > 0 ? Math.round((reviewCorrect / gradedAttempts.length) * 100) : null;

  // Mistake cause counts
  const causeCounts: Record<MistakeCause, number> = {
    concept_lack: 0,
    memorization_lack: 0,
    case_confusion: 0,
    provision_confusion: 0,
    option_confusion: 0,
    interpretation_error: 0,
    careless_mistake: 0,
    time_shortage: 0,
  };

  reviewItems.forEach((r) => {
    r.causeTags.forEach((t) => {
      if (causeCounts[t] !== undefined) causeCounts[t]++;
    });
  });

  const sortedCauses = (Object.keys(causeCounts) as MistakeCause[])
    .filter((k) => causeCounts[k] > 0)
    .sort((a, b) => causeCounts[b] - causeCounts[a]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-forest-border shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-forest-text">성장 기록 & 통계</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-forest-pink/30 text-forest-pink-dark">
              순수 데이터 기반 분석
            </span>
          </div>
          <p className="text-xs text-forest-text-muted mt-0.5">
            임의의 가짜 통계 없이, 실제 공부 및 복습 기록만을 정직하게 분석합니다.
          </p>
        </div>

        {/* Time Filter */}
        <div className="flex items-center gap-1 bg-forest-warm p-1 rounded-2xl border border-forest-border text-xs self-start sm:self-auto">
          {(["daily", "weekly", "monthly"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeRange(t)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                timeRange === t
                  ? "bg-white text-forest-pink-dark shadow-sm"
                  : "text-forest-text-muted hover:text-forest-text"
              }`}
            >
              {t === "daily" ? "일간" : t === "weekly" ? "주간" : "월간"}
            </button>
          ))}
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Total Time */}
        <div className="bg-white rounded-3xl p-5 border border-forest-border shadow-soft">
          <div className="text-xs font-bold text-forest-text-muted">총 누적 공부 시간</div>
          <div className="text-2xl font-black text-forest-text mt-1">
            {Math.floor(totalAllMinutes / 60)}시간 {totalAllMinutes % 60}분
          </div>
          <div className="text-[10px] text-forest-text-muted mt-1">
            기록된 세션 {sessions.length}회 누적
          </div>
        </div>

        {/* Output vs Input Ratio */}
        <div className="bg-white rounded-3xl p-5 border border-forest-border shadow-soft">
          <div className="text-xs font-bold text-forest-text-muted">인풋 vs 아웃풋 비율</div>
          <div className="text-2xl font-black text-forest-pink-dark mt-1">
            {outputRatio}%
            <span className="text-xs font-normal text-forest-text-muted ml-1">
              (인풋 {inputRatio}%)
            </span>
          </div>
          <div className="text-[10px] text-forest-text-muted mt-1">
            {outputRatio >= 50 ? "권장 아웃풋(50%+) 달성 중 👏" : "아웃풋 비중을 늘려보세요"}
          </div>
        </div>

        {/* First Try Accuracy */}
        <div className="bg-white rounded-3xl p-5 border border-forest-border shadow-soft">
          <div className="text-xs font-bold text-forest-text-muted">기출 1회독 정답률</div>
          <div className="text-2xl font-black text-forest-text mt-1">
            {overallAccuracy !== null ? `${overallAccuracy}%` : "—"}
          </div>
          <div className="text-[10px] text-forest-text-muted mt-1">
            {totalQuestionsAttempted > 0
              ? `총 ${totalQuestionsAttempted}문항 풀이`
              : "기록이 쌓이면 분석이 시작돼요"}
          </div>
        </div>

        {/* Review Accuracy */}
        <div className="bg-white rounded-3xl p-5 border border-forest-border shadow-soft">
          <div className="text-xs font-bold text-forest-text-muted">복습 간격 재풀이 정답률</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {reviewAccuracy !== null ? `${reviewAccuracy}%` : "—"}
          </div>
          <div className="text-[10px] text-forest-text-muted mt-1">
            {gradedAttempts.length > 0
              ? `${gradedAttempts.length}회 복습 채점 완료`
              : "자기 평가형 및 복습 진행 중"}
          </div>
        </div>
      </div>

      {/* Subject Time Breakdown & Input/Output Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Subject Breakdown */}
        <div className="bg-white rounded-3xl p-5 border border-forest-border shadow-soft space-y-4">
          <h3 className="text-sm font-bold text-forest-text flex items-center gap-2">
            <PieChart className="w-4 h-4 text-forest-pink-dark" />
            <span>과목별 공부 시간 분배 (균형 학습 점검)</span>
          </h3>

          {totalAllMinutes > 0 ? (
            <div className="space-y-3 text-xs">
              {(["criminal_law", "police_studies", "constitution"] as SubjectId[]).map((sid) => {
                const sub = SUBJECTS[sid];
                const mins = subjectStudyMinutes[sid];
                const pct = totalAllMinutes > 0 ? Math.round((mins / totalAllMinutes) * 100) : 0;

                return (
                  <div key={sid} className="space-y-1">
                    <div className="flex justify-between font-semibold">
                      <div className="flex items-center gap-2">
                        <AnimalAvatar subjectId={sid} size="sm" />
                        <span>{sub.nameKr}</span>
                      </div>
                      <span className="text-forest-text-muted">
                        {mins}분 ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-forest-border rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor:
                            sid === "criminal_law"
                              ? "#F3B8CC"
                              : sid === "police_studies"
                              ? "#B9D5B0"
                              : "#D8C9ED",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-forest-text-muted bg-forest-warm/30 rounded-2xl">
              아직 기록된 공부 세션이 부족합니다. '오늘의 공부'를 진행해 보세요! 🌱
            </div>
          )}
        </div>

        {/* 4-Phase Ratio Breakdown */}
        <div className="bg-white rounded-3xl p-5 border border-forest-border shadow-soft space-y-4">
          <h3 className="text-sm font-bold text-forest-text flex items-center gap-2">
            <Layers className="w-4 h-4 text-forest-pink-dark" />
            <span>4단계 학습 단계별 시간 분포</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-forest-warm/40 border border-forest-border">
              <div className="text-forest-text-muted text-[11px]">1단계: 훑어보기</div>
              <div className="text-lg font-black text-forest-text mt-0.5">{totalSkimMinutes}분</div>
              <div className="text-[10px] text-forest-text-muted">목차 및 기억 인출</div>
            </div>

            <div className="p-3 rounded-2xl bg-forest-warm/40 border border-forest-border">
              <div className="text-forest-text-muted text-[11px]">2단계: 인풋</div>
              <div className="text-lg font-black text-forest-text mt-0.5">{totalInputMinutes}분</div>
              <div className="text-[10px] text-forest-text-muted">강의 및 기본서 판례</div>
            </div>

            <div className="p-3 rounded-2xl bg-forest-pink/20 border border-forest-pink/40">
              <div className="text-forest-pink-dark font-bold text-[11px]">3단계: 아웃풋 (핵심)</div>
              <div className="text-lg font-black text-forest-pink-dark mt-0.5">
                {totalOutputMinutes}분
              </div>
              <div className="text-[10px] text-forest-pink-dark/80">기출/OX/백지 복습</div>
            </div>

            <div className="p-3 rounded-2xl bg-forest-warm/40 border border-forest-border">
              <div className="text-forest-text-muted text-[11px]">4단계: 피드백</div>
              <div className="text-lg font-black text-forest-text mt-0.5">
                {totalFeedbackMinutes}분
              </div>
              <div className="text-[10px] text-forest-text-muted">정답률 정산 & 복습 일정</div>
            </div>
          </div>
        </div>
      </div>

      {/* Vulnerable Mistakes Analysis (TOP 오답 원인 분석) */}
      <div className="bg-white rounded-3xl p-5 border border-forest-border shadow-soft space-y-4">
        <h3 className="text-sm font-bold text-forest-text flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500" />
          <span>오답 원인 정밀 진단 (오답 보관소 태그 기반)</span>
        </h3>

        {sortedCauses.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {sortedCauses.map((cause) => {
              const info = MISTAKE_CAUSES[cause];
              const count = causeCounts[cause];
              return (
                <div
                  key={cause}
                  className="p-3 rounded-2xl bg-forest-warm/30 border border-forest-border space-y-1"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-forest-text">
                    <span>{info.icon}</span>
                    <span>{info.label}</span>
                  </div>
                  <div className="text-lg font-black text-forest-pink-dark">{count}건</div>
                  <div className="text-[10px] text-forest-text-muted leading-tight">{info.desc}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-forest-text-muted bg-forest-warm/30 rounded-2xl">
            등록된 오답 원인 태그 데이터가 아직 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
