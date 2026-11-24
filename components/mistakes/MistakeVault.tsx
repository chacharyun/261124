"use client";

import React, { useState, useRef } from "react";
import { useForestStore } from "@/lib/store";
import { SUBJECTS, MISTAKE_CAUSES, UNDERSTANDING_LEVELS, POLICE_TOPICS } from "@/lib/constants";
import { SubjectId, MistakeCause, UnderstandingLevel, ReviewItem } from "@/lib/types";
import { AnimalAvatar } from "../village/AnimalAvatar";
import { soundManager } from "@/lib/sounds";
import {
  Camera,
  Upload,
  Plus,
  Trash2,
  RotateCw,
  Crop,
  CheckCircle2,
  Filter,
  Search,
  BookOpen,
  Eye,
  Calendar,
  Sparkles,
  X,
  FileText,
} from "lucide-react";

export function MistakeVault({
  isModalOpen,
  onCloseModal,
}: {
  isModalOpen?: boolean;
  onCloseModal?: () => void;
}) {
  const { reviewItems, addReviewItem, deleteReviewItem } = useForestStore();

  const [showAddForm, setShowAddForm] = useState(isModalOpen || false);
  const [activeRegType, setActiveRegType] = useState<"fast_text" | "photo_paper" | "screenshot">("fast_text");

  // Form State
  const [subject, setSubject] = useState<SubjectId>("criminal_law");
  const [topic, setTopic] = useState("");
  const [textbookName, setTextbookName] = useState("2026 경찰 핵심 기출");
  const [problemNumber, setProblemNumber] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [causeTags, setCauseTags] = useState<MistakeCause[]>(["concept_lack"]);
  const [understanding, setUnderstanding] = useState<UnderstandingLevel>("confused");
  const [memo, setMemo] = useState("");

  // Image states
  const [problemImgUrl, setProblemImgUrl] = useState<string | null>(null);
  const [solutionImgUrl, setSolutionImgUrl] = useState<string | null>(null);
  const [imgRotation, setImgRotation] = useState<number>(0);

  // Filter state for list
  const [filterSubject, setFilterSubject] = useState<SubjectId | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fileProblemRef = useRef<HTMLInputElement>(null);
  const fileSolutionRef = useRef<HTMLInputElement>(null);

  const availableTopics = POLICE_TOPICS[subject];

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "problem" | "solution"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (type === "problem") {
        setProblemImgUrl(dataUrl);
      } else {
        setSolutionImgUrl(dataUrl);
      }
      soundManager.playPop();
    };
    reader.readAsDataURL(file);
  };

  const rotateImage = () => {
    setImgRotation((prev) => (prev + 90) % 360);
    soundManager.playClick();
  };

  const toggleCauseTag = (tag: MistakeCause) => {
    if (causeTags.includes(tag)) {
      setCauseTags(causeTags.filter((t) => t !== tag));
    } else {
      setCauseTags([...causeTags, tag]);
    }
    soundManager.playPop();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemNumber.trim()) return;

    addReviewItem({
      subjectId: subject,
      topic: topic || availableTopics[0] || "전체 단원",
      textbookName: textbookName || "경찰 기출문제집",
      problemNumber: problemNumber.includes("번") ? problemNumber : `${problemNumber}번`,
      problemImageUrl: problemImgUrl || undefined,
      solutionImageUrl: solutionImgUrl || undefined,
      selectedAnswer: selectedAnswer || undefined,
      correctAnswer: correctAnswer || undefined,
      causeTags,
      understanding,
      memo: memo.trim() || undefined,
    });

    // Reset Form
    setProblemNumber("");
    setSelectedAnswer("");
    setCorrectAnswer("");
    setMemo("");
    setProblemImgUrl(null);
    setSolutionImgUrl(null);
    setShowAddForm(false);
    if (onCloseModal) onCloseModal();
  };

  const filteredItems = reviewItems.filter((item) => {
    if (filterSubject !== "all" && item.subjectId !== filterSubject) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTextbook = item.textbookName.toLowerCase().includes(q);
      const matchNum = item.problemNumber.toLowerCase().includes(q);
      const matchTopic = item.topic.toLowerCase().includes(q);
      const matchMemo = item.memo?.toLowerCase().includes(q);
      if (!matchTextbook && !matchNum && !matchTopic && !matchMemo) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-forest-border shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-forest-text">오답 보관소</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              10초 타이핑 최소화
            </span>
          </div>
          <p className="text-xs text-forest-text-muted mt-0.5">
            문제 전체를 칠 필요 없이, 사진 촬영이나 문제 번호만 톡! 찍어서 10초 만에 등록하세요.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 rounded-2xl bg-forest-pink text-forest-text font-bold text-xs hover:bg-forest-pink-dark hover:text-white transition-all flex items-center gap-1.5 shadow-soft btn-bubbly self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>새 오답 등록</span>
        </button>
      </div>

      {/* FAST REGISTRATION FORM (COLLAPSIBLE / MODAL) */}
      {showAddForm && (
        <div className="bg-white rounded-3xl border border-forest-pink/40 p-5 sm:p-7 shadow-cute animate-in fade-in duration-150 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-forest-border">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-forest-pink/30 flex items-center justify-center text-forest-pink-dark">
                📷
              </span>
              <span className="font-bold text-base text-forest-text">새 오답 간편 등록</span>
            </div>

            <button
              onClick={() => {
                setShowAddForm(false);
                if (onCloseModal) onCloseModal();
              }}
              className="p-1 rounded-full text-forest-text-muted hover:bg-forest-warm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Registration 3 Methods Tabs */}
          <div className="grid grid-cols-3 gap-2 bg-forest-warm/60 p-1 rounded-2xl border border-forest-border text-xs">
            <button
              type="button"
              onClick={() => setActiveRegType("fast_text")}
              className={`py-2 rounded-xl font-bold transition-all ${
                activeRegType === "fast_text"
                  ? "bg-white text-forest-pink-dark shadow-sm"
                  : "text-forest-text-muted hover:text-forest-text"
              }`}
            >
              ⚡ 5초 번호만 입력
            </button>
            <button
              type="button"
              onClick={() => setActiveRegType("photo_paper")}
              className={`py-2 rounded-xl font-bold transition-all ${
                activeRegType === "photo_paper"
                  ? "bg-white text-forest-pink-dark shadow-sm"
                  : "text-forest-text-muted hover:text-forest-text"
              }`}
            >
              📸 종이 문제집 촬영
            </button>
            <button
              type="button"
              onClick={() => setActiveRegType("screenshot")}
              className={`py-2 rounded-xl font-bold transition-all ${
                activeRegType === "screenshot"
                  ? "bg-white text-forest-pink-dark shadow-sm"
                  : "text-forest-text-muted hover:text-forest-text"
              }`}
            >
              🖼️ 전자 문제 스크린샷
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Subject Selector Buttons */}
            <div>
              <label className="block text-xs font-bold text-forest-text-muted mb-1.5">
                과목 선택 *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["criminal_law", "police_studies", "constitution"] as SubjectId[]).map((sId) => {
                  const isSelected = subject === sId;
                  return (
                    <button
                      key={sId}
                      type="button"
                      onClick={() => setSubject(sId)}
                      className={`p-2.5 rounded-2xl border text-center transition-all flex items-center justify-center gap-2 ${
                        isSelected
                          ? "bg-forest-pink/30 border-forest-pink text-forest-pink-dark font-black shadow-sm"
                          : "bg-forest-warm/30 border-forest-border text-forest-text"
                      }`}
                    >
                      <AnimalAvatar subjectId={sId} size="sm" />
                      <span className="text-xs">{SUBJECTS[sId].nameKr}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Core Identification: Textbook & Problem # */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-forest-text-muted mb-1">세부 단원</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-forest-warm/30 border border-forest-border focus:outline-none"
                >
                  {availableTopics.map((top, idx) => (
                    <option key={idx} value={top}>
                      {top}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-forest-text-muted mb-1">교재명</label>
                <input
                  type="text"
                  value={textbookName}
                  onChange={(e) => setTextbookName(e.target.value)}
                  placeholder="예: 형사법 기출 1000제"
                  className="w-full px-3 py-2 rounded-xl bg-forest-warm/30 border border-forest-border focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-forest-text-muted mb-1">문제 번호 *</label>
                <input
                  type="text"
                  required
                  value={problemNumber}
                  onChange={(e) => setProblemNumber(e.target.value)}
                  placeholder="예: 142번"
                  className="w-full px-3 py-2 rounded-xl bg-forest-warm/30 border border-forest-border focus:outline-none font-bold"
                />
              </div>
            </div>

            {/* Photo / Screenshot Upload & Canvas Tools (If photo/screenshot mode) */}
            {activeRegType !== "fast_text" && (
              <div className="p-4 rounded-2xl bg-forest-warm/40 border border-forest-border space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Problem Image upload */}
                  <div>
                    <label className="block font-bold text-forest-text-muted mb-1">
                      문제 이미지 (선택)
                    </label>
                    <input
                      type="file"
                      ref={fileProblemRef}
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "problem")}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileProblemRef.current?.click()}
                      className="w-full py-3 px-3 rounded-xl border border-dashed border-forest-pink/70 bg-white hover:bg-forest-pink/10 text-forest-text font-medium flex items-center justify-center gap-2"
                    >
                      <Camera className="w-4 h-4 text-forest-pink-dark" />
                      <span>{problemImgUrl ? "문제 사진 변경" : "문제 사진 찍기/업로드"}</span>
                    </button>

                    {problemImgUrl && (
                      <div className="mt-2 relative rounded-xl overflow-hidden border border-forest-border bg-black/5 flex justify-center p-1">
                        <img
                          src={problemImgUrl}
                          alt="문제"
                          style={{ transform: `rotate(${imgRotation}deg)` }}
                          className="max-h-40 object-contain transition-transform"
                        />
                        <button
                          type="button"
                          onClick={rotateImage}
                          className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80"
                          title="90도 회전"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Solution Image upload (Saved separately) */}
                  <div>
                    <label className="block font-bold text-forest-text-muted mb-1">
                      해설 이미지 (복습 시 숨김 보관)
                    </label>
                    <input
                      type="file"
                      ref={fileSolutionRef}
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "solution")}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileSolutionRef.current?.click()}
                      className="w-full py-3 px-3 rounded-xl border border-dashed border-emerald-400/70 bg-white hover:bg-emerald-50 text-forest-text font-medium flex items-center justify-center gap-2"
                    >
                      <Upload className="w-4 h-4 text-emerald-600" />
                      <span>{solutionImgUrl ? "해설 사진 변경" : "해설 사진 찍기/업로드"}</span>
                    </button>

                    {solutionImgUrl && (
                      <div className="mt-2 relative rounded-xl overflow-hidden border border-forest-border bg-black/5 flex justify-center p-1">
                        <img
                          src={solutionImgUrl}
                          alt="해설"
                          className="max-h-40 object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Answer & Correct Answer (Optional) */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-forest-text-muted mb-1">
                  내가 선택한 답 (선택)
                </label>
                <div className="flex gap-1.5">
                  {["1", "2", "3", "4"].map((ans) => (
                    <button
                      key={ans}
                      type="button"
                      onClick={() => setSelectedAnswer(selectedAnswer === ans ? "" : ans)}
                      className={`flex-1 py-1.5 rounded-xl border font-bold text-xs ${
                        selectedAnswer === ans
                          ? "bg-rose-100 border-rose-300 text-rose-800"
                          : "bg-forest-warm/30 border-forest-border text-forest-text hover:bg-white"
                      }`}
                    >
                      {ans}번
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-forest-text-muted mb-1">
                  실제 정답 (선택)
                </label>
                <div className="flex gap-1.5">
                  {["1", "2", "3", "4"].map((ans) => (
                    <button
                      key={ans}
                      type="button"
                      onClick={() => setCorrectAnswer(correctAnswer === ans ? "" : ans)}
                      className={`flex-1 py-1.5 rounded-xl border font-bold text-xs ${
                        correctAnswer === ans
                          ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                          : "bg-forest-warm/30 border-forest-border text-forest-text hover:bg-white"
                      }`}
                    >
                      {ans}번
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 8 Mistake Cause Tags (Button toggle) */}
            <div>
              <label className="block text-xs font-bold text-forest-text-muted mb-1.5">
                오답 원인 태그 (원터치 선택)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(MISTAKE_CAUSES) as MistakeCause[]).map((tag) => {
                  const isChecked = causeTags.includes(tag);
                  const info = MISTAKE_CAUSES[tag];
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleCauseTag(tag)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1 transition-all ${
                        isChecked
                          ? "bg-forest-pink/40 border-forest-pink-dark text-forest-pink-dark shadow-sm"
                          : "bg-forest-warm/30 border-forest-border text-forest-text hover:bg-white"
                      }`}
                    >
                      <span>{info.icon}</span>
                      <span>{info.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Understanding Level */}
            <div>
              <label className="block text-xs font-bold text-forest-text-muted mb-1.5">
                현재 이해도 (간격 복습 주기 설정)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["none", "confused", "unsure", "mastered"] as UnderstandingLevel[]).map((lvl) => {
                  const info = UNDERSTANDING_LEVELS[lvl];
                  const isSelected = understanding === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setUnderstanding(lvl)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isSelected
                          ? "bg-forest-pink text-white border-forest-pink-dark shadow-sm font-bold"
                          : "bg-forest-warm/30 border-forest-border text-forest-text hover:bg-white"
                      }`}
                    >
                      <div className="text-base">{info.icon}</div>
                      <div className="text-xs mt-0.5">{info.label}</div>
                      <div className="text-[9px] opacity-75">{info.nextDays}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Short Memo */}
            <div>
              <label className="block text-xs font-bold text-forest-text-muted mb-1">
                오답 메모 (선택 사항)
              </label>
              <input
                type="text"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="예: 2020도11419 판결 정당방위 방위의사 결여 주의"
                className="w-full px-3 py-2 rounded-xl bg-forest-warm/30 border border-forest-border text-xs focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-forest-border">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  if (onCloseModal) onCloseModal();
                }}
                className="px-4 py-2 rounded-xl text-xs text-forest-text-muted hover:bg-forest-warm"
              >
                닫기
              </button>

              <button
                type="submit"
                className="px-6 py-2 rounded-2xl bg-forest-pink-dark text-white font-black text-xs hover:opacity-90 shadow-cute btn-bubbly"
              >
                오답 보관소에 저장하기
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-forest-border shadow-soft">
        {/* Subject filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "전체 과목" },
            { id: "criminal_law", label: "형사법" },
            { id: "police_studies", label: "경찰학" },
            { id: "constitution", label: "헌법" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterSubject(item.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                filterSubject === item.id
                  ? "bg-forest-pink/30 text-forest-pink-dark border border-forest-pink/50"
                  : "bg-forest-warm/50 text-forest-text-muted hover:text-forest-text"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-forest-text-muted absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="교재명, 문제 번호, 단원 검색..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-forest-warm/40 border border-forest-border text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* MISTAKES LIST / CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => {
          const sub = SUBJECTS[item.subjectId];
          const understandingInfo = UNDERSTANDING_LEVELS[item.understanding];

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 border border-forest-border shadow-soft hover:shadow-cute transition-all space-y-3 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AnimalAvatar subjectId={item.subjectId} size="sm" />
                    <div>
                      <span className="font-bold text-xs text-forest-text">{sub.nameKr}</span>
                      <span className="text-[11px] text-forest-text-muted ml-1.5">
                        {item.textbookName} · <strong>{item.problemNumber}</strong>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteReviewItem(item.id)}
                    className="p-1.5 rounded-xl text-forest-text-muted hover:bg-rose-50 hover:text-rose-500 transition-colors"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Topic & Cause Tags */}
                <div className="my-2 space-y-1.5">
                  <div className="text-xs font-semibold text-forest-text">{item.topic}</div>
                  <div className="flex flex-wrap gap-1">
                    {item.causeTags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-forest-cream text-forest-text font-medium flex items-center gap-1 border border-forest-border"
                      >
                        <span>{MISTAKE_CAUSES[tag]?.icon}</span>
                        <span>{MISTAKE_CAUSES[tag]?.label}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Image Thumbnails if present */}
                {(item.problemImageUrl || item.solutionImageUrl) && (
                  <div className="flex gap-2 my-2">
                    {item.problemImageUrl && (
                      <div className="w-20 h-20 rounded-xl overflow-hidden border border-forest-border bg-black/5 flex items-center justify-center">
                        <img
                          src={item.problemImageUrl}
                          alt="문제"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {item.solutionImageUrl && (
                      <div className="w-20 h-20 rounded-xl overflow-hidden border border-forest-border bg-black/5 flex items-center justify-center relative">
                        <img
                          src={item.solutionImageUrl}
                          alt="해설"
                          className="w-full h-full object-cover blur-[2px]"
                        />
                        <span className="absolute text-[9px] bg-black/60 text-white px-1 rounded">
                          해설 숨김
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Memo */}
                {item.memo && (
                  <p className="text-xs text-forest-text-muted bg-forest-warm/40 p-2.5 rounded-xl border border-forest-border/50 line-clamp-2">
                    {item.memo}
                  </p>
                )}
              </div>

              {/* Card Footer: Review status & Stage */}
              <div className="pt-2 border-t border-forest-border/60 flex items-center justify-between text-[11px] text-forest-text-muted">
                <div className="flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded-full font-bold ${understandingInfo.color}`}>
                    {understandingInfo.icon} {understandingInfo.label}
                  </span>
                  <span>누적 오답 {item.reviewCount}회</span>
                </div>

                <div className="flex items-center gap-1 text-forest-pink-dark font-bold">
                  <Calendar className="w-3 h-3" />
                  <span>복습일: {item.nextReviewDate}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
