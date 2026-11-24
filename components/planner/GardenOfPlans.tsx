"use client";

import React, { useState } from "react";
import { useForestStore } from "@/lib/store";
import { SUBJECTS } from "@/lib/constants";
import { SubjectId, FixedSchedule, SubjectPlan } from "@/lib/types";
import { calculateDDay, getTodayDateString } from "@/lib/spaced-repetition";
import { AnimalAvatar } from "../village/AnimalAvatar";
import {
  CalendarDays,
  Calendar,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Sliders,
  ChevronRight,
  BookOpen,
  ArrowRight,
} from "lucide-react";

export function GardenOfPlans({ onNavigateToStudy }: { onNavigateToStudy?: () => void }) {
  const {
    todayPlan,
    schedules,
    settings,
    updateTodayPlan,
    updateSubjectPlan,
    toggleSubjectComplete,
    addSchedule,
    deleteSchedule,
  } = useForestStore();

  const [activeSubTab, setActiveSubTab] = useState<"daily" | "weekly" | "monthly">("daily");

  // Fixed schedule form state
  const [newScheduleTitle, setNewScheduleTitle] = useState("");
  const [newScheduleDay, setNewScheduleDay] = useState(1);
  const [newScheduleStart, setNewScheduleStart] = useState("09:00");
  const [newScheduleEnd, setNewScheduleEnd] = useState("12:00");
  const [newScheduleCategory, setNewScheduleCategory] = useState<"school" | "part_time" | "volunteer" | "etc">("school");
  const [showAddSchedule, setShowAddSchedule] = useState(false);

  // Auto-adjustment modal/banner state
  const [showAdjustmentNotice, setShowAdjustmentNotice] = useState(false);

  const dday = calculateDDay(settings.examDate);
  const daysOfWeek = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

  // Weekly study hours calculation
  const dayAvailableHours = [0, 1, 2, 3, 4, 5, 6].map((day) => {
    const daySchs = schedules.filter((s) => s.dayOfWeek === day);
    // standard 16 waking hours minus schedule hours
    const busyHours = daySchs.reduce((acc, curr) => {
      const [sh, sm] = curr.startTime.split(":").map(Number);
      const [eh, em] = curr.endTime.split(":").map(Number);
      return acc + (eh + em / 60 - (sh + sm / 60));
    }, 0);
    return Math.max(1, Math.round((14 - busyHours) * 10) / 10);
  });

  const handleAddScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScheduleTitle.trim()) return;
    addSchedule({
      title: newScheduleTitle,
      dayOfWeek: newScheduleDay,
      startTime: newScheduleStart,
      endTime: newScheduleEnd,
      category: newScheduleCategory,
    });
    setNewScheduleTitle("");
    setShowAddSchedule(false);
  };

  const handleTargetTierChange = (tier: "minimum" | "standard" | "extended") => {
    let totalMinutes = 180;
    if (tier === "minimum") totalMinutes = 60;
    if (tier === "extended") totalMinutes = 240;

    // Distribute among 3 subjects
    const criminalMinutes = Math.round(totalMinutes * 0.38);
    const policeMinutes = Math.round(totalMinutes * 0.38);
    const constitutionMinutes = totalMinutes - criminalMinutes - policeMinutes;

    updateTodayPlan({
      targetTier: tier,
      totalTargetMinutes: totalMinutes,
      subjects: {
        criminal_law: {
          ...todayPlan.subjects.criminal_law,
          estimatedMinutes: criminalMinutes,
        },
        police_studies: {
          ...todayPlan.subjects.police_studies,
          estimatedMinutes: policeMinutes,
        },
        constitution: {
          ...todayPlan.subjects.constitution,
          estimatedMinutes: constitutionMinutes,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Planner Nav & Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-forest-border shadow-soft">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-forest-text flex items-center gap-2">
            <span>계획의 정원</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-forest-green/30 text-forest-green-dark font-bold">
              유기적 통합 플래너
            </span>
          </h1>
          <p className="text-xs text-forest-text-muted mt-0.5">
            월간 완강 목표 → 주간 고정 일정 배분 → 일간 세 과목 100% 균형 학습
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-forest-warm p-1 rounded-2xl border border-forest-border self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab("daily")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === "daily"
                ? "bg-white text-forest-pink-dark shadow-sm"
                : "text-forest-text-muted hover:text-forest-text"
            }`}
          >
            일간 계획 (오늘)
          </button>
          <button
            onClick={() => setActiveSubTab("weekly")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === "weekly"
                ? "bg-white text-forest-pink-dark shadow-sm"
                : "text-forest-text-muted hover:text-forest-text"
            }`}
          >
            주간 일정 배분
          </button>
          <button
            onClick={() => setActiveSubTab("monthly")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === "monthly"
                ? "bg-white text-forest-pink-dark shadow-sm"
                : "text-forest-text-muted hover:text-forest-text"
            }`}
          >
            월간 장기 로드맵
          </button>
        </div>
      </div>

      {/* 1. DAILY PLANNER TAB */}
      {activeSubTab === "daily" && (
        <div className="space-y-6">
          {/* Daily Goal Tier Selector (최소 60분 / 기본 180분 / 추가 목표) */}
          <div className="bg-white rounded-3xl p-5 border border-forest-border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-forest-text-muted uppercase">오늘의 목표 강도</div>
              <div className="text-base font-black text-forest-text mt-0.5">
                총 {todayPlan.totalTargetMinutes}분 공부 계획
              </div>
              <p className="text-xs text-forest-text-muted">
                학교/알바로 지친 날은 무리하지 말고 '최소 목표(60분)'를 선택하세요!
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleTargetTierChange("minimum")}
                className={`px-3 py-2.5 rounded-2xl border text-center transition-all ${
                  todayPlan.targetTier === "minimum"
                    ? "bg-amber-100 border-amber-300 text-amber-900 font-bold shadow-sm"
                    : "bg-forest-warm/50 border-forest-border text-forest-text-muted hover:bg-forest-warm"
                }`}
              >
                <div className="text-xs">바쁜 날 (최소)</div>
                <div className="text-sm font-black mt-0.5">60분</div>
              </button>

              <button
                onClick={() => handleTargetTierChange("standard")}
                className={`px-3 py-2.5 rounded-2xl border text-center transition-all ${
                  todayPlan.targetTier === "standard"
                    ? "bg-forest-pink/40 border-forest-pink-dark text-forest-pink-dark font-bold shadow-sm"
                    : "bg-forest-warm/50 border-forest-border text-forest-text-muted hover:bg-forest-warm"
                }`}
              >
                <div className="text-xs">기본 목표</div>
                <div className="text-sm font-black mt-0.5">180분</div>
              </button>

              <button
                onClick={() => handleTargetTierChange("extended")}
                className={`px-3 py-2.5 rounded-2xl border text-center transition-all ${
                  todayPlan.targetTier === "extended"
                    ? "bg-purple-100 border-purple-300 text-purple-900 font-bold shadow-sm"
                    : "bg-forest-warm/50 border-forest-border text-forest-text-muted hover:bg-forest-warm"
                }`}
              >
                <div className="text-xs">몰입 목표</div>
                <div className="text-sm font-black mt-0.5">240분+</div>
              </button>
            </div>
          </div>

          {/* Smart Plan Adjustment Notice (7일 이상 누적 지연 시 부드러운 조정 제안) */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-4 border border-amber-200/80 shadow-soft flex items-start gap-3">
            <div className="p-2 rounded-2xl bg-amber-100 text-amber-700 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1 text-xs text-amber-900">
              <div className="font-bold text-sm mb-0.5">
                합격의 숲 스마트 학습 완충 시스템 안내
              </div>
              <p className="leading-relaxed text-amber-800">
                하루 계획을 지키지 못했다고 전체 일정이 엉망이 되거나 자동 변경되지 않습니다. 미완료된
                학습은 내일 공부 가능 시간으로 안전하게 이월할 수 있으며, 7일 이상 반복적으로 지연될
                때만 사용자 확인을 거쳐 목표 분량을 현실적으로 조율해 드립니다.
              </p>
            </div>
          </div>

          {/* Three Subjects Daily Configuration Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-forest-text flex items-center gap-2">
                <span>과목별 세부 계획 (매일 세 과목 기본 탑재)</span>
              </h2>
              {onNavigateToStudy && (
                <button
                  onClick={onNavigateToStudy}
                  className="px-3 py-1.5 rounded-2xl bg-forest-pink text-forest-text font-bold text-xs hover:bg-forest-pink-dark hover:text-white transition-all flex items-center gap-1 shadow-soft btn-bubbly"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>오늘의 공부로 이동</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {(["criminal_law", "police_studies", "constitution"] as SubjectId[]).map((subId) => {
                const subject = SUBJECTS[subId];
                const plan = todayPlan.subjects[subId];

                return (
                  <div
                    key={subId}
                    className="bg-white rounded-3xl p-5 border border-forest-border shadow-soft space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      {/* Subject Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-forest-border">
                        <div className="flex items-center gap-2.5">
                          <AnimalAvatar subjectId={subId} size="md" />
                          <div>
                            <div className="font-black text-base text-forest-text">
                              {subject.nameKr}
                            </div>
                            <div className="text-[10px] text-forest-text-muted">
                              {subject.questionCount}문항 배점
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleSubjectComplete(subId)}
                          className={`p-2 rounded-2xl transition-all btn-bubbly ${
                            plan.completed
                              ? "bg-emerald-500 text-white"
                              : "bg-forest-warm text-forest-text-muted hover:bg-forest-pink/20"
                          }`}
                          title="학습 완료"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Configurable Form Fields */}
                      <div className="space-y-3 pt-3 text-xs">
                        {/* Scope */}
                        <div>
                          <label className="block text-[11px] font-bold text-forest-text-muted mb-1">
                            공부할 단원 및 범위
                          </label>
                          <input
                            type="text"
                            value={plan.scope}
                            onChange={(e) => updateSubjectPlan(subId, { scope: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-forest-warm/40 border border-forest-border text-forest-text font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-pink"
                            placeholder="예: 위법성조각사유 판례 정리"
                          />
                        </div>

                        {/* Lecture & Problem Range */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-bold text-forest-text-muted mb-1">
                              강의 번호
                            </label>
                            <input
                              type="text"
                              value={plan.lectureNumber || ""}
                              onChange={(e) =>
                                updateSubjectPlan(subId, { lectureNumber: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-xl bg-forest-warm/40 border border-forest-border text-forest-text font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-pink"
                              placeholder="기본 15강"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-forest-text-muted mb-1">
                              기출 번호 / 문항 수
                            </label>
                            <input
                              type="text"
                              value={plan.problemRange || ""}
                              onChange={(e) =>
                                updateSubjectPlan(subId, { problemRange: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-xl bg-forest-warm/40 border border-forest-border text-forest-text font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-pink"
                              placeholder="120번~145번 (25제)"
                            />
                          </div>
                        </div>

                        {/* Review Scope */}
                        <div>
                          <label className="block text-[11px] font-bold text-forest-text-muted mb-1">
                            복습 범위
                          </label>
                          <input
                            type="text"
                            value={plan.reviewScope || ""}
                            onChange={(e) =>
                              updateSubjectPlan(subId, { reviewScope: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-forest-warm/40 border border-forest-border text-forest-text font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-pink"
                            placeholder="어제 오답 4문항 복습"
                          />
                        </div>

                        {/* Time Allocation Slider */}
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[11px] font-bold text-forest-text-muted">
                              예상 소요 시간
                            </label>
                            <span className="font-bold text-forest-pink-dark">
                              {plan.estimatedMinutes}분
                            </span>
                          </div>
                          <input
                            type="range"
                            min="15"
                            max="180"
                            step="5"
                            value={plan.estimatedMinutes}
                            onChange={(e) =>
                              updateSubjectPlan(subId, {
                                estimatedMinutes: Number(e.target.value),
                              })
                            }
                            className="w-full accent-forest-pink"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Card Footer: Actual vs Estimated */}
                    <div className="pt-3 border-t border-forest-border/60 flex items-center justify-between text-xs text-forest-text-muted">
                      <span>실제 공부 시간:</span>
                      <strong className="text-forest-text font-black">
                        {plan.actualMinutes}분
                      </strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. WEEKLY PLANNER TAB (Fixed schedules & study hours) */}
      {activeSubTab === "weekly" && (
        <div className="space-y-6">
          {/* Weekday Capacity Overview */}
          <div className="bg-white rounded-3xl p-5 border border-forest-border shadow-soft">
            <h3 className="text-sm font-bold text-forest-text mb-3">
              요일별 가용 공부 시간 (고정 일정 제외 자동 계산)
            </h3>
            <div className="grid grid-cols-7 gap-2">
              {daysOfWeek.map((dayName, idx) => {
                const hours = dayAvailableHours[idx];
                const isToday = new Date().getDay() === idx;

                return (
                  <div
                    key={idx}
                    className={`rounded-2xl p-3 text-center border ${
                      isToday
                        ? "bg-forest-pink/20 border-forest-pink shadow-cute font-bold"
                        : "bg-forest-warm/40 border-forest-border"
                    }`}
                  >
                    <div className="text-xs text-forest-text-muted">{dayName.slice(0, 1)}</div>
                    <div className="text-base sm:text-lg font-black text-forest-text my-1">
                      {hours}h
                    </div>
                    <div className="text-[10px] text-forest-text-muted">공부 가능</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fixed Schedules Manager (학교, 알바, 봉사) */}
          <div className="bg-white rounded-3xl p-5 border border-forest-border shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-forest-text">
                  고정 일정 관리 (대학 강의, 파트타임, 외부활동)
                </h3>
                <p className="text-xs text-forest-text-muted">
                  고정 일정을 등록하면 바쁜 요일의 공부 시간을 현실적으로 배분해 줍니다.
                </p>
              </div>

              <button
                onClick={() => setShowAddSchedule(!showAddSchedule)}
                className="px-3 py-1.5 rounded-2xl bg-forest-pink text-forest-text font-bold text-xs hover:bg-forest-pink-dark hover:text-white transition-all flex items-center gap-1 shadow-soft btn-bubbly"
              >
                <Plus className="w-4 h-4" />
                <span>일정 추가</span>
              </button>
            </div>

            {/* Add Schedule Form */}
            {showAddSchedule && (
              <form
                onSubmit={handleAddScheduleSubmit}
                className="p-4 rounded-2xl bg-forest-warm/60 border border-forest-border space-y-3 animate-in fade-in duration-150"
              >
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-forest-text-muted mb-1">일정명</label>
                    <input
                      type="text"
                      required
                      value={newScheduleTitle}
                      onChange={(e) => setNewScheduleTitle(e.target.value)}
                      placeholder="예: 편의점 알바"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-forest-border focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-forest-text-muted mb-1">요일</label>
                    <select
                      value={newScheduleDay}
                      onChange={(e) => setNewScheduleDay(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-forest-border focus:outline-none"
                    >
                      {daysOfWeek.map((d, i) => (
                        <option key={i} value={i}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-forest-text-muted mb-1">시간</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="time"
                        value={newScheduleStart}
                        onChange={(e) => setNewScheduleStart(e.target.value)}
                        className="w-full px-2 py-2 rounded-xl bg-white border border-forest-border"
                      />
                      <span>~</span>
                      <input
                        type="time"
                        value={newScheduleEnd}
                        onChange={(e) => setNewScheduleEnd(e.target.value)}
                        className="w-full px-2 py-2 rounded-xl bg-white border border-forest-border"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-forest-text-muted mb-1">분류</label>
                    <select
                      value={newScheduleCategory}
                      onChange={(e) => setNewScheduleCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-forest-border focus:outline-none"
                    >
                      <option value="school">학교 대면 강의</option>
                      <option value="part_time">아르바이트</option>
                      <option value="volunteer">봉사활동</option>
                      <option value="etc">기타 일정</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddSchedule(false)}
                    className="px-3 py-1.5 rounded-xl text-xs text-forest-text-muted hover:bg-white"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-forest-pink-dark text-white font-bold text-xs"
                  >
                    저장하기
                  </button>
                </div>
              </form>
            )}

            {/* Existing Schedules List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {schedules.map((sch) => {
                const dayName = daysOfWeek[sch.dayOfWeek];
                const categoryBadge = {
                  school: { label: "대학교", color: "bg-blue-100 text-blue-700" },
                  part_time: { label: "아르바이트", color: "bg-amber-100 text-amber-700" },
                  volunteer: { label: "봉사활동", color: "bg-emerald-100 text-emerald-700" },
                  etc: { label: "기타", color: "bg-purple-100 text-purple-700" },
                }[sch.category];

                return (
                  <div
                    key={sch.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-forest-warm/30 border border-forest-border"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${categoryBadge.color}`}>
                          {categoryBadge.label}
                        </span>
                        <span className="font-bold text-xs text-forest-text">{sch.title}</span>
                      </div>
                      <div className="text-[11px] text-forest-text-muted mt-1">
                        매주 {dayName} {sch.startTime} ~ {sch.endTime}
                        {sch.memo && <span className="ml-2 italic text-forest-text/70">· {sch.memo}</span>}
                      </div>
                    </div>

                    <button
                      onClick={() => deleteSchedule(sch.id)}
                      className="p-1.5 rounded-xl hover:bg-rose-100 text-rose-500 transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. MONTHLY ROADMAP TAB (2027.03.20 D-Day, Lecture finish targets, past paper iterations) */}
      {activeSubTab === "monthly" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-forest-border shadow-soft">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-forest-pink/30 text-forest-pink-dark">
                  D-Day {dday.text}
                </span>
                <h3 className="text-xl font-black text-forest-text mt-2">
                  2027년 3월 20일 순경 1차 필기시험 로드맵
                </h3>
                <p className="text-xs text-forest-text-muted">
                  남은 시간 동안 3과목 완강 및 기출 5회독 완성 목표
                </p>
              </div>

              <div className="bg-forest-warm/60 p-4 rounded-2xl border border-forest-border text-center">
                <div className="text-xs text-forest-text-muted">월간 종합 달성률</div>
                <div className="text-2xl font-black text-forest-pink-dark mt-0.5">68%</div>
              </div>
            </div>

            {/* Subject Roadmap Progress */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(["criminal_law", "police_studies", "constitution"] as SubjectId[]).map((subId) => {
                const sub = SUBJECTS[subId];
                return (
                  <div key={subId} className="p-4 rounded-2xl bg-forest-warm/30 border border-forest-border space-y-3">
                    <div className="flex items-center gap-2">
                      <AnimalAvatar subjectId={subId} size="sm" />
                      <div>
                        <div className="font-bold text-sm text-forest-text">{sub.nameKr}</div>
                        <div className="text-[10px] text-forest-text-muted">{sub.questionCount}문항 배점</div>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <div className="flex justify-between text-[11px] text-forest-text-muted mb-1">
                          <span>기본 이론 완강률</span>
                          <span className="font-bold text-forest-text">75% (45/60강)</span>
                        </div>
                        <div className="w-full bg-forest-border rounded-full h-2">
                          <div className="bg-forest-pink h-full rounded-full" style={{ width: "75%" }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] text-forest-text-muted mb-1">
                          <span>기출 회독 진도</span>
                          <span className="font-bold text-forest-text">2회독 진행 중</span>
                        </div>
                        <div className="w-full bg-forest-border rounded-full h-2">
                          <div className="bg-forest-green h-full rounded-full" style={{ width: "40%" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
