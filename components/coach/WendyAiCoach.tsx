"use client";

import React, { useState } from "react";
import { useForestStore } from "@/lib/store";
import { SUBJECTS, POLICE_TOPICS } from "@/lib/constants";
import { SubjectId, AiCoachMessage } from "@/lib/types";
import { soundManager } from "@/lib/sounds";
import {
  Bot,
  Sparkles,
  HelpCircle,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileQuestion,
  ChevronRight,
  Send,
  Loader2,
  ShieldCheck,
  Calendar,
} from "lucide-react";

export function WendyAiCoach() {
  const {
    settings,
    todayPlan,
    schedules,
    sessions,
    reviewItems,
    aiMessages,
    addAiMessage,
  } = useForestStore();

  const [activeTab, setActiveTab] = useState<
    "pre_study" | "concept_explain" | "question_gen" | "day_finish"
  >("pre_study");

  // Form states
  const [condition, setCondition] = useState<"best" | "normal" | "tired">("normal");
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>("criminal_law");
  const [conceptQuery, setConceptQuery] = useState("");
  const [questionType, setQuestionType] = useState<"OX" | "four_choice">("four_choice");

  // Loading & Result state
  const [loading, setLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<{
    title: string;
    text: string;
    disclaimer: string;
    isAiGenerated: boolean;
  } | null>(null);

  const requestAiCoach = async (action: string, customPayload: any = {}) => {
    setLoading(true);
    soundManager.playPop();

    try {
      const res = await fetch("/api/ai/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          payload: {
            userName: settings.userName,
            schedules,
            targetMinutes: todayPlan.totalTargetMinutes,
            actualMinutes: Object.values(todayPlan.subjects).reduce(
              (a, c) => a + (c.actualMinutes || 0),
              0
            ),
            condition,
            subject: selectedSubject,
            concept: conceptQuery || "정당방위와 긴급피난",
            type: questionType,
            ...customPayload,
          },
        }),
      });

      const data = await res.json();
      if (data.text) {
        const titleMap: Record<string, string> = {
          pre_study: "웬디쌤의 공부 시작 전 최적 처방전 🌸",
          day_finish: "웬디쌤의 오늘 하루 객관적 정산 피드백 📋",
          concept_explain: `웬디쌤의 법률 개념 해설: ${conceptQuery || "핵심 개념"} 🔍`,
          question_gen: `웬디쌤의 AI 모의 훈련 문제 (${SUBJECTS[selectedSubject].nameKr}) 📝`,
        };

        const resultObj = {
          title: titleMap[action] || "웬디쌤 학습 코칭",
          text: data.text,
          disclaimer: data.disclaimer,
          isAiGenerated: true,
        };

        setCurrentResult(resultObj);

        // Store into history
        addAiMessage({
          type: action as any,
          title: resultObj.title,
          content: data.text,
          disclaimer: data.disclaimer,
          relatedSubject: selectedSubject,
        });

        soundManager.playLevelUp();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-forest-pink/30 via-forest-lavender/30 to-forest-cream/40 rounded-3xl p-6 border border-forest-border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-white border border-forest-border flex items-center justify-center text-3xl shadow-cute animate-float shrink-0">
            🦉
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-forest-text">웬디쌤 AI 코치</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                순경 전문 AI 어드바이저
              </span>
            </div>
            <p className="text-xs text-forest-text-muted mt-1 leading-relaxed">
              무조건적인 칭찬보다는 객관적인 데이터 분석과 조문·판례 기반의 현실적인 개선 방향을
              제시합니다.
            </p>
          </div>
        </div>

        {/* Legal Disclaimer Pill */}
        <div className="bg-white/90 backdrop-blur-sm border border-forest-border p-3 rounded-2xl shadow-soft text-left shrink-0 max-w-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-forest-text">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>법률 정보 안전 원칙 적용</span>
          </div>
          <p className="text-[10px] text-forest-text-muted mt-0.5">
            판례 번호 및 법령 조문을 엄격히 인용하며, AI 생성 문제는 실제 기출 정답률 통계와 별도로
            분리 집계됩니다.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white p-2 rounded-2xl border border-forest-border shadow-soft text-xs">
        {[
          { id: "pre_study", label: "공부 시작 전 처방", icon: Lightbulb },
          { id: "concept_explain", label: "개념 돋보기 & 비교", icon: BookOpen },
          { id: "question_gen", label: "AI 훈련 문제 생성", icon: FileQuestion },
          { id: "day_finish", label: "하루 마무리 정산", icon: CheckCircle2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                soundManager.playClick();
              }}
              className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                isSelected
                  ? "bg-forest-pink/30 text-forest-pink-dark border border-forest-pink/50 shadow-sm"
                  : "text-forest-text-muted hover:bg-forest-warm"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PRE-STUDY CHECK */}
      {activeTab === "pre_study" && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-forest-border shadow-soft space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-forest-text">
              오늘의 컨디션 및 최우선 과제 추천
            </h3>
            <p className="text-xs text-forest-text-muted">
              등록된 대학교/알바 고정 일정과 현재 수험생 컨디션을 고려해 오늘의 아웃풋 분량을
              제안해 드립니다.
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-forest-text-muted">
              오늘 내 몸과 마음의 컨디션
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "best", label: "최상 (몰입 가능)", icon: "🔥", desc: "180분+ 아웃풋 올인" },
                { id: "normal", label: "보통 (평상시)", icon: "🌱", desc: "180분 정석 균형 학습" },
                { id: "tired", label: "지침/바쁨 (최소)", icon: "🌙", desc: "바쁜 날 60분 집중" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCondition(c.id as any)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    condition === c.id
                      ? "bg-forest-pink/20 border-forest-pink text-forest-pink-dark font-bold shadow-sm"
                      : "bg-forest-warm/30 border-forest-border text-forest-text hover:bg-forest-warm"
                  }`}
                >
                  <div className="text-xl">{c.icon}</div>
                  <div className="text-xs font-bold mt-1">{c.label}</div>
                  <div className="text-[10px] text-forest-text-muted mt-0.5">{c.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => requestAiCoach("pre_study")}
              disabled={loading}
              className="px-6 py-2.5 rounded-2xl bg-forest-pink-dark text-white font-black text-xs hover:opacity-90 shadow-cute transition-all flex items-center gap-2 btn-bubbly"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>오늘의 최우선 처방전 받기</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: CONCEPT EXPLAINER & COMPARISON */}
      {activeTab === "concept_explain" && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-forest-border shadow-soft space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-forest-text">법률 개념 돋보기 & 유사 개념 비교</h3>
            <p className="text-xs text-forest-text-muted">
              판례 결론이나 조문 요건이 헷갈리는 경찰시험 개념을 입력하면 핵심 차이점과 함정 선지를
              분석합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-bold text-forest-text-muted mb-1">과목</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-forest-warm/40 border border-forest-border focus:outline-none"
              >
                <option value="criminal_law">형사법</option>
                <option value="police_studies">경찰학</option>
                <option value="constitution">헌법</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-forest-text-muted mb-1">
                궁금하거나 헷갈리는 개념
              </label>
              <input
                type="text"
                value={conceptQuery}
                onChange={(e) => setConceptQuery(e.target.value)}
                placeholder="예: 정당방위와 긴급피난의 보충성 차이, 경직법 6시간 한계 등"
                className="w-full px-3 py-2 rounded-xl bg-forest-warm/40 border border-forest-border focus:outline-none font-medium"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => requestAiCoach("concept_explain")}
              disabled={loading}
              className="px-6 py-2.5 rounded-2xl bg-forest-pink-dark text-white font-black text-xs hover:opacity-90 shadow-cute transition-all flex items-center gap-2 btn-bubbly"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>개념 명쾌 분석 요청</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: QUESTION GENERATOR */}
      {activeTab === "question_gen" && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-forest-border shadow-soft space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-forest-text">
                AI 모의 훈련 문제 생성
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                기출 통계와 분리 집계
              </span>
            </div>
            <p className="text-xs text-forest-text-muted">
              공부한 내용을 즉시 능동적으로 인출해 볼 수 있도록 경찰 기출 스타일에 부합하는 연습
              문항을 출제합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-forest-text-muted mb-1">과목 선택</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-forest-warm/40 border border-forest-border focus:outline-none"
              >
                <option value="criminal_law">형사법</option>
                <option value="police_studies">경찰학</option>
                <option value="constitution">헌법</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-forest-text-muted mb-1">문제 유형</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setQuestionType("four_choice")}
                  className={`flex-1 py-2 rounded-xl border text-xs font-bold ${
                    questionType === "four_choice"
                      ? "bg-forest-pink/30 border-forest-pink text-forest-pink-dark"
                      : "bg-forest-warm/40 border-forest-border text-forest-text"
                  }`}
                >
                  사지선다형 (실전 4지선다)
                </button>
                <button
                  type="button"
                  onClick={() => setQuestionType("OX")}
                  className={`flex-1 py-2 rounded-xl border text-xs font-bold ${
                    questionType === "OX"
                      ? "bg-forest-pink/30 border-forest-pink text-forest-pink-dark"
                      : "bg-forest-warm/40 border-forest-border text-forest-text"
                  }`}
                >
                  OX 지문형 (핵심 판별)
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => requestAiCoach("question_gen")}
              disabled={loading}
              className="px-6 py-2.5 rounded-2xl bg-forest-pink-dark text-white font-black text-xs hover:opacity-90 shadow-cute transition-all flex items-center gap-2 btn-bubbly"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>AI 모의 문제 1문항 생성</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: DAY FINISH REPORT */}
      {activeTab === "day_finish" && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-forest-border shadow-soft space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-forest-text">하루 마무리 객관적 정산</h3>
            <p className="text-xs text-forest-text-muted">
              오늘 실제 기록된 공부 시간, 오답 원인, 취약 개념을 대조하여 내일 아침 가장 먼저 복습해야
              할 포인트를 짚어줍니다.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-forest-warm/30 border border-forest-border text-xs space-y-2">
            <div className="flex justify-between text-forest-text">
              <span>오늘 기록된 총 공부 시간:</span>
              <strong>
                {Object.values(todayPlan.subjects).reduce((a, c) => a + (c.actualMinutes || 0), 0)}분
              </strong>
            </div>
            <div className="flex justify-between text-forest-text">
              <span>목표 공부 시간:</span>
              <strong>{todayPlan.totalTargetMinutes}분</strong>
            </div>
            <div className="flex justify-between text-forest-text">
              <span>완료된 과목 수:</span>
              <strong>
                {Object.values(todayPlan.subjects).filter((s) => s.completed).length} / 3과목
              </strong>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => requestAiCoach("day_finish")}
              disabled={loading}
              className="px-6 py-2.5 rounded-2xl bg-forest-pink-dark text-white font-black text-xs hover:opacity-90 shadow-cute transition-all flex items-center gap-2 btn-bubbly"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>오늘 하루 정산 리포트 생성 (+10 XP)</span>
            </button>
          </div>
        </div>
      )}

      {/* RESULT DISPLAY CARD */}
      {currentResult && (
        <div className="bg-white rounded-3xl border border-forest-pink/40 p-6 shadow-soft space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-forest-border">
            <div className="flex items-center gap-2">
              <span className="text-xl">🦉</span>
              <h3 className="font-black text-base text-forest-text">{currentResult.title}</h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-forest-pink/20 text-forest-pink-dark font-bold">
              AI Coach
            </span>
          </div>

          <div className="text-xs sm:text-sm text-forest-text leading-relaxed whitespace-pre-wrap font-sans bg-forest-warm/20 p-4 rounded-2xl border border-forest-border/60">
            {currentResult.text}
          </div>

          {currentResult.disclaimer && (
            <div className="text-[11px] text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200 leading-relaxed">
              {currentResult.disclaimer}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
