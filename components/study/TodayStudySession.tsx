"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForestStore } from "@/lib/store";
import { SUBJECTS, POLICE_TOPICS } from "@/lib/constants";
import { SubjectId, StudySession, StudySessionPhase } from "@/lib/types";
import { AnimalAvatar } from "../village/AnimalAvatar";
import { getTodayDateString } from "@/lib/spaced-repetition";
import { soundManager } from "@/lib/sounds";
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  HelpCircle,
  Award,
  ChevronRight,
  Sliders,
  FileQuestion,
  Lightbulb,
} from "lucide-react";

export function TodayStudySession({
  onNavigateToNotes,
  onNavigateToReview,
}: {
  onNavigateToNotes?: () => void;
  onNavigateToReview?: () => void;
}) {
  const {
    todayPlan,
    updateSubjectPlan,
    toggleSubjectComplete,
    addStudySession,
    awardXp,
  } = useForestStore();

  const [selectedSubject, setSelectedSubject] = useState<SubjectId>("criminal_law");
  const [currentPhase, setCurrentPhase] = useState<1 | 2 | 3 | 4>(1);

  // Timer state
  const [timerRunning, setTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Phase completion states
  const [phaseDone, setPhaseDone] = useState<{
    skim: boolean;
    input: boolean;
    output: boolean;
    feedback: boolean;
  }>({
    skim: false,
    input: false,
    output: false,
    feedback: false,
  });

  // Checklist items
  const [skimChecks, setSkimChecks] = useState<string[]>([]);
  const [inputChecks, setInputChecks] = useState<string[]>([]);
  const [outputChecks, setOutputChecks] = useState<string[]>([]);

  // Feedback form state
  const [attemptedCount, setAttemptedCount] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [confusingConceptText, setConfusingConceptText] = useState("");
  const [studyNotes, setStudyNotes] = useState("");

  // Custom Ratio
  const [showRatioSettings, setShowRatioSettings] = useState(false);
  const [ratios, setRatios] = useState({
    skim: 5,
    input: 25,
    output: 50,
    feedback: 20,
  });

  const subjectInfo = SUBJECTS[selectedSubject];
  const subjectPlan = todayPlan.subjects[selectedSubject];
  const topics = POLICE_TOPICS[selectedSubject];

  // Timer tick
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning]);

  const toggleTimer = () => {
    setTimerRunning(!timerRunning);
    soundManager.playClick();
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setSeconds(0);
    soundManager.playClick();
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(mins).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const toggleCheck = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
      soundManager.playPop();
    }
  };

  const handleCompleteSession = () => {
    if (seconds <= 0) { alert("공부 타이머를 먼저 시작해 주세요."); return; }
    if (correctCount > attemptedCount || correctCount < 0 || attemptedCount < 0) { alert("풀이 수와 정답 수를 확인해 주세요."); return; }
    const durationMinutes = Math.max(1, Math.round(seconds / 60));
    const today = getTodayDateString();

    const session: StudySession = {
      id: `sess-${Date.now()}`,
      date: today,
      subjectId: selectedSubject,
      startTime: new Date(Date.now() - seconds * 1000).toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      endTime: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      durationMinutes,
      phases: {
        skimCompleted: phaseDone.skim,
        inputCompleted: phaseDone.input,
        outputCompleted: phaseDone.output,
        feedbackCompleted: true,
        skimMinutes: Math.round(durationMinutes * (ratios.skim / 100)),
        inputMinutes: Math.round(durationMinutes * (ratios.input / 100)),
        outputMinutes: Math.round(durationMinutes * (ratios.output / 100)),
        feedbackMinutes: Math.round(durationMinutes * (ratios.feedback / 100)),
      },
      attemptedQuestions: attemptedCount,
      correctQuestions: correctCount,
      confusingConcepts: confusingConceptText ? [confusingConceptText] : [],
      notes: studyNotes,
    };

    addStudySession(session);
    updateSubjectPlan(selectedSubject, {
      actualMinutes: (subjectPlan.actualMinutes || 0) + durationMinutes,
      completed: true,
    });
    setSeconds(0);
    setAttemptedCount(0);
    setCorrectCount(0);

    // Play victory sound
    soundManager.playLevelUp();
    setTimerRunning(false);
  };

  return (
    <div className="space-y-6">
      {/* Subject Selector Tabs */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        {(["criminal_law", "police_studies", "constitution"] as SubjectId[]).map((subId) => {
          const sub = SUBJECTS[subId];
          const isSelected = selectedSubject === subId;
          const plan = todayPlan.subjects[subId];

          return (
            <button
              key={subId}
              onClick={() => {
                if (subId !== selectedSubject && seconds > 0) { alert("현재 공부를 저장하거나 타이머를 초기화한 뒤 과목을 변경해 주세요."); return; }
                setSelectedSubject(subId);
                soundManager.playClick();
              }}
              className={`p-3 sm:p-4 rounded-3xl border transition-all text-left flex items-center justify-between btn-bubbly ${
                isSelected
                  ? "bg-white border-forest-pink shadow-cute ring-2 ring-forest-pink/30"
                  : "bg-white/60 border-forest-border hover:bg-white text-forest-text-muted"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <AnimalAvatar subjectId={subId} size="md" mood={plan.completed ? "proud" : "reading"} />
                <div>
                  <div className="font-black text-sm sm:text-base text-forest-text">
                    {sub.nameKr}
                  </div>
                  <div className="text-[10px] text-forest-text-muted hidden sm:block">
                    {sub.buildingName}
                  </div>
                </div>
              </div>

              {plan.completed && (
                <span className="p-1 rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Study Station Card */}
      <div className="bg-white rounded-3xl border border-forest-border p-5 sm:p-7 shadow-soft space-y-6">
        {/* Header: Title + Timer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-forest-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-forest-pink/20 text-forest-pink-dark">
                {subjectInfo.nameKr} 집중 세션
              </span>
              <span className="text-xs text-forest-text-muted">
                아웃풋 중심(50%) 집중 학습
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-forest-text">
              {subjectPlan.scope || "오늘 학습 범위 미설정 (자유 학습)"}
            </h2>
          </div>

          {/* Stopwatch widget */}
          <div className="flex items-center gap-3 bg-forest-warm/60 border border-forest-border px-4 py-2 rounded-2xl shadow-inner self-start sm:self-auto">
            <Clock className="w-5 h-5 text-forest-pink-dark" />
            <div className="text-2xl font-mono font-black text-forest-text min-w-[70px]">
              {formatTimer(seconds)}
            </div>
            <div className="flex items-center gap-1 border-l border-forest-border/80 pl-2">
              <button
                onClick={toggleTimer}
                className={`p-2 rounded-xl transition-all btn-bubbly ${
                  timerRunning
                    ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                    : "bg-forest-pink text-white hover:bg-forest-pink-dark shadow-sm"
                }`}
                title={timerRunning ? "일시정지" : "시작"}
              >
                {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>
              <button
                onClick={resetTimer}
                className="p-2 rounded-xl text-forest-text-muted hover:bg-white transition-colors"
                title="리셋"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 4-Phase Progress Indicator Tabs */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-3 bg-forest-warm/40 p-1.5 rounded-2xl border border-forest-border">
          {[
            { step: 1, name: "훑어보기", ratio: ratios.skim, key: "skim" },
            { step: 2, name: "인풋", ratio: ratios.input, key: "input" },
            { step: 3, name: "아웃풋", ratio: ratios.output, key: "output", highlight: true },
            { step: 4, name: "피드백", ratio: ratios.feedback, key: "feedback" },
          ].map((item) => {
            const isActive = currentPhase === item.step;
            const isDone = phaseDone[item.key as keyof typeof phaseDone];

            return (
              <button
                key={item.step}
                onClick={() => {
                  setCurrentPhase(item.step as any);
                  soundManager.playClick();
                }}
                className={`py-2 px-2 sm:px-3 rounded-xl text-center transition-all ${
                  isActive
                    ? "bg-white text-forest-pink-dark font-black shadow-sm border border-forest-pink/40"
                    : isDone
                    ? "text-emerald-700 font-bold bg-emerald-50/50"
                    : "text-forest-text-muted hover:text-forest-text"
                }`}
              >
                <div className="text-[10px] sm:text-xs flex items-center justify-center gap-1">
                  <span>{item.step}단계</span>
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                </div>
                <div className="text-xs sm:text-sm leading-tight mt-0.5">{item.name}</div>
                <div className="text-[9px] sm:text-[10px] text-forest-text-muted mt-0.5">
                  {item.ratio}%
                </div>
              </button>
            );
          })}
        </div>

        {/* PHASE 1: 훑어보기 (5%) */}
        {currentPhase === 1 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-forest-warm/30 rounded-2xl p-4 border border-forest-border space-y-2">
              <div className="flex items-center gap-2 text-forest-pink-dark font-bold text-sm">
                <Lightbulb className="w-4 h-4" />
                <span>1단계 훑어보기 원칙 (권장 5%)</span>
              </div>
              <p className="text-xs text-forest-text-muted leading-relaxed">
                공부 시작 전 3~5분 동안 목차와 오늘 배울 핵심 키워드를 눈으로 훑어보고, 기존에 틀렸던
                단원인지 미리 의식의 안테나를 켭니다. 완벽하게 외우려 하지 말고 지도를 먼저 확인하세요!
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                "오늘 공부할 단원의 대목차 및 소목차 눈으로 스캔하기",
                "이전에 틀렸던 빈출 판례 또는 조문 키워드 가볍게 상기하기",
                "책을 덮고 오늘 단원에 대해 이미 알고 있는 키워드 3개 떠올리기",
              ].map((item, i) => {
                const checked = skimChecks.includes(item);
                return (
                  <label
                    key={i}
                    onClick={() => toggleCheck(skimChecks, setSkimChecks, item)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      checked
                        ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                        : "bg-white border-forest-border hover:bg-forest-warm/30 text-forest-text"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      readOnly
                      className="w-4 h-4 accent-forest-pink rounded"
                    />
                    <span className="text-xs sm:text-sm font-medium">{item}</span>
                  </label>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setPhaseDone({ ...phaseDone, skim: true });
                  setCurrentPhase(2);
                  soundManager.playPop();
                }}
                className="px-4 py-2 rounded-2xl bg-forest-pink text-forest-text font-bold text-xs hover:bg-forest-pink-dark hover:text-white transition-all flex items-center gap-1 shadow-soft btn-bubbly"
              >
                <span>훑어보기 완료 → 2단계 인풋으로</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* PHASE 2: 인풋 (25%) */}
        {currentPhase === 2 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-forest-warm/30 rounded-2xl p-4 border border-forest-border space-y-2">
              <div className="flex items-center gap-2 text-forest-pink-dark font-bold text-sm">
                <BookOpen className="w-4 h-4" />
                <span>2단계 인풋 원칙 (권장 25%)</span>
              </div>
              <p className="text-xs text-forest-text-muted leading-relaxed">
                강의를 들을 때 수동적으로 흘려듣지 말고, 핵심 판례의 결론(유죄/무죄, 적법/위법)과
                조문의 필수 요건을 의식하며 빠르게 기본서를 읽습니다. 인풋에 너무 많은 시간을 쓰지
                않도록 주의하세요!
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                "강의 수강 및 기본서 핵심 판례 확인",
                "법률 조문의 단서 조항 및 요건('할 수 있다' vs '하여야 한다') 밑줄",
                "이해가 부족한 어려운 개념 손필기 노트에 키워드 메모",
              ].map((item, i) => {
                const checked = inputChecks.includes(item);
                return (
                  <label
                    key={i}
                    onClick={() => toggleCheck(inputChecks, setInputChecks, item)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      checked
                        ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                        : "bg-white border-forest-border hover:bg-forest-warm/30 text-forest-text"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      readOnly
                      className="w-4 h-4 accent-forest-pink rounded"
                    />
                    <span className="text-xs sm:text-sm font-medium">{item}</span>
                  </label>
                );
              })}
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={() => setCurrentPhase(1)}
                className="px-3 py-2 rounded-2xl text-xs text-forest-text-muted hover:bg-forest-warm"
              >
                이전 단계
              </button>
              <button
                onClick={() => {
                  setPhaseDone({ ...phaseDone, input: true });
                  setCurrentPhase(3);
                  soundManager.playPop();
                }}
                className="px-4 py-2 rounded-2xl bg-forest-pink text-forest-text font-bold text-xs hover:bg-forest-pink-dark hover:text-white transition-all flex items-center gap-1 shadow-soft btn-bubbly"
              >
                <span>인풋 완료 → 3단계 아웃풋(핵심!)으로</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* PHASE 3: 아웃풋 (50% - 핵심 최우선) */}
        {currentPhase === 3 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-forest-pink/20 rounded-2xl p-4 border border-forest-pink/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-forest-pink-dark font-black text-sm">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>3단계 아웃풋 (최우선 50%!)</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-forest-pink text-white font-bold">
                  합격의 열쇠
                </span>
              </div>
              <p className="text-xs text-forest-text leading-relaxed">
                단순 암기보다 스스로 꺼내보는 능력이 점수를 만듭니다. 기출문제를 실전처럼 풀고,
                틀린 지문은 백지 복습 또는 자신의 언어로 설명해 보세요!
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                "단원별 기출문제 15~25문항 실전 풀이",
                "OX 지문 판별 및 오답 선지 바로잡기",
                "백지 복습 캔버스에 방금 배운 개념 구조도 그려보기",
                "과거 오답 보관소에 등록했던 문제 재풀이",
              ].map((item, i) => {
                const checked = outputChecks.includes(item);
                return (
                  <label
                    key={i}
                    onClick={() => toggleCheck(outputChecks, setOutputChecks, item)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      checked
                        ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                        : "bg-white border-forest-border hover:bg-forest-warm/30 text-forest-text"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      readOnly
                      className="w-4 h-4 accent-forest-pink rounded"
                    />
                    <span className="text-xs sm:text-sm font-medium">{item}</span>
                  </label>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {onNavigateToNotes && (
                <button
                  onClick={onNavigateToNotes}
                  className="px-3 py-1.5 rounded-2xl bg-forest-warm border border-forest-border text-xs font-bold text-forest-text hover:bg-white flex items-center gap-1.5"
                >
                  <span>백지 복습 손필기 열기 📝</span>
                </button>
              )}
              {onNavigateToReview && (
                <button
                  onClick={onNavigateToReview}
                  className="px-3 py-1.5 rounded-2xl bg-forest-warm border border-forest-border text-xs font-bold text-forest-text hover:bg-white flex items-center gap-1.5"
                >
                  <span>과거 오답 재풀이 가기 🔄</span>
                </button>
              )}
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={() => setCurrentPhase(2)}
                className="px-3 py-2 rounded-2xl text-xs text-forest-text-muted hover:bg-forest-warm"
              >
                이전 단계
              </button>
              <button
                onClick={() => {
                  setPhaseDone({ ...phaseDone, output: true });
                  setCurrentPhase(4);
                  soundManager.playPop();
                }}
                className="px-4 py-2 rounded-2xl bg-forest-pink text-forest-text font-bold text-xs hover:bg-forest-pink-dark hover:text-white transition-all flex items-center gap-1 shadow-soft btn-bubbly"
              >
                <span>아웃풋 완료 → 4단계 피드백 정리</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* PHASE 4: 피드백 (20%) */}
        {currentPhase === 4 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-forest-warm/30 rounded-2xl p-4 border border-forest-border space-y-2">
              <div className="flex items-center gap-2 text-forest-pink-dark font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>4단계 피드백 & 점검 (권장 20%)</span>
              </div>
              <p className="text-xs text-forest-text-muted leading-relaxed">
                푼 문제 수와 정답 수를 간단히 기록하고, 헷갈렸던 개념은 오답 보관소나 내일의 복습
                일정에 등록합니다. 모든 필드를 반드시 채우지 않아도 완료할 수 있어요!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-forest-warm/20 p-3.5 rounded-2xl border border-forest-border space-y-3">
                <div className="font-bold text-forest-text">기출 풀이 문항 정산</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-forest-text-muted mb-1">푼 문제 수</label>
                    <input
                      type="number"
                      value={attemptedCount}
                      onChange={(e) => setAttemptedCount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-forest-border font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-forest-text-muted mb-1">맞힌 문제 수</label>
                    <input
                      type="number"
                      value={correctCount}
                      onChange={(e) => setCorrectCount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-forest-border font-bold text-emerald-600"
                    />
                  </div>
                </div>
                <div className="text-[11px] text-forest-text-muted">
                  정답률:{" "}
                  <strong className="text-forest-pink-dark">
                    {attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0}%
                  </strong>
                </div>
              </div>

              <div className="bg-forest-warm/20 p-3.5 rounded-2xl border border-forest-border space-y-3">
                <label className="block font-bold text-forest-text">헷갈린 핵심 개념 및 판례 메모</label>
                <textarea
                  value={confusingConceptText}
                  onChange={(e) => setConfusingConceptText(e.target.value)}
                  placeholder="예: 정당방위 상당성 기준, 경직법 6시간 한계 규정 등"
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-white border border-forest-border text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-forest-border">
              <button
                onClick={() => setCurrentPhase(3)}
                className="px-3 py-2 rounded-2xl text-xs text-forest-text-muted hover:bg-forest-warm"
              >
                이전 단계
              </button>

              <button
                onClick={handleCompleteSession}
                className="px-6 py-2.5 rounded-2xl bg-forest-pink-dark text-white font-black text-sm hover:opacity-90 transition-all flex items-center gap-2 shadow-cute btn-bubbly"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>오늘의 공부 완료 및 경험치 획득 (+10 XP)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
